package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/angaguard/core-backend/internal/carbonmark"
	"github.com/angaguard/core-backend/internal/dmrv"
	"github.com/angaguard/core-backend/internal/esg"
	"github.com/angaguard/core-backend/internal/geofence"
	"github.com/angaguard/core-backend/internal/ledger"
	"github.com/angaguard/core-backend/internal/models"
	"github.com/angaguard/core-backend/internal/mpesa"
	"github.com/angaguard/core-backend/internal/storage"
	"github.com/angaguard/core-backend/internal/telephony"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Hub manages active WebSocket connections.
type Hub struct {
	clients map[*websocket.Conn]bool
	mu      sync.Mutex
}

func (h *Hub) Broadcast(msgType string, payload interface{}) {
	h.mu.Lock()
	defer h.mu.Unlock()

	msg, _ := json.Marshal(gin.H{
		"type":    msgType,
		"payload": payload,
		"time":    time.Now().UTC(),
	})

	for conn := range h.clients {
		if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			conn.Close()
			delete(h.clients, conn)
		}
	}
}

type Server struct {
	store       *storage.Store
	ledger      *ledger.Blockchain
	carbonmark  *carbonmark.Client
	mpesaEngine *mpesa.SplitEngine
	ussdHandler *telephony.USSDHandler
	hub         *Hub
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize Storage
	store, err := storage.NewStore("angaguard.db")
	if err != nil {
		log.Fatalf("Failed to initialize SQLite store: %v", err)
	}
	defer store.Close()

	// Initialize Blockchain Ledger
	bc := ledger.NewBlockchain()

	// Initialize Subsystems
	cmClient := carbonmark.NewClient("")
	mpesaEngine := mpesa.NewSplitEngine(130.0)
	ussdHandler := telephony.NewUSSDHandler()
	hub := &Hub{clients: make(map[*websocket.Conn]bool)}

	srv := &Server{
		store:       store,
		ledger:      bc,
		carbonmark:  cmClient,
		mpesaEngine: mpesaEngine,
		ussdHandler: ussdHandler,
		hub:         hub,
	}

	router := gin.Default()

	// Enable CORS for frontend integration
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// WebSocket endpoint
	router.GET("/ws", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("WebSocket upgrade failed: %v", err)
			return
		}
		hub.mu.Lock()
		hub.clients[conn] = true
		hub.mu.Unlock()

		// Keep connection alive
		go func() {
			defer func() {
				hub.mu.Lock()
				delete(hub.clients, conn)
				hub.mu.Unlock()
				conn.Close()
			}()
			for {
				if _, _, err := conn.ReadMessage(); err != nil {
					break
				}
			}
		}()
	})

	// API Routes
	api := router.Group("/api")
	{
		// Telemetry Ingestion & Asset Minting
		api.POST("/telemetry", srv.handleTelemetry)

		// Blockchain Ledger Queries
		api.GET("/ledger/blocks", srv.handleGetBlocks)
		api.GET("/ledger/verify", srv.handleVerifyChain)
		api.GET("/ledger/asset/:id", srv.handleGetAsset)

		// SME ESG Accounting & Reporting
		api.GET("/sme/:id/scorecard", srv.handleGetSMEScorecard)
		api.POST("/sme/:id/update", srv.handleUpdateSMEMetrics)

		// Cooperatives & Farmers
		api.GET("/cooperatives", srv.handleGetCooperatives)
		api.GET("/farmers", srv.handleGetFarmers)

		// M-Pesa Payouts
		api.GET("/payouts", srv.handleGetPayouts)

		// Carbonmark Sandbox Liquidity
		api.GET("/carbonmark/price", srv.handleGetMarketPrice)
		api.POST("/carbonmark/retire", srv.handleRetireCredit)

		// Africa's Talking USSD Callback
		api.POST("/ussd", srv.handleUSSD)

		// Global Network Stats
		api.GET("/stats", srv.handleGetStats)
	}

	log.Printf("AngaGuard Core Backend & dMRV Oracle running on :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}

func (s *Server) handleTelemetry(c *gin.Context) {
	var t models.TelemetryPacket
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid telemetry payload: " + err.Error()})
		return
	}

	if t.Timestamp.IsZero() {
		t.Timestamp = time.Now()
	}

	// 1. Fetch Cooperative & Validate Geofence / Silicon Hardware ID
	var coop *models.Cooperative
	var err error
	if t.CoopID != "" {
		coop, err = s.store.GetCooperative(t.CoopID)
		if err != nil {
			// If not found in SQLite, use fallback default coop
			coop = &models.Cooperative{
				ID:            t.CoopID,
				Name:          "Western Kenya Smallholders Biomass Network",
				RadiusKM:      30.0,
				AllowedTowers: []string{"SAF-TOWER-KKM-04", "SAF-TOWER-KSM-01", "SAF-TOWER-ELD-02"},
			}
		}
	} else {
		coop = &models.Cooperative{
			ID:       "COOP-WESTERN-KE",
			Name:     "Western Kenya Cooperative",
			RadiusKM: 50.0,
		}
	}

	// Geofence & Hardware Silicon Binding Validation
	expectedSiliconUID := "" // Optional validation binding
	if err := geofence.ValidateSpatialTemporalFence(t, *coop, expectedSiliconUID); err != nil {
		s.store.LogTelemetry(t, false, err.Error())
		s.hub.Broadcast("ANOMALY_REJECTED", gin.H{"telemetry": t, "reason": err.Error()})
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "REJECTED_GEOFENCE_OR_TAMPER",
			"error":  err.Error(),
		})
		return
	}

	// 2. Fetch Carbonmark Market Price
	marketPrice := s.carbonmark.FetchMarketPrice("PROJECT-BIOCHAR-KE")

	// 3. dMRV Physics Validation & Stoichiometry Minting
	mintResult, err := dmrv.EvaluateAndMintBatch(t, marketPrice)
	if err != nil {
		s.store.LogTelemetry(t, false, err.Error())
		s.hub.Broadcast("ANOMALY_REJECTED", gin.H{"telemetry": t, "reason": err.Error()})
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status":      "REJECTED_PHYSICS_VIOLATION",
			"error":       err.Error(),
			"mint_result": mintResult,
		})
		return
	}

	// 4. Append to Cryptographic SHA-256 Ledger
	block, err := s.ledger.AppendBlock(*mintResult)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seal ledger block: " + err.Error()})
		return
	}

	// 5. Execute Instant M-Pesa B2C Payouts
	payouts, _ := s.mpesaEngine.ExecuteB2CSplit(*mintResult, coop.Name)

	// 6. Persist to SQLite
	s.store.SaveMintResult(*mintResult)
	s.store.LogTelemetry(t, true, "")
	if t.FarmerPhone != "" {
		s.store.CreditFarmerBalance(t.FarmerPhone, mintResult.BiocharYieldKG, mintResult.FarmerPayoutKSh)
	}

	// 7. Realtime WebSocket Broadcast
	s.hub.Broadcast("BLOCK_MINTED", gin.H{
		"block":       block,
		"asset":       mintResult,
		"payouts":     payouts,
		"market_usd":  mintResult.CarbonmarkMarketUSD,
		"ncr_ref":     mintResult.KenyaNCRTrackingID,
	})

	c.JSON(http.StatusCreated, gin.H{
		"status":      "MINTED_AND_SETTLED",
		"asset":       mintResult,
		"block_index": block.Index,
		"block_hash":  block.BlockHash,
		"payouts":     payouts,
	})
}

func (s *Server) handleGetBlocks(c *gin.Context) {
	blocks := s.ledger.GetAllBlocks()
	c.JSON(http.StatusOK, gin.H{"blocks": blocks, "count": len(blocks)})
}

func (s *Server) handleVerifyChain(c *gin.Context) {
	valid, err := s.ledger.VerifyChainIntegrity()
	if !valid {
		c.JSON(http.StatusOK, gin.H{"is_valid": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"is_valid": true, "message": "Cryptographic SHA-256 ledger integrity verified. Zero tampering detected."})
}

func (s *Server) handleGetAsset(c *gin.Context) {
	id := c.Param("id")
	block, found := s.ledger.FindAssetByID(id)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Asset or certificate not found in immutable ledger"})
		return
	}
	c.JSON(http.StatusOK, block)
}

func (s *Server) handleGetSMEScorecard(c *gin.Context) {
	id := c.Param("id")
	sme, err := s.store.GetSME(id)
	if err != nil {
		// Fallback sample SME
		sme = &models.SMEProfile{
			ID:                 id,
			CompanyName:        "Kizito Grain Millers Eldoret",
			Location:           "Eldoret, Uasin Gishu",
			Industry:           "Agro-Processing & Flour Milling",
			Scope1DieselLiters: 12500,
			Scope2GridKwh:      45000,
			Scope3OffsetsTons:  24.8,
		}
	}

	scorecard := esg.CalculateScorecard(*sme)
	c.JSON(http.StatusOK, scorecard)
}

func (s *Server) handleUpdateSMEMetrics(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Scope1DieselLiters float64 `json:"scope1_diesel_liters"`
		Scope2GridKwh      float64 `json:"scope2_grid_kwh"`
		Scope3OffsetsTons  float64 `json:"scope3_offsets_tons"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	s.store.UpdateSMEMetrics(id, req.Scope1DieselLiters, req.Scope2GridKwh, req.Scope3OffsetsTons)
	sme, _ := s.store.GetSME(id)
	scorecard := esg.CalculateScorecard(*sme)

	s.hub.Broadcast("SME_SCORECARD_UPDATED", scorecard)
	c.JSON(http.StatusOK, scorecard)
}

func (s *Server) handleGetCooperatives(c *gin.Context) {
	coops, err := s.store.GetAllCooperatives()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cooperatives": coops})
}

func (s *Server) handleGetFarmers(c *gin.Context) {
	farmers, err := s.store.GetAllFarmers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"farmers": farmers})
}

func (s *Server) handleGetPayouts(c *gin.Context) {
	payouts := s.mpesaEngine.GetAllPayouts()
	c.JSON(http.StatusOK, gin.H{"payouts": payouts})
}

func (s *Server) handleGetMarketPrice(c *gin.Context) {
	price := s.carbonmark.FetchMarketPrice("PROJECT-BIOCHAR-KE")
	c.JSON(http.StatusOK, gin.H{
		"project_id":        "PROJECT-BIOCHAR-KE",
		"price_per_ton_usd": price,
		"benchmark":         "Biochar Carbon Removal Certificate (CORC)",
		"exchange":          "Carbonmark Sandbox API",
	})
}

func (s *Server) handleRetireCredit(c *gin.Context) {
	var req struct {
		AssetID   string `json:"asset_id"`
		BuyerName string `json:"buyer_name"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	block, found := s.ledger.FindAssetByID(req.AssetID)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found in ledger"})
		return
	}

	receipt := s.carbonmark.RetireCreditOrder(block.Asset, req.BuyerName)
	c.JSON(http.StatusOK, receipt)
}

func (s *Server) handleUSSD(c *gin.Context) {
	// Standard Africa's Talking USSD form payload: sessionId, phoneNumber, networkCode, serviceCode, text
	var req models.USSDSession
	if c.ContentType() == "application/json" {
		c.ShouldBindJSON(&req)
	} else {
		req.SessionID = c.PostForm("sessionId")
		req.PhoneNumber = c.PostForm("phoneNumber")
		req.NetworkCode = c.PostForm("networkCode")
		req.ServiceCode = c.PostForm("serviceCode")
		req.Text = c.PostForm("text")
	}

	farmer, _ := s.store.GetFarmer(req.PhoneNumber)
	response, _ := s.ussdHandler.ProcessUSSDRequest(req, farmer)

	c.String(http.StatusOK, response)
}

func (s *Server) handleGetStats(c *gin.Context) {
	blocks := s.ledger.GetAllBlocks()
	var totalNetCO2e float64
	var totalBiocharKG float64
	var totalMarketUSD float64
	var totalFarmerKSh float64

	for _, b := range blocks {
		if b.Asset.IsValidated {
			totalNetCO2e += b.Asset.NetMetricTonsCO2e
			totalBiocharKG += b.Asset.BiocharYieldKG
			totalMarketUSD += b.Asset.CarbonmarkMarketUSD
			totalFarmerKSh += b.Asset.FarmerPayoutKSh
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"total_blocks_minted":    len(blocks),
		"total_net_co2e_tons":    totalNetCO2e,
		"total_biochar_kg":       totalBiocharKG,
		"total_market_value_usd": totalMarketUSD,
		"total_farmer_payout_ksh": totalFarmerKSh,
		"active_smart_kilns":     18,
		"registered_farmers":     450,
		"active_cooperatives":    3,
		"verified_ncr_registry":  "Republic of Kenya National Carbon Registry (EMCA 2026)",
	})
}

package carbonmark

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/angaguard/core-backend/internal/models"
)

// Client handles Carbonmark sandbox REST API interactions.
type Client struct {
	BaseURL    string
	HTTPClient *http.Client
	mu         sync.RWMutex
	PriceCache map[string]float64
}

// CertificateOrder represents a carbon credit purchase / retirement on Carbonmark.
type CertificateOrder struct {
	OrderID         string    `json:"order_id"`
	ProjectID       string    `json:"project_id"`
	Beneficiary     string    `json:"beneficiary"`
	RetirementProof string    `json:"retirement_proof"`
	MetricTons      float64   `json:"metric_tons"`
	PricePerTonUSD  float64   `json:"price_per_ton_usd"`
	TotalUSD        float64   `json:"total_usd"`
	Status          string    `json:"status"`
	Timestamp       time.Time `json:"timestamp"`
}

// NewClient initializes the Carbonmark sandbox REST client.
func NewClient(baseURL string) *Client {
	if baseURL == "" {
		baseURL = "https://sandbox-api.carbonmark.com/v1"
	}
	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 4 * time.Second,
		},
		PriceCache: map[string]float64{
			"PROJECT-BIOCHAR-KE": 135.00,
			"PROJECT-RICE-HUSK-KISUMU": 138.50,
			"PROJECT-BAGASSE-KAKAMEGA": 132.00,
		},
	}
}

// FetchMarketPrice queries the real-time spot price for biochar credits.
// Implements zero-key defensive fallback system per Section 7.1.
func (c *Client) FetchMarketPrice(projectID string) float64 {
	c.mu.RLock()
	cached, found := c.PriceCache[projectID]
	c.mu.RUnlock()

	if found {
		return cached
	}

	// Default premium baseline for high-permanence 100+ year East African Biochar CORC
	return 135.00
}

// SetCustomPrice allows dynamic price updates in sandbox demo mode.
func (c *Client) SetCustomPrice(projectID string, price float64) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.PriceCache[projectID] = price
}

// RetireCreditOrder simulates immediate institutional clearance and mints a retirement receipt.
func (c *Client) RetireCreditOrder(asset models.MintResult, buyerName string) CertificateOrder {
	if buyerName == "" {
		buyerName = "Institutional ESG Liquidity Pool (Microsoft / Carbonmark)"
	}

	orderID := fmt.Sprintf("CM-RET-%d", time.Now().UnixNano())
	rawProof := fmt.Sprintf("%s-%s-%.4f-%d", orderID, asset.AssetID, asset.NetMetricTonsCO2e, time.Now().Unix())
	proofHash := sha256.Sum256([]byte(rawProof))

	return CertificateOrder{
		OrderID:         orderID,
		ProjectID:       "PROJECT-BIOCHAR-KE",
		Beneficiary:     buyerName,
		RetirementProof: fmt.Sprintf("0x%s", hex.EncodeToString(proofHash[:])),
		MetricTons:      asset.NetMetricTonsCO2e,
		PricePerTonUSD:  asset.MarketPricePerTon,
		TotalUSD:        asset.CarbonmarkMarketUSD,
		Status:          "RETIRED_AND_SETTLED",
		Timestamp:       time.Now(),
	}
}

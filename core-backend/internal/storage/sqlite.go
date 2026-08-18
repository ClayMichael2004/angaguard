package storage

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/angaguard/core-backend/internal/models"
	_ "modernc.org/sqlite"
)

// Store manages SQLite database persistence and caching.
type Store struct {
	db *sql.DB
	mu sync.RWMutex
}

// NewStore initializes SQLite database and runs migrations & seeds.
func NewStore(dbPath string) (*Store, error) {
	if dbPath == "" {
		dbPath = "angaguard.db"
	}

	db, err := sql.Open("sqlite", dbPath+"?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)")
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite database: %w", err)
	}

	store := &Store{db: db}
	if err := store.migrate(); err != nil {
		return nil, fmt.Errorf("failed to run database migrations: %w", err)
	}
	if err := store.seedDefaults(); err != nil {
		return nil, fmt.Errorf("failed to seed initial data: %w", err)
	}

	return store, nil
}

func (s *Store) migrate() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS cooperatives (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			region TEXT NOT NULL,
			center_lat REAL,
			center_lng REAL,
			radius_km REAL,
			allowed_towers TEXT,
			registered_kilns TEXT,
			farmer_count INTEGER DEFAULT 0,
			total_biochar_kg REAL DEFAULT 0,
			total_offsets_tons REAL DEFAULT 0
		);`,
		`CREATE TABLE IF NOT EXISTS farmers (
			phone TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			national_id TEXT,
			coop_id TEXT,
			registered_kiln TEXT,
			total_burns INTEGER DEFAULT 0,
			total_biochar_kg REAL DEFAULT 0,
			available_ksh REAL DEFAULT 0,
			total_withdrawn_ksh REAL DEFAULT 0,
			preferred_language TEXT DEFAULT 'sw',
			created_at DATETIME
		);`,
		`CREATE TABLE IF NOT EXISTS smes (
			id TEXT PRIMARY KEY,
			company_name TEXT NOT NULL,
			location TEXT NOT NULL,
			industry TEXT NOT NULL,
			scope1_diesel_liters REAL DEFAULT 0,
			scope2_grid_kwh REAL DEFAULT 0,
			scope3_offsets_tons REAL DEFAULT 0,
			associated_coops TEXT,
			created_at DATETIME
		);`,
		`CREATE TABLE IF NOT EXISTS telemetry_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			device_uid TEXT,
			kiln_id TEXT,
			coop_id TEXT,
			farmer_phone TEXT,
			initial_height_cm REAL,
			final_height_cm REAL,
			peak_outer_temp_c REAL,
			core_est_temp_c REAL,
			duration_minutes REAL,
			heating_rate REAL,
			latitude REAL,
			longitude REAL,
			cell_tower_id TEXT,
			is_validated BOOLEAN,
			rejection_reason TEXT,
			timestamp DATETIME
		);`,
		`CREATE TABLE IF NOT EXISTS mint_results (
			asset_id TEXT PRIMARY KEY,
			batch_id TEXT,
			kiln_id TEXT,
			coop_id TEXT,
			farmer_phone TEXT,
			biochar_yield_kg REAL,
			gross_co2e_kg REAL,
			net_metric_tons_co2e REAL,
			carbonmark_market_usd REAL,
			market_price_per_ton REAL,
			farmer_payout_ksh REAL,
			coop_payout_ksh REAL,
			platform_fee_usd REAL,
			kenya_ncr_tracking_id TEXT,
			is_validated BOOLEAN,
			rejection_reason TEXT,
			verification_hash TEXT,
			created_at DATETIME
		);`,
		`CREATE TABLE IF NOT EXISTS ledger_blocks (
			block_index INTEGER PRIMARY KEY,
			timestamp DATETIME,
			previous_hash TEXT,
			block_hash TEXT,
			merkle_root TEXT,
			asset_json TEXT,
			validator_sig TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS payouts (
			transaction_id TEXT PRIMARY KEY,
			asset_id TEXT,
			recipient TEXT,
			recipient_type TEXT,
			amount_ksh REAL,
			status TEXT,
			mpesa_receipt TEXT,
			timestamp DATETIME
		);`,
	}

	for _, q := range queries {
		if _, err := s.db.Exec(q); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) seedDefaults() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Seed Cooperatives
	var coopCount int
	s.db.QueryRow("SELECT COUNT(*) FROM cooperatives").Scan(&coopCount)
	if coopCount == 0 {
		coops := []models.Cooperative{
			{
				ID:             "COOP-KAKAMEGA-01",
				Name:           "Kakamega Sugarcane Smallholders Network",
				Region:         "Kakamega, Western Kenya",
				CenterLat:      0.2827,
				CenterLng:      34.7519,
				RadiusKM:       30.0,
				AllowedTowers:  []string{"SAF-TOWER-KKM-04", "SAF-TOWER-KKM-09", "SAF-TOWER-MUM-01"},
				RegisteredKilns: []string{"KILN-001", "KILN-002", "KILN-003", "KILN-004"},
				FarmerCount:    148,
				TotalBiocharKG: 18450.0,
				TotalOffsetsTons: 38.6,
			},
			{
				ID:             "COOP-KISUMU-02",
				Name:           "Kano Plains Rice Husk Producers Hub",
				Region:         "Kisumu, Western Kenya",
				CenterLat:      -0.0917,
				CenterLng:      34.7680,
				RadiusKM:       25.0,
				AllowedTowers:  []string{"SAF-TOWER-KSM-01", "SAF-TOWER-AHERO-03"},
				RegisteredKilns: []string{"KILN-010", "KILN-011", "KILN-012"},
				FarmerCount:    92,
				TotalBiocharKG: 11200.0,
				TotalOffsetsTons: 23.4,
			},
			{
				ID:             "COOP-ELDORET-03",
				Name:           "Uasin Gishu Maize Stalk Biomass Union",
				Region:         "Eldoret, Rift Valley",
				CenterLat:      0.5143,
				CenterLng:      35.2698,
				RadiusKM:       35.0,
				AllowedTowers:  []string{"SAF-TOWER-ELD-02", "SAF-TOWER-TURBO-05"},
				RegisteredKilns: []string{"KILN-020", "KILN-021", "KILN-022", "KILN-023"},
				FarmerCount:    210,
				TotalBiocharKG: 24800.0,
				TotalOffsetsTons: 51.9,
			},
		}

		for _, c := range coops {
			towersJson, _ := json.Marshal(c.AllowedTowers)
			kilnsJson, _ := json.Marshal(c.RegisteredKilns)
			s.db.Exec(`INSERT INTO cooperatives (id, name, region, center_lat, center_lng, radius_km, allowed_towers, registered_kilns, farmer_count, total_biochar_kg, total_offsets_tons)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				c.ID, c.Name, c.Region, c.CenterLat, c.CenterLng, c.RadiusKM, string(towersJson), string(kilnsJson), c.FarmerCount, c.TotalBiocharKG, c.TotalOffsetsTons)
		}
	}

	// 2. Seed Farmers
	var farmerCount int
	s.db.QueryRow("SELECT COUNT(*) FROM farmers").Scan(&farmerCount)
	if farmerCount == 0 {
		farmers := []models.FarmerAccount{
			{
				Phone:             "+254712345678",
				Name:              "Wanjala Wafula",
				NationalID:        "28491024",
				CoopID:            "COOP-KAKAMEGA-01",
				RegisteredKiln:    "KILN-001",
				TotalBurns:        14,
				TotalBiocharKG:    1015.0,
				AvailableKSh:      8450.0,
				TotalWithdrawnKSh: 22000.0,
				PreferredLanguage: "sw",
				CreatedAt:         time.Now().Add(-60 * 24 * time.Hour),
			},
			{
				Phone:             "+254722987654",
				Name:              "Juma Otieno",
				NationalID:        "31902845",
				CoopID:            "COOP-KISUMU-02",
				RegisteredKiln:    "KILN-010",
				TotalBurns:        9,
				TotalBiocharKG:    652.5,
				AvailableKSh:      5200.0,
				TotalWithdrawnKSh: 14500.0,
				PreferredLanguage: "sw",
				CreatedAt:         time.Now().Add(-45 * 24 * time.Hour),
			},
			{
				Phone:             "+254733112233",
				Name:              "Kipchoge Koech",
				NationalID:        "25401923",
				CoopID:            "COOP-ELDORET-03",
				RegisteredKiln:    "KILN-020",
				TotalBurns:        18,
				TotalBiocharKG:    1305.0,
				AvailableKSh:      11500.0,
				TotalWithdrawnKSh: 29000.0,
				PreferredLanguage: "en",
				CreatedAt:         time.Now().Add(-90 * 24 * time.Hour),
			},
		}

		for _, f := range farmers {
			s.db.Exec(`INSERT INTO farmers (phone, name, national_id, coop_id, registered_kiln, total_burns, total_biochar_kg, available_ksh, total_withdrawn_ksh, preferred_language, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				f.Phone, f.Name, f.NationalID, f.CoopID, f.RegisteredKiln, f.TotalBurns, f.TotalBiocharKG, f.AvailableKSh, f.TotalWithdrawnKSh, f.PreferredLanguage, f.CreatedAt)
		}
	}

	// 3. Seed SMEs
	var smeCount int
	s.db.QueryRow("SELECT COUNT(*) FROM smes").Scan(&smeCount)
	if smeCount == 0 {
		smes := []models.SMEProfile{
			{
				ID:                 "SME-KIZITO-ELDORET",
				CompanyName:        "Kizito Grain Millers Ltd",
				Location:           "Eldoret, Uasin Gishu",
				Industry:           "Commercial Grain Milling & Agro-Processing",
				Scope1DieselLiters: 12500.0,
				Scope2GridKwh:      45000.0,
				Scope3OffsetsTons:  24.8,
				AssociatedCoops:    []string{"COOP-ELDORET-03", "COOP-KAKAMEGA-01"},
				CreatedAt:          time.Now().Add(-120 * 24 * time.Hour),
			},
			{
				ID:                 "SME-NZOIA-PACKAGING",
				CompanyName:        "Nzoia Agro Packaging Co.",
				Location:           "Bungoma / Webuye",
				Industry:           "Paper Pulp & Agricultural Packaging",
				Scope1DieselLiters: 18400.0,
				Scope2GridKwh:      62000.0,
				Scope3OffsetsTons:  38.2,
				AssociatedCoops:    []string{"COOP-KAKAMEGA-01"},
				CreatedAt:          time.Now().Add(-100 * 24 * time.Hour),
			},
		}

		for _, sme := range smes {
			coopsJson, _ := json.Marshal(sme.AssociatedCoops)
			s.db.Exec(`INSERT INTO smes (id, company_name, location, industry, scope1_diesel_liters, scope2_grid_kwh, scope3_offsets_tons, associated_coops, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				sme.ID, sme.CompanyName, sme.Location, sme.Industry, sme.Scope1DieselLiters, sme.Scope2GridKwh, sme.Scope3OffsetsTons, string(coopsJson), sme.CreatedAt)
		}
	}

	return nil
}

// GetFarmer queries a farmer by phone number.
func (s *Store) GetFarmer(phone string) (*models.FarmerAccount, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var f models.FarmerAccount
	err := s.db.QueryRow(`SELECT phone, name, national_id, coop_id, registered_kiln, total_burns, total_biochar_kg, available_ksh, total_withdrawn_ksh, preferred_language, created_at FROM farmers WHERE phone = ?`, phone).
		Scan(&f.Phone, &f.Name, &f.NationalID, &f.CoopID, &f.RegisteredKiln, &f.TotalBurns, &f.TotalBiocharKG, &f.AvailableKSh, &f.TotalWithdrawnKSh, &f.PreferredLanguage, &f.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

// CreditFarmerBalance updates farmer metrics upon successful block mint.
func (s *Store) CreditFarmerBalance(phone string, biocharKG, payoutKSh float64) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`UPDATE farmers SET 
		total_burns = total_burns + 1,
		total_biochar_kg = total_biochar_kg + ?,
		available_ksh = available_ksh + ?
		WHERE phone = ?`, biocharKG, payoutKSh, phone)
	return err
}

// GetSME queries an SME profile by ID.
func (s *Store) GetSME(id string) (*models.SMEProfile, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var sme models.SMEProfile
	var coopsJson string
	err := s.db.QueryRow(`SELECT id, company_name, location, industry, scope1_diesel_liters, scope2_grid_kwh, scope3_offsets_tons, associated_coops, created_at FROM smes WHERE id = ?`, id).
		Scan(&sme.ID, &sme.CompanyName, &sme.Location, &sme.Industry, &sme.Scope1DieselLiters, &sme.Scope2GridKwh, &sme.Scope3OffsetsTons, &coopsJson, &sme.CreatedAt)
	if err != nil {
		return nil, err
	}
	json.Unmarshal([]byte(coopsJson), &sme.AssociatedCoops)
	return &sme, nil
}

// UpdateSMEMetrics updates operational readings for an SME.
func (s *Store) UpdateSMEMetrics(id string, dieselLiters, gridKwh, offsetTons float64) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`UPDATE smes SET scope1_diesel_liters = ?, scope2_grid_kwh = ?, scope3_offsets_tons = ? WHERE id = ?`,
		dieselLiters, gridKwh, offsetTons, id)
	return err
}

// SaveMintResult records an issued carbon removal certificate.
func (s *Store) SaveMintResult(res models.MintResult) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`INSERT INTO mint_results (asset_id, batch_id, kiln_id, coop_id, farmer_phone, biochar_yield_kg, gross_co2e_kg, net_metric_tons_co2e, carbonmark_market_usd, market_price_per_ton, farmer_payout_ksh, coop_payout_ksh, platform_fee_usd, kenya_ncr_tracking_id, is_validated, rejection_reason, verification_hash, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		res.AssetID, res.BatchID, res.KilnID, res.CoopID, res.FarmerPhone, res.BiocharYieldKG, res.GrossCO2eKG, res.NetMetricTonsCO2e, res.CarbonmarkMarketUSD, res.MarketPricePerTon, res.FarmerPayoutKSh, res.CoopPayoutKSh, res.PlatformFeeUSD, res.KenyaNCRTrackingID, res.IsValidated, res.RejectionReason, res.VerificationHash, res.CreatedAt)
	return err
}

// LogTelemetry saves incoming raw telemetry packet for audit history.
func (s *Store) LogTelemetry(t models.TelemetryPacket, isValidated bool, rejectionReason string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`INSERT INTO telemetry_logs (device_uid, kiln_id, coop_id, farmer_phone, initial_height_cm, final_height_cm, peak_outer_temp_c, core_est_temp_c, duration_minutes, heating_rate, latitude, longitude, cell_tower_id, is_validated, rejection_reason, timestamp)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		t.DeviceUID, t.KilnID, t.CoopID, t.FarmerPhone, t.InitialHeightCM, t.FinalHeightCM, t.PeakOuterTempC, t.CoreEstTempC, t.DurationMinutes, t.HeatingRate, t.Latitude, t.Longitude, t.CellTowerID, isValidated, rejectionReason, t.Timestamp)
	return err
}

// GetCooperative gets a cooperative by ID.
func (s *Store) GetCooperative(id string) (*models.Cooperative, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var c models.Cooperative
	var towersJson, kilnsJson string
	err := s.db.QueryRow(`SELECT id, name, region, center_lat, center_lng, radius_km, allowed_towers, registered_kilns, farmer_count, total_biochar_kg, total_offsets_tons FROM cooperatives WHERE id = ?`, id).
		Scan(&c.ID, &c.Name, &c.Region, &c.CenterLat, &c.CenterLng, &c.RadiusKM, &towersJson, &kilnsJson, &c.FarmerCount, &c.TotalBiocharKG, &c.TotalOffsetsTons)
	if err != nil {
		return nil, err
	}
	json.Unmarshal([]byte(towersJson), &c.AllowedTowers)
	json.Unmarshal([]byte(kilnsJson), &c.RegisteredKilns)
	return &c, nil
}

// GetAllCooperatives returns all registered cooperatives.
func (s *Store) GetAllCooperatives() ([]models.Cooperative, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`SELECT id, name, region, center_lat, center_lng, radius_km, allowed_towers, registered_kilns, farmer_count, total_biochar_kg, total_offsets_tons FROM cooperatives`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var coops []models.Cooperative
	for rows.Next() {
		var c models.Cooperative
		var towersJson, kilnsJson string
		if err := rows.Scan(&c.ID, &c.Name, &c.Region, &c.CenterLat, &c.CenterLng, &c.RadiusKM, &towersJson, &kilnsJson, &c.FarmerCount, &c.TotalBiocharKG, &c.TotalOffsetsTons); err == nil {
			json.Unmarshal([]byte(towersJson), &c.AllowedTowers)
			json.Unmarshal([]byte(kilnsJson), &c.RegisteredKilns)
			coops = append(coops, c)
		}
	}
	return coops, nil
}

// GetAllFarmers returns all registered farmers.
func (s *Store) GetAllFarmers() ([]models.FarmerAccount, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`SELECT phone, name, national_id, coop_id, registered_kiln, total_burns, total_biochar_kg, available_ksh, total_withdrawn_ksh, preferred_language, created_at FROM farmers`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var farmers []models.FarmerAccount
	for rows.Next() {
		var f models.FarmerAccount
		if err := rows.Scan(&f.Phone, &f.Name, &f.NationalID, &f.CoopID, &f.RegisteredKiln, &f.TotalBurns, &f.TotalBiocharKG, &f.AvailableKSh, &f.TotalWithdrawnKSh, &f.PreferredLanguage, &f.CreatedAt); err == nil {
			farmers = append(farmers, f)
		}
	}
	return farmers, nil
}

// Close closes the database connection.
func (s *Store) Close() error {
	return s.db.Close()
}

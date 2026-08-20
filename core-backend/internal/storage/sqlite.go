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
		`CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			identifier TEXT UNIQUE NOT NULL,
			name TEXT NOT NULL,
			role TEXT NOT NULL,
			sub_type TEXT,
			affiliation TEXT,
			pin TEXT,
			created_at DATETIME
		);`,
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
		`CREATE TABLE IF NOT EXISTS kilns (
			id TEXT PRIMARY KEY,
			coop_id TEXT,
			farmer_phone TEXT,
			farmer_name TEXT,
			location TEXT,
			status TEXT,
			skin_temp_c REAL,
			core_temp_c REAL,
			char_depth_cm REAL,
			initial_depth_cm REAL,
			battery_pct INTEGER,
			last_yield_kg REAL,
			last_yield_tons REAL,
			updated_at DATETIME
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
		`CREATE TABLE IF NOT EXISTS sme_buyers (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			location TEXT NOT NULL,
			industry TEXT NOT NULL,
			purchased_tons REAL DEFAULT 0,
			value_usd REAL DEFAULT 0,
			value_ksh REAL DEFAULT 0,
			status TEXT,
			ncr_cert TEXT,
			contact TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS cooperative_transactions (
			id TEXT PRIMARY KEY,
			date TEXT,
			type TEXT,
			kiln_id TEXT,
			farmer_name TEXT,
			mass_kg REAL,
			co2e_tons REAL,
			farmer_payout_ksh REAL,
			coop_stipend_ksh REAL,
			receipt TEXT,
			ncr_id TEXT,
			timestamp DATETIME
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

	// 1. Seed Users (At least 15 comprehensive accounts across all personas)
	var userCount int
	s.db.QueryRow("SELECT COUNT(*) FROM users").Scan(&userCount)
	if userCount == 0 {
		users := []models.User{
			// Smallholder Farmers
			{ID: "USER-FARM-01", Identifier: "+254712345678", Name: "Wanjala Wafula", Role: "farmer", SubType: "bio-sme", Affiliation: "Kakamega Sugarcane Coop / Kizito Outgrower", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-02", Identifier: "+254722998877", Name: "Amina Nekesa", Role: "farmer", SubType: "cooperative", Affiliation: "Mumias West Smallholder Cluster", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-03", Identifier: "+254733112233", Name: "Barasa Simiyu", Role: "farmer", SubType: "bio-sme", Affiliation: "Butere Outgrower Hub", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-04", Identifier: "+254711445566", Name: "Nekesa Mukabana", Role: "farmer", SubType: "cooperative", Affiliation: "Malava North Cluster", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-05", Identifier: "+254722556677", Name: "Cleophas Malala", Role: "farmer", SubType: "cooperative", Affiliation: "Shinyalu Agro Hub", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-06", Identifier: "+254790112233", Name: "Grace Ambani", Role: "farmer", SubType: "cooperative", Affiliation: "Matungu Outgrowers", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-07", Identifier: "+254798334455", Name: "Sylvester Shitanda", Role: "farmer", SubType: "cooperative", Affiliation: "Lugari Cluster", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-08", Identifier: "+254740123456", Name: "Linet Makokha", Role: "farmer", SubType: "cooperative", Affiliation: "Navakholo Outgrowers", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-09", Identifier: "+254752334455", Name: "Rosemary Imbuhila", Role: "farmer", SubType: "bio-sme", Affiliation: "Kakamega South Plot B", PIN: "1234", CreatedAt: time.Now()},
			{ID: "USER-FARM-10", Identifier: "+254707889900", Name: "Boniface Khalwale", Role: "farmer", SubType: "cooperative", Affiliation: "Malava Forest Edge", PIN: "1234", CreatedAt: time.Now()},

			// Cooperatives
			{ID: "USER-COOP-01", Identifier: "+254700112233", Name: "Kakamega Sugarcane Coop Union", Role: "cooperative", SubType: "coop-manager", Affiliation: "Western Kenya Aggregation Network", PIN: "2026", CreatedAt: time.Now()},
			{ID: "USER-COOP-02", Identifier: "+254700223344", Name: "Kano Plains Rice Husk Producers Hub", Role: "cooperative", SubType: "coop-manager", Affiliation: "Kisumu County Biomass Network", PIN: "2026", CreatedAt: time.Now()},
			{ID: "USER-COOP-03", Identifier: "+254700334455", Name: "Uasin Gishu Maize Stalk Union", Role: "cooperative", SubType: "coop-manager", Affiliation: "Rift Valley Agricultural Cluster", PIN: "2026", CreatedAt: time.Now()},

			// SMEs (Bio & Non-Bio)
			{ID: "USER-SME-01", Identifier: "+254788990011", Name: "Kizito Grain Millers Ltd", Role: "sme", SubType: "bio-sme", Affiliation: "Eldoret Agribusiness Zone", PIN: "8888", CreatedAt: time.Now()},
			{ID: "USER-SME-02", Identifier: "+254788112233", Name: "Nzoia Agro Packaging Co.", Role: "sme", SubType: "non-bio-sme", Affiliation: "Bungoma / Webuye Industrial Park", PIN: "8888", CreatedAt: time.Now()},
			{ID: "USER-SME-03", Identifier: "+254788223344", Name: "Mombasa Heavy Cement Works", Role: "sme", SubType: "non-bio-sme", Affiliation: "Mombasa Port Terminal", PIN: "8888", CreatedAt: time.Now()},
			{ID: "USER-SME-04", Identifier: "+254788334455", Name: "East Africa Express Freight", Role: "sme", SubType: "non-bio-sme", Affiliation: "Nairobi Inland Depot", PIN: "8888", CreatedAt: time.Now()},
			{ID: "USER-SME-05", Identifier: "+254788445566", Name: "Highland Kericho Tea Processors", Role: "sme", SubType: "bio-sme", Affiliation: "Kericho Highland Zone", PIN: "8888", CreatedAt: time.Now()},
		}

		for _, u := range users {
			s.db.Exec(`INSERT INTO users (id, identifier, name, role, sub_type, affiliation, pin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				u.ID, u.Identifier, u.Name, u.Role, u.SubType, u.Affiliation, u.PIN, u.CreatedAt)
		}
	}

	// 2. Seed Cooperatives
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
				AllowedTowers:  []string{"SAF-TOWER-KKM-04", "SAF-TOWER-KKM-09", "SAF-TOWER-MUM-01", "SAF-TOWER-SHY-02", "SAF-TOWER-MAL-03"},
				RegisteredKilns: []string{
					"KILN-001", "KILN-002", "KILN-003", "KILN-004", "KILN-005", "KILN-006",
					"KILN-007", "KILN-008", "KILN-009", "KILN-010", "KILN-011", "KILN-012",
					"KILN-013", "KILN-014", "KILN-015", "KILN-016", "KILN-017", "KILN-018",
				},
				FarmerCount:      148,
				TotalBiocharKG:   28450.0,
				TotalOffsetsTons: 62.4,
			},
			{
				ID:             "COOP-KISUMU-02",
				Name:           "Kano Plains Rice Husk Producers Hub",
				Region:         "Kisumu, Western Kenya",
				CenterLat:      -0.0917,
				CenterLng:      34.7680,
				RadiusKM:       25.0,
				AllowedTowers:  []string{"SAF-TOWER-KSM-01", "SAF-TOWER-AHERO-03"},
				RegisteredKilns: []string{"KILN-010", "KILN-011", "KILN-012", "KILN-013"},
				FarmerCount:      92,
				TotalBiocharKG:   14200.0,
				TotalOffsetsTons: 31.2,
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
				FarmerCount:      210,
				TotalBiocharKG:   34800.0,
				TotalOffsetsTons: 76.5,
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

	// 3. Seed Farmers (15 realistic smallholders)
	var farmerCount int
	s.db.QueryRow("SELECT COUNT(*) FROM farmers").Scan(&farmerCount)
	if farmerCount == 0 {
		farmers := []models.FarmerAccount{
			{Phone: "+254712345678", Name: "Wanjala Wafula", NationalID: "28491024", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-001, KILN-004", TotalBurns: 18, TotalBiocharKG: 1420.0, AvailableKSh: 12450.0, TotalWithdrawnKSh: 34500.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-60 * 24 * time.Hour)},
			{Phone: "+254722998877", Name: "Amina Nekesa", NationalID: "29381044", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-002", TotalBurns: 12, TotalBiocharKG: 840.0, AvailableKSh: 7200.0, TotalWithdrawnKSh: 19500.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-50 * 24 * time.Hour)},
			{Phone: "+254733112233", Name: "Barasa Simiyu", NationalID: "31902845", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-003, KILN-007", TotalBurns: 16, TotalBiocharKG: 1250.0, AvailableKSh: 10800.0, TotalWithdrawnKSh: 28000.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-45 * 24 * time.Hour)},
			{Phone: "+254711445566", Name: "Nekesa Mukabana", NationalID: "30491823", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-005", TotalBurns: 11, TotalBiocharKG: 780.0, AvailableKSh: 6500.0, TotalWithdrawnKSh: 16000.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-40 * 24 * time.Hour)},
			{Phone: "+254722556677", Name: "Cleophas Malala", NationalID: "27103948", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-006", TotalBurns: 14, TotalBiocharKG: 990.0, AvailableKSh: 8700.0, TotalWithdrawnKSh: 21500.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-35 * 24 * time.Hour)},
			{Phone: "+254790112233", Name: "Grace Ambani", NationalID: "33481920", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-008", TotalBurns: 15, TotalBiocharKG: 1080.0, AvailableKSh: 9400.0, TotalWithdrawnKSh: 24000.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-30 * 24 * time.Hour)},
			{Phone: "+254798334455", Name: "Sylvester Shitanda", NationalID: "26190284", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-009", TotalBurns: 10, TotalBiocharKG: 720.0, AvailableKSh: 6100.0, TotalWithdrawnKSh: 15200.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-28 * 24 * time.Hour)},
			{Phone: "+254740123456", Name: "Linet Makokha", NationalID: "34591028", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-010", TotalBurns: 13, TotalBiocharKG: 910.0, AvailableKSh: 7900.0, TotalWithdrawnKSh: 19800.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-25 * 24 * time.Hour)},
			{Phone: "+254741987654", Name: "Emmanuel Wesonga", NationalID: "31204918", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-011", TotalBurns: 8, TotalBiocharKG: 560.0, AvailableKSh: 4800.0, TotalWithdrawnKSh: 12000.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-20 * 24 * time.Hour)},
			{Phone: "+254752334455", Name: "Rosemary Imbuhila", NationalID: "29018472", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-012, KILN-015", TotalBurns: 17, TotalBiocharKG: 1340.0, AvailableKSh: 11700.0, TotalWithdrawnKSh: 29500.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-18 * 24 * time.Hour)},
			{Phone: "+254763112233", Name: "Timothy Khamala", NationalID: "32849102", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-013", TotalBurns: 9, TotalBiocharKG: 630.0, AvailableKSh: 5400.0, TotalWithdrawnKSh: 13500.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-15 * 24 * time.Hour)},
			{Phone: "+254774556677", Name: "Catherine Nabwire", NationalID: "28193049", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-014", TotalBurns: 12, TotalBiocharKG: 850.0, AvailableKSh: 7400.0, TotalWithdrawnKSh: 18600.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-12 * 24 * time.Hour)},
			{Phone: "+254785998877", Name: "Meshack Otwoma", NationalID: "35102938", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-016", TotalBurns: 14, TotalBiocharKG: 980.0, AvailableKSh: 8500.0, TotalWithdrawnKSh: 21200.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-10 * 24 * time.Hour)},
			{Phone: "+254796223344", Name: "Everlyne Shikuku", NationalID: "30918234", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-017", TotalBurns: 11, TotalBiocharKG: 770.0, AvailableKSh: 6600.0, TotalWithdrawnKSh: 16800.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-7 * 24 * time.Hour)},
			{Phone: "+254707889900", Name: "Boniface Khalwale", NationalID: "27891024", CoopID: "COOP-KAKAMEGA-01", RegisteredKiln: "KILN-018", TotalBurns: 16, TotalBiocharKG: 1150.0, AvailableKSh: 10000.0, TotalWithdrawnKSh: 25500.0, PreferredLanguage: "sw", CreatedAt: time.Now().Add(-5 * 24 * time.Hour)},
		}

		for _, f := range farmers {
			s.db.Exec(`INSERT INTO farmers (phone, name, national_id, coop_id, registered_kiln, total_burns, total_biochar_kg, available_ksh, total_withdrawn_ksh, preferred_language, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				f.Phone, f.Name, f.NationalID, f.CoopID, f.RegisteredKiln, f.TotalBurns, f.TotalBiocharKG, f.AvailableKSh, f.TotalWithdrawnKSh, f.PreferredLanguage, f.CreatedAt)
		}
	}

	// 4. Seed All 18 Smart Kilns
	var kilnCount int
	s.db.QueryRow("SELECT COUNT(*) FROM kilns").Scan(&kilnCount)
	if kilnCount == 0 {
		kilns := []models.Kiln{
			{ID: "KILN-001", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254712345678", FarmerName: "Wanjala Wafula", Location: "Kakamega Central", Status: "ACTIVE", SkinTempC: 58.5, CoreTempC: 571.7, CharDepthCM: 30.0, InitialDepth: 85.0, BatteryPct: 88, LastYieldKG: 79.8, LastYieldTons: 0.20, UpdatedAt: time.Now()},
			{ID: "KILN-002", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254722998877", FarmerName: "Amina Nekesa", Location: "Mumias West", Status: "ACTIVE", SkinTempC: 61.2, CoreTempC: 592.9, CharDepthCM: 28.0, InitialDepth: 85.0, BatteryPct: 92, LastYieldKG: 82.6, LastYieldTons: 0.21, UpdatedAt: time.Now()},
			{ID: "KILN-003", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254733112233", FarmerName: "Barasa Simiyu", Location: "Butere Outgrower", Status: "COOLING", SkinTempC: 44.0, CoreTempC: 457.9, CharDepthCM: 32.0, InitialDepth: 85.0, BatteryPct: 79, LastYieldKG: 76.8, LastYieldTons: 0.19, UpdatedAt: time.Now()},
			{ID: "KILN-004", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254712345678", FarmerName: "Wanjala Wafula", Location: "Lurambi Plot B", Status: "STANDBY", SkinTempC: 26.5, CoreTempC: 26.5, CharDepthCM: 0.0, InitialDepth: 85.0, BatteryPct: 95, LastYieldKG: 85.0, LastYieldTons: 0.22, UpdatedAt: time.Now()},
			{ID: "KILN-005", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254711445566", FarmerName: "Nekesa Mukabana", Location: "Malava North", Status: "ACTIVE", SkinTempC: 57.0, CoreTempC: 560.0, CharDepthCM: 29.0, InitialDepth: 85.0, BatteryPct: 84, LastYieldKG: 81.2, LastYieldTons: 0.21, UpdatedAt: time.Now()},
			{ID: "KILN-006", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254722556677", FarmerName: "Cleophas Malala", Location: "Shinyalu Forest Edge", Status: "ACTIVE", SkinTempC: 59.8, CoreTempC: 581.9, CharDepthCM: 31.0, InitialDepth: 85.0, BatteryPct: 90, LastYieldKG: 78.3, LastYieldTons: 0.20, UpdatedAt: time.Now()},
			{ID: "KILN-007", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254733112233", FarmerName: "Barasa Simiyu", Location: "Butere Outgrower #2", Status: "STANDBY", SkinTempC: 25.0, CoreTempC: 25.0, CharDepthCM: 0.0, InitialDepth: 85.0, BatteryPct: 89, LastYieldKG: 84.1, LastYieldTons: 0.22, UpdatedAt: time.Now()},
			{ID: "KILN-008", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254790112233", FarmerName: "Grace Ambani", Location: "Matungu Sugarcane Hub", Status: "COOLING", SkinTempC: 42.5, CoreTempC: 446.1, CharDepthCM: 30.0, InitialDepth: 85.0, BatteryPct: 76, LastYieldKG: 79.8, LastYieldTons: 0.20, UpdatedAt: time.Now()},
			{ID: "KILN-009", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254798334455", FarmerName: "Sylvester Shitanda", Location: "Lugari Agro-Cluster", Status: "ACTIVE", SkinTempC: 62.0, CoreTempC: 599.2, CharDepthCM: 27.0, InitialDepth: 85.0, BatteryPct: 87, LastYieldKG: 84.1, LastYieldTons: 0.22, UpdatedAt: time.Now()},
			{ID: "KILN-010", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254740123456", FarmerName: "Linet Makokha", Location: "Navakholo Center", Status: "STANDBY", SkinTempC: 24.8, CoreTempC: 24.8, CharDepthCM: 0.0, InitialDepth: 85.0, BatteryPct: 94, LastYieldKG: 80.5, LastYieldTons: 0.21, UpdatedAt: time.Now()},
			{ID: "KILN-011", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254741987654", FarmerName: "Emmanuel Wesonga", Location: "Mumias East", Status: "ACTIVE", SkinTempC: 56.4, CoreTempC: 555.2, CharDepthCM: 33.0, InitialDepth: 85.0, BatteryPct: 83, LastYieldKG: 75.4, LastYieldTons: 0.19, UpdatedAt: time.Now()},
			{ID: "KILN-012", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254752334455", FarmerName: "Rosemary Imbuhila", Location: "Kakamega South", Status: "ACTIVE", SkinTempC: 60.1, CoreTempC: 584.3, CharDepthCM: 28.0, InitialDepth: 85.0, BatteryPct: 91, LastYieldKG: 82.6, LastYieldTons: 0.21, UpdatedAt: time.Now()},
			{ID: "KILN-013", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254763112233", FarmerName: "Timothy Khamala", Location: "Khwisero Ward", Status: "STANDBY", SkinTempC: 26.0, CoreTempC: 26.0, CharDepthCM: 0.0, InitialDepth: 85.0, BatteryPct: 80, LastYieldKG: 78.0, LastYieldTons: 0.20, UpdatedAt: time.Now()},
			{ID: "KILN-014", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254774556677", FarmerName: "Catherine Nabwire", Location: "Lurambi Central", Status: "COOLING", SkinTempC: 45.1, CoreTempC: 466.5, CharDepthCM: 31.0, InitialDepth: 85.0, BatteryPct: 85, LastYieldKG: 78.3, LastYieldTons: 0.20, UpdatedAt: time.Now()},
			{ID: "KILN-015", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254752334455", FarmerName: "Rosemary Imbuhila", Location: "Kakamega South Plot B", Status: "STANDBY", SkinTempC: 25.5, CoreTempC: 25.5, CharDepthCM: 0.0, InitialDepth: 85.0, BatteryPct: 96, LastYieldKG: 83.2, LastYieldTons: 0.21, UpdatedAt: time.Now()},
			{ID: "KILN-016", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254785998877", FarmerName: "Meshack Otwoma", Location: "Ikolomani Gold Belt", Status: "ACTIVE", SkinTempC: 58.9, CoreTempC: 574.9, CharDepthCM: 29.0, InitialDepth: 85.0, BatteryPct: 88, LastYieldKG: 81.2, LastYieldTons: 0.21, UpdatedAt: time.Now()},
			{ID: "KILN-017", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254796223344", FarmerName: "Everlyne Shikuku", Location: "Shinoyi Village", Status: "ACTIVE", SkinTempC: 63.4, CoreTempC: 610.2, CharDepthCM: 27.0, InitialDepth: 85.0, BatteryPct: 82, LastYieldKG: 84.1, LastYieldTons: 0.22, UpdatedAt: time.Now()},
			{ID: "KILN-018", CoopID: "COOP-KAKAMEGA-01", FarmerPhone: "+254707889900", FarmerName: "Boniface Khalwale", Location: "Malava Forest Edge", Status: "STANDBY", SkinTempC: 24.0, CoreTempC: 24.0, CharDepthCM: 0.0, InitialDepth: 85.0, BatteryPct: 93, LastYieldKG: 79.0, LastYieldTons: 0.20, UpdatedAt: time.Now()},
		}

		for _, k := range kilns {
			s.db.Exec(`INSERT INTO kilns (id, coop_id, farmer_phone, farmer_name, location, status, skin_temp_c, core_temp_c, char_depth_cm, initial_depth_cm, battery_pct, last_yield_kg, last_yield_tons, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				k.ID, k.CoopID, k.FarmerPhone, k.FarmerName, k.Location, k.Status, k.SkinTempC, k.CoreTempC, k.CharDepthCM, k.InitialDepth, k.BatteryPct, k.LastYieldKG, k.LastYieldTons, k.UpdatedAt)
		}
	}

	// 5. Seed SMEs & Corporate Offtakers
	var smeBuyerCount int
	s.db.QueryRow("SELECT COUNT(*) FROM sme_buyers").Scan(&smeBuyerCount)
	if smeBuyerCount == 0 {
		buyers := []models.SMEBuyer{
			{ID: "SME-KIZITO-ELDORET", Name: "Kizito Grain Millers Ltd", Location: "Eldoret Industrial Zone", Industry: "Grain Flour Milling", PurchasedTons: 24.8, ValueUSD: 3348.0, ValueKSh: 435240.0, Status: "CONTRACT ACTIVE", NcrCert: "KE-NCR-2026-KIZ-01", Contact: "+254722001122"},
			{ID: "SME-MOMBASA-CEMENT", Name: "Mombasa Heavy Cement Works", Location: "Mombasa Port Terminal", Industry: "Cement & Clinker", PurchasedTons: 15.0, ValueUSD: 2025.0, ValueKSh: 263250.0, Status: "SETTLED", NcrCert: "KE-NCR-2026-MOM-04", Contact: "+254733994411"},
			{ID: "SME-NZOIA-PACKAGING", Name: "Nzoia Agro Packaging Co.", Location: "Bungoma / Webuye", Industry: "Pulp & Paper Packaging", PurchasedTons: 38.2, ValueUSD: 5157.0, ValueKSh: 670410.0, Status: "CONTRACT ACTIVE", NcrCert: "KE-NCR-2026-NZO-08", Contact: "+254711883322"},
			{ID: "SME-NAIROBI-LOGISTICS", Name: "East Africa Express Freight", Location: "Nairobi Inland Depot", Industry: "Logistics & Trucking", PurchasedTons: 20.0, ValueUSD: 2700.0, ValueKSh: 351000.0, Status: "SETTLED", NcrCert: "KE-NCR-2026-EAF-12", Contact: "+254700112233"},
			{ID: "SME-KERICHO-TEA", Name: "Highland Kericho Tea Processors", Location: "Kericho Highland Zone", Industry: "Tea Processing & Steam", PurchasedTons: 18.5, ValueUSD: 2497.5, ValueKSh: 324675.0, Status: "CONTRACT ACTIVE", NcrCert: "KE-NCR-2026-KER-03", Contact: "+254721445566"},
		}

		for _, b := range buyers {
			s.db.Exec(`INSERT INTO sme_buyers (id, name, location, industry, purchased_tons, value_usd, value_ksh, status, ncr_cert, contact)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				b.ID, b.Name, b.Location, b.Industry, b.PurchasedTons, b.ValueUSD, b.ValueKSh, b.Status, b.NcrCert, b.Contact)
		}
	}

	// 6. Seed Cooperative Transactions Audit Log
	var txCount int
	s.db.QueryRow("SELECT COUNT(*) FROM cooperative_transactions").Scan(&txCount)
	if txCount == 0 {
		txs := []models.CooperativeTransaction{
			{ID: "TXN-9081", Date: "2026-08-21 04:41 EAT", Type: "MINT & DISBURSE", KilnID: "KILN-001", FarmerName: "Wanjala Wafula", MassKG: 79.75, CO2eTons: 0.202, FarmerPayoutKSh: 1313.63, CoopStipendKSh: 525.45, Receipt: "Z9692PSQXE", NcrID: "KE-NCR-2026-09c58f91", Timestamp: time.Now().Add(-2 * time.Hour)},
			{ID: "TXN-8840", Date: "2026-08-20 16:15 EAT", Type: "MINT & DISBURSE", KilnID: "KILN-002", FarmerName: "Amina Nekesa", MassKG: 82.60, CO2eTons: 0.210, FarmerPayoutKSh: 1365.00, CoopStipendKSh: 546.00, Receipt: "QHK881029", NcrID: "KE-NCR-2026-77a10f22", Timestamp: time.Now().Add(-18 * time.Hour)},
			{ID: "TXN-8720", Date: "2026-08-19 11:30 EAT", Type: "MINT & DISBURSE", KilnID: "KILN-003", FarmerName: "Barasa Simiyu", MassKG: 76.80, CO2eTons: 0.195, FarmerPayoutKSh: 1267.50, CoopStipendKSh: 507.00, Receipt: "MKA991024", NcrID: "KE-NCR-2026-3d201c88", Timestamp: time.Now().Add(-44 * time.Hour)},
			{ID: "TXN-8611", Date: "2026-08-18 14:20 EAT", Type: "MARKET SALE", KilnID: "POOL BATCH #14", FarmerName: "Cooperative Pool (8 Farmers)", MassKG: 3850.0, CO2eTons: 9.80, FarmerPayoutKSh: 63700.00, CoopStipendKSh: 25480.00, Receipt: "SLS7719204", NcrID: "KE-NCR-2026-BCH-14", Timestamp: time.Now().Add(-70 * time.Hour)},
			{ID: "TXN-8490", Date: "2026-08-16 09:45 EAT", Type: "MINT & DISBURSE", KilnID: "KILN-006", FarmerName: "Cleophas Malala", MassKG: 78.30, CO2eTons: 0.199, FarmerPayoutKSh: 1293.50, CoopStipendKSh: 517.40, Receipt: "PBA339102", NcrID: "KE-NCR-2026-9f4410e1", Timestamp: time.Now().Add(-115 * time.Hour)},
		}

		for _, tx := range txs {
			s.db.Exec(`INSERT INTO cooperative_transactions (id, date, type, kiln_id, farmer_name, mass_kg, co2e_tons, farmer_payout_ksh, coop_stipend_ksh, receipt, ncr_id, timestamp)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				tx.ID, tx.Date, tx.Type, tx.KilnID, tx.FarmerName, tx.MassKG, tx.CO2eTons, tx.FarmerPayoutKSh, tx.CoopStipendKSh, tx.Receipt, tx.NcrID, tx.Timestamp)
		}
	}

	return nil
}

// GetAllUsers returns all users in the system.
func (s *Store) GetAllUsers() ([]models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`SELECT id, identifier, name, role, sub_type, affiliation, pin, created_at FROM users ORDER BY id ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Identifier, &u.Name, &u.Role, &u.SubType, &u.Affiliation, &u.PIN, &u.CreatedAt); err == nil {
			users = append(users, u)
		}
	}
	return users, nil
}

// GetUserByIdentifier finds a user by phone or ID.
func (s *Store) GetUserByIdentifier(identifier string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var u models.User
	err := s.db.QueryRow(`SELECT id, identifier, name, role, sub_type, affiliation, pin, created_at FROM users WHERE identifier = ? OR id = ?`, identifier, identifier).
		Scan(&u.ID, &u.Identifier, &u.Name, &u.Role, &u.SubType, &u.Affiliation, &u.PIN, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// GetAllKilns returns all kilns in the fleet, optionally filtered by coopID.
func (s *Store) GetAllKilns(coopID string) ([]models.Kiln, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `SELECT id, coop_id, farmer_phone, farmer_name, location, status, skin_temp_c, core_temp_c, char_depth_cm, initial_depth_cm, battery_pct, last_yield_kg, last_yield_tons, updated_at FROM kilns`
	var args []interface{}
	if coopID != "" {
		query += ` WHERE coop_id = ?`
		args = append(args, coopID)
	}
	query += ` ORDER BY id ASC`

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var kilns []models.Kiln
	for rows.Next() {
		var k models.Kiln
		if err := rows.Scan(&k.ID, &k.CoopID, &k.FarmerPhone, &k.FarmerName, &k.Location, &k.Status, &k.SkinTempC, &k.CoreTempC, &k.CharDepthCM, &k.InitialDepth, &k.BatteryPct, &k.LastYieldKG, &k.LastYieldTons, &k.UpdatedAt); err == nil {
			kilns = append(kilns, k)
		}
	}
	return kilns, nil
}

// GetAllSMEBuyers returns all corporate buyers and contract details.
func (s *Store) GetAllSMEBuyers() ([]models.SMEBuyer, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`SELECT id, name, location, industry, purchased_tons, value_usd, value_ksh, status, ncr_cert, contact FROM sme_buyers ORDER BY purchased_tons DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var buyers []models.SMEBuyer
	for rows.Next() {
		var b models.SMEBuyer
		if err := rows.Scan(&b.ID, &b.Name, &b.Location, &b.Industry, &b.PurchasedTons, &b.ValueUSD, &b.ValueKSh, &b.Status, &b.NcrCert, &b.Contact); err == nil {
			buyers = append(buyers, b)
		}
	}
	return buyers, nil
}

// GetAllTransactions returns cooperative transaction history.
func (s *Store) GetAllTransactions(coopID string) ([]models.CooperativeTransaction, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`SELECT id, date, type, kiln_id, farmer_name, mass_kg, co2e_tons, farmer_payout_ksh, coop_stipend_ksh, receipt, ncr_id, timestamp FROM cooperative_transactions ORDER BY timestamp DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var txs []models.CooperativeTransaction
	for rows.Next() {
		var tx models.CooperativeTransaction
		if err := rows.Scan(&tx.ID, &tx.Date, &tx.Type, &tx.KilnID, &tx.FarmerName, &tx.MassKG, &tx.CO2eTons, &tx.FarmerPayoutKSh, &tx.CoopStipendKSh, &tx.Receipt, &tx.NcrID, &tx.Timestamp); err == nil {
			txs = append(txs, tx)
		}
	}
	return txs, nil
}

// RecordTransaction persists a new transaction to the audit trail.
func (s *Store) RecordTransaction(tx models.CooperativeTransaction) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`INSERT INTO cooperative_transactions (id, date, type, kiln_id, farmer_name, mass_kg, co2e_tons, farmer_payout_ksh, coop_stipend_ksh, receipt, ncr_id, timestamp)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		tx.ID, tx.Date, tx.Type, tx.KilnID, tx.FarmerName, tx.MassKG, tx.CO2eTons, tx.FarmerPayoutKSh, tx.CoopStipendKSh, tx.Receipt, tx.NcrID, tx.Timestamp)
	return err
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

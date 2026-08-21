package models

import "time"

// TelemetryPacket represents raw telemetry sent from an edge kiln or LoRa forwarder.
type TelemetryPacket struct {
	DeviceUID       string    `json:"device_uid"`        // Silicon Unique ID of the MCU
	KilnID          string    `json:"kiln_id"`           // Physical barrel identifier
	CoopID          string    `json:"coop_id"`           // Registered cooperative identifier
	FarmerPhone     string    `json:"farmer_phone"`      // Operator M-Pesa phone number (+254...)
	InitialHeightCM float64   `json:"initial_height_cm"` // Biomass depth before ignition (t0)
	FinalHeightCM   float64   `json:"final_height_cm"`   // Biochar depth after cooling (t_final)
	PeakOuterTempC  float64   `json:"peak_outer_temp_c"` // Peak exterior conductive skin temperature
	CoreEstTempC    float64   `json:"core_est_temp_c"`   // Estimated internal core pyrolysis temp
	DurationMinutes float64   `json:"duration_minutes"`  // Total duration of active thermal plateau
	HeatingRate     float64   `json:"heating_rate"`      // Temperature delta over time (deg C / min)
	Latitude        float64   `json:"latitude"`          // GPS Latitude of LoRa gateway or MCU
	Longitude       float64   `json:"longitude"`         // GPS Longitude of LoRa gateway or MCU
	CellTowerID     string    `json:"cell_tower_id"`     // Telemetry tower triangulation identifier
	FirmwareVersion string    `json:"firmware_version"`  // Firmware version hash
	Timestamp       time.Time `json:"timestamp"`         // Ingestion timestamp
}

// MintResult represents the outcome of dMRV physics validation and asset minting.
type MintResult struct {
	AssetID             string    `json:"asset_id"`               // e.g. AG-CORC-7f8a9c...
	BatchID             string    `json:"batch_id"`               // Internal batch reference
	KilnID              string    `json:"kiln_id"`
	CoopID              string    `json:"coop_id"`
	FarmerPhone         string    `json:"farmer_phone"`
	BiocharYieldKG      float64   `json:"biochar_yield_kg"`       // Calculated biochar mass
	GrossCO2eKG         float64   `json:"gross_co2e_kg"`          // Theoretical CO2e before sink/leakage
	NetMetricTonsCO2e   float64   `json:"net_metric_tons_co2e"`   // Verified net sequestered CO2e
	CarbonmarkMarketUSD float64   `json:"carbonmark_market_usd"`  // Total valuation at market price
	MarketPricePerTon   float64   `json:"market_price_per_ton"`   // USD / Ton (e.g. $135.00)
	FarmerPayoutKSh     float64   `json:"farmer_payout_ksh"`      // Payout in Kenya Shillings
	CoopPayoutKSh       float64   `json:"coop_payout_ksh"`        // Coop stipend in Kenya Shillings
	PlatformFeeUSD      float64   `json:"platform_fee_usd"`       // AngaGuard revenue
	KenyaNCRTrackingID  string    `json:"kenya_ncr_tracking_id"`  // e.g. KE-NCR-2026-3d2e1b...
	IsValidated         bool      `json:"is_validated"`
	RejectionReason     string    `json:"rejection_reason,omitempty"`
	VerificationHash    string    `json:"verification_hash"`      // Cryptographic SHA-256 seal
	CreatedAt           time.Time `json:"created_at"`
}

// LedgerBlock represents a block in the append-only SHA-256 blockchain ledger.
type LedgerBlock struct {
	Index        int64      `json:"index"`
	Timestamp    time.Time  `json:"timestamp"`
	PreviousHash string     `json:"previous_hash"`
	BlockHash    string     `json:"block_hash"`
	MerkleRoot   string     `json:"merkle_root"`
	Asset        MintResult `json:"asset"`
	ValidatorSig string     `json:"validator_sig"`
}

// Cooperative represents a registered farming cooperative in Western Kenya / Rift Valley.
type Cooperative struct {
	ID               string   `json:"id"`
	Name             string   `json:"name"`
	Region           string   `json:"region"` // Kisumu, Kakamega, Bungoma, Eldoret, Kericho
	CenterLat        float64  `json:"center_lat"`
	CenterLng        float64  `json:"center_lng"`
	RadiusKM         float64  `json:"radius_km"`
	AllowedTowers    []string `json:"allowed_towers"`
	RegisteredKilns  []string `json:"registered_kilns"`
	FarmerCount      int      `json:"farmer_count"`
	TotalBiocharKG   float64  `json:"total_biochar_kg"`
	TotalOffsetsTons float64  `json:"total_offsets_tons"`
}

// SMEProfile represents an agribusiness or industrial client.
type SMEProfile struct {
	ID                 string    `json:"id"`
	CompanyName        string    `json:"company_name"`
	Location           string    `json:"location"`
	Industry           string    `json:"industry"`
	Scope1DieselLiters float64   `json:"scope1_diesel_liters"`
	Scope2GridKwh      float64   `json:"scope2_grid_kwh"`
	Scope3OffsetsTons  float64   `json:"scope3_offsets_tons"`
	AssociatedCoops    []string  `json:"associated_coops"`
	CreatedAt          time.Time `json:"created_at"`
}

// ESGScorecard represents the dynamic GHG protocol corporate audit report.
type ESGScorecard struct {
	SMEID                string    `json:"sme_id"`
	CompanyName          string    `json:"company_name"`
	ReportingPeriod      string    `json:"reporting_period"`
	Scope1DirectTons     float64   `json:"scope1_direct_tons"`   // Liters * 2.68 / 1000
	Scope2IndirectTons   float64   `json:"scope2_indirect_tons"` // kWh * 0.12 / 1000
	GrossEmissionsTons   float64   `json:"gross_emissions_tons"`
	Scope3MitigationTons float64   `json:"scope3_mitigation_tons"`
	NetCarbonFootprint   float64   `json:"net_carbon_footprint"` // Max(0, Gross - Scope3)
	Grade                string    `json:"grade"`                // A+, A, B, C
	Recommendations      []string  `json:"recommendations"`
	ISSBComplianceHash   string    `json:"issb_compliance_hash"`
	GeneratedAt          time.Time `json:"generated_at"`
}

// FarmerAccount represents an enrolled smallholder farmer.
type FarmerAccount struct {
	Phone             string    `json:"phone"`
	Name              string    `json:"name"`
	NationalID        string    `json:"national_id"`
	CoopID            string    `json:"coop_id"`
	RegisteredKiln    string    `json:"registered_kiln"`
	TotalBurns        int       `json:"total_burns"`
	TotalBiocharKG    float64   `json:"total_biochar_kg"`
	AvailableKSh      float64   `json:"available_ksh"`
	TotalWithdrawnKSh float64   `json:"total_withdrawn_ksh"`
	PreferredLanguage string    `json:"preferred_language"` // "sw" (Swahili) or "en" (English)
	CreatedAt         time.Time `json:"created_at"`
}

// PayoutRecord tracks Safaricom M-Pesa disbursements.
type PayoutRecord struct {
	TransactionID string    `json:"transaction_id"`
	AssetID       string    `json:"asset_id"`
	Recipient     string    `json:"recipient"`     // Farmer phone or Coop account
	RecipientType string    `json:"recipient_type"` // "FARMER" or "COOPERATIVE"
	AmountKSh     float64   `json:"amount_ksh"`
	Status        string    `json:"status"` // "INITIATED", "SUCCESS", "FAILED"
	MpesaReceipt  string    `json:"mpesa_receipt"`
	Timestamp     time.Time `json:"timestamp"`
}

// USSDSession holds ephemeral state for Africa's Talking USSD engine (*384*55#).
type USSDSession struct {
	SessionID   string `json:"session_id"`
	PhoneNumber string `json:"phone_number"`
	NetworkCode string `json:"network_code"`
	ServiceCode string `json:"service_code"`
	Text        string `json:"text"`
}

// User represents an authenticated account in the AngaGuard ecosystem.
type User struct {
	ID          string    `json:"id"`
	Identifier  string    `json:"identifier"` // Phone number or Org ID
	Name        string    `json:"name"`
	Role        string    `json:"role"`        // "farmer", "cooperative", "sme"
	SubType     string    `json:"sub_type"`    // "bio-sme", "non-bio-sme", "outgrower", "coop-manager"
	Affiliation string    `json:"affiliation"`
	PIN         string    `json:"pin"`
	CreatedAt   time.Time `json:"created_at"`
}

// Kiln represents a physical smart pyrolysis kiln with live IoT telemetry state.
type Kiln struct {
	ID            string    `json:"id"`
	CoopID        string    `json:"coop_id"`
	FarmerPhone   string    `json:"farmer_phone"`
	FarmerName    string    `json:"farmer_name"`
	Location      string    `json:"location"`
	Status        string    `json:"status"` // "ACTIVE", "COOLING", "STANDBY"
	SkinTempC     float64   `json:"skin_temp_c"`
	CoreTempC     float64   `json:"core_temp_c"`
	CharDepthCM   float64   `json:"char_depth_cm"`
	InitialDepth  float64   `json:"initial_depth_cm"`
	BatteryPct    int       `json:"battery_pct"`
	LastYieldKG   float64   `json:"last_yield_kg"`
	LastYieldTons float64   `json:"last_yield_tons"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// SMEBuyer represents an off-taker purchasing pooled biochar credits.
type SMEBuyer struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Location      string  `json:"location"`
	Industry      string  `json:"industry"`
	PurchasedTons float64 `json:"purchased_tons"`
	ValueUSD      float64 `json:"value_usd"`
	ValueKSh      float64 `json:"value_ksh"`
	Status        string  `json:"status"` // "CONTRACT ACTIVE", "SETTLED"
	NcrCert       string  `json:"ncr_cert"`
	Contact       string  `json:"contact"`
}

// CooperativeTransaction represents an audited dMRV batch settlement.
type CooperativeTransaction struct {
	ID              string    `json:"id"`
	Date            string    `json:"date"`
	Type            string    `json:"type"` // "MINT & DISBURSE", "MARKET SALE"
	KilnID          string    `json:"kiln_id"`
	FarmerName      string    `json:"farmer_name"`
	MassKG          float64   `json:"mass_kg"`
	CO2eTons        float64   `json:"co2e_tons"`
	FarmerPayoutKSh float64   `json:"farmer_payout_ksh"`
	CoopStipendKSh  float64   `json:"coop_stipend_ksh"`
	Receipt         string    `json:"receipt"`
	NcrID           string    `json:"ncr_id"`
	Timestamp       time.Time `json:"timestamp"`
}

// TradeExecutionRequest represents a request to execute a pooled carbon credit sale.
type TradeExecutionRequest struct {
	CoopID   string  `json:"coop_id"`
	BuyerID  string  `json:"buyer_id"`
	Tonnage  float64 `json:"tonnage"`
	PriceUSD float64 `json:"price_usd"`
	CoopPIN  string  `json:"coop_pin"`
}


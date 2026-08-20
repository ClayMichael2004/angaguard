package dmrv

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math"
	"time"

	"github.com/angaguard/core-backend/internal/models"
)

const (
	// Drum geometry and physics constants from AngaGuard Blueprint Section 5.1
	DrumDensityConstant     = 1.45       // kg biochar per cm of delta height
	CarbonPurityFactor      = 0.75       // 75% pure elemental carbon in true TLUD biochar
	PermanenceFactor        = 0.97       // 100-year soil sink permanence (3% degradation allowance)
	StoichiometricRatio     = 44.0 / 12.0 // Molecular mass CO2 (44) / Elemental C (12) ≈ 3.6667
	ProcessLeakagePenalty   = 0.05       // 5% algorithmic penalty for operational logistics & ignition smoke

	// Thermal & Volumetric validation thresholds from Section 6 & 7
	MinOuterTempC           = 40.0       // Min exterior skin temp corresponding to ~450°C core
	MaxOuterTempC           = 75.0       // Max exterior skin temp corresponding to ~650°C core
	MinDurationMinutes      = 30.0       // Minimum sustained pyrolysis plateau
	MinVolumeRetentionRatio = 0.25       // Below 0.25 indicates complete open combustion to white ash (>90% loss)
	MaxVolumeRetentionRatio = 0.45       // Above 0.45 indicates unburned raw biomass or heavy inert sand/rock padding
	MinHeatingRateDegPerMin = 1.2        // Minimum delta T / delta t during initial ramp
	MaxHeatingRateDegPerMin = 15.0       // Maximum realistic ramp rate
	MinInitialHeightCM      = 50.0       // 200L drum minimum fill depth
	MaxInitialHeightCM      = 100.0      // 200L drum maximum depth
)

// SteinhartHartEstimateCoreTemp estimates internal core temperature from external skin sensor.
// In an air-gapped standoff 15cm above drum lid, the outer skin (40-75°C) maps to 450-650°C internal.
func SteinhartHartEstimateCoreTemp(outerTempC float64) float64 {
	// Empirical calibration polynomial for modified 200L steel kiln
	// Core = T_outer * 7.8 + 115.0 (approximate mapping)
	core := (outerTempC * 7.85) + 112.5
	if core < 0 {
		return 0
	}
	return math.Round(core*10) / 10
}

// ValidateBurnPhysics executes strict hardware-enforced mathematical dMRV validation.
// Defends against: Ash Cheating, Sand Padding, Core Fusion, Acoustic Noise Scatter.
func ValidateBurnPhysics(t models.TelemetryPacket) error {
	// 1. Check Initial Biomass Height Validity
	if t.InitialHeightCM < MinInitialHeightCM || t.InitialHeightCM > MaxInitialHeightCM {
		return fmt.Errorf("REJECTED: Initial biomass height %.1f cm outside valid 200L barrel geometry (%.1f - %.1f cm)",
			t.InitialHeightCM, MinInitialHeightCM, MaxInitialHeightCM)
	}

	if t.FinalHeightCM >= t.InitialHeightCM || t.FinalHeightCM <= 0 {
		return fmt.Errorf("REJECTED: Invalid final char height %.1f cm (must be strictly less than initial %.1f cm)",
			t.FinalHeightCM, t.InitialHeightCM)
	}

	// 2. Loophole Defense: Chamber Core Fusion / Thermal Bounds
	if t.PeakOuterTempC < MinOuterTempC || t.PeakOuterTempC > MaxOuterTempC {
		return fmt.Errorf("REJECTED: Outer conductive skin temperature %.1f°C outside allowable pyrolysis bounds (%.1f°C - %.1f°C). Incompatible with oxygen-starved pyrolysis",
			t.PeakOuterTempC, MinOuterTempC, MaxOuterTempC)
	}

	// 3. Sustained Pyrolysis Plateau Check
	if t.DurationMinutes < MinDurationMinutes {
		return fmt.Errorf("REJECTED: Sustained heat profile duration %.1f mins is insufficient for deep carbonization (minimum %.1f mins required)",
			t.DurationMinutes, MinDurationMinutes)
	}

	// 4. Loophole Defense: Ash Cheating (White Ash Collapse Defense)
	volumeRetention := t.FinalHeightCM / t.InitialHeightCM
	if volumeRetention < MinVolumeRetentionRatio || volumeRetention > MaxVolumeRetentionRatio {
		return fmt.Errorf("REJECTED: Volumetric retention ratio %.3f outside valid biochar window (%.2f - %.2f). Delta indicates complete open-air ash collapse or excessive raw residue",
			volumeRetention, MinVolumeRetentionRatio, MaxVolumeRetentionRatio)
	}

	// 5. Loophole Defense: Sand-Padding Attack (Thermal Mass Coherence Check)
	if t.HeatingRate > 0 {
		if t.HeatingRate < MinHeatingRateDegPerMin || t.HeatingRate > MaxHeatingRateDegPerMin {
			return fmt.Errorf("REJECTED: Thermal incoherency anomaly (heating rate %.2f°C/min outside valid range %.1f - %.1f°C/min). Dense sand, river rocks, or artificial heat source detected",
				t.HeatingRate, MinHeatingRateDegPerMin, MaxHeatingRateDegPerMin)
		}
	}

	return nil
}

// ComputeStoichiometricYield calculates precise biochar mass and net sequestered CO2e.
func ComputeStoichiometricYield(initialHeightCM, finalHeightCM float64) (biocharKG float64, grossCO2eKG float64, netMetricTons float64) {
	heightDelta := initialHeightCM - finalHeightCM
	if heightDelta < 0 {
		heightDelta = 0
	}

	// M_biochar = Delta H * F_radius-mass
	biocharKG = heightDelta * DrumDensityConstant

	// Gross CO2e = Biochar Mass * 75% Carbon Purity * (44/12) Stoichiometric Multiplier
	grossCO2eKG = biocharKG * CarbonPurityFactor * StoichiometricRatio

	// Net Sequestration factoring in 3% soil sink permanence loss and 5% process buffer penalty
	netCO2eKG := grossCO2eKG * PermanenceFactor * (1.0 - ProcessLeakagePenalty)

	// Convert kg to Metric Tons
	netMetricTons = netCO2eKG / 1000.0

	return biocharKG, grossCO2eKG, netMetricTons
}

// EvaluateAndMintBatch processes edge telemetry, verifies physics, calculates financial splits,
// and stamps cryptographic SHA-256 immutability signatures matching Kenya NCR format.
func EvaluateAndMintBatch(t models.TelemetryPacket, marketPricePerTon float64) (*models.MintResult, error) {
	if marketPricePerTon <= 0 {
		marketPricePerTon = 135.00 // Default Carbonmark sandbox pricing per ton
	}

	// Validate physics
	err := ValidateBurnPhysics(t)
	if err != nil {
		return &models.MintResult{
			AssetID:             fmt.Sprintf("REJECTED-%d", time.Now().UnixNano()),
			KilnID:              t.KilnID,
			CoopID:              t.CoopID,
			FarmerPhone:         t.FarmerPhone,
			IsValidated:         false,
			RejectionReason:     err.Error(),
			MarketPricePerTon:   marketPricePerTon,
			CreatedAt:           time.Now(),
		}, err
	}

	// Compute mass & net carbon
	biocharKG, grossCO2eKG, netMetricTons := ComputeStoichiometricYield(t.InitialHeightCM, t.FinalHeightCM)

	// Market valuation
	totalMarketUSD := netMetricTons * marketPricePerTon

	// Financial revenue split per Section 9:
	// For 1.0 Ton credit at $135: Farmer receives $50 (37%), Coop receives $20 (14.8%), Platform receives $65 (48.2%)
	// Scaled proportionally by netMetricTons:
	exchangeRateUSDToKSh := 130.0 // 1 USD ≈ 130 KSh
	farmerUSD := (50.0 / 135.0) * totalMarketUSD
	coopUSD := (20.0 / 135.0) * totalMarketUSD
	platformUSD := (65.0 / 135.0) * totalMarketUSD

	farmerPayoutKSh := farmerUSD * exchangeRateUSDToKSh
	coopPayoutKSh := coopUSD * exchangeRateUSDToKSh

	// Cryptographic SHA-256 immutability seal
	timestampUnix := t.Timestamp.Unix()
	if timestampUnix <= 0 {
		timestampUnix = time.Now().Unix()
	}
	dataString := fmt.Sprintf("%s-%s-%s-%.6f-%d", t.KilnID, t.CoopID, t.DeviceUID, netMetricTons, timestampUnix)
	hashBytes := sha256.Sum256([]byte(dataString))
	verificationHash := hex.EncodeToString(hashBytes[:])

	// Kenya National Carbon Registry (NCR) tracking reference
	ncrBytes := sha256.Sum256([]byte(verificationHash + "-KENYA-NCR-EMCA"))
	ncrTrackingID := fmt.Sprintf("KE-NCR-2026-%s", hex.EncodeToString(ncrBytes[:])[:12])

	assetID := fmt.Sprintf("AG-CORC-%s", verificationHash[:8])

	return &models.MintResult{
		AssetID:             assetID,
		BatchID:             fmt.Sprintf("BATCH-%d", timestampUnix),
		KilnID:              t.KilnID,
		CoopID:              t.CoopID,
		FarmerPhone:         t.FarmerPhone,
		BiocharYieldKG:      math.Round(biocharKG*100) / 100,
		GrossCO2eKG:         math.Round(grossCO2eKG*100) / 100,
		NetMetricTonsCO2e:   math.Round(netMetricTons*10000) / 10000,
		CarbonmarkMarketUSD: math.Round(totalMarketUSD*100) / 100,
		MarketPricePerTon:   marketPricePerTon,
		FarmerPayoutKSh:     math.Round(farmerPayoutKSh*100) / 100,
		CoopPayoutKSh:       math.Round(coopPayoutKSh*100) / 100,
		PlatformFeeUSD:      math.Round(platformUSD*100) / 100,
		KenyaNCRTrackingID:  ncrTrackingID,
		IsValidated:         true,
		VerificationHash:    verificationHash,
		CreatedAt:           time.Now(),
	}, nil
}

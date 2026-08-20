package tests

import (
	"testing"
	"time"

	"github.com/angaguard/core-backend/internal/dmrv"
	"github.com/angaguard/core-backend/internal/models"
)

func TestValidBurnPhysics(t *testing.T) {
	packet := models.TelemetryPacket{
		DeviceUID:       "MCU-WAZIDEV-8FA1",
		KilnID:          "KILN-001",
		CoopID:          "COOP-KAKAMEGA-01",
		FarmerPhone:     "+254712345678",
		InitialHeightCM: 85.0,
		FinalHeightCM:   30.0, // 30 / 85 = 0.3529 (within 0.25 - 0.45 window)
		PeakOuterTempC:  58.5, // Outer skin within 40 - 75 deg C
		DurationMinutes: 45.0, // > 30 mins
		HeatingRate:     4.2,  // Within 1.2 - 15.0 deg C / min
		Timestamp:       time.Now(),
	}

	result, err := dmrv.EvaluateAndMintBatch(packet, 135.0)
	if err != nil {
		t.Fatalf("Expected valid burn to pass, but got error: %v", err)
	}

	if !result.IsValidated {
		t.Errorf("Expected IsValidated to be true")
	}

	// Height delta = 85 - 30 = 55 cm
	// BiocharKG = 55 * 1.45 = 79.75 kg
	expectedBiochar := 79.75
	if result.BiocharYieldKG != expectedBiochar {
		t.Errorf("Expected biochar %.2f kg, got %.2f kg", expectedBiochar, result.BiocharYieldKG)
	}

	if result.NetMetricTonsCO2e <= 0 {
		t.Errorf("Expected positive net metric tons CO2e, got %.4f", result.NetMetricTonsCO2e)
	}

	if result.FarmerPayoutKSh <= 0 {
		t.Errorf("Expected positive farmer payout in KSh, got %.2f", result.FarmerPayoutKSh)
	}
}

func TestAshCheatingDefense(t *testing.T) {
	// Ash Cheating: Unsealed vents cause white ash collapse (>90% loss, final height < 25%)
	packet := models.TelemetryPacket{
		DeviceUID:       "MCU-WAZIDEV-8FA1",
		KilnID:          "KILN-001",
		CoopID:          "COOP-KAKAMEGA-01",
		InitialHeightCM: 80.0,
		FinalHeightCM:   10.0, // 10 / 80 = 0.125 (< 0.25 threshold!)
		PeakOuterTempC:  60.0,
		DurationMinutes: 40.0,
		HeatingRate:     3.5,
		Timestamp:       time.Now(),
	}

	_, err := dmrv.EvaluateAndMintBatch(packet, 135.0)
	if err == nil {
		t.Fatalf("Expected Ash Cheating attack to be REJECTED, but it passed!")
	}
}

func TestSandPaddingDefense(t *testing.T) {
	// Sand Padding: Adversary fills barrel with rocks/sand, slowing thermal ramp rate (< 1.2 deg/min)
	packet := models.TelemetryPacket{
		DeviceUID:       "MCU-WAZIDEV-8FA1",
		KilnID:          "KILN-001",
		CoopID:          "COOP-KAKAMEGA-01",
		InitialHeightCM: 80.0,
		FinalHeightCM:   30.0,
		PeakOuterTempC:  55.0,
		DurationMinutes: 40.0,
		HeatingRate:     0.4, // Extremely slow ramp due to massive thermal heat sink!
		Timestamp:       time.Now(),
	}

	_, err := dmrv.EvaluateAndMintBatch(packet, 135.0)
	if err == nil {
		t.Fatalf("Expected Sand Padding attack to be REJECTED, but it passed!")
	}
}

func TestChamberCoreFusionDefense(t *testing.T) {
	// Outer conductive skin exceeds 75 deg C (incompatible with controlled pyrolysis)
	packet := models.TelemetryPacket{
		DeviceUID:       "MCU-WAZIDEV-8FA1",
		KilnID:          "KILN-001",
		CoopID:          "COOP-KAKAMEGA-01",
		InitialHeightCM: 80.0,
		FinalHeightCM:   30.0,
		PeakOuterTempC:  92.0, // Out of bounds!
		DurationMinutes: 45.0,
		HeatingRate:     4.0,
		Timestamp:       time.Now(),
	}

	_, err := dmrv.EvaluateAndMintBatch(packet, 135.0)
	if err == nil {
		t.Fatalf("Expected runaway thermal curve to be REJECTED, but it passed!")
	}
}

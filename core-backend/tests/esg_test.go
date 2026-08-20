package tests

import (
	"testing"

	"github.com/angaguard/core-backend/internal/esg"
	"github.com/angaguard/core-backend/internal/geofence"
	"github.com/angaguard/core-backend/internal/models"
)

func TestESGScorecardCalculation(t *testing.T) {
	sme := models.SMEProfile{
		ID:                 "SME-TEST-KIZITO",
		CompanyName:        "Kizito Grain Millers",
		Location:           "Eldoret",
		Industry:           "Flour Milling",
		Scope1DieselLiters: 10000.0, // 10000 * 2.68 / 1000 = 26.8 Tons
		Scope2GridKwh:      50000.0, // 50000 * 0.12 / 1000 = 6.0 Tons
		Scope3OffsetsTons:  20.0,    // 20.0 Tons Biochar mitigation
	}

	scorecard := esg.CalculateScorecard(sme)

	expectedScope1 := 26.8
	expectedScope2 := 6.0
	expectedGross := 32.8
	expectedNet := 12.8 // 32.8 - 20.0 = 12.8 Tons

	if scorecard.Scope1DirectTons != expectedScope1 {
		t.Errorf("Expected Scope 1 %.2f, got %.2f", expectedScope1, scorecard.Scope1DirectTons)
	}
	if scorecard.Scope2IndirectTons != expectedScope2 {
		t.Errorf("Expected Scope 2 %.2f, got %.2f", expectedScope2, scorecard.Scope2IndirectTons)
	}
	if scorecard.GrossEmissionsTons != expectedGross {
		t.Errorf("Expected Gross %.2f, got %.2f", expectedGross, scorecard.GrossEmissionsTons)
	}
	if scorecard.NetCarbonFootprint != expectedNet {
		t.Errorf("Expected Net %.2f, got %.2f", expectedNet, scorecard.NetCarbonFootprint)
	}
	if scorecard.Grade != "A" { // Net < 15 is grade 'A'
		t.Errorf("Expected Grade 'A', got '%s'", scorecard.Grade)
	}
}

func TestGeofenceSpatialTemporalBreach(t *testing.T) {
	coop := models.Cooperative{
		ID:            "COOP-KAKAMEGA-01",
		CenterLat:     0.2827,
		CenterLng:     34.7519,
		RadiusKM:      20.0,
		AllowedTowers: []string{"SAF-TOWER-KKM-04"},
	}

	// Legitimate burn inside coop radius
	validPacket := models.TelemetryPacket{
		DeviceUID:   "MCU-001",
		KilnID:      "KILN-001",
		Latitude:    0.2830,
		Longitude:   34.7520,
		CellTowerID: "SAF-TOWER-KKM-04",
	}

	if err := geofence.ValidateSpatialTemporalFence(validPacket, coop, "MCU-001"); err != nil {
		t.Fatalf("Expected valid location to pass, got: %v", err)
	}

	// Stolen hardware burn far away in Nairobi (1.2921 S, 36.8219 E ~ 300km away)
	stolenPacket := models.TelemetryPacket{
		DeviceUID:   "MCU-001",
		KilnID:      "KILN-001",
		Latitude:    -1.2921,
		Longitude:   36.8219,
		CellTowerID: "SAF-TOWER-KKM-04",
	}

	if err := geofence.ValidateSpatialTemporalFence(stolenPacket, coop, "MCU-001"); err == nil {
		t.Fatalf("Expected stolen hardware burn outside radius to be REJECTED, but it passed!")
	}
}

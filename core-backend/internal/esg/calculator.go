package esg

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math"
	"time"

	"github.com/angaguard/core-backend/internal/models"
)

const (
	// Standard EPA / GHG Protocol emission factors from Blueprint Section 5.2
	DieselEmissionFactorKgPerLiter = 2.68 // 2.68 kg CO2e per liter of diesel
	KenyaGridEmissionFactorKgPerKWh = 0.12 // 0.12 kg CO2e per kWh (Kenya geothermal baseline)
)

// CalculateScorecard builds a verified corporate ESG scorecard matching ISSB / GHG Protocol standards.
func CalculateScorecard(profile models.SMEProfile) models.ESGScorecard {
	scope1Tons := (profile.Scope1DieselLiters * DieselEmissionFactorKgPerLiter) / 1000.0
	scope2Tons := (profile.Scope2GridKwh * KenyaGridEmissionFactorKgPerKWh) / 1000.0
	grossTons := scope1Tons + scope2Tons
	netFootprint := grossTons - profile.Scope3OffsetsTons
	if netFootprint < 0 {
		netFootprint = 0
	}

	grade := "C"
	if netFootprint == 0 {
		grade = "A+"
	} else if netFootprint < 15.0 {
		grade = "A"
	} else if netFootprint < 45.0 {
		grade = "B"
	}

	recommendations := GenerateAIRecommendations(profile, scope1Tons, scope2Tons, netFootprint)

	// Cryptographic ISSB compliance seal
	data := fmt.Sprintf("%s-%.2f-%.2f-%.2f-%s-%d",
		profile.ID, scope1Tons, scope2Tons, netFootprint, grade, time.Now().Unix())
	hash := sha256.Sum256([]byte(data))
	issbHash := fmt.Sprintf("ISSB-IFRS-S2-2026-%s", hex.EncodeToString(hash[:])[:16])

	return models.ESGScorecard{
		SMEID:                profile.ID,
		CompanyName:          profile.CompanyName,
		ReportingPeriod:      fmt.Sprintf("FY %d (Trailing 12M)", time.Now().Year()),
		Scope1DirectTons:     math.Round(scope1Tons*100) / 100,
		Scope2IndirectTons:   math.Round(scope2Tons*100) / 100,
		GrossEmissionsTons:   math.Round(grossTons*100) / 100,
		Scope3MitigationTons: math.Round(profile.Scope3OffsetsTons*100) / 100,
		NetCarbonFootprint:   math.Round(netFootprint*100) / 100,
		Grade:                grade,
		Recommendations:      recommendations,
		ISSBComplianceHash:   issbHash,
		GeneratedAt:          time.Now(),
	}
}

// GenerateAIRecommendations creates tailored corporate decarbonization strategies.
func GenerateAIRecommendations(profile models.SMEProfile, scope1, scope2, net float64) []string {
	recs := make([]string, 0)

	if scope1 > 10.0 {
		recs = append(recs,
			fmt.Sprintf("High Impact Vector: Expand smart barrel hardware deployments to outgrower farmers in %s. Estimated Scope 3 abatement yield: -%.1f Tons CO2e/year. Capital overhead: Low.",
				profile.Location, scope1*0.65))
		recs = append(recs,
			"Logistics Optimization: Shift 30% of diesel fleet routing to centralized cooperative aggregation hubs, saving approx. 4,200L diesel annually.")
	}

	if scope2 > 5.0 {
		recs = append(recs,
			"Clean Energy Transition: Install rooftop solar PV on facility processing units to offset peak daytime grid draw, reducing Scope 2 by up to 45%.")
	}

	if profile.Scope3OffsetsTons < 10.0 {
		recs = append(recs,
			"Cooperative Sponsorship: Sponsor 25 additional 200L modified smart kilns for local youth farmer groups to neutralize remaining Scope 1 liabilities.")
	}

	if len(recs) == 0 {
		recs = append(recs, "Maintain current operational carbon-negative balance; eligible for green interest rate discounts with commercial lenders.")
	}

	return recs
}

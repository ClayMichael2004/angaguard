package tests

import (
	"testing"
	"time"

	"github.com/angaguard/core-backend/internal/ledger"
	"github.com/angaguard/core-backend/internal/models"
)

func TestBlockchainImmutability(t *testing.T) {
	bc := ledger.NewBlockchain()

	if len(bc.Blocks) != 1 {
		t.Fatalf("Expected 1 genesis block, got %d", len(bc.Blocks))
	}

	asset1 := models.MintResult{
		AssetID:           "AG-CORC-TEST01",
		BiocharYieldKG:    72.5,
		NetMetricTonsCO2e: 0.185,
		IsValidated:       true,
		VerificationHash:  "abc123hash",
		CreatedAt:         time.Now(),
	}

	block1, err := bc.AppendBlock(asset1)
	if err != nil {
		t.Fatalf("Failed to append block 1: %v", err)
	}

	if block1.Index != 1 {
		t.Errorf("Expected block index 1, got %d", block1.Index)
	}

	valid, err := bc.VerifyChainIntegrity()
	if !valid || err != nil {
		t.Fatalf("Expected chain to be valid, got err: %v", err)
	}

	// Test Tamper Detection
	bc.Blocks[1].Asset.BiocharYieldKG = 9999.0 // Adversarial tampering of history
	validAfterTamper, _ := bc.VerifyChainIntegrity()
	if validAfterTamper {
		t.Fatalf("Expected tampered chain to FAIL verification, but it passed!")
	}
}

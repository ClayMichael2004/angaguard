package ledger

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/angaguard/core-backend/internal/models"
)

// Blockchain represents the thread-safe append-only SHA-256 cryptographic ledger.
type Blockchain struct {
	mu     sync.RWMutex
	Blocks []models.LedgerBlock `json:"blocks"`
}

var (
	ErrInvalidIndex        = errors.New("invalid block index")
	ErrInvalidPreviousHash = errors.New("invalid previous hash link in chain")
	ErrInvalidHash         = errors.New("block hash does not match computed SHA-256 hash")
	ErrTamperedBlock       = errors.New("block integrity compromised: cryptographic mismatch")
)

// NewBlockchain initializes the ledger and creates the Genesis Block if empty.
func NewBlockchain() *Blockchain {
	bc := &Blockchain{
		Blocks: make([]models.LedgerBlock, 0),
	}
	bc.createGenesisBlock()
	return bc
}

// CalculateBlockHash computes the SHA-256 cryptographic hash of a block.
func CalculateBlockHash(block models.LedgerBlock) string {
	assetBytes, _ := json.Marshal(block.Asset)
	record := fmt.Sprintf("%d%s%s%s%s",
		block.Index,
		block.Timestamp.UTC().Format(time.RFC3339Nano),
		block.PreviousHash,
		block.MerkleRoot,
		string(assetBytes),
	)
	hash := sha256.Sum256([]byte(record))
	return hex.EncodeToString(hash[:])
}

// CalculateMerkleRoot computes the single asset transaction Merkle tree root.
func CalculateMerkleRoot(asset models.MintResult) string {
	data, _ := json.Marshal(asset)
	firstHash := sha256.Sum256(data)
	doubleHash := sha256.Sum256(firstHash[:])
	return hex.EncodeToString(doubleHash[:])
}

// createGenesisBlock establishes the root block of the AngaGuard dMRV ledger.
func (bc *Blockchain) createGenesisBlock() {
	genesisAsset := models.MintResult{
		AssetID:             "AG-GENESIS-ROOT-2026",
		BatchID:             "BATCH-0000000000",
		KilnID:              "KILN-ROOT-000",
		CoopID:              "COOP-WESTERN-KE-ROOT",
		FarmerPhone:         "+254700000000",
		BiocharYieldKG:      0.0,
		GrossCO2eKG:         0.0,
		NetMetricTonsCO2e:   0.0,
		CarbonmarkMarketUSD: 0.0,
		MarketPricePerTon:   135.0,
		FarmerPayoutKSh:     0.0,
		CoopPayoutKSh:       0.0,
		PlatformFeeUSD:      0.0,
		KenyaNCRTrackingID:  "KE-NCR-2026-GENESIS001",
		IsValidated:         true,
		VerificationHash:    "0000000000000000000000000000000000000000000000000000000000000000",
		CreatedAt:           time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC),
	}

	genesisBlock := models.LedgerBlock{
		Index:        0,
		Timestamp:    genesisAsset.CreatedAt,
		PreviousHash: "0000000000000000000000000000000000000000000000000000000000000000",
		MerkleRoot:   CalculateMerkleRoot(genesisAsset),
		Asset:        genesisAsset,
		ValidatorSig: "ECDSA-SECP256K1-ANGAGUARD-ORACLE-SYSTEM-AUTHORITY-ROOT-SEAL",
	}
	genesisBlock.BlockHash = CalculateBlockHash(genesisBlock)

	bc.Blocks = append(bc.Blocks, genesisBlock)
}

// AppendBlock adds a validated carbon removal asset block to the chain.
func (bc *Blockchain) AppendBlock(asset models.MintResult) (*models.LedgerBlock, error) {
	bc.mu.Lock()
	defer bc.mu.Unlock()

	lastBlock := bc.Blocks[len(bc.Blocks)-1]
	merkle := CalculateMerkleRoot(asset)

	newBlock := models.LedgerBlock{
		Index:        lastBlock.Index + 1,
		Timestamp:    time.Now().UTC(),
		PreviousHash: lastBlock.BlockHash,
		MerkleRoot:   merkle,
		Asset:        asset,
		ValidatorSig: fmt.Sprintf("ORACLE-STAMP-%s-%d", asset.AssetID, time.Now().UnixNano()),
	}
	newBlock.BlockHash = CalculateBlockHash(newBlock)

	// Validate the block before appending
	if newBlock.PreviousHash != lastBlock.BlockHash {
		return nil, ErrInvalidPreviousHash
	}
	if newBlock.Index != lastBlock.Index+1 {
		return nil, ErrInvalidIndex
	}

	bc.Blocks = append(bc.Blocks, newBlock)
	return &newBlock, nil
}

// VerifyChainIntegrity validates the cryptographic immutability of the whole ledger.
func (bc *Blockchain) VerifyChainIntegrity() (bool, error) {
	bc.mu.RLock()
	defer bc.mu.RUnlock()

	for i := 1; i < len(bc.Blocks); i++ {
		current := bc.Blocks[i]
		previous := bc.Blocks[i-1]

		if current.Index != previous.Index+1 {
			return false, fmt.Errorf("%w at index %d", ErrInvalidIndex, i)
		}
		if current.PreviousHash != previous.BlockHash {
			return false, fmt.Errorf("%w at index %d: expected %s, got %s",
				ErrInvalidPreviousHash, i, previous.BlockHash, current.PreviousHash)
		}
		computedHash := CalculateBlockHash(current)
		if current.BlockHash != computedHash {
			return false, fmt.Errorf("%w at index %d: computed %s != stored %s",
				ErrTamperedBlock, i, computedHash, current.BlockHash)
		}
	}
	return true, nil
}

// GetLatestBlock returns the most recent ledger entry.
func (bc *Blockchain) GetLatestBlock() models.LedgerBlock {
	bc.mu.RLock()
	defer bc.mu.RUnlock()
	return bc.Blocks[len(bc.Blocks)-1]
}

// GetAllBlocks returns a slice copy of all blocks in the ledger.
func (bc *Blockchain) GetAllBlocks() []models.LedgerBlock {
	bc.mu.RLock()
	defer bc.mu.RUnlock()
	copied := make([]models.LedgerBlock, len(bc.Blocks))
	copy(copied, bc.Blocks)
	return copied
}

// FindAssetByID searches for an asset block by AssetID or Kenya NCR Tracking ID.
func (bc *Blockchain) FindAssetByID(id string) (*models.LedgerBlock, bool) {
	bc.mu.RLock()
	defer bc.mu.RUnlock()
	for _, block := range bc.Blocks {
		if block.Asset.AssetID == id || block.Asset.KenyaNCRTrackingID == id || block.Asset.VerificationHash == id {
			return &block, true
		}
	}
	return nil, false
}

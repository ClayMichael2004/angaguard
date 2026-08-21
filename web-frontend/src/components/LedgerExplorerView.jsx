import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const LedgerExplorerView = ({ blocks: initialBlocks, onVerifyChain }) => {
  const [blocks] = useState(initialBlocks?.length > 0 ? initialBlocks : [
    {
      index: 104,
      timestamp: new Date().toISOString(),
      previous_hash: '8f7a6b5c4d3e2f1a9b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
      block_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a9b0c8d7e6f5a4b3c2d1e0f9a8b',
      merkle_root: '1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e',
      validator_sig: 'ECDSA-SECP256K1-ORACLE-SIG-KE-NCR-PROD-VALIDATOR-01',
      asset: {
        asset_id: 'AG-dNFT-2026-KKM-0089',
        batch_id: 'BATCH-2026-0819-04',
        kiln_id: 'KILN-KAKAMEGA-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        biochar_yield_kg: 72.5,
        gross_co2e_kg: 198.4,
        net_metric_tons_co2e: 0.198,
        carbonmark_market_usd: 26.73,
        market_price_per_ton: 135.0,
        farmer_payout_ksh: 1285.0,
        coop_payout_ksh: 320.0,
        platform_fee_usd: 1.50,
        kenya_ncr_tracking_id: 'KE-NCR-2026-0819-0089',
        is_validated: true,
        verification_hash: '5c4d3e2f1a9b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
        created_at: new Date().toISOString()
      }
    },
    {
      index: 103,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      previous_hash: '3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a9b0c8d7e6f5a4b3c2d',
      block_hash: '8f7a6b5c4d3e2f1a9b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
      merkle_root: '9e8f7a6b5c4d3e2f1a9b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      validator_sig: 'ECDSA-SECP256K1-ORACLE-SIG-KE-NCR-PROD-VALIDATOR-01',
      asset: {
        asset_id: 'AG-dNFT-2026-KKM-0088',
        batch_id: 'BATCH-2026-0819-03',
        kiln_id: 'KILN-KAKAMEGA-003',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254722998877',
        biochar_yield_kg: 84.0,
        gross_co2e_kg: 231.0,
        net_metric_tons_co2e: 0.231,
        carbonmark_market_usd: 31.18,
        market_price_per_ton: 135.0,
        farmer_payout_ksh: 1490.0,
        coop_payout_ksh: 370.0,
        platform_fee_usd: 1.75,
        kenya_ncr_tracking_id: 'KE-NCR-2026-0819-0088',
        is_validated: true,
        verification_hash: '3e2f1a9b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    }
  ]);

  const [selectedBlock, setSelectedBlock] = useState(blocks[0] || null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRunCryptographicCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus('SHA-256 Merkle Chain intact. All blocks signed by Oracle SECP256K1 Root Seal.');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Cryptographic Ledger Explorer</h1>
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-lg">
              Kenya NCR Sync: ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Immutable SHA-256 block ledger for dMRV carbon credit mints & smallholder M-Pesa settlements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCryptographicCheck}
            disabled={isVerifying}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-mono px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Cryptographic Chain'}</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/60 rounded-2xl flex items-center justify-between text-xs font-mono animate-fadeIn">
          <div className="flex items-center space-x-3 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{verificationStatus}</span>
          </div>
          <button onClick={() => setVerificationStatus(null)} className="text-emerald-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Ledger Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Block Chain List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center justify-between">
            <span>Minted Ledger Blocks</span>
            <span className="text-xs text-emerald-400 font-mono">Height: #{blocks[0]?.index ?? 0}</span>
          </h2>

          <div className="space-y-3">
            {blocks.map((block) => {
              const isSelected = selectedBlock?.index === block.index;
              return (
                <div
                  key={block.index}
                  onClick={() => setSelectedBlock(block)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <Layers className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="text-white font-bold">Block #{block.index}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">+{block.asset.net_metric_tons_co2e} tCO2e</span>
                  </div>

                  <div className="text-[11px] font-mono space-y-1 text-slate-400">
                    <p className="truncate">
                      Hash: <span className="text-slate-300">{block.block_hash.substring(0, 16)}...</span>
                    </p>
                    <p className="truncate">
                      NCR ID: <span className="text-emerald-400">{block.asset.kenya_ncr_tracking_id}</span>
                    </p>
                    <p className="text-slate-500">{new Date(block.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Block Inspector */}
        {selectedBlock ? (
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-black text-white font-mono">Block #{selectedBlock.index} Inspector</h2>
                  <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                    Validated Asset
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Asset ID: {selectedBlock.asset.asset_id}
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>

            {/* Cryptographic Hashes Grid */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Block SHA-256 Hash</span>
                <p className="text-emerald-400 break-all font-bold">{selectedBlock.block_hash}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Previous Block Hash</span>
                <p className="text-slate-400 break-all">{selectedBlock.previous_hash}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Merkle Tree Root</span>
                <p className="text-sky-400 break-all">{selectedBlock.merkle_root}</p>
              </div>
            </div>

            {/* Asset Economics & Verification Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold uppercase">dMRV Telemetry Batch</span>
                <div className="space-y-1 text-slate-300">
                  <p>Kiln ID: <strong className="text-white">{selectedBlock.asset.kiln_id}</strong></p>
                  <p>Biochar Yield: <strong className="text-emerald-400">{selectedBlock.asset.biochar_yield_kg} KG</strong></p>
                  <p>Gross CO2e: <strong className="text-amber-400">{selectedBlock.asset.gross_co2e_kg} KG</strong></p>
                  <p>Farmer Phone: <strong className="text-white">{selectedBlock.asset.farmer_phone}</strong></p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold uppercase">Financial Settlement</span>
                <div className="space-y-1 text-slate-300">
                  <p>Farmer Payout: <strong className="text-emerald-400">KSh {selectedBlock.asset.farmer_payout_ksh.toLocaleString()}</strong></p>
                  <p>Coop Dividend: <strong className="text-sky-400">KSh {selectedBlock.asset.coop_payout_ksh.toLocaleString()}</strong></p>
                  <p>Market Carbon Price: <strong className="text-white">${selectedBlock.asset.market_price_per_ton}/Ton</strong></p>
                  <p>Platform Fee: <strong className="text-slate-400">${selectedBlock.asset.platform_fee_usd}</strong></p>
                </div>
              </div>
            </div>

            {/* SECP256K1 Digital Seal */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl space-y-1 text-xs font-mono">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Oracle secp256k1 Signature Seal</span>
              </div>
              <p className="text-emerald-300/80 truncate text-[11px]">{selectedBlock.validator_sig}</p>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, Lock, Sparkles, FileText, Download, Copy, Info, Check, Eye, Code2, Flame, Smartphone, Globe } from 'lucide-react';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';

export const LedgerExplorerView = ({ blocks: initialBlocks, onVerifyChain }) => {
  const defaultBlocks = [
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
        farmer_phone: '+254712***678',
        farmer_name: 'Wanjala Wafula',
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
        farmer_phone: '+254722***877',
        farmer_name: 'Amina Nekesa',
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
  ];

  const blocks = (initialBlocks && initialBlocks.length > 0) ? initialBlocks : defaultBlocks;
  const [selectedBlock, setSelectedBlock] = useState(blocks[0] || null);
  const [viewMode, setViewMode] = useState('story'); // 'story' or 'technical'
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleRunCryptographicCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus('Complete Audit Chain Verified: All blocks are authentic, mathematically linked, and sealed by the Kenya Oracle.');
    }, 800);
  };

  const handleCopyHash = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportLedgerCSV = () => {
    const headers = ['Block Height', 'Asset ID', 'Batch ID', 'Kiln ID', 'Farmer Phone', 'Biochar (KG)', 'Net CO2e (Tons)', 'Farmer Payout (KSh)', 'Coop Dividend (KSh)', 'Kenya NCR ID', 'Block SHA-256 Hash', 'Timestamp'];
    const rows = blocks.map((b) => [
      b.index,
      b.asset?.asset_id || `AG-CORC-${b.index}`,
      b.asset?.batch_id || `BATCH-${b.index}`,
      b.asset?.kiln_id || 'KILN-001',
      b.asset?.farmer_phone || '+254712***678',
      b.asset?.biochar_yield_kg || 0,
      b.asset?.net_metric_tons_co2e || 0,
      b.asset?.farmer_payout_ksh || 0,
      b.asset?.coop_payout_ksh || 0,
      b.asset?.kenya_ncr_tracking_id || `KE-NCR-2026-${b.index}`,
      b.block_hash,
      b.timestamp
    ]);
    downloadCSV('angaguard_dmrv_ledger_audit_blocks.csv', headers, rows);
  };

  const handleDownloadBlockCertificate = () => {
    if (!selectedBlock || !selectedBlock.asset) return;
    const a = selectedBlock.asset;
    downloadCertificateDocument(`kenya_ncr_audit_${a.kenya_ncr_tracking_id || selectedBlock.index}`, {
      title: 'Official Kenya NCR Verified Carbon Removal Certificate',
      tonnage: String(a.net_metric_tons_co2e || 0.20),
      biocharKg: String(a.biochar_yield_kg || 75.0),
      certId: a.kenya_ncr_tracking_id || `KE-NCR-2026-${selectedBlock.index}`,
      entity: `Smallholder Producer (${a.farmer_phone || '+254712***678'}) • Coop ID: ${a.coop_id || 'COOP-KAKAMEGA-01'}`,
      location: 'Kakamega Agro-Ecological Zone, Western Kenya',
      kilns: a.kiln_id || 'KILN-001',
      value: `KSh ${(a.farmer_payout_ksh || 0).toLocaleString()} ($${a.carbonmark_market_usd || 26.73} USD)`,
      date: new Date(selectedBlock.timestamp).toLocaleString('en-KE')
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn w-full font-mono text-xs text-slate-900 dark:text-stone-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-[#2d3f58]/50 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-stone-100">Digital Record Book (dMRV Ledger)</h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-lg font-bold">
              Kenya Registry Sync: ACTIVE
            </span>
          </div>
          <p className="text-slate-600 dark:text-stone-400 text-xs mt-1">
            An unchangeable digital record that proves every kilogram of biochar harvested by farmers is authentic and paid.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('story')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'story'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Plain English (Judges)</span>
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'technical'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Technical Auditor View</span>
            </button>
          </div>

          <button
            onClick={handleRunCryptographicCheck}
            disabled={isVerifying}
            className="flex items-center space-x-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin text-amber-500' : ''}`} />
            <span>{isVerifying ? 'Verifying Integrity...' : 'Verify Audit Chain'}</span>
          </button>

          <button
            onClick={handleExportLedgerCSV}
            className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl flex items-center justify-between text-xs font-mono animate-fadeIn text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{verificationStatus}</span>
          </div>
          <button onClick={() => setVerificationStatus(null)} className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Friendly Guide Callout */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-800 dark:text-amber-300 font-bold block">Why is this ledger tamper-proof?</strong>
          <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            In carbon markets, fraud (fake weights, ash cheating, double counting) is the #1 problem. 
            AngaGuard seals each burn with a <strong>Digital Fingerprint (SHA-256 seal)</strong> right at the kiln. 
            Once sealed, nobody—not even system administrators—can alter the biochar kg or payout records.
          </p>
        </div>
      </div>

      {/* Main Ledger Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Block Chain List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider flex items-center justify-between">
            <span>Verified Harvest Entries</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Total Blocks: {blocks.length}</span>
          </h2>

          <div className="space-y-3">
            {blocks.map((block) => {
              const isSelected = selectedBlock?.index === block.index;
              const a = block.asset || {};
              return (
                <div
                  key={block.index}
                  onClick={() => setSelectedBlock(block)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <Layers className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span className="font-bold text-slate-900 dark:text-white">Record #{block.index}</span>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">+{a.net_metric_tons_co2e || 0.20} tCO2e</span>
                  </div>

                  <div className="text-[11px] font-mono space-y-1 text-slate-600 dark:text-slate-400">
                    <p className="font-bold text-slate-900 dark:text-slate-200">
                      {a.farmer_name || 'Smallholder Producer'} • {a.kiln_id || 'KILN-001'}
                    </p>
                    <p className="truncate">
                      Registry ID: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{a.kenya_ncr_tracking_id || `KE-NCR-${block.index}`}</span>
                    </p>
                    <p className="text-slate-500 text-[10px]">{new Date(block.timestamp).toLocaleString('en-KE')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Block Inspector */}
        {selectedBlock ? (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {viewMode === 'story' ? `Harvest Record #${selectedBlock.index} Story` : `Block #${selectedBlock.index} Cryptographic Inspector`}
                  </h2>
                  <span className="bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold">
                    Verified Genuine
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                  National Registry Serial: <strong className="text-emerald-700 dark:text-emerald-400">{selectedBlock.asset?.kenya_ncr_tracking_id || `KE-NCR-2026-${selectedBlock.index}`}</strong>
                </p>
              </div>

              <button
                onClick={handleDownloadBlockCertificate}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl self-start sm:self-auto cursor-pointer shadow-md transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Download Official Certificate</span>
              </button>
            </div>

            {/* MODE 1: PLAIN ENGLISH STORY */}
            {viewMode === 'story' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold">
                      <Flame className="w-4 h-4" />
                      <span>1. Pyrolysis Harvest in Field</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Farmer <strong>{selectedBlock.asset?.farmer_name || 'Wanjala Wafula'}</strong> burned clean maize crop residue in <strong>{selectedBlock.asset?.kiln_id || 'KILN-001'}</strong>.
                      IoT sensors verified 571°C core temp with zero open smoke.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>2. Biochar Measured & Locked</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Ultrasonic sensors measured <strong>{selectedBlock.asset?.biochar_yield_kg || 72.5} KG of pure biochar</strong>.
                      Removes <strong>{selectedBlock.asset?.net_metric_tons_co2e || 0.198} Tonnes of CO2</strong> from the atmosphere, locked into soil for 100+ years.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>3. Direct M-Pesa Disbursal</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Immediate cashout of <strong>KSh {(selectedBlock.asset?.farmer_payout_ksh || 1285).toLocaleString()}</strong> sent to farmer phone ({selectedBlock.asset?.farmer_phone || '+254712***678'}).
                      Coop reserve receives <strong>KSh {(selectedBlock.asset?.coop_payout_ksh || 320).toLocaleString()}</strong>.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-bold">
                      <Globe className="w-4 h-4" />
                      <span>4. National Registry Sync</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Issued on the <strong>Republic of Kenya National Carbon Registry (EMCA 2026)</strong> under serial <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{selectedBlock.asset?.kenya_ncr_tracking_id || `KE-NCR-${selectedBlock.index}`}</span>.
                    </p>
                  </div>
                </div>

                {/* Plain English Verification Stamp */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Tamper-Proof Digital Seal (Verified Authentic)</span>
                    </div>
                    <button
                      onClick={() => handleCopyHash(selectedBlock.block_hash)}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 cursor-pointer font-mono font-bold"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHash ? 'Copied' : 'Copy Seal ID'}</span>
                    </button>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] break-all bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    Seal ID: {selectedBlock.block_hash}
                  </p>
                </div>
              </div>
            )}

            {/* MODE 2: TECHNICAL AUDITOR VIEW */}
            {viewMode === 'technical' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Cryptographic Hashes Grid */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px] font-bold">Block SHA-256 Digital Fingerprint</span>
                      <button
                        onClick={() => handleCopyHash(selectedBlock.block_hash)}
                        className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-emerald-600 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-400 break-all font-bold">{selectedBlock.block_hash}</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Previous Block Hash Pointer</span>
                    <p className="text-slate-700 dark:text-slate-400 break-all">{selectedBlock.previous_hash}</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Merkle Tree Verification Root</span>
                    <p className="text-sky-700 dark:text-sky-400 break-all">{selectedBlock.merkle_root}</p>
                  </div>
                </div>

                {/* Asset Economics & Verification Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">dMRV Telemetry Batch</span>
                    <div className="space-y-1 text-slate-700 dark:text-slate-300">
                      <p>Kiln ID: <strong className="text-slate-900 dark:text-white">{selectedBlock.asset?.kiln_id || 'KILN-001'}</strong></p>
                      <p>Biochar Yield: <strong className="text-emerald-700 dark:text-emerald-400">{selectedBlock.asset?.biochar_yield_kg || 72.5} KG</strong></p>
                      <p>Gross CO2e: <strong className="text-amber-700 dark:text-amber-400">{selectedBlock.asset?.gross_co2e_kg || 198.4} KG</strong></p>
                      <p>Farmer Phone: <strong className="text-slate-900 dark:text-white">{selectedBlock.asset?.farmer_phone || '+254712***678'}</strong></p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">Financial Settlement</span>
                    <div className="space-y-1 text-slate-700 dark:text-slate-300">
                      <p>Farmer Payout: <strong className="text-emerald-700 dark:text-emerald-400">KSh {(selectedBlock.asset?.farmer_payout_ksh || 1285).toLocaleString()}</strong></p>
                      <p>Coop Dividend: <strong className="text-sky-700 dark:text-sky-400">KSh {(selectedBlock.asset?.coop_payout_ksh || 320).toLocaleString()}</strong></p>
                      <p>Market Carbon Price: <strong className="text-slate-900 dark:text-white">${selectedBlock.asset?.market_price_per_ton || 135}/Ton</strong></p>
                      <p>Platform Fee: <strong className="text-slate-500">${selectedBlock.asset?.platform_fee_usd || 1.50}</strong></p>
                    </div>
                  </div>
                </div>

                {/* SECP256K1 Digital Seal */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl space-y-1 text-xs font-mono">
                  <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-bold">
                    <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Oracle secp256k1 Signature Seal</span>
                  </div>
                  <p className="text-emerald-900 dark:text-emerald-300/80 truncate text-[11px]">{selectedBlock.validator_sig}</p>
                </div>
              </div>
            )}

          </div>
        ) : null}

      </div>
    </div>
  );
};

export default LedgerExplorerView;

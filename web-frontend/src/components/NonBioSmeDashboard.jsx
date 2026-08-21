import React, { useState } from 'react';
import { ShoppingCart, BarChart2, CheckCircle2, ArrowUpRight, Building2, ShieldCheck, Download, Lock, Smartphone, AlertCircle, X, History, FileText, ArrowLeft, Check, RefreshCw, Layers } from 'lucide-react';
import { LineGraph } from './LineGraph';
import { LedgerExplorerView } from './LedgerExplorerView';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';

export const NonBioSmeDashboard = ({ theme, activeSection = 'overview', setActiveSection }) => {
  const [smeProfile, setSmeProfile] = useState({
    name: 'East Africa Express Fleet Freight Ltd',
    location: 'Nairobi Inland Port Depot',
    tax_pin: 'P051882910M',
    gross_liability: 62.7,
    retired_credits: 20.0,
  });

  const [internalViewMode, setInternalViewMode] = useState('dashboard'); // 'dashboard', 'procure', 'ledger'
  const viewMode = activeSection === 'procure' ? 'procure' : activeSection === 'ledger' ? 'ledger' : internalViewMode;
  const setViewMode = (mode) => {
    setInternalViewMode(mode);
    if (setActiveSection) {
      setActiveSection(mode);
    }
  };

  const [coopCreditPools] = useState([
    { id: 'POOL-KAKAMEGA', coopName: 'Kakamega Smallholder Sugarcane Coop', availableCredits: 62.4, biocharMassKg: 28450, pricePerTon: 135, region: 'Western Kenya', ncrId: 'KE-NCR-2026-KKM-01', rating: 'AAA (Biochar)' },
    { id: 'POOL-KISUMU', coopName: 'Kisumu Rice Farmers Cooperative Union', availableCredits: 52.0, biocharMassKg: 23660, pricePerTon: 132, region: 'Lake Basin Zone', ncrId: 'KE-NCR-2026-KSM-04', rating: 'AAA (Rice Husk Char)' },
    { id: 'POOL-ELDORET', coopName: 'Eldoret Grain Growers Network', availableCredits: 29.4, biocharMassKg: 13380, pricePerTon: 138, region: 'Rift Valley Region', ncrId: 'KE-NCR-2026-ELD-09', rating: 'AA (Maize Cob Char)' },
  ]);

  // Line Graph: Price Fluctuation Range ($35 - $145 / tCO2e)
  const priceFluctuationsLine = [
    { x: '08:00', y: 130 },
    { x: '10:00', y: 132 },
    { x: '12:00', y: 136 },
    { x: '14:00', y: 134 },
    { x: '16:00', y: 135 },
  ];

  // Historic Retirement Orders Trail
  const [retirementHistory, setRetirementHistory] = useState([
    { id: 'ORD-9912', date: '2026-08-18', pool: 'Kakamega Smallholder Sugarcane Coop', tons: 10.0, priceUsd: 1350, priceKsh: 175500, scope: 'Scope 1 Fleet Diesel', certId: 'KE-NCR-2026-RET-881920', status: 'SETTLED & RETIRED' },
    { id: 'ORD-8821', date: '2026-08-04', pool: 'Kisumu Rice Farmers Cooperative Union', tons: 10.0, priceUsd: 1320, priceKsh: 171600, scope: 'Scope 2 Warehouse Grid', certId: 'KE-NCR-2026-RET-771829', status: 'SETTLED & RETIRED' },
  ]);

  // Multi-step Full-Page Procurement State
  const [buyStep, setBuyStep] = useState(1); // 1: Volume & Cost, 2: Scope Purpose, 3: Billing Info, 4: PIN 2FA, 5: Settlement Voucher
  const [selectedPool, setSelectedPool] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(5.0);
  const [retirementScope, setRetirementScope] = useState('Scope 1: Logistics Diesel Fleet');
  const [billingInfo, setBillingInfo] = useState({
    companyName: 'East Africa Express Fleet Freight Ltd',
    taxPin: 'P051882910M',
    paymentMethod: 'Daraja M-Pesa Express Corporate',
    contactEmail: 'esg-compliance@ea-expressfreight.co.ke'
  });
  const [corporatePin, setCorporatePin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [settledOrder, setSettledOrder] = useState(null);

  const handleStartProcurement = (pool = null) => {
    setSelectedPool(pool || coopCreditPools[0]);
    setPurchaseAmount(5.0);
    setBuyStep(1);
    setCorporatePin('');
    setPinError('');
    setViewMode('procure');
  };

  const handleExecuteCorporateBuy = () => {
    if (corporatePin.length !== 4 || isNaN(Number(corporatePin))) {
      setPinError('Please enter a valid 4-digit Corporate Authorization PIN (Demo: 8888)');
      return;
    }
    setPinError('');
    setIsProcessingBuy(true);

    setTimeout(() => {
      setIsProcessingBuy(false);
      const certId = `KE-NCR-2026-RET-${Math.floor(100000 + Math.random() * 900000)}`;
      const unitPrice = selectedPool ? selectedPool.pricePerTon : 135;
      const totalUsd = purchaseAmount * unitPrice;
      const totalKsh = totalUsd * 130;

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        pool: selectedPool ? selectedPool.coopName : 'Carbonmark Open Pool',
        tons: purchaseAmount,
        priceUsd: totalUsd,
        priceKsh: totalKsh,
        scope: retirementScope,
        certId,
        status: 'SETTLED & RETIRED',
      };

      setRetirementHistory([newOrder, ...retirementHistory]);
      setSmeProfile({
        ...smeProfile,
        retired_credits: Number((smeProfile.retired_credits + purchaseAmount).toFixed(2)),
      });

      setSettledOrder({
        ...newOrder,
        companyName: billingInfo.companyName,
        taxPin: billingInfo.taxPin,
        timestamp: new Date().toLocaleString('en-KE'),
      });

      setBuyStep(5);
    }, 1200);
  };

  const remainingNetLiability = Math.max(0, Number((smeProfile.gross_liability - smeProfile.retired_credits).toFixed(2)));

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto text-xs text-stone-900 dark:text-stone-100">
      
      {/* ========================================================================= */}
      {/* VIEW 1: REGULAR CORPORATE PROCUREMENT DASHBOARD                           */}
      {/* ========================================================================= */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#443028]/40 gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-black">
                  Corporate Carbon Procurement Hub
                </h1>
                <span className="bg-orange-950/40 border border-orange-600/60 text-orange-400 text-xs px-3 py-1 rounded-full font-bold">
                  Institutional Offsetting
                </span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 font-bold">
                {smeProfile.name} • KRA PIN: <strong>{smeProfile.tax_pin}</strong> • {smeProfile.location}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleStartProcurement(coopCreditPools[0])}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-lg transition-all cursor-pointer border border-orange-400/30 flex items-center space-x-2 text-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Instant Procurement &rarr;</span>
              </button>
            </div>
          </div>

          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="earthy-box p-5 space-y-1.5 border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Gross Carbon Footprint</span>
                <Building2 className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                {smeProfile.gross_liability} tCO2e
              </p>
              <p className="text-stone-500 text-xs font-bold">
                Audited Scope 1 (Diesel) & Scope 2 (Grid)
              </p>
            </div>

            <div className="earthy-box p-5 space-y-1.5 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Retired Biochar Credits</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-500">
                {smeProfile.retired_credits} tCO2e
              </p>
              <p className="text-stone-500 text-xs font-bold">
                Permanent 100-Yr Soil Sinks in Western Kenya
              </p>
            </div>

            <div className="earthy-box p-5 space-y-1.5 border-l-4 border-l-cyan-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Net Unmitigated Footprint</span>
                <span className="text-cyan-400 font-bold text-xs">Target: 0.0</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">
                {remainingNetLiability} tCO2e
              </p>
              <p className="text-stone-500 text-xs font-bold">
                ≈ ${(remainingNetLiability * 135).toFixed(2)} USD to reach 100% Net Zero
              </p>
            </div>
          </div>

          {/* Line Graph & Available Credit Pools */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Line Graph: Spot Price Fluctuation */}
            <div className="lg:col-span-1 earthy-box p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#443028]/40 pb-3">
                <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                  <BarChart2 className="w-4 h-4 text-orange-500" />
                  <span>Kenyan Price Index ($/t)</span>
                </div>
                <span className="text-stone-500 text-xs">Range: $35 - $145</span>
              </div>

              <LineGraph data={priceFluctuationsLine} height={180} valuePrefix="$" valueSuffix="/t" />
            </div>

            {/* Ready-To-Buy Coop Credit Pools */}
            <div className="lg:col-span-2 earthy-box p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#443028]/40 pb-3">
                <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                  <ShoppingCart className="w-4 h-4 text-emerald-500" />
                  <span>Available Cooperative Carbon Credit Pools</span>
                </div>
                <span className="text-stone-500 text-xs">Verified Kenya NCR EMCA 2026</span>
              </div>

              <div className="space-y-3">
                {coopCreditPools.map((pool) => (
                  <div key={pool.id} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-white text-sm">{pool.coopName}</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                          {pool.rating}
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs">
                        {pool.region} • NCR ID: <strong className="text-emerald-400">{pool.ncrId}</strong>
                      </p>
                      <p className="text-stone-300 text-xs">
                        Inventory: <strong className="text-white">{pool.availableCredits} Tons CO2e</strong> ({pool.biocharMassKg.toLocaleString()} KG Biochar)
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartProcurement(pool)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-md self-start sm:self-auto text-xs"
                    >
                      <span>Procure (${pool.pricePerTon}/t)</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Historic Procurement & Retirement Trail */}
          <div className="earthy-box p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#443028]/40 pb-3">
              <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                <History className="w-4 h-4 text-orange-500" />
                <span>Corporate Carbon Retirement Audit Trail</span>
              </div>
              <button
                onClick={() => {
                  const headers = ['Retirement Order ID', 'Date & Time', 'Source Cooperative Pool', 'Volume (tCO2e)', 'Settlement Value (USD)', 'Settlement Value (KSh)', 'KRA Tax PIN', 'Kenya NCR Certificate ID', 'Status'];
                  const rows = retirementHistory.map(r => [
                    r.id,
                    r.date,
                    r.pool,
                    r.tons,
                    r.priceUsd,
                    r.priceKsh,
                    smeProfile.tax_pin,
                    r.certId,
                    r.status
                  ]);
                  downloadCSV(`${smeProfile.name.toLowerCase().replace(/\s+/g, '_')}_carbon_retirement_audit_trail.csv`, headers, rows);
                }}
                className="px-3.5 py-1.5 bg-[#1c1512] border border-[#443028] text-stone-300 hover:text-white font-bold rounded-xl flex items-center space-x-1 cursor-pointer shadow-sm text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="space-y-3">
              {retirementHistory.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{rec.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                        {rec.status}
                      </span>
                      <span className="text-stone-400 text-xs">{rec.date}</span>
                    </div>
                    <p className="text-stone-300 text-xs">
                      Supplier Coop: <strong>{rec.pool}</strong> • Scope: <strong className="text-orange-400">{rec.scope}</strong>
                    </p>
                    <p className="text-stone-500 text-xs">
                      Kenya NCR Certificate: <strong className="text-emerald-400">{rec.certId}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right sm:border-l sm:border-[#443028] sm:pl-6 space-y-1">
                    <p className="text-sm font-black text-emerald-400">{rec.tons} Tonnes CO2e</p>
                    <p className="text-xs text-white">${(rec.priceUsd || 0).toLocaleString()} USD (KSh ${(rec.priceKsh || 0).toLocaleString()})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: FULL-PAGE DEDICATED "INSTANT PROCUREMENT" EXCHANGE VIEW           */}
      {/* ========================================================================= */}
      {viewMode === 'procure' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Breadcrumb Header for Full-Page View */}
          <div className="earthy-box p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#443028]">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode('dashboard')}
                className="p-2 rounded-xl border border-[#443028] bg-[#120e0c] hover:bg-[#281e19] text-stone-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span>Back to Hub</span>
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Institutional Carbon Credit Instant Procurement & Retirement
                </h2>
                <p className="text-xs text-stone-400">
                  {smeProfile.name} &bull; KRA PIN: {smeProfile.tax_pin} &bull; Kenya NCR EMCA 2026 Protocol
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-950/50 border border-emerald-700 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-bold text-xs">
                Permanent 100-Year Soil Carbon Removal
              </span>
            </div>
          </div>

          {/* Expansive Step Progress Tracker */}
          <div className="earthy-panel p-2 rounded-2xl grid grid-cols-5 gap-2 text-center text-xs font-bold">
            {[
              { step: 1, label: '1. Volume & Supplier' },
              { step: 2, label: '2. ESG Scope Purpose' },
              { step: 3, label: '3. Corporate Billing' },
              { step: 4, label: '4. 2FA PIN Sign-off' },
              { step: 5, label: '5. Retirement Certificate' }
            ].map((s) => (
              <div
                key={s.step}
                className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                  buyStep === s.step
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : buyStep > s.step
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : 'bg-[#120e0c] border-[#443028]/60 text-stone-500'
                }`}
              >
                <span className="text-xs hidden md:inline">{s.label}</span>
                <span className="text-xs md:hidden">Step {s.step}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: VOLUME & SUPPLIER POOL (EXPANSIVE 2-COLUMN VIEW) */}
          {buyStep === 1 && (
            <div className="earthy-box p-6 sm:p-8 space-y-6 animate-fadeIn border border-[#443028]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form Controls */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-200">Select Source Cooperative Credit Pool:</label>
                    <select
                      value={selectedPool ? selectedPool.id : ''}
                      onChange={(e) => {
                        const found = coopCreditPools.find((p) => p.id === e.target.value);
                        setSelectedPool(found || coopCreditPools[0]);
                      }}
                      className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {coopCreditPools.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.coopName} ({p.region} - ${p.pricePerTon}.00 / tCO2e)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-200">Quick Volume Presets:</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[5.0, 10.0, 20.0].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPurchaseAmount(preset)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            purchaseAmount === preset
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                              : 'bg-[#120e0c] border-[#443028] text-stone-300 hover:border-stone-400'
                          }`}
                        >
                          {preset} Tonnes CO2e
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-stone-200 text-sm">Procurement Volume (tCO2e):</label>
                      <span className="text-emerald-400 font-bold">Max Available: {selectedPool ? selectedPool.availableCredits : 100} tCO2e</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max={selectedPool ? selectedPool.availableCredits : 100}
                      step="0.5"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-stone-400">
                      Covers <strong>{(purchaseAmount * 456.6).toFixed(1)} KG</strong> of permanent biochar buried in regenerative farm soils.
                    </p>
                  </div>
                </div>

                {/* Right Column: Real-Time Procurement Cost Valuation */}
                <div className="bg-[#120e0c] p-6 rounded-2xl border border-[#443028] flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-[#443028] pb-3">
                      Procurement Cost & Settlement Summary
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Unit Spot Benchmark:</span>
                        <span className="font-bold text-white text-sm">${selectedPool ? selectedPool.pricePerTon : 135}.00 USD / Ton</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Kenya Shilling Unit Rate:</span>
                        <span className="font-bold text-white text-sm">KSh {((selectedPool ? selectedPool.pricePerTon : 135) * 130).toLocaleString()} / Ton</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Selected Order Volume:</span>
                        <span className="font-bold text-white text-sm">{purchaseAmount} Metric Tonnes CO2e</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Emission Footprint Offset:</span>
                        <span className="font-bold text-emerald-400 text-sm">-{purchaseAmount} tCO2e Liability Reduction</span>
                      </div>
                      
                      <div className="border-t border-[#443028] pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-200 text-sm">Total Settlement (USD):</span>
                          <strong className="text-emerald-400 text-lg font-black">
                            ${(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135)).toFixed(2)} USD
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-200 text-sm">Total Settlement (KSh):</span>
                          <strong className="text-amber-400 text-lg font-black">
                            KSh {(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135) * 130).toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/80 text-xs text-emerald-300">
                    &check; Fully serialized retirement certificate minted on Kenya National Carbon Registry (EMCA 2026).
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  Cancel & Back to Hub
                </button>
                <button
                  onClick={() => setBuyStep(2)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg text-xs"
                >
                  <span>Specify ESG Scope Purpose &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ESG EMISSION SCOPE PURPOSE */}
          {buyStep === 2 && (
            <div className="earthy-box p-6 sm:p-8 space-y-6 animate-fadeIn border border-[#443028]">
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  Select Corporate Emission Scope for Retirement
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Specify the corporate greenhouse gas reporting category where this retirement will be registered.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'Scope 1: Logistics Diesel Fleet', desc: 'Direct combustion emissions from heavy logistics trucks, prime movers, and standby generators.' },
                  { id: 'Scope 2: Warehouse Grid Electricity', desc: 'Purchased electricity consumption across Nairobi Inland Port depot and regional distribution hubs.' },
                  { id: 'CSRD / ISSB IFRS S2 Climate Compliance', desc: 'Statutory corporate ESG disclosures for institutional capital partners and commercial lenders.' },
                  { id: 'Kenya EMCA 2026 Statutory Compliance Target', desc: 'Mandatory environmental offsetting under the Republic of Kenya National Climate Change Act.' },
                ].map((scope) => (
                  <div
                    key={scope.id}
                    onClick={() => setRetirementScope(scope.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                      retirementScope === scope.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                        : 'bg-[#120e0c] border-[#443028] text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-white">{scope.id}</p>
                      {retirementScope === scope.id && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-bold">Selected</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">{scope.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setBuyStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  &larr; Back to Volume
                </button>
                <button
                  onClick={() => setBuyStep(3)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg text-xs"
                >
                  <span>Proceed to Corporate Billing &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CORPORATE BILLING & TAX DECLARATION */}
          {buyStep === 3 && (
            <div className="earthy-box p-6 sm:p-8 space-y-6 animate-fadeIn border border-[#443028]">
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  Corporate Billing & KRA Tax Declaration
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Ensure company identification details are accurate for Kenya Revenue Authority VAT exemption compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-2">
                  <label className="text-stone-300 font-bold block text-sm">Company Registered Legal Name:</label>
                  <input
                    type="text"
                    value={billingInfo.companyName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                    className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-stone-300 font-bold block text-sm">KRA Tax PIN (Kenya Revenue Authority):</label>
                  <input
                    type="text"
                    value={billingInfo.taxPin}
                    onChange={(e) => setBillingInfo({ ...billingInfo, taxPin: e.target.value })}
                    className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-stone-300 font-bold block text-sm">Settlement Payment Gateway:</label>
                  <select
                    value={billingInfo.paymentMethod}
                    onChange={(e) => setBillingInfo({ ...billingInfo, paymentMethod: e.target.value })}
                    className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Daraja M-Pesa Express Corporate">Safaricom Daraja M-Pesa Express (Corporate Paybill)</option>
                    <option value="KRA RTGS Bank Wire Settlement">Central Bank of Kenya RTGS Wire Settlement</option>
                    <option value="Carbonmark Web3 USDC Treasury">Carbonmark Institutional USDC Treasury</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-stone-300 font-bold block text-sm">Official ESG Compliance Email:</label>
                  <input
                    type="email"
                    value={billingInfo.contactEmail}
                    onChange={(e) => setBillingInfo({ ...billingInfo, contactEmail: e.target.value })}
                    className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setBuyStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  &larr; Back to Scope
                </button>
                <button
                  onClick={() => setBuyStep(4)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg text-xs"
                >
                  <span>Proceed to 2FA PIN Sign-off &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CORPORATE OFFICER 2FA PIN SIGN-OFF */}
          {buyStep === 4 && (
            <div className="earthy-box p-8 sm:p-12 space-y-6 animate-fadeIn border border-[#443028] text-center max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-2xl">
                <Lock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-white text-lg">Corporate Officer 2FA Authorization</h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  Authorizing purchase of <strong>{purchaseAmount} Tonnes CO2e</strong> from <strong>{selectedPool ? selectedPool.coopName : 'Carbonmark'}</strong> for <strong>${(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135)).toFixed(2)} USD (KSh {(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135) * 130).toLocaleString()})</strong>.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-3">
                <label className="text-xs font-bold text-stone-300 block">
                  Enter 4-Digit Corporate Officer PIN (Demo: 8888):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={corporatePin}
                  onChange={(e) => setCorporatePin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#120e0c] border-2 border-emerald-500/80 p-3.5 rounded-2xl text-center text-3xl tracking-widest text-emerald-400 font-black focus:outline-none shadow-inner"
                />
                {pinError && (
                  <p className="text-rose-400 text-xs font-bold flex items-center justify-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setBuyStep(3)}
                  disabled={isProcessingBuy}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  &larr; Back to Billing
                </button>
                <button
                  onClick={handleExecuteCorporateBuy}
                  disabled={isProcessingBuy || corporatePin.length !== 4}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg disabled:opacity-50 text-xs"
                >
                  {isProcessingBuy ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Retiring on Kenya NCR...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize & Permanently Retire</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: OFFICIAL RETIREMENT CERTIFICATE & ESG PASS VOUCHER */}
          {buyStep === 5 && settledOrder && (
            <div className="earthy-box p-8 sm:p-10 space-y-6 animate-fadeIn border border-emerald-500/50 max-w-2xl mx-auto">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-2xl">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-white">Carbon Credits Successfully Retired!</h3>
                <p className="text-xs text-stone-300 max-w-lg mx-auto">
                  Certificate serialized on the Kenya National Carbon Registry and logged in the immutable dMRV ledger.
                </p>
              </div>

              {/* Digital Retirement Voucher */}
              <div className="bg-[#120e0c] border border-emerald-500/40 p-6 rounded-2xl space-y-3 text-left text-xs max-w-xl mx-auto shadow-xl">
                <div className="flex justify-between items-center border-b border-[#443028] pb-3">
                  <span className="text-stone-400">Kenya NCR Certificate:</span>
                  <strong className="text-emerald-400 text-sm">{settledOrder.certId}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Retiring Entity:</span>
                  <strong className="text-white text-sm">{settledOrder.companyName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Source Supplier Pool:</span>
                  <strong className="text-white text-sm">{settledOrder.pool}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Volume Retired:</span>
                  <span className="text-stone-200 font-bold text-sm">{settledOrder.tons} Tonnes CO2e</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Total Settlement:</span>
                  <strong className="text-emerald-400 text-sm">${settledOrder.priceUsd.toFixed(2)} USD (KSh {settledOrder.priceKsh.toLocaleString()})</strong>
                </div>
                <div className="flex justify-between items-center border-t border-[#443028] pt-3">
                  <span className="text-stone-400">Designated Scope:</span>
                  <span className="font-bold text-orange-400 text-sm">{settledOrder.scope}</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-2">
                <button
                  onClick={() => {
                    downloadCertificateDocument(`kenya_ncr_retirement_${settledOrder.certId}`, {
                      title: 'Kenya National Carbon Registry Carbon Credit Permanent Retirement Certificate',
                      tonnage: String(settledOrder.tons),
                      biocharKg: String((settledOrder.tons * 456.6).toFixed(1)),
                      certId: settledOrder.certId,
                      entity: `${settledOrder.companyName} (KRA: ${settledOrder.taxPin})`,
                      location: smeProfile.location,
                      kilns: 'Western Kenya Smallholder Pyrolysis Network',
                      value: `$${settledOrder.priceUsd.toFixed(2)} USD (KSh ${settledOrder.priceKsh.toLocaleString()})`,
                      date: settledOrder.timestamp
                    });
                  }}
                  className="px-5 py-3 bg-[#120e0c] hover:bg-[#281e19] border border-[#443028] text-stone-200 font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download NCR Certificate</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('dashboard');
                  }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-lg text-xs"
                >
                  Done & Return to Hub
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CRYPTOGRAPHIC dMRV LEDGER VIEW                                     */}
      {/* ========================================================================= */}
      {viewMode === 'ledger' && (
        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl shadow-sm">
          <LedgerExplorerView onVerifyChain={() => {}} />
        </div>
      )}

    </div>
  );
};

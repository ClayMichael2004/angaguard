import React, { useState } from 'react';
import { ShoppingCart, BarChart2, CheckCircle2, ArrowUpRight, Building2, ShieldCheck, Download, Lock, Smartphone, AlertCircle, X, History, FileText } from 'lucide-react';
import { LineGraph } from './LineGraph';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';

export const NonBioSmeDashboard = ({ theme, activeSection = 'overview', setActiveSection }) => {
  const [smeProfile, setSmeProfile] = useState({
    name: 'East Africa Express Fleet Freight Ltd',
    location: 'Nairobi Inland Port Depot',
    tax_pin: 'P051882910M',
    gross_liability: 62.7,
    retired_credits: 20.0,
  });

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

  // Multi-step Procurement Modal State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyStep, setBuyStep] = useState(1); // 1: Volume & Cost, 2: Scope Purpose, 3: Billing Info, 4: Passcode Auth, 5: Settlement Voucher
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

  const handleOpenPurchase = (pool) => {
    setSelectedPool(pool);
    setPurchaseAmount(5.0);
    setBuyStep(1);
    setCorporatePin('');
    setPasswordError('');
    setShowBuyModal(true);
  };

  const handleExecuteCorporateBuy = () => {
    if (!corporatePin || corporatePin.length < 4) {
      setPinError('Please enter a valid Corporate Authorization Passcode / Password');
      return;
    }
    setPinError('');
    setIsProcessingBuy(true);

    setTimeout(() => {
      setIsProcessingBuy(false);
      const certId = `KE-NCR-2026-RET-${Math.floor(100000 + Math.random() * 900000)}`;
      const totalUsd = purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135);
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
        retired_credits: smeProfile.retired_credits + purchaseAmount,
      });

      setSettledOrder({
        ...newOrder,
        companyName: billingInfo.companyName,
        taxPin: billingInfo.taxPin,
        timestamp: new Date().toLocaleString('en-KE'),
      });

      setBuyStep(5);
    }, 1600);
  };

  const remainingNetLiability = Math.max(0, Number((smeProfile.gross_liability - smeProfile.retired_credits).toFixed(2)));

  return (
    <div className="space-y-8 animate-fadeIn w-full font-mono text-xs text-stone-900 dark:text-stone-100">
      
      {/* Header Banner & Corner Account Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#2d3f58]/40 light:border-[#e2e8f0] gap-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-stone-100 light:text-slate-900">
            Corporate Carbon Procurement Hub
          </h1>
          <span className="bg-orange-950/40 light:bg-orange-100 border border-orange-600/60 light:border-orange-300 text-orange-400 light:text-orange-800 font-mono text-xs px-3 py-1 rounded-full font-bold">
            Institutional Offsetting
          </span>
        </div>

        {/* CORNER ACCOUNT BADGE & PURCHASE ACTION */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-[#131e30] light:bg-white border border-emerald-500/40 light:border-emerald-600/30 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <div className="text-left">
              <p className="text-[9px] text-stone-400 light:text-slate-500 uppercase font-bold">KRA PIN: {smeProfile.tax_pin}</p>
              <p className="font-extrabold text-stone-100 light:text-slate-900 text-xs truncate max-w-[200px]">{smeProfile.name}</p>
            </div>
          </div>

          <button
            onClick={() => handleOpenPurchase(coopCreditPools[0])}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-md transition-all cursor-pointer border border-orange-400/30 flex items-center space-x-2 text-xs"
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
            <span className="text-stone-500 font-bold uppercase text-[10px]">Gross Carbon Footprint</span>
            <Building2 className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-black text-stone-900 dark:text-stone-100">
            {smeProfile.gross_liability} tCO2e
          </p>
          <p className="text-stone-500 text-[11px] font-bold">
            Audited Scope 1 (Diesel) & Scope 2 (Grid)
          </p>
        </div>

        <div className="earthy-box p-5 space-y-1.5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-bold uppercase text-[10px]">Retired Biochar Credits</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-500">
            {smeProfile.retired_credits} tCO2e
          </p>
          <p className="text-stone-500 text-[11px] font-bold">
            Permanent 100-Yr Soil Sinks in Western Kenya
          </p>
        </div>

        <div className="earthy-box p-5 space-y-1.5 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-bold uppercase text-[10px]">Net Unmitigated Footprint</span>
            <span className="text-cyan-400 font-bold text-xs">Target: 0.0</span>
          </div>
          <p className="text-3xl font-black text-cyan-400">
            {remainingNetLiability} tCO2e
          </p>
          <p className="text-stone-500 text-[11px] font-bold">
            ≈ ${(remainingNetLiability * 135).toFixed(2)} USD to reach 100% Net Zero
          </p>
        </div>
      </div>

      {/* Line Graph & Available Credit Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Graph: Spot Price Fluctuation */}
        <div className="lg:col-span-1 earthy-box p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <BarChart2 className="w-5 h-5 text-orange-500" />
              <span>Kenyan Price Index ($/t)</span>
            </div>
            <span className="text-stone-500 text-[11px]">Range: $35 - $145</span>
          </div>

          <LineGraph data={priceFluctuationsLine} height={180} valuePrefix="$" valueSuffix="/t" />
        </div>

        {/* Ready-To-Buy Coop Credit Pools */}
        <div className="lg:col-span-2 earthy-box p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              <span>Available Cooperative Carbon Credit Pools</span>
            </div>
            <span className="text-stone-500 text-[11px]">Verified Kenya NCR EMCA 2026</span>
          </div>

          <div className="space-y-4">
            {coopCreditPools.map((pool) => (
              <div key={pool.id} className="p-4 sm:p-5 rounded-2xl bg-[#1c1512] border border-[#443028] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  onClick={() => handleOpenPurchase(pool)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-md self-start sm:self-auto"
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
      <div className="earthy-box p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#443028]/40 pb-3">
          <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
            <History className="w-5 h-5 text-orange-500" />
            <span>Corporate Carbon Retirement Audit Trail</span>
          </div>
          <button
            onClick={() => {
              const headers = ['Retirement Order ID', 'Date & Time', 'Source Cooperative Pool', 'Volume (tCO2e)', 'Settlement Value (USD)', 'Settlement Value (KSh)', 'KRA Tax PIN', 'Kenya NCR Certificate ID', 'Status'];
              const rows = [
                ['ORD-9912', '2026-08-18 11:20 EAT', 'Kakamega Smallholder Sugarcane Coop', 10.0, 1350.0, 175500, smeProfile.tax_pin, 'KE-NCR-2026-RET-991204', 'PERMANENTLY RETIRED'],
                ['ORD-8840', '2026-07-25 15:40 EAT', 'Kisumu Rice Farmers Coop Union', 6.0, 792.0, 102960, smeProfile.tax_pin, 'KE-NCR-2026-RET-884011', 'PERMANENTLY RETIRED'],
                ['ORD-7712', '2026-06-30 09:15 EAT', 'Eldoret Grain Growers Network', 4.0, 552.0, 71760, smeProfile.tax_pin, 'KE-NCR-2026-RET-771288', 'PERMANENTLY RETIRED']
              ];
              downloadCSV(`${smeProfile.name.toLowerCase().replace(/\s+/g, '_')}_carbon_retirement_audit_trail.csv`, headers, rows);
            }}
            className="px-3.5 py-1.5 bg-[#1c1512] border border-[#443028] text-stone-300 hover:text-white font-bold rounded-xl flex items-center space-x-1 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="space-y-3">
          {retirementHistory.map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{rec.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                    {rec.status}
                  </span>
                  <span className="text-stone-400 text-[11px]">{rec.date}</span>
                </div>
                <p className="text-stone-300 text-xs">
                  Coop: <strong>{rec.pool}</strong> • Scope: <strong className="text-orange-400">{rec.scope}</strong>
                </p>
                <p className="text-stone-500 text-[11px]">
                  Kenya NCR Certificate: <strong className="text-emerald-400">{rec.certId}</strong>
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-[#443028] sm:pl-6">
                <p className="text-sm font-black text-emerald-400">{rec.tons} Tonnes CO2e</p>
                <p className="text-xs text-white">${rec.priceUsd.toLocaleString()} USD (KSh {rec.priceKsh.toLocaleString()})</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REALISTIC MULTI-STEP INSTITUTIONAL PROCUREMENT MODAL                      */}
      {/* ========================================================================= */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#1c1512] border-2 border-[#443028] max-w-lg w-full p-6 sm:p-7 rounded-3xl space-y-6 text-stone-100 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#443028] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                  B
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Institutional Carbon Procurement</h3>
                  <p className="text-[11px] text-stone-400">Step {buyStep} of 5 • Kenya NCR EMCA 2026 Retirement</p>
                </div>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                className="p-1 rounded-lg border border-[#443028] text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: VOLUME & COST CALCULATOR */}
            {buyStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-[#120e0c] p-4 rounded-2xl border border-[#443028] space-y-2 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Selected Supplier Pool:</span>
                    <strong className="text-white">{selectedPool ? selectedPool.coopName : 'Carbonmark Open Pool'}</strong>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Spot Unit Price:</span>
                    <strong className="text-emerald-400">${selectedPool ? selectedPool.pricePerTon : 135}.00 USD / Ton (KSh {((selectedPool ? selectedPool.pricePerTon : 135) * 130).toLocaleString()})</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300">Procurement Volume (Tonnes CO2e):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5.0, 10.0, 20.0].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPurchaseAmount(preset)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          purchaseAmount === preset
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-[#120e0c] border-[#443028] text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {preset} Tonnes
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="1"
                    max={selectedPool ? selectedPool.availableCredits : 100}
                    step="0.5"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#120e0c] border border-[#443028] p-3 rounded-xl text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 pt-1">
                    <span>Gross Total: <strong>${(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135)).toFixed(2)} USD</strong></span>
                    <span className="text-emerald-400 font-bold">KSh {(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135) * 130).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setBuyStep(2)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <span>Specify ESG Scope &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ESG RETIREMENT PURPOSE */}
            {buyStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-300">Select Corporate Emission Scope for Retirement:</label>
                  <div className="space-y-2">
                    {[
                      { id: 'Scope 1: Logistics Diesel Fleet', desc: 'Direct combustion in heavy trucks & generators' },
                      { id: 'Scope 2: Warehouse Grid Electricity', desc: 'Purchased electricity at Nairobi Inland Depot' },
                      { id: 'CSRD / ISSB IFRS S2 Supply Chain Audit', desc: 'Corporate investor climate transparency reporting' },
                      { id: 'Kenya EMCA 2026 National Compliance Target', desc: 'Statutory offset requirement under Kenya Climate Act' },
                    ].map((scope) => (
                      <div
                        key={scope.id}
                        onClick={() => setRetirementScope(scope.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          retirementScope === scope.id
                            ? 'bg-emerald-950/60 border-emerald-500 text-white'
                            : 'bg-[#120e0c] border-[#443028] text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        <p className="font-bold text-xs">{scope.id}</p>
                        <p className="text-[11px] text-stone-400">{scope.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setBuyStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={() => setBuyStep(3)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <span>Billing & Tax Details &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: BILLING & TAX DECLARATION */}
            {buyStep === 3 && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="text-stone-400 font-bold block mb-1">Company Registered Legal Name:</label>
                    <input
                      type="text"
                      value={billingInfo.companyName}
                      onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                      className="w-full bg-[#120e0c] border border-[#443028] p-2.5 rounded-xl text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">KRA Tax PIN (Kenya Revenue Authority):</label>
                    <input
                      type="text"
                      value={billingInfo.taxPin}
                      onChange={(e) => setBillingInfo({ ...billingInfo, taxPin: e.target.value })}
                      className="w-full bg-[#120e0c] border border-[#443028] p-2.5 rounded-xl text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">Settlement Payment Gateway:</label>
                    <select
                      value={billingInfo.paymentMethod}
                      onChange={(e) => setBillingInfo({ ...billingInfo, paymentMethod: e.target.value })}
                      className="w-full bg-[#120e0c] border border-[#443028] p-2.5 rounded-xl text-white font-bold cursor-pointer"
                    >
                      <option value="Daraja M-Pesa Express Corporate">Safaricom Daraja M-Pesa B2B Paybill</option>
                      <option value="RTGS Commercial Bank Transfer">KCB / Equity RTGS Corporate Wire</option>
                      <option value="Corporate Visa / Mastercard">Corporate Visa / Mastercard</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setBuyStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={() => setBuyStep(4)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <span>Proceed to 2FA PIN &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CORPORATE AUTHORIZER 2FA PIN */}
            {buyStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-[#120e0c] border border-emerald-600/70 p-5 rounded-2xl space-y-3 text-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Corporate Authorization 2FA</h4>
                    <p className="text-xs text-stone-300 mt-1">
                      Authorizing purchase of <strong>{purchaseAmount} Tonnes CO2e</strong> (${(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135)).toFixed(2)} USD / KSh {(purchaseAmount * (selectedPool ? selectedPool.pricePerTon : 135) * 130).toLocaleString()}) from <strong>{selectedPool ? selectedPool.coopName : 'Coop'}</strong>.
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto pt-2 space-y-2">
                    <label className="text-[11px] font-bold text-stone-300 block">
                      Enter 4-Digit Procurement PIN:
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={corporatePin}
                      onChange={(e) => setCorporatePin(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#1c1512] border border-emerald-500/80 p-3 rounded-xl text-center text-xl tracking-widest text-emerald-400 font-black focus:outline-none"
                    />
                    {pinError && (
                      <p className="text-rose-400 text-[11px] font-bold flex items-center justify-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{pinError}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setBuyStep(3)}
                    disabled={isProcessingBuy}
                    className="px-4 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={handleExecuteCorporateBuy}
                    disabled={isProcessingBuy || corporatePin.length !== 4}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isProcessingBuy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Retiring on Kenya NCR...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Execute Buy & Mint Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SETTLEMENT RECEIPT & RETIREMENT CERTIFICATE */}
            {buyStep === 5 && settledOrder && (
              <div className="space-y-5 animate-fadeIn text-center">
                <div className="w-14 h-14 bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">Carbon Retirement Certified!</h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Your credits have been permanently retired on the Kenya National Carbon Registry.
                  </p>
                </div>

                {/* Digital Compliance Voucher */}
                <div className="bg-[#120e0c] border border-emerald-500/40 p-4 rounded-2xl space-y-2 text-left text-xs font-mono">
                  <div className="flex justify-between border-b border-[#443028] pb-2">
                    <span className="text-stone-400">Kenya NCR Certificate:</span>
                    <strong className="text-emerald-400">{settledOrder.certId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Purchasing Entity:</span>
                    <strong className="text-white">{settledOrder.companyName} (PIN: {settledOrder.taxPin})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Scope Purpose:</span>
                    <span className="text-orange-400 font-bold">{settledOrder.scope}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Volume Retired:</span>
                    <strong className="text-emerald-400">{settledOrder.tons} Tonnes CO2e</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Settlement:</span>
                    <strong className="text-white">${settledOrder.priceUsd.toFixed(2)} USD (KSh {settledOrder.priceKsh.toLocaleString()})</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#443028] pt-2">
                    <span className="text-stone-400">Timestamp:</span>
                    <span className="text-stone-300">{settledOrder.timestamp}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => {
                      downloadCertificateDocument(`kenya_ncr_retirement_${settledOrder.certId}`, {
                        title: 'Kenya National Carbon Registry Official Retirement Certificate',
                        tonnage: String(settledOrder.tons),
                        biocharKg: String((settledOrder.tons * 456.6).toFixed(1)),
                        certId: settledOrder.certId,
                        entity: `${smeProfile.name} (KRA PIN: ${smeProfile.tax_pin})`,
                        location: `${smeProfile.location} • Origin: ${settledOrder.poolName}`,
                        kilns: 'Certified Kakamega & Western Kenya Smart Kilns',
                        value: `$${settledOrder.priceUsd.toFixed(2)} USD (KSh ${settledOrder.priceKsh.toLocaleString()})`,
                        date: settledOrder.timestamp
                      });
                    }}
                    className="px-4 py-2.5 bg-[#120e0c] hover:bg-[#281e19] border border-[#443028] text-stone-300 font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};


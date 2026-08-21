import React, { useState, useEffect } from 'react';
import {
  Wallet, ArrowDownToLine, Flame, Sparkles, CheckCircle2, TrendingUp,
  History, Building2, Users, FileText, ArrowRight, ShieldCheck, Lock,
  Smartphone, X, Download, AlertCircle, Eye, EyeOff, User
} from 'lucide-react';
import { KilnDigitalTwin3D } from './KilnDigitalTwin3D';
import { LineGraph } from './LineGraph';
import { FarmerRecordsPage } from './FarmerRecordsPage';
import { downloadCertificateDocument } from '../utils/downloadHelpers';

export const FarmerDashboard = ({ theme, activeSection = 'overview', setActiveSection, defaultFarmerType = 'bio-sme' }) => {
  const [farmerType, setFarmerType] = useState(defaultFarmerType);
  const [showFullRecordsView, setShowFullRecordsView] = useState(false);

  const [farmerData, setFarmerData] = useState({
    name: 'Wanjala Wafula',
    phone: '+254712345678',
    bio_sme_name: 'Kizito Grain Millers Ltd (Bio SME Partner)',
    sme_incentive_pct: 85.0,
    coop_name: 'Kakamega Smallholder Sugarcane Cooperative Union',
    coop_dividend_share_pct: 80.0,
    available_ksh: 12450.0,
    total_withdrawn_ksh: 34500.0,
    total_burns: 18,
    biochar_harvest_kg: 1420.0,
    credits_generated_tons: 3.89,
    assigned_kilns: ['KILN-001 (Kakamega Plot A)', 'KILN-004 (Lurambi Outgrower)']
  });

  // Multi-step M-Pesa Cashout Modal State
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [cashoutStep, setCashoutStep] = useState(1); // 1: Amount, 2: Split Review, 3: Password Auth, 4: Success Receipt
  const [cashoutAmount, setCashoutAmount] = useState(12450.0);
  const [accountPassword, setAccountPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isProcessingDisbursal, setIsProcessingDisbursal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // Synchronize with Sidebar activeSection clicks
  useEffect(() => {
    if (activeSection === 'cashout') {
      setShowFullRecordsView(false);
      if (farmerData.available_ksh > 0) {
        setCashoutAmount(farmerData.available_ksh);
        setCashoutStep(1);
        setAccountPassword('');
        setPasswordError('');
        setShowCashoutModal(true);
      }
    } else if (activeSection === 'records') {
      setShowFullRecordsView(true);
    } else if (activeSection === 'overview') {
      setShowFullRecordsView(false);
    } else if (activeSection === 'kiln') {
      setShowFullRecordsView(false);
      const el = document.getElementById('farmer-3d-kiln');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (activeSection === 'market') {
      setShowFullRecordsView(false);
      const el = document.getElementById('farmer-spot-market');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  // If user clicked the Records link, display the full-screen Records & Sales Data page!
  if (showFullRecordsView) {
    return (
      <FarmerRecordsPage
        onBack={() => {
          setShowFullRecordsView(false);
          if (setActiveSection) setActiveSection('overview');
        }}
        farmerName={farmerData.name}
        farmerType={farmerType}
      />
    );
  }

  // Carbon Credit Spot Price Data Points ($35 - $145 range)
  const lineGraphPriceData = [
    { x: '08:00', y: 130.00 },
    { x: '10:00', y: 132.50 },
    { x: '12:00', y: 136.00 },
    { x: '14:00', y: 134.20 },
    { x: '16:00', y: 138.00 },
    { x: 'Now', y: 135.50 },
  ];

  const pastRecordsPreview = [
    { id: 'REC-9941', date: '2026-08-19', kiln: 'Kiln #1 (Maize Cob)', biocharKg: 85.0, co2eTons: 0.23, payoutKsh: 1480, status: 'M-PESA PAID' },
    { id: 'REC-8820', date: '2026-08-14', kiln: 'Kiln #4 (Coffee Husk)', biocharKg: 110.0, co2eTons: 0.30, payoutKsh: 1950, status: 'M-PESA PAID' },
    { id: 'REC-7711', date: '2026-08-08', kiln: 'Kiln #1 (Maize Cob)', biocharKg: 72.0, co2eTons: 0.19, payoutKsh: 1220, status: 'M-PESA PAID' },
  ];

  const handleOpenCashout = () => {
    if (farmerData.available_ksh <= 0) return;
    setCashoutAmount(farmerData.available_ksh);
    setCashoutStep(1);
    setAccountPassword('');
    setPasswordError('');
    setShowCashoutModal(true);
  };

  const handleExecutePasswordAuth = () => {
    if (!accountPassword || accountPassword.length < 4) {
      setPasswordError('Please enter your account password (at least 4 characters)');
      return;
    }
    setPasswordError('');
    setIsProcessingDisbursal(true);

    setTimeout(() => {
      setIsProcessingDisbursal(false);
      const receiptCode = `QHK${Math.floor(1000000 + Math.random() * 9000000)}`;
      const newAvailable = Math.max(0, farmerData.available_ksh - cashoutAmount);
      const newWithdrawn = farmerData.total_withdrawn_ksh + cashoutAmount;

      setFarmerData({
        ...farmerData,
        available_ksh: newAvailable,
        total_withdrawn_ksh: newWithdrawn,
      });

      setLastReceipt({
        code: receiptCode,
        amountKsh: cashoutAmount,
        amountUsd: (cashoutAmount / 130.0).toFixed(2),
        phone: farmerData.phone,
        recipient: farmerData.name,
        date: new Date().toLocaleString('en-KE'),
        remainingKsh: newAvailable,
      });

      setCashoutStep(4);
    }, 1500);
  };

  const usdAvailable = (farmerData.available_ksh / 130.0).toFixed(2);
  const usdWithdrawn = (farmerData.total_withdrawn_ksh / 130.0).toFixed(2);

  return (
    <div className="space-y-8 animate-fadeIn w-full font-mono text-xs text-slate-900 dark:text-stone-100">
      
      {/* Top Bar: Account Switcher & Corner Entity Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Strategy Switcher */}
        <div className="bg-white dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] p-1.5 rounded-2xl flex items-center space-x-2 shadow-sm">
          <button
            onClick={() => setFarmerType('bio-sme')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              farmerType === 'bio-sme'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-transparent text-slate-700 dark:text-stone-300 hover:text-orange-600'
            }`}
          >
            Bio SME Outgrower Model
          </button>

          <button
            onClick={() => setFarmerType('cooperative')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              farmerType === 'cooperative'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-transparent text-slate-700 dark:text-stone-300 hover:text-emerald-600'
            }`}
          >
            Cooperative Member Model
          </button>
        </div>

        {/* CORNER ACCOUNT BADGE */}
        <div className="flex items-center space-x-3 bg-white dark:bg-[#131e30] border border-emerald-500/40 dark:border-emerald-600/30 px-4 py-2 rounded-2xl shadow-sm self-start md:self-auto">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-600 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-500 dark:text-stone-400 uppercase font-bold">
              {farmerType === 'bio-sme' ? farmerData.bio_sme_name : farmerData.coop_name}
            </p>
            <p className="font-extrabold text-slate-900 dark:text-stone-100 text-xs">
              {farmerData.name} • {farmerData.phone}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards with Dual Currency (KSh & USD) + Dual Mass (KG & Tonnes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Available Cashout</span>
            <Wallet className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-stone-100">
            KSh {farmerData.available_ksh.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-orange-600 dark:text-orange-400 text-[11px] font-bold">
            ≈ ${usdAvailable} USD (Ready to Disburse)
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Total Biochar Harvested</span>
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
            {farmerData.biochar_harvest_kg.toLocaleString()} KG
          </p>
          <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
            = {farmerData.credits_generated_tons} Tonnes CO2e Sequestered
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Cumulative Withdrawn</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-stone-100">
            KSh {farmerData.total_withdrawn_ksh.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
            ≈ ${usdWithdrawn} USD via Safaricom B2C
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Pyrolysis Burn Cycles</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-stone-100">
            {farmerData.total_burns} Clean Burns
          </p>
          <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
            100% Verified by IoT Sensors
          </p>
        </div>
      </div>

      {/* Real-time Earnings & M-Pesa Multi-Step Cashout Banner */}
      <div className="bg-white dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
              <Wallet className="w-5 h-5" />
              <span>Real-Time Earnings Available for Instant Mobile Cashout</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-stone-100 tracking-tight">
                KSh {farmerData.available_ksh.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-slate-500 dark:text-stone-400 text-lg font-bold">(${usdAvailable} USD)</span>
            </div>
            <p className="text-slate-700 dark:text-stone-300 text-xs font-bold flex items-center space-x-1.5">
              <span>Backed by</span>
              <strong className="text-emerald-700 dark:text-emerald-400">{farmerData.credits_generated_tons} Tonnes CO2e ({farmerData.biochar_harvest_kg} KG Biochar)</strong>
              <span>at Kenya Market Index ($135.00/t).</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[280px]">
            <button
              onClick={handleOpenCashout}
              disabled={farmerData.available_ksh <= 0}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                farmerData.available_ksh > 0
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border border-orange-400/40'
                  : 'bg-slate-200 dark:bg-stone-800 text-slate-400 dark:text-stone-500 cursor-not-allowed border border-slate-300 dark:border-stone-700'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Initiate M-Pesa Cashout &rarr;</span>
            </button>
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 dark:text-stone-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safaricom Daraja B2C System Authorization</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Representation of Smart Kilns with Multi-Kiln Switcher */}
      <div id="farmer-3d-kiln" className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2d3f58]/40 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-stone-100">Interactive 3D Smart Kiln Digital Twin</h3>
            <p className="text-slate-500 dark:text-stone-400 text-[11px]">Real-time thermal conduction glow and ultrasonic char bed depth</p>
          </div>
          <span className="text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full text-[10px]">
            Live Sensor Feed: 58.5°C
          </span>
        </div>
        <KilnDigitalTwin3D theme={theme} />
      </div>

      {/* Line Graph & Records Link Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Line Graph */}
        <div id="farmer-spot-market" className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-3">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Carbon Removal Spot Value Trend ($/tCO2e)</span>
            </div>
            <span className="text-slate-600 dark:text-stone-300 font-bold">Kenya Range: $35 - $145</span>
          </div>

          <LineGraph
            data={lineGraphPriceData}
            title="Kenyan Biochar Carbon Spot Index"
            height={200}
            valuePrefix="$"
            valueSuffix="/tCO2e"
          />
        </div>

        {/* Past Sales Records Audit Card with Clickable Link to Full Page */}
        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-4">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
                <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Recent Biochar Harvest & M-Pesa Disbursals</span>
              </div>
              
              {/* Clickable text link opening full records page */}
              <button
                onClick={() => setShowFullRecordsView(true)}
                className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>View All Records &rarr;</span>
              </button>
            </div>

            <div className="space-y-3">
              {pastRecordsPreview.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-stone-100">{rec.kiln}</p>
                    <p className="text-slate-500 dark:text-stone-400 text-[11px] font-bold">{rec.date} • {rec.biocharKg} KG Biochar ({rec.co2eTons} tCO2e)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">+KSh {rec.payoutKsh.toLocaleString()}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold">{rec.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-600/30 text-slate-700 dark:text-stone-300 text-[11px] font-bold flex justify-between items-center">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Immutable Ledger: Kenya NCR EMCA 2026</span>
            </span>
            <button
              onClick={() => setShowFullRecordsView(true)}
              className="text-orange-600 dark:text-orange-400 hover:underline font-bold"
            >
              Open Full Audit Records &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SAFARICOM M-PESA CASHOUT MODAL (STATUTORY 40% BENEFIT SHARING ALIGNED)     */}
      {/* ========================================================================= */}
      {showCashoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#2d3f58] max-w-lg w-full p-6 sm:p-7 rounded-3xl space-y-6 text-slate-900 dark:text-stone-100 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                  M
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-stone-100">Safaricom M-Pesa B2C Cashout</h3>
                  <p className="text-[11px] text-slate-500 dark:text-stone-400">Step {cashoutStep} of 4 • Kenya Carbon Regulations 2024 Compliant</p>
                </div>
              </div>
              <button
                onClick={() => setShowCashoutModal(false)}
                className="p-1 rounded-lg border border-slate-200 dark:border-[#2d3f58] text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: CHOOSE AMOUNT */}
            {cashoutStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-slate-50 dark:bg-[#131e30] p-4 rounded-2xl border border-slate-200 dark:border-[#2d3f58] space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-stone-400">
                    <span>Available Direct Payout:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">KSh {farmerData.available_ksh.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-stone-400">
                    <span>Verified Carbon Mass:</span>
                    <span className="font-bold text-slate-900 dark:text-stone-200">{farmerData.credits_generated_tons} Tonnes ({farmerData.biochar_harvest_kg} KG)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300">Select Withdrawal Amount (KSh):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '100% (All)', amt: farmerData.available_ksh },
                      { label: '50% (Half)', amt: farmerData.available_ksh / 2 },
                      { label: '25% (Quarter)', amt: farmerData.available_ksh / 4 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCashoutAmount(preset.amt)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          cashoutAmount === preset.amt
                            ? 'bg-orange-600 border-orange-500 text-white'
                            : 'bg-slate-100 dark:bg-[#131e30] border-slate-200 dark:border-[#2d3f58] text-slate-700 dark:text-stone-300 hover:border-slate-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="100"
                    max={farmerData.available_ksh}
                    value={cashoutAmount}
                    onChange={(e) => setCashoutAmount(Math.min(farmerData.available_ksh, Math.max(0, Number(e.target.value))))}
                    className="w-full bg-white dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] p-3 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-base focus:outline-none focus:border-orange-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-stone-400">
                    Disbursal Value: <strong>${(cashoutAmount / 130.0).toFixed(2)} USD</strong> (Conversion rate: 1 USD = 130 KSh)
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setShowCashoutModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3f58] text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setCashoutStep(2)}
                    disabled={cashoutAmount <= 0}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <span>Review Statutory Split &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW STATUTORY 40% SPLIT & BENEFICIARY */}
            {cashoutStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-slate-50 dark:bg-[#131e30] p-4 rounded-2xl border border-slate-200 dark:border-[#2d3f58] space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-stone-300 uppercase tracking-wide border-b border-slate-200 dark:border-[#2d3f58] pb-2">
                    Kenya Carbon Regulations 2024 Revenue Allocation
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Recipient Farmer:</span>
                      <span className="font-bold text-slate-900 dark:text-stone-100">{farmerData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">M-Pesa Registered Number:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{farmerData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Disbursal Channel:</span>
                      <span className="font-bold text-slate-800 dark:text-stone-200">Safaricom Daraja B2C API</span>
                    </div>
                  </div>

                  {/* Statutory Benefit Sharing Breakdown */}
                  <div className="border-t border-slate-200 dark:border-[#2d3f58] pt-2 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                      <span>1. Farmer Direct M-Pesa (37.0%):</span>
                      <span>KSh {cashoutAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-700 dark:text-blue-400 font-bold">
                      <span>2. Community Trust Fund (40.0% Statutory):</span>
                      <span>KSh {(cashoutAmount * 1.08).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-stone-400">
                      <span>3. Coop Logistics & Drum Reserve (14.8%):</span>
                      <span>KSh {(cashoutAmount * 0.40).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-stone-400">
                      <span>4. Platform dMRV & Consolidated Levy (8.2%):</span>
                      <span>KSh {(cashoutAmount * 0.22).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCashoutStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3f58] text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={() => setCashoutStep(3)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Password Auth &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SYSTEM LOGIN PASSWORD VERIFICATION */}
            {cashoutStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/70 p-5 rounded-2xl space-y-3 text-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-stone-100 text-sm">System Identity Verification</h4>
                    <p className="text-xs text-slate-600 dark:text-stone-300 mt-1">
                      Authorize disbursal of <strong>KSh {cashoutAmount.toLocaleString()}</strong> to registered phone <strong>{farmerData.phone}</strong>.
                    </p>
                  </div>

                  <div className="max-w-sm mx-auto pt-2 space-y-2 text-left">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-stone-300 block">
                      Enter AngaGuard Account Password / Passcode:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your system password..."
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        className="w-full bg-white dark:bg-[#131e30] border border-emerald-500/80 p-3 rounded-xl text-slate-900 dark:text-stone-100 font-bold focus:outline-none focus:border-emerald-400 pr-10 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{passwordError}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 dark:text-stone-400 italic">
                      🔒 Disbursal uses Safaricom Daraja B2C API. Funds will be directly credited to your M-Pesa.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCashoutStep(2)}
                    disabled={isProcessingDisbursal}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2d3f58] text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={handleExecutePasswordAuth}
                    disabled={isProcessingDisbursal || !accountPassword}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isProcessingDisbursal ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initiating B2C Disbursal...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Disburse to M-Pesa</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS RECEIPT VOUCHER */}
            {cashoutStep === 4 && lastReceipt && (
              <div className="space-y-5 animate-fadeIn text-center">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-stone-100">Disbursal Confirmed!</h3>
                  <p className="text-xs text-slate-600 dark:text-stone-300 mt-1">
                    Funds have been transferred to your Safaricom M-Pesa wallet.
                  </p>
                </div>

                {/* Printable Digital Receipt Card */}
                <div className="bg-slate-50 dark:bg-[#131e30] border border-emerald-500/40 p-4 rounded-2xl space-y-2 text-left text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-200 dark:border-[#2d3f58] pb-2">
                    <span className="text-slate-500 dark:text-stone-400">M-Pesa Receipt:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 text-sm">{lastReceipt.code}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Amount Paid:</span>
                    <strong className="text-slate-900 dark:text-stone-100">KSh {lastReceipt.amountKsh.toLocaleString()} (${lastReceipt.amountUsd} USD)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Recipient Phone:</span>
                    <span className="text-slate-800 dark:text-stone-200">{lastReceipt.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Timestamp:</span>
                    <span className="text-slate-800 dark:text-stone-200">{lastReceipt.date}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-[#2d3f58] pt-2">
                    <span className="text-slate-500 dark:text-stone-400">Remaining Balance:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">KSh {lastReceipt.remainingKsh.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => {
                      downloadCertificateDocument(`mpesa_receipt_${lastReceipt.code}`, {
                        title: 'Official Safaricom M-Pesa Disbursal Voucher',
                        tonnage: (lastReceipt.amountKsh / (50 * 130)).toFixed(2),
                        biocharKg: ((lastReceipt.amountKsh / (50 * 130)) * (1000 / (0.75 * 3.6667 * 0.97 * 0.95))).toFixed(1),
                        certId: lastReceipt.code,
                        entity: `${lastReceipt.recipient} (${lastReceipt.phone})`,
                        location: 'Western Kenya Smallholders Biomass Hub',
                        kilns: farmerData.assigned_kilns.join(', '),
                        value: `KSh ${lastReceipt.amountKsh.toLocaleString()} ($${lastReceipt.amountUsd} USD)`,
                        date: lastReceipt.date
                      });
                    }}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-[#131e30] hover:bg-slate-200 dark:hover:bg-[#1c2a3e] border border-slate-300 dark:border-[#2d3f58] text-slate-800 dark:text-stone-300 font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Voucher</span>
                  </button>
                  <button
                    onClick={() => setShowCashoutModal(false)}
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

export default FarmerDashboard;

import React, { useState } from 'react';
import { Wallet, ArrowDownToLine, Flame, Sparkles, CheckCircle2, TrendingUp, History, Building2, Users, FileText, ArrowRight } from 'lucide-react';
import { KilnDigitalTwin3D } from './KilnDigitalTwin3D';
import { LineGraph } from './LineGraph';
import { FarmerRecordsPage } from './FarmerRecordsPage';

export const FarmerDashboard = ({ theme, defaultFarmerType = 'bio-sme' }) => {
  const [farmerType, setFarmerType] = useState(defaultFarmerType);
  const [showFullRecordsView, setShowFullRecordsView] = useState(false);

  const [farmerData, setFarmerData] = useState({
    name: 'Wanjala Wafula',
    phone: '+254712345678',
    bio_sme_name: 'Kizito Grain Millers Ltd (Bio SME Sponsor)',
    sme_incentive_pct: 85.0,
    coop_name: 'Kakamega Smallholder Sugarcane Cooperative Union',
    coop_dividend_share_pct: 80.0,
    available_ksh: 12450.0,
    total_withdrawn_ksh: 34500.0,
    total_burns: 18,
    biochar_harvest_kg: 1420.0,
    credits_generated_tons: 3.89,
  });

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [payoutReceipt, setPayoutReceipt] = useState(null);

  // If user clicked the Records text link, display the full-screen Records & Sales Data page!
  if (showFullRecordsView) {
    return (
      <FarmerRecordsPage
        onBack={() => setShowFullRecordsView(false)}
        farmerName={farmerData.name}
        farmerType={farmerType}
      />
    );
  }

  // Realistic Carbon Credit Spot Price Data Points
  const lineGraphPriceData = [
    { x: '08:00', y: 35.50 },
    { x: '09:00', y: 42.00 },
    { x: '10:00', y: 58.40 },
    { x: '11:00', y: 74.10 },
    { x: '12:00', y: 92.50 },
    { x: '13:00', y: 110.00 },
    { x: '14:00', y: 128.50 },
    { x: '15:00', y: 142.00 },
    { x: '16:00', y: 136.00 },
    { x: '17:00', y: 139.50 },
    { x: '18:00', y: 141.00 },
    { x: 'Now', y: 135.50 },
  ];

  const pastRecordsPreview = [
    { id: 'REC-9941', date: '2026-08-19', kiln: 'Kiln #1 (Maize Cob)', biocharKg: 85.0, co2eTons: 0.23, payoutKsh: 1480, status: 'M-PESA PAID' },
    { id: 'REC-8820', date: '2026-08-14', kiln: 'Kiln #2 (Coffee Husk)', biocharKg: 110.0, co2eTons: 0.30, payoutKsh: 1950, status: 'M-PESA PAID' },
    { id: 'REC-7711', date: '2026-08-08', kiln: 'Kiln #1 (Maize Cob)', biocharKg: 72.0, co2eTons: 0.19, payoutKsh: 1220, status: 'M-PESA PAID' },
  ];

  const handleMpesaCashout = () => {
    if (farmerData.available_ksh <= 0) return;
    setIsWithdrawing(true);

    setTimeout(() => {
      const receipt = `QHK${Math.floor(1000000 + Math.random() * 9000000)}`;
      setFarmerData({
        ...farmerData,
        total_withdrawn_ksh: farmerData.total_withdrawn_ksh + farmerData.available_ksh,
        available_ksh: 0,
      });
      setPayoutReceipt(receipt);
      setIsWithdrawing(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto font-mono text-xs">
      
      {/* Farmer Dashboard Type Switcher Panel */}
      <div className="earthy-panel p-2 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-800 dark:text-stone-300 pl-3">
          Farmer Account Mode:
        </span>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setFarmerType('bio-sme')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              farmerType === 'bio-sme'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-transparent text-stone-800 dark:text-stone-300 hover:text-orange-500'
            }`}
          >
            Type A: Bio SME Outgrower
          </button>

          <button
            onClick={() => setFarmerType('cooperative')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              farmerType === 'cooperative'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-transparent text-stone-800 dark:text-stone-300 hover:text-emerald-500'
            }`}
          >
            Type B: Agricultural Coop Member
          </button>
        </div>
      </div>

      {/* Header Banner & Affiliation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-[#443028]/40 light:border-[#b8ad96] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-sans">
            Smallholder Farmer Portal
          </h1>
          <p className="text-stone-700 dark:text-stone-300 text-xs mt-1 font-bold">
            Producer: <strong>{farmerData.name}</strong> ({farmerData.phone})
          </p>
        </div>

        {/* PROMINENT CLICKABLE TEXT LINK TO PAST SALES & DATA RECORDS */}
        <button
          onClick={() => setShowFullRecordsView(true)}
          className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-lg transition-all cursor-pointer border border-orange-400/30"
          title="Open Full Past Sales & Data Records Page"
        >
          <FileText className="w-4 h-4 text-white" />
          <span className="text-xs">View Past Sales & Data Records &rarr;</span>
        </button>
      </div>

      {/* Real-time Earnings & M-Pesa Cashout Card */}
      <div className="earthy-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-[#443028] light:border-[#b8ad96] shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold">
              <Wallet className="w-4 h-4" />
              <span>Real-Time Earnings Available for Cashout</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              KSh {farmerData.available_ksh.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-xs font-bold">
              Backed by verified biochar removal ({farmerData.credits_generated_tons} tCO2e credits).
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[240px]">
            <button
              onClick={handleMpesaCashout}
              disabled={farmerData.available_ksh <= 0 || isWithdrawing}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                farmerData.available_ksh > 0
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <ArrowDownToLine className={`w-4 h-4 ${isWithdrawing ? 'animate-bounce' : ''}`} />
              <span>{isWithdrawing ? 'Transferring M-Pesa...' : 'Instant M-Pesa Cashout'}</span>
            </button>
            <span className="text-[11px] text-center text-stone-700 dark:text-stone-400 font-bold">Safaricom Daraja B2C Settlement</span>
          </div>
        </div>

        {payoutReceipt && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/60 text-emerald-400 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">M-Pesa Dispatched!</p>
                <p className="text-stone-300">Receipt Ref: <strong>{payoutReceipt}</strong> • Sent to {farmerData.phone}</p>
              </div>
            </div>
            <button onClick={() => setPayoutReceipt(null)} className="text-stone-400 hover:text-white">Dismiss</button>
          </div>
        )}
      </div>

      {/* 3D Representation of Smart Kilns with Multi-Kiln Switcher */}
      <div className="earthy-box p-6 sm:p-8">
        <KilnDigitalTwin3D theme={theme} />
      </div>

      {/* Line Graph & Records Link Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Line Graph */}
        <div className="earthy-box p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#443028]/40 light:border-[#b8ad96] pb-3">
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Carbon Credit Market Value Spot Trend</span>
            </div>
            <span className="text-stone-700 dark:text-stone-300 font-bold">Kenya Index</span>
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
        <div className="earthy-box p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#443028]/40 light:border-[#b8ad96] pb-4">
              <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
                <History className="w-5 h-5 text-emerald-500" />
                <span>Past Sales & Biochar Data</span>
              </div>
              
              {/* Clickable text link opening full records page */}
              <button
                onClick={() => setShowFullRecordsView(true)}
                className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>View Full Records Page &rarr;</span>
              </button>
            </div>

            <div className="space-y-3">
              {pastRecordsPreview.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-[#1c1512] light:bg-[#dad2bd] border border-[#443028] light:border-[#b8ad96] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">{rec.kiln}</p>
                    <p className="text-stone-700 dark:text-stone-300 text-[11px] font-bold">{rec.date} • {rec.biocharKg} KG Biochar</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">+KSh {rec.payoutKsh}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">{rec.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-600/30 text-stone-700 dark:text-stone-300 text-[11px] font-bold flex justify-between items-center">
            <span>Audit Ledger: Kenya EMCA 2026</span>
            <button
              onClick={() => setShowFullRecordsView(true)}
              className="text-orange-500 hover:underline font-bold"
            >
              Open Full Audit Records &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

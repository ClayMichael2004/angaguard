import React, { useState } from 'react';
import { CheckCircle2, ArrowDownToLine, Flame, Sparkles, Wallet, Clock, Check } from 'lucide-react';

export const FarmerPwaView = () => {
  const [farmer, setFarmer] = useState({
    phone: '+254712345678',
    name: 'Wanjala Wafula',
    national_id: '28491024',
    coop_id: 'COOP-KAKAMEGA-01',
    registered_kiln: 'KILN-001',
    total_burns: 14,
    total_biochar_kg: 1015.0,
    available_ksh: 8450.0,
    total_withdrawn_ksh: 22000.0,
    preferred_language: 'sw',
    created_at: new Date().toISOString(),
  });

  const [payouts, setPayouts] = useState([
    {
      transaction_id: 'B2C-FARM-994102',
      asset_id: 'AG-CORC-7f8a9c',
      recipient: '+254712345678',
      recipient_type: 'FARMER',
      amount_ksh: 4800.0,
      status: 'SUCCESS',
      mpesa_receipt: 'QBA4891LA4',
      timestamp: '2026-08-18T14:32:00Z',
    },
    {
      transaction_id: 'B2C-FARM-881290',
      asset_id: 'AG-CORC-4e2b1a',
      recipient: '+254712345678',
      recipient_type: 'FARMER',
      amount_ksh: 3650.0,
      status: 'SUCCESS',
      mpesa_receipt: 'PKA1928NZ9',
      timestamp: '2026-08-12T09:15:00Z',
    },
  ]);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  const handleWithdrawMpesa = () => {
    if (farmer.available_ksh <= 0) return;

    setIsWithdrawing(true);
    setTimeout(() => {
      const receipt = `QHK${Math.floor(1000000 + Math.random() * 9000000)}`;
      const amountWithdrawn = farmer.available_ksh;

      const newPayout = {
        transaction_id: `B2C-FARM-${Date.now()}`,
        asset_id: 'AG-CORC-INSTANT',
        recipient: farmer.phone,
        recipient_type: 'FARMER',
        amount_ksh: amountWithdrawn,
        status: 'SUCCESS',
        mpesa_receipt: receipt,
        timestamp: new Date().toISOString(),
      };

      setPayouts([newPayout, ...payouts]);
      setFarmer({
        ...farmer,
        total_withdrawn_ksh: farmer.total_withdrawn_ksh + amountWithdrawn,
        available_ksh: 0,
      });

      setSuccessReceipt(receipt);
      setIsWithdrawing(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Farmer PWA Portal</h1>
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono px-2.5 py-1 rounded-lg">
              Field View
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Mobile-optimized progressive portal for smallholder farmers and cooperative fleet operators.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">
            WW
          </div>
          <div className="text-xs font-mono">
            <p className="text-white font-bold">{farmer.name}</p>
            <p className="text-slate-400">{farmer.phone} • {farmer.registered_kiln}</p>
          </div>
        </div>
      </div>

      {/* M-Pesa Liquid Balance Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/80 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
              <Wallet className="w-4 h-4" />
              <span>Available M-Pesa Cashout Balance</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              KSh {farmer.available_ksh.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Directly backed by verified Biochar Carbon Removal Certificates ($50.00 / Ton equivalent split).
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[220px]">
            <button
              onClick={handleWithdrawMpesa}
              disabled={farmer.available_ksh <= 0 || isWithdrawing}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                farmer.available_ksh > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/60 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ArrowDownToLine className={`w-5 h-5 ${isWithdrawing ? 'animate-bounce' : ''}`} />
              <span>{isWithdrawing ? 'Routing M-Pesa Rails...' : 'Instant M-Pesa Cashout'}</span>
            </button>
            <span className="text-[11px] text-center text-slate-500 font-mono">Safaricom Daraja B2C Instant Settlement</span>
          </div>
        </div>

        {/* Withdrawal Success Alert */}
        {successReceipt && (
          <div className="mt-6 p-4 bg-emerald-900/50 border border-emerald-600/60 rounded-2xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div className="text-xs font-mono">
                <p className="text-white font-bold">M-Pesa Payout Dispatched Successfully!</p>
                <p className="text-emerald-300">Receipt Ref: <strong>{successReceipt}</strong> • Sent to {farmer.phone}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessReceipt(null)}
              className="text-xs font-mono text-emerald-400 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Total Verified Burns</span>
          </div>
          <p className="text-3xl font-black text-white">{farmer.total_burns} <span className="text-sm font-normal text-slate-400">Cycles</span></p>
          <p className="text-[11px] text-slate-500 font-mono">Zero unmonitored open-field fires</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Biochar Harvested</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">{farmer.total_biochar_kg.toLocaleString()} <span className="text-sm font-normal text-slate-400">KG</span></p>
          <p className="text-[11px] text-emerald-500/80 font-mono">75% Pure Elemental Carbon Returned to Soil</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Check className="w-4 h-4 text-sky-400" />
            <span>Total Withdrawn to Date</span>
          </div>
          <p className="text-3xl font-black text-white font-mono">KSh {farmer.total_withdrawn_ksh.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-mono">37.0% Net Carbonmark Split</p>
        </div>
      </div>

      {/* Recent M-Pesa Disbursal Activity Ledger */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span>Safaricom M-Pesa Transaction Activity</span>
        </h2>

        <div className="space-y-3">
          {payouts.map((p) => (
            <div
              key={p.transaction_id}
              className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">
                  KSh
                </div>
                <div>
                  <p className="text-white font-bold">{p.mpesa_receipt} • B2C Disbursal</p>
                  <p className="text-slate-500">{new Date(p.timestamp).toLocaleString()} • {p.recipient}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold font-mono">+KSh {p.amount_ksh.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

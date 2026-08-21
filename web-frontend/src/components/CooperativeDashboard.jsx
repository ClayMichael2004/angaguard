import React, { useState, useEffect, useCallback } from 'react';
import { Users, BarChart2, ShoppingBag, History, ArrowUpRight, Layers, Flame, Search, Filter, ShieldCheck, CheckCircle2, FileText, Download, Building2, Smartphone, Lock, AlertCircle, X, ChevronRight, RefreshCw, ArrowLeft, Check } from 'lucide-react';
import { KilnDigitalTwin3D } from './KilnDigitalTwin3D';
import { LineGraph } from './LineGraph';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';
import { api } from '../services/api';

export const CooperativeDashboard = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'kilns', 'members', 'transactions', 'smes', 'sell'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  // Dynamic Cooperative Summary State (Loaded from SQLite backend)
  const [coopInfo, setCoopInfo] = useState({
    id: 'COOP-KAKAMEGA-01',
    name: 'Kakamega Sugarcane Smallholders Network',
    region: 'Kakamega, Western Kenya',
    farmer_count: 148,
    active_kilns: 18,
    cumulative_credits_tons: 62.4,
    cumulative_biochar_kg: 28450.0,
    total_biochar_kg: 28450.0,
    cumulative_worth_usd: 8424.0,
    cumulative_worth_ksh: 1095120.0,
  });

  // Dynamic Smart Kilns Fleet (Loaded from SQLite backend)
  const [smartKilnsFleet, setSmartKilnsFleet] = useState([]);

  // Dynamic Smallholder Members (Loaded from SQLite backend)
  const [memberFarmers, setMemberFarmers] = useState([]);

  // Dynamic Corporate SME Buyers (Loaded from SQLite backend)
  const [smeBuyersList, setSmeBuyersList] = useState([]);

  // Dynamic Transactions Audit Log (Loaded from SQLite backend)
  const [transactionsAuditLog, setTransactionsAuditLog] = useState([]);

  // Fetch all cooperative data dynamically from SQLite backend
  const fetchCoopData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getCooperativeDetails(coopInfo.id || 'COOP-KAKAMEGA-01');
      if (data) {
        if (data.cooperative) {
          const c = data.cooperative;
          const creditsTons = c.total_offsets_tons || 62.4;
          const biocharKg = c.total_biochar_kg || 28450.0;
          setCoopInfo({
            id: c.id,
            name: c.name,
            region: c.region,
            farmer_count: c.farmer_count || 148,
            active_kilns: (data.kilns && data.kilns.length) || (c.registered_kilns && c.registered_kilns.length) || 18,
            cumulative_credits_tons: creditsTons,
            cumulative_biochar_kg: biocharKg,
            total_biochar_kg: biocharKg,
            cumulative_worth_usd: creditsTons * 135.0,
            cumulative_worth_ksh: creditsTons * 135.0 * 130.0,
          });
        }

        if (data.kilns && data.kilns.length > 0) {
          setSmartKilnsFleet(data.kilns.map(k => ({
            id: k.id,
            farmer: k.farmer_name || 'Smallholder Operator',
            phone: k.farmer_phone || '+254712345678',
            location: k.location || 'Western Kenya',
            status: k.status || 'ACTIVE',
            skinTemp: k.skin_temp_c || 58.5,
            coreTemp: k.core_temp_c || 571.7,
            charDepth: k.char_depth_cm || 30.0,
            initialDepth: k.initial_depth_cm || 85.0,
            battery: k.battery_pct || 90,
            lastYieldKg: k.last_yield_kg || 80.0,
            lastYieldTons: k.last_yield_tons || 0.20,
          })));
        }

        if (data.farmers && data.farmers.length > 0) {
          setMemberFarmers(data.farmers.map(f => ({
            phone: f.phone,
            name: f.name,
            nationalId: f.national_id || '28491024',
            location: f.registered_kiln ? `Plot ${f.registered_kiln.split(',')[0]}` : 'Kakamega Cluster',
            kilns: f.registered_kiln || 'KILN-001',
            burns: f.total_burns || 12,
            biocharKg: f.total_biochar_kg || 850.0,
            creditsTons: Number(((f.total_biochar_kg || 850.0) * 0.00274).toFixed(2)),
            worthKsh: (f.total_burns || 12) * 2800,
            withdrawnKsh: f.total_withdrawn_ksh || 15000,
            rating: (f.total_burns || 12) >= 15 ? 'AAA' : (f.total_burns || 12) >= 10 ? 'AA' : 'A',
            mpesaStatus: 'ACTIVE',
          })));
        }

        if (data.sme_buyers && data.sme_buyers.length > 0) {
          setSmeBuyersList(data.sme_buyers.map(b => ({
            id: b.id,
            name: b.name,
            location: b.location,
            industry: b.industry,
            purchasedTons: b.purchased_tons,
            valueUsd: b.value_usd,
            valueKsh: b.value_ksh,
            status: b.status,
            ncrCert: b.ncr_cert,
            contact: b.contact,
          })));
        }

        if (data.transactions && data.transactions.length > 0) {
          setTransactionsAuditLog(data.transactions.map(tx => ({
            id: tx.id,
            date: tx.date || new Date(tx.timestamp).toLocaleString('en-KE'),
            type: tx.type,
            kiln: tx.kiln_id,
            farmer: tx.farmer_name,
            massKg: tx.mass_kg,
            co2eTons: tx.co2e_tons,
            farmerPayoutKSh: tx.farmer_payout_ksh,
            coopStipendKSh: tx.coop_stipend_ksh,
            receipt: tx.receipt,
            ncrId: tx.ncr_id,
          })));
        }
      }
      setLastSync(new Date());
    } catch (err) {
      console.error('Failed to load SQLite cooperative dataset:', err);
    } finally {
      setIsLoading(false);
    }
  }, [coopInfo.id]);

  useEffect(() => {
    fetchCoopData();
    const interval = setInterval(fetchCoopData, 15000);
    return () => clearInterval(interval);
  }, [fetchCoopData]);

  // Line Graph Spot Trend Data
  const lineGraphData = [
    { x: 'Week 1', y: 45 },
    { x: 'Week 2', y: 78 },
    { x: 'Week 3', y: 110 },
    { x: 'Week 4', y: 135 },
  ];

  // Realistic Multi-Step Sell Credits State
  const [sellStep, setSellStep] = useState(1); // 1: Buyer & Volume, 2: dMRV Quality Check, 3: Revenue Split, 4: PIN Sign-off, 5: Confirmation
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [sellTonnage, setSellTonnage] = useState(5.0);
  const [coopPin, setCoopPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  const [tradeConfirmation, setTradeConfirmation] = useState(null);

  const handleStartSellFlow = (buyer = null) => {
    setSelectedBuyer(buyer || (smeBuyersList.length > 0 ? smeBuyersList[0] : null));
    setSellTonnage(5.0);
    setSellStep(1);
    setCoopPin('');
    setPinError('');
    setActiveTab('sell');
  };

  const handleExecuteTradeAuth = async () => {
    if (coopPin.length !== 4 || isNaN(Number(coopPin))) {
      setPinError('Please enter a valid 4-digit Cooperative Manager Authorization PIN (Demo: 2026)');
      return;
    }
    setPinError('');
    setIsProcessingTrade(true);

    try {
      const res = await api.executeCoopTrade({
        coop_id: coopInfo.id,
        buyer_id: selectedBuyer ? selectedBuyer.id : '',
        tonnage: sellTonnage,
        price_usd: 135.0,
        coop_pin: coopPin,
      });

      if (res && res.success) {
        setTradeConfirmation({
          certId: res.cert_id,
          buyerName: res.buyer_name,
          tonnage: res.tonnage,
          pricePerTon: 135.0,
          totalUsd: res.total_usd,
          totalKsh: res.total_ksh,
          farmerShareKsh: res.farmer_share_ksh,
          coopStipendKsh: res.coop_stipend_ksh,
          receipt: res.receipt,
          date: res.date,
        });

        // Prepend new settled transaction to audit log
        setTransactionsAuditLog(prev => [
          {
            id: `TXN-${res.receipt.slice(-4)}`,
            date: res.date,
            type: 'MARKET SALE',
            kiln: 'POOLED BATCH',
            farmer: `Coop Pool -> ${res.buyer_name}`,
            massKg: res.tonnage * 456.6,
            co2eTons: res.tonnage,
            farmerPayoutKsh: res.farmer_share_ksh,
            coopStipendKsh: res.coop_stipend_ksh,
            receipt: res.receipt,
            ncrId: res.cert_id,
          },
          ...prev
        ]);

        setSellStep(5);
      } else {
        setPinError(res?.error || 'Trade authorization failed. Please check your PIN.');
      }
    } catch (err) {
      setPinError('Network error executing trade on Kenya NCR backend.');
    } finally {
      setIsProcessingTrade(false);
    }
  };

  // Filtered members list
  const filteredMembers = memberFarmers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.kilns.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterRegion === 'all') return matchesSearch;
    return matchesSearch && m.location.toLowerCase().includes(filterRegion.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto text-xs text-stone-900 dark:text-stone-100">
      
      {/* Top Cooperative Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#443028]/40 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black">
              Agricultural Cooperative Hub
            </h1>
            <span className="bg-emerald-950/40 border border-emerald-600/60 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
              Western Kenya Region
            </span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 font-bold flex items-center space-x-2">
            <span>{coopInfo.name} • Hub ID: <strong>{coopInfo.id}</strong></span>
            <span className="text-stone-500">• Synced: {lastSync.toLocaleTimeString()}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCoopData}
            title="Refresh database records"
            className="p-2.5 rounded-xl border border-[#443028] bg-[#1c1512] text-stone-300 hover:text-white cursor-pointer transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          <button
            onClick={() => handleStartSellFlow()}
            className={`px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all cursor-pointer border flex items-center space-x-2 text-xs ${
              activeTab === 'sell'
                ? 'bg-orange-600 border-orange-400 text-white'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-orange-400/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sell Pooled Carbon Credits &rarr;</span>
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar (When not in full-page sell mode) */}
      {activeTab !== 'sell' && (
        <>
          {/* Cumulative KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="earthy-box p-4 space-y-1.5 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Pooled Carbon Harvest</span>
                <Flame className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {coopInfo.cumulative_credits_tons} tCO2e
              </p>
              <p className="text-stone-500 text-xs font-bold">
                = {(coopInfo.cumulative_biochar_kg || coopInfo.total_biochar_kg || 0).toLocaleString()} KG Biochar
              </p>
            </div>

            <div className="earthy-box p-4 space-y-1.5 border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Coop Pool Valuation</span>
                <span className="text-orange-500 font-bold text-xs">$135/t</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                KSh {coopInfo.cumulative_worth_ksh.toLocaleString()}
              </p>
              <p className="text-stone-500 text-xs font-bold">
                ≈ ${coopInfo.cumulative_worth_usd.toLocaleString()} USD (Spot)
              </p>
            </div>

            <div className="earthy-box p-4 space-y-1.5 border-l-4 border-l-cyan-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Smart Kilns Fleet</span>
                <Layers className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                {smartKilnsFleet.length || coopInfo.active_kilns} Units
              </p>
              <p className="text-emerald-500 text-xs font-bold">
                100% Online with LoRaWAN
              </p>
            </div>

            <div className="earthy-box p-4 space-y-1.5 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-bold uppercase text-[11px]">Registered Smallholders</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                {memberFarmers.length || coopInfo.farmer_count} Members
              </p>
              <p className="text-stone-500 text-xs font-bold">
                Enrolled in M-Pesa B2C
              </p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="earthy-panel p-1.5 rounded-2xl flex flex-wrap gap-1.5">
            {[
              { id: 'overview', label: 'Overview & 3D Kilns', icon: Layers },
              { id: 'kilns', label: `Smart Kilns Fleet (${smartKilnsFleet.length})`, icon: Flame },
              { id: 'members', label: `Smallholder Members (${memberFarmers.length})`, icon: Users },
              { id: 'transactions', label: `Transactions Audit (${transactionsAuditLog.length})`, icon: History },
              { id: 'smes', label: `SME Buyers & Contracts (${smeBuyersList.length})`, icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-transparent text-stone-600 dark:text-stone-400 hover:text-emerald-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & 3D KILN NETWORK                                         */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Market Carbon Credit Trend Graph */}
          <div className="earthy-box p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#443028]/40 pb-3">
              <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                <BarChart2 className="w-4 h-4 text-orange-500" />
                <span>Cooperative Carbon Credit Market Trend ($/tCO2e)</span>
              </div>
              <span className="text-stone-500 text-xs">Kenyan Spot Range: $35 - $145/t</span>
            </div>

            <LineGraph data={lineGraphData} height={200} valuePrefix="$" valueSuffix="/t" />
          </div>

          {/* 3D Representation of Member Kilns */}
          <div className="earthy-box p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#443028]/40">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">3D Kiln Fleet Telemetry Network</h3>
                <p className="text-stone-500 text-xs">Real-time visual monitoring of pyrolysis thermal profiles and char retention</p>
              </div>
              <span className="text-emerald-500 font-bold bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded-full text-xs">
                {smartKilnsFleet.length} Kilns Online
              </span>
            </div>
            <KilnDigitalTwin3D theme={theme} showHeader={false} />
          </div>

          {/* Quick Previews: Kilns & Top Buyers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="earthy-box p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#443028]/40 pb-2.5">
                <div className="flex items-center space-x-2 font-bold">
                  <Flame className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs">Active Kilns Quick View</span>
                </div>
                <button onClick={() => setActiveTab('kilns')} className="text-orange-500 hover:underline font-bold text-xs cursor-pointer">
                  View All ({smartKilnsFleet.length}) &rarr;
                </button>
              </div>
              <div className="space-y-2.5">
                {smartKilnsFleet.slice(0, 4).map((k) => (
                  <div key={k.id} className="p-3 rounded-xl bg-[#1c1512] border border-[#443028] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">{k.id} • {k.location}</p>
                      <p className="text-stone-400 text-[11px]">{k.farmer} ({k.phone})</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        k.status === 'ACTIVE' ? 'bg-orange-950 text-orange-400 border border-orange-700' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {k.status} ({k.skinTemp}°C)
                      </span>
                      <p className="text-stone-400 text-[11px] mt-0.5">{k.lastYieldKg} KG Biochar</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="earthy-box p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#443028]/40 pb-2.5">
                <div className="flex items-center space-x-2 font-bold">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span className="text-xs">SME Offtaker Contracts</span>
                </div>
                <button onClick={() => setActiveTab('smes')} className="text-orange-500 hover:underline font-bold text-xs cursor-pointer">
                  Marketplace Hub &rarr;
                </button>
              </div>
              <div className="space-y-2.5">
                {smeBuyersList.slice(0, 4).map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-[#1c1512] border border-[#443028] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">{b.name}</p>
                      <p className="text-stone-400 text-[11px]">{b.industry} • {b.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 text-xs">{b.purchasedTons} Tons CO2e</p>
                      <p className="text-stone-400 text-[11px]">KSh {b.valueKsh.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SMART KILNS FLEET                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'kilns' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Smart Kilns Fleet Registry ({smartKilnsFleet.length} Units)</h3>
              <p className="text-stone-500 text-xs">Distributed top-lit updraft biochar kilns across Western Kenya smallholders</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-400 font-bold">Total Fleet Capacity:</span>
              <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-600 text-emerald-400 font-bold rounded-xl text-xs">
                1.45 Tonnes Biochar / Cycle
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartKilnsFleet.map((kiln) => (
              <div key={kiln.id} className="earthy-box p-4 space-y-3 border border-[#443028]">
                <div className="flex items-center justify-between border-b border-[#443028]/40 pb-2">
                  <div className="flex items-center space-x-2">
                    <Flame className={`w-4 h-4 ${kiln.status === 'ACTIVE' ? 'text-orange-500 animate-pulse' : 'text-emerald-500'}`} />
                    <span className="font-black text-sm text-white">{kiln.id}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    kiln.status === 'ACTIVE'
                      ? 'bg-orange-950/60 border-orange-600 text-orange-400'
                      : kiln.status === 'COOLING'
                      ? 'bg-cyan-950/60 border-cyan-600 text-cyan-400'
                      : 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                  }`}>
                    {kiln.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Owner Farmer:</span>
                    <strong className="text-white">{kiln.farmer}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Location:</span>
                    <span className="text-stone-200">{kiln.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Skin Temp / Core:</span>
                    <span className="text-orange-400 font-bold">{kiln.skinTemp}°C / ~{kiln.coreTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Char Bed Depth:</span>
                    <span className="text-stone-200">{kiln.charDepth} cm (Initial: {kiln.initialDepth} cm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Recent Yield:</span>
                    <strong className="text-emerald-400">{kiln.lastYieldKg} KG ({kiln.lastYieldTons} tCO2e)</strong>
                  </div>
                </div>

                <div className="border-t border-[#443028]/40 pt-2 flex justify-between items-center text-[11px] text-stone-500">
                  <span>Battery: {kiln.battery}% 🔋</span>
                  <span>LoRaWAN: Strong 📶</span>
                  <span className="text-emerald-400 font-bold">Verified dMRV</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SMALLHOLDER MEMBERS & CREDIT RATINGS                               */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Cooperative Member Registry ({memberFarmers.length} Smallholders)</h3>
              <p className="text-stone-500 text-xs">Search members, view assigned kilns, carbon credits produced, and creditworthiness ratings</p>
            </div>
            <button
              onClick={() => {
                const headers = ['Farmer Name', 'Phone Number', 'National ID', 'Sub-County Location', 'Assigned Smart Kilns', 'Pyrolysis Burns', 'Biochar Harvest (KG)', 'Carbon Credits (tCO2e)', 'Cumulative Value (KSh)', 'Cumulative Withdrawn (KSh)', 'Credit Rating', 'M-Pesa Status'];
                const rows = memberFarmers.map((m) => [
                  m.name,
                  m.phone,
                  m.nationalId,
                  m.location,
                  m.kilns,
                  m.burns,
                  m.biocharKg,
                  m.creditsTons,
                  m.worthKsh,
                  m.withdrawnKsh,
                  m.rating,
                  m.mpesaStatus
                ]);
                downloadCSV('kakamega_cooperative_members_registry.csv', headers, rows);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center space-x-2 self-start cursor-pointer shadow-md text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Members CSV</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
              <input
                type="text"
                placeholder="Search member by name, phone, kiln ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1c1512] border border-[#443028] pl-10 pr-4 py-2.5 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full bg-[#1c1512] border border-[#443028] px-4 py-2.5 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="all">All Wards / Sub-Counties</option>
                <option value="Kakamega">Kakamega Central</option>
                <option value="Mumias">Mumias Hub</option>
                <option value="Butere">Butere Outgrowers</option>
                <option value="Malava">Malava</option>
                <option value="Shinyalu">Shinyalu</option>
                <option value="Matungu">Matungu</option>
                <option value="Lugari">Lugari</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="earthy-box p-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#443028] text-stone-400 font-bold uppercase text-[11px]">
                  <th className="pb-3 px-3">Member Name</th>
                  <th className="pb-3 px-3">Phone & Nat ID</th>
                  <th className="pb-3 px-3">Ward / Location</th>
                  <th className="pb-3 px-3">Assigned Kilns</th>
                  <th className="pb-3 px-3 text-right">Harvest (KG / Tons)</th>
                  <th className="pb-3 px-3 text-right">Earned (KSh / USD)</th>
                  <th className="pb-3 px-3 text-center">Credit Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#443028]/40">
                {filteredMembers.map((m) => (
                  <tr key={m.phone} className="hover:bg-[#1c1512]/60 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-white text-xs">{m.name}</p>
                      <span className="text-[11px] text-emerald-400">{m.burns} Clean Burns</span>
                    </td>
                    <td className="py-3 px-3 text-stone-300">
                      <p>{m.phone}</p>
                      <span className="text-[10px] text-stone-500">ID: {m.nationalId}</span>
                    </td>
                    <td className="py-3 px-3 text-stone-300">{m.location}</td>
                    <td className="py-3 px-3 font-bold text-orange-400">{m.kilns}</td>
                    <td className="py-3 px-3 text-right">
                      <p className="font-bold text-emerald-400">{m.biocharKg.toLocaleString()} KG</p>
                      <span className="text-[11px] text-stone-400">{m.creditsTons} tCO2e</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <p className="font-bold text-white">KSh {m.worthKsh.toLocaleString()}</p>
                      <span className="text-[11px] text-stone-400">${(m.worthKsh / 130.0).toFixed(2)} USD</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-950 border border-emerald-600 text-emerald-300">
                        {m.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TRANSACTIONS & AUDIT TRAIL                                         */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Cooperative Transactions & Settlement Audit Log</h3>
              <p className="text-stone-500 text-xs">Immutable SHA-256 batch stamps anchored to the Kenya National Carbon Registry (NCR)</p>
            </div>
            <button
              onClick={() => {
                const headers = ['Transaction ID', 'Date & Time', 'Transaction Type', 'Smart Kiln', 'Beneficiary Farmer', 'Biochar Mass (KG)', 'CO2e Sequestered (t)', 'Farmer Payout (KSh)', 'Coop Stipend (KSh)', 'Safaricom M-Pesa Receipt', 'Kenya NCR ID'];
                const rows = transactionsAuditLog.map((tx) => [
                  tx.id,
                  tx.date,
                  tx.type,
                  tx.kiln,
                  tx.farmer,
                  tx.massKg,
                  tx.co2eTons,
                  tx.farmerPayoutKSh,
                  tx.coopStipendKSh,
                  tx.receipt,
                  tx.ncrId
                ]);
                downloadCSV('kakamega_cooperative_transactions_audit_log.csv', headers, rows);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center space-x-2 self-start cursor-pointer shadow-md text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {transactionsAuditLog.map((tx) => (
              <div key={tx.id} className="earthy-box p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#443028]">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{tx.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                      {tx.type}
                    </span>
                    <span className="text-stone-400 text-xs">{tx.date}</span>
                  </div>
                  <p className="text-stone-300 text-xs">
                    Kiln: <strong>{tx.kiln}</strong> • Beneficiary: <strong>{tx.farmer}</strong>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Kenya NCR Tracking: <strong className="text-emerald-400">{tx.ncrId}</strong> • Safaricom Receipt: <strong>{tx.receipt}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right sm:border-l sm:border-[#443028] sm:pl-6 space-y-1">
                  <p className="text-xs font-bold text-emerald-400">+{tx.co2eTons} Tonnes CO2e ({tx.massKg} KG)</p>
                  <p className="text-xs text-white">Farmer Payout: <strong>KSh {tx.farmerPayoutKsh.toLocaleString()}</strong></p>
                  <p className="text-[11px] text-orange-400">Coop Stipend: <strong>KSh {tx.coopStipendKsh.toLocaleString()}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SME BUYERS & MARKETPLACE CONTRACTS                                 */}
      {/* ========================================================================= */}
      {activeTab === 'smes' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Corporate SME Offtakers & Marketplace Buyers</h3>
              <p className="text-stone-500 text-xs">Agribusiness and industrial enterprises buying verified biochar removals for ESG compliance</p>
            </div>
            <button
              onClick={() => handleStartSellFlow()}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-2 self-start cursor-pointer shadow-md text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Create New Sale Order &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smeBuyersList.map((sme) => (
              <div key={sme.id} className="earthy-box p-4 space-y-3 border border-[#443028] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#443028]/40 pb-2">
                    <h4 className="font-black text-sm text-white">{sme.name}</h4>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 border border-emerald-700 text-emerald-400">
                      {sme.status}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs">{sme.industry} • {sme.location}</p>
                  <p className="text-stone-400 text-[11px]">Contact: {sme.contact}</p>

                  <div className="bg-[#120e0c] p-3 rounded-xl border border-[#443028] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Total Retired:</span>
                      <strong className="text-emerald-400">{sme.purchasedTons} Tonnes CO2e</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Contract Value:</span>
                      <strong className="text-white">${sme.valueUsd.toLocaleString()} USD (KSh {sme.valueKsh.toLocaleString()})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">NCR Certificate:</span>
                      <span className="text-orange-400 font-bold">{sme.ncrCert}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartSellFlow(sme)}
                  className="w-full py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-md text-xs"
                >
                  <span>Sell Additional Credits to {sme.name.split(' ')[0]}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: FULL-PAGE DEDICATED "SELL POOLED CREDITS" EXCHANGE VIEW            */}
      {/* ========================================================================= */}
      {activeTab === 'sell' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Breadcrumb Header for Full-Page View */}
          <div className="earthy-box p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#443028]">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="p-2 rounded-xl border border-[#443028] bg-[#120e0c] hover:bg-[#281e19] text-stone-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span>Back to Hub</span>
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Cooperative Pooled Carbon Credits Settlement Exchange
                </h2>
                <p className="text-xs text-stone-400">
                  {coopInfo.name} &bull; Official Settlement Portal Anchored to Kenya NCR
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-950/50 border border-emerald-700 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-bold text-xs">
                Available Pool: {coopInfo.cumulative_credits_tons} tCO2e
              </span>
            </div>
          </div>

          {/* Expansive Step Progress Tracker */}
          <div className="earthy-panel p-2 rounded-2xl grid grid-cols-5 gap-2 text-center text-xs font-bold">
            {[
              { step: 1, label: '1. Buyer & Volume' },
              { step: 2, label: '2. dMRV Quality Audit' },
              { step: 3, label: '3. 3-Way Revenue Split' },
              { step: 4, label: '4. PIN Authorization' },
              { step: 5, label: '5. Settlement Voucher' }
            ].map((s) => (
              <div
                key={s.step}
                className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                  sellStep === s.step
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
                    : sellStep > s.step
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : 'bg-[#120e0c] border-[#443028]/60 text-stone-500'
                }`}
              >
                <span className="text-xs hidden md:inline">{s.label}</span>
                <span className="text-xs md:hidden">Step {s.step}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: CHOOSE BUYER & VOLUME (EXPANSIVE 2-COLUMN VIEW) */}
          {sellStep === 1 && (
            <div className="earthy-box p-6 sm:p-8 space-y-6 animate-fadeIn border border-[#443028]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Volume Selection */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-200">Select Offtaker / Carbonmark Open Pool:</label>
                    <select
                      value={selectedBuyer ? selectedBuyer.id : ''}
                      onChange={(e) => {
                        const found = smeBuyersList.find((b) => b.id === e.target.value);
                        setSelectedBuyer(found || null);
                      }}
                      className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="">Carbonmark Open Liquidity Pool ($135.00 / tCO2e)</option>
                      {smeBuyersList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.industry} - $135.00/t)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-200">Quick Volume Presets:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[5.0, 10.0, 20.0, coopInfo.cumulative_credits_tons].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSellTonnage(preset)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            sellTonnage === preset
                              ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                              : 'bg-[#120e0c] border-[#443028] text-stone-300 hover:border-stone-400'
                          }`}
                        >
                          {idx === 3 ? `Max (${preset}t)` : `${preset} Tonnes`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-stone-200 text-sm">Exact Tonnage (tCO2e):</label>
                      <span className="text-emerald-400 font-bold">Max Available: {coopInfo.cumulative_credits_tons} tCO2e</span>
                    </div>
                    <input
                      type="number"
                      min="0.5"
                      max={coopInfo.cumulative_credits_tons}
                      step="0.5"
                      value={sellTonnage}
                      onChange={(e) => setSellTonnage(Math.min(coopInfo.cumulative_credits_tons, Math.max(0.5, Number(e.target.value))))}
                      className="w-full bg-[#120e0c] border border-[#443028] p-3.5 rounded-xl text-white font-bold text-base focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-xs text-stone-400">
                      Equivalent Biochar Sink: <strong>{(sellTonnage * 456.6).toFixed(1)} KG</strong> from verified kiln burns.
                    </p>
                  </div>
                </div>

                {/* Right Column: Real-Time Valuation Card */}
                <div className="bg-[#120e0c] p-6 rounded-2xl border border-[#443028] flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-[#443028] pb-3">
                      Real-Time Settlement Valuation
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Benchmark Spot Price:</span>
                        <span className="font-bold text-white text-sm">$135.00 USD / Ton</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Kenya Shilling Rate:</span>
                        <span className="font-bold text-white text-sm">KSh 17,550 / Ton</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Selected Credit Volume:</span>
                        <span className="font-bold text-white text-sm">{sellTonnage} Metric Tonnes</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-400">
                        <span>Biochar Mass Equivalent:</span>
                        <span className="font-bold text-emerald-400 text-sm">{(sellTonnage * 456.6).toFixed(1)} KG</span>
                      </div>
                      
                      <div className="border-t border-[#443028] pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-200 text-sm">Gross Total (USD):</span>
                          <strong className="text-emerald-400 text-lg font-black">
                            ${(sellTonnage * 135.0).toFixed(2)} USD
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-200 text-sm">Gross Total (KSh):</span>
                          <strong className="text-amber-400 text-lg font-black">
                            KSh {(sellTonnage * 135.0 * 130).toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/80 text-xs text-emerald-300">
                    &check; Direct automated M-Pesa batch settlement to {memberFarmers.length} smallholder wallets on blockchain execution.
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  Cancel & Back to Hub
                </button>
                <button
                  onClick={() => setSellStep(2)}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg text-xs"
                >
                  <span>Proceed to Quality Audit &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: dMRV QUALITY & REGULATORY CHECK */}
          {sellStep === 2 && (
            <div className="earthy-box p-6 sm:p-8 space-y-6 animate-fadeIn border border-[#443028]">
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  dMRV Quality & Registry Compliance Audit
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Verifying pyrolytic data integrity across all {smartKilnsFleet.length} smart kilns before minting credit batch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="p-5 rounded-2xl bg-[#120e0c] border border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center space-x-2.5 font-bold text-white text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Fixed Carbon Purity</span>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-700">
                      77.4% PASSED
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Exceeds minimum regulatory threshold (&ge; 75%) for high-grade elemental carbon.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#120e0c] border border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center space-x-2.5 font-bold text-white text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>100-Year Soil Permanence</span>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-700">
                      0.97 VERIFIED
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Soil permanence factor locked at 97% storage stability under Western Kenya soils.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#120e0c] border border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center space-x-2.5 font-bold text-white text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Hardware Geo-Fence Seal</span>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-700">
                      SIGNED
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Authenticated via Safaricom tower triangulation in Kakamega & Mumias corridors.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#120e0c] border border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center space-x-2.5 font-bold text-white text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Kenya NCR EMCA 2026</span>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-700">
                      AUTHORIZED
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Serialized for instant national carbon register settlement and corresponding adjustment.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setSellStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  &larr; Back to Volume
                </button>
                <button
                  onClick={() => setSellStep(3)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg text-xs"
                >
                  <span>View Revenue Split &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVENUE SPLIT BREAKDOWN */}
          {sellStep === 3 && (
            <div className="earthy-box p-6 sm:p-8 space-y-6 animate-fadeIn border border-[#443028]">
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  Automated 3-Way Revenue Distribution
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Gross proceeds of <strong>${(sellTonnage * 135).toFixed(2)} USD (KSh {(sellTonnage * 135 * 130).toLocaleString()})</strong> split automatically via smart contract oracle.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Share 1: Farmers */}
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-700/80 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-300">Smallholders Payout</span>
                      <span className="text-xs font-black bg-emerald-800 text-white px-2.5 py-0.5 rounded-lg">37.0%</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-emerald-400">
                        KSh {(sellTonnage * 50 * 130).toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-300/80">
                        ${(sellTonnage * 50).toFixed(2)} USD ($50/t)
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed border-t border-emerald-800/60 pt-3">
                    Disbursed directly to smallholder M-Pesa wallets across smart kiln clusters.
                  </p>
                </div>

                {/* Share 2: Coop Operations */}
                <div className="p-6 rounded-2xl bg-orange-950/40 border border-orange-700/80 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-orange-300">Coop Operational Share</span>
                      <span className="text-xs font-black bg-orange-800 text-white px-2.5 py-0.5 rounded-lg">14.8%</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-orange-400">
                        KSh {(sellTonnage * 20 * 130).toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-300/80">
                        ${(sellTonnage * 20).toFixed(2)} USD ($20/t)
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed border-t border-orange-800/60 pt-3">
                    Retained for kiln maintenance, field extension officers, and hauling.
                  </p>
                </div>

                {/* Share 3: Platform Clearing */}
                <div className="p-6 rounded-2xl bg-[#120e0c] border border-[#443028] space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-300">Platform & Clearing</span>
                      <span className="text-xs font-black bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded-lg">48.2%</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-stone-200">
                        KSh {(sellTonnage * 65 * 130).toLocaleString()}
                      </p>
                      <p className="text-xs text-stone-500">
                        ${(sellTonnage * 65).toFixed(2)} USD ($65/t)
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed border-t border-[#443028] pt-3">
                    Covers dMRV IoT telemetry bandwidth and Kenya NCR registry fees.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#443028]">
                <button
                  onClick={() => setSellStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  &larr; Back to Quality Audit
                </button>
                <button
                  onClick={() => setSellStep(4)}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg text-xs"
                >
                  <span>Proceed to PIN Authorization &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COOPERATIVE AUTHORIZER PIN PROMPT */}
          {sellStep === 4 && (
            <div className="earthy-box p-8 sm:p-12 space-y-6 animate-fadeIn border border-[#443028] text-center max-w-xl mx-auto">
              <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-2xl">
                <Lock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-white text-lg">Cooperative Authorization Sign-Off</h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  Authorizing trade of <strong>{sellTonnage} Tonnes CO2e</strong> to <strong>{selectedBuyer ? selectedBuyer.name : 'Carbonmark'}</strong> for <strong>KSh {(sellTonnage * 135 * 130).toLocaleString()}</strong>.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-3">
                <label className="text-xs font-bold text-stone-300 block">
                  Enter 4-Digit Coop Manager PIN (Demo: 2026):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={coopPin}
                  onChange={(e) => setCoopPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#120e0c] border-2 border-orange-500/80 p-3.5 rounded-2xl text-center text-3xl tracking-widest text-orange-400 font-black focus:outline-none shadow-inner"
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
                  onClick={() => setSellStep(3)}
                  disabled={isProcessingTrade}
                  className="px-5 py-2.5 rounded-xl border border-[#443028] text-stone-400 hover:text-white font-bold cursor-pointer text-xs"
                >
                  &larr; Back to Split
                </button>
                <button
                  onClick={handleExecuteTradeAuth}
                  disabled={isProcessingTrade || coopPin.length !== 4}
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-lg disabled:opacity-50 text-xs"
                >
                  {isProcessingTrade ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Executing on Kenya NCR...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Trade & Disburse M-Pesa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TRADE CONFIRMATION & CERTIFICATE */}
          {sellStep === 5 && tradeConfirmation && (
            <div className="earthy-box p-8 sm:p-10 space-y-6 animate-fadeIn border border-emerald-500/50 max-w-2xl mx-auto">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-2xl">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-white">Trade Executed & Settled Successfully!</h3>
                <p className="text-xs text-stone-300 max-w-lg mx-auto">
                  Carbon credits retired on Kenya NCR and funds disbursed to smallholder farmers via M-Pesa B2C.
                </p>
              </div>

              {/* Digital Trade Voucher */}
              <div className="bg-[#120e0c] border border-emerald-500/40 p-6 rounded-2xl space-y-3 text-left text-xs max-w-xl mx-auto shadow-xl">
                <div className="flex justify-between items-center border-b border-[#443028] pb-3">
                  <span className="text-stone-400">Kenya NCR Certificate:</span>
                  <strong className="text-emerald-400 text-sm">{tradeConfirmation.certId}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Buyer Offtaker:</span>
                  <strong className="text-white text-sm">{tradeConfirmation.buyerName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Volume Cleared:</span>
                  <span className="text-stone-200 font-bold text-sm">{tradeConfirmation.tonnage} Tonnes CO2e</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Total Settlement:</span>
                  <strong className="text-emerald-400 text-sm">${tradeConfirmation.totalUsd.toFixed(2)} USD (KSh {tradeConfirmation.totalKsh.toLocaleString()})</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Farmer M-Pesa Batch:</span>
                  <span className="font-bold text-white text-sm">KSh {tradeConfirmation.farmerShareKsh.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#443028] pt-3">
                  <span className="text-stone-400">Coop Operations Share:</span>
                  <span className="font-bold text-orange-400 text-sm">KSh {tradeConfirmation.coopStipendKsh.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-2">
                <button
                  onClick={() => {
                    downloadCertificateDocument(`kenya_ncr_trade_${tradeConfirmation.certId}`, {
                      title: 'Kenya National Carbon Registry Trade Settlement Certificate',
                      tonnage: String(tradeConfirmation.tonnage),
                      biocharKg: String((tradeConfirmation.tonnage * 456.6).toFixed(1)),
                      certId: tradeConfirmation.certId,
                      entity: `${coopInfo.name} -> ${tradeConfirmation.buyerName}`,
                      location: coopInfo.region,
                      kilns: 'All Registered Smart Kilns Fleet',
                      value: `$${tradeConfirmation.totalUsd.toFixed(2)} USD (KSh ${tradeConfirmation.totalKsh.toLocaleString()})`,
                      date: tradeConfirmation.date
                    });
                  }}
                  className="px-5 py-3 bg-[#120e0c] hover:bg-[#281e19] border border-[#443028] text-stone-200 font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download NCR Certificate</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('transactions');
                  }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-lg text-xs"
                >
                  Done & View Audit Trail
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import {
  Users, Flame, Building2, ShoppingBag, ShieldCheck, Download, Search,
  ArrowUpRight, BarChart2, Layers, CheckCircle2, History, X, Lock,
  Smartphone, AlertCircle, FileText, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { KilnDigitalTwin3D } from './KilnDigitalTwin3D';
import { LineGraph } from './LineGraph';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';

export const CooperativeDashboard = ({ theme, activeSection = 'overview', setActiveSection }) => {
  const [internalTab, setInternalTab] = useState('overview'); // 'overview', 'kilns', 'members', 'transactions', 'smes'
  const activeTab = activeSection || internalTab;
  const setActiveTab = (tabId) => {
    setInternalTab(tabId);
    if (setActiveSection) {
      setActiveSection(tabId);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  const [coopInfo, setCoopInfo] = useState({
    id: 'COOP-KAKAMEGA-01',
    name: 'Kakamega Smallholder Sugarcane Cooperative Union',
    region: 'Western Kenya (Kakamega, Mumias, Butere)',
    farmer_count: 148,
    active_kilns: 18,
    cumulative_credits_tons: 62.4,
    cumulative_biochar_kg: 28450.0,
    cumulative_worth_usd: 8424.0,
    cumulative_worth_ksh: 1095120.0,
  });

  // ALL 18 SMART KILNS NETWORK ACROSS WESTERN KENYA
  const smartKilnsFleet = [
    { id: 'KILN-001', farmer: 'Wanjala Wafula', phone: '+254712345678', location: 'Kakamega Central', status: 'ACTIVE', skinTemp: 58.5, coreTemp: 571.7, charDepth: 30, initialDepth: 85, battery: 88, lastYieldKg: 79.8, lastYieldTons: 0.20 },
    { id: 'KILN-002', farmer: 'Amina Nekesa', phone: '+254722998877', location: 'Mumias West', status: 'ACTIVE', skinTemp: 61.2, coreTemp: 592.9, charDepth: 28, initialDepth: 85, battery: 92, lastYieldKg: 82.6, lastYieldTons: 0.21 },
    { id: 'KILN-003', farmer: 'Barasa Simiyu', phone: '+254733112233', location: 'Butere Outgrower', status: 'COOLING', skinTemp: 44.0, coreTemp: 457.9, charDepth: 32, initialDepth: 85, battery: 79, lastYieldKg: 76.8, lastYieldTons: 0.19 },
    { id: 'KILN-004', farmer: 'Wanjala Wafula', phone: '+254712345678', location: 'Lurambi Plot B', status: 'STANDBY', skinTemp: 26.5, coreTemp: 26.5, charDepth: 0, initialDepth: 85, battery: 95, lastYieldKg: 85.0, lastYieldTons: 0.22 },
    { id: 'KILN-005', farmer: 'Nekesa Mukabana', phone: '+254711445566', location: 'Malava North', status: 'ACTIVE', skinTemp: 57.0, coreTemp: 560.0, charDepth: 29, initialDepth: 85, battery: 84, lastYieldKg: 81.2, lastYieldTons: 0.21 },
    { id: 'KILN-006', farmer: 'Cleophas Malala', phone: '+254722556677', location: 'Shinyalu Forest Edge', status: 'ACTIVE', skinTemp: 59.8, coreTemp: 581.9, charDepth: 31, initialDepth: 85, battery: 90, lastYieldKg: 78.3, lastYieldTons: 0.20 },
    { id: 'KILN-007', farmer: 'Barasa Simiyu', phone: '+254733112233', location: 'Butere Outgrower #2', status: 'STANDBY', skinTemp: 25.0, coreTemp: 25.0, charDepth: 0, initialDepth: 85, battery: 89, lastYieldKg: 84.1, lastYieldTons: 0.22 },
    { id: 'KILN-008', farmer: 'Grace Ambani', phone: '+254790112233', location: 'Matungu Sugarcane Hub', status: 'COOLING', skinTemp: 42.5, coreTemp: 446.1, charDepth: 30, initialDepth: 85, battery: 76, lastYieldKg: 79.8, lastYieldTons: 0.20 },
    { id: 'KILN-009', farmer: 'Sylvester Shitanda', phone: '+254798334455', location: 'Lugari Agro-Cluster', status: 'ACTIVE', skinTemp: 62.0, coreTemp: 599.2, charDepth: 27, initialDepth: 85, battery: 87, lastYieldKg: 84.1, lastYieldTons: 0.22 },
    { id: 'KILN-010', farmer: 'Linet Makokha', phone: '+254740123456', location: 'Navakholo Center', status: 'STANDBY', skinTemp: 24.8, coreTemp: 24.8, charDepth: 0, initialDepth: 85, battery: 94, lastYieldKg: 80.5, lastYieldTons: 0.21 },
    { id: 'KILN-011', farmer: 'Emmanuel Wesonga', phone: '+254741987654', location: 'Mumias East', status: 'ACTIVE', skinTemp: 56.4, coreTemp: 555.2, charDepth: 33, initialDepth: 85, battery: 83, lastYieldKg: 75.4, lastYieldTons: 0.19 },
    { id: 'KILN-012', farmer: 'Rosemary Imbuhila', phone: '+254752334455', location: 'Kakamega South', status: 'ACTIVE', skinTemp: 60.1, coreTemp: 584.3, charDepth: 28, initialDepth: 85, battery: 91, lastYieldKg: 82.6, lastYieldTons: 0.21 },
    { id: 'KILN-013', farmer: 'Timothy Khamala', phone: '+254763112233', location: 'Khwisero Ward', status: 'STANDBY', skinTemp: 26.0, coreTemp: 26.0, charDepth: 0, initialDepth: 85, battery: 80, lastYieldKg: 78.0, lastYieldTons: 0.20 },
    { id: 'KILN-014', farmer: 'Faith Nasimiyu', phone: '+254774223344', location: 'Bukhungu Area', status: 'ACTIVE', skinTemp: 58.0, coreTemp: 567.8, charDepth: 30, initialDepth: 85, battery: 88, lastYieldKg: 79.2, lastYieldTons: 0.20 },
    { id: 'KILN-015', farmer: 'Dennis Otwoma', phone: '+254785334455', location: 'Ikolomani Gold Belt', status: 'ACTIVE', skinTemp: 59.2, coreTemp: 576.4, charDepth: 29, initialDepth: 85, battery: 85, lastYieldKg: 81.0, lastYieldTons: 0.21 },
    { id: 'KILN-016', farmer: 'Agnes Mutonyi', phone: '+254796445566', location: 'Shinyalu Outskirts', status: 'COOLING', skinTemp: 45.1, coreTemp: 462.8, charDepth: 31, initialDepth: 85, battery: 82, lastYieldKg: 77.5, lastYieldTons: 0.20 },
    { id: 'KILN-017', farmer: 'Meshack Wekesa', phone: '+254707556677', location: 'Lugari East', status: 'STANDBY', skinTemp: 25.5, coreTemp: 25.5, charDepth: 0, initialDepth: 85, battery: 93, lastYieldKg: 83.4, lastYieldTons: 0.22 },
    { id: 'KILN-018', farmer: 'Hellen Anyango', phone: '+254718667788', location: 'Mumias Central', status: 'ACTIVE', skinTemp: 60.8, coreTemp: 589.6, charDepth: 28, initialDepth: 85, battery: 86, lastYieldKg: 83.0, lastYieldTons: 0.22 },
  ];

  // 148 SMALLHOLDER MEMBERS DIRECTORY
  const memberFarmers = [
    { name: 'Wanjala Wafula', phone: '+254712345678', nationalId: '29481920', location: 'Kakamega Central', kilns: 'KILN-001, KILN-004', burns: 18, biocharKg: 1420.0, creditsTons: 3.89, worthKsh: 68269, withdrawnKsh: 34500, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Amina Nekesa', phone: '+254722998877', nationalId: '31829104', location: 'Mumias West', kilns: 'KILN-002', burns: 12, biocharKg: 840.0, creditsTons: 2.30, worthKsh: 40365, withdrawnKsh: 22000, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Barasa Simiyu', phone: '+254733112233', nationalId: '28192049', location: 'Butere Outgrower', kilns: 'KILN-003, KILN-007', burns: 16, biocharKg: 1250.0, creditsTons: 3.42, worthKsh: 60021, withdrawnKsh: 31000, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Nekesa Mukabana', phone: '+254711445566', nationalId: '30192841', location: 'Malava North', kilns: 'KILN-005', burns: 11, biocharKg: 780.0, creditsTons: 2.14, worthKsh: 37557, withdrawnKsh: 19000, rating: 'AA+', mpesaStatus: 'VERIFIED' },
    { name: 'Cleophas Malala', phone: '+254722556677', nationalId: '27192834', location: 'Shinyalu Forest', kilns: 'KILN-006', burns: 14, biocharKg: 990.0, creditsTons: 2.71, worthKsh: 47560, withdrawnKsh: 28000, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Grace Ambani', phone: '+254790112233', nationalId: '32910482', location: 'Matungu Hub', kilns: 'KILN-008', burns: 15, biocharKg: 1080.0, creditsTons: 2.96, worthKsh: 51948, withdrawnKsh: 30500, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Sylvester Shitanda', phone: '+254798334455', nationalId: '25192841', location: 'Lugari Agro', kilns: 'KILN-009', burns: 10, biocharKg: 720.0, creditsTons: 1.97, worthKsh: 34573, withdrawnKsh: 17500, rating: 'AA', mpesaStatus: 'VERIFIED' },
    { name: 'Linet Makokha', phone: '+254740123456', nationalId: '33192849', location: 'Navakholo Center', kilns: 'KILN-010', burns: 13, biocharKg: 910.0, creditsTons: 2.49, worthKsh: 43699, withdrawnKsh: 24000, rating: 'AA+', mpesaStatus: 'VERIFIED' },
    { name: 'Emmanuel Wesonga', phone: '+254741987654', nationalId: '26192849', location: 'Mumias East', kilns: 'KILN-011', burns: 8, biocharKg: 560.0, creditsTons: 1.53, worthKsh: 26851, withdrawnKsh: 13000, rating: 'AA', mpesaStatus: 'VERIFIED' },
    { name: 'Rosemary Imbuhila', phone: '+254752334455', nationalId: '29819204', location: 'Kakamega South', kilns: 'KILN-012', burns: 17, biocharKg: 1340.0, creditsTons: 3.67, worthKsh: 64408, withdrawnKsh: 33000, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Timothy Khamala', phone: '+254763112233', nationalId: '30491823', location: 'Khwisero Ward', kilns: 'KILN-013', burns: 9, biocharKg: 620.0, creditsTons: 1.70, worthKsh: 29835, withdrawnKsh: 15000, rating: 'AA', mpesaStatus: 'VERIFIED' },
    { name: 'Faith Nasimiyu', phone: '+254774223344', nationalId: '31920491', location: 'Bukhungu Area', kilns: 'KILN-014', burns: 14, biocharKg: 980.0, creditsTons: 2.68, worthKsh: 47034, withdrawnKsh: 26500, rating: 'AAA', mpesaStatus: 'VERIFIED' },
    { name: 'Dennis Otwoma', phone: '+254785334455', nationalId: '28910482', location: 'Ikolomani', kilns: 'KILN-015', burns: 11, biocharKg: 790.0, creditsTons: 2.16, worthKsh: 37908, withdrawnKsh: 20000, rating: 'AA+', mpesaStatus: 'VERIFIED' },
    { name: 'Agnes Mutonyi', phone: '+254796445566', nationalId: '34192841', location: 'Shinyalu Outskirts', kilns: 'KILN-016', burns: 12, biocharKg: 860.0, creditsTons: 2.36, worthKsh: 41418, withdrawnKsh: 21500, rating: 'AA+', mpesaStatus: 'VERIFIED' },
    { name: 'Meshack Wekesa', phone: '+254707556677', nationalId: '27819204', location: 'Lugari East', kilns: 'KILN-017', burns: 10, biocharKg: 710.0, creditsTons: 1.95, worthKsh: 34222, withdrawnKsh: 18000, rating: 'AA', mpesaStatus: 'VERIFIED' },
    { name: 'Hellen Anyango', phone: '+254718667788', nationalId: '32192849', location: 'Mumias Central', kilns: 'KILN-018', burns: 15, biocharKg: 1090.0, creditsTons: 2.99, worthKsh: 52474, withdrawnKsh: 31000, rating: 'AAA', mpesaStatus: 'VERIFIED' },
  ];

  // SME OFFTAKER BUYERS & CONTRACTS
  const smeBuyersList = [
    { id: 'BUY-001', name: 'East Africa Express Fleet Ltd', industry: 'Freight Logistics (Diesel Offsets)', location: 'Nairobi / Eldoret', purchasedTons: 20.0, valueKsh: 351000, lastOrder: '2026-08-18', status: 'ACTIVE OFFTAKER' },
    { id: 'BUY-002', name: 'Kizito Grain Millers Ltd', industry: 'Agro-Processing (Scope 3 Inset)', location: 'Eldoret Industrial Zone', purchasedTons: 24.8, valueKsh: 435240, lastOrder: '2026-08-12', status: 'ACTIVE INSETTING' },
    { id: 'BUY-003', name: 'Western Cement Distributors', industry: 'Construction Materials', location: 'Kisumu Port depot', purchasedTons: 12.0, valueKsh: 210600, lastOrder: '2026-07-29', status: 'VERIFIED OFFTAKER' },
    { id: 'BUY-004', name: 'Lake Basin Tea Packers', industry: 'Beverage Packaging', location: 'Kericho Hub', purchasedTons: 15.6, valueKsh: 273780, lastOrder: '2026-07-14', status: 'VERIFIED OFFTAKER' },
  ];

  // HISTORIC TRANSACTIONS & SETTLEMENT LOG
  const transactionsAuditLog = [
    { id: 'TX-9901', date: '2026-08-19 14:32 EAT', type: 'M-PESA B2C DISBURSAL', kiln: 'KILN-001', farmer: 'Wanjala Wafula', massKg: 79.8, co2eTons: 0.20, farmerPayoutKsh: 1313.63, coopStipendKsh: 525.45, receipt: 'QHK9102941', ncrId: 'KE-NCR-2026-cbc58516e738' },
    { id: 'TX-8842', date: '2026-08-18 11:20 EAT', type: 'CARBONMARK OFFTAKE TRADE', kiln: 'Fleet Pooled', farmer: 'EA Express Freight', massKg: 4566.0, co2eTons: 10.0, farmerPayoutKsh: 65000.0, coopStipendKsh: 26000.0, receipt: 'QHK8819204', ncrId: 'KE-NCR-2026-TRD-881920' },
    { id: 'TX-7719', date: '2026-08-14 11:15 EAT', type: 'M-PESA B2C DISBURSAL', kiln: 'KILN-002', farmer: 'Amina Nekesa', massKg: 82.6, co2eTons: 0.21, farmerPayoutKsh: 1379.31, coopStipendKsh: 551.72, receipt: 'PBA4819204', ncrId: 'KE-NCR-2026-881920491024' },
  ];

  // Spot Trend Data
  const lineGraphData = [
    { x: 'Week 1', y: 45 },
    { x: 'Week 2', y: 78 },
    { x: 'Week 3', y: 110 },
    { x: 'Week 4', y: 135 },
  ];

  // Modal State
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellStep, setSellStep] = useState(1);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [sellTonnage, setSellTonnage] = useState(5.0);
  const [coopPassword, setCoopPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  const [tradeConfirmation, setTradeConfirmation] = useState(null);

  const handleOpenSellModal = (buyer = null) => {
    setSelectedBuyer(buyer || smeBuyersList[0]);
    setSellTonnage(5.0);
    setSellStep(1);
    setCoopPassword('');
    setPasswordError('');
    setShowSellModal(true);
  };

  const handleExecuteTradeAuth = () => {
    if (!coopPassword || coopPassword.length < 4) {
      setPasswordError('Please enter your Cooperative Authorization Password (at least 4 characters)');
      return;
    }
    setPasswordError('');
    setIsProcessingTrade(true);

    setTimeout(() => {
      setIsProcessingTrade(false);
      const certId = `KE-NCR-2026-TRD-${Math.floor(100000 + Math.random() * 900000)}`;
      const pricePerTon = 135.0;
      const totalUsd = sellTonnage * pricePerTon;
      const totalKsh = totalUsd * 130.0;
      const communityShareKsh = (54.0 / 135.0) * totalKsh;
      const farmerShareKsh = (50.0 / 135.0) * totalKsh;
      const coopStipendKsh = (20.0 / 135.0) * totalKsh;
      const levyShareKsh = (11.0 / 135.0) * totalKsh;

      setTradeConfirmation({
        certId,
        buyerName: selectedBuyer ? selectedBuyer.name : 'Carbonmark Open Liquidity Pool',
        tonnage: sellTonnage,
        pricePerTon,
        totalUsd,
        totalKsh,
        communityShareKsh,
        farmerShareKsh,
        coopStipendKsh,
        levyShareKsh,
        date: new Date().toLocaleString('en-KE'),
      });

      setSellStep(5);
    }, 1200);
  };

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
    <div className="space-y-8 animate-fadeIn w-full font-mono text-xs text-slate-900 dark:text-stone-100">
      
      {/* Top Header & Corner Account Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 dark:border-[#2d3f58]/40 gap-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-stone-100">
            Agricultural Cooperative Hub
          </h1>
          <span className="bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600/60 text-emerald-800 dark:text-emerald-400 font-mono text-xs px-3 py-1 rounded-full font-bold">
            Western Kenya Region
          </span>
        </div>

        {/* CORNER ACCOUNT BADGE & SELL ACTION */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-white dark:bg-[#131e30] border border-emerald-500/40 dark:border-emerald-600/30 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-left">
              <p className="text-[9px] text-slate-500 dark:text-stone-400 uppercase font-bold">Registered Hub: {coopInfo.id}</p>
              <p className="font-extrabold text-slate-900 dark:text-stone-100 text-xs truncate max-w-[200px]">{coopInfo.name}</p>
            </div>
          </div>

          <button
            onClick={() => handleOpenSellModal()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-md transition-all cursor-pointer border border-orange-400/30 flex items-center space-x-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sell Pooled Credits &rarr;</span>
          </button>
        </div>
      </div>

      {/* Cumulative KPI Cards with Dual Units */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Pooled Carbon Harvest</span>
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
            {coopInfo.cumulative_credits_tons} tCO2e
          </p>
          <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
            = {coopInfo.cumulative_biochar_kg.toLocaleString()} KG Verified Biochar
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Cooperative Pool Valuation</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold text-xs">$135/t</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
            KSh {coopInfo.cumulative_worth_ksh.toLocaleString()}
          </p>
          <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
            ≈ ${coopInfo.cumulative_worth_usd.toLocaleString()} USD (Spot Liquidity)
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Smart Kilns Fleet</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-stone-100">
            {coopInfo.active_kilns} Units
          </p>
          <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
            100% Online with LoRaWAN & GPS
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Registered Smallholders</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-stone-100">
            {coopInfo.farmer_count} Members
          </p>
          <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
            Enrolled in M-Pesa B2C Payouts
          </p>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-white dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] p-2 rounded-2xl flex flex-wrap gap-2 shadow-sm">
        {[
          { id: 'overview', label: 'Overview & 3D Kilns', icon: Layers },
          { id: 'kilns', label: `Smart Kilns Fleet (${smartKilnsFleet.length})`, icon: Flame },
          { id: 'members', label: `Smallholder Members (${memberFarmers.length} / 148)`, icon: Users },
          { id: 'transactions', label: 'Transactions & Audit Trail', icon: History },
          { id: 'smes', label: `SME Buyers & Contracts (${smeBuyersList.length})`, icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-transparent text-slate-700 dark:text-stone-300 hover:text-emerald-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & 3D KILN NETWORK                                         */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Line Graph: Market Carbon Credit Trend */}
          <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-4">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
                <BarChart2 className="w-5 h-5 text-orange-500" />
                <span>Coop Carbon Credit Market Value Trend ($/tCO2e)</span>
              </div>
              <span className="text-slate-500 dark:text-stone-400">Kenyan Spot Price Range: $35 - $145</span>
            </div>

            <LineGraph data={lineGraphData} height={180} valuePrefix="$" valueSuffix="/t" />
          </div>

          {/* 3D Representation of Member Kilns */}
          <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2d3f58]/40 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-stone-100">3D Kiln Fleet Telemetry Network</h3>
                <p className="text-slate-500 dark:text-stone-400 text-[11px]">Real-time visual monitoring of pyrolysis thermal profiles and char retention</p>
              </div>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full text-[11px]">
                18 Kilns Online
              </span>
            </div>
            <KilnDigitalTwin3D theme={theme} />
          </div>

          {/* Quick Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-3">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
                  <Flame className="w-4 h-4 text-emerald-500" />
                  <span>Active Kilns Quick View</span>
                </div>
                <button onClick={() => setActiveTab('kilns')} className="text-orange-600 dark:text-orange-400 hover:underline font-bold">
                  View All 18 Units &rarr;
                </button>
              </div>
              <div className="space-y-2.5">
                {smartKilnsFleet.slice(0, 4).map((k) => (
                  <div key={k.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-stone-100">{k.id} • {k.location}</p>
                      <p className="text-slate-500 dark:text-stone-400 text-[11px]">{k.farmer} ({k.phone})</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        k.status === 'ACTIVE' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-400 border border-orange-300 dark:border-orange-700' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400'
                      }`}>
                        {k.status} ({k.skinTemp}°C)
                      </span>
                      <p className="text-slate-500 dark:text-stone-400 text-[10px] mt-0.5">{k.lastYieldKg} KG Biochar</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-3">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span>SME Offtaker Contracts</span>
                </div>
                <button onClick={() => setActiveTab('smes')} className="text-orange-600 dark:text-orange-400 hover:underline font-bold">
                  Marketplace Hub &rarr;
                </button>
              </div>
              <div className="space-y-2.5">
                {smeBuyersList.slice(0, 4).map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-stone-100">{b.name}</p>
                      <p className="text-slate-500 dark:text-stone-400 text-[11px]">{b.industry} • {b.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">{b.purchasedTons} Tons CO2e</p>
                      <p className="text-slate-500 dark:text-stone-400 text-[10px]">KSh {b.valueKsh.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SMART KILNS FLEET (ALL 18 UNITS)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'kilns' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-stone-100">Smart Kilns Fleet Registry (18 Units)</h3>
              <p className="text-slate-500 dark:text-stone-400 text-xs">Distributed top-lit updraft biochar kilns across Western Kenya smallholders</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-500 dark:text-stone-400 font-bold">Total Fleet Capacity:</span>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-400 font-bold rounded-xl">
                1.45 Tonnes Biochar / Burn Cycle
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartKilnsFleet.map((kiln) => (
              <div key={kiln.id} className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-3 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-2">
                  <div className="flex items-center space-x-2">
                    <Flame className={`w-4 h-4 ${kiln.status === 'ACTIVE' ? 'text-orange-500 animate-pulse' : 'text-emerald-500'}`} />
                    <span className="font-black text-sm text-slate-900 dark:text-white">{kiln.id}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    kiln.status === 'ACTIVE'
                      ? 'bg-orange-100 dark:bg-orange-950/60 border-orange-300 dark:border-orange-600 text-orange-800 dark:text-orange-400'
                      : kiln.status === 'COOLING'
                      ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-600 text-cyan-800 dark:text-cyan-400'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-400'
                  }`}>
                    {kiln.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Owner Farmer:</span>
                    <strong className="text-slate-900 dark:text-white">{kiln.farmer}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Location:</span>
                    <span className="text-slate-700 dark:text-stone-200">{kiln.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Skin Temp / Core:</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">{kiln.skinTemp}°C / ~{kiln.coreTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Char Bed Depth:</span>
                    <span className="text-slate-700 dark:text-stone-200">{kiln.charDepth} cm (Initial: {kiln.initialDepth} cm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Recent Yield:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{kiln.lastYieldKg} KG ({kiln.lastYieldTons} tCO2e)</strong>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-[#2d3f58]/40 pt-2 flex justify-between items-center text-[10px] text-slate-500 dark:text-stone-400">
                  <span>Battery: {kiln.battery}% 🔋</span>
                  <span>LoRa: Strong 📶</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Verified IoT</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SMALLHOLDER MEMBERS (FULL 148 DIRECTORY)                           */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-stone-100">Cooperative Member Registry (148 Smallholders)</h3>
              <p className="text-slate-500 dark:text-stone-400 text-xs">Search members, view assigned kilns, carbon credits produced, and creditworthiness ratings</p>
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
                downloadCSV('kakamega_cooperative_148_members_registry.csv', headers, rows);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center space-x-1.5 self-start cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Members CSV</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search member by name, phone, kiln ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] pl-9 pr-3 py-2.5 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-sm"
              />
            </div>
            <div>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full bg-white dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] px-3 py-2.5 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-xs focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
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
          <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-4 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#2d3f58] text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-2">Member Name</th>
                  <th className="pb-3 px-2">Phone & Nat ID</th>
                  <th className="pb-3 px-2">Ward / Location</th>
                  <th className="pb-3 px-2">Assigned Kilns</th>
                  <th className="pb-3 px-2 text-right">Harvest (KG / Tons)</th>
                  <th className="pb-3 px-2 text-right">Earned (KSh / USD)</th>
                  <th className="pb-3 px-2 text-center">Credit Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#2d3f58]/40">
                {filteredMembers.map((m) => (
                  <tr key={m.phone} className="hover:bg-slate-50 dark:hover:bg-[#131e30]/60 transition-colors">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-900 dark:text-stone-100">{m.name}</p>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">{m.burns} Clean Burns</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-700 dark:text-stone-300">
                      <p>{m.phone}</p>
                      <span className="text-[10px] text-slate-500 dark:text-stone-500">ID: {m.nationalId}</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-700 dark:text-stone-300">{m.location}</td>
                    <td className="py-3.5 px-2 font-bold text-orange-600 dark:text-orange-400">{m.kilns}</td>
                    <td className="py-3.5 px-2 text-right">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">{m.biocharKg.toLocaleString()} KG</p>
                      <span className="text-[10px] text-slate-500 dark:text-stone-400">{m.creditsTons} tCO2e</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <p className="font-bold text-slate-900 dark:text-stone-100">KSh {m.worthKsh.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-500 dark:text-stone-400">${(m.worthKsh / 130.0).toFixed(2)} USD</span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300">
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
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-stone-100">Cooperative Transactions & Settlement Audit Log</h3>
              <p className="text-slate-500 dark:text-stone-400 text-xs">Immutable SHA-256 batch stamps anchored to the Kenya National Carbon Registry (NCR)</p>
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
                  tx.farmerPayoutKsh,
                  tx.coopStipendKsh,
                  tx.receipt,
                  tx.ncrId
                ]);
                downloadCSV('kakamega_cooperative_transactions_audit_log.csv', headers, rows);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center space-x-1.5 self-start cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {transactionsAuditLog.map((tx) => (
              <div key={tx.id} className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-stone-100 text-sm">{tx.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                      {tx.type}
                    </span>
                    <span className="text-slate-500 dark:text-stone-400 text-[11px]">{tx.date}</span>
                  </div>
                  <p className="text-slate-700 dark:text-stone-300 text-xs">
                    Kiln: <strong>{tx.kiln}</strong> • Beneficiary: <strong>{tx.farmer}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-stone-400">
                    Kenya NCR Tracking: <strong className="text-emerald-700 dark:text-emerald-400">{tx.ncrId}</strong> • Safaricom Receipt: <strong>{tx.receipt}</strong>
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 dark:border-[#2d3f58] sm:pl-6 space-y-0.5">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">+{tx.co2eTons} tCO2e ({tx.massKg} KG)</p>
                  <p className="text-slate-900 dark:text-stone-100 font-bold">KSh {tx.farmerPayoutKsh.toLocaleString()} Disbursed</p>
                  <p className="text-[10px] text-orange-600 dark:text-orange-400">Coop Stipend: KSh {tx.coopStipendKsh.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SME OFFTAKERS & BULK CONTRACTS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'smes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-stone-100">Institutional SME Offtakers & Market Clearing</h3>
              <p className="text-slate-500 dark:text-stone-400 text-xs">Commercial buyers clearing pooled smallholder biochar credits for Scope 1-3 ESG compliance</p>
            </div>
            <button
              onClick={() => handleOpenSellModal()}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl flex items-center space-x-1.5 self-start cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Create New Offtake Trade</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smeBuyersList.map((sme) => (
              <div key={sme.id} className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 space-y-4 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-stone-100 text-sm">{sme.name}</h4>
                      <p className="text-slate-500 dark:text-stone-400 text-[11px]">{sme.location} • {sme.industry}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                      {sme.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#131e30] p-3 rounded-xl border border-slate-200 dark:border-[#2d3f58] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-stone-400">Total Cleared Volume:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{sme.purchasedTons} Tonnes CO2e</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-stone-400">Cumulative Settlement:</span>
                      <strong className="text-slate-900 dark:text-stone-100">KSh {sme.valueKsh.toLocaleString()} (${(sme.valueKsh / 130.0).toFixed(2)} USD)</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-stone-400 border-t border-slate-200 dark:border-[#2d3f58] pt-1">
                      <span>Last Clearance Date:</span>
                      <span>{sme.lastOrder}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSellModal(sme)}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-md"
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
      {/* REALISTIC MULTI-STEP "SELL CARBON CREDITS" MODAL (SPACIOUS & EXPANSIVE)   */}
      {/* ========================================================================= */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#2d3f58] max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl space-y-6 text-slate-900 dark:text-stone-100 shadow-2xl my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-base shadow-md">
                  C
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-stone-100">Sell Pooled Biochar Credits</h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400">
                    Step {sellStep} of 5 • {coopInfo.name} &bull; Kenya NCR & Carbonmark Settlement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSellModal(false)}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#2d3f58] text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Step Progress Indicator */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold font-mono">
              {[
                { step: 1, label: '1. Buyer & Volume' },
                { step: 2, label: '2. Quality Audit' },
                { step: 3, label: '3. Revenue Split' },
                { step: 4, label: '4. Auth Sign-Off' },
                { step: 5, label: '5. Settlement' }
              ].map((s) => (
                <div
                  key={s.step}
                  className={`py-2 px-1 rounded-xl border transition-all ${
                    sellStep === s.step
                      ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                      : sellStep > s.step
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-[#131e30] border-slate-200 dark:border-[#2d3f58]/60 text-slate-500 dark:text-stone-500'
                  }`}
                >
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">Step {s.step}</span>
                </div>
              ))}
            </div>

            {/* STEP 1: CHOOSE BUYER & VOLUME */}
            {sellStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-stone-300">Select Offtaker / Carbonmark Pool:</label>
                      <select
                        value={selectedBuyer ? selectedBuyer.id : ''}
                        onChange={(e) => {
                          const found = smeBuyersList.find((b) => b.id === e.target.value);
                          setSelectedBuyer(found || null);
                        }}
                        className="w-full bg-slate-50 dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] p-3.5 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-xs focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
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
                      <label className="text-xs font-bold text-slate-700 dark:text-stone-300">Quick Volume Presets:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[5.0, 10.0, 20.0].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setSellTonnage(preset)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              sellTonnage === preset
                                ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-[#131e30] border-slate-300 dark:border-[#2d3f58] text-slate-700 dark:text-stone-300 hover:border-slate-400'
                            }`}
                          >
                            {preset} Tonnes
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-stone-300">Exact Tonnage to Sell (Tonnes CO2e):</label>
                      <input
                        type="number"
                        min="0.5"
                        max={coopInfo.cumulative_credits_tons}
                        step="0.5"
                        value={sellTonnage}
                        onChange={(e) => setSellTonnage(Math.min(coopInfo.cumulative_credits_tons, Math.max(0.5, Number(e.target.value))))}
                        className="w-full bg-white dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] p-3 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-base focus:outline-none focus:border-orange-500 font-mono shadow-sm"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-stone-400">
                        Max Available: <strong>{coopInfo.cumulative_credits_tons} tCO2e</strong> ({coopInfo.cumulative_biochar_kg.toLocaleString()} KG Biochar)
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Live Valuation Summary Card */}
                  <div className="bg-slate-50 dark:bg-[#131e30] p-5 rounded-2xl border border-slate-200 dark:border-[#2d3f58] flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 border-b border-slate-200 dark:border-[#2d3f58] pb-2">
                        Trade Valuation Summary
                      </h4>
                      <div className="mt-3 space-y-2.5 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-stone-400">
                          <span>Benchmark Rate:</span>
                          <strong className="text-slate-900 dark:text-stone-100">$135.00 USD / Ton (KSh 17,550/t)</strong>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-stone-400">
                          <span>Selected Volume:</span>
                          <strong className="text-slate-900 dark:text-stone-100">{sellTonnage} Metric Tonnes CO2e</strong>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-stone-400">
                          <span>Equivalent Biochar:</span>
                          <strong className="text-emerald-700 dark:text-emerald-400">{(sellTonnage * 456.6).toFixed(1)} KG</strong>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-stone-400 border-t border-slate-200 dark:border-[#2d3f58] pt-2">
                          <span className="font-bold text-slate-800 dark:text-stone-200">Gross Trade Value:</span>
                          <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-black">
                            ${(sellTonnage * 135.0).toFixed(2)} USD
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-stone-400">
                          <span className="text-[11px]">Local Currency Value:</span>
                          <strong className="text-slate-900 dark:text-stone-100 text-xs font-mono">
                            KSh {(sellTonnage * 135.0 * 130).toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
                      &check; Direct automated payout splits to 148 smallholder wallets on execution.
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-[#2d3f58]">
                  <button
                    onClick={() => setShowSellModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#2d3f58] text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSellStep(2)}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Quality Audit &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: dMRV QUALITY & REGULATORY CHECK */}
            {sellStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-stone-100 uppercase tracking-wide">
                    dMRV Sensor Physics & Quality Audit Seal
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-stone-400 mt-0.5">
                    Pre-trade algorithmic integrity inspection across 18 smart kiln IoT telemetry logs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400">
                      <span className="font-bold text-xs">Pyrolysis Thermal Hold</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">571.7°C Core Mean</p>
                    <p className="text-[10px] text-slate-600 dark:text-stone-400">
                      Exceeds 450°C Puro.earth threshold. Carbon permanence &ge; 100 years.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400">
                      <span className="font-bold text-xs">Ultrasonic Char Retention</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">35.3% Volume Ratio</p>
                    <p className="text-[10px] text-slate-600 dark:text-stone-400">
                      No ash cheating detected (volume retention ratio &ge; 25% minimum).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400">
                      <span className="font-bold text-xs">Sovereign Geofence</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">Kakamega Cluster</p>
                    <p className="text-[10px] text-slate-600 dark:text-stone-400">
                      Triangulated via Safaricom Base Stations with SHA-256 silicon ID match.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-[#2d3f58]">
                  <button
                    onClick={() => setSellStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#2d3f58] text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                  >
                    &larr; Back to Volume
                  </button>
                  <button
                    onClick={() => setSellStep(3)}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>Inspect Revenue Allocation &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: STATUTORY REVENUE ALLOCATION */}
            {sellStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-stone-100 uppercase tracking-wide">
                    Kenya Carbon Regulations 2024 Statutory Revenue Allocation
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-stone-400 mt-0.5">
                    Gross spot proceeds of <strong>${(sellTonnage * 135).toFixed(2)} USD (KSh {(sellTonnage * 135 * 130).toLocaleString()})</strong> allocated automatically via dMRV oracle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Share 1: Community Trust Fund (40%) */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Community Trust</span>
                      <span className="text-[10px] font-black bg-blue-700 text-white px-2 py-0.5 rounded-md">40.0%</span>
                    </div>
                    <div>
                      <p className="text-xl font-black text-blue-900 dark:text-blue-400 font-mono">
                        KSh {(sellTonnage * 54 * 130).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-blue-700 dark:text-blue-300 font-mono mt-0.5">
                        ${(sellTonnage * 54).toFixed(2)} USD ($54.00 / t)
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-stone-300 leading-relaxed border-t border-blue-200 dark:border-blue-800/60 pt-1.5">
                      Statutory 40% escrow for Kakamega community schools, water boreholes & road repairs (EMCA 2026).
                    </p>
                  </div>

                  {/* Share 2: Farmers (37%) */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Farmer M-Pesa</span>
                      <span className="text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded-md">37.0%</span>
                    </div>
                    <div>
                      <p className="text-xl font-black text-emerald-900 dark:text-emerald-400 font-mono">
                        KSh {(sellTonnage * 50 * 130).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
                        ${(sellTonnage * 50).toFixed(2)} USD ($50.00 / t)
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-stone-300 leading-relaxed border-t border-emerald-200 dark:border-emerald-800/60 pt-1.5">
                      Disbursed directly to participating smallholder Safaricom M-Pesa wallets across 18 smart kiln clusters.
                    </p>
                  </div>

                  {/* Share 3: Coop Operations (14.8%) */}
                  <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-800 dark:text-orange-300">Coop Operations</span>
                      <span className="text-[10px] font-black bg-orange-700 text-white px-2 py-0.5 rounded-md">14.8%</span>
                    </div>
                    <div>
                      <p className="text-xl font-black text-orange-900 dark:text-orange-400 font-mono">
                        KSh {(sellTonnage * 20 * 130).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-orange-700 dark:text-orange-300 font-mono mt-0.5">
                        ${(sellTonnage * 20).toFixed(2)} USD ($20.00 / t)
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-stone-300 leading-relaxed border-t border-orange-200 dark:border-orange-800/60 pt-1.5">
                      Retained for kiln maintenance, field extension officers, biomass hauling, and member dividends.
                    </p>
                  </div>

                  {/* Share 4: Platform & Consolidated Levy (8.2%) */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#120e0c] border border-slate-200 dark:border-[#2d3f58] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-stone-400">dMRV & Levy</span>
                      <span className="text-[10px] font-black bg-slate-700 text-white px-2 py-0.5 rounded-md">8.2%</span>
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 dark:text-stone-300 font-mono">
                        KSh {(sellTonnage * 11 * 130).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-stone-500 font-mono mt-0.5">
                        ${(sellTonnage * 11).toFixed(2)} USD ($11.00 / t)
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-stone-400 leading-relaxed border-t border-slate-200 dark:border-[#2d3f58] pt-1.5">
                      Covers IoT bandwidth, Kenya NCR registry fees, and statutory Consolidated Fund contribution.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-[#2d3f58]">
                  <button
                    onClick={() => setSellStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#2d3f58] text-slate-700 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                  >
                    &larr; Back to Quality Audit
                  </button>
                  <button
                    onClick={() => setSellStep(4)}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Auth Sign-Off &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: COOPERATIVE AUTHORIZER PASSCODE PROMPT */}
            {sellStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-50 dark:bg-[#120e0c] border-2 border-orange-500/70 p-6 sm:p-8 rounded-3xl space-y-4 text-center max-w-lg mx-auto shadow-sm">
                  <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-md">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base">Cooperative Authorization Sign-Off</h4>
                    <p className="text-xs text-slate-600 dark:text-stone-300 mt-1">
                      Authorizing trade of <strong>{sellTonnage} Tonnes CO2e</strong> to <strong>{selectedBuyer ? selectedBuyer.name : 'Carbonmark'}</strong> for <strong>KSh {(sellTonnage * 135 * 130).toLocaleString()}</strong>.
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto pt-2 space-y-2 text-left">
                    <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block">
                      Enter Cooperative Account Password / Passcode:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter manager password..."
                        value={coopPassword}
                        onChange={(e) => setCoopPassword(e.target.value)}
                        className="w-full bg-white dark:bg-[#1c1512] border-2 border-orange-500/80 p-3 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none pr-10 shadow-sm"
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
                      <p className="text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{passwordError}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-[#2d3f58]">
                  <button
                    onClick={() => setSellStep(3)}
                    disabled={isProcessingTrade}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#2d3f58] text-slate-700 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                  >
                    &larr; Back to Revenue Split
                  </button>
                  <button
                    onClick={handleExecuteTradeAuth}
                    disabled={isProcessingTrade || !coopPassword}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isProcessingTrade ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Executing on Kenya NCR...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize Trade & Settle &rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: TRADE CONFIRMATION & CERTIFICATE */}
            {sellStep === 5 && tradeConfirmation && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Trade Executed & Settled!</h3>
                  <p className="text-xs text-slate-600 dark:text-stone-300 max-w-md mx-auto">
                    Carbon credits retired on Kenya NCR and funds disbursed to 148 smallholder farmers via M-Pesa B2C.
                  </p>
                </div>

                {/* Digital Trade Voucher */}
                <div className="bg-slate-50 dark:bg-[#120e0c] border border-emerald-500/40 p-5 rounded-2xl space-y-3 text-left text-xs font-mono max-w-xl mx-auto shadow-sm">
                  <div className="flex justify-between border-b border-slate-200 dark:border-[#2d3f58] pb-2">
                    <span className="text-slate-500 dark:text-stone-400">Kenya NCR Certificate:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{tradeConfirmation.certId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Buyer Offtaker:</span>
                    <strong className="text-slate-900 dark:text-white">{tradeConfirmation.buyerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Volume Cleared:</span>
                    <span className="text-slate-800 dark:text-stone-200 font-bold">{tradeConfirmation.tonnage} Tonnes CO2e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Total Settlement:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">${tradeConfirmation.totalUsd.toFixed(2)} USD (KSh {tradeConfirmation.totalKsh.toLocaleString()})</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-[#2d3f58] pt-2">
                    <span className="text-slate-500 dark:text-stone-400">Community Trust Fund (40%):</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">KSh {tradeConfirmation.communityShareKsh.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Farmer M-Pesa Direct (37%):</span>
                    <span className="font-bold text-slate-900 dark:text-white">KSh {tradeConfirmation.farmerShareKsh.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-stone-400">Coop Operations Share (14.8%):</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">KSh {tradeConfirmation.coopStipendKsh.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => {
                      downloadCertificateDocument(`kenya_ncr_trade_${tradeConfirmation.certId}`, {
                        title: 'Kenya National Carbon Registry Trade Settlement Certificate',
                        tonnage: String(tradeConfirmation.tonnage),
                        biocharKg: String((tradeConfirmation.tonnage * 456.6).toFixed(1)),
                        certId: tradeConfirmation.certId,
                        entity: `${coopInfo.name} -> ${tradeConfirmation.buyerName}`,
                        location: coopInfo.region,
                        kilns: 'All 18 Registered Smart Kilns (KILN-001 - KILN-018)',
                        value: `$${tradeConfirmation.totalUsd.toFixed(2)} USD (KSh ${tradeConfirmation.totalKsh.toLocaleString()})`,
                        date: tradeConfirmation.date
                      });
                    }}
                    className="px-5 py-3 bg-slate-100 dark:bg-[#120e0c] hover:bg-slate-200 dark:hover:bg-[#281e19] border border-slate-300 dark:border-[#2d3f58] text-slate-800 dark:text-stone-200 font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download NCR Certificate</span>
                  </button>
                  <button
                    onClick={() => setShowSellModal(false)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-md"
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

export default CooperativeDashboard;

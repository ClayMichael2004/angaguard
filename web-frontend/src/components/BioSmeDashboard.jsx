import React, { useState } from 'react';
import { Factory, ShieldCheck, Download, Search, Users, Flame, Sparkles, BarChart3, CheckCircle2, Building2 } from 'lucide-react';
import { LedgerExplorerView } from './LedgerExplorerView';
import { LineGraph } from './LineGraph';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';

export const BioSmeDashboard = ({ theme, activeSection = 'overview', setActiveSection }) => {
  const [smeInfo] = useState({
    name: 'Kizito Grain Millers Ltd',
    location: 'Eldoret Industrial Zone, Kenya',
    tax_pin: 'P051294819K',
    funded_farmers_count: 35,
    smart_kilns_sponsored: 25,
    incentive_payout_pct: 85.0,
    current_quarter_offsets: 24.8,
    scope1_diesel_liters: 12500,
    scope2_grid_kwh: 45000,
  });

  const [internalView, setInternalView] = useState('overview'); // 'overview', 'outgrowers', 'ledger', 'reports'
  const activeView = activeSection || internalView;
  const setActiveView = (viewId) => {
    setInternalView(viewId);
    if (setActiveSection) {
      setActiveSection(viewId);
    }
  };
  const [showCertModal, setShowCertModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCrop, setFilterCrop] = useState('all');

  const scope1 = Number(((smeInfo.scope1_diesel_liters * 2.68) / 1000).toFixed(2));
  const scope2 = Number(((smeInfo.scope2_grid_kwh * 0.12) / 1000).toFixed(2));
  const gross = Number((scope1 + scope2).toFixed(2));
  const net = Math.max(0, Number((gross - smeInfo.current_quarter_offsets).toFixed(2)));
  const esgGrade = net < 15 ? 'A+' : net < 25 ? 'A' : 'B';

  // Line Graph: Quarterly Biochar Carbon Offsets Trend
  const offsetLineData = [
    { x: 'Q1 2025', y: 11.2 },
    { x: 'Q2 2025', y: 14.5 },
    { x: 'Q3 2025', y: 16.4 },
    { x: 'Q4 (Now)', y: 24.8 },
  ];

  // Comprehensive Funded Outgrowers Record Trail
  const fundedFarmersRegistry = [
    { id: 'FND-001', name: 'Wanjala Wafula', phone: '+254712345678', location: 'Kakamega Central', crop: 'Maize Stover & Cobs', kiln: 'KILN-001', biocharKg: 1420.0, creditsTons: 3.89, incentiveKsh: 39700, incentiveUsd: 305.38, burns: 18, lastReceipt: 'QHK991204', status: 'ACTIVE INSETTING' },
    { id: 'FND-002', name: 'Amina Nekesa', phone: '+254722998877', location: 'Mumias West', crop: 'Coffee Husks', kiln: 'KILN-002', biocharKg: 840.0, creditsTons: 2.30, incentiveKsh: 23500, incentiveUsd: 180.77, burns: 12, lastReceipt: 'QHK881029', status: 'ACTIVE INSETTING' },
    { id: 'FND-003', name: 'Barasa Simiyu', phone: '+254733112233', location: 'Butere Outgrower', crop: 'Sugarcane Bagasse', kiln: 'KILN-003', biocharKg: 1250.0, creditsTons: 3.42, incentiveKsh: 35000, incentiveUsd: 269.23, burns: 16, lastReceipt: 'QHK771092', status: 'ACTIVE INSETTING' },
    { id: 'FND-004', name: 'Nekesa Mukabana', phone: '+254711445566', location: 'Malava', crop: 'Maize Stover', kiln: 'KILN-005', biocharKg: 780.0, creditsTons: 2.14, incentiveKsh: 21840, incentiveUsd: 168.00, burns: 11, lastReceipt: 'QHK661023', status: 'ACTIVE INSETTING' },
    { id: 'FND-005', name: 'Cleophas Malala', phone: '+254722556677', location: 'Shinyalu', crop: 'Forest Biomass Residue', kiln: 'KILN-006', biocharKg: 990.0, creditsTons: 2.71, incentiveKsh: 27720, incentiveUsd: 213.23, burns: 14, lastReceipt: 'QHK551094', status: 'ACTIVE INSETTING' },
    { id: 'FND-006', name: 'Grace Ambani', phone: '+254790112233', location: 'Matungu', crop: 'Sugarcane Trash', kiln: 'KILN-008', biocharKg: 1080.0, creditsTons: 2.96, incentiveKsh: 30240, incentiveUsd: 232.62, burns: 15, lastReceipt: 'QHK441029', status: 'ACTIVE INSETTING' },
    { id: 'FND-007', name: 'Sylvester Shitanda', phone: '+254798334455', location: 'Lugari', crop: 'Wheat Straw & Chaff', kiln: 'KILN-009', biocharKg: 720.0, creditsTons: 1.97, incentiveKsh: 20160, incentiveUsd: 155.08, burns: 10, lastReceipt: 'QHK331084', status: 'ACTIVE INSETTING' },
    { id: 'FND-008', name: 'Linet Makokha', phone: '+254740123456', location: 'Navakholo', crop: 'Cassava Stems', kiln: 'KILN-010', biocharKg: 910.0, creditsTons: 2.49, incentiveKsh: 25480, incentiveUsd: 196.00, burns: 13, lastReceipt: 'QHK221098', status: 'ACTIVE INSETTING' },
    { id: 'FND-009', name: 'Emmanuel Wesonga', phone: '+254741987654', location: 'Mumias East', crop: 'Sugarcane Bagasse', kiln: 'KILN-011', biocharKg: 560.0, creditsTons: 1.53, incentiveKsh: 15680, incentiveUsd: 120.62, burns: 8, lastReceipt: 'QHK111077', status: 'ACTIVE INSETTING' },
    { id: 'FND-010', name: 'Rosemary Imbuhila', phone: '+254752334455', location: 'Kakamega South', crop: 'Maize Cobs', kiln: 'KILN-012', biocharKg: 1340.0, creditsTons: 3.67, incentiveKsh: 37520, incentiveUsd: 288.62, burns: 17, lastReceipt: 'QHK001099', status: 'ACTIVE INSETTING' },
  ];

  const filteredOutgrowers = fundedFarmersRegistry.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.phone.includes(searchTerm) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.kiln.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterCrop === 'all') return matchesSearch;
    return matchesSearch && f.crop.toLowerCase().includes(filterCrop.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fadeIn w-full font-mono text-xs text-slate-900 dark:text-stone-100">
      
      {/* Header Banner & Corner Account Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 dark:border-[#2d3f58]/40 gap-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-stone-100">
            Bio SME Corporate Hub
          </h1>
          <span className="bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600/60 text-emerald-800 dark:text-emerald-400 font-mono text-xs px-3 py-1 rounded-full font-bold">
            Supply Chain Insetting
          </span>
        </div>

        {/* CORNER ACCOUNT BADGE */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-white dark:bg-[#131e30] border border-emerald-500/40 dark:border-emerald-600/30 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-left">
              <p className="text-[9px] text-slate-500 dark:text-stone-400 uppercase font-bold">KRA PIN: {smeInfo.tax_pin}</p>
              <p className="font-extrabold text-slate-900 dark:text-stone-100 text-xs truncate max-w-[200px]">{smeInfo.name}</p>
            </div>
          </div>

          <button
            onClick={() => setShowCertModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold cursor-pointer shadow-md flex items-center space-x-1.5 text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ISSB / IFRS S2 Pass</span>
          </button>
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Key KPI Cards with Dual Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">ESG Insetting Grade</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{esgGrade} (AUDITED)</p>
              <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
                Net Residual: <strong>{net} tCO2e</strong> (Gross: {gross} t)
              </p>
            </div>

            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Sponsored Outgrowers</span>
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-stone-100">{smeInfo.funded_farmers_count} Farmers</p>
              <p className="text-orange-600 dark:text-orange-400 text-[11px] font-bold">
                {smeInfo.smart_kilns_sponsored} Smart Kilns Subsidized
              </p>
            </div>

            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-cyan-500">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Farmer Direct Share</span>
                <Sparkles className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-stone-100">{smeInfo.incentive_payout_pct}% Direct</p>
              <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
                Disbursed via Safaricom M-Pesa B2C
              </p>
            </div>

            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 space-y-1.5 rounded-2xl shadow-sm border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">Biochar Offsets (Q4)</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">-{smeInfo.current_quarter_offsets} Tons</p>
              <p className="text-slate-600 dark:text-stone-400 text-[11px] font-bold">
                = 11,300 KG Biochar in Local Soils
              </p>
            </div>
          </div>

          {/* Quarterly Line Graph & Funded Outgrowers Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Line Graph */}
            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-4">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Quarterly Carbon Offsets Line Graph</span>
                </div>
                <span className="text-slate-500 dark:text-stone-400">Insetting Trend (tCO2e)</span>
              </div>

              <LineGraph data={offsetLineData} height={180} valuePrefix="-" valueSuffix=" tCO2e" />
            </div>

            {/* Funded Outgrower Farmers Preview */}
            <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-4">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-stone-100">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span>Sponsored Smallholder Outgrowers</span>
                  </div>
                  <button
                    onClick={() => setActiveView('outgrowers')}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-bold"
                  >
                    View All {fundedFarmersRegistry.length} Records &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {fundedFarmersRegistry.slice(0, 3).map((f) => (
                    <div key={f.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-stone-100">{f.name}</p>
                        <p className="text-slate-500 dark:text-stone-400 text-[11px] font-bold">{f.crop} • {f.kiln}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-700 dark:text-emerald-400">{f.biocharKg} KG ({f.creditsTons} tCO2e)</p>
                        <p className="text-slate-500 dark:text-stone-400 text-[11px]">KSh {f.incentiveKsh.toLocaleString()} (${f.incentiveUsd})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-600/30 text-slate-700 dark:text-stone-400 text-[11px] flex justify-between items-center">
                <span>Scope 3 Agro Insetting: Zero Greenwashing</span>
                <button
                  onClick={() => setActiveView('outgrowers')}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                >
                  Open Full Outgrower Audit Trail &rarr;
                </button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB: COMPREHENSIVE FUNDED OUTGROWERS RECORD TRAIL                         */}
      {/* ========================================================================= */}
      {activeView === 'outgrowers' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-stone-100">Funded Outgrowers & Supply-Chain Insetting Trail</h3>
              <p className="text-slate-500 dark:text-stone-400 text-xs">Direct audit record of smallholders sponsored by {smeInfo.name} for biochar pyrolysis</p>
            </div>
            <button
              onClick={() => {
                const headers = ['Outgrower Name', 'Phone Number', 'Sub-County Location', 'Feedstock Crop', 'Sponsored Kiln', 'Biochar Yield (KG)', 'Carbon Credits (tCO2e)', 'Cash Incentive (KSh)', 'Cash Incentive (USD)', 'Burns Completed', 'M-Pesa Receipt Ref', 'Insetting Status'];
                const rows = fundedFarmersRegistry.map((f) => [
                  f.name,
                  f.phone,
                  f.location,
                  f.crop,
                  f.kiln,
                  f.biocharKg,
                  f.creditsTons,
                  f.incentiveKsh,
                  f.incentiveUsd,
                  f.burns,
                  f.lastReceipt,
                  f.status
                ]);
                downloadCSV(`${smeInfo.name.toLowerCase().replace(/\s+/g, '_')}_funded_outgrowers.csv`, headers, rows);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center space-x-1.5 self-start cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Outgrowers CSV</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search outgrower by name, phone, kiln, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] pl-9 pr-3 py-2.5 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-sm"
              />
            </div>
            <div>
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="w-full bg-white dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] px-3 py-2.5 rounded-xl text-slate-900 dark:text-stone-100 font-bold text-xs focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
              >
                <option value="all">All Crop Residue Feedstocks</option>
                <option value="Maize">Maize Stover & Cobs</option>
                <option value="Coffee">Coffee Husks</option>
                <option value="Sugarcane">Sugarcane Bagasse & Trash</option>
                <option value="Cassava">Cassava Stems</option>
                <option value="Wheat">Wheat Straw</option>
              </select>
            </div>
          </div>

          {/* Outgrowers Audit Table */}
          <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-4 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#2d3f58] text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-2">Outgrower Farmer</th>
                  <th className="pb-3 px-2">Location & Feedstock</th>
                  <th className="pb-3 px-2">Sponsored Kiln</th>
                  <th className="pb-3 px-2 text-right">Harvest Mass</th>
                  <th className="pb-3 px-2 text-right">CO2e Sequestered</th>
                  <th className="pb-3 px-2 text-right">Cash Incentive (KES/USD)</th>
                  <th className="pb-3 px-2 text-center">Status & Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#2d3f58]/40">
                {filteredOutgrowers.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-[#131e30]/60 transition-colors">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-900 dark:text-stone-100">{f.name}</p>
                      <span className="text-[10px] text-slate-500 dark:text-stone-400">{f.phone}</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-700 dark:text-stone-300">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">{f.crop}</p>
                      <span className="text-[10px] text-slate-500 dark:text-stone-500">{f.location}</span>
                    </td>
                    <td className="py-3.5 px-2 font-bold text-orange-600 dark:text-orange-400">{f.kiln}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-slate-900 dark:text-stone-100">
                      {f.biocharKg.toLocaleString()} KG
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {f.creditsTons} tCO2e
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <p className="font-bold text-slate-900 dark:text-stone-100">KSh {f.incentiveKsh.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-500 dark:text-stone-400">${f.incentiveUsd} USD</span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300">
                        {f.lastReceipt}
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
      {/* TAB: CRYPTOGRAPHIC dMRV LEDGER VIEW                                       */}
      {/* ========================================================================= */}
      {activeView === 'ledger' && (
        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl shadow-sm">
          <LedgerExplorerView blocks={[]} onVerifyChain={() => {}} />
        </div>
      )}

      {/* ISSB / IFRS S2 Pass Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#131e30] border-2 border-emerald-600 max-w-md w-full p-6 sm:p-7 rounded-3xl space-y-4 text-slate-900 dark:text-stone-100 font-mono shadow-2xl">
            <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-[#2d3f58] pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-stone-100">Kenya EMCA 2026 ESG Audit Pass</h3>
                <p className="text-[11px] text-slate-500 dark:text-stone-400">ISSB IFRS S2 Climate Disclosure Standard</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">Corporate Entity:</span>
                <span className="font-bold">{smeInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">KRA Tax PIN:</span>
                <span>{smeInfo.tax_pin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">Scope 1 & 2 Emissions:</span>
                <span>{gross} tCO2e / Quarter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">Biochar Inset Retirement:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">-{smeInfo.current_quarter_offsets} tCO2e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">Net Residual Carbon:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{net} tCO2e</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => {
                  downloadCertificateDocument(`issb_esg_pass_${smeInfo.tax_pin}`, {
                    title: 'ISSB IFRS S2 Corporate Scope 1-3 Compliance Passport',
                    tonnage: String(smeInfo.current_quarter_offsets),
                    biocharKg: String((smeInfo.current_quarter_offsets * 456.6).toFixed(1)),
                    certId: `KE-NCR-2026-ISSB-${smeInfo.tax_pin}`,
                    entity: smeInfo.name,
                    location: smeInfo.location,
                    kilns: '25 Subsidized Smart Kilns (Western Kenya Biomass Hub)',
                    value: `Scorecard Grade: ${esgGrade} (AUDITED)`,
                    date: new Date().toLocaleDateString('en-KE')
                  });
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-[#1c2a3e] hover:bg-slate-200 dark:hover:bg-[#283850] border border-slate-300 dark:border-[#2d3f58] text-slate-800 dark:text-stone-200 font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Certificate</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BioSmeDashboard;

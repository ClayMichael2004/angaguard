import React, { useState } from 'react';
import { ArrowLeft, History, CheckCircle2, Download, Search, Filter, ShieldCheck, Flame, Wallet, ExternalLink, FileText } from 'lucide-react';
import { downloadCSV, downloadCertificateDocument } from '../utils/downloadHelpers';

export const FarmerRecordsPage = ({ onBack, farmerName = 'Wanjala Wafula', farmerType = 'bio-sme' }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive Sales & Data Records
  const allRecords = [
    {
      id: 'REC-9941',
      date: '2026-08-19 14:32 EAT',
      kiln: 'Kiln #1 (Plot A - Maize Cob)',
      biocharKg: 85.0,
      co2eTons: 0.23,
      payoutKsh: 1480,
      channel: 'Bio SME Insetting (Kizito Grain)',
      mpesaReceipt: 'QHK9102941',
      hash: '0x8a91f4b29c1048e',
      status: 'VERIFIED & PAID'
    },
    {
      id: 'REC-8820',
      date: '2026-08-14 11:15 EAT',
      kiln: 'Kiln #2 (Plot B - Coffee Husk)',
      biocharKg: 110.0,
      co2eTons: 0.30,
      payoutKsh: 1950,
      channel: 'Coop Pool (Kakamega Sugarcane)',
      mpesaReceipt: 'PBA4819204',
      hash: '0x3f72e9104bc8291',
      status: 'VERIFIED & PAID'
    },
    {
      id: 'REC-7711',
      date: '2026-08-08 16:45 EAT',
      kiln: 'Kiln #1 (Plot A - Maize Cob)',
      biocharKg: 72.0,
      co2eTons: 0.19,
      payoutKsh: 1220,
      channel: 'Bio SME Insetting (Kizito Grain)',
      mpesaReceipt: 'MKA1928491',
      hash: '0x7c94b2190ef8124',
      status: 'VERIFIED & PAID'
    },
    {
      id: 'REC-6604',
      date: '2026-07-28 09:20 EAT',
      kiln: 'Kiln #3 (Outgrower Plot - Sugarcane)',
      biocharKg: 145.0,
      co2eTons: 0.40,
      payoutKsh: 2600,
      channel: 'Coop Pool (Kakamega Sugarcane)',
      mpesaReceipt: 'NKA8819203',
      hash: '0x9d12a8847cc0192',
      status: 'VERIFIED & PAID'
    },
    {
      id: 'REC-5591',
      date: '2026-07-15 13:10 EAT',
      kiln: 'Kiln #1 (Plot A - Maize Cob)',
      biocharKg: 95.0,
      co2eTons: 0.26,
      payoutKsh: 1680,
      channel: 'Bio SME Insetting (Kizito Grain)',
      mpesaReceipt: 'LKA3391024',
      hash: '0x1e88c7720bc9910',
      status: 'VERIFIED & PAID'
    }
  ];

  const filteredRecords = allRecords.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.kiln.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.mpesaReceipt.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'bio-sme') return matchesSearch && rec.channel.includes('Bio SME');
    if (filter === 'coop') return matchesSearch && rec.channel.includes('Coop');
    return matchesSearch;
  });

  const handleDownloadCsv = () => {
    const headers = ['Record ID', 'Date & Time', 'Smart Kiln', 'Biochar Yield (KG)', 'Carbon Offset (tCO2e)', 'Disbursal Channel', 'M-Pesa Payout (KSh)', 'M-Pesa Receipt Ref', 'Verification Audit Seal', 'Status'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.kiln,
      r.biocharKg,
      r.co2eTons,
      r.channel,
      r.payoutKsh,
      r.mpesaReceipt,
      r.hash,
      r.status
    ]);
    downloadCSV(`${farmerName.toLowerCase().replace(/\s+/g, '_')}_harvest_sales_records.csv`, headers, rows);
  };

  const handleDownloadAllCertificate = () => {
    downloadCertificateDocument(`${farmerName.toLowerCase().replace(/\s+/g, '_')}_carbon_certificate`, {
      title: 'Smallholder Biochar Carbon Harvest Certificate',
      tonnage: '1.38',
      biocharKg: '507.0',
      certId: 'KE-NCR-2026-FARMER-9941',
      entity: `${farmerName} (Verified Smallholder Producer)`,
      location: 'Kakamega Central & Lurambi Wards, Western Kenya',
      kilns: 'KILN-001, KILN-002, KILN-003',
      value: 'KSh 8,930.00 ($68.69 USD)',
      date: new Date().toLocaleString('en-KE')
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn w-full font-mono text-xs text-slate-900 dark:text-stone-100">
      
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-[#2d3f58]/40 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#2d3f58] bg-white dark:bg-[#131e30] text-slate-800 dark:text-stone-200 font-bold hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to Dashboard</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-900 dark:text-stone-100">
              Past Sales & Biochar Harvest Records
            </h1>
            <p className="text-slate-600 dark:text-stone-300 text-xs mt-0.5 font-bold">
              Producer: <strong>{farmerName}</strong> • Verified Kenya EMCA Registry Ledger
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDownloadAllCertificate}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Download Certificate</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 space-y-2 rounded-2xl shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <Flame className="w-4 h-4" />
            <span>Total Biochar Harvested</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-stone-100">1,420.0 KG</p>
          <p className="text-slate-600 dark:text-stone-300 text-[11px] font-bold">18 Pyrolysis Burn Cycles</p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 space-y-2 rounded-2xl shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold">
            <History className="w-4 h-4" />
            <span>Carbon Offsets Generated</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-stone-100">3.89 tCO2e</p>
          <p className="text-slate-600 dark:text-stone-300 text-[11px] font-bold">Verified dMRV Sensor Data</p>
        </div>

        <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 space-y-2 rounded-2xl shadow-sm border-l-4 border-l-cyan-500">
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold">
            <Wallet className="w-4 h-4" />
            <span>Total M-Pesa Disbursed</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-stone-100">KSh 34,500.00</p>
          <p className="text-slate-600 dark:text-stone-300 text-[11px] font-bold">100% Settled Safaricom B2C</p>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Kiln, or M-Pesa Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] pl-9 pr-4 py-2 rounded-xl text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:border-orange-500 text-xs shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'bio-sme', label: 'Bio SME Insetting' },
            { id: 'coop', label: 'Cooperative Pool' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                filter === btn.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-[#131e30] text-slate-700 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-[#1c2a3e]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-5 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#2d3f58] text-slate-500 dark:text-stone-400 font-bold uppercase text-[10px]">
              <th className="pb-3 px-2">Record ID</th>
              <th className="pb-3 px-2">Date & Time</th>
              <th className="pb-3 px-2">Smart Kiln Batch</th>
              <th className="pb-3 px-2 text-right">Harvest Yield</th>
              <th className="pb-3 px-2 text-right">Carbon Sequestration</th>
              <th className="pb-3 px-2">Offtaker Channel</th>
              <th className="pb-3 px-2 text-right">M-Pesa Payout</th>
              <th className="pb-3 px-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#2d3f58]/40">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#131e30]/60 transition-colors">
                <td className="py-4 px-2 font-bold text-slate-900 dark:text-stone-100">{r.id}</td>
                <td className="py-4 px-2 text-slate-600 dark:text-stone-300">{r.date}</td>
                <td className="py-4 px-2 text-slate-900 dark:text-stone-100 font-bold">{r.kiln}</td>
                <td className="py-4 px-2 text-right font-bold text-slate-900 dark:text-stone-100">{r.biocharKg} KG</td>
                <td className="py-4 px-2 text-right font-bold text-emerald-700 dark:text-emerald-400">{r.co2eTons} tCO2e</td>
                <td className="py-4 px-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] text-slate-800 dark:text-stone-200">
                    {r.channel}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">+KSh {(r.payoutKsh || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 dark:text-stone-400">{r.mpesaReceipt}</p>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FarmerRecordsPage;

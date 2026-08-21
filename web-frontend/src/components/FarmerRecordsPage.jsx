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
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto font-mono text-xs text-stone-900 dark:text-stone-100">
      
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#443028]/40 light:border-[#b8ad96] gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#443028] light:border-[#b8ad96] bg-[#1c1512] light:bg-[#dad2bd] text-stone-800 dark:text-stone-200 font-bold hover:text-orange-500 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to Dashboard</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-sans">
              Past Sales & Biochar Harvest Records
            </h1>
            <p className="text-stone-700 dark:text-stone-300 text-xs mt-0.5 font-bold">
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
        <div className="earthy-box p-6 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <Flame className="w-4 h-4" />
            <span>Total Biochar Harvested</span>
          </div>
          <p className="text-3xl font-black">1,420.0 KG</p>
          <p className="text-stone-700 dark:text-stone-300 text-[11px] font-bold">18 Pyrolysis Burn Cycles</p>
        </div>

        <div className="earthy-box p-6 space-y-2">
          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold">
            <History className="w-4 h-4" />
            <span>Carbon Offsets Generated</span>
          </div>
          <p className="text-3xl font-black">3.89 tCO2e</p>
          <p className="text-stone-700 dark:text-stone-300 text-[11px] font-bold">Verified dMRV Sensor Data</p>
        </div>

        <div className="earthy-box p-6 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <Wallet className="w-4 h-4" />
            <span>Total M-Pesa Disbursed</span>
          </div>
          <p className="text-3xl font-black">KSh 34,500.00</p>
          <p className="text-stone-700 dark:text-stone-300 text-[11px] font-bold">100% Settled Safaricom B2C</p>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="earthy-box p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
          <input
            type="text"
            placeholder="Search by ID, Kiln, or M-Pesa Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#120e0c] light:bg-[#d1c8b3] border border-[#443028] light:border-[#b8ad96] pl-9 pr-4 py-2 rounded-xl text-stone-900 dark:text-white font-bold placeholder-stone-500 focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-[#1c1512] light:bg-[#dad2bd] text-stone-800 dark:text-stone-300 border border-[#443028] light:border-[#b8ad96]'
            }`}
          >
            All Sales ({allRecords.length})
          </button>

          <button
            onClick={() => setFilter('bio-sme')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'bio-sme'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-[#1c1512] light:bg-[#dad2bd] text-stone-800 dark:text-stone-300 border border-[#443028] light:border-[#b8ad96]'
            }`}
          >
            Bio SME Insetting
          </button>

          <button
            onClick={() => setFilter('coop')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'coop'
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-[#1c1512] light:bg-[#dad2bd] text-stone-800 dark:text-stone-300 border border-[#443028] light:border-[#b8ad96]'
            }`}
          >
            Coop Pool
          </button>
        </div>
      </div>

      {/* Detailed Records Audit Table */}
      <div className="earthy-box overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#1c1512] light:bg-[#dad2bd] border-b border-[#443028] light:border-[#b8ad96] text-stone-800 dark:text-stone-300 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4">Record ID & Date</th>
                <th className="py-3.5 px-4">Pyrolysis Kiln</th>
                <th className="py-3.5 px-4">Biochar Yield</th>
                <th className="py-3.5 px-4">Offset Credit</th>
                <th className="py-3.5 px-4">Channel / Sponsor</th>
                <th className="py-3.5 px-4">M-Pesa Payout</th>
                <th className="py-3.5 px-4">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#443028]/40 light:divide-[#b8ad96]">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#1c1512]/60 light:hover:bg-[#dad2bd]/60 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-orange-600 dark:text-orange-400">{rec.id}</p>
                    <p className="text-stone-700 dark:text-stone-400 text-[11px] font-bold">{rec.date}</p>
                  </td>

                  <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-100">
                    {rec.kiln}
                  </td>

                  <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {rec.biocharKg} KG
                  </td>

                  <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-100">
                    {rec.co2eTons} tCO2e
                  </td>

                  <td className="py-4 px-4 text-stone-800 dark:text-stone-300 font-bold">
                    {rec.channel}
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">+KSh {rec.payoutKsh.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-700 dark:text-stone-400 font-bold">Ref: {rec.mpesaReceipt}</p>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[10px] font-mono bg-stone-900 light:bg-stone-300 text-stone-300 light:text-stone-800 px-2 py-1 rounded border border-[#443028] light:border-[#b8ad96]">
                      {rec.hash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

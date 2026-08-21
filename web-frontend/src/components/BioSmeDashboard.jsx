import React, { useState } from 'react';
import { ShieldCheck, BarChart3, Users, Download } from 'lucide-react';
import { LedgerExplorerView } from './LedgerExplorerView';
import { LineGraph } from './LineGraph';

export const BioSmeDashboard = ({ theme }) => {
  const [smeInfo] = useState({
    name: 'Kizito Grain Millers Ltd',
    location: 'Eldoret Industrial Zone, Kenya',
    funded_farmers_count: 35,
    smart_kilns_sponsored: 25,
    incentive_payout_pct: 85.0,
    current_quarter_offsets: 24.8,
    scope1_diesel_liters: 12500,
    scope2_grid_kwh: 45000,
  });

  const [activeView, setActiveView] = useState('overview');
  const [showCertModal, setShowCertModal] = useState(false);

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

  const fundedFarmers = [
    { name: 'Wanjala Wafula', crop: 'Maize Stover', biocharKg: 1015, incentiveKsh: 28450, kiln: 'KILN-001' },
    { name: 'Amina Nekesa', crop: 'Coffee Husks', biocharKg: 840, incentiveKsh: 23500, kiln: 'KILN-002' },
    { name: 'Barasa Simiyu', crop: 'Sugarcane Bagasse', biocharKg: 1250, incentiveKsh: 35000, kiln: 'KILN-003' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto font-mono text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#443028]/40 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-sans">
              Bio SME Corporate Dashboard
            </h1>
            <span className="bg-emerald-950/40 border border-emerald-600/60 text-emerald-500 font-mono text-xs px-3 py-1 rounded-full font-bold">
              Supply Insetting
            </span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-xs mt-1">
            {smeInfo.name} • Sponsoring Outgrower Farmers with Smart Kilns
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView(activeView === 'overview' ? 'ledger' : 'overview')}
            className="px-4 py-2 rounded-xl border border-[#443028] text-stone-300 hover:border-orange-500 cursor-pointer"
          >
            {activeView === 'overview' ? 'Cryptographic Ledger' : 'ESG Overview'}
          </button>
          <button
            onClick={() => setShowCertModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
          >
            ISSB Pass
          </button>
        </div>
      </div>

      {activeView === 'overview' ? (
        <>
          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="earthy-box p-6 space-y-2">
              <span className="text-stone-500">ESG Insetting Grade</span>
              <p className="text-4xl font-black text-emerald-500">{esgGrade}</p>
              <p className="text-stone-500 text-[11px]">Net: {net} tCO2e</p>
            </div>

            <div className="earthy-box p-6 space-y-2">
              <span className="text-stone-500">Sponsored Outgrowers</span>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{smeInfo.funded_farmers_count} Farmers</p>
              <p className="text-stone-500 text-[11px]">{smeInfo.smart_kilns_sponsored} Smart Kilns</p>
            </div>

            <div className="earthy-box p-6 space-y-2">
              <span className="text-stone-500">Farmer Incentive Split</span>
              <p className="text-3xl font-bold text-orange-500">{smeInfo.incentive_payout_pct}% Direct</p>
              <p className="text-stone-500 text-[11px]">Disbursed via M-Pesa</p>
            </div>

            <div className="earthy-box p-6 space-y-2">
              <span className="text-stone-500">Biochar Offsets</span>
              <p className="text-3xl font-bold text-emerald-500">-{smeInfo.current_quarter_offsets} Tons</p>
              <p className="text-stone-500 text-[11px]">Kenyan Range: $35 - $145/t</p>
            </div>
          </div>

          {/* Quarterly Line Graph & Funded Outgrowers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Line Graph */}
            <div className="earthy-box p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
                <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <span>Quarterly Carbon Offsets Line Graph</span>
                </div>
                <span className="text-stone-500">Offsets Trend</span>
              </div>

              <LineGraph data={offsetLineData} height={180} valuePrefix="-" valueSuffix=" tCO2e" />
            </div>

            {/* Funded Outgrower Farmers */}
            <div className="earthy-box p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
                <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span>Funded Smallholder Outgrowers</span>
                </div>
                <span className="text-stone-500">Smart Kiln Telemetry</span>
              </div>

              <div className="space-y-3">
                {fundedFarmers.map((f) => (
                  <div key={f.name} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex justify-between">
                    <div>
                      <p className="font-bold text-stone-100">{f.name}</p>
                      <p className="text-stone-400 text-[11px]">{f.crop} • {f.kiln}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-500">{f.biocharKg} KG Biochar</p>
                      <p className="text-stone-400 text-[11px]">Incentive: KSh {f.incentiveKsh.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="earthy-box p-6 sm:p-8">
          <LedgerExplorerView blocks={[]} onVerifyChain={() => {}} />
        </div>
      )}

      {/* Cert Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#1c1512] border border-[#443028] max-w-md w-full p-6 rounded-2xl space-y-4 text-white">
            <h3 className="text-lg font-bold text-emerald-500">Kenya EMCA ESG Pass</h3>
            <p className="text-xs text-stone-400">Net Carbon Footprint: {net} Metric Tons CO2e</p>
            <p className="text-xs text-emerald-400 font-bold">Grade: {esgGrade} (AUDITED PASS)</p>
            <button onClick={() => setShowCertModal(false)} className="w-full py-2 bg-emerald-600 rounded-xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

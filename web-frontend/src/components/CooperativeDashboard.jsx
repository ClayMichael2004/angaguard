import React, { useState } from 'react';
import { Users, BarChart2, ShoppingBag, History, ArrowUpRight, Layers } from 'lucide-react';
import { KilnDigitalTwin3D } from './KilnDigitalTwin3D';
import { LineGraph } from './LineGraph';

export const CooperativeDashboard = ({ theme }) => {
  const [coopInfo] = useState({
    id: 'COOP-KAKAMEGA-01',
    name: 'Kakamega Smallholder Sugarcane Cooperative Union',
    region: 'Western Kenya',
    farmer_count: 148,
    active_kilns: 24,
    cumulative_credits_tons: 38.6,
    cumulative_worth_usd: 5211.0,
    cumulative_worth_ksh: 677430.0,
  });

  const memberFarmers = [
    { phone: '+254712345678', name: 'Wanjala Wafula', kilnId: 'KILN-001', biocharKg: 1015.0, creditsTons: 2.12, worthKsh: 37100 },
    { phone: '+254722998877', name: 'Amina Nekesa', kilnId: 'KILN-002', biocharKg: 840.0, creditsTons: 1.76, worthKsh: 30800 },
    { phone: '+254733112233', name: 'Barasa Simiyu', kilnId: 'KILN-003', biocharKg: 1250.0, creditsTons: 2.62, worthKsh: 45850 },
  ];

  const nonBioSmes = [
    { id: 'SME-MOMBASA-CEMENT', name: 'Mombasa Heavy Cement Works', location: 'Mombasa Port', demandTons: 15.0, offerPriceUsd: 138 },
    { id: 'SME-NAIROBI-LOGISTICS', name: 'East Africa Freight Logistics', location: 'Nairobi Port', demandTons: 20.0, offerPriceUsd: 135 },
  ];

  // Line Graph: Market Carbon Credit Spot Trend ($35 - $145 / tCO2e)
  const lineGraphData = [
    { x: 'Week 1', y: 45 },
    { x: 'Week 2', y: 78 },
    { x: 'Week 3', y: 110 },
    { x: 'Week 4', y: 135 },
  ];

  const [selectedSme, setSelectedSme] = useState(null);
  const [showSalesModal, setShowSalesModal] = useState(false);

  const handleSellToSme = (sme) => {
    setSelectedSme(sme);
    setShowSalesModal(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto font-mono text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#443028]/40 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-sans">
            Agricultural Cooperative Hub
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-xs mt-1">
            {coopInfo.name} • {coopInfo.region}
          </p>
        </div>

        <div className="earthy-box p-4 flex items-center space-x-3">
          <Users className="w-5 h-5 text-orange-500" />
          <div>
            <span className="text-stone-500 text-[10px]">Registered Farmers</span>
            <p className="font-bold text-stone-900 dark:text-stone-100">{coopInfo.farmer_count} Members</p>
          </div>
        </div>
      </div>

      {/* Cumulative Credits & Market Worth */}
      <div className="earthy-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-[#443028] shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-emerald-500 font-bold uppercase">Cumulative Credits</span>
            <p className="text-3xl font-black text-emerald-500">{coopInfo.cumulative_credits_tons} tCO2e</p>
            <p className="text-stone-500 text-[11px]">{coopInfo.active_kilns} Active Kilns</p>
          </div>

          <div className="space-y-1">
            <span className="text-stone-300 font-bold uppercase">Kenyan Price Range (USD)</span>
            <p className="text-3xl font-black text-white">$35.00 – $145.00</p>
            <p className="text-stone-500 text-[11px]">Spot Index Range</p>
          </div>

          <div className="space-y-1">
            <span className="text-orange-500 font-bold uppercase">Pool Value (KES)</span>
            <p className="text-3xl font-black text-orange-500">KSh {coopInfo.cumulative_worth_ksh.toLocaleString()}</p>
            <p className="text-stone-500 text-[11px]">Ready for Member Dividends</p>
          </div>
        </div>
      </div>

      {/* Line Graph: Market Carbon Credit Trend */}
      <div className="earthy-box p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
          <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
            <BarChart2 className="w-5 h-5 text-orange-500" />
            <span>Coop Carbon Credit Market Value Trend ($/tCO2e)</span>
          </div>
          <span className="text-stone-500">Live Trend</span>
        </div>

        <LineGraph data={lineGraphData} height={180} valuePrefix="$" valueSuffix="/t" />
      </div>

      {/* 3D Representation of Member Kilns */}
      <div className="earthy-box p-6 sm:p-8">
        <KilnDigitalTwin3D theme={theme} />
      </div>

      {/* Managed Members & Non-Bio SME Marketplace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="earthy-box p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <Users className="w-5 h-5 text-emerald-500" />
              <span>Smallholder Members & Credits Worth</span>
            </div>
            <span className="text-stone-500">{memberFarmers.length} Members</span>
          </div>

          <div className="space-y-3">
            {memberFarmers.map((f) => (
              <div key={f.phone} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex justify-between">
                <div>
                  <p className="font-bold text-stone-100">{f.name}</p>
                  <p className="text-stone-400 text-[11px]">{f.phone} • {f.kilnId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-500">{f.creditsTons} tCO2e</p>
                  <p className="text-stone-400 text-[11px]">KSh {f.worthKsh.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="earthy-box p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
              <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <span>Sell Credits to Non-Bio SMEs</span>
              </div>
              <span className="text-orange-500 font-bold">Open Marketplace</span>
            </div>

            <div className="space-y-3">
              {nonBioSmes.map((sme) => (
                <div key={sme.id} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-stone-100">{sme.name}</p>
                    <p className="text-stone-400 text-[11px]">{sme.location} • Demand: {sme.demandTons} Tons</p>
                  </div>
                  <button
                    onClick={() => handleSellToSme(sme)}
                    className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Sell ${sme.offerPriceUsd}/t</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-600/30 text-emerald-400 flex justify-between">
            <span>Audit: 2 Sales Settled</span>
            <span className="font-bold">VERIFIED</span>
          </div>
        </div>

      </div>

      {/* Sales Modal */}
      {showSalesModal && selectedSme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#1c1512] border border-[#443028] max-w-md w-full p-6 rounded-2xl space-y-6 text-white font-mono">
            <h3 className="text-lg font-bold text-orange-500">Sell Credits to {selectedSme.name}</h3>
            <div className="space-y-2 text-xs bg-[#120e0c] p-4 rounded-xl border border-[#443028]">
              <p>Volume: <strong>{selectedSme.demandTons} Metric Tons CO2e</strong></p>
              <p>Offer Price: <strong>${selectedSme.offerPriceUsd} per Ton</strong></p>
              <p className="pt-2 border-t border-[#443028] text-emerald-500 font-bold">
                Total Payment: KSh {(selectedSme.demandTons * selectedSme.offerPriceUsd * 130).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end space-x-3 text-xs">
              <button onClick={() => setShowSalesModal(false)} className="px-4 py-2 border border-[#443028] rounded-xl text-stone-400">Cancel</button>
              <button onClick={() => { alert('Credits sold successfully to Non-Bio SME.'); setShowSalesModal(false); }} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl">Confirm Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

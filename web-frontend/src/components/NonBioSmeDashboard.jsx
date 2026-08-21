import React, { useState } from 'react';
import { ShoppingCart, BarChart2, CheckCircle2, ArrowUpRight, Building2 } from 'lucide-react';
import { LineGraph } from './LineGraph';

export const NonBioSmeDashboard = ({ theme }) => {
  const [smeProfile] = useState({
    name: 'East Africa Express Fleet Freight Ltd',
    location: 'Nairobi Inland Port Depot',
    gross_liability: 62.7,
  });

  const [coopCreditPools] = useState([
    { id: 'POOL-KAKAMEGA', coopName: 'Kakamega Smallholder Sugarcane Coop', availableCredits: 38.6, pricePerTon: 135, region: 'Western Kenya', ncrId: 'KE-NCR-2026-KKM-01' },
    { id: 'POOL-KISUMU', coopName: 'Kisumu Rice Farmers Cooperative Union', availableCredits: 52.0, pricePerTon: 132, region: 'Lake Basin Zone', ncrId: 'KE-NCR-2026-KSM-04' },
    { id: 'POOL-ELDORET', coopName: 'Eldoret Grain Growers Network', availableCredits: 29.4, pricePerTon: 138, region: 'Rift Valley Region', ncrId: 'KE-NCR-2026-ELD-09' },
  ]);

  // Line Graph: Price Fluctuation Range ($35 - $145 / tCO2e)
  const priceFluctuationsLine = [
    { x: '08:00', y: 130 },
    { x: '10:00', y: 132 },
    { x: '12:00', y: 136 },
    { x: '14:00', y: 134 },
    { x: '16:00', y: 135 },
  ];

  const [selectedPool, setSelectedPool] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(5.0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState(null);

  const handleOpenPurchase = (pool) => {
    setSelectedPool(pool);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPool) return;
    const totalCost = (purchaseAmount * selectedPool.pricePerTon).toFixed(2);
    setPurchaseReceipt({
      poolName: selectedPool.coopName,
      credits: purchaseAmount,
      totalUsd: totalCost,
      ncrId: selectedPool.ncrId
    });
    setShowPurchaseModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto font-mono text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#443028]/40 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-sans">
              Non-Bio SME Carbon Credit Marketplace
            </h1>
            <span className="bg-orange-950/40 border border-orange-600/60 text-orange-500 font-mono text-xs px-3 py-1 rounded-full font-bold">
              Market Offsetting
            </span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-xs mt-1">
            {smeProfile.name} • {smeProfile.location}
          </p>
        </div>

        <div className="earthy-box p-4 flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-orange-500" />
          <div>
            <span className="text-stone-500 text-[10px]">Gross Carbon Liability</span>
            <p className="font-bold text-stone-900 dark:text-stone-100">{smeProfile.gross_liability} tCO2e</p>
          </div>
        </div>
      </div>

      {/* Line Graph & Available Credit Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Graph: Spot Price Fluctuation */}
        <div className="lg:col-span-1 earthy-box p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <BarChart2 className="w-5 h-5 text-orange-500" />
              <span>Kenyan Price Range ($35 - $145/t)</span>
            </div>
            <span className="text-stone-500">Live Line Index</span>
          </div>

          <LineGraph data={priceFluctuationsLine} height={180} valuePrefix="$" valueSuffix="/t" />
        </div>

        {/* Ready-To-Buy Coop Credit Pools */}
        <div className="lg:col-span-2 earthy-box p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#443028]/40 pb-4">
            <div className="flex items-center space-x-2 font-bold text-stone-900 dark:text-stone-100">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              <span>Available Coop Carbon Credit Pools</span>
            </div>
            <span className="text-stone-500">Verified Kenya NCR</span>
          </div>

          <div className="space-y-4">
            {coopCreditPools.map((pool) => (
              <div key={pool.id} className="p-4 rounded-xl bg-[#1c1512] border border-[#443028] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-stone-100 text-sm">{pool.coopName}</p>
                  <p className="text-stone-400 text-[11px]">{pool.region} • NCR ID: <span className="text-emerald-500">{pool.ncrId}</span></p>
                  <p className="text-stone-400">Inventory: <strong className="text-white">{pool.availableCredits} Tons CO2e</strong></p>
                </div>
                <button
                  onClick={() => handleOpenPurchase(pool)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Buy (${pool.pricePerTon}/t)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#1c1512] border border-[#443028] max-w-md w-full p-6 rounded-2xl space-y-4 text-white">
            <h3 className="text-lg font-bold text-emerald-500">Buy Carbon Credits</h3>
            <div className="space-y-2 text-xs bg-[#120e0c] p-4 rounded-xl border border-[#443028]">
              <p>Coop Provider: <strong>{selectedPool.coopName}</strong></p>
              <p>Price: <strong>${selectedPool.pricePerTon} per Ton</strong></p>
              <div className="space-y-1 pt-2">
                <label className="text-stone-400">Volume to Buy (Tons):</label>
                <input
                  type="number"
                  min="1"
                  max={selectedPool.availableCredits}
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                  className="w-full bg-[#1c1512] border border-[#443028] px-3 py-2 rounded-xl text-white font-bold"
                />
              </div>
              <p className="pt-2 border-t border-[#443028] text-emerald-500 font-bold">
                Total Payment: ${(purchaseAmount * selectedPool.pricePerTon).toFixed(2)} USD
              </p>
            </div>
            <div className="flex justify-end space-x-3 text-xs">
              <button onClick={() => setShowPurchaseModal(false)} className="px-4 py-2 border border-[#443028] rounded-xl text-stone-400">Cancel</button>
              <button onClick={handleConfirmPurchase} className="px-5 py-2 bg-emerald-600 font-bold rounded-xl">Execute Purchase</button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Receipt Toast */}
      {purchaseReceipt && (
        <div className="p-5 bg-emerald-950/60 border border-emerald-600/60 rounded-2xl space-y-1 text-xs text-emerald-400 animate-fadeIn">
          <div className="flex items-center space-x-2 text-white font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Credits Retired Successfully!</span>
          </div>
          <p>Purchased {purchaseReceipt.credits} Tons from {purchaseReceipt.poolName} (${purchaseReceipt.totalUsd} USD).</p>
        </div>
      )}
    </div>
  );
};

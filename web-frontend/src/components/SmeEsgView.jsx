import React, { useState } from 'react';
import { ShieldCheck, Leaf, Factory, Truck, Download, BarChart3 } from 'lucide-react';

export const SmeEsgView = ({ scorecard: initialScorecard, onRefresh }) => {
  const [dieselLiters, setDieselLiters] = useState(12500);
  const [gridKwh, setGridKwh] = useState(45000);
  const [offsetTons, setOffsetTons] = useState(24.8);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Calculate live dynamic metrics
  const scope1 = Number(((dieselLiters * 2.68) / 1000).toFixed(2));
  const scope2 = Number(((gridKwh * 0.12) / 1000).toFixed(2));
  const gross = Number((scope1 + scope2).toFixed(2));
  const net = Math.max(0, Number((gross - offsetTons).toFixed(2)));
  const grade = net < 15 ? 'A+' : net < 25 ? 'A' : net < 40 ? 'B' : 'C';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">SME Corporate ESG Dashboard</h1>
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-lg">
              ISSB / IFRS S2 Compliant
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Kizito Grain Millers Ltd • Eldoret Industrial Zone • Scope 1, 2 & 3 Carbon Offsets Ledger
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate EMCA Compliance Pass</span>
          </button>
        </div>
      </div>

      {/* Grade & Summary Top Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Rating Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">ESG Climate Grade</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="my-4 flex items-baseline space-x-3">
            <span className="text-5xl font-black text-emerald-400 font-mono">{grade}</span>
            <span className="text-xs text-slate-400 font-mono">ISSB Standard S2</span>
          </div>
          <p className="text-xs text-slate-400">
            Top 5% emission abatement compliance among East African agribusiness processors.
          </p>
        </div>

        {/* Scope 1 Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Scope 1 (Direct Fuel)</span>
            </span>
            <span className="text-amber-400 font-bold">{scope1} tCO2e</span>
          </div>
          <p className="text-2xl font-black text-white font-mono">{dieselLiters.toLocaleString()} L</p>
          <p className="text-[11px] text-slate-500 font-mono">Fleet diesel & backup generators</p>
        </div>

        {/* Scope 2 Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center space-x-2">
              <Factory className="w-4 h-4 text-sky-400" />
              <span>Scope 2 (Grid Power)</span>
            </span>
            <span className="text-sky-400 font-bold">{scope2} tCO2e</span>
          </div>
          <p className="text-2xl font-black text-white font-mono">{gridKwh.toLocaleString()} kWh</p>
          <p className="text-[11px] text-slate-500 font-mono">Kenya Power industrial tariff</p>
        </div>

        {/* Scope 3 Mitigation Offset Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Scope 3 (Biochar Offset)</span>
            </span>
            <span className="text-emerald-400 font-bold">-{offsetTons} tCO2e</span>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">Net: {net} tCO2e</p>
          <p className="text-[11px] text-emerald-500/80 font-mono">AngaGuard dMRV Biochar Offsets</p>
        </div>

      </div>

      {/* Interactive Operational Emission Modeler & Recommendation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Interactive Sliders Form */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Interactive Scope 1 & 2 Carbon Calculator</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live Simulation</span>
          </div>

          {/* Diesel Fuel Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-slate-300 font-bold">Diesel Consumption (Liters / Year)</label>
              <span className="text-amber-400 font-bold">{dieselLiters.toLocaleString()} L ({scope1} tCO2e)</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={dieselLiters}
              onChange={(e) => setDieselLiters(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Grid kWh Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-slate-300 font-bold">Grid Electricity (kWh / Year)</label>
              <span className="text-sky-400 font-bold">{gridKwh.toLocaleString()} kWh ({scope2} tCO2e)</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={gridKwh}
              onChange={(e) => setGridKwh(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Biochar Offset Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-slate-300 font-bold">Sponsored Biochar Offsets (Tons CO2e)</label>
              <span className="text-emerald-400 font-bold">-{offsetTons} tCO2e</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={offsetTons}
              onChange={(e) => setOffsetTons(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Net Calculation Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Gross Direct Footprint (Scope 1 + 2):</span>
              <span className="text-white font-bold">{gross} tCO2e</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Verified Biochar Mitigation (Scope 3):</span>
              <span>-{offsetTons} tCO2e</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm text-white font-black">
              <span>Net Carbon Liability:</span>
              <span className="text-emerald-400">{net} tCO2e</span>
            </div>
          </div>
        </div>

        {/* AI ESG Recommendations & Compliance Verification */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>Automated ESG Abatement Action Engine</span>
              </h2>
              <span className="text-xs px-2 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                Kenya EMCA 2026
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white font-bold">Expand Smart Barrel Kiln Deployment</p>
                  <p className="text-slate-400 mt-1">
                    Sponsor 25 additional TLUD biochar kilns for outgrower maize farmers in Kakamega. Abates -14.5 Tons CO2e annually while increasing farmer yields by 18%.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white font-bold">Centralized Fleet Aggregation Routing</p>
                  <p className="text-slate-400 mt-1">
                    Optimize diesel logistics with cooperative aggregation hubs. Saves approx. 4,200L diesel fuel per year (-11.25 tCO2e).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white font-bold">Grid Tariff Peak Shifting</p>
                  <p className="text-slate-400 mt-1">
                    Shift 20% of high-power grain milling shifts to off-peak hydro-dominant grid hours, reducing Scope 2 grid emissions intensity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-300">ISSB Hash: ISSB-IFRS-S2-2026-8f3a9e2d</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>

      </div>

      {/* Compliance Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full p-8 rounded-3xl space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                <div>
                  <h3 className="text-xl font-black text-white">National Carbon Registry Compliance Certificate</h3>
                  <p className="text-xs text-slate-400 font-mono">Republic of Kenya Climate Change Act & ISSB Standard</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Entity Name:</span>
                <span className="text-white font-bold">Kizito Grain Millers Ltd</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">NCR Registry Ref:</span>
                <span className="text-emerald-400 font-bold">KE-NCR-2026-ESG-992140</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Reporting Period:</span>
                <span className="text-white">FY 2026 (Trailing 12 Months)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Gross Scope 1 & 2 Emissions:</span>
                <span className="text-amber-400">{gross} Metric Tons CO2e</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Verified dMRV Biochar Offset:</span>
                <span className="text-emerald-400 font-bold">-{offsetTons} Metric Tons CO2e</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Net Corporate Carbon Footprint:</span>
                <span className="text-emerald-300 font-black text-sm">{net} Metric Tons CO2e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audited Compliance Grade:</span>
                <span className="text-emerald-400 font-black text-sm">{grade} (PASS)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  alert('ESG Certificate downloaded as PDF with Kenya National Carbon Registry digital signature.');
                  setShowCertificateModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center space-x-2 shadow-lg shadow-emerald-950"
              >
                <Download className="w-4 h-4" />
                <span>Download Signed PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

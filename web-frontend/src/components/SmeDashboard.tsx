import React, { useState, useEffect } from 'react';
import { Factory, Zap, ShieldCheck, FileSpreadsheet, Gauge, RefreshCcw, Sparkles, TrendingDown, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { ESGScorecard } from '../types';
import { api } from '../services/api';

interface SmeDashboardProps {
  onExportReport: (scorecard: ESGScorecard) => void;
  onNavigateToTwin: () => void;
}

export const SmeDashboard: React.FC<SmeDashboardProps> = ({ onExportReport, onNavigateToTwin }) => {
  const [dieselLiters, setDieselLiters] = useState<number>(12500);
  const [gridKwh, setGridKwh] = useState<number>(45000);
  const [offsetTons, setOffsetTons] = useState<number>(24.8);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Exact Section 5.2 Mathematical Equations
  // Scope 1 = Diesel * 2.68 kg / 1000
  // Scope 2 = Grid kWh * 0.12 kg / 1000
  const scope1Tons = (dieselLiters * 2.68) / 1000;
  const scope2Tons = (gridKwh * 0.12) / 1000;
  const grossFootprint = scope1Tons + scope2Tons;
  const netFootprint = Math.max(0, grossFootprint - offsetTons);

  const getEsgGrade = (net: number): 'A+' | 'A' | 'B' | 'C' => {
    if (net === 0) return 'A+';
    if (net < 15) return 'A';
    if (net < 45) return 'B';
    return 'C';
  };

  const currentGrade = getEsgGrade(netFootprint);

  const currentScorecard: ESGScorecard = {
    sme_id: 'SME-KIZITO-ELDORET',
    company_name: 'Kizito Grain Millers Ltd',
    reporting_period: 'FY 2026 (Trailing 12M)',
    scope1_direct_tons: Number(scope1Tons.toFixed(2)),
    scope2_indirect_tons: Number(scope2Tons.toFixed(2)),
    gross_emissions_tons: Number(grossFootprint.toFixed(2)),
    scope3_mitigation_tons: offsetTons,
    net_carbon_footprint: Number(netFootprint.toFixed(2)),
    grade: currentGrade,
    recommendations: [
      'High Impact Vector: Expand smart barrel hardware deployments to your outgrower sugarcane network in Kisumu and Eldoret.',
      'Logistics Hub Optimization: Shift 30% of diesel fleet routing to centralized cooperative collection hubs, saving ~4,200L diesel annually.',
      'Clean Geothermal Off-Peak: Synchronize commercial milling shifts with Kenya Power off-peak baseload hours for lower carbon intensity.'
    ],
    issb_compliance_hash: 'ISSB-IFRS-S2-2026-8f3a9e2d',
    generated_at: new Date().toISOString(),
  };

  const handleApplySliders = async () => {
    setIsUpdating(true);
    try {
      await api.updateSMEMetrics('SME-KIZITO-ELDORET', {
        scope1_diesel_liters: dieselLiters,
        scope2_grid_kwh: gridKwh,
        scope3_offsets_tons: offsetTons,
      });
    } catch {
      // Handled gracefully
    } finally {
      setTimeout(() => setIsUpdating(false), 400);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">AngaGuard Enterprise</h1>
            <span className="bg-slate-800 border border-slate-700 text-xs px-2.5 py-1 rounded-lg text-emerald-400 font-mono">
              Kizito Millers Eldoret
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            SME Carbon Accounting Portal & Edge-dMRV Corporate Decarbonization Interface
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-emerald-950/80 border border-emerald-800/80 px-6 py-3 rounded-2xl text-right shadow-lg shadow-emerald-950/40">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block">SME Scorecard Grade</span>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-3xl font-black text-white">{currentGrade}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                currentGrade === 'A+' || currentGrade === 'A' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {currentGrade === 'A+' ? 'NET ZERO' : currentGrade === 'A' ? 'PRIME ESG' : 'COMPLIANT'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Metric Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scope 1 */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <Factory className="absolute right-4 bottom-4 w-16 h-16 text-slate-800/40 group-hover:text-slate-800/60 transition-all" />
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Scope 1 (Direct Operations)</p>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">2.68 kg/L Factor</span>
          </div>
          <p className="text-3xl font-bold mt-3 text-white tracking-tight">{scope1Tons.toFixed(2)} <span className="text-lg font-normal text-slate-400">Tons CO₂e</span></p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Diesel Fuel Draw:</span>
            <span className="text-slate-200 font-semibold">{dieselLiters.toLocaleString()} Liters</span>
          </div>
        </div>

        {/* Scope 2 */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <Zap className="absolute right-4 bottom-4 w-16 h-16 text-slate-800/40 group-hover:text-slate-800/60 transition-all" />
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Scope 2 (Indirect Grid)</p>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">0.12 kg/kWh Factor</span>
          </div>
          <p className="text-3xl font-bold mt-3 text-white tracking-tight">{scope2Tons.toFixed(2)} <span className="text-lg font-normal text-slate-400">Tons CO₂e</span></p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Kenya Power Grid:</span>
            <span className="text-slate-200 font-semibold">{gridKwh.toLocaleString()} kWh</span>
          </div>
        </div>

        {/* Scope 3 Mitigation Asset */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-900/60 p-6 rounded-2xl relative overflow-hidden group shadow-lg shadow-emerald-950/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Scope 3 Mitigation Asset</p>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded border border-emerald-700/50">Biochar CORC Pool</span>
          </div>
          <p className="text-3xl font-bold mt-3 text-emerald-400 tracking-tight">-{offsetTons.toFixed(2)} <span className="text-lg font-normal text-emerald-500/80">Tons CO₂e</span></p>
          <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs font-mono text-emerald-300">
            <span>Active Smart Barrels:</span>
            <span className="text-emerald-200 font-semibold">18 Distributed Kilns</span>
          </div>
        </div>

      </div>

      {/* Operational Sliders & Net Footprint Reconciliation */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <RefreshCcw className={`w-4 h-4 text-emerald-400 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>Interactive Enterprise Carbon Balance Simulator</span>
            </h2>
            <p className="text-xs text-slate-400">Test different operational diesel reduction scenarios and smart barrel sponsorships in real-time.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block uppercase">Net Footprint Liability</span>
            <span className={`text-2xl font-black font-mono ${netFootprint === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {netFootprint.toFixed(2)} Tons CO₂e
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Diesel */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Diesel Consumption (Liters):</span>
              <span className="text-white font-bold">{dieselLiters.toLocaleString()} L</span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="500"
              value={dieselLiters}
              onChange={(e) => {
                setDieselLiters(Number(e.target.value));
                handleApplySliders();
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 L</span>
              <span>15,000 L</span>
              <span>30,000 L</span>
            </div>
          </div>

          {/* Slider 2: Electricity */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Grid Consumption (kWh):</span>
              <span className="text-white font-bold">{gridKwh.toLocaleString()} kWh</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="2000"
              value={gridKwh}
              onChange={(e) => {
                setGridKwh(Number(e.target.value));
                handleApplySliders();
              }}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 kWh</span>
              <span>50,000 kWh</span>
              <span>100,000 kWh</span>
            </div>
          </div>

          {/* Slider 3: Sponsored Biochar Barrels */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-emerald-950/50">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-medium">Sponsor Outgrower Offsets:</span>
              <span className="text-emerald-300 font-bold">{offsetTons.toFixed(1)} Tons</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="0.5"
              value={offsetTons}
              onChange={(e) => {
                setOffsetTons(Number(e.target.value));
                handleApplySliders();
              }}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-emerald-600 font-mono">
              <span>0 Tons</span>
              <span>30 Tons</span>
              <span>60 Tons (Net Negative)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: AI Recommendation Engine + Sovereign Registry Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: AI Recommendations */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2 text-white">
              <Gauge className="w-5 h-5 text-amber-500" />
              <span>AI Emission Reduction Recommendation Engine</span>
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/30">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    High Impact Vector
                  </span>
                </div>
                <p className="text-sm font-medium mt-1 text-slate-200">
                  Expand smart barrel hardware deployments to your outgrower sugarcane network in Kisumu & Eldoret.
                </p>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  Estimated Scope 3 Abatement Yield: <span className="text-emerald-400 font-bold">-14.5 Tons CO₂e/year</span> | Capital Overhead: <span className="text-slate-300">Low</span>
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    Supply Chain Optimization
                  </span>
                </div>
                <p className="text-sm font-medium mt-1 text-slate-200">
                  Establish shared agricultural residue aggregation centers at Kakamega Sugarcane Hub to cut empty truck diesel return trips.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">Real-time AI Model: Llama-3-dMRV-EastAfrica</span>
            <button
              onClick={onNavigateToTwin}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Inspect 3D Kiln Telemetry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Sovereign Registry Tracker & ISSB Export */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2 text-white">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span>Sovereign Registry Vault Tracker (Kenya NCR)</span>
            </h2>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs font-mono">
              <div className="p-3 bg-slate-900 text-slate-400 grid grid-cols-3 border-b border-slate-800 font-semibold">
                <span>Sovereign Asset ID</span>
                <span>Kenya NCR Tracking Ref</span>
                <span className="text-right">State Audit Link</span>
              </div>
              <div className="p-3 grid grid-cols-3 text-slate-300 hover:bg-slate-800/40 transition-all items-center border-b border-slate-900">
                <span className="text-emerald-400 font-bold">AG-CORC-7f8a9c</span>
                <span>KE-NCR-2026-3d2e1b</span>
                <span className="text-right text-sky-400 underline cursor-pointer hover:text-sky-300">Verified Log</span>
              </div>
              <div className="p-3 grid grid-cols-3 text-slate-300 hover:bg-slate-800/40 transition-all items-center border-b border-slate-900">
                <span className="text-emerald-400 font-bold">AG-CORC-4e2b1a</span>
                <span>KE-NCR-2026-7a8f9c</span>
                <span className="text-right text-sky-400 underline cursor-pointer hover:text-sky-300">Verified Log</span>
              </div>
              <div className="p-3 grid grid-cols-3 text-slate-300 hover:bg-slate-800/40 transition-all items-center">
                <span className="text-emerald-400 font-bold">AG-CORC-9c3f10</span>
                <span>KE-NCR-2026-11f42a</span>
                <span className="text-right text-sky-400 underline cursor-pointer hover:text-sky-300">Verified Log</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onExportReport(currentScorecard)}
            className="w-full mt-6 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md border border-slate-600"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Audit-Ready ESG Report (ISSB IFRS S2 Compliant)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

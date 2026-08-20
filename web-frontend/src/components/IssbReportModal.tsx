import React from 'react';
import { X, Printer, Download, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { ESGScorecard } from '../types';

interface IssbReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scorecard: ESGScorecard | null;
}

export const IssbReportModal: React.FC<IssbReportModalProps> = ({ isOpen, onClose, scorecard }) => {
  if (!isOpen || !scorecard) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              ISSB IFRS S2 & GHG Protocol Audit Certificate
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="bg-white text-slate-900 p-8 rounded-2xl space-y-6 shadow-inner font-sans border-2 border-slate-200">
          
          {/* Certificate Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">AngaGuard Sovereign Registry</h1>
              <p className="text-xs text-slate-600 font-mono mt-0.5">Republic of Kenya National Carbon Registry • EMCA 2026 Audit Trail</p>
              <p className="text-xs text-emerald-800 font-semibold mt-1">IFRS S2 Climate-Related Disclosures & GHG Protocol Corporate Standard</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded font-bold uppercase block">Audit Verified</span>
              <span className="text-xs text-slate-500 mt-1 block">{scorecard.issb_compliance_hash}</span>
            </div>
          </div>

          {/* Enterprise Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl text-xs font-mono border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Client Enterprise</span>
              <strong className="text-slate-900">{scorecard.company_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Reporting Period</span>
              <strong className="text-slate-900">{scorecard.reporting_period}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Regional Hub</span>
              <strong className="text-slate-900">Eldoret / Kisumu</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ESG Scorecard Grade</span>
              <strong className="text-emerald-700 text-base">{scorecard.grade}</strong>
            </div>
          </div>

          {/* Emissions Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Greenhouse Gas Accounting Summary (Metric Tons CO₂e)
            </h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-mono">
                <tr>
                  <th className="p-2 border border-slate-300">Emissions Category</th>
                  <th className="p-2 border border-slate-300">Baseline Calculation Method</th>
                  <th className="p-2 border border-slate-300 text-right">Value (tCO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-2 font-semibold">Scope 1 (Direct Operations)</td>
                  <td className="p-2 text-slate-600">Diesel Combustion (EPA 2.68 kg/L Factor)</td>
                  <td className="p-2 text-right font-bold text-slate-900">+{scorecard.scope1_direct_tons.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Scope 2 (Indirect Energy)</td>
                  <td className="p-2 text-slate-600">Kenya Power Grid (Geothermal 0.12 kg/kWh)</td>
                  <td className="p-2 text-right font-bold text-slate-900">+{scorecard.scope2_indirect_tons.toFixed(2)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2">Gross Corporate Carbon Footprint</td>
                  <td className="p-2 text-slate-600">Scope 1 + Scope 2</td>
                  <td className="p-2 text-right text-slate-950">{scorecard.gross_emissions_tons.toFixed(2)}</td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-900 font-bold">
                  <td className="p-2">Scope 3 Mitigation (Biochar Offset)</td>
                  <td className="p-2 text-emerald-800">100-Year Subterranean Biochar Sequestration (dMRV Audited)</td>
                  <td className="p-2 text-right text-emerald-700">-{scorecard.scope3_mitigation_tons.toFixed(2)}</td>
                </tr>
                <tr className="bg-slate-900 text-white font-bold text-sm">
                  <td className="p-2.5">Net Corporate Carbon Footprint</td>
                  <td className="p-2.5 font-normal text-slate-300">Max(0, Gross - Scope 3 Mitigation)</td>
                  <td className="p-2.5 text-right text-emerald-400">{scorecard.net_carbon_footprint.toFixed(2)} tCO₂e</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cryptographic Proof & Signature */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">Cryptographic Verification Seal</span>
              <p className="text-slate-800 font-bold">{scorecard.issb_compliance_hash}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">State Oracle Authority</span>
              <p className="text-emerald-800 font-bold">Verified • Sovereign dMRV Anchor</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BioSmeDashboard } from './BioSmeDashboard';
import { NonBioSmeDashboard } from './NonBioSmeDashboard';
import { Factory, Building2 } from 'lucide-react';

export const SmeDashboard = ({ theme, defaultSmeType = 'bio-sme' }) => {
  // Mode toggle between Bio SME (Supply Insetting) and Non-Bio SME (Marketplace Offsetting)
  const [smeType, setSmeType] = useState(defaultSmeType);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top SME Type Selector Panel */}
      <div className="earthy-panel p-2 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto font-mono text-xs">
        <span className="font-bold text-stone-600 dark:text-stone-400 pl-3">
          SME Corporate ESG Strategy Mode:
        </span>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setSmeType('bio-sme')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              smeType === 'bio-sme'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-transparent text-stone-600 dark:text-stone-400 hover:text-emerald-500'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Bio SME (Supply Chain Insetting)</span>
          </button>

          <button
            onClick={() => setSmeType('non-bio-sme')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              smeType === 'non-bio-sme'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-transparent text-stone-600 dark:text-stone-400 hover:text-orange-500'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Non-Bio SME (Market Offsets)</span>
          </button>
        </div>
      </div>

      {/* Render selected SME Portal View */}
      {smeType === 'bio-sme' ? (
        <BioSmeDashboard theme={theme} />
      ) : (
        <NonBioSmeDashboard theme={theme} />
      )}
    </div>
  );
};

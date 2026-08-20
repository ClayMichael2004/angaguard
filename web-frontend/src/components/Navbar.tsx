import React from 'react';
import { ShieldCheck, Flame, Smartphone, Layers, Activity, PhoneCall, Globe2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUssd: () => void;
  blockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenUssd, blockCount }) => {
  const tabs = [
    { id: 'sme', label: 'SME Corporate ESG', icon: ShieldCheck },
    { id: 'twin', label: '3D Kiln Twin', icon: Flame },
    { id: 'farmer', label: 'Farmer PWA & M-Pesa', icon: Smartphone },
    { id: 'ledger', label: 'Cryptographic Ledger', icon: Layers },
    { id: 'sandbox', label: 'dMRV Fraud Sandbox', icon: Activity },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('sme')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950">
              <Flame className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  Anga<span className="text-emerald-400">Guard</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  dMRV v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Decentralized Oracle for SME ESG & Durable Carbon
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            {/* Live NCR / Blockchain Indicator */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">NCR Block #{blockCount}</span>
            </div>

            {/* USSD Phone Launcher Button */}
            <button
              onClick={onOpenUssd}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-950 transition-all border border-emerald-500/30"
              title="Launch 2G USSD Feature Phone Simulator (*384*55#)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial *384*55#</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

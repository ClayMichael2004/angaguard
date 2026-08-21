import React from 'react';
import { PhoneCall, Menu, ArrowLeft, Leaf, Volume2, Usb } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export const Navbar = ({
  user,
  onLogout,
  onOpenUssd,
  onOpenVoiceAssistant,
  onOpenHardwareBridge,
  onToggleSidebar,
  theme,
  setTheme,
  activeSectionTitle = 'Dashboard'
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-[#2d3f58]/50 bg-white/95 dark:bg-[#0b1320]/90 backdrop-blur-xl transition-all font-mono text-xs shadow-sm">
      {/* Top Protocol Ticker Bar */}
      <div className="bg-slate-100 dark:bg-[#131e30] border-b border-slate-200 dark:border-[#2d3f58]/40 px-4 py-1.5 text-[11px] text-slate-700 dark:text-stone-300 font-bold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>GRID ONLINE</span>
            </span>
            <span className="hidden sm:inline text-slate-400 dark:text-stone-500">•</span>
            <span className="hidden sm:inline">Republic of Kenya Carbon Registry (EMCA 2026 / NEMA)</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kenya Spot Index: <strong className="text-orange-600 dark:text-orange-400">$135.00 / tCO2e</strong></span>
            </span>
            <span className="hidden md:inline text-slate-400 dark:text-stone-500">•</span>
            <span className="hidden md:inline">Active Smart Kilns: <strong className="text-emerald-700 dark:text-emerald-400">18 Units</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Mobile Hamburger + Back to Selection + Section Breadcrumb */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#1c2a3e] border border-slate-300 dark:border-[#2d3f58] text-slate-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Back Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#2d3f58] bg-slate-100 dark:bg-[#131e30] text-slate-800 dark:text-stone-200 font-bold hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-all shadow-sm"
                title="Switch Account / Back to Options"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline font-bold">Switch Account</span>
              </button>
            )}

            {/* In mobile, show Logo if sidebar hidden */}
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>

            {/* Active View / Breadcrumb indicator */}
            <div className="hidden lg:flex items-center space-x-2 text-slate-500 dark:text-stone-400 font-bold text-xs">
              <span className="text-slate-400 dark:text-stone-500">Portal /</span>
              <span className="text-slate-900 dark:text-stone-100 font-black">{activeSectionTitle}</span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>

            {/* Connect Hardware Web Serial Button */}
            <button
              onClick={onOpenHardwareBridge}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-400/40 shadow-sm transition-all cursor-pointer animate-pulse-slow"
              title="Connect Physical WaziDev Arduino via Web Serial"
            >
              <Usb className="w-3.5 h-3.5" />
              <span>Connect Hardware</span>
            </button>

            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-orange-400/40 shadow-sm transition-all cursor-pointer"
                title="AI Swahili / English Voice Assistant"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Assistant</span>
              </button>
            )}

            <button
              onClick={onOpenUssd}
              className="flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl border border-slate-500/40 shadow-sm transition-all cursor-pointer"
              title="Launch 2G USSD Feature Phone Simulator (*384*55#)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden md:inline">2G USSD</span>
              <span className="md:hidden">USSD</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

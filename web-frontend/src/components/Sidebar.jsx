import React from 'react';
import {
  X, LogOut, PhoneCall, Home, Flame, Users, History,
  Building2, Wallet, Layers, ShieldCheck, ArrowDownToLine,
  TrendingUp, FileText, ShoppingBag, Radio, Sparkles, Volume2, User
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export const Sidebar = ({
  isOpen,
  setIsOpen,
  user,
  onLogout,
  onOpenUssd,
  onOpenVoiceAssistant,
  theme,
  setTheme,
  activeSection,
  setActiveSection,
}) => {
  // Navigation items based on user role
  const getNavSections = () => {
    if (!user) return [];

    if (user.role === 'farmer') {
      return [
        { id: 'overview', label: 'Harvest & Overview', icon: Home },
        { id: 'cashout', label: 'M-Pesa Cashout', icon: Wallet },
        { id: 'kiln', label: '3D Kiln Digital Twin', icon: Flame },
        { id: 'market', label: 'Spot Price Index', icon: TrendingUp },
        { id: 'records', label: 'Sales & Audit Records', icon: History },
      ];
    }

    if (user.role === 'cooperative') {
      return [
        { id: 'overview', label: 'Coop Hub Overview', icon: Home },
        { id: 'kilns', label: 'Smart Kilns Fleet (18)', icon: Flame },
        { id: 'members', label: 'Smallholders (148)', icon: Users },
        { id: 'sell', label: 'Sell Pooled Credits', icon: ShoppingBag },
        { id: 'transactions', label: 'Transactions Audit', icon: History },
        { id: 'smes', label: 'Corporate SME Buyers', icon: Building2 },
      ];
    }

    if (user.role === 'sme') {
      return [
        { id: 'overview', label: 'ESG Footprint & Scopes', icon: Home },
        { id: 'outgrowers', label: 'Funded Outgrowers', icon: Users },
        { id: 'kilns', label: 'Smart Kilns Twin', icon: Flame },
        { id: 'ledger', label: 'Cryptographic Ledger', icon: ShieldCheck },
        { id: 'reports', label: 'ISSB / CSRD Reports', icon: FileText },
      ];
    }

    return [
      { id: 'overview', label: 'Dashboard', icon: Home },
    ];
  };

  const navSections = getNavSections();

  const handleNavClick = (sectionId) => {
    if (setActiveSection) {
      setActiveSection(sectionId);
    }
    // Close on mobile
    if (setIsOpen && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5 font-mono text-xs select-none">
      {/* Top Header & Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2d3f58]/60 light:border-[#e2e8f0] pb-4">
          <Logo size="sm" />
          <button
            onClick={() => setIsOpen && setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-xl border border-[#2d3f58] light:border-[#cbd5e1] text-stone-400 light:text-slate-600 hover:text-white light:hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-500 light:text-emerald-700 px-3 pb-1">
            Sections & Controls
          </div>

          <nav className="space-y-1">
            {navSections.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/40'
                      : 'text-stone-300 light:text-slate-700 hover:bg-[#1c2a3e] light:hover:bg-slate-100 hover:text-white light:hover:text-black'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-400 light:text-emerald-600'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Telephony & Oracle Utilities */}
        <div className="space-y-1.5 pt-2 border-t border-[#2d3f58]/40 light:border-[#e2e8f0]">
          <div className="text-[10px] uppercase font-extrabold tracking-wider text-orange-500 light:text-orange-700 px-3 pb-1">
            Telephony & Oracle Tools
          </div>

          <button
            onClick={() => {
              onOpenUssd();
              if (setIsOpen && window.innerWidth < 1024) setIsOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-[#131e30] light:bg-slate-50 border border-[#2d3f58] light:border-[#e2e8f0] text-emerald-400 light:text-emerald-700 hover:border-emerald-500 font-bold cursor-pointer transition-all"
            title="Launch 2G USSD (*384*55#) simulator"
          >
            <PhoneCall className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">2G USSD (*384*55#)</span>
          </button>

          {onOpenVoiceAssistant && (
            <button
              onClick={() => {
                onOpenVoiceAssistant();
                if (setIsOpen && window.innerWidth < 1024) setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-[#131e30] light:bg-slate-50 border border-[#2d3f58] light:border-[#e2e8f0] text-orange-400 light:text-orange-700 hover:border-orange-500 font-bold cursor-pointer transition-all"
              title="Listen to Swahili / English AI Voice Assistant"
            >
              <Volume2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="truncate">Voice Assistant (IVR)</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Area: Account Corner Badge, Theme, and Logout */}
      <div className="space-y-3 pt-4 border-t border-[#2d3f58]/60 light:border-[#e2e8f0]">
        
        {/* CORNER ACCOUNT BADGE */}
        {user && (
          <div className="p-3 rounded-2xl bg-[#131e30] light:bg-slate-50 border border-emerald-500/40 light:border-emerald-600/40 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-400 font-black text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-stone-400 light:text-slate-500 uppercase font-extrabold tracking-wide">
                  Active Account
                </p>
                <p className="font-extrabold text-stone-100 light:text-slate-900 text-xs truncate" title={user.name}>
                  {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#2d3f58]/40 light:border-slate-200">
              <span className="text-emerald-500 font-bold uppercase">
                {user.role === 'farmer' ? (user.farmerType === 'bio-sme' ? 'Bio SME Outgrower' : 'Coop Member') : user.role.toUpperCase()}
              </span>
              <span className="text-stone-400 light:text-slate-500 truncate max-w-[100px]" title={user.affiliation}>
                {user.affiliation || 'Kenya NCR'}
              </span>
            </div>
          </div>
        )}

        {/* Theme Mode Switcher */}
        <div className="flex items-center justify-between px-1 py-1">
          <span className="text-[11px] text-stone-400 light:text-slate-600 font-bold">Theme Mode:</span>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            onLogout();
            if (setIsOpen && window.innerWidth < 1024) setIsOpen(false);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 light:bg-red-50 border border-red-800/60 light:border-red-200 text-red-300 light:text-red-700 font-bold flex items-center justify-center space-x-2 cursor-pointer hover:bg-red-900/60 light:hover:bg-red-100 transition-all text-xs"
        >
          <LogOut className="w-4 h-4 text-red-400 light:text-red-600 flex-shrink-0" />
          <span>Exit / Change Account</span>
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar (Visible on lg and above) */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-[#0f172a]/95 light:bg-[#ffffff] border-r border-[#2d3f58] light:border-[#e2e8f0] shadow-xl z-30 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Visible on screens < lg when isOpen is true) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="relative w-80 bg-[#0f172a] light:bg-[#ffffff] border-r border-[#2d3f58] light:border-[#e2e8f0] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;

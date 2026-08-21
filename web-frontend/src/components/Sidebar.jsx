import React from 'react';
import {
  Flame, LayoutDashboard, Wallet, Users, History, TrendingUp,
  Building2, ShieldCheck, FileText, PhoneCall, Volume2, Moon, Sun,
  LogOut, X, ChevronRight, CheckCircle2, Factory, Sparkles, Layers, User, ShoppingBag
} from 'lucide-react';
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
  activeSection = 'overview',
  setActiveSection
}) => {
  if (!user) return null;

  const role = user.role || 'farmer';

  // Navigation Links based on active Persona Role
  const getNavSections = () => {
    if (role === 'farmer') {
      return [
        { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
        { id: 'cashout', label: 'M-Pesa Disbursals', icon: Wallet, badge: 'Direct' },
        { id: 'kiln', label: '3D Smart Kiln Twin', icon: Flame },
        { id: 'market', label: 'Carbon Spot Index', icon: TrendingUp },
        { id: 'records', label: 'Audit Records Trail', icon: History },
      ];
    }
    if (role === 'cooperative') {
      return [
        { id: 'overview', label: 'Overview & 3D Kilns', icon: LayoutDashboard },
        { id: 'kilns', label: 'Smart Kilns Fleet (18)', icon: Flame, badge: 'Live' },
        { id: 'members', label: 'Smallholders (148)', icon: Users },
        { id: 'transactions', label: 'Transactions & Audit', icon: History },
        { id: 'smes', label: 'Corporate Offtakers', icon: Building2 },
        { id: 'sell', label: 'Sell Pooled Credits', icon: ShoppingBag, badge: 'Trade' },
      ];
    }
    if (role === 'sme') {
      return [
        { id: 'overview', label: 'ESG Net-Zero Overview', icon: LayoutDashboard },
        { id: 'outgrowers', label: 'Funded Outgrowers (35)', icon: Factory, badge: 'Insetting' },
        { id: 'ledger', label: 'SHA-256 Ledger Audit', icon: History },
        { id: 'reports', label: 'ISSB / IFRS S2 Reports', icon: FileText },
      ];
    }
    return [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }];
  };

  const navSections = getNavSections();

  const handleNavClick = (sectionId) => {
    if (setActiveSection) {
      setActiveSection(sectionId);
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#0b1320] border-r border-slate-200 dark:border-[#2d3f58] flex flex-col justify-between transition-transform duration-300 ease-in-out font-mono text-xs shadow-xl lg:shadow-none lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-5 border-b border-slate-200 dark:border-[#2d3f58]/60 space-y-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-[#2d3f58] text-slate-500 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* System Protocol Status Badge */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58]/60 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700 dark:text-stone-300">dMRV Oracle v2.6</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/50">
              KENYA NCR
            </span>
          </div>
        </div>

        {/* Middle Navigation Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] uppercase font-bold text-slate-400 dark:text-stone-500 tracking-wider">
              {role === 'farmer' ? 'Smallholder Hub' : role === 'cooperative' ? 'Cooperative Management' : 'Corporate ESG Hub'}
            </p>

            {navSections.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-[#1c2a3e] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-400 border border-orange-300 dark:border-orange-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Telephony & Voice Tools */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#2d3f58]/40">
            <p className="px-3 text-[10px] uppercase font-bold text-slate-400 dark:text-stone-500 tracking-wider">
              Hardware & Offline Tools
            </p>

            <button
              onClick={() => {
                if (onOpenVoiceAssistant) onOpenVoiceAssistant();
                if (setIsOpen) setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800/40 text-orange-900 dark:text-orange-300 font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>AI Voice IVR</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 font-black">Swahili/En</span>
            </button>

            <button
              onClick={() => {
                if (onOpenUssd) onOpenUssd();
                if (setIsOpen) setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#131e30] hover:bg-slate-100 dark:hover:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] text-slate-700 dark:text-stone-300 font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2G USSD (*384*55#)</span>
              </div>
              <span className="text-[9px] text-slate-400 dark:text-stone-500 font-bold">Offline</span>
            </button>
          </div>
        </div>

        {/* Bottom Corner Account & System Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-[#2d3f58]/60 space-y-3 bg-slate-50 dark:bg-[#0b1320]">
          
          {/* Active Account Identity Card */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wide truncate">
                {role === 'farmer' ? 'Smallholder Account' : role === 'cooperative' ? 'Cooperative Union' : 'Corporate Buyer'}
              </p>
              <p className="font-extrabold text-slate-900 dark:text-stone-100 text-xs truncate">
                {user.name || 'Wanjala Wafula'}
              </p>
            </div>
          </div>

          {/* Theme Switcher & Logout */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2d3f58] bg-white dark:bg-[#131e30] text-slate-700 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span className="text-[11px]">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={onLogout}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2d3f58] bg-white dark:bg-[#131e30] text-slate-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold flex items-center justify-center cursor-pointer shadow-sm"
              title="Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-stone-500 pt-1 px-1">
            <span>Republic of Kenya NCR</span>
            <span>EMCA 2026</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

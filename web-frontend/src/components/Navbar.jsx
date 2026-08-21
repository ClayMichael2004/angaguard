import React from 'react';
import { LogOut, PhoneCall, User, Menu, ArrowLeft, Leaf } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export const Navbar = ({ user, onLogout, onOpenUssd, onToggleSidebar, theme, setTheme }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#443028]/40 light:border-[#cbbba5] bg-[#120e0c]/90 dark:bg-[#120e0c]/90 light:bg-[#f7f4ee]/90 backdrop-blur-xl transition-all font-mono text-xs">
      {/* Top Protocol Ticker Bar with Forest Green Accents */}
      <div className="bg-[#1c1512] light:bg-[#eee7dc] border-b border-[#443028]/40 light:border-[#cbbba5] px-4 py-1.5 text-[11px] text-stone-800 dark:text-stone-300 font-bold">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 light:bg-emerald-900/10 border border-emerald-600/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>GRID ONLINE</span>
            </span>
            <span className="hidden sm:inline text-stone-500">•</span>
            <span className="hidden sm:inline">Republic of Kenya Carbon Registry (EMCA 2026)</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kenyan Price Range: <strong className="text-orange-600 dark:text-orange-400">$35.00 – $145.00 / tCO2e</strong></span>
            </span>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:inline">Smart Kilns: <strong className="text-emerald-600 dark:text-emerald-400">18 Units</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Hamburger Button + Back Button + Brand Logo */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-[#1c1512] light:bg-[#eee7dc] border border-[#443028] light:border-[#cbbba5] text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Back Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[#443028] light:border-[#cbbba5] bg-[#1c1512] light:bg-[#eee7dc] text-stone-800 dark:text-stone-200 font-bold hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-all"
                title="Go Back to Previous Page / Account Options"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span className="font-bold">Back</span>
              </button>
            )}

            {/* Professional AngaGuard Logo */}
            <Logo size="md" />
          </div>

          {/* User Account Profile Info */}
          {user && (
            <div className="hidden md:flex items-center space-x-2 bg-[#1c1512] light:bg-[#eee7dc] border border-emerald-600/40 light:border-emerald-700/50 px-3.5 py-1.5 rounded-xl">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="text-[11px]">
                <span className="text-stone-800 dark:text-stone-300 font-bold">Account: </span>
                <strong className="text-stone-900 dark:text-white font-bold">{user.name}</strong>
              </div>
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />

            <button
              onClick={onOpenUssd}
              className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-500/40 shadow-sm transition-all cursor-pointer"
              title="Launch 2G USSD Feature Phone Simulator (*384*55#)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2G USSD</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

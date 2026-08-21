import React from 'react';
import { X, LogOut, PhoneCall, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export const Sidebar = ({ isOpen, setIsOpen, user, onLogout, onOpenUssd, theme, setTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn font-mono text-xs">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Drawer Container */}
      <aside className="relative w-80 bg-[#1c1512] border-r border-[#443028] h-full p-6 flex flex-col justify-between z-10 text-white shadow-2xl">
        
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#443028] pb-4">
            <Logo size="sm" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg border border-[#443028] text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Summary */}
          {user && (
            <div className="p-4 rounded-xl bg-[#120e0c] border border-[#443028] space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Active User Profile</span>
              <p className="font-bold text-stone-100">{user.name}</p>
              <p className="text-orange-500 text-[11px]">
                {user.role === 'farmer' ? (user.farmerType === 'bio-sme' ? 'Bio SME Outgrower' : 'Coop Member') : user.role.toUpperCase()}
              </p>
              <p className="text-stone-400 text-[10px] truncate">{user.affiliation}</p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2">
            <div className="text-[10px] text-stone-500 uppercase font-bold px-2">Dashboard Navigation</div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-orange-600/20 text-orange-400 font-bold border border-orange-600/30"
            >
              <Home className="w-4 h-4" />
              <span>Main Minimalist View</span>
            </button>

            <button
              onClick={() => { onOpenUssd(); setIsOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-[#120e0c] text-emerald-400 border border-[#443028] hover:border-emerald-600 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Launch 2G USSD (*384*55#)</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions: Theme & Logout */}
        <div className="space-y-4 border-t border-[#443028] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Theme Mode:</span>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>

          <button
            onClick={() => { onLogout(); setIsOpen(false); }}
            className="w-full py-3 px-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 font-bold flex items-center justify-center space-x-2 cursor-pointer hover:bg-red-900/60"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out to Options</span>
          </button>
        </div>

      </aside>
    </div>
  );
};

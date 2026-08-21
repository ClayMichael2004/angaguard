import React from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm ${
        theme === 'dark'
          ? 'bg-[#131e30] border-[#2d3f58] text-amber-400 hover:border-amber-500'
          : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400'
      }`}
      title="Toggle Light / Dark Theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-slate-700" />
          <span className="font-bold">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;

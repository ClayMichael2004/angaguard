import React from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer ${
        theme === 'dark'
          ? 'bg-[#1c1512] border-[#443028] text-amber-400 hover:border-orange-500'
          : 'bg-[#f5efe6] border-[#e7dfd5] text-amber-900 hover:border-orange-600'
      }`}
      title="Toggle Light / Dark Earthy Theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="font-bold">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-amber-900" />
          <span className="font-bold">Dark</span>
        </>
      )}
    </button>
  );
};

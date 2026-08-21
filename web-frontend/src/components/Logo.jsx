import React from 'react';
import { Flame } from 'lucide-react';

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-lg' },
    lg: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl' },
    xl: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-2 select-none ${className}`}>
      <div className={`${currentSize.box} rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center shadow-md`}>
        <Flame className={`${currentSize.icon} text-white`} />
      </div>

      {showText && (
        <span className={`${currentSize.text} font-black tracking-tight text-stone-900 dark:text-stone-100 font-sans`}>
          Anga<span className="text-orange-500 font-black">Guard</span>
        </span>
      )}
    </div>
  );
};

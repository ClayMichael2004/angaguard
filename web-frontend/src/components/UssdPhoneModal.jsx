import React, { useState } from 'react';
import { X, Send, RotateCcw } from 'lucide-react';
import { Logo } from './Logo';

export const UssdPhoneModal = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState('menu'); // 'menu', 'balance', 'kiln', 'sell'
  const [inputVal, setInputVal] = useState('');
  const [ussdHistory, setUssdHistory] = useState([
    'CON AngaGuard dMRV *384*55#\n1. Check Biochar Balance\n2. View Kiln Status\n3. Sell Biochar Credits\n4. M-Pesa Cashout'
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (inputVal === '1') {
      setUssdHistory([...ussdHistory, '> 1', 'END Biochar: 1,420 KG\nCredits: 3.89 tCO2e\nValue: KSh 12,450.00']);
    } else if (inputVal === '2') {
      setUssdHistory([...ussdHistory, '> 2', 'END Kiln #1: Active\nSkin Temp: 58.5C\nBiochar Height: 30cm\nSensors: OK']);
    } else if (inputVal === '3') {
      setUssdHistory([...ussdHistory, '> 3', 'END 1.0 Ton Sold to Kakamega Coop.\nDispatched: KSh 3,250 to M-Pesa.\nRef: QHK991024']);
    } else if (inputVal === '4') {
      setUssdHistory([...ussdHistory, '> 4', 'END M-Pesa Cashout Successful!\nKSh 12,450 sent to +254712345678.']);
    } else {
      setUssdHistory([...ussdHistory, `> ${inputVal}`, 'END Invalid USSD Option. Dial *384*55# again.']);
    }
    setInputVal('');
  };

  const handleReset = () => {
    setUssdHistory(['CON AngaGuard dMRV *384*55#\n1. Check Biochar Balance\n2. View Kiln Status\n3. Sell Biochar Credits\n4. M-Pesa Cashout']);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4 animate-fadeIn font-mono text-xs">
      <div className="relative bg-[#1c1512] border border-[#443028] max-w-sm w-full p-6 rounded-3xl space-y-6 shadow-2xl text-stone-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#443028] pb-3">
          <Logo size="sm" />
          <button onClick={onClose} className="p-1 rounded-lg border border-[#443028] text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2G Nokia Feature Phone Casing */}
        <div className="bg-[#120e0c] border-4 border-[#443028] rounded-2xl p-4 space-y-4 shadow-inner">
          
          {/* Nokia LCD Monochromatic Screen */}
          <div className="bg-[#8b9d83] border-2 border-[#5c6e54] text-[#1c2818] p-3 rounded-lg min-h-[160px] font-mono text-[11px] leading-tight space-y-2 whitespace-pre-wrap font-bold shadow-inner">
            <div className="flex justify-between border-b border-[#5c6e54] pb-1 text-[9px] uppercase">
              <span>Safaricom 2G</span>
              <span>*384*55#</span>
            </div>
            <div>{ussdHistory[ussdHistory.length - 1]}</div>
          </div>

          {/* Keypad Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter option (1-4)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-[#1c1512] border border-[#443028] px-3 py-2 rounded-xl text-white font-bold placeholder-stone-600 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2 bg-[#1c1512] hover:bg-stone-800 border border-[#443028] text-stone-300 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
              <span>Redial *384*55#</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

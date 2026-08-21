import React, { useState } from 'react';
import { X, Phone, Volume2, PhoneOff, Delete, Globe } from 'lucide-react';
import { api } from '../services/api';

interface UssdSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UssdSimulatorModal: React.FC<UssdSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('+254712345678');
  const [dialString, setDialString] = useState<string>('*384*55#');
  const [screenText, setScreenText] = useState<string>('Ready\nDial *384*55# and press CALL to start.');
  const [inputVal, setInputVal] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [voicePlaying, setVoicePlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartSession = async () => {
    setIsSessionActive(true);
    const res = await api.sendUSSD(phoneNumber, '');
    setScreenText(res.replace(/^CON /, '').replace(/^END /, ''));
    setInputVal('');
  };

  const handleSendInput = async () => {
    if (!inputVal.trim()) return;
    const res = await api.sendUSSD(phoneNumber, inputVal.trim());
    const isEnd = res.startsWith('END');
    setScreenText(res.replace(/^CON /, '').replace(/^END /, ''));
    setInputVal('');
    if (isEnd) {
      setIsSessionActive(false);
    }
  };

  const handleKeyPress = (char: string) => {
    if (isSessionActive) {
      setInputVal(prev => prev + char);
    } else {
      setDialString(prev => prev + char);
    }
  };

  const handlePlayVoice = () => {
    setVoicePlaying(true);
    // Simple Web Speech API or synthesized voice simulation
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Hello Wanjala. The AngaGuard dMRV oracle has verified your harvest of 79.8 kilograms of biochar. Your M-Pesa funds have been disbursed directly to your mobile phone."
      );
      utterance.rate = 0.96;
      utterance.pitch = 1.15;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const americanFemaleVoice = voices.find(v => 
        (v.lang === 'en-US' || v.lang.startsWith('en')) &&
        (v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('victoria') ||
         v.name.toLowerCase().includes('google us english') ||
         v.name.toLowerCase().includes('jenny') ||
         v.name.toLowerCase().includes('aria') ||
         v.name.toLowerCase().includes('karen') ||
         v.name.toLowerCase().includes('susan') ||
         v.name.toLowerCase().includes('natural') ||
         v.name.toLowerCase().includes('woman') ||
         v.name.toLowerCase().includes('lady'))
      ) || voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));

      if (americanFemaleVoice) {
        utterance.voice = americanFemaleVoice;
      }

      utterance.onend = () => setVoicePlaying(false);
      utterance.onerror = () => setVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoicePlaying(false), 3000);
    }
  };

  const handleEndCall = () => {
    setIsSessionActive(false);
    setScreenText('Session Ended.\nDial *384*55# to reconnect.');
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">2G USSD & Voice Simulator</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Phone Body (Retro Style) */}
        <div className="bg-slate-950 p-6 rounded-2xl border-4 border-slate-800 shadow-inner space-y-4">
          
          {/* LCD Green Screen */}
          <div className="bg-[#8fa382] border-2 border-[#5c6e52] p-4 rounded-lg min-h-[140px] text-[#1b2614] font-mono text-xs flex flex-col justify-between shadow-inner">
            <div className="flex justify-between text-[10px] pb-1 border-b border-[#5c6e52]/40 font-bold">
              <span>Safaricom 2G</span>
              <span>🔋 98%</span>
            </div>

            <div className="my-2 whitespace-pre-line leading-relaxed font-semibold">
              {screenText}
            </div>

            {isSessionActive && (
              <div className="flex items-center border-t border-[#5c6e52]/40 pt-1 text-[11px]">
                <span className="mr-1">&gt;</span>
                <span className="font-bold">{inputVal}</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>

          {/* Voice Prompt Player Button */}
          <button
            onClick={handlePlayVoice}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${voicePlaying ? 'animate-bounce text-emerald-300' : ''}`} />
            <span>{voicePlaying ? 'Playing Swahili IVR Voice...' : 'Play Swahili AI Voice (ElevenLabs)'}</span>
          </button>

          {/* Dial / Action Buttons */}
          <div className="flex gap-2">
            {!isSessionActive ? (
              <button
                onClick={handleStartSession}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call *384*55#</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSendInput}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Send Input</span>
                </button>
                <button
                  onClick={handleEndCall}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 py-3 rounded-xl font-bold font-mono text-sm active:scale-95 transition-all flex flex-col items-center justify-center shadow-sm cursor-pointer"
              >
                <span>{key}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Footer Info */}
        <p className="text-[11px] text-slate-500 text-center font-mono">
          Africa's Talking USSD Directory String: *384*55# • Zero-Data 2G Inclusivity
        </p>

      </div>
    </div>
  );
};

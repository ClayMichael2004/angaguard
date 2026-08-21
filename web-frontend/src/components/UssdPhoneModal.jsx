import React, { useState, useEffect, useRef } from 'react';
import {
  X, Phone, RotateCcw, Volume2, VolumeX, MessageSquare, ShieldCheck,
  Flame, CheckCircle2, Globe, Play, Pause, Mic, Radio, Headphones
} from 'lucide-react';
import { Logo } from './Logo';

export const UssdPhoneModal = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState('sw'); // 'sw' (Swahili) or 'en' (English)
  const [sessionText, setSessionText] = useState(''); // Africa's Talking session path e.g. "3*1"
  const [inputVal, setInputVal] = useState('');
  const [screenText, setScreenText] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backlight, setBacklight] = useState('green'); // 'green', 'amber', 'cyan'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [smsNotification, setSmsNotification] = useState(null);

  // Voice Assistant state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceTitle, setVoiceTitle] = useState('');

  // Farmer profile state in USSD
  const [farmer, setFarmer] = useState({
    name: 'Wanjala Wafula',
    phone: '+254712345678',
    biocharKg: 1420.0,
    creditsTons: 3.89,
    availableKsh: 12450.0,
    withdrawnKsh: 34500.0,
    activeKiln: 'KILN-001',
    kilns: ['KILN-001', 'KILN-004']
  });

  const inputRef = useRef(null);

  // Audio key tone generator using Web Audio API
  const playTone = (freq = 800, duration = 0.05, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context restricted or unavailable
    }
  };

  // Web Speech API Voice Synthesis Engine (Swahili & English)
  const triggerVoiceAssistant = (customText = null, title = null) => {
    const swahiliText = `Habari ndugu Wanjala Wafula. Huu ni mfumo wa sauti wa AngaGuard dMRV Oracle. Pipa lako la smart kiln nambari KILN-001 limekamilisha mchakato wa kuchoma mkaa wa biochar kwa joto la nyuzi mia tano na sabini na moja selsiyasi. Mavuno yako ya kilo themanini za mkaa yamethibitishwa. Salio lako linalopatikana kutoa kwa M-Pesa ni shilingi elfu kumi na mbili mia nne na hamsini. Piga nyota tatu nane nne nyota hamsini na tano reli kutoa pesa.`;
    const englishText = `Hello Wanjala Wafula. This is the AngaGuard dMRV Oracle voice assistant. Your smart kiln KILN-001 has successfully completed the pyrolysis burn cycle at 571 degrees Celsius. Your harvest of 80 kilograms of verified biochar has been sealed on the blockchain. Your available M-Pesa balance is 12,450 Kenya Shillings. Dial star 384 star 55 hash to withdraw your funds.`;

    const textToSpeak = customText || (lang === 'sw' ? swahiliText : englishText);
    const heading = title || (lang === 'sw' ? 'Msaidizi wa Sauti wa AngaGuard (Kiswahili)' : 'AngaGuard AI Voice Assistant (English)');

    setVoiceTranscript(textToSpeak);
    setVoiceTitle(heading);
    setIsVoiceActive(true);
    setIsVoicePlaying(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop ongoing speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.96;
      utterance.pitch = 1.15; // Natural melodic female pitch
      utterance.lang = 'en-US';

      // Select high-quality American female voice
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

      utterance.onend = () => {
        setIsVoicePlaying(false);
      };
      utterance.onerror = () => {
        setIsVoicePlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // If Web Speech not supported, simulate playing timer
      setTimeout(() => {
        setIsVoicePlaying(false);
      }, 6000);
    }
  };

  const stopVoiceAssistant = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoicePlaying(false);
  };

  // Build Root Menu String
  const getRootMenu = (currentLang = lang) => {
    if (currentLang === 'sw') {
      return `CON Karibu AngaGuard Carbon Oracle (*384*55#)
1. Angalia Salio na Mkaa
2. Hali ya Pipa la Smart Kiln
3. Toa Pesa kwa M-Pesa
4. Uza Mikopo ya Carbon
5. Msaada wa Sauti (Voice IVR)
6. Switch to English`;
    }
    return `CON Welcome to AngaGuard Carbon Oracle (*384*55#)
1. Check Balance & Biochar
2. Smart Kiln Fleet Status
3. Withdraw Funds via M-Pesa
4. Sell Carbon Credits
5. Request Voice Assistance
6. Badilisha hadi Kiswahili`;
  };

  // Reset or initialize session
  const resetSession = () => {
    setSessionText('');
    setInputVal('');
    setIsSessionActive(true);
    setScreenText(getRootMenu());
    playTone(950, 0.08);
  };

  useEffect(() => {
    if (isOpen) {
      resetSession();
    } else {
      stopVoiceAssistant();
    }
  }, [isOpen, lang]);

  if (!isOpen) return null;

  // Process incoming USSD step logic
  const handleUssdSubmit = (submittedInput = inputVal) => {
    const rawVal = submittedInput.trim();
    if (!rawVal && isSessionActive) return;

    playTone(1200, 0.06);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setInputVal('');

      // If session had ended, dialing any key restarts root menu
      if (!isSessionActive) {
        resetSession();
        return;
      }

      // Handle Back Navigation
      if (rawVal === '0' || rawVal === '00') {
        if (sessionText.includes('*')) {
          const parts = sessionText.split('*');
          parts.pop();
          const newSession = parts.join('*');
          setSessionText(newSession);
          evaluateState(newSession);
        } else {
          resetSession();
        }
        return;
      }

      const nextSession = sessionText ? `${sessionText}*${rawVal}` : rawVal;
      setSessionText(nextSession);
      evaluateState(nextSession, rawVal);
    }, 250);
  };

  const evaluateState = (fullPath, lastInput = '') => {
    const parts = fullPath.split('*');
    const top = parts[0];

    // ROOT MENU SELECTION
    if (parts.length === 1) {
      if (top === '1') {
        // 1. Balance & Biochar
        if (lang === 'sw') {
          setScreenText(`CON Uthibitisho wa Mfumo:
Ingiza nenosiri lako la AngaGuard (tarakimu 4) kutazama salio na mkaa:`);
        } else {
          setScreenText(`CON System Verification:
Enter your 4-digit AngaGuard Account Passcode to access records:`);
        }
        return;
      }

      if (top === '2') {
        // 2. Kiln Sub-Menu
        if (lang === 'sw') {
          setScreenText(`CON Pipa Lako: ${farmer.activeKiln} (Kakamega)
1. Angalia Vipimo vya Moja kwa Moja (Live Sensors)
2. Angalia Mapipa Yako Yote (Fleet)
3. Sajili Pipa Jipya (Pair ID)
0. Rudi Nyuma`);
        } else {
          setScreenText(`CON Your Kiln: ${farmer.activeKiln} (Kakamega)
1. View Live Sensor Telemetry
2. View All Assigned Kilns
3. Pair New Smart Kiln ID
0. Back`);
        }
        return;
      }

      if (top === '3') {
        // 3. Multi-Step Withdrawal - Select Amount
        if (farmer.availableKsh <= 0) {
          setIsSessionActive(false);
          setScreenText(lang === 'sw' ? 'END Hauna salio la kutosha kutoa (Salio: KSh 0.00).' : 'END Insufficient balance for withdrawal (Available: KSh 0.00).');
          return;
        }
        if (lang === 'sw') {
          setScreenText(`CON Toa Pesa kwa M-Pesa (Salio: KSh ${farmer.availableKsh.toLocaleString()}):
1. Toa Salio Lote (KSh ${farmer.availableKsh.toLocaleString()})
2. Toa Nusu (KSh ${(farmer.availableKsh / 2).toLocaleString()})
3. Ingiza Kiasi Kingine
0. Rudi Nyuma`);
        } else {
          setScreenText(`CON M-Pesa Cashout (Balance: KSh ${farmer.availableKsh.toLocaleString()}):
1. Withdraw All (KSh ${farmer.availableKsh.toLocaleString()})
2. Withdraw Half (KSh ${(farmer.availableKsh / 2).toLocaleString()})
3. Enter Custom Amount
0. Cancel`);
        }
        return;
      }

      if (top === '4') {
        // 4. Sell Carbon Credits
        if (lang === 'sw') {
          setScreenText(`CON Uza Mikopo ya Carbon (Bei: KSh 17,550/t):
Una ${farmer.creditsTons} tCO2e zilizohakikiwa.
1. Uza 0.50 Tonnes (KSh 8,775)
2. Uza 1.00 Tonnes (KSh 17,550)
3. Uza Mikopo Yote (${farmer.creditsTons} t)
0. Rudi Nyuma`);
        } else {
          setScreenText(`CON Sell Carbon Credits (Rate: KSh 17,550/t):
You have ${farmer.creditsTons} tCO2e verified.
1. Sell 0.50 Tonnes (KSh 8,775)
2. Sell 1.00 Tonnes (KSh 17,550)
3. Sell All (${farmer.creditsTons} t)
0. Cancel`);
        }
        return;
      }

      if (top === '5') {
        // 5. Voice IVR - Trigger Active Voice Playback!
        setIsSessionActive(false);
        setScreenText(lang === 'sw'
          ? `END [Msaada wa Sauti Umeanza]
Simu ya sauti ya Kiswahili inasomwa sasa. Sikiliza maelekezo ya mavuno na malipo kupitia spika ya simu yako.`
          : `END [Voice Assistance Started]
AI Voice IVR audio is now playing. Listen to your verified harvest and payout breakdown.`);
        
        triggerVoiceAssistant();
        return;
      }

      if (top === '6') {
        // 6. Toggle Language
        const newLang = lang === 'sw' ? 'en' : 'sw';
        setLang(newLang);
        setIsSessionActive(false);
        setScreenText(newLang === 'sw'
          ? 'END Lugha imebadilishwa kuwa Kiswahili. Piga *384*55# kuendelea.'
          : 'END Language switched to English. Dial *384*55# to continue.');
        return;
      }

      setIsSessionActive(false);
      setScreenText(lang === 'sw'
        ? 'END Chaguo si sahihi. Piga *384*55# tena.'
        : 'END Invalid option. Dial *384*55# again.');
      return;
    }

    // SUB-MENUS (parts.length >= 2)
    // --- 1. BALANCE & BIOCHAR PASSCODE AUTHENTICATION ---
    if (top === '1') {
      const pin = parts[1]?.trim() || '';
      if (pin.length !== 4 || isNaN(Number(pin))) {
        setIsSessionActive(false);
        setScreenText(lang === 'sw'
          ? 'END Nenosiri si sahihi! Nenosiri lazima liwe na tarakimu 4. Ombi limekataliwa.'
          : 'END Invalid Passcode! Must be exactly 4 digits. Request denied.');
        return;
      }

      setIsSessionActive(false);
      const usdVal = (farmer.availableKsh / 130.0).toFixed(2);
      if (lang === 'sw') {
        setScreenText(`END [AngaGuard dMRV]
Habari ${farmer.name},
• Mkaa Uliovunwa: ${farmer.biocharKg.toLocaleString()} KG
• Mikopo ya Carbon: ${farmer.creditsTons} tCO2e
• Salio Tayari Kutoa: KSh ${farmer.availableKsh.toLocaleString()} ($${usdVal} USD)
• Jumla Zilizotolewa: KSh ${farmer.withdrawnKsh.toLocaleString()}
• Pipa Lililosajiliwa: ${farmer.activeKiln}
Asante kwa kuvuna hewa safi!`);
      } else {
        setScreenText(`END [AngaGuard dMRV]
Hello ${farmer.name},
• Biochar Harvested: ${farmer.biocharKg.toLocaleString()} KG
• Carbon Removed: ${farmer.creditsTons} tCO2e
• Available Balance: KSh ${farmer.availableKsh.toLocaleString()} ($${usdVal} USD)
• Total Withdrawn: KSh ${farmer.withdrawnKsh.toLocaleString()}
• Active Smart Kiln: ${farmer.activeKiln}
Thank you for carbon farming!`);
      }
      return;
    }

    // --- 2. KILN SUB-MENUS ---
    if (top === '2') {
      if (parts[1] === '1') {
        setIsSessionActive(false);
        if (lang === 'sw') {
          setScreenText(`END [${farmer.activeKiln} Live Telemetry]
• Hali: INACHOMA (Active Plateau)
• Joto la Nje: 58.5°C (Ndani: ~571°C)
• Kimo cha Mkaa: 30 cm (Delta: 55 cm)
• Mavuno: 79.8 KG Biochar (0.20 tCO2e)
• Betri: 88% | LoRa: Imara
• Usalama: Silicon ID Imehakikiwa`);
        } else {
          setScreenText(`END [${farmer.activeKiln} Live Telemetry]
• Status: ACTIVE (Pyrolysis Plateau)
• Outer Temp: 58.5°C (Core Est: ~571°C)
• Char Depth: 30 cm (Delta: 55 cm)
• Yield: 79.8 KG Biochar (0.20 tCO2e)
• Battery: 88% | LoRa Signal: Strong
• Security: Silicon ID Sealed`);
        }
        return;
      }
      if (parts[1] === '2') {
        setIsSessionActive(false);
        setScreenText(lang === 'sw'
          ? `END [Mapipa Yako Yaliyosajiliwa]
1. KILN-001 (Kakamega Central - Active)
2. KILN-004 (Lurambi Outgrower - Standby)
Jumla ya mapipa: 2 units.`
          : `END [Your Registered Smart Kilns]
1. KILN-001 (Kakamega Central - Active)
2. KILN-004 (Lurambi Outgrower - Standby)
Total active fleet: 2 units.`);
        return;
      }
      if (parts[1] === '3') {
        if (parts.length === 2) {
          setScreenText(lang === 'sw'
            ? `CON Ingiza nambari ya pipa jipya (Kiln ID):
Mfano: KILN-008 au KILN-015
0. Rudi Nyuma`
            : `CON Enter new Smart Kiln ID to pair:
e.g. KILN-008 or KILN-015
0. Back`);
          return;
        }
        const pairedKiln = parts[2].toUpperCase();
        setIsSessionActive(false);
        setScreenText(lang === 'sw'
          ? `END Pipa ${pairedKiln} limeunganishwa na akaunti yako (${farmer.phone}). Sensor ya IoT inaanza kupima mara moja.`
          : `END Kiln ${pairedKiln} successfully linked to your account (${farmer.phone}). IoT sensors synchronized.`);
        return;
      }
    }

    // --- 3. WITHDRAWAL SUB-MENUS & SYSTEM PASSCODE AUTHENTICATION ---
    if (top === '3') {
      let amountToWithdraw = farmer.availableKsh;
      let pinStepIndex = 2;

      if (parts[1] === '1') {
        amountToWithdraw = farmer.availableKsh;
        pinStepIndex = 2;
      } else if (parts[1] === '2') {
        amountToWithdraw = farmer.availableKsh / 2;
        pinStepIndex = 2;
      } else if (parts[1] === '3') {
        if (parts.length === 2) {
          setScreenText(lang === 'sw'
            ? `CON Ingiza kiasi unachotaka kutoa (KSh):
Mfano: 3000
(Kiwango cha juu: KSh ${farmer.availableKsh.toLocaleString()})`
            : `CON Enter withdrawal amount in KSh:
e.g. 3000
(Max available: KSh ${farmer.availableKsh.toLocaleString()})`);
          return;
        }
        const customAmt = parseFloat(parts[2]);
        if (isNaN(customAmt) || customAmt <= 0 || customAmt > farmer.availableKsh) {
          setIsSessionActive(false);
          setScreenText(lang === 'sw'
            ? `END Kiasi ulichoweka si sahihi au kinazidi salio lako la KSh ${farmer.availableKsh.toLocaleString()}.`
            : `END Invalid amount entered. Must be between 1 and ${farmer.availableKsh.toLocaleString()} KSh.`);
          return;
        }
        amountToWithdraw = customAmt;
        pinStepIndex = 3;
      }

      // STEP: Prompt for AngaGuard Account Passcode
      if (parts.length <= pinStepIndex) {
        if (lang === 'sw') {
          setScreenText(`CON [Uthibitisho wa Kutoa Pesa]
Unatuma KSh ${amountToWithdraw.toLocaleString()} kwa simu yako ya M-Pesa (${farmer.phone}).
Ingiza nenosiri lako la AngaGuard (tarakimu 4):`);
        } else {
          setScreenText(`CON [Disbursal Authorization]
Disbursing KSh ${amountToWithdraw.toLocaleString()} via M-Pesa to ${farmer.phone}.
Enter your 4-digit Account Passcode:`);
        }
        return;
      }

      // STEP: Passcode Validation & Execution
      const enteredPin = parts[pinStepIndex];
      if (enteredPin.length !== 4 || isNaN(Number(enteredPin))) {
        setIsSessionActive(false);
        playTone(300, 0.2, 'sawtooth');
        setScreenText(lang === 'sw'
          ? 'END Nenosiri si sahihi! Lazima liwe na tarakimu 4. Muamala umekataliwa.'
          : 'END Invalid Passcode! Must be exactly 4 digits. Transaction rejected.');
        return;
      }

      // SUCCESS! Settle payout and deliver receipt
      const receiptCode = `QHK${Math.floor(1000000 + Math.random() * 9000000)}`;
      const newBal = farmer.availableKsh - amountToWithdraw;
      setFarmer({
        ...farmer,
        availableKsh: newBal,
        withdrawnKsh: farmer.withdrawnKsh + amountToWithdraw,
      });

      setIsSessionActive(false);
      playTone(1400, 0.15);

      // Trigger realistic SMS notification banner
      const dateStr = new Date().toLocaleDateString('en-GB');
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setSmsNotification({
        code: receiptCode,
        amount: amountToWithdraw,
        balance: newBal,
        time: `${dateStr} at ${timeStr}`
      });

      if (lang === 'sw') {
        setScreenText(`END [Safaricom M-Pesa B2C]
${receiptCode} Imethibitishwa. KSh ${amountToWithdraw.toLocaleString()} zimetumwa kwa ${farmer.name} (${farmer.phone}) mnamo ${dateStr} ${timeStr}.
Salio jipya: KSh ${newBal.toLocaleString()}.
Mkaa: ${farmer.biocharKg.toLocaleString()} KG (${farmer.creditsTons} tCO2e).
Ujumbe wa SMS umetumwa.`);
      } else {
        setScreenText(`END [Safaricom M-Pesa B2C]
${receiptCode} Confirmed. KSh ${amountToWithdraw.toLocaleString()} sent to ${farmer.name} (${farmer.phone}) on ${dateStr} at ${timeStr}.
New Carbon Wallet Balance: KSh ${newBal.toLocaleString()}.
Biochar Reserve: ${farmer.biocharKg.toLocaleString()} KG.
SMS confirmation delivered.`);
      }
      return;
    }

    // --- 4. SELL CREDITS SUB-MENUS ---
    if (top === '4') {
      if (parts.length === 2) {
        setScreenText(lang === 'sw'
          ? `CON [Uthibitisho wa Soko]
Uza mikopo kwa Ushirika wa Kakamega.
Ingiza nenosiri lako la AngaGuard kuthibitisha agizo:`
          : `CON [Marketplace Authorization]
Sell verified credits to Kakamega Coop Pool.
Enter your 4-digit Account Passcode to sign:`);
        return;
      }
      const pin = parts[2];
      if (pin.length !== 4) {
        setIsSessionActive(false);
        setScreenText(lang === 'sw' ? 'END Nenosiri si sahihi. Agizo limesitishwa.' : 'END Invalid Passcode. Trade aborted.');
        return;
      }
      const tradeRef = `CRD${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSessionActive(false);
      setScreenText(lang === 'sw'
        ? `END [Carbonmark Trade Settled]
Ref: ${tradeRef}.
Mikopo ya carbon imeuzwa kwa Umoja wa Ushirika ($135/t).
Malipo ya mgao yataingizwa moja kwa moja kwenye akaunti yako.
Asante kwa kulinda mazingira!`
        : `END [Carbonmark Trade Settled]
Ref: ${tradeRef}.
Carbon credits cleared to Cooperative Pool ($135/t).
Proceeds credited to your AngaGuard M-Pesa wallet.
Thank you for harvesting clean air!`);
      return;
    }
  };

  const handleKeypadPress = (key) => {
    playTone(700 + key.charCodeAt(0) * 5, 0.04);
    setInputVal((prev) => prev + key);
  };

  const handleBackspace = () => {
    playTone(400, 0.04);
    setInputVal((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn font-mono text-xs">
      <div className="relative bg-[#0f172a] light:bg-[#ffffff] border border-[#2d3f58] light:border-[#cbd5e1] max-w-lg w-full p-5 sm:p-6 rounded-3xl space-y-4 shadow-2xl text-stone-100 light:text-slate-900">
        
        {/* Modal Header & Quick Toggles */}
        <div className="flex items-center justify-between border-b border-[#2d3f58] light:border-[#e2e8f0] pb-3">
          <div className="flex items-center space-x-2">
            <Logo size="sm" />
            <span className="text-[11px] font-bold text-orange-400 light:text-orange-700 bg-orange-950/40 light:bg-orange-100 border border-orange-800/40 px-2.5 py-0.5 rounded-full">
              2G USSD & Voice Gateway
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Direct Voice Assistant Play Button */}
            <button
              onClick={() => {
                if (isVoicePlaying) {
                  stopVoiceAssistant();
                } else {
                  triggerVoiceAssistant();
                }
              }}
              className={`px-2.5 py-1 rounded-lg border font-bold flex items-center space-x-1 cursor-pointer transition-all ${
                isVoicePlaying
                  ? 'bg-orange-600 border-orange-400 text-white animate-pulse'
                  : 'bg-[#1e293b] light:bg-slate-100 border-[#2d3f58] light:border-[#cbd5e1] text-orange-400 light:text-orange-700 hover:border-orange-500'
              }`}
              title="Speak / Listen to AI Voice Assistant (Swahili/English)"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="text-[10px]">{isVoicePlaying ? 'Playing Voice...' : 'Voice IVR'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => {
                setLang(lang === 'sw' ? 'en' : 'sw');
                resetSession();
              }}
              className="px-2 py-1 bg-[#1e293b] light:bg-slate-100 border border-[#2d3f58] light:border-[#cbd5e1] rounded-lg text-stone-300 light:text-slate-700 hover:text-white flex items-center space-x-1 cursor-pointer"
              title="Toggle USSD Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold">{lang === 'sw' ? 'SW' : 'EN'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 bg-[#1e293b] light:bg-slate-100 border border-[#2d3f58] light:border-[#cbd5e1] rounded-lg text-stone-300 light:text-slate-700 hover:text-white cursor-pointer"
              title="Toggle Keypad Sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
            </button>

            {/* Backlight Color */}
            <button
              onClick={() => {
                const next = backlight === 'green' ? 'amber' : backlight === 'amber' ? 'cyan' : 'green';
                setBacklight(next);
              }}
              className={`w-4 h-4 rounded-full border border-white/20 cursor-pointer ${
                backlight === 'green' ? 'bg-[#8b9d83]' : backlight === 'amber' ? 'bg-[#c89b3f]' : 'bg-[#6fa8dc]'
              }`}
              title="Change LCD Backlight"
            />

            {/* Close Modal */}
            <button
              onClick={() => {
                stopVoiceAssistant();
                onClose();
              }}
              className="p-1 rounded-lg border border-[#2d3f58] light:border-[#cbd5e1] text-stone-400 hover:text-white light:hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Voice Assistant Active Playback Card */}
        {isVoiceActive && (
          <div className="bg-gradient-to-r from-orange-950/80 to-amber-950/80 light:from-orange-50 light:to-amber-50 border-2 border-orange-500/80 p-3.5 rounded-2xl space-y-2 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center">
                  <Mic className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-orange-400 light:text-orange-900">{voiceTitle}</h4>
                  <p className="text-[10px] text-stone-400 light:text-slate-500">ElevenLabs & Web Speech Synthesis</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (isVoicePlaying) {
                      stopVoiceAssistant();
                    } else {
                      triggerVoiceAssistant(voiceTranscript, voiceTitle);
                    }
                  }}
                  className="p-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white cursor-pointer"
                  title={isVoicePlaying ? 'Pause Voice' : 'Play Voice'}
                >
                  {isVoicePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    stopVoiceAssistant();
                    setIsVoiceActive(false);
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pulsing Audio Waveform Animation */}
            {isVoicePlaying && (
              <div className="flex items-center justify-center space-x-1 py-1">
                {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50, 85, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-orange-400 rounded-full animate-bounce"
                    style={{
                      height: `${h * 0.22}px`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Transcript Preview */}
            <p className="text-[11px] text-stone-300 light:text-slate-800 leading-snug italic bg-black/30 light:bg-white/70 p-2 rounded-xl border border-orange-500/20">
              "{voiceTranscript}"
            </p>
          </div>
        )}

        {/* Real-time Safaricom SMS Toast Popup */}
        {smsNotification && (
          <div className="animate-slideDown bg-emerald-950/90 light:bg-emerald-50 border-2 border-emerald-500 text-emerald-200 light:text-emerald-900 p-3 rounded-2xl space-y-1 shadow-xl">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400 light:text-emerald-700 border-b border-emerald-800 light:border-emerald-200 pb-1">
              <div className="flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
                <span>M-PESA B2C INBOX ALERT (+254712345678)</span>
              </div>
              <button onClick={() => setSmsNotification(null)} className="text-emerald-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] leading-tight font-sans text-stone-100 light:text-slate-900">
              <strong>{smsNotification.code}</strong> Confirmed. You have received <strong>KSh {smsNotification.amount.toLocaleString()}</strong> from <strong>ANGAGUARD DMRV</strong> on {smsNotification.time}. New M-PESA balance is KSh {smsNotification.balance.toLocaleString()}.
            </p>
          </div>
        )}

        {/* 2G Nokia Casing Container */}
        <div className="bg-[#0b1320] light:bg-slate-100 border-4 border-[#2d3f58] light:border-[#cbd5e1] rounded-3xl p-4 sm:p-5 space-y-4 shadow-inner">
          
          {/* LCD Monochromatic Screen */}
          <div
            className={`border-2 rounded-xl p-3.5 min-h-[190px] font-mono text-[11px] leading-tight space-y-2 whitespace-pre-wrap font-bold shadow-inner transition-colors duration-300 ${
              backlight === 'green'
                ? 'bg-[#8b9d83] border-[#5c6e54] text-[#142011]'
                : backlight === 'amber'
                ? 'bg-[#c89b3f] border-[#8a6821] text-[#241702]'
                : 'bg-[#6fa8dc] border-[#3d688f] text-[#071929]'
            }`}
          >
            {/* Status Bar */}
            <div className="flex justify-between border-b border-black/20 pb-1 text-[9px] uppercase tracking-wider font-extrabold">
              <div className="flex items-center space-x-1">
                <span>SAFARICOM 2G</span>
                <span>📶</span>
              </div>
              <div>*384*55#</div>
              <div>🔋 88%</div>
            </div>

            {/* Screen Content */}
            <div className="py-1 min-h-[130px]">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-32 space-y-2">
                  <div className="animate-spin text-xl">⏳</div>
                  <p className="text-[10px] animate-pulse uppercase">
                    {lang === 'sw' ? 'Inatuma ombi Safaricom...' : 'Processing Safaricom USSD...'}
                  </p>
                </div>
              ) : (
                <div>{screenText}</div>
              )}
            </div>

            {/* Active Input Line Indicator */}
            {isSessionActive && !isProcessing && (
              <div className="flex items-center space-x-1 border-t border-black/20 pt-1 text-[10px]">
                <span className="animate-pulse">&gt;</span>
                <span className="font-extrabold">{inputVal}</span>
                <span className="animate-ping">_</span>
              </div>
            )}
          </div>

          {/* Quick Input Bar with physical keyboard typing */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={isSessionActive ? (lang === 'sw' ? 'Andika jibu hapa...' : 'Type option / Passcode...') : (lang === 'sw' ? 'Piga *384*55# tena' : 'Session ended. Click Redial')}
              value={inputVal}
              disabled={!isSessionActive}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUssdSubmit();
              }}
              className="w-full bg-[#131e30] light:bg-white border border-[#2d3f58] light:border-[#cbd5e1] px-3 py-2 rounded-xl text-stone-100 light:text-slate-900 font-bold placeholder-stone-500 focus:outline-none focus:border-orange-500 disabled:opacity-50 text-xs"
            />
            <button
              onClick={() => handleUssdSubmit()}
              disabled={!isSessionActive && !inputVal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          {/* Realistic Nokia Tactile Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { num: '1', sub: '. - @' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: 'SEND' },
              { num: '0', sub: 'BACK' },
              { num: '#', sub: 'HASH' },
            ].map((k) => (
              <button
                key={k.num}
                onClick={() => {
                  if (k.num === '*') {
                    handleUssdSubmit();
                  } else {
                    handleKeypadPress(k.num);
                  }
                }}
                className="bg-[#131e30] light:bg-white hover:bg-[#1c2a3e] light:hover:bg-slate-50 active:bg-orange-600 active:text-white border border-[#2d3f58] light:border-[#cbd5e1] py-2 px-1 rounded-xl text-center transition-all cursor-pointer shadow-sm group"
              >
                <div className="font-black text-sm text-stone-200 light:text-slate-900 group-active:text-white">{k.num}</div>
                <div className="text-[8px] text-stone-500 font-bold group-active:text-white/80">{k.sub}</div>
              </button>
            ))}
          </div>

          {/* Action Control Buttons: Redial & Clear */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleBackspace}
              className="py-2 px-3 bg-[#131e30] light:bg-white hover:bg-[#1c2a3e] light:hover:bg-slate-50 border border-[#2d3f58] light:border-[#cbd5e1] text-stone-400 light:text-slate-600 hover:text-white text-[10px] font-bold rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>⌫ Clear Char</span>
            </button>

            <button
              onClick={resetSession}
              className="py-2 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-[10px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span>Redial *384*55#</span>
            </button>
          </div>

        </div>

        {/* Security & Regulatory Footnote */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 light:text-slate-500 border-t border-[#2d3f58] light:border-[#e2e8f0] pt-2 px-1">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Safaricom Daraja B2C Encrypted</span>
          </span>
          <span>Kenya NCR EMCA 2026</span>
        </div>

      </div>
    </div>
  );
};

export default UssdPhoneModal;

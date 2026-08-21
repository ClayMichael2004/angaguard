import React, { useState, useEffect, useRef } from 'react';
import { X, Usb, CheckCircle2, AlertTriangle, Terminal, Zap, RefreshCw, Radio } from 'lucide-react';

export const HardwareBridgeModal = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState('Disconnected');
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [forwardedCount, setForwardedCount] = useState(0);
  const [backendUrl, setBackendUrl] = useState('/api/telemetry');
  const [isSupported, setIsSupported] = useState(true);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const keepReadingRef = useRef(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (!('serial' in navigator)) {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  if (!isOpen) return null;

  const addLog = (msg, type = 'info') => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setTerminalLogs((prev) => [...prev.slice(-100), { time, msg, type }]);
  };

  const handleToggleConnect = async () => {
    if (isConnected) {
      keepReadingRef.current = false;
      if (readerRef.current) {
        try { await readerRef.current.cancel(); } catch (e) {}
      }
      if (portRef.current) {
        try { await portRef.current.close(); } catch (e) {}
      }
      portRef.current = null;
      setIsConnected(false);
      setStatusText('Disconnected');
      addLog('USB Serial Port closed.', 'warn');
      return;
    }

    if (!('serial' in navigator)) {
      alert('Web Serial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      addLog('Requesting WaziDev USB Port via Browser...', 'info');
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      setIsConnected(true);
      setStatusText('Connected & Streaming (9600 baud)');
      addLog('Successfully opened WaziDev COM Port at 9600 baud!', 'success');

      keepReadingRef.current = true;
      startReading(port);
    } catch (err) {
      addLog(Failed to connect: , 'error');
      setIsConnected(false);
      setStatusText('Connection Failed');
    }
  };

  const startReading = async (port) => {
    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    readerRef.current = reader;

    let buffer = '';

    try {
      while (keepReadingRef.current) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          let lines = buffer.split('\n');
          buffer = lines.pop();

          for (let rawLine of lines) {
            let line = rawLine.trim();
            if (!line) continue;

            if (line.startsWith('{') && line.endsWith('}')) {
              try {
                const payload = JSON.parse(line);
                addLog([WaziDev Packet] Temp: °C | InitH: cm | FinalH: cm, 'success');
                await forwardPayload(payload);
              } catch (e) {
                addLog([Serial Line] , 'info');
              }
            } else {
              addLog([Arduino] , 'info');
            }
          }
        }
      }
    } catch (err) {
      addLog(Stream reading stopped: , 'warn');
    } finally {
      reader.releaseLock();
    }
  };

  const forwardPayload = async (payload) => {
    try {
      addLog(Piping telemetry packet to ..., 'info');
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setForwardedCount((prev) => prev + 1);
        addLog([Cloud 200 OK] Biochar: kg | CORC:  | Payout: KSh , 'success');
      } else {
        addLog([Cloud  Error] , 'error');
      }
    } catch (e) {
      addLog(Network dispatch failed: , 'error');
    }
  };

  const handleTestPacket = async () => {
    const synthetic = {
      device_uid: 'MCU-WAZIDEV-77A9',
      kiln_id: 'KILN-001',
      coop_id: 'COOP-KAKAMEGA-01',
      farmer_phone: '+254712345678',
      initial_height_cm: 85.0,
      final_height_cm: 30.0,
      peak_outer_temp_c: 58.5,
      duration_minutes: 45.0,
      heating_rate: 4.2,
      latitude: 0.2827,
      longitude: 34.7519,
      cell_tower_id: 'SAF-TOWER-KKM-04',
      timestamp: Math.floor(Date.now() / 1000)
    };
    addLog('[Synthetic Test] Generating sample WaziDev telemetry...', 'warn');
    await forwardPayload(synthetic);
  };

  return (
    <div className=fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm>
      <div className=relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-slate-100>
        
        {/* Header */}
        <div className=flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950>
          <div className=flex items-center space-x-2.5>
            <div className=p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400>
              <Usb className=w-4 h-4 />
            </div>
            <div>
              <h2 className=text-sm font-bold text-slate-100>WaziDev Live Hardware Bridge</h2>
              <p className=text-[11px] text-slate-400>Direct In-Browser Web Serial to Render Cloud Relay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className=p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer
          >
            <X className=w-4 h-4 />
          </button>
        </div>

        {/* Body Content */}
        <div className=p-5 space-y-4>
          {!isSupported && (
            <div className=p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start space-x-2.5>
              <AlertTriangle className=w-4 h-4 text-rose-400 shrink-0 mt-0.5 />
              <div>
                <strong className=block font-bold text-xs>Web Serial Not Supported</strong>
                <span>Please open this page in Google Chrome or Microsoft Edge to connect to the WaziDev USB port.</span>
              </div>
            </div>
          )}

          {/* Status & Control Row */}
          <div className=flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800>
            <div className=flex items-center space-x-2>
              <span className={w-2.5 h-2.5 rounded-full } />
              <span className=text-slate-300 font-bold>Status:</span>
              <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{statusText}</span>
            </div>

            <div className=text-slate-400>
              Forwarded: <strong className=text-emerald-400 font-bold>{forwardedCount}</strong> packets
            </div>
          </div>

          {/* Endpoint Selector */}
          <div>
            <label className=block text-[11px] text-slate-400 mb-1 font-bold>Target Backend API Endpoint:</label>
            <input
              type=text
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className=w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-300 focus:outline-none focus:border-emerald-500
              placeholder=/api/telemetry
            />
          </div>

          {/* Action Buttons */}
          <div className=flex flex-wrap gap-2.5>
            <button
              onClick={handleToggleConnect}
              disabled={!isSupported}
              className={lex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-bold transition-all shadow-md cursor-pointer }
            >
              <Usb className=w-4 h-4 />
              <span>{isConnected ? 'Disconnect USB' : '🔌 Connect WaziDev USB'}</span>
            </button>

            <button
              onClick={handleTestPacket}
              className=flex items-center space-x-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold cursor-pointer transition-colors
            >
              <Zap className=w-3.5 h-3.5 text-amber-400 />
              <span>Test Packet</span>
            </button>

            <button
              onClick={() => setTerminalLogs([])}
              className=py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 cursor-pointer transition-colors
            >
              Clear
            </button>
          </div>

          {/* Terminal Console */}
          <div className=bg-black/90 rounded-xl border border-slate-800 p-3 h-48 overflow-y-auto font-mono text-[11px] leading-relaxed>
            {terminalLogs.length === 0 ? (
              <div className=text-slate-500 italic text-center py-16>
                No active serial stream. Plug in WaziDev and click  Connect WaziDev USB.
              </div>
            ) : (
              terminalLogs.map((item, idx) => (
                <div
                  key={idx}
                  className={mb-1 }
                >
                  <span className=text-slate-500 mr-2>[{item.time}]</span>
                  {item.msg}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Footer */}
        <div className=px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400>
          <span>Supported: Google Chrome / Edge</span>
          <button
            onClick={onClose}
            className=text-slate-300 hover:text-white transition-colors cursor-pointer
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HardwareBridgeModal;

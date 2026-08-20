import React, { useState } from 'react';
import { Activity, ShieldAlert, ShieldCheck, Play, AlertOctagon, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { TelemetryPacket, MintResult } from '../types';
import { api } from '../services/api';

export const TelemetryFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'matrix'>('simulation');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastVerdict, setLastVerdict] = useState<{
    status: 'SUCCESS' | 'REJECTED';
    title: string;
    message: string;
    asset?: MintResult;
  } | null>(null);

  const [simLogs, setSimLogs] = useState<Array<{
    id: string;
    timestamp: string;
    type: string;
    status: 'PASS' | 'FAIL';
    details: string;
  }>>([
    {
      id: 'LOG-001',
      timestamp: '2026-08-20T10:14:00Z',
      type: 'Legitimate TLUD Pyrolysis',
      status: 'PASS',
      details: 'Physics validated: 79.8kg biochar, 0.2021 tCO2e minted (AG-CORC-7f8a9c)',
    },
    {
      id: 'LOG-002',
      timestamp: '2026-08-20T09:45:00Z',
      type: 'Ash Cheating Attack',
      status: 'FAIL',
      details: 'Rejected: Volumetric retention 0.094 < 0.25 (Open air combustion detected)',
    },
  ]);

  const runSimulation = async (scenario: string) => {
    setIsProcessing(true);
    setLastVerdict(null);

    let packet: TelemetryPacket;

    if (scenario === 'valid') {
      packet = {
        device_uid: 'MCU-WAZIDEV-77A9',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 30.0, // 30 / 85 = 0.3529 (valid 30-40% range)
        peak_outer_temp_c: 58.5, // 58.5 C (valid 40-75 C range)
        duration_minutes: 45.0, // 45 min (> 30 min)
        heating_rate: 4.2, // 4.2 C/min (valid 1.2 - 15 C/min)
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04',
      };
    } else if (scenario === 'ash_cheating') {
      packet = {
        device_uid: 'MCU-WAZIDEV-77A9',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 8.0, // 8 / 85 = 0.094 (< 0.25 threshold!)
        peak_outer_temp_c: 55.0,
        duration_minutes: 40.0,
        heating_rate: 3.8,
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04',
      };
    } else if (scenario === 'sand_padding') {
      packet = {
        device_uid: 'MCU-WAZIDEV-77A9',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 30.0,
        peak_outer_temp_c: 52.0,
        duration_minutes: 45.0,
        heating_rate: 0.35, // Abnormally slow heating rate (< 1.2 C/min)!
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04',
      };
    } else if (scenario === 'core_fusion') {
      packet = {
        device_uid: 'MCU-WAZIDEV-77A9',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 30.0,
        peak_outer_temp_c: 92.0, // Runaway outer skin (> 75 C)!
        duration_minutes: 45.0,
        heating_rate: 4.5,
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04',
      };
    } else {
      // Stolen hardware (Nairobi coordinates)
      packet = {
        device_uid: 'MCU-WAZIDEV-77A9',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 30.0,
        peak_outer_temp_c: 58.0,
        duration_minutes: 45.0,
        heating_rate: 3.5,
        latitude: -1.2921, // Nairobi (~300km away!)
        longitude: 36.8219,
        cell_tower_id: 'SAF-TOWER-NRB-09',
      };
    }

    try {
      const res = await api.submitTelemetry(packet);
      if (res.status === 'MINTED_AND_SETTLED' && res.asset) {
        setLastVerdict({
          status: 'SUCCESS',
          title: 'Validated & Sealed into Blockchain Ledger',
          message: `Minted ${res.asset.asset_id} • ${res.asset.net_metric_tons_co2e.toFixed(4)} tCO2e • KSh ${res.asset.farmer_payout_ksh.toFixed(2)} M-Pesa Dispatched`,
          asset: res.asset,
        });

        setSimLogs(prev => [
          {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toISOString(),
            type: scenario.toUpperCase(),
            status: 'PASS',
            details: `Validated: ${res.asset?.biochar_yield_kg.toFixed(1)}kg char, ${res.asset?.net_metric_tons_co2e.toFixed(4)} tCO2e (Ref: ${res.asset?.kenya_ncr_tracking_id})`,
          },
          ...prev,
        ]);
      } else {
        setLastVerdict({
          status: 'REJECTED',
          title: 'Adversarial Anomaly Detected & Blocked',
          message: res.error || 'Telemetry violated dMRV physical or spatial constraints.',
        });

        setSimLogs(prev => [
          {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toISOString(),
            type: scenario.toUpperCase(),
            status: 'FAIL',
            details: `Rejected: ${res.error}`,
          },
          ...prev,
        ]);
      }
    } catch {
      setLastVerdict({
        status: scenario === 'valid' ? 'SUCCESS' : 'REJECTED',
        title: scenario === 'valid' ? 'Validated & Minted Locally' : 'Loophole Attack Rejected Locally',
        message: scenario === 'valid'
          ? 'Physical biochar stoichiometry confirmed (0.2021 tCO2e).'
          : 'Detected fraud signature matching Loophole Defense Matrix.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">dMRV Fraud Sandbox & Defense Matrix</h1>
            <span className="bg-amber-950 border border-amber-800 text-amber-300 text-xs font-mono px-2.5 py-1 rounded-lg">
              Hardware Security Engine
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Test and verify all 7 adversarial attack vectors against AngaGuard's physics & cryptographic defenses.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'simulation' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'matrix' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Defense Matrix
          </button>
        </div>
      </div>

      {activeTab === 'simulation' ? (
        <div className="space-y-6">
          {/* Action Attack Trigger Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={() => runSimulation('valid')}
              disabled={isProcessing}
              className="p-4 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/80 rounded-2xl text-left transition-all group cursor-pointer shadow-lg shadow-emerald-950/30"
            >
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-900 rounded">Legit</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-emerald-300">Genuine Pyrolysis</p>
              <p className="text-xs text-slate-400 mt-1">Proper 30-40% volume, stable 58.5°C curve.</p>
            </button>

            <button
              onClick={() => runSimulation('ash_cheating')}
              disabled={isProcessing}
              className="p-4 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 rounded-2xl text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <AlertOctagon className="w-5 h-5 group-hover:text-red-400" />
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-800 text-amber-300 rounded">Attack 1</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-red-300">Ash Cheating</p>
              <p className="text-xs text-slate-400 mt-1">Unsealed vents &gt;90% ash collapse.</p>
            </button>

            <button
              onClick={() => runSimulation('sand_padding')}
              disabled={isProcessing}
              className="p-4 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 rounded-2xl text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <AlertOctagon className="w-5 h-5 group-hover:text-red-400" />
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-800 text-amber-300 rounded">Attack 2</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-red-300">Sand Padding</p>
              <p className="text-xs text-slate-400 mt-1">Rocks/sand causing sluggish ramp.</p>
            </button>

            <button
              onClick={() => runSimulation('core_fusion')}
              disabled={isProcessing}
              className="p-4 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 rounded-2xl text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <AlertOctagon className="w-5 h-5 group-hover:text-red-400" />
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-800 text-amber-300 rounded">Attack 3</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-red-300">Thermal Overheating</p>
              <p className="text-xs text-slate-400 mt-1">Runaway outer skin &gt;75°C.</p>
            </button>

            <button
              onClick={() => runSimulation('stolen_hardware')}
              disabled={isProcessing}
              className="p-4 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 rounded-2xl text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <AlertOctagon className="w-5 h-5 group-hover:text-red-400" />
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-800 text-amber-300 rounded">Attack 4</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-red-300">Stolen Hardware</p>
              <p className="text-xs text-slate-400 mt-1">Origin outside authorized geofence.</p>
            </button>
          </div>

          {/* Verdict Banner */}
          {lastVerdict && (
            <div className={`p-6 rounded-2xl border flex items-start space-x-4 animate-fadeIn ${
              lastVerdict.status === 'SUCCESS'
                ? 'bg-emerald-950/90 border-emerald-700/90 text-emerald-300'
                : 'bg-red-950/90 border-red-800 text-red-200'
            }`}>
              {lastVerdict.status === 'SUCCESS' ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0" />
              )}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{lastVerdict.title}</h3>
                <p className="text-xs font-mono">{lastVerdict.message}</p>
              </div>
            </div>
          )}

          {/* Real-time Audit Verdict Feed */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Oracle Validation Log</span>
            </h2>

            <div className="space-y-3">
              {simLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${log.status === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-white font-bold">{log.type}</p>
                      <p className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()} • {log.details}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                    log.status === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {log.status === 'PASS' ? 'MINTED' : 'BLOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Defense Matrix Table View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="p-4">Vulnerability / Attack Vector</th>
                  <th className="p-4">System Failure Mode</th>
                  <th className="p-4">Technical Engineering Defense Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-4 font-bold text-white">Chamber Core Fusion (&gt;450°C)</td>
                  <td className="p-4 text-slate-400">High-heat pyrolysis melts internal microcontrollers and analog wiring.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Air-Gapped Standoff & Outer Skin Conduction:</strong> Sensors elevated in IP67 casing 15 cm above lid. Thermistor reads external metal conductive curves (40°C - 75°C), mapping to core via Steinhart-Hart Go model.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">&quot;Ash Cheating&quot; (False Volume)</td>
                  <td className="p-4 text-slate-400">Farmers burn residue with unsealed vents, generating mineral ash instead of biochar.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Dual-Metric Curve Validation:</strong> True biochar maintains 30%-40% structural volume over &gt;30min heat curve. Open-air ash collapses &gt;90%, instantly triggering dMRV rejection.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">The Sand-Padding Attack</td>
                  <td className="p-4 text-slate-400">Adversarial users add dense river rocks or sand to fake ultrasonic depth reading.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Thermal Mass Coherence Check:</strong> Inert rocks act as thermal heat sinks. If heating rate ($\Delta T/\Delta t$) fails required thermal ramp, the Go engine locks the batch.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Acoustic Noise Scatter</td>
                  <td className="p-4 text-slate-400">Rising thermal gas waves and acoustic smoke turbulence distort ultrasonic echo pulses during active burns.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Two-Point Static Calibration:</strong> The system ignores active turbulent burn readings. Captures static pre-ignition baseline ($t_0$) and cooled post-burn height ($t_{'{final}'}$) with 5-point median filter.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">The Multi-Drum Sensor Swap</td>
                  <td className="p-4 text-slate-400">User unclips a single IoT node to cycle onto multiple unmonitored fires.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Cryptographic Hardware Identity Binding:</strong> Firmware injects factory-burned silicon MCU Unique ID. Tied 1-to-1 with registered farm coordinates in SQLite ledger.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">The Stolen Hardware Burn</td>
                  <td className="p-4 text-slate-400">Users remove kit to a commercial gas burner to simulate perfect telemetry curve away from farm.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Spatial-Temporal Fencing:</strong> LoRaWAN gateway layer maps packet arrivals to localized cellular tower triangulation zone. Telemetry arriving outside boundary is dropped.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Offline Rural Connectivity</td>
                  <td className="p-4 text-slate-400">Remote farmlands lack cellular data coverage, preventing real-time cloud data pipeline parsing.</td>
                  <td className="p-4 text-emerald-300">
                    <strong>Edge Caching & Hybrid 2G Telephony Engine:</strong> WaziDev flash buffers up to 50 raw logs locally. Field managers sync offline serial USB transfers, while farmers use zero-data 2G USSD (*384*55#).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

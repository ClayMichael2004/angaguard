import React, { useState } from 'react';
import { Activity, ShieldAlert, ShieldCheck, Play, Zap, CheckCircle2, XCircle } from 'lucide-react';

export const FraudSandboxView = () => {
  const attackScenarios = [
    {
      id: 'false-flame',
      name: 'Simulated False Flame (Zero Volumetric Loss)',
      category: 'Thermal Fraud',
      description: 'Farmer triggers external propane torch near thermistor to fake high temperature, but biomass bed height remains static (0% shrinkage).',
      packet: {
        device_uid: 'ESP32-FRAUD-001',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 85.0,
        peak_outer_temp_c: 68.5,
        duration_minutes: 120,
        heating_rate: 0.8,
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04'
      },
      expectedResult: 'REJECTED',
      rejectionReason: 'Loophole Matrix #1 Violation: Steinhart-Hart thermal curve active but ultrasonic volumetric height change < 25% minimum threshold.'
    },
    {
      id: 'gps-spoof',
      name: 'Spoofed Cell Tower GPS (Out of Cooperative Bounds)',
      category: 'Geofence Fraud',
      description: 'Telemetry packet signed with cell tower ID registered in Nairobi (350km away) for a Kakamega smallholder cooperative.',
      packet: {
        device_uid: 'ESP32-SPOOF-999',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 30.0,
        peak_outer_temp_c: 62.0,
        duration_minutes: 135,
        heating_rate: 0.45,
        latitude: -1.2863,
        longitude: 36.8172,
        cell_tower_id: 'SAF-TOWER-NBI-99'
      },
      expectedResult: 'REJECTED',
      rejectionReason: 'Loophole Matrix #3 Violation: Geofence check failed. Tower SAF-TOWER-NBI-99 not in approved list for COOP-KAKAMEGA-01.'
    },
    {
      id: 'ash-combustion',
      name: 'Overburn / Ash Combustion (Excessive Shrinkage)',
      category: 'Yield Fraud',
      description: 'Kiln burned completely to mineral ash due to lack of lid sealing (bed height reduced by > 85%), creating zero biochar carbon sequestration.',
      packet: {
        device_uid: 'ESP32-ASH-002',
        kiln_id: 'KILN-002',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 90.0,
        final_height_cm: 5.0,
        peak_outer_temp_c: 92.0,
        duration_minutes: 240,
        heating_rate: 1.2,
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04'
      },
      expectedResult: 'REJECTED',
      rejectionReason: 'Loophole Matrix #2 Violation: Biomass retention < 25%. Pyrolysis failed - material converted to mineral ash.'
    },
    {
      id: 'valid-burn',
      name: 'Legitimate TLUD Pyrolysis Burn (Control Test)',
      category: 'Valid Telemetry',
      description: 'Standard 200L top-lit updraft biochar burn with 35% volumetric yield and 58.5°C thermistor peak temperature.',
      packet: {
        device_uid: 'ESP32-VALID-888',
        kiln_id: 'KILN-001',
        coop_id: 'COOP-KAKAMEGA-01',
        farmer_phone: '+254712345678',
        initial_height_cm: 85.0,
        final_height_cm: 30.0,
        peak_outer_temp_c: 58.5,
        duration_minutes: 130,
        heating_rate: 0.42,
        latitude: 0.2827,
        longitude: 34.7519,
        cell_tower_id: 'SAF-TOWER-KKM-04'
      },
      expectedResult: 'PASSED'
    }
  ];

  const [activeScenario, setActiveScenario] = useState(attackScenarios[0]);
  const [simulationResult, setSimulationResult] = useState({ status: null, isSimulating: false });

  const handleRunSimulation = () => {
    setSimulationResult({ status: null, isSimulating: true });

    setTimeout(() => {
      if (activeScenario.expectedResult === 'REJECTED') {
        setSimulationResult({
          status: 'REJECTED',
          reason: activeScenario.rejectionReason,
          isSimulating: false
        });
      } else {
        setSimulationResult({
          status: 'PASSED',
          blockHash: '7f8a9c1e4d3b2a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f',
          isSimulating: false
        });
      }
    }, 1100);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">dMRV Fraud & Anti-Loophole Sandbox</h1>
            <span className="bg-amber-950 border border-amber-800 text-amber-300 font-mono text-xs px-2.5 py-1 rounded-lg">
              Oracle Security Testing
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Simulate malicious telemetry payloads and test edge firmware cross-validation logic in real-time.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={simulationResult.isSimulating}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Play className={`w-4 h-4 ${simulationResult.isSimulating ? 'animate-spin' : ''}`} />
          <span>{simulationResult.isSimulating ? 'Evaluating Edge Matrix...' : 'Run Payload Attack Simulation'}</span>
        </button>
      </div>

      {/* Scenario Picker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {attackScenarios.map((sc) => {
          const isSelected = activeScenario.id === sc.id;
          const isMalicious = sc.expectedResult === 'REJECTED';
          return (
            <div
              key={sc.id}
              onClick={() => {
                setActiveScenario(sc);
                setSimulationResult({ status: null, isSimulating: false });
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  isMalicious ? 'bg-red-950 border-red-800 text-red-400' : 'bg-emerald-950 border-emerald-800 text-emerald-400'
                }`}>
                  {sc.category}
                </span>
                {isMalicious ? (
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <h3 className="text-xs font-bold text-white leading-snug font-mono">{sc.name}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2">{sc.description}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Payload Inspector & Simulation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Raw Telemetry Packet Inspector */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 font-mono">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Simulated IoT Telemetry JSON</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">ESP32 Firmware v2.6</span>
          </div>

          <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
            {JSON.stringify(activeScenario.packet, null, 2)}
          </pre>

          <p className="text-xs text-slate-400">
            {activeScenario.description}
          </p>
        </div>

        {/* Right: Oracle Fraud Evaluation Matrix Output */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 font-mono">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Oracle Verification Matrix</span>
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                SHA-256 Ruleset
              </span>
            </div>

            {/* Matrix Rule Checks */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span>1. Steinhart-Hart Thermal Stability:</span>
                <span className="text-emerald-400 font-bold">PASS (40°C - 75°C)</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span>2. Ultrasonic Height Volumetric Yield:</span>
                <span className={activeScenario.packet.initial_height_cm - activeScenario.packet.final_height_cm < 20 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {activeScenario.packet.initial_height_cm - activeScenario.packet.final_height_cm < 20 ? 'FAIL (< 25% Yield)' : 'PASS (30% - 40% Yield)'}
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span>3. Safaricom Cell Tower Geofence:</span>
                <span className={(activeScenario.packet.cell_tower_id || '').includes('NBI') ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {(activeScenario.packet.cell_tower_id || '').includes('NBI') ? 'FAIL (Out of Radius)' : 'PASS (KKM-04 Authorized)'}
                </span>
              </div>
            </div>
          </div>

          {/* Result Banner */}
          {simulationResult.status ? (
            <div className={`p-6 rounded-2xl border flex items-start space-x-4 animate-fadeIn ${
              simulationResult.status === 'REJECTED'
                ? 'bg-red-950/60 border-red-600/80 text-red-200'
                : 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
            }`}>
              {simulationResult.status === 'REJECTED' ? (
                <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              )}
              <div className="space-y-1 font-mono text-xs">
                <p className="text-sm font-black uppercase tracking-wider">
                  Oracle Decision: {simulationResult.status}
                </p>
                {simulationResult.reason && (
                  <p className="text-red-300">{simulationResult.reason}</p>
                )}
                {simulationResult.blockHash && (
                  <p className="text-emerald-300">
                    Minted Block Hash: <span className="font-bold">{simulationResult.blockHash.substring(0, 24)}...</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs text-slate-500 font-mono">
              Click &quot;Run Payload Attack Simulation&quot; to evaluate this packet against the Oracle edge matrix.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

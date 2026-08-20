import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SmeDashboard } from './components/SmeDashboard';
import { KilnDigitalTwin3D } from './components/KilnDigitalTwin3D';
import { FarmerPwaView } from './components/FarmerPwaView';
import { BlockchainAuditExplorer } from './components/BlockchainAuditExplorer';
import { TelemetryFeed } from './components/TelemetryFeed';
import { UssdSimulatorModal } from './components/UssdSimulatorModal';
import { IssbReportModal } from './components/IssbReportModal';
import { ESGScorecard, OracleStats } from './types';
import { api } from './services/api';
import { ShieldCheck, Globe, DollarSign, Users, Award, Bell } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('sme');
  const [isUssdOpen, setIsUssdOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [selectedScorecard, setSelectedScorecard] = useState<ESGScorecard | null>(null);
  const [stats, setStats] = useState<OracleStats>({
    total_blocks_minted: 4,
    total_net_co2e_tons: 113.9,
    total_biochar_kg: 54450.0,
    total_market_value_usd: 15376.5,
    total_farmer_payout_ksh: 740150.0,
    active_smart_kilns: 18,
    registered_farmers: 450,
    active_cooperatives: 3,
    verified_ncr_registry: 'Republic of Kenya National Carbon Registry (EMCA 2026)',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    setupWebSocket();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {
      // Handled
    }
  };

  const setupWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'BLOCK_MINTED') {
            setToastMessage(`🌿 New Block Minted: ${data.payload.asset.asset_id} • +${data.payload.asset.net_metric_tons_co2e.toFixed(4)} tCO2e`);
            loadStats();
            setTimeout(() => setToastMessage(null), 5000);
          } else if (data.type === 'ANOMALY_REJECTED') {
            setToastMessage(`⚠️ Adversarial Anomaly Blocked: ${data.payload.reason}`);
            setTimeout(() => setToastMessage(null), 6000);
          }
        } catch {
          // Ignore parse errors
        }
      };
    } catch {
      // Ignore ws connection errors if running offline
    }
  };

  const handleExportReport = (scorecard: ESGScorecard) => {
    setSelectedScorecard(scorecard);
    setIsReportOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUssd={() => setIsUssdOpen(true)}
        blockCount={stats.total_blocks_minted}
      />

      {/* Real-time Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fadeIn text-xs font-mono">
          <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sme' && (
          <SmeDashboard
            onExportReport={handleExportReport}
            onNavigateToTwin={() => setActiveTab('twin')}
          />
        )}
        {activeTab === 'twin' && <KilnDigitalTwin3D />}
        {activeTab === 'farmer' && <FarmerPwaView />}
        {activeTab === 'ledger' && <BlockchainAuditExplorer />}
        {activeTab === 'sandbox' && <TelemetryFeed />}
      </main>

      {/* Global Macro Carbon & Economic Liquidity Bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono text-slate-400">
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Total Carbon Sunk</span>
                <strong className="text-white text-sm">{stats.total_net_co2e_tons.toFixed(1)} Metric Tons</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Carbonmark Liquidity</span>
                <strong className="text-white text-sm">${stats.total_market_value_usd.toLocaleString()} USD</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">M-Pesa Disbursed</span>
                <strong className="text-emerald-400 text-sm">KSh {stats.total_farmer_payout_ksh.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Sovereign Registry</span>
                <strong className="text-sky-300 text-sm">Kenya NCR Verified</strong>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
            <span>AngaGuard dMRV Oracle © 2026 • Western Kenya & Rift Valley Ecosystem</span>
            <span>B2B2C Hybrid Model • Safaricom Daraja B2C Rails • ISSB IFRS S2</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UssdSimulatorModal isOpen={isUssdOpen} onClose={() => setIsUssdOpen(false)} />
      <IssbReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        scorecard={selectedScorecard}
      />

    </div>
  );
};

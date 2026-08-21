import React, { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { CooperativeDashboard } from './components/CooperativeDashboard';
import { SmeDashboard } from './components/SmeDashboard';
import { UssdPhoneModal } from './components/UssdPhoneModal';
import { HardwareBridgeModal } from './components/HardwareBridgeModal';

export const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [returnOptionView, setReturnOptionView] = useState('home'); // Opens Landing Page ('home') first on initial load
  const [theme, setTheme] = useState('dark');
  const [isUssdOpen, setIsUssdOpen] = useState(false);
  const [isHardwareBridgeOpen, setIsHardwareBridgeOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Sync theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Login from Landing Page
  const handleUserLogin = (userObject, originOptionView = 'login-select') => {
    setCurrentUser(userObject);
    setReturnOptionView(originOptionView);
    setActiveSection('overview');
  };

  // Handle Back Button on Navbar Dashboard -> Takes user back to User Options Selection Page
  const handleDashboardBack = () => {
    setCurrentUser(null);
  };

  // If user is on Landing Page / User Options Selection Page
  if (!currentUser) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b1320] text-stone-100' : 'bg-[#f4f6f8] text-[#0f172a]'}`}>
        <LandingPage
          initialView={returnOptionView}
          onLogin={handleUserLogin}
          onOpenUssd={() => setIsUssdOpen(true)}
          onOpenHardwareBridge={() => setIsHardwareBridgeOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />
        <UssdPhoneModal isOpen={isUssdOpen} onClose={() => setIsUssdOpen(false)} />
        <HardwareBridgeModal isOpen={isHardwareBridgeOpen} onClose={() => setIsHardwareBridgeOpen(false)} />
      </div>
    );
  }

  const getSectionTitle = () => {
    if (activeSection === 'overview') return 'Overview & Analytics';
    if (activeSection === 'cashout') return 'M-Pesa Disbursals';
    if (activeSection === 'kiln' || activeSection === 'kilns') return 'Smart Kilns Fleet';
    if (activeSection === 'market') return 'Carbon Spot Index';
    if (activeSection === 'records' || activeSection === 'transactions') return 'Audit Trail & Records';
    if (activeSection === 'members' || activeSection === 'outgrowers') return 'Smallholder Directory';
    if (activeSection === 'sell') return 'Marketplace Settlement';
    if (activeSection === 'smes') return 'Corporate Offtakers';
    if (activeSection === 'ledger') return 'SHA-256 Ledger';
    if (activeSection === 'reports') return 'ISSB / CSRD Audit';
    return 'Dashboard';
  };

  // Full-Length SaaS Layout with Left Sidebar and Main Content
  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b1320] text-stone-100' : 'bg-[#f4f6f8] text-[#0f172a]'}`}>
      
      {/* Persistent / Responsive Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={currentUser}
        onLogout={handleDashboardBack}
        onOpenUssd={() => setIsUssdOpen(true)}
        onOpenVoiceAssistant={() => setIsUssdOpen(true)}
        onOpenHardwareBridge={() => setIsHardwareBridgeOpen(true)}
        theme={theme}
        setTheme={setTheme}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Full-Length Portal View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          user={currentUser}
          onLogout={handleDashboardBack}
          onOpenUssd={() => setIsUssdOpen(true)}
          onOpenVoiceAssistant={() => setIsUssdOpen(true)}
          onOpenHardwareBridge={() => setIsHardwareBridgeOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          theme={theme}
          setTheme={setTheme}
          activeSectionTitle={getSectionTitle()}
        />

        {/* Dynamic Persona Dashboard Content */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {currentUser.role === 'farmer' && (
            <FarmerDashboard
              theme={theme}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              defaultFarmerType={currentUser.farmerType || 'bio-sme'}
            />
          )}

          {currentUser.role === 'cooperative' && (
            <CooperativeDashboard
              theme={theme}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}

          {currentUser.role === 'sme' && (
            <SmeDashboard
              theme={theme}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}
        </main>
      </div>

      {/* 2G USSD Phone Simulator Modal */}
      <UssdPhoneModal isOpen={isUssdOpen} onClose={() => setIsUssdOpen(false)} />

      {/* Live WaziDev Web Serial Hardware Bridge Modal */}
      <HardwareBridgeModal isOpen={isHardwareBridgeOpen} onClose={() => setIsHardwareBridgeOpen(false)} />

    </div>
  );
};

export default App;

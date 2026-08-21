import React, { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { CooperativeDashboard } from './components/CooperativeDashboard';
import { SmeDashboard } from './components/SmeDashboard';
import { UssdPhoneModal } from './components/UssdPhoneModal';

export const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [returnOptionView, setReturnOptionView] = useState('home'); // Opens Landing Page ('home') first on initial load
  const [theme, setTheme] = useState('dark');
  const [isUssdOpen, setIsUssdOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Handle Login from Landing Page & preserve origin option view ('login-select' or 'register-select')
  const handleUserLogin = (userObject, originOptionView = 'login-select') => {
    setCurrentUser(userObject);
    setReturnOptionView(originOptionView);
  };

  // Handle Back Button on Navbar Dashboard -> Takes user back to the exact User Options Selection Page
  const handleDashboardBack = () => {
    setCurrentUser(null);
  };

  // If user is on Landing Page / User Options Selection Page
  if (!currentUser) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b1320] text-stone-100' : 'bg-[#f1f5f9] text-[#0f172a]'}`}>
        <LandingPage
          initialView={returnOptionView}
          onLogin={handleUserLogin}
          onOpenUssd={() => setIsUssdOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />
        <UssdPhoneModal isOpen={isUssdOpen} onClose={() => setIsUssdOpen(false)} />
      </div>
    );
  }

  // If user is logged into their dedicated minimalist persona dashboard
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b1320] text-stone-100' : 'bg-[#f1f5f9] text-[#0f172a]'}`}>
      
      {/* Navbar Header with Hamburger & Back Button */}
      <Navbar
        user={currentUser}
        onLogout={handleDashboardBack}
        onOpenUssd={() => setIsUssdOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Collapsible Earthy Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={currentUser}
        onLogout={handleDashboardBack}
        onOpenUssd={() => setIsUssdOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* 2G USSD Phone Simulator Modal */}
      <UssdPhoneModal isOpen={isUssdOpen} onClose={() => setIsUssdOpen(false)} />

      {/* Active Persona Minimalist Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'farmer' && (
          <FarmerDashboard theme={theme} defaultFarmerType={currentUser.farmerType || 'bio-sme'} />
        )}

        {currentUser.role === 'cooperative' && (
          <CooperativeDashboard theme={theme} />
        )}

        {currentUser.role === 'sme' && (
          <SmeDashboard theme={theme} />
        )}
      </main>

    </div>
  );
};

export default App;

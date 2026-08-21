import React, { useState } from 'react';
import { Smartphone, Users, Building2, ArrowRight, ShieldCheck, PhoneCall, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export const LandingPage = ({ onLogin, onOpenUssd, theme, setTheme, initialView = 'home' }) => {
  const [historyStack, setHistoryStack] = useState(() => {
    return initialView && initialView !== 'home' ? ['home', initialView] : ['home'];
  });

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  const currentView = historyStack[historyStack.length - 1] || 'home';

  const pushView = (nextView) => {
    setHistoryStack([...historyStack, nextView]);
  };

  const popView = () => {
    if (historyStack.length > 1) {
      setHistoryStack(historyStack.slice(0, historyStack.length - 1));
    }
  };

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [entityName, setEntityName] = useState('');

  const entities = [
    {
      id: 'farmer',
      title: 'Smallholder Farmers',
      description: 'Monitored biochar pyrolysis smart kilns, real-time M-Pesa earnings, credit exchange rates & past sales logs.',
      icon: Smartphone,
      color: 'text-orange-500',
      demoUser: {
        role: 'farmer',
        farmerType: 'bio-sme',
        name: 'Wanjala Wafula',
        phone: '+254712345678',
        affiliation: 'Bio SME Outgrower / Coop Member'
      }
    },
    {
      id: 'cooperative',
      title: 'Agricultural Cooperatives',
      description: 'Aggregated smallholder farmer credit pools, 3D kiln fleet inspection & wholesale sales to Non-Bio SMEs.',
      icon: Users,
      color: 'text-emerald-500',
      demoUser: {
        role: 'cooperative',
        name: 'Kakamega Sugarcane Coop Union',
        phone: '+254700112233',
        affiliation: 'Western Kenya Aggregation Network'
      }
    },
    {
      id: 'sme',
      title: 'SMEs (Bio & Non-Bio)',
      description: 'Direct outgrower supply chain insetting (Bio SMEs) or marketplace credit offsets & ESG passes (Non-Bio SMEs).',
      icon: Building2,
      color: 'text-amber-500',
      demoUser: {
        role: 'sme',
        smeType: 'bio-sme',
        name: 'Kizito Grain Millers Ltd',
        phone: '+254788990011',
        affiliation: 'Eldoret Agribusiness Zone'
      }
    }
  ];

  const handleSelectEntity = (entity, mode) => {
    setSelectedEntity(entity);
    setAuthMode(mode);
    setIdentifier(entity.demoUser.phone);
    setPassword('••••••••');
    setEntityName(entity.demoUser.name);
    pushView('auth-form');
  };

  const handleExecuteAuth = (e) => {
    e.preventDefault();
    if (selectedEntity) {
      const originOptionView = historyStack.includes('register-select') ? 'register-select' : 'login-select';
      onLogin(
        {
          ...selectedEntity.demoUser,
          name: entityName || selectedEntity.demoUser.name,
        },
        originOptionView
      );
    }
  };

  return (
    <div className="min-h-screen font-mono text-xs animate-fadeIn flex flex-col justify-between bg-slate-50 dark:bg-[#0b1320] text-slate-900 dark:text-stone-100">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-[#2d3f58]/50 bg-white/95 dark:bg-[#0b1320]/90 backdrop-blur-md px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            {historyStack.length > 1 && (
              <button
                onClick={popView}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#2d3f58] bg-slate-100 dark:bg-[#131e30] text-slate-800 dark:text-stone-200 font-bold hover:text-orange-600 transition-all cursor-pointer shadow-sm"
                title="Go Back to Previous Page"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span>Back</span>
              </button>
            )}

            <div className="cursor-pointer" onClick={() => setHistoryStack(['home'])}>
              <Logo size="md" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => pushView('login-select')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentView === 'login-select'
                  ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                  : 'border-slate-300 dark:border-[#2d3f58] text-slate-700 dark:text-stone-200 hover:text-orange-600'
              }`}
            >
              Log In
            </button>

            <button
              onClick={() => pushView('register-select')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentView === 'register-select'
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                  : 'border-slate-300 dark:border-[#2d3f58] text-slate-700 dark:text-stone-200 hover:text-emerald-600'
              }`}
            >
              Register
            </button>

            <ThemeToggle theme={theme} setTheme={setTheme} />

            <button
              onClick={onOpenUssd}
              className="flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2G USSD</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 my-auto w-full">
        
        {/* VIEW 1: HOME LANDING OVERVIEW */}
        {currentView === 'home' && (
          <div className="space-y-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-600/40 px-3.5 py-1 rounded-full text-orange-700 dark:text-orange-400 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Decentralized dMRV Oracle Protocol • Republic of Kenya NCR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-stone-100 font-sans leading-tight">
              Durable Biochar Carbon Removal for SMEs & Smallholders
            </h1>

            <p className="text-slate-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-sans font-medium">
              AngaGuard connects smallholder farmers pyrolizing crop waste with smart barrel kilns to agricultural cooperatives and SMEs needing verifiable Scope 1, 2, and 3 carbon offset compliance.
            </p>

            {/* Clean Environment Landscape Hero Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-[#2d3f58] shadow-xl my-6 group">
              <img
                src="/assets/clean_environment_hero.jpg"
                alt="Clean Environment Landscape Kenya"
                className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320]/90 via-[#0b1320]/30 to-transparent flex items-end p-6">
                <div className="text-left space-y-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    Clean Air & Sustainable Land Restoration
                  </span>
                  <p className="text-white font-bold text-sm sm:text-base font-sans">
                    Empowering 10,000+ Kenyan Smallholders with Verifiable Biochar Carbon Offsets
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => pushView('login-select')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
              >
                <LogIn className="w-5 h-5" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => pushView('register-select')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: LOGIN USER OPTIONS PAGE */}
        {currentView === 'login-select' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-stone-100 font-sans">User Login Options</h2>
                <p className="text-slate-600 dark:text-stone-300 text-xs mt-1 font-bold">Select your user option to access your dashboard</p>
              </div>
              <button
                onClick={() => pushView('home')}
                className="flex items-center space-x-1 text-slate-700 dark:text-stone-300 font-bold hover:text-orange-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span>Home Overview</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {entities.map((e) => {
                const Icon = e.icon;
                return (
                  <div
                    key={e.id}
                    onClick={() => handleSelectEntity(e, 'login')}
                    className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 space-y-4 rounded-2xl shadow-sm cursor-pointer hover:border-orange-500 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${e.color}`} />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-stone-100 font-sans group-hover:text-orange-600 transition-colors">
                        {e.title} Login
                      </h3>
                      <p className="text-slate-600 dark:text-stone-300 text-[11px] leading-relaxed font-medium">
                        {e.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-[#2d3f58]/40 flex items-center justify-between text-orange-600 dark:text-orange-400 font-bold">
                      <span>Select {e.title} &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: REGISTER USER OPTIONS PAGE */}
        {currentView === 'register-select' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2d3f58]/40 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-stone-100 font-sans">User Registration Options</h2>
                <p className="text-slate-600 dark:text-stone-300 text-xs mt-1 font-bold">Create a new registered account under one of the 3 user categories</p>
              </div>
              <button
                onClick={() => pushView('home')}
                className="flex items-center space-x-1 text-slate-700 dark:text-stone-300 font-bold hover:text-emerald-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-500" />
                <span>Home Overview</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {entities.map((e) => {
                const Icon = e.icon;
                return (
                  <div
                    key={e.id}
                    onClick={() => handleSelectEntity(e, 'register')}
                    className="bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 space-y-4 rounded-2xl shadow-sm cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#131e30] border border-slate-200 dark:border-[#2d3f58] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${e.color}`} />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-stone-100 font-sans group-hover:text-emerald-600 transition-colors">
                        Register as {e.title}
                      </h3>
                      <p className="text-slate-600 dark:text-stone-300 text-[11px] leading-relaxed font-medium">
                        {e.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-[#2d3f58]/40 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                      <span>Select {e.title} &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: AUTHENTICATION FORM */}
        {currentView === 'auth-form' && selectedEntity && (
          <div className="max-w-md mx-auto bg-white dark:bg-[#1c2a3e] border border-slate-200 dark:border-[#2d3f58] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-stone-100 font-sans">
                {authMode === 'login' ? `${selectedEntity.title} Login` : `Register ${selectedEntity.title}`}
              </h2>
              <p className="text-slate-600 dark:text-stone-400 text-xs">
                {authMode === 'login' ? 'Enter credentials to open your portal' : 'Enroll your smart kiln or ESG account'}
              </p>
            </div>

            <form onSubmit={handleExecuteAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-stone-300 block mb-1">
                    {selectedEntity.id === 'farmer' ? 'Full Name:' : selectedEntity.id === 'cooperative' ? 'Cooperative Union Name:' : 'Company Legal Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] p-3 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-stone-300 block mb-1">
                  {selectedEntity.id === 'farmer' ? 'M-Pesa Phone Number:' : 'Official Phone / KRA Tax PIN:'}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] p-3 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-stone-300 block mb-1">
                  Account Password / Passcode:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#131e30] border border-slate-300 dark:border-[#2d3f58] p-3 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                    authMode === 'login' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-emerald-700 hover:bg-emerald-600'
                  }`}
                >
                  <span>{authMode === 'login' ? 'Sign In to Portal' : 'Complete Registration'} &rarr;</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-[#2d3f58]/40 bg-white dark:bg-[#0b1320] px-4 py-4 text-center text-[10px] text-slate-500 dark:text-stone-400">
        <p>Republic of Kenya National Carbon Registry (EMCA 2026 / NEMA) • ISO 14064-2:2019 • Puro.earth Standard</p>
      </footer>

    </div>
  );
};

export default LandingPage;

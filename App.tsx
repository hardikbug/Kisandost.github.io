
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Scan from './pages/Scan';
import Guides from './pages/Guides';
import Advisory from './pages/Advisory';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showAdvisory, setShowAdvisory] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <Splash progress={65} />;

  const renderContent = () => {
    if (showAdvisory) return <Advisory onBack={() => setShowAdvisory(false)} />;
    
    switch (activeTab) {
      case AppTab.HOME:
        return <Home onNavigate={setActiveTab} onOpenChat={() => setShowAdvisory(true)} />;
      case AppTab.MARKETS:
        return <Markets />;
      case AppTab.SCAN:
        return <Scan onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.GUIDES:
        return <Guides onBack={() => setActiveTab(AppTab.HOME)} />;
      default:
        return <Home onNavigate={setActiveTab} onOpenChat={() => setShowAdvisory(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {renderContent()}
      
      {/* Bottom Navigation */}
      {!showAdvisory && activeTab !== AppTab.SCAN && (
        <nav className="fixed bottom-6 left-4 right-4 bg-slate-900/95 backdrop-blur-md dark:bg-white/95 border border-white/10 dark:border-slate-200 rounded-full h-16 px-2 flex items-center justify-between shadow-2xl z-50">
          <button 
            onClick={() => setActiveTab(AppTab.HOME)}
            className={`flex flex-col items-center justify-center w-1/5 ${activeTab === AppTab.HOME ? 'text-primary' : 'text-white dark:text-slate-500'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === AppTab.HOME ? 'fill-1' : ''}`}>home</span>
            <span className="text-[10px] font-bold mt-0.5">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.MARKETS)}
            className={`flex flex-col items-center justify-center w-1/5 ${activeTab === AppTab.MARKETS ? 'text-primary' : 'text-white dark:text-slate-500'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === AppTab.MARKETS ? 'fill-1' : ''}`}>monitoring</span>
            <span className="text-[10px] font-bold mt-0.5">Markets</span>
          </button>
          
          <div className="relative w-1/5 flex justify-center">
            <button 
              onClick={() => setActiveTab(AppTab.SCAN)}
              className="absolute -top-12 bg-primary rounded-full size-14 flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-lg shadow-primary/40 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-slate-900 text-3xl font-bold">qr_code_scanner</span>
            </button>
            <span className="text-[10px] font-bold mt-8 text-white dark:text-slate-500 uppercase tracking-tighter">Scan</span>
          </div>

          <button 
            onClick={() => setActiveTab(AppTab.GUIDES)}
            className={`flex flex-col items-center justify-center w-1/5 ${activeTab === AppTab.GUIDES ? 'text-primary' : 'text-white dark:text-slate-500'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === AppTab.GUIDES ? 'fill-1' : ''}`}>menu_book</span>
            <span className="text-[10px] font-bold mt-0.5">Guides</span>
          </button>
          <button className="flex flex-col items-center justify-center w-1/5 text-white dark:text-slate-500">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;

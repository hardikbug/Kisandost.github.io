
import React from 'react';
import { AppTab } from '../types';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
  onOpenChat: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenChat }) => {
  return (
    <div className="flex flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light/80 backdrop-blur-md z-10">
        <div className="flex size-12 shrink-0 items-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" style={{ backgroundImage: 'url("https://picsum.photos/seed/farmer/100/100")' }}></div>
        </div>
        <div className="flex-1 px-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Welcome back,</p>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Ramesh Kumar</h2>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-sm">language</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">English</span>
          </div>
          <button className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-slate-800 shadow-sm">
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">notifications</span>
          </button>
        </div>
      </header>

      <div className="p-4">
        <div className="relative overflow-hidden flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          <div className="w-full bg-center bg-no-repeat aspect-[16/7] bg-cover" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url("https://picsum.photos/seed/scan/800/350")' }}>
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <span className="bg-primary text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-2">Anti-Fraud Protection</span>
              <h3 className="text-white text-2xl font-bold leading-tight">Verify Your Supplies</h3>
              <p className="text-white/80 text-sm mt-1">Instant AI check for seeds & gear</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <p className="text-slate-900 dark:text-white font-bold">SafeScan AI</p>
              <p className="text-slate-500 text-xs">Verify authentic manufacturers</p>
            </div>
            <button 
              onClick={() => onNavigate(AppTab.SCAN)}
              className="flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-primary text-slate-900 font-bold shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">qr_code_scanner</span>
              <span>Scan Now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">grid_view</span>
          Agricultural Toolkit
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => onNavigate(AppTab.MARKETS)} className="cursor-pointer flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm active:scale-95 transition-transform">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-slate-900 dark:text-white text-base font-bold">Price Tracker</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Live Mandi Rates</p>
              <p className="text-primary text-[10px] font-semibold mt-1">Wheat: ₹2,125/q</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm opacity-60">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-slate-900 dark:text-white text-base font-bold">Certifications</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Verified Badges</p>
              <p className="text-blue-500 text-[10px] font-semibold mt-1">3 Active Shields</p>
            </div>
          </div>
          <div onClick={() => onNavigate(AppTab.GUIDES)} className="cursor-pointer flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm active:scale-95 transition-transform">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-slate-900 dark:text-white text-base font-bold">AI Guides</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Expert Advice</p>
              <p className="text-orange-500 text-[10px] font-semibold mt-1">Rice Sowing Tips</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm opacity-60">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-slate-900 dark:text-white text-base font-bold">Reviews</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Community Feedback</p>
              <p className="text-purple-500 text-[10px] font-semibold mt-1">New Vendor Ratings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">cloudy_snowing</span>
          Local Forecast
        </h3>
        <div className="rounded-xl p-5 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm font-medium">Sirsa, Haryana</p>
              <h4 className="text-4xl font-bold mt-1">32°C</h4>
              <p className="text-white/90 text-sm mt-1">Partly Cloudy • Humidity 45%</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl opacity-90">wb_twilight</span>
              <div className="mt-2 bg-white/20 rounded-full px-3 py-1 text-[10px] font-bold">Next: Rain in 4h</div>
            </div>
          </div>
          <div className="mt-6 flex justify-between border-t border-white/20 pt-4">
            {['Today', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
              <div key={day} className="text-center">
                <p className="text-[10px] opacity-70 uppercase font-bold">{day}</p>
                <span className="material-symbols-outlined block my-1">
                  {idx === 1 ? 'rainy' : idx === 2 ? 'cloud' : 'sunny'}
                </span>
                <p className="text-xs font-bold">{34 - idx * 2}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="bg-slate-900 dark:bg-primary rounded-xl p-4 flex items-center justify-between border-l-4 border-primary">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 dark:bg-black/10 p-2 rounded-full">
              <span className="material-symbols-outlined text-primary dark:text-slate-900">smart_toy</span>
            </div>
            <div>
              <p className="text-white dark:text-slate-900 font-bold text-sm">Ask AI Advisor</p>
              <p className="text-slate-400 dark:text-slate-800 text-xs">Available 24/7 for you</p>
            </div>
          </div>
          <button 
            onClick={onOpenChat}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-primary rounded-full px-4 py-1.5 text-xs font-bold active:scale-95 transition-transform"
          >
            Chat Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

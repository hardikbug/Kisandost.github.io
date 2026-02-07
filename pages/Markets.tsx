
import React, { useState, useEffect } from 'react';
import { MandiPrice } from '../types';
import { getSmartSaleAdvisory } from '../geminiService';

const Markets: React.FC = () => {
  const [advisory, setAdvisory] = useState<string>('Analyzing market trends for your crops...');
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(true);

  const prices: MandiPrice[] = [
    { crop: 'Basmati Rice', price: 3450, unit: 'Quintal', trend: 'up', change: 120, emoji: '🌾', verified: true },
    { crop: 'Hybrid Tomato', price: 1200, unit: 'Quintal', trend: 'down', change: 45, emoji: '🍅' },
    { crop: 'Red Onion', price: 2800, unit: 'Quintal', trend: 'up', change: 80, emoji: '🧅', anomaly: true },
    { crop: 'Wheat (Sharbati)', price: 2100, unit: 'Quintal', trend: 'stable', change: 0, emoji: '🌾', verified: true },
  ];

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        const advice = await getSmartSaleAdvisory('Basmati Rice', 3450);
        setAdvisory(advice || '');
      } catch (e) {
        setAdvisory("Basmati Rice prices are likely to reach ₹3,600 by Friday. We suggest waiting 3 more days.");
      } finally {
        setIsLoadingAdvisory(false);
      }
    };
    fetchAdvisory();
  }, []);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
          <h1 className="text-xl font-bold tracking-tight">Price Tracker</h1>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"><span className="material-symbols-outlined">notifications</span></button>
          <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </nav>

      <main className="p-4 space-y-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input className="w-full bg-white dark:bg-slate-900 border-none rounded-full py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400" placeholder="Search crops (e.g. Wheat, Rice)" />
        </div>

        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Market</p>
            <h2 className="text-lg font-bold flex items-center gap-1">
              Azadpur Market, Delhi
              <span className="material-symbols-outlined text-primary text-sm fill-1">verified</span>
            </h2>
          </div>
          <button className="text-primary text-sm font-semibold flex items-center gap-1">Change <span className="material-symbols-outlined text-sm">location_on</span></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <span className="material-symbols-outlined text-xl">trending_up</span>
              <span className="text-xs font-bold uppercase">Trend</span>
            </div>
            <p className="text-2xl font-bold">Bullish</p>
            <p className="text-xs text-green-600 font-medium">+5.2% Today</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <span className="material-symbols-outlined text-xl">psychology</span>
              <span className="text-xs font-bold uppercase">AI Advice</span>
            </div>
            <p className="text-lg font-bold leading-tight">Hold Stock</p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">Prices expected to rise</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Daily Price List</h3>
            <span className="text-xs text-slate-400">Last updated: 10m ago</span>
          </div>
          {prices.map((p, idx) => (
            <div key={idx} className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${p.anomaly ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">{p.emoji}</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{p.crop}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {p.verified && (
                      <><span className="material-symbols-outlined text-primary text-xs fill-1">verified_user</span><p className="text-[10px] font-bold text-primary uppercase">Safe Buyer Verified</p></>
                    )}
                    {p.anomaly && (
                      <><span className="material-symbols-outlined text-red-600 text-xs fill-1">gpp_maybe</span><p className="text-[10px] font-bold text-red-600 uppercase">Price Anomaly</p></>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{p.price.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">per {p.unit}</p>
                <div className={`flex items-center justify-end font-bold text-xs gap-0.5 mt-1 ${p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                  <span className="material-symbols-outlined text-sm">{p.trend === 'up' ? 'trending_up' : p.trend === 'down' ? 'trending_down' : 'remove'}</span>
                  ₹{p.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-lg mb-8">
          <div className="relative z-10 flex gap-4 items-start">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-slate-900 fill-1">auto_awesome</span>
            </div>
            <div>
              <h5 className="text-lg font-bold">Smart Sale Advisory</h5>
              <p className="text-sm text-slate-400 mt-1">{isLoadingAdvisory ? 'Analyzing...' : advisory}</p>
              <button className="mt-4 text-primary font-bold text-sm flex items-center gap-1">
                View Prediction Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        </section>
      </main>
    </div>
  );
};

export default Markets;

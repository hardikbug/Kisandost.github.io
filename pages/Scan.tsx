
import React, { useState, useRef } from 'react';
import { VerificationResult } from '../types';
import { verifyProduct, generateVoiceExplanation, playPCM } from '../geminiService';

interface ScanProps {
  onBack: () => void;
}

const Scan: React.FC<ScanProps> = ({ onBack }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await verifyProduct(base64);
        setResult({
          ...res,
          verificationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } catch (err) {
        setError("Could not verify product. Please try again with a clearer image.");
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const playVoiceExplanation = async () => {
    if (!result || isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const text = result.status === 'success' 
        ? `This is a genuine ${result.productName} by ${result.brand}. It expires in ${result.expiryDate}. It is safe to use.`
        : `Warning! This product could not be verified. It might be counterfeit or expired. Do not use it.`;
      
      const audioData = await generateVoiceExplanation(text);
      if (audioData) {
        await playPCM(audioData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  if (result) {
    if (result.status === 'success') {
      return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen animate-in slide-in-from-right duration-300">
          <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
            <button onClick={() => setResult(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold tracking-tight">Verification Success</h2>
            <div className="w-10"></div>
          </header>
          <main className="p-4 flex flex-col items-center pb-32">
            <div className="relative py-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
              <div className="relative w-48 h-48 bg-primary rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-white dark:border-zinc-900">
                <span className="material-symbols-outlined text-white text-7xl mb-1 fill-1">verified</span>
                <h1 className="text-white text-3xl font-black tracking-tighter uppercase">Original</h1>
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-8 text-center">Product is Safe to Use</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-center flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm fill-1">auto_awesome</span> Verified by AI
            </p>

            <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 my-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                  <img src="https://picsum.photos/seed/product/200" className="w-full h-full object-cover" alt="Product" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{result.productName}</h3>
                  <p className="text-primary text-sm font-semibold mt-1">Brand: {result.brand}</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Batch Number', val: result.batchNumber, icon: 'barcode' },
                  { label: 'Expiry Date', val: result.expiryDate, icon: 'event_busy' },
                  { label: 'Verification Time', val: `TODAY, ${result.verificationTime}`, icon: 'verified_user' }
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center py-3 ${i < 2 ? 'border-b border-zinc-50 dark:border-zinc-800' : ''}`}>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-sm">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={playVoiceExplanation}
              disabled={isPlayingAudio}
              className={`w-full bg-primary/10 dark:bg-primary/5 rounded-xl p-4 border border-primary/20 flex items-center gap-4 transition-all ${isPlayingAudio ? 'ring-2 ring-primary opacity-80' : 'hover:bg-primary/20'}`}
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                <span className="material-symbols-outlined text-3xl">{isPlayingAudio ? 'graphic_eq' : 'volume_up'}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">Tap for Voice Explanation</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Listen to our expert explain this product</p>
              </div>
            </button>
          </main>
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark border-t border-zinc-200 dark:border-zinc-800 z-20">
            <button onClick={onBack} className="w-full bg-primary text-black font-bold h-14 rounded-full text-lg shadow-xl flex items-center justify-center gap-2">
              OK, Continue <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-red-50 dark:bg-zinc-950 min-h-screen animate-in slide-in-from-right duration-300 pb-32">
           <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
            <button onClick={() => setResult(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold">Security Alert</h2>
            <div className="w-10"></div>
          </header>
          <main className="p-6 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="bg-red-600 size-48 rounded-full flex items-center justify-center shadow-2xl border-8 border-white dark:border-zinc-900">
                <span className="text-white text-5xl font-black tracking-tighter">FAKE</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg border-2 border-red-600">
                <span className="material-symbols-outlined text-red-600 fill-1">warning</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-red-600 mb-2">Fraud Detected!</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-8">Verification Failed</p>

            <button 
              onClick={playVoiceExplanation}
              disabled={isPlayingAudio}
              className="mb-8 flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 px-6 py-3 rounded-full font-bold active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">{isPlayingAudio ? 'graphic_eq' : 'volume_up'}</span>
              Listen to Alert
            </button>
            
            <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-red-200 dark:border-red-900/30 mb-8 flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img src="https://picsum.photos/seed/fake/200" className="w-full h-full object-cover" alt="Fake Product" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Scanned Product</p>
                <h3 className="font-bold text-lg leading-tight">{result.productName || 'Unknown Item'}</h3>
                <p className="text-sm text-red-600 font-medium">Serial: {result.serial || '#ERR-XXXX'}</p>
              </div>
            </div>

            <div className="w-full mb-8">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">info</span> What does this mean?
              </h2>
              <div className="bg-red-600/5 dark:bg-red-600/10 border-l-4 border-red-600 p-4 rounded-r-xl">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  This product's data does not match official records. It is likely a <span className="font-bold text-red-600">counterfeit or expired</span> product.
                </p>
              </div>
            </div>
          </main>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-zinc-900/90 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-3 z-20">
            <button className="w-full bg-red-600 text-white py-4 rounded-full font-bold text-lg shadow-lg">Report to Authorities</button>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-full font-semibold text-gray-600">Scan Another Product</button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="bg-background-dark min-h-screen relative flex flex-col animate-in fade-in duration-300">
      <div className="p-4 flex justify-between items-center text-white">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
        <h2 className="text-lg font-bold">Supply Scanner</h2>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative w-full aspect-square max-w-sm rounded-3xl border-2 border-white/20 overflow-hidden bg-slate-800">
          <div className="absolute inset-0 flex items-center justify-center">
            {scanning ? (
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-bold animate-pulse tracking-widest">ANALYZING...</p>
              </div>
            ) : (
              <span className="material-symbols-outlined text-white/20 text-9xl">photo_camera</span>
            )}
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_20px_#13ec13] animate-bounce"></div>
        </div>
        
        <p className="text-white/60 text-center mt-8 text-sm max-w-xs">
          Point the camera at the product QR code or batch label to verify authenticity instantly.
        </p>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="mt-12 bg-primary text-slate-900 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-2xl active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">upload</span>
          Scan from Gallery
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      </div>

      {error && (
        <div className="mx-4 mb-8 bg-red-600 text-white p-4 rounded-xl text-center font-bold animate-bounce">
          {error}
        </div>
      )}
    </div>
  );
};

export default Scan;


import React, { useState, useRef, useEffect } from 'react';
import { Guide } from '../types';
import { generateVoiceExplanation, decodeBase64, decodeAudioData } from '../geminiService';

interface GuidesProps {
  onBack: () => void;
}

type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

const Guides: React.FC<GuidesProps> = ({ onBack }) => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const guides: Guide[] = [
    { 
      id: '1', 
      title: 'Soil Preparation', 
      description: 'Secrets of fertile soil. Learn how to balance nitrogen and phosphorus effectively.',
      imageUrl: 'https://picsum.photos/seed/soil/600/400',
      content: 'Fertile soil is the foundation of a successful harvest. To begin, you must test your soil pH levels. Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0). Balancing nitrogen, phosphorus, and potassium is key. Add organic compost to improve soil structure and moisture retention. Avoid over-tilling, which can destroy the natural microbial life necessary for healthy root systems.'
    },
    { 
      id: '2', 
      title: 'Pest Control', 
      description: 'Protect your crops from disease. Use organic neem oil sprays and crop rotation.',
      imageUrl: 'https://picsum.photos/seed/pest/600/400',
      content: 'Natural pest control is safer for the environment and your family. Use neem oil as a broad-spectrum organic pesticide. Crop rotation prevents pests from settling into your soil permanently. For example, if you grow potatoes one year, plant legumes the next to fix nitrogen and break the pest cycle. Companion planting, such as marigolds near tomatoes, can also deter harmful insects naturally.'
    },
    { 
      id: '3', 
      title: 'Sowing Techniques', 
      description: 'Modern methods of seed sowing. Depth and spacing are critical for maximum yield.',
      imageUrl: 'https://picsum.photos/seed/seeds/600/400',
      content: 'Proper sowing depth is usually twice the width of the seed. Spacing ensures each plant has enough nutrients and sunlight without competition. Use the dibbling method for larger seeds or line sowing for smaller ones. Ensure the soil is moist but not waterlogged before sowing. For high-yield farming, consider using a seed drill for precision placement and uniform emergence across the field.'
    },
    { 
      id: '4', 
      title: 'Irrigation Systems', 
      description: 'Water conservation and smart usage. Drip irrigation can save up to 40% water.',
      imageUrl: 'https://picsum.photos/seed/water/600/400',
      content: 'Drip irrigation is the gold standard for water conservation in modern agriculture. It delivers water directly to the plant roots, reducing evaporation and weed growth. For large-scale fields, pivot irrigation provides uniform coverage. Always irrigate in the early morning or late evening to minimize water loss. Monitoring soil moisture with simple sensors can tell you exactly when to turn on the water, preventing both stress and rot.'
    },
  ];

  // Cleanup audio on unmount or guide change
  useEffect(() => {
    return () => stopAudio();
  }, [selectedGuide]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setPlaybackStatus('idle');
    audioBufferRef.current = null;
    pausedAtRef.current = 0;
    startTimeRef.current = 0;
  };

  const initAudio = async (text: string) => {
    setPlaybackStatus('loading');
    try {
      const base64 = await generateVoiceExplanation(text);
      if (!base64) throw new Error("No audio data");
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      
      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioData(bytes, ctx, 24000, 1);
      audioBufferRef.current = buffer;
      
      startPlayback(0);
    } catch (err) {
      console.error("Audio init error:", err);
      setPlaybackStatus('idle');
    }
  };

  const startPlayback = (offset: number) => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      // Only set ended if we didn't stop it manually for a pause
      if (playbackStatus === 'playing') {
        setPlaybackStatus('ended');
      }
    };

    startTimeRef.current = audioContextRef.current.currentTime - offset;
    source.start(0, offset);
    sourceNodeRef.current = source;
    setPlaybackStatus('playing');
  };

  const handleTogglePlay = async () => {
    if (playbackStatus === 'idle' || playbackStatus === 'ended') {
      if (selectedGuide) {
        stopAudio();
        await initAudio(`${selectedGuide.title}. ${selectedGuide.content}`);
      }
    } else if (playbackStatus === 'playing') {
      // Pause
      if (sourceNodeRef.current && audioContextRef.current) {
        pausedAtRef.current = audioContextRef.current.currentTime - startTimeRef.current;
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
        setPlaybackStatus('paused');
      }
    } else if (playbackStatus === 'paused') {
      // Resume
      startPlayback(pausedAtRef.current);
    }
  };

  const handleRestart = () => {
    if (audioBufferRef.current) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      startPlayback(0);
    } else {
      handleTogglePlay();
    }
  };

  if (selectedGuide) {
    return (
      <div className="flex flex-col bg-white dark:bg-background-dark min-h-screen animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center p-4 justify-between">
            <button onClick={() => setSelectedGuide(null)} className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
            
            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRestart}
                disabled={playbackStatus === 'idle' || playbackStatus === 'loading'}
                className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 disabled:opacity-30"
                title="Restart"
              >
                <span className="material-symbols-outlined">replay</span>
              </button>
              
              <button 
                onClick={handleTogglePlay}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-md ${playbackStatus === 'loading' ? 'bg-primary/50 animate-pulse' : 'bg-primary text-slate-900 active:scale-95'}`}
              >
                <span className="material-symbols-outlined text-xl">
                  {playbackStatus === 'playing' ? 'pause' : playbackStatus === 'loading' ? 'hourglass_top' : 'play_arrow'}
                </span>
                <span className="min-w-[4rem]">
                  {playbackStatus === 'playing' ? 'Pause' : playbackStatus === 'paused' ? 'Resume' : playbackStatus === 'loading' ? 'Loading' : 'Listen'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-12">
          <div className="w-full aspect-[16/10] bg-center bg-cover" style={{ backgroundImage: `url("${selectedGuide.imageUrl}")` }}></div>
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">{selectedGuide.title}</h1>
            <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-base fill-1">verified</span>
              Expert Verified Guide
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-medium mb-6">
                {selectedGuide.description}
              </p>
              <div className="h-px w-full bg-slate-100 dark:bg-zinc-800 mb-6"></div>
              <p className="text-base text-slate-600 dark:text-zinc-400 leading-loose">
                {selectedGuide.content}
              </p>
            </div>
            
            <div className="mt-12 p-6 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <h3 className="font-bold text-lg mb-2">Need more help?</h3>
              <p className="text-sm text-slate-500 mb-4">Chat with our AI Advisor for specific questions about your farm.</p>
              <button 
                onClick={onBack}
                className="w-full py-3 bg-slate-900 dark:bg-primary text-white dark:text-slate-900 rounded-full font-bold shadow-lg"
              >
                Ask AI Advisor
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in duration-300 pb-24">
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <button onClick={onBack} className="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight flex-1 text-center">Farming Guides</h2>
          <div className="flex size-10 items-center justify-center"><span className="material-symbols-outlined">more_vert</span></div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex w-full h-14 items-stretch rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="text-primary flex items-center justify-center pl-5 pr-2"><span className="material-symbols-outlined">search</span></div>
            <input className="flex w-full border-none bg-transparent focus:ring-0 placeholder:text-gray-400 text-sm font-medium" placeholder="Search topics or crops..." />
            <div className="flex items-center pr-5 pl-2 text-gray-400"><span className="material-symbols-outlined">mic</span></div>
          </div>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {guides.map((g) => (
          <div key={g.id} className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg active:scale-[0.98] transition-all border border-slate-100 dark:border-zinc-800">
            <div className="w-full aspect-[16/9] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url("${g.imageUrl}")` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-2xl font-bold tracking-tight">{g.title}</h3>
                {/* TTS Option removed from main list slides as requested */}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-200 text-sm font-medium line-clamp-2 pr-4">{g.description}</p>
                <button 
                  onClick={() => setSelectedGuide(g)}
                  className="bg-primary text-gray-900 px-6 py-2 rounded-full font-bold text-sm shadow-md flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
                >
                  Read <span className="material-symbols-outlined text-sm">menu_book</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Fraud Prevention Alert */}
        <div className="relative group overflow-hidden rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg">
          <div className="p-6 flex items-start gap-4">
            <div className="bg-red-500 text-white p-3 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div className="flex-1">
              <h3 className="text-red-600 dark:text-red-400 text-xl font-bold tracking-tight">Fraud Prevention</h3>
              <p className="text-red-800 dark:text-red-200 text-base font-medium mt-1">Beware of counterfeit fertilizers and seed scams.</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-red-600 dark:text-red-400 font-bold gap-2 cursor-pointer hover:underline">
                  Learn More <span className="material-symbols-outlined">arrow_forward</span>
                </div>
                {/* Voice option kept here as it's a specific alert, not a slide article */}
                <button 
                  onClick={() => {
                    if (playbackStatus === 'playing') stopAudio();
                    else initAudio('Warning: Beware of counterfeit fertilizers and seed scams. Always verify products using our scanner before purchase.');
                  }}
                  className={`size-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-600 transition-colors ${playbackStatus === 'playing' ? 'bg-red-500 text-white animate-pulse' : ''}`}
                >
                  <span className="material-symbols-outlined">
                    {playbackStatus === 'playing' ? 'pause' : 'volume_up'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Guides;

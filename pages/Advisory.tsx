
import React, { useState, useRef, useEffect } from 'react';
import { getAdvisoryResponse, generateVoiceExplanation, playPCM } from '../geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isAudioLoading?: boolean;
}

interface AdvisoryProps {
  onBack: () => void;
}

const Advisory: React.FC<AdvisoryProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Namaste! I am your AI Advisor. How can I help you with your farming today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getAdvisoryResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I'm sorry, I couldn't process that request." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connectivity issue. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async (index: number, text: string) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isAudioLoading: true } : m));
    try {
      const audioData = await generateVoiceExplanation(text);
      if (audioData) {
        await playPCM(audioData);
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    } finally {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, isAudioLoading: false } : m));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-zinc-950 animate-in slide-in-from-bottom duration-300">
      <header className="flex items-center p-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-3 ml-2">
          <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined fill-1">smart_toy</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white leading-tight">AI Advisor</h2>
            <p className="text-[10px] text-green-500 font-bold uppercase">Online Now</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-primary text-slate-900 rounded-br-none' : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-zinc-800 rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed pr-6">{m.text}</p>
              {m.role === 'bot' && (
                <button 
                  onClick={() => handlePlayAudio(i, m.text)}
                  disabled={m.isAudioLoading}
                  className={`absolute right-2 bottom-2 size-8 flex items-center justify-center rounded-full transition-colors ${m.isAudioLoading ? 'text-primary animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {m.isAudioLoading ? 'graphic_eq' : 'volume_up'}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <div className="size-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="size-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              <div className="size-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-3">
        <button className="size-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center">
          <span className="material-symbols-outlined">mic</span>
        </button>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about crops, soil, pests..."
          className="flex-1 bg-slate-100 dark:bg-zinc-800 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`size-12 rounded-full flex items-center justify-center shadow-lg transition-all ${input.trim() ? 'bg-primary text-slate-900' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
};

export default Advisory;

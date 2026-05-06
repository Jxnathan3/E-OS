import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, X, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';

const TACTICAL_RESPONSES = [
  "Discipline equals freedom. Execute the protocol.",
  "Stop waiting for motivation. Rely on systems.",
  "The obstacle is the way. Push through.",
  "Your feelings are irrelevant to the mission. Proceed.",
  "Focus your energy on what you can control.",
  "Are you executing at your highest capacity? Adjust accordingly.",
  "Excuses are unacceptable. Re-engage targets.",
  "Embrace the friction. That is where growth happens.",
  "Cut the noise. Focus on the next actionable step."
];

export function AICoach({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addNotification } = useStore();
  const [messages, setMessages] = useState<{role: 'user'|'system', text: string}[]>([
    { role: 'system', text: 'Operational system online. How can I assist your execution today, Commander?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = async (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("TTS failed:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Simulate cognitive processing delay
    setTimeout(() => {
      const reply = TACTICAL_RESPONSES[Math.floor(Math.random() * TACTICAL_RESPONSES.length)];
      setMessages(prev => [...prev, { role: 'system', text: reply }]);
      speakText(reply);
      setIsLoading(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm glass-panel border-r-0 border-y-0 rounded-none z-50 flex flex-col bg-[#0a0a0a]/95"
          >
            <div className="p-4 border-b border-[#1a1a1a] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#F27D26]" />
                <h2 className="font-mono font-bold tracking-widest text-sm uppercase text-[#e0e0e0]">AI_COACH</h2>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`ml-2 p-1.5 rounded transition-colors ${voiceEnabled ? 'bg-[#F27D26]/20 text-[#F27D26]' : 'bg-transparent text-[#666] hover:text-[#e0e0e0]'}`}
                  title={voiceEnabled ? "Voice Enabled" : "Voice Disabled"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#666] hover:text-[#e0e0e0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm font-mono ${
                    msg.role === 'user' 
                      ? 'bg-[#1a1a1a] text-[#e0e0e0] border border-[#333] rounded-br-none' 
                      : 'bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 p-3 rounded-lg rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-[#1a1a1a]">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Request tactical analysis..."
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-lg px-4 py-3 pr-12 text-sm font-mono outline-none focus:border-[#F27D26]/50 transition-colors placeholder:text-[#666] text-[#e0e0e0]"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-[#F27D26] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

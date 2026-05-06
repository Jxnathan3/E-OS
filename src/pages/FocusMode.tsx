import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Play, Square, CloudRain, Waves, Music, Pause, Activity, Zap, CheckCircle, Home, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { useStore } from '../store/useStore';

type SoundType = 'brown-noise' | 'rain' | 'waves' | 'binaural';

export function FocusMode() {
  const addXp = useStore(state => state.addXp);
  const addNotification = useStore(state => state.addNotification);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes
  const [initialDuration, setInitialDuration] = useState(90 * 60);
  const [customInput, setCustomInput] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  
  const [sounds, setSounds] = useState<Record<SoundType, { active: boolean; volume: number }>>({
    'brown-noise': { active: false, volume: 0.5 },
    'rain': { active: false, volume: 0.5 },
    'waves': { active: false, volume: 0.5 },
    'binaural': { active: false, volume: 0.5 },
  });
  const [masterPlaying, setMasterPlaying] = useState(true);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const hasActiveSounds = sounds['brown-noise'].active || sounds.rain.active || sounds.waves.active || sounds.binaural.active;

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  
  type AudioNodes = {
    source?: AudioNode;
    gain: GainNode;
    nodes?: AudioNode[];
  };
  const activeNodesRef = useRef<Partial<Record<SoundType, AudioNodes>>>({});
  
  const guaranteeAudioContext = () => {
    if (!audioContextRef.current) {
       audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const createNoiseBuffer = (ctx: AudioContext, type: 'pink' | 'brown') => {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      let lastOut = 0;

      for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'pink') {
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.96900 * b2 + white * 0.1538520;
              b3 = 0.86650 * b3 + white * 0.3104856;
              b4 = 0.55000 * b4 + white * 0.5329522;
              b5 = -0.7616 * b5 - white * 0.0168980;
              output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
              output[i] *= 0.11;
              b6 = white * 0.115926;
          } else if (type === 'brown') {
              output[i] = (lastOut + (0.02 * white)) / 1.02;
              lastOut = output[i];
              output[i] *= 3.5; 
          }
      }
      return buffer;
  };

  // Master Synth Engine
  useEffect(() => {
     const hasAnyActive = Object.values(sounds).some((s: any) => s.active);
     if (!hasAnyActive && !activeNodesRef.current) return;

     const ctx = guaranteeAudioContext();
     
     const evaluateSound = (type: SoundType) => {
         const state = sounds[type];
         const shouldPlay = state?.active && masterPlaying;
         const currentNodes = activeNodesRef.current[type];

         if (shouldPlay && !currentNodes) {
             const gainNode = ctx.createGain();
             gainNode.gain.value = state.volume;
             gainNode.connect(ctx.destination);
             
             const nodes: AudioNode[] = [gainNode];
             let sourceNode: AudioNode | undefined;

             if (type === 'brown-noise') {
                 const buffer = createNoiseBuffer(ctx, 'brown');
                 const source = ctx.createBufferSource();
                 source.buffer = buffer;
                 source.loop = true;
                 source.connect(gainNode);
                 source.start();
                 sourceNode = source;
             } 
             else if (type === 'rain') {
                 const buffer = createNoiseBuffer(ctx, 'pink');
                 const source = ctx.createBufferSource();
                 source.buffer = buffer;
                 source.loop = true;

                 const filter = ctx.createBiquadFilter();
                 filter.type = 'lowpass';
                 filter.frequency.value = 900;
                 filter.Q.value = 0.5;

                 source.connect(filter);
                 filter.connect(gainNode);
                 source.start();
                 sourceNode = source;
                 nodes.push(filter);
             }
             else if (type === 'waves') {
                 const buffer = createNoiseBuffer(ctx, 'brown');
                 const source = ctx.createBufferSource();
                 source.buffer = buffer;
                 source.loop = true;

                 const filter = ctx.createBiquadFilter();
                 filter.type = 'lowpass';
                 filter.frequency.value = 400;

                 const lfo = ctx.createOscillator();
                 lfo.type = 'sine';
                 lfo.frequency.value = 0.08; 

                 const lfoGain = ctx.createGain();
                 lfoGain.gain.value = 0.4;
                 
                 const waveGain = ctx.createGain();
                 waveGain.gain.value = 0.5;

                 lfo.connect(lfoGain);
                 lfoGain.connect(waveGain.gain);
                 
                 source.connect(filter);
                 filter.connect(waveGain);
                 waveGain.connect(gainNode);
                 
                 source.start();
                 lfo.start();

                 sourceNode = source;
                 nodes.push(filter, lfo, lfoGain, waveGain);
             }
             else if (type === 'binaural') {
                const left = ctx.createOscillator();
                const right = ctx.createOscillator();
                const merger = ctx.createChannelMerger(2);
                
                left.frequency.value = 200;
                right.frequency.value = 208; // 8Hz Alpha/Theta wave
                
                left.connect(merger, 0, 0); 
                right.connect(merger, 0, 1); 
                merger.connect(gainNode);
                
                left.start();
                right.start();
                
                sourceNode = left; 
                nodes.push(right, merger);
             }

             activeNodesRef.current[type] = {
                 source: sourceNode,
                 gain: gainNode,
                 nodes
             };

         } else if (shouldPlay && currentNodes) {
             currentNodes.gain.gain.setTargetAtTime(state.volume, ctx.currentTime, 0.1);
         } else if (!shouldPlay && currentNodes) {
             try {
                if (currentNodes.source && 'stop' in currentNodes.source) {
                    (currentNodes.source as any).stop();
                }
             } catch(e) {}
             
             currentNodes.nodes?.forEach(n => {
                 try { n.disconnect(); } catch(e) {}
             });
             delete activeNodesRef.current[type];
         }
     };

     Object.keys(sounds).forEach(key => evaluateSound(key as SoundType));

     return () => {
         // Optionally cleanup on unmount, but handled in separate effect
     };
  }, [sounds, masterPlaying]);

  useEffect(() => {
    return () => {
       // Deep cleanup on unmount
       Object.values(activeNodesRef.current).forEach((currentNodes: any) => {
           if (!currentNodes) return;
           try {
               if (currentNodes.source && 'stop' in currentNodes.source) {
                   (currentNodes.source as any).stop();
               }
           } catch(e) {}
           currentNodes.nodes?.forEach(n => {
               try { n.disconnect(); } catch(e) {}
           });
       });
       if (audioContextRef.current?.state !== 'closed') {
           audioContextRef.current?.close().catch(() => {});
       }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setShowSummary(true);
            setCompletedDuration(initialDuration);
            const xpGained = Math.round(initialDuration / 60) * 5;
            addXp(xpGained);
            addNotification(`Session complete. +${xpGained} XP.`, 'motivational');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, initialDuration, addXp, addNotification]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(initialDuration);
  };

  const handleSetDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const soundOptions: { id: SoundType; label: string; icon: any }[] = [
    { id: 'brown-noise', label: 'Deep Static', icon: Zap },
    { id: 'binaural', label: 'Binaural Theta', icon: Activity },
    { id: 'rain', label: 'Synthetic Rain', icon: CloudRain },
    { id: 'waves', label: 'Ocean Waves', icon: Waves },
  ];

  const toggleSound = (id: SoundType) => {
    setSounds(prev => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active }
    }));
  };

  const updateVolume = (id: SoundType, volume: number) => {
    setSounds(prev => ({
      ...prev,
      [id]: { ...prev[id], volume }
    }));
  };

  const EqualizerIcon = () => (
    <div className="flex items-end gap-[2px] h-3 ml-2">
      <motion.div animate={{ height: ["4px", "10px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[3px] bg-[#F27D26] rounded-t-sm" />
      <motion.div animate={{ height: ["8px", "4px", "12px", "8px"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[3px] bg-[#F27D26] rounded-t-sm" />
      <motion.div animate={{ height: ["6px", "12px", "6px"] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[3px] bg-[#F27D26] rounded-t-sm" />
    </div>
  );

  if (showSummary) {
    return (
      <div className="min-h-full bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden text-center h-full">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] bg-[#F27D26]/10 pointer-events-none" />
         
         <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           className="z-10 flex flex-col items-center max-w-md w-full"
         >
           <div className="w-24 h-24 rounded-full bg-[#F27D26]/10 border border-[#F27D26]/30 flex flex-col items-center justify-center mb-8">
             <CheckCircle className="w-12 h-12 text-[#F27D26]" />
           </div>

           <h2 className="text-3xl font-mono font-bold text-[#e0e0e0] mb-2 uppercase tracking-widest">
             Session Complete
           </h2>
           <p className="text-[#888] font-mono text-sm mb-12">
             Mission accomplished. Neuroplasticity reinforced.
           </p>

           <div className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 mb-8 flex flex-col gap-4">
             <div className="flex justify-between items-center">
               <span className="text-[#666] font-mono text-xs uppercase tracking-widest">Duration</span>
               <span className="text-[#e0e0e0] font-mono font-bold">{Math.round(completedDuration / 60)} MIN</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[#666] font-mono text-xs uppercase tracking-widest">XP Earned</span>
               <span className="text-[#F27D26] font-mono font-bold">+{Math.round(completedDuration / 60) * 5} XP</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[#666] font-mono text-xs uppercase tracking-widest">Discipline Bonus</span>
               <span className="text-[#F27D26] font-mono font-bold">+2.5%</span>
             </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 w-full">
             <Link 
               to="/"
               className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] text-[#888] hover:text-[#e0e0e0] hover:border-[#333] transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer"
             >
               <Home className="w-4 h-4" />
               Dashboard
             </Link>
             <button 
               onClick={() => {
                 setShowSummary(false);
                 setTimeLeft(initialDuration);
               }}
               className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-[#F27D26] text-black hover:bg-[#e66c15] transition-all font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer"
             >
               <RotateCcw className="w-4 h-4" />
               New Session
             </button>
           </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#050505] flex flex-col items-center justify-center p-8 pt-20 pb-32 relative overflow-hidden text-center h-full">
      {/* Background glowing orb */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full blur-[100px] md:blur-[120px] transition-all duration-1000 pointer-events-none ${isActive ? 'bg-[#F27D26]/10 animate-pulse' : 'bg-white/5'}`} />
      
      <div className="z-10 w-full max-w-xl flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-[140px] font-mono tracking-tighter font-bold mb-6 md:mb-12 tabular-nums drop-shadow-lg"
          style={{ color: isActive ? '#e0e0e0' : '#444' }}
        >
          {formatTime(timeLeft)}
        </motion.h1>

        {isActive ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#F27D26] font-mono tracking-widest uppercase mb-12 md:mb-16 text-sm md:text-md tracking-[0.3em] font-bold"
          >
            Deep Work Active
          </motion.div>
        ) : (
          <div className="text-[#666] font-mono tracking-[0.2em] uppercase mb-12 md:mb-16 text-xs md:text-xs px-4">
            Select duration. Shut down distractions. Execute.
          </div>
        )}

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-6">
            {!isActive ? (
              <button 
                onClick={handleStart}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center text-[#e0e0e0] hover:border-[#F27D26] hover:text-[#F27D26] hover:shadow-[0_0_15px_rgba(242,125,38,0.2)] active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
              </button>
            ) : (
              <button 
                onClick={handlePause}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center text-[#e0e0e0] hover:border-[#F27D26] hover:text-[#F27D26] hover:shadow-[0_0_15px_rgba(242,125,38,0.2)] active:scale-95 transition-all cursor-pointer"
              >
                <Pause className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}

            <button 
              onClick={handleStop}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center text-[#666] hover:border-red-500/50 hover:text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-95 transition-all cursor-pointer"
              title="Stop and Reset"
            >
              <Square className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>

          {!isActive && timeLeft === initialDuration && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[25, 50, 90, 120].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => handleSetDuration(minutes)}
                    className={`px-4 py-1.5 rounded-full border text-xs font-mono transition-colors ${
                      initialDuration === minutes * 60 
                        ? 'border-[#F27D26] text-[#F27D26] bg-[#F27D26]/10' 
                        : 'border-[#1a1a1a] text-[#888] hover:border-[#333] hover:text-[#e0e0e0]'
                    }`}
                  >
                    {minutes} MIN
                  </button>
                ))}
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const num = parseInt(customInput, 10);
                  if (!isNaN(num) && num > 0 && num <= 720) {
                    handleSetDuration(num);
                    setCustomInput('');
                  }
                }}
                className="flex items-center gap-2"
              >
                <input 
                  type="number"
                  min="1"
                  max="720"
                  placeholder="CUSTOM (MIN)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-32 px-4 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full text-xs font-mono text-[#e0e0e0] text-center focus:outline-none focus:border-[#F27D26] transition-colors placeholder:text-[#666]"
                />
                <button 
                  type="submit"
                  disabled={!customInput || isNaN(parseInt(customInput, 10)) || parseInt(customInput, 10) <= 0 || parseInt(customInput, 10) > 720}
                  className="px-4 py-1.5 rounded-full border border-[#1a1a1a] text-[#888] hover:border-[#333] hover:text-[#e0e0e0] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono transition-colors"
                >
                  SET
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-16 md:mt-24 pt-8 border-t border-[#1a1a1a] w-full flex flex-col md:flex-row items-center justify-between text-[#444] font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] gap-4 relative">
          
          <div className="relative">
            <button 
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`flex items-center gap-2 transition-colors cursor-pointer active:scale-95 px-3 py-2 rounded-md ${
                hasActiveSounds && masterPlaying
                  ? 'bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30' 
                  : 'text-[#888] hover:text-[#e0e0e0] hover:bg-white/5 border border-transparent'
              }`}
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Ambient Sounds</span>
              <span className="sm:hidden">Ambient</span>
              {hasActiveSounds && masterPlaying && <EqualizerIcon />}
            </button>

            <AnimatePresence>
              {showSoundMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-2 w-72 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl shadow-2xl p-2 z-50 text-left"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a1a1a] mb-2">
                    <span className="text-[10px] text-[#888] font-mono tracking-widest uppercase">Atmosphere</span>
                    <button 
                      onClick={() => setMasterPlaying(!masterPlaying)}
                      disabled={!hasActiveSounds}
                      className={`transition-colors ${!hasActiveSounds ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#F27D26] text-[#e0e0e0]'}`}
                    >
                      {masterPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {soundOptions.map(option => {
                      const isActiveSound = sounds[option.id].active;
                      return (
                        <div key={option.id} className="flex flex-col gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
                          <button
                            onClick={() => toggleSound(option.id)}
                            className={`flex items-center justify-between w-full text-[10px] font-mono uppercase tracking-widest transition-colors ${
                              isActiveSound 
                                ? 'text-[#F27D26]' 
                                : 'text-[#888] hover:text-[#e0e0e0]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <option.icon className="w-4 h-4" />
                              {option.label}
                            </div>
                            {isActiveSound && masterPlaying && <EqualizerIcon />}
                          </button>
                          
                          {isActiveSound && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              className="pl-7 pr-2 mt-1"
                            >
                              <input 
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={sounds[option.id].volume}
                                onChange={(e) => updateVolume(option.id, parseFloat(e.target.value))}
                                className="w-full accent-[#F27D26] bg-[#1a1a1a] h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="px-3 py-2 bg-transparent text-[#666]">Blocks: Active</span>
        </div>
      </div>
    </div>
  );
}

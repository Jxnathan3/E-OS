import { motion } from 'motion/react';
import { User, Shield, Terminal, Save, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect, FormEvent } from 'react';

export function Profile() {
  const { userName, setUserName, level, xp } = useStore();
  const [nameInput, setNameInput] = useState(userName);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const currentXpInLevel = xp % 200;
  const xpForNextLevel = 200;
  const rankNames = ['NOVICE', 'APPRENTICE', 'TRAINEE', 'OPERATIVE', 'COMMANDER', 'ELITE', 'LEGENDARY'];
  const rankName = rankNames[Math.min(level - 1, rankNames.length - 1)];

  return (
    <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto pt-10 md:pt-8 h-full">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-3xl font-bold font-mono tracking-tighter mb-2">OPERATIVE_PROFILE</h1>
        <p className="text-[#888] text-sm object-contain">Configure your identity within the system.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="md:col-span-1"
        >
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[#F27D26]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             <div className="w-24 h-24 rounded-full border border-[#444] bg-[#111] flex items-center justify-center relative shadow-[0_0_20px_rgba(242,125,38,0.05)]">
               <User className="w-10 h-10 text-[#666] group-hover:text-[#F27D26] transition-colors" />
               <div className="absolute inset-0 rounded-full border border-[#F27D26]/30 animate-[spin_10s_linear_infinite]" />
             </div>
             <div className="w-full">
               <h2 className="font-mono font-bold text-[#e0e0e0] uppercase break-all">{userName}</h2>
               <div className="flex items-center justify-center gap-1 mt-1 text-[#F27D26] mb-4">
                 <Shield className="w-3 h-3" />
                 <span className="text-[10px] uppercase font-bold tracking-widest">{rankName} LVL {level}</span>
               </div>
               
               <div className="w-full text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-[#666] uppercase font-mono tracking-widest">XP Progress</span>
                    <span className="text-[10px] text-[#F27D26] font-mono">{currentXpInLevel} / {xpForNextLevel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-4 relative cursor-help" title={`Requires ${xpForNextLevel - currentXpInLevel} more XP to level up`}>
                    <motion.div 
                      className="h-full bg-[#F27D26]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentXpInLevel / xpForNextLevel) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="bg-[#0a0a0a] rounded border border-[#1a1a1a] p-3 text-left">
                    <h4 className="text-[9px] uppercase tracking-widest text-[#666] font-mono mb-2">Next Unlock</h4>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded bg-[#111] flex items-center justify-center border border-[#333]">
                         <span className="text-[10px] font-mono text-[#888]">{level + 1}</span>
                       </div>
                       <span className="text-xs text-[#e0e0e0]">
                         {level < 5 ? 'Advanced Analytics' : level < 10 ? 'Elite Theme Pack' : 'Custom Daily Protocol'}
                       </span>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.1 }}
           className="md:col-span-2"
        >
          <div className="glass-panel p-6 md:p-8">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1a1a1a]">
               <Terminal className="w-5 h-5 text-[#F27D26]" />
               <h3 className="uppercase text-sm font-bold tracking-widest text-[#e0e0e0] font-mono">Identity Configuration</h3>
             </div>

             <form onSubmit={handleSave} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="operativeName" className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">
                    Operative Designation (Name)
                  </label>
                  <input
                    id="operativeName"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your designation..."
                    maxLength={30}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl text-sm font-mono text-[#e0e0e0] placeholder-[#444] focus:outline-none focus:border-[#F27D26]/50 focus:shadow-[0_0_15px_rgba(242,125,38,0.1)] transition-all"
                  />
                  <p className="text-[10px] text-[#444] mt-2 font-mono">This designation will be used across all system logs and dashboards.</p>
                </div>

                <div className="flex items-center justify-end mt-4">
                  <button 
                    type="submit"
                    disabled={!nameInput.trim() || nameInput.trim() === userName}
                    className="elite-btn py-3 px-8 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Identity</span>
                      </>
                    )}
                  </button>
                </div>
             </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

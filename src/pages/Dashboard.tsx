import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Activity, Flame, ShieldAlert, Cpu, Zap, Crosshair } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DailyBriefing } from '../components/DailyBriefing';
import { DailyMissions } from '../components/DailyMissions';

const MOTIVATIONAL_QUOTES = [
  "Potential wasted today is future freedom traded for present comfort.",
  "Discipline equals freedom. Execute the protocol.",
  "The obstacle is the way. Push through.",
  "Don't stop when you're tired. Stop when you're done.",
  "Stand by to get some. Excuses are irrelevant.",
  "Motivation is fleeting. Discipline is reliable.",
  "Amateur hour is over. Execute with lethal precision.",
  "Embrace the friction. Growth requires resistance."
];

export function Dashboard() {
  const { productivity, discipline, focus, userName, level, xp, streak } = useStore();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 10000); // Rotate every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto pt-10 md:pt-8">
      <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 md:mb-2 text-3xl md:text-4xl font-bold font-mono tracking-tighter">
            <h1>OPERATIONAL_DASHBOARD</h1>
            <span className="text-[#F27D26] text-xl border border-[#F27D26]/30 px-2 py-0.5 rounded tracking-widest bg-[#F27D26]/10">
              LVL {level}
            </span>
          </div>
          <p className="text-[#888] text-sm md:text-base mb-2">Welcome back, {userName}. Execute the mission.</p>
          <div className="flex items-center gap-2 max-w-[200px]">
            <span className="text-[#666] text-[10px] font-mono tracking-widest">XP</span>
            <div className="h-1.5 flex-1 bg-[#1a1a1a] rounded-full overflow-hidden">
               <div className="h-full bg-[#F27D26]" style={{ width: `${(xp % 200) / 200 * 100}%` }} />
            </div>
            <span className="text-[#888] text-[10px] font-mono">{xp % 200}/200</span>
          </div>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end gap-3">
          <div>
            <p className="text-[10px] text-[#666] uppercase tracking-widest font-mono">Current Phase</p>
            <p className="text-xl font-bold text-[#F27D26] font-mono">EXECUTION</p>
          </div>
          <Link
            to="/focus"
            className="flex items-center gap-2 elite-btn bg-[#F27D26] text-black hover:bg-[#e66c15] text-xs px-4 py-2 mt-1 md:mt-2 animate-pulse hover:animate-none"
          >
            <Crosshair className="w-4 h-4" />
            <span>ENTER ELITE MODE</span>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { label: 'Productivity', value: productivity, icon: Target, color: 'text-[#00ff00]', bgColor: 'bg-[#00ff00]', suffix: '/ 100', glow: 'hover:shadow-[0_0_30px_rgba(0,255,0,0.15)] shadow-[0_0_15px_rgba(0,255,0,0.05)]' },
          { label: 'Discipline', value: Math.round(discipline), icon: ShieldAlert, color: 'text-[#3b82f6]', bgColor: 'bg-[#3b82f6]', suffix: '/ 100', glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] shadow-[0_0_15px_rgba(59,130,246,0.05)]' },
          { label: 'Focus', value: focus, icon: Zap, color: 'text-[#a855f7]', bgColor: 'bg-[#a855f7]', suffix: '/ 100', glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] shadow-[0_0_15px_rgba(168,85,247,0.05)]' },
          { label: 'Streak', value: streak, icon: Flame, color: 'text-[#F27D26]', bgColor: 'bg-[#F27D26]', suffix: 'DAYS', isStreak: true, glow: 'hover:shadow-[0_0_40px_rgba(242,125,38,0.25)] shadow-[0_0_20px_rgba(242,125,38,0.1)]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-panel p-4 md:p-6 relative overflow-hidden group border transition-all duration-500 cursor-pointer ${stat.glow} ${stat.isStreak ? 'border-[#F27D26]/40 bg-[#F27D26]/5' : 'border-white/5 hover:border-white/10'}`}
          >
            {/* Ambient background glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 blur-[50px] -mr-24 -mt-24 transition-opacity duration-700 pointer-events-none rounded-full ${stat.bgColor} ${stat.isStreak ? 'opacity-20 animate-pulse' : 'opacity-0 group-hover:opacity-10'}`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="section-header !mb-0 text-[#888] group-hover:text-[#e0e0e0] transition-colors duration-300">{stat.label}</h3>
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color} transition-all duration-300 ${stat.isStreak ? 'opacity-100 animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(242,125,38,0.8)]' : 'opacity-60 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_currentColor]'}`} />
              </motion.div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10 mt-2 md:mt-0">
              <span className={`stat-value text-3xl md:text-5xl transition-colors duration-300 ${stat.isStreak ? 'text-[#F27D26] drop-shadow-[0_0_8px_rgba(242,125,38,0.4)]' : 'text-[#e0e0e0] group-hover:text-white'}`}>{stat.value}</span>
              <span className={`font-mono text-[10px] md:text-sm uppercase transition-colors duration-300 ${stat.isStreak ? 'text-[#F27D26]/70' : 'text-[#666] group-hover:text-[#888]'}`}>{stat.suffix}</span>
            </div>
            
            {/* Bottom highlight streak */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent w-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] ${stat.color}`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 flex flex-col h-[300px] md:h-[400px]"
          >
            <div className="flex-1 min-h-0">
              <DailyBriefing />
            </div>
            <div className="flex gap-4 mt-6 shrink-0">
              <button className="elite-btn">Initiate Reset</button>
              <button className="elite-btn-ghost text-[10px] py-3 px-6 hover:bg-white/5 active:scale-95 transition-all">Override AI</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-panel p-6"
          >
            <DailyMissions />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] animate-[spin_60s_linear_infinite]">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <Activity className="w-12 h-12 text-[#F27D26] mb-6 opacity-80" />
          <h3 className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-1 text-[#666]">Hard Truth</h3>
          <div className="h-24 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5 }}
                className="text-[#ccc] text-sm italic max-w-[200px] mx-auto leading-relaxed"
              >
                "{MOTIVATIONAL_QUOTES[quoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
          <button className="elite-btn-ghost w-full relative z-10 text-[10px]">Sign Acknowledge</button>
        </motion.div>
      </div>
    </div>
  );
}

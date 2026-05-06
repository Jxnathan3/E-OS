import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Target, Activity, ShieldAlert, Cpu } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col overflow-hidden relative">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F27D26]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-6 relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F27D26] to-[#ff4e00] rounded-sm flex items-center justify-center font-black text-black text-sm">E-OS</div>
          <span className="font-bold tracking-[0.2em] uppercase text-white">Elite Operating System</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[#666] border border-[#1a1a1a] px-3 py-1 rounded bg-[#0a0a0a]">
          System Offline
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-block border border-[#F27D26]/30 bg-[#F27D26]/10 text-[#F27D26] text-[10px] uppercase tracking-[0.3em] font-bold px-4 py-1.5 rounded-full mb-8">
            v4.2.0-STABLE RELEASED
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 mx-auto leading-tight">
            Your Life Needs An <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] to-[#ff4e00]">Operating System.</span>
          </h1>
          
          <p className="text-[#888] text-lg md:text-xl font-mono mb-12 max-w-2xl mx-auto leading-relaxed">
            Track habits. Build discipline. Execute goals. Become elite. 
            Stop wasting potential and take control of your execution trajectory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="elite-btn flex items-center justify-center gap-3 px-8 py-4 text-sm w-full sm:w-auto"
            >
              <Cpu className="w-5 h-5" />
              Start Evolution
            </button>
            <button 
               onClick={() => navigate('/dashboard')}
              className="elite-btn-ghost px-8 py-4 text-sm w-full sm:w-auto"
            >
              Enter Elite Mode
            </button>
          </div>
        </motion.div>

        {/* Feature Grid preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full"
        >
          {[
            { icon: Target, title: "AI Analytics", desc: "Military-grade data on your daily execution." },
            { icon: ShieldAlert, title: "Discipline Engine", desc: "Compound consistency without relying on motivation." },
            { icon: Activity, title: "Daily Missions", desc: "Algorithmic task targeting for maximum output." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 border border-[#1a1a1a] bg-black/40 backdrop-blur-md rounded-xl text-left">
              <feature.icon className="w-6 h-6 text-[#F27D26] mb-4" />
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">{feature.title}</h3>
              <p className="text-[#666] text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1a1a1a] p-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#444]">
          Built by <span className="text-[#F27D26] font-bold">Jonathan</span>
        </p>
      </footer>
    </div>
  );
}

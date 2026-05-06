import { Outlet, NavLink } from 'react-router';
import { Sidebar } from './Sidebar';
import { AICoach } from '../AICoach';
import { NotificationEngine } from '../NotificationEngine';
import { useState } from 'react';
import { Brain, LayoutDashboard, Target, BarChart2, Zap, User, Flag, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Tracker', path: '/tracker' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Zap, label: 'Focus', path: '/focus' },
  { icon: Flag, label: 'Goals', path: '/goals' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Layout() {
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] overflow-hidden flex-col font-sans border border-[#1a1a1a]">
      {/* TOP COMMAND BAR */}
      <header className="hidden md:flex h-14 border-b border-[#222] bg-[#0a0a0a] items-center justify-between px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-[#F27D26] to-[#ff4e00] rounded-sm flex items-center justify-center font-black text-black text-xs">E-OS</div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white">Elite Operating System</h1>
          <span className="text-[10px] text-[#444] border border-[#222] px-2 py-0.5 rounded tracking-widest">v4.2.0-STABLE</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-[#666]">Current Rank</span>
            <span className="text-xs font-bold text-[#F27D26] tracking-widest">APEX COMMANDER</span>
          </div>
          <div className="w-px h-8 bg-[#222]"></div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_8px_#00ff00]"></div>
            <div className="w-2 h-2 rounded-full bg-[#333]"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenAI={() => setIsAICoachOpen(true)} />
        <main className="flex-1 overflow-y-auto relative z-0 pb-20 md:pb-0">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Summon AI Button (visible on mobile or small screens) */}
      <button 
        onClick={() => setIsAICoachOpen(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#F27D26] rounded-full shadow-[0_0_20px_rgba(242,125,38,0.4)] flex items-center justify-center z-30 transition-all active:scale-90 cursor-pointer hover:bg-white hover:shadow-[0_0_30px_rgba(242,125,38,0.6)]"
      >
        <Brain className="w-6 h-6 text-black" />
      </button>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-[#1a1a1a] z-20 flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all active:scale-95 cursor-pointer relative',
                isActive ? 'text-[#F27D26]' : 'text-[#666] hover:text-[#e0e0e0] hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-nav"
                    className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon className={cn('w-5 h-5 relative z-10', isActive && 'text-[#F27D26]')} />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <AICoach isOpen={isAICoachOpen} onClose={() => setIsAICoachOpen(false)} />
      <NotificationEngine />

      {/* FOOTER STATUS */}
      <footer className="hidden md:flex h-8 bg-[#F27D26] items-center justify-between px-6 shrink-0 z-20">
        <div className="text-black text-[9px] font-black uppercase tracking-[0.2em]">System Status: Optimal | Processing Bio-Data</div>
        <div className="text-black text-[9px] font-black uppercase tracking-[0.2em]">Time Remaining: 14:17:22</div>
      </footer>
    </div>
  );
}

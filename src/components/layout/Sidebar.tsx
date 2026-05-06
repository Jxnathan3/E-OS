import { NavLink } from 'react-router';
import { LayoutDashboard, Target, BarChart2, Zap, Brain, User, Flag, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Daily Tracker', path: '/tracker' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Zap, label: 'Focus Mode', path: '/focus' },
  { icon: Flag, label: 'Goals', path: '/goals' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar({ onOpenAI }: { onOpenAI: () => void }) {
  return (
    <nav className="hidden md:flex w-20 border-r border-[#1a1a1a] flex-col items-center py-8 gap-8 shrink-0 bg-[#070707] z-10">
      <div className="flex flex-col gap-8 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 w-full aspect-square rounded-lg transition-all duration-200 relative group cursor-pointer active:scale-95',
                isActive
                  ? 'text-[#F27D26] bg-white/5'
                  : 'text-[#444] hover:text-[#e0e0e0] hover:bg-[#111] opacity-70 hover:opacity-100'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-white/5 rounded-lg border border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon className={cn('w-6 h-6 z-10', isActive && 'text-[#F27D26]')} strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-tighter z-10 mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        <button 
          onClick={onOpenAI} 
          className="flex flex-col items-center gap-1 group cursor-pointer w-[90%] mx-auto hover:bg-[#111] py-3 rounded-lg transition-all text-[#444] hover:text-[#F27D26] active:scale-95 border border-transparent hover:border-[#F27D26]/20"
          title="Summon Commander AI"
        >
           <Brain className="w-6 h-6 stroke-[1.5px]" />
           <span className="text-[9px] uppercase tracking-tighter mt-1">AI</span>
        </button>
      </div>
    </nav>
  );
}

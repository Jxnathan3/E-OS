import { Crosshair, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function DailyMissions() {
  const [missions, setMissions] = useState([
    {
      id: 1,
      title: 'Mission: Execute strategic task X with 95% focus.',
      priority: 'Maximum',
      intelligence: 'Commander AI',
      time: '00:00:00',
      completed: false,
    },
    {
      id: 2,
      title: 'Mission: Finalize Phase 2 architecture deployment.',
      priority: 'High',
      intelligence: 'Tactical AI',
      time: '04:30:00',
      completed: false,
    }
  ]);

  const toggleMission = (id: number) => {
    setMissions(missions.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="w-4 h-4 text-[#F27D26]" />
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#666] mt-1">AI-Generated Objectives</h3>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[#1a1a1a] to-transparent mx-4"></div>
        <span className="text-[10px] font-mono text-[#F27D26]">{completedCount} / {missions.length} COMPLETE</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {missions.map((mission) => (
            <motion.div 
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => toggleMission(mission.id)}
              whileHover={mission.completed ? { scale: 1.02 } : { scale: 1.01 }}
              className={`group glass-panel border p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4 transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm relative overflow-hidden ${
                mission.completed 
                  ? 'border-[#00ff00]/30 bg-gradient-to-r from-[#00ff00]/5 to-transparent hover:border-[#00ff00]/60 hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]' 
                  : 'border-[#1a1a1a] hover:border-[#F27D26]/30 bg-[#0a0a0a]/50 hover:bg-[#111]'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 z-10">
                <div className={`w-5 h-5 border rounded-sm flex items-center justify-center shrink-0 transition-all duration-300 ${
                  mission.completed 
                    ? 'border-[#00ff00] bg-[#00ff00]/20 text-[#00ff00]' 
                    : 'border-[#444] group-hover:border-[#F27D26] bg-transparent text-transparent'
                }`}>
                   <motion.div
                      initial={false}
                      animate={{ scale: mission.completed ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   >
                     <Check className="w-3 h-3" strokeWidth={3} />
                   </motion.div>
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold uppercase leading-relaxed md:leading-normal transition-colors duration-300 ${
                    mission.completed ? 'text-[#666] line-through' : 'text-[#e0e0e0]'
                  }`}>
                    {mission.title}
                  </div>
                  <div className="text-[10px] text-[#666] uppercase mt-1 md:mt-0.5 flex gap-2">
                    <span className={mission.completed ? 'opacity-50' : ''}>Priority: <span className={mission.completed ? '' : 'text-[#e0e0e0]'}>{mission.priority}</span></span>
                    <span className="opacity-50">|</span>
                    <span className={mission.completed ? 'opacity-50' : ''}>Intel: {mission.intelligence}</span>
                  </div>
                </div>
              </div>
              <div className={`text-[10px] font-mono transition-colors self-end md:self-auto z-10 ${
                mission.completed ? 'text-[#444]' : 'text-[#444] group-hover:text-[#F27D26]'
              }`}>
                {mission.time}
              </div>
              
              {/* Highlight gradient on hover (only when not completed) */}
              {!mission.completed && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#F27D26]/0 via-[#F27D26]/5 to-[#F27D26]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] z-0" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

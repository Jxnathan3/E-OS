import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Plus, Trash2, Calendar, CheckCircle2, Clock, Play } from 'lucide-react';
import { useStore, Goal } from '../store/useStore';

export function Goals() {
  const { goals, addGoal, updateGoalStatus, updateGoalProgress, updateGoalMetricValue, deleteGoal } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [type, setType] = useState<'short-term' | 'long-term'>('short-term');
  const [deadline, setDeadline] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Handle periodic expiration check
  useEffect(() => {
    const checkExpirations = setInterval(() => {
      const now = new Date().getTime();
      setCurrentTime(now);
      goals.forEach(goal => {
        if (goal.status === 'active') {
          const dlTime = new Date(goal.deadline).getTime();
          if (now > dlTime) {
            updateGoalStatus(goal.id, 'expired');
          }
        }
      });
    }, 60000); // Check every minute
    return () => clearInterval(checkExpirations);
  }, [goals, updateGoalStatus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    addGoal({
      title,
      description,
      targetMetric,
      targetValue: targetValue !== '' ? Number(targetValue) : undefined,
      type,
      deadline
    });

    setTitle('');
    setDescription('');
    setTargetMetric('');
    setTargetValue('');
    setDeadline('');
    setIsAdding(false);
  };

  const getPercentageTime = (goalDeadline: string, createdAt: number) => {
    const dl = new Date(goalDeadline).getTime();
    const now = currentTime;
    if (now >= dl) return 100;
    
    const total = dl - createdAt;
    const elapsed = now - createdAt;
    if (total <= 0) return 100;
    
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const getTimeLeft = (goalDeadline: string) => {
    const dl = new Date(goalDeadline).getTime();
    const now = new Date().getTime();
    const diff = dl - now;
    if (diff <= 0) return 'EXPIRED';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h remaining`;
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-5xl mx-auto pt-10 md:pt-8 h-full">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tighter mb-2">STRATEGIC_OBJECTIVES</h1>
          <p className="text-[#888] text-sm object-contain">Define and execute long-term and short-term goals.</p>
        </div>
        
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="elite-btn px-6 py-2.5 rounded-lg flex items-center gap-2 group whitespace-nowrap"
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
          <span className="text-xs uppercase tracking-widest font-bold">New Objective</span>
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass-panel p-6 border border-[#2a2a2a] rounded-xl flex flex-col gap-6 relative">
              <div className="flex items-center gap-2 pb-4 border-b border-[#1a1a1a]">
                <Target className="w-5 h-5 text-[#F27D26]" />
                <h3 className="uppercase text-sm font-bold tracking-widest text-[#e0e0e0] font-mono">Establish Objective Parameters</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">Directive Title *</label>
                    <input 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Launch Phase 1"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:border-[#F27D26]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">Target Metric / KPI</label>
                    <input 
                      value={targetMetric}
                      onChange={(e) => setTargetMetric(e.target.value)}
                      placeholder="e.g. 100k Users or $5k MRR"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:border-[#F27D26]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details on execution strategy..."
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:border-[#F27D26]/50 transition-colors h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                   <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">Timeline Frame</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as 'short-term' | 'long-term')}
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:border-[#F27D26]/50 transition-colors"
                    >
                      <option value="short-term">Short-Term (Weeks/Months)</option>
                      <option value="long-term">Long-Term (Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">Absolute Deadline *</label>
                    <input 
                      type="datetime-local"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:border-[#F27D26]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-[#888] mb-2">Numeric Target (Opt)</label>
                    <input 
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g. 100000"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:border-[#F27D26]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#1a1a1a] mt-2">
                  <button type="submit" className="elite-btn px-8 py-3 rounded-lg text-sm">Deploy Objective</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['short-term', 'long-term'].map((typeGroup) => (
          <div key={typeGroup} className="flex flex-col gap-4">
            <h2 className="text-[#888] font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#F27D26] block opacity-50" />
              {typeGroup.replace('-', ' ')} Objectives
            </h2>
            
            <AnimatePresence>
              {goals.filter(g => g.type === typeGroup).length === 0 ? (
                <div className="p-8 border border-dashed border-[#2a2a2a] rounded-xl text-center text-[#444] text-sm font-mono">
                  No registered {typeGroup.replace('-', ' ')} objectives.
                </div>
              ) : (
                goals.filter(g => g.type === typeGroup).map((goal) => (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`glass-panel p-5 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                      goal.status === 'completed' 
                        ? 'border-[#00ff00]/30 bg-[#00ff00]/5' 
                        : goal.status === 'expired'
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-[#1a1a1a] hover:border-[#F27D26]/30 bg-[#0a0a0a]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 gap-4">
                       <h3 className={`font-bold font-mono text-lg uppercase transition-colors ${
                         goal.status === 'completed' ? 'text-[#00ff00]' : goal.status === 'expired' ? 'text-red-400' : 'text-[#e0e0e0]'
                       }`}>
                         {goal.title}
                       </h3>
                       <div className="flex items-center gap-2 shrink-0 bg-[#000] p-1.5 rounded-lg border border-[#1a1a1a]">
                         <button 
                           onClick={() => updateGoalStatus(goal.id, goal.status === 'completed' ? 'active' : 'completed')}
                           className="p-1 hover:text-[#00ff00] text-[#666] transition-colors"
                           title={goal.status === 'completed' ? "Reactivate" : "Mark Completed"}
                         >
                           {goal.status === 'completed' ? <Play className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                         </button>
                         <button 
                           onClick={() => deleteGoal(goal.id)}
                           className="p-1 hover:text-red-500 text-[#666] transition-colors"
                           title="Delete Objective"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                    
                    <p className="text-sm text-[#888] mb-4 leading-relaxed line-clamp-2">
                       {goal.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#1a1a1a]">
                       <div className="flex flex-col gap-1.5">
                         <span className="text-[9px] uppercase tracking-widest text-[#666]">Target Metric</span>
                         {goal.targetValue !== undefined ? (
                           <div className="flex flex-col gap-2">
                             <div className="flex items-center justify-between mt-1">
                               <div className="flex items-center gap-2">
                                 <input 
                                   type="number"
                                   value={goal.currentValue || 0}
                                   onChange={(e) => {
                                     updateGoalMetricValue(goal.id, Number(e.target.value));
                                     if (Number(e.target.value) >= goal.targetValue! && goal.status !== 'completed') {
                                       updateGoalStatus(goal.id, 'completed');
                                     }
                                   }}
                                   onClick={(e) => e.stopPropagation()}
                                   className="w-16 bg-[#000] border border-[#333] px-1 py-0.5 rounded text-xs font-mono text-[#00ff00] focus:outline-none focus:border-[#F27D26]"
                                 />
                                 <span className="text-xs font-mono text-[#888] font-bold">/ {goal.targetValue} {goal.targetMetric}</span>
                               </div>
                               <span className="text-xs font-mono text-[#e0e0e0] font-bold">{goal.progress}%</span>
                             </div>
                             <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden relative">
                                <motion.div 
                                  className={`absolute top-0 left-0 h-full ${goal.status === 'completed' ? 'bg-[#00ff00]' : 'bg-[#F27D26]'}`}
                                  initial={{ width: `${goal.progress}%` }}
                                  animate={{ width: `${goal.progress}%` }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                             </div>
                             <span className="text-[8px] text-[#666] leading-none mb-1 text-left">Input exact numeric progress</span>
                           </div>
                         ) : goal.targetMetric ? (
                           <div className="flex flex-col gap-2">
                             <div className="flex items-center justify-between mt-1">
                               <span className="text-xs font-mono text-[#e0e0e0] font-bold">{goal.progress}%</span>
                               <span className="text-xs font-mono text-[#888] font-bold">{goal.targetMetric}</span>
                             </div>
                             <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden relative cursor-pointer"
                                  onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const newProgress = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
                                    updateGoalProgress(goal.id, newProgress);
                                    if (newProgress === 100 && goal.status !== 'completed') {
                                      updateGoalStatus(goal.id, 'completed');
                                    }
                                  }}
                             >
                                <motion.div 
                                  className={`absolute top-0 left-0 h-full ${goal.status === 'completed' ? 'bg-[#00ff00]' : 'bg-[#F27D26]'}`}
                                  initial={{ width: `${goal.progress}%` }}
                                  animate={{ width: `${goal.progress}%` }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                             </div>
                             <span className="text-[8px] text-[#666] leading-none mb-1 text-left">Click bar to update metric progress</span>
                           </div>
                         ) : (
                           <span className="text-xs font-mono text-[#888] font-bold mt-1">N/A</span>
                         )}
                       </div>

                       <div className="flex flex-col items-start md:items-end justify-between gap-1.5">
                         <div className="flex flex-col items-start md:items-end gap-1.5">
                           <span className="text-[9px] uppercase tracking-widest text-[#666]">T-Minus / Status</span>
                           <div className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                              goal.status === 'completed' ? 'text-[#00ff00]' : goal.status === 'expired' ? 'text-red-500' : 'text-[#F27D26]'
                           }`}>
                             <Clock className="w-3 h-3" />
                             {goal.status === 'completed' ? 'ACCOMPLISHED' : goal.status === 'expired' ? 'EXPIRED' : getTimeLeft(goal.deadline)}
                           </div>
                         </div>
                         
                         {!goal.targetMetric && (
                           <div className="w-full flex flex-col gap-1.5 mt-2">
                             <div className="w-full md:max-w-[150px] h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden relative self-start md:self-end">
                                <motion.div 
                                  className={`absolute top-0 left-0 h-full ${goal.status === 'completed' ? 'bg-[#00ff00]' : goal.status === 'expired' ? 'bg-red-500' : 'bg-[#e0e0e0]'}`}
                                  initial={{ width: `${getPercentageTime(goal.deadline, goal.createdAt)}%` }}
                                  animate={{ width: `${goal.status === 'completed' ? 100 : getPercentageTime(goal.deadline, goal.createdAt)}%` }}
                                />
                             </div>
                             <span className="text-[8px] text-[#666] leading-none text-left md:text-right mb-1">Timeline elapsed</span>
                           </div>
                         )}
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { CheckCircle2, Circle, Plus, AlertCircle, Calendar, X, Save, Target } from 'lucide-react';
import { useStore, DailyTask } from '../store/useStore';
import { useState, FormEvent, useEffect } from 'react';

export function Tracker() {
  const { tasks, updateTask, addTask, rescheduleTask } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<DailyTask['category']>('routine');
  const [reschedulingTaskId, setReschedulingTaskId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [showError, setShowError] = useState(false);
  const MAX_CHARS = 100;

  const toggleTask = (id: string, completed: boolean) => {
    updateTask(id, !completed);
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setShowError(true);
      return;
    }
    if (newTaskTitle.length > MAX_CHARS) return;
    
    addTask(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle('');
    setShowError(false);
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / (tasks.length || 1)) * 100);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);
  const categories = ['all', 'routine', 'work', 'health', 'study', 'discipline'];

  return (
    <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto pt-10 md:pt-8">
      <header className="mb-6 md:mb-10">
        <h1 className="text-3xl font-bold font-mono tracking-tighter mb-2">DAILY_TRACKER</h1>
        <p className="text-[#888]">The compound effect starts here.</p>
      </header>

      <div className="glass-panel p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="section-header text-[#666]">Daily Completion Rate</h2>
          <div className="flex items-end justify-center md:justify-start gap-3 translate-y-2">
            <span className="text-6xl font-mono font-bold tracking-tighter leading-none text-[#e0e0e0]">{progress}%</span>
          </div>
        </div>
        <div className="w-24 h-24 rounded-full radial-track flex items-center justify-center relative shadow-[0_0_30px_rgba(242,125,38,0.1)] shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle 
              cx="48" 
              cy="48" 
              r="46" 
              fill="none" 
              stroke="#F27D26" 
              strokeWidth="4" 
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="font-mono font-bold tracking-widest text-[#F27D26]">{completedCount}/{tasks.length}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center bg-[#0a0a0a] border border-[#1a1a1a] p-1.5 rounded-xl mb-8 gap-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`relative flex-1 min-w-[80px] px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all duration-300 active:scale-95 cursor-pointer ${
              filter === cat
                ? 'text-[#F27D26]'
                : 'text-[#666] hover:text-[#e0e0e0] hover:bg-white/5'
            }`}
           >
            {filter === cat && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-[#F27D26]/10 border border-[#F27D26]/30 rounded-lg shadow-[0_0_15px_rgba(242,125,38,0.15)]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleAddTask} className="mb-8 flex flex-col md:flex-row gap-3">
        <motion.div 
          className="flex-1 relative"
          animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <input 
            type="text" 
            placeholder="New Mission Objective..." 
            value={newTaskTitle}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setNewTaskTitle(e.target.value);
                setShowError(false);
              }
            }}
            className={`w-full bg-[#0a0a0a] border p-4 rounded-xl text-sm font-mono text-[#e0e0e0] placeholder-[#666] focus:outline-none transition-all pr-16 ${
              showError 
                ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : 'border-[#1a1a1a] focus:border-[#F27D26]/50 focus:shadow-[0_0_15px_rgba(242,125,38,0.1)]'
            }`}
          />
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono transition-colors flex items-center gap-2 ${
            newTaskTitle.length >= MAX_CHARS ? 'text-red-500' : 'text-[#444]'
          }`}>
            {showError && <AlertCircle className="w-3 h-3 text-red-500" />}
            {newTaskTitle.length}/{MAX_CHARS}
          </div>
        </motion.div>
        <div className="flex gap-3 shrink-0">
          <select 
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value as DailyTask['category'])}
            className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-4 rounded-xl text-xs uppercase tracking-widest text-[#666] font-bold focus:outline-none focus:border-[#F27D26]/50 transition-all cursor-pointer"
          >
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            type="submit"
            className="elite-btn py-4 px-6 rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Add Task</span>
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel rounded-xl border border-dashed border-[#2a2a2a]"
          >
            <Target className="w-16 h-16 text-[#F27D26]/30 mb-4 animate-[pulse_4s_ease-in-out_infinite]" />
            <h3 className="text-[#e0e0e0] font-mono text-lg mb-2 tracking-widest uppercase">No Active Directives</h3>
            <p className="text-[#666] text-sm max-w-sm leading-relaxed">
              {filter === 'all' 
                ? "Your mission log is empty. Initialize new parameters above to begin execution."
                : `No tasks found for classification [${filter.toUpperCase()}]. Adjust filters or generate new objectives.`}
            </p>
          </motion.div>
        ) : (
          filteredTasks.map((task, i) => (
          <motion.div
            layout
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: task.completed ? 0.6 : 1, 
              x: 0,
              scale: task.completed ? 0.98 : 1,
            }}
            transition={{ 
              opacity: { duration: 0.3 },
              scale: { duration: 0.3, type: 'spring', bounce: 0.5 },
              x: { delay: i * 0.05, duration: 0.4 },
              layout: { duration: 0.3 }
            }}
            onClick={() => toggleTask(task.id, task.completed)}
            whileHover={{ scale: 1.02 }}
            className={`group glass-panel p-4 flex items-center justify-between cursor-pointer border-l-4 transition-all duration-300 active:scale-[0.96] ${
              task.completed 
                ? 'border-l-[#00ff00] bg-gradient-to-r from-[#00ff00]/10 to-transparent hover:opacity-100 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]' 
                : 'border-l-[#F27D26] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-white/5 hover:border-l-[6px]'
            }`}
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={false}
                animate={{ 
                  scale: task.completed ? [0.6, 1.2, 1] : 1,
                  rotate: task.completed ? [-10, 10, 0] : 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-[#00ff00]" />
                ) : (
                  <Circle className="w-6 h-6 text-[#666] group-hover:text-[#F27D26] transition-colors" />
                )}
              </motion.div>
              <span className={`font-mono text-sm transition-all duration-300 ${task.completed ? 'line-through text-[#666] opacity-70' : 'text-[#e0e0e0]'}`}>
                {task.title}
                {task.rescheduledTo && !task.completed && (
                  <span className="ml-2 text-[10px] text-[#F27D26] bg-[#F27D26]/10 px-1.5 py-0.5 rounded">
                    Rescheduled: {new Date(task.rescheduledTo).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {!task.completed && reschedulingTaskId === task.id ? (
                <div 
                  className="flex items-center gap-2" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <input 
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="bg-[#000] border border-[#333] text-xs text-[#e0e0e0] px-2 py-1 rounded focus:outline-none focus:border-[#F27D26]"
                  />
                  <button 
                    onClick={() => {
                      if (rescheduleDate) {
                        rescheduleTask(task.id, rescheduleDate);
                      }
                      setReschedulingTaskId(null);
                    }}
                    className="p-1 hover:text-[#00ff00] text-[#888] transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setReschedulingTaskId(null)}
                    className="p-1 hover:text-red-500 text-[#888] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {!task.completed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReschedulingTaskId(task.id);
                        setRescheduleDate(task.rescheduledTo || new Date().toISOString().split('T')[0]);
                      }}
                      className="p-1.5 rounded-md hover:bg-white/10 text-[#666] hover:text-[#F27D26] transition-colors hidden md:block opacity-0 group-hover:opacity-100"
                      title="Reschedule Task"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded border transition-colors duration-300 ${
                    task.completed
                      ? 'bg-transparent border-[#00ff00]/20 text-[#00ff00]/60'
                      : 'bg-[#0a0a0a] border-[#1a1a1a] text-[#666]'
                  }`}>
                    {task.category}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )))}
      </div>
    </div>
  );
}

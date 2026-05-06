import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, Zap, X, BrainCircuit } from 'lucide-react';
import { useStore } from '../store/useStore';

export function NotificationEngine() {
  const { notifications, dismissNotification, addNotification, tasks, productivity, discipline, focus, userName } = useStore();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Hourly notification engine
    const triggerSmartNotification = () => {
      try {
        const completedCount = tasks.filter(t => t.completed).length;
        const totalCount = tasks.length;
        const hour = new Date().getHours();
        
        // Rules
        if (hour >= 18 && totalCount > 0 && completedCount / totalCount < 0.5) {
          addNotification(`Warning: Suboptimal progress detected for ${userName || 'operative'}. Re-engage focus.`, 'warning');
        } else if (productivity > 80 && discipline > 80) {
          addNotification(`Optimal performance maintained. Outstanding execution.`, 'motivational');
        } else if (hour < 10 && completedCount === 0) {
          addNotification(`Morning cycle initiated. Execute priority objectives, ${userName || 'operative'}.`, 'info');
        } else if (totalCount > 0 && completedCount === totalCount) {
          addNotification(`All objectives neutralized. Excellent work today.`, 'motivational');
        } else if (focus < 50) {
          addNotification(`Focus levels critically low. Engage Focus Mode immediately.`, 'warning');
        } else {
          addNotification(`Maintain operational focus. ${completedCount}/${totalCount} tasks complete.`, 'info');
        }
      } catch (err) {
        console.error("Notification Error:", err);
      }
    };

    // Calculate time to next hour
    const now = new Date();
    const msUntilNextHour = (60 - now.getMinutes()) * 60000 - (now.getSeconds() * 1000) - now.getMilliseconds();

    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      triggerSmartNotification();
    }

    const firstTimeout = setTimeout(() => {
      triggerSmartNotification();
      // Then start the hourly interval
      setInterval(triggerSmartNotification, 60 * 60 * 1000);
    }, msUntilNextHour);

    return () => clearTimeout(firstTimeout);
  }, [tasks, productivity, discipline, focus, userName, addNotification]);

  // Auto-dismiss notifications after 8 seconds
  useEffect(() => {
    const timeouts = notifications.map(notif => {
      return setTimeout(() => {
        dismissNotification(notif.id);
      }, 8000);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [notifications, dismissNotification]);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none md:max-w-sm max-w-[calc(100vw-3rem)]">
      <AnimatePresence>
        {notifications.map(notif => {
          const isWarning = notif.type === 'warning';
          const isMotivational = notif.type === 'motivational';
          
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              layout
              className={`pointer-events-auto flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md shadow-lg ${
                isWarning 
                  ? 'bg-yellow-950/80 border-yellow-500/50 text-yellow-100 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                  : notif.type === 'error'
                  ? 'bg-red-950/80 border-red-500/50 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : isMotivational
                  ? 'bg-purple-950/80 border-purple-500/50 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  : 'bg-[#111]/80 border-[#1a1a1a] text-[#e0e0e0] shadow-black/50'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {notif.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                 isWarning ? <BrainCircuit className="w-5 h-5 text-yellow-500" /> : 
                 isMotivational ? <Zap className="w-5 h-5 text-purple-400" /> : 
                 <Bell className="w-5 h-5 text-[#888]" />}
              </div>
              <div className="flex-1 text-sm font-mono leading-relaxed">
                {notif.message}
              </div>
              <button 
                onClick={() => dismissNotification(notif.id)}
                className="shrink-0 p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-4 h-4 opacity-50 hover:opacity-100" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

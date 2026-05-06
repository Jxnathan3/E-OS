import { useState, useEffect } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function DailyBriefing() {
  const { productivity, discipline, focus } = useStore();
  const [briefing, setBriefing] = useState<{ quote_start: string; quote_highlight: string; quote_end: string; analysis: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateBriefing = () => {
    setIsLoading(true);
    
    // Algorithmic Self-Assessment (Local, Instant, Reliable)
    setTimeout(() => {
      let highlight = '';
      let start = 'Commander, ';
      let end = '.';
      let analysis = '';

      const minStat = Math.min(productivity, Math.round(discipline), focus);
      const avg = (productivity + Math.round(discipline) + focus) / 3;

      if (avg >= 85) {
        start = "Commander, your ";
        highlight = "performance is optimal";
        end = " across all vectors.";
        analysis = "Maintain current trajectory. Do not allow comfort to breed complacency. Execute the remaining objectives with absolute precision.";
      } else if (avg <= 50) {
        start = "Warning: ";
        highlight = "systematic failure";
        end = " detected in daily execution.";
        analysis = "Your metrics are dropping below acceptable tactical thresholds. Initiate an immediate reset. Eliminate all distractions and execute.";
      } else {
        if (minStat === focus) {
          start = "Commander, your ";
          highlight = "focus levels are critically low";
          end = " compared to baseline.";
          analysis = "Cognitive load is fragmented. Recommend a focused Deep Work session to recalibrate neural pathways immediately.";
        } else if (minStat === productivity) {
          start = "Analysis indicates ";
          highlight = "output velocity is lagging";
          end = ".";
          analysis = "You are active, but not effective. Stop doing fake work. Prioritize high-impact missions starting now.";
        } else {
          start = "Commander, your ";
          highlight = "discipline is deteriorating";
          end = ".";
          analysis = "Motivation is fleeting, discipline is absolute. Action precedes motivation. Fall back to your core routines.";
        }
      }

      setBriefing({
        quote_start: start,
        quote_highlight: highlight,
        quote_end: end,
        analysis
      });
      setIsLoading(false);
    }, 800); // 800ms synthetic processing time for UX
  };

  useEffect(() => {
    generateBriefing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productivity, discipline, focus]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#F27D26]" />
          <h2 className="font-mono text-[10px] text-[#F27D26] uppercase tracking-[0.3em] font-bold mt-1">Self-Assessment Protocol</h2>
        </div>
        <button 
          onClick={generateBriefing} 
          disabled={isLoading}
          className="text-[#666] hover:text-[#F27D26] active:scale-95 transition-all cursor-pointer"
          title="Recalibrate Assessment"
        >
          <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#F27D26]' : ''}`} />
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 relative">
        {isLoading && !briefing ? (
          <div className="absolute inset-0 flex items-center justify-center text-[#444] font-mono text-[10px] uppercase tracking-widest">
             <Loader2 className="w-4 h-4 animate-spin mr-3 text-[#F27D26]" />
             Processing Bio-Data...
          </div>
        ) : briefing ? (
          <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
            <p className="text-xl md:text-2xl font-light leading-snug mt-2 text-[#e0e0e0]">
              {briefing.quote_start}
              <span className="text-[#F27D26] font-medium italic">{briefing.quote_highlight}</span>
              {briefing.quote_end}
            </p>
            <p className="text-[#888] mt-4 text-xs md:text-sm max-w-lg leading-relaxed">
              {briefing.analysis}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

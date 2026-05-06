import { motion } from 'motion/react';
import { BookOpen, Sparkles, Loader2, Brain, Activity, Target, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

const EMOTIONAL_PATTERNS = ["FATIGUE_OVERRIDE", "SCATTERED_FOCUS", "DETERMINED_GRIT", "ANXIETY_SPIKE", "FLOW_STATE"];
const MINDSET_SHIFTS = [
  "Pivot from emotional response to tactical execution.",
  "Disregard comfort; re-anchor to the primary objective.",
  "Micro-step your next action to break paralysis.",
  "Acknowledge the friction, then push through.",
  "Calibrate your timeline and execute immediately."
];

const PROMPTS = [
  "What is the primary obstacle hindering your execution today?",
  "Reflect on a moment today where discipline favored over motivation.",
  "Identify one strategic adjustment for tomorrow's protocol.",
  "What mental friction are you currently experiencing?",
  "List three variables in your environment you can optimize.",
];

export function Journal() {
  const { journalEntries, addJournalEntry, addNotification } = useStore();
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const filteredEntries = journalEntries.filter(entry => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    
    if (entry.content.toLowerCase().includes(lowerQuery)) return true;
    
    const dateStr = new Date(entry.date).toLocaleString().toLowerCase();
    if (dateStr.includes(lowerQuery)) return true;

    if (entry.analysis) {
        if (entry.analysis.emotionalPattern.toLowerCase().includes(lowerQuery)) return true;
        if (entry.analysis.mindsetShift.toLowerCase().includes(lowerQuery)) return true;
    }

    return false;
  });

  const handleSaveAndAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);

    // Simulate AI analysis delay
    setTimeout(() => {
      const analysis = {
        emotionalPattern: EMOTIONAL_PATTERNS[Math.floor(Math.random() * EMOTIONAL_PATTERNS.length)],
        stressIndicator: (content.length > 150 ? 'high' : content.length > 50 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        mindsetShift: MINDSET_SHIFTS[Math.floor(Math.random() * MINDSET_SHIFTS.length)],
        confidenceScore: Math.floor(Math.random() * 5) + 5, // 5-9
      };

      addJournalEntry(content, analysis);
      setContent('');
      addNotification("Brain dump analyzed and logged.", "info");
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-5xl mx-auto pt-10 md:pt-8 h-full flex flex-col md:flex-row gap-8">
      {/* Input Section */}
      <div className="flex-1 shrink-0 md:min-w-[400px]">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tighter mb-2">NEURAL_DEBRIEF</h1>
          <p className="text-[#888] text-sm md:text-base">Document and analyze your mental state. Protocol requires honesty.</p>
        </header>

        <div className="glass-panel p-6 rounded-xl border border-[#2a2a2a]">
          <div className="mb-4">
            <span className="text-[#F27D26] text-[10px] font-mono tracking-widest uppercase font-bold mb-1 block">Daily Prompt</span>
            <p className="text-[#e0e0e0] italic">"{activePrompt}"</p>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Initiate brain dump... (What is on your mind?)"
            className="w-full h-64 bg-[#050505] border border-[#1a1a1a] rounded-lg p-4 text-sm text-[#e0e0e0] font-mono placeholder:text-[#333] focus:outline-none focus:border-[#F27D26]/50 transition-colors resize-none mb-4"
          />

          <button
            onClick={handleSaveAndAnalyze}
            disabled={!content.trim() || isAnalyzing}
            className="elite-btn w-full px-6 py-4 rounded-lg flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="tracking-widest font-mono">ANALYZING SIGNAL...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:text-[#F27D26] transition-colors" />
                <span className="tracking-widest font-mono">SAVE & ANALYZE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#888]" />
              <h2 className="text-xl font-bold font-mono text-[#e0e0e0]">MISSION_LOGS</h2>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg pl-9 pr-4 py-2 text-sm font-mono text-[#e0e0e0] placeholder:text-[#666] focus:outline-none focus:border-[#F27D26]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
             {filteredEntries.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-[#1a1a1a] rounded-xl text-[#666] font-mono text-sm">
                  {searchQuery ? "NO MATCHING LOGS FOUND. ADJUST QUERY." : "NO LOGS FOUND. INITIATE FIRST DEBRIEF."}
                </div>
             ) : (
                filteredEntries.map((entry) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={entry.id}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[#888] text-xs font-mono">
                        {new Date(entry.date).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[#e0e0e0] text-sm mb-4 whitespace-pre-wrap font-mono relative pl-4 opacity-90">
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#1a1a1a]" />
                      {entry.content}
                    </div>

                    {entry.analysis && (
                      <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="flex items-center gap-1.5 text-[#666] text-[10px] font-mono uppercase tracking-widest mb-1.5">
                            <Brain className="w-3 h-3" /> Core Pattern
                          </span>
                          <span className="text-[#F27D26] text-xs font-bold uppercase tracking-widest">{entry.analysis.emotionalPattern}</span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1.5 text-[#666] text-[10px] font-mono uppercase tracking-widest mb-1.5">
                            <Activity className="w-3 h-3" /> Stress Load
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-widest ${
                            entry.analysis.stressIndicator === 'high' ? 'text-red-500' :
                            entry.analysis.stressIndicator === 'medium' ? 'text-yellow-500' :
                            'text-[#00ff00]'
                          }`}>
                            LEVEL: {entry.analysis.stressIndicator}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                           <span className="flex items-center gap-1.5 text-[#666] text-[10px] font-mono uppercase tracking-widest mb-1.5">
                            <Sparkles className="w-3 h-3" /> Tactical Shift
                          </span>
                          <span className="text-[#e0e0e0] text-xs italic">
                            "{entry.analysis.mindsetShift}"
                          </span>
                        </div>
                        <div className="md:col-span-2 mt-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="flex items-center gap-1.5 text-[#666] text-[10px] font-mono uppercase tracking-widest">
                              <Target className="w-3 h-3" /> Combat Readiness
                            </span>
                            <span className="text-[#F27D26] text-[10px] font-mono">{entry.analysis.confidenceScore}/10</span>
                          </div>
                          <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#F27D26]" 
                              style={{ width: `${(entry.analysis.confidenceScore / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
             )}
          </div>
      </div>
    </div>
  );
}

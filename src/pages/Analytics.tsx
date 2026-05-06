import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore } from '../store/useStore';

export function Analytics() {
  const { metrics } = useStore();

  return (
    <div className="p-8 pb-32 max-w-6xl mx-auto pt-16 md:pt-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold font-mono tracking-tighter mb-2 text-[#e0e0e0]">SYSTEM_ANALYTICS</h1>
        <p className="text-[#888]">Data does not lie. Review your trajectory.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 glass-panel p-4 md:p-6 h-[280px] md:h-[400px] flex flex-col">
          <h2 className="section-header text-[#666]">Weekly Evolution Graph</h2>
          <div className="flex-1 w-full min-h-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDiscipline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#444" 
                  tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#444" 
                  tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} 
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1a1a1a', color: '#e0e0e0', fontFamily: 'monospace', fontSize: '10px' }}
                  itemStyle={{ color: '#e0e0e0' }}
                />
                <Area type="monotone" dataKey="discipline" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDiscipline)" />
                <Area type="monotone" dataKey="focus" stroke="#F27D26" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-6">
          <div>
            <h2 className="section-header text-[#666]">Burnout Risk</h2>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono text-[#00ff00] font-bold">12%</span>
            </div>
            <p className="text-[10px] text-[#444] mt-2 uppercase tracking-widest font-bold">Optimal recovery detected.</p>
          </div>
          <div className="h-px bg-[#1a1a1a] w-full" />
          <div>
            <h2 className="section-header text-[#666]">Consistency Streak</h2>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono text-[#F27D26] font-bold">14</span>
              <span className="text-[#888] font-mono text-[10px] pb-1 uppercase tracking-widest">Days</span>
            </div>
            <p className="text-[10px] text-[#444] mt-2 uppercase tracking-widest">Personal best: 21 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

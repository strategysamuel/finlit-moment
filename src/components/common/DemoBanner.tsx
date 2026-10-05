import React from 'react';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-slate-100 text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-700/50 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-amber-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          DEMO MODE
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Data shown in this prototype is synthetic and for demonstration purposes.
        </span>
        <span className="text-slate-400 text-[11px]">
          Simulated Market Movement: <strong className="text-rose-400">-8.2%</strong>
        </span>
      </div>

      <div className="flex items-center gap-3 text-slate-300 text-[11px] mt-1 sm:mt-0">
        <span className="inline-flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          No transactions executed
        </span>
        <span className="text-slate-500">•</span>
        <span className="inline-flex items-center gap-1 text-indigo-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          FinLit MOMENT
        </span>
      </div>
    </div>
  );
};

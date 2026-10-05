import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, AlertTriangle, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface MomentCardProps {
  onReview?: () => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({ onReview }) => {
  const { navigateTo } = useApp();

  const handleReview = () => {
    if (onReview) {
      onReview();
    } else {
      navigateTo('sip-details');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-7 shadow-lg border border-indigo-800/60">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-400 text-slate-950 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-current" />
              MOMENT
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-amber-200/90 font-medium bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              MOMENT Active: Decision support available
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
            One of your investment decisions may affect your financial goal.
          </h3>

          <p className="text-sm text-indigo-100/80 leading-relaxed">
            Priya is considering changing her ₹25,000/month SIP following the recent market movement.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-200/70 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Simulated Nifty dip: -8.2%
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
              Your portfolio: -6.8%
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              You remain in full control
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
          <button
            onClick={handleReview}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all active:scale-[0.98] group"
          >
            <span>Review Before You Pause</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <span className="text-[11px] text-center text-indigo-200/60 font-medium">
            Takes ~60 seconds to review
          </span>
        </div>
      </div>
    </div>
  );
};

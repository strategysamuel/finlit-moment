import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_INVESTMENTS, DEMO_GOALS, DEMO_MARKET_EVENT } from '../data/demoData';
import { formatINR, formatPercent } from '../utils/formatters';
import { RiskBadge } from '../components/common/RiskBadge';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  Calendar,
  Clock,
  Target,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  PauseCircle,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const SipDetailsPage: React.FC = () => {
  const { navigateTo } = useApp();
  const primaryFund = DEMO_INVESTMENTS[0];
  const linkedGoal = DEMO_GOALS[0];

  const handlePauseSip = () => {
    // Triggers MOMENT intervention with action='pause' (Does NOT execute transaction)
    navigateTo('moment-intervention', { action: 'pause' });
  };

  const handleReduceSip = () => {
    // Triggers MOMENT intervention with action='reduce' (Does NOT execute transaction)
    navigateTo('moment-intervention', { action: 'reduce' });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <button
          onClick={() => navigateTo('investments')}
          className="hover:text-slate-700"
        >
          Investments
        </button>
        <span>/</span>
        <span className="text-indigo-600 font-bold">SIP Mandate Details</span>
      </div>

      {/* Main SIP Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active Monthly Mandate
              </span>
              <RiskBadge level={primaryFund.riskCategory} size="sm" />
              <span className="text-xs text-slate-400">Folio: 9812/3421</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {primaryFund.name}
            </h1>

            <p className="text-xs text-slate-500 max-w-xl">
              Direct Plan • Growth Option • Managed by FinLit Asset Management. Dedicated to supporting the Child Education financial goal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Current Monthly SIP
            </span>
            <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              {formatINR(primaryFund.monthlySip)}
              <span className="text-xs font-medium text-slate-400 ml-1">/month</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Next scheduled debit: 10th of next month (Auto-debit)
            </span>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase">
              Current Value
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {formatINR(primaryFund.currentValue)}
            </span>
            <span className="text-[11px] text-slate-500">
              17,278.61 units @ ₹64.82 NAV
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase">
              Invested Amount
            </span>
            <span className="text-xl font-bold text-slate-800 mt-1 block">
              {formatINR(primaryFund.investedValue)}
            </span>
            <span className="text-[11px] text-slate-500">
              Cumulative over 38 installments
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase">
              XIRR Return
            </span>
            <span className="text-xl font-extrabold text-emerald-600 mt-1 block">
              +{primaryFund.xirr}%
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Annualized compounding
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase">
              Recent Performance
            </span>
            <span className="text-xl font-extrabold text-rose-600 mt-1 block">
              {formatPercent(primaryFund.recentMovementPercent, { includeSign: true })}
            </span>
            <span className="text-[11px] text-slate-500">
              Simulated 3-week market dip
            </span>
          </div>
        </div>

        {/* Goal Anchor Callout */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Linked Financial Goal
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                {linkedGoal.title} (Target: {formatINR(linkedGoal.targetAmount)})
              </h4>
              <p className="text-[11px] text-slate-600">
                {linkedGoal.progressPercent}% achieved • {linkedGoal.yearsRemaining} years remaining until target year {linkedGoal.targetYear}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('goals')}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 shrink-0"
          >
            <span>Goal Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Panel: Reduce SIP and Pause SIP (Triggers MOMENT) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Modify SIP Mandate
              </h3>
              <p className="text-xs text-slate-500">
                Select an action below. MOMENT will evaluate and simulate the goal impact before any change.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              Decision Protection Enabled
            </span>
          </div>

          {/* TWO PROMINENT BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reduce SIP Button */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <span>Reduce Monthly SIP</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Lower your monthly commitment (e.g., to ₹12,500/month) for cash flow breathing room while keeping goal momentum alive.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <button
                  onClick={handleReduceSip}
                  className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs transition-all shadow-2xs inline-flex items-center justify-center gap-2"
                >
                  <span>Reduce SIP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pause SIP Button (Hero Demo Flow) */}
            <div className="p-4 rounded-xl border-2 border-rose-200/90 bg-rose-50/30 hover:bg-white hover:border-rose-400 hover:shadow-sm transition-all flex flex-col justify-between relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                Hero Flow
              </span>
              <div>
                <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                  <PauseCircle className="w-4 h-4 text-rose-600" />
                  <span>Pause SIP Temporarily</span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Halt upcoming monthly debits. See what halting contributions during a simulated -8.2% market dip does to your ₹35L goal.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100">
                <button
                  onClick={handlePauseSip}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause SIP</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-[11px] text-slate-400">
            * Clicking either button opens the <strong>FinLit MOMENT</strong> decision-support layer. No transaction is executed.
          </div>
        </div>
      </div>

      {/* SIP History & Bank Mandate details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Mandate & Banking Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Primary Bank Account</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              HDFC Bank (•••• 4921)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Mandate Limit</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              ₹50,000 / month (Auto-approved)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[11px]">SIP Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Active & Verified
            </span>
          </div>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_GOALS, DEMO_INVESTMENTS } from '../data/demoData';
import { formatINR } from '../utils/formatters';
import { GoalCard } from '../components/common/GoalCard';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  GraduationCap,
  Landmark,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { navigateTo } = useApp();
  const primaryGoal = DEMO_GOALS[0];
  const retirementGoal = DEMO_GOALS[1];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Financial Planning</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">Goal Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Life Goals & Timelines
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Every SIP installment is dedicated to funding specific milestones without emotional interference.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            2 Active Goals Tracked
          </span>
        </div>
      </div>

      {/* Critical Goal Alert Banner if pause contemplated */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-950 text-sm">
              Non-Negotiable Timeline: Child Education (Year 2032)
            </h4>
            <p className="text-amber-900/90 leading-relaxed">
              Higher education deadlines are fixed by admission cycles. Pausing the linked ₹25,000 SIP during a market correction risks creating an estimated ₹9,40,000 shortfall at target year.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('moment-intervention')}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs inline-flex items-center justify-center gap-2"
        >
          <span>Evaluate SIP Decision</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Goal Spotlight Card */}
      <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm ring-1 ring-indigo-50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {primaryGoal.title}
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  71% Achieved
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                {primaryGoal.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Target Corpus</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {formatINR(primaryGoal.targetAmount)}
              </span>
            </div>
            <div className="pl-4 border-l border-slate-200">
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Accumulated</span>
              <span className="text-2xl font-extrabold text-indigo-600">
                {formatINR(primaryGoal.currentAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Big visual progress meter */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>Started 2021 (₹0)</span>
            <span className="text-indigo-600">Current: ₹24.85L (71%)</span>
            <span>Target 2032 (₹35L)</span>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700 relative"
              style={{ width: `${primaryGoal.progressPercent}%` }}
            >
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Remaining to accumulate: <strong className="text-slate-700">{formatINR(primaryGoal.targetAmount - primaryGoal.currentAmount)}</strong></span>
            <span>Monthly SIP run-rate: <strong className="text-slate-700">{formatINR(primaryGoal.monthlyContribution)}/mo</strong></span>
          </div>
        </div>

        {/* Linked Investments Grid */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Linked Investment Vehicles
            </span>
            <span className="text-[11px] text-slate-500">
              Directly funding this specific target
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  {DEMO_INVESTMENTS[0].name}
                </div>
                <div className="text-[11px] text-slate-500">
                  Equity Flexi-Cap • {formatINR(DEMO_INVESTMENTS[0].monthlySip)}/mo SIP
                </div>
              </div>
              <button
                onClick={() => navigateTo('sip-details')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                Inspect SIP
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  {DEMO_INVESTMENTS[2].name}
                </div>
                <div className="text-[11px] text-slate-500">
                  AAA Debt Cushion • {formatINR(DEMO_INVESTMENTS[2].monthlySip)}/mo SIP
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Stable Buffer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Goal: Retirement */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <GoalCard
          goal={retirementGoal}
          isPrimary={false}
          onInspect={() => navigateTo('investments')}
        />
      </div>

      {/* Why Goal-Linked SIPs Matter */}
      <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">
            The FinLit MOMENT Principle on Goal Severance
          </h4>
          <p className="mt-1 leading-relaxed text-slate-700">
            Investors often pause SIPs during short-term market volatility, forgetting that the investment was never meant for this week or next month—it was anchored to a child’s college admission 6 years away. FinLit MOMENT re-connects the action to the goal before you commit.
          </p>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

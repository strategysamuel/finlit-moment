import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_INVESTMENTS, DEMO_GOALS } from '../data/demoData';
import { formatINR } from '../utils/formatters';
import { DecisionAction } from '../types';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  ShieldCheck,
  CheckCircle2,
  Play,
  Sliders,
  Pause,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Lock,
} from 'lucide-react';

export const DecisionConfirmationPage: React.FC = () => {
  const {
    navigateTo,
    recordDecision,
    lastDecision,
    recordedDecisions,
    resetDemo,
  } = useApp();

  const [selectedChoice, setSelectedChoice] = useState<DecisionAction | null>(
    lastDecision ? lastDecision.action : null
  );

  const primaryFund = DEMO_INVESTMENTS[0];
  const primaryGoal = DEMO_GOALS[0];

  const handleMakeChoice = (action: DecisionAction) => {
    setSelectedChoice(action);
    recordDecision(action);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Header Pill */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Final Investor Decision Hub</span>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Step 3 of 3: Explicit Investor Choice
        </span>
      </div>

      {/* Main Headline & Text verbatim from Section 15 */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          You're in control.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          MOMENT provides information and scenarios. The final investment decision always remains yours.
        </p>
      </div>

      {/* THREE EXPLICIT DECISION OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Continue SIP */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            lastDecision?.action === 'continue'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Recommended
              </span>
              <Play className="w-4 h-4 text-emerald-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-3">
              Continue Regular SIP
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Maintain full ₹25,000 monthly auto-debit. Accumulate discounted units during this simulated market dip.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 block text-[11px]">Monthly Amount</span>
              <strong className="text-base text-slate-900">{formatINR(25000)}/mo</strong>
              <span className="text-emerald-700 block text-[11px] font-semibold mt-0.5">
                Target Met: 105% (₹36.8L)
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleMakeChoice('continue')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Continue SIP</span>
            </button>
          </div>
        </div>

        {/* Option 2: Reduce SIP */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            lastDecision?.action === 'reduce'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-200 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                Balanced
              </span>
              <Sliders className="w-4 h-4 text-amber-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-3">
              Reduce Monthly SIP
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Lower monthly allocation to ₹12,500. Retains liquidity relief while preserving partial compounding.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 block text-[11px]">Monthly Amount</span>
              <strong className="text-base text-slate-900">{formatINR(12500)}/mo</strong>
              <span className="text-amber-700 block text-[11px] font-semibold mt-0.5">
                Goal Progress: 89% (₹31.2L)
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleMakeChoice('reduce')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Sliders className="w-4 h-4" />
              <span>Reduce SIP</span>
            </button>
          </div>
        </div>

        {/* Option 3: Pause SIP */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            lastDecision?.action === 'pause'
              ? 'bg-rose-50/70 border-rose-500 ring-2 ring-rose-200 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
                High Impact
              </span>
              <Pause className="w-4 h-4 text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-3">
              Pause SIP Temporarily
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Halt all upcoming monthly debits. Foregoes buying during the simulated dip and creates a projected ₹9.4L gap.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 block text-[11px]">Monthly Amount</span>
              <strong className="text-base text-slate-900">₹0/mo</strong>
              <span className="text-rose-700 block text-[11px] font-semibold mt-0.5">
                Goal Gap: -₹9.4 Lakhs (+2.8 yrs)
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleMakeChoice('pause')}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition-all shadow-2xs inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Pause className="w-4 h-4" />
              <span>Pause SIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC CONFIRMATION CARD (When a user selects an option) */}
      {lastDecision && (
        <div className="rounded-2xl bg-white border-2 border-indigo-200 p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Investor Confirmation
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {lastDecision.action === 'continue'
                    ? 'You chose to continue your SIP.'
                    : lastDecision.action === 'reduce'
                    ? 'You chose to reduce your SIP.'
                    : 'You chose to pause your SIP.'}
                </h3>
              </div>
            </div>

            <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
              Recorded at {lastDecision.recordedAt}
            </span>
          </div>

          {/* Decision Data Specifications verbatim */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Decision</span>
              <strong className="text-base text-slate-900 block mt-0.5 capitalize">
                {lastDecision.action === 'continue'
                  ? 'Continue SIP'
                  : lastDecision.action === 'reduce'
                  ? 'Reduce SIP by 50%'
                  : 'Pause SIP'}
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Monthly SIP</span>
              <strong className="text-base text-indigo-700 block mt-0.5">
                {formatINR(lastDecision.newSip)}/month
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[11px]">Linked Goal</span>
              <strong className="text-base text-slate-900 block mt-0.5">
                {lastDecision.goalName}
              </strong>
            </div>
          </div>

          {/* Explicit Non-Transactional Demo Mode Notice verbatim */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong>Decision recorded in demo mode.</strong> No financial transaction has been executed. In a live production environment, this choice would now route to the AMC registrar or banking payment gateway with your authentication.
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('simulator')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Alternate Scenario</span>
            </button>
          </div>
        </div>
      )}

      {/* Decision Audit Trail (if multiple simulated tests performed) */}
      {recordedDecisions.length > 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session Simulation History ({recordedDecisions.length} recorded)
            </h4>
            <button
              onClick={resetDemo}
              className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold"
            >
              Clear Session
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recordedDecisions.map((dec) => (
              <div
                key={dec.id}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 capitalize">
                    {dec.action} SIP ({formatINR(dec.newSip)}/mo)
                  </span>
                  <span className="text-slate-400 block text-[11px]">
                    {dec.notes}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {dec.recordedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <FinancialGuardrailNotice />
    </div>
  );
};

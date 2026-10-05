import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_DECISION_FACTORS } from '../data/demoData';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

export const ExplainabilityPage: React.FC = () => {
  const { navigateTo, geminiInsight } = useApp();

  const confidencePercent = geminiInsight
    ? Math.round(geminiInsight.confidence <= 1 ? geminiInsight.confidence * 100 : geminiInsight.confidence)
    : 87;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Explainable Decision Intelligence (XAI)</span>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Transparent Behavioral Guardrail
        </span>
      </div>

      {/* Main Title & Subhead */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Why MOMENT showed this
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          FinLit MOMENT evaluates clear, user-verifiable factors rather than opaque algorithms. Here is why this decision intervention was surfaced for your review.
        </p>
      </div>

      {/* Primary Narrative Summary & Prototype AI Confidence */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Decision Context Summary
              </h3>
              <p className="text-xs text-slate-500">
                Synthesis of portfolio health vs market volatility vs goal runway
              </p>
            </div>
          </div>

          {/* AI Confidence Indicator */}
          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                Insight Confidence
              </span>
              <span className="text-xs text-slate-500">Decision relevance</span>
            </div>
            <div className="text-2xl font-extrabold text-indigo-700">
              {confidencePercent}%
            </div>
          </div>
        </div>

        {/* User-Facing Explanation Text */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          "{geminiInsight?.summary || 'Your goal is 6 years away and your current SIP contributes regularly toward it. The simulated market decline is broader than the movement in your portfolio. These factors are why MOMENT is highlighting the potential impact of pausing.'}"
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Prototype confidence indicator — not a prediction of investment returns.</strong> This indicator reflects contextual relevance between the investor's stated horizon and the implications of pausing. It does not imply statistical certainty.
          </p>
        </div>
      </div>

      {/* Decision Factors Table / Visual Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Evaluated Decision Factors
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The 7 verifiable data points considered by the MOMENT intervention engine
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            7 Factors Analyzed
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {DEMO_DECISION_FACTORS.map((factor, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 max-w-xl">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5 text-indigo-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {factor.factor}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        factor.status === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : factor.status === 'Alert'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : factor.status === 'Buffer'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {factor.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {factor.explanation}
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0 pl-9 sm:pl-0">
                <span className="text-xs font-bold text-slate-900 block">
                  {factor.value}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Weight: {factor.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Proceed with informed confidence
          </h4>
          <p className="text-xs text-slate-500">
            Now that you understand the context, you can review simulations or decide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('simulator')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>See Decision Impact</span>
          </button>
          <button
            onClick={() => navigateTo('decision-confirmation')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Proceed to Decision</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

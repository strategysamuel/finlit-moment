import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DEMO_INVESTOR,
  DEMO_PORTFOLIO,
  DEMO_GOALS,
  DEMO_MARKET_EVENT,
  DEMO_INVESTMENTS,
} from '../data/demoData';
import { formatINR, formatPercent } from '../utils/formatters';
import { RiskBadge } from '../components/common/RiskBadge';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  Zap,
  TrendingDown,
  Target,
  Shield,
  HelpCircle,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Compass,
  Layers,
  Scale,
  History,
} from 'lucide-react';

export const MomentInterventionPage: React.FC = () => {
  const {
    navigateTo,
    proposedAction,
    geminiInsight,
    isLoadingAI,
    aiError,
    refreshAI,
  } = useApp();

  const primaryGoal = DEMO_GOALS[0];
  const primaryFund = DEMO_INVESTMENTS[0];
  const isPause = proposedAction === 'pause';

  // Format confidence percentage
  const confidencePercent = geminiInsight
    ? Math.round(geminiInsight.confidence <= 1 ? geminiInsight.confidence * 100 : geminiInsight.confidence)
    : 87;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Top Breadcrumb & Status Pill */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <Zap className="w-3.5 h-3.5 fill-current text-amber-600" />
          <span>FinLit MOMENT Decision Intelligence</span>
        </div>

        <div className="flex items-center gap-2">
          {geminiInsight?.isAiGenerated && !geminiInsight?.isFallback && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Gemini Live Intelligence ({geminiInsight.modelUsed || 'Active'})
            </span>
          )}
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Step 1 of 3: Contextual Decision Support
          </span>
        </div>
      </div>

      {/* Hero Headline & Subheading */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {isPause
            ? 'Before you pause your SIP...'
            : 'Before you reduce your SIP...'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Let’s look at what this decision could mean for your portfolio and your goal.
        </p>
      </div>

      {/* Failure / Fallback Notice Banner */}
      {aiError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                MOMENT couldn't generate a fresh AI insight right now.
              </strong>
              <span className="text-amber-800/90 text-[11px] leading-relaxed">
                Showing safe deterministic fallback decision context using your synthetic portfolio data. You can continue through the prototype without disruption.
              </span>
            </div>
          </div>
          <button
            onClick={() => refreshAI()}
            className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline shrink-0 inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* 4 Core Quick Context Factors Grid: MARKET, PORTFOLIO, GOAL, RISK */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* MARKET */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              MARKET
            </span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
              {formatPercent(DEMO_MARKET_EVENT.marketMovementPercent)}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1 font-medium">
              Simulated Nifty 50 dip
            </span>
          </div>
        </div>

        {/* PORTFOLIO */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PORTFOLIO
            </span>
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatPercent(DEMO_PORTFOLIO.recentMovementPercent)}
            </span>
            <span className="block text-[11px] text-emerald-600 mt-1 font-semibold">
              +1.4% buffer vs market
            </span>
          </div>
        </div>

        {/* GOAL */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              GOAL
            </span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 truncate block">
              {primaryGoal.title}
            </span>
            <span className="block text-[11px] text-slate-600 mt-1 font-medium">
              {primaryGoal.yearsRemaining} years remaining ({primaryGoal.progressPercent}%)
            </span>
          </div>
        </div>

        {/* RISK */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              RISK
            </span>
            <RiskBadge level={DEMO_INVESTOR.riskProfile} size="sm" />
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {DEMO_INVESTOR.riskProfile}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1 font-medium">
              Horizon: {DEMO_INVESTOR.investmentHorizon}
            </span>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoadingAI && (
        <div className="bg-white rounded-2xl p-8 border-2 border-indigo-100 shadow-sm text-center space-y-4 animate-in fade-in duration-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-1">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Analyzing your investment context...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Evaluating your Child Education timeline (6 years), simulated market correction (-8.2%), and rupee-cost averaging opportunity.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Portfolio health scan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75" />
              Goal milestone check
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-150" />
              Structuring alternatives
            </span>
          </div>
        </div>
      )}

      {/* AI INSIGHT PRESENTATION — 5 CLEARLY SEPARATED CARDS */}
      {!isLoadingAI && geminiInsight && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Decision Support Analysis
              </span>
              {geminiInsight.isAiGenerated && !geminiInsight.isFallback ? (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Model Insight
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Deterministic Baseline
                </span>
              )}
            </div>

            {/* Prototype Confidence Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Insight confidence:</span>
              <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                {confidencePercent}%
              </span>
            </div>
          </div>

          {/* Card 1: WHAT CHANGED? */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-indigo-500" />
                WHAT CHANGED?
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Simulated Market & Portfolio Movement
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {geminiInsight.marketContext}
            </p>
            <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-900">Portfolio Context:</strong> {geminiInsight.portfolioContext}
            </div>
          </div>

          {/* Card 2: WHY IT MATTERS FOR YOU */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                WHY IT MATTERS FOR YOU
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Horizon & Volatility Resilience
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {geminiInsight.summary}
            </p>
            <div className="text-xs text-slate-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <strong className="text-indigo-950">Risk Profile Alignment:</strong> {geminiInsight.riskContext}
            </div>
          </div>

          {/* Card 3: YOUR GOAL CONTEXT */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                YOUR GOAL CONTEXT
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Target: {formatINR(primaryGoal.targetAmount)} (Year {primaryGoal.targetYear})
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {geminiInsight.goalContext}
            </p>
            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Accumulated so far: <strong className="text-slate-900">{formatINR(primaryGoal.currentAmount)}</strong> ({primaryGoal.progressPercent}%)</span>
              <span>Runway: <strong className="text-slate-900">{primaryGoal.yearsRemaining} years remaining</strong></span>
            </div>
          </div>

          {/* Card 4: WHAT THIS DECISION COULD AFFECT */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-rose-500" />
                WHAT THIS DECISION COULD AFFECT
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Rupee-Cost Averaging & Shortfall
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {geminiInsight.decisionImpact}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-rose-950">
                <strong>Projected Shortfall:</strong> Estimated ₹9,40,000 funding gap if paused completely.
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 text-amber-950">
                <strong>Timeline Impact:</strong> Potential 2.8 year delay against 2032 admission year.
              </div>
            </div>
          </div>

          {/* Card 5: WHAT YOU COULD CONSIDER */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                WHAT YOU COULD CONSIDER
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                3 Potential Paths
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {geminiInsight.alternatives.map((alt) => (
                <div
                  key={alt.action}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between ${
                    alt.action === 'CONTINUE'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : alt.action === 'REDUCE'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                        alt.action === 'CONTINUE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : alt.action === 'REDUCE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {alt.action} SIP
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px] mt-1">
                      {alt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence and Regulatory Notice */}
          <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Prototype confidence indicator ({confidencePercent}%) — not a prediction of investment returns.</strong> {geminiInsight.disclaimer}
            </p>
          </div>
        </div>
      )}

      {/* M4: YOUR DECISION MEMORY COMPACT CARD */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Your Decision Memory
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">
            Previous Decision Context Recorded
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Previous MOMENT</span>
              <strong className="text-slate-900 font-bold block mt-0.5">July 15, 2026</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Market Drawdown</span>
              <strong className="text-amber-700 font-bold block mt-0.5">-4.1%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Goal Progress</span>
              <strong className="text-slate-900 font-bold block mt-0.5">62%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Your Decision</span>
              <span className="font-bold text-emerald-700 block mt-0.5">Continue SIP</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('decision-memory')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center"
          >
            <span>Compare with previous MOMENT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* THREE REQUIRED ACTION BUTTONS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Next Steps in Your Decision Journey
            </h4>
            <p className="text-xs text-slate-500">
              Inspect the AI data factors or simulate numerical impacts before deciding
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Investor Sovereignty
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Button 1: "Why am I seeing this?" */}
          <button
            onClick={() => navigateTo('explainability')}
            className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all shadow-2xs inline-flex items-center justify-center gap-2 group"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>Why am I seeing this?</span>
          </button>

          {/* Button 2: "See Decision Impact" */}
          <button
            onClick={() => navigateTo('simulator')}
            className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <SlidersHorizontal className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>See Decision Impact</span>
          </button>

          {/* Button 3: "Continue with decision" */}
          <button
            onClick={() => navigateTo('decision-confirmation')}
            className="py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all shadow-2xs inline-flex items-center justify-center gap-2 group"
          >
            <span>Continue with decision</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AUTHORITATIVE_M5_COMPARISON } from '../data/followUpData';
import { DecisionReflectionIntelligence } from '../types/decisionReflection';
import { DEMO_INVESTOR, DEMO_GOALS } from '../data/demoData';
import { getAllCalculatedScenarios } from '../services/scenarioEngine';
import { formatINR } from '../utils/formatters';
import { aiService } from '../services/aiService';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  Brain,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Target,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Info,
  HelpCircle,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  Lightbulb,
  Check,
  Loader2,
  Shield,
  XCircle,
  History,
  RotateCcw,
  Compass,
  FileText,
  AlertCircle,
  Eye,
  Calendar,
} from 'lucide-react';

export const DecisionReflectionPage: React.FC = () => {
  const { navigateTo } = useApp();

  // Authoritative single sources of truth
  const m5 = AUTHORITATIVE_M5_COMPARISON;
  const primaryGoal = DEMO_GOALS[0];
  const calculatedScenarios = getAllCalculatedScenarios();

  // Gemini Behavioral Reflection state
  const [intelligence, setIntelligence] = useState<DecisionReflectionIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadDecisionReflection() {
      setIsLoading(true);
      try {
        const res = await aiService.generateDecisionReflection({
          comparison: m5,
          scenarios: calculatedScenarios,
          investor: DEMO_INVESTOR,
          goal: primaryGoal,
        });
        if (!isCancelled) {
          setIntelligence(res);
        }
      } catch (err) {
        console.warn('Could not load AI decision reflection:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDecisionReflection();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
          <Brain className="w-3.5 h-3.5 text-indigo-600" />
          <span>Decision Reflection • Milestone 7</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Calendar className="w-3 h-3 text-indigo-600" />
            Decision Date: {m5.decisionDate}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Clock className="w-3 h-3 text-emerald-600" />
            Illustrative Follow-Up: {m5.followUpDate}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Synthetic Demo Data
          </span>
        </div>
      </div>

      {/* Main Page Title & Subtitle */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Decision Reflection
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Understand the context behind your decision — without being told what to do.
        </p>

        {/* Primary Principle Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-indigo-950 flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block text-indigo-950">
              Primary Principle: MOMENT helps you reflect on your decision context. You remain responsible for the decision.
            </strong>
            <p className="text-indigo-900/80 text-xs leading-relaxed">
              Reviewing your {m5.decisionDate} decision alongside subsequent simulated follow-up context (Follow-up observation — {m5.followUpDate}).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1 — DECISION CONTEXT */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Decision Date Context
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What was happening when you decided?
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Recorded Decision Date: {m5.decisionDate}
          </span>
        </div>

        {/* 4 Context Cards (Explicitly Anchored to Decision Date October 5, 2026) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* 1. Market Context */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">1. Market Context</span>
            <strong className="text-base font-extrabold text-rose-700 block">
              Market movement was {m5.decisionMarketMovement}%.
            </strong>
            <span className="text-[11px] text-slate-500 block">
              Simulated equity benchmark drawdown on {m5.decisionDate}.
            </span>
          </div>

          {/* 2. Portfolio Context */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">2. Portfolio Context</span>
            <strong className="text-base font-extrabold text-amber-700 block">
              Portfolio movement was {m5.decisionPortfolioMovement}%.
            </strong>
            <span className="text-[11px] text-slate-500 block">
              Temporary unrealized pullback on {m5.decisionDate}.
            </span>
          </div>

          {/* 3. Goal Context */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">3. Goal Context</span>
            <strong className="text-base font-extrabold text-emerald-700 block">
              Child Education goal was {m5.decisionGoalProgress}% funded.
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {formatINR(m5.decisionAccumulated)} accumulated at decision time.
            </span>
          </div>

          {/* 4. Contribution Context */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">4. Contribution Context</span>
            <strong className="text-base font-extrabold text-indigo-700 block">
              SIP was reduced from {formatINR(m5.decisionSip)} to {formatINR(m5.followUpSip)}/month.
            </strong>
            <span className="text-[11px] text-slate-500 block">
              50% allocation reduction to ease monthly cash flow.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2 — POTENTIAL DECISION INFLUENCES */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Context Exploration
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What may have influenced the decision?
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Objective factors without psychological diagnosis
          </span>
        </div>

        <p className="text-xs text-slate-500">
          MOMENT does not claim to know your internal intent. Instead, here are contextual factors that commonly interact with contribution choices:
        </p>

        {/* Influences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold text-xs">• Market Volatility</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Broader market index movements and negative media headlines can create friction around regular allocations.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold text-xs">• Short-Term Portfolio Movement</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Seeing a {m5.decisionPortfolioMovement}% portfolio dip on {m5.decisionDate} can prompt a natural instinct to reduce short-term capital commitments.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold text-xs">• Monthly Cash-Flow Flexibility</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Household liquidity preferences often shift, making freeing up ₹12,500/month desirable for other priorities.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold text-xs">• Long-Term Goal Horizon</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Having {m5.decisionHorizon} remaining provides breathing room to adjust pace without immediate deadline pressure.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold text-xs">• Risk Tolerance</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Aligning contribution pace with comfort levels during periods of broader market fluctuations.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold text-xs">• Maintaining Contribution Discipline</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Choosing to reduce rather than pause entirely reflects an intent to keep rupee-cost averaging active.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900/90 font-medium">
          Note: These are contextual factors to consider, not conclusions about your intent.
        </div>
      </div>

      {/* SECTION 3 — REFLECTION QUESTIONS */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Self-Evaluation
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Reflection Questions
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            No right or wrong answers
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Take a quiet moment to explore your thoughts across these four reflective angles:
        </p>

        {/* 4 Reflection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                1
              </span>
              <strong className="text-slate-900 text-xs font-bold">
                Market Sentiment Check
              </strong>
            </div>
            <p className="text-slate-700 text-xs font-medium leading-relaxed pl-7">
              "Would you make the same SIP decision if the market had not recently fallen?"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                2
              </span>
              <strong className="text-slate-900 text-xs font-bold">
                Household Liquidity Check
              </strong>
            </div>
            <p className="text-slate-700 text-xs font-medium leading-relaxed pl-7">
              "Has your household cash-flow situation changed?"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                3
              </span>
              <strong className="text-slate-900 text-xs font-bold">
                Goal Priority Check
              </strong>
            </div>
            <p className="text-slate-700 text-xs font-medium leading-relaxed pl-7">
              "Has your investment horizon or goal priority changed?"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                4
              </span>
              <strong className="text-slate-900 text-xs font-bold">
                Volatility Tolerance Check
              </strong>
            </div>
            <p className="text-slate-700 text-xs font-medium leading-relaxed pl-7">
              "Has your tolerance for investment volatility changed?"
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4 — BEHAVIORAL SIGNAL */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Decision Context Signal
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Decision Date: {m5.decisionDate}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-950">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-sm text-amber-950 block">
                Your contribution change occurred during a period of market weakness on {m5.decisionDate}.
              </strong>
              <p className="text-amber-900/90 text-xs leading-relaxed">
                This does not mean the decision was caused by market emotion. MOMENT is simply highlighting the timing so you can consider whether short-term market conditions should influence a long-term contribution decision.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <strong>Behavioral Guardrail:</strong> MOMENT never labels you as emotional, irrational, panic-selling, loss-averse, or financially biased. The timing context is surfaced solely to empower deliberate, self-guided review.
        </div>
      </div>

      {/* SECTION 5 — LONG-TERM PERSPECTIVE (STANDARDIZED TIMELINE EVOLUTION) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Perspective Alignment
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Short-term movement vs. long-term goal
            </h3>
          </div>
          <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Timeline: Decision Date ({m5.decisionDate}) vs. Simulated Follow-Up Context ({m5.followUpDate})
          </span>
        </div>

        {/* 5 Comparison Cards with Explicit Timeline Column Headers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* 1. Market Movement */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Market Movement</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Decision ({m5.decisionDate}):</span>
                <strong className="text-rose-600">{m5.decisionMarketMovement}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70">
                <span className="text-slate-900 font-medium">Follow-Up ({m5.followUpDate}):</span>
                <strong className="text-amber-700">{m5.followUpMarketMovement}%</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1 border-t border-slate-200/40">
              +{m5.marketMovementChange}% recovery from dip
            </span>
          </div>

          {/* 2. Portfolio Movement */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Portfolio Movement</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Decision ({m5.decisionDate}):</span>
                <strong className="text-amber-700">{m5.decisionPortfolioMovement}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70">
                <span className="text-slate-900 font-medium">Follow-Up ({m5.followUpDate}):</span>
                <strong className="text-amber-700">{m5.followUpPortfolioMovement}%</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1 border-t border-slate-200/40">
              +{m5.portfolioMovementChange}% relative rebound
            </span>
          </div>

          {/* 3. Goal Progress */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Goal Progress</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Decision ({m5.decisionDate}):</span>
                <strong className="text-slate-600">{m5.decisionGoalProgress}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70">
                <span className="text-slate-900 font-medium">Follow-Up ({m5.followUpDate}):</span>
                <strong className="text-emerald-700">{m5.followUpGoalProgress}%</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1 border-t border-slate-200/40">
              +1% funded toward ₹35L
            </span>
          </div>

          {/* 4. Accumulated Capital */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Accumulated Value</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Decision ({m5.decisionDate}):</span>
                <strong className="text-slate-600">{formatINR(m5.decisionAccumulated)}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70">
                <span className="text-slate-900 font-medium">Follow-Up ({m5.followUpDate}):</span>
                <strong className="text-slate-900">{formatINR(m5.followUpAccumulated)}</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1 border-t border-slate-200/40">
              +₹{m5.accumulatedCapitalChange.toLocaleString('en-IN')} growth
            </span>
          </div>

          {/* 5. Monthly SIP Pace */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly SIP</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Prior to Decision:</span>
                <strong className="text-slate-400 line-through">{formatINR(m5.decisionSip)}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70">
                <span className="text-slate-900 font-medium">Active SIP:</span>
                <strong className="text-indigo-700">{formatINR(m5.followUpSip)}</strong>
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-medium block pt-1 border-t border-slate-200/40">
              Active reduced pace
            </span>
          </div>
        </div>

        {/* Timeline Explanation Banner explaining the progression */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-slate-900 font-bold">
                Timeline Progression: How your context evolved since October 5, 2026
              </strong>
              <p className="text-[11px] text-slate-600">
                Between your Decision Date ({m5.decisionDate}) and the Simulated Follow-Up Context ({m5.followUpDate}), regular monthly compounding at the reduced ₹12,500 pace combined with simulated market stabilization added ₹27,000 to your accumulated capital (growing from ₹24,85,000 to ₹25,12,000), advancing goal progress from 71% to 72%.
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Your market and portfolio context has improved since the decision, while your contribution level remains reduced. This improvement does not prove the decision was right or wrong.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 — SCENARIO CONTEXT */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Mathematical Engine Reference
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Scenario Context
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Target: {formatINR(m5.goalTarget)}
          </span>
        </div>

        {/* 3 Scenario Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 uppercase text-[11px]">CONTINUE</span>
              <span className="text-[10px] font-bold text-emerald-800">{formatINR(calculatedScenarios.continue.monthlySip)}/mo</span>
            </div>
            <strong className="text-lg font-extrabold text-slate-900 block">
              ₹{calculatedScenarios.continue.projectedValue.toLocaleString('en-IN')}
            </strong>
            <span className="text-xs font-semibold text-emerald-700 block">
              +₹{calculatedScenarios.continue.surplus.toLocaleString('en-IN')} surplus
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-1.5 ring-2 ring-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 uppercase text-[11px]">REDUCE (Active)</span>
              <span className="text-[10px] font-bold text-amber-800">{formatINR(calculatedScenarios.reduce.monthlySip)}/mo</span>
            </div>
            <strong className="text-lg font-extrabold text-slate-900 block">
              ₹{calculatedScenarios.reduce.projectedValue.toLocaleString('en-IN')}
            </strong>
            <span className="text-xs font-semibold text-emerald-700 block">
              +₹{calculatedScenarios.reduce.surplus.toLocaleString('en-IN')} surplus
            </span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/30 border border-rose-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-950 uppercase text-[11px]">PAUSE</span>
              <span className="text-[10px] font-bold text-rose-800">₹0/mo</span>
            </div>
            <strong className="text-lg font-extrabold text-slate-900 block">
              ₹{calculatedScenarios.pause.projectedValue.toLocaleString('en-IN')}
            </strong>
            <span className="text-xs font-semibold text-emerald-700 block">
              +₹{calculatedScenarios.pause.surplus.toLocaleString('en-IN')} surplus
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong>Deterministic Guardrail:</strong> These illustrations show mathematical outcomes under the existing synthetic assumptions. They do not determine which contribution level is appropriate for you.
        </div>
      </div>

      {/* SECTION 7 — INVESTOR SOVEREIGNTY */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Investor Sovereignty
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* WHAT MOMENT DOES */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              What MOMENT Does:
            </span>
            <ul className="space-y-1.5 text-emerald-900 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Highlights decision context</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Separates short-term market movement from long-term goals</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Provides reflection questions</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Shows alternative scenarios</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Helps the investor review their own reasoning</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Keeps the investor in control</span>
              </li>
            </ul>
          </div>

          {/* WHAT MOMENT NEVER DOES */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
            <span className="font-extrabold text-rose-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              What MOMENT Never Does:
            </span>
            <ul className="space-y-1.5 text-rose-900 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Diagnoses investor psychology</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Labels the investor as emotional or irrational</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Tells the investor what decision to make</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Guarantees investment outcomes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Executes transactions</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Overrides investor intent</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 8 — AI EXPLANATION */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                Behavioral Intelligence
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                MOMENT Behavioral Synthesis
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Synthesizing decision reflection...
              </span>
            ) : intelligence?.isAiGenerated && !intelligence?.isFallback ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Gemini Context Synthesis
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Deterministic Reflection Engine
              </span>
            )}

            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              Illustrative Follow-Up: {m5.followUpDate}
            </span>

            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Non-Diagnostic
            </span>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100 space-y-3.5 text-xs">
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {intelligence?.contextObservation ||
              `On your Decision Date (${m5.decisionDate}), you chose to reduce your monthly contribution from ₹25,000 to ₹12,500 amid an 8.2% market drawdown and a 6.8% portfolio pullback, when your Child Education goal was 71% funded with ₹24,85,000 accumulated.`}
          </p>

          <div className="pt-2 border-t border-indigo-50 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Contextual Influences Observed on Decision Date ({m5.decisionDate}):
            </span>
            <ul className="space-y-1 text-slate-600">
              {(intelligence?.possibleInfluences || [
                `Simulated short-term market volatility and headline uncertainty on ${m5.decisionDate}`,
                'Portfolio drawdown of -6.8% creating heightened awareness of short-term volatility',
                'Household desire for monthly cash-flow flexibility and near-term liquidity buffer',
                'Confidence in the remaining 6.0-year timeline alongside ₹24.85L in accumulated corpus',
                'Preference to maintain ongoing investment discipline through a reduced commitment rather than halting completely',
              ]).map((influence, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{influence}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] text-slate-600 leading-relaxed">
            <strong>Long-Term Perspective:</strong> {intelligence?.longTermPerspective || `In the subsequent Simulated Follow-Up Context (Follow-up observation — ${m5.followUpDate}), simulated market movement moderated to -4.8% and portfolio movement to -3.9%, while your accumulated corpus grew by ₹27,000 to reach ₹25,12,000 (advancing goal progress from 71% to 72%). Your market and portfolio context has improved since the decision, while your contribution level remains reduced. This improvement does not prove the decision was right or wrong, but offers an updated perspective for your long-term 2032 milestone.`}
          </div>
        </div>
      </div>

      {/* SECTION 9 — FINAL CTA */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Your decision remains yours.
          </h4>
          <p className="text-xs text-slate-500">
            MOMENT helps you reflect on your decision context. You remain responsible for every financial decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('simulator')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Review Current Scenario</span>
          </button>

          <button
            onClick={() => navigateTo('decision-memory')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Review Decision Memory</span>
          </button>

          <button
            onClick={() => navigateTo('decision-brief')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Decision Brief</span>
          </button>

          <button
            onClick={() => navigateTo('moment-intervention')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to MOMENT</span>
          </button>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

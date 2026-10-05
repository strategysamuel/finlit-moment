import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AUTHORITATIVE_M5_COMPARISON, SYNTHETIC_FOLLOW_UP_DATA } from '../data/followUpData';
import { FollowUpIntelligenceResponse } from '../types/followUp';
import { DEMO_INVESTOR, DEMO_GOALS } from '../data/demoData';
import { getAllCalculatedScenarios } from '../services/scenarioEngine';
import { formatINR } from '../utils/formatters';
import { aiService } from '../services/aiService';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  Compass,
  Calendar,
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
  GitCompare,
  Lightbulb,
  Check,
  Loader2,
  Shield,
  XCircle,
  History,
  RotateCcw,
  FileText,
} from 'lucide-react';

export const FollowUpPage: React.FC = () => {
  const { navigateTo } = useApp();

  // Authoritative single source of truth for M5 comparison
  const m5 = AUTHORITATIVE_M5_COMPARISON;
  const primaryGoal = DEMO_GOALS[0];

  // Authoritative deterministic scenario calculation engine
  const calculatedScenarios = getAllCalculatedScenarios();
  const reduceScenario = calculatedScenarios.reduce;

  // AI-powered Follow-Up Intelligence State
  const [intelligence, setIntelligence] = useState<FollowUpIntelligenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadFollowUpIntelligence() {
      setIsLoading(true);
      try {
        const res = await aiService.generateFollowUpIntelligence({
          followUpData: SYNTHETIC_FOLLOW_UP_DATA,
          investor: DEMO_INVESTOR,
          goal: primaryGoal,
          scenarioOutputs: calculatedScenarios,
        });
        if (!isCancelled) {
          setIntelligence(res);
        }
      } catch (err) {
        console.warn('Could not load AI follow-up intelligence:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFollowUpIntelligence();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>MOMENT Follow-Up • Milestone 5</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            Decision continuity
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Synthetic Demo Data
          </span>
        </div>
      </div>

      {/* Main Page Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          MOMENT Follow-Up
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          See what changed after your decision — and whether it changes the context around your goal.
        </p>
      </div>

      {/* 2. HERO SECTION: MOMENT CHECK-IN */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              MOMENT CHECK-IN
            </span>
            <span className="text-xs text-indigo-200 font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Check-in Date: {m5.followUpDate}
            </span>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Your decision has a story. Let's see what changed.
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              You previously reduced your monthly SIP to ₹12,500. MOMENT can compare your decision context with the latest simulated conditions so you can review your position before making another change.
            </p>
          </div>

          {/* Decision Context Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/15 text-xs">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
              <span className="text-indigo-200 block text-[10px] font-medium">Recorded Decision</span>
              <strong className="text-white text-sm block mt-0.5">{m5.decisionAction}</strong>
              <span className="text-[10px] text-amber-300">50% Allocation</span>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
              <span className="text-indigo-200 block text-[10px] font-medium">Previous SIP</span>
              <strong className="text-white text-sm block mt-0.5">{formatINR(m5.decisionSip)}</strong>
              <span className="text-[10px] text-indigo-300">/month</span>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
              <span className="text-indigo-200 block text-[10px] font-medium">Current Active SIP</span>
              <strong className="text-emerald-300 text-sm block mt-0.5">{formatINR(m5.followUpSip)}</strong>
              <span className="text-[10px] text-indigo-300">/month</span>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
              <span className="text-indigo-200 block text-[10px] font-medium">Decision Date</span>
              <strong className="text-white text-sm block mt-0.5">{m5.decisionDate}</strong>
              <span className="text-[10px] text-indigo-300">Initial Review</span>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
              <span className="text-indigo-200 block text-[10px] font-medium">Linked Goal</span>
              <strong className="text-white text-sm block mt-0.5">{m5.goalName}</strong>
              <span className="text-[10px] text-indigo-300">Target {formatINR(m5.goalTarget)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTEXT CHANGE SUMMARY: AT DECISION VS CURRENT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Context Change Summary
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What changed since your decision?
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Comparing {m5.decisionDate} vs. {m5.followUpDate} (Simulated)
          </span>
        </div>

        {/* 5 Comparison Cards with "At Decision" vs "Current" (Authoritative Object Derived) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. Market Movement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Market Movement
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">At Decision:</span>
                <strong className="text-rose-600">{m5.decisionMarketMovement}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-900 font-semibold">Current:</span>
                <strong className="text-amber-700">{m5.followUpMarketMovement}%</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1">
              +{m5.marketMovementChange}% recovery from dip
            </span>
          </div>

          {/* 2. Portfolio Movement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Portfolio Movement
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">At Decision:</span>
                <strong className="text-amber-700">{m5.decisionPortfolioMovement}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-900 font-semibold">Current:</span>
                <strong className="text-amber-700">{m5.followUpPortfolioMovement}%</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1">
              +{m5.portfolioMovementChange}% relative rebound
            </span>
          </div>

          {/* 3. Goal Progress */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Goal Progress
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">At Decision:</span>
                <strong className="text-slate-700">{m5.decisionGoalProgress}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-900 font-semibold">Current:</span>
                <strong className="text-emerald-700">{m5.followUpGoalProgress}%</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block pt-1">
              Accumulated capital has increased by ₹{m5.accumulatedCapitalChange.toLocaleString('en-IN')} since the decision.
            </span>
          </div>

          {/* 4. Monthly SIP */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Monthly SIP
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">At Decision:</span>
                <strong className="text-slate-500 line-through">{formatINR(m5.decisionSip)}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-900 font-semibold">Current:</span>
                <strong className="text-indigo-700">{formatINR(m5.followUpSip)}</strong>
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-medium block pt-1">
              Active reduced pace
            </span>
          </div>

          {/* 5. Remaining Horizon */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Remaining Horizon
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">At Decision:</span>
                <strong className="text-slate-700">{m5.decisionHorizon}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-900 font-semibold">Current:</span>
                <strong className="text-indigo-700">{m5.followUpHorizon}</strong>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-1">
              Target Year 2032
            </span>
          </div>
        </div>
      </div>

      {/* 4. FOLLOW-UP INTELLIGENCE (AI-POWERED CONTEXTUAL INSIGHT) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                Contextual Follow-Up
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                MOMENT Intelligence
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Analyzing post-decision trajectory...
              </span>
            ) : intelligence?.isAiGenerated && !intelligence?.isFallback ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Gemini Follow-Up Intelligence
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Deterministic Domain Intelligence
              </span>
            )}

            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Context completeness: High
            </span>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100 space-y-3 text-xs">
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {intelligence?.summary ||
              `Since your October decision to reduce your monthly contribution to ₹12,500, the simulated market environment has shown signs of stabilization (-4.8% vs -8.2%) while your Child Education goal has progressed from 71% to 72% with accumulated capital increasing by ₹27,000. Under the current illustrative assumptions, continuing the ₹12,500 monthly contribution remains above the ₹35L target trajectory, while actual outcomes may vary.`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-indigo-50">
            <div>
              <span className="font-bold text-slate-900 block mb-1">What Changed:</span>
              <ul className="space-y-1 text-slate-600">
                {(intelligence?.whatChanged || [
                  'Market drawdown moderated from -8.2% to -4.8%',
                  'Portfolio movement improved from -6.8% to -3.9%',
                  'Accumulated capital has increased by ₹27,000 since the decision',
                  'Goal progress advanced from 71% to 72%',
                  'Active monthly capital commitment is currently at ₹12,500',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">Key Considerations for Review:</span>
              <ul className="space-y-1 text-slate-600">
                {(intelligence?.reviewFactors || [
                  'Evaluating whether current cash-flow needs still require the reduced allocation',
                  'Assessing how long-term rupee-cost averaging aligns with the 5.9-year timeline',
                  'Reviewing the goal trajectory in the Scenario Simulator before deciding on next steps',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] text-slate-700 italic">
            <strong>Neutral Observation:</strong> Under the current illustrative assumptions, continuing the ₹12,500 monthly contribution remains above the ₹35L target trajectory with an estimated surplus of +₹23,99,483. This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ.
          </div>
        </div>
      </div>

      {/* 5. GOAL CHECK: GOAL TRAJECTORY CHECK */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              GOAL TRAJECTORY CHECK
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Under the current illustrative assumptions, the goal remains above the target trajectory
          </span>
        </div>

        {/* Goal Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Target Requirement</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{formatINR(m5.goalTarget)}</strong>
            <span className="text-[10px] text-slate-500">Child Education</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Accumulated So Far</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{formatINR(m5.followUpAccumulated)}</strong>
            <span className="text-[10px] text-emerald-700 font-semibold">{m5.followUpGoalProgress}% Funded</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Current SIP Pace</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{formatINR(m5.followUpSip)}/mo</strong>
            <span className="text-[10px] text-amber-700 font-medium">Reduced 50%</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Projected 6Y Value</span>
            <strong className="text-emerald-700 text-sm block mt-0.5">
              ₹{reduceScenario.projectedValue.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-slate-500">Deterministic Engine</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Projected Surplus</span>
            <strong className="text-emerald-700 text-sm block mt-0.5">
              +₹{reduceScenario.surplus.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-emerald-700 font-semibold">Exceeds Goal</span>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">
              Under the current illustrative assumptions, the goal remains above the target trajectory.
            </strong>
            <span className="text-emerald-900/80 leading-relaxed text-[11px]">
              The current illustrative projection remains above the target, while actual outcomes may vary. Because you already have ₹25,12,000 accumulated, your current contribution pace of ₹12,500/month continues compounding to project ₹58,99,483 by Year 6 (an estimated surplus of ₹23,99,483 over your ₹35L target).
            </span>
          </div>
        </div>
      </div>

      {/* 6. DECISION RECONSIDERATION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Context Evaluation
            </span>
            <h3 className="text-base font-bold text-slate-900">
              SHOULD YOU REVIEW THE DECISION?
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            You remain fully in control. No change is automatically applied.
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          MOMENT does not automatically recommend changing your SIP. Instead, consider these contextual factors when reviewing your position:
        </p>

        {/* 5 Contextual Review Factors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">1. Market Conditions</span>
            <p className="text-slate-700 mt-1 font-medium text-[11px]">
              Market drawdown has stabilized from -8.2% to -4.8%.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">2. Portfolio Movement</span>
            <p className="text-slate-700 mt-1 font-medium text-[11px]">
              Portfolio drawdown has improved from -6.8% to -3.9%.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">3. Goal Progress</span>
            <p className="text-slate-700 mt-1 font-medium text-[11px]">
              Steady compounding advanced progress to 72% (₹25.12L).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">4. SIP Contribution</span>
            <p className="text-slate-700 mt-1 font-medium text-[11px]">
              Currently active at ₹12,500/mo, providing ongoing cash-flow relief.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">5. Remaining Horizon</span>
            <p className="text-slate-700 mt-1 font-medium text-[11px]">
              5.9 years remaining allows time to adjust pace whenever ready.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('simulator')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Review Current Scenario</span>
          </button>

          <button
            onClick={() => navigateTo('decision-memory')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Review Decision Memory</span>
          </button>
        </div>
      </div>

      {/* 7. FOLLOW-UP TIMELINE: MOMENT CONTINUITY */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Decision Journey
            </span>
            <h3 className="text-base font-bold text-slate-900">
              MOMENT CONTINUITY
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Synthetic demo timeline
          </span>
        </div>

        {/* Vertical Timeline Nodes */}
        <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {/* Node 1: July 15, 2026 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white shadow-2xs" />
            <div className="text-xs">
              <span className="text-slate-400 font-medium">July 15, 2026 • Previous MOMENT</span>
              <div className="font-bold text-slate-800 mt-0.5">
                Continue SIP (₹25,000/month)
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Market dip of -4.1%; investor maintained long-term contribution discipline.
              </p>
            </div>
          </div>

          {/* Node 2: October 5, 2026 (Intervention) */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white shadow-2xs" />
            <div className="text-xs">
              <span className="text-indigo-600 font-semibold">October 5, 2026 • MOMENT Intervention</span>
              <div className="font-bold text-slate-900 mt-0.5">
                Contemplated SIP change amid market pullback
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Market movement -8.2%, portfolio movement -6.8%. MOMENT evaluated 3 illustrative scenarios.
              </p>
            </div>
          </div>

          {/* Node 3: October 5, 2026 (Decision) - 71% GOAL FUNDED */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-2xs" />
            <div className="text-xs">
              <span className="text-amber-800 font-semibold">October 5, 2026 • Investor Decision</span>
              <div className="font-bold text-slate-900 mt-0.5">
                Reduce SIP to ₹12,500/month
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Priya chose the balanced middle ground to ease monthly cash flow while keeping 71% of the goal funded.
              </p>
            </div>
          </div>

          {/* Node 4: November 15, 2026 (Follow-Up Check-In) */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-2xs animate-pulse" />
            <div className="text-xs">
              <span className="text-emerald-800 font-semibold">Illustrative Follow-Up Observation • November 15, 2026</span>
              <div className="font-bold text-slate-900 mt-0.5">
                Reviewing position after 1 month of reduced contributions
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Markets stabilized to -4.8%; goal progress reached 72% (₹25.12L). Under the current illustrative assumptions, the goal remains above the target trajectory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. MOMENT GUARDRAIL & TRUST FRAMEWORK */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            MOMENT Guardrail & Trust Framework
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* MOMENT DOES */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              MOMENT Does:
            </span>
            <ul className="space-y-1.5 text-emerald-900 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Remembers decision context across time</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Compares previous and current context</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Explains changes in plain language</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Shows illustrative mathematical scenarios</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Helps the investor review their decision without pressure</span>
              </li>
            </ul>
          </div>

          {/* MOMENT NEVER DOES */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
            <span className="font-extrabold text-rose-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              MOMENT Never Does:
            </span>
            <ul className="space-y-1.5 text-rose-900 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Automatically changes investments or allocations</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Executes financial transactions or places market orders</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Guarantees investment returns or predicts market direction</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Overrides investor intent or acts as an autonomous broker</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Declares a single option as the "only correct" path</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* INVESTOR SOVEREIGNTY FOOTER & NAVIGATION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Investor sovereignty
          </h4>
          <p className="text-xs text-slate-500">
            MOMENT provides context, comparisons and explanations. You remain in control of every financial decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('decision-memory')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Decision Memory</span>
          </button>

          <button
            onClick={() => navigateTo('simulator')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scenario Simulator</span>
          </button>

          <button
            onClick={() => navigateTo('decision-brief')}
            className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors inline-flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Decision Brief</span>
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

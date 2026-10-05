import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AUTHORITATIVE_M5_COMPARISON } from '../data/followUpData';
import { DecisionBriefIntelligence } from '../types/decisionBrief';
import { DEMO_INVESTOR, DEMO_GOALS } from '../data/demoData';
import { getAllCalculatedScenarios } from '../services/scenarioEngine';
import { formatINR } from '../utils/formatters';
import { aiService } from '../services/aiService';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  FileText,
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
  ChevronDown,
  GitCompare,
  Lightbulb,
  Check,
  Loader2,
  Shield,
  XCircle,
  History,
  RotateCcw,
  Compass,
  Brain,
} from 'lucide-react';

export const DecisionBriefPage: React.FC = () => {
  const { navigateTo } = useApp();

  // Authoritative single sources of truth
  const m5 = AUTHORITATIVE_M5_COMPARISON;
  const primaryGoal = DEMO_GOALS[0];
  const calculatedScenarios = getAllCalculatedScenarios();

  // Expandable "Why am I seeing this?" state
  const [isWhyOpen, setIsWhyOpen] = useState<boolean>(true);

  // Gemini Decision Brief Intelligence state
  const [intelligence, setIntelligence] = useState<DecisionBriefIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadDecisionBrief() {
      setIsLoading(true);
      try {
        const res = await aiService.generateDecisionBrief({
          comparison: m5,
          scenarios: calculatedScenarios,
          investor: DEMO_INVESTOR,
          goal: primaryGoal,
        });
        if (!isCancelled) {
          setIntelligence(res);
        }
      } catch (err) {
        console.warn('Could not load AI decision brief:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDecisionBrief();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>MOMENT Decision Brief • Milestone 6</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            Contextual Decision Intelligence
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Synthetic Demo Data
          </span>
        </div>
      </div>

      {/* SECTION 1 — HERO */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          MOMENT Decision Brief
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Your decision, the context around it, and what has changed since.
        </p>

        {/* Hero Orientation Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-xs sm:text-sm text-indigo-950 flex items-start gap-3 shadow-2xs">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block text-indigo-900">
              Core Decision Support Principle: MOMENT informs the investor. The investor decides.
            </strong>
            <p className="text-indigo-900/80 text-xs leading-relaxed">
              Before you make another contribution decision, MOMENT brings together your previous decision, the latest simulated context, and the illustrative impact on your goal.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2 — EXECUTIVE CONTEXT */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Executive Context
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Your Situation at a Glance
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Illustrative follow-up observation • {m5.followUpDate}
          </span>
        </div>

        {/* 5 Compact Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {/* Market */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Market</span>
            <strong className="text-base font-extrabold text-amber-700 block">
              {m5.followUpMarketMovement}%
            </strong>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Improved from {m5.decisionMarketMovement}%
            </span>
          </div>

          {/* Portfolio */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Portfolio</span>
            <strong className="text-base font-extrabold text-amber-700 block">
              {m5.followUpPortfolioMovement}%
            </strong>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Improved from {m5.decisionPortfolioMovement}%
            </span>
          </div>

          {/* Goal Progress */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Goal Progress</span>
            <strong className="text-base font-extrabold text-emerald-700 block">
              {m5.followUpGoalProgress}%
            </strong>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Up from {m5.decisionGoalProgress}%
            </span>
          </div>

          {/* Current SIP */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current SIP</span>
            <strong className="text-base font-extrabold text-indigo-700 block">
              {formatINR(m5.followUpSip)}
            </strong>
            <span className="text-[10px] text-slate-500 font-medium block">
              per month (active)
            </span>
          </div>

          {/* Remaining Horizon */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Remaining Horizon</span>
            <strong className="text-base font-extrabold text-slate-900 block">
              {m5.followUpHorizon}
            </strong>
            <span className="text-[10px] text-slate-500 font-medium block">
              Target Year 2032
            </span>
          </div>
        </div>

        {/* Goal Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span><strong>Goal:</strong> {m5.goalName}</span>
          </div>
          <div className="font-semibold text-slate-900">
            <strong>Target:</strong> {formatINR(m5.goalTarget)}
          </div>
        </div>
      </div>

      {/* SECTION 3 — WHAT CHANGED */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Comparative Analysis
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What changed since your decision?
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Accumulated value increased by ₹{m5.accumulatedCapitalChange.toLocaleString('en-IN')} since the decision.
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Market and portfolio conditions have improved relative to the decision date, while the monthly contribution remains at the reduced level.
        </p>

        {/* Before vs Current Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* Market */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Market Movement</span>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-rose-600">{m5.decisionMarketMovement}%</span>
              <span className="text-slate-400">→</span>
              <span className="text-amber-700">{m5.followUpMarketMovement}%</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              +{m5.marketMovementChange}% recovery from dip
            </span>
          </div>

          {/* Portfolio */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Portfolio Drawdown</span>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-amber-700">{m5.decisionPortfolioMovement}%</span>
              <span className="text-slate-400">→</span>
              <span className="text-amber-700">{m5.followUpPortfolioMovement}%</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              +{m5.portfolioMovementChange}% relative rebound
            </span>
          </div>

          {/* Goal Progress */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Goal Progress</span>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-slate-600">{m5.decisionGoalProgress}%</span>
              <span className="text-slate-400">→</span>
              <span className="text-emerald-700">{m5.followUpGoalProgress}%</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              +{m5.goalProgressChange}% funded toward ₹35L
            </span>
          </div>

          {/* Accumulated Corpus */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Accumulated Value</span>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-slate-600">{formatINR(m5.decisionAccumulated)}</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-900">{formatINR(m5.followUpAccumulated)}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              +₹{m5.accumulatedCapitalChange.toLocaleString('en-IN')} capital growth
            </span>
          </div>

          {/* Monthly SIP */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly SIP</span>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-slate-400 line-through">{formatINR(m5.decisionSip)}</span>
              <span className="text-slate-400">→</span>
              <span className="text-indigo-700">{formatINR(m5.followUpSip)}</span>
            </div>
            <span className="text-[10px] text-amber-700 font-medium block">
              Active reduced pace
            </span>
          </div>

          {/* Horizon */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Remaining Horizon</span>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span className="text-slate-600">{m5.decisionHorizon}</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-900">{m5.followUpHorizon}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              Target year 2032
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4 — YOUR PREVIOUS DECISION */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Decision Record
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What did you decide?
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Investor-controlled decision
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Decision Action</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{m5.decisionAction}</strong>
            <span className="text-[10px] text-amber-700">50% allocation</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Previous SIP</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{formatINR(m5.decisionSip)}</strong>
            <span className="text-[10px] text-slate-500">per month</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Current Active SIP</span>
            <strong className="text-indigo-700 text-sm block mt-0.5">{formatINR(m5.followUpSip)}</strong>
            <span className="text-[10px] text-indigo-600">per month</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Decision Date</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{m5.decisionDate}</strong>
            <span className="text-[10px] text-slate-500">Goal Progress: {m5.decisionGoalProgress}%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong>Contextual Intent:</strong> You chose a lower contribution level while maintaining flexibility around your monthly cash flow. MOMENT recorded this context to support your decision continuity.
        </div>
      </div>

      {/* SECTION 5 — WHAT THE SCENARIOS SHOW */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Deterministic Scenario Engine
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              What does the current illustration show?
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Goal Target: {formatINR(m5.goalTarget)}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          These are deterministic illustrations using the existing scenario engine — not forecasts or guarantees.
        </p>

        {/* 3 Scenario Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* CONTINUE */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 uppercase tracking-wider text-[11px]">
                CONTINUE
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                {formatINR(calculatedScenarios.continue.monthlySip)}/mo
              </span>
            </div>
            <div className="pt-1">
              <strong className="text-lg font-extrabold text-slate-900 block">
                ₹{calculatedScenarios.continue.projectedValue.toLocaleString('en-IN')}
              </strong>
              <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                +₹{calculatedScenarios.continue.surplus.toLocaleString('en-IN')} surplus
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block pt-1 border-t border-emerald-100">
              Standard regular pace
            </span>
          </div>

          {/* REDUCE */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-2 text-xs ring-2 ring-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 uppercase tracking-wider text-[11px]">
                REDUCE (Current)
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                {formatINR(calculatedScenarios.reduce.monthlySip)}/mo
              </span>
            </div>
            <div className="pt-1">
              <strong className="text-lg font-extrabold text-slate-900 block">
                ₹{calculatedScenarios.reduce.projectedValue.toLocaleString('en-IN')}
              </strong>
              <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                +₹{calculatedScenarios.reduce.surplus.toLocaleString('en-IN')} surplus
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block pt-1 border-t border-amber-100">
              Active reduced pace
            </span>
          </div>

          {/* PAUSE */}
          <div className="p-4 rounded-xl bg-rose-50/30 border border-rose-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-rose-950 uppercase tracking-wider text-[11px]">
                PAUSE
              </span>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded-full">
                ₹0/mo
              </span>
            </div>
            <div className="pt-1">
              <strong className="text-lg font-extrabold text-slate-900 block">
                ₹{calculatedScenarios.pause.projectedValue.toLocaleString('en-IN')}
              </strong>
              <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                +₹{calculatedScenarios.pause.surplus.toLocaleString('en-IN')} surplus
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block pt-1 border-t border-rose-100">
              Existing corpus compounding
            </span>
          </div>
        </div>

        {/* Clear Trajectory Callout */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <strong className="font-bold block">
            All three scenarios remain above the ₹35L target under the current illustrative assumptions.
          </strong>
          <p className="text-[11px] text-emerald-900/80 leading-relaxed">
            Actual investment outcomes may differ. This illustration does not predict future returns.
          </p>
        </div>
      </div>

      {/* SECTION 6 — MOMENT INTELLIGENCE */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                Decision Synthesis
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
                Synthesizing Decision Brief...
              </span>
            ) : intelligence?.isAiGenerated && !intelligence?.isFallback ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Gemini Context Synthesis
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Deterministic Decision Synthesis
              </span>
            )}

            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Confidence: {intelligence?.confidence || 'context-complete'}
            </span>
          </div>
        </div>

        {/* Narrative Synthesis Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100 space-y-3.5 text-xs">
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {intelligence?.summary ||
              "Since your October decision, the simulated market and portfolio movements have improved, while your goal progress has increased from 71% to 72%. Your current ₹12,500 monthly contribution remains associated with a projected surplus under the illustrative scenario assumptions."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-indigo-50">
            <div>
              <span className="font-bold text-slate-900 block mb-1">What Changed:</span>
              <ul className="space-y-1 text-slate-600">
                {(intelligence?.whatChanged || [
                  'Market drawdown moderated from -8.2% to -4.8%',
                  'Portfolio drawdown recovered from -6.8% to -3.9%',
                  'Accumulated value increased by ₹27,000 since the decision',
                  'Goal progress advanced from 71% to 72%',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">What Stayed Consistent:</span>
              <ul className="space-y-1 text-slate-600">
                {(intelligence?.whatStayedConsistent || [
                  'Child Education target remains ₹35,00,000',
                  'Active monthly SIP is at ₹12,500',
                  'All 3 deterministic scenarios remain above target',
                  'Investor sovereignty: Priya remains in full control',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Factors to Review */}
          <div className="pt-2 border-t border-indigo-50 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Factors You May Want to Review:
            </span>
            <ul className="space-y-1 text-slate-600">
              {(intelligence?.reviewFactors || [
                'Whether the reduced contribution still fits your longer-term goal priorities',
                'Whether your monthly cash-flow preference has changed',
                'Whether the current contribution level remains appropriate as your circumstances evolve',
                'Whether the assumptions used in the illustration remain reasonable for your planning horizon',
              ]).map((factor, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] text-slate-600">
            <strong>Illustration Note:</strong> {intelligence?.disclaimer || 'This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. MOMENT does not execute transactions. The investor remains in full control.'}
          </div>
        </div>
      </div>

      {/* SECTION 7 — WHAT MATTERS MOST */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            What matters most right now?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">1. Compounding Progress</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Goal progress has continued to increase to 72% with ₹25,12,000 accumulated.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">2. Context Stabilization</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Market and portfolio movements have improved from the October decision date (-4.8% vs -8.2%).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">3. Contribution Level</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Your SIP remains active at the reduced ₹12,500/month level, maintaining ongoing liquidity.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">4. Investment Horizon</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              You still have approximately 5.9 years remaining until your target horizon in 2032.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 8 — WHAT YOU CAN DO NEXT */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Investor-Controlled Actions
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Your next step
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Explore options freely. No action or trade is automatically executed.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            onClick={() => navigateTo('simulator')}
            className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Review Current Scenario</span>
          </button>

          <button
            onClick={() => navigateTo('decision-memory')}
            className="p-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span>Review Decision Memory</span>
          </button>

          <button
            onClick={() => navigateTo('decision-reflection')}
            className="p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>Decision Reflection</span>
          </button>

          <button
            onClick={() => navigateTo('moment-intervention')}
            className="p-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Return to MOMENT</span>
          </button>

          <button
            onClick={() => navigateTo('goals')}
            className="p-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Review Goal</span>
          </button>
        </div>
      </div>

      {/* SECTION 9 — WHY AM I SEEING THIS? (EXPANDABLE) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        <button
          onClick={() => setIsWhyOpen(!isWhyOpen)}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Why am I seeing this?
            </h3>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isWhyOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isWhyOpen && (
          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100 text-xs text-slate-600 space-y-3">
            <p className="leading-relaxed">
              MOMENT surfaces this brief because you previously recorded a contribution decision and there is now updated simulated context associated with that decision.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block font-semibold">1. Decision History</strong>
                <span className="text-[11px] text-slate-500">
                  You reduced your SIP to ₹12,500/month on October 5, 2026.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block font-semibold">2. Updated Context</strong>
                <span className="text-[11px] text-slate-500">
                  Simulated market drawdown has moderated from -8.2% to -4.8%.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block font-semibold">3. Goal Progress</strong>
                <span className="text-[11px] text-slate-500">
                  Accumulated capital reached ₹25,12,000 (+₹27,000 increase).
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block font-semibold">4. Scenario Results</strong>
                <span className="text-[11px] text-slate-500">
                  All three scenarios remain above target under illustrative assumptions.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block font-semibold">5. Follow-Up Continuity</strong>
                <span className="text-[11px] text-slate-500">
                  Provides longitudinal decision context over a 5.9-year timeline.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                <strong className="text-slate-900 block font-semibold">6. Zero Execution</strong>
                <span className="text-[11px] text-slate-500">
                  MOMENT does not automatically change your investments or execute transactions.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 10 — INVESTOR SOVEREIGNTY */}
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
                <span>Remembers decision context</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Compares previous and current context</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Explains information in plain language</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Shows deterministic illustrative scenarios</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Helps the investor review their position</span>
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
                <span>Automatically executes investments</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Places orders</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Guarantees returns</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Predicts market direction</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Overrides investor intent</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Presents an illustration as a guaranteed outcome</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Claims there is only one correct decision</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* DISCLOSURE FOOTER */}
      <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
        <strong>Synthetic Demo Data:</strong> Data and scenarios shown are illustrative and for prototype demonstration purposes. Actual investment outcomes may differ.
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

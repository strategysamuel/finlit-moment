import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MomentDecisionRecord, MemoryComparisonInsight } from '../types/decisionMemory';
import { DEMO_INVESTOR } from '../data/demoData';
import { formatINR } from '../utils/formatters';
import { aiService } from '../services/aiService';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  History,
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
  RotateCcw,
  FileText,
} from 'lucide-react';

export const DecisionMemoryPage: React.FC = () => {
  const {
    navigateTo,
    decisionMemoryRecords,
    selectedMemoryId,
    setSelectedMemoryId,
  } = useApp();

  const selectedRecord: MomentDecisionRecord =
    decisionMemoryRecords.find((r) => r.id === selectedMemoryId) ||
    decisionMemoryRecords[0];

  const currentRecord = decisionMemoryRecords[0];
  const previousRecord = decisionMemoryRecords[1] || decisionMemoryRecords[0];

  // Gemini Comparison Insight State
  const [comparison, setComparison] = useState<MemoryComparisonInsight | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState<boolean>(false);

  // Load contextual comparison on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadComparison() {
      setIsLoadingComparison(true);
      try {
        const res = await aiService.compareDecisionMemories({
          currentRecord,
          previousRecord,
          investor: DEMO_INVESTOR,
        });
        if (!isCancelled) {
          setComparison(res);
        }
      } catch (e) {
        console.warn('Could not load AI decision memory comparison:', e);
      } finally {
        if (!isCancelled) {
          setIsLoadingComparison(false);
        }
      }
    }

    loadComparison();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
          <History className="w-3.5 h-3.5 text-indigo-600" />
          <span>Decision Memory • Milestone 4</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Synthetic Demo Data
          </span>
          <button
            onClick={() => navigateTo('moment-intervention')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to MOMENT</span>
          </button>
        </div>
      </div>

      {/* Main Header & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Decision Memory
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          See how your past decisions were understood — and what's different today.
        </p>

        {/* Explanatory Statement Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            MOMENT remembers decision context so you can compare today's situation with previous decisions. It does not execute or recommend transactions.
          </p>
        </div>
      </div>

      {/* WHAT'S DIFFERENT TODAY? (CORE M4 COMPARISON SECTION) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                Context Comparison
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                What's different today?
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoadingComparison ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Comparing decision contexts...
              </span>
            ) : comparison?.isAiGenerated && !comparison?.isFallback ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                MOMENT Memory Intelligence
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Deterministic Context Comparison
              </span>
            )}
          </div>
        </div>

        {/* Side-by-Side Metric Comparison Cards: Today vs Previous */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today Card */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900">
                TODAY (October 5, 2026)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Current Intervention
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">Market Movement</span>
                <strong className="text-rose-600 font-bold text-sm block mt-0.5">
                  {currentRecord.marketMovement}%
                </strong>
                <span className="text-[9px] text-slate-400">Nifty 50</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">Portfolio Drawdown</span>
                <strong className="text-amber-700 font-bold text-sm block mt-0.5">
                  {currentRecord.portfolioMovement}%
                </strong>
                <span className="text-[9px] text-slate-400">+1.4% relative buffer</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">Goal Progress</span>
                <strong className="text-emerald-700 font-bold text-sm block mt-0.5">
                  {currentRecord.goalProgress}%
                </strong>
                <span className="text-[9px] text-slate-400">{formatINR(currentRecord.accumulatedAmount)}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">Time Remaining</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {currentRecord.remainingHorizon}
                </strong>
                <span className="text-[9px] text-slate-400">Target Year 2032</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">Committed SIP</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {formatINR(currentRecord.currentSip)}
                </strong>
                <span className="text-[9px] text-slate-400">/month</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">Risk Profile</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {currentRecord.riskProfile}
                </strong>
                <span className="text-[9px] text-slate-400">Unchanged</span>
              </div>
            </div>
          </div>

          {/* Previous Moment Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                PREVIOUS MOMENT (July 15, 2026)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Historical Record
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Market Movement</span>
                <strong className="text-amber-700 font-bold text-sm block mt-0.5">
                  {previousRecord.marketMovement}%
                </strong>
                <span className="text-[9px] text-slate-400">Mild pullback</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Portfolio Drawdown</span>
                <strong className="text-amber-700 font-bold text-sm block mt-0.5">
                  {previousRecord.portfolioMovement}%
                </strong>
                <span className="text-[9px] text-slate-400">Moderate dip</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Goal Progress</span>
                <strong className="text-slate-700 font-bold text-sm block mt-0.5">
                  {previousRecord.goalProgress}%
                </strong>
                <span className="text-[9px] text-slate-400">{formatINR(previousRecord.accumulatedAmount)}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Time Remaining</span>
                <strong className="text-slate-700 font-bold text-sm block mt-0.5">
                  {previousRecord.remainingHorizon}
                </strong>
                <span className="text-[9px] text-slate-400">Earlier stage</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Committed SIP</span>
                <strong className="text-slate-700 font-bold text-sm block mt-0.5">
                  {formatINR(previousRecord.currentSip)}
                </strong>
                <span className="text-[9px] text-slate-400">/month</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Decision Made</span>
                <strong className="text-emerald-700 font-bold text-sm block mt-0.5">
                  {previousRecord.investorDecision}
                </strong>
                <span className="text-[9px] text-slate-400">Disciplined path</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Neutral Comparison Narrative */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 border border-indigo-100 space-y-3 text-xs">
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {comparison?.summary ||
              "Today's market movement is more pronounced (-8.2% vs -4.1%) than in the previous recorded decision, while your goal progress has increased from 62% to 71%. The remaining horizon is still long enough to evaluate the decision in the context of the full goal rather than short-term market movement."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-indigo-50">
            <div>
              <span className="font-bold text-slate-900 block mb-1">What Changed:</span>
              <ul className="space-y-1 text-slate-600">
                {(comparison?.whatChanged || [
                  'Market decline is steeper today (-8.2% vs -4.1% in July)',
                  'Portfolio drawdown is lower (-6.8% vs -3.2% in July)',
                  'Goal progress has increased from 62% to 71% (accumulated ₹24.85L vs ₹21.70L)',
                  'Remaining horizon is 6.0 years until 2032',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">What Stayed Similar:</span>
              <ul className="space-y-1 text-slate-600">
                {(comparison?.whatStayedSimilar || [
                  'Committed monthly contribution remains ₹25,000',
                  'Investor risk profile remains Moderate',
                  'Primary goal anchor remains Child Education (₹35L target)',
                  'Investor sovereignty: every choice remains under your direct control',
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
            <strong>Contextual Observation:</strong>{' '}
            {comparison?.neutralObservation ||
              'Evaluating decisions against long-term goal horizons helps prevent emotional reactions to short-term market volatility.'}
          </div>
        </div>
      </div>

      {/* DECISION TIMELINE & DETAIL VIEW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Decision Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recorded Decisions
            </h3>
            <span className="text-xs text-slate-400">
              {decisionMemoryRecords.length} historical records
            </span>
          </div>

          <div className="space-y-3">
            {decisionMemoryRecords.map((rec, index) => {
              const isSelected = rec.id === selectedMemoryId;
              const isLatest = index === 0;

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedMemoryId(rec.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-100'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {rec.date}
                    </span>
                    {isLatest ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Current
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Previous
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-base font-bold text-slate-900">
                      {rec.investorDecision} ({formatINR(rec.currentSip)}/month)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {rec.goalName} • {rec.goalProgress}% goal progress
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Market Movement</span>
                      <strong className="text-slate-800">{rec.marketMovement}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Portfolio Movement</span>
                      <strong className="text-slate-800">{rec.portfolioMovement}%</strong>
                    </div>
                  </div>

                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 line-clamp-2">
                    "{rec.momentSummary}"
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Investor-controlled
                    </span>
                    <span className="font-medium text-indigo-600 inline-flex items-center gap-0.5">
                      Inspect Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Decision Detail View (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                  Decision Record Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedRecord.date}: {selectedRecord.investorDecision}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {selectedRecord.goalName}
              </span>
            </div>

            {/* A. CONTEXT AT THE MOMENT */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                A. Context at the Moment
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Market Movement</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">
                    {selectedRecord.marketMovement}%
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Portfolio Movement</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">
                    {selectedRecord.portfolioMovement}%
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Goal Progress</span>
                  <strong className="text-emerald-700 font-bold block mt-0.5">
                    {selectedRecord.goalProgress}%
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Accumulated</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">
                    {formatINR(selectedRecord.accumulatedAmount)}
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Risk Profile</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">
                    {selectedRecord.riskProfile}
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Remaining Horizon</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">
                    {selectedRecord.remainingHorizon}
                  </strong>
                </div>
              </div>
            </div>

            {/* B. WHAT MOMENT SHOWED (REUSING AUTHORITATIVE M3 NUMBERS) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                B. What MOMENT Showed (Illustrative Scenarios)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Continue */}
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">CONTINUE</span>
                    <span className="text-[10px] font-bold text-emerald-700">₹25k/mo</span>
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-slate-900">
                    ₹{selectedRecord.scenariosSnapshot.continue.projectedValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    +₹{selectedRecord.scenariosSnapshot.continue.surplus.toLocaleString('en-IN')} Surplus
                  </div>
                </div>

                {/* Reduce */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">REDUCE</span>
                    <span className="text-[10px] font-bold text-amber-700">₹12.5k/mo</span>
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-slate-900">
                    ₹{selectedRecord.scenariosSnapshot.reduce.projectedValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    +₹{selectedRecord.scenariosSnapshot.reduce.surplus.toLocaleString('en-IN')} Surplus
                  </div>
                </div>

                {/* Pause */}
                <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">PAUSE</span>
                    <span className="text-[10px] font-bold text-rose-700">₹0/mo</span>
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-slate-900">
                    ₹{selectedRecord.scenariosSnapshot.pause.projectedValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    +₹{selectedRecord.scenariosSnapshot.pause.surplus.toLocaleString('en-IN')} Surplus
                  </div>
                </div>
              </div>
            </div>

            {/* C. WHAT THE INVESTOR DECIDED */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                C. What the Investor Decided
              </span>
              <strong className="text-base font-extrabold text-slate-900 block">
                {selectedRecord.investorDecision}
              </strong>
            </div>

            {/* D. WHY */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                D. Why (Context Reason)
              </span>
              <p className="text-slate-700 leading-relaxed">
                "{selectedRecord.decisionReason}"
              </p>
            </div>

            {/* E. WHAT HAPPENED NEXT */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs">
              <span className="text-emerald-800 block text-[10px] uppercase font-bold tracking-wider">
                E. What Happened Next
              </span>
              <p className="text-emerald-900 font-medium">
                {selectedRecord.followUpStatus}
              </p>
              <span className="text-[10px] text-slate-500 block">
                No real transaction occurred. Synthetic demo record preserved for decision continuity.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY THIS MATTERS EDUCATIONAL SECTION */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Why Decision Memory?
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Financial decisions happen in context. Remembering that context helps you compare today's situation with previous decisions instead of reacting to a single market movement.
        </p>
        <div className="pt-2 text-xs font-semibold text-indigo-700">
          "MOMENT does not decide for you. It helps you understand your decision in context."
        </div>
      </div>

      {/* INVESTOR SOVEREIGNTY FOOTER */}
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
            onClick={() => navigateTo('moment-intervention')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to MOMENT</span>
          </button>

          <button
            onClick={() => navigateTo('simulator')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scenario Simulator</span>
          </button>

          <button
            onClick={() => navigateTo('follow-up')}
            className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Follow-Up Intelligence</span>
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

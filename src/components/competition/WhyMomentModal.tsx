import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Shield,
  SlidersHorizontal,
  Target,
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingDown,
  Compass,
  FileText,
  History,
  RotateCcw,
  Layers,
  Cpu,
  Calculator,
  Lock,
} from 'lucide-react';

export const WhyMomentModal: React.FC = () => {
  const {
    isWhyMomentOpen,
    setIsWhyMomentOpen,
    startCompetitionDemo,
    resetDemo,
  } = useApp();

  if (!isWhyMomentOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Competition Readiness Briefing • M8
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-200 border border-amber-400/30">
                Synthetic Demo Data
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              FinLit MOMENT
            </h2>
            <p className="text-sm sm:text-base font-medium text-indigo-200">
              "Pause. Understand. Decide."
            </p>
          </div>

          <button
            onClick={() => setIsWhyMomentOpen(false)}
            className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-7 text-xs sm:text-sm text-slate-700">
          {/* SECTION 1: CORE PROPOSITION & WHY MOMENT EXISTS */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 block">
              Core Value Proposition
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              FinLit MOMENT is an AI-powered financial decision-support layer that intervenes at a critical investment decision moment and helps the investor understand context, consequences and alternatives while keeping the investor fully in control.
            </p>
            <div className="pt-2 border-t border-indigo-200/80 text-xs text-indigo-950 space-y-2 leading-relaxed">
              <strong className="block text-indigo-900 font-bold">Why MOMENT Exists:</strong>
              <p>
                Investors often make important contribution decisions during periods of uncertainty. MOMENT creates a pause between the impulse to act and the action itself.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-[11px] text-indigo-900">
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Market Context</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Portfolio Context</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Goal Progress</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Risk Profile</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Investment Horizon</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Scenario Impact</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Decision History</span>
                <span className="p-2 rounded-lg bg-white/80 border border-indigo-100">• Longitudinal Follow-Up</span>
              </div>
              <p className="text-[11px] text-indigo-900/80 pt-1">
                so the investor can make a more informed, reflective decision rather than reacting to short-term market noise.
              </p>
            </div>
          </div>

          {/* SECTION 2: ONE-MINUTE STORY */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Narrative Flow
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                The One-Minute Story: From Reaction to Reflection
              </h3>
              <p className="text-xs text-slate-500">
                MOMENT turns a high-stakes investment action into an informed decision journey.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">STEP 1</span>
                <strong className="text-slate-900 block mt-0.5">Market Falls</strong>
                <span className="text-slate-500 text-[10px]">Simulated -8.2% drop</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">STEP 2</span>
                <strong className="text-slate-900 block mt-0.5">SIP Review</strong>
                <span className="text-slate-500 text-[10px]">Priya considers pausing</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-600 block">STEP 3</span>
                <strong className="text-indigo-950 block mt-0.5">MOMENT Intervenes</strong>
                <span className="text-indigo-700 text-[10px]">Contextual pause</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-600 block">STEP 4</span>
                <strong className="text-indigo-950 block mt-0.5">AI Explains Context</strong>
                <span className="text-indigo-700 text-[10px]">Gemini synthesis</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 block">STEP 5</span>
                <strong className="text-emerald-950 block mt-0.5">What-If Scenarios</strong>
                <span className="text-emerald-800 text-[10px]">Deterministic engine</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 block">STEP 6</span>
                <strong className="text-emerald-950 block mt-0.5">Sovereign Decision</strong>
                <span className="text-emerald-800 text-[10px]">Priya chooses Reduce</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">STEP 7</span>
                <strong className="text-slate-900 block mt-0.5">Decision Memory</strong>
                <span className="text-slate-500 text-[10px]">Context journaled</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">STEP 8</span>
                <strong className="text-slate-900 block mt-0.5">Follow-Up & Brief</strong>
                <span className="text-slate-500 text-[10px]">Longitudinal reflection</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: WHY FINLIT MOMENT IS DIFFERENT */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Competitive Distinction
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Why FinLit MOMENT Is Different
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-semibold">1. Decision-Moment Intelligence</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  AI appears proactively at the precise inflection point when the investor is about to make a change, not as a passive standalone chatbot.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-semibold">2. Context Before Action</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Market movements, portfolio performance, goal horizons, and liquidity preferences are evaluated holistically before any change is recorded.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-semibold">3. Deterministic Financial Impact</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Compounding simulations and scenario values are calculated strictly by mathematical application code, never hallucinated by generative AI.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-semibold">4. Behavioral Guardrails</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  MOMENT reflects context without diagnosing or labeling investor psychology (no "panic selling", "loss aversion", or "irrationality").
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                <strong className="text-slate-900 block font-semibold">5. Complete Investor Sovereignty</strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  MOMENT never executes transactions, never places brokerage orders, and never tells Priya what she must do. The investor is always in control.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: EXPLICIT AI ARCHITECTURAL ROLES */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Technical Governance
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Making the AI Role Explicit
              </h3>
            </div>

            {/* Architecture Flow Diagrams */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Context Synthesis Architecture */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <strong className="text-indigo-950 font-bold block text-[11px] uppercase tracking-wider">
                  A. Decision Intelligence Flow
                </strong>
                <div className="flex flex-col gap-1.5 text-[11px] font-medium text-slate-700">
                  <div className="p-1.5 bg-white rounded border border-indigo-100 text-center">Investor Context</div>
                  <div className="text-center text-indigo-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-indigo-100 rounded border border-indigo-300 text-center font-bold text-indigo-900">Gemini Context Synthesis (Server-Side)</div>
                  <div className="text-center text-indigo-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-white rounded border border-indigo-100 text-center">Structured Decision Support JSON</div>
                  <div className="text-center text-indigo-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-white rounded border border-indigo-100 text-center">Guardrail & Schema Validation</div>
                  <div className="text-center text-indigo-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-indigo-600 text-white rounded text-center font-bold">MOMENT UI Experience</div>
                </div>
              </div>

              {/* Deterministic Financial Flow */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <strong className="text-emerald-950 font-bold block text-[11px] uppercase tracking-wider">
                  B. Scenario Calculation Flow
                </strong>
                <div className="flex flex-col gap-1.5 text-[11px] font-medium text-slate-700">
                  <div className="p-1.5 bg-white rounded border border-emerald-100 text-center">Investor Inputs (SIP, Target, Horizon)</div>
                  <div className="text-center text-emerald-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-emerald-100 rounded border border-emerald-300 text-center font-bold text-emerald-950">Deterministic Calculation Engine (Pure TS)</div>
                  <div className="text-center text-emerald-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-white rounded border border-emerald-100 text-center font-bold text-slate-900">Scenario Results (Continue / Reduce / Pause)</div>
                  <div className="text-center text-emerald-500 text-[10px]">↓</div>
                  <div className="p-1.5 bg-indigo-50 rounded border border-indigo-200 text-center text-indigo-900">Gemini Explanation Layer (Numbers Locked)</div>
                </div>
              </div>
            </div>

            {/* AI Do vs Do Not */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  What AI Does:
                </span>
                <ul className="space-y-1 text-emerald-900 text-[11px]">
                  <li>✓ Synthesizes investor context</li>
                  <li>✓ Explains relevant financial factors</li>
                  <li>✓ Connects market movement with portfolio and goal context</li>
                  <li>✓ Generates contextual reflection prompts</li>
                  <li>✓ Explains scenario results without modifying figures</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1.5">
                <span className="font-extrabold text-rose-950 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  What AI Does Not Do:
                </span>
                <ul className="space-y-1 text-rose-900 text-[11px]">
                  <li>✕ Execute transactions</li>
                  <li>✕ Guarantee returns</li>
                  <li>✕ Predict markets with certainty</li>
                  <li>✕ Diagnose investor psychology</li>
                  <li>✕ Override investor intent</li>
                  <li>✕ Replace deterministic financial calculations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetDemo();
                setIsWhyMomentOpen(false);
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo State</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Resets to Priya Sharma's canonical baseline
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsWhyMomentOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition-colors flex-1 sm:flex-none text-center"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsWhyMomentOpen(false);
                startCompetitionDemo();
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-2 flex-1 sm:flex-none active:scale-[0.98]"
            >
              <span>Start Guided Journey (01 → 08)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp, COMPETITION_JOURNEY_STEPS } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Shield,
  HelpCircle,
  Compass,
} from 'lucide-react';

export const CompetitionGuidedBar: React.FC = () => {
  const {
    isCompetitionDemoActive,
    competitionStep,
    setCompetitionStep,
    navigateTo,
    nextCompetitionStep,
    prevCompetitionStep,
    exitCompetitionDemo,
    resetDemo,
    setIsWhyMomentOpen,
    currentRoute,
  } = useApp();

  // If demo is not active, render an elegant, persistent launch pill at bottom-right or top
  if (!isCompetitionDemoActive) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsWhyMomentOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-900/20 border border-indigo-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Experience the MOMENT</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-extrabold tracking-wider">
            Demo Guide
          </span>
        </button>
      </div>
    );
  }

  const currentStepObj = COMPETITION_JOURNEY_STEPS[competitionStep] || COMPETITION_JOURNEY_STEPS[0];

  return (
    <div className="sticky top-16 z-25 bg-slate-900/95 backdrop-blur-md text-white border-b border-indigo-500/30 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Main Bar Flex Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Left: Journey Brand & Active Step Meta */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                M
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs tracking-wider uppercase text-indigo-300">
                    Competition Journey
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    • Step {currentStepObj.numberLabel} of 08
                  </span>
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentStepObj.name}:</span>
                  <span className="text-slate-300 font-normal text-[11px] truncate max-w-[200px] sm:max-w-xs">
                    {currentStepObj.shortDesc}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Why MOMENT & Reset) */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => setIsWhyMomentOpen(true)}
                title="View competition briefing"
                className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:text-white transition-colors text-xs"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={resetDemo}
                title="Reset simulation to initial state"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={exitCompetitionDemo}
                title="Exit competition guided mode"
                className="p-1.5 rounded-lg bg-slate-800 text-rose-300 hover:text-white transition-colors text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: 8 Steps Progress Dots / Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {COMPETITION_JOURNEY_STEPS.map((stepItem) => {
              const isCurrent = stepItem.step === competitionStep;
              const isPast = stepItem.step < competitionStep;

              return (
                <button
                  key={stepItem.step}
                  onClick={() => {
                    setCompetitionStep(stepItem.step);
                    navigateTo(stepItem.id);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight whitespace-nowrap transition-all flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50 shadow-xs'
                      : isPast
                      ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700'
                      : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                  title={`${stepItem.numberLabel} ${stepItem.name} — ${stepItem.shortDesc}`}
                >
                  <span>{stepItem.numberLabel}</span>
                  <span className="hidden lg:inline">{stepItem.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Controls (Back, Next, Briefing, Reset, Exit) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsWhyMomentOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why MOMENT?</span>
            </button>

            <button
              onClick={resetDemo}
              title="Reset simulation to initial state"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            <button
              onClick={prevCompetitionStep}
              disabled={competitionStep === 0}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center justify-center ${
                competitionStep === 0
                  ? 'text-slate-600 bg-slate-800/30 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
              }`}
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextCompetitionStep}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-1 active:scale-[0.98]"
            >
              <span>{competitionStep === 7 ? 'Complete' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={exitCompetitionDemo}
              title="Exit Guided Demo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Standardized Trusted AI Indicators Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 mt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-indigo-300">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Gemini Context Synthesis
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Deterministic Calculation
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Info className="w-3 h-3 text-amber-400" />
              Synthetic Demo Data
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-indigo-300">
              <Shield className="w-3 h-3 text-indigo-400" />
              Investor Sovereignty
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Non-Diagnostic
            </span>
          </div>

          <div className="text-[9px] text-slate-400 hidden xl:block">
            FinLit MOMENT • "Pause. Understand. Decide."
          </div>
        </div>
      </div>
    </div>
  );
};

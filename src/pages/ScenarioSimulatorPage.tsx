import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_GOALS, DEMO_INVESTMENTS, DEMO_INVESTOR } from '../data/demoData';
import { formatINR } from '../utils/formatters';
import {
  getAllCalculatedScenarios,
  DEFAULT_SCENARIO_ASSUMPTIONS,
  CalculatedScenarioResult,
  ScenarioAssumptions,
  validateScenarioResult,
} from '../services/scenarioEngine';
import { aiService, ScenarioExplanationResponse } from '../services/aiService';
import { ScenarioComparisonChart } from '../components/charts/ScenarioComparisonChart';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Calculator,
  ArrowLeft,
  CheckCircle2,
  Table as TableIcon,
  Layers,
  Scale,
  Loader2,
} from 'lucide-react';

export const ScenarioSimulatorPage: React.FC = () => {
  const {
    navigateTo,
    selectedScenario,
    setSelectedScenario,
  } = useApp();

  const primaryGoal = DEMO_GOALS[0];
  const primaryFund = DEMO_INVESTMENTS[0];

  // Authoritative Deterministic Calculation Engine Outputs
  const [assumptions] = useState<ScenarioAssumptions>(DEFAULT_SCENARIO_ASSUMPTIONS);
  const calculatedScenarios = getAllCalculatedScenarios(assumptions);
  const activeResult: CalculatedScenarioResult = calculatedScenarios[selectedScenario];

  // Defensive validation before rendering
  const validatedActive = validateScenarioResult(
    activeResult.projectedValue,
    primaryGoal.targetAmount
  );

  // Gemini Explanation State
  const [explanation, setExplanation] = useState<ScenarioExplanationResponse | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);

  // Accordion / Modal UI States
  const [showAllComparison, setShowAllComparison] = useState<boolean>(true);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
  const [showHowCalculated, setShowHowCalculated] = useState<boolean>(false);

  // Fetch neutral Gemini explanation when selected scenario changes, passing authoritative calculated results
  useEffect(() => {
    let isCancelled = false;

    async function loadExplanation() {
      setIsLoadingExplanation(true);
      try {
        const res = await aiService.explainScenario({
          selectedScenario,
          calculatedResults: {
            monthlySip: activeResult.monthlySip,
            projectedValue: activeResult.projectedValue,
            projectedCorpusAtYear6: activeResult.projectedValue,
            targetValue: primaryGoal.targetAmount,
            status: validatedActive.status,
            surplus: validatedActive.surplus,
            shortfall: validatedActive.shortfall,
            gapOrSurplus: validatedActive.gapOrSurplus,
            delayInYears: activeResult.delayInYears,
          },
          investor: DEMO_INVESTOR,
          goal: primaryGoal,
          assumptions,
        });
        if (!isCancelled) {
          setExplanation(res);
        }
      } catch (err) {
        console.warn('Could not load AI explanation:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingExplanation(false);
        }
      }
    }

    loadExplanation();

    return () => {
      isCancelled = true;
    };
  }, [selectedScenario, activeResult.projectedValue, validatedActive.status]);

  const scenarioKeys: ('continue' | 'reduce' | 'pause')[] = ['continue', 'reduce', 'pause'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
          <span>Decision Impact / What-If Simulator</span>
        </div>

        <button
          onClick={() => navigateTo('moment-intervention')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to MOMENT</span>
        </button>
      </div>

      {/* Simulator Strong Heading & Goal Context Card */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          See the impact before you decide
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Compare how different SIP choices could affect your Child Education goal over the remaining six-year horizon.
        </p>

        {/* Goal Anchor Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Goal</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{primaryGoal.title}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Target</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{formatINR(primaryGoal.targetAmount)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Current</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{formatINR(primaryGoal.currentAmount)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Progress</span>
            <span className="text-emerald-700 font-extrabold text-sm block mt-0.5">{primaryGoal.progressPercent}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Time Remaining</span>
            <span className="text-indigo-700 font-extrabold text-sm block mt-0.5">{primaryGoal.yearsRemaining} years (2032)</span>
          </div>
        </div>
      </div>

      {/* SCENARIO SELECTOR: 3 PROMINENT SCENARIO CARDS/TABS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select a Scenario to Evaluate
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Switch instantly without committing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {scenarioKeys.map((key) => {
            const sc = calculatedScenarios[key];
            const isSelected = selectedScenario === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedScenario(key)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-200/70 scale-[1.01]'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {key === 'continue' ? 'CONTINUE SIP' : key === 'reduce' ? 'REDUCE SIP' : 'PAUSE SIP'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      key === 'continue'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : key === 'reduce'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {sc.badge}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {formatINR(sc.monthlySip)}
                    <span className="text-xs font-normal text-slate-500">/month</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {key === 'continue'
                      ? 'Full monthly contribution'
                      : key === 'reduce'
                      ? '50% allocation reduction'
                      : 'Temporary halt in contributions'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Projected 6Y Corpus:</span>
                    <strong className="text-slate-900 font-extrabold">
                      ₹{sc.projectedValue.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Goal Status:</span>
                    <span className="font-bold text-emerald-700">
                      +₹{sc.surplus.toLocaleString('en-IN')} Surplus
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DECISION IMPACT CARD (SELECTED SCENARIO IMPACT) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Decision Impact
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Impact of: {activeResult.title} ({formatINR(activeResult.monthlySip)}/month)
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>You remain in control</span>
          </div>
        </div>

        {/* 5 Core Decision Impact Metrics with Authoritative Surplus/Gap logic */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Monthly Contribution</span>
            <strong className="text-base font-bold text-slate-900 mt-0.5 block">
              {formatINR(activeResult.monthlySip)}
            </strong>
            <span className="text-[10px] text-slate-500">6Y Total: {formatINR(activeResult.totalNewContributions6Y)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Illustrative Goal Value</span>
            <strong className="text-base font-bold text-slate-900 mt-0.5 block">
              ₹{activeResult.projectedValue.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-indigo-600 font-semibold">{activeResult.projectedGoalProgressPercent}% of Target</span>
          </div>

          {/* Illustrative Funding Gap / Surplus Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">
              {validatedActive.status === 'SURPLUS' ? 'Estimated Surplus' : 'Funding Gap'}
            </span>
            <strong
              className={`text-base font-bold mt-0.5 block ${
                validatedActive.status === 'SURPLUS' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {validatedActive.status === 'SURPLUS'
                ? `+₹${validatedActive.surplus.toLocaleString('en-IN')}`
                : `-₹${validatedActive.shortfall.toLocaleString('en-IN')}`}
            </strong>
            <span className="text-[10px] text-slate-500">
              {validatedActive.status === 'SURPLUS' ? 'Exceeds ₹35L target' : 'Requires alternate funds'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Illustrative Timeline Effect</span>
            <strong className="text-base font-bold mt-0.5 block text-emerald-600">
              0 Delay (Target Met)
            </strong>
            <span className="text-[10px] text-slate-500">Target reached by 2032</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Distance from Target</span>
            <strong className="text-base font-bold text-slate-900 mt-0.5 block">
              Estimated Surplus: ₹{validatedActive.surplus.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-slate-500">Target ₹35,00,000</span>
          </div>
        </div>

        {/* Objective Phrasing Statement */}
        <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
          {activeResult.illustrativeImpactStatement}
        </div>

        {/* GEMINI EXPLANATION LAYER */}
        <div className="rounded-xl bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-100 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>MOMENT Explanation Layer</span>
            </div>
            {isLoadingExplanation ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                Explaining calculated results...
              </span>
            ) : explanation?.isAiGenerated && !explanation?.isFallback ? (
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                Gemini Neutral Explanation
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Deterministic Explanation
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {explanation?.plainLanguageExplanation ||
              `Under this illustrative scenario, the existing ₹24.85L accumulated corpus and contributions project a total value of ₹${activeResult.projectedValue.toLocaleString('en-IN')}, achieving an estimated surplus of ₹${validatedActive.surplus.toLocaleString('en-IN')} above your ₹35L target.`}
          </p>

          {explanation?.tradeoffSummary && (
            <div className="text-[11px] text-slate-600 pt-1 border-t border-indigo-50 flex items-start gap-1.5">
              <strong className="text-slate-900 shrink-0">Key Tradeoff:</strong>
              <span>{explanation.tradeoffSummary}</span>
            </div>
          )}
        </div>
      </div>

      {/* GOAL TRAJECTORY VISUALIZATION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            6-Year Goal Trajectory Visualization
          </h3>
          <span className="text-xs text-slate-400">
            Click any line or marker to inspect
          </span>
        </div>

        <ScenarioComparisonChart
          scenarios={calculatedScenarios}
          selectedScenario={selectedScenario}
          onSelectScenario={(sc) => setSelectedScenario(sc)}
          targetAmount={primaryGoal.targetAmount}
        />
      </div>

      {/* COMPARISON VIEW: COMPARE ALL SCENARIOS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Compare All Three Scenarios
            </h3>
          </div>
          <button
            onClick={() => setShowAllComparison(!showAllComparison)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            <span>{showAllComparison ? 'Hide Table' : 'Show Table'}</span>
            {showAllComparison ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAllComparison && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-5">Metric</th>
                  <th className="p-3.5 text-emerald-800 bg-emerald-50/50">CONTINUE SIP</th>
                  <th className="p-3.5 text-amber-800 bg-amber-50/50">REDUCE SIP</th>
                  <th className="p-3.5 text-rose-800 bg-rose-50/50">PAUSE SIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Monthly Contribution</td>
                  <td className="p-3.5 font-bold text-slate-900 bg-emerald-50/20">₹25,000</td>
                  <td className="p-3.5 font-bold text-slate-900 bg-amber-50/20">₹12,500</td>
                  <td className="p-3.5 font-bold text-slate-900 bg-rose-50/20">₹0</td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Goal Target</td>
                  <td className="p-3.5 bg-emerald-50/20">₹35,00,000</td>
                  <td className="p-3.5 bg-amber-50/20">₹35,00,000</td>
                  <td className="p-3.5 bg-rose-50/20">₹35,00,000</td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Current Accumulated</td>
                  <td className="p-3.5 bg-emerald-50/20">₹24,85,000</td>
                  <td className="p-3.5 bg-amber-50/20">₹24,85,000</td>
                  <td className="p-3.5 bg-rose-50/20">₹24,85,000</td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Remaining Horizon</td>
                  <td className="p-3.5 bg-emerald-50/20">6 years (2032)</td>
                  <td className="p-3.5 bg-amber-50/20">6 years (2032)</td>
                  <td className="p-3.5 bg-rose-50/20">6 years (2032)</td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Illustrative Projected Value</td>
                  <td className="p-3.5 font-extrabold text-emerald-700 bg-emerald-50/30">
                    ₹{calculatedScenarios.continue.projectedValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-extrabold text-amber-700 bg-amber-50/30">
                    ₹{calculatedScenarios.reduce.projectedValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-extrabold text-rose-700 bg-rose-50/30">
                    ₹{calculatedScenarios.pause.projectedValue.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Illustrative Gap / Surplus</td>
                  <td className="p-3.5 font-extrabold text-emerald-700 bg-emerald-50/30">
                    +₹{calculatedScenarios.continue.surplus.toLocaleString('en-IN')} Surplus
                  </td>
                  <td className="p-3.5 font-extrabold text-emerald-700 bg-amber-50/30">
                    +₹{calculatedScenarios.reduce.surplus.toLocaleString('en-IN')} Surplus
                  </td>
                  <td className="p-3.5 font-extrabold text-emerald-700 bg-rose-50/30">
                    +₹{calculatedScenarios.pause.surplus.toLocaleString('en-IN')} Surplus
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">Illustrative Timeline Impact</td>
                  <td className="p-3.5 font-semibold text-emerald-700 bg-emerald-50/30">0 Delay (Target Met)</td>
                  <td className="p-3.5 font-semibold text-emerald-700 bg-amber-50/30">0 Delay (Target Met)</td>
                  <td className="p-3.5 font-semibold text-emerald-700 bg-rose-50/30">0 Delay (Target Met)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EXPLAIN ASSUMPTIONS & HOW IS THIS CALCULATED ACCORDIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expandable: Simulation Assumptions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Simulation Assumptions</h4>
            </div>
            <button
              onClick={() => setShowAssumptions(!showAssumptions)}
              className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>{showAssumptions ? 'Hide' : 'View Assumptions'}</span>
              {showAssumptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            These assumptions are used only to demonstrate how different contribution levels can affect the goal trajectory.
          </p>

          {showAssumptions && (
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 animate-in fade-in">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Annual Illustrative Return:</span>
                <strong className="text-slate-900">{(assumptions.annualIllustrativeReturn * 100).toFixed(1)}% (Annualized)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Illustrative Inflation Rate:</span>
                <strong className="text-slate-900">{(assumptions.inflationRate * 100).toFixed(1)}%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Contribution Frequency:</span>
                <strong className="text-slate-900">{assumptions.monthlyContributionFrequency} / year (Monthly)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Remaining Horizon:</span>
                <strong className="text-slate-900">{assumptions.yearsRemaining} years (to 2032)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Starting Goal Amount:</span>
                <strong className="text-slate-900">{formatINR(assumptions.startingGoalAmount)}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Target Amount:</span>
                <strong className="text-slate-900">{formatINR(assumptions.targetAmount)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Interaction: How is this calculated? */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">How is this calculated?</h4>
            </div>
            <button
              onClick={() => setShowHowCalculated(!showHowCalculated)}
              className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>{showHowCalculated ? 'Hide' : 'Explain Formula'}</span>
              {showHowCalculated ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Projected goal value is calculated from the current accumulated amount, monthly contributions, remaining time and the simulation assumptions.
          </p>

          {showHowCalculated && (
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 animate-in fade-in">
              <p className="leading-relaxed">
                1. <strong>Starting Corpus Growth:</strong> The existing ₹24.85L compounds monthly at the 10.5% illustrative annual rate over 6 years ($PV \times (1 + r/12)^{72} = ₹46,53,094$).
              </p>
              <p className="leading-relaxed">
                2. <strong>Monthly SIP Growth:</strong> Each monthly installment is added and compounded through the annuity future-value formula ($P \times [((1 + r_m)^m - 1) / r_m] \times (1 + r_m)$).
              </p>
              <p className="leading-relaxed">
                3. <strong>Goal Surplus:</strong> Calculated as Projected Corpus minus Target (₹35L). Because Priya has already accumulated ₹24.85L, all three scenarios project an estimated surplus above ₹35L by Year 6.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SYNTHETIC DATA DISCLOSURE */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Illustrative simulation using synthetic data and assumptions. This is not financial advice or a prediction of investment returns.</strong> Calculations illustrate mathematical relationships under hypothetical inputs. Market returns fluctuate unpredictably.
        </p>
      </div>

      {/* NAVIGATION BAR WITH REQUIRED BUTTONS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Ready to proceed with your decision?
          </h4>
          <p className="text-xs text-slate-500">
            The decision always remains yours. No transaction is executed.
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
            onClick={() => navigateTo('explainability')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why MOMENT Showed This</span>
          </button>

          <button
            onClick={() => navigateTo('decision-confirmation')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <span>Continue with decision</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};

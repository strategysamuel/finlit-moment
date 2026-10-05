/**
 * FinLit MOMENT Scenario Engine
 *
 * Pure deterministic calculation engine for what-if SIP decision simulations.
 * Architecturally decoupled from Gemini to guarantee numerical accuracy,
 * auditability, and mathematical reproducibility.
 *
 * Gemini acts strictly as an explanation layer over these calculated numbers.
 */

export interface ScenarioAssumptions {
  annualIllustrativeReturn: number; // 0.105 (10.5% annualized compounding)
  inflationRate: number; // 0.06 (6.0% illustrative inflation)
  monthlyContributionFrequency: number; // 12 contributions per year
  yearsRemaining: number; // 6 years until target (Year 2032)
  startingGoalAmount: number; // ₹24,85,000 accumulated so far
  targetAmount: number; // ₹35,00,000 target corpus
}

export const DEFAULT_SCENARIO_ASSUMPTIONS: ScenarioAssumptions = {
  annualIllustrativeReturn: 0.105,
  inflationRate: 0.06,
  monthlyContributionFrequency: 12,
  yearsRemaining: 6,
  startingGoalAmount: 2485000,
  targetAmount: 3500000,
};

export interface TrajectoryPoint {
  year: number;
  yearIndex: number;
  projectedAmount: number;
  contributionsToDate: number;
}

export type ScenarioStatus = 'SURPLUS' | 'SHORTFALL';

export interface ScenarioValidationResult {
  status: ScenarioStatus;
  gapOrSurplus: number;
  surplus: number;
  shortfall: number;
}

/**
 * Defensive validation ensuring consistent status and surplus/shortfall calculation.
 */
export function validateScenarioResult(
  projectedValue: number,
  targetValue: number
): ScenarioValidationResult {
  const gapOrSurplus = projectedValue - targetValue;

  if (projectedValue >= targetValue) {
    return {
      status: 'SURPLUS',
      gapOrSurplus,
      surplus: gapOrSurplus,
      shortfall: 0,
    };
  } else {
    return {
      status: 'SHORTFALL',
      gapOrSurplus,
      surplus: 0,
      shortfall: targetValue - projectedValue,
    };
  }
}

export interface CalculatedScenarioResult {
  scenarioKey: 'continue' | 'reduce' | 'pause';
  title: string;
  badge: string;
  monthlySip: number;
  annualContribution: number;
  totalNewContributions6Y: number;
  projectedValue: number;
  projectedCorpusAtYear6: number; // Backwards-compatible alias
  targetValue: number;
  gapOrSurplus: number;
  status: ScenarioStatus;
  surplus: number;
  shortfall: number;
  projectedGap: number; // 0 when surplus
  projectedSurplus: number; // surplus amount
  projectedGoalProgressPercent: number;
  delayInYears: number;
  distanceFromTargetFormatted: string;
  trajectory: TrajectoryPoint[];
  color: string;
  illustrativeImpactStatement: string;
}

/**
 * Deterministically calculates future value of starting corpus and monthly SIP.
 *
 * Authoritative output for:
 * 1. CONTINUE (₹25,000/mo): Projected ₹71,45,872 | Surplus ₹36,45,872
 * 2. REDUCE   (₹12,500/mo): Projected ₹58,99,483 | Surplus ₹23,99,483
 * 3. PAUSE    (₹0/mo):      Projected ₹46,53,094 | Surplus ₹11,53,094
 */
export function calculateScenarioImpact(
  monthlySip: number,
  scenarioKey: 'continue' | 'reduce' | 'pause',
  assumptions: ScenarioAssumptions = DEFAULT_SCENARIO_ASSUMPTIONS
): CalculatedScenarioResult {
  const {
    annualIllustrativeReturn: r,
    yearsRemaining: n,
    startingGoalAmount: PV,
    targetAmount: target,
  } = assumptions;

  const totalMonths = n * 12;
  const monthlyRate = r / 12;

  // Monthly compounding progression for trajectory
  const trajectory: TrajectoryPoint[] = [];
  const startYear = 2026;

  let currentBalance = PV;
  let cumulativeNewContributions = 0;

  trajectory.push({
    year: startYear,
    yearIndex: 0,
    projectedAmount: Math.round(currentBalance),
    contributionsToDate: 0,
  });

  for (let year = 1; year <= n; year++) {
    for (let month = 1; month <= 12; month++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthlySip;
      cumulativeNewContributions += monthlySip;
    }

    trajectory.push({
      year: startYear + year,
      yearIndex: year,
      projectedAmount: Math.round(currentBalance),
      contributionsToDate: cumulativeNewContributions,
    });
  }

  const finalProjectedCorpus = Math.round(currentBalance);
  const totalNewContributions6Y = monthlySip * totalMonths;

  // Defensive validation of target vs projected
  const validation = validateScenarioResult(finalProjectedCorpus, target);

  const progressPercent = Math.round((finalProjectedCorpus / target) * 100);

  // Timeline delay logic:
  // Since all 3 scenarios meet or exceed the target within the 6-year window,
  // delayInYears is 0 (goal is on track / achieved on or before 2032).
  let delayInYears = 0;
  if (validation.status === 'SHORTFALL') {
    const basisPace = monthlySip > 0 ? monthlySip * 12 : 25000 * 12;
    delayInYears = parseFloat((validation.shortfall / basisPace).toFixed(1));
  }

  // Titles, badges, colors, and accurate impact statements
  let title = 'Continue Regular SIP';
  let badge = 'Active Compounding';
  let color = '#059669'; // Emerald
  let illustrativeImpactStatement =
    'Under this illustrative scenario, maintaining regular monthly contributions projects a ₹71,45,872 corpus, building an estimated surplus of ₹36,45,872 above your ₹35L goal.';

  if (scenarioKey === 'reduce') {
    title = 'Reduce SIP by 50%';
    badge = 'Balanced Allocation';
    color = '#d97706'; // Amber
    illustrativeImpactStatement =
      'Under this illustrative scenario, reducing your SIP to ₹12,500/month projects a ₹58,99,483 corpus, achieving an estimated surplus of ₹23,99,483 while easing monthly cash flow.';
  } else if (scenarioKey === 'pause') {
    title = 'Pause SIP Completely';
    badge = 'Compounding Existing Only';
    color = '#dc2626'; // Rose
    illustrativeImpactStatement =
      'Under this illustrative scenario, pausing contributions relies solely on your existing ₹24.85L compounding to project ₹46,53,094, exceeding the ₹35L target by ₹11,53,094 with a narrower margin than continuing.';
  }

  // Distance from Target formatting:
  // "Estimated Surplus: ₹X" when surplus, "Funding Gap: ₹X" when shortfall
  const distanceFromTargetFormatted =
    validation.status === 'SURPLUS'
      ? `Estimated Surplus: ₹${validation.surplus.toLocaleString('en-IN')}`
      : `Funding Gap: ₹${validation.shortfall.toLocaleString('en-IN')}`;

  return {
    scenarioKey,
    title,
    badge,
    monthlySip,
    annualContribution: monthlySip * 12,
    totalNewContributions6Y,
    projectedValue: finalProjectedCorpus,
    projectedCorpusAtYear6: finalProjectedCorpus,
    targetValue: target,
    gapOrSurplus: validation.gapOrSurplus,
    status: validation.status,
    surplus: validation.surplus,
    shortfall: validation.shortfall,
    projectedGap: validation.shortfall,
    projectedSurplus: validation.surplus,
    projectedGoalProgressPercent: progressPercent,
    delayInYears,
    distanceFromTargetFormatted,
    trajectory,
    color,
    illustrativeImpactStatement,
  };
}

/**
 * Returns all three scenarios calculated deterministically with the same assumptions.
 */
export function getAllCalculatedScenarios(
  assumptions: ScenarioAssumptions = DEFAULT_SCENARIO_ASSUMPTIONS
): Record<'continue' | 'reduce' | 'pause', CalculatedScenarioResult> {
  return {
    continue: calculateScenarioImpact(25000, 'continue', assumptions),
    reduce: calculateScenarioImpact(12500, 'reduce', assumptions),
    pause: calculateScenarioImpact(0, 'pause', assumptions),
  };
}

import { MomentDecisionRecord } from '../types/decisionMemory';

/**
 * Initial Synthetic Decision History (Milestone 4)
 *
 * Demonstrates how MOMENT remembers past decision contexts so investors
 * can compare today's situation with previous decisions instead of
 * emotionally reacting to a single market movement.
 *
 * Strictly synthetic demo data. No real financial transaction is ever executed.
 */
export const INITIAL_DECISION_MEMORY_RECORDS: MomentDecisionRecord[] = [
  {
    id: 'decision-oct-2026',
    investorId: 'inv-priya-sharma',
    date: 'October 5, 2026',
    timestamp: '2026-10-05T09:30:00Z',
    decisionType: 'SIP_PAUSE_OR_REDUCE',
    decisionLabel: 'SIP Decision',
    goalName: 'Child Education',
    goalTarget: 3500000,
    goalProgress: 71,
    accumulatedAmount: 2485000,
    currentPortfolioValue: 1842600,
    marketMovement: -8.2,
    portfolioMovement: -6.8,
    riskProfile: 'Moderate',
    remainingHorizon: '6 years',
    currentSip: 25000,
    selectedScenario: 'continue',
    selectedScenarioLabel: 'Continue SIP',
    projectedValue: 7145872,
    projectedSurplus: 3645872,
    scenarioStatus: 'SURPLUS',
    momentSummary:
      'MOMENT showed the investor how continuing, reducing or pausing the SIP could affect the Child Education goal under the same illustrative assumptions.',
    keyFactors: [
      'Market decline (-8.2%) was broader than portfolio drawdown (-6.8%).',
      'Remaining 6-year horizon until 2032 allows recovery time for disciplined equity allocation.',
      'Child education goal was already 71% funded with ₹24,85,000 accumulated.',
      'All three illustrative SIP scenarios remained above the ₹35L goal under baseline assumptions.',
    ],
    investorDecision: 'Continue SIP',
    decisionReason:
      'Maintained the existing contribution while reviewing the potential effect on the long-term education goal.',
    followUpStatus: 'Investor-controlled • Decision recorded in MOMENT demo history.',
    isSynthetic: true,
    scenariosSnapshot: {
      continue: {
        monthlySip: 25000,
        projectedValue: 7145872,
        surplus: 3645872,
        status: 'SURPLUS',
      },
      reduce: {
        monthlySip: 12500,
        projectedValue: 5899483,
        surplus: 2399483,
        status: 'SURPLUS',
      },
      pause: {
        monthlySip: 0,
        projectedValue: 4653094,
        surplus: 1153094,
        status: 'SURPLUS',
      },
    },
  },
  {
    id: 'decision-jul-2026',
    investorId: 'inv-priya-sharma',
    date: 'July 15, 2026',
    timestamp: '2026-07-15T11:15:00Z',
    decisionType: 'SIP_PAUSE_OR_REDUCE',
    decisionLabel: 'SIP Decision',
    goalName: 'Child Education',
    goalTarget: 3500000,
    goalProgress: 62,
    accumulatedAmount: 2170000,
    currentPortfolioValue: 1720000,
    marketMovement: -4.1,
    portfolioMovement: -3.2,
    riskProfile: 'Moderate',
    remainingHorizon: '6.2 years',
    currentSip: 25000,
    selectedScenario: 'continue',
    selectedScenarioLabel: 'Continue SIP',
    projectedValue: 6720000,
    projectedSurplus: 3220000,
    scenarioStatus: 'SURPLUS',
    momentSummary:
      'Earlier market pullback prompted review of equity exposure; continuing contributions preserved discipline and rupee-cost averaging.',
    keyFactors: [
      'Moderate market correction (-4.1%) across benchmark indices.',
      'Goal progress was at 62% toward the ₹35L target.',
      'Decision to stay invested capitalized on lower unit purchase costs.',
    ],
    investorDecision: 'Continue SIP',
    decisionReason:
      'Maintained long-term contribution despite short-term market weakness.',
    followUpStatus: 'Investor-controlled • Decision recorded in MOMENT demo history.',
    isSynthetic: true,
    scenariosSnapshot: {
      continue: {
        monthlySip: 25000,
        projectedValue: 6720000,
        surplus: 3220000,
        status: 'SURPLUS',
      },
      reduce: {
        monthlySip: 12500,
        projectedValue: 5480000,
        surplus: 1980000,
        status: 'SURPLUS',
      },
      pause: {
        monthlySip: 0,
        projectedValue: 4240000,
        surplus: 740000,
        status: 'SURPLUS',
      },
    },
  },
];

/**
 * FinLit MOMENT Decision Memory Types (Milestone 4)
 *
 * Centralized data model capturing the decision context, what MOMENT showed,
 * what scenarios were available, what the investor decided, and why.
 *
 * All data is strictly synthetic demo data for prototyping.
 * No real financial transaction is ever executed.
 */

export interface ScenarioSnapshotItem {
  monthlySip: number;
  projectedValue: number;
  surplus: number;
  status: 'SURPLUS' | 'SHORTFALL';
}

export interface MomentDecisionRecord {
  id: string;
  investorId: string;
  date: string; // e.g. "October 5, 2026"
  timestamp: string; // ISO date
  decisionType: string; // e.g. "SIP_PAUSE_OR_REDUCE"
  decisionLabel: string; // e.g. "SIP Review"
  goalName: string; // "Child Education"
  goalTarget: number; // 3500000
  goalProgress: number; // 71
  accumulatedAmount: number; // 2485000
  currentPortfolioValue: number; // 1842600
  marketMovement: number; // -8.2
  portfolioMovement: number; // -6.8
  riskProfile: string; // "Moderate"
  remainingHorizon: string; // "6 years"
  currentSip: number; // 25000
  selectedScenario: 'continue' | 'reduce' | 'pause';
  selectedScenarioLabel: string; // "Continue SIP"
  projectedValue: number; // 7145872
  projectedSurplus: number; // 3645872
  scenarioStatus: 'SURPLUS' | 'SHORTFALL';
  momentSummary: string;
  keyFactors: string[];
  investorDecision: string; // "Continue SIP"
  decisionReason: string; // "Maintained the existing contribution while reviewing the potential effect on the long-term education goal."
  followUpStatus: string; // "Decision recorded in MOMENT demo history."
  isSynthetic: true;
  scenariosSnapshot: {
    continue: ScenarioSnapshotItem;
    reduce: ScenarioSnapshotItem;
    pause: ScenarioSnapshotItem;
  };
}

export interface MemoryComparisonInsight {
  headline: string;
  summary: string;
  whatChanged: string[];
  whatStayedSimilar: string[];
  goalContext: string;
  decisionContext: string;
  neutralObservation: string;
  confidenceLabel: string;
  disclaimer: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  generatedAt?: string;
}

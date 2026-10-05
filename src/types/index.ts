export type RiskLevel = 'Conservative' | 'Moderate' | 'Aggressive';

export interface InvestorProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  riskProfile: RiskLevel;
  investmentHorizon: string;
  avatarUrl?: string;
  memberSince: string;
  kycStatus: 'Verified' | 'Pending';
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'Education' | 'Retirement' | 'Wealth' | 'Housing';
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  targetYear: number;
  yearsRemaining: number;
  monthlyContribution: number;
  status: 'On Track' | 'At Risk' | 'Needs Attention';
  description: string;
}

export interface InvestmentAsset {
  id: string;
  name: string;
  ticker?: string;
  category: 'Equity Mutual Funds' | 'ETFs' | 'Debt' | 'Cash & Liquid';
  subCategory: string;
  investedValue: number;
  currentValue: number;
  absoluteReturn: number;
  absoluteReturnPercent: number;
  xirr: number;
  recentMovementPercent: number;
  monthlySip: number;
  sipFrequency: 'Monthly' | 'Quarterly';
  linkedGoalId?: string;
  linkedGoalName?: string;
  riskCategory: 'High' | 'Moderate' | 'Low';
  nav: number;
  units: number;
  isPrimaryDemo?: boolean;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  overallReturn: number;
  overallReturnPercent: number;
  recentMovementPercent: number;
  healthScore: number;
  healthScoreExplanation: string;
  assetAllocation: {
    category: string;
    value: number;
    percentage: number;
    color: string;
  }[];
}

export interface SimulatedMarketEvent {
  eventTitle: string;
  marketIndexName: string;
  marketMovementPercent: number;
  portfolioMovementPercent: number;
  timeframe: string;
  benchmarkDescription: string;
  isSimulatedDemo: true;
  lastUpdated: string;
}

export type DecisionAction = 'continue' | 'reduce' | 'pause';

export interface DecisionContext {
  investmentId: string;
  investmentName: string;
  proposedAction: 'pause' | 'reduce';
  currentSipAmount: number;
  reducedSipAmount?: number;
  goalId: string;
  goalName: string;
  targetAmount: number;
  yearsRemaining: number;
  triggeredAt: string;
}

export interface ScenarioImpact {
  scenarioKey: DecisionAction;
  title: string;
  badge: string;
  monthlySip: number;
  annualContribution: number;
  projectedCorpusAtYear6: number;
  projectedGoalProgressPercent: number;
  projectedGap: number;
  delayInYears: number;
  missedCostAveragingUnits: number;
  recommendationNote: string;
  color: string;
}

export interface DecisionFactor {
  factor: string;
  status: 'Aligned' | 'Alert' | 'Buffer' | 'Critical';
  weight: 'High' | 'Medium';
  value: string;
  explanation: string;
}

export interface GeminiAlternative {
  action: 'CONTINUE' | 'REDUCE' | 'PAUSE' | string;
  description: string;
}

export interface GeminiMomentInsight {
  decisionType: 'SIP_PAUSE' | 'SIP_REDUCE' | string;
  headline: string;
  summary: string;
  marketContext: string;
  portfolioContext: string;
  goalContext: string;
  riskContext: string;
  decisionImpact: string;
  factors: string[];
  alternatives: GeminiAlternative[];
  confidence: number;
  disclaimer: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  generatedAt?: string;
  errorNote?: string;
}

export interface AIDecisionSupportResponse {
  decisionType: 'SIP_PAUSE_OR_REDUCE';
  headline: string;
  subheading: string;
  summary: string;
  marketContext: {
    marketMovementPercent: number;
    portfolioMovementPercent: number;
    narrative: string;
  };
  portfolioContext: {
    portfolioValue: number;
    healthScore: number;
    narrative: string;
  };
  goalContext: {
    goalName: string;
    targetAmount: number;
    yearsRemaining: number;
    progressPercent: number;
    narrative: string;
  };
  riskContext: {
    investorRisk: RiskLevel;
    investmentRisk: string;
    narrative: string;
  };
  decisionImpact: {
    potentialCorpusLoss: number;
    potentialGoalDelayYears: number;
    rupeeCostAveragingOpportunity: string;
  };
  scenarios: ScenarioImpact[];
  explanation: {
    factors: DecisionFactor[];
    detailedAnalysis: string;
    modelConfidencePercent: number;
  };
  confidence: number;
  userControl: {
    isUserDecisionFinal: true;
    statement: string;
  };
}

export interface RecordedDecision {
  id: string;
  action: DecisionAction;
  investmentName: string;
  goalName: string;
  previousSip: number;
  newSip: number;
  recordedAt: string;
  notes?: string;
}

export type AppRoute =
  | 'dashboard'
  | 'portfolio'
  | 'goals'
  | 'investments'
  | 'sip-details'
  | 'moment-intervention'
  | 'simulator'
  | 'explainability'
  | 'decision-confirmation'
  | 'decision-memory'
  | 'follow-up'
  | 'decision-brief'
  | 'decision-reflection';

export * from './decisionMemory';
export * from './followUp';
export * from './decisionBrief';
export * from './decisionReflection';





import {
  InvestorProfile,
  FinancialGoal,
  InvestmentAsset,
  PortfolioSummary,
  SimulatedMarketEvent,
  DecisionContext,
  ScenarioImpact,
  DecisionFactor,
} from '../types';

export const DEMO_INVESTOR: InvestorProfile = {
  id: 'inv-priya-01',
  name: 'Priya Sharma',
  age: 34,
  occupation: 'IT Professional',
  monthlyIncome: 180000,
  riskProfile: 'Moderate',
  investmentHorizon: '6+ years',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  memberSince: 'March 2021',
  kycStatus: 'Verified',
};

export const DEMO_MARKET_EVENT: SimulatedMarketEvent = {
  eventTitle: 'Simulated Global Macro Consolidation',
  marketIndexName: 'Nifty 50 Benchmark',
  marketMovementPercent: -8.2,
  portfolioMovementPercent: -6.8,
  timeframe: 'Recent 3-Week Movement',
  benchmarkDescription: 'Simulated broad index correction led by geopolitical headwinds and IT/Banking valuation cooling.',
  isSimulatedDemo: true,
  lastUpdated: 'Today, 09:30 AM IST (Simulated)',
};

export const DEMO_GOALS: FinancialGoal[] = [
  {
    id: 'goal-child-edu',
    title: 'Child Education',
    category: 'Education',
    targetAmount: 3500000,
    currentAmount: 2485000,
    progressPercent: 71,
    targetYear: 2032,
    yearsRemaining: 6,
    monthlyContribution: 25000,
    status: 'On Track',
    description: 'Undergraduate tuition & higher education fund for Child Education (Target year 2032)',
  },
  {
    id: 'goal-retirement',
    title: 'Retirement Independence',
    category: 'Retirement',
    targetAmount: 15000000, // 1.5 Cr
    currentAmount: 7200000, // 72 Lakhs
    progressPercent: 48,
    targetYear: 2050,
    yearsRemaining: 24,
    monthlyContribution: 20000,
    status: 'On Track',
    description: 'Long-term financial freedom corpus targeting age 58',
  },
];

export const DEMO_INVESTMENTS: InvestmentAsset[] = [
  {
    id: 'inv-fund-01',
    name: 'FinLit Flexi Growth Fund',
    ticker: 'FLFGF-DIR',
    category: 'Equity Mutual Funds',
    subCategory: 'Active Flexi-Cap Direct Growth',
    investedValue: 940000,
    currentValue: 1120000,
    absoluteReturn: 180000,
    absoluteReturnPercent: 19.15,
    xirr: 12.8,
    recentMovementPercent: -6.8,
    monthlySip: 25000,
    sipFrequency: 'Monthly',
    linkedGoalId: 'goal-child-edu',
    linkedGoalName: 'Child Education',
    riskCategory: 'Moderate',
    nav: 64.82,
    units: 17278.61,
    isPrimaryDemo: true,
  },
  {
    id: 'inv-fund-02',
    name: 'FinLit Nifty 50 Index ETF',
    ticker: 'FLN50-ETF',
    category: 'ETFs',
    subCategory: 'Passive Large Cap Index',
    investedValue: 320000,
    currentValue: 385000,
    absoluteReturn: 65000,
    absoluteReturnPercent: 20.31,
    xirr: 11.4,
    recentMovementPercent: -8.1,
    monthlySip: 10000,
    sipFrequency: 'Monthly',
    linkedGoalId: 'goal-retirement',
    linkedGoalName: 'Retirement Independence',
    riskCategory: 'Moderate',
    nav: 242.15,
    units: 1589.92,
  },
  {
    id: 'inv-fund-03',
    name: 'FinLit Corporate Bond Debt Fund',
    ticker: 'FLCBD-DIR',
    category: 'Debt',
    subCategory: 'AAA Rated Banking & PSU Debt',
    investedValue: 200000,
    currentValue: 215600,
    absoluteReturn: 15600,
    absoluteReturnPercent: 7.8,
    xirr: 7.2,
    recentMovementPercent: +0.4,
    monthlySip: 5000,
    sipFrequency: 'Monthly',
    linkedGoalId: 'goal-child-edu',
    linkedGoalName: 'Child Education (Debt Cushion)',
    riskCategory: 'Low',
    nav: 18.44,
    units: 11691.97,
  },
  {
    id: 'inv-fund-04',
    name: 'FinLit Liquid Overnight Fund',
    ticker: 'FLLIQ-DIR',
    category: 'Cash & Liquid',
    subCategory: 'Emergency Liquidity & Staging',
    investedValue: 120000,
    currentValue: 122000,
    absoluteReturn: 2000,
    absoluteReturnPercent: 1.67,
    xirr: 5.8,
    recentMovementPercent: +0.2,
    monthlySip: 0,
    sipFrequency: 'Monthly',
    riskCategory: 'Low',
    nav: 1024.12,
    units: 119.12,
  },
];

export const DEMO_PORTFOLIO: PortfolioSummary = {
  totalValue: 1842600,
  totalInvested: 1580000,
  overallReturn: 262600,
  overallReturnPercent: 16.62,
  recentMovementPercent: -6.8,
  healthScore: 78,
  healthScoreExplanation:
    'Your portfolio remains reasonably diversified, with recent movement broadly aligned with the simulated market decline.',
  assetAllocation: [
    {
      category: 'Equity Mutual Funds',
      value: 1120000,
      percentage: 60.78,
      color: '#3b82f6', // blue
    },
    {
      category: 'ETFs',
      value: 385000,
      percentage: 20.89,
      color: '#10b981', // emerald
    },
    {
      category: 'Debt',
      value: 215600,
      percentage: 11.7,
      color: '#f59e0b', // amber
    },
    {
      category: 'Cash & Liquid',
      value: 122000,
      percentage: 6.63,
      color: '#8b5cf6', // purple
    },
  ],
};

export const DEMO_DECISION_CONTEXT: DecisionContext = {
  investmentId: 'inv-fund-01',
  investmentName: 'FinLit Flexi Growth Fund',
  proposedAction: 'pause',
  currentSipAmount: 25000,
  reducedSipAmount: 12500,
  goalId: 'goal-child-edu',
  goalName: 'Child Education',
  targetAmount: 3500000,
  yearsRemaining: 6,
  triggeredAt: new Date().toISOString(),
};

export const DEMO_SCENARIOS: ScenarioImpact[] = [
  {
    scenarioKey: 'continue',
    title: 'Continue Regular SIP',
    badge: 'Recommended by Plan',
    monthlySip: 25000,
    annualContribution: 300000,
    projectedCorpusAtYear6: 3680000,
    projectedGoalProgressPercent: 105,
    projectedGap: 0,
    delayInYears: 0,
    missedCostAveragingUnits: 0,
    recommendationNote:
      'Capitalizes on lower NAVs during the simulated market dip, maintaining uninterrupted compounding trajectory.',
    color: '#059669', // emerald
  },
  {
    scenarioKey: 'reduce',
    title: 'Reduce SIP by 50%',
    badge: 'Middle-Ground Option',
    monthlySip: 12500,
    annualContribution: 150000,
    projectedCorpusAtYear6: 3120000,
    projectedGoalProgressPercent: 89,
    projectedGap: 380000,
    delayInYears: 1.4,
    missedCostAveragingUnits: 1420,
    recommendationNote:
      'Provides immediate monthly cash-flow relief (₹12,500/mo retained) while preserving partial cost averaging.',
    color: '#d97706', // amber
  },
  {
    scenarioKey: 'pause',
    title: 'Pause SIP Completely',
    badge: 'High Impact on Goal',
    monthlySip: 0,
    annualContribution: 0,
    projectedCorpusAtYear6: 2560000,
    projectedGoalProgressPercent: 73,
    projectedGap: 940000,
    delayInYears: 2.8,
    missedCostAveragingUnits: 2840,
    recommendationNote:
      'Halts capital deployment during a price discount. Creates a projected ₹9.4L shortfall against the Child Education goal.',
    color: '#dc2626', // rose/red
  },
];

export const DEMO_DECISION_FACTORS: DecisionFactor[] = [
  {
    factor: 'Market Movement',
    status: 'Alert',
    weight: 'High',
    value: '-8.2% (Simulated)',
    explanation:
      'Broad benchmark correction is transient and macro-driven, historically offering favorable rupee-cost accumulation phases.',
  },
  {
    factor: 'Portfolio Movement',
    status: 'Buffer',
    weight: 'High',
    value: '-6.8% (Simulated)',
    explanation:
      'Your portfolio demonstrated a 1.4% defensive buffer versus the market, confirming asset allocation resilience.',
  },
  {
    factor: 'Investment Horizon',
    status: 'Aligned',
    weight: 'High',
    value: '6+ Years Remaining',
    explanation:
      'A 6-year runway is sufficient to absorb cyclical equity down-cycles and benefit from economic recovery.',
  },
  {
    factor: 'Financial Goal Urgency',
    status: 'Critical',
    weight: 'High',
    value: 'Child Education (Non-Negotiable)',
    explanation:
      'College enrollment timelines cannot be delayed easily. Target completion date is 2032.',
  },
  {
    factor: 'Goal Progress',
    status: 'Aligned',
    weight: 'Medium',
    value: '71% (₹24.85L / ₹35L)',
    explanation:
      'You are within striking distance of your goal, making uninterrupted compounding in the final 6 years decisive.',
  },
  {
    factor: 'Risk Profile',
    status: 'Aligned',
    weight: 'Medium',
    value: 'Moderate (Balanced Growth)',
    explanation:
      'Asset allocation matches a Moderate investor capable of tolerating temporary mark-to-market drawdowns.',
  },
  {
    factor: 'SIP Contribution Impact',
    status: 'Critical',
    weight: 'High',
    value: '₹25,000/Month',
    explanation:
      'Current contributions buy units at lower NAVs during this simulated dip. Pausing forfeits this rupee-cost advantage.',
  },
];

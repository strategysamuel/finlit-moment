import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppRoute,
  DecisionAction,
  RecordedDecision,
  AIDecisionSupportResponse,
  GeminiMomentInsight,
} from '../types';
import {
  DEMO_INVESTOR,
  DEMO_PORTFOLIO,
  DEMO_GOALS,
  DEMO_INVESTMENTS,
  DEMO_MARKET_EVENT,
  DEMO_DECISION_CONTEXT,
} from '../data/demoData';
import { INITIAL_DECISION_MEMORY_RECORDS } from '../data/decisionMemoryData';
import { MomentDecisionRecord } from '../types/decisionMemory';
import { aiService } from '../services/aiService';

export interface CompetitionJourneyStep {
  step: number;
  id: AppRoute;
  numberLabel: string;
  name: string;
  shortDesc: string;
}

export const COMPETITION_JOURNEY_STEPS: CompetitionJourneyStep[] = [
  { step: 0, id: 'sip-details', numberLabel: '01', name: 'Decision Trigger', shortDesc: 'Market drawdown prompts SIP review' },
  { step: 1, id: 'moment-intervention', numberLabel: '02', name: 'MOMENT', shortDesc: 'Context pause before action' },
  { step: 2, id: 'simulator', numberLabel: '03', name: 'What-If', shortDesc: 'Deterministic scenario modeling' },
  { step: 3, id: 'decision-confirmation', numberLabel: '04', name: 'Decision', shortDesc: 'Sovereign investor choice' },
  { step: 4, id: 'decision-memory', numberLabel: '05', name: 'Memory', shortDesc: 'Contextual decision journal' },
  { step: 5, id: 'follow-up', numberLabel: '06', name: 'Follow-Up', shortDesc: 'Longitudinal context monitoring' },
  { step: 6, id: 'decision-reflection', numberLabel: '07', name: 'Reflection', shortDesc: 'Behavioral intelligence review' },
  { step: 7, id: 'decision-brief', numberLabel: '08', name: 'Brief', shortDesc: 'Contextual decision brief' },
];

interface AppContextType {
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute, options?: { action?: 'pause' | 'reduce' }) => void;
  proposedAction: 'pause' | 'reduce';
  setProposedAction: (action: 'pause' | 'reduce') => void;
  selectedScenario: DecisionAction;
  setSelectedScenario: (scenario: DecisionAction) => void;
  geminiInsight: GeminiMomentInsight | null;
  isLoadingAI: boolean;
  aiError: string | null;
  refreshAI: () => Promise<void>;
  recordedDecisions: RecordedDecision[];
  recordDecision: (action: DecisionAction, notes?: string) => void;
  lastDecision: RecordedDecision | null;
  resetDemo: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  aiResponse: AIDecisionSupportResponse | null;
  decisionMemoryRecords: MomentDecisionRecord[];
  selectedMemoryId: string;
  setSelectedMemoryId: (id: string) => void;
  // M8 Competition Demo additions
  isCompetitionDemoActive: boolean;
  setIsCompetitionDemoActive: (active: boolean) => void;
  competitionStep: number;
  setCompetitionStep: (step: number) => void;
  startCompetitionDemo: () => void;
  exitCompetitionDemo: () => void;
  nextCompetitionStep: () => void;
  prevCompetitionStep: () => void;
  isWhyMomentOpen: boolean;
  setIsWhyMomentOpen: (open: boolean) => void;
  isAiArchitectureOpen: boolean;
  setIsAiArchitectureOpen: (open: boolean) => void;
  isOneMinuteStoryOpen: boolean;
  setIsOneMinuteStoryOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const [proposedAction, setProposedAction] = useState<'pause' | 'reduce'>('pause');
  const [selectedScenario, setSelectedScenario] = useState<DecisionAction>('continue');
  const [geminiInsight, setGeminiInsight] = useState<GeminiMomentInsight | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [recordedDecisions, setRecordedDecisions] = useState<RecordedDecision[]>([]);
  const [lastDecision, setLastDecision] = useState<RecordedDecision | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [decisionMemoryRecords, setDecisionMemoryRecords] = useState<MomentDecisionRecord[]>(
    INITIAL_DECISION_MEMORY_RECORDS
  );
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>(
    INITIAL_DECISION_MEMORY_RECORDS[0].id
  );

  // M8 Competition Demo States
  const [isCompetitionDemoActive, setIsCompetitionDemoActive] = useState<boolean>(false);
  const [competitionStep, setCompetitionStep] = useState<number>(0);
  const [isWhyMomentOpen, setIsWhyMomentOpen] = useState<boolean>(false);
  const [isAiArchitectureOpen, setIsAiArchitectureOpen] = useState<boolean>(false);
  const [isOneMinuteStoryOpen, setIsOneMinuteStoryOpen] = useState<boolean>(false);

  // Load baseline Gemini moment insight on mount
  React.useEffect(() => {
    loadAI(proposedAction);
  }, []);

  const loadAI = async (action: 'pause' | 'reduce') => {
    setIsLoadingAI(true);
    setAiError(null);
    try {
      const insight = await aiService.generateMomentInsight({
        investor: DEMO_INVESTOR,
        portfolio: DEMO_PORTFOLIO,
        goal: DEMO_GOALS[0],
        investment: DEMO_INVESTMENTS[0],
        marketContext: DEMO_MARKET_EVENT,
        decisionContext: {
          ...DEMO_DECISION_CONTEXT,
          proposedAction: action,
        },
      });
      setGeminiInsight(insight);
      if (insight.isFallback && insight.errorNote) {
        setAiError(insight.errorNote);
      }
    } catch (e: any) {
      console.error('Failed to load AI decision support:', e);
      setAiError("MOMENT couldn't generate a fresh AI insight right now.");
      const fallback = aiService.getFallbackInsight({
        investor: DEMO_INVESTOR,
        portfolio: DEMO_PORTFOLIO,
        goal: DEMO_GOALS[0],
        investment: DEMO_INVESTMENTS[0],
        marketContext: DEMO_MARKET_EVENT,
        decisionContext: {
          ...DEMO_DECISION_CONTEXT,
          proposedAction: action,
        },
      });
      setGeminiInsight(fallback);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const navigateTo = (route: AppRoute, options?: { action?: 'pause' | 'reduce' }) => {
    const nextAction = options?.action || proposedAction;
    if (options?.action) {
      setProposedAction(options.action);
    }

    if (route === 'moment-intervention') {
      loadAI(nextAction);
    }

    setCurrentRoute(route);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshAI = async () => {
    await loadAI(proposedAction);
  };

  const recordDecision = (action: DecisionAction, notes?: string) => {
    const primaryFund = DEMO_INVESTMENTS[0];
    let newSip = primaryFund.monthlySip;
    if (action === 'pause') newSip = 0;
    if (action === 'reduce') newSip = Math.round(primaryFund.monthlySip / 2);

    const newRec: RecordedDecision = {
      id: 'dec-' + Date.now(),
      action,
      investmentName: primaryFund.name,
      goalName: 'Child Education',
      previousSip: primaryFund.monthlySip,
      newSip,
      recordedAt: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      notes:
        notes ||
        (action === 'continue'
          ? 'Continued standard SIP after reviewing compounding impact & scenario projections.'
          : action === 'reduce'
          ? 'Reduced SIP by 50% to balance monthly cash flow while keeping goal trajectory active.'
          : 'Paused SIP temporarily. Rupee-cost accumulation on hold.'),
    };

    setRecordedDecisions((prev) => [newRec, ...prev]);
    setLastDecision(newRec);

    // Also synchronize current simulated decision memory record
    setDecisionMemoryRecords((prev) =>
      prev.map((rec) =>
        rec.id === 'decision-oct-2026'
          ? {
              ...rec,
              selectedScenario: action,
              selectedScenarioLabel:
                action === 'continue'
                  ? 'Continue SIP'
                  : action === 'reduce'
                  ? 'Reduce SIP'
                  : 'Pause SIP',
              investorDecision:
                action === 'continue'
                  ? 'Continue SIP'
                  : action === 'reduce'
                  ? 'Reduce SIP'
                  : 'Pause SIP',
              currentSip: newSip,
              projectedValue:
                action === 'continue' ? 7145872 : action === 'reduce' ? 5899483 : 4653094,
              projectedSurplus:
                action === 'continue' ? 3645872 : action === 'reduce' ? 2399483 : 1153094,
            }
          : rec
      )
    );

    navigateTo('decision-confirmation');
  };

  const resetDemo = () => {
    setRecordedDecisions([]);
    setLastDecision(null);
    setProposedAction('pause');
    setSelectedScenario('continue');
    setDecisionMemoryRecords(INITIAL_DECISION_MEMORY_RECORDS);
    setSelectedMemoryId(INITIAL_DECISION_MEMORY_RECORDS[0].id);
    setCompetitionStep(0);
    navigateTo('dashboard');
  };

  const startCompetitionDemo = () => {
    setIsCompetitionDemoActive(true);
    setCompetitionStep(0);
    navigateTo('sip-details');
  };

  const exitCompetitionDemo = () => {
    setIsCompetitionDemoActive(false);
  };

  const nextCompetitionStep = () => {
    if (competitionStep < COMPETITION_JOURNEY_STEPS.length - 1) {
      const next = competitionStep + 1;
      setCompetitionStep(next);
      navigateTo(COMPETITION_JOURNEY_STEPS[next].id);
    } else {
      setIsCompetitionDemoActive(false);
      navigateTo('dashboard');
    }
  };

  const prevCompetitionStep = () => {
    if (competitionStep > 0) {
      const prev = competitionStep - 1;
      setCompetitionStep(prev);
      navigateTo(COMPETITION_JOURNEY_STEPS[prev].id);
    }
  };

  // Convert GeminiMomentInsight to legacy structure if needed
  const legacyAiResponse: AIDecisionSupportResponse | null = geminiInsight
    ? {
        decisionType: 'SIP_PAUSE_OR_REDUCE',
        headline: geminiInsight.headline,
        subheading: 'Let’s look at what this decision could mean for your portfolio and your goal.',
        summary: geminiInsight.summary,
        marketContext: {
          marketMovementPercent: DEMO_MARKET_EVENT.marketMovementPercent,
          portfolioMovementPercent: DEMO_PORTFOLIO.recentMovementPercent,
          narrative: geminiInsight.marketContext,
        },
        portfolioContext: {
          portfolioValue: DEMO_PORTFOLIO.totalValue,
          healthScore: DEMO_PORTFOLIO.healthScore,
          narrative: geminiInsight.portfolioContext,
        },
        goalContext: {
          goalName: DEMO_GOALS[0].title,
          targetAmount: DEMO_GOALS[0].targetAmount,
          yearsRemaining: DEMO_GOALS[0].yearsRemaining,
          progressPercent: DEMO_GOALS[0].progressPercent,
          narrative: geminiInsight.goalContext,
        },
        riskContext: {
          investorRisk: DEMO_INVESTOR.riskProfile,
          investmentRisk: DEMO_INVESTMENTS[0].riskCategory,
          narrative: geminiInsight.riskContext,
        },
        decisionImpact: {
          potentialCorpusLoss: 940000,
          potentialGoalDelayYears: 2.8,
          rupeeCostAveragingOpportunity: geminiInsight.decisionImpact,
        },
        scenarios: [
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
              geminiInsight.alternatives.find((a) => a.action === 'CONTINUE')?.description ||
              'Capitalizes on lower NAVs during the simulated market dip, maintaining compounding trajectory.',
            color: '#059669',
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
              geminiInsight.alternatives.find((a) => a.action === 'REDUCE')?.description ||
              'Provides immediate monthly cash-flow relief while preserving partial cost averaging.',
            color: '#d97706',
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
              geminiInsight.alternatives.find((a) => a.action === 'PAUSE')?.description ||
              'Halts capital deployment during a price discount. Creates a projected ₹9.4L shortfall.',
            color: '#dc2626',
          },
        ],
        explanation: {
          factors: [
            {
              factor: 'Market Movement',
              status: 'Alert',
              weight: 'High',
              value: `${DEMO_MARKET_EVENT.marketMovementPercent}% (Simulated)`,
              explanation: geminiInsight.marketContext,
            },
            {
              factor: 'Portfolio Movement',
              status: 'Buffer',
              weight: 'High',
              value: `${DEMO_PORTFOLIO.recentMovementPercent}% (Simulated)`,
              explanation: geminiInsight.portfolioContext,
            },
            {
              factor: 'Investment Horizon',
              status: 'Aligned',
              weight: 'High',
              value: '6+ Years Remaining',
              explanation: geminiInsight.riskContext,
            },
            {
              factor: 'Financial Goal Urgency',
              status: 'Critical',
              weight: 'High',
              value: 'Child Education (Non-Negotiable)',
              explanation: geminiInsight.goalContext,
            },
            {
              factor: 'Goal Progress',
              status: 'Aligned',
              weight: 'Medium',
              value: `${DEMO_GOALS[0].progressPercent}% completed`,
              explanation: 'Uninterrupted compounding in the final 6 years is decisive for the ₹35L target.',
            },
            {
              factor: 'Risk Profile',
              status: 'Aligned',
              weight: 'Medium',
              value: `${DEMO_INVESTOR.riskProfile} Risk`,
              explanation: geminiInsight.riskContext,
            },
            {
              factor: 'SIP Contribution Impact',
              status: 'Critical',
              weight: 'High',
              value: '₹25,000/Month',
              explanation: geminiInsight.decisionImpact,
            },
          ],
          detailedAnalysis: geminiInsight.summary,
          modelConfidencePercent: Math.round(geminiInsight.confidence * 100),
        },
        confidence: Math.round(geminiInsight.confidence * 100),
        userControl: {
          isUserDecisionFinal: true,
          statement: 'MOMENT provides information and scenarios. The final investment decision always remains yours.',
        },
      }
    : null;

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        proposedAction,
        setProposedAction,
        selectedScenario,
        setSelectedScenario,
        geminiInsight,
        isLoadingAI,
        aiError,
        refreshAI,
        recordedDecisions,
        recordDecision,
        lastDecision,
        resetDemo,
        isSidebarOpen,
        setIsSidebarOpen,
        aiResponse: legacyAiResponse,
        decisionMemoryRecords,
        selectedMemoryId,
        setSelectedMemoryId,
        isCompetitionDemoActive,
        setIsCompetitionDemoActive,
        competitionStep,
        setCompetitionStep,
        startCompetitionDemo,
        exitCompetitionDemo,
        nextCompetitionStep,
        prevCompetitionStep,
        isWhyMomentOpen,
        setIsWhyMomentOpen,
        isAiArchitectureOpen,
        setIsAiArchitectureOpen,
        isOneMinuteStoryOpen,
        setIsOneMinuteStoryOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

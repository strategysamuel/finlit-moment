/**
 * FinLit MOMENT Follow-Up Intelligence Types (Milestone 5)
 *
 * Centralized data models capturing post-decision context evolution,
 * comparing "At Decision" vs "Current" conditions, and driving
 * non-prescriptive AI follow-up intelligence.
 */

export interface AuthoritativeM5Comparison {
  decisionDate: string;
  followUpDate: string;
  decisionMarketMovement: number;
  followUpMarketMovement: number;
  decisionPortfolioMovement: number;
  followUpPortfolioMovement: number;
  decisionGoalProgress: number;
  followUpGoalProgress: number;
  decisionAccumulated: number;
  followUpAccumulated: number;
  decisionSip: number;
  followUpSip: number;
  decisionHorizon: string;
  followUpHorizon: string;
  goalName: string;
  goalTarget: number;
  decisionAction: string;
  accumulatedCapitalChange: number;
  marketMovementChange: number;
  portfolioMovementChange: number;
  goalProgressChange: number;
}

export interface FollowUpContextData {
  decision: string;
  previousSip: number;
  currentSip: number;
  decisionDate: string;
  followUpDate: string;
  goalName: string;
  goalTarget: number;
  atDecision: {
    marketMovement: number;
    portfolioMovement: number;
    goalProgress: number;
    accumulatedAmount: number;
    monthlySip: number;
    remainingHorizon: string;
  };
  current: {
    marketMovement: number;
    portfolioMovement: number;
    goalProgress: number;
    accumulatedAmount: number;
    monthlySip: number;
    remainingHorizon: string;
  };
}

export interface FollowUpIntelligenceResponse {
  headline: string;
  summary: string;
  whatChanged: string[];
  whatStayedSimilar: string[];
  goalContext: string;
  decisionContext: string;
  reviewFactors: string[];
  confidence: string; // "Context completeness: High"
  disclaimer: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  generatedAt?: string;
}

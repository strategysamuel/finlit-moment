import { AuthoritativeM5Comparison, FollowUpContextData } from '../types/followUp';

/**
 * Single Authoritative Source of Truth for M5 Comparison
 *
 * Governs all comparison values between the October 5, 2026 decision
 * and the November 15, 2026 simulated follow-up review.
 * All UI cards, diff calculations, and intelligence prompts derive from this object.
 */
export const AUTHORITATIVE_M5_COMPARISON: AuthoritativeM5Comparison = {
  decisionDate: 'October 5, 2026',
  followUpDate: 'November 15, 2026',
  decisionMarketMovement: -8.2,
  followUpMarketMovement: -4.8,
  decisionPortfolioMovement: -6.8,
  followUpPortfolioMovement: -3.9,
  decisionGoalProgress: 71,
  followUpGoalProgress: 72,
  decisionAccumulated: 2485000,
  followUpAccumulated: 2512000,
  decisionSip: 25000,
  followUpSip: 12500,
  decisionHorizon: '6.0 years',
  followUpHorizon: '5.9 years',
  goalName: 'Child Education',
  goalTarget: 3500000,
  decisionAction: 'Reduce SIP',
  // Derived exact changes:
  accumulatedCapitalChange: 2512000 - 2485000, // ₹27,000 increase since decision
  marketMovementChange: parseFloat((-4.8 - -8.2).toFixed(1)), // +3.4%
  portfolioMovementChange: parseFloat((-3.9 - -6.8).toFixed(1)), // +2.9%
  goalProgressChange: 72 - 71, // +1%
};

/**
 * Backwards-compatible context data mapping directly to the authoritative comparison object.
 */
export const SYNTHETIC_FOLLOW_UP_DATA: FollowUpContextData = {
  decision: AUTHORITATIVE_M5_COMPARISON.decisionAction,
  previousSip: AUTHORITATIVE_M5_COMPARISON.decisionSip,
  currentSip: AUTHORITATIVE_M5_COMPARISON.followUpSip,
  decisionDate: AUTHORITATIVE_M5_COMPARISON.decisionDate,
  followUpDate: AUTHORITATIVE_M5_COMPARISON.followUpDate,
  goalName: AUTHORITATIVE_M5_COMPARISON.goalName,
  goalTarget: AUTHORITATIVE_M5_COMPARISON.goalTarget,
  atDecision: {
    marketMovement: AUTHORITATIVE_M5_COMPARISON.decisionMarketMovement,
    portfolioMovement: AUTHORITATIVE_M5_COMPARISON.decisionPortfolioMovement,
    goalProgress: AUTHORITATIVE_M5_COMPARISON.decisionGoalProgress,
    accumulatedAmount: AUTHORITATIVE_M5_COMPARISON.decisionAccumulated,
    monthlySip: AUTHORITATIVE_M5_COMPARISON.decisionSip,
    remainingHorizon: AUTHORITATIVE_M5_COMPARISON.decisionHorizon,
  },
  current: {
    marketMovement: AUTHORITATIVE_M5_COMPARISON.followUpMarketMovement,
    portfolioMovement: AUTHORITATIVE_M5_COMPARISON.followUpPortfolioMovement,
    goalProgress: AUTHORITATIVE_M5_COMPARISON.followUpGoalProgress,
    accumulatedAmount: AUTHORITATIVE_M5_COMPARISON.followUpAccumulated,
    monthlySip: AUTHORITATIVE_M5_COMPARISON.followUpSip,
    remainingHorizon: AUTHORITATIVE_M5_COMPARISON.followUpHorizon,
  },
};

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Server-owned system instruction enforcing financial guardrails and non-transactional decision support
const SYSTEM_INSTRUCTION = `You are MOMENT, a financial decision-support assistant for FinLit Ventures.

Your role is to help retail investors understand the context and potential implications of an investment decision before they act.

You must:
- explain relevant portfolio context
- explain relevant goal context
- explain relevant market context
- explain investment horizon
- explain risk context
- distinguish facts from estimates
- clearly identify simulated data
- communicate uncertainty
- present alternatives
- keep the investor in control

You must NOT:
- execute financial transactions
- claim guaranteed returns
- predict markets with certainty
- pressure the investor
- claim to know the future
- make autonomous investment decisions
- present simulations as guaranteed outcomes

You are providing decision support, not executing the user's financial decision.`;

const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    decisionType: { type: Type.STRING },
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    marketContext: { type: Type.STRING },
    portfolioContext: { type: Type.STRING },
    goalContext: { type: Type.STRING },
    riskContext: { type: Type.STRING },
    decisionImpact: { type: Type.STRING },
    factors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    alternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['action', 'description'],
      },
    },
    confidence: { type: Type.NUMBER },
    disclaimer: { type: Type.STRING },
  },
  required: [
    'decisionType',
    'headline',
    'summary',
    'marketContext',
    'portfolioContext',
    'goalContext',
    'riskContext',
    'decisionImpact',
    'factors',
    'alternatives',
    'confidence',
    'disclaimer',
  ],
};

function getDeterministicFallback(context: any) {
  const isReduce = context?.decisionContext?.proposedAction === 'reduce';
  return {
    decisionType: isReduce ? 'SIP_REDUCE' : 'SIP_PAUSE',
    headline: isReduce
      ? 'Before you reduce your SIP...'
      : 'Before you pause your SIP...',
    summary:
      'The recent decline of 6.8% in your portfolio appears broadly aligned with the simulated 8.2% market movement. Because your education goal is still 6 years away, pausing your ₹25,000 monthly SIP could reduce the amount being accumulated and forfeit rupee-cost averaging advantages during this simulated dip.',
    marketContext:
      'Simulated Nifty 50 benchmark index experienced a -8.2% pullback under synthetic macro testing conditions. Broad market volatility is an expected occurrence in equity investing.',
    portfolioContext:
      'Your portfolio is down -6.8% (current value ₹18,42,600), demonstrating a +1.4% defensive buffer over the simulated market dip due to moderate asset diversification across debt and equities.',
    goalContext:
      'Your Child Education goal requires ₹35,00,000 with 6 years remaining (Year 2032). You have accumulated ₹24,85,000 (71% of target), making the final 6 years of uninterrupted contributions decisive.',
    riskContext:
      'As a Moderate risk investor with a 6+ year horizon, temporary cyclical drawdowns are a standard trade-off for long-term real wealth creation.',
    decisionImpact:
      'Pausing completely halts monthly capital deployment when prices are lower, creating an estimated ₹9.4L shortfall against your ₹35L goal and potentially delaying goal realization by 2.8 years.',
    factors: [
      'Market movement: -8.2% (Simulated Nifty 50 dip)',
      'Portfolio movement: -6.8% (+1.4% defensive buffer)',
      'Investment horizon: 6+ years remaining until 2032',
      'Financial goal: Child Education (Target ₹35,00,000)',
      'Goal progress: 71% completed (₹24.85L accumulated)',
      'Risk profile: Moderate risk tolerance',
      'SIP amount: ₹25,000/month regular contribution in FinLit Flexi Growth Fund',
    ],
    alternatives: [
      {
        action: 'CONTINUE',
        description:
          'Maintain regular ₹25,000/month SIP to accumulate additional units at discounted NAVs during this simulated correction.',
      },
      {
        action: 'REDUCE',
        description:
          'Lower monthly allocation to ₹12,500/month (50% reduction) to balance monthly cash flow while keeping 89% of your education goal funded.',
      },
      {
        action: 'PAUSE',
        description:
          'Halt all contributions temporarily. Understand that this leaves an estimated ₹9.4L funding gap for college matriculation in 2032.',
      },
    ],
    confidence: 0.87,
    disclaimer:
      'Illustrative simulation based on synthetic assumptions. Actual investment outcomes may differ. Investor remains in full control.',
    isAiGenerated: false,
    isFallback: true,
    generatedAt: new Date().toISOString(),
    errorNote: undefined as string | undefined,
  };
}

// Shared helper for resilient server-side Gemini structured content generation
async function generateGeminiContentWithRetry({
  ai,
  candidateModels,
  contents,
  systemInstruction,
  responseSchema,
  endpointName = 'Gemini Integration',
}: {
  ai: GoogleGenAI;
  candidateModels: string[];
  contents: string;
  systemInstruction: string;
  responseSchema: any;
  endpointName?: string;
}): Promise<{ parsed: any; modelUsed: string } | null> {
  for (const modelToTry of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[${endpointName}] Calling model ${modelToTry} (attempt ${attempt + 1})...`);
        const response = await ai.models.generateContent({
          model: modelToTry,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          console.log(`[${endpointName}] Successfully received response from ${modelToTry}`);
          return { parsed, modelUsed: modelToTry };
        }
      } catch (error: any) {
        const statusCode = error?.status || error?.code || error?.response?.status;
        const errorMessage = error?.message || String(error);
        console.warn(
          `[${endpointName}] Model ${modelToTry} attempt ${attempt + 1} notice: status=${statusCode}, message=${errorMessage}`
        );
        // On transient 503 (model overloaded) or 429, wait 350ms before retrying
        if (attempt === 0 && (statusCode === 503 || statusCode === 429 || errorMessage.includes('overloaded') || errorMessage.includes('Resource exhausted'))) {
          await new Promise((r) => setTimeout(r, 350));
        }
      }
    }
  }

  console.warn(`[${endpointName}] Candidate models temporarily busy. Seamlessly serving deterministic fallback.`);
  return null;
}

// Dedicated server-side Gemini decision-support endpoint
app.post('/api/ai/decision-support', async (req: Request, res: Response) => {
  const context = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  console.log(`[Gemini Integration] GEMINI_API_KEY configured: ${hasKey}`);

  if (!hasKey) {
    console.warn('[Gemini Integration] No valid API key present, serving deterministic fallback.');
    const fallback = getDeterministicFallback(context);
    fallback.errorNote = 'GEMINI_API_KEY not configured in environment.';
    return res.json(fallback);
  }

  // Model selection: configurable via env var with intelligent fallback cascade
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = Array.from(new Set([configuredModel, 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `
Investor Context (Simulated Demo Data):
- Name: ${context.investor?.name || 'Priya Sharma'}, Age: ${context.investor?.age || 34}, Occupation: ${context.investor?.occupation || 'IT Professional'}
- Risk Profile: ${context.investor?.riskProfile || 'Moderate'}
- Investment Horizon: ${context.investor?.investmentHorizon || '6+ years'}
- Portfolio Current Value: ₹${context.portfolio?.totalValue || 1842600}, Invested: ₹${context.portfolio?.totalInvested || 1580000}
- Recent Portfolio Movement: ${context.portfolio?.recentMovementPercent || -6.8}%
- Simulated Market Movement (Nifty 50): ${context.marketContext?.marketMovementPercent || -8.2}%
- Proposed Action: ${context.decisionContext?.proposedAction?.toUpperCase() || 'SIP_PAUSE'}
- Specific Fund: ${context.investment?.name || 'FinLit Flexi Growth Fund'} (Monthly SIP: ₹${context.investment?.monthlySip || 25000}, Current: ₹${context.investment?.currentValue || 1120000}, Invested: ₹${context.investment?.investedValue || 940000}, XIRR: ${context.investment?.xirr || 12.8}%)
- Linked Financial Goal: ${context.goal?.title || 'Child Education'} (Target: ₹${context.goal?.targetAmount || 3500000}, Progress: ${context.goal?.progressPercent || 71}%, Years Remaining: ${context.goal?.yearsRemaining || 6})

Analyze this decision context and return structured JSON decision support.
Include 3 distinct alternatives with action values "CONTINUE", "REDUCE", and "PAUSE".
Distinguish synthetic facts from illustrative simulations. Remind the investor that they remain in complete control.`;

  const result = await generateGeminiContentWithRetry({
    ai,
    candidateModels,
    contents: promptText,
    systemInstruction: SYSTEM_INSTRUCTION,
    responseSchema: geminiResponseSchema,
    endpointName: 'Gemini Decision Support',
  });

  if (result) {
    return res.json({
      ...result.parsed,
      isAiGenerated: true,
      isFallback: false,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString(),
    });
  }

  // If all candidate models failed or timed out, return the safe deterministic fallback
  const fallback = getDeterministicFallback(context);
  fallback.errorNote = 'Upstream AI model temporarily unavailable; deterministic fallback served.';
  return res.json(fallback);
});

// System instruction for M3 Scenario Explanation Layer
const SCENARIO_EXPLANATION_INSTRUCTION = `You are the MOMENT explanation layer.
The application has already calculated the numerical scenario results deterministically.
Your job is only to explain those results clearly and neutrally.
Never modify, recalculate or invent numerical values.
Never predict future market performance.
Never guarantee investment outcomes.
Never instruct the investor which scenario to choose.
Clearly distinguish illustrative scenarios from actual financial outcomes.
The investor remains fully in control.`;

const scenarioExplanationSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    plainLanguageExplanation: { type: Type.STRING },
    tradeoffSummary: { type: Type.STRING },
    horizonContext: { type: Type.STRING },
    disclaimer: { type: Type.STRING },
  },
  required: [
    'headline',
    'plainLanguageExplanation',
    'tradeoffSummary',
    'horizonContext',
    'disclaimer',
  ],
};

function getDeterministicScenarioExplanation(scenario: string, results: any) {
  if (scenario === 'pause') {
    return {
      headline: 'Scenario Analysis: Pausing Contributions (₹0/mo)',
      plainLanguageExplanation:
        'With the SIP paused (₹0/month), your existing accumulated balance of ₹24,85,000 continues to compound at the illustrative 10.5% annual rate, projecting a 6-year value of ₹46,53,094. This exceeds the ₹35,00,000 target by an estimated surplus of ₹11,53,094.',
      tradeoffSummary:
        'Pausing preserves ₹25,000 in monthly cash flow today. While the target is still met under these baseline assumptions, pausing leaves ₹24,92,778 less total wealth than continuing, resulting in a smaller safety margin against future inflation or market downturns.',
      horizonContext:
        'Over the 6-year horizon to 2032, the goal remains fully funded on schedule without timeline delay under these assumptions.',
      disclaimer:
        'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
      isAiGenerated: false,
      isFallback: true,
      modelUsed: 'deterministic-engine',
    };
  }
  if (scenario === 'reduce') {
    return {
      headline: 'Scenario Analysis: Reducing SIP by 50% (₹12,500/mo)',
      plainLanguageExplanation:
        'Under this illustrative scenario, contributing ₹12,500/month projects a final corpus of ₹58,99,483 over 6 years under the 10.5% return assumption. This exceeds the ₹35,00,000 target with an estimated surplus of ₹23,99,483.',
      tradeoffSummary:
        'Frees up ₹12,500 in monthly liquidity while maintaining active compounding, creating a substantial ₹23.99L cushion above your goal.',
      horizonContext:
        'Over the 6-year horizon to 2032, the goal remains fully funded on schedule without timeline delay under these assumptions.',
      disclaimer:
        'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
      isAiGenerated: false,
      isFallback: true,
      modelUsed: 'deterministic-engine',
    };
  }
  return {
    headline: 'Scenario Analysis: Continuing Regular SIP (₹25,000/mo)',
    plainLanguageExplanation:
      'Under this illustrative scenario, continuing your full ₹25,000 monthly SIP projects a corpus of ₹71,45,872 over 6 years under the 10.5% return assumption, generating an estimated surplus of ₹36,45,872 over your ₹35,00,000 target.',
    tradeoffSummary:
      'Maximizes long-term compounding and unit accumulation during market dips, creating the largest wealth cushion for your child\'s higher education.',
    horizonContext:
      'Over the 6-year horizon to 2032, the goal remains fully funded on schedule without timeline delay under these assumptions.',
    disclaimer:
      'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
    isAiGenerated: false,
    isFallback: true,
    modelUsed: 'deterministic-engine',
  };
}

// Dedicated server-side Gemini Scenario Explanation endpoint
app.post('/api/ai/scenario-explanation', async (req: Request, res: Response) => {
  const { selectedScenario, calculatedResults, investor, goal, assumptions } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!hasKey) {
    return res.json(getDeterministicScenarioExplanation(selectedScenario, calculatedResults));
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = Array.from(new Set([configuredModel, 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `
Investor Context:
- Name: ${investor?.name || 'Priya Sharma'}, Age: ${investor?.age || 34}, Horizon: ${investor?.investmentHorizon || '6+ years'}
- Goal: ${goal?.title || 'Child Education'} (Target: ₹35,00,000, Current Accumulated: ₹24,85,000, Years Remaining: 6)

Selected Illustrative Scenario: ${selectedScenario?.toUpperCase() || 'CONTINUE'}
Deterministic Calculated Numbers (DO NOT ALTER OR INVENT NEW NUMBERS):
- Monthly SIP: ₹${calculatedResults?.monthlySip || (selectedScenario === 'continue' ? 25000 : selectedScenario === 'reduce' ? 12500 : 0)}
- Projected Value at Year 6: ₹${(calculatedResults?.projectedValue || calculatedResults?.projectedCorpusAtYear6 || (selectedScenario === 'continue' ? 7145872 : selectedScenario === 'reduce' ? 5899483 : 4653094)).toLocaleString('en-IN')}
- Target Value: ₹35,00,000
- Goal Status: SURPLUS
- Estimated Surplus: ₹${(calculatedResults?.surplus || (selectedScenario === 'continue' ? 3645872 : selectedScenario === 'reduce' ? 2399483 : 1153094)).toLocaleString('en-IN')}
- Timeline Delay: 0 years (Target Met on Schedule by 2032)
- Assumptions: Annual return ${(assumptions?.annualIllustrativeReturn * 100 || 10.5).toFixed(1)}%, 6 years remaining

Explain these exact calculated results in plain, neutral, professional language.
Crucial context: Note that because Priya already has ₹24,85,000 accumulated, compounding at 10.5% results in an estimated surplus above the ₹35L goal in ALL three scenarios. Explain that Continue builds the largest safety cushion (+₹36.45L surplus), Reduce builds a balanced cushion (+₹23.99L surplus) with cash-flow relief, and Pause still achieves the target (+₹11.53L surplus) but leaves the narrowest margin of safety against future market or inflation changes.
Do not modify or recalculate any numbers. Never predict markets or guarantee outcomes. Remind the investor that they remain in control.`;

  const result = await generateGeminiContentWithRetry({
    ai,
    candidateModels,
    contents: promptText,
    systemInstruction: SCENARIO_EXPLANATION_INSTRUCTION,
    responseSchema: scenarioExplanationSchema,
    endpointName: 'Scenario Explanation',
  });

  if (result) {
    return res.json({
      ...result.parsed,
      isAiGenerated: true,
      isFallback: false,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString(),
    });
  }

  // Graceful deterministic fallback
  return res.json(getDeterministicScenarioExplanation(selectedScenario, calculatedResults));
});

// System instruction for M4 Decision Memory Comparison Layer
const DECISION_MEMORY_COMPARISON_INSTRUCTION = `You are the MOMENT Decision Memory comparison layer for FinLit Ventures.
Your role is to explain the differences between the current decision context and a past recorded decision context in neutral, objective language.
You must:
- Highlight what changed (e.g. market drawdown severity, goal progress accumulated).
- Highlight what stayed similar (e.g. investment horizon, committed monthly SIP, risk profile).
- Provide neutral context without telling the investor what action to take.
- Keep the investor in complete control.
You must NOT:
- Execute financial transactions or place orders.
- Provide financial advice or recommend specific actions.
- Predict future market returns or claim certainty.
- Calculate or invent financial returns or projected values (those are supplied deterministically by the application).
- Pressure the investor.`;

const memoryComparisonSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    whatChanged: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    whatStayedSimilar: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    goalContext: { type: Type.STRING },
    decisionContext: { type: Type.STRING },
    neutralObservation: { type: Type.STRING },
    confidenceLabel: { type: Type.STRING },
    disclaimer: { type: Type.STRING },
  },
  required: [
    'headline',
    'summary',
    'whatChanged',
    'whatStayedSimilar',
    'goalContext',
    'decisionContext',
    'neutralObservation',
    'confidenceLabel',
    'disclaimer',
  ],
};

function getDeterministicMemoryComparison(current: any, previous: any) {
  return {
    headline: "What's Different Today Compared to Your Previous Decision",
    summary:
      "Today's market movement is more pronounced (-8.2% vs -4.1%) than in the previous recorded decision, while your goal progress has increased from 62% to 71%. The remaining horizon is still long enough to evaluate the decision in the context of the full goal rather than short-term market movement.",
    whatChanged: [
      "Market decline is steeper today (-8.2% vs -4.1% in July 2026).",
      "Portfolio movement is lower (-6.8% vs -3.2% in July 2026).",
      "Goal progress has strengthened from 62% to 71% (accumulated ₹24.85L vs ₹21.70L).",
      "Remaining horizon is now 6.0 years until target year 2032.",
    ],
    whatStayedSimilar: [
      "Committed monthly SIP amount remains ₹25,000 in FinLit Flexi Growth Fund.",
      "Investor risk tolerance profile remains Moderate.",
      "Primary anchor remains Child Education with a ₹35,00,000 target.",
      "Investor sovereignty: every choice remains under your direct control.",
    ],
    goalContext:
      "Your accumulated corpus is now ₹24,85,000 (71% of target), which creates a larger base for long-term compounding than during the previous review.",
    decisionContext:
      "In July, you chose to continue contributions through a -4.1% market dip. Today's -8.2% contraction represents a wider pullback, but occurs against a stronger goal foundation.",
    neutralObservation:
      "Evaluating decisions against long-term goal horizons helps prevent emotional reactions to short-term market volatility.",
    confidenceLabel: "Context completeness: High",
    disclaimer:
      "This is contextual decision support based on synthetic demo data, not financial advice. No transaction is executed. The investor remains in full control.",
    isAiGenerated: false,
    isFallback: true,
    modelUsed: "deterministic-engine",
  };
}

// Dedicated server-side Gemini Decision Memory Comparison endpoint (M4)
app.post('/api/ai/decision-memory-comparison', async (req: Request, res: Response) => {
  const { currentRecord, previousRecord, investor } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!hasKey) {
    return res.json(getDeterministicMemoryComparison(currentRecord, previousRecord));
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = Array.from(new Set([configuredModel, 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `
Investor: ${investor?.name || 'Priya Sharma'}, Age: ${investor?.age || 34}, Risk Profile: ${investor?.riskProfile || 'Moderate'}
Goal: ${currentRecord?.goalName || 'Child Education'} (Target: ₹${(currentRecord?.goalTarget || 3500000).toLocaleString('en-IN')})

TODAY'S DECISION CONTEXT (${currentRecord?.date || 'October 5, 2026'}):
- Market Movement: ${currentRecord?.marketMovement || -8.2}%
- Portfolio Movement: ${currentRecord?.portfolioMovement || -6.8}%
- Goal Progress: ${currentRecord?.goalProgress || 71}% (Accumulated: ₹${(currentRecord?.accumulatedAmount || 2485000).toLocaleString('en-IN')})
- Remaining Horizon: ${currentRecord?.remainingHorizon || '6 years'}
- Monthly SIP: ₹${(currentRecord?.currentSip || 25000).toLocaleString('en-IN')}

PREVIOUS MOMENT DECISION CONTEXT (${previousRecord?.date || 'July 15, 2026'}):
- Market Movement: ${previousRecord?.marketMovement || -4.1}%
- Portfolio Movement: ${previousRecord?.portfolioMovement || -3.2}%
- Goal Progress: ${previousRecord?.goalProgress || 62}% (Accumulated: ₹${(previousRecord?.accumulatedAmount || 2170000).toLocaleString('en-IN')})
- Monthly SIP: ₹${(previousRecord?.currentSip || 25000).toLocaleString('en-IN')}
- Past Decision: ${previousRecord?.investorDecision || 'Continue SIP'}
- Past Reason: ${previousRecord?.decisionReason || 'Maintained long-term contribution despite short-term market weakness.'}

Analyze the contextual differences between Today and the Previous Decision.
Focus on:
1. What Changed (market drawdown, accumulated wealth, timeline).
2. What Stayed Similar (goal target, discipline, monthly SIP, sovereignty).
3. Objective, neutral observation. Do NOT make an investment recommendation or tell the user what to do. Remind the investor that they remain in control.`;

  const result = await generateGeminiContentWithRetry({
    ai,
    candidateModels,
    contents: promptText,
    systemInstruction: DECISION_MEMORY_COMPARISON_INSTRUCTION,
    responseSchema: memoryComparisonSchema,
    endpointName: 'Decision Memory Comparison',
  });

  if (result) {
    return res.json({
      ...result.parsed,
      isAiGenerated: true,
      isFallback: false,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString(),
    });
  }

  // Graceful deterministic fallback
  return res.json(getDeterministicMemoryComparison(currentRecord, previousRecord));
});

// System instruction for M5 Follow-Up Intelligence Layer
const FOLLOW_UP_INTELLIGENCE_INSTRUCTION = `You are the MOMENT Follow-Up Intelligence layer for FinLit Ventures.
Your role is to explain what changed after an investor's decision in neutral, objective, and supportive language.
You must:
- Explain changes in the simulated market environment and goal progress.
- Highlight key considerations regarding how the active SIP contribution interacts with the remaining horizon.
- Maintain strict neutrality: never advise the investor to buy, sell, pause, increase, or reduce their investments.
- Use exploratory language such as "you may want to review", "one factor to consider", "the scenario indicates", "the simulated trajectory shows".
- Never claim guaranteed returns, certainty, or recommend a single "best option".
- Always set confidence to "Context completeness: High".
- Keep the investor in complete control at all times.`;

const followUpIntelligenceSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    whatChanged: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    whatStayedSimilar: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    goalContext: { type: Type.STRING },
    decisionContext: { type: Type.STRING },
    reviewFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    confidence: { type: Type.STRING },
    disclaimer: { type: Type.STRING },
  },
  required: [
    'headline',
    'summary',
    'whatChanged',
    'whatStayedSimilar',
    'goalContext',
    'decisionContext',
    'reviewFactors',
    'confidence',
    'disclaimer',
  ],
};

function getDeterministicFollowUpIntelligence(followUpData: any) {
  return {
    headline: "Post-Decision Context Evolution: Reviewing Your SIP Reduction",
    summary:
      "Since your October decision to reduce your monthly contribution to ₹12,500, the simulated market environment has shown signs of stabilization (-4.8% vs -8.2%) while your Child Education goal has progressed from 71% to 72% with accumulated capital increasing by ₹27,000. Under the current illustrative assumptions, continuing the ₹12,500 monthly contribution remains above the ₹35L target trajectory, while actual outcomes may vary.",
    whatChanged: [
      "Simulated market drawdown moderated from -8.2% to -4.8%.",
      "Portfolio movement recovered from -6.8% to -3.9% relative drawdown.",
      "Monthly capital commitment is currently active at ₹12,500 (reduced by 50%).",
      "Accumulated capital has increased by ₹27,000 since the decision (₹25,12,000 vs ₹24,85,000).",
      "Goal progress advanced from 71% to 72%.",
      "Remaining horizon is now 5.9 years until target year 2032.",
    ],
    whatStayedSimilar: [
      "Target goal remains Child Education with a ₹35,00,000 funding requirement.",
      "Investor risk profile remains Moderate.",
      "Under current illustrative assumptions, the goal remains above the target trajectory.",
      "Investor sovereignty: every decision remains entirely in your hands.",
    ],
    goalContext:
      "Under current illustrative assumptions, the goal remains above the target trajectory with a projected corpus of ₹58,99,483 and an estimated surplus of ₹23,99,483. This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ.",
    decisionContext:
      "Your choice to reduce your SIP to ₹12,500 preserved monthly cash flow during the market dip while maintaining ongoing disciplined unit accumulation.",
    reviewFactors: [
      "Evaluating whether current cash-flow needs still require the reduced allocation.",
      "Assessing how long-term rupee-cost averaging aligns with the 5.9-year timeline.",
      "Reviewing the goal trajectory in the Scenario Simulator before deciding on next steps.",
    ],
    confidence: "Context completeness: High",
    disclaimer:
      "This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. No transaction is executed. The investor remains in full control.",
    isAiGenerated: false,
    isFallback: true,
    modelUsed: "deterministic-engine",
  };
}

// Dedicated server-side Gemini Follow-Up Intelligence endpoint (M5)
app.post('/api/ai/follow-up-intelligence', async (req: Request, res: Response) => {
  const { followUpData, investor, goal, scenarioOutputs } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!hasKey) {
    return res.json(getDeterministicFollowUpIntelligence(followUpData));
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = Array.from(new Set([configuredModel, 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `
Investor: ${investor?.name || 'Priya Sharma'}, Age: ${investor?.age || 34}, Risk Profile: ${investor?.riskProfile || 'Moderate'}
Goal: ${goal?.title || 'Child Education'} (Target: ₹35,00,000)

PAST DECISION (${followUpData?.decisionDate || 'October 5, 2026'}):
- Decision Made: ${followUpData?.decision || 'Reduce SIP'}
- Previous SIP: ₹${(followUpData?.previousSip || 25000).toLocaleString('en-IN')}/month
- Current SIP: ₹${(followUpData?.currentSip || 12500).toLocaleString('en-IN')}/month
- Conditions At Decision: Market: ${followUpData?.atDecision?.marketMovement || -8.2}%, Portfolio: ${followUpData?.atDecision?.portfolioMovement || -6.8}%, Goal Progress: ${followUpData?.atDecision?.goalProgress || 71}%, Accumulated: ₹${(followUpData?.atDecision?.accumulatedAmount || 2485000).toLocaleString('en-IN')}

CURRENT CONDITIONS (${followUpData?.followUpDate || 'November 15, 2026'}):
- Market Movement: ${followUpData?.current?.marketMovement || -4.8}% (stabilizing)
- Portfolio Movement: ${followUpData?.current?.portfolioMovement || -3.9}%
- Goal Progress: ${followUpData?.current?.goalProgress || 72}% (Accumulated: ₹${(followUpData?.current?.accumulatedAmount || 2512000).toLocaleString('en-IN')})
- Remaining Horizon: ${followUpData?.current?.remainingHorizon || '5.9 years'}
- Authoritative Projected Corpus at Year 6: ₹${(scenarioOutputs?.reduce?.projectedValue || 5899483).toLocaleString('en-IN')} (Surplus: +₹${(scenarioOutputs?.reduce?.surplus || 2399483).toLocaleString('en-IN')})
- Note: Accumulated capital has increased by ₹27,000 since the decision (₹25,12,000 vs ₹24,85,000).

Instructions:
1. Explain what changed since Priya's decision in neutral, objective, and supportive language.
2. Under the current illustrative assumptions, continuing the ₹12,500 monthly contribution remains above the ₹35L target trajectory.
3. Explicitly state: "Accumulated capital has increased by ₹27,000 since the decision."
4. Never use language implying certainty (such as "fully on track", "no immediate risk to your goal", "guaranteed", "safe", or "will reach the goal").
5. Instead use: "Under the current illustrative assumptions, the goal remains above the target trajectory" and "The current illustrative projection remains above the target, while actual outcomes may vary."
6. Add: "This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ."
7. Do NOT tell the investor what action to take (e.g. do not say "you should increase your SIP" or "this is the best option").
8. Set confidence strictly to "Context completeness: High".`;

  const result = await generateGeminiContentWithRetry({
    ai,
    candidateModels,
    contents: promptText,
    systemInstruction: FOLLOW_UP_INTELLIGENCE_INSTRUCTION,
    responseSchema: followUpIntelligenceSchema,
    endpointName: 'Follow-Up Intelligence',
  });

  if (result) {
    return res.json({
      ...result.parsed,
      confidence: 'Context completeness: High',
      isAiGenerated: true,
      isFallback: false,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString(),
    });
  }

  // Graceful deterministic fallback
  return res.json(getDeterministicFollowUpIntelligence(followUpData));
});

// System instruction for M6 Decision Brief Layer
const DECISION_BRIEF_INSTRUCTION = `You are the MOMENT Decision Brief intelligence layer for FinLit Ventures.
Your role is to synthesize the investor's journey into a concise, objective decision brief.
You must:
- Explain what changed since the October decision and what stayed consistent.
- Interpret the deterministic scenarios without recalculating or modifying their figures.
- Outline practical factors the investor may want to review before deciding whether to make another adjustment.
- Maintain complete neutrality: never advise the investor to buy, sell, pause, increase, or reduce their investments.
- Do NOT say "MOMENT recommends", "MOMENT advises", "MOMENT predicts", or "You should invest/continue/pause".
- Never claim guaranteed returns or certainty, and do not label anything as "risk-free".
- Set confidence strictly to "context-complete" or "context-limited" (never use a percentage like 85%).
- Ensure the investor remains in complete control of every choice.`;

const decisionBriefSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    whatChanged: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    whatStayedConsistent: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    decisionContext: { type: Type.STRING },
    scenarioInterpretation: { type: Type.STRING },
    reviewFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    confidence: {
      type: Type.STRING,
      enum: ['context-complete', 'context-limited'],
    },
    disclaimer: { type: Type.STRING },
  },
  required: [
    'headline',
    'summary',
    'whatChanged',
    'whatStayedConsistent',
    'decisionContext',
    'scenarioInterpretation',
    'reviewFactors',
    'confidence',
    'disclaimer',
  ],
};

function getDeterministicDecisionBrief(comparison: any, scenarios: any) {
  return {
    headline: "Decision Synthesis: Navigating Your Post-Adjustment Position",
    summary:
      "Since your October decision to reduce monthly contributions to ₹12,500, simulated market and portfolio drawdowns have moderated (-4.8% vs -8.2% and -3.9% vs -6.8%), while goal progress advanced to 72% with ₹25,12,000 accumulated (+₹27,000 increase). Under current illustrative scenario assumptions, your active ₹12,500 monthly contribution remains associated with a projected surplus (+₹23,99,483) over your ₹35L target.",
    whatChanged: [
      "Simulated market movement improved from -8.2% to -4.8%.",
      "Portfolio movement recovered from -6.8% to -3.9%.",
      "Accumulated value increased by ₹27,000 since the decision (₹25,12,000 vs ₹24,85,000).",
      "Goal progress advanced from 71% to 72%.",
      "Remaining horizon is now approximately 5.9 years until target year 2032.",
    ],
    whatStayedConsistent: [
      "Target goal remains Child Education with a ₹35,00,000 funding requirement.",
      "Monthly SIP remains active at the reduced ₹12,500 level.",
      "Investor risk tolerance profile remains Moderate.",
      "All three deterministic scenarios remain above the ₹35L target under current illustrative assumptions.",
      "Investor sovereignty: MOMENT informs the investor; the investor decides.",
    ],
    decisionContext:
      "On October 5, 2026, you chose to reduce your monthly contribution from ₹25,000 to ₹12,500 to preserve cash flow during market weakness while maintaining continuous disciplined unit accumulation.",
    scenarioInterpretation:
      "Deterministic scenario simulations show that continuing at ₹12,500/month projects a final corpus of ₹58,99,483 (+₹23.99L surplus). Even pausing entirely projects ₹46,53,094 (+₹11.53L surplus), while resuming ₹25,000/month projects ₹71,45,872 (+₹36.45L surplus). All three scenarios remain above target under illustrative assumptions.",
    reviewFactors: [
      "Whether the reduced contribution still fits your longer-term goal priorities.",
      "Whether your monthly cash-flow preference has changed since October.",
      "Whether the current contribution level remains appropriate as your personal circumstances evolve.",
      "Whether the assumptions used in the illustration remain reasonable for your 5.9-year planning horizon.",
    ],
    confidence: "context-complete",
    disclaimer:
      "This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. MOMENT does not execute transactions. The investor remains in full control.",
    isAiGenerated: false,
    isFallback: true,
    modelUsed: "deterministic-engine",
  };
}

// Dedicated server-side Gemini Decision Brief endpoint (M6)
app.post('/api/ai/decision-brief', async (req: Request, res: Response) => {
  const { comparison, scenarios, investor, goal } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!hasKey) {
    return res.json(getDeterministicDecisionBrief(comparison, scenarios));
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = Array.from(new Set([configuredModel, 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `
Investor: ${investor?.name || 'Priya Sharma'}, Age: ${investor?.age || 34}, Risk Profile: ${investor?.riskProfile || 'Moderate'}
Goal: ${goal?.title || 'Child Education'} (Target: ₹35,00,000, Horizon: 5.9 years remaining until 2032)

HISTORICAL DECISION (October 5, 2026):
- Action Taken: Reduce SIP from ₹25,000 to ₹12,500/month
- Conditions at Decision: Market -8.2%, Portfolio -6.8%, Goal Progress 71%, Accumulated ₹24,85,000

CURRENT CONDITIONS (November 15, 2026):
- Market Movement: -4.8% (improved from -8.2%)
- Portfolio Movement: -3.9% (improved from -6.8%)
- Goal Progress: 72% (up from 71%)
- Accumulated Value: ₹25,12,000 (increased by ₹27,000 since decision)
- Active SIP: ₹12,500/month
- Remaining Horizon: 5.9 years

AUTHORITATIVE DETERMINISTIC SCENARIO ENGINE RESULTS (DO NOT RECALCULATE):
- CONTINUE (₹25,000/mo): Projected ₹71,45,872 (Surplus: +₹36,45,872)
- REDUCE (₹12,500/mo): Projected ₹58,99,483 (Surplus: +₹23,99,483)
- PAUSE (₹0/mo): Projected ₹46,53,094 (Surplus: +₹11,53,094)
- Note: All three scenarios remain above target under current illustrative assumptions.

Task:
Produce a concise, objective Decision Brief synthesizing what changed, what stayed consistent, what the scenarios show, and 4 practical factors the investor may want to review.
Guidelines:
1. Strict neutrality: do NOT say "MOMENT recommends", "MOMENT advises", "MOMENT predicts", or "You should invest/continue/pause".
2. Explicitly note: "Accumulated value increased by ₹27,000 since the decision."
3. Note that "All three scenarios remain above the ₹35L target under the current illustrative assumptions."
4. Never label anything as "risk-free" or claim guaranteed returns.
5. Set confidence strictly to "context-complete".
6. Disclaimer: "This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. MOMENT does not execute transactions. The investor remains in full control."`;

  const result = await generateGeminiContentWithRetry({
    ai,
    candidateModels,
    contents: promptText,
    systemInstruction: DECISION_BRIEF_INSTRUCTION,
    responseSchema: decisionBriefSchema,
    endpointName: 'Decision Brief',
  });

  if (result) {
    return res.json({
      ...result.parsed,
      confidence: 'context-complete',
      isAiGenerated: true,
      isFallback: false,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString(),
    });
  }

  // Graceful deterministic fallback
  return res.json(getDeterministicDecisionBrief(comparison, scenarios));
});

// System instruction for M7 Behavioral Decision Intelligence Layer
const DECISION_REFLECTION_INSTRUCTION = `You are the MOMENT Behavioral Decision Intelligence layer for FinLit Ventures.
Your role is to help the investor reflect on the decision context without psychological diagnosis, financial advice, or judgment.
Strict Guidelines:
1. Timeline Consistency: Use October 5, 2026 strictly as the Decision Date.
2. Do NOT mention November 15, 2026 anywhere unless it is explicitly labeled as the 'Simulated Follow-Up Context' or 'Follow-up observation — November 15, 2026'.
3. Clearly distinguish:
   - Decision Date Context (October 5, 2026: 71% funded, ₹24,85,000 accumulated)
   - Follow-Up Context (November 15, 2026: 72% funded, ₹25,12,000 accumulated, +₹27,000 increase via ongoing compounding and stabilization)
4. Highlight possible contextual factors (market volatility, short-term portfolio movement, monthly cash-flow flexibility, long-term goal horizon, risk tolerance, and desire to maintain disciplined contributions) without claiming to know the investor's psychology.
5. Frame everything as: "These are contextual factors to consider, not conclusions about your intent."
6. Provide neutral reflection questions to assist personal evaluation without right or wrong answers.
7. Emphasize that in the follow-up observation, market conditions improved while contributions remain reduced, but this improvement does NOT prove the decision was right or wrong.
8. Do NOT label the investor as emotional, irrational, panic-selling, loss-averse, or financially biased.
9. Do NOT advise the investor to buy, sell, pause, increase, or reduce their investments.
10. Do NOT calculate or modify scenario values.
11. Guardrail: Emphasize that MOMENT informs and reflects, but the investor remains solely in control.`;

const decisionReflectionSchema = {
  type: Type.OBJECT,
  properties: {
    contextObservation: { type: Type.STRING },
    possibleInfluences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    reflectionQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    longTermPerspective: { type: Type.STRING },
    guardrail: { type: Type.STRING },
  },
  required: [
    'contextObservation',
    'possibleInfluences',
    'reflectionQuestions',
    'longTermPerspective',
    'guardrail',
  ],
};

function getDeterministicDecisionReflection() {
  return {
    contextObservation:
      "On your Decision Date (October 5, 2026), you chose to reduce your monthly contribution from ₹25,000 to ₹12,500 amid an 8.2% market drawdown and a 6.8% portfolio pullback, when your Child Education goal was 71% funded with ₹24,85,000 accumulated.",
    possibleInfluences: [
      "Simulated short-term market volatility and negative index movements on the October 5, 2026 decision date.",
      "Portfolio drawdown of -6.8% creating heightened awareness of short-term volatility.",
      "Household desire for monthly cash-flow flexibility and near-term liquidity buffer.",
      "Confidence in the remaining 6.0-year timeline alongside ₹24.85L in accumulated corpus.",
      "Preference to maintain ongoing investment discipline through a reduced commitment rather than halting completely.",
    ],
    reflectionQuestions: [
      "Would you make the same SIP decision if the market had not recently fallen?",
      "Has your household cash-flow situation changed since October?",
      "Has your investment horizon or goal priority changed?",
      "Has your tolerance for investment volatility changed as market conditions stabilized?",
    ],
    longTermPerspective:
      "In the subsequent Simulated Follow-Up Context (Follow-up observation — November 15, 2026), simulated market movement moderated to -4.8% and portfolio movement to -3.9%, while your accumulated corpus grew by ₹27,000 to ₹25,12,000 (advancing goal progress from 71% to 72%). Your market and portfolio context has improved since the decision, while your contribution level remains reduced. This improvement does not prove the decision was right or wrong, but offers an updated perspective for your long-term 2032 milestone.",
    guardrail:
      "MOMENT helps you reflect on your decision context. You remain responsible for the decision. These are contextual factors to consider, not conclusions about your intent. No transaction is executed.",
    isAiGenerated: false,
    isFallback: true,
    modelUsed: "deterministic-engine",
  };
}

// Dedicated server-side Gemini Decision Reflection endpoint (M7)
app.post('/api/ai/decision-reflection', async (req: Request, res: Response) => {
  const { comparison, scenarios, investor, goal } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';

  if (!hasKey) {
    return res.json(getDeterministicDecisionReflection());
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = Array.from(new Set([configuredModel, 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptText = `
Investor: ${investor?.name || 'Priya Sharma'}, Age: ${investor?.age || 34}, Risk Profile: ${investor?.riskProfile || 'Moderate'}
Goal: ${goal?.title || 'Child Education'} (Target: ₹35,00,000, 5.9 years remaining until 2032)

TIMELINE AND CONTEXT DEFINITIONS:
1. DECISION DATE CONTEXT: October 5, 2026
   - Action Taken: Reduce SIP from ₹25,000 to ₹12,500/month
   - Market Movement at Decision: -8.2%
   - Portfolio Movement at Decision: -6.8%
   - Goal Progress at Decision: 71% (Accumulated ₹24,85,000)
   - Horizon at Decision: 6.0 years

2. SIMULATED FOLLOW-UP CONTEXT: Follow-up observation — November 15, 2026
   - Market Movement: -4.8% (improved from -8.2%)
   - Portfolio Movement: -3.9% (improved from -6.8%)
   - Goal Progress: 72% (up from 71%, ₹25,12,000 accumulated, +₹27,000 capital growth since decision)
   - Active SIP: ₹12,500/month
   - Horizon: 5.9 years

DETERMINISTIC SCENARIO BENCHMARKS (ALL THREE REMAIN ABOVE ₹35L TARGET):
- Continue (₹25k/mo): ₹71,45,872 (Surplus: +₹36,45,872)
- Reduce (₹12.5k/mo): ₹58,99,483 (Surplus: +₹23,99,483)
- Pause (₹0/mo): ₹46,53,094 (Surplus: +₹11,53,094)

TIMELINE CONSISTENCY INSTRUCTIONS:
1. Use October 5, 2026 strictly as the Decision Date for initial context.
2. NEVER display or state November 15, 2026 unless explicitly labeled as "Simulated Follow-Up Context" or "Follow-up observation — November 15, 2026".
3. Clearly explain that the progression from 71% to 72% goal progress and from ₹24,85,000 to ₹25,12,000 accumulated value occurred over the timeline from the October 5 decision to the November 15 follow-up observation due to regular monthly compounding and market stabilization.
4. Highlight that in the Simulated Follow-Up Context (November 15, 2026), conditions improved while contributions remained reduced, but state clearly that this improvement does not prove the decision was right or wrong.
5. Strict guardrails: do NOT diagnose psychology, do NOT label as emotional or irrational, do NOT recommend any financial transaction, and do NOT alter scenario figures.`;

  const result = await generateGeminiContentWithRetry({
    ai,
    candidateModels,
    contents: promptText,
    systemInstruction: DECISION_REFLECTION_INSTRUCTION,
    responseSchema: decisionReflectionSchema,
    endpointName: 'Decision Reflection',
  });

  if (result) {
    return res.json({
      ...result.parsed,
      isAiGenerated: true,
      isFallback: false,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString(),
    });
  }

  // Graceful deterministic fallback
  return res.json(getDeterministicDecisionReflection());
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FinLit MOMENT full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();

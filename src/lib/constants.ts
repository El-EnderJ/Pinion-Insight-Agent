/**
 * @module constants
 * Application-wide constants for the Pinion Insight Agent.
 */

/** Base cost per PinionOS skill call in USDC */
export const BASE_SKILL_COST_USDC = 0.01;

/** Simulated computation cost multipliers by query complexity */
export const COMPLEXITY_MULTIPLIERS: Record<string, number> = {
  simple: 1,     // 1 skill call  → $0.01
  moderate: 2,   // 2 skill calls → $0.02
  complex: 3,    // 3 skill calls → $0.03
  advanced: 5,   // 5 skill calls → $0.05
};

/** Network configuration */
export const NETWORK = {
  name: "Base",
  chainId: 8453,
  currency: "ETH",
  stablecoin: "USDC",
  explorer: "https://basescan.org",
} as const;

/** Application metadata */
export const APP_META = {
  name: "Pinion Insight Agent",
  version: "1.0.0",
  description: "Pay-per-AI-Agent Market Intelligence Dashboard",
  tagline: "Autonomous AI insights, powered by micropayments",
} as const;

/** Gemini model config — ordered by preference for fallback */
export const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
] as const;

export const GEMINI_CONFIG = {
  model: GEMINI_MODELS[0],
  fallbackModels: GEMINI_MODELS.slice(1),
  maxTokens: 2048,
  temperature: 0.7,
  maxRetries: 2,
  retryDelayMs: 2000,
  /** Max ms to wait for a single Gemini generateContent call */
  timeoutMs: 30000,
} as const;

/** Animation durations (ms) */
export const ANIM = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

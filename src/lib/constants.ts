/**
 * @module constants
 * Application-wide constants for the Pinion Insight Agent.
 *
 * All blockchain configuration targets Base Sepolia testnet.
 */

/* ─── Base Sepolia Network ────────────────────────────────────────── */

export const BASE_SEPOLIA = {
  name: "Base Sepolia",
  chainId: 84532,
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
  /** Circle USDC on Base Sepolia */
  usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  usdcDecimals: 6,
} as const;

/* ─── x402 Payment Config ─────────────────────────────────────────── */

export const PAYMENT_CONFIG = {
  /** USDC amount per query (human-readable) */
  amountUSDC: "0.01",
  /** USDC amount in atomic units (6 decimals): 0.01 * 10^6 = 10000 */
  amountAtomic: "10000",
  /**
   * Project Treasury Wallet — receives every $0.01 USDC micropayment.
   * This is the on-chain address where the agent accumulates its own revenue.
   * Configurable via PAYMENT_RECIPIENT in .env.
   */
  get recipient(): string {
    return (
      process.env.PAYMENT_RECIPIENT ??
      "0x0ECA9442fFd1De45795623b63EfB4b2a89684Daa"
    );
  },
  /**
   * Human-readable treasury address for display purposes.
   * Verified on https://sepolia.basescan.org/address/0x0ECA9442fFd1De45795623b63EfB4b2a89684Daa
   */
  treasuryAddress: "0x0ECA9442fFd1De45795623b63EfB4b2a89684Daa" as const,
  /** Timeout for on-chain tx confirmation (ms) */
  confirmationTimeoutMs: 30_000,
  /** Required block confirmations before proceeding */
  requiredConfirmations: 1,
} as const;

/* ─── Gemini AI Config ────────────────────────────────────────────── */

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
  timeoutMs: 30_000,
} as const;

/* ─── Cost Estimation ─────────────────────────────────────────────── */

/** Base cost per query in USDC */
export const BASE_SKILL_COST_USDC = 0.01;

/** Simulated computation cost multipliers by query complexity */
export const COMPLEXITY_MULTIPLIERS: Record<string, number> = {
  simple: 1,
  moderate: 2,
  complex: 3,
  advanced: 5,
};

/* ─── Application Metadata ────────────────────────────────────────── */

export const APP_META = {
  name: "Pinion Insight Agent",
  version: "1.0.0",
  description: "Pay-per-AI-Agent Market Intelligence Dashboard",
  tagline: "Autonomous AI insights, powered by micropayments",
} as const;

/* ─── Animation Durations (ms) ────────────────────────────────────── */

export const ANIM = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/* ─── Minimal ERC-20 ABI ──────────────────────────────────────────── */

export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
] as const;

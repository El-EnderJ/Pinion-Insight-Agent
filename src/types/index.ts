/**
 * @module types
 * Core TypeScript interfaces for the Pinion Insight Agent
 *
 * Defines all shared types used across the application including
 * payment sessions, agent states, transaction records, and API responses.
 */

/* ─── Agent Query ─────────────────────────────────────────────────── */

export interface AgentQuery {
  /** The user's natural-language question */
  question: string;
  /** Optional category hint for the AI */
  category?: QueryCategory;
}

export type QueryCategory =
  | "market-analysis"
  | "token-research"
  | "defi-strategy"
  | "wallet-forensics"
  | "general";

/* ─── Cost Estimation ─────────────────────────────────────────────── */

export interface CostEstimate {
  /** Estimated computation units (1 unit = $0.01 USDC) */
  computeUnits: number;
  /** Total USDC cost as a human-readable string e.g. "0.03" */
  totalUSDC: string;
  /** Breakdown of how the cost is composed */
  breakdown: CostBreakdownItem[];
}

export interface CostBreakdownItem {
  label: string;
  units: number;
  cost: string;
}

/* ─── Payment ─────────────────────────────────────────────────────── */

export type PaymentStatus =
  | "idle"
  | "estimating"
  | "awaiting-approval"
  | "processing"
  | "confirmed"
  | "failed";

export interface PaymentSession {
  id: string;
  status: PaymentStatus;
  costEstimate: CostEstimate;
  txHash?: string;
  error?: string;
  timestamp: number;
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  skill: string;
  cost: string;
  data?: unknown;
  error?: string;
}

/* ─── Agent Response ──────────────────────────────────────────────── */

export interface AgentInsight {
  /** Markdown-formatted AI response */
  content: string;
  /** The model that generated the response */
  model: string;
  /** Processing time in ms */
  latency: number;
  /** Tokens used (if available) */
  tokensUsed?: number;
}

/* ─── Transaction History ─────────────────────────────────────────── */

export interface TransactionRecord {
  id: string;
  query: string;
  costUSDC: string;
  txHash?: string;
  status: "success" | "failed" | "pending";
  timestamp: number;
  insight?: string;
}

/* ─── Wallet ──────────────────────────────────────────────────────── */

export interface WalletInfo {
  address: string;
  ethBalance: string;
  usdcBalance: string;
  network: string;
}

/* ─── API Route Payloads ──────────────────────────────────────────── */

export interface InsightRequestBody {
  question: string;
  category?: QueryCategory;
}

export interface InsightResponseBody {
  success: boolean;
  insight?: AgentInsight;
  payment?: PaymentResult;
  /** True when PinionOS payment succeeded but AI generation failed */
  paymentSucceeded?: boolean;
  error?: string;
  errorType?: "payment" | "ai" | "validation" | "unknown";
}

export interface BalanceResponseBody {
  success: boolean;
  wallet?: WalletInfo;
  error?: string;
}

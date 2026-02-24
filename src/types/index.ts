/**
 * @module types
 * Core TypeScript interfaces for the Pinion Insight Agent.
 *
 * All payment types reflect real on-chain data from Base Sepolia.
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

/**
 * On-chain payment receipt from a real Base Sepolia USDC transfer.
 */
export interface PaymentResult {
  success: boolean;
  txHash: string;
  from: string;
  to: string;
  amount: string;
  gasUsed: string;
  blockNumber: number;
  confirmations: number;
  explorerUrl: string;
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
  gasUsed?: string;
  blockNumber?: number;
  explorerUrl?: string;
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
  chainId?: number;
}

/* ─── Multi-turn Chat ─────────────────────────────────────────────── */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  /** On-chain tx hash tied to this message (user messages only) */
  txHash?: string;
  /** Payment metadata for this exchange */
  payment?: PaymentResult;
  /** AI model that generated the response (assistant messages only) */
  model?: string;
  /** Generation latency in ms (assistant messages only) */
  latency?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/* ─── API Route Payloads ──────────────────────────────────────────── */

export interface InsightRequestBody {
  question: string;
  category?: QueryCategory;
  /** Previous messages for multi-turn context (last 4-6) */
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface InsightResponseBody {
  success: boolean;
  insight?: AgentInsight;
  payment?: PaymentResult;
  /** True when the x402 payment succeeded but AI generation failed */
  paymentSucceeded?: boolean;
  error?: string;
  errorType?: "payment" | "ai" | "validation" | "unknown";
}

export interface BalanceResponseBody {
  success: boolean;
  wallet?: WalletInfo;
  error?: string;
}

export interface AgentResponseBody {
  success: boolean;
  wallet?: WalletInfo;
  error?: string;
}

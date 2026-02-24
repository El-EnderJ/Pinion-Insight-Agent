/**
 * @module pinion
 * Server-side PinionOS integration layer.
 *
 * Wraps the PinionOS SDK to provide:
 * - Client initialization with env-based private key
 * - Payment processing via x402 micropayments
 * - Wallet balance queries
 *
 * This module is SERVER-ONLY — it reads PINION_PRIVATE_KEY from env.
 */

import { PinionClient } from "pinion-os";

/* ─── Singleton Client ────────────────────────────────────────────── */

let _client: PinionClient | null = null;

/**
 * Returns a singleton PinionClient instance.
 * Creates one on first call using the server env private key.
 */
export function getPinionClient(): PinionClient {
  if (!_client) {
    const privateKey = process.env.PINION_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error(
        "[PinionOS] PINION_PRIVATE_KEY environment variable is required. " +
          "Set a hex private key (0x...) with USDC on Base."
      );
    }
    _client = new PinionClient({ privateKey });
  }
  return _client;
}

/* ─── Payment Processing ──────────────────────────────────────────── */

export interface PinionPaymentResult {
  success: boolean;
  skill: string;
  data?: unknown;
  cost: string;
  error?: string;
}

/**
 * Executes a paid skill call via PinionOS x402 protocol.
 * Each skill call costs $0.01 USDC on Base, settled automatically.
 *
 * @param skillName - Which skill to invoke (e.g. "price", "balance")
 * @param args      - Arguments for that skill
 * @returns Payment result with the skill response data
 */
export async function executePayment(
  skillName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): Promise<PinionPaymentResult> {
  try {
    const client = getPinionClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skills = client.skills as unknown as Record<string, (...a: any[]) => Promise<any>>;

    if (typeof skills[skillName] !== "function") {
      throw new Error(`Unknown PinionOS skill: ${skillName}`);
    }

    const result = await skills[skillName](...args);

    return {
      success: true,
      skill: skillName,
      data: result.data ?? result,
      cost: "0.01",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[PinionOS] Payment failed for skill "${skillName}":`, message);
    return {
      success: false,
      skill: skillName,
      cost: "0.01",
      error: message,
    };
  }
}

/* ─── Wallet Info ─────────────────────────────────────────────────── */

/**
 * Fetches the current wallet balance through PinionOS.
 * Returns ETH and USDC balances on Base.
 */
export async function getWalletBalance(address: string) {
  try {
    const client = getPinionClient();
    const result = await client.skills.balance(address);
    return {
      success: true,
      data: result.data as unknown as { eth: string; usdc: string },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Gets a token price through PinionOS (paid skill, $0.01).
 */
export async function getTokenPrice(token: string) {
  return executePayment("price", token);
}

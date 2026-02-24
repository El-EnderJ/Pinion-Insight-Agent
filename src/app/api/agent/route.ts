/**
 * GET /api/agent
 *
 * Returns the agent's wallet address and real-time on-chain balances
 * on Base Sepolia. Called once on app load to populate the header.
 */

import { NextResponse } from "next/server";
import { getWalletInfo } from "@/lib/pinion";
import type { AgentResponseBody } from "@/types";

export async function GET() {
  try {
    const wallet = await getWalletInfo();

    return NextResponse.json<AgentResponseBody>({
      success: true,
      wallet,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json<AgentResponseBody>(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

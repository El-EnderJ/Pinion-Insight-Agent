/**
 * GET /api/balance?address=0x...
 *
 * Returns real on-chain ETH and USDC balances for any address
 * on Base Sepolia by querying the RPC directly.
 */

import { NextRequest, NextResponse } from "next/server";
import { getWalletInfo, getAgentAddress } from "@/lib/pinion";
import type { BalanceResponseBody } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const addressParam = request.nextUrl.searchParams.get("address");
    const address =
      addressParam && addressParam.startsWith("0x")
        ? addressParam
        : getAgentAddress();

    const wallet = await getWalletInfo(address);

    return NextResponse.json<BalanceResponseBody>({
      success: true,
      wallet,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json<BalanceResponseBody>(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

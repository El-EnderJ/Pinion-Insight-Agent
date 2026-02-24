/**
 * GET /api/balance?address=0x...
 *
 * Returns the wallet's ETH and USDC balance on Base
 * by querying the PinionOS balance skill.
 */

import { NextRequest, NextResponse } from "next/server";
import { getWalletBalance } from "@/lib/pinion";
import type { BalanceResponseBody } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");

    if (!address || !address.startsWith("0x")) {
      return NextResponse.json<BalanceResponseBody>(
        { success: false, error: "Valid address parameter required (0x...)" },
        { status: 400 }
      );
    }

    const result = await getWalletBalance(address);

    if (!result.success || !result.data) {
      return NextResponse.json<BalanceResponseBody>(
        { success: false, error: result.error ?? "Failed to fetch balance" },
        { status: 500 }
      );
    }

    return NextResponse.json<BalanceResponseBody>({
      success: true,
      wallet: {
        address,
        ethBalance: result.data.eth,
        usdcBalance: result.data.usdc,
        network: "Base",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json<BalanceResponseBody>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

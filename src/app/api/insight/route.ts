/**
 * POST /api/insight
 *
 * Core endpoint for the Pay-per-AI-Agent flow on Base Sepolia:
 *
 * 1. Validate the incoming question.
 * 2. Execute a real USDC micropayment ($0.01) via processPayment().
 * 3. Verify the on-chain receipt (txHash confirmed, status === 1).
 * 4. Only if the payment is confirmed, call Gemini Flash for the insight.
 * 5. Return the combined result — or partial success if AI fails.
 */

import { NextRequest, NextResponse } from "next/server";
import { processPayment, verifyTransaction } from "@/lib/pinion";
import { generateInsight } from "@/lib/gemini";
import type { InsightRequestBody, InsightResponseBody } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InsightRequestBody;

    if (!body.question || body.question.trim().length < 3) {
      return NextResponse.json<InsightResponseBody>(
        {
          success: false,
          error: "Question must be at least 3 characters.",
          errorType: "validation",
        },
        { status: 400 },
      );
    }

    /* ── Step 1: Process real x402 micropayment on Base Sepolia ── */
    const payment = await processPayment();

    if (!payment.success) {
      return NextResponse.json<InsightResponseBody>(
        {
          success: false,
          error: `x402 payment failed: ${payment.error}`,
          errorType: "payment",
          payment,
          paymentSucceeded: false,
        },
        { status: 402 },
      );
    }

    /* ── Step 2: Verify the on-chain transaction ──────────────── */
    const verification = await verifyTransaction(payment.txHash);

    if (!verification.verified) {
      return NextResponse.json<InsightResponseBody>(
        {
          success: false,
          error: `On-chain verification failed: ${verification.status}`,
          errorType: "payment",
          payment,
          paymentSucceeded: false,
        },
        { status: 402 },
      );
    }

    /* ── Step 3: Generate AI insight via Gemini Flash ─────────── */
    try {
      // Pass conversation history for multi-turn context (last 4-6 messages)
      const history = Array.isArray(body.history) ? body.history.slice(-6) : undefined;
      const insight = await generateInsight(body.question, history);

      return NextResponse.json<InsightResponseBody>({
        success: true,
        insight: {
          content: insight.content,
          model: insight.model,
          latency: insight.latency,
          tokensUsed: insight.tokensUsed,
        },
        payment,
        paymentSucceeded: true,
      });
    } catch (aiErr) {
      // Payment succeeded & verified but Gemini failed
      const aiMessage =
        aiErr instanceof Error ? aiErr.message : "AI generation failed";
      console.error(
        "[API /insight] Gemini failed after verified payment:",
        aiMessage,
      );

      return NextResponse.json<InsightResponseBody>(
        {
          success: false,
          error: aiMessage,
          errorType: "ai",
          payment,
          paymentSucceeded: true,
        },
        { status: 503 },
      );
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[API /insight]", message);

    return NextResponse.json<InsightResponseBody>(
      { success: false, error: message, errorType: "unknown" },
      { status: 500 },
    );
  }
}

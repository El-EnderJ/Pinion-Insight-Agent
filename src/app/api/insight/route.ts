/**
 * POST /api/insight
 *
 * Core endpoint: processes a PinionOS micropayment, then calls
 * Gemini Flash to generate the AI insight.
 *
 * Flow:
 * 1. Validate the incoming question
 * 2. Execute a PinionOS skill call (x402 payment on Base)
 * 3. On payment success, call Gemini Flash for the insight
 * 4. Return the combined result — or partial success if AI fails
 */

import { NextRequest, NextResponse } from "next/server";
import { executePayment } from "@/lib/pinion";
import { generateInsight } from "@/lib/gemini";
import type { InsightRequestBody, InsightResponseBody } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InsightRequestBody;

    if (!body.question || body.question.trim().length < 3) {
      return NextResponse.json<InsightResponseBody>(
        { success: false, error: "Question must be at least 3 characters.", errorType: "validation" },
        { status: 400 }
      );
    }

    /* ── Step 1: Process micropayment via PinionOS ────────────── */
    const payment = await executePayment("price", "ETH");

    if (!payment.success) {
      return NextResponse.json<InsightResponseBody>(
        {
          success: false,
          error: `PinionOS payment failed: ${payment.error}`,
          errorType: "payment",
          payment,
          paymentSucceeded: false,
        },
        { status: 402 }
      );
    }

    /* ── Step 2: Generate AI insight via Gemini Flash ─────────── */
    try {
      const insight = await generateInsight(body.question);

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
      // Payment succeeded but Gemini failed — return partial success
      const aiMessage = aiErr instanceof Error ? aiErr.message : "AI generation failed";
      console.error("[API /insight] Gemini failed after successful payment:", aiMessage);

      return NextResponse.json<InsightResponseBody>(
        {
          success: false,
          error: aiMessage,
          errorType: "ai",
          payment,
          paymentSucceeded: true,
        },
        { status: 503 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[API /insight]", message);

    return NextResponse.json<InsightResponseBody>(
      { success: false, error: message, errorType: "unknown" },
      { status: 500 }
    );
  }
}

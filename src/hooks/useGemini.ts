/**
 * @module useGemini
 * React hook for requesting AI insights through the secure API route.
 *
 * The hook manages the full lifecycle:
 * 1. Sends the query to /api/insight (server processes payment + AI)
 * 2. Tracks loading, error, and result states
 * 3. Distinguishes between payment failures and AI failures
 * 4. Maintains a history of past queries with on-chain tx data
 *
 * All x402 payment logic and Gemini calls happen server-side.
 * This hook only communicates with our Next.js API route.
 */

"use client";

import { useState, useCallback } from "react";
import type {
  AgentInsight,
  PaymentResult,
  InsightResponseBody,
  TransactionRecord,
} from "@/types";

interface UseGeminiState {
  /** Whether a request is currently in-flight */
  isLoading: boolean;
  /** The latest AI insight response */
  insight: AgentInsight | null;
  /** The latest on-chain payment receipt */
  payment: PaymentResult | null;
  /** Error message if the request failed */
  error: string | null;
  /** Source of the error: "payment" | "ai" | "validation" | "unknown" */
  errorType: string | null;
  /** Whether the x402 payment succeeded (even if AI failed) */
  paymentSucceeded: boolean;
  /** List of all past transactions with real on-chain data */
  history: TransactionRecord[];
}

interface UseGeminiReturn extends UseGeminiState {
  /** Submit a query for insight generation */
  requestInsight: (question: string) => Promise<void>;
  /** Clear the current insight and error */
  reset: () => void;
}

export function useGemini(): UseGeminiReturn {
  const [state, setState] = useState<UseGeminiState>({
    isLoading: false,
    insight: null,
    payment: null,
    error: null,
    errorType: null,
    paymentSucceeded: false,
    history: [],
  });

  const requestInsight = useCallback(async (question: string) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      errorType: null,
      paymentSucceeded: false,
      insight: null,
      payment: null,
    }));

    const txId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 120_000);

      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      }).finally(() => clearTimeout(fetchTimeout));

      const data: InsightResponseBody = await res.json();

      if (!data.success) {
        const paidOk = data.paymentSucceeded === true;

        const record: TransactionRecord = {
          id: txId,
          query: question,
          costUSDC: paidOk ? (data.payment?.amount ?? "0.01") : "0.00",
          txHash: data.payment?.txHash,
          gasUsed: data.payment?.gasUsed,
          blockNumber: data.payment?.blockNumber,
          explorerUrl: data.payment?.explorerUrl,
          status: paidOk ? "success" : "failed",
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.error ?? "Unknown error",
          errorType: data.errorType ?? "unknown",
          paymentSucceeded: paidOk,
          payment: data.payment ?? null,
          history: [record, ...prev.history],
        }));
        return;
      }

      const record: TransactionRecord = {
        id: txId,
        query: question,
        costUSDC: data.payment?.amount ?? "0.01",
        txHash: data.payment?.txHash,
        gasUsed: data.payment?.gasUsed,
        blockNumber: data.payment?.blockNumber,
        explorerUrl: data.payment?.explorerUrl,
        status: "success",
        timestamp: Date.now(),
        insight: data.insight?.content?.slice(0, 100) + "...",
      };

      setState((prev) => ({
        ...prev,
        isLoading: false,
        insight: data.insight ?? null,
        payment: data.payment ?? null,
        paymentSucceeded: true,
        history: [record, ...prev.history],
      }));
    } catch (err) {
      const isAbort =
        err instanceof DOMException && err.name === "AbortError";
      const message = isAbort
        ? "Request timed out — the payment or AI service took too long. Please try again."
        : err instanceof Error
          ? err.message
          : "Network request failed";

      const record: TransactionRecord = {
        id: txId,
        query: question,
        costUSDC: "0.00",
        status: "failed",
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        errorType: "unknown",
        paymentSucceeded: false,
        history: [record, ...prev.history],
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      insight: null,
      payment: null,
      error: null,
      errorType: null,
      paymentSucceeded: false,
    }));
  }, []);

  return { ...state, requestInsight, reset };
}

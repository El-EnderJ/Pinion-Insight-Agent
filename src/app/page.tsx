/**
 * @page Home
 * Main dashboard page for the Pinion Insight Agent.
 *
 * Orchestrates the full "Pay-per-AI-Agent" flow:
 * 1. User types a question → QueryInput
 * 2. Payment gate activates → PaymentGate
 * 3. AI insight renders → InsightDisplay
 * 4. Transaction logged → TransactionHistory
 */

"use client";

import { useMemo } from "react";
import { useGemini } from "@/hooks/useGemini";
import { usePinion } from "@/hooks/usePinion";
import Header from "@/components/Header";
import QueryInput from "@/components/QueryInput";
import PaymentGate from "@/components/PaymentGate";
import InsightDisplay from "@/components/InsightDisplay";
import TransactionHistory from "@/components/TransactionHistory";
import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  const {
    isLoading,
    insight,
    payment,
    error,
    errorType,
    paymentSucceeded,
    history,
    requestInsight,
    reset,
  } = useGemini();

  const { wallet, isConnected, refreshBalance } = usePinion();

  const handleSubmit = async (question: string) => {
    reset();
    await requestInsight(question);
    // Refresh wallet balance after payment
    refreshBalance();
  };

  // Derive wallet stats from transaction history
  const sessionStats = useMemo(() => {
    const successful = history.filter((t) => t.status === "success");
    const totalSpent = successful
      .reduce((sum, t) => sum + parseFloat(t.costUSDC || "0"), 0)
      .toFixed(2);
    return { totalSpent, queryCount: history.length };
  }, [history]);

  // Agent wallet address comes from the server-side PinionOS SDK
  const walletAddress = wallet?.address;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────────────── */}
      <Header
        isConnected={isConnected || history.some((t) => t.status === "success")}
        walletAddress={walletAddress}
        usdcBalance={wallet?.usdcBalance}
        ethBalance={wallet?.ethBalance}
        totalSpent={sessionStats.totalSpent}
        queryCount={sessionStats.queryCount}
      />

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="text-gradient">AI Market Intelligence</span>
            <br />
            <span className="text-foreground/80 text-xl sm:text-2xl">
              Powered by Autonomous Micropayments
            </span>
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            Ask complex market questions. The agent processes a{" "}
            <span className="text-accent font-mono">$0.01 USDC</span> x402
            payment on Base Sepolia via PinionOS, then delivers premium AI insights
            from Gemini Flash.
          </p>
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="mb-6">
            <StatsBar transactions={history} latestInsight={insight} />
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Main Flow (2/3) ─────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Input */}
            <QueryInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {/* Payment Gate (shows during processing) */}
            <PaymentGate
              isProcessing={isLoading}
              isConfirmed={!!insight}
              error={error}
              errorType={errorType as "payment" | "ai" | "validation" | "unknown" | null}
              paymentSucceeded={paymentSucceeded}
            />

            {/* AI Insight (shows after success) */}
            {insight && (
              <InsightDisplay insight={insight} payment={payment} />
            )}

            {/* How It Works (shows when idle and no results) */}
            {!insight && !isLoading && !error && (
              <HowItWorks />
            )}
          </div>

          {/* ── Right: Sidebar (1/3) ──────────────────────── */}
          <div className="space-y-6">
            {/* Transaction History */}
            <TransactionHistory transactions={history} />

            {/* Tech Stack Info */}
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Tech Stack
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Payment Layer", value: "PinionOS x402" },
                  { label: "Settlement", value: "USDC on Base Sepolia" },
                  { label: "AI Engine", value: "Gemini 3 Flash" },
                  { label: "Framework", value: "Next.js 15 + Tailwind" },
                  { label: "Cost per Query", value: "$0.01 USDC" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted">{label}</span>
                    <span className="font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

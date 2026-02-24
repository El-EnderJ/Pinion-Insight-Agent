/**
 * @page Home
 * Main dashboard page for the Pinion Insight Agent.
 *
 * Multi-turn chat architecture:
 * - Left: Collapsible ChatSidebar (conversation list)
 * - Center: ChatView (message bubbles) + ChatInput + PaymentGate
 * - Right: TransactionHistory (filtered to active conversation)
 *
 * Each message triggers a real $0.01 USDC x402 payment on Base Sepolia.
 * Conversations persist in localStorage.
 */

"use client";

import { useState, useMemo } from "react";
import { useConversations } from "@/hooks/useConversations";
import { usePinion } from "@/hooks/usePinion";
import Header from "@/components/Header";
import ChatSidebar from "@/components/ChatSidebar";
import ChatView from "@/components/ChatView";
import ChatInput from "@/components/ChatInput";
import PaymentGate from "@/components/PaymentGate";
import TransactionHistory from "@/components/TransactionHistory";
import Footer from "@/components/Footer";
import type { TransactionRecord } from "@/types";

export default function Home() {
  const {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    error,
    errorType,
    paymentSucceeded,
    createConversation,
    setActiveConversation,
    deleteConversation,
    sendMessage,
  } = useConversations();

  const { wallet, isConnected, refreshBalance } = usePinion();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
    refreshBalance();
  };

  // Build transaction records from active conversation messages
  const activeTransactions: TransactionRecord[] = useMemo(() => {
    if (!activeConversation) return [];
    return activeConversation.messages
      .filter((m) => m.role === "user")
      .map((m) => ({
        id: m.id,
        query: m.content,
        costUSDC: m.payment?.amount ?? (m.txHash ? "0.01" : "0.00"),
        txHash: m.txHash,
        gasUsed: m.payment?.gasUsed,
        blockNumber: m.payment?.blockNumber,
        explorerUrl: m.payment?.explorerUrl,
        status: m.txHash ? ("success" as const) : ("failed" as const),
        timestamp: m.timestamp,
      }));
  }, [activeConversation]);

  // Global stats across all conversations
  const globalStats = useMemo(() => {
    let totalSpent = 0;
    let queryCount = 0;
    for (const conv of conversations) {
      for (const m of conv.messages) {
        if (m.role === "user") {
          queryCount++;
          if (m.txHash) {
            totalSpent += parseFloat(m.payment?.amount ?? "0.01");
          }
        }
      }
    }
    return { totalSpent: totalSpent.toFixed(2), queryCount };
  }, [conversations]);

  const walletAddress = wallet?.address;
  const hasAnySuccess = conversations.some((c) =>
    c.messages.some((m) => m.role === "user" && m.txHash),
  );

  // Determine if insight is confirmed (last assistant message exists)
  const lastAssistantMsg = activeConversation?.messages
    .filter((m) => m.role === "assistant")
    .at(-1);
  const isConfirmed = !!lastAssistantMsg && !isLoading;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────────────── */}
      <Header
        isConnected={isConnected || hasAnySuccess}
        walletAddress={walletAddress}
        usdcBalance={wallet?.usdcBalance}
        ethBalance={wallet?.ethBalance}
        totalSpent={globalStats.totalSpent}
        queryCount={globalStats.queryCount}
      />

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
          onNewChat={createConversation}
          onSelect={setActiveConversation}
          onDelete={deleteConversation}
        />

        {/* Center: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <ChatView
            messages={activeConversation?.messages ?? []}
            isLoading={isLoading}
          />

          {/* Payment Gate (overlay during processing) */}
          {(isLoading || error) && (
            <div className="px-4 pb-2">
              <PaymentGate
                isProcessing={isLoading}
                isConfirmed={isConfirmed}
                error={error}
                errorType={errorType as "payment" | "ai" | "validation" | "unknown" | null}
                paymentSucceeded={paymentSucceeded}
              />
            </div>
          )}

          {/* Chat Input */}
          <ChatInput
            onSubmit={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Right: Transaction Log (hidden on mobile) */}
        <div className="hidden xl:block w-80 shrink-0 border-l border-card-border overflow-y-auto">
          <div className="p-3">
            <TransactionHistory transactions={activeTransactions} />

            {/* Tech Stack Info */}
            <div className="bg-card border border-card-border rounded-2xl p-4 mt-3">
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
                  { label: "Cost per Message", value: "$0.01 USDC" },
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
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

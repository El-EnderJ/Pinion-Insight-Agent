/**
 * @module usePinion
 * React hook for the agent's on-chain wallet state on Base Sepolia.
 *
 * Provides client-side state management for:
 * - Auto-fetching agent wallet address + real on-chain balances
 * - Balance refresh after each transaction
 * - Payment session tracking
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { WalletInfo, PaymentStatus } from "@/types";

interface UsePinionState {
  /** Whether the wallet data is loaded */
  isConnected: boolean;
  /** Current wallet information (real on-chain data) */
  wallet: WalletInfo | null;
  /** Current payment processing status */
  paymentStatus: PaymentStatus;
  /** Whether we're fetching wallet data */
  isLoadingWallet: boolean;
  /** Error from wallet operations */
  error: string | null;
}

interface UsePinionReturn extends UsePinionState {
  /** Refresh the agent wallet balance */
  refreshBalance: () => Promise<void>;
  /** Set the payment status */
  setPaymentStatus: (status: PaymentStatus) => void;
}

/**
 * Hook for managing the agent's on-chain wallet state.
 * Automatically fetches wallet info from /api/agent on mount.
 */
export function usePinion(): UsePinionReturn {
  const [state, setState] = useState<UsePinionState>({
    isConnected: false,
    wallet: null,
    paymentStatus: "idle",
    isLoadingWallet: false,
    error: null,
  });

  const refreshBalance = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoadingWallet: true, error: null }));

    try {
      const res = await fetch("/api/agent");
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Failed to fetch agent wallet");
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        wallet: data.wallet,
        isLoadingWallet: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wallet error";
      setState((prev) => ({
        ...prev,
        isLoadingWallet: false,
        error: message,
      }));
    }
  }, []);

  const setPaymentStatus = useCallback((status: PaymentStatus) => {
    setState((prev) => ({ ...prev, paymentStatus: status }));
  }, []);

  // Auto-fetch agent wallet on mount
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return { ...state, refreshBalance, setPaymentStatus };
}

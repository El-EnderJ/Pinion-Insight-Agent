/**
 * @module usePinion
 * React hook for interacting with PinionOS wallet features.
 *
 * Provides client-side state management for:
 * - Wallet balance polling
 * - Payment session tracking
 * - Connection status
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { WalletInfo, PaymentStatus } from "@/types";

interface UsePinionState {
  /** Whether the wallet is connected (has a valid address) */
  isConnected: boolean;
  /** Current wallet information */
  wallet: WalletInfo | null;
  /** Current payment processing status */
  paymentStatus: PaymentStatus;
  /** Whether we're fetching wallet data */
  isLoadingWallet: boolean;
  /** Error from wallet operations */
  error: string | null;
}

interface UsePinionReturn extends UsePinionState {
  /** Fetch wallet balance for a given address */
  fetchBalance: (address: string) => Promise<void>;
  /** Set the payment status */
  setPaymentStatus: (status: PaymentStatus) => void;
}

/**
 * Hook for managing PinionOS wallet state.
 *
 * @param walletAddress - Optional initial wallet address to auto-fetch
 */
export function usePinion(walletAddress?: string): UsePinionReturn {
  const [state, setState] = useState<UsePinionState>({
    isConnected: false,
    wallet: null,
    paymentStatus: "idle",
    isLoadingWallet: false,
    error: null,
  });

  const fetchBalance = useCallback(async (address: string) => {
    setState((prev) => ({ ...prev, isLoadingWallet: true, error: null }));

    try {
      const res = await fetch(`/api/balance?address=${address}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Failed to fetch balance");
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

  // Auto-fetch balance if address provided
  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress, fetchBalance]);

  return { ...state, fetchBalance, setPaymentStatus };
}

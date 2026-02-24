/**
 * @component Header
 * Top navigation bar with branding, wallet dropdown, and network indicator.
 * The wallet dropdown shows the agent's wallet address, balances,
 * and session stats pulled from PinionOS.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ChevronDown,
  Cpu,
  ExternalLink,
  Wallet,
  Zap,
  X,
} from "lucide-react";

interface HeaderProps {
  walletAddress?: string;
  usdcBalance?: string;
  ethBalance?: string;
  isConnected: boolean;
  totalSpent?: string;
  queryCount?: number;
}

export default function Header({
  walletAddress,
  usdcBalance,
  ethBalance,
  isConnected,
  totalSpent,
  queryCount,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Brand ──────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center glow-accent-sm">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-gradient">Pinion</span>{" "}
                <span className="text-foreground">Insight Agent</span>
              </h1>
              <p className="text-xs text-muted flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Autonomous AI • x402 Micropayments
              </p>
            </div>
          </div>

          {/* ── Right Side ─────────────────────────────── */}
          <div className="flex items-center gap-4">
            {/* Network Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border text-xs">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-muted">Base Sepolia</span>
              <span className="text-foreground font-mono">USDC</span>
            </div>

            {/* Wallet Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border hover:border-accent/30 transition-colors"
              >
                <Wallet className="w-4 h-4 text-accent" />
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground">
                      {truncatedAddress}
                    </span>
                    {usdcBalance && (
                      <span className="text-xs font-semibold text-success flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        ${usdcBalance}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted">Agent Wallet</span>
                )}
                <ChevronDown
                  className={`w-3 h-3 text-muted transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-card border border-card-border rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-card-border/50">
                      <span className="text-xs font-semibold text-foreground">
                        Agent Wallet
                      </span>
                      <button
                        onClick={() => setDropdownOpen(false)}
                        className="text-muted hover:text-foreground transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Address */}
                      {walletAddress ? (
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
                            Address
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-foreground truncate">
                              {walletAddress}
                            </span>
                            <a
                              href={`https://sepolia.basescan.org/address/${walletAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent/80 shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted text-center py-2">
                          Wallet auto-connects on first payment
                        </div>
                      )}

                      {/* Balances */}
                      {isConnected && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-card-border/20 rounded-lg p-2.5">
                            <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
                              USDC
                            </div>
                            <div className="text-sm font-semibold text-foreground font-mono">
                              ${usdcBalance ?? "0.00"}
                            </div>
                          </div>
                          <div className="bg-card-border/20 rounded-lg p-2.5">
                            <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
                              ETH
                            </div>
                            <div className="text-sm font-semibold text-foreground font-mono">
                              {ethBalance ?? "0.0000"}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Session Stats */}
                      <div className="border-t border-card-border/50 pt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Session Queries</span>
                          <span className="font-mono text-foreground">
                            {queryCount ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Total Spent</span>
                          <span className="font-mono text-accent">
                            ${totalSpent ?? "0.00"} USDC
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Network</span>
                          <span className="font-mono text-foreground flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Base Sepolia
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Protocol</span>
                          <span className="font-mono text-foreground">
                            x402
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

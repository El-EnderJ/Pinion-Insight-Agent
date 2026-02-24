/**
 * @component TransactionHistory
 * Sidebar panel showing all past payment transactions with
 * status indicators and cost tracking.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  FileText,
  BarChart3,
} from "lucide-react";
import type { TransactionRecord } from "@/types";

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + parseFloat(t.costUSDC), 0)
    .toFixed(2);

  const successCount = transactions.filter((t) => t.status === "success").length;

  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">
              Transaction Log
            </h3>
          </div>
          <span className="text-xs text-muted">
            {transactions.length} total
          </span>
        </div>

        {/* Stats */}
        {transactions.length > 0 && (
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Coins className="w-3 h-3 text-success" />
              <span className="text-muted">Spent:</span>
              <span className="font-mono text-foreground">${totalSpent}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <BarChart3 className="w-3 h-3 text-accent" />
              <span className="text-muted">Success:</span>
              <span className="font-mono text-foreground">
                {successCount}/{transactions.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Transaction List ────────────────────────────────── */}
      <div className="max-h-[400px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-8 h-8 text-muted/30 mx-auto mb-2" />
            <p className="text-xs text-muted">
              No transactions yet.
              <br />
              Ask a question to get started.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {transactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 border-b border-card-border/50 last:border-0 hover:bg-card-border/10 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  {/* Status Icon */}
                  <div className="mt-0.5 shrink-0">
                    {tx.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : tx.status === "failed" ? (
                      <XCircle className="w-4 h-4 text-danger" />
                    ) : (
                      <Clock className="w-4 h-4 text-warning animate-pulse" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground line-clamp-1 font-medium">
                      {tx.query}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-mono ${
                          tx.status === "success"
                            ? "text-success"
                            : tx.status === "failed"
                              ? "text-danger"
                              : "text-warning"
                        }`}
                      >
                        ${tx.costUSDC}
                      </span>
                      <span className="text-xs text-muted">
                        {formatTimestamp(tx.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return new Date(ts).toLocaleTimeString();
}

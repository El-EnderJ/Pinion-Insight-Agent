/**
 * @component StatsBar
 * Live stats panel showing session metrics:
 * total queries, total cost, success rate, and average latency.
 */

"use client";

import { Coins, Zap, Target, Clock } from "lucide-react";
import type { TransactionRecord, AgentInsight } from "@/types";

interface StatsBarProps {
  transactions: TransactionRecord[];
  latestInsight?: AgentInsight | null;
}

export default function StatsBar({
  transactions,
  latestInsight,
}: StatsBarProps) {
  const totalQueries = transactions.length;
  const successCount = transactions.filter((t) => t.status === "success").length;
  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + parseFloat(t.costUSDC), 0);
  const successRate = totalQueries > 0
    ? Math.round((successCount / totalQueries) * 100)
    : 0;

  const stats = [
    {
      label: "Queries",
      value: totalQueries.toString(),
      icon: Zap,
      color: "text-accent",
    },
    {
      label: "Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: Coins,
      color: "text-success",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: Target,
      color: "text-violet-400",
    },
    {
      label: "Last Latency",
      value: latestInsight ? `${latestInsight.latency}ms` : "—",
      icon: Clock,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-card-border rounded-xl p-3 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-card-border/30 flex items-center justify-center shrink-0">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-foreground leading-none">
              {stat.value}
            </div>
            <div className="text-xs text-muted mt-0.5">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

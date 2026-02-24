/**
 * @component HowItWorks
 * Visual explanation of the payment-gated AI flow.
 * Shows the 3-step process for new users.
 */

"use client";

import { MessageSquare, CreditCard, Brain, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Ask a Question",
    description:
      "Enter a complex market intelligence query. The agent estimates the computation cost in USDC.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: CreditCard,
    title: "Micropayment via x402",
    description:
      "PinionOS processes an autonomous $0.01 USDC payment on Base Sepolia. No wallet connection needed — the agent controls its own wallet.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Brain,
    title: "AI Insight Delivered",
    description:
      "Only after payment confirmation, Gemini Flash generates a premium market analysis. Pay-per-use, no subscriptions.",
    color: "from-emerald-500 to-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-card/50 border border-card-border rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        How It Works
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((step, idx) => (
          <div key={step.title} className="flex items-start gap-3">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}
              >
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-card border border-card-border flex items-center justify-center text-[10px] font-bold text-accent">
                {idx + 1}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                {step.title}
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
            {idx < STEPS.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted/30 self-center hidden md:block shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

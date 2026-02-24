/**
 * @component QueryInput
 * The main input area where users type their market intelligence question.
 * Shows a cost estimator and submit button with payment confirmation.
 * Example prompts fade smoothly in/out with AnimatePresence.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Loader2,
  DollarSign,
  Brain,
  TrendingUp,
  Shield,
  Search,
} from "lucide-react";

interface QueryInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

/** Example prompts to inspire users */
const EXAMPLE_PROMPTS = [
  {
    icon: TrendingUp,
    label: "Market Analysis",
    prompt: "Analyze the current market sentiment for Ethereum and predict short-term price movement based on on-chain metrics.",
  },
  {
    icon: Shield,
    label: "DeFi Strategy",
    prompt: "What are the top 3 yield farming strategies on Base L2 right now with the best risk-adjusted returns?",
  },
  {
    icon: Search,
    label: "Token Research",
    prompt: "Deep dive into the tokenomics of USDC on Base. How does it compare to native stablecoins in the ecosystem?",
  },
  {
    icon: Brain,
    label: "On-Chain Forensics",
    prompt: "Explain the x402 payment protocol and how autonomous agents can use it for machine-to-machine micropayments.",
  },
];

export default function QueryInput({
  onSubmit,
  isLoading,
  disabled,
}: QueryInputProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [query]);

  const estimatedCost = query.length > 0
    ? (Math.max(1, Math.ceil(query.length / 100)) * 0.01).toFixed(2)
    : "0.00";

  const handleSubmit = () => {
    if (query.trim() && !isLoading && !disabled) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Main Input Card ─────────────────────────────────── */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity" />
        <div className="relative bg-card border border-card-border rounded-2xl p-4">
          {/* Top label */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Ask the Intelligence Agent</span>
            </div>
            {query.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                <DollarSign className="w-3 h-3" />
                <span className="font-mono">{estimatedCost} USDC</span>
              </div>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a complex market intelligence question..."
            disabled={isLoading || disabled}
            rows={3}
            className="w-full bg-transparent text-foreground placeholder-muted/50 resize-none focus:outline-none text-base leading-relaxed"
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border/50">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>
                {query.length > 0 ? `${query.length} chars` : "Shift+Enter for new line"}
              </span>
              <span>•</span>
              <span>Powered by Gemini 3 Flash</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading || disabled}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Pay & Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Example Prompts (smooth fade in/out) ────────────── */}
      <AnimatePresence>
        {!query && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((example, idx) => (
                <motion.button
                  key={example.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  onClick={() => setQuery(example.prompt)}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-card-border/50 text-left hover:border-accent/30 hover:bg-card transition-all group"
                >
                  <example.icon className="w-4 h-4 text-muted group-hover:text-accent mt-0.5 shrink-0 transition-colors" />
                  <div>
                    <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                      {example.label}
                    </div>
                    <div className="text-xs text-muted line-clamp-2 mt-0.5">
                      {example.prompt}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

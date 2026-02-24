/**
 * @component InsightDisplay
 * Renders the AI-generated market insight with metadata.
 * Features a typing animation that reveals the response word-by-word.
 * Includes a header showing cost, latency, and model info.
 */

"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Coins,
  Cpu,
  Hash,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { AgentInsight, PaymentResult } from "@/types";

interface InsightDisplayProps {
  insight: AgentInsight;
  payment?: PaymentResult | null;
}

/** Speed of typing reveal in ms per word */
const TYPING_SPEED = 30;

export default function InsightDisplay({
  insight,
  payment,
}: InsightDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [visibleWords, setVisibleWords] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const prevContentRef = useRef<string>("");

  // Split content into words for the typing animation
  const words = insight.content.split(/(\s+)/);

  // Typing animation — triggers when new content arrives
  useEffect(() => {
    // Skip animation if same content
    if (insight.content === prevContentRef.current) {
      setVisibleWords(words.length);
      setIsTypingDone(true);
      return;
    }

    prevContentRef.current = insight.content;
    setVisibleWords(0);
    setIsTypingDone(false);

    let idx = 0;
    const timer = setInterval(() => {
      idx += 3; // Reveal 3 tokens at a time (word + whitespace + next word)
      if (idx >= words.length) {
        idx = words.length;
        setIsTypingDone(true);
        clearInterval(timer);
      }
      setVisibleWords(idx);
    }, TYPING_SPEED);

    return () => clearInterval(timer);
  }, [insight.content, words.length]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(insight.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build the visible text from the word array
  const visibleText = words.slice(0, visibleWords).join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ── Meta Header ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Success Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Payment Verified
        </div>

        {/* Cost */}
        {payment && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-xs text-muted">
            <Coins className="w-3 h-3 text-accent" />
            <span className="font-mono">${payment.amount} USDC</span>
          </div>
        )}

        {/* TxHash */}
        {payment?.txHash && payment.txHash !== "0x" && (
          <a
            href={payment.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <Hash className="w-3 h-3" />
            <span className="font-mono">
              {payment.txHash.slice(0, 8)}…{payment.txHash.slice(-6)}
            </span>
          </a>
        )}

        {/* Latency */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-xs text-muted">
          <Clock className="w-3 h-3 text-accent" />
          <span className="font-mono">{insight.latency}ms</span>
        </div>

        {/* Model */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-xs text-muted">
          <Cpu className="w-3 h-3 text-accent" />
          <span>{insight.model}</span>
        </div>

        {/* Tokens */}
        {insight.tokensUsed && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-xs text-muted">
            <Hash className="w-3 h-3 text-accent" />
            <span className="font-mono">{insight.tokensUsed} tokens</span>
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-xs text-muted hover:text-accent hover:border-accent/30 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* ── Insight Content ─────────────────────────────────── */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-violet-600/10 rounded-2xl blur-sm" />
        <div className="relative bg-card border border-card-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-card-border/50">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Cpu className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-accent">
              PINION-ALPHA
            </span>
            <span className="text-xs text-muted">• Market Intelligence Agent</span>
          </div>

          <div
            className="markdown-content prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: formatMarkdown(visibleText),
            }}
          />

          {/* Blinking cursor while typing */}
          {!isTypingDone && (
            <span className="inline-block w-2 h-4 bg-accent/80 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Simple Markdown → HTML ──────────────────────────────────────── */

function formatMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // H3
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    // H2
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    // H1
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr/>")
    // Paragraphs (lines that aren't already HTML)
    .replace(/^(?!<[a-z])(.*\S.*)$/gm, "<p>$1</p>")
    // Clean up double paragraphs
    .replace(/<p><\/p>/g, "");
}

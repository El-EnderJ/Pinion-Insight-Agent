/**
 * @component ChatView
 * Renders the multi-turn conversation as chat bubbles.
 * Features:
 * - User messages (right-aligned) with payment badges
 * - Assistant messages (left-aligned) with typing animation
 * - Per-message BaseScan links + payment metadata
 * - Auto-scroll to latest message
 * - Empty state / welcome screen
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  User,
  Hash,
  Clock,
  Coins,
  Copy,
  Check,
  Fuel,
  Box,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { ChatMessage } from "@/types";

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  /** Called when the user clicks a suggestion card in the empty state */
  onSuggestionClick?: (text: string) => void;
}

/** Speed of typing reveal in ms per chunk */
const TYPING_SPEED = 25;

export default function ChatView({ messages, isLoading, onSuggestionClick }: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or loading state
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {msg.role === "user" ? (
                <UserBubble message={msg} />
              ) : (
                <AssistantBubble
                  message={msg}
                  animate={isLast}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div className="bg-card border border-card-border rounded-2xl rounded-tl-md px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-muted">Processing payment & generating insight...</span>
            </div>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

/* ─── User Bubble ─────────────────────────────────────────────────── */

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[75%] space-y-1.5">
        {/* Message */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-accent/20 rounded-2xl rounded-tr-md px-4 py-3">
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Payment badge row */}
        {message.txHash && (
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {/* Cost */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-[10px] text-success font-mono">
              <Coins className="w-2.5 h-2.5" />
              ${message.payment?.amount ?? "0.01"} USDC
            </span>

            {/* TxHash */}
            <a
              href={message.payment?.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card border border-card-border text-[10px] text-accent hover:text-accent/80 font-mono transition-colors"
            >
              <Hash className="w-2.5 h-2.5" />
              {message.txHash.slice(0, 8)}…{message.txHash.slice(-6)}
              <ExternalLink className="w-2 h-2" />
            </a>

            {/* Gas */}
            {message.payment?.gasUsed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card border border-card-border text-[10px] text-muted font-mono">
                <Fuel className="w-2.5 h-2.5" />
                {Number(message.payment.gasUsed).toLocaleString()}
              </span>
            )}

            {/* Block */}
            {message.payment?.blockNumber && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card border border-card-border text-[10px] text-muted font-mono">
                <Box className="w-2.5 h-2.5" />
                #{message.payment.blockNumber.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-[10px] text-muted text-right">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-card-border/30 flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-muted" />
      </div>
    </div>
  );
}

/* ─── Assistant Bubble ────────────────────────────────────────────── */

function AssistantBubble({
  message,
  animate,
}: {
  message: ChatMessage;
  animate: boolean;
}) {
  const [visibleWords, setVisibleWords] = useState(animate ? 0 : Infinity);
  const [isTypingDone, setIsTypingDone] = useState(!animate);
  const [copied, setCopied] = useState(false);
  const prevContentRef = useRef<string>("");

  const words = message.content.split(/(\s+)/);

  useEffect(() => {
    if (!animate) {
      setVisibleWords(words.length);
      setIsTypingDone(true);
      return;
    }

    if (message.content === prevContentRef.current) {
      setVisibleWords(words.length);
      setIsTypingDone(true);
      return;
    }

    prevContentRef.current = message.content;
    setVisibleWords(0);
    setIsTypingDone(false);

    let idx = 0;
    const timer = setInterval(() => {
      idx += 3;
      if (idx >= words.length) {
        idx = words.length;
        setIsTypingDone(true);
        clearInterval(timer);
      }
      setVisibleWords(idx);
    }, TYPING_SPEED);

    return () => clearInterval(timer);
  }, [message.content, words.length, animate]);

  const visibleText = words.slice(0, visibleWords).join("");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shrink-0">
        <Cpu className="w-4 h-4 text-white" />
      </div>

      <div className="max-w-[80%] space-y-1.5">
        {/* Agent label */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-accent">PINION-ALPHA</span>
          {message.model && (
            <span className="text-[10px] text-muted">• {message.model}</span>
          )}
          {message.latency && (
            <span className="text-[10px] text-muted flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {message.latency}ms
            </span>
          )}
        </div>

        {/* Message content */}
        <div className="bg-card border border-card-border rounded-2xl rounded-tl-md px-4 py-3">
          <div
            className="markdown-content prose prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: formatMarkdown(visibleText),
            }}
          />
          {!isTypingDone && (
            <span className="inline-block w-2 h-4 bg-accent/80 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
          )}
        </div>

        {/* Copy + Timestamp */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-muted hover:text-accent transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-success" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5" /> Copy
              </>
            )}
          </button>
          <span className="text-[10px] text-muted">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────────────── */

const SUGGESTION_PROMPTS = [
  "Analyze the current market sentiment for Ethereum and predict short-term price movement based on on-chain metrics.",
  "What are the top 3 yield farming strategies on Base right now with the best risk-adjusted returns?",
  "Deep dive into the tokenomics of USDC on Base. How does it compare to native stablecoins in the ecosystem?",
  "Explain the x402 payment protocol and how autonomous agents use it for machine-to-machine micropayments.",
];

const SUGGESTION_LABELS = [
  "Market Sentiment",
  "DeFi Yield Strategies",
  "USDC Tokenomics",
  "x402 Protocol",
];

function EmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick?: (text: string) => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-4 glow-accent-sm">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          <span className="text-gradient">AI Market Intelligence</span>
        </h2>
        <p className="text-sm text-muted mb-4">
          Ask complex market questions. Each message triggers a{" "}
          <span className="text-accent font-mono">$0.01 USDC</span> x402
          payment on Base Sepolia via PinionOS.
        </p>
        <div className="grid grid-cols-2 gap-2 text-left">
          {SUGGESTION_PROMPTS.map((prompt, idx) => (
            <button
              key={prompt}
              onClick={() => onSuggestionClick?.(prompt)}
              className="p-2.5 rounded-lg bg-card/50 border border-card-border/50 text-left hover:border-accent/30 hover:bg-card transition-all group"
            >
              <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors mb-0.5">
                {SUGGESTION_LABELS[idx]}
              </div>
              <div className="text-xs text-muted line-clamp-2">{prompt}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Markdown Formatter ──────────────────────────────────────────── */

function formatMarkdown(text: string): string {
  return text
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre><code class="language-$1">$2</code></pre>',
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^(?!<[a-z])(.*\S.*)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}

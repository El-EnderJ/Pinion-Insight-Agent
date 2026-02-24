/**
 * @module useConversations
 * React hook for managing multi-turn conversations with localStorage persistence.
 *
 * Provides:
 * - CRUD operations for conversations
 * - Active conversation selection
 * - Auto-generated titles from first user message
 * - localStorage read/write with debounced saves
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Conversation, ChatMessage, PaymentResult } from "@/types";

const STORAGE_KEY = "pinion-conversations";
const MAX_CONVERSATIONS = 50;

/* ─── Helpers ─────────────────────────────────────────────────────── */

function generateId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function autoTitle(content: string): string {
  // Use first 50 chars of the user's first message, truncated at word boundary
  const cleaned = content.replace(/\n/g, " ").trim();
  if (cleaned.length <= 50) return cleaned;
  const truncated = cleaned.slice(0, 50);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

function loadFromStorage(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full — silently drop oldest conversations
    const trimmed = conversations.slice(0, MAX_CONVERSATIONS / 2);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

/* ─── Hook ────────────────────────────────────────────────────────── */

interface UseConversationsReturn {
  /** All conversations, newest first */
  conversations: Conversation[];
  /** Currently active conversation (or null) */
  activeConversation: Conversation | null;
  /** ID of the active conversation */
  activeId: string | null;
  /** Whether we're waiting for AI response */
  isLoading: boolean;
  /** Current error message */
  error: string | null;
  /** Error type */
  errorType: string | null;
  /** Whether the last payment succeeded */
  paymentSucceeded: boolean;
  /** Create a new empty conversation and set it active */
  createConversation: () => string;
  /** Switch to a different conversation */
  setActiveConversation: (id: string) => void;
  /** Delete a conversation */
  deleteConversation: (id: string) => void;
  /** Send a message: adds user msg, calls API, adds assistant msg */
  sendMessage: (content: string) => Promise<void>;
  /** Rename a conversation */
  renameConversation: (id: string, title: string) => void;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const initialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = loadFromStorage();
    if (stored.length > 0) {
      setConversations(stored);
      setActiveId(stored[0].id); // Most recent
    }
  }, []);

  // Persist to localStorage on change (skip initial empty state)
  useEffect(() => {
    if (!initialized.current) return;
    if (conversations.length > 0) {
      saveToStorage(conversations);
    }
  }, [conversations]);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;

  /* ── Create ─────────────────────────────────────────────── */
  const createConversation = useCallback((): string => {
    const id = generateId();
    const now = Date.now();
    const newConv: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => [newConv, ...prev].slice(0, MAX_CONVERSATIONS));
    setActiveId(id);
    setError(null);
    setErrorType(null);
    setPaymentSucceeded(false);
    return id;
  }, []);

  /* ── Switch ─────────────────────────────────────────────── */
  const setActiveConversation = useCallback((id: string) => {
    setActiveId(id);
    setError(null);
    setErrorType(null);
    setPaymentSucceeded(false);
  }, []);

  /* ── Delete ─────────────────────────────────────────────── */
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id);
        if (id === activeId) {
          setActiveId(filtered.length > 0 ? filtered[0].id : null);
        }
        if (filtered.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
        }
        return filtered;
      });
    },
    [activeId],
  );

  /* ── Rename ─────────────────────────────────────────────── */
  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c)),
    );
  }, []);

  /* ── Send Message ───────────────────────────────────────── */
  const sendMessage = useCallback(
    async (content: string) => {
      let currentActiveId = activeId;

      // If no active conversation, create one
      if (!currentActiveId) {
        const id = generateId();
        const now = Date.now();
        const newConv: Conversation = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        setConversations((prev) =>
          [newConv, ...prev].slice(0, MAX_CONVERSATIONS),
        );
        setActiveId(id);
        currentActiveId = id;
      }

      const userMsg: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      // Add user message to conversation
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentActiveId) return c;
          const isFirst = c.messages.length === 0;
          return {
            ...c,
            title: isFirst ? autoTitle(content) : c.title,
            messages: [...c.messages, userMsg],
            updatedAt: Date.now(),
          };
        }),
      );

      setIsLoading(true);
      setError(null);
      setErrorType(null);
      setPaymentSucceeded(false);

      try {
        // Get current conversation for history context
        const conv = conversations.find((c) => c.id === currentActiveId);
        const allMessages = conv ? [...conv.messages, userMsg] : [userMsg];

        // Build history from last 6 messages (3 pairs)
        const historyMessages = allMessages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 120_000);

        const res = await fetch("/api/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: content,
            history: historyMessages.slice(0, -1), // Exclude current question from history
          }),
          signal: controller.signal,
        }).finally(() => clearTimeout(fetchTimeout));

        const data = await res.json();

        if (!data.success) {
          const paidOk = data.paymentSucceeded === true;
          setPaymentSucceeded(paidOk);
          setError(data.error ?? "Unknown error");
          setErrorType(data.errorType ?? "unknown");

          // Update user message with payment data if available
          if (paidOk && data.payment) {
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id !== currentActiveId) return c;
                const msgs = c.messages.map((m) =>
                  m.id === userMsg.id
                    ? { ...m, txHash: data.payment.txHash, payment: data.payment }
                    : m,
                );
                return { ...c, messages: msgs, updatedAt: Date.now() };
              }),
            );
          }

          setIsLoading(false);
          return;
        }

        // Success: update user message with payment, add assistant message
        const assistantMsg: ChatMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: data.insight?.content ?? "",
          timestamp: Date.now(),
          model: data.insight?.model,
          latency: data.insight?.latency,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentActiveId) return c;
            const msgs = c.messages.map((m) =>
              m.id === userMsg.id
                ? { ...m, txHash: data.payment?.txHash, payment: data.payment }
                : m,
            );
            return {
              ...c,
              messages: [...msgs, assistantMsg],
              updatedAt: Date.now(),
            };
          }),
        );

        setPaymentSucceeded(true);
        setIsLoading(false);
      } catch (err) {
        const isAbort =
          err instanceof DOMException && err.name === "AbortError";
        const message = isAbort
          ? "Request timed out — the payment or AI service took too long. Please try again."
          : err instanceof Error
            ? err.message
            : "Network request failed";

        setError(message);
        setErrorType("unknown");
        setPaymentSucceeded(false);
        setIsLoading(false);
      }
    },
    [activeId, conversations],
  );

  return {
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
    renameConversation,
  };
}

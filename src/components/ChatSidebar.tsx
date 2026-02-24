/**
 * @component ChatSidebar
 * Collapsible sidebar listing all conversations.
 * Features:
 * - New Chat button
 * - Conversation list with auto-generated titles
 * - Active state highlighting
 * - Delete action per conversation
 * - Framer Motion collapse animation
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
} from "lucide-react";
import type { Conversation } from "@/types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  isOpen,
  onToggle,
  onNewChat,
  onSelect,
  onDelete,
}: ChatSidebarProps) {
  return (
    <>
      {/* Toggle Button (visible when sidebar is collapsed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
            className="fixed left-4 top-20 z-40 p-2.5 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-colors shadow-lg"
            title="Open sidebar"
          >
            <PanelLeftOpen className="w-4 h-4 text-muted" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="shrink-0 overflow-hidden border-r border-card-border bg-card/50 backdrop-blur-sm"
          >
            <div className="w-[280px] h-full flex flex-col">
              {/* Header */}
              <div className="p-3 border-b border-card-border/50 flex items-center justify-between">
                <button
                  onClick={onNewChat}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-shadow flex-1"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
                <button
                  onClick={onToggle}
                  className="ml-2 p-2 rounded-lg hover:bg-card-border/30 transition-colors"
                  title="Close sidebar"
                >
                  <PanelLeftClose className="w-4 h-4 text-muted" />
                </button>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                    <p className="text-xs text-muted">
                      No conversations yet.
                      <br />
                      Start a new chat to begin.
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {conversations.map((conv) => {
                      const isActive = conv.id === activeId;
                      const msgCount = conv.messages.length;
                      const paidCount = conv.messages.filter(
                        (m) => m.role === "user" && m.txHash,
                      ).length;

                      return (
                        <div
                          key={conv.id}
                          className={`group mx-2 mb-0.5 rounded-lg transition-colors cursor-pointer ${
                            isActive
                              ? "bg-accent/10 border border-accent/20"
                              : "hover:bg-card-border/20 border border-transparent"
                          }`}
                          onClick={() => onSelect(conv.id)}
                        >
                          <div className="flex items-start gap-2.5 p-2.5">
                            <MessageSquare
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                isActive ? "text-accent" : "text-muted/60"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium line-clamp-1 ${
                                  isActive
                                    ? "text-accent"
                                    : "text-foreground/80"
                                }`}
                              >
                                {conv.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted">
                                  {msgCount} msg{msgCount !== 1 ? "s" : ""}
                                </span>
                                {paidCount > 0 && (
                                  <span className="text-[10px] text-success font-mono">
                                    ${(paidCount * 0.01).toFixed(2)}
                                  </span>
                                )}
                                <span className="text-[10px] text-muted flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatRelative(conv.updatedAt)}
                                </span>
                              </div>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(conv.id);
                              }}
                              className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger transition-all shrink-0"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted hover:text-danger" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-card-border/50">
                <div className="text-[10px] text-muted text-center">
                  {conversations.length} conversation{conversations.length !== 1 ? "s" : ""} •{" "}
                  Stored locally
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return `${Math.floor(diff / 86_400_000)}d`;
}

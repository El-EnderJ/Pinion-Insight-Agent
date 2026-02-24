/**
 * @component ChatInput
 * Bottom-anchored chat input bar for the multi-turn conversation.
 * Shows cost badge, character count, and submit button.
 * Supports Enter to send, Shift+Enter for new line.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, DollarSign } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  /** Controlled value — lets parent pre-fill the input (e.g. suggestion cards) */
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function ChatInput({
  onSubmit,
  isLoading,
  disabled,
  value: externalValue,
  onValueChange,
}: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use controlled value when provided, otherwise internal state
  const isControlled = externalValue !== undefined && onValueChange !== undefined;
  const message = isControlled ? externalValue : internalMessage;
  const setMessage = isControlled ? onValueChange : setInternalMessage;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // When a suggestion fills the input, focus the textarea
  useEffect(() => {
    if (isControlled && externalValue) {
      textareaRef.current?.focus();
    }
  }, [isControlled, externalValue]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSubmit(message.trim());
      setMessage("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-card-border bg-card/80 backdrop-blur-sm px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl opacity-10 group-focus-within:opacity-20 blur transition-opacity" />
          <div className="relative bg-card border border-card-border rounded-xl flex items-end gap-2 p-2">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a market intelligence question..."
              disabled={isLoading || disabled}
              rows={1}
              className="flex-1 bg-transparent text-foreground placeholder-muted/50 resize-none focus:outline-none text-sm leading-relaxed px-2 py-1.5 max-h-[150px]"
            />

            {/* Right side controls */}
            <div className="flex items-center gap-2 shrink-0 pb-0.5">
              {/* Cost badge */}
              {message.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-[10px] text-accent">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-mono">0.01 USDC</span>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || isLoading || disabled}
                className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white transition-all hover:shadow-lg hover:shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="flex items-center justify-between mt-1.5 px-1">
          <span className="text-[10px] text-muted">
            {message.length > 0
              ? `${message.length} chars`
              : "Shift+Enter for new line"}
          </span>
          <span className="text-[10px] text-muted">
            Each message = $0.01 USDC x402 payment
          </span>
        </div>
      </div>
    </div>
  );
}

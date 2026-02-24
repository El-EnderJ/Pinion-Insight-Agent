/**
 * @component PaymentGate
 * Visual payment processing overlay that blocks content access
 * until PinionOS confirms a successful x402 transaction.
 *
 * Shows a step-by-step animation of the payment flow:
 * 1. Estimating computation cost
 * 2. Signing x402 payment on Base
 * 3. Verifying with facilitator
 * 4. Unlocking AI agent
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Check,
  Loader2,
  Lock,
  ArrowRight,
  Cpu,
  DollarSign,
  Zap,
} from "lucide-react";

interface PaymentGateProps {
  /** Whether the payment is currently being processed */
  isProcessing: boolean;
  /** Whether the payment was successful */
  isConfirmed: boolean;
  /** Optional error message */
  error?: string | null;
  /** Source of the error */
  errorType?: "payment" | "ai" | "validation" | "unknown" | null;
  /** Whether the x402 payment succeeded even if overall failed */
  paymentSucceeded?: boolean;
}

const STEPS = [
  {
    label: "Estimating Compute Cost",
    description: "Calculating required skill calls...",
    icon: Cpu,
  },
  {
    label: "Signing x402 Payment",
    description: "EIP-3009 authorization on Base L2...",
    icon: DollarSign,
  },
  {
    label: "Verifying Transaction",
    description: "Facilitator confirming USDC settlement...",
    icon: Shield,
  },
  {
    label: "Unlocking AI Agent",
    description: "PINION-ALPHA generating insight...",
    icon: Zap,
  },
];

export default function PaymentGate({
  isProcessing,
  isConfirmed,
  error,
  errorType,
  paymentSucceeded,
}: PaymentGateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Animate through steps while processing
  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0);
      return;
    }

    const intervals = [800, 1200, 1500]; // Time per step
    let timeout: NodeJS.Timeout;

    const advance = (step: number) => {
      if (step < STEPS.length - 1) {
        timeout = setTimeout(() => {
          setCurrentStep(step + 1);
          advance(step + 1);
        }, intervals[step] ?? 1000);
      }
    };

    setCurrentStep(0);
    advance(0);

    return () => clearTimeout(timeout);
  }, [isProcessing]);

  // Set to final step when confirmed
  useEffect(() => {
    if (isConfirmed) {
      setCurrentStep(STEPS.length - 1);
    }
  }, [isConfirmed]);

  if (!isProcessing && !isConfirmed && !error) return null;

  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 rounded-2xl blur-sm" />
          <div className="relative bg-card border border-card-border rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Payment Gate Active
                </h3>
                <p className="text-xs text-muted">
                  Processing x402 micropayment on Base...
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStep;
                const isComplete = idx < currentStep || isConfirmed;
                const isPending = idx > currentStep;

                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-accent/5 border border-accent/20"
                        : isComplete
                          ? "bg-success/5 border border-success/20"
                          : "bg-transparent border border-transparent"
                    }`}
                  >
                    {/* Step Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isComplete
                          ? "bg-success/20"
                          : isActive
                            ? "bg-accent/20"
                            : "bg-card-border/30"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-accent animate-spin" />
                      ) : (
                        <step.icon
                          className={`w-4 h-4 ${isPending ? "text-muted/40" : "text-muted"}`}
                        />
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          isComplete
                            ? "text-success"
                            : isActive
                              ? "text-accent"
                              : "text-muted/60"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div
                        className={`text-xs ${
                          isActive ? "text-muted" : "text-muted/40"
                        }`}
                      >
                        {step.description}
                      </div>
                    </div>

                    {/* Arrow */}
                    {idx < STEPS.length - 1 && (
                      <ArrowRight
                        className={`w-3 h-3 shrink-0 ${
                          isComplete ? "text-success/40" : "text-muted/20"
                        }`}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-card-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* If payment succeeded but AI failed, show payment success first */}
          {paymentSucceeded && (
            <div className="bg-success/5 border border-success/20 rounded-2xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success">
                  x402 Payment Verified
                </p>
                <p className="text-xs text-muted mt-1">
                  $0.01 USDC settled on Base L2 via PinionOS
                </p>
              </div>
            </div>
          )}

          {/* Error details */}
          <div
            className={`border rounded-2xl p-4 flex items-start gap-3 ${
              errorType === "ai"
                ? "bg-warning/5 border-warning/20"
                : "bg-danger/5 border-danger/20"
            }`}
          >
            {errorType === "ai" ? (
              <Cpu className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            ) : (
              <Shield className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`text-sm font-medium ${
                  errorType === "ai" ? "text-warning" : "text-danger"
                }`}
              >
                {errorType === "ai"
                  ? "AI Generation Failed"
                  : errorType === "payment"
                    ? "Payment Failed"
                    : errorType === "validation"
                      ? "Invalid Request"
                      : "Request Failed"}
              </p>
              <p className="text-xs text-muted mt-1">{error}</p>
              {errorType === "ai" && paymentSucceeded && (
                <p className="text-xs text-accent mt-2">
                  Your payment was processed successfully. The AI service is
                  temporarily unavailable — please retry shortly.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

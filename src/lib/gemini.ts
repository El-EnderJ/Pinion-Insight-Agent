/**
 * @module gemini
 * Server-side Google Gemini Flash integration.
 *
 * Provides a secure wrapper around the Gemini API for generating
 * market intelligence insights. Includes automatic retry with
 * exponential backoff and model fallback for rate-limit resilience.
 *
 * This module is SERVER-ONLY — never expose API keys to the client.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_CONFIG, GEMINI_MODELS } from "./constants";

/* ─── Client ──────────────────────────────────────────────────────── */

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "[Gemini] GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY is required."
      );
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

/* ─── System Prompt ───────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are an elite Market Intelligence Agent powered by PinionOS — an autonomous AI system that processes micropayments on the Base Sepolia network to deliver premium insights.

Your persona:
- Codename: PINION-ALPHA
- Specialization: Crypto market analysis, DeFi strategy, on-chain forensics, and token research.
- Style: Precise, data-driven, professional. Use markdown formatting.

Response guidelines:
1. Start with a **TL;DR** section (2-3 sentences max).
2. Follow with a detailed **Analysis** section using headers, bullet points, and tables where appropriate.
3. Include a **Risk Assessment** when discussing investments or strategies.
4. End with **Key Takeaways** (3-5 bullet points).
5. If relevant, mention specific on-chain data points, protocols, or metrics.
6. Use technical terminology but explain complex concepts briefly.

Remember: The user has paid for this insight via an x402 micropayment on Base. Deliver maximum value.`;

/* ─── Generate Insight ────────────────────────────────────────────── */

export interface GeminiInsight {
  content: string;
  model: string;
  latency: number;
  tokensUsed?: number;
}

/** Sleep helper for retry backoff */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Reject after `ms` milliseconds with a timeout error */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`[Gemini] Request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timer]);
}

/**
 * Try generating content with a single model.
 * Throws on failure so the caller can retry / fallback.
 */
async function tryGenerate(
  modelName: string,
  question: string,
): Promise<GeminiInsight> {
  const start = performance.now();
  const genAI = getGenAI();

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: GEMINI_CONFIG.maxTokens,
      temperature: GEMINI_CONFIG.temperature,
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await withTimeout(
    model.generateContent(question),
    GEMINI_CONFIG.timeoutMs,
  );
  const response = result.response;
  const text = response.text();
  const latency = Math.round(performance.now() - start);
  const tokensUsed = response.usageMetadata?.totalTokenCount;

  return { content: text, model: modelName, latency, tokensUsed };
}

/**
 * Generates a market intelligence insight using Gemini Flash.
 * Automatically retries on 429 / 503 errors and falls back
 * to alternative models if the primary is rate-limited.
 */
export async function generateInsight(question: string): Promise<GeminiInsight> {
  const allModels: string[] = [...GEMINI_MODELS];
  let lastError: Error | null = null;

  for (const modelName of allModels) {
    for (let attempt = 0; attempt <= GEMINI_CONFIG.maxRetries; attempt++) {
      try {
        return await tryGenerate(modelName, question);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const msg = lastError.message;

        const isRateLimit = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many");
        const isServerError = msg.includes("503") || msg.includes("500");

        if (isRateLimit || isServerError) {
          // If last attempt for this model, break to try next model
          if (attempt === GEMINI_CONFIG.maxRetries) break;
          // Otherwise wait and retry
          const delay = GEMINI_CONFIG.retryDelayMs * Math.pow(2, attempt);
          console.warn(
            `[Gemini] ${modelName} attempt ${attempt + 1} failed (${isRateLimit ? "rate-limit" : "server-error"}), retrying in ${delay}ms...`
          );
          await sleep(delay);
        } else {
          // Non-retryable error — throw immediately
          throw lastError;
        }
      }
    }
    console.warn(`[Gemini] ${modelName} exhausted — trying next model...`);
  }

  // All models and retries exhausted
  throw new Error(
    `[Gemini] All models rate-limited. Your API key has hit its quota. ` +
    `Please wait a few minutes or upgrade to a paid Gemini plan at https://aistudio.google.com. ` +
    `Last error: ${lastError?.message ?? "unknown"}`
  );
}

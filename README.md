# 🤖 Pinion Insight Agent

> **AI-Powered Market Intelligence with Autonomous Micropayments**
>
> A production-ready dashboard demonstrating the future of monetized AI agents. Every insight is paid for on-chain — in real time — via PinionOS x402 on Base Sepolia Testnet.

<p align="center">
  <img src="https://img.shields.io/badge/PinionOS-Hackathon%202026-blueviolet?style=for-the-badge&logo=ethereum&logoColor=white" alt="Hackathon" />
  <img src="https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini-3%20Flash%20Preview-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini 3" />
  <img src="https://img.shields.io/badge/PinionOS-x402%20Protocol-06b6d4?style=for-the-badge&logo=ethereum&logoColor=white" alt="PinionOS" />
  <img src="https://img.shields.io/badge/Network-Base%20Sepolia-1652F0?style=for-the-badge&logo=ethereum&logoColor=white" alt="Base Sepolia" />
  <img src="https://img.shields.io/badge/Settlement-USDC%20%240.01-10b981?style=for-the-badge" alt="USDC" />
</p>

---

## 📋 Overview

**Pinion Insight Agent** is a full-stack demonstration of autonomous AI agents operating as businesses on-chain. Users ask market intelligence questions and the agent:

1. 💰 **Collects payment** — $0.01 USDC x402 micropayment on Base Sepolia
2. 🔒 **Validates on-chain** — insight is **locked** until the payment is confirmed by PinionOS
3. 🤖 **Calls Gemini 3 Flash** — premium analysis only after cryptographic payment proof
4. ✍️ **Streams the response** — word-by-word typing animation
5. 📜 **Logs the transaction** — immutable record with tx hash & cost

This proves that **AI services can be monetized at the API level** itself using x402 micropayments:

- ✅ **No subscriptions, no accounts** — pure pay-per-use
- ✅ **Machine-to-machine payments** for fully autonomous agents
- ✅ **Cryptographic access control** — no payment proof = no AI response
- ✅ **Instant Base Sepolia settlement** — fast, cheap, final

---

## 🎯 Features

| Feature | Detail |
|---------|--------|
| 🔐 **Payment-Gated AI** | Content locked behind real x402 micropayment — no payment = no insight |
| 🤖 **Gemini 3 Flash Preview** | Google's most advanced Flash model with retry & fallback chain |
| 🎬 **4-Step Payment Overlay** | Animated steps: Estimate → Sign x402 → Verify → Unlock AI |
| ✍️ **Typing Animation** | Word-by-word reveal for a premium AI terminal feel |
| 💼 **Wallet Dropdown** | Real-time USDC/ETH balances, session stats, BaseScan link |
| 📊 **Transaction Log** | Immutable sidebar history with tx hashes, costs, latency |
| ⚠️ **Smart Error Handling** | Separate UI states for payment errors vs. AI errors |
| 🔄 **Model Fallback Chain** | Gemini 3 → Gemini 2.0 Flash → Gemini 2.0 Flash Lite |
| ⏱️ **Request Timeouts** | 30s server-side + 60s client-side safety nets |
| 📱 **Responsive Dark UI** | Mobile-first, Tailwind CSS v4, Framer Motion animations |

---

## 🛠️ Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js-App%20Router-000?logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer%20Motion-Animations-FF0055?logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-3%20Flash%20Preview-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/PinionOS-SDK%20v0.4.0-blueviolet?logo=ethereum" />
  <img src="https://img.shields.io/badge/USDC-Base%20Sepolia-10b981" />
</p>

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.1.6 — App Router, Turbopack |
| **Language** | TypeScript 5 (strict, fully typed) |
| **Styling** | Tailwind CSS v4 + Framer Motion |
| **AI Model** | **Gemini 3 Flash Preview** (primary) |
| **Payments** | PinionOS SDK v0.4.0 — x402 protocol |
| **Settlement** | USDC on Base Sepolia Testnet |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- A PinionOS-compatible wallet private key with testnet USDC

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pinion-insight-agent.git
cd pinion-insight-agent

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in PINION_PRIVATE_KEY and GEMINI_API_KEY

# Start the dev server
npm run dev
# → http://localhost:3000
```

```bash
# Production build
npm run build && npm start
```

---

## 🧪 How to Test

> **For DoraHacks judges & testers** — everything runs on **Base Sepolia Testnet**, so testing costs you nothing real.

---

### 🦊 Step 1 — Wallet Setup (Optional Visual)

> The agent wallet is **server-side** and controlled by the `PINION_PRIVATE_KEY` env variable — testers don't need to connect their own wallet. But if you want to inspect transactions on-chain:

1. Open **MetaMask** (or any EVM wallet)
2. Add **Base Sepolia** if not present:
   - Network Name: `Base Sepolia Testnet`
   - RPC URL: `https://sepolia.base.org`
   - Chain ID: `84532`
   - Symbol: `ETH`
   - Explorer: `https://sepolia.basescan.org`

---

### 🚰 Step 2 — Get Testnet Funds

The agent wallet needs ETH (gas) and USDC on Base Sepolia. Use these faucets:

| Asset | Faucet | Notes |
|-------|--------|-------|
| **ETH (gas)** | [Alchemy Base Sepolia Faucet](https://basefaucet.com/) | Free, requires login |
| **ETH (gas)** | [Coinbase Base Faucet](https://portal.cdp.coinbase.com/products/faucet) | 0.1 ETH / day |
| **USDC testnet** | [Circle USDC Faucet](https://faucet.circle.com/) | Select **Base Sepolia** + USDC |

> 💡 **Tip**: Each query only costs **$0.01 USDC**. A single faucet drip covers hundreds of test queries.

---

### ▶️ Step 3 — User Flow (End-to-End)

Follow this exact flow to see the full x402 payment lifecycle:

**1️⃣ Open the app**

```
http://localhost:3000
```
You'll see the **dark dashboard** with suggested example queries and a "Transaction Log: 0 total" in the sidebar.

---

**2️⃣ Type a market question**

Click any suggestion card or write your own query, for example:

```
What are the top 3 yield farming strategies on Base L2 right now?
```

Watch the **real-time cost estimator** update in the top-right of the input box (e.g. `$0.02 USDC`).

---

**3️⃣ Click "Pay & Generate"**

The **Payment Gate overlay** activates and animates through 4 steps:

```
✅ Estimating Compute Cost    ← PinionOS calculates skill calls
✅ Signing x402 Payment       ← EIP-3009 authorization on Base Sepolia
✅ Verifying Transaction      ← Facilitator confirms USDC settlement
⏳ Unlocking AI Agent         ← Gemini 3 Flash generates insight
```

> 🔒 **Key moment**: The AI call to Gemini is **only made after the x402 payment is validated** by PinionOS. The server-side API route enforces this — see `src/app/api/insight/route.ts`.

---

**4️⃣ View the AI Insight**

Once payment is confirmed, the response **types out word by word** like a terminal. The header shows:
- ✅ `Payment Verified` badge
- 💰 Cost in USDC
- ⚡ Latency in ms
- 🤖 Model name (`gemini-3-flash-preview`)
- `#` Token count

---

**5️⃣ Check the Transaction Log**

In the **right sidebar**, a new entry appears:

```
✅  What are the top 3 yield farming...
    $0.01 USDC  •  just now  •  [0xabc...] ↗
```

The `↗` icon links directly to **BaseScan** to verify the on-chain settlement.

---

### 🔍 Step 4 — On-Chain Verification

After a successful query, verify the payment happened on-chain:

1. Copy the **tx hash** from the Transaction Log sidebar (click the `↗` link)
2. Open **[Base Sepolia Explorer](https://sepolia.basescan.org)**
3. Search for the transaction hash
4. Confirm:
   - ✅ USDC transfer of `$0.01` from the agent wallet
   - ✅ Recipient is the PinionOS facilitator contract
   - ✅ Block is finalized

> 🔐 **This proves the core claim**: Gemini only responded because the payment was cryptographically validated first. Without a confirmed x402 payment event, the API route returns `{ success: false, errorType: "payment" }` and **no AI call is ever made**.

---

### ⚠️ Step 5 — Test Error States

To see the differentiated error UI:

| Scenario | How to trigger | Expected UI |
|----------|---------------|-------------|
| **Empty query** | Submit blank input | Validation error, no payment |
| **Insufficient funds** | Use wallet with no USDC | Red "Payment Failed" banner |
| **AI rate limit** | Rapid successive queries | Amber "AI Generation Failed" + green "Payment Verified ✓" |

The UI **always shows whether payment succeeded** independently of whether the AI responded — critical for trust in autonomous agent systems.

---

## 🏆 Hackathon Criteria

This project directly satisfies the **Functionality** and **Completeness** criteria:

| Criterion | Evidence |
|-----------|---------|
| ✅ **Functionality** | Full end-to-end flow working: query → x402 payment → Gemini 3 AI → typed response → on-chain log |
| ✅ **Completeness** | Production build (`npm run build`) passes clean; all error states handled; mobile responsive |
| ✅ **PinionOS Integration** | Real `PinionClient` SDK calls; `executePayment()` and `getWalletBalance()` at `src/lib/pinion.ts` |
| ✅ **Creative Use Case** | AI gated behind autonomous micropayments — a novel business model for the agent economy |
| ✅ **Code Quality** | Full TypeScript strict mode, modular architecture, documented with JSDoc |
| ✅ **UX Polish** | Typing animation, payment overlay, wallet dropdown, smooth Framer Motion transitions |

---

## 🔄 AI Fallback Strategy

```
gemini-3-flash-preview  ──(429/503)──▶  gemini-2.0-flash  ──(429/503)──▶  gemini-2.0-flash-lite
        ↑ retry ×2 (2s→4s backoff)              ↑ retry ×2                       ↑ retry ×2
```

Each model attempt has a **30-second hard timeout** server-side. The client has a **60-second abort** via `AbortController`.

---

## 🚀 Deployment

### Vercel (One-click)

```bash
git push origin main
# → Import on vercel.com, add env vars, deploy
```

### Docker

```bash
docker build -t pinion-insight-agent .
docker run -p 3000:3000 \
  -e PINION_PRIVATE_KEY=0x... \
  -e GEMINI_API_KEY=AIza... \
  pinion-insight-agent
```

---

## 🙌 Credits

**Developed by [Ender Designs](https://github.com/El-EnderJ)**

Built on top of:
- [PinionOS](https://github.com/chu2bard/pinion-os) — x402 Micropayment Protocol on Base
- [Google Gemini](https://ai.google.dev/) — Gemini 3 Flash Preview AI
- [Next.js](https://nextjs.org/) — React Framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first Styling
- [Framer Motion](https://www.framer.com/motion/) — Production-grade Animations

---

## 📝 License

MIT — Fork it, ship it, win it.

---

<p align="center">
  <strong>🏆 Built for the <a href="https://dorahacks.io">DoraHacks</a> × <a href="https://github.com/chu2bard/pinion-os">PinionOS</a> Hackathon 2025</strong><br/>
  <em>Autonomous AI • x402 Micropayments • Base Sepolia</em>
</p>


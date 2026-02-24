# 🤖 Pinion Insight Agent

> **The First Autonomous AI Intelligence Platform powered by x402 Micropayments**
>
> An MVP product that redefines how AI services are monetized. Hold multi-turn conversations with an intelligence agent that charges $0.01 USDC per message — on-chain, in real time, on Base Sepolia — with no subscriptions, no accounts, and no intermediaries.

<p align="center">
  <img src="https://img.shields.io/badge/PinionOS-Hackathon%202026-blueviolet?style=for-the-badge&logo=ethereum&logoColor=white" alt="Hackathon" />
  <img src="https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini-3%20Flash%20Preview-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini 3" />
  <img src="https://img.shields.io/badge/PinionOS-x402%20Protocol-06b6d4?style=for-the-badge&logo=ethereum&logoColor=white" alt="PinionOS" />
  <img src="https://img.shields.io/badge/Network-Base%20Sepolia-1652F0?style=for-the-badge&logo=ethereum&logoColor=white" alt="Base Sepolia" />
  <img src="https://img.shields.io/badge/Settlement-USDC%20%240.01-10b981?style=for-the-badge" alt="USDC" />
  <img src="https://img.shields.io/badge/Chat-Multi--Turn%20Agentic-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" alt="Multi-Turn Chat" />
</p>

---

## 📋 Overview

**Pinion Insight Agent** is a full-stack MVP product that proves autonomous AI agents can operate as self-sustaining businesses on-chain. Unlike a simple single-query tool, this is a **persistent multi-turn chat platform** — users start deep research sessions with an intelligence agent and pay only for each message they send, with every payment confirmed on Base Sepolia before a single token is generated.

Each chat message follows this lifecycle:

1. 💰 **Collects payment** — $0.01 USDC x402 micropayment on Base Sepolia
2. 🔒 **Validates on-chain** — the reply is **locked** until PinionOS confirms the USDC transfer
3. 🧠 **Sends full context** — the agent receives the last 6 messages for genuine conversational awareness
4. 🤖 **Calls Gemini 3 Flash** — premium analysis only after cryptographic payment proof
5. ✍️ **Streams the response** — word-by-word typing animation in the chat bubble
6. 📜 **Logs the transaction** — per-message tx hash, gas used, and block number in the On-chain Transaction Log

This validates that **AI chat services can be metered at the message level** using x402:

- ✅ **No subscriptions, no accounts** — pure pay-per-message
- ✅ **Machine-to-machine payments** for fully autonomous agents
- ✅ **Cryptographic access control** — no confirmed payment = no AI response, ever
- ✅ **Persistent context** — conversations are saved locally and the agent maintains thread awareness
- ✅ **Instant Base Sepolia settlement** — fast, cheap, final

---

## 🎯 Features

### 💬 Multi-Turn Agentic Chat

> The core innovation of this MVP. This is not a single-query tool — it is a persistent, context-aware intelligence platform.

| Capability | Detail |
|-----------|--------|
| 🧠 **Context Awareness** | The agent receives the last 6 messages as context, enabling deep, sequential analysis across a session — ask a follow-up and it understands what came before |
| 💾 **Local Persistence** | Conversations are saved in the browser via `localStorage`. Close the tab, come back later, and your entire research thread is intact |
| 💸 **Pay-per-Message** | Every chat bubble sent by the user triggers an independent `$0.01 USDC` x402 transaction confirmed on Base Sepolia — **not a batch, not an estimate, not a simulation** |
| 🏦 **Continuous On-chain Proof** | The On-chain Transaction Log accumulates a tx hash per message, demonstrating the **scalability of x402 for real chat applications** with a live, auditable payment stream |

### 🗂️ Modern Sidebar Interface

> Conversation management at ChatGPT parity — but every session is on-chain.

| Capability | Detail |
|-----------|--------|
| 📋 **Conversation List** | Collapsible sidebar listing all past sessions, auto-titled from the first message, sorted by recency |
| ➕ **New Chat** | Start a fresh research session with one click — previous conversations remain accessible |
| 🗑️ **Session Management** | Delete individual conversations; the sidebar shows message count and total USDC spent per session |
| ✨ **Framer Motion Collapse** | Smooth slide-in/out animation; Toggle button appears when sidebar is closed |

### ⚙️ Core Platform

| Feature | Detail |
|---------|--------|
| 🔐 **Payment-Gated AI** | Content locked behind real x402 micropayment — no confirmed payment = no response, period |
| 🤖 **Gemini 3 Flash Preview** | Google's most advanced Flash model with retry & fallback chain |
| 🎬 **4-Step Payment Overlay** | Animated gate: Estimate → Sign x402 → Verify → Unlock AI |
| ✍️ **Typing Animation** | Word-by-word reveal on every assistant bubble |
| 💼 **Agent Wallet Dropdown** | Real-time USDC/ETH balances across all sessions, BaseScan link |
| 📊 **Per-Message TX Log** | tx hash, gas used, block number, and BaseScan link on each user bubble |
| ⚠️ **Smart Error Handling** | Independent UI states for payment errors vs. AI errors |
| 🔄 **Model Fallback Chain** | Gemini 3 → Gemini 2.0 Flash → Gemini 2.0 Flash Lite |
| ⏱️ **Request Timeouts** | 30s server-side + 120s client-side abort |
| 📱 **Responsive Dark UI** | Mobile-first, Tailwind CSS v4, Framer Motion |

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

> 💡 **Tip**: Each query only costs **$0.01 USDC** per specific amount of tokens. A single faucet drip covers hundreds of test queries.

---

### ▶️ Step 3 — User Flow (End-to-End)

This is not a single query. It is a **research session**. Follow the full flow:

**1️⃣ Open the app**

```
http://localhost:3000
```
You'll see the **three-panel chat interface**: a collapsible sidebar on the left, the main chat area in the center, and the On-chain Transaction Log on the right.

---

**2️⃣ Start a new conversation**

Click **"New Chat"** in the sidebar, or simply type in the input bar. A conversation is created automatically with an auto-generated title from your first message.

Type an opening question, for example:

```
What are the top 3 yield farming strategies on Base right now?
```

---

**3️⃣ Send the message — watch the Payment Gate**

Press **Enter** (or the send button). The **Payment Gate overlay** activates inline:

```
✅ Estimating Compute Cost    ← PinionOS prepares the USDC transfer
✅ Signing USDC Transfer      ← tx broadcast to Base Sepolia
✅ On-chain Confirmation      ← 1-block confirmation received
⏳ Unlocking AI Agent         ← Gemini 3 Flash generates the response
```

> 🔒 **Key moment**: The AI call to Gemini is **only made after the x402 payment is confirmed on-chain**. The server-side route enforces this — see `src/app/api/insight/route.ts`.

---

**4️⃣ Read the response — then go deeper**

The agent's reply **types out word-by-word** in the chat bubble. Each assistant bubble shows the model name and latency. Each user bubble shows the payment badge:

```
💬  [User]       What are the top 3 yield farming strategies on Base?
                 ✅ $0.01 USDC  •  0x3fa2...b1c9 ↗  •  42,891 gas  •  #18,344,201

🤖  [PINION-ALPHA]  gemini-3-flash-preview • 2,341ms
                    ## TL;DR
                    The highest risk-adjusted yields on Base are...
```

Now **send a follow-up** — the agent has the full prior context:

```
Drilling into the first strategy: what's the impermanent loss risk at current volatility?
```

This triggers a **second independent $0.01 USDC payment**, and Gemini receives the previous exchange as context.

---

**5️⃣ Watch the On-chain Transaction Log grow**

The **right-panel Transaction Log** updates per message sent. After a multi-turn session:

```
✅  What are the top 3 yield farming...      $0.01 USDC  •  0x3fa2...b1c9 ↗  •  #18,344,201
✅  Drilling into the first strategy...      $0.01 USDC  •  0x9cd8...44af ↗  •  #18,344,209
✅  What's the TVL trend for this pool...    $0.01 USDC  •  0x12ab...f02e ↗  •  #18,344,217
```

> 📈 **This is x402 at scale**: each row is an independent, immutable, on-chain proof that a specific AI response was purchased. A 10-message research session produces 10 on-chain transactions — demonstrating how the x402 protocol scales naturally to **real conversational AI products** without any off-chain billing infrastructure.

---

**6️⃣ Return to your research**

Close the browser. Reopen it. Your conversations are still in the sidebar — titles, full message history, and all payment metadata — stored in `localStorage`. Pick up where you left off and every new message continues paying on-chain.

---

### 🔍 Step 4 — On-Chain Verification

After a multi-turn session, every message has its own tx hash. Verify any of them:

1. Click the **`↗` link** on any user bubble (or in the Transaction Log panel)
2. Open **[Base Sepolia Explorer](https://sepolia.basescan.org)**
3. Search for the transaction hash
4. Confirm:
   - ✅ USDC transfer of `$0.01` from the agent wallet
   - ✅ Recipient is the treasury wallet (`0x0ECA9442fFd1De45795623b63EfB4b2a89684Daa`)
   - ✅ Block is finalized

> 🔐 **This proves the core claim**: Gemini only responded because the payment was cryptographically validated first. Without a confirmed x402 payment event, the API route returns `{ success: false, errorType: "payment" }` and **no AI call is ever made**.
>
> 🔗 **Proof of scale**: A multi-turn research session leaves behind a chain of USDC microtransactions — one per message — each with a unique block number and tx hash. This demonstrates that x402 is not just viable for single API calls, but **production-ready for continuous, real-time AI metering**.

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

## � Project Treasury

Every `$0.01 USDC` micropayment is routed to the Pinion Insight Agent **Treasury Wallet** on Base Sepolia — the agent literally earns its own income on-chain.

| Field | Value |
|-------|-------|
| **Address** | `0x0ECA9442fFd1De45795623b63EfB4b2a89684Daa` |
| **Network** | Base Sepolia Testnet (chainId 84532) |
| **Asset** | USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`) |
| **Amount per query** | $0.01 USDC |

**Live on-chain proof (BaseScan):**

> 🔗 [_[Link to BaseScan — USDC incoming transfers to the Treasury Wallet]_](https://sepolia.basescan.org/tx/0x95439f8ea24fb347a118b5e9d93dbadf3ee6b0e72b786b8a9ef8b924f4e142cf)

---

## �🏆 Hackathon Criteria

This project directly satisfies the **Functionality** and **Completeness** criteria:

| Criterion | Evidence |
|-----------|---------|
| ✅ **Functionality** | Complete multi-turn chat platform: message → $0.01 USDC x402 payment → context-aware Gemini 3 response → typed chat bubble → per-message on-chain log |
| ✅ **Completeness** | Production build (`npm run build`) clean; all error states handled; localStorage persistence; mobile responsive |
| ✅ **PinionOS Integration** | Real ethers.js USDC `transfer()` on Base Sepolia **per message**; `processPayment()` + `verifyTransaction()` at `src/lib/pinion.ts` |
| ✅ **Creative Use Case** | The first x402-metered AI chat platform — conversational AI where **each message is an on-chain transaction**, agent builds its own treasury turn by turn |
| ✅ **Protocol Scalability** | A 10-message session produces 10 independent tx hashes — live proof that x402 scales to real chat products with no off-chain billing layer |
| ✅ **Code Quality** | Full TypeScript strict mode, modular architecture (`useConversations`, `ChatSidebar`, `ChatView`), documented with JSDoc |
| ✅ **UX Polish** | ChatGPT-style sidebar, per-bubble payment badges with BaseScan links, Framer Motion collapse, typing animation |

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


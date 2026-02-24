<p align="center">
  <img src="https://img.shields.io/badge/PinionOS-x402%20Payments-06b6d4?style=for-the-badge&logo=ethereum" alt="PinionOS" />
  <img src="https://img.shields.io/badge/AI-Gemini%20Flash-8b5cf6?style=for-the-badge&logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/Network-Base%20L2-3b82f6?style=for-the-badge" alt="Base" />
  <img src="https://img.shields.io/badge/Settlement-USDC-10b981?style=for-the-badge" alt="USDC" />
</p>

# 🧠 Pinion Insight Agent

**Pay-per-AI-Agent Market Intelligence Dashboard**

> Autonomous AI agent that delivers premium market insights via x402 micropayments on Base L2. Ask a question → pay $0.01 USDC → receive expert analysis from Gemini Flash. No subscriptions, no accounts — just pay-per-use intelligence.

---

## ✨ What It Does

1. **User asks a complex market question** — crypto analysis, DeFi strategy, token research, on-chain forensics
2. **The agent calculates computation cost** — displays a real-time cost estimate in USDC
3. **PinionOS processes an x402 micropayment** — autonomous $0.01 USDC transaction on Base L2, no wallet connection needed
4. **AI generates premium insight** — Gemini Flash delivers structured, data-driven analysis only after payment confirms
5. **Transaction is logged** — full history with costs, latency, and success rates

## 🏗 Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Next.js App   │────▶│   API Route      │────▶│  PinionOS SDK  │
│   (React UI)    │     │   /api/insight    │     │  x402 Payment  │
└─────────────────┘     └──────────────────┘     └────────────────┘
                               │                         │
                               │                         ▼
                               │                 ┌────────────────┐
                               │                 │  Base L2 USDC  │
                               │                 │  Settlement    │
                               ▼                 └────────────────┘
                        ┌──────────────────┐
                        │  Gemini Flash    │
                        │  AI Generation   │
                        └──────────────────┘
```

## 📂 Project Structure

```
pinion-insight-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── insight/route.ts    # Main endpoint: payment + AI
│   │   │   └── balance/route.ts    # Wallet balance query
│   │   ├── layout.tsx              # Root layout (dark mode)
│   │   ├── page.tsx                # Main dashboard page
│   │   └── globals.css             # Design system + animations
│   ├── components/
│   │   ├── Header.tsx              # Top nav with wallet status
│   │   ├── QueryInput.tsx          # Question input + cost estimate
│   │   ├── PaymentGate.tsx         # Payment processing overlay
│   │   ├── InsightDisplay.tsx      # AI response renderer
│   │   ├── TransactionHistory.tsx  # Transaction log sidebar
│   │   ├── StatsBar.tsx            # Session metrics
│   │   ├── HowItWorks.tsx          # Onboarding guide
│   │   └── Footer.tsx              # Attribution footer
│   ├── hooks/
│   │   ├── useGemini.ts            # AI insight request hook
│   │   └── usePinion.ts            # Wallet state hook
│   ├── lib/
│   │   ├── pinion.ts               # PinionOS SDK wrapper (server)
│   │   ├── gemini.ts               # Gemini Flash wrapper (server)
│   │   └── constants.ts            # App-wide constants
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── .env.example                    # Environment variable template
├── .env.local                      # Your local env (git-ignored)
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **PinionOS wallet** with ETH (gas) + USDC on Base L2
- **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd pinion-insight-agent

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your keys:
#   PINION_PRIVATE_KEY=0x...
#   GEMINI_API_KEY=...

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PINION_PRIVATE_KEY` | ✅ | Hex private key (0x...) with USDC on Base |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Optional | Client-accessible Gemini key |
| `PINION_API_URL` | Optional | Override PinionOS API endpoint |
| `PINION_NETWORK` | Optional | `base` (default) or `base-sepolia` |

## 💡 Key Features

- **🔐 Payment-Gated AI** — Content is locked behind a real x402 micropayment. No payment = no insight.
- **🤖 Autonomous Agent Wallet** — The agent controls its own wallet via PinionOS. Users don't need MetaMask or any wallet.
- **⚡ Sub-second Payments** — x402 micropayments on Base L2 settle almost instantly at $0.01 per query.
- **🧠 Gemini Flash Intelligence** — Premium market analysis powered by Google's latest AI model.
- **📊 Real-time Dashboard** — Live stats, transaction history, cost tracking, and latency metrics.
- **🎨 Professional Dark UI** — Tailwind-powered design with glow effects, animations, and responsive layout.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + Framer Motion |
| Payment | PinionOS SDK (x402 protocol) |
| Settlement | USDC on Base L2 |
| AI Engine | Google Gemini 2.0 Flash |
| Icons | Lucide React |

## 🏆 Hackathon Criteria

| Criteria | How We Address It |
|----------|------------------|
| **Creativity** | Novel "pay-per-insight" model where AI is gated behind autonomous micropayments |
| **Functionality** | Full end-to-end flow: input → payment → AI → display, with real PinionOS integration |
| **Completeness** | Production-ready UI, error handling, transaction history, responsive design |
| **Code Quality** | TypeScript, modular architecture, documented functions, clean separation of concerns |

## 📜 License

MIT — Built for the [PinionOS Hackathon](https://github.com/chu2bard/pinion-os)

---

<p align="center">
  <strong>Built with ❤️ using <a href="https://github.com/chu2bard/pinion-os">PinionOS</a></strong>
  <br />
  <em>Autonomous AI • x402 Micropayments • Base L2</em>
</p>

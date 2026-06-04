# RemesaAI

**Voice-first stablecoin remittance US → Mexico.**
Say one sentence in Spanish, send USDC on Base, recipient picks up cash at any OXXO.

> Submission for **Ethereum México 2026 Hackathon** — Tracks: Stablecoins, Payments, AI × Blockchain.

**[Live demo →](https://remesa-ai.vercel.app)** · [GitHub](https://github.com/abaresks24/remesa-ai)

---

## The problem

Mexican workers in the US send **$63B/year** home. Western Union charges **8–15 USD per transfer**, takes hours, and requires both sides to walk into a branch with ID.

Stablecoins on L2s can move the same money in seconds for **fractions of a cent**. But nobody's grandma is opening MetaMask.

## What RemesaAI does

1. Worker opens the app on their phone and **says** the request in Spanish — _"envía 200 dólares a mi mamá en Puebla"_.
2. A Claude agent parses the voice into a structured intent and shows a quote: amount, fees, ETA.
3. One tap signs a real USDC transfer on **Base L2**.
4. Recipient receives a link + **8-character OXXO pickup code**. Cash, in any OXXO, in 2 minutes.

No bank account. No KYC for the recipient. No 30-page MetaMask onboarding.

## Architecture

```
┌────────────────┐    voice    ┌────────────────────┐
│ Mobile browser │  ─────────► │ /api/agent         │
│ (sender)       │             │ mistral-large-latest│  ── structured intent
└────────────────┘             └────────────────────┘
        │
        │ sign (embedded burner wallet, viem)
        ▼
┌────────────────────────────┐
│ USDC contract (Base Sepolia)│  ── real onchain tx
└────────────────────────────┘
        │
        │ pickup code + amount in shareable URL
        ▼
┌──────────────────┐
│ /recibir/[code]  │  ── recipient view (OXXO code, map, instructions)
└──────────────────┘
```

### Stack

- **Next.js 16** (App Router, Turbopack, React 19.2) — frontend + API routes
- **AI SDK** + `@ai-sdk/mistral` (`mistral-large-latest`) — voice intent parsing with `generateObject` + Zod schema
- **viem 2** — embedded burner wallet, USDC ERC-20 transfer encoding, Base Sepolia RPC
- **Web Speech API** — `es-MX` recognition (no third-party speech provider for the MVP)
- **Tailwind CSS v4** + custom primitives — mobile-first UI
- **Vercel** — hosting

### What's onchain (real)

- USDC on Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- ERC-20 `transfer` signed client-side by the user's embedded wallet
- Tx hash linked to Basescan from the success screen and the recipient view

### What's mocked (for the MVP)

- **Off-ramp to MXN cash**: in production this is Bitso / Stori / Felix's OXXO settlement rail. For the demo we generate the pickup code and recipient UX; the cash leg is a stub.
- **FX rate**: static USD→MXN reference (`src/lib/fx.ts`). In production we'd quote from Bitso every render.
- **Embedded wallet**: a burner key in `localStorage` for fast demoing. In production this is a passkey-backed smart wallet (Privy, Coinbase Smart Wallet) with gasless UX via paymaster.

## Why this wins the LATAM track

- **Real problem, massive market**: $63B/year remittance corridor, 95%+ of recipients are unbanked or under-banked, OXXO is the de-facto cash rail.
- **Voice-first**: bypasses literacy, language, and crypto-onboarding barriers all at once.
- **Real L2 settlement**: every transfer is a real Base USDC tx — auditable, sub-cent fees, ~2-second finality.
- **Bilingual**: ES/EN parser, ES-first UI.

## Run locally

```bash
git clone <repo>
cd remesa-ai
npm install
cp .env.example .env.local
# optional: set MISTRAL_API_KEY for LLM-powered parsing
#  (without it, /api/agent falls back to a deterministic regex parser that
#   handles the typical phrasings used in the demo)
npm run dev
```

Open `http://localhost:3000`, tap the mic, and speak. Your browser will create a burner wallet on first load — fund it with:

- [Circle USDC faucet](https://faucet.circle.com/) (select Base Sepolia)
- [Coinbase ETH faucet](https://portal.cdp.coinbase.com/products/faucet) (for gas)

Then send. Settlement is a real Base Sepolia tx, verifiable on [Basescan](https://sepolia.basescan.org).

## Judges: how to evaluate fast

1. Open the deployed URL on your phone.
2. **Don't have testnet funds?** Click _"Para jueces: ver la vista del destinatario →"_ at the bottom of the landing to jump straight to a pre-built recipient view (OXXO code, instructions, the works).
3. Try the voice flow: tap the mic, say _"envía 200 dólares a mi mamá en Puebla"_ — quote renders in under a second.
4. To complete a real onchain tx, fund the burner wallet using the in-app faucet links and tap "Confirmar y enviar". You'll get a Basescan link back.

## Roadmap (post-hackathon)

- **Production off-ramp**: integrate Bitso B2B API for SPEI/OXXO settlement.
- **Smart wallets**: Coinbase Smart Wallet / Privy + Base Paymaster for gasless UX.
- **KYC layer**: Persona or Veriff for sender side; recipient stays anonymous up to legal cash-pickup thresholds.
- **WhatsApp interface**: voice-note → remittance, no app install. WhatsApp Business API.
- **Multi-rail**: extend to Centroamérica (Western Union has the same lock-in there).

## License

MIT. Built in 36 hours for Ethereum México 2026.

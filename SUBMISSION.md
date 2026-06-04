# DoraHacks Submission Pack — RemesaAI

Everything you need to copy-paste / upload for the Ethereum México 2026 submission.

---

## 1. Project basics

| Field             | Value                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| **Project name**  | RemesaAI                                                                                           |
| **One-liner**     | Voice-first stablecoin remittance US → Mexico. Say it, sign it, cash at OXXO.                      |
| **Tracks**        | Stablecoins · Payments · AI × Blockchain                                                           |
| **Live demo**     | https://remesa-ai.vercel.app                                                                       |
| **GitHub**        | https://github.com/abaresks24/remesa-ai                                                            |
| **Demo video**    | _(paste Loom URL here once recorded — script below)_                                               |
| **Network**       | Base Sepolia (L2). USDC contract `0x036CbD53842c5426634e7929541eC2318f3dCF7e`                       |
| **Team size**     | 1                                                                                                  |
| **Built during**  | May 4 – June 5, 2026 sprint (this codebase: ~36h)                                                  |

---

## 2. Long description (paste into DoraHacks "Description")

```
# RemesaAI

Voice-first stablecoin remittance from the US to Mexico. The first
remittance app where the user doesn't tap, type, or even tap-tap-type
an amount — they just say it.

## The problem we attack

Mexican workers in the United States send $63B home every year. The
incumbents — Western Union, MoneyGram, Ria — charge 8-15 USD per
transfer, take hours-to-days, and require both sides to walk into a
physical branch with ID. For a $200 monthly remittance, the average
LATAM family loses ~$500/year to fees alone.

Stablecoins on L2s have already solved the cost and speed problem
technically. USDC on Base moves in 2 seconds for fractions of a cent.
But the UX gap — wallets, seed phrases, gas tokens, KYC, browser
extensions — keeps the actual remittance senders far away from the
solution.

## What RemesaAI does

1. The sender opens the app on their phone and SAYS the request in
   natural Spanish (or English) — for example:
       "envía 200 dólares a mi mamá en Puebla"

2. A Mistral large-model agent parses the voice into a structured
   intent with confidence + missing-field hints. The app shows a quote
   in 1 second: amount, fees (0.15% vs 8% at WU), live FX, ETA.

3. One tap signs a real USDC ERC-20 transfer on Base L2 from an
   embedded burner wallet (a stand-in for the production smart-wallet
   layer).

4. The recipient receives a shareable link with an 8-character OXXO
   pickup code. They walk into any OXXO in their city, show the code
   plus their INE, and walk out with cash in MXN.

No bank account on either side. No KYC for the recipient. No 30-page
MetaMask onboarding for grandma.

## Why this wins the LATAM track

- Real problem, massive market: $63B/year corridor, 95%+ of recipients
  unbanked or under-banked, OXXO is the de-facto cash rail across all
  21,000 Mexican municipalities.
- Voice-first UX that bypasses literacy, language, and crypto-
  onboarding barriers in one stroke. Speech recognition runs locally in
  the browser (es-MX), the intent parser runs on a frontier LLM.
- Every transfer is a real Base USDC tx — auditable on Basescan,
  sub-cent fees, ~2s finality. The sender can show their family the
  onchain proof when the cash lands.
- Bilingual ES/EN agent. The same model handles "envía 50 pa' mi
  hermana" and "send 100 to my mom in CDMX".

## Stack

- Next.js 16 (App Router, Turbopack, React 19.2) on Vercel
- Mistral large-latest via @ai-sdk/mistral with generateObject + Zod
  schema for structured intent extraction
- viem 2 for embedded wallet, USDC encoding, Base Sepolia RPC
- Web Speech API for es-MX voice capture (no third-party speech vendor)
- Tailwind CSS v4, mobile-first

## What's real onchain

Every "Confirmar y enviar" produces a real Base Sepolia USDC transfer
that you can verify on Basescan. The pickup code, FX rate, and
recipient UX is generated client-side from that tx state. In production
the cash leg is fulfilled by a regulated MX off-ramp partner (Bitso,
Stori, or Felix already do this for licensed remittance flows).

## Demo for judges

Visit https://remesa-ai.vercel.app on your phone:
- Tap the mic and say "envía 200 dólares a mi mamá en Puebla".
  The quote renders in under a second.
- Don't have testnet funds? At the bottom of the landing there is a
  "Para jueces: ver la vista del destinatario →" link that jumps to a
  fully-populated recipient OXXO view so you can see the whole flow
  without funding a wallet.
- To complete a real onchain transfer, fund the in-app burner wallet
  via the embedded Circle USDC + Coinbase ETH faucet links and tap
  "Confirmar y enviar". Basescan link comes back.

## What's next

- Production off-ramp partner integration (Bitso B2B API for SPEI/OXXO
  settlement)
- Smart wallet upgrade: Coinbase Smart Wallet + Base Paymaster for
  gasless UX
- WhatsApp interface: voice note → remittance, no app install at all
- Multi-corridor: extend to Centroamérica where Western Union has the
  same lock-in
- KYC: Persona/Veriff for the sender side under MX FinTech Law
```

---

## 3. Demo video script (~2 min, bilingual ES/EN)

Record on Loom (or QuickTime + upload). Screen-record your phone or
the desktop browser; voice-over in your normal voice.

**Setup before recording:**
- Open https://remesa-ai.vercel.app on a phone or in Chrome (desktop).
- Make sure Mistral is set in Vercel env (so the agent path runs).
- Have a second tab open at the `/recibir/DEMO2024?r=…` URL for the
  recipient view reveal at the end.
- Pre-fund the burner wallet (the in-app banner gives the address) with
  Circle USDC + Coinbase ETH faucets so the real tx works.

---

**[00:00–00:10 — Hook (English)]**

> "Mexican workers in the US send sixty-three billion dollars home
> every year. Western Union takes eight to fifteen dollars off the top
> of every transfer. We think grandma deserves better."

**[00:10–00:25 — Intro the app (Spanish + English)]**

> "RemesaAI. Solo dilo. Tu familia recibe efectivo en cualquier OXXO.
> The fastest way to send USDC from the US to Mexico — without ever
> opening a wallet."

(Show landing on phone. Tap the mic.)

**[00:25–00:55 — Voice → quote (Spanish)]**

(Speak into the phone, naturally:)
> "Envía doscientos dólares a mi mamá en Puebla."

(Quote appears. Point at the screen.)
> "Two hundred dollars in. Three thousand four hundred and seventy-three
> pesos out. Total fees: fifty-five cents. Western Union would have
> taken sixteen dollars."

**[00:55–01:25 — Sign + onchain proof (English)]**

(Tap "Confirmar y enviar". Loading spinner. Success screen.)
> "Signed by an embedded smart wallet. Settled on Base in two seconds.
> Here is the live Basescan tx — you can verify the USDC transfer right
> now."

(Click the Basescan link to show the real onchain tx.)

**[01:25–01:50 — Recipient side (Spanish + English)]**

(Click the share link / open the second tab at the recipient view.)
> "And here's what mom sees. Three thousand four hundred pesos. An
> OXXO pickup code — eight characters. She walks into any OXXO in
> Puebla, shows the code and her ID, walks out with cash."

(Pan over the OXXO code, the steps, the Basescan footer.)

**[01:50–02:00 — Close (English)]**

> "Sixty-three-billion-dollar market. Voice-first UX. Real Base L2
> settlement. Sub-cent fees. Built in thirty-six hours for Ethereum
> México. RemesaAI."

(End on logo / URL.)

---

## 4. Pre-submission checklist

Run through this before you click submit on DoraHacks.

- [ ] **Mistral key set in Vercel** for all 3 envs (production / preview /
      development). `vercel env ls` should show MISTRAL_API_KEY x 3.
- [ ] **Redeploy after env change**: `vercel --prod`. Without redeploy
      the env doesn't take effect.
- [ ] **Test on prod**: open https://remesa-ai.vercel.app on a phone in
      incognito. Tap the mic, say a phrase, verify the quote renders.
- [ ] **Test the agent endpoint** with `curl`:
      `curl -X POST https://remesa-ai.vercel.app/api/agent -H 'content-type: application/json' -d '{"text":"envía 200 dólares a mi mamá en Puebla"}'`
      → should return `"source":"mistral:..."` (not regex-fallback).
- [ ] **Test the demo recipient link** (bottom of landing): clicking
      should load the recipient view with the OXXO code visible.
- [ ] **Real onchain tx**: fund the burner wallet shown in the top-right
      badge with USDC + ETH on Base Sepolia, send a real $5 transfer,
      verify the Basescan link works.
- [ ] **Loom video** uploaded, public, link added to DoraHacks form +
      to README badge.
- [ ] **GitHub repo public**: open
      https://github.com/abaresks24/remesa-ai in an incognito window
      to confirm.
- [ ] **DoraHacks form**: paste long description (section 2 above),
      add live URL, GitHub URL, video URL, tracks (Stablecoins, AI ×
      Blockchain, Payments), and submit before **2026-06-05 deadline**.

---

## 5. Useful URLs at a glance

| What                       | URL                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| Live app                   | https://remesa-ai.vercel.app                                     |
| Recipient demo (no funds)  | https://remesa-ai.vercel.app + "Para jueces" link at bottom      |
| GitHub repo                | https://github.com/abaresks24/remesa-ai                          |
| USDC on Base Sepolia       | https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| Circle USDC faucet         | https://faucet.circle.com/                                       |
| Coinbase Base ETH faucet   | https://portal.cdp.coinbase.com/products/faucet                  |
| DoraHacks submission page  | _(paste the ETH Mexico DoraHacks BUIDL submission URL here)_     |

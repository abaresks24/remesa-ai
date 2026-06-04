"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import type { Address, WalletClient } from "viem";
import { VoiceInput } from "./VoiceInput";
import { QuoteCard } from "./QuoteCard";
import { SuccessView } from "./SuccessView";
import { WalletBadge } from "./WalletBadge";
import { Logo } from "./Logo";
import {
  getEthBalance,
  getUsdcBalance,
  loadOrCreateWallet,
  sendUsdc,
} from "@/lib/wallet";
import { quote as buildQuote, fmtUsd } from "@/lib/fx";
import { newPickupCode, newRemittanceId } from "@/lib/oxxo";
import { saveRemittance } from "@/lib/store";
import { encodeRecord } from "@/lib/codec";
import type { Intent, RemittanceRecord } from "@/lib/types";

// Demo recipient pool — in real RemesaAI these are addresses linked to OXXO
// off-ramp accounts held by Bitso / Stori / similar custodian.
const DEMO_RECIPIENT: Address = "0x000000000000000000000000000000000000dEaD";

type Step = "speak" | "review" | "signing" | "success";

export function SendFlow() {
  const [wallet, setWallet] = useState<{
    address: Address;
    client: WalletClient;
  } | null>(null);
  const [usdc, setUsdc] = useState<number | undefined>();
  const [eth, setEth] = useState<number | undefined>();
  const [step, setStep] = useState<Step>("speak");
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<RemittanceRecord | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const { address, client } = loadOrCreateWallet();
    setWallet({ address, client });
    setOrigin(window.location.origin);
    void refreshBalances(address);
  }, []);

  const refreshBalances = async (address: Address) => {
    try {
      const [u, e] = await Promise.all([
        getUsdcBalance(address),
        getEthBalance(address),
      ]);
      setUsdc(u);
      setEth(e);
    } catch {
      // network may flake on testnet — keep prior values
    }
  };

  const handleText = useCallback(async (raw: string) => {
    setText(raw);
    setParsing(true);
    setError(null);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: raw }),
      });
      if (!res.ok) throw new Error("agent error");
      const data = (await res.json()) as { intent: Intent };
      setIntent(data.intent);
      if (data.intent.confidence !== "low" && data.intent.amountUsd > 0) {
        setStep("review");
      }
    } catch (e) {
      setError("No pude entender. Intenta de nuevo.");
      console.error(e);
    } finally {
      setParsing(false);
    }
  }, []);

  const quote = useMemo(() => {
    if (!intent || !intent.amountUsd) return null;
    return buildQuote(intent.amountUsd);
  }, [intent]);

  const onSign = async () => {
    if (!wallet || !intent || !quote) return;
    setStep("signing");
    setError(null);
    try {
      const txHash = await sendUsdc(wallet.client, DEMO_RECIPIENT, intent.amountUsd);
      const rec: RemittanceRecord = {
        id: newRemittanceId(),
        pickupCode: newPickupCode(),
        intent,
        quote,
        txHash,
        senderAddress: wallet.address,
        status: "settled",
        createdAt: Date.now(),
      };
      saveRemittance(rec);
      setRecord(rec);
      setStep("success");
      void refreshBalances(wallet.address);
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "tx failed";
      // Common testnet failure: not enough funds
      if (/insufficient|exceeds balance|gas/i.test(msg)) {
        setError(
          "Tu wallet de prueba necesita USDC + ETH en Base Sepolia. Usa el faucet de Circle (USDC) y el faucet de Coinbase (ETH).",
        );
      } else {
        setError(msg);
      }
      setStep("review");
    }
  };

  const reset = () => {
    setText("");
    setIntent(null);
    setRecord(null);
    setStep("speak");
    setError(null);
    if (wallet) void refreshBalances(wallet.address);
  };

  const recipientUrl =
    record && origin
      ? `${origin}/recibir/${record.pickupCode}?r=${encodeRecord(record)}`
      : "";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-16 pt-10">
      <div className="flex items-center justify-between">
        <Logo />
        <WalletBadge
          address={wallet?.address}
          usdcBalance={usdc}
          ethBalance={eth}
        />
      </div>

      {step === "speak" && (
        <div className="flex flex-col gap-6 pt-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white">
              Manda dinero a México
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
                en 2 minutos
              </span>
            </h1>
            <p className="text-sm text-zinc-400">
              Solo dilo. Tu mamá retira en cualquier OXXO.
            </p>
          </div>

          <VoiceInput onResult={handleText} disabled={parsing} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) void handleText(text.trim());
            }}
            className="flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Ej: "envía 200 dólares a mi mamá en Puebla"'
              disabled={parsing}
              className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={parsing || !text.trim()}
              className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-black disabled:opacity-40"
            >
              {parsing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          {intent && intent.confidence === "low" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              No estoy seguro de entender. Necesito: {intent.missing?.join(", ")}.
              ¿Puedes ser más específico?
            </div>
          )}

          <FooterHints />
        </div>
      )}

      {step === "review" && intent && quote && (
        <div className="flex flex-col gap-5">
          <button
            onClick={reset}
            className="self-start text-xs text-zinc-500 hover:text-zinc-300"
          >
            ← Cambiar
          </button>
          <QuoteCard intent={intent} quote={quote} />
          {error && <ErrorBanner>{error}</ErrorBanner>}
          {usdc !== undefined && usdc < intent.amountUsd && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <div className="mb-1 font-medium">Wallet de prueba sin fondos</div>
              <div>
                Necesitas {fmtUsd(intent.amountUsd)} USDC + un poco de ETH en{" "}
                <span className="font-mono">Base Sepolia</span>.
                <br />
                <a
                  href="https://faucet.circle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Faucet USDC →
                </a>{" "}
                ·{" "}
                <a
                  href="https://portal.cdp.coinbase.com/products/faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Faucet ETH →
                </a>
                <br />
                Dirección:{" "}
                <span className="font-mono text-amber-300">{wallet?.address}</span>
              </div>
            </div>
          )}
          <button
            onClick={onSign}
            disabled={!wallet}
            className="w-full rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-4 text-base font-semibold text-black shadow-[0_8px_30px_-8px_rgba(16,185,129,0.6)] transition hover:brightness-110 disabled:opacity-40"
          >
            Confirmar y enviar
          </button>
          <p className="text-center text-[10px] text-zinc-500">
            Firmas onchain en Base Sepolia. Settled in ~2 segundos.
          </p>
        </div>
      )}

      {step === "signing" && (
        <div className="flex flex-col items-center gap-4 py-10">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          <div className="text-center text-sm text-zinc-300">
            Enviando USDC en Base…
            <br />
            <span className="text-xs text-zinc-500">
              Settlement en ~2 segundos
            </span>
          </div>
        </div>
      )}

      {step === "success" && record && (
        <SuccessView record={record} recipientUrl={recipientUrl} onNew={reset} />
      )}
    </div>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function FooterHints() {
  const examples = [
    "envía 200 dólares a mi mamá en Puebla",
    "manda 50 a mi hermano Carlos en CDMX",
    "send 100 to Lupita in Guadalajara",
  ];
  return (
    <div className="space-y-3 text-center text-[11px] text-zinc-500">
      <div className="space-y-1">
        <div className="uppercase tracking-widest">Prueba decir</div>
        {examples.map((e) => (
          <div key={e} className="italic">
            &quot;{e}&quot;
          </div>
        ))}
      </div>
      <a
        href="/recibir/DEMO2024?r=eyJpZCI6ImRlbW8iLCJwaWNrdXBDb2RlIjoiRDNNMlIzTUEiLCJpbnRlbnQiOnsiYW1vdW50VXNkIjoyMDAsInJlY2lwaWVudE5hbWUiOiJNaSBNYW3DoSIsInJlY2lwaWVudENpdHkiOiJQdWVibGEiLCJyZWNpcGllbnRDb3VudHJ5IjoiTVgiLCJjb25maWRlbmNlIjoiaGlnaCJ9LCJxdW90ZSI6eyJhbW91bnRVc2QiOjIwMCwiYW1vdW50TXhuIjozNDczLjEzLCJmeFJhdGUiOjE3LjQ1LCJwcm90b2NvbEZlZVVzZCI6MC41LCJuZXR3b3JrRmVlVXNkIjowLjA1LCJ0b3RhbENvc3RVc2QiOjAuNTUsImV0YVNlY29uZHMiOjEyMH0sInR4SGFzaCI6IjB4MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmMTIzNDU2Nzg5MGFiY2RlZiIsInNlbmRlckFkZHJlc3MiOiIweGFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJzdGF0dXMiOiJzZXR0bGVkIiwiY3JlYXRlZEF0IjoxNzgwNTc3MTE2ODU0fQ"
        className="inline-block underline decoration-zinc-700 underline-offset-4 hover:text-emerald-300"
      >
        Para jueces: ver la vista del destinatario →
      </a>
    </div>
  );
}

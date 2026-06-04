"use client";

import { CheckCircle2, Copy, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";
import { fmtMxn } from "@/lib/fx";
import { explorerTxUrl } from "@/lib/chain";
import type { RemittanceRecord } from "@/lib/types";

type Props = {
  record: RemittanceRecord;
  recipientUrl: string;
  onNew: () => void;
};

export function SuccessView({ record, recipientUrl, onNew }: Props) {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  const copy = async (text: string, kind: "link" | "code") => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/10">
          <CheckCircle2 className="h-9 w-9 text-emerald-400" />
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-white">¡Enviado!</div>
          <div className="text-sm text-zinc-400">
            {fmtMxn(record.quote.amountMxn)} en camino a {record.intent.recipientName}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm">
        <div className="mb-3 text-xs uppercase tracking-widest text-emerald-400">
          Comparte con {record.intent.recipientName}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 truncate rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-zinc-300">
            {recipientUrl}
          </div>
          <button
            onClick={() => copy(recipientUrl, "link")}
            className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          >
            {copied === "link" ? "✓" : <Copy className="h-4 w-4" />}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={() =>
                navigator
                  .share({
                    title: "Tu remesa de RemesaAI",
                    text: `Te envié dinero. Código OXXO: ${record.pickupCode}`,
                    url: recipientUrl,
                  })
                  .catch(() => {})
              }
              className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm">
        <Row label="Código de retiro OXXO">
          <button
            onClick={() => copy(record.pickupCode, "code")}
            className="font-mono text-base font-semibold tracking-widest text-emerald-300"
          >
            {record.pickupCode} {copied === "code" && "✓"}
          </button>
        </Row>
        <Row label="Estado">
          <span className="text-emerald-300">Settled onchain</span>
        </Row>
        {record.txHash && (
          <Row label="Transacción">
            <a
              href={explorerTxUrl(record.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-emerald-300 hover:underline"
            >
              {record.txHash.slice(0, 10)}…{record.txHash.slice(-6)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Row>
        )}
      </div>

      <button
        onClick={onNew}
        className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-200 hover:bg-white/10"
      >
        Enviar otra remesa
      </button>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-zinc-400">
      <span>{label}</span>
      <span>{children}</span>
    </div>
  );
}

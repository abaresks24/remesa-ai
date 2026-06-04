"use client";

import { ArrowRight, Clock, Zap } from "lucide-react";
import type { Intent, Quote } from "@/lib/types";
import { fmtMxn, fmtUsd } from "@/lib/fx";

type Props = {
  intent: Intent;
  quote: Quote;
};

export function QuoteCard({ intent, quote }: Props) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-emerald-400">
            Tú envías
          </div>
          <div className="mt-1 text-3xl font-semibold text-white">
            {fmtUsd(quote.amountUsd)}
          </div>
        </div>
        <ArrowRight className="h-6 w-6 text-zinc-500" />
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-emerald-400">
            {intent.recipientName} recibe
          </div>
          <div className="mt-1 text-3xl font-semibold text-white">
            {fmtMxn(quote.amountMxn)}
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl bg-black/30 p-4 text-sm">
        <Row label="Tipo de cambio" value={`1 USD = ${quote.fxRate.toFixed(2)} MXN`} />
        <Row label="Comisión Remesa" value={fmtUsd(quote.protocolFeeUsd)} />
        <Row label="Red Base (gas)" value={fmtUsd(quote.networkFeeUsd)} />
        <div className="my-1 h-px bg-white/10" />
        <Row
          label={<span className="font-medium text-white">Costo total</span>}
          value={
            <span className="font-medium text-white">
              {fmtUsd(quote.totalCostUsd)}
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <Pill icon={<Clock className="h-3 w-3" />} label={`Entrega en ${Math.round(quote.etaSeconds / 60)} min`} />
        <Pill icon={<Zap className="h-3 w-3" />} label="USDC · Base L2" />
      </div>

      {intent.recipientCity && (
        <div className="text-center text-xs text-zinc-400">
          Retiro en OXXO · {intent.recipientCity}, MX
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-zinc-400">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-zinc-200">
      {icon}
      {label}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Phone, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { fmtMxn } from "@/lib/fx";
import { explorerTxUrl } from "@/lib/chain";
import { loadRemittance } from "@/lib/store";
import { decodeRecord } from "@/lib/codec";
import type { RemittanceRecord } from "@/lib/types";

export function RecipientView({
  code,
  encoded,
}: {
  code: string;
  encoded?: string;
}) {
  const [rec, setRec] = useState<RemittanceRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fromUrl = encoded ? decodeRecord(encoded) : null;
    setRec(fromUrl ?? loadRemittance(code));
    setLoaded(true);
  }, [code, encoded]);

  if (!loaded) return null;

  if (!rec) {
    return (
      <div className="mx-auto max-w-md px-5 pt-20 text-center text-zinc-400">
        <p>No encontramos esta remesa en este dispositivo.</p>
        <p className="mt-2 text-xs text-zinc-500">
          En producción, este link mostraría la remesa desde nuestro backend (cifrado).
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-16 pt-10">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="text-[10px] uppercase tracking-widest text-emerald-400">
          Para ti
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/10">
          <Sparkles className="h-9 w-9 text-emerald-400" />
        </div>
        <div className="text-center">
          <div className="text-sm text-zinc-400">Recibiste de tu familia</div>
          <div className="mt-1 text-4xl font-semibold text-white">
            {fmtMxn(rec.quote.amountMxn)}
          </div>
        </div>
      </div>

      <OxxoCard code={rec.pickupCode} />

      <div className="space-y-3 rounded-3xl border border-white/10 bg-zinc-900 p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
            <span className="text-sm font-semibold">1</span>
          </div>
          <div className="text-sm text-zinc-200">
            Ve a cualquier <span className="font-medium">OXXO</span> en{" "}
            {rec.intent.recipientCity || "tu ciudad"}.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
            <span className="text-sm font-semibold">2</span>
          </div>
          <div className="text-sm text-zinc-200">
            Muestra este código al cajero junto con tu INE.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
            <span className="text-sm font-semibold">3</span>
          </div>
          <div className="text-sm text-zinc-200">
            Recibes <span className="font-medium">{fmtMxn(rec.quote.amountMxn)}</span> en efectivo. Listo.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Hint icon={<MapPin className="h-3.5 w-3.5" />} label="Encuentra OXXO" />
        <Hint icon={<Phone className="h-3.5 w-3.5" />} label="WhatsApp soporte" />
      </div>

      {rec.txHash && (
        <div className="text-center text-[10px] text-zinc-500">
          Verificado onchain ·{" "}
          <a
            href={explorerTxUrl(rec.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-emerald-400 hover:underline"
          >
            {rec.txHash.slice(0, 10)}…
          </a>
        </div>
      )}
    </div>
  );
}

function OxxoCard({ code }: { code: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-zinc-950 p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Código de retiro OXXO
        </div>
        <div className="font-mono text-4xl font-bold tracking-[0.3em] text-white">
          {code}
        </div>
        <div className="text-[10px] text-zinc-500">
          Válido 7 días · No lo compartas con nadie más
        </div>
      </div>
    </div>
  );
}

function Hint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
      {icon}
      {label}
    </div>
  );
}

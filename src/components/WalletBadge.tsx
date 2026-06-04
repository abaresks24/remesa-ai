"use client";

import { Wallet } from "lucide-react";
import { shortAddr } from "@/lib/utils";
import { explorerAddressUrl } from "@/lib/chain";

type Props = {
  address?: `0x${string}`;
  usdcBalance?: number;
  ethBalance?: number;
};

export function WalletBadge({ address, usdcBalance, ethBalance }: Props) {
  if (!address) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400">
        <Wallet className="h-3.5 w-3.5" />
        Creando wallet…
      </div>
    );
  }
  return (
    <a
      href={explorerAddressUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/20"
      title={address}
    >
      <Wallet className="h-3.5 w-3.5" />
      <span className="font-mono">{shortAddr(address)}</span>
      <span className="text-emerald-300/80">
        ·{" "}
        {usdcBalance !== undefined ? `${usdcBalance.toFixed(2)} USDC` : "…"}
        {ethBalance !== undefined && ethBalance > 0 && (
          <> · {ethBalance.toFixed(4)} ETH</>
        )}
      </span>
    </a>
  );
}

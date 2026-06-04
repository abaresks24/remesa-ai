"use client";

import {
  createWalletClient,
  http,
  type Address,
  type Hex,
  type WalletClient,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { publicClient } from "./chain";
import { encodeUsdcTransfer, USDC_ABI, USDC_ADDRESS_BASE_SEPOLIA } from "./usdc";
import { formatUnits } from "viem";

const STORAGE_KEY = "remesa.wallet.pk";

export function loadOrCreateWallet(): {
  address: Address;
  client: WalletClient;
  isNew: boolean;
} {
  if (typeof window === "undefined") throw new Error("client only");
  let pk = localStorage.getItem(STORAGE_KEY) as Hex | null;
  let isNew = false;
  if (!pk) {
    pk = generatePrivateKey();
    localStorage.setItem(STORAGE_KEY, pk);
    isNew = true;
  }
  const account = privateKeyToAccount(pk);
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });
  return { address: account.address, client, isNew };
}

export async function getUsdcBalance(address: Address): Promise<number> {
  const raw = await publicClient.readContract({
    address: USDC_ADDRESS_BASE_SEPOLIA,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return Number(formatUnits(raw as bigint, 6));
}

export async function getEthBalance(address: Address): Promise<number> {
  const raw = await publicClient.getBalance({ address });
  return Number(formatUnits(raw, 18));
}

export async function sendUsdc(
  client: WalletClient,
  to: Address,
  amountUsd: number,
): Promise<Hex> {
  const data = encodeUsdcTransfer(to, amountUsd);
  const account = client.account;
  if (!account) throw new Error("no account");
  return client.sendTransaction({
    account,
    chain: baseSepolia,
    to: USDC_ADDRESS_BASE_SEPOLIA,
    data,
    value: 0n,
  });
}

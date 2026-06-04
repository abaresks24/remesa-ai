import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const chain = baseSepolia;

export const publicClient = createPublicClient({
  chain,
  transport: http(),
});

export const explorerTxUrl = (hash: string) =>
  `${baseSepolia.blockExplorers.default.url}/tx/${hash}`;

export const explorerAddressUrl = (address: string) =>
  `${baseSepolia.blockExplorers.default.url}/address/${address}`;

import { parseUnits, encodeFunctionData, type Address } from "viem";

// USDC on Base Sepolia (Circle official testnet faucet)
// https://docs.base.org/docs/tokens/list/
export const USDC_ADDRESS_BASE_SEPOLIA: Address =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const USDC_DECIMALS = 6;

export const USDC_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

export function encodeUsdcTransfer(to: Address, amountUsd: number) {
  return encodeFunctionData({
    abi: USDC_ABI,
    functionName: "transfer",
    args: [to, parseUnits(amountUsd.toFixed(USDC_DECIMALS), USDC_DECIMALS)],
  });
}

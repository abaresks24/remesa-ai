export type Intent = {
  amountUsd: number;
  recipientName: string;
  recipientCity?: string;
  recipientCountry: "MX";
  note?: string;
  confidence: "high" | "medium" | "low";
  missing?: string[];
  raw?: string;
};

export type Quote = {
  amountUsd: number;
  amountMxn: number;
  fxRate: number;
  protocolFeeUsd: number;
  networkFeeUsd: number;
  totalCostUsd: number;
  etaSeconds: number;
};

export type RemittanceRecord = {
  id: string;
  pickupCode: string;
  intent: Intent;
  quote: Quote;
  txHash?: `0x${string}`;
  senderAddress?: `0x${string}`;
  status: "pending" | "signed" | "settled" | "claimed";
  createdAt: number;
};

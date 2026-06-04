// Mid-market USD→MXN rate. For the hackathon demo we keep this static;
// in production we'd pull from Bitso/Banxico every quote.
const USD_MXN_RATE = 17.45;

const PROTOCOL_FEE_PCT = 0.0015; // 0.15% — vs Western Union ~5–8%
const FIXED_NETWORK_FEE_USD = 0.05; // Base L2 USDC tx
const MIN_FEE_USD = 0.5;

export function quote(amountUsd: number) {
  const protocolFee = Math.max(
    amountUsd * PROTOCOL_FEE_PCT,
    MIN_FEE_USD - FIXED_NETWORK_FEE_USD,
  );
  const totalCostUsd = protocolFee + FIXED_NETWORK_FEE_USD;
  const netUsd = amountUsd - totalCostUsd;
  return {
    amountUsd,
    amountMxn: round2(netUsd * USD_MXN_RATE),
    fxRate: USD_MXN_RATE,
    protocolFeeUsd: round2(protocolFee),
    networkFeeUsd: FIXED_NETWORK_FEE_USD,
    totalCostUsd: round2(totalCostUsd),
    etaSeconds: 120,
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const fmtMxn = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

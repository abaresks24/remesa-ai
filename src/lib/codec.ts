import type { RemittanceRecord } from "./types";

// URL-safe base64 encode/decode of a remittance record.
// Lets the share link work across devices for the hackathon demo.
// In production the link points to a backend that serves an encrypted record.

export function encodeRecord(rec: RemittanceRecord): string {
  const json = JSON.stringify(rec);
  if (typeof window === "undefined") {
    return Buffer.from(json, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeRecord(s: string): RemittanceRecord | null {
  try {
    const padded = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin =
      typeof window === "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : decodeAtob(padded);
    return JSON.parse(bin) as RemittanceRecord;
  } catch {
    return null;
  }
}

function decodeAtob(b64: string): string {
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

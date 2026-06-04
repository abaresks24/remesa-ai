"use client";

import type { RemittanceRecord } from "./types";

const STORAGE_PREFIX = "remesa.tx.";

export function saveRemittance(rec: RemittanceRecord) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_PREFIX + rec.pickupCode, JSON.stringify(rec));
}

export function loadRemittance(code: string): RemittanceRecord | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_PREFIX + code);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RemittanceRecord;
  } catch {
    return null;
  }
}

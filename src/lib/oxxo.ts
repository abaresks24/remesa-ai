import { customAlphabet } from "nanoid";

// 8-char alphanumeric (OXXO-style pickup code)
const generateCode = customAlphabet("ABCDEFGHJKMNPQRSTUVWXYZ23456789", 8);

export function newPickupCode(): string {
  return generateCode();
}

export function newRemittanceId(): string {
  return customAlphabet("0123456789abcdef", 16)();
}

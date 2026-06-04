import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortAddr = (addr: string) =>
  `${addr.slice(0, 6)}…${addr.slice(-4)}`;

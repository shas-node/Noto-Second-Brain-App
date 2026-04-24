import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveToken(rawToken: string | null): string | null {
  if (!rawToken) return null;
  try {
    const parsed = JSON.parse(rawToken);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return rawToken;
  }
}

/**
 * Tag configuration used to build the parser URL and estimate tag usage.
 */

/** Dummy parser URL. Production tags must use the real GitHub Pages URL. */
export const PARSER_URL = "https://bayu242.github.io/tag24/";

/** Usable NDEF capacity reported by a MIFARE Classic 1K tag, in bytes. */
export const TAG_CAPACITY_BYTES = 716;

export type CapacityLevel = "ok" | "tight" | "over";

export function capacityLevel(size: number, capacity = TAG_CAPACITY_BYTES): CapacityLevel {
  if (size > capacity) return "over";
  if (size > capacity * 0.85) return "tight";
  return "ok";
}

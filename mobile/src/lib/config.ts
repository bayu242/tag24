/**
 * Tag configuration used to build the parser URL and estimate tag usage.
 */

/** Production parser URL (GitHub Pages). Written to every NFC tag. */
export const PARSER_URL = "https://bayu242.github.io/tag24/";

/** Landing-page tutorial explaining how to prepare a tag (NDEF formatting). */
export const TUTORIAL_URL = `${PARSER_URL}#tag`;

/** NFC Tools app on Google Play, used by the NDEF formatting tutorial. */
export const NFC_TOOLS_URL = "https://play.google.com/store/apps/details?id=com.wakdev.wdnfc";

/** Usable NDEF capacity reported by a MIFARE Classic 1K tag, in bytes. */
export const TAG_CAPACITY_BYTES = 716;

export type CapacityLevel = "ok" | "tight" | "over";

export function capacityLevel(size: number, capacity = TAG_CAPACITY_BYTES): CapacityLevel {
  if (size > capacity) return "over";
  if (size > capacity * 0.85) return "tight";
  return "ok";
}

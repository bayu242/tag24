import { strToU8 } from "fflate";
import { encodeTagData } from "./codec";
import { buildParserUrl } from "./url";
import type { TagData } from "./types";

/**
 * Approximate NDEF URI record overhead in bytes (header, type, and payload
 * length fields). Real available capacity is reported by the tag itself.
 */
export const NDEF_URI_RECORD_OVERHEAD = 8;

export interface TagSizeEstimate {
  encodedPayload: string;
  parserUrl: string;
  urlLength: number;
  urlBytes: number;
  ndefBytes: number;
}

export function estimateTagSize(parserUrl: string, data: TagData): TagSizeEstimate {
  const encodedPayload = encodeTagData(data);
  const url = buildParserUrl(parserUrl, encodedPayload);
  const urlBytes = strToU8(url).length;

  return {
    encodedPayload,
    parserUrl: url,
    urlLength: url.length,
    urlBytes,
    ndefBytes: urlBytes + NDEF_URI_RECORD_OVERHEAD,
  };
}

export function fitsTag(estimate: TagSizeEstimate, capacityBytes: number): boolean {
  return estimate.ndefBytes <= capacityBytes;
}

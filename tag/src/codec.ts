import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { base64UrlToBytes, bytesToBase64Url } from "./base64url";
import { fail } from "./errors";
import { createPayload, parsePayload, toWirePayload } from "./payload";
import type {
  EncodedTagPayload,
  TagData,
  TagParseResult,
  TagPayload,
} from "./types";

/**
 * Codec pipeline:
 * TagPayload -> minified JSON -> raw DEFLATE -> unpadded Base64URL.
 * Decoding is the exact reverse and always returns a result instead of throwing.
 */
export function encodePayload(payload: TagPayload): EncodedTagPayload {
  const json = JSON.stringify(toWirePayload(payload));
  const compressed = deflateSync(strToU8(json), { level: 9 });
  return bytesToBase64Url(compressed);
}

export function encodeTagData(data: TagData): EncodedTagPayload {
  return encodePayload(createPayload(data));
}

export function decodePayload(encoded: EncodedTagPayload): TagParseResult {
  if (!encoded) return fail("EMPTY_PAYLOAD");

  let compressed: Uint8Array;
  try {
    compressed = base64UrlToBytes(encoded);
  } catch {
    return fail("INVALID_BASE64");
  }

  let inflated: Uint8Array;
  try {
    inflated = inflateSync(compressed);
  } catch {
    return fail("INVALID_DEFLATE");
  }

  let json: string;
  try {
    json = strFromU8(inflated);
  } catch {
    return fail("INVALID_DEFLATE");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return fail("INVALID_JSON");
  }

  return parsePayload(parsed);
}

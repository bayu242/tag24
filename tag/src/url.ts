import { decodePayload, encodeTagData } from "./codec";
import { TAG_QUERY_PARAM } from "./constants";
import { fail, ok } from "./errors";
import { validateTagData } from "./payload";
import type { TagData, TagParseResult, TagResult } from "./types";

/** Append the encoded payload to a parser URL as the `d` query parameter. */
export function buildParserUrl(parserUrl: string, encodedPayload: string): string {
  const separator = parserUrl.includes("?") ? "&" : "?";
  return `${parserUrl}${separator}${TAG_QUERY_PARAM}=${encodedPayload}`;
}

export interface BuiltTagUri {
  uri: string;
  encodedPayload: string;
}

/**
 * Full write pipeline: validate -> normalize -> encode -> build parser URL.
 * Returns a structured error instead of throwing when the data is invalid.
 */
export function buildTagUri(parserUrl: string, data: TagData): TagResult<BuiltTagUri> {
  const validated = validateTagData(data);
  if (!validated.ok) return validated;

  const encodedPayload = encodeTagData(validated.value);
  return ok({ uri: buildParserUrl(parserUrl, encodedPayload), encodedPayload });
}


/** Extract the raw `d` query parameter value from a full parser URL. */
export function extractEncodedPayload(url: string): TagResult<string> {
  if (typeof url !== "string" || url.length === 0) return fail("INVALID_URL");

  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) return fail("MISSING_QUERY_PARAM");

  const query = url.slice(queryIndex + 1).split("#")[0];
  for (const pair of query.split("&")) {
    if (!pair) continue;
    const equalsIndex = pair.indexOf("=");
    const key = equalsIndex === -1 ? pair : pair.slice(0, equalsIndex);
    if (key !== TAG_QUERY_PARAM) continue;

    const rawValue = equalsIndex === -1 ? "" : pair.slice(equalsIndex + 1);
    let value: string;
    try {
      value = decodeURIComponent(rawValue);
    } catch {
      return fail("INVALID_URL");
    }
    if (!value) return fail("EMPTY_PAYLOAD");
    return ok(value);
  }

  return fail("MISSING_QUERY_PARAM");
}

/** Full URL -> decoded payload. */
export function decodeTagUrl(url: string): TagParseResult {
  const extracted = extractEncodedPayload(url);
  if (!extracted.ok) return extracted;
  return decodePayload(extracted.value);
}

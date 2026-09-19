import type { TagErrorCode, TagParseError, TagResult } from "./types";

export const TAG_ERROR_MESSAGES: Record<TagErrorCode, string> = {
  EMPTY_PAYLOAD: "This tag is empty.",
  INVALID_NDEF_URI: "This tag does not have data this app can read.",
  MULTIPLE_NDEF_URI_RECORDS: "This tag has more than one item, so it cannot be read here.",
  MISSING_QUERY_PARAM: "This tag's link is missing its data.",
  INVALID_URL: "This tag's link is not valid.",
  INVALID_BASE64: "This tag's data is not in a format the app can read.",
  INVALID_DEFLATE: "This tag's data could not be read.",
  INVALID_JSON: "This tag's data is not valid.",
  UNSUPPORTED_VERSION: "This tag was saved by a newer version of the app.",
  UNKNOWN_DATA_TYPE: "This tag has information this app does not recognize.",
  MAX_CHAR_EXCEEDED: "One of the entries is too long.",
  INVALID_DATA: "This tag's data is not valid.",
  TAG_LOCKED: "This tag is locked and cannot be changed.",
  INSUFFICIENT_CAPACITY: "The data does not fit on this tag.",
};

export function tagError(code: TagErrorCode, message?: string): TagParseError {
  return { code, message: message ?? TAG_ERROR_MESSAGES[code] };
}

export function ok<T>(value: T): TagResult<T> {
  return { ok: true, value };
}

export function fail<T>(code: TagErrorCode, message?: string): TagResult<T> {
  return { ok: false, error: tagError(code, message) };
}

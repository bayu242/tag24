export type TagPayloadVersion = "1";

export interface TagDataType {
  id: string;
  name: string;
  maxChar: number;
  linkTemplate?: string;
}

export type TagDataTypeRegistry = Record<string, TagDataType>;

export type TagData = Record<string, string>;

export interface TagPayload {
  version: TagPayloadVersion;
  data: TagData;
}

/**
 * Compact payload shape serialized to JSON before compression.
 * `v` is the version and `d` is the tag data keyed by TagDataType.id.
 */
export type TagWirePayload = {
  v: TagPayloadVersion;
  d: TagData;
};

export type EncodedTagPayload = string;

export interface TagParserUrl {
  parserUrl: string;
  queryParam: "d";
  encodedPayload: EncodedTagPayload;
}

export interface TagNdefUriRecord {
  recordType: "uri";
  uri: string;
}

export type TagErrorCode =
  | "EMPTY_PAYLOAD"
  | "INVALID_NDEF_URI"
  | "MULTIPLE_NDEF_URI_RECORDS"
  | "MISSING_QUERY_PARAM"
  | "INVALID_URL"
  | "INVALID_BASE64"
  | "INVALID_DEFLATE"
  | "INVALID_JSON"
  | "UNSUPPORTED_VERSION"
  | "UNKNOWN_DATA_TYPE"
  | "MAX_CHAR_EXCEEDED"
  | "INVALID_DATA"
  | "TAG_LOCKED"
  | "INSUFFICIENT_CAPACITY";

export interface TagParseError {
  code: TagErrorCode;
  message: string;
}

export type TagResult<T> = { ok: true; value: T } | { ok: false; error: TagParseError };

export type TagParseResult = TagResult<TagPayload>;

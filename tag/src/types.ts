export type TagPayloadVersion = "1";

/** One part of a composite field, for example the SSID of a WiFi field. */
export interface TagSubField {
  id: string;
  name: string;
  maxChar: number;
  /** Hide the value by default on the read views (for example a password). */
  secret?: boolean;
}

export interface TagDataType {
  id: string;
  name: string;
  maxChar: number;
  linkTemplate?: string;
  /** When true, the field stores a list of values instead of a single value. */
  multi?: boolean;
  /** When present, the field stores an object keyed by these sub-field ids. */
  fields?: TagSubField[];
}

export type TagDataTypeRegistry = Record<string, TagDataType>;

/** A stored composite value keyed by the field's `TagSubField.id`. */
export type TagCompositeValue = Record<string, string>;

/**
 * A stored field value: a single string, a list for `multi` fields, or an
 * object for composite fields.
 */
export type TagValue = string | string[] | TagCompositeValue;

export type TagData = Record<string, TagValue>;

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
  | "LINK_MISMATCH"
  | "INVALID_DATA"
  | "TAG_LOCKED"
  | "INSUFFICIENT_CAPACITY";

export interface TagParseError {
  code: TagErrorCode;
  message: string;
}

export type TagResult<T> = { ok: true; value: T } | { ok: false; error: TagParseError };

export type TagParseResult = TagResult<TagPayload>;

import { TAG_PAYLOAD_VERSION } from "./constants";
import { getTagDataType, initialTagDataTypes } from "./dataTypes";
import { fail, ok } from "./errors";
import type { TagData, TagPayload, TagPayloadVersion, TagResult, TagWirePayload } from "./types";

const SUPPORTED_VERSIONS: string[] = [TAG_PAYLOAD_VERSION];

export function isSupportedVersion(version: unknown): version is TagPayloadVersion {
  return typeof version === "string" && SUPPORTED_VERSIONS.includes(version);
}

/**
 * Trim values, drop empty ones, and keep the registry order so the encoded
 * payload is deterministic.
 */
export function normalizeTagData(data: TagData): TagData {
  const result: TagData = {};
  for (const type of initialTagDataTypes) {
    const raw = data[type.id];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed.length > 0) result[type.id] = trimmed;
  }
  return result;
}

/** Validate a set of values before writing: known ids and maxChar only. */
export function validateTagData(data: TagData): TagResult<TagData> {
  const normalized = normalizeTagData(data);
  for (const [id, value] of Object.entries(normalized)) {
    const type = getTagDataType(id);
    if (!type) return fail("UNKNOWN_DATA_TYPE", `"${id}" is not a supported field.`);
    if (value.length > type.maxChar) {
      return fail(
        "MAX_CHAR_EXCEEDED",
        `${type.name} is too long. Use ${type.maxChar} characters or fewer.`,
      );
    }
  }
  return ok(normalized);
}

export function createPayload(data: TagData): TagPayload {
  return { version: TAG_PAYLOAD_VERSION, data: normalizeTagData(data) };
}

export function toWirePayload(payload: TagPayload): TagWirePayload {
  return { v: payload.version, d: payload.data };
}

export function fromWirePayload(wire: TagWirePayload): TagPayload {
  return { version: wire.v, data: wire.d };
}

/** Validate and normalize a decoded wire payload into the logical payload. */
export function parsePayload(input: unknown): TagResult<TagPayload> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return fail("INVALID_DATA");
  }

  const wire = input as Partial<TagWirePayload>;
  if (!isSupportedVersion(wire.v)) return fail("UNSUPPORTED_VERSION");
  if (wire.d === null || typeof wire.d !== "object" || Array.isArray(wire.d)) {
    return fail("INVALID_DATA");
  }

  const data: TagData = {};
  for (const [id, value] of Object.entries(wire.d as Record<string, unknown>)) {
    if (typeof value !== "string") {
      return fail("INVALID_DATA", `The entry for "${id}" is not valid.`);
    }
    const type = getTagDataType(id);
    if (!type) return fail("UNKNOWN_DATA_TYPE", `"${id}" is not a supported field.`);
    if (value.length > type.maxChar) {
      return fail(
        "MAX_CHAR_EXCEEDED",
        `${type.name} is too long. Use ${type.maxChar} characters or fewer.`,
      );
    }
    if (value.length > 0) data[id] = value;
  }

  return ok({ version: wire.v, data });
}

import { TAG_PAYLOAD_VERSION } from "./constants";
import { getTagDataType, initialTagDataTypes } from "./dataTypes";
import { fail, ok } from "./errors";
import { normalizeFieldValue, validateFieldValue } from "./normalize";
import type {
  TagCompositeValue,
  TagData,
  TagPayload,
  TagPayloadVersion,
  TagResult,
  TagWirePayload,
} from "./types";
import { compositeValue, isCompositeValue, tagValues } from "./values";

const SUPPORTED_VERSIONS: string[] = [TAG_PAYLOAD_VERSION];

export function isSupportedVersion(version: unknown): version is TagPayloadVersion {
  return typeof version === "string" && SUPPORTED_VERSIONS.includes(version);
}

function toStringList(raw: unknown): string[] {
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) return raw.filter((entry): entry is string => typeof entry === "string");
  return [];
}

/**
 * Normalize values, drop empty ones, and keep the registry order so the encoded
 * payload is deterministic. Social/Spotify links are reduced to the username or
 * ID here, so callers can pass whatever the user typed or pasted. Multi fields
 * keep a de-duplicated list; single fields keep the first value.
 */
export function normalizeTagData(data: TagData): TagData {
  const result: TagData = {};
  for (const type of initialTagDataTypes) {
    if (!(type.id in data)) continue;

    if (type.fields) {
      const source = data[type.id];
      if (!isCompositeValue(source)) continue;
      const composite: TagCompositeValue = {};
      for (const sub of type.fields) {
        const raw = source[sub.id];
        if (typeof raw !== "string") continue;
        const value = raw.trim();
        if (value) composite[sub.id] = value;
      }
      if (Object.keys(composite).length > 0) result[type.id] = composite;
      continue;
    }

    const entries: string[] = [];
    for (const raw of toStringList(data[type.id])) {
      const value = normalizeFieldValue(type.id, raw);
      if (value && !entries.includes(value)) entries.push(value);
    }
    if (entries.length === 0) continue;

    result[type.id] = type.multi ? entries : entries[0];
  }
  return result;
}

/**
 * Validate a set of values before writing: known ids, link/field match, and
 * maxChar per entry. Link validation runs on the raw input so a mismatched
 * link is rejected instead of being silently normalized.
 */
export function validateTagData(data: TagData): TagResult<TagData> {
  for (const type of initialTagDataTypes) {
    if (!(type.id in data)) continue;

    if (type.fields) {
      const source = data[type.id];
      if (!isCompositeValue(source)) {
        return fail("INVALID_DATA", `The entry for "${type.name}" is not valid.`);
      }
      for (const subId of Object.keys(source)) {
        if (!type.fields.some((sub) => sub.id === subId)) {
          return fail("INVALID_DATA", `The entry for "${type.name}" is not valid.`);
        }
      }
      continue;
    }

    for (const raw of tagValues(data[type.id])) {
      const code = validateFieldValue(type.id, raw);
      if (code) return fail(code, `"${type.name}" does not accept this link.`);
    }
  }

  const normalized = normalizeTagData(data);
  for (const [id, value] of Object.entries(normalized)) {
    const type = getTagDataType(id);
    if (!type) return fail("UNKNOWN_DATA_TYPE", `"${id}" is not a supported field.`);
    if (type.fields) {
      const composite = compositeValue(value);
      for (const sub of type.fields) {
        const entry = composite?.[sub.id];
        if (entry && entry.length > sub.maxChar) {
          return fail(
            "MAX_CHAR_EXCEEDED",
            `${sub.name} is too long. Use ${sub.maxChar} characters or fewer.`,
          );
        }
      }
      continue;
    }
    for (const entry of tagValues(value)) {
      if (entry.length > type.maxChar) {
        return fail(
          "MAX_CHAR_EXCEEDED",
          `${type.name} is too long. Use ${type.maxChar} characters or fewer.`,
        );
      }
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

  const raw: TagData = {};
  for (const [id, value] of Object.entries(wire.d as Record<string, unknown>)) {
    const type = getTagDataType(id);
    if (!type) return fail("UNKNOWN_DATA_TYPE", `"${id}" is not a supported field.`);

    if (type.fields) {
      // Composite fields store an object keyed by their sub-field ids.
      if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return fail("INVALID_DATA", `The entry for "${id}" is not valid.`);
      }
      const composite: TagCompositeValue = {};
      for (const [subId, subValue] of Object.entries(value as Record<string, unknown>)) {
        const sub = type.fields.find((entry) => entry.id === subId);
        if (!sub || typeof subValue !== "string") {
          return fail("INVALID_DATA", `The entry for "${id}" is not valid.`);
        }
        composite[subId] = subValue;
      }
      raw[id] = composite;
      continue;
    }

    if (Array.isArray(value)) {
      // Lists are only valid for multi fields. A single string for a multi
      // field is still accepted so older tags keep working.
      if (!type.multi) return fail("INVALID_DATA", `The entry for "${id}" is not valid.`);
      if (!value.every((entry): entry is string => typeof entry === "string")) {
        return fail("INVALID_DATA", `The entry for "${id}" is not valid.`);
      }
      raw[id] = value;
    } else if (typeof value === "string") {
      raw[id] = value;
    } else {
      return fail("INVALID_DATA", `The entry for "${id}" is not valid.`);
    }
  }

  for (const [id, value] of Object.entries(raw)) {
    for (const entry of tagValues(value)) {
      const code = validateFieldValue(id, entry);
      if (code) {
        const type = getTagDataType(id);
        return fail(code, `"${type?.name ?? id}" does not accept this link.`);
      }
    }
  }

  const data = normalizeTagData(raw);
  for (const [id, value] of Object.entries(data)) {
    const type = getTagDataType(id);
    if (!type) return fail("UNKNOWN_DATA_TYPE", `"${id}" is not a supported field.`);
    if (type.fields) {
      const composite = compositeValue(value);
      for (const sub of type.fields) {
        const entry = composite?.[sub.id];
        if (entry && entry.length > sub.maxChar) {
          return fail(
            "MAX_CHAR_EXCEEDED",
            `${sub.name} is too long. Use ${sub.maxChar} characters or fewer.`,
          );
        }
      }
      continue;
    }
    for (const entry of tagValues(value)) {
      if (entry.length > type.maxChar) {
        return fail(
          "MAX_CHAR_EXCEEDED",
          `${type.name} is too long. Use ${type.maxChar} characters or fewer.`,
        );
      }
    }
  }

  return ok({ version: wire.v, data });
}

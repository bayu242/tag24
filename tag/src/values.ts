import type { TagCompositeValue, TagValue } from "./types";

/** True when a value is a composite (object) value rather than a string/list. */
export function isCompositeValue(value: unknown): value is TagCompositeValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Coerce a single/list value into a list. Composite values are not lists. */
export function tagValues(value: TagValue | undefined): string[] {
  if (value === undefined) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}

/** The composite value of a field, when it stores one. */
export function compositeValue(value: TagValue | undefined): TagCompositeValue | undefined {
  return isCompositeValue(value) ? value : undefined;
}

/** True when a field holds at least one non-empty entry. */
export function hasTagValue(value: TagValue | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.some((entry) => entry.length > 0);
  return Object.values(value).some((entry) => entry.length > 0);
}

/** Human-readable single-line text for a value, used in compact previews. */
export function tagValueText(value: TagValue | undefined): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return Object.values(value)
    .filter((entry) => entry.length > 0)
    .join(" · ");
}

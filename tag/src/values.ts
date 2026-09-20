import type { TagValue } from "./types";

/** Coerce any stored value into a list, so callers can handle single and multi fields alike. */
export function tagValues(value: TagValue | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** True when a field holds at least one non-empty entry. */
export function hasTagValue(value: TagValue | undefined): boolean {
  return tagValues(value).some((entry) => entry.length > 0);
}

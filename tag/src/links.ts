import { TAG_LINK_PLACEHOLDER } from "./constants";
import { getTagDataType } from "./dataTypes";
import type { TagDataType } from "./types";

export function buildTagLink(dataType: TagDataType, value: string): string | undefined {
  if (!dataType.linkTemplate) return undefined;
  return dataType.linkTemplate.replaceAll(TAG_LINK_PLACEHOLDER, value);
}

export function buildTagLinkById(id: string, value: string): string | undefined {
  const dataType = getTagDataType(id);
  if (!dataType) return undefined;
  return buildTagLink(dataType, value);
}

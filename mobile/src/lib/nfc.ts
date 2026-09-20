import NfcManager, { Ndef, NdefStatus, NfcTech } from "react-native-nfc-manager";
import type { NdefRecord, TagEvent } from "react-native-nfc-manager";
import type { TagData, TagErrorCode } from "tag";
import { TAG_ERROR_MESSAGES, decodeTagUrl } from "tag";

/**
 * Thin, promise-based wrapper around react-native-nfc-manager that implements
 * the read/write contract from docs/PRD.md:
 * exactly one NDEF URI record containing the full parser URL.
 */

export type NfcAvailability = "unsupported" | "disabled" | "ready";

export type NfcErrorCode =
  | "NFC_UNSUPPORTED"
  | "NFC_DISABLED"
  | "NFC_READ_FAILED"
  | "NFC_WRITE_FAILED"
  | "NFC_CANCELLED"
  | TagErrorCode;

export interface NfcError {
  code: NfcErrorCode;
  message: string;
}

export type NfcResult<T> = { ok: true; value: T } | { ok: false; error: NfcError };

const NFC_MESSAGES: Partial<Record<NfcErrorCode, string>> = {
  NFC_UNSUPPORTED: "This device cannot read or write NFC tags.",
  NFC_DISABLED: "NFC is turned off. Turn it on to continue.",
  NFC_READ_FAILED: "We could not read the tag. Hold your phone still and try again.",
  NFC_WRITE_FAILED: "We could not write to the tag. Hold your phone still and try again.",
  NFC_CANCELLED: "Reading or writing was cancelled.",
};

function nfcError(code: NfcErrorCode, message?: string): NfcError {
  const fallback = NFC_MESSAGES[code] ?? TAG_ERROR_MESSAGES[code as TagErrorCode];
  return { code, message: message ?? fallback ?? "NFC operation failed." };
}

let startPromise: Promise<void> | null = null;

/** Start the native NFC manager once per app session. */
export function ensureNfcStarted(): Promise<void> {
  if (!startPromise) {
    startPromise = NfcManager.start().catch((error) => {
      startPromise = null;
      throw error;
    });
  }
  return startPromise;
}

export async function getNfcAvailability(): Promise<NfcAvailability> {
  try {
    await ensureNfcStarted();
    const supported = await NfcManager.isSupported();
    if (!supported) return "unsupported";
    const enabled = await NfcManager.isEnabled();
    return enabled ? "ready" : "disabled";
  } catch {
    return "unsupported";
  }
}

export async function openNfcSettings(): Promise<void> {
  try {
    await ensureNfcStarted();
    await NfcManager.goToNfcSetting();
  } catch {
    // Best effort: opening system settings is not guaranteed.
  }
}

export interface TagInfo {
  isMifareClassic: boolean;
  isNdef: boolean;
  isLocked: boolean;
  capacityBytes: number | null;
  techTypes: string[];
}

const MIFARE_CLASSIC_PATTERN = /mifare\s*classic/i;

function detectMifareClassic(tag: TagEvent): boolean {
  const techs = tag.techTypes ?? [];
  if (techs.some((tech) => MIFARE_CLASSIC_PATTERN.test(tech))) return true;
  return typeof tag.type === "string" && MIFARE_CLASSIC_PATTERN.test(tag.type);
}

/** Read NDEF status, capacity, lock state, and tag family. */
export async function getTagInfo(tag: TagEvent): Promise<TagInfo> {
  let capacityBytes = typeof tag.maxSize === "number" ? tag.maxSize : null;
  let isNdef = Array.isArray(tag.ndefMessage);
  let isLocked = false;

  try {
    const status = await NfcManager.ndefHandler.getNdefStatus();
    isNdef = status.status !== NdefStatus.NotSupported;
    isLocked = status.status === NdefStatus.ReadOnly;
    if (typeof status.capacity === "number") capacityBytes = status.capacity;
  } catch {
    // Some tags do not expose NDEF status; fall back to the tag event values.
  }

  return {
    isMifareClassic: detectMifareClassic(tag),
    isNdef,
    isLocked,
    capacityBytes,
    techTypes: tag.techTypes ?? [],
  };
}

function isUriRecord(record: NdefRecord): boolean {
  const type = record.type;
  const isUriType = Array.isArray(type)
    ? type.length === 1 && type[0] === 0x55
    : type === "U";
  return record.tnf === Ndef.TNF_WELL_KNOWN && isUriType;
}

export interface ReadTagValue {
  uri: string;
  info: TagInfo;
  data: TagData;
}

/** Request an NFC tag, read exactly one NDEF URI record, and decode the payload. */
export async function readNfcTag(): Promise<NfcResult<ReadTagValue>> {
  await ensureNfcStarted();

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
  } catch (error) {
    return { ok: false, error: nfcError("NFC_CANCELLED", error instanceof Error ? error.message : undefined) };
  }

  try {
    const tag = await NfcManager.getTag();
    if (!tag) return { ok: false, error: nfcError("NFC_READ_FAILED") };

    const info = await getTagInfo(tag);
    if (info.isLocked) return { ok: false, error: nfcError("TAG_LOCKED") };

    const records = tag.ndefMessage ?? [];
    const uriRecords = records.filter(isUriRecord);
    if (uriRecords.length === 0) return { ok: false, error: nfcError("INVALID_NDEF_URI") };
    if (uriRecords.length > 1) return { ok: false, error: nfcError("MULTIPLE_NDEF_URI_RECORDS") };

    const uri = Ndef.uri.decodePayload(uriRecords[0].payload as unknown as Uint8Array);
    const decoded = decodeTagUrl(uri);
    if (!decoded.ok) return { ok: false, error: nfcError(decoded.error.code, decoded.error.message) };

    return { ok: true, value: { uri, info, data: decoded.value.data } };
  } catch (error) {
    return { ok: false, error: nfcError("NFC_READ_FAILED", error instanceof Error ? error.message : undefined) };
  } finally {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {
      // Ignore cleanup failures.
    }
  }
}

export interface WriteTagOptions {
  /** Reject tags that are not MIFARE Classic (default true per PRD). */
  requireMifareClassic?: boolean;
}

export interface WriteTagValue {
  capacityBytes: number | null;
  messageBytes: number;
}

/** Write a single NDEF URI record to the next tag presented. */
export async function writeNfcTag(
  uri: string,
  options: WriteTagOptions = {},
): Promise<NfcResult<WriteTagValue>> {
  const { requireMifareClassic = true } = options;
  await ensureNfcStarted();

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
  } catch (error) {
    return { ok: false, error: nfcError("NFC_CANCELLED", error instanceof Error ? error.message : undefined) };
  }

  try {
    const tag = await NfcManager.getTag();
    if (!tag) return { ok: false, error: nfcError("NFC_WRITE_FAILED") };

    const info = await getTagInfo(tag);
    if (info.isLocked) return { ok: false, error: nfcError("TAG_LOCKED") };
    if (requireMifareClassic && !info.isMifareClassic) {
      return {
        ok: false,
        error: nfcError("INVALID_NDEF_URI", "This tag type is not supported. Use a MIFARE Classic tag."),
      };
    }

    const messageBytes = Ndef.encodeMessage([Ndef.uriRecord(uri)]);
    if (info.capacityBytes != null && messageBytes.length > info.capacityBytes) {
      return {
        ok: false,
        error: nfcError(
          "INSUFFICIENT_CAPACITY",
          "There is not enough space on this tag for the selected fields.",
        ),
      };
    }

    await NfcManager.ndefHandler.writeNdefMessage(messageBytes);
    return { ok: true, value: { capacityBytes: info.capacityBytes, messageBytes: messageBytes.length } };
  } catch (error) {
    return { ok: false, error: nfcError("NFC_WRITE_FAILED", error instanceof Error ? error.message : undefined) };
  } finally {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {
      // Ignore cleanup failures.
    }
  }
}

import type { TagErrorCode } from "./types";

const SOCIAL_DOMAINS: Record<string, string[]> = {
  ig: ["instagram.com"],
  tw: ["x.com", "twitter.com"],
  th: ["threads.net", "threads.com"],
  fb: ["facebook.com", "fb.com", "fb.me"],
  li: ["linkedin.com"],
  yt: ["youtube.com", "youtu.be"],
  tt: ["tiktok.com"],
};

const SOCIAL_IDS = new Set(Object.keys(SOCIAL_DOMAINS));
const SPOTIFY_IDS = new Set(["sp", "sa"]);

const SPOTIFY_DOMAINS = ["spotify.com", "open.spotify.com"];

/** Every host that clearly belongs to a linkable platform. */
const KNOWN_HOSTS = new Set<string>([
  ...Object.values(SOCIAL_DOMAINS).flat(),
  ...SPOTIFY_DOMAINS,
]);

/** Path segments that are platform prefixes, not the username. */
const PREFIX_SEGMENTS = new Set([
  "in",
  "c",
  "user",
  "channel",
  "@",
  "p",
  "reel",
  "reels",
  "watch",
  "shorts",
  "profile.php",
]);

function stripProtocolAndSubdomain(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/^(?:www\.|m\.|mobile\.)/i, "");
}

function stripQueryAndHash(value: string): string {
  return value.split(/[?#]/)[0];
}

export function isSocialField(id: string): boolean {
  return SOCIAL_IDS.has(id);
}

export function isSpotifyField(id: string): boolean {
  return SPOTIFY_IDS.has(id);
}

function linkHost(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^spotify:/i, "")
    .replace(/^(?:www\.|m\.|mobile\.)/i, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
}

/**
 * True when the raw input is a link rather than a plain username or ID. A bare
 * username like "john.doe" is not a link, while anything with a scheme, a path,
 * or a known platform host is.
 */
export function isLinkLike(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  if (/^(?:https?:\/\/|spotify:)/i.test(value)) return true;
  if (value.includes("/")) return true;
  return KNOWN_HOSTS.has(linkHost(value));
}

/**
 * Reject a link that belongs to a different platform than the field expects.
 * A plain username or ID always passes. Returns an error code when the value
 * must not be stored, so a Spotify link cannot land in a social field (or the
 * other way around) and a wrong Spotify content type is rejected.
 */
export function validateFieldValue(id: string, raw: string): TagErrorCode | null {
  const value = raw.trim();
  if (!value || !isLinkLike(value)) return null;

  if (isSpotifyField(id)) {
    const expected: SpotifyContentType = id === "sa" ? "album" : "playlist";
    return normalizeSpotifyId(value, expected) ? null : "LINK_MISMATCH";
  }

  if (isSocialField(id)) {
    const domains = SOCIAL_DOMAINS[id] ?? [];
    const host = linkHost(value);
    const matches = domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
    return matches ? null : "LINK_MISMATCH";
  }

  return null;
}

/**
 * Accept either a profile link or a username and return only the username.
 * Examples: "https://www.instagram.com/bay24__" -> "bay24__",
 * "linkedin.com/in/bay24__" -> "bay24__", "@bay24__" -> "bay24__".
 */
export function normalizeSocialUsername(id: string, raw: string): string {
  let value = stripProtocolAndSubdomain(raw.trim());
  if (!value) return "";

  const domains = SOCIAL_DOMAINS[id];
  if (domains) {
    const lower = value.toLowerCase();
    for (const domain of domains) {
      if (lower.startsWith(`${domain}/`)) {
        value = value.slice(domain.length + 1);
        break;
      }
      if (lower === domain || lower.startsWith(`${domain}?`) || lower.startsWith(`${domain}#`)) {
        value = value.slice(domain.length);
        break;
      }
    }
  }

  // A URL on an unknown host: drop the host and keep the path.
  if (/^[a-z0-9.-]+\.[a-z]{2,}\//i.test(value)) {
    value = value.slice(value.indexOf("/") + 1);
  }

  value = stripQueryAndHash(value);
  value = value.replace(/^@/, "").replace(/\/+$/, "");

  const segments = value.split("/").filter((segment) => segment.length > 0);
  const first = segments.find((segment) => !PREFIX_SEGMENTS.has(segment.toLowerCase()));
  return (first ?? segments[0] ?? "").replace(/^@/, "");
}

/**
 * Accept a Spotify link, URI, or raw ID and return only the ID.
 * When `expectedType` is given, a link of a different type is rejected so the
 * field does not store an ID that would build the wrong playback link.
 * Examples: "https://open.spotify.com/intl-id/album/5PX...?si=..." -> "5PX...",
 * "spotify:playlist:37i9..." -> "37i9...".
 */
export function normalizeSpotifyId(raw: string, expectedType?: SpotifyContentType): string {
  const value = raw.trim();
  if (!value) return "";

  const detected = detectSpotifyLink(value);
  if (detected) {
    if (expectedType && detected.type !== expectedType) return "";
    return detected.id;
  }

  // Already a bare ID (no slashes, query, or dots).
  if (!/[/?#.]/.test(value)) return value;

  return "";
}

export type SpotifyContentType = "playlist" | "album" | "track" | "artist" | "episode" | "show";

function detectSpotifyLink(value: string): { type: SpotifyContentType; id: string } | null {
  const uriMatch = value.match(
    /^spotify:(playlist|album|track|artist|episode|show):([A-Za-z0-9]+)$/i,
  );
  if (uriMatch) {
    return { type: uriMatch[1].toLowerCase() as SpotifyContentType, id: uriMatch[2] };
  }

  const linkMatch = value.match(
    /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/i,
  );
  if (linkMatch) {
    return { type: linkMatch[1].toLowerCase() as SpotifyContentType, id: linkMatch[2] };
  }

  return null;
}

/**
 * Normalize a single raw input for a field id. A social/Spotify link is
 * reduced to the username or ID; a plain username/ID passes through. Falls
 * back to the trimmed raw value when nothing can be extracted, so partially
 * typed values are left untouched.
 */
export function normalizeFieldValue(id: string, raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (id === "sp") return normalizeSpotifyId(value, "playlist") || value;
  if (id === "sa") return normalizeSpotifyId(value, "album") || value;
  if (isSocialField(id)) return normalizeSocialUsername(id, value) || value;
  return value;
}

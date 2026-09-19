import { Platform } from "react-native";

/**
 * Brand design tokens.
 * Mirrors docs/DESIGN.md (1881 Ventures). Keep values in sync with
 * mobile/tailwind.config.js, which duplicates the color and radius values
 * because the Tailwind config is loaded by Node and cannot import this file.
 */

export const colors = {
  primary: "#529fcb",
  onPrimary: "#ffffff",
  background: "#ffffff",
  surface: "#529fcb",
  line: "#d5d5d5",
  ink: "#222121",
  inkMuted: "#000000",
  accent: "#211f54",

  // Functional status colors. The brand palette is intentionally triadic, so
  // these are used only for real semantic state (success / error / warning)
  // and never as decorative accents.
  success: "#2f7d5b",
  danger: "#b3261e",
  warning: "#8a5a00",

  // Low-saturation tints derived from the brand colors for backgrounds.
  primarySoft: "#eaf4fa",
  accentSoft: "#eae9f2",
} as const;

export const fonts = {
  // Garamond Novacond is a licensed display face not present in the repo.
  // Fall back to the platform serif until the real files are provided.
  display: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodySemiBold: "DMSans_600SemiBold",
  bodyBold: "DMSans_700Bold",
} as const;

export const radius = {
  sm: 2,
  md: 8,
  lg: 20,
  xl: 50,
} as const;

export const shadow = {
  card: {
    shadowColor: "#14142b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const motion = {
  fast: 200,
  base: 300,
  slow: 600,
} as const;

export type NfcState = "ready" | "disabled" | "unsupported";

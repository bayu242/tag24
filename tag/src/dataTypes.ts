import type { TagDataType, TagDataTypeRegistry } from "./types";

export const initialTagDataTypes: TagDataType[] = [
  { id: "nm", name: "Name", maxChar: 25 },
  { id: "wa", name: "WhatsApp", maxChar: 15, linkTemplate: "https://wa.me/{value}" },
  { id: "ph", name: "Phone Number", maxChar: 15, linkTemplate: "tel:{value}" },
  { id: "ad", name: "Address", maxChar: 60 },
  { id: "pet", name: "Pet Name", maxChar: 20 },
  { id: "em", name: "Email", maxChar: 40, linkTemplate: "mailto:{value}" },
  { id: "ig", name: "Instagram Username", maxChar: 20, linkTemplate: "https://instagram.com/{value}" },
  { id: "tw", name: "Twitter/X Username", maxChar: 15, linkTemplate: "https://x.com/{value}" },
  { id: "th", name: "Threads Username", maxChar: 20, linkTemplate: "https://www.threads.net/@{value}" },
  { id: "fb", name: "Facebook Username", maxChar: 30, linkTemplate: "https://facebook.com/{value}" },
  { id: "li", name: "LinkedIn Username", maxChar: 30, linkTemplate: "https://linkedin.com/in/{value}" },
  { id: "yt", name: "YouTube Username", maxChar: 20, linkTemplate: "https://youtube.com/@{value}" },
  { id: "tt", name: "TikTok Username", maxChar: 20, linkTemplate: "https://tiktok.com/@{value}" },
  { id: "sp", name: "Spotify Playlist ID", maxChar: 22, linkTemplate: "https://open.spotify.com/playlist/{value}" },
  { id: "sa", name: "Spotify Album ID", maxChar: 22, linkTemplate: "https://open.spotify.com/album/{value}" },
  { id: "nt", name: "Note", maxChar: 80 },
];

export const tagDataTypeRegistry: TagDataTypeRegistry = Object.fromEntries(
  initialTagDataTypes.map((dataType) => [dataType.id, dataType] as const),
);

export function getTagDataType(id: string): TagDataType | undefined {
  return tagDataTypeRegistry[id];
}

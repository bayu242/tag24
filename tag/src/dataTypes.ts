import type { TagDataType, TagDataTypeRegistry } from "./types";

export const initialTagDataTypes: TagDataType[] = [
  { id: "nm", name: "Name", maxChar: 25 },
  { id: "wa", name: "WhatsApp", maxChar: 15, linkTemplate: "https://wa.me/{value}" },
  { id: "ph", name: "Phone Number", maxChar: 15, linkTemplate: "tel:{value}" },
  { id: "ad", name: "Address", maxChar: 60 },
  { id: "pet", name: "Pet Name", maxChar: 20 },
  { id: "em", name: "Email", maxChar: 40, linkTemplate: "mailto:{value}" },
  { id: "ig", name: "Instagram", maxChar: 20, linkTemplate: "https://instagram.com/{value}" },
  { id: "tw", name: "Twitter/X", maxChar: 15, linkTemplate: "https://x.com/{value}" },
  { id: "th", name: "Threads", maxChar: 20, linkTemplate: "https://www.threads.net/@{value}" },
  { id: "fb", name: "Facebook", maxChar: 30, linkTemplate: "https://facebook.com/{value}" },
  { id: "li", name: "LinkedIn", maxChar: 30, linkTemplate: "https://linkedin.com/in/{value}" },
  { id: "yt", name: "YouTube", maxChar: 20, linkTemplate: "https://youtube.com/@{value}" },
  { id: "tt", name: "TikTok", maxChar: 20, linkTemplate: "https://tiktok.com/@{value}" },
  { id: "gh", name: "GitHub", maxChar: 39, linkTemplate: "https://github.com/{value}" },
  { id: "tg", name: "Telegram", maxChar: 32, linkTemplate: "https://t.me/{value}" },
  { id: "sp", name: "Spotify Playlist", maxChar: 22, linkTemplate: "https://open.spotify.com/playlist/{value}", multi: true },
  { id: "sa", name: "Spotify Album", maxChar: 22, linkTemplate: "https://open.spotify.com/album/{value}", multi: true },
  { id: "gm", name: "Google Maps", maxChar: 40, linkTemplate: "https://maps.app.goo.gl/{value}" },
  { id: "web", name: "Website", maxChar: 80, linkTemplate: "{value}" },
  {
    id: "wf",
    name: "WiFi",
    maxChar: 96,
    fields: [
      { id: "s", name: "Network name", maxChar: 32 },
      { id: "p", name: "Password", maxChar: 63, secret: true },
    ],
  },
  { id: "nt", name: "Note", maxChar: 80 },
];

export const tagDataTypeRegistry: TagDataTypeRegistry = Object.fromEntries(
  initialTagDataTypes.map((dataType) => [dataType.id, dataType] as const),
);

export function getTagDataType(id: string): TagDataType | undefined {
  return tagDataTypeRegistry[id];
}

# 1. project overview

## Product

Build an NFC information system with two connected applications and an NDEF-based tag format:

- An Android mobile application used to write information to already NDEF-compatible MIFARE Classic NFC tags with a minimum nominal capacity of 1K and read information from them.
- A web application that acts as the public landing page, explains the product, provides the Android APK download link, and parses tag payloads for simple reading.
- NFC tags that store exactly one NDEF URI record containing the GitHub Pages parser URL with the encoded data in the `d` query parameter. This allows an Android device to open the browser directly when the tag is scanned, without requiring the mobile app.
- A shared `tag` package that contains global TypeScript types, tag data definitions, link templates, and the raw DEFLATE/Base64URL encode-decode contract for both applications.

The first release focuses on a lightweight, local-first experience. It does not require user accounts, a database, or a server-side API.

## Users

The primary users are people who want to store simple information on NFC tags and read that information without manually inspecting raw tag data. The web application also serves visitors who want to understand the app or download the Android APK.

## Product goals

- Make NFC tag contents understandable to non-technical users.
- Let an Android device write and read supported NFC tag data on MIFARE Classic tags with a minimum nominal capacity of 1K.
- Store a GitHub Pages parser URL as an NDEF URI record so supported devices can open the browser directly when scanning a tag.
- Encode and decode tag data with Base64URL and required raw DEFLATE-compressed minified JSON.
- Provide a web landing page with product information and an APK download link.
- Parse tag payloads in the browser and display the decoded information.
- Keep the mobile and web applications independently runnable.
- Share tag data definitions and parsing contracts through the `tag` folder.
- Use Tailwind-based styling for consistent, responsive interfaces on Android and web.
- Make the web application deployable as a static site and the Android application available as an APK.

## Scope

### In scope for the first release

- Android-only mobile application.
- NFC permission and availability handling.
- Writing supported information to already NDEF-compatible MIFARE Classic NFC tags as exactly one NDEF URI record.
- Reading and parsing NDEF URI records from MIFARE Classic NFC tags with the mobile app.
- Validating MIFARE Classic tag compatibility, NDEF compatibility, lock state, and available capacity before writing.
- Confirming before overwriting an existing tag.
- Editing data after a mobile read and writing the updated NDEF URI record back to the same tag.
- Direct browser opening when a tag is scanned without the mobile app, with the native Android NFC notification providing an “Open in browser” action when automatic opening does not occur.
- JSON payload encoding and decoding with Base64URL and required raw DEFLATE-compressed minified JSON.
- `maxChar` validation for supported fields.
- Rendering supported email, phone, WhatsApp, social, and Spotify values as clickable links, including more than one Spotify album or playlist per tag.
- Accepting either a pasted profile/Spotify link or a plain username/ID, while storing only the extracted username or ID.
- Tag data definitions with `id`, `name`, `maxChar`, an optional platform link template, and an optional multi-value flag.
- Displaying parsed information in the Vite web application.
- Web landing page with app information and an APK download link.
- Shared types and parsing contracts in `tag/`.
- Tailwind-based styling for mobile and web.
- GitHub Pages deployment for the web application.
- GitHub Releases distribution for the Android APK.

### Out of scope for the first release

- iOS support.
- NFC tag families other than MIFARE Classic and tags with nominal capacity below 1K.
- User accounts and authentication.
- Cloud storage or synchronization.
- Server-side APIs.
- Tag history, analytics, and sharing accounts.
- Encryption or access control for sensitive tag contents.
- Privacy-warning UI in the MVP.

## Working assumptions

- The web application is initially a static Vite application deployed through GitHub Pages associated with the `https://github.com/bayu242/tag24` repository.
- The exact GitHub Pages parser URL must be configured and confirmed before production tags are written because it becomes part of every NDEF URI record.
- The current implementation may use a configurable dummy parser URL, including the repository URL, for development and testing only.
- The initial supported physical tag is an already NDEF-compatible MIFARE Classic tag with a minimum nominal capacity of 1K.
- Blank-tag NDEF formatting is out of scope for the first release.
- Actual usable NDEF capacity can be lower than the nominal capacity because of tag formatting and NDEF overhead, so the app must calculate the actual available NDEF capacity and final URL size before writing.
- The NFC tag stores exactly one NDEF URI record, not a raw JSON or Base64URL payload.
- The URI record contains the full absolute parser URL and a `d` query parameter carrying Base64URL-encoded raw DEFLATE-compressed minified JSON.
- Raw DEFLATE compression is required for every JSON payload in version 1; there is no plain Base64URL fallback or encoding flag.
- Android's system NFC handler can open the URI record directly in a browser when the tag is scanned without the mobile app. If it does not open automatically, the native Android NFC notification should provide an “Open in browser” action.
- The mobile app reads the NDEF URI record, extracts the query parameter from the full absolute URL, and uses the same decoder and validation contract as the web app.
- The full absolute URL is stored in the NDEF URI record; the app must not depend on NDEF URI prefix compression.
- Tag contents are public and unencrypted. Users are expected to understand that anyone with NFC or browser access can read a tag.
- The payload remains versioned so the format can evolve safely.

### Repository and parser URL

- Project repository: `https://github.com/bayu242/tag24`.
- The repository URL is not itself the production parser URL. Production NFC tags must use the exact GitHub Pages parser URL configured for the deployed web app.
- The current implementation may use a dummy parser URL, including the repository URL, for development and testing.
- Production tag writing must remain blocked until the exact GitHub Pages parser URL is configured and tested.

# 2. tech stack

## Core tooling

- **Bun:** Package management, scripts, and local package linking.
- **TypeScript:** Shared types, application code, and payload contracts.
- **Expo:** Android mobile application framework.
- **Vite:** Web application build tool and development server.
- **Tailwind CSS:** Utility-first styling for the Vite web application.
- **lucide-react:** Icon library for React-based interfaces.
- **NativeWind v4:** Mandatory Tailwind-compatible utility styling for the Expo Android application.
- **GitHub Pages:** Static deployment for the web application.
- **GitHub Releases:** Distribution of the Android APK.

## Application stack

### Mobile

- Expo Android application.
- Android NFC capability and permission handling.
- NFC library `react-native-nfc-manager`, latest stable version. GitHub repository: `https://github.com/revtel/react-native-nfc-manager`. The native module requires an Expo development build or prebuild.
- MIFARE Classic 1K compatibility detection, capacity validation, and NDEF URI record writing/reading.
- NativeWind/Tailwind utility classes for responsive and consistent mobile styling.
- Mobile UI for writing and reading NFC tags.

### Web

- Vite single-page application.
- Tailwind CSS for the landing page, reader, and responsive layouts.
- lucide-react for icons on the landing page, parser, and reader interfaces.
- Landing page content describing the app, its workflow, supported tag data, supported NFC tag, and Android APK download.
- Client-side `d` query parameter extraction, Base64URL decode, required raw DEFLATE inflation, JSON parse, `maxChar` validation, and clickable-link rendering, including one or more Spotify embeds for albums and playlists.
- URL query support for receiving encoded tag data from an NDEF URI record.

### Shared package

- `tag/` is a small shared TypeScript package.
- It owns the global `TagDataType` definitions, payload types, NDEF URI/query contract, raw DEFLATE and unpadded Base64URL codec contract, platform link templates, and the shared compression contract.
- `mobile/` and `web/` consume the shared package through `bun link` rather than converting the repository into a monorepo.

## Data flow

1. The mobile app verifies that the tag is an already NDEF-compatible MIFARE Classic tag with at least 1K nominal capacity and is not locked or password-protected.
2. The app checks whether the tag already contains data and asks for explicit confirmation before overwriting it.
3. The app selects one or more optional tag data definitions and validates each value against its `maxChar` limit.
4. The app calculates the complete parser URL, `d` query parameter, raw DEFLATE-compressed Base64URL payload, URL overhead, and NDEF size before writing.
5. The app creates a versioned JSON payload containing values keyed by tag data `id`.
6. The payload is minified, compressed with raw DEFLATE, and encoded with unpadded Base64URL.
7. The app builds the parser URL and places the encoded payload in the `d` query parameter.
8. The mobile app writes that URL as exactly one NDEF URI record to the NFC tag.
9. When a device scans the tag without the mobile app, Android opens the NDEF URI in the browser; if it does not open automatically, the native NFC notification provides an “Open in browser” action.
10. The web app extracts the `d` query parameter, decodes Base64URL, inflates raw DEFLATE, parses JSON, validates `maxChar`, and displays human-readable values and supported clickable links.
11. When the mobile app reads the tag, it extracts the same URL and query parameter, displays the decoded data, and provides an edit action that validates and writes the updated NDEF URI record back to the same tag.
12. The web landing page also provides app information and a manually maintained link to the current Android APK release.

# 3. folder structure

```text
repo/
├── mobile/
│   ├── app configuration and Expo source
│   ├── Android NFC screens and handlers
│   ├── MIFARE Classic compatibility and capacity checks
│   ├── NDEF URI record writer and reader
│   ├── edit-and-update flow
│   ├── NativeWind/Tailwind styling
│   └── mobile package configuration
├── web/
│   ├── Vite source
│   ├── landing page and APK download section
│   ├── query parameter parser and reader views
│   ├── clickable social and Spotify links, including multiple Spotify items
│   ├── Tailwind styling
│   └── web package configuration
├── tag/
│   ├── global TypeScript types
│   ├── tag data type definitions and link templates
│   ├── NDEF URI and query URL definitions
│   ├── payload format definitions
│   ├── raw DEFLATE and Base64URL codec contract
│   └── shared link construction helpers
├── docs/
│   └── PRD.md
└── package.json
```

## Folder responsibilities

- `mobile/` owns the Android user experience, NFC permissions, MIFARE Classic compatibility and capacity checks, overwrite confirmation, NDEF URI writing and reading, query extraction, raw DEFLATE/Base64URL decoding, link rendering, edit-and-update flow, and release build.
- `web/` owns the landing page, app information, manually maintained APK download link, home-path `d` query parsing, raw DEFLATE/Base64URL decoding, payload rendering, clickable links, Tailwind styling, and static deployment.
- `tag/` owns `TagDataType`, platform link templates, NDEF URI/query contracts, payload contracts, codec behavior, and the shared compression contract.
- `docs/PRD.md` records product requirements and decisions.
- The repository root contains shared scripts and workspace-level configuration where needed.

## Package linking

Each application should be able to run independently. The shared `tag` package is linked locally with Bun so both applications use the same data definitions, NDEF URI/query contract, payload contract, and codec behavior. Changes to `tag/` must be verified against both `mobile/` and `web/` before release.

# 4. feature

## 4.1 Mobile application

### Styling

- Use NativeWind/Tailwind utility classes for the Android interface.
- Keep spacing, typography, buttons, status messages, and form controls visually consistent with the web application.
- Support common Android screen sizes and orientations.

### NFC readiness

- Detect whether the Android device supports NFC.
- Request the required NFC permission before reading or writing.
- Explain why permission is needed.
- Show a clear unavailable state when NFC is not supported or enabled.

### Write tag

- Let the user select one or more optional supported `TagDataType` fields.
- Let the user add more than one value to a multi field (Spotify album or playlist); each multi field stores a list of values.
- Accept a pasted social or Spotify link as well as a plain username or ID. The field keeps showing what the user entered or pasted, but only the extracted username or ID is stored in the payload.
- Reject a pasted link that does not belong to the selected field, for example a Spotify link in a social field or an Instagram link in a Spotify field, with a clear message, and block the write until it is fixed.
- Validate each stored (extracted) value against the type's `maxChar` limit before writing. The Spotify `maxChar` is used by the system only and is not shown as a field warning.
- Detect whether the tag already contains data and require explicit confirmation before overwriting it.
- Verify that the tag is already NDEF-compatible, is MIFARE Classic, has at least 1K nominal capacity, and is not locked or password-protected.
- Calculate the complete parser URL, `d` query parameter, raw DEFLATE-compressed Base64URL payload, URL overhead, and NDEF size before writing.
- Apply raw DEFLATE compression to every minified JSON payload; there is no plain Base64URL fallback.
- Minify the JSON, compress it with raw DEFLATE, encode it with unpadded Base64URL, and build the parser URL with the encoded payload in the `d` query parameter.
- Write that URL as exactly one NDEF URI record to the NFC tag.
- Guide the user to place the device near the tag and confirm successful writes.
- Show recoverable errors for unsupported tags, insufficient capacity, locked tags, write failures, permission failures, URL construction failures, or interrupted operations.

### Read tag

- Let the user start a read operation.
- Detect and validate that the tag is a supported, already NDEF-compatible MIFARE Classic tag and is not locked or password-protected.
- Read the NDEF message and require exactly one valid URI record.
- Extract the parser URL and `d` query parameter.
- Decode Base64URL, inflate the required raw DEFLATE payload, parse the JSON, and validate the payload version, tag data `id` values, and `maxChar` constraints.
- Display the decoded information in the mobile app.
- Provide an edit action that lets the user modify the decoded data, revalidate it, confirm the overwrite, and write the updated NDEF URI record back to the same tag.
- Handle empty tags, unsupported tag families, locked tags, insufficient capacity, missing or multiple URI records, malformed URLs, malformed Base64URL, invalid raw DEFLATE data, invalid JSON, unknown data types, and cancelled reads.

### Direct browser opening

- The tag must contain exactly one valid NDEF URI record that stores the full absolute parser URL.
- The app must verify that the Android device supports NFC and that NFC is enabled before reading or writing.
- When a supported Android device scans the tag without the mobile app, the operating system should open the URI in the browser automatically.
- If automatic opening does not occur, the native Android NFC notification must provide an “Open in browser” action; this fallback is handled by the device NFC behavior rather than requiring the mobile app.
- The mobile app is required for writing, reading, editing, and updating tags, but it is not required for a user to open and view an already written tag.
- The mobile app should validate the same URL, query, raw DEFLATE, Base64URL, and NDEF contract before writing so direct browser opening works reliably.

## 4.2 Web application

### Landing page

- Explain what the NFC app does and who it is for.
- Describe the write, scan, read, edit, and update workflow.
- Explain that compatible tags store exactly one NDEF URI record and can open the browser directly.
- State that the initial supported tag is an already NDEF-compatible MIFARE Classic tag with a minimum nominal capacity of 1K.
- List the initial tag data fields, their limits, link templates, and the compact storage rules for social usernames and Spotify album/playlist IDs, including the ability to store more than one Spotify item.
- Provide a prominent Android APK download link that is manually updated for each GitHub Release.
- Use Tailwind CSS for a responsive and polished landing page.

### Parser and reader

- Read the encoded payload from the `d` URL query parameter.
- Decode Base64URL, inflate the required raw DEFLATE payload, and parse the JSON payload in the browser.
- Validate the payload against the shared `TagDataType` definitions and `maxChar` limits.
- Display each value using the corresponding `name` and its stored `id`.
- Render supported email, phone, WhatsApp, and social usernames as clickable links using the shared platform link templates.
- Render every Spotify album and playlist ID in a multi field as a clickable link, and embed each one with the official Spotify embed player.
- Provide a clear empty, loading, success, and error state.
- Support direct links created by NDEF URI records so a user can open a tag URL without installing the mobile app.

### Styling and accessibility

- Use Tailwind CSS for the landing page, parser, reader, buttons, forms, and error states.
- Work on common mobile and desktop browsers.
- Use readable typography and sufficient contrast.
- Make actions and error messages accessible to keyboard and screen-reader users.

## 4.3 Shared tag behavior

- Define each supported tag data type as `{ id, name, maxChar, linkTemplate?, multi? }`.
- Use `id` as a short, stable key in the encoded payload.
- Use `name` as the human-readable label in the mobile and web interfaces.
- Use `maxChar` validation before writing and after reading; do not enforce field format validation.
- When `multi` is `true`, the field stores a list of values; otherwise it stores a single value.
- Allow one tag to store any combination of optional fields, including multiple Spotify albums and playlists.
- Store only the values in the tag payload; keep the data-type metadata in the application registry to reduce tag size.
- Reduce a pasted social or Spotify link to its username or ID before storing it; accept a plain username or ID unchanged.
- Reject a link that belongs to a different platform than the field expects, for example an Instagram link in a Spotify field, a Spotify link in a social field, or an album link in the playlist field. A plain username or ID is always accepted.
- Apply the same extraction and link/field check when writing, when reading, and when validating, so a tag written from a link and a tag written from a username are identical and mismatched links can never be stored.
- Use minified JSON as the payload format, compress it with raw DEFLATE, and use unpadded Base64URL as the required transport encoding.
- Require raw DEFLATE compression for every version 1 payload; do not support a plain Base64URL variant.
- Wrap the encoded payload in the parser URL as the `d` query parameter.
- Store the complete parser URL in exactly one NDEF URI record on the NFC tag.
- Provide one deterministic URL, NDEF, parsing, codec, and link contract for mobile and web.
- Build clickable links by replacing `{value}` in the field's `linkTemplate` with the stored value.
- Reject unknown `id` values unless a future version explicitly defines how they should be handled.

## 4.4 MVP acceptance criteria

- A supported Android device can identify an already NDEF-compatible MIFARE Classic tag with at least 1K nominal capacity, verify that NFC is supported and enabled, and reject locked or password-protected tags.
- The mobile app rejects unsupported tag families and tags with insufficient available capacity before writing.
- The mobile app asks for explicit confirmation before overwriting an existing tag.
- A supported Android device can write exactly one valid NDEF URI record to a compatible MIFARE Classic tag.
- The NDEF URI record contains the full absolute parser URL and a Base64URL-encoded, raw DEFLATE-compressed minified JSON payload in the `d` query parameter.
- A supported Android device can scan the tag without the mobile app and automatically open the browser; if automatic opening does not occur, the native NFC notification provides an “Open in browser” action.
- The mobile app can read the NDEF URI record, decode the query payload, display the data, and provide an edit action that updates the same NFC tag after validation and confirmation.
- The web landing page explains the app, supported MIFARE Classic 1K requirement, initial data fields, and provides a manually maintained APK download link.
- The web parser displays decoded tag information and supported clickable social/Spotify links without requiring a backend or the mobile app.
- The mobile app can store more than one Spotify album or playlist on a single tag, and both the mobile app and the web parser display every stored item.
- Pasting a social or Spotify link and typing a plain username or ID produce the same stored value.
- A pasted link that does not belong to the field's platform is rejected with a clear error and cannot be written to the tag.
- Invalid tag types, NDEF records, URLs, Base64URL, raw DEFLATE data, JSON, unknown data types, mismatched links, and values exceeding `maxChar` produce clear errors instead of crashing.
- Mobile and web interfaces use Tailwind-based styling.
- The web build can be deployed to GitHub Pages.
- An Android APK can be produced and attached to a GitHub Release.

# 5. global tag types

The `tag/` package is the source of truth for tag data definitions, link templates, NDEF URI records, query URL contracts, payload contracts, and the raw DEFLATE/Base64URL codec. The first implementation should keep the contract small and versioned.

## Proposed types

```ts
export type TagPayloadVersion = "1";

export interface TagDataType {
  id: string;
  name: string;
  maxChar: number;
  linkTemplate?: string;
  /** When true, the field stores a list of values instead of a single value. */
  multi?: boolean;
}

export type TagDataTypeRegistry = Record<string, TagDataType>;

/** A stored field value: a single string, or a list for `multi` fields. */
export type TagValue = string | string[];

export type TagData = Record<string, TagValue>;

export interface TagPayload {
  version: TagPayloadVersion;
  data: TagData;
}

export type TagWirePayload = {
  v: TagPayloadVersion;
  d: string;
};

export type EncodedTagPayload = string;

export interface TagParserUrl {
  parserUrl: string;
  queryParam: "d";
  encodedPayload: EncodedTagPayload;
}

export interface TagNdefUriRecord {
  recordType: "uri";
  uri: string;
}

export interface TagParseError {
  code:
    | "EMPTY_PAYLOAD"
    | "INVALID_NDEF_URI"
    | "MULTIPLE_NDEF_URI_RECORDS"
    | "MISSING_QUERY_PARAM"
    | "INVALID_URL"
    | "INVALID_BASE64"
    | "INVALID_DEFLATE"
    | "INVALID_JSON"
    | "UNSUPPORTED_VERSION"
    | "UNKNOWN_DATA_TYPE"
    | "MAX_CHAR_EXCEEDED"
    | "LINK_MISMATCH"
    | "INVALID_DATA"
    | "TAG_LOCKED"
    | "INSUFFICIENT_CAPACITY";
  message: string;
}

export type TagParseResult =
  | { ok: true; value: TagPayload }
  | { ok: false; error: TagParseError };
```

## Contract rules

- Each `TagDataType` must have a unique, short, stable `id`.
- `name` is the human-readable label shown in the mobile and web applications.
- `maxChar` is a positive integer that limits the length of each stored value for that data type.
- `multi` is an optional boolean; when `true` the field stores a list of values and each entry must satisfy `maxChar`.
- `TagData` stores values using the corresponding `TagDataType.id` as the key. A single field stores a string; a `multi` field stores a string array.
- One tag may store any combination of optional fields, including more than one Spotify album or playlist.
- A single string value for a `multi` field is accepted when reading and normalized to a one-item list, so tags written before multi-value support keep working.
- Stored social and Spotify values contain only the username or ID; the extraction from a pasted link happens before the payload is built and is idempotent when reading.
- Tag data metadata is kept in the application registry and is not repeated inside every tag payload.
- The logical payload uses readable keys (`version` and `data`); the compact wire payload uses short keys (`v` and `d`) before JSON serialization.
- The current payload format is minified JSON compressed with raw DEFLATE.
- The required transport encoding is unpadded Base64URL.
- `d` always contains unpadded Base64URL-encoded raw DEFLATE bytes produced from minified JSON; no encoding flag is stored.
- The required codec pipeline is: `TagData` → minified JSON → raw DEFLATE → UTF-8 → unpadded Base64URL → full absolute parser URL `d` query parameter → exactly one NDEF URI record.
- Decoding uses the reverse pipeline: exactly one NDEF URI record → full absolute parser URL → `d` query parameter → Base64URL decode → raw DEFLATE inflate → UTF-8 → JSON parse → `maxChar` validation.
- The NFC tag stores the full absolute parser URL as exactly one NDEF URI record; it does not store a raw JSON or Base64URL payload.
- The `d` query parameter name is shared by the mobile app and web app through `tag/`.
- The NDEF URI record must be valid and open the deployed parser URL when scanned by a supported Android device without the mobile app.
- Only `maxChar` and structural payload validation are required; field format validation is intentionally not enforced.
- Email, phone, WhatsApp, social username fields, and each Spotify album or playlist item must be rendered as clickable links when a `linkTemplate` is defined.
- A `linkTemplate` uses the `{value}` placeholder, and the stored value replaces the placeholder without additional validation.
- The compression algorithm is raw DEFLATE, the Base64URL encoding is unpadded, and JSON keys are serialized in `initialTagDataTypes` order.
- Parse functions must return a structured success or error result rather than throwing unexpected errors.
- Invalid tag state, NDEF URI records, URLs, query parameters, Base64URL, raw DEFLATE data, JSON, unknown data types, and values exceeding `maxChar` must be rejected clearly.
- Decoders must remain backward-compatible with supported older payload versions; breaking changes require a new payload version.
- Version 1 is the first public payload format; the decoder supports version 1 and future versions through the `v` field.

## Initial TagDataType registry

The MVP starts with the following `TagDataType` definitions. The `id` values are short keys stored in the payload; the `name` values are display labels; `maxChar` is an average-use character limit chosen to keep the NDEF URI record small; `linkTemplate` builds a clickable link when the field is linkable; `multi` marks fields that store a list of values.

| `id` | `name` | `maxChar` | Link template | Multi | Storage rule |
| --- | --- | ---: | --- | --- | --- |
| `nm` | Name | 25 | — | — | Store the person's name as plain text. |
| `wa` | WhatsApp | 15 | `https://wa.me/{value}` | — | Store a WhatsApp phone identifier or number only. |
| `ph` | Phone Number | 15 | `tel:{value}` | — | Store a telephone number only. |
| `ad` | Address | 60 | — | — | Store the address as plain text. |
| `pet` | Pet Name | 20 | — | — | Store the pet's name as plain text. |
| `em` | Email | 40 | `mailto:{value}` | — | Store an email address only. |
| `ig` | Instagram | 20 | `https://instagram.com/{value}` | — | Store the Instagram username only. |
| `tw` | Twitter/X | 15 | `https://x.com/{value}` | — | Store the Twitter/X username only. |
| `th` | Threads | 20 | `https://www.threads.net/@{value}` | — | Store the Threads username only. |
| `fb` | Facebook | 30 | `https://facebook.com/{value}` | — | Store the Facebook username only. |
| `li` | LinkedIn | 30 | `https://linkedin.com/in/{value}` | — | Store the LinkedIn username only. |
| `yt` | YouTube | 20 | `https://youtube.com/@{value}` | — | Store the YouTube username only. |
| `tt` | TikTok | 20 | `https://tiktok.com/@{value}` | — | Store the TikTok username only. |
| `sp` | Spotify Playlist | 22 | `https://open.spotify.com/playlist/{value}` | Yes | Store one or more Spotify playlist IDs only, never the full playlist URL. |
| `sa` | Spotify Album | 22 | `https://open.spotify.com/album/{value}` | Yes | Store one or more Spotify album IDs only, never the full album URL. |
| `nt` | Note | 80 | — | — | Store a short plain-text note. |

The corresponding shared type definition is:

```ts
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
  { id: "sp", name: "Spotify Playlist", maxChar: 22, linkTemplate: "https://open.spotify.com/playlist/{value}", multi: true },
  { id: "sa", name: "Spotify Album", maxChar: 22, linkTemplate: "https://open.spotify.com/album/{value}", multi: true },
  { id: "nt", name: "Note", maxChar: 80 },
];
```

Social account values must contain only the username, and Spotify values must contain only the item ID. The platform is represented by the short `id`, so the payload does not need to repeat the platform name or store a full profile URL. The `sp` and `sa` fields are multi fields and store a list of IDs, so one tag can hold several Spotify playlists or albums. Email, phone, WhatsApp, social, and each Spotify item are rendered as clickable links using their `linkTemplate`. The stored value replaces the `{value}` placeholder without additional format validation.

These limits prioritize common values and minimize tag size. They are not intended to reproduce every platform's maximum allowed length. If a user needs a longer value, the app should show a clear limit message and ask the user to shorten or omit the field for the MIFARE Classic 1K MVP.

### Link construction policy

- Trim surrounding whitespace before storage.
- Enforce the `maxChar` limit for each stored value; do not enforce email, phone, or username format rules. The Spotify `maxChar` is a system limit on the extracted ID, not a warning shown on the field, because the field may display a longer pasted link.
- Accept either a full social/Spotify link or a plain username or ID. A link is reduced to its username or ID before storage; a plain username or ID is stored as typed.
- Reject a link whose platform does not match the field, and reject a Spotify link whose content type does not match (album vs. playlist). A mismatched link produces a clear error and blocks the write.
- The input field keeps showing what the user typed or pasted, so a pasted link stays visible while editing; the extraction and link check happen only when the payload is built.
- For a multi field, normalize every entry, drop empty values, and remove duplicates before storage.
- Build a clickable link only when the field has a `linkTemplate`.
- Replace the `{value}` placeholder in the template with the stored value.
- Email uses `mailto:`, phone uses `tel:`, WhatsApp uses `https://wa.me/`, social fields use their platform profile URL, and Spotify uses its playlist or album URL.

## MIFARE Classic 1K capacity

- The initial hardware target is an already NDEF-compatible MIFARE Classic tag with a minimum nominal capacity of 1K.
- The app must verify the tag family, NDEF compatibility, lock state, NFC enabled state, and available capacity before writing.
- The final size calculation must include the full absolute parser URL, `d` query parameter name, raw DEFLATE-compressed Base64URL payload, URL overhead, and NDEF record overhead.
- The app must read the tag's actual available NDEF capacity and reject the write if the final URL does not fit.
- No fixed safety margin is required; the app compares the calculated final size against the actual available NDEF capacity reported by the tag.
- The per-field `maxChar` values are average-use limits and do not guarantee that every field can be filled to its maximum at the same time.
- Each additional Spotify album or playlist in a multi field adds to the payload size, so the app counts every entry when estimating the final size.
- If the final NDEF URI record exceeds the available tag capacity, the mobile app must reject the write, show the estimated size problem, and ask the user to shorten or remove fields.
- The user should be guided to reduce long values, especially address and note, when capacity is insufficient.

## Data-size minimization recommendation

Base64URL is required for URL-safe query data, but it increases payload size by approximately 33 percent. The NDEF URI record also includes the full absolute parser URL and query overhead. Version 1 always applies raw DEFLATE to minified JSON before unpadded Base64URL encoding. To reduce the amount of data stored on each NFC tag:

1. Keep `TagDataType` metadata in the app registry instead of storing `{ id, name, maxChar, linkTemplate, multi }` on every tag.
2. Use short and stable `id` values as payload keys.
3. Use the short `d` query parameter name.
4. Store only the selected values in the payload, and store a `multi` field as a list of only the values the user added.
5. Use the average-use `maxChar` limits instead of platform maximums.
6. Store social values as usernames only and Spotify values as album/playlist IDs only, so a pasted link never inflates the tag.
7. Remove JSON whitespace through minification before encoding.
8. Compress every minified JSON payload with raw DEFLATE before Base64URL encoding.
9. Use unpadded Base64URL so the payload is safe inside a URL.
10. Store the full absolute URL in the NDEF URI record; do not depend on NDEF URI prefix compression.
11. For maximum size reduction in a future release, consider a binary format such as CBOR or MessagePack, but this adds dependency and debugging complexity.

Version 1 supports only raw DEFLATE-plus-Base64URL payloads. If the required compressed result does not fit the MIFARE Classic 1K tag, the app rejects the write and asks the user to shorten or remove fields.

# 6. deploy and release

## Web deployment

- Build the Vite application into a static output directory.
- Deploy the landing page and parser through GitHub Pages associated with `https://github.com/bayu242/tag24`.
- Confirm the exact GitHub Pages parser URL before writing production tags.
- Keep the landing page, app information, MIFARE Classic 1K support statement, initial TagDataType registry, parser, and APK download section in the static web build.
- Serve the parser from the home path: when the home URL contains the `d` query parameter, render the parser instead of the landing page.
- Manually update the APK download link for each GitHub Release because the web app is static.
- Keep Base64URL decoding, required raw DEFLATE inflation, JSON parsing, `maxChar` validation, and clickable-link rendering client-side unless a backend is added later.
- Verify the deployed landing page, parser, direct query URLs, and APK link after every release.

## Android release

- Produce a release APK locally from the Expo Android project.
- Start with version `1.0.0`.
- Attach the APK to a GitHub Release.
- Include the version number and release notes with each APK.
- Test the APK on at least one common Android version and the selected MIFARE Classic 1K tag before publishing.
- Test that the app can detect already NDEF-compatible MIFARE Classic tags, verify NFC support and enabled state, reject unsupported, locked, or insufficient-capacity tags, require overwrite confirmation, and write/read exactly one NDEF URI record.
- Test the edit-and-update flow after reading a tag.
- Keep debug and release build configuration separate.
- Confirm that the web landing page links to the newly published APK.

## Release workflow

1. Update the shared `tag/` contract if the payload format, query contract, data definitions, link templates, or codec behavior change.
2. Verify the initial `TagDataType` registry, each `maxChar` limit, link templates, and expected raw DEFLATE payload size against the actual MIFARE Classic 1K capacity.
3. Run type checks and builds for `tag/`, `mobile/`, and `web/`.
4. Test MIFARE Classic 1K detection, NDEF compatibility, NFC enabled state, lock-state rejection, capacity validation, overwrite confirmation, exactly-one NDEF URI writing, direct browser opening, native “Open in browser” fallback behavior, mobile reading, edit-and-update, raw DEFLATE/Base64URL decoding, `maxChar` validation, clickable links, pasted-link extraction, and multiple Spotify album/playlist storage with a physical tag.
5. Build and deploy the web application to GitHub Pages.
6. Confirm the exact GitHub Pages parser URL before publishing production tags.
7. Build the Android APK locally.
8. Create a GitHub Release and attach the APK.
9. Manually update the web landing page APK download link to the new release asset.
10. Verify the deployed web page, parser, direct query URLs, and APK download from a clean browser session.
11. Record payload compatibility changes, NDEF URI behavior, codec behavior, link templates, and tag capacity notes in the release notes.

## Known production blocker

- The exact GitHub Pages parser URL must be configured and tested before publishing production tags. The current implementation may use a dummy parser URL for development and testing.

# Tag24

Tag24 stores contact details, links, and notes on NFC tags. Write a tag once with the Android app, then anyone can read it by tapping their phone — the data opens in the browser, no app required.

The project is a small local-first system with no accounts, database, or server API. Each tag holds exactly one NDEF URI record pointing at the deployed web parser with the payload in the `d` query parameter.

## How it works

```
mobile app  ──writes──►  NDEF URI record  ──scan──►  browser opens parser URL
   │                                                        │
   └──────────── shared tag/ codec contract ────────────────┘
```

1. The Android app validates the tag (MIFARE Classic, NDEF-compatible, at least 1K, unlocked) and checks the payload fits.
2. It builds a versioned JSON payload, minifies it, compresses it with raw DEFLATE, and encodes it with unpadded Base64URL.
3. The encoded payload is placed in the `d` query parameter of the parser URL and written as one NDEF URI record.
4. Scanning the tag opens that URL in the browser. The web parser decodes it and renders the fields with clickable links, plus an embedded Spotify player for every stored album or playlist.
5. The mobile app can also read a tag, edit the decoded data, and write the updated record back.

For social and Spotify fields the app accepts either a pasted profile/Spotify link or a plain username/ID. The input keeps showing what you typed or pasted, but only the extracted username or ID is stored, so the tag stays small. A link that belongs to the wrong platform (for example a Spotify link in a social field, or an Instagram link in a Spotify field) is rejected with an error and blocks the write. Spotify album and playlist fields are multi-value: you can add more than one, and each is stored as a list.

See [`docs/PRD.md`](docs/PRD.md) for the full product requirements and [`docs/DESIGN.md`](docs/DESIGN.md) for the design system.

## Repository layout

```
tag24/
├── tag/       Shared TypeScript package: types, data definitions, codec, links
├── mobile/    Expo Android app (write / read / edit tags)
├── web/       Vite + React landing page and tag parser
├── docs/      Product and design documentation
└── .github/   GitHub Pages deployment workflow
```

| Package | Responsibility |
| --- | --- |
| `tag/` | Source of truth for `TagDataType` definitions, single- and multi-value payload types, the raw DEFLATE + Base64URL codec, link templates, size estimation, and value normalization. |
| `mobile/` | Android experience: NFC permission and availability handling, MIFARE Classic checks, capacity validation, overwrite confirmation, multi-value Spotify fields, pasted-link extraction, NDEF read/write, and the edit-and-update flow. |
| `web/` | Landing page plus the client-side parser that decodes `d` from the URL and renders human-readable fields, links, and Spotify embeds. |

`mobile/` and `web/` consume the shared `tag/` package through Bun's local linking rather than a monorepo tool. Changes to `tag/` must be verified against both apps.

## Prerequisites

- [Bun](https://bun.sh/) — package manager and scripts.
- [Android Studio](https://developer.android.com/studio) (with an emulator or a physical NFC device) — for the mobile app.
- A physical MIFARE Classic 1K NFC tag — required to test real reads and writes. NFC is not available on emulators.

## Setup

Link the shared `tag` package once, then install each app's dependencies.

```bash
# 1. Register the shared package locally
cd tag
bun install
bun link

# 2. Install the web app (resolves `tag` through the link)
cd ../web
bun install

# 3. Install the mobile app
cd ../mobile
bun install
```

> The `web` and `mobile` packages depend on `"tag": "link:tag"`, which resolves through the globally registered link from step 1. If `tag` cannot be resolved, re-run `bun link` inside `tag/`.

## Running

### Web

```bash
cd web
bun run dev       # Vite dev server
bun run build     # type-check + production build into web/dist
bun run preview   # preview the production build
bun run lint      # oxlint
```

### Mobile

The NFC native module requires an Expo development build or a prebuild — it does not run in Expo Go.

```bash
cd mobile
bun run android   # build and run on a connected device/emulator
bun run start     # start the Metro bundler
bun run typecheck # tsc --noEmit
bun run lint      # expo lint
```

### Shared package

```bash
cd tag
bun run typecheck
```

## Configuration

The parser URL is written into every NFC tag and becomes part of its NDEF record. It is defined in [`mobile/src/lib/config.ts`](mobile/src/lib/config.ts) as `PARSER_URL`, and the web app reads tag payloads from the `d` query parameter on its own origin.

> **Production blocker:** confirm the exact GitHub Pages parser URL before writing production tags. Tags written with the wrong URL will open the wrong page. The current value may be a development/dummy URL.

The APK download link on the landing page is maintained manually in [`web/src/lib/site.ts`](web/src/lib/site.ts) (`APK_URL`) and must be updated for each release.

## Building and releasing

### Web → GitHub Pages

The [`deploy-web.yml`](.github/workflows/deploy-web.yml) workflow builds `web/` and deploys it to GitHub Pages on pushes to `main` that touch `web/`, `tag/`, or the workflow itself. It can also be run manually from the Actions tab.

### Android APK → GitHub Releases

1. Build the release APK locally from the Expo Android project.
2. Create a GitHub Release for the version (starting at `1.0.0`) and attach the APK.
3. Update `APK_URL` in [`web/src/lib/site.ts`](web/src/lib/site.ts) to point at the new release asset.

The full release checklist lives in [`docs/PRD.md`](docs/PRD.md#6-deploy-and-release).

## Tech stack

- **Bun** — package management, scripts, and local package linking.
- **TypeScript** — shared types and application code.
- **Expo + React Native + NativeWind v4** — Android app with Tailwind-style utility classes.
- **Vite + React + Tailwind CSS v4** — web landing page and parser.
- **lucide-react** (web) / Feather (mobile) — icons.
- **fflate** — raw DEFLATE compression in the shared codec.
- **GitHub Pages / GitHub Releases** — static web deployment and APK distribution.

## License

[MIT](LICENSE)

# web

The Tag24 web application: a static Vite + React single-page site that serves two roles from the same entry point.

- **Landing page** (`/`) — explains the product, the write/scan/read/edit workflow, supported fields, and the supported MIFARE Classic 1K tag, and links to the Android APK.
- **Parser** (`/?d=<payload>`) — decodes the `d` query parameter written to an NFC tag and renders the stored fields with clickable links, plus an embedded Spotify player for every stored album or playlist. This is the URL stored in every tag's NDEF URI record, so it must work without the mobile app.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- `lucide-react` icons
- `tag` — the shared workspace package for types, codec, and link construction

## Run

From the repository root, make sure the shared package is linked first (see the root [README](../README.md#setup)):

```bash
cd tag && bun install && bun link
cd ../web && bun install
```

Then:

```bash
bun run dev       # dev server at http://localhost:5173
bun run build     # type-check + production build into dist/
bun run preview   # preview the production build
bun run lint      # oxlint
```

## Structure

```
web/
├── index.html
├── style.css                  Tailwind entry + brand design tokens (@theme)
├── vite.config.ts             base path, tag package resolution
└── src/
    ├── App.tsx                routes to LandingPage or ParserPage by `d`
    ├── LandingPage.tsx        landing page composition
    ├── sections/              Hero, HowItWorks, Fields, BrowserOpening, SupportedTag, Download
    ├── parser/                ParserPage, StatusCard, TagResult
    ├── components/            Nav, Footer, Button, Container, LanguageSwitch, TagPreviewCard
    ├── i18n/                  English + Bahasa Indonesia
    └── lib/site.ts            repo/APK URLs, sample data, nav links
```

## Deployment

The app is built as a static site and deployed to GitHub Pages under the `/tag24/` base path by [`deploy-web.yml`](../.github/workflows/deploy-web.yml). `vite.config.ts` sets `base: "/tag24/"` for production builds and previews, and `/` for local development.

The APK download link is static and maintained manually in [`src/lib/site.ts`](src/lib/site.ts) (`APK_URL`); update it for each GitHub Release.

## Notes

- The parser runs entirely client-side: Base64URL decode, raw DEFLATE inflate, JSON parse, and `maxChar` validation all use the shared `tag` package.
- The supported `TagDataType` registry, link templates, and codec contract live in `tag/`, not here. Update them there and verify both apps.

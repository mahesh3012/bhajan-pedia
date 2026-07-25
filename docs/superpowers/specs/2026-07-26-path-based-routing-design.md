# Path-based routing driven by the sheet

**Date:** 2026-07-26
**Status:** Approved

## Problem

Navigation is single-route and React-state based. Two failures result when a
link is shared or a page is refreshed:

1. **State loss** — `selectedBhajan` / `selectedCategory` live only in memory, so
   `…/bhajan-pedia/bhajan` opens with no selection and renders nothing useful.
2. **No SPA fallback on GitHub Pages** — GitHub Pages serves a static file per
   URL. Only `…/bhajan-pedia/` maps to a real `index.html`; any deeper path
   returns GitHub's own 404 and the React app never boots. This is the main
   cause of "nothing loads" on deep links.

Both must be fixed together.

## Decisions

- **URL scheme:** clean readable paths via `BrowserRouter`.
  - Deity index: `/bhajan-pedia/ganesh`
  - Bhajan: `/bhajan-pedia/ganesh/1-gananayakaya-gandaivtaya`
  - The leading number is the real key; the title slug is cosmetic and may
    change without breaking old links.
- **GitHub Pages fallback:** build-time `404.html` that is a copy of
  `index.html`. GitHub serves it on any unmatched path without changing the URL,
  so `BrowserRouter` reads the real path and routes correctly.
- **Root `/bhajan-pedia`** redirects to the first deity's index (matches the
  current auto-select behavior); no separate welcome page.
- **Catalog** held in React context, fetched once — no refetch per navigation,
  no prop-drilling.
- **No test files** (per owner request).

## Catalog model (built once from the index sheet)

```
deities: [{
  slug: "ganesh", rawCategory: "Ganesh (G1)", gid: "1497354605",
  deva: "गणेश", roman: "Ganesh", epithet: "विघ्नहर्ता",
  bhajans: [{ n: 1, slug: "gananayakaya-gandaivtaya",
              deva: "गणनायकाय…", roman: "Gannayakaya…",
              rawTitle: "गणनायकाय गणदेवताय (Gannayakaya GanDaivtaya)" }, …]
}]
```

Plus lookups: `deityBySlug`, `bhajan(deitySlug, n)`. The search index is derived
from this same catalog (removes the current Home-vs-search row inconsistency).

`n` = a bhajan's 1-based position within its deity column — the value the
per-deity lyric sheets already key on (matches today's working lyric lookup).

## Slug rules (data-driven, collision-safe)

- **Deity slug** = slugify(roman name, sheet code stripped). Devanagari-only
  deities with no roman fall back to a compact Devanagari→Latin transliteration
  (e.g. गोदम्मा → `godamma`). Uniqueness enforced at build time (suffix `-2` on
  collision). The slug is the deity's key.
- **Bhajan segment** = `<n>-<slug>`, slug = slugify(roman) (omitted when a title
  has no roman → just `<n>`). Resolved by parsing the leading integer `n`.

## Routes (basename = `/bhajan-pedia`, from `process.env.PUBLIC_URL`)

| Path | Page |
|---|---|
| `/` | redirect → first deity index |
| `/:deitySlug` | DeityPage — the bhajan index |
| `/:deitySlug/:bhajanRef` | BhajanPage — parse `n`, fetch lyrics via `gid`+`n` |
| `*` | themed NotFound |

## States & error handling

- `catalog.loading` → themed "opening the songbook" loader; deep links boot and
  resolve after the single fetch.
- Unknown deity slug or out-of-range `n` → themed not-found (reuses pothi/state
  styling) with a link back.
- All `selected*` / `gidMap` state and `data-*` attribute passing are removed.
  Navbar deity items and search results become `<Link>`s; active state from
  `useParams`.

## Files

- `src/context/CatalogProvider.jsx` (new) — fetch + build catalog, expose via
  context + `useCatalog()`.
- `src/utils/catalog.js` (new) — pure builders: `slugify`, transliteration
  fallback, `buildCatalog(csvData)`, `parseBhajanRef`.
- `src/utils/text.js` — reused (`deityLabel`, `splitBhajan`).
- `src/App.js` — slim to Provider + Router + Routes.
- `src/pages/Home` → `src/pages/DeityPage` (index view, link-based).
- `src/pages/Bhajan` → `BhajanPage` (resolve params, fetch lyrics).
- `src/components/Navbar.jsx` — `<Link>`s, active via route.
- `src/pages/NoPage.jsx` — reused/extended for not-found.
- `package.json` — add `"postbuild": "cp build/index.html build/404.html"`.

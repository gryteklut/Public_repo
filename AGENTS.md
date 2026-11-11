# Agent handoff — Public_repo hub + AB-650 portal

Read this first before changing the site.

## What this repo is

Public GitHub Pages site for Kim (`gryteklut`):

- **Hub (Astro):** `https://gryteklut.github.io/Public_repo/`
- **AB-650 study portal:** `https://gryteklut.github.io/Public_repo/AB-650/`
- Root `/` is reserved for a growing hub. Do **not** put a redirect from `/` to AB-650.
- Other folders (`EntraID/`, `Intune/`, `Migration/`) are reference material, not part of the Pages build.

## Stack

| Piece | Location | Notes |
| --- | --- | --- |
| Astro site | `web/` | Astro 7 + `@astrojs/react` |
| Base path | `web/astro.config.mjs` | `base: '/Public_repo'`, `site: 'https://gryteklut.github.io'`, `trailingSlash: 'always'` |
| Hub page | `web/src/pages/index.astro` | Static hub listing tools |
| AB-650 UI | `web/src/components/ab650/*` | React islands (`client:load`) |
| Curriculum | `web/src/data/curriculum.ts` | Official AB-650 skills-oriented content |
| Udemy map | `web/src/data/udemyMap.ts` | Watch / Skim / Skip for ms100course |
| Progress | `web/src/lib/progress.ts` + `useProgress` | `localStorage` key `ab650-portal-progress-v1` |
| Deploy | `.github/workflows/deploy-ab650-portal.yml` | Builds `web/`, uploads `web/dist` to Pages |

Legacy Vite app under `ab-650-portal/` is **deprecated** (replaced by Astro). Do not deploy it.

## Product rules (AB-650)

- UI + questions in **English**
- Learn-first: expandable **Study this topic** above each question (open by default except practice day)
- Checkbox **Mark module complete** unlocks only when **all** control questions are correct
- Tags: `MS-102-core`, `MS-102-updated`, `AB-650-new`
- Udemy companion panel on day/module pages
- Progress export/import JSON (multi-device; no shared backend)

## Local development

```bash
cd web
npm ci
npm run dev
```

Open the printed local URL. Paths are under `/Public_repo/...` because of `base`.

```bash
npm run build
npm run preview
```

## Deploy

Push/merge to `main` triggers Pages deploy when `web/**` or the workflow file changes.

One-time Pages setting (already done): Source = **GitHub Actions**.

Live checks:

- Hub: `https://gryteklut.github.io/Public_repo/`
- Portal: `https://gryteklut.github.io/Public_repo/AB-650/`

## Editing content

1. **Curriculum / questions:** `web/src/data/curriculum.ts`
2. **Udemy section map:** `web/src/data/udemyMap.ts` (keyed by module id)
3. **Hub cards:** `web/src/pages/index.astro`
4. **Styles:** hub in `BaseLayout.astro`; portal in `web/src/styles/ab650.css`

Every question should keep `studyContent`, `explanation`, `sourceUrl`, `sourceLabel`.

## Git / access notes for agents

- Cursor GitHub App may only have write access to some repos. For `Public_repo`, a fine-grained PAT secret named `public_repo` has been used when the App lacked push rights.
- Prefer a feature branch `cursor/<desc>-947a`, PR, then merge.
- Never commit secrets or paste PATs into chat/files.

## Out of scope (for now)

- LearnHouse / Docker LMS (needs a server; not GitHub Pages)
- Shared multi-user progress DB
- Scraping Udemy course content

## Suggested next improvements

- Grow hub with more cards/tools under new paths
- Optionally convert study text to MDX content collections
- Keep AB-650 interactive bits as React islands

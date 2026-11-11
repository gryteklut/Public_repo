# Agent handoff — Public_repo hub + AB-650 portal

Read this first before changing the site.

## What this repo is

Public GitHub Pages site for Kim (`gryteklut`):

- **Hub (Astro + Mainline theme):** `https://gryteklut.github.io/Public_repo/`
- **AB-650 study portal:** `https://gryteklut.github.io/Public_repo/AB-650/`
- Root `/` is reserved for a growing hub. Do **not** put a redirect from `/` to AB-650.
- Other folders (`EntraID/`, `Intune/`, `Migration/`) are reference material, not part of the Pages build.

## Stack

| Piece | Location | Notes |
| --- | --- | --- |
| Astro site | `web/` | **Mainline** theme (shadcnblocks) + Astro + React + Tailwind 4 + shadcn/ui |
| Theme upstream | [mainline-astro-template](https://github.com/shadcnblocks/mainline-astro-template) | MIT; keep attribution in footer |
| Base path | `web/astro.config.mjs` | `base: '/Public_repo'`, `site: 'https://gryteklut.github.io'`, `trailingSlash: 'always'` |
| Hub page | `web/src/pages/index.astro` | Mainline Hero + Tools cards |
| Theme chrome | `web/src/components/blocks/*` | Navbar, Footer, Hero, Tools |
| AB-650 UI | `web/src/components/ab650/*` | React islands (`client:load`) on shadcn primitives |
| Curriculum | `web/src/data/curriculum.ts` | Official AB-650 skills-oriented content |
| Udemy map | `web/src/data/udemyMap.ts` | Watch / Skim / Skip for ms100course |
| Progress | `web/src/lib/progress.ts` + `useProgress` | `localStorage` key `ab650-portal-progress-v1` |
| Deploy | `.github/workflows/deploy-ab650-portal.yml` | Builds `web/`, uploads `web/dist` to Pages |

Legacy Vite app under `ab-650-portal/` is **deprecated** but **kept in-repo for revert**. Do not deploy it unless rolling back — see `ab-650-portal/DEPRECATED.md`.

## Product rules (AB-650)

- UI + questions in **English**
- **Day overview is the workspace:** quiz box inline + Microsoft Learn + SkillsUp sidebar (inspiration: classroom lesson plan UI)
- **Learning method — successive relearning / retrieval practice:** day quiz is retrieval-first (try before study); study opens after misses; correct answer choice stays hidden until criterion; spaced review due dates after mastery (`reviewDueAt`, intervals 2→4→7 days)
- Full module view keeps learn-first option for deeper encoding + Udemy/labs
- Checkbox **Mark module complete** unlocks only when **all** control questions are correct
- Tags: `MS-102-core`, `MS-102-updated`, `AB-650-new`
- Progress export/import JSON (multi-device; no shared backend)
- SkillsUp map: `web/src/data/skillsUpMap.ts`; relearning helpers: `web/src/lib/relearning.ts`

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

Always prefix internal links with `withBase()` from `web/src/lib/base.ts`.

## Deploy

Push/merge to `main` triggers Pages deploy when `web/**` or the workflow file changes. Manual run: **Deploy Public_repo hub (Astro)** (`workflow_dispatch`).

Live checks:

- Hub: `https://gryteklut.github.io/Public_repo/`
- Portal: `https://gryteklut.github.io/Public_repo/AB-650/`

## Editing content

1. **Curriculum / questions:** `web/src/data/curriculum.ts`
2. **Udemy section map:** `web/src/data/udemyMap.ts` (keyed by module id)
3. **Hub cards:** `web/src/components/blocks/tools.tsx` (+ hero copy in `hero.tsx`)
4. **Theme / chrome:** `web/src/components/blocks/navbar.tsx`, `footer.tsx`
5. **Tokens:** `web/src/styles/global.css` (Mainline / shadcn CSS variables)

Every question should keep `studyContent`, `explanation`, `sourceUrl`, `sourceLabel`.

## Git / access notes for agents

- Cursor GitHub App may only have write access to some repos. For `Public_repo`, a fine-grained PAT secret named `public_repo` has been used when the App lacked push rights.
- Prefer a feature branch `cursor/<desc>-947a`, PR, then merge.
- Never commit secrets or paste PATs into chat/files.

## Out of scope (for now)

- LearnHouse / Docker LMS (needs a server; not GitHub Pages)
- Shared multi-user progress DB
- Scraping Udemy course content
- Paid shadcnblocks All Access templates (Mainline free MIT is enough)

## Suggested next improvements

- Add more hub tool cards under new paths
- Optionally pull extra blocks via shadcn CLI from shadcnblocks
- Keep AB-650 interactive bits as React islands

# Agent handoff — Public_repo hub + courses platform

Read this first before changing the site.

## What this repo is

Public GitHub Pages site for Kim (`gryteklut`):

- **Hub (Astro + Mainline theme):** `https://gryteklut.github.io/Public_repo/`
- **Courses catalog:** `https://gryteklut.github.io/Public_repo/courses/`
- **AB-650 course:** `https://gryteklut.github.io/Public_repo/courses/ab-650/`
- Legacy `/AB-650/…` URLs **redirect** to `/courses/ab-650/…`
- Root `/` is reserved for the hub. Do **not** redirect `/` to a course.
- Other folders (`EntraID/`, `Intune/`, `Migration/`) are reference material, not part of the Pages build.

## Stack

| Piece | Location | Notes |
| --- | --- | --- |
| Astro site | `web/` | **Mainline** theme (shadcnblocks) + Astro + React + Tailwind 4 + shadcn/ui |
| Theme upstream | [mainline-astro-template](https://github.com/shadcnblocks/mainline-astro-template) | MIT; keep attribution in footer |
| Base path | `web/astro.config.mjs` | `base: '/Public_repo'`, `site: 'https://gryteklut.github.io'`, `trailingSlash: 'always'` |
| Hub page | `web/src/pages/index.astro` | Mainline Hero + Tools cards |
| Courses UI | `web/src/components/courses/*` | Catalog, landing, day player islands |
| Course content | `web/src/content/courses/<slug>/` | Content Collections (`courses`, `courseDays`) |
| Knowledge checks | `starlight-quiz` (standalone) | MDX `<Quiz>`; gate complete on `starlight-quiz:progress` score 100 |
| Spaced review | `ts-fsrs` via `lib/courseProgress.ts` | FSRS cards after day mastery |
| Search | `astro-pagefind` | Indexes the static build |
| Progress | `lib/courseProgress.ts` | Keys `courses:<code>:v1` + bundle; migrates `ab650-portal-progress-v1` |
| Deploy | `.github/workflows/deploy-ab650-portal.yml` | Builds `web/`, uploads `web/dist` to Pages |

Legacy Vite app under `ab-650-portal/` is **deprecated** but **kept for revert**. Do not deploy it unless rolling back — see `ab-650-portal/DEPRECATED.md`.

Legacy React portal under `web/src/components/ab650/` and `web/src/data/*` remains as reference; live routes use `/courses/`.

## Eye-friendly UI (required)

Long study sessions: prefer soft contrast over pure white/black.

- Light: cool soft-stone page (`--background`), charcoal ink (`--foreground` ~oklch 0.30), soft olive highlight (`--course-highlight`)
- Dark: **dark grey** surfaces (not near-black), soft off-white text — never `#000` / `#fff` pairs
- Course surfaces use `.course-shell`, `.course-card`, `.course-pill` in `web/src/styles/global.css`
- Reading body: ~1.7 line-height, ~65ch measure (`.prose-course`)
- Microsoft Learn **courses/paths/modules** (`kind: course`) only when they map to the day’s skills and the cert — prefer AB-650 Learn paths; add SC-300/SC-401 only for identity/Purview AI days

## Product rules (courses / AB-650)

- UI + questions in **English**
- **Day player layout** mirrors the sweet module view: Watch checklist (persisted), study resources + lab checklist, TL;DR / exam trap, knowledge check, Learn/SkillsUp sidebar (`LessonPlan`)
- Prefer exact Udemy lecture titles in watch checklists (not fragile `3.xx` numbers)
- **Mark day complete** unlocks only when knowledge-check score is **100%**
- Progress export/import is one JSON bundle for all courses
- Tags: `MS-102-core`, `MS-102-updated`, `AB-650-new`

## Adding a new course

```bash
cd web
npm run new-course -- md-102 "Endpoint Administrator"
# edit src/content/courses/md-102/course.yaml and days/*.mdx
npm run build
```

No route code changes — the hub and `/courses/` read `course.yaml` (`_template` is ignored). Set `hasLabs: true` only when `/courses/<slug>/labs/` exists.

`external` on `course.yaml` is the non-Microsoft intro (shown on the hub card and the course page). Default instructor for a new course is **John Christopher** ([Udemy profile](https://www.udemy.com/user/john-christopher-32/)). Set `provider`, `title`, and the course `url` with no coupon query. Put exact lecture titles in each day's `videos` list for the watch checklist.

Plan / brief: `docs/courses/courses-platform-plan.md`.

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
- Courses: `https://gryteklut.github.io/Public_repo/courses/`
- AB-650: `https://gryteklut.github.io/Public_repo/courses/ab-650/`

## Editing content

1. **Course + days:** `web/src/content/courses/<slug>/`
2. **Schema:** `web/src/content.config.ts`
3. **Hub cards:** generated from each `course.yaml` (hero copy in `hero.tsx`)
4. **Theme / chrome:** `web/src/components/blocks/navbar.tsx`, `footer.tsx`
5. **Tokens / readability:** `web/src/styles/global.css`

## Git / access notes for agents

- Cursor GitHub App may only have write access to some repos. For `Public_repo`, a fine-grained PAT secret named `public_repo` has been used when the App lacked push rights.
- Prefer a feature branch `cursor/<desc>-947a`, PR, then merge.
- Never commit secrets or paste PATs into chat/files.

## Out of scope (for now)

- LearnHouse / Docker LMS (needs a server; not GitHub Pages)
- Shared multi-user progress DB
- Scraping Udemy course content
- Paid shadcnblocks All Access templates (Mainline free MIT is enough)

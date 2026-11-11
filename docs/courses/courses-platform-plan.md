# Courses platform: implementation brief

**Repo:** `gryteklut/Public_repo` · **Site:** `web/` (Astro + Mainline + shadcn/ui + Tailwind 4) · **New path:** `/Public_repo/courses/`
**Design target:** `docs/courses/courses-prototype.html` if present (single-file clickable prototype); otherwise follow sections 4–5 below.

## 1. Goal

Turn the AB-650 portal into a **reusable course engine**. Adding a new topic (MD-102, SC-300, Intune, etc.) should mean **adding a content folder, with no code changes**. The UI should feel like Udemy (catalog and course landing) and Pluralsight (dark lesson player with a sidebar curriculum).

## 2. Reuse open source; don't rebuild

| Need | Reuse | Licence | Why |
|---|---|---|---|
| Site shell, hub, theme | **Keep the current Mainline Astro theme** | MIT | Already deployed. `/courses` goes inside it. |
| Course and day pages | **Astro Content Collections** (built in) | MIT | Zod-validated frontmatter. One folder per course. |
| Knowledge checks | **`starlight-quiz`** used *standalone* (no Starlight needed) | Apache-2.0 | Markdown task-list syntax, instant feedback, explanations, localStorage, `starlight-quiz:progress` event (use it to gate "Mark day complete"). |
| Spaced review | **`ts-fsrs`** | MIT | Replaces the hand-rolled 2→4→7 intervals in `lib/relearning.ts` with FSRS scheduling. |
| Site search | **Pagefind** (`astro-pagefind`) | MIT | Static full-text search across all courses. No server needed. |
| Pattern reference only | `limjonathan/courseware-as-code`, `casoon/knowledge-core` | MIT | Read for ideas on progress stores and course layout. Don't vendor them in; both are young projects. |

Out of scope (unchanged from AGENTS.md): LMS servers (Moodle, LearnHouse, Open edX), shared progress database, and paid themes.

## 3. Content model (reusable per topic)

```
web/src/content/courses/
  _template/                 # copy this to start a new course
    course.yaml
    days/01-example.mdx
  ab-650/
    course.yaml
    days/01-tenant-foundations.mdx … 10-mixed-practice.mdx
  md-102/                    # future
```

**course.yaml**
```yaml
code: AB-650
title: Administering Microsoft 365 and AI Services
subtitle: Ten 60-minute days built on retrieval practice and successive relearning.
level: Intermediate
status: live            # live | soon | draft
color: "#5b4bff"
tags: [MS-102-core, MS-102-updated, AB-650-new]
learn:                  # "What you'll learn" box
  - Run tenant, licensing and workload admin with Copilot in mind
outOfScope: Skip hybrid Entra Connect sync troubleshooting …
```

**days/01-tenant-foundations.mdx**
```mdx
---
day: 1
title: Tenant foundations
minutes: 60
practice: false
tags: [MS-102-core, AB-650-new]
focus: Branding, domains, org settings, licensing, service health.
resources:
  - { label: AB-650 study guide, url: https://learn.microsoft.com/... }
videos:                 # optional, e.g. Udemy sections (Watch/Skim/Skip)
  - { label: "Section 3: Tenant setup", action: watch }
lab:
  - Admin center → Settings → Org settings …
tldr:
  - Sign-in branding lives in Entra (Company branding) …
trap: Exam loves portal selection.
---
import { Quiz } from 'starlight-quiz/components';

<Quiz id="ab650-d1-q1" title="Company branding">
You need company branding on the Microsoft 365 sign-in. Where do you configure it?

- [x] Microsoft Entra admin center: Company branding
- [ ] Exchange admin center: Organization
- [ ] Microsoft Purview portal: Settings

Sign-in branding is configured in Entra ID. [Source](https://learn.microsoft.com/...)
</Quiz>
```

Schema lives in `web/src/content.config.ts` (`courses` and `days` collections, Zod). Builds fail on bad content.

## 4. Routes

| Route | Page | Style |
|---|---|---|
| `/courses/` | Catalog: hero, "Continue learning" strip, course cards with progress, search, "Coming soon" cards | Udemy home |
| `/courses/[course]/` | Landing: dark hero, "What you'll learn", accordion curriculum with status icons, sticky progress card (Start/Continue, export/import) | Udemy course page |
| `/courses/[course]/day-[n]/` | Player: dark left sidebar curriculum and progress; tabs **Overview · Resources · Lab · TL;DR · Knowledge check**; completion bar; prev/next | Pluralsight player |
| `/AB-650/…` | Redirect to `/courses/ab-650/…` so old links keep working | — |

The hub (`/`) gets a "Courses" card. Keep `trailingSlash: 'always'` and `withBase()` for every link.

## 5. Day page behaviour

- **Overview:** a 4-step plan (Read → Do → Review → Prove). Each card shows its status, plus the tags and the exam trap.
- **Resources:** links and the optional video map (Udemy Watch/Skim/Skip, Learn/SkillsUp). Has a "Mark as read" button.
- **Lab:** a checklist. The state persists.
- **TL;DR:** 3–5 numbered key points and an "Exam trap" callout.
- **Knowledge check:** `<Quiz>` blocks with a score ring. Listen to `starlight-quiz:progress` and enable **Mark day complete** only when `score === 100`. After mastery, create the FSRS card and show "Review due" on the catalog and landing pages.
- **Practice days** (`practice: true`) open on the Knowledge check tab.

## 6. Progress (generic)

- `lib/progress.ts` uses one key per course, `courses:<code>:v1`, which stores `{ done, steps, review, last }`. Quiz answers stay in starlight-quiz's own storage.
- Run a one-time migration from `ab650-portal-progress-v1`.
- Export and import cover all courses in one JSON file.

## 7. Components (`web/src/components/courses/`)

`CourseCard` · `CourseHero` · `CurriculumAccordion` · `ProgressCard` (island) · `PlayerSidebar` · `DayTabs` (island) · `StepPlan` · `ResourceList` · `LabChecklist` (island) · `TldrList` · `TrapCallout` · `CompletionBar` (island, listens to the quiz events) · `ReviewDue` (island, ts-fsrs). Build on the existing shadcn primitives (Button, Badge, Progress, Tabs, Accordion, Card).

## 8. Adding a new topic later

1. `cp -r web/src/content/courses/_template web/src/content/courses/md-102`
2. Edit `course.yaml` and add `days/NN-*.mdx`.
3. Commit. GitHub Actions builds and deploys, and the catalog picks it up automatically.

Optional: `npm run new-course -- md-102 "Endpoint Administrator"` (a small Node scaffold script).

## 9. Migration steps

1. Add the deps: `starlight-quiz`, `ts-fsrs`, `astro-pagefind`.
2. Create the collections and schema.
3. Write `scripts/migrate-curriculum.ts` to convert `src/data/curriculum.ts`, `udemyMap.ts` and `skillsUpMap.ts` into `content/courses/ab-650/**`. Each question becomes a `<Quiz>` with `explanation`, `sourceUrl` and `studyContent` (the studyContent goes into a collapsible "Study" block under the quiz).
4. Write a TL;DR (3–5 points) and an exam trap for each day, derived from the existing `studyContent`.
5. Build the pages and components per sections 4–7.
6. Add the `/AB-650/` redirects, the hub card and the Pagefind search.
7. Update `AGENTS.md` (new content model and the "add a course" steps). Leave `ab-650-portal/` untouched as the rollback path.
8. Verify: `npm run build`. Check every route under `/Public_repo/courses/`, check that the quiz gates completion, check export/import, and check mobile layout.

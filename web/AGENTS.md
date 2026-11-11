# Agent notes — `web/` (Astro app)

**Start with the repo-root guide:** [`../AGENTS.md`](../AGENTS.md)

That file covers product rules, URLs, deploy, curriculum edit points, and access notes.

## This folder

Astro 7 + React islands for the public hub and AB-650 portal.

| Path | Role |
| --- | --- |
| `src/pages/index.astro` | Hub at `/` |
| `src/pages/AB-650/**` | Portal routes under `/AB-650/` |
| `src/components/ab650/*` | Interactive React UI |
| `src/data/curriculum.ts` | Course + questions |
| `src/data/udemyMap.ts` | Udemy Watch/Skim/Skip |
| `astro.config.mjs` | `base: '/Public_repo'`, trailing slash always |

## Commands

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Astro docs: https://docs.astro.build

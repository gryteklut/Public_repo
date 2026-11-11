# Agent notes — `web/` (Mainline Astro theme)

**Start with the repo-root guide:** [`../AGENTS.md`](../AGENTS.md)

## This folder

Based on [Mainline Astro](https://github.com/shadcnblocks/mainline-astro-template) (shadcn/ui, Tailwind 4, React islands).

| Path | Role |
| --- | --- |
| `src/pages/index.astro` | Hub at `/` |
| `src/pages/AB-650/**` | Portal routes under `/AB-650/` |
| `src/components/blocks/*` | Mainline chrome (navbar, hero, footer, tools) |
| `src/components/ui/*` | shadcn primitives |
| `src/components/ab650/*` | Study portal React UI |
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

Use `withBase()` for every internal href.

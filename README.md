# Public_repo

Public GitHub Pages hub and tools.

## Live site

- **Hub:** https://gryteklut.github.io/Public_repo/
- **AB-650 Study Portal:** https://gryteklut.github.io/Public_repo/AB-650/

Built with the free **[Mainline](https://github.com/shadcnblocks/mainline-astro-template)** Astro theme (shadcn/ui + Tailwind 4) from `web/`.

## Develop

```bash
cd web
npm ci
npm run dev
```

## Deploy

Push to `main` (changes under `web/` or the workflow) deploys automatically. You can also run the **Deploy Public_repo hub (Astro)** workflow manually.

## Agents

See [AGENTS.md](./AGENTS.md) for architecture, theme notes, deploy, and editing rules.

## Legacy (kept for revert)

`ab-650-portal/` is the old Vite SPA. It stays in the repo so we can roll back if needed — see [`ab-650-portal/DEPRECATED.md`](./ab-650-portal/DEPRECATED.md).

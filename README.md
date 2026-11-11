# Public_repo

Public GitHub Pages hub and tools.

## Live site

- **Hub:** https://gryteklut.github.io/Public_repo/
- **AB-650 Study Portal:** https://gryteklut.github.io/Public_repo/AB-650/

The site is built with **Astro** from `web/`. Root `/` is the hub; tools live under their own paths.

## Develop

```bash
cd web
npm ci
npm run dev
```

## Agents

See [AGENTS.md](./AGENTS.md) for architecture, deploy, and editing rules for coding agents.

## Deploy

Push to `main` (changes under `web/` or the workflow) deploys automatically. You can also run the **Deploy Public_repo hub (Astro)** workflow manually (`workflow_dispatch`).

## Legacy (kept for revert)

`ab-650-portal/` is the old Vite SPA. It stays in the repo so we can roll back if needed — see [`ab-650-portal/DEPRECATED.md`](./ab-650-portal/DEPRECATED.md). Live Pages always build from `web/` unless that workflow is pointed back.

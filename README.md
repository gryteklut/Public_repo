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

## Legacy

`ab-650-portal/` is the old Vite SPA. It is deprecated; the Astro app in `web/` replaced it.

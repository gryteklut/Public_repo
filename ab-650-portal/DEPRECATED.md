# Deprecated — kept for revert

This is the previous **Vite SPA** that used to power `/AB-650/`.

The live site is now the **Astro** app in `../web/` (hub at `/`, portal at `/AB-650/`).

## Do not deploy this folder by default

GitHub Pages builds and deploys `web/` only (see `.github/workflows/deploy-ab650-portal.yml`).

## How to revert to this Vite portal

If Astro needs to be rolled back:

1. Point the workflow back at this folder:
   - Working directory: `ab-650-portal`
   - Build: `npm ci && npm run build`
   - Upload `ab-650-portal/dist` (Vite `base` was `/Public_repo/AB-650/`)
2. Note: the Vite app only served `/AB-650/` — there was no hub at `/`.
3. Prefer a short-lived feature branch + PR; merge to `main` to redeploy.

Keep this tree until you are sure Astro stays. Deleting it removes the easy revert path.

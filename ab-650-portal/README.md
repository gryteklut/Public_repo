# AB-650 Study Portal

Course portal for Exam **AB-650: Administering Microsoft 365 and AI Services**.

## Live site (GitHub Pages)

After the deploy workflow runs on `main`:

**https://gryteklut.github.io/Public_repo/**

One-time repo setup (if Pages is not enabled yet): GitHub → **Settings** → **Pages** → Build and deployment → Source: **GitHub Actions**.

Progress is stored in the browser (`localStorage`). Use **Export / Import progress** when switching devices.

## How to study

1. Open a day module.
2. Expand **Study this topic** above each question (open by default on Days 1–9).
3. Read the short teaching text and follow the Microsoft Learn / docs link.
4. Answer the control question. After submit you see the correct answer, explanation, and source again.
5. The **Mark module complete** checkbox unlocks only when every question is correct.
6. Day 10 is quiz-first practice (study panels collapsed by default).

Progress is stored in `localStorage`. Use **Export / Import progress** on the home page to move between browsers.

## Tags

- `MS-102 core` — likely known from older MS-102
- `MS-102 updated` — still relevant, framing shifted for AB-650
- `AB-650 new` — Copilot, agents, DSPM for AI, AI monitoring/cost

## Develop

```bash
cd ab-650-portal
npm install
npm run dev
npm run build
```

/**
 * Smoke test for AB-650 Astro portal (build + preview required).
 * Usage: npm run build && npx astro preview --host 127.0.0.1 --port 4321 &
 *        node scripts/smoke.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const outDir = "/opt/cursor/artifacts";
fs.mkdirSync(outDir, { recursive: true });

const base = process.env.SMOKE_BASE || "http://127.0.0.1:4321/Public_repo";
const results = [];

function assert(name, cond, detail = "") {
  results.push({ name, ok: Boolean(cond), detail });
  if (!cond) console.error("FAIL", name, detail);
  else console.log("PASS", name, detail);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(`${base}/courses/ab-650/`, { waitUntil: "networkidle" });
assert(
  "course-home",
  (await page.locator("h1").first().textContent())?.includes("Administer"),
);
assert(
  "labs-cta",
  (await page.locator("a", { hasText: "Hands-on labs" }).count()) > 0,
);

await page.goto(`${base}/courses/ab-650/labs/`, { waitUntil: "networkidle" });
await page.waitForSelector("text=AB-650 labs");
assert("labs-page", (await page.locator("article").count()) >= 7, `n=${await page.locator("article").count()}`);

await page.goto(`${base}/courses/ab-650/day-1/`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
assert(
  "day1-official-pointer",
  (await page.locator("text=Official lab").count()) > 0 ||
    (await page.locator("a", { hasText: "Open lab" }).count()) > 0,
);
assert(
  "day1-no-optional-e5",
  (await page.locator("text=Optional E5 lab").count()) === 0,
);
assert(
  "day1-quiz",
  (await page.locator("text=Knowledge check").count()) > 0 &&
    (await page.locator("text=Study this topic").count()) > 0,
);

await page.screenshot({
  path: path.join(outDir, "public-repo-day1-deduped.png"),
  fullPage: true,
});

await page.goto(`${base}/courses/ab-650/labs/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, "public-repo-labs-after-dedupe.png"),
  fullPage: false,
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ failed: failed.length, results }, null, 2));
if (failed.length) process.exit(1);

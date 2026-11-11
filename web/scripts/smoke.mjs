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
assert(
  "ab-day-stays",
  page.url().includes("/day-1/") && !page.url().includes("/session-"),
);
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

await page.goto(`${base}/`, { waitUntil: "networkidle" });
assert(
  "hub-both-courses",
  (await page.locator("text=AB-650").count()) > 0 &&
    (await page.locator("text=AZ-140").count()) > 0,
);
assert(
  "hub-plan-and-labs",
  (await page.locator("a", { hasText: "10-day plan" }).count()) >= 1 &&
    (await page.locator("a", { hasText: "Sessions" }).count()) >= 1 &&
    (await page.locator("a", { hasText: "Official labs" }).count()) >= 2,
);
assert(
  "hub-no-mainline",
  (await page.locator("text=Mainline").count()) === 0,
);

await page.goto(`${base}/courses/az-140/`, { waitUntil: "networkidle" });
assert(
  "az140-home",
  (await page.locator("h1").first().textContent())?.includes("Azure Virtual Desktop"),
);
assert(
  "az140-udemy",
  (await page.locator("a[href='https://www.udemy.com/course/az-140-configuring-operating-ms-azure-virtual-desktop-avd/']").count()) > 0,
);
assert(
  "az140-labs-cta",
  (await page.locator("a", { hasText: "Hands-on labs" }).count()) > 0,
);

await page.goto(`${base}/courses/az-140/labs/`, { waitUntil: "networkidle" });
await page.waitForSelector("text=AZ-140 labs");
assert(
  "az140-labs",
  (await page.locator("article").count()) >= 7,
  `n=${await page.locator("article").count()}`,
);

await page.goto(`${base}/courses/az-140/day-2/`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
assert(
  "az140-day2-lab",
  (await page.locator("text=Official lab").count()) > 0 &&
    (await page.locator("a", { hasText: "Open lab" }).count()) > 0,
);
assert(
  "az140-day2-quiz",
  (await page.locator("text=Knowledge check").count()) > 0,
);
assert(
  "az140-day2-udemy",
  (await page.locator("text=Watch checklist").count()) > 0,
);

await page.goto(`${base}/courses/az-140/labs/lab-1/`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
assert(
  "az140-lab1-exercise",
  (await page.locator("text=Exercise 1").count()) > 0,
);
assert(
  "az140-lab1-table",
  (await page.locator("table.ms-table").count()) > 0,
  `tables=${await page.locator("table.ms-table").count()}`,
);

await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem(
    "courses:AB-650:v1",
    JSON.stringify({
      version: 1,
      code: "AB-650",
      done: { "1": true },
      steps: {},
      review: {},
      updatedAt: new Date().toISOString(),
    }),
  );
});
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const progressText = await page.locator("body").innerText();
assert(
  "progress-keys-isolated",
  progressText.includes("1/10 days") && progressText.includes("0/15 sessions"),
  progressText.slice(0, 500),
);
assert(
  "hub-weeks",
  progressText.includes("10 days") &&
    progressText.includes("~3 weeks at 1 h/workday"),
);

await page.setViewportSize({ width: 1280, height: 900 });
await page.screenshot({
  path: path.join(outDir, "hub-catalog.png"),
  fullPage: true,
});
await page.goto(`${base}/courses/az-140/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, "az140-course.png"),
  fullPage: true,
});
await page.goto(`${base}/courses/az-140/day-2/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, "az140-day2.png"),
  fullPage: true,
});
await page.goto(`${base}/courses/az-140/labs/lab-1/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, "az140-lab1.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, "hub-catalog-mobile.png"),
  fullPage: true,
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ failed: failed.length, results }, null, 2));
if (failed.length) process.exit(1);

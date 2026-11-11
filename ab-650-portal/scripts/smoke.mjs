import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const outDir = '/opt/cursor/artifacts'
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const base = 'http://127.0.0.1:5173'
const results = []

function assert(name, cond, detail = '') {
  results.push({ name, ok: Boolean(cond), detail })
  if (!cond) console.error('FAIL', name, detail)
  else console.log('PASS', name, detail)
}

await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForSelector('h1')
assert('home-loads', await page.locator('h1').textContent() , await page.locator('h1').textContent())
assert(
  'progress-bar',
  (await page.locator('[role="progressbar"]').count()) > 0,
)
assert(
  'day-cards',
  (await page.locator('.day-card').count()) >= 10,
  `cards=${await page.locator('.day-card').count()}`,
)
await page.screenshot({ path: path.join(outDir, 'ab650-home.png'), fullPage: true })

await page.locator('a', { hasText: 'Configure and manage a Microsoft 365 tenant' }).first().click()
await page.waitForSelector('.study-panel')
const openPanels = await page.locator('.study-panel[open]').count()
assert('study-panels-open-by-default', openPanels > 0, `open=${openPanels}`)
assert(
  'study-has-learn-link',
  (await page.locator('.study-panel .learn-link').count()) > 0,
)
assert(
  'udemy-watch-panel',
  (await page.locator('.udemy-watch').count()) > 0,
)
assert(
  'udemy-open-link',
  (await page.locator('a', { hasText: 'Open course player' }).count()) > 0,
)
const locked = await page.locator('.done-check.locked').count()
assert('checkbox-locked-initially', locked === 1)

await page.screenshot({
  path: path.join(outDir, 'ab650-day1-study-panel.png'),
  fullPage: true,
})

// Wrong answer first on Q1
const q1 = page.locator('.question-card').nth(0)
await q1.locator('.choice').nth(1).click()
await q1.locator('button', { hasText: 'Check answer' }).click()
assert('wrong-feedback', (await q1.locator('.feedback.bad').count()) === 1)
assert(
  'feedback-source',
  (await q1.locator('.feedback .learn-link').count()) === 1,
)

// Answer all Day 1 questions correctly
const cards = page.locator('.question-card')
const n = await cards.count()
for (let i = 0; i < n; i++) {
  const card = cards.nth(i)
  if (await card.locator('.pill.success').count()) continue
  // Correct indices from curriculum for day1: 0,0,0,0
  await card.locator('.choice').nth(0).click()
  await card.locator('button', { hasText: 'Check answer' }).click()
  await card.locator('.pill.success').waitFor({ timeout: 3000 })
}

assert(
  'checkbox-unlocked',
  (await page.locator('.done-check.locked').count()) === 0,
)
await page.locator('.done-check input').check()
assert('module-marked-complete', await page.locator('.done-check input').isChecked())

await page.screenshot({
  path: path.join(outDir, 'ab650-day1-complete.png'),
  fullPage: true,
})

await page.goto(`${base}/#/day/day-10/module/d10-practice`, {
  waitUntil: 'networkidle',
})
await page.waitForSelector('.study-panel')
const practiceOpen = await page.locator('.study-panel[open]').count()
assert(
  'day10-study-collapsed',
  practiceOpen === 0,
  `open=${practiceOpen}`,
)
await page.screenshot({
  path: path.join(outDir, 'ab650-day10-practice.png'),
  fullPage: true,
})

await page.goto(base, { waitUntil: 'networkidle' })
const detail = await page.locator('.progress-detail').first().textContent()
assert('home-progress-updated', detail?.includes('1 /'), detail ?? '')

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(JSON.stringify({ failed: failed.length, results }, null, 2))
if (failed.length) process.exit(1)

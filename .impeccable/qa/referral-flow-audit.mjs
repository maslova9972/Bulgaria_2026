import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage()
const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(error.message))

async function visit(path) {
  await page.goto(`http://127.0.0.1:5173/${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  })
  return page.locator('.referral-attribution strong').textContent({ timeout: 5_000 })
}

const result = {
  first: await visit('?ref=elena-kiva#contact'),
  latest: await visit('?ref=natalia-maslova#contact'),
  directReturn: await visit('#contact'),
  stored: await page.evaluate(() => JSON.parse(localStorage.getItem('btb2026.attribution.v1'))),
  errors,
}

console.log(JSON.stringify(result, null, 2))
await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 2_000))])
process.exit(0)

import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})

const allCases = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]
const cases = process.argv.includes('--mobile') ? allCases.slice(0, 1) : allCases
const report = []

for (const { width, height } of cases) {
  const page = await browser.newPage({ viewport: { width, height } })
  const consoleErrors = []
  const pageErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('http://127.0.0.1:5173/?ref=elena-kiva#contact', {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  await page.locator('#contact').scrollIntoViewIfNeeded()

  const result = await page.evaluate(() => {
    const form = document.querySelector('.lead-form')?.getBoundingClientRect()
    const referral = document.querySelector('.referral-attribution')?.getBoundingClientRect()
    const overflow = [...document.querySelectorAll('#contact *')]
      .filter((node) => {
        const box = node.getBoundingClientRect()
        return box.right > innerWidth + 1 || box.left < -1
      })
      .map((node) => ({ tag: node.tagName, className: node.className }))

    return {
      activeElement: document.activeElement?.outerHTML?.slice(0, 160),
      skipLinkFocused: document.querySelector('.skip-link')?.matches(':focus'),
      documentWidth: document.documentElement.scrollWidth,
      referralName: document.querySelector('.referral-attribution strong')?.textContent?.trim(),
      buttonText: document.querySelector('.lead-form__submit span')?.textContent?.trim(),
      form: form && { width: form.width, left: form.left, right: form.right },
      referral: referral && { width: referral.width, left: referral.left, right: referral.right },
      labels: [...document.querySelectorAll('.form-field > span:first-child')].map((node) => node.textContent.trim()),
      overflow,
    }
  })

  await page.locator('#contact').screenshot({
    path: `.impeccable/qa/lead-form-${width}x${height}.png`,
  })

  await page.locator('.lead-form__submit').click()
  await page.waitForTimeout(100)
  const validation = {
    invalidFields: await page.locator('[aria-invalid="true"]').count(),
    focusedName: await page.evaluate(() => document.activeElement?.getAttribute('name')),
    status: await page.locator('.lead-form__status').textContent(),
  }

  report.push({ viewport: [width, height], ...result, validation, consoleErrors, pageErrors })
  await page.close()
}

console.log(JSON.stringify(report, null, 2))
await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 2_000))])
process.exit(0)

import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})

for (const pageName of ['atlas', 'classic']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const pagePath = pageName === 'atlas' ? '/' : '/classic.html'
  await page.goto(`http://127.0.0.1:4173${pagePath}`, { waitUntil: 'networkidle' })
  const images = page.locator('img')
  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(40)
  }
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(250)
  await page.screenshot({
    path: `.impeccable/qa/${pageName}-desktop-full-review.jpg`,
    type: 'jpeg',
    quality: 62,
    fullPage: true,
  })
  await page.close()
}

console.log('full-page captures complete')
await Promise.race([
  browser.close(),
  new Promise((resolve) => setTimeout(resolve, 2000)),
])
process.exit(0)

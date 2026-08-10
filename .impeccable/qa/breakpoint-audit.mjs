import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})

const sizes = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1440, 1000],
]
const results = []

for (const [width, height] of sizes) {
  const page = await browser.newPage({ viewport: { width, height } })
  const consoleErrors = []
  const pageErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const box = document.querySelector(selector)?.getBoundingClientRect()
      return box && { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height }
    }
    const overflow = [...document.querySelectorAll('body *')]
      .filter((node) => {
        const box = node.getBoundingClientRect()
        return !node.closest('.speaker-roster') && (box.right > innerWidth + 1 || box.left < -1)
      })
      .slice(0, 12)
      .map((node) => {
        const box = node.getBoundingClientRect()
        return {
          tag: node.tagName,
          className: node.className,
          left: box.left,
          right: box.right,
          width: box.width,
          text: node.textContent?.trim().slice(0, 80),
        }
      })

    return {
      viewport: [innerWidth, innerHeight],
      documentWidth: document.documentElement.scrollWidth,
      hero: rect('.hero'),
      countdown: rect('.countdown-strip'),
      program: rect('.program'),
      speakers: rect('.speakers'),
      pricing: rect('.pricing'),
      titleParts: [...document.querySelectorAll('.hero-title > span')].map((node) => {
        const box = node.getBoundingClientRect()
        return { left: box.left, right: box.right, width: box.width }
      }),
      countdownColumns: getComputedStyle(document.querySelector('.countdown-values')).gridTemplateColumns,
      overflow,
    }
  })

  const slug = `${width}x${height}`
  await page.screenshot({ path: `.impeccable/qa/atlas-${slug}-viewport.png` })
  if (width === 390 || width === 1440) {
    await page.locator('.program').screenshot({ path: `.impeccable/qa/atlas-${slug}-program.png` })
    await page.locator('.pricing').screenshot({ path: `.impeccable/qa/atlas-${slug}-pricing.png` })
  }

  await page.locator('.occupancy button').last().click()
  const selectedPrice = await page.locator('.price-display > strong').textContent()
  const images = page.locator('img')
  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded().catch(() => {})
  }
  await page.waitForTimeout(250)
  const brokenImages = await images.evaluateAll((nodes) =>
    nodes.filter((node) => !node.complete || node.naturalWidth === 0).map((node) => node.currentSrc),
  )

  results.push({ ...metrics, selectedPrice, brokenImages, consoleErrors, pageErrors })
  await page.close()
}

console.log(JSON.stringify(results, null, 2))
await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 2000))])
process.exit(0)

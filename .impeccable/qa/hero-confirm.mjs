import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})

const results = []
for (const [width, height] of [[390, 844], [1440, 1000]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.hero').getBoundingClientRect()
    const cta = document.querySelector('.hero-action').getBoundingClientRect()
    const ctaStyle = getComputedStyle(document.querySelector('.hero-action'))
    return {
      viewport: [innerWidth, innerHeight],
      documentWidth: document.documentElement.scrollWidth,
      heroHeight: hero.height,
      nextTop: document.querySelector('.countdown-strip').getBoundingClientRect().top,
      cta: { left: cta.left, right: cta.right, top: cta.top, bottom: cta.bottom, width: cta.width, height: cta.height },
      ctaWritingMode: ctaStyle.writingMode,
      ctaDirection: ctaStyle.flexDirection,
    }
  })

  await page.screenshot({ path: `.impeccable/qa/atlas-${width}x${height}-hero-confirm.png` })
  results.push({ ...metrics, errors })
  await page.close()
}

console.log(JSON.stringify(results, null, 2))
await browser.close()

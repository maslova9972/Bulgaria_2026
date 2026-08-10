import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})

const sizes = [
  [390, 844],
]
const routes = [
  ['atlas', '/', '.hero', '.facts'],
]
const results = []

for (const [routeName, route, heroSelector, nextSelector] of routes) {
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(200)
    const metrics = await page.evaluate(({ heroSelector, nextSelector }) => {
      const hero = document.querySelector(heroSelector)?.getBoundingClientRect()
      const next = document.querySelector(nextSelector)?.getBoundingClientRect()
      const h1 = document.querySelector('h1')
      const headerAction = document.querySelector('.header-action')?.getBoundingClientRect()
      const meta = document.querySelector('.hero-meta')?.getBoundingClientRect()
      const titleParts = [...h1.querySelectorAll(':scope > span')]
      const parts = (titleParts.length ? titleParts : [h1]).map((node) => {
        const rect = node.getBoundingClientRect()
        return { left: rect.left, right: rect.right, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth }
      })
      return {
        viewport: [innerWidth, innerHeight],
        documentWidth: document.documentElement.scrollWidth,
        heroHeight: hero?.height,
        nextTop: next?.top,
        headerAction: headerAction && { left: headerAction.left, right: headerAction.right, width: headerAction.width },
        meta: meta && { left: meta.left, right: meta.right, width: meta.width },
        titleParts: parts,
      }
    }, { heroSelector, nextSelector })
    results.push({ routeName, width, height, ...metrics })
    await page.screenshot({ path: '.impeccable/qa/atlas-mobile-postreview-playwright.png' })
    await page.close()
  }
}

console.log(JSON.stringify(results, null, 2))
await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 2000))])
process.exit(0)

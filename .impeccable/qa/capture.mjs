import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox'],
})

const cases = [
  { name: 'atlas-desktop', path: '/', width: 1440, height: 1000, hero: '.hero', next: '.facts' },
  { name: 'atlas-mobile', path: '/', width: 390, height: 844, hero: '.hero', next: '.facts' },
  {
    name: 'classic-desktop',
    path: '/classic.html',
    width: 1440,
    height: 1000,
    hero: '.classic-hero',
    next: '.classic-intro',
  },
  {
    name: 'classic-mobile',
    path: '/classic.html',
    width: 390,
    height: 844,
    hero: '.classic-hero',
    next: '.classic-intro',
  },
]

const report = []

for (const item of cases) {
  const page = await browser.newPage({ viewport: { width: item.width, height: item.height } })
  const consoleErrors = []
  const pageErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto(`http://127.0.0.1:4173${item.path}`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  })
  await page.waitForTimeout(1600)

  const firstViewportPath = `.impeccable/qa/${item.name}-review.png`
  await page.screenshot({ path: firstViewportPath, fullPage: false })

  const interactive = {}
  if (item.name === 'atlas-desktop') {
    await page.locator('.occupancy button').last().click()
    interactive.priceAfterSelection = await page.locator('.price-display > strong').textContent()
    await page.locator('.testimonial-tabs button').last().click()
    interactive.testimonialAfterSelection = await page.locator('.testimonial-copy footer strong').textContent()
    await page.locator('.faq summary').first().click()
    interactive.faqOpened = await page.locator('.faq details').first().getAttribute('open')
  }

  const metrics = await page.evaluate(({ heroSelector, nextSelector }) => {
    const hero = document.querySelector(heroSelector)?.getBoundingClientRect()
    const next = document.querySelector(nextSelector)?.getBoundingClientRect()
    const title = document.querySelector('h1')?.getBoundingClientRect()
    const headerAction = document.querySelector(
      '.header-action, .classic-header-link',
    )?.getBoundingClientRect()
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      hero: hero && { top: hero.top, bottom: hero.bottom, width: hero.width, height: hero.height },
      next: next && { top: next.top },
      title: title && { left: title.left, right: title.right, width: title.width },
      headerAction: headerAction && {
        left: headerAction.left,
        right: headerAction.right,
        width: headerAction.width,
      },
      headings: document.querySelectorAll('h1, h2').length,
      externalLinks: document.querySelectorAll('a[href^="https://"]').length,
    }
  }, { heroSelector: item.hero, nextSelector: item.next })

  const images = page.locator('img')
  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(50)
  }
  const brokenImages = await page.locator('img').evaluateAll((nodes) =>
    nodes.filter((node) => !node.complete || node.naturalWidth === 0).map((node) => node.currentSrc),
  )

  if (item.name.endsWith('desktop')) {
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(200)
    await page.screenshot({
      path: `.impeccable/qa/${item.name}-full-review.png`,
      fullPage: true,
    })
  }

  report.push({
    name: item.name,
    ...metrics,
    interactive,
    brokenImages,
    consoleErrors,
    pageErrors,
  })
  await page.close()
}

console.log(JSON.stringify(report, null, 2))
await Promise.race([
  browser.close(),
  new Promise((resolve) => setTimeout(resolve, 2000)),
])
process.exit(0)

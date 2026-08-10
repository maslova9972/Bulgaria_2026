import { referralPartners } from '../src/referralPartners.js'

const baseUrl = process.argv[2]

if (!baseUrl) {
  console.error('Usage: npm run referrals -- https://example.com/path/')
  process.exitCode = 1
} else {
  try {
    for (const partner of referralPartners) {
      const url = new URL(baseUrl)
      url.hash = ''
      url.searchParams.set('ref', partner.slug)
      console.log(`${partner.name}\t${url.toString()}`)
    }
  } catch {
    console.error('Pass an absolute site URL, for example https://username.github.io/repository/')
    process.exitCode = 1
  }
}

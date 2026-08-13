import { referralPartners } from '../src/referralPartners.js'
import { createReferralUrl } from './referral-url.mjs'

const baseUrl = process.argv[2]

if (!baseUrl) {
  console.error('Usage: npm run referrals -- https://example.com/path/')
  process.exitCode = 1
} else {
  try {
    for (const partner of referralPartners) {
      console.log(`${partner.name}\t${createReferralUrl(baseUrl, partner.slug)}`)
    }
  } catch {
    console.error('Pass an absolute site URL, for example https://username.github.io/repository/')
    process.exitCode = 1
  }
}

import assert from 'node:assert/strict'
import test from 'node:test'
import { createReferralUrl } from '../scripts/referral-url.mjs'

test('referral links remove a trailing slash after an HTML entry file', () => {
  assert.equal(
    createReferralUrl('https://www.bulgaria2026.com/breakfast.html/', 'natalia-maslova'),
    'https://www.bulgaria2026.com/breakfast.html?ref=natalia-maslova',
  )
})

test('referral links preserve valid site paths and campaign parameters', () => {
  assert.equal(
    createReferralUrl(
      'https://maslova9972.github.io/Bulgaria_2026/breakfast.html?utm_source=telegram#contact',
      'natalia-maslova',
    ),
    'https://maslova9972.github.io/Bulgaria_2026/breakfast.html?utm_source=telegram&ref=natalia-maslova',
  )
})

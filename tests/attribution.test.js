import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ATTRIBUTION_STORAGE_KEY,
  ATTRIBUTION_TTL_MS,
  captureAttribution,
  normalizeReferral,
} from '../src/attribution.js'
import { buildTallyUrl, normalizeTallyFormId } from '../src/tally.js'

class MemoryStorage {
  constructor() {
    this.values = new Map()
  }

  getItem(key) {
    return this.values.get(key) ?? null
  }

  setItem(key, value) {
    this.values.set(key, value)
  }

  removeItem(key) {
    this.values.delete(key)
  }
}

const start = Date.parse('2026-08-10T10:00:00.000Z')

test('first referral remains primary while the last referral updates', () => {
  const storage = new MemoryStorage()

  const first = captureAttribution({
    search: '?ref=natalia-vidiul&utm_source=instagram&utm_campaign=launch',
    pathname: '/bulgaria/',
    storage,
    now: start,
  })
  const direct = captureAttribution({ pathname: '/bulgaria/', storage, now: start + 1_000 })
  const second = captureAttribution({
    search: '?ref=elena-kiva&utm_source=telegram',
    pathname: '/bulgaria/',
    storage,
    now: start + 2_000,
  })

  assert.equal(first.ref_first, 'natalia-vidiul')
  assert.equal(first.ref_last, 'natalia-vidiul')
  assert.equal(direct.ref_last, 'natalia-vidiul')
  assert.equal(second.ref_first, 'natalia-vidiul')
  assert.equal(second.ref_last, 'elena-kiva')
  assert.equal(second.credited_ref, 'natalia-vidiul')
  assert.equal(second.utm_source_first, 'instagram')
  assert.equal(second.utm_source_last, 'telegram')
})

test('UTM-only visits do not occupy the first expert referral', () => {
  const storage = new MemoryStorage()

  captureAttribution({ search: '?utm_source=instagram', storage, now: start })
  const result = captureAttribution({
    search: '?ref=natalia-maslova',
    storage,
    now: start + 1_000,
  })

  assert.equal(result.ref_first, 'natalia-maslova')
  assert.equal(result.utm_source_first, 'instagram')
})

test('expired attribution starts a new 30-day window', () => {
  const storage = new MemoryStorage()

  captureAttribution({ search: '?ref=natalia-vidiul', storage, now: start })
  const result = captureAttribution({
    search: '?ref=tamara-guseva',
    storage,
    now: start + ATTRIBUTION_TTL_MS + 1,
  })

  assert.equal(result.ref_first, 'tamara-guseva')
  assert.equal(result.ref_last, 'tamara-guseva')
})

test('unknown referrals, control characters and malformed storage are ignored safely', () => {
  const storage = new MemoryStorage()
  storage.setItem(ATTRIBUTION_STORAGE_KEY, '{not-json')

  const result = captureAttribution({
    search: '?ref=unknown-partner%0A<script>',
    storage,
    now: start,
  })

  assert.equal(result.ref_first, '')
  assert.equal(normalizeReferral(' ELENA-KIVA '), 'elena-kiva')
  assert.equal(normalizeReferral('unknown-partner'), '')
})

test('blocked storage does not break current-page attribution', () => {
  const blockedStorage = {
    getItem() { throw new Error('blocked') },
    setItem() { throw new Error('blocked') },
    removeItem() { throw new Error('blocked') },
  }

  const result = captureAttribution({
    search: '?ref=galina-lunina',
    pathname: '/event/',
    storage: blockedStorage,
    now: start,
  })

  assert.equal(result.ref_first, 'galina-lunina')
  assert.equal(result.current_path, '/event/')
})

test('Tally URLs include only valid IDs and known non-empty attribution fields', () => {
  const url = new URL(buildTallyUrl('abc123', {
    ref_first: 'natalia-vidiul',
    ref_last: '',
    credited_ref: 'natalia-vidiul',
    current_path: '/bulgaria/',
    arbitrary: 'must-not-leak',
  }))

  assert.equal(url.pathname, '/embed/abc123')
  assert.equal(url.searchParams.get('dynamicHeight'), '1')
  assert.equal(url.searchParams.get('ref_first'), 'natalia-vidiul')
  assert.equal(url.searchParams.get('credited_ref'), 'natalia-vidiul')
  assert.equal(url.searchParams.get('current_path'), '/bulgaria/')
  assert.equal(url.searchParams.has('ref_last'), false)
  assert.equal(url.searchParams.has('arbitrary'), false)
  assert.equal(normalizeTallyFormId('bad/id'), '')
})

import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ATTRIBUTION_CONSENT_STORAGE_KEY,
  hasAttributionQuery,
  readAttributionConsent,
  writeAttributionConsent,
} from '../src/privacyConsent.js'

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
}

test('attribution consent is unset until the visitor chooses', () => {
  const storage = new MemoryStorage()

  assert.equal(readAttributionConsent(storage), 'unset')
  writeAttributionConsent('granted', storage)
  assert.equal(storage.getItem(ATTRIBUTION_CONSENT_STORAGE_KEY), 'granted')
  assert.equal(readAttributionConsent(storage), 'granted')
})

test('a denied choice is remembered without enabling attribution storage', () => {
  const storage = new MemoryStorage()

  writeAttributionConsent('denied', storage)
  assert.equal(readAttributionConsent(storage), 'denied')
})

test('only referral or campaign parameters trigger the storage choice', () => {
  assert.equal(hasAttributionQuery('?ref=natalia-maslova'), true)
  assert.equal(hasAttributionQuery('?utm_source=telegram'), true)
  assert.equal(hasAttributionQuery('?lang=ru'), false)
})

test('unsupported consent values are rejected', () => {
  assert.throws(() => writeAttributionConsent('maybe', new MemoryStorage()), TypeError)
})

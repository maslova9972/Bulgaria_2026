import test from 'node:test'
import assert from 'node:assert/strict'
import { handleRequest } from '../worker/src/index.js'

const origin = 'https://example.github.io'
const now = Date.parse('2026-08-10T18:00:00.000Z')
const env = {
  ALLOWED_ORIGINS: [origin],
  AIRTABLE_BASE_ID: 'appr12dTRITFID8eg',
  AIRTABLE_TABLE_ID: 'tbllP9xxSHhpYvz2S',
  AIRTABLE_TOKEN: 'test-token',
}

const validPayload = {
  name: 'Анна',
  telegram: '@anna',
  alternate_contact: 'anna@example.com',
  country: 'Германия',
  participation: 'package-2',
  comment: 'Жду программу',
  consent: true,
  company_website: '',
  attribution: {
    ref_first: 'elena-kiva',
    ref_last: 'tamara-guseva',
    credited_ref: 'tamara-guseva',
    utm_source_first: 'telegram',
    landing_first: '/event/',
    touch_at_first: '2026-08-10T17:00:00.000Z',
    current_path: '/event/',
  },
}

function makeRequest(body, { method = 'POST', requestOrigin = origin, contentType = 'application/json' } = {}) {
  const headers = { Origin: requestOrigin }
  if (contentType) headers['Content-Type'] = contentType
  return new Request('https://leads.example.workers.dev/api/leads', {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })
}

test('Worker answers an allowed CORS preflight', async () => {
  const response = await handleRequest(makeRequest(null, { method: 'OPTIONS' }), env)
  assert.equal(response.status, 204)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin)
  assert.equal(response.headers.get('Vary'), 'Origin')
})

test('Worker rejects an unlisted origin without exposing CORS access', async () => {
  const response = await handleRequest(makeRequest(validPayload, {
    requestOrigin: 'https://attacker.example',
  }), env)
  assert.equal(response.status, 403)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null)
})

test('Worker returns structured validation errors', async () => {
  const response = await handleRequest(makeRequest({ consent: false }), env, { now })
  const result = await response.json()
  assert.equal(response.status, 422)
  assert.equal(result.code, 'VALIDATION_ERROR')
  assert.ok(result.fieldErrors.name)
  assert.ok(result.fieldErrors.participation)
})

test('honeypot produces a neutral success without calling Airtable', async () => {
  let fetchCalls = 0
  const response = await handleRequest(makeRequest({ company_website: 'spam.example' }), env, {
    now,
    fetchImpl: async () => {
      fetchCalls += 1
      throw new Error('must not be called')
    },
  })

  assert.equal(response.status, 201)
  assert.equal(fetchCalls, 0)
})

test('valid lead maps server-owned CRM values and latest valid referral', async () => {
  let airtableCall
  const response = await handleRequest(makeRequest(validPayload), env, {
    now,
    fetchImpl: async (url, options) => {
      airtableCall = { url, options }
      return new Response(JSON.stringify({ records: [{ id: 'rec-test' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    },
  })

  const result = await response.json()
  const requestBody = JSON.parse(airtableCall.options.body)
  const fields = requestBody.records[0].fields

  assert.equal(response.status, 201)
  assert.equal(result.ok, true)
  assert.match(airtableCall.url, /appr12dTRITFID8eg\/tbllP9xxSHhpYvz2S$/)
  assert.equal(airtableCall.options.headers.Authorization, 'Bearer test-token')
  assert.equal(requestBody.typecast, false)
  assert.equal(fields.fld87pCd4Saz42kz3, 'Новая')
  assert.equal(fields.fldAMhqh7XQr6ZNYX, 'Полный пакет · 2 человека')
  assert.equal(fields.fldrIh0z5O2L5sms1, 2)
  assert.equal(fields.fldlzjRPkisohRcm4, 700)
  assert.equal(fields.fldJYtM0NPR5TDC7u, 'tamara-guseva')
  assert.equal(fields.fldNQCnboQ9horVgg, 'Тамара Гусева')
  assert.equal(fields.flduI1VTbHMkq93vj, 'anna@example.com')
})

test('temporary Airtable failure returns a retryable service error', async () => {
  const response = await handleRequest(makeRequest(validPayload), env, {
    now,
    fetchImpl: async () => new Response('{}', { status: 429 }),
  })
  const result = await response.json()

  assert.equal(response.status, 503)
  assert.equal(response.headers.get('Retry-After'), '10')
  assert.equal(result.code, 'CRM_UNAVAILABLE')
})

test('configured Turnstile is required and verified before Airtable', async () => {
  const protectedEnv = {
    ...env,
    TURNSTILE_SECRET: 'turnstile-secret',
    TURNSTILE_HOSTNAMES: ['example.github.io'],
    TURNSTILE_ACTION: 'lead_submit',
  }
  let fetchCalls = 0

  const missingToken = await handleRequest(makeRequest(validPayload), protectedEnv, {
    now,
    fetchImpl: async () => {
      fetchCalls += 1
      return new Response('{}', { status: 500 })
    },
  })
  assert.equal(missingToken.status, 400)
  assert.equal(fetchCalls, 0)

  const verified = await handleRequest(makeRequest({
    ...validPayload,
    turnstile_token: 'one-time-token',
  }), protectedEnv, {
    now,
    fetchImpl: async (url) => {
      fetchCalls += 1
      if (String(url).includes('/turnstile/')) {
        return new Response(JSON.stringify({
          success: true,
          hostname: 'example.github.io',
          action: 'lead_submit',
        }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ records: [{ id: 'rec-test' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    },
  })

  assert.equal(verified.status, 201)
  assert.equal(fetchCalls, 2)
})

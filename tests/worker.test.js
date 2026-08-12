import test from 'node:test'
import assert from 'node:assert/strict'
import { handleRequest } from '../worker/src/index.js'

const origin = 'https://example.github.io'
const now = Date.parse('2026-08-10T18:00:00.000Z')
const env = {
  ALLOWED_ORIGINS: [origin],
  AIRTABLE_BASE_ID: 'appjaHCUKxthrm3zI',
  AIRTABLE_TABLE_ID: 'tbl9P4xP0rrsimyo8',
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
  assert.match(airtableCall.url, /appjaHCUKxthrm3zI\/tbl9P4xP0rrsimyo8$/)
  assert.equal(airtableCall.options.headers.Authorization, 'Bearer test-token')
  assert.equal(requestBody.typecast, false)
  assert.equal(fields.fldGcoLL7MbsxcYqM, 'Новая')
  assert.equal(fields.fldBHweTFv66wTX6F, 'Полный пакет · 2 человека · 700 €')
  assert.equal(fields.fldPRC97zQ5YEJszM, 'Не выставлено')
  assert.equal(fields.fldGs489tE1WSyoii, 'tamara-guseva')
  assert.equal(fields.fldsg7WxZc8RCpE2u, 'Тамара Гусева')
  assert.equal(fields.fldm5kb8syFzU6yA3, 'anna@example.com')
})

test('Worker sends only writable fields and every select value the base accepts', async () => {
  const { participationOptions, breakfastParticipationOptions } = await import('../src/leadForm.js')
  const allParticipationOptions = [...participationOptions, ...breakfastParticipationOptions]
  const writableFieldIds = new Set([
    'fld1eqRAgP8JINqNU', 'fldGcoLL7MbsxcYqM', 'fld2xm3nFNNe9LuYS', 'fldyyERZ7DWP7V4c9',
    'fldm5kb8syFzU6yA3', 'fldBMRn1ayyJ0NM6S', 'fldBHweTFv66wTX6F', 'fldPRC97zQ5YEJszM',
    'fld7INg5mP0v63ny2', 'fldCpEEc0B6XXYab3', 'fldsg7WxZc8RCpE2u', 'fldMuDqK3zJrV3KHI',
    'flddDTr3yKdfjTbm3', 'fldGs489tE1WSyoii', 'fld05fVqziWhcjuZc', 'fldxxXpWy2v9iydW3',
    'fldebFEpddhOLC6w7', 'fldpvOxrf57xiDDc8', 'fldURsEtBWKB12hZf', 'fldgIuKgk2fGJDcze',
    'fldUNyg2arol016I0', 'fldUFBjnA7VepRd9J', 'fldmrTq5YpRhk0VcD', 'fldmvBgFRofravqMb',
    'fldlpcITY18Z9F1l8', 'fldQUAVLw6hY0RCKm', 'fldY5W7ziCvvNMx4J', 'fldgj1lc5KrYhuCTj',
    'fldFwjiiH38eIY7ID',
  ])

  for (const option of allParticipationOptions) {
    let airtableCall
    const response = await handleRequest(makeRequest({ ...validPayload, participation: option.value }), env, {
      now,
      fetchImpl: async (url, options) => {
        airtableCall = { url, options }
        return new Response(JSON.stringify({ records: [{ id: 'rec-test' }] }), { status: 200 })
      },
    })

    assert.equal(response.status, 201, `${option.value} was rejected before Airtable`)
    const fields = JSON.parse(airtableCall.options.body).records[0].fields
    assert.equal(fields.fldBHweTFv66wTX6F, option.label, `${option.value} maps to a different label`)

    for (const fieldId of Object.keys(fields)) {
      assert.ok(writableFieldIds.has(fieldId), `${fieldId} is not a writable field of the base`)
    }
    for (const value of Object.values(fields)) {
      assert.notEqual(value, undefined)
    }
  }
})

test('an unknown participation code cannot reach Airtable through the prototype chain', async () => {
  for (const code of ['constructor', '__proto__', 'toString', 'unknown-package']) {
    const response = await handleRequest(makeRequest({ ...validPayload, participation: code }), env, {
      now,
      fetchImpl: async () => {
        throw new Error('must not be called')
      },
    })
    const result = await response.json()

    assert.equal(response.status, 422, `${code} was not rejected`)
    assert.ok(result.fieldErrors.participation)
  }
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

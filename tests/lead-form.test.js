import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildLeadPayload,
  buildTelegramLeadUrl,
  normalizeLeadEndpoint,
  submitLead,
  validateLeadForm,
} from '../src/leadForm.js'

const validValues = {
  name: 'Анна',
  telegram: '@anna',
  alternateContact: 'anna@example.com',
  country: 'Германия',
  participation: 'forum',
  comment: 'Хочу получить программу',
  consent: true,
  website: '',
}

test('lead form reports all required empty fields', () => {
  const errors = validateLeadForm({
    name: '',
    telegram: '',
    alternateContact: '',
    country: '',
    participation: '',
    comment: '',
    consent: false,
  })

  assert.deepEqual(Object.keys(errors).sort(), ['consent', 'name', 'participation', 'telegram'])
})

test('lead payload keeps only known attribution and resolves the credited partner name', () => {
  const payload = buildLeadPayload(validValues, {
    ref_first: 'elena-kiva',
    ref_last: 'tamara-guseva',
    credited_ref: 'elena-kiva',
    current_path: '/event/',
    arbitrary: 'must-not-leak',
  })

  assert.equal(payload.name, 'Анна')
  assert.equal(payload.referrer_name, 'Тамара Гусева')
  assert.equal(payload.attribution.credited_ref, 'tamara-guseva')
  assert.equal(payload.attribution.current_path, '/event/')
  assert.equal('arbitrary' in payload.attribution, false)
  assert.equal(payload.company_website, '')
})

test('Telegram fallback contains the selected format and latest referral partner', () => {
  const payload = buildLeadPayload(validValues, {
    ref_first: 'elena-kiva',
    ref_last: 'natalia-maslova',
    credited_ref: 'elena-kiva',
  })
  const url = new URL(buildTelegramLeadUrl(payload))
  const text = url.searchParams.get('text')

  assert.equal(url.hostname, 't.me')
  assert.equal(url.pathname, '/maslovanataly')
  assert.match(text, /Формат: Только форум · 25 €/)
  assert.match(text, /По приглашению: Наталья Маслова/)
})

test('lead endpoint requires HTTPS except on local development hosts', () => {
  assert.equal(normalizeLeadEndpoint('https://leads.example.com/api/leads'), 'https://leads.example.com/api/leads')
  assert.equal(normalizeLeadEndpoint('http://127.0.0.1:8787/api/leads'), 'http://127.0.0.1:8787/api/leads')
  assert.equal(normalizeLeadEndpoint('http://leads.example.com/api/leads'), '')
  assert.equal(normalizeLeadEndpoint('javascript:alert(1)'), '')
})

test('submitLead returns JSON on success and exposes server field errors', async () => {
  const success = await submitLead('https://leads.example.com/api/leads', { name: 'Анна' }, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, requestId: 'req-1' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  })
  assert.equal(success.requestId, 'req-1')

  await assert.rejects(
    () => submitLead('https://leads.example.com/api/leads', {}, {
      fetchImpl: async () => new Response(JSON.stringify({
        message: 'Проверьте поля',
        fieldErrors: { name: 'Укажите имя' },
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    (error) => error.status === 422 && error.fieldErrors.name === 'Укажите имя',
  )
})

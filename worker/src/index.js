import { findReferralPartner, referralPartnerSlugs } from '../../src/referralPartners.js'

const MAX_BODY_BYTES = 16 * 1024
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g
const referralSlugSet = new Set(referralPartnerSlugs)

// Labels must match the "Формат участия" single-select choices in Airtable exactly:
// the record is created with typecast disabled, so an unknown choice is rejected.
const participationFormats = Object.freeze({
  forum: 'Только форум · 25 €',
  'forum-with-breakfast': 'Форум + бизнес-ужин с экспертами · 100 €',
  'package-1': 'Полный пакет · 1 человек · 500 €',
  'package-2': 'Полный пакет · 2 человека · 700 €',
  'package-3': 'Полный пакет · 3 человека · 800 €',
  presentation: 'Самопрезентация на форуме',
  breakfast: 'Business Networking 6 сентября · бесплатно по приглашению',
  'breakfast-forum': 'Business Networking 6 сентября и форум 12 сентября',
  undecided: 'Ещё выбираю формат',
})

// Field IDs of the "Заявки" table. Read them with `npm run airtable:schema`.
// "Дата заявки" is a createdTime field: Airtable fills it, the Worker must not send it.
const airtableFields = Object.freeze({
  name: 'fld1eqRAgP8JINqNU',
  status: 'fldGcoLL7MbsxcYqM',
  telegram: 'fld2xm3nFNNe9LuYS',
  phone: 'fldyyERZ7DWP7V4c9',
  email: 'fldm5kb8syFzU6yA3',
  country: 'fldBMRn1ayyJ0NM6S',
  participation: 'fldBHweTFv66wTX6F',
  paymentStatus: 'fldPRC97zQ5YEJszM',
  comment: 'fld7INg5mP0v63ny2',
  consent: 'fldCpEEc0B6XXYab3',
  refFirst: 'fldMuDqK3zJrV3KHI',
  refLast: 'flddDTr3yKdfjTbm3',
  creditedRef: 'fldGs489tE1WSyoii',
  referrerName: 'fldsg7WxZc8RCpE2u',
  utmSourceFirst: 'fld05fVqziWhcjuZc',
  utmSourceLast: 'fldxxXpWy2v9iydW3',
  utmMediumFirst: 'fldebFEpddhOLC6w7',
  utmMediumLast: 'fldpvOxrf57xiDDc8',
  utmCampaignFirst: 'fldURsEtBWKB12hZf',
  utmCampaignLast: 'fldgIuKgk2fGJDcze',
  utmContentFirst: 'fldUNyg2arol016I0',
  utmContentLast: 'fldUFBjnA7VepRd9J',
  utmTermFirst: 'fldmrTq5YpRhk0VcD',
  utmTermLast: 'fldmvBgFRofravqMb',
  landingFirst: 'fldlpcITY18Z9F1l8',
  landingLast: 'fldQUAVLw6hY0RCKm',
  touchAtFirst: 'fldY5W7ziCvvNMx4J',
  touchAtLast: 'fldgj1lc5KrYhuCTj',
  currentPath: 'fldFwjiiH38eIY7ID',
})

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.replace(CONTROL_CHARACTERS, '').trim().slice(0, maxLength)
}

function normalizedLength(value) {
  if (typeof value !== 'string') return 0
  return value.replace(CONTROL_CHARACTERS, '').trim().length
}

function parseList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
  if (typeof value !== 'string') return []

  const trimmed = value.trim()
  if (!trimmed) return []

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean)
    } catch {
      return []
    }
  }

  return trimmed.split(',').map((item) => item.trim()).filter(Boolean)
}

function securityHeaders(origin, isAllowedOrigin) {
  const headers = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
  }

  if (isAllowedOrigin) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
    headers['Access-Control-Max-Age'] = '86400'
  }

  return headers
}

function jsonResponse(payload, status, origin, isAllowedOrigin, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...securityHeaders(origin, isAllowedOrigin), ...extraHeaders },
  })
}

async function readBodyWithLimit(request) {
  const declaredLength = Number(request.headers.get('content-length') || 0)
  if (declaredLength > MAX_BODY_BYTES) throw Object.assign(new Error('PAYLOAD_TOO_LARGE'), { status: 413 })
  if (!request.body) return ''

  const reader = request.body.getReader()
  const chunks = []
  let size = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      throw Object.assign(new Error('PAYLOAD_TOO_LARGE'), { status: 413 })
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  return new TextDecoder().decode(bytes)
}

function normalizeReferral(value) {
  const slug = cleanText(value, 64).toLowerCase()
  return referralSlugSet.has(slug) ? slug : ''
}

function normalizeCampaign(value) {
  return normalizedLength(value) <= 128 ? cleanText(value, 128) : ''
}

function normalizePath(value) {
  const path = cleanText(value, 240)
  return normalizedLength(value) <= 240 && path.startsWith('/') ? path : ''
}

function normalizeTimestamp(value, now) {
  if (typeof value !== 'string') return ''
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return ''
  if (timestamp > now + MAX_FUTURE_SKEW_MS || now - timestamp > ATTRIBUTION_TTL_MS) return ''
  return new Date(timestamp).toISOString()
}

function normalizeAttribution(value, now) {
  const attribution = value && typeof value === 'object' ? value : {}
  const refFirst = normalizeReferral(attribution.ref_first)
  const refLast = normalizeReferral(attribution.ref_last)
  const creditedRef = refLast || refFirst

  return {
    ref_first: refFirst,
    ref_last: refLast,
    credited_ref: creditedRef,
    referrer_name: findReferralPartner(creditedRef)?.name || '',
    utm_source_first: normalizeCampaign(attribution.utm_source_first),
    utm_source_last: normalizeCampaign(attribution.utm_source_last),
    utm_medium_first: normalizeCampaign(attribution.utm_medium_first),
    utm_medium_last: normalizeCampaign(attribution.utm_medium_last),
    utm_campaign_first: normalizeCampaign(attribution.utm_campaign_first),
    utm_campaign_last: normalizeCampaign(attribution.utm_campaign_last),
    utm_content_first: normalizeCampaign(attribution.utm_content_first),
    utm_content_last: normalizeCampaign(attribution.utm_content_last),
    utm_term_first: normalizeCampaign(attribution.utm_term_first),
    utm_term_last: normalizeCampaign(attribution.utm_term_last),
    landing_first: normalizePath(attribution.landing_first),
    landing_last: normalizePath(attribution.landing_last),
    touch_at_first: normalizeTimestamp(attribution.touch_at_first, now),
    touch_at_last: normalizeTimestamp(attribution.touch_at_last, now),
    current_path: normalizePath(attribution.current_path),
  }
}

function splitAlternateContact(value) {
  const contact = cleanText(value, 254)
  if (!contact) return { email: '', phone: '' }

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
  return looksLikeEmail ? { email: contact, phone: '' } : { email: '', phone: contact }
}

export function validateLeadPayload(payload, now = Date.now()) {
  const values = payload && typeof payload === 'object' ? payload : {}
  const fieldErrors = {}
  const name = cleanText(values.name, 80)
  const telegram = cleanText(values.telegram, 80)
  const alternateContact = cleanText(values.alternate_contact, 254)
  const country = cleanText(values.country, 80)
  const comment = cleanText(values.comment, 1_000)
  const participationKey = typeof values.participation === 'string'
    && Object.hasOwn(participationFormats, values.participation)
    ? values.participation
    : ''
  const participation = participationKey ? participationFormats[participationKey] : ''

  if (name.length < 2 || normalizedLength(values.name) > 80) fieldErrors.name = 'Укажите корректное имя.'
  if (!telegram && !alternateContact) fieldErrors.telegram = 'Укажите Telegram или другой контакт.'
  if (normalizedLength(values.telegram) > 80) fieldErrors.telegram = 'Сократите Telegram до 80 символов.'
  if (normalizedLength(values.alternate_contact) > 254) fieldErrors.alternateContact = 'Сократите контакт.'
  if (normalizedLength(values.country) > 80) fieldErrors.country = 'Сократите название страны.'
  if (!participation) fieldErrors.participation = 'Выберите формат участия.'
  if (normalizedLength(values.comment) > 1_000) fieldErrors.comment = 'Сократите комментарий до 1000 символов.'
  if (values.consent !== true) fieldErrors.consent = 'Нужно согласие на обработку заявки.'

  return {
    fieldErrors,
    lead: {
      name,
      telegram,
      alternateContact,
      country,
      comment,
      participationKey,
      participation,
      attribution: normalizeAttribution(values.attribution, now),
      companyWebsite: cleanText(values.company_website, 120),
    },
  }
}

function setIfPresent(fields, fieldId, value) {
  if (value !== '' && value !== undefined && value !== null) fields[fieldId] = value
}

export function buildAirtableFields(lead) {
  const { email, phone } = splitAlternateContact(lead.alternateContact)
  const fields = {
    [airtableFields.name]: lead.name,
    [airtableFields.status]: 'Новая',
    [airtableFields.participation]: lead.participation,
    [airtableFields.paymentStatus]: 'Не выставлено',
    [airtableFields.consent]: true,
  }

  setIfPresent(fields, airtableFields.telegram, lead.telegram)
  setIfPresent(fields, airtableFields.phone, phone)
  setIfPresent(fields, airtableFields.email, email)
  setIfPresent(fields, airtableFields.country, lead.country)
  setIfPresent(fields, airtableFields.comment, lead.comment)

  const attributionMapping = {
    ref_first: airtableFields.refFirst,
    ref_last: airtableFields.refLast,
    credited_ref: airtableFields.creditedRef,
    referrer_name: airtableFields.referrerName,
    utm_source_first: airtableFields.utmSourceFirst,
    utm_source_last: airtableFields.utmSourceLast,
    utm_medium_first: airtableFields.utmMediumFirst,
    utm_medium_last: airtableFields.utmMediumLast,
    utm_campaign_first: airtableFields.utmCampaignFirst,
    utm_campaign_last: airtableFields.utmCampaignLast,
    utm_content_first: airtableFields.utmContentFirst,
    utm_content_last: airtableFields.utmContentLast,
    utm_term_first: airtableFields.utmTermFirst,
    utm_term_last: airtableFields.utmTermLast,
    landing_first: airtableFields.landingFirst,
    landing_last: airtableFields.landingLast,
    touch_at_first: airtableFields.touchAtFirst,
    touch_at_last: airtableFields.touchAtLast,
    current_path: airtableFields.currentPath,
  }

  for (const [key, fieldId] of Object.entries(attributionMapping)) {
    setIfPresent(fields, fieldId, lead.attribution[key])
  }

  return fields
}

async function verifyTurnstile(token, request, env, fetchImpl) {
  if (!env.TURNSTILE_SECRET) return { ok: true }
  if (!token) return { ok: false }

  const formData = new FormData()
  formData.set('secret', env.TURNSTILE_SECRET)
  formData.set('response', token)
  formData.set('remoteip', request.headers.get('CF-Connecting-IP') || '')
  formData.set('idempotency_key', crypto.randomUUID())

  let response
  try {
    response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
  } catch {
    return { ok: false, unavailable: true }
  }

  if (!response.ok) return { ok: false, unavailable: true }
  const result = await response.json()
  const allowedHostnames = parseList(env.TURNSTILE_HOSTNAMES)
  const expectedAction = env.TURNSTILE_ACTION || 'lead_submit'
  const hostnameMatches = !allowedHostnames.length || allowedHostnames.includes(result.hostname)

  return {
    ok: Boolean(result.success && hostnameMatches && result.action === expectedAction),
  }
}

export async function handleRequest(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  const requestId = crypto.randomUUID()
  const url = new URL(request.url)
  const origin = request.headers.get('Origin') || ''
  const allowedOrigins = parseList(env.ALLOWED_ORIGINS)
  const isAllowedOrigin = Boolean(origin && allowedOrigins.includes(origin))

  if (url.pathname !== '/api/leads') {
    return jsonResponse({ ok: false, code: 'NOT_FOUND', requestId }, 404, origin, isAllowedOrigin)
  }

  if (!isAllowedOrigin) {
    return jsonResponse({ ok: false, code: 'ORIGIN_NOT_ALLOWED', requestId }, 403, origin, false)
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: securityHeaders(origin, true) })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, code: 'METHOD_NOT_ALLOWED', requestId }, 405, origin, true)
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ ok: false, code: 'UNSUPPORTED_MEDIA_TYPE', requestId }, 415, origin, true)
  }

  let payload
  try {
    const body = await readBodyWithLimit(request)
    payload = JSON.parse(body)
  } catch (error) {
    const status = error.status === 413 ? 413 : 400
    const code = status === 413 ? 'PAYLOAD_TOO_LARGE' : 'INVALID_JSON'
    return jsonResponse({ ok: false, code, requestId }, status, origin, true)
  }

  const { fieldErrors, lead } = validateLeadPayload(payload, now)

  if (lead.companyWebsite) {
    return jsonResponse({ ok: true, requestId }, 201, origin, true)
  }

  if (Object.keys(fieldErrors).length) {
    return jsonResponse({ ok: false, code: 'VALIDATION_ERROR', fieldErrors, requestId }, 422, origin, true)
  }

  const turnstile = await verifyTurnstile(cleanText(payload.turnstile_token, 2_048), request, env, fetchImpl)
  if (!turnstile.ok) {
    const status = turnstile.unavailable ? 503 : 400
    const code = turnstile.unavailable ? 'BOT_CHECK_UNAVAILABLE' : 'BOT_CHECK_FAILED'
    return jsonResponse({ ok: false, code, requestId }, status, origin, true)
  }

  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID || !env.AIRTABLE_TABLE_ID) {
    return jsonResponse({ ok: false, code: 'SERVICE_NOT_CONFIGURED', requestId }, 502, origin, true)
  }

  const airtableUrl = `https://api.airtable.com/v0/${encodeURIComponent(env.AIRTABLE_BASE_ID)}/${encodeURIComponent(env.AIRTABLE_TABLE_ID)}`
  const fields = buildAirtableFields(lead)
  let airtableResponse

  try {
    airtableResponse = await fetchImpl(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }], typecast: false }),
    })
  } catch {
    return jsonResponse({ ok: false, code: 'CRM_UNAVAILABLE', requestId }, 503, origin, true)
  }

  if (!airtableResponse.ok) {
    const temporary = airtableResponse.status === 429 || airtableResponse.status >= 500
    return jsonResponse(
      { ok: false, code: temporary ? 'CRM_UNAVAILABLE' : 'CRM_SCHEMA_ERROR', requestId },
      temporary ? 503 : 502,
      origin,
      true,
      temporary ? { 'Retry-After': '10' } : {},
    )
  }

  return jsonResponse({ ok: true, requestId }, 201, origin, true)
}

export default {
  fetch(request, env) {
    return handleRequest(request, env)
  },
}

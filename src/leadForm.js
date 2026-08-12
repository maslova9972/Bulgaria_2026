import { ATTRIBUTION_FIELD_NAMES } from './attribution.js'
import { findReferralPartner } from './referralPartners.js'

const undecidedOption = { value: 'undecided', label: 'Ещё выбираю формат' }

// Shown on the forum landing page (index.html).
export const participationOptions = Object.freeze([
  { value: 'forum', label: 'Только форум · 25 €' },
  { value: 'package-1', label: 'Полный пакет · 1 человек · 500 €' },
  { value: 'package-2', label: 'Полный пакет · 2 человека · 700 €' },
  { value: 'package-3', label: 'Полный пакет · 3 человека · 800 €' },
  { value: 'presentation', label: 'Самопрезентация на форуме' },
  undecidedOption,
])

// Shown on the business breakfast landing page (breakfast.html).
export const breakfastParticipationOptions = Object.freeze([
  { value: 'breakfast', label: 'Бизнес-завтрак 6 сентября · 15 €' },
  { value: 'breakfast-forum', label: 'Бизнес-завтрак 6 сентября и форум 12 сентября' },
  undecidedOption,
])

const knownParticipation = new Map(
  [...participationOptions, ...breakfastParticipationOptions].map(({ value, label }) => [value, label]),
)
const participationValues = new Set(knownParticipation.keys())
const controlCharacters = /[\u0000-\u001f\u007f]/g

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.replace(controlCharacters, '').trim().slice(0, maxLength)
}

function normalizedLength(value) {
  if (typeof value !== 'string') return 0
  return value.replace(controlCharacters, '').trim().length
}

export function normalizeLeadEndpoint(value) {
  if (typeof value !== 'string' || !value.trim()) return ''

  try {
    const url = new URL(value.trim())
    const isLocalHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)
    if (url.protocol !== 'https:' && !isLocalHttp) return ''
    return url.toString()
  } catch {
    return ''
  }
}

export function validateLeadForm(values) {
  const errors = {}
  const name = cleanText(values.name, 80)
  const telegram = cleanText(values.telegram, 80)
  const alternateContact = cleanText(values.alternateContact, 120)
  const country = cleanText(values.country, 80)
  const comment = cleanText(values.comment, 1_000)

  if (name.length < 2) errors.name = 'Укажите имя, минимум 2 символа.'
  if (telegram.length < 2) errors.telegram = 'Укажите Telegram, чтобы мы могли ответить.'
  if (normalizedLength(values.name) > 80) errors.name = 'Сократите имя до 80 символов.'
  if (normalizedLength(values.telegram) > 80) errors.telegram = 'Сократите Telegram до 80 символов.'
  if (normalizedLength(values.alternateContact) > 120) errors.alternateContact = 'Контакт слишком длинный.'
  if (normalizedLength(values.country) > 80) errors.country = 'Название страны слишком длинное.'
  if (!participationValues.has(values.participation)) errors.participation = 'Выберите формат участия.'
  if (normalizedLength(values.comment) > 1_000) errors.comment = 'Сократите комментарий до 1000 символов.'
  if (!values.consent) errors.consent = 'Нужно согласие на обработку заявки.'

  return errors
}

export function buildLeadPayload(values, attribution = {}) {
  const firstPartner = findReferralPartner(attribution.ref_first)
  const lastPartner = findReferralPartner(attribution.ref_last)
  const creditedPartner = lastPartner || firstPartner
  const safeAttribution = Object.fromEntries(
    ATTRIBUTION_FIELD_NAMES.map((fieldName) => [
      fieldName,
      cleanText(attribution[fieldName], 240),
    ]),
  )
  safeAttribution.ref_first = firstPartner?.slug || ''
  safeAttribution.ref_last = lastPartner?.slug || ''
  safeAttribution.credited_ref = creditedPartner?.slug || ''

  return {
    name: cleanText(values.name, 80),
    telegram: cleanText(values.telegram, 80),
    alternate_contact: cleanText(values.alternateContact, 120),
    country: cleanText(values.country, 80),
    participation: participationValues.has(values.participation) ? values.participation : '',
    comment: cleanText(values.comment, 1_000),
    consent: Boolean(values.consent),
    company_website: cleanText(values.website, 120),
    referrer_name: creditedPartner?.name || '',
    attribution: safeAttribution,
  }
}

export function buildTelegramLeadUrl(payload, { eventTitle = 'BULGARIA 2026' } = {}) {
  const participationLabel = knownParticipation.get(payload.participation)
  const lines = [
    `Здравствуйте! Хочу оставить заявку на ${eventTitle}.`,
    '',
    `Имя: ${payload.name}`,
    `Telegram: ${payload.telegram}`,
    payload.alternate_contact ? `Телефон или email: ${payload.alternate_contact}` : '',
    payload.country ? `Страна: ${payload.country}` : '',
    `Формат: ${participationLabel || payload.participation}`,
    payload.referrer_name ? `По приглашению: ${payload.referrer_name}` : '',
    payload.comment ? `Комментарий: ${payload.comment}` : '',
  ].filter(Boolean)
  const url = new URL('https://t.me/maslovanataly')
  url.searchParams.set('text', lines.join('\n'))
  return url.toString()
}

export async function submitLead(endpoint, payload, { signal, fetchImpl = fetch } = {}) {
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  let result = null
  try {
    result = await response.json()
  } catch {
    // The status code remains the source of truth when the response is not JSON.
  }

  if (!response.ok) {
    const error = new Error(result?.message || 'Не удалось отправить заявку.')
    error.status = response.status
    error.fieldErrors = result?.fieldErrors || null
    throw error
  }

  return result || { ok: true }
}

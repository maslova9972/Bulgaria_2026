import { referralPartnerSlugs } from './referralPartners.js'

export const ATTRIBUTION_STORAGE_KEY = 'btb2026.attribution.v1'
export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const ATTRIBUTION_FIELD_NAMES = Object.freeze([
  'ref_first',
  'ref_last',
  'credited_ref',
  'utm_source_first',
  'utm_source_last',
  'utm_medium_first',
  'utm_medium_last',
  'utm_campaign_first',
  'utm_campaign_last',
  'utm_content_first',
  'utm_content_last',
  'utm_term_first',
  'utm_term_last',
  'landing_first',
  'landing_last',
  'touch_at_first',
  'touch_at_last',
  'current_path',
])

const ATTRIBUTION_VERSION = 1
const MAX_CAMPAIGN_VALUE_LENGTH = 128
const MAX_PATH_LENGTH = 240
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g
const referralSlugSet = new Set(referralPartnerSlugs)
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''

  return value.replace(CONTROL_CHARACTERS, '').trim().slice(0, maxLength)
}

export function normalizeReferral(value) {
  const normalized = cleanText(value, 64).toLowerCase()

  return referralSlugSet.has(normalized) ? normalized : ''
}

function normalizeLandingPath(value) {
  const normalized = cleanText(value, MAX_PATH_LENGTH)
  return normalized.startsWith('/') ? normalized : '/'
}

function isFreshTimestamp(value, now) {
  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp)
    && timestamp <= now + MAX_FUTURE_SKEW_MS
    && now - timestamp <= ATTRIBUTION_TTL_MS
}

function normalizeReferralTouch(value, now) {
  if (!value || !isFreshTimestamp(value.captured_at, now)) return null

  const ref = normalizeReferral(value.ref)
  if (!ref) return null

  return {
    ref,
    landing_path: normalizeLandingPath(value.landing_path),
    captured_at: new Date(value.captured_at).toISOString(),
  }
}

function normalizeCampaignTouch(value, now) {
  if (!value || !isFreshTimestamp(value.captured_at, now)) return null

  const campaign = Object.fromEntries(
    utmKeys.map((key) => [key, cleanText(value[key], MAX_CAMPAIGN_VALUE_LENGTH)]),
  )

  if (!utmKeys.some((key) => campaign[key])) return null

  return {
    ...campaign,
    landing_path: normalizeLandingPath(value.landing_path),
    captured_at: new Date(value.captured_at).toISOString(),
  }
}

function emptyRecord() {
  return {
    version: ATTRIBUTION_VERSION,
    firstReferral: null,
    lastReferral: null,
    firstCampaign: null,
    lastCampaign: null,
  }
}

function normalizeRecord(value, now) {
  if (!value || value.version !== ATTRIBUTION_VERSION) return emptyRecord()

  const record = {
    version: ATTRIBUTION_VERSION,
    firstReferral: normalizeReferralTouch(value.firstReferral, now),
    lastReferral: normalizeReferralTouch(value.lastReferral, now),
    firstCampaign: normalizeCampaignTouch(value.firstCampaign, now),
    lastCampaign: normalizeCampaignTouch(value.lastCampaign, now),
  }

  if (!record.firstReferral && record.lastReferral) record.firstReferral = record.lastReferral
  if (!record.firstCampaign && record.lastCampaign) record.firstCampaign = record.lastCampaign

  return record
}

function safeRead(storage, now) {
  if (!storage) return emptyRecord()

  try {
    const serialized = storage.getItem(ATTRIBUTION_STORAGE_KEY)
    return serialized ? normalizeRecord(JSON.parse(serialized), now) : emptyRecord()
  } catch {
    try {
      storage.removeItem(ATTRIBUTION_STORAGE_KEY)
    } catch {
      // Storage can be blocked entirely (for example, in Safari private mode).
    }

    return emptyRecord()
  }
}

function hasAttribution(record) {
  return Boolean(
    record.firstReferral
      || record.lastReferral
      || record.firstCampaign
      || record.lastCampaign,
  )
}

function safeWrite(storage, record) {
  if (!storage) return

  try {
    if (hasAttribution(record)) {
      storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(record))
    } else {
      storage.removeItem(ATTRIBUTION_STORAGE_KEY)
    }
  } catch {
    // Attribution remains available for the current page even when persistence is blocked.
  }
}

function makeCurrentTouches(search, pathname, now) {
  const params = new URLSearchParams(search)
  const capturedAt = new Date(now).toISOString()
  const landingPath = normalizeLandingPath(pathname)
  const ref = normalizeReferral(params.get('ref'))
  const campaign = Object.fromEntries(
    utmKeys.map((key) => [key, cleanText(params.get(key), MAX_CAMPAIGN_VALUE_LENGTH)]),
  )

  return {
    referral: ref
      ? { ref, landing_path: landingPath, captured_at: capturedAt }
      : null,
    campaign: utmKeys.some((key) => campaign[key])
      ? { ...campaign, landing_path: landingPath, captured_at: capturedAt }
      : null,
  }
}

function pickTouch(firstOrLast, referral, campaign) {
  const touches = [referral, campaign].filter(Boolean)
  if (!touches.length) return null

  return touches.reduce((selected, touch) => {
    const selectedTime = Date.parse(selected.captured_at)
    const touchTime = Date.parse(touch.captured_at)

    if (firstOrLast === 'first') return touchTime < selectedTime ? touch : selected
    return touchTime > selectedTime ? touch : selected
  })
}

export function flattenAttribution(record, currentPath = '/') {
  const firstTouch = pickTouch('first', record.firstReferral, record.firstCampaign)
  const lastTouch = pickTouch('last', record.lastReferral, record.lastCampaign)
  const firstCampaign = record.firstCampaign || {}
  const lastCampaign = record.lastCampaign || {}

  return {
    ref_first: record.firstReferral?.ref || '',
    ref_last: record.lastReferral?.ref || '',
    credited_ref: record.lastReferral?.ref || record.firstReferral?.ref || '',
    utm_source_first: firstCampaign.utm_source || '',
    utm_source_last: lastCampaign.utm_source || '',
    utm_medium_first: firstCampaign.utm_medium || '',
    utm_medium_last: lastCampaign.utm_medium || '',
    utm_campaign_first: firstCampaign.utm_campaign || '',
    utm_campaign_last: lastCampaign.utm_campaign || '',
    utm_content_first: firstCampaign.utm_content || '',
    utm_content_last: lastCampaign.utm_content || '',
    utm_term_first: firstCampaign.utm_term || '',
    utm_term_last: lastCampaign.utm_term || '',
    landing_first: firstTouch?.landing_path || '',
    landing_last: lastTouch?.landing_path || '',
    touch_at_first: firstTouch?.captured_at || '',
    touch_at_last: lastTouch?.captured_at || '',
    current_path: normalizeLandingPath(currentPath),
  }
}

export function captureAttribution({ search = '', pathname = '/', storage = null, now = Date.now() } = {}) {
  const record = safeRead(storage, now)
  const current = makeCurrentTouches(search, pathname, now)

  if (current.referral) {
    if (!record.firstReferral) record.firstReferral = current.referral
    record.lastReferral = current.referral
  }

  if (current.campaign) {
    if (!record.firstCampaign) record.firstCampaign = current.campaign
    record.lastCampaign = current.campaign
  }

  safeWrite(storage, record)
  return flattenAttribution(record, pathname)
}

export function captureReferralAttribution() {
  if (typeof window === 'undefined') return flattenAttribution(emptyRecord())

  let storage = null
  try {
    storage = window.localStorage
  } catch {
    // Some privacy modes throw while the localStorage property is being accessed.
  }

  return captureAttribution({
    search: window.location.search,
    pathname: window.location.pathname,
    storage,
  })
}

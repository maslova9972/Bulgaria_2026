export const ATTRIBUTION_CONSENT_STORAGE_KEY = 'btb2026.attribution-consent.v1'
export const PRIVACY_PREFERENCES_EVENT = 'btb2026:open-privacy-preferences'

const attributionQueryKeys = Object.freeze([
  'ref',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
])

function browserStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readAttributionConsent(storage = browserStorage()) {
  if (!storage) return 'unset'

  try {
    const value = storage.getItem(ATTRIBUTION_CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : 'unset'
  } catch {
    return 'unset'
  }
}

export function writeAttributionConsent(value, storage = browserStorage()) {
  if (value !== 'granted' && value !== 'denied') {
    throw new TypeError('Consent must be granted or denied')
  }

  try {
    storage?.setItem(ATTRIBUTION_CONSENT_STORAGE_KEY, value)
  } catch {
    // The current-page choice still applies when browser storage is unavailable.
  }

  return value
}

export function hasAttributionQuery(search = '') {
  const params = new URLSearchParams(search)
  return attributionQueryKeys.some((key) => params.has(key))
}

export function openPrivacyPreferences() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PRIVACY_PREFERENCES_EVENT))
}

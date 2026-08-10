import { ATTRIBUTION_FIELD_NAMES } from './attribution.js'

export const TALLY_WIDGET_SRC = 'https://tally.so/widgets/embed.js'

export function normalizeTallyFormId(value) {
  if (typeof value !== 'string') return ''

  const normalized = value.trim()
  return /^[a-zA-Z0-9_-]{4,64}$/.test(normalized) ? normalized : ''
}

export function buildTallyUrl(formId, attribution = {}, { embed = true } = {}) {
  const normalizedId = normalizeTallyFormId(formId)
  if (!normalizedId) return ''

  const url = new URL(`https://tally.so/${embed ? 'embed' : 'r'}/${normalizedId}`)

  if (embed) {
    url.searchParams.set('alignLeft', '1')
    url.searchParams.set('hideTitle', '1')
    url.searchParams.set('transparentBackground', '1')
    url.searchParams.set('dynamicHeight', '1')
  }

  url.searchParams.set('lead_source', 'website')

  for (const fieldName of ATTRIBUTION_FIELD_NAMES) {
    const value = attribution[fieldName]
    if (typeof value === 'string' && value) url.searchParams.set(fieldName, value)
  }

  return url.toString()
}

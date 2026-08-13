import { useEffect, useMemo, useState } from 'react'
import {
  captureReferralAttribution,
  clearStoredAttribution,
} from './attribution.js'
import {
  hasAttributionQuery,
  PRIVACY_PREFERENCES_EVENT,
  readAttributionConsent,
  writeAttributionConsent,
} from './privacyConsent.js'
import { sitePageUrl } from './sitePages.js'

const privacyUrl = `${sitePageUrl('legal.html')}#privacy`

export default function PrivacyPreferences({ children }) {
  const initialConsent = useMemo(() => readAttributionConsent(), [])
  const [consent, setConsent] = useState(initialConsent)
  const [isOpen, setIsOpen] = useState(
    initialConsent === 'unset' && hasAttributionQuery(globalThis.location?.search ?? ''),
  )
  const [attribution, setAttribution] = useState(() => captureReferralAttribution())

  useEffect(() => {
    const openPreferences = () => setIsOpen(true)
    window.addEventListener(PRIVACY_PREFERENCES_EVENT, openPreferences)
    return () => window.removeEventListener(PRIVACY_PREFERENCES_EVENT, openPreferences)
  }, [])

  function choose(nextConsent) {
    writeAttributionConsent(nextConsent)
    setConsent(nextConsent)

    if (nextConsent === 'denied') clearStoredAttribution()
    setAttribution(captureReferralAttribution())
    setIsOpen(false)
  }

  return (
    <>
      {children(attribution)}
      {isOpen && (
        <section
          className="privacy-preferences"
          role="dialog"
          aria-modal="false"
          aria-labelledby="privacy-preferences-title"
        >
          <div className="privacy-preferences__copy">
            <h2 id="privacy-preferences-title">
              Сохранить приглашение <span>на 30 дней?</span>
            </h2>
            <p>
              Сайт может запомнить код рекомендателя и метки кампании. Имя, Telegram и текст
              заявки в браузере не сохраняются.
            </p>
          </div>
          <div className="privacy-preferences__actions">
            <button type="button" onClick={() => choose('granted')}>
              Разрешить на 30 дней
            </button>
            <button className="privacy-preferences__secondary" type="button" onClick={() => choose('denied')}>
              Только этот визит
            </button>
            <a href={privacyUrl}>Подробнее</a>
          </div>
          {consent !== 'unset' && (
            <p className="privacy-preferences__current" aria-live="polite">
              Сейчас: {consent === 'granted' ? 'хранение разрешено' : 'хранение отключено'}.
            </p>
          )}
        </section>
      )}
    </>
  )
}

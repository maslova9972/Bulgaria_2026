import { useEffect, useRef, useState } from 'react'

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script'
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim()

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile)

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID)
    const handleLoad = () => resolve(window.turnstile)

    if (existing) {
      existing.addEventListener('load', handleLoad, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', reject, { once: true })
    document.head.appendChild(script)
  })
}

export default function TurnstileWidget({ onTokenChange, resetKey }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const callbackRef = useRef(onTokenChange)
  const [message, setMessage] = useState('')
  callbackRef.current = onTokenChange

  useEffect(() => {
    if (!turnstileSiteKey) return undefined
    let cancelled = false

    loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled || !turnstile || !containerRef.current) return
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: turnstileSiteKey,
          action: 'lead_submit',
          appearance: 'interaction-only',
          theme: 'light',
          callback(token) {
            setMessage('')
            callbackRef.current(token)
          },
          'expired-callback'() {
            callbackRef.current('')
          },
          'error-callback'() {
            setMessage('Не удалось выполнить проверку. Обновите её и попробуйте снова.')
            callbackRef.current('')
          },
        })
      })
      .catch(() => setMessage('Проверка временно недоступна. Попробуйте обновить страницу.'))

    return () => {
      cancelled = true
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [])

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      callbackRef.current('')
    }
  }, [resetKey])

  if (!turnstileSiteKey) return null

  return (
    <div className="turnstile-check">
      <div ref={containerRef} />
      {message && <p role="alert">{message}</p>}
    </div>
  )
}

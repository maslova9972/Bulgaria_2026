import { useEffect, useMemo, useState } from 'react'
import { buildTallyUrl, normalizeTallyFormId, TALLY_WIDGET_SRC } from './tally.js'

const tallyFormId = normalizeTallyFormId(import.meta.env.VITE_TALLY_FORM_ID || '')

function loadEmbedFallback(iframe) {
  if (iframe && !iframe.getAttribute('src')) {
    iframe.setAttribute('src', iframe.dataset.tallySrc)
  }
}

export default function TallyLeadForm({ attribution }) {
  const [status, setStatus] = useState('loading')
  const embedUrl = useMemo(() => buildTallyUrl(tallyFormId, attribution), [attribution])
  const standaloneUrl = useMemo(
    () => buildTallyUrl(tallyFormId, attribution, { embed: false }),
    [attribution],
  )

  useEffect(() => {
    if (!embedUrl) return undefined

    const iframe = document.querySelector('#lead-form iframe[data-tally-src]')
    const load = () => {
      if (window.Tally?.loadEmbeds) {
        window.Tally.loadEmbeds()
      } else {
        loadEmbedFallback(iframe)
      }
    }
    const handleScriptError = () => loadEmbedFallback(iframe)
    const handleMessage = (event) => {
      if (event.origin !== 'https://tally.so' || typeof event.data !== 'string') return
      if (!event.data.includes('Tally.FormLoaded') && !event.data.includes('Tally.FormSubmitted')) return

      try {
        const message = JSON.parse(event.data)
        if (message?.payload?.formId !== tallyFormId) return

        setStatus(event.data.includes('Tally.FormSubmitted') ? 'submitted' : 'loaded')
      } catch {
        // Ignore unrelated or malformed postMessage events.
      }
    }

    window.addEventListener('message', handleMessage)

    let script = document.querySelector(`script[src="${TALLY_WIDGET_SRC}"]`)
    let scriptCreatedHere = false

    if (window.Tally?.loadEmbeds) {
      load()
    } else if (script) {
      script.addEventListener('load', load, { once: true })
      script.addEventListener('error', handleScriptError, { once: true })
    } else {
      script = document.createElement('script')
      script.src = TALLY_WIDGET_SRC
      script.async = true
      script.addEventListener('load', load, { once: true })
      script.addEventListener('error', handleScriptError, { once: true })
      document.body.appendChild(script)
      scriptCreatedHere = true
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      script?.removeEventListener('load', load)
      script?.removeEventListener('error', handleScriptError)
      if (scriptCreatedHere && !script?.isConnected) script?.remove()
    }
  }, [embedUrl])

  if (!embedUrl) return null

  const liveMessage = status === 'submitted'
    ? 'Заявка отправлена. Наталья свяжется с вами по указанному контакту.'
    : status === 'loaded'
      ? 'Форма заявки загружена.'
      : 'Форма заявки загружается.'

  return (
    <div className="tally-form">
      <p className="sr-only" aria-live="polite">{liveMessage}</p>
      <iframe
        data-tally-src={embedUrl}
        loading="lazy"
        width="100%"
        height="360"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Заявка на участие в Business & Travel Bulgaria 2026"
      />
      <p className="tally-form__fallback">
        Если форма не открылась,{' '}
        <a href={standaloneUrl} target="_blank" rel="noreferrer">
          заполните её в новой вкладке
        </a>.
      </p>
    </div>
  )
}

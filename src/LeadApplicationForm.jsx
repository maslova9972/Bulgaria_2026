import { useMemo, useRef, useState } from 'react'
import {
  buildLeadPayload,
  buildTelegramLeadUrl,
  normalizeLeadEndpoint,
  participationOptions,
  submitLead,
  validateLeadForm,
} from './leadForm.js'
import TurnstileWidget, { turnstileSiteKey } from './TurnstileWidget.jsx'

const initialValues = {
  name: '',
  telegram: '',
  alternateContact: '',
  country: '',
  participation: '',
  comment: '',
  consent: false,
  website: '',
}

const configuredEndpoint = normalizeLeadEndpoint(import.meta.env.VITE_LEAD_ENDPOINT || '')

function FieldError({ id, message }) {
  return message ? <span className="field-error" id={id}>{message}</span> : null
}

export default function LeadApplicationForm({
  attribution,
  partner,
  options = participationOptions,
  eventTitle = 'BULGARIA 2026',
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [lastPayload, setLastPayload] = useState(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const formRef = useRef(null)
  const successRef = useRef(null)
  const telegramFallbackUrl = useMemo(
    () => (lastPayload ? buildTelegramLeadUrl(lastPayload, { eventTitle }) : ''),
    [lastPayload, eventTitle],
  )

  const updateValue = (event) => {
    const { name, type, checked, value } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
    if (status === 'error' || status === 'telegram') {
      setStatus('idle')
      setStatusMessage('')
    }
  }

  const focusFirstError = () => {
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return

    const nextErrors = validateLeadForm(values)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setStatus('error')
      setStatusMessage('Проверьте отмеченные поля.')
      focusFirstError()
      return
    }

    if (configuredEndpoint && turnstileSiteKey && !turnstileToken) {
      setStatus('error')
      setStatusMessage('Завершите проверку безопасности и отправьте заявку ещё раз.')
      return
    }

    const payload = {
      ...buildLeadPayload(values, attribution),
      turnstile_token: turnstileToken,
    }
    setLastPayload(payload)
    setErrors({})

    if (!configuredEndpoint) {
      const telegramUrl = buildTelegramLeadUrl(payload, { eventTitle })
      window.open(telegramUrl, '_blank', 'noopener,noreferrer')
      setStatus('telegram')
      setStatusMessage('Заявка подготовлена в Telegram. Осталось нажать «Отправить».')
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)
    setStatus('submitting')
    setStatusMessage('Отправляем заявку…')

    try {
      await submitLead(configuredEndpoint, payload, { signal: controller.signal })
      setStatus('success')
      setStatusMessage('Заявка отправлена. Наталья свяжется с вами по указанному контакту.')
      setValues(initialValues)
      window.requestAnimationFrame(() => successRef.current?.focus())
    } catch (error) {
      if (error.fieldErrors) {
        setErrors(error.fieldErrors)
        focusFirstError()
      }
      setStatus('error')
      setStatusMessage(
        error.name === 'AbortError'
          ? 'Сервер отвечает слишком долго. Попробуйте ещё раз или отправьте заявку в Telegram.'
          : 'Не удалось отправить заявку. Данные сохранены в форме. Попробуйте снова или используйте Telegram.',
      )
      setTurnstileResetKey((value) => value + 1)
    } finally {
      window.clearTimeout(timeout)
    }
  }

  if (status === 'success') {
    return (
      <div className="lead-form lead-form--success" ref={successRef} tabIndex="-1" role="status">
        <span>Заявка принята</span>
        <h3>Спасибо, {lastPayload?.name}</h3>
        <p>{statusMessage}</p>
        {partner && <p>Реферальный партнёр: <strong>{partner.name}</strong>.</p>}
        <button
          type="button"
          className="lead-form__reset"
          onClick={() => {
            setLastPayload(null)
            setStatus('idle')
            setStatusMessage('')
          }}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  return (
    <form className="lead-form" ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Заявка на участие">
      <div className="lead-form__intro">
        <strong>Короткая заявка</strong>
        <span>Поля со звёздочкой обязательны</span>
      </div>

      <div className="lead-form__grid">
        <label className="form-field">
          <span>Имя *</span>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={updateValue}
            autoComplete="name"
            maxLength="80"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <FieldError id="name-error" message={errors.name} />
        </label>

        <label className="form-field">
          <span>Telegram *</span>
          <input
            type="text"
            name="telegram"
            value={values.telegram}
            onChange={updateValue}
            placeholder="@username"
            autoComplete="off"
            maxLength="80"
            aria-invalid={Boolean(errors.telegram)}
            aria-describedby={errors.telegram ? 'telegram-error' : undefined}
          />
          <FieldError id="telegram-error" message={errors.telegram} />
        </label>

        <label className="form-field">
          <span>Телефон или email</span>
          <input
            type="text"
            name="alternateContact"
            value={values.alternateContact}
            onChange={updateValue}
            autoComplete="email"
            maxLength="120"
            aria-invalid={Boolean(errors.alternateContact)}
            aria-describedby={errors.alternateContact ? 'alternate-contact-error' : undefined}
          />
          <FieldError id="alternate-contact-error" message={errors.alternateContact} />
        </label>

        <label className="form-field">
          <span>Страна</span>
          <input
            type="text"
            name="country"
            value={values.country}
            onChange={updateValue}
            autoComplete="country-name"
            maxLength="80"
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? 'country-error' : undefined}
          />
          <FieldError id="country-error" message={errors.country} />
        </label>

        <label className="form-field form-field--wide">
          <span>Формат участия *</span>
          <select
            name="participation"
            value={values.participation}
            onChange={updateValue}
            aria-invalid={Boolean(errors.participation)}
            aria-describedby={errors.participation ? 'participation-error' : undefined}
          >
            <option value="">Выберите вариант</option>
            {options.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
          <FieldError id="participation-error" message={errors.participation} />
        </label>

        <label className="form-field form-field--wide">
          <span>Комментарий</span>
          <textarea
            name="comment"
            value={values.comment}
            onChange={updateValue}
            maxLength="1000"
            rows="4"
            placeholder="Вопросы, пожелания или детали участия"
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? 'comment-error' : undefined}
          />
          <FieldError id="comment-error" message={errors.comment} />
        </label>
      </div>

      <label className="honeypot-field" aria-hidden="true">
        Website
        <input
          type="text"
          name="website"
          value={values.website}
          onChange={updateValue}
          tabIndex="-1"
          autoComplete="off"
        />
      </label>

      <label className="consent-field">
        <input
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={updateValue}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <span>Согласен(на) на обработку данных для ответа на эту заявку.</span>
      </label>
      <FieldError id="consent-error" message={errors.consent} />

      {configuredEndpoint && (
        <TurnstileWidget onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} />
      )}

      <button className="lead-form__submit" type="submit" disabled={status === 'submitting'}>
        <span>
          {status === 'submitting'
            ? 'Отправляем…'
            : configuredEndpoint
              ? 'Отправить заявку'
              : 'Продолжить в Telegram'}
        </span>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
          <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>

      <div className={`lead-form__status lead-form__status--${status}`} aria-live="polite">
        {statusMessage && <p>{statusMessage}</p>}
        {(status === 'error' || status === 'telegram') && telegramFallbackUrl && (
          <a href={telegramFallbackUrl} target="_blank" rel="noreferrer">
            Открыть заполненную заявку в Telegram
          </a>
        )}
      </div>

      {!configuredEndpoint && (
        <p className="lead-form__delivery-note">
          Заявка откроется в Telegram уже заполненной. Останется нажать «Отправить».
        </p>
      )}
    </form>
  )
}

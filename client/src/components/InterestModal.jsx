import { useEffect, useRef, useState } from 'react'
import Btn from './Btn.jsx'

// Same-origin call. Vite (local) or the Cloudflare Function (production) forwards it to Express.
const EMPTY = { name: '', email: '', company: '', website: '' }

const FIELDS = [
  { key: 'name', label: 'Your name', type: 'text', autoComplete: 'name', max: 100, placeholder: 'Jane Doe' },
  { key: 'email', label: 'Work email', type: 'email', autoComplete: 'email', max: 200, placeholder: 'jane@company.com' },
  { key: 'company', label: 'Company', type: 'text', autoComplete: 'organization', max: 150, placeholder: 'Company name' },
]

export default function InterestModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const firstInput = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstInput.current?.focus(), 150)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      lastFocus.current?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setForm(EMPTY)
      setStatus('idle')
      setMessage('')
      setFieldErrors({})
    }, 400)
    return () => clearTimeout(t)
  }, [open])

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (fieldErrors[key]) setFieldErrors((fe) => ({ ...fe, [key]: undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    setMessage('')
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFieldErrors(data.fields || {})
        setMessage(data.error || 'Your details were not sent. Try again.')
        setStatus('error')
        return
      }
      setStatus('sent')
    } catch {
      setMessage('Could not reach the server. Check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <div className={`modal-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="interest-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="modal-done">
            <span className="done-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path className="tick" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 id="interest-title">
              Thanks, <em>{form.name.split(' ')[0]}.</em>
            </h2>
            <p>
              Your details are saved. I'll reply to <strong>{form.email}</strong> soon.
            </p>
            <Btn onClick={onClose}>Close</Btn>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 id="interest-title" className="modal-title">
              Let's <em>talk.</em>
            </h2>
            <p className="modal-lede">Leave your details and I'll get back to you by email.</p>

            {FIELDS.map((f, i) => (
              <label key={f.key} className={`field${fieldErrors[f.key] ? ' has-error' : ''}`} style={{ '--i': i }}>
                <span className="field-label">{f.label}</span>
                <input
                  ref={i === 0 ? firstInput : undefined}
                  type={f.type}
                  name={f.key}
                  autoComplete={f.autoComplete}
                  required
                  maxLength={f.max}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={update(f.key)}
                  aria-invalid={Boolean(fieldErrors[f.key])}
                />
                {fieldErrors[f.key] && <em>{fieldErrors[f.key]}</em>}
              </label>
            ))}

            {/* Honeypot: hidden from people, filled by bots */}
            <label className="hp" aria-hidden="true">
              Website
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
            </label>

            {status === 'error' && (
              <p className="form-error" role="alert">
                {message}
              </p>
            )}

            <div className="modal-submit">
              <Btn
                type="submit"
                size="large"
                icon={status === 'sending' ? undefined : 'arrow'}
                className={`btn-wide${status === 'sending' ? ' is-loading' : ''}`}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending' : 'Send my details'}
              </Btn>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
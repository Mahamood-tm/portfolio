import { useEffect, useRef, useState } from 'react'

// Same-origin call. Vite (local) or the Cloudflare Function (production) forwards it to Express.
const EMPTY = { name: '', email: '', company: '', website: '' }

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
    const t = setTimeout(() => firstInput.current?.focus(), 40)
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
    if (!open) {
      // Reset after the closing animation.
      const t = setTimeout(() => {
        setForm(EMPTY)
        setStatus('idle')
        setMessage('')
        setFieldErrors({})
      }, 300)
      return () => clearTimeout(t)
    }
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

  const field = (key, labelText, type, autoComplete, ref) => (
    <label className={`field${fieldErrors[key] ? ' has-error' : ''}`}>
      <span>{labelText}</span>
      <input
        ref={ref}
        type={type}
        name={key}
        autoComplete={autoComplete}
        required
        maxLength={key === 'email' ? 200 : 150}
        value={form[key]}
        onChange={update(key)}
        aria-invalid={Boolean(fieldErrors[key])}
      />
      {fieldErrors[key] && <em>{fieldErrors[key]}</em>}
    </label>
  )

  return (
    <div className={`modal-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="interest-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="modal-done">
            <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
              <rect x="2" y="2" width="60" height="60" fill="none" stroke="#E5172F" strokeWidth="3" />
              <path className="tick" d="M18 33l9 9 19-20" fill="none" stroke="#E5172F" strokeWidth="5" />
            </svg>
            <h2 id="interest-title">Thanks, {form.name.split(' ')[0]}.</h2>
            <p>
              Your interest is saved. I'll reply to <strong>{form.email}</strong> soon.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate={false}>
            <h2 id="interest-title">Interested in working together?</h2>
            <p className="modal-lede">Leave your details and I'll get back to you by email.</p>
            {field('name', 'Your name', 'text', 'name', firstInput)}
            {field('email', 'Work email', 'email', 'email')}
            {field('company', 'Company', 'text', 'organization')}
            {/* Honeypot: hidden from people, filled by bots */}
            <label className="hp" aria-hidden="true">
              Website
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
            </label>
            {status === 'error' && <p className="form-error" role="alert">{message}</p>}
            <button className="btn btn-primary btn-wide" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send my details'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

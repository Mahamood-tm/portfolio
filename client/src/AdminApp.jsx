import { useCallback, useEffect, useMemo, useState } from 'react'
import Btn from './components/Btn.jsx'
import Icon from './components/Icon.jsx'
import './admin.css'

// Same-origin calls; the session lives in httpOnly cookies set by Express.
async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Try again.')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

const fmtDate = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export default function AdminApp() {
  const [state, setState] = useState('checking') // checking | out | in
  const [email, setEmail] = useState('')

  useEffect(() => {
    document.title = 'Admin · Mahamood'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)

    api('/api/admin/me')
      .then((d) => {
        setEmail(d.email)
        setState('in')
      })
      .catch(() => setState('out'))

    return () => meta.remove()
  }, [])

  if (state === 'checking') {
    return (
      <div className="admin-center">
        <span className="admin-spinner" aria-label="Loading" />
      </div>
    )
  }
  if (state === 'out') {
    return (
      <Login
        onSignedIn={(e) => {
          setEmail(e)
          setState('in')
        }}
      />
    )
  }
  return <Dashboard email={email} onSignedOut={() => setState('out')} />
}

/* ---------------------------------------------------------------- */

function Login({ onSignedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(Date.now())

  // Tick once a second while the form is locked, then unlock automatically.
  useEffect(() => {
    if (!lockedUntil) return
    const t = setInterval(() => {
      const n = Date.now()
      setNow(n)
      if (n >= lockedUntil) {
        setLockedUntil(0)
        setError('')
      }
    }, 1000)
    return () => clearInterval(t)
  }, [lockedUntil])

  const secondsLeft = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - now) / 1000)) : 0
  const countdown = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`
  const locked = secondsLeft > 0

  async function submit(e) {
    e.preventDefault()
    if (locked) return
    setBusy(true)
    setError('')
    try {
      const d = await api('/api/admin/login', { method: 'POST', body: { email, password } })
      onSignedIn(d.email)
    } catch (err) {
      if (err.status === 429) {
        const until = Date.now() + (err.data?.retryAfter || 900) * 1000
        setNow(Date.now())
        setLockedUntil(until)
        setError('Too many failed attempts. Sign-in is paused for this network.')
      } else if (err.status === 401 && typeof err.data?.attemptsLeft === 'number') {
        const left = err.data.attemptsLeft
        setError(
          left > 0
            ? `${err.message} ${left} ${left === 1 ? 'attempt' : 'attempts'} left.`
            : `${err.message} That was the last attempt for 15 minutes.`
        )
      } else {
        setError(err.message)
      }
      setPassword('')
      setBusy(false)
    }
  }

  return (
    <div className="admin-center">
      <a className="logo admin-logo" href="/">
        Mahamood<sup>°</sup>
      </a>
      <form className="admin-login" onSubmit={submit}>
        <span className="admin-lock" aria-hidden="true">
          <Icon name="shield" size={22} />
        </span>
        <h1>
          Admin <em>sign in.</em>
        </h1>
        <p className="admin-lede">Only the site owner can open this page.</p>

        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <span className="pw-wrap">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)}>
              {show ? 'Hide' : 'Show'}
            </button>
          </span>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-submit">
          <Btn
            type="submit"
            size="large"
            icon={busy || locked ? undefined : 'arrow'}
            className={`btn-wide${busy ? ' is-loading' : ''}`}
            disabled={busy || locked}
          >
            {locked ? `Try again in ${countdown}` : busy ? 'Signing in' : 'Sign in'}
          </Btn>
        </div>
      </form>
      <a className="admin-back" href="/">
        Back to portfolio
      </a>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Dashboard({ email, onSignedOut }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const d = await api('/api/admin/interests')
      setRows(d.interests || [])
    } catch (err) {
      if (err.status === 401) return onSignedOut()
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [onSignedOut])

  useEffect(() => {
    load()
  }, [load])

  // A second click within 3 seconds confirms the delete.
  useEffect(() => {
    if (!confirmId) return
    const t = setTimeout(() => setConfirmId(null), 3000)
    return () => clearTimeout(t)
  }, [confirmId])

  async function remove(id) {
    if (confirmId !== id) return setConfirmId(id)
    setConfirmId(null)
    const before = rows
    setRows((r) => r.filter((x) => x.id !== id))
    try {
      await api(`/api/admin/interests/${id}`, { method: 'DELETE' })
    } catch (err) {
      if (err.status === 401) return onSignedOut()
      setRows(before)
      setError(err.message)
    }
  }

  async function signOut() {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => {})
    onSignedOut()
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => `${r.name} ${r.email} ${r.company}`.toLowerCase().includes(q))
  }, [rows, query])

  const stats = useMemo(() => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    const startOfToday = new Date().setHours(0, 0, 0, 0)
    return {
      total: rows.length,
      week: rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * day).length,
      today: rows.filter((r) => new Date(r.created_at).getTime() >= startOfToday).length,
    }
  }, [rows])

  function exportCsv() {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lines = [
      ['Name', 'Email', 'Company', 'Date'].map(esc).join(','),
      ...filtered.map((r) => [r.name, r.email, r.company, new Date(r.created_at).toISOString()].map(esc).join(',')),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interested-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <a className="logo" href="/">
          Mahamood<sup>°</sup>
          <span className="admin-tag">Admin</span>
        </a>
        <div className="admin-user">
          <span className="admin-email">{email}</span>
          <Btn variant="light" size="small" onClick={signOut}>
            Sign out
          </Btn>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-head">
          <h1 className="serif-h">
            Interested <em>people.</em>
          </h1>
          <div className="admin-actions">
            <Btn variant="light" size="small" onClick={load} disabled={loading}>
              Refresh
            </Btn>
            <Btn size="small" icon="download" onClick={exportCsv} disabled={!filtered.length}>
              Export CSV
            </Btn>
          </div>
        </div>

        <dl className="admin-stats">
          <div className="mini-card">
            <dt>Total</dt>
            <dd>{stats.total}</dd>
          </div>
          <div className="mini-card">
            <dt>Last 7 days</dt>
            <dd>{stats.week}</dd>
          </div>
          <div className="mini-card">
            <dt>Today</dt>
            <dd>{stats.today}</dd>
          </div>
        </dl>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="card admin-table-card">
          <div className="admin-toolbar">
            <label className="admin-search">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search name, email or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <span className="admin-count">
              {filtered.length} of {rows.length}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty">
              <span className="admin-spinner" aria-label="Loading" />
            </div>
          ) : rows.length === 0 ? (
            <div className="admin-empty">
              <p className="admin-empty-title">No one has clicked "I'm interested" yet.</p>
              <p>Share your portfolio link with recruiters and new entries will show up here.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <p className="admin-empty-title">No matches for "{query}".</p>
              <p>Try a different name, email or company.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Date</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Name" className="cell-name">
                      {r.name}
                    </td>
                    <td data-label="Email">
                      <a href={`mailto:${r.email}`}>{r.email}</a>
                    </td>
                    <td data-label="Company">{r.company}</td>
                    <td data-label="Date" className="cell-date">
                      {fmtDate.format(new Date(r.created_at))}
                    </td>
                    <td className="cell-actions">
                      <button
                        className={`del-btn${confirmId === r.id ? ' is-confirm' : ''}`}
                        onClick={() => remove(r.id)}
                      >
                        {confirmId === r.id ? 'Confirm delete' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
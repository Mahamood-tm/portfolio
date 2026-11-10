import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_PUBLISHABLE_KEY, // anon / publishable key, used only to sign the admin in
  ADMIN_EMAIL, // the only account allowed into /admin
  FRONTEND_URL = 'http://localhost:5173',
  PROXY_SECRET, // set on Render; leave empty locally (Vite proxy doesn't send it)
  NODE_ENV,
  PORT = 4000,
} = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}
if (!SUPABASE_PUBLISHABLE_KEY || !ADMIN_EMAIL) {
  console.warn('SUPABASE_PUBLISHABLE_KEY or ADMIN_EMAIL is missing: the /admin login will not work.')
}

const isProd = NODE_ENV === 'production' || Boolean(PROXY_SECRET)

// Privileged client: bypasses RLS. Server-only, never sent to the browser.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// A fresh, stateless client for each sign-in / refresh, so a user session
// never replaces the service role on the shared client above.
const authClient = () =>
  createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

const app = express()
app.set('trust proxy', 1) // Render sits behind a proxy; needed for per-IP rate limits
// Safety net for direct hits; normal traffic is same-origin through the proxy.
app.use(cors({ origin: FRONTEND_URL.split(',').map((o) => o.trim()), credentials: true }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// In production, only accept /api calls that came through the Cloudflare proxy.
const viaProxy = (req) => Boolean(PROXY_SECRET) && req.get('x-proxy-secret') === PROXY_SECRET
app.use('/api', (req, res, next) => {
  if (PROXY_SECRET && !viaProxy(req)) return res.status(403).json({ error: 'Forbidden' })
  next()
})

// Real visitor IP: from the proxy header when the call is trusted, otherwise the socket IP.
const clientIp = (req) => (viaProxy(req) && req.get('x-client-ip')) || req.ip

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const clean = (v) => (typeof v === 'string' ? v.trim() : '')

/* ------------------------------------------------------------------ */
/* Public: "I'm interested" form                                       */
/* ------------------------------------------------------------------ */

const interestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: clientIp,
  message: { error: 'Too many requests from this network. Try again in 15 minutes.' },
})

app.post('/api/interest', interestLimiter, async (req, res) => {
  const body = req.body || {}
  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const company = clean(body.company)
  const website = clean(body.website) // honeypot: real people never see this field

  if (website) return res.status(201).json({ ok: true })

  const fields = {}
  if (name.length < 2 || name.length > 100) fields.name = 'Enter your name.'
  if (!EMAIL_RE.test(email) || email.length > 200) fields.email = 'Enter a valid email address.'
  if (company.length < 1 || company.length > 150) fields.company = 'Enter your company name.'
  if (Object.keys(fields).length) {
    return res.status(400).json({ error: 'Check the highlighted fields.', fields })
  }

  try {
    const { error } = await supabase.from('interests').insert({
      name,
      email,
      company,
      user_agent: (req.get('user-agent') || '').slice(0, 300) || null,
    })
    if (error) throw error
    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error('Insert failed:', err.message || err)
    return res.status(500).json({ error: 'Your details were not saved. Try again in a minute.' })
  }
})

/* ------------------------------------------------------------------ */
/* Admin: Supabase Auth + httpOnly cookies                             */
/* ------------------------------------------------------------------ */

const ACCESS_COOKIE = 'pf_at'
const REFRESH_COOKIE = 'pf_rt'
const cookieBase = { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/api' }

function readCookies(req) {
  const out = {}
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

function setSession(res, session) {
  res.cookie(ACCESS_COOKIE, session.access_token, { ...cookieBase, maxAge: (session.expires_in || 3600) * 1000 })
  res.cookie(REFRESH_COOKIE, session.refresh_token, { ...cookieBase, maxAge: 7 * 24 * 60 * 60 * 1000 })
}

function clearSession(res) {
  res.clearCookie(ACCESS_COOKIE, cookieBase)
  res.clearCookie(REFRESH_COOKIE, cookieBase)
}

const isAdminEmail = (email) =>
  Boolean(ADMIN_EMAIL) && typeof email === 'string' && email.toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()

// Lets the request through only if the cookies belong to ADMIN_EMAIL.
// Refreshes an expired access token automatically.
async function requireAdmin(req, res, next) {
  if (!SUPABASE_PUBLISHABLE_KEY || !ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Admin login is not configured on the server.' })
  }
  const cookies = readCookies(req)
  try {
    if (cookies[ACCESS_COOKIE]) {
      const { data, error } = await supabase.auth.getUser(cookies[ACCESS_COOKIE])
      if (!error && isAdminEmail(data.user?.email)) {
        req.admin = data.user
        return next()
      }
    }
    if (cookies[REFRESH_COOKIE]) {
      const { data, error } = await authClient().auth.refreshSession({ refresh_token: cookies[REFRESH_COOKIE] })
      if (!error && data.session && isAdminEmail(data.user?.email)) {
        setSession(res, data.session)
        req.admin = data.user
        return next()
      }
    }
  } catch (err) {
    console.error('Admin check failed:', err.message || err)
  }
  clearSession(res)
  return res.status(401).json({ error: 'Sign in to continue.' })
}

// 5 failed sign-ins per IP every 15 minutes. Successful sign-ins don't count.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: clientIp,
  handler: (req, res) => {
    const reset = req.rateLimit?.resetTime
    const retryAfter = reset ? Math.max(1, Math.ceil((reset.getTime() - Date.now()) / 1000)) : 900
    res.set('Retry-After', String(retryAfter))
    res.status(429).json({ error: 'Too many sign-in attempts.', retryAfter })
  },
})

app.post('/api/admin/login', loginLimiter, async (req, res) => {
  if (!SUPABASE_PUBLISHABLE_KEY || !ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Admin login is not configured on the server.' })
  }
  const email = clean(req.body?.email).toLowerCase()
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' })

  try {
    const { data, error } = await authClient().auth.signInWithPassword({ email, password })
    if (error || !data.session) {
      return res.status(401).json({
        error: 'Email or password is incorrect.',
        attemptsLeft: req.rateLimit?.remaining,
      })
    }
    if (!isAdminEmail(data.user?.email)) {
      return res.status(403).json({ error: 'This account cannot open the admin page.' })
    }
    setSession(res, data.session)
    return res.json({ email: data.user.email })
  } catch (err) {
    console.error('Login failed:', err.message || err)
    return res.status(500).json({ error: 'Sign-in failed. Try again in a minute.' })
  }
})

app.get('/api/admin/me', requireAdmin, (req, res) => res.json({ email: req.admin.email }))

app.post('/api/admin/logout', (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

app.get('/api/admin/interests', requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('interests')
      .select('id, name, email, company, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return res.json({ count: data.length, interests: data })
  } catch (err) {
    console.error('Read failed:', err.message || err)
    return res.status(500).json({ error: 'Could not load the list. Try again.' })
  }
})

app.delete('/api/admin/interests/:id', requireAdmin, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(400).json({ error: 'Invalid id.' })
  try {
    const { error } = await supabase.from('interests').delete().eq('id', req.params.id)
    if (error) throw error
    return res.json({ ok: true })
  } catch (err) {
    console.error('Delete failed:', err.message || err)
    return res.status(500).json({ error: 'Could not delete. Try again.' })
  }
})

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(PORT, () => console.log(`Portfolio API listening on :${PORT}`))
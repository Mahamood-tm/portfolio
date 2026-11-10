import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  CLIENT_ORIGIN = 'http://localhost:5173',
  ADMIN_KEY,
  PORT = 4000,
} = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const app = express()
app.set('trust proxy', 1) // Render sits behind a proxy; needed for per-IP rate limits
app.use(cors({ origin: CLIENT_ORIGIN.split(',').map((o) => o.trim()) }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const interestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests from this network. Try again in 15 minutes.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const clean = (v) => (typeof v === 'string' ? v.trim() : '')

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

// Private: list everyone who clicked "I'm interested".
// curl -H "x-admin-key: YOUR_ADMIN_KEY" https://your-api.onrender.com/api/interests
app.get('/api/interests', async (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const { data, error } = await supabase
      .from('interests')
      .select('id, name, email, company, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return res.json({ count: data.length, interests: data })
  } catch (err) {
    console.error('Read failed:', err.message || err)
    return res.status(500).json({ error: 'Could not load interests.' })
  }
})

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(PORT, () => console.log(`Portfolio API listening on :${PORT}`))

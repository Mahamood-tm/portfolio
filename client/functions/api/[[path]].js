// Cloudflare Pages Function: reverse-proxies every /api/* request to the Render backend.
// Set in Cloudflare Pages -> Settings -> Variables and Secrets:
//   BACKEND_URL   e.g. https://portfolio-api.onrender.com   (no trailing slash)
//   PROXY_SECRET  same value as PROXY_SECRET on Render

export async function onRequest({ request, env }) {
  if (!env.BACKEND_URL || !env.PROXY_SECRET) {
    return new Response(JSON.stringify({ error: 'API proxy is not configured.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const incoming = new URL(request.url)
  const target = new URL(incoming.pathname + incoming.search, env.BACKEND_URL)

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set('x-client-ip', request.headers.get('cf-connecting-ip') || '')
  headers.set('x-proxy-secret', env.PROXY_SECRET)

  const init = { method: request.method, headers, redirect: 'manual' }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
  }

  try {
    const res = await fetch(target.toString(), init)
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    })
  } catch {
    return new Response(JSON.stringify({ error: 'The server is waking up. Try again in a few seconds.' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    })
  }
}
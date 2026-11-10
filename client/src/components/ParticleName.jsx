import { useEffect, useRef } from 'react'

// Draws the given words as thousands of red particles.
// On load they fly in and assemble; the pointer pushes them apart and they spring back.
const CRIMSON = '#E5172F'
const OXBLOOD = '#8A0A18'
const FONT = 'Archivo'

export default function ParticleName({ words, label }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let particles = []
    let w = 0
    let h = 0
    let raf = 0
    let running = false
    let visible = true
    let disposed = false
    const pointer = { x: -9999, y: -9999 }

    function layout() {
      w = Math.max(1, Math.floor(wrap.clientWidth))
      const lines = words // one word per line: the name fills the hero

      const off = document.createElement('canvas')
      const o = off.getContext('2d')
      const setFont = (size) => {
        o.font = `900 ${size}px ${FONT}, Arial Black, sans-serif`
        if ('fontStretch' in o) o.fontStretch = 'expanded'
      }

      // Fit the widest line to the container width.
      setFont(200)
      const widest = Math.max(...lines.map((l) => o.measureText(l).width))
      const maxByHeight = Math.max(80, (window.innerHeight - 330) / (lines.length * 0.9))
      const size = Math.min(Math.floor((200 * w * 0.995) / widest), maxByHeight, 340)
      const lineH = Math.round(size * 0.9)
      h = Math.ceil(lineH * lines.length + size * 0.12)

      off.width = w
      off.height = h
      setFont(size)
      o.textBaseline = 'top'
      o.fillStyle = '#fff'
      lines.forEach((line, i) => o.fillText(line, 0, i * lineH))

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const pixels = o.getImageData(0, 0, w, h).data
      const gap = Math.max(3, Math.round(size / 42))
      const dot = Math.max(1.6, gap * 0.62)
      const targets = []
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (pixels[(y * w + x) * 4 + 3] > 140) targets.push([x, y])
        }
      }

      const previous = particles
      particles = targets.map(([tx, ty], i) => {
        const p = previous[i]
        return {
          tx,
          ty,
          // First load: start scattered below and around the hero so they fly in.
          x: p ? p.x : reduceMotion ? tx : Math.random() * w,
          y: p ? p.y : reduceMotion ? ty : h + Math.random() * h * 1.5,
          vx: 0,
          vy: 0,
          s: dot,
          dark: Math.random() < 0.14,
        }
      })
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = CRIMSON
      for (const p of particles) if (!p.dark) ctx.fillRect(p.x, p.y, p.s, p.s)
      ctx.fillStyle = OXBLOOD
      for (const p of particles) if (p.dark) ctx.fillRect(p.x, p.y, p.s, p.s)
    }

    const RADIUS = 130
    const R2 = RADIUS * RADIUS

    function step() {
      for (const p of particles) {
        let ax = (p.tx - p.x) * 0.05
        let ay = (p.ty - p.y) * 0.05
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1
          const force = (1 - d / RADIUS) * 11
          ax += (dx / d) * force
          ay += (dy / d) * force
        }
        p.vx = (p.vx + ax) * 0.8
        p.vy = (p.vy + ay) * 0.8
        p.x += p.vx
        p.y += p.vy
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    function start() {
      if (running || reduceMotion || !visible) return
      running = true
      raf = requestAnimationFrame(step)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    function onPointerMove(e) {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
    }
    function onPointerLeave() {
      pointer.x = -9999
      pointer.y = -9999
    }

    let resizeTimer = 0
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        layout()
        if (reduceMotion) draw()
      }, 150)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })

    const fontReady = document.fonts
      ? document.fonts.load(`900 100px ${FONT}`).catch(() => {})
      : Promise.resolve()

    fontReady.then(() => {
      if (disposed) return
      layout()
      draw()
      io.observe(canvas)
      start()
    })

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      stop()
      io.disconnect()
      clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [words])

  return (
    <div ref={wrapRef} className="particle-name">
      <h1 className="sr-only">{label}</h1>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}

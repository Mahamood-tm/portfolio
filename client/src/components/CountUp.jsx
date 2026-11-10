import { useEffect, useRef, useState } from 'react'

// Counts from 0 to `value` when `active` is true and the number is on screen.
export default function CountUp({ value, suffix = '', active = true }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!active) {
      setN(0)
      return
    }
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value)
      return
    }
    let raf = 0
    let start = 0
    const dur = 1200
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, seen, value])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}
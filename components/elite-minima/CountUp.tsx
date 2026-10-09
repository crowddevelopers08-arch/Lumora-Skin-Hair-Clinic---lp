"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  /** target value to count up to */
  end: number
  /** animation length in ms */
  duration?: number
  /** decimal places to render (e.g. 1 → "4.8") */
  decimals?: number
  /** thousands separator, e.g. "," → "5,000" */
  separator?: string
  prefix?: string
  suffix?: string
  className?: string
}

function format(n: number, decimals: number, separator: string) {
  const fixed = n.toFixed(decimals)
  if (!separator) return fixed
  const [int, dec] = fixed.split(".")
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return dec ? `${withSep}.${dec}` : withSep
}

/**
 * Counts from 0 → `end` with an ease-out curve the first time it scrolls into
 * view. Respects prefers-reduced-motion (renders the final value immediately).
 */
export default function CountUp({
  end,
  duration = 1600,
  decimals = 0,
  separator = "",
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(end)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !started.current) {
            started.current = true
            io.unobserve(en.target)
            const start = performance.now()
            const step = (now: number) => {
              const t = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - t, 4) // easeOutQuart
              setVal(end * eased)
              if (t < 1) requestAnimationFrame(step)
              else setVal(end)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(val, decimals, separator)}
      {suffix}
    </span>
  )
}

"use client"

import { useEffect, useRef, type ElementType, type ReactNode } from "react"

interface RevealProps {
  children?: ReactNode
  as?: ElementType
  /** stagger index — adds a (i % 5) * 70ms delay to sequence siblings */
  index?: number
  className?: string
  /** extra class toggled to "in" (e.g. "draw-line"); defaults to "reveal" look */
  variant?: string
}

export default function Reveal({
  children,
  as: Tag = "div",
  index = 0,
  className = "",
  variant = "reveal",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in")
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${variant} ${className}`}
      style={{ transitionDelay: `${(index % 5) * 70}ms` }}
    >
      {children}
    </Tag>
  )
}

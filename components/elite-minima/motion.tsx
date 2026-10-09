"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { EASE } from "./tokens"

/* Every primitive below animates transform + opacity (and filter on Blur)
   only. No width/height/top/box-shadow animation — those trigger layout or
   paint and are the usual cause of poor INP on mid-range mobile. */

const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const

/** Fade + rise. The default section-entry reveal. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade + rise on mount, not on scroll.
 *
 * For content that is already on screen when the page loads — a hero, above
 * all. `Reveal` below is gated on an IntersectionObserver band that excludes
 * the top and bottom 12% of the viewport, which is right for a section the
 * reader scrolls down to and wrong for one they land on: if the viewport ever
 * moves past that band without stopping inside it, the content never animates
 * in and stays at `opacity: 0` for the rest of the visit. A page opened at a
 * hash (`/circumcision#clinic`) or reloaded with a restored scroll position
 * does exactly that, and takes the hero with it.
 *
 * Nothing here waits on the viewport, so there is no band to miss.
 */
export function Rise({
  children,
  delay = 0,
  y = 18,
  className = "",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Blur-clearing reveal — reserved for headline moments. */
export function BlurReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Wraps a list; children marked with <StaggerItem> cascade in. */
export function Stagger({
  children,
  gap = 0.08,
  className = "",
}: {
  children: ReactNode
  gap?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = "", y = 22 }: { children: ReactNode; className?: string; y?: number }) {
  const reduced = useReducedMotion()
  const variants: Variants = {
    hidden: reduced ? {} : { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  }
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}

/**
 * Magnetic CTA wrapper — the button drifts toward the cursor, then springs
 * back on leave. Pointer-only: disabled for reduced-motion and never bound on
 * touch devices (there is no hover state to magnetize).
 */
export function Magnetic({
  children,
  strength = 0.32,
  className = "",
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) * strength
        const y = (e.clientY - (r.top + r.height / 2)) * strength
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }}
      onPointerLeave={() => {
        if (!ref.current) return
        ref.current.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)"
        ref.current.style.transform = "translate3d(0,0,0)"
        window.setTimeout(() => {
          if (ref.current) ref.current.style.transition = ""
        }, 520)
      }}
    >
      {children}
    </motion.div>
  )
}

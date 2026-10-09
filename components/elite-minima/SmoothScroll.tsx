"use client"

import { useEffect } from "react"
import { useReducedMotion } from "framer-motion"
import Lenis from "lenis"

/**
 * Global Lenis smooth scroll.
 *
 * Renders nothing. Skipped entirely when the visitor prefers reduced motion —
 * hijacking scroll is exactly what that preference is asking us not to do.
 *
 * Anchor links are handled here too: Lenis owns the scroll position, so native
 * `scroll-behavior` and `scrollIntoView` would fight it.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.6 })

    let frame = 0
    const loop = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    // Route in-page anchors through Lenis so CTAs scroll smoothly.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute("href")
      if (!id || id === "#") return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      // Lenis computes its own landing position and ignores scroll-margin-top,
      // so read the target's own value back rather than hardcoding a second
      // offset that would silently drift from the CSS.
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop)
      lenis.scrollTo(target as HTMLElement, {
        offset: -(Number.isFinite(margin) ? margin : 96),
        duration: 1.1,
      })
      // preventDefault above cancels the whole default action, including the
      // hash update the browser would have made — so write it back by hand.
      // pushState (not replaceState) keeps Back working like a native anchor.
      if (window.location.hash !== id) window.history.pushState(null, "", id)
    }
    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  return null
}

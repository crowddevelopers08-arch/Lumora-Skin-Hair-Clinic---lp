"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Phone, Check, ArrowRight } from "lucide-react"
import TitleUnderline from "../TitleUnderline"
import { track } from "../track"
import { EASE } from "../tokens"
import { useHold } from "../rail"
import GeneralLeadForm from "./GeneralLeadForm"
import { GENERAL_PHONE_TEL, HERO_CONCERNS, HERO_IMAGES } from "./content"

const BRANCH = "Elite Minima Clinic — General"

/** Slide dwell time, ms. */
const SLIDE_MS = 3200

/** Horizontal travel that counts as a swipe rather than a tap, px. */
const SWIPE_PX = 40

export default function GeneralHero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--e-canvas)]">
      <div className="mx-auto grid w-full max-w-[1350px] gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10">
        <div className="min-w-0 self-center">
          <div className="rise d2">
            <h1 className="text-[clamp(1.7rem,1.1rem+2.1vw,2.6rem)] font-extrabold leading-[1.12] tracking-tight text-[var(--e-ink)]">
              Advanced Surgical Care for Piles, Circumcision &amp; Gynecomastia
            </h1>
            <TitleUnderline className="mt-3" maxWidth={520} />
            <p className="mt-3 max-w-[72ch] text-[clamp(0.86rem,0.8rem+0.24vw,1rem)] leading-relaxed text-[var(--e-muted)]">
              Get specialist evaluation and personalized treatment at Elite-Minima – The Surgical Speciality Clinic, with a focus on privacy,
              safety, clear communication, and supportive recovery.
            </p>
          </div>

          <div className="rise d4 mt-5">
            <HeroCarousel />
          </div>

          {HERO_CONCERNS.length > 0 && (
            <ul className="rise d5 mt-4 grid gap-2.5 sm:grid-cols-3">
              {HERO_CONCERNS.map((c) => (
                <li key={c.title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--e-green-soft)] text-[var(--e-green-deep)]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-bold text-[var(--e-ink)]">{c.title}</span>
                    <span className="mt-0.5 block text-[0.8rem] leading-snug text-[var(--e-muted)]">{c.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="rise d5 mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#book"
              onClick={() => track("book_click", { branch: BRANCH, section: "hero" })}
              className="btn btn-primary group/btn w-full sm:w-auto"
            >
              Book Your Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </a>
            <a
              href={`tel:${GENERAL_PHONE_TEL}`}
              onClick={() => track("call_click", { branch: BRANCH, section: "hero" })}
              className="btn btn-ghost w-full sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Call Our Team
            </a>
          </div>
        </div>

        <div id="book" className="lg:self-center">
          <GeneralLeadForm compact />
        </div>
      </div>
    </section>
  )
}

/** Frames rendered at once — the second is hidden below `sm`, see below. */
const PER_VIEW = 2

/**
 * Hero carousel — two pathway images at a time, one at a time on phones,
 * advancing on its own.
 *
 * A sliding window rather than a paged track: with three images and two slots,
 * paging would leave a half-empty second page, so instead each slot holds
 * `HERO_IMAGES[(i + slot) % count]` and the window steps one image per tick.
 * Every image therefore gets a turn in both positions.
 *
 * Narrow screens show only slot 0: two frames side by side at phone width are
 * too small to read, and stacking them would push the form and the CTAs far
 * below the fold. The second slot is dropped with CSS rather than by measuring
 * the viewport so the server and the first client render agree — it is lazy, so
 * while hidden it costs no download. The window still steps one image per tick,
 * which is exactly a plain one-up carousel when a single slot is visible.
 *
 * The slots cross-fade in place rather than translating — each frame is only a
 * few hundred px wide, and sliding at that size reads as a jitter. That leaves
 * nothing to drag, so a swipe is read off the touch events by hand: this is the
 * one carousel on the page that is not a real scroller, and on a phone a
 * picture that changes on its own is expected to answer a finger.
 *
 * Autoplay holds while a mouse is over it or focus is inside, and for a few
 * seconds after a touch. The hover hold is limited to actual mice — a touch
 * fires pointerenter too, and pairing it with a pointerleave that may never
 * arrive is how a carousel ends up stopped for the rest of the visit.
 *
 * Advancing is deliberately not gated on reduced motion — changing which image
 * is shown is a content change, and it is the cross-fade that counts as motion.
 * Under `reduced` the fade collapses to 0s and the swap is instant instead.
 */
function HeroCarousel() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [held, hold] = useHold(4000)
  const count = HERO_IMAGES.length
  const touch = useRef({ x: 0, y: 0 })

  const go = useCallback((next: number) => setI(((next % count) + count) % count), [count])

  useEffect(() => {
    if (paused || held || count <= PER_VIEW) return
    const t = window.setInterval(() => setI((v) => (v + 1) % count), SLIDE_MS)
    return () => window.clearInterval(t)
  }, [paused, held, count])

  /* Nothing is preventDefault-ed: the gesture is judged only once the finger is
     up, so a vertical drag scrolls the page exactly as it would anywhere else,
     and only a mostly-horizontal one is taken as a swipe. */
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    hold()
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    hold()
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return
    go(i + (dx < 0 ? 1 : -1))
  }

  return (
    <div
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Treatments at Elite-Minima"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: PER_VIEW }, (_, slot) => {
          const s = HERO_IMAGES[(i + slot) % count]
          return (
            <div
              key={slot}
              className={`relative h-[220px] overflow-hidden rounded-[20px] bg-[var(--e-line-soft)] shadow-[0_18px_50px_-32px_rgba(14,22,38,0.45)] sm:h-[235px] sm:rounded-[22px] lg:h-[258px] ${
                slot === 0 ? "" : "hidden sm:block"
              }`}
            >
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={s.src}
                  className="absolute inset-0"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                    priority={slot === 0}
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Dots are real buttons — the carousel has to be reachable without a
          pointer, and autoplay alone is not a control. They sit under the
          frames now: with two slots there is no single image to overlay, and
          the slides carry no caption that would need a scrim anyway. */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {HERO_IMAGES.map((s, d) => (
          <button
            key={s.src}
            type="button"
            onClick={() => {
              hold()
              go(d)
            }}
            aria-label={`Show ${s.caption}`}
            aria-current={d === i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              d === i ? "w-6 bg-[var(--e-green)]" : "w-1.5 bg-[var(--e-line)] hover:bg-[var(--e-muted)]"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { MessageSquareText, Stethoscope, ClipboardList, Sparkles, CalendarCheck, ArrowRight } from "lucide-react"
import Reveal from "../Reveal"
import TitleUnderline from "../TitleUnderline"
import { Magnetic } from "../motion"
import { track } from "../track"
import { C, EASE } from "../tokens"
import { JOURNEY } from "./content"

const BRANCH = "Elite Minima Clinic — General"

/* Icons live here rather than in content.ts so the copy file stays free of
   component imports and can be edited without touching React. */
const ICONS = [MessageSquareText, Stethoscope, ClipboardList, Sparkles, CalendarCheck]

/* The rail sits at x = 24px on mobile and dead-centre from lg up. Every piece
   pinned to it (track, fill, comet) uses these two classes so they can never
   drift apart. `left-[23px]` + `w-[2px]` puts the 2px stroke's centre on 24. */
const RAIL_X = "left-[23px] lg:left-[calc(50%-1px)]"

/* Same shadow geometry either side of the transition so framer interpolates
   it instead of snapping between mismatched shadow lists. With the border gone
   this is the only thing separating a lit card from an unlit one, so the "off"
   state keeps a faint contact shadow rather than going fully flat. */
const ELEV_ON = "0 1px 2px rgba(14,22,38,0.05), 0 24px 48px -28px rgba(14,22,38,0.3)"
const ELEV_OFF = "0 1px 2px rgba(14,22,38,0.03), 0 24px 48px -28px rgba(14,22,38,0.06)"

export default function GeneralJourney() {
  const reduced = useReducedMotion()
  const railRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLElement | null)[]>([])

  /* Vertical centre of each node, as a 0–1 fraction of the rail's height, so a
     node lights up at the exact moment the fill reaches it — no guessed
     thresholds, and it survives copy edits and reflow at any breakpoint. */
  const [marks, setMarks] = useState<number[]>([])
  const [railH, setRailH] = useState(0)
  const [reached, setReached] = useState(0)

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 72%", "end 62%"],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  const countReached = useCallback((v: number, ms: number[]) => {
    let n = 0
    for (const m of ms) if (v >= m - 0.005) n += 1
    return n
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const measure = () => {
      const r = rail.getBoundingClientRect()
      if (!r.height) return
      const next = nodeRefs.current.map((el) => {
        if (!el) return 1
        const n = el.getBoundingClientRect()
        return (n.top + n.height / 2 - r.top) / r.height
      })
      setRailH(r.height)
      setMarks(next)
      setReached(countReached(scrollYProgress.get(), next))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    return () => ro.disconnect()
  }, [countReached, scrollYProgress])

  useMotionValueEvent(progress, "change", (v) => {
    if (marks.length) setReached(countReached(v, marks))
  })

  const cometY = useTransform(progress, (v) => v * railH)
  const cometOpacity = useTransform(progress, [0, 0.03, 0.94, 1], [0, 1, 1, 0])

  return (
    <section id="journey" className="border-b border-[var(--e-line)] bg-[var(--e-canvas)] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="kicker justify-center">Your Treatment Journey</p>
          <h2 className="mt-4">From Consultation to Recovery — We Guide You Through Every Stage</h2>
          <TitleUnderline className="mx-auto mt-3" />
          <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            Whether you visit us for piles, circumcision, or gynecomastia, treatment begins with a proper clinical evaluation.
          </p>
        </Reveal>

        <div ref={railRef} className="relative mt-12 lg:mt-16">
          {/* unfilled track */}
          <div className={`pointer-events-none absolute inset-y-0 w-[2px] rounded-full bg-[var(--e-line)] ${RAIL_X}`} aria-hidden />

          {/* scroll-linked fill */}
          <motion.div
            className={`pointer-events-none absolute inset-y-0 w-[2px] origin-top rounded-full bg-gradient-to-b from-[var(--e-green)] to-[var(--e-green-deep)] ${RAIL_X}`}
            style={{ scaleY: reduced ? 1 : progress }}
            aria-hidden
          />

          {/* comet riding the head of the fill */}
          {!reduced && railH > 0 && (
            <motion.span
              className={`pointer-events-none absolute top-0 -ml-[5px] -mt-[5px] block h-[10px] w-[10px] rounded-full bg-[var(--e-green)] shadow-[0_0_0_5px_rgba(23,116,60,0.14),0_0_18px_rgba(23,116,60,0.55)] ${RAIL_X}`}
              style={{ y: cometY, opacity: cometOpacity }}
              aria-hidden
            />
          )}

          <ol className="relative space-y-9 lg:space-y-6">
            {JOURNEY.map((s, i) => {
              const Icon = ICONS[i] ?? Sparkles
              const active = reduced || i < reached
              const current = !reduced && i === reached - 1
              const left = i % 2 === 0 // desktop side for the card

              return (
                <li key={s.n} className="relative flex gap-5 lg:grid lg:grid-cols-[1fr_3rem_1fr] lg:items-center lg:gap-x-12">
                  {/* node */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[i] = el
                    }}
                    className="relative z-10 flex h-12 w-12 flex-none items-center justify-center lg:col-start-2 lg:row-start-1"
                  >
                    {current && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-[var(--e-green)]"
                        initial={{ opacity: 0.55, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.55 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        aria-hidden
                      />
                    )}
                    <motion.span
                      className="relative flex h-12 w-12 items-center justify-center rounded-full border text-[0.9rem] font-extrabold"
                      initial={false}
                      animate={
                        active
                          ? { backgroundColor: C.green, borderColor: C.green, color: "#ffffff", scale: 1 }
                          : { backgroundColor: "#ffffff", borderColor: C.line, color: C.greenDeep, scale: 0.86 }
                      }
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {s.n}
                    </motion.span>

                    {/* desktop stub linking node → card */}
                    <motion.span
                      className={`absolute top-1/2 hidden h-px w-12 bg-[var(--e-green)] lg:block ${
                        left ? "right-full origin-right" : "left-full origin-left"
                      }`}
                      initial={false}
                      animate={{ scaleX: active ? 1 : 0, opacity: active ? 0.55 : 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      aria-hidden
                    />
                  </div>

                  {/* card — borderless, so the lit/unlit state reads purely as
                      elevation and opacity rather than a colour-shifting edge */}
                  <motion.div
                    className={`rounded-[20px] bg-white p-5 sm:p-6 lg:row-start-1 ${
                      left ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"
                    }`}
                    initial={false}
                    animate={
                      active ? { opacity: 1, y: 0, boxShadow: ELEV_ON } : { opacity: 0.5, y: 12, boxShadow: ELEV_OFF }
                    }
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <div className={`flex items-center gap-2.5 ${left ? "lg:flex-row-reverse" : ""}`}>
                      <motion.span
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-full"
                        initial={false}
                        animate={{
                          backgroundColor: active ? C.greenSoft : "#EFF0F6",
                          color: active ? C.greenDeep : C.muted,
                        }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.span>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--e-muted)]">Step {s.n}</span>
                    </div>
                    <h3 className="mt-3 text-[1.02rem] leading-snug text-[var(--e-ink)]">{s.title}</h3>
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--e-muted)]">{s.desc}</p>
                  </motion.div>
                </li>
              )
            })}
          </ol>
        </div>

        <CtaPanel reduced={!!reduced} />
      </div>
    </section>
  )
}

/* ── Closing CTA ───────────────────────────────────────────────────────────
   Slow-drifting aurora behind the ink panel, plus the shared magnetic button. */
function CtaPanel({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="relative mt-12 flex flex-col items-center gap-4 overflow-hidden rounded-[24px] bg-[var(--e-ink)] px-6 py-10 text-center sm:px-10"
      initial={reduced ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {!reduced && (
        <>
          <motion.span
            className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[rgba(23,116,60,0.38)] blur-[70px]"
            animate={{ x: [0, 70, 0], y: [0, 34, 0], scale: [1, 1.16, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.span
            className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[rgba(81,62,152,0.3)] blur-[80px]"
            animate={{ x: [0, -60, 0], y: [0, -28, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-0 dot-tex opacity-[0.06]" aria-hidden />

      {/* Scrim over the aurora — the blobs drift, so text contrast has to be
          guaranteed at every frame, not just where they happen to sit. */}
      <div className="pointer-events-none absolute inset-0 bg-[rgba(14,22,38,0.45)]" aria-hidden />

      {/* Inline colour, not `text-white`: `.elite h3` in globals.css is a
          higher-specificity selector and would repaint this ink-on-ink. */}
      <h3 className="relative max-w-[36ch] text-[1.4rem] font-bold sm:text-[1.6rem]" style={{ color: "#ffffff" }}>
        Not Sure Which Treatment You Need?
      </h3>
      <p className="relative max-w-[56ch] text-[0.95rem] leading-relaxed text-white/85">
        You don&apos;t need to diagnose your condition yourself. Start with a specialist consultation and understand the appropriate next
        step.
      </p>
      <Magnetic className="relative mt-2">
        <a
          href="#book"
          onClick={() => track("book_click", { branch: BRANCH, section: "journey" })}
          className="btn group bg-white text-[var(--e-ink)] hover:bg-white/90"
        >
          Book a Private Consultation
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Magnetic>
    </motion.div>
  )
}

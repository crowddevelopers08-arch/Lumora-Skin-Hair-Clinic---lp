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
import { MessageSquareText, Stethoscope, ClipboardList, Sparkles, CalendarCheck } from "lucide-react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"
import { C, EASE } from "./tokens"

const STEPS = [
  {
    n: "01",
    icon: MessageSquareText,
    title: "Private Consultation",
    desc: "Discuss bleeding, pain, constipation, swelling or other symptoms with the doctor.",
  },
  {
    n: "02",
    icon: Stethoscope,
    title: "Clinical Assessment",
    desc: "The doctor evaluates the condition and determines the type and grade of piles.",
  },
  {
    n: "03",
    icon: ClipboardList,
    title: "Treatment Recommendation",
    desc: "Depending on the diagnosis, you may be advised conservative management, minimally invasive treatment, laser treatment or another appropriate procedure.",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Treatment & Recovery",
    desc: "Receive treatment with clear guidance regarding recovery, diet, medication, hygiene and bowel habits.",
  },
  {
    n: "05",
    icon: CalendarCheck,
    title: "Post Treatment Follow-Up Care",
    desc: "Post treatment follow-up helps monitor recovery and address factors that may contribute to recurrence.",
  },
]

/* The rail sits at x = 24px on mobile and dead-centre from lg up. Every piece
   pinned to it (track, fill, comet) uses these two classes so they can never
   drift apart. `left-[23px]` + `w-[2px]` puts the 2px stroke's centre on 24. */
const RAIL_X = "left-[23px] lg:left-[calc(50%-1px)]"

/* Same shadow geometry either side of the transition so framer interpolates
   it instead of snapping between mismatched shadow lists. */
const ELEV_ON = "0 1px 2px rgba(14,22,38,0.04), 0 24px 48px -28px rgba(14,22,38,0.26)"
const ELEV_OFF = "0 1px 2px rgba(14,22,38,0.00), 0 24px 48px -28px rgba(14,22,38,0.00)"

export default function TreatmentJourney() {
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
        <Reveal className="mx-auto max-w-[640px] text-center">
          <p className="kicker justify-center">The Process</p>
          <h2 className="mt-4">Your Piles Treatment Journey</h2>
          <TitleUnderline className="mx-auto mt-3" />
        </Reveal>

        <div ref={railRef} className="relative mt-12 lg:mt-16">
          {/* unfilled track */}
          <div
            className={`pointer-events-none absolute inset-y-0 w-[2px] rounded-full bg-[var(--e-line)] ${RAIL_X}`}
            aria-hidden
          />

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
            {STEPS.map((s, i) => {
              const active = reduced || i < reached
              const current = !reduced && i === reached - 1
              const left = i % 2 === 0 // desktop side for the card

              return (
                <li
                  key={s.n}
                  className="relative flex gap-5 lg:grid lg:grid-cols-[1fr_3rem_1fr] lg:items-center lg:gap-x-12"
                >
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

                  {/* card */}
                  <motion.div
                    className={`rounded-[20px] border bg-white p-5 sm:p-6 lg:row-start-1 ${
                      left ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"
                    }`}
                    initial={false}
                    animate={
                      active
                        ? {
                            opacity: 1,
                            y: 0,
                            borderColor: "#C8E4D3",
                            boxShadow: ELEV_ON,
                          }
                        : {
                            opacity: 0.5,
                            y: 12,
                            borderColor: C.line,
                            boxShadow: ELEV_OFF,
                          }
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
                        <s.icon className="h-4 w-4" />
                      </motion.span>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--e-muted)]">
                        Step {s.n}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[1.02rem] leading-snug text-[var(--e-ink)]">{s.title}</h3>
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--e-muted)]">{s.desc}</p>
                  </motion.div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

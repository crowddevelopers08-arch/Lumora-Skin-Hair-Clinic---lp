"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { Reveal } from "../motion"
import { JOURNEY } from "./content"

/**
 * The five stages, laid out along a horizontal rail.
 *
 * The general page runs its journey down a centred vertical spine; this one
 * runs across, as a row of cells divided by hairlines, with the rail above
 * them filling as the section is read. Below `lg` the row folds into a two-up
 * and then a single column, and the rail — which only describes a horizontal
 * sequence — is dropped rather than re-pointed.
 */
export default function GynJourney() {
  const reduced = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 82%", "end 55%"] })
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 })

  return (
    <section id="journey" className="relative overflow-hidden bg-[var(--g-base)]">
      <div
        aria-hidden
        className="g-grid-tex pointer-events-none absolute inset-0 opacity-40"
        style={{ maskImage: "radial-gradient(70% 60% at 50% 0%,#000,transparent)", WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%,#000,transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        <Reveal className="max-w-[62ch]">
          <p className="g-eyebrow">Your Treatment Journey</p>
          <h2 className="mt-5">From Consultation to Recovery — What to Expect</h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-[var(--g-dim)]">
            Every chest is different. Your treatment begins with understanding the cause and extent of the enlargement before recommending a
            surgical approach.
          </p>
        </Reveal>

        {/* The rail. Desktop only: it reads left → right, which is only true
            once the steps are actually in a row. */}
        <div className="relative mt-14 hidden h-px w-full bg-[var(--g-line)] lg:block" aria-hidden>
          <motion.span
            className="absolute inset-y-0 left-0 block w-full origin-left bg-[var(--g-accent)]"
            style={{ scaleX: reduced ? 1 : fill }}
          />
        </div>

        <div
          ref={gridRef}
          className="mt-0 grid gap-px border-t border-[var(--g-line)] bg-[var(--g-line)] sm:grid-cols-2 lg:grid-cols-5 lg:border-t-0"
        >
          {JOURNEY.map((s, i) => (
            <StepCell key={s.n} index={i} step={s} reduced={!!reduced} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCell({
  step,
  index,
  reduced,
}: {
  step: (typeof JOURNEY)[number]
  index: number
  reduced: boolean
}) {
  /* Five cells in a two-up leave half a row empty, and the container's hairline
     background would paint that gap as a grey slab. The last one takes the full
     row at `sm` instead; at `lg` there are five columns and nothing is short. */
  const lastOfOddRow = index === JOURNEY.length - 1 && JOURNEY.length % 2 === 1

  return (
    <motion.div
      className={`group relative flex flex-col bg-[var(--g-base)] p-6 transition-colors duration-300 hover:bg-[var(--g-surface)] sm:p-7 ${
        lastOfOddRow ? "sm:col-span-2 lg:col-span-1" : ""
      }`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* The node that meets the rail above. */}
      <span aria-hidden className="absolute -top-[3px] left-6 hidden h-1.5 w-1.5 bg-[var(--g-accent)] lg:block sm:left-7" />

      <p className="g-numeral text-[2.6rem] transition-colors duration-300 group-hover:[-webkit-text-stroke-color:var(--g-accent)]">{step.n}</p>

      {/* Heading only — the descriptions were dropped from the cells. `desc` is
          still on each JOURNEY entry, so putting them back is one line. */}
      <h3 className="mt-5 text-[var(--g-text)]">{step.title}</h3>
    </motion.div>
  )
}

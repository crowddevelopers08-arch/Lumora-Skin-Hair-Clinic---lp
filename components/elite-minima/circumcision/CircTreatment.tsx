"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "../motion"
import { track } from "../track"
import { CornerTicks, Eyebrow, SECTION_Y, SHELL, Tick } from "./ui"
import {
  CIRCUMCISION_BRANCH,
  JOURNEY,
  JOURNEY_LEAD,
  JOURNEY_TITLE,
  OPTIONS,
  OPTIONS_CTA,
  OPTIONS_TITLE,
} from "./content"

/**
 * Section 03 — treatment journey, then the two options.
 *
 * One section rather than two, per the deck: the stages and the techniques
 * answer the same question ("what will actually happen to me"), and splitting
 * them across two banded sections made the reader cross a boundary
 * mid-thought. They are two blocks on one ink ground, separated by a rule.
 *
 * The section carries a single id, `#treatment`, which is what the header nav
 * and the footer's "Services" link both point at.
 */
export default function CircTreatment() {
  return (
    <section id="treatment" className={`relative overflow-hidden bg-[var(--c-base)] ${SECTION_Y}`}>
      <div
        aria-hidden
        className="c-tex pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage: "radial-gradient(75% 55% at 50% 0%,#000,transparent)",
          WebkitMaskImage: "radial-gradient(75% 55% at 50% 0%,#000,transparent)",
        }}
      />
      <div className={`${SHELL} relative`}>
        <Journey />
        <Options />
      </div>
    </section>
  )
}

/**
 * The five stages, laid out along a horizontal rail.
 *
 * Borrowed from the gynecomastia journey and then given its descriptions back:
 * that page prints headings only, and this deck writes a sentence for each
 * stage that is the substance of the section. The rail above the row fills as
 * the block is read, and is dropped below lg where the row is no longer a row.
 */
function Journey() {
  const reduced = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 82%", "end 55%"] })
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 })

  return (
    <>
      <Reveal className="max-w-[62ch]">
        <Eyebrow n="02">Treatment Journey</Eyebrow>
        <h2 className="mt-5">{JOURNEY_TITLE}</h2>
        <p className="mt-5 text-[0.98rem] leading-relaxed text-[var(--c-dim)]">{JOURNEY_LEAD}</p>
      </Reveal>

      {/* The rail. Desktop only: it reads left → right, which is only true
          once the stages are actually in a row. */}
      <div className="relative mt-12 hidden h-px w-full bg-[var(--c-line)] lg:block" aria-hidden>
        <motion.span
          className="absolute inset-y-0 left-0 block w-full origin-left bg-[var(--c-violet)]"
          style={{ scaleX: reduced ? 1 : fill }}
        />
      </div>

      <div
        ref={gridRef}
        className="mt-10 grid gap-px border-t border-[var(--c-line)] bg-[var(--c-line)] sm:grid-cols-2 lg:mt-0 lg:grid-cols-5 lg:border-t-0"
      >
        {JOURNEY.map((s, i) => (
          <StepCell key={s.n} step={s} index={i} reduced={!!reduced} />
        ))}
      </div>
    </>
  )
}

function StepCell({ step, index, reduced }: { step: (typeof JOURNEY)[number]; index: number; reduced: boolean }) {
  /* Five cells in a two-up leave half a row empty, and the container's hairline
     background would paint that gap as a slab. The last one takes the full row
     at sm instead; at lg there are five columns and nothing is short. */
  const lastOfOddRow = index === JOURNEY.length - 1 && JOURNEY.length % 2 === 1

  return (
    <motion.div
      className={`group relative flex flex-col bg-[var(--c-base)] p-6 transition-colors duration-300 hover:bg-[var(--c-surface)] sm:p-7 ${
        lastOfOddRow ? "sm:col-span-2 lg:col-span-1" : ""
      }`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* The node that meets the rail above. */}
      <span aria-hidden className="absolute -top-[3px] left-6 hidden h-1.5 w-1.5 bg-[var(--c-violet)] sm:left-7 lg:block" />

      <p className="c-numeral text-[2.6rem] transition-colors duration-300 group-hover:[-webkit-text-stroke-color:var(--c-violet)]">
        {step.n}
      </p>
      <h3 className="mt-5 text-[var(--c-text)]">{step.title}</h3>
      <p className="mt-3 text-[0.85rem] leading-relaxed text-[var(--c-dim)]">{step.desc}</p>
    </motion.div>
  )
}

/**
 * Stapler and Laser, side by side.
 *
 * Two equal cards, not a tab strip or an accordion: with exactly two options,
 * hiding one behind a control is worse than showing both — the question here
 * is what the difference is, and a comparison has to be readable in one look.
 * (The gynecomastia page uses a list-and-panel because it has four.)
 *
 * The cards are flex columns whose tick lists carry the bottom margin, so the
 * two CTAs land on one line however unevenly the lists run.
 */
function Options() {
  return (
    <div className="mt-16 border-t border-[var(--c-line)] pt-14 sm:mt-20 sm:pt-16">
      <Reveal>
        <Eyebrow n="02">Options</Eyebrow>
        <h2 className="mt-5">{OPTIONS_TITLE}</h2>
      </Reveal>

      <Stagger gap={0.1} className="mt-10 grid gap-px bg-[var(--c-line)] lg:grid-cols-2">
        {OPTIONS.map((o, i) => (
          <StaggerItem key={o.id} className="h-full">
            <article className="flex h-full flex-col bg-[var(--c-base)]">
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--c-raised)]">
                <Image src={o.img} alt={o.alt} fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover object-center" />
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,50,0.05),rgba(28,24,50,0.55))]" />
                <span className="c-numeral c-numeral--on absolute bottom-4 left-5 text-[2.2rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CornerTicks />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="text-[1.15rem] text-[var(--c-text)] sm:text-[1.3rem]">{o.name}</h3>
                <p className="mt-4 max-w-[52ch] text-[0.92rem] leading-relaxed text-[var(--c-dim)]">{o.desc}</p>

                <ul className="mb-8 mt-6 grid gap-x-8 border-t border-[var(--c-line)] pt-2 sm:grid-cols-2">
                  {o.points.map((p) => (
                    <Tick key={p}>{p}</Tick>
                  ))}
                </ul>

                <a
                  href="#book"
                  onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "options", option: o.name })}
                  /* mt-auto, not a fixed top margin: the two tick lists run to
                     different heights, and without it the two buttons sit on
                     visibly different lines. */
                  className="c-btn c-btn-line group/btn mt-auto w-full self-start sm:w-auto"
                >
                  Ask about {o.name}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
                </a>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      {/* The deck's "Not Sure Which Treatment You Need?" block. A bone strip on
          the ink ground — the one light object in this section, which is what
          makes it read as the answer to the two cards above it. */}
      <Reveal className="mt-px flex flex-col gap-6 border-l-2 border-[var(--c-violet-deep)] bg-[var(--c-bone)] p-7 text-[var(--c-ink)] sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div className="min-w-0">
          <h3 className="text-[1.1rem]">{OPTIONS_CTA.title}</h3>
          <p className="mt-3 max-w-[62ch] text-[0.9rem] leading-relaxed text-[var(--c-ink-dim)]">{OPTIONS_CTA.body}</p>
        </div>
        <a
          href="#book"
          onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "options_cta" })}
          className="c-btn c-btn-ink group/btn w-full flex-none sm:w-auto"
        >
          {OPTIONS_CTA.button}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
        </a>
      </Reveal>
    </div>
  )
}

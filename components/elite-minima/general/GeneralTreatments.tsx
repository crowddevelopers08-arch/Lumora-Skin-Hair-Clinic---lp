"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Check, ChevronLeft, ChevronRight, Scissors, Zap, Waves, Sparkles, CircleDot, type LucideIcon } from "lucide-react"
import Reveal from "../Reveal"
import TitleUnderline from "../TitleUnderline"
import { EASE } from "../tokens"
import { track } from "../track"
import { stepOf, useHold, useUnder } from "../rail"
import { PATHWAYS, type Pathway, type PathwayOption } from "./content"

const BRANCH = "Elite Minima Clinic — General"

/* Options with no clinical image fall back to an icon in the same 160px frame,
   so the card geometry is identical across all three pathways. */
const OPTION_ICONS: Record<string, LucideIcon> = {
  "Stapler Circumcision": CircleDot,
  "Laser Circumcision": Zap,
  Liposuction: Waves,
  "Gland Excision": Scissors,
  "Advanced Chest Contouring": Sparkles,
}

const GRID: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const CARD: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
}

/** Dwell time on a pathway before the panel advances itself, ms. Long, because
    a panel is a heading, a lead, body copy and up to four cards to read. */
const ROTATE_MS = 8000

/**
 * The three treatment pathways, one panel at a time.
 *
 * A tabbed panel rather than three stacked blocks: a visitor arrives with one
 * concern, and stacking all three would make them scroll past two conditions
 * that do not apply to them to reach theirs. The cards inside are the piles
 * page's option cards — same spotlight, watermark and meter.
 */
export default function GeneralTreatments() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<Pathway["id"]>(PATHWAYS[0].id)
  const current = PATHWAYS.find((p) => p.id === active) ?? PATHWAYS[0]

  /* Auto-rotation, gated on the TABLIST being on screen rather than the
     section. The section is several viewports tall once the panel stacks on
     mobile, so no percentage-visible threshold against it is ever met; the
     tabs are a fixed ~60px, and "the tabs are visible" is anyway the moment
     rotating is useful. Same reason the hover-hold sits on the tabs alone —
     hung on the whole section it would latch on any cursor resting anywhere
     in view and never release. Focus anywhere in the section still holds, and
     a click locks rotation off for good: someone who picked their own pathway
     must never be pulled off it mid-sentence. */
  const tabsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(tabsRef)
  const [held, setHeld] = useState(false)
  const [locked, setLocked] = useState(false)
  /* Working the option cards holds the tabs too — see OptionsRail's onTake. A
     hold rather than the tabs' permanent lock: a swipe on the cards is not the
     deliberate "I want this pathway" that clicking a tab is. */
  const [railHeld, holdTabs] = useHold(7000)

  /* Deliberately not gated on `reduced`: advancing the panel is a change of
     content, not motion. The animation that carries it — the sliding pill, the
     panel entrance, the card stagger — is what honours reduced motion, and each
     of those already checks `reduced` on its own. */
  const rotating = inView && !held && !locked && !railHeld && PATHWAYS.length > 1

  useEffect(() => {
    if (!rotating) return
    const t = window.setInterval(() => {
      setActive((id) => PATHWAYS[(PATHWAYS.findIndex((p) => p.id === id) + 1) % PATHWAYS.length].id)
    }, ROTATE_MS)
    return () => window.clearInterval(t)
  }, [rotating])

  return (
    <section id="treatments" className="border-b border-[var(--e-line)] bg-white py-10 sm:py-12 lg:py-14">
      <div
        className="mx-auto w-full max-w-[1180px] px-5 sm:px-8"
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="kicker justify-center">Treatments</p>
          <h2 className="mt-4">Specialized Treatment for Your Concern</h2>
          <TitleUnderline className="mx-auto mt-3" />
          <p className="mt-2 text-[1.02rem] font-semibold text-[var(--e-green-deep)]">
            One Clinic. Three Specialized Treatment Pathways.
          </p>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            At Elite-Minima, treatment begins with understanding your symptoms, condition, medical history, and individual needs. Choose your
            concern to learn about the available treatment options.
          </p>
        </Reveal>

        {/* Tabs. Roving focus is left to the browser's default tab order — each
            tab is a plain button, so Tab reaches every pathway and Enter opens
            it, which keeps this readable without a keydown handler. */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Treatment pathways"
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          className="mx-auto mt-10 grid max-w-[720px] grid-cols-3 gap-1.5 rounded-[20px] border border-[var(--e-line)] bg-[var(--e-canvas)] p-2 sm:gap-2"
        >
          {PATHWAYS.map((p) => {
            const on = p.id === active
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={on}
                aria-controls={`panel-${p.id}`}
                onClick={() => {
                  setActive(p.id)
                  setLocked(true)
                  track("treatment_tab", { branch: BRANCH, treatment: p.tab })
                }}
                className={`relative min-h-11 rounded-[12px] px-1 py-2 text-[0.72rem] font-semibold leading-tight transition-colors duration-200 sm:rounded-[14px] sm:px-4 sm:py-2.5 sm:text-[0.9rem] ${
                  on ? "text-white" : "text-[var(--e-muted)] hover:text-[var(--e-ink)]"
                }`}
              >
                {/* the pill slides between tabs rather than cutting */}
                {on && (
                  <motion.span
                    layoutId="general-treatment-pill"
                    className="absolute inset-0 overflow-hidden rounded-[12px] bg-[var(--e-green)] sm:rounded-[14px]"
                    transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                    aria-hidden
                  >
                    {/* Fills over the dwell time, so the tab moving on its own
                        reads as deliberate rather than as a glitch. Keyed on
                        the pathway to restart each turn, and dropped entirely
                        under reduced motion — this one is pure animation. */}
                    {rotating && !reduced && (
                      <motion.span
                        key={active}
                        className="absolute inset-y-0 left-0 bg-white/25"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </motion.span>
                )}
                <span className="relative">{p.tab}</span>
              </button>
            )
          })}
        </div>

        {/* keyed on the pathway so switching tabs replays the entrance rather
            than cross-fading two sets of cards on top of each other */}
        <div
          key={current.id}
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12"
        >
          {/* Left rail — what the pathway is, who it is for, and the CTA. It
              sticks from lg up so that framing stays beside the options while
              they scroll; top-24 clears the sticky header (pt-4 + h-16).

              Below lg the rail is split in two and the options slot between the
              halves: on a phone the pathway copy, the concerns list and the CTA
              stacked together pushed the actual treatments most of a screen
              down, so the reader met the objection handling before the offer.
              `contents` drops the wrapper out of the mobile flex so the two
              halves can be ordered around the options; at lg it is a box again
              and the order classes stop applying. */}
          <div className="contents min-w-0 lg:sticky lg:top-24 lg:block lg:self-start">
            <motion.div
              className="order-1 min-w-0"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <h3 className="text-[clamp(1.2rem,1.05rem+0.65vw,1.6rem)] text-[var(--e-ink)]">{current.title}</h3>
              <p className="mt-3 text-[0.95rem] font-semibold leading-relaxed text-[var(--e-ink-soft)]">{current.lead}</p>
              {current.body.map((b) => (
                <p key={b} className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--e-muted)]">
                  {b}
                </p>
              ))}
            </motion.div>

            <motion.div
              className="order-3 min-w-0"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Single column here — the rail is ~340px, too narrow to split.
                  The top margin is lg-only; on mobile the flex gap spaces it. */}
              <div className="border-t border-[var(--e-line)] pt-6 lg:mt-7">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--e-purple-deep)]">Common concerns</p>
                <ul className="mt-4 grid gap-2.5">
                  {current.concerns.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-[var(--e-ink-soft)]">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--e-green-soft)] text-[var(--e-green-deep)]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#book"
                onClick={() => track("book_click", { branch: BRANCH, section: `treatments:${current.id}` })}
                className="btn btn-primary group/btn mt-7 w-full"
              >
                {current.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </a>
            </motion.div>
          </div>

          {/* Options hold at 2-up from sm rather than widening to 4, so the
              two-option pathways fill their row exactly as the four-option one
              does instead of trailing a half-empty grid. */}
          <div className="order-2 min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--e-green)]">{current.optionsLabel}</p>

            <OptionsRail options={current.options} onTake={holdTabs} />

            {current.note && (
              <p className="mt-6 rounded-[16px] bg-[var(--e-green-soft)] px-4 py-3.5 text-[0.88rem] leading-relaxed text-[var(--e-green-deep)]">
                {current.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Options rail ──────────────────────────────────────────────────────────
   A 2-up grid from sm. Below it, one full-width card at a time in a snapping
   scroller that advances itself — four stacked cards is a long scroll past
   options that may not apply, and a phone is too narrow to show two side by
   side and still read either. Remounted per pathway by the panel's key, so the
   rail always starts on the first option of whichever pathway is showing. */

/** Dwell on a card before the rail advances, ms. */
const CARD_MS = 2200

function OptionsRail({ options, onTake }: { options: PathwayOption[]; onTake: () => void }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  /* Tailwind's `sm` — where the classes below turn the rail back into a grid. */
  const phone = useUnder(640)
  const inView = useInView(ref, { amount: 0.4 })
  const [i, setI] = useState(0)
  /* Held while the reader is working the rail, and for a few seconds after —
     long enough to read the card they landed on, short enough that the rail is
     moving again by the time anyone wonders whether it still does. */
  const [taken, hold] = useHold(5000)

  /* Every interaction holds the pathway tabs for their own span too: a reader
     working the cards must not have the panel swapped out mid-sentence. */
  const take = useCallback(() => {
    hold()
    onTake()
  }, [hold, onTake])

  const goTo = useCallback(
    (n: number) => {
      const el = ref.current
      if (el) el.scrollTo({ left: n * stepOf(el), behavior: reduced ? "auto" : "smooth" })
    },
    [reduced],
  )

  /* Reads the live scroll position rather than trusting `i`: a tap landing
     mid-swipe or mid-autoplay would otherwise step from where the rail was,
     not from where it is, and jump the reader backwards. */
  const nudge = useCallback(
    (dir: 1 | -1) => {
      const el = ref.current
      if (!el) return
      take()
      const at = Math.round(el.scrollLeft / stepOf(el))
      goTo((at + dir + options.length) % options.length)
    },
    [goTo, take, options.length],
  )

  useEffect(() => {
    if (!phone || taken || !inView || options.length < 2) return
    const t = window.setInterval(() => {
      const el = ref.current
      if (!el) return
      const step = stepOf(el)
      el.scrollTo({
        left: ((Math.round(el.scrollLeft / step) + 1) % options.length) * step,
        behavior: reduced ? "auto" : "smooth",
      })
    }, CARD_MS)
    return () => window.clearInterval(t)
  }, [phone, taken, inView, options.length, reduced])

  return (
    <>
      {/* Bleeds into the shell's px-5 gutter so the card can run the full width
          of the phone with the gutter as its own inset. */}
      <motion.div
        ref={ref}
        className="swipe-row -mx-5 -mb-4 mt-4 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:mb-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0"
        variants={GRID}
        initial={reduced ? false : "hidden"}
        animate="show"
        onPointerDown={phone ? take : undefined}
        /* Lenis owns scrolling on this page; the touch-only opt-out keeps it
           from swallowing a horizontal drag that starts inside the rail, while
           leaving the wheel — which has no business here — smoothed as before. */
        data-lenis-prevent-touch
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / stepOf(e.currentTarget)))}
      >
        {options.map((o) => (
          <OptionCard key={o.name} option={o} />
        ))}
      </motion.div>

      {/* Phone only, and only worth drawing for more than one card. With a
          full-width card there is no next-card peek to say the row continues,
          so these carry the count and the position — and are the way through
          the rail for anyone not swiping. Arrows wrap rather than disable at
          the ends: the rail itself loops, and a dead button on first sight
          would read as the carousel being broken. */}
      {options.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
          <RailButton label="Previous option" onClick={() => nudge(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </RailButton>

          <div className="flex items-center gap-1.5">
            {options.map((o, d) => (
              <button
                key={o.name}
                type="button"
                onClick={() => {
                  take()
                  goTo(d)
                }}
                aria-label={`Show ${o.name}`}
                aria-current={d === i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  d === i ? "w-6 bg-[var(--e-green)]" : "w-1.5 bg-[var(--e-line)]"
                }`}
              />
            ))}
          </div>

          <RailButton label="Next option" onClick={() => nudge(1)}>
            <ChevronRight className="h-4 w-4" />
          </RailButton>
        </div>
      )}
    </>
  )
}

/** Round arrow control for the phone rail. 40px, so it clears the tap target. */
function RailButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[var(--e-line)] bg-white text-[var(--e-ink-soft)] transition-colors duration-200 active:bg-[var(--e-green-soft)] active:text-[var(--e-green-deep)]"
    >
      {children}
    </button>
  )
}

/* ── Option card ───────────────────────────────────────────────────────────
   Borderless, image on top, a coloured category label above the title. Depth
   comes from a soft shadow that deepens on hover rather than from a hairline
   box, so a grid of these reads as a set of photographs, not a set of frames. */
function OptionCard({ option }: { option: PathwayOption }) {
  const [hot, setHot] = useState(false)
  const Icon = OPTION_ICONS[option.name] ?? Sparkles

  return (
    <motion.article
      variants={CARD}
      className="group h-full shrink-0 basis-full snap-start overflow-hidden rounded-[20px] bg-white sm:basis-auto"
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      initial={false}
      animate={{ y: hot ? -4 : 0, boxShadow: hot ? ELEV_HOT : ELEV_REST }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* 16:10 header. object-cover means the varied source ratios (250² up to
          745×470) all crop to one band instead of setting their own heights. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--e-green-soft)]">
        {option.img ? (
          <motion.div className="absolute inset-0" initial={false} animate={{ scale: hot ? 1.05 : 1 }} transition={{ duration: 0.6, ease: EASE }}>
            <Image
              src={option.img}
              alt={option.alt ?? option.name}
              fill
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover object-center"
            />
          </motion.div>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[var(--e-green-deep)]">
            <Icon className="h-14 w-14" strokeWidth={1.3} />
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[var(--e-green)]">{option.category}</p>
        <h4 className="mt-1.5 text-[1.02rem] font-bold leading-snug text-[var(--e-ink)]">{option.name}</h4>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--e-muted)]">{option.desc}</p>
      </div>
    </motion.article>
  )
}

const ELEV_REST = "0 1px 2px rgba(14,22,38,0.04), 0 14px 30px -22px rgba(14,22,38,0.16)"
const ELEV_HOT = "0 2px 6px rgba(14,22,38,0.07), 0 28px 52px -26px rgba(14,22,38,0.3)"

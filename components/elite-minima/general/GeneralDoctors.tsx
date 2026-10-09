"use client"

import { useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { useInView, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Reveal from "../Reveal"
import TitleUnderline from "../TitleUnderline"
import { track } from "../track"
import { stepOf, useHold, useUnder } from "../rail"
import { ADDRESS_SHORT } from "../config"
import { SPECIALISTS, type Specialist } from "./content"

const BRANCH = "Elite Minima Clinic — General"

/** Dwell on a specialist before the track advances itself, ms. Longer than the
    treatment rail's: a card here is a portrait, a name, credentials, a bio, a
    row of expertise chips and a CTA. */
const SLIDE_MS = 3800

/* Every specialist now carries their own portrait in SPECIALISTS, so the
   per-name override map this used to need is gone. The initials plate below
   stays as the fallback for anyone added later without a photo. */
function initials(name: string) {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

export default function GeneralDoctors() {
  const scroller = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  /* Tailwind's `lg` — below it the row is a scroller, at it a 3-up grid. */
  const narrow = useUnder(1024)
  const inView = useInView(scroller, { amount: 0.35 })
  /* Held while the reader is working the track and for a few seconds after, as
     on the treatment rail — long enough to read the specialist they landed on,
     and self-releasing, so a finger brushing past on the way down the page
     cannot leave the track stopped for the rest of the visit. */
  const [taken, hold] = useHold(6000)

  /* Steps by one card, measured from the DOM (the gap is in the difference) so
     it works at either breakpoint below lg without knowing the widths, and
     reads the live scroll position so a press landing mid-swipe steps from
     where the track is rather than where it was. Wraps at both ends: the
     autoplay below loops, and an arrow that dead-ends would contradict it. */
  const go = useCallback(
    (dir: -1 | 1) => {
      const el = scroller.current
      if (!el) return
      const step = stepOf(el)
      const at = Math.round(el.scrollLeft / step)
      el.scrollTo({
        left: ((at + dir + SPECIALISTS.length) % SPECIALISTS.length) * step,
        behavior: reduced ? "auto" : "smooth",
      })
    },
    [reduced],
  )

  const nudge = (dir: -1 | 1) => {
    hold()
    go(dir)
  }

  /* Advances on its own while the track is on screen — three specialists side
     by side on desktop are all seen at once, and the scroller owes the reader
     the same. Not gated on reduced motion: moving to the next card is a change
     of content, and it is the smooth scroll that is the motion, which is what
     drops to an instant jump above. */
  useEffect(() => {
    if (!narrow || taken || !inView || SPECIALISTS.length < 2) return
    const t = window.setInterval(() => go(1), SLIDE_MS)
    return () => window.clearInterval(t)
  }, [narrow, taken, inView, go])

  return (
    <section id="doctors" className="border-b border-[var(--e-line)] bg-[var(--e-canvas)] py-10 sm:py-12 lg:py-14">
      {/* Wider than the 1180px the other sections use: three specialist cards
          in one row need the room, and the centered header inside caps itself
          at 760px so the extra width lands on the cards alone. */}
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="kicker justify-center">Meet Your Specialists</p>
          <h2 className="mt-4">Specialist-Led Surgical Care From Consultation to Recovery</h2>
          <TitleUnderline className="mx-auto mt-3" />
          <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            At Elite-Minima – The Surgical Speciality Clinic, treatment is based on clinical evaluation rather than a
            one-treatment-fits-all approach.
          </p>
          <p className="mt-2.5 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            Our specialists provide personalized evaluation and treatment planning across proctology, minimally invasive surgery,
            circumcision, gynecomastia, aesthetic surgical care, surgical oncology, and women&rsquo;s health.
          </p>
        </Reveal>

        {/* One row of three from lg. Below that the same row becomes a snap
            carousel — three cards this tall stacked would be most of a page,
            and a card at a third of a phone's width is unreadable. On a phone
            one card fills the width outright; the arrows below are then the
            thing that says the track continues, since there is no next-card
            peek left to do it. Native overflow scrolling, so touch drag works
            without a handler. */}
        <div
          ref={scroller}
          onPointerDown={hold}
          /* Lenis owns scrolling on this page; the touch-only opt-out keeps it
             from swallowing a horizontal drag that starts inside the track,
             while leaving the wheel smoothed as before. */
          data-lenis-prevent-touch
          /* pb-8: overflow-x also clips the y axis, so without it the card's
             drop shadow gets sheared off along the track's bottom edge.
             scroll-px matches the track's own padding, so every card snaps to
             the same gutter the first one starts at instead of landing flush
             against the screen edge. */
          className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-8 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {SPECIALISTS.map((s, i) => (
            <Reveal key={s.name} index={i} className="w-full flex-none snap-start sm:w-[58%] lg:w-auto">
              <DoctorCard s={s} />
            </Reveal>
          ))}
        </div>

        {/* Arrows only where the track actually scrolls. Hidden from assistive
            tech: the cards are reachable by Tab regardless, so these would be
            two controls that go nowhere new. */}
        <div className="mt-1 flex items-center justify-center gap-3 lg:hidden" aria-hidden>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => nudge(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--e-line)] bg-white text-[var(--e-ink-soft)] transition-colors duration-200 hover:text-[var(--e-green-deep)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => nudge(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--e-line)] bg-white text-[var(--e-ink-soft)] transition-colors duration-200 hover:text-[var(--e-green-deep)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.85rem] font-medium text-[var(--e-muted)]">
          <span>Personalized Care</span>
          <span className="text-[var(--e-green)]">•</span>
          <span>Advanced Treatment</span>
          <span className="text-[var(--e-green)]">•</span>
          <span>{ADDRESS_SHORT}</span>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * One specialist as a self-contained card: portrait, credentials, expertise,
 * CTA. Full height with the CTA pushed to the foot, so three cards with
 * different bio lengths still line their buttons up along one edge.
 */
function DoctorCard({ s }: { s: Specialist }) {
  const photo = s.photo

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_1px_2px_rgba(14,22,38,0.04),0_20px_45px_-30px_rgba(14,22,38,0.3)]">
      {/* 4:3 rather than square or the original 4:5 — the frame is the card's
          single biggest height contributor, and three of them share one row.
          object-top so the 2:3 source crops from the shirt, not the head. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--e-green-soft)]">
        {photo ? (
          <Image
            src={photo}
            alt={`${s.name}, ${s.title}`}
            fill
            sizes="(min-width: 1024px) 390px, (min-width: 640px) 58vw, 92vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[1.7rem] font-extrabold text-[var(--e-green-deep)]">
              {initials(s.name)}
            </span>
            <span className="px-6 text-center text-[0.85rem] font-semibold text-[var(--e-green-deep)]">{s.name}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.05rem] leading-snug text-[var(--e-ink)]">{s.name}</h3>
        <p className="mt-1 text-[0.85rem] font-semibold text-[var(--e-green-deep)]">{s.title}</p>
        {s.qualifications && <p className="mt-1.5 text-[0.76rem] leading-relaxed text-[var(--e-muted)]">{s.qualifications}</p>}
        {s.body && (
          <p className="mt-3 border-t border-[var(--e-line-soft)] pt-3 text-[0.85rem] leading-relaxed text-[var(--e-ink-soft)]">{s.body}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {s.expertise.map((e) => (
            <span
              key={e}
              className="inline-flex items-center rounded-full border border-[var(--e-line)] bg-[var(--e-canvas)] px-2.5 py-1 text-[0.72rem] font-medium text-[var(--e-ink-soft)]"
            >
              {e}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <a
            href="#book"
            onClick={() => track("book_click", { branch: BRANCH, section: `doctor:${s.name}` })}
            className="btn btn-primary group/btn w-full"
          >
            {s.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>
    </article>
  )
}

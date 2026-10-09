"use client"

import { ArrowRight, BadgeCheck, CalendarClock, HeartHandshake, Phone, ShieldCheck, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { track } from "../track"
import { SHELL_WIDE } from "./ui"
import CircForm from "./CircForm"
import { BOOKING, CIRCUMCISION_BRANCH, CIRC_PHONE_TEL, HERO, HERO_ASSURANCES } from "./content"

/**
 * Section 01 — the hook, and the form.
 *
 * A single contained panel rather than a full-bleed band: copy in the left
 * half — badge, headline with a coloured closing run, lead, a two-by-two grid
 * of assurances, then a solid CTA beside an outlined one — and the six booking
 * fields in the right half, which is where the content deck puts them.
 *
 * The form used to have a band of its own directly underneath,
 * back when the surgeon's portrait held this column. Both are gone: the deck's
 * arrangement is one screen that asks for the appointment, and a second band
 * repeating "Book Your Consultation" under a hero that already shows the
 * fields is a scroll spent on nothing. `#book` therefore lives on the form
 * column here, so every CTA on the page still lands on the fields.
 *
 * Two things deliberately do not copy the reference. Its panel has large
 * rounded corners; this page has no rounded corner anywhere, and one here
 * would read as a mistake rather than a flourish. And its palette is green on
 * gold — this keeps the page's plum ink and violet, so the hero belongs to the
 * five sections under it.
 *
 * Entrance is `.c-rise` / `.c-dN`: a CSS animation on load, not an in-view
 * observer. The hero is on screen already, and anything gated on a scroll band
 * can be jumped past without ever entering it.
 */

/* Icon per assurance, keyed by the string in content.ts. A map rather than an
   array paired by index — the labels are content and may be reordered, and a
   silent off-by-one would put the wrong glyph beside the wrong promise.
   Anything unmatched falls back to the check badge. */
const ASSURANCE_ICONS: Record<string, LucideIcon> = {
  "Private Consultation": ShieldCheck,
  "Day-Care Treatment": CalendarClock,
  "Stapler & Laser Options": Sparkles,
  "Personalized Aftercare": HeartHandshake,
}

export default function CircHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--c-hero)]">
      {/* Ground: diagonal hairlines on the hero band, faded out toward the
          bottom so the grain has stopped by the time the band ends and the
          edge into the section below is a clean colour change. */}
      <div
        aria-hidden
        className="c-tex pointer-events-none absolute inset-0 opacity-70"
        style={{
          maskImage: "linear-gradient(180deg,#000,transparent 90%)",
          WebkitMaskImage: "linear-gradient(180deg,#000,transparent 90%)",
        }}
      />
      {/* A single violet bloom behind the headline — the page's only glow. Much
          weaker than it was: at the strength it needed against near-black it
          is a lavender haze across the top of a white page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-[-14rem] h-[34rem] w-[34rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(81,62,152,0.18), transparent 68%)" }}
      />

      <div className={`${SHELL_WIDE} relative py-8 sm:py-12`}>
        {/* Two halves of one bordered panel. They stack on phones — copy, then
            fields — which is the order someone reads them in anyway: the
            headline says what the page is before it asks for a phone number.
            Grid items stretch by default, which is what lets the form column
            paint its own ground to the panel's full height rather than
            stopping under the last field. */}
        <div className="c-rise c-d1 grid overflow-hidden border border-[var(--c-bone-line)] bg-[var(--c-base)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* ── Copy ──────────────────────────────────────────────────────── */}
          <div className="min-w-0 px-7 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-14">
            <p className="inline-flex items-center gap-2.5 border border-[var(--c-line-strong)] px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--c-violet)]">
              <BadgeCheck className="h-3.5 w-3.5 flex-none" aria-hidden />
              {HERO.eyebrow}
            </p>

            <h1 className="mt-6 max-w-[15ch]">
              {HERO.headline} <span className="text-[var(--c-violet)]">{HERO.headlineAccent}</span>
            </h1>

            <p className="mt-5 max-w-[52ch] text-[0.98rem] leading-relaxed text-[var(--c-dim)] sm:text-[1.04rem]">
              {HERO.subtext}
            </p>

            {/* Two by two from sm, per the reference. Icon and label on one
                line each, so the four read as a set of promises rather than a
                list of features. */}
            <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {HERO_ASSURANCES.map((a) => {
                const Icon = ASSURANCE_ICONS[a] ?? BadgeCheck
                return (
                  <li key={a} className="flex items-center gap-3 text-[0.9rem] text-[var(--c-text)]">
                    <Icon className="h-[18px] w-[18px] flex-none text-[var(--c-violet)]" aria-hidden />
                    <span className="min-w-0">{a}</span>
                  </li>
                )
              })}
            </ul>

            {/* The primary CTA is a scroll on phones, where the form is below
                the fold of this panel, and a no-op nudge on desktop where it
                is already beside the button. Kept either way: the page's other
                six CTAs all point at `#book`, and the hero having none would
                be the odd one out. */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "hero" })}
                className="c-btn c-btn-solid group/btn w-full sm:w-auto"
              >
                {HERO.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
              </a>
              <a
                href={`tel:${CIRC_PHONE_TEL}`}
                onClick={() => track("call_click", { branch: CIRCUMCISION_BRANCH, section: "hero" })}
                className="c-btn c-btn-line w-full sm:w-auto"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {HERO.secondaryCta}
              </a>
            </div>
          </div>

          {/* ── Form ──────────────────────────────────────────────────────
              A step deeper than the copy half, and a hairline between them,
              so the fields read as a separate object inside the panel rather
              than as the tail of the paragraph above. The panel is white and
              sits on the tinted hero band, so the tint the panel gave up is
              what this column now carries. The border flips from top to left
              when the two go side by side. */}
          <div
            id="book"
            className="min-w-0 border-t border-[var(--c-line)] bg-[var(--c-surface)] px-7 py-7 sm:px-10 sm:py-8 lg:border-l lg:border-t-0 lg:px-10 lg:py-10"
          >
            <h2 className="text-[1.35rem] sm:text-[1.5rem]">{BOOKING.title}</h2>
            <p className="mt-2 max-w-[42ch] text-[0.9rem] leading-relaxed text-[var(--c-dim)]">{BOOKING.lead}</p>

            <div className="mt-5">
              <CircForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

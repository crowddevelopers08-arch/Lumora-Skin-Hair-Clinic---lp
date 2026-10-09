"use client"

import { ArrowRight } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { Eyebrow, MediaFrame, SECTION_Y, SHELL, Tick } from "./ui"
import { CIRCUMCISION_BRANCH, CLINIC, CLINIC_CTA, CLINIC_MEDIA } from "./content"

/**
 * Section 05 — the clinic. The page's second bone band.
 *
 * Copy left, a four-frame mosaic right: one tall frame beside three stacked,
 * per the deck's "Clinic Images / Reception / Consultation Room / Facility".
 * Below sm it becomes one wide frame over a row of three, which is the same
 * composition rotated rather than a second layout.
 *
 * All four frames carry real photographs: the theatre shot plus reception, the
 * consultation room and the treatment room, the last three served from
 * /public. An earlier build filled the empty ones from the piles page's image
 * set — a row of anorectal anatomical models, plainly wrong here — which is
 * why CLINIC_MEDIA carries a note against doing that again.
 */
export default function CircClinic() {
  return (
    <section id="clinic" className={`bg-[var(--c-bone)] text-[var(--c-ink)] ${SECTION_Y}`}>
      <div className={SHELL}>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal className="min-w-0">
            <Eyebrow n="04" tone="ink">
              The Clinic
            </Eyebrow>
            <h2 className="mt-5">{CLINIC.title}</h2>
            <p className="mt-5 max-w-[40ch] text-[1rem] font-bold leading-snug text-[var(--c-ink)]">{CLINIC.strapline}</p>
            {CLINIC.body.map((p) => (
              <p key={p} className="mt-4 max-w-[56ch] text-[0.95rem] leading-relaxed text-[var(--c-ink-dim)]">
                {p}
              </p>
            ))}

            <p className="mt-9 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[var(--c-ink)]">
              {CLINIC.expectTitle}
            </p>
            <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
              {CLINIC.expect.map((e) => (
                <Tick key={e} tone="ink">
                  {e}
                </Tick>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            {/* Three rows from sm, not two. The lead frame spans 2 columns, so
                a 3×2 grid leaves only two free cells for the remaining three
                and pushes the last into an implicit fourth row, below the fixed
                height where it is clipped to a sliver. 3 cols × 3 rows: the
                lead takes 2×3 and the other three stack down column three. */}
            <div className="grid h-[340px] grid-cols-3 grid-rows-2 gap-3 sm:h-[460px] sm:grid-rows-3 lg:h-[520px]">
              {CLINIC_MEDIA.map((m, i) => (
                <MediaFrame
                  key={m.label}
                  src={m.src}
                  alt={m.alt}
                  label={m.label}
                  tone="ink"
                  sizes="(min-width: 1024px) 26vw, (min-width: 640px) 30vw, 33vw"
                  className={i === 0 ? "col-span-3 row-span-1 sm:col-span-2 sm:row-span-3" : ""}
                />
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12 flex flex-col gap-6 border-t border-[var(--c-bone-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-[1.1rem]">{CLINIC_CTA.title}</h3>
            <p className="mt-3 max-w-[62ch] text-[0.9rem] leading-relaxed text-[var(--c-ink-dim)]">{CLINIC_CTA.body}</p>
          </div>
          <a
            href="#book"
            onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "clinic" })}
            className="c-btn c-btn-ink group/btn w-full flex-none sm:w-auto"
          >
            {CLINIC_CTA.button}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

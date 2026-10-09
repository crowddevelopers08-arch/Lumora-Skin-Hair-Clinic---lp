"use client"

import { ArrowRight } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "../motion"
import { track } from "../track"
import { cldTransform } from "../config"
import { CornerTicks, Eyebrow, MediaFrame, SECTION_Y, SHELL, Tick } from "./ui"
import { CIRCUMCISION_BRANCH, DOCTORS, DOCTOR_SECTION } from "./content"

/**
 * Section 03 — the surgeons.
 *
 * On `--c-surface` rather than the white ground: the section before and after
 * are both full-strength, and lifting this one a step is enough to separate
 * them without another tinted band so soon after the reviews.
 *
 * Two profiles, side by side from lg and stacked below it. It used to be one,
 * laid out asymmetrically — portrait in a narrow left column, credentials
 * spanning two rows beside it. That arrangement does not survive a second
 * surgeon: mirroring it puts two portraits in the middle of the row, and
 * repeating it stacks two tall asymmetric blocks that read as two sections.
 * A pair of equal cards says what the change actually is, which is that the
 * page now has two specialists rather than one with an appendix.
 *
 * The cards are white on the band's tint, the same relationship the hero panel
 * has with the hero band, so they read as objects on the section rather than
 * as regions of it.
 *
 * What stays shared below the pair is everything that was never about one
 * surgeon: the promises list and the booking CTA belong to the clinic, and
 * printing them twice would say the two run separate practices.
 *
 * Portraits are requested from Cloudinary at roughly twice their drawn size.
 * next/image runs `unoptimized` (see next.config.mjs), so the browser is handed
 * whatever URL it is given — the originals are tall studio frames, and dropping
 * one straight into a 400px column downscales it in a single step and comes out
 * soft.
 */
export default function CircDoctor() {
  return (
    <section id="doctor" className={`border-y border-[var(--c-line)] bg-[var(--c-surface)] ${SECTION_Y}`}>
      <div className={SHELL}>
        <Reveal className="min-w-0">
          <Eyebrow n="03">Your Specialists</Eyebrow>
          <h2 className="mt-5 max-w-[20ch]">{DOCTOR_SECTION.title}</h2>
          <p className="mt-5 max-w-[62ch] text-[0.95rem] leading-relaxed text-[var(--c-dim)]">{DOCTOR_SECTION.lead}</p>
        </Reveal>

        {/* items-stretch (the grid default) plus h-full on the article is what
            keeps the two cards level when one qualification string wraps to a
            different number of lines than the other — which they do, at every
            breakpoint between lg and xl. */}
        <Stagger gap={0.1} className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {DOCTORS.map((d) => (
            <StaggerItem key={d.name} className="h-full">
              <article className="flex h-full flex-col border border-[var(--c-line)] bg-[var(--c-base)]">
                <MediaFrame
                  /* c_limit, not c_fill,g_face: a face-gravity fill at 4:5
                     centres on the face and takes the crown off the top. This
                     only asks Cloudinary for a smaller file at the original
                     aspect and lets `object-top` below do the framing, which
                     keeps the head whole and crops the coat instead. */
                  src={cldTransform(d.photo, "c_limit,w_800,q_auto")}
                  alt={`${d.name} — ${d.speciality} at Elite-Minima`}
                  label="Doctor Photo"
                  focus="top"
                  sizes="(min-width: 1024px) 44vw, (min-width: 640px) 400px, 100vw"
                  /* -mx-px -mt-px: MediaFrame draws its own hairline, and the
                     card already has one. The negative margin lands the
                     frame's border on top of the card's rather than beside
                     it — two 1px lines of the same colour, flush, read as a
                     2px edge on three sides otherwise. Its bottom border is
                     left where it falls and serves as the divider under the
                     portrait, which is why the block below has none. */
                  className="-mx-px -mt-px aspect-[4/5] w-full"
                >
                  {/* Kept dark through the move to the white theme, because it
                      is on the photograph rather than on the page: the name
                      plate has to stay readable over whatever the bottom of
                      the portrait turns out to be, and only a scrim
                      guarantees that. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(28,24,50,0.86))]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[var(--c-violet-soft)]">
                      Your Specialist
                    </p>
                    <p className="c-display mt-2 text-[1.1rem] leading-none text-white">{d.name}</p>
                  </div>
                  <CornerTicks />
                </MediaFrame>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="c-display text-[1.35rem] leading-none text-[var(--c-violet)]">{d.name}</p>
                  <p className="mt-3 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--c-text)]">
                    {d.speciality}
                  </p>
                  {/* Plain text, not the page's tracked caps, and break-words:
                      the qualifications are one 90-character run of
                      comma-separated abbreviations, which in uppercase at
                      0.16em tracking wrapped to four lines and pushed the
                      column past its track at 360px. */}
                  <p className="mt-2.5 break-words text-[0.8rem] leading-relaxed text-[var(--c-dim)]">
                    {d.qualifications}
                  </p>

                  <p className="mt-6 text-[0.95rem] leading-relaxed text-[var(--c-dim)]">{d.body}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ── Shared below the pair ──────────────────────────────────────── */}
        <Reveal delay={0.1} className="mt-12 border-t border-[var(--c-line)] pt-9">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[var(--c-text)]">
            {DOCTOR_SECTION.pointsTitle}
          </p>
          <ul className="mt-4 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {DOCTOR_SECTION.points.map((p) => (
              <Tick key={p}>{p}</Tick>
            ))}
          </ul>

          <a
            href="#book"
            onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "doctor" })}
            className="c-btn c-btn-solid group/btn mt-9 w-full sm:w-auto"
          >
            {DOCTOR_SECTION.button}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

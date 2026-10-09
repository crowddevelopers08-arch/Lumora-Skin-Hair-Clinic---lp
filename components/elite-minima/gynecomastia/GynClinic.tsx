"use client"

import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "../motion"
import { track } from "../track"
import { ADDRESS_SHORT, IMAGES } from "../config"
import { CLINIC, GYN_BRANCH, SERVICE_AREAS } from "./content"

/**
 * The clinic: why here, and who it serves.
 *
 * The theatre photograph rather than a clinical illustration — this section's
 * job is reassurance, and a room with a team in it does that where a cutaway
 * of the chest wall would not.
 */
export default function GynClinic() {
  return (
    <section id="clinic" className="relative overflow-hidden border-t border-[var(--g-line)] bg-[var(--g-base)]">
      <div className="relative mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        {/* Same three-block grid as the hero: on phones the blocks follow each
            other, which drops the photograph between the body copy and the
            reasons list; from lg the copy halves go back into column one and
            the photograph spans both their rows. Row gaps are 0 and the
            spacing comes from the blocks' own margins, so the desktop column
            still reads as one continuous run of copy. */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16">
          {/* ── Copy, above the photograph on mobile ───────────────────── */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <Reveal>
              <p className="g-eyebrow">About Elite-Minima</p>
              <h2 className="mt-5 max-w-[16ch]">{CLINIC.title}</h2>
              <div className="mt-6 space-y-4">
                {CLINIC.body.map((p) => (
                  <p key={p} className="max-w-[60ch] text-[0.98rem] leading-relaxed text-[var(--g-dim)]">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── The theatre photograph ─────────────────────────────────── */}
          <Reveal delay={0.06} className="relative mt-10 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--g-line)] bg-[var(--g-raised)]">
              <Image
                src={IMAGES.surgicalTeam}
                alt="Surgical team operating in theatre at Elite-Minima – The Surgical Speciality Clinic"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(8,12,20,0.85))]" />
              <p className="absolute bottom-5 left-5 right-5 text-[0.78rem] uppercase tracking-[0.18em] text-white/85">
                Elite-Minima — The Surgical Speciality Clinic
              </p>
            </div>
          </Reveal>

          {/* ── Copy, below the photograph on mobile ───────────────────── */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <Reveal delay={0.08} className="mt-10">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-[var(--g-text)]">Why Elite-Minima?</p>
            </Reveal>

            {/* Hairline cells — a two-up grid held together by the gap-px rule
                rather than six bordered cards. */}
            <Stagger gap={0.05} className="mt-5 grid gap-px bg-[var(--g-line)] sm:grid-cols-2">
              {CLINIC.reasons.map((r, i) => (
                <StaggerItem key={r} className="bg-[var(--g-base)]">
                  <div className="flex h-full items-baseline gap-4 px-5 py-4 transition-colors duration-300 hover:bg-[var(--g-surface)]">
                    <span aria-hidden className="text-[0.68rem] font-bold tracking-[0.16em] text-[var(--g-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.9rem] leading-snug text-[var(--g-text)]">{r}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <a
                href="#book"
                onClick={() => track("book_click", { branch: GYN_BRANCH, section: "clinic" })}
                className="g-btn g-btn-solid group/btn mt-9 w-full sm:w-auto"
              >
                Book your consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>

        {/* ── Service areas ────────────────────────────────────────────── */}
        <Reveal delay={0.05} className="mt-10 border-t border-[var(--g-line)] pt-8 sm:mt-14 sm:pt-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
            <div className="max-w-[34ch]">
              <h3 className="text-[var(--g-text)]">Serving Patients Across Chennai</h3>
              <p className="mt-3 inline-flex items-center gap-2 text-[0.85rem] text-[var(--g-dim)]">
                <MapPin className="h-4 w-4 flex-none text-[var(--g-accent)]" aria-hidden />
                Conveniently located in {ADDRESS_SHORT}
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((a) => (
                <li
                  key={a}
                  className="border border-[var(--g-line-strong)] px-3.5 py-2 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--g-dim)] transition-colors duration-300 hover:border-[var(--g-accent)] hover:text-[var(--g-text)]"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

"use client"

import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { BRAND_FULL, MAP_DIRECTIONS_URL, MAP_QUERY } from "../config"
import { Eyebrow, SECTION_Y, SHELL } from "./ui"
import { CIRCUMCISION_BRANCH, CIRC_PHONES, VISIT } from "./content"

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`

/**
 * Section 06 — getting there.
 *
 * Address, timing and the number on the left; the map on the right, matched to
 * the column's height rather than given a fixed one, so the two sides end
 * level at every width instead of the map hanging below the text.
 *
 * The map is the only thing on the page that is not this palette — Google
 * renders it light. It sits inside the same hairline frame as every other
 * image so it reads as a plate on the ink rather than a hole in it.
 */
export default function CircLocation() {
  return (
    <section id="visit" className={`bg-[var(--c-base)] ${SECTION_Y}`}>
      <div className={SHELL}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="min-w-0">
            <Eyebrow n="05">Map &amp; Location</Eyebrow>
            <h2 className="mt-5">{VISIT.title}</h2>
            <p className="mt-5 max-w-[54ch] text-[0.95rem] leading-relaxed text-[var(--c-dim)]">{VISIT.lead}</p>

            <dl className="mt-9 border-t border-[var(--c-line)]">
              <Row icon={MapPin} label="Clinic">
                <span className="font-bold text-[var(--c-text)]">{VISIT.clinicName}</span>
                <br />
                {VISIT.address}
              </Row>

              <Row icon={Clock} label="Timing">
                {VISIT.timing}
                <br />
                {VISIT.timingNote}
              </Row>

              {/* Both lines, per the site convention in config.ts — the map
                  section lists how to reach the clinic rather than dialling. */}
              <Row icon={Phone} label="Call">
                <span className="flex flex-col gap-1.5">
                  {CIRC_PHONES.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      onClick={() => track("call_click", { branch: CIRCUMCISION_BRANCH, section: "visit" })}
                      className="c-display w-fit text-[1.2rem] leading-none text-[var(--c-text)] transition-colors hover:text-[var(--c-violet)]"
                    >
                      {p.display}
                    </a>
                  ))}
                </span>
              </Row>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("directions_click", { branch: CIRCUMCISION_BRANCH })}
                className="c-btn c-btn-line w-full sm:w-auto"
              >
                {VISIT.directions}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#book"
                onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "visit" })}
                className="c-btn c-btn-solid w-full sm:w-auto"
              >
                {VISIT.book}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <div className="h-[320px] overflow-hidden border border-[var(--c-line)] bg-[var(--c-raised)] sm:h-[430px] lg:h-full lg:min-h-[520px]">
              <iframe
                title={`Map showing ${BRAND_FULL} in Anna Nagar, Chennai`}
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Row({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 border-b border-[var(--c-line)] py-5">
      <dt className="flex w-[5.5rem] flex-none items-start gap-2.5 pt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--c-dim)]">
        <Icon className="h-3.5 w-3.5 flex-none text-[var(--c-violet)]" aria-hidden />
        {label}
      </dt>
      <dd className="min-w-0 text-[0.88rem] leading-relaxed text-[var(--c-dim)]">{children}</dd>
    </div>
  )
}

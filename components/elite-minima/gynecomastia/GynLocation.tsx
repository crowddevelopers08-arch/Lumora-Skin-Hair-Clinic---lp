"use client"

import { Clock, MapPin, Navigation, Phone } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { ADDRESS_FULL, ADDRESS_SHORT, MAP_DIRECTIONS_URL, MAP_QUERY, PHONES } from "../config"
import { GYN_BRANCH } from "./content"

/**
 * Visiting.
 *
 * Details on the left as a plain definition list, map on the right — where the
 * general page centres a heading over a full-bleed embed with three cells cut
 * into its foot. Here the address is the content and the map is the reference,
 * which is the way round someone planning a trip across Chennai reads it.
 */
export default function GynLocation() {
  return (
    <section id="visit" className="bg-[var(--g-bone)] text-[var(--g-ink)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        <Reveal className="max-w-[52ch]">
          <p className="g-eyebrow g-eyebrow--ink">Location</p>
          <h2 className="mt-5">Visit Elite-Minima, Anna Nagar</h2>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-[var(--g-ink-dim)]">
            Looking for gynecomastia treatment in Chennai? Visit Elite-Minima in {ADDRESS_SHORT} for a specialist consultation and
            personalized chest evaluation.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-px border border-[var(--g-bone-line)] bg-[var(--g-bone-line)] sm:mt-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {/* ── Details ──────────────────────────────────────────────── */}
          <div className="flex flex-col justify-between bg-[var(--g-bone)] p-7 sm:p-9">
            <dl className="space-y-7">
              <Row icon={MapPin} label="Address">
                <p className="max-w-[34ch] text-[0.92rem] leading-relaxed text-[var(--g-ink)]">{ADDRESS_FULL}</p>
              </Row>

              <Row icon={Phone} label="Call the clinic">
                {PHONES.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    onClick={() => track("call_click", { branch: GYN_BRANCH, section: "location" })}
                    className="g-display block text-[1.2rem] leading-tight text-[var(--g-ink)] transition-colors hover:text-[var(--g-accent-deep)]"
                  >
                    {p.display}
                  </a>
                ))}
              </Row>

              {/* No day-and-time table: the clinic's hours are not published
                  on the site any more. What a visitor needs from this row is
                  that they cannot simply walk in. */}
              <Row icon={Clock} label="Consultations">
                <p className="text-[0.9rem] leading-relaxed text-[var(--g-ink)]">By appointment</p>
              </Row>
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("directions_click", { branch: GYN_BRANCH, section: "location" })}
                className="g-btn g-btn-ink w-full sm:w-auto"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </a>
              <a
                href={`tel:${PHONES[0].tel}`}
                onClick={() => track("call_click", { branch: GYN_BRANCH, section: "location-cta" })}
                className="g-btn g-btn-ink-line w-full sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                Call clinic
              </a>
            </div>
          </div>

          {/* ── Map ──────────────────────────────────────────────────── */}
          <div className="relative bg-[var(--g-bone)]">
            <iframe
              title="Elite-Minima clinic location, Anna Nagar, Chennai"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
              className="block h-[340px] w-full sm:h-[440px] lg:h-full lg:min-h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Viewfinder ticks, top corners only — the foot of a Google embed
                belongs to its attribution and controls. */}
            {["left-4 top-4 border-l-2 border-t-2", "right-4 top-4 border-r-2 border-t-2"].map((c) => (
              <span key={c} className={`pointer-events-none absolute h-7 w-7 border-[var(--g-accent-deep)] ${c}`} aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-2.5 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[var(--g-ink-dim)]">
        <Icon className="h-3.5 w-3.5 text-[var(--g-accent-deep)]" aria-hidden />
        {label}
      </dt>
      <dd className="mt-3 space-y-1">{children}</dd>
    </div>
  )
}

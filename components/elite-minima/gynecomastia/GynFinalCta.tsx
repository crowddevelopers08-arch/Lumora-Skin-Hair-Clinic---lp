"use client"

import { ArrowRight, Phone } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { PHONES } from "../config"
import { GYN_BRANCH } from "./content"

/**
 * Closing call to action.
 *
 * A full-bleed accent band with near-black type — the one place on the page
 * where green is the ground rather than the mark. Both other pages close on a
 * dark ink panel with drifting aurora blobs inside a rounded card; this is the
 * inverse of that, and it is the last thing a reader sees, so it is the right
 * place to spend the contrast.
 */
export default function GynFinalCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--g-accent)] text-[#04140a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4,20,10,1) 1px, transparent 1px), linear-gradient(90deg, rgba(4,20,10,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(80% 80% at 50% 50%,#000,transparent)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 50%,#000,transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 lg:py-10">
        <Reveal className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2.5 text-[0.66rem] font-bold uppercase tracking-[0.28em] text-[#04140a]/70">
              <span aria-hidden className="h-px w-6 bg-[#04140a]/50" />
              Final Step
            </p>
            {/* Inline colour, not a utility: `.gyn h2` sets `color: inherit`,
                and the band's own text colour is what should win here. */}
            <h2 className="mt-5 max-w-[20ch]">Ready to Understand Your Gynecomastia Treatment Options?</h2>
            <p className="g-display mt-5 text-[1.15rem] tracking-[0.04em] text-[#04140a]/80">Start with a specialist evaluation.</p>
          </div>

          <div className="min-w-0">
            <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-[#04140a]/80">
              Meet Dr. Madan K at Elite-Minima to understand the cause of your chest enlargement, available treatment options, expected
              recovery, and the approach suitable for you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                onClick={() => track("book_click", { branch: GYN_BRANCH, section: "final-cta" })}
                className="g-btn g-btn-ink group/btn w-full sm:w-auto"
              >
                Book consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </a>
              <a
                href={`tel:${PHONES[0].tel}`}
                onClick={() => track("call_click", { branch: GYN_BRANCH, section: "final-cta" })}
                className="g-btn w-full border-[#04140a]/35 text-[#04140a] hover:border-[#04140a] hover:bg-[#04140a]/10 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                Call now
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

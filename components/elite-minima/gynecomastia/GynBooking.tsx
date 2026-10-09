"use client"

import { CalendarClock, Phone, ShieldCheck, UserRound } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { PHONES } from "../config"
import GynLeadForm from "./GynLeadForm"
import { GYN_BRANCH } from "./content"

const ASSURANCES = [
  { icon: UserRound, text: "Evaluated by Dr. Madan K" },
  { icon: CalendarClock, text: "Callbacks within clinic hours" },
  { icon: ShieldCheck, text: "Private consultation" },
] as const

/**
 * The booking band, sitting directly under the hero.
 *
 * A full-width strip split into a pitch and a set of underlined fields, rather
 * than the floating card the other two pages use. The heading column doubles as
 * the phone block, so someone who would rather call than type never has to
 * scroll for the number.
 */
export default function GynBooking() {
  return (
    <section id="book" className="relative border-y border-[var(--g-line)] bg-[var(--g-surface)]">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 px-5 py-10 sm:gap-10 sm:px-8 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-16">
        <Reveal>
          <p className="g-eyebrow">Book</p>
          <h2 className="mt-5 max-w-[14ch]">Start with a specialist evaluation</h2>
          <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-[var(--g-dim)]">
            Share your details and our team will call you back to confirm a consultation slot with Dr. Madan K.
          </p>

          <ul className="mt-8 space-y-3.5">
            {ASSURANCES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-[0.88rem] leading-snug text-[var(--g-text)]">
                <Icon className="mt-0.5 h-4 w-4 flex-none text-[var(--g-accent)]" aria-hidden />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-9 border-t border-[var(--g-line)] pt-6">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-[var(--g-dim)]">Or call the clinic</p>
            <div className="mt-3 flex flex-col gap-2">
              {PHONES.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  onClick={() => track("call_click", { branch: GYN_BRANCH, section: "booking" })}
                  className="g-display inline-flex w-fit items-center gap-3 text-[1.35rem] leading-none text-[var(--g-text)] transition-colors hover:text-[var(--g-accent)]"
                >
                  <Phone className="h-4 w-4 text-[var(--g-accent)]" aria-hidden />
                  {p.display}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 border border-[var(--g-line)] bg-[var(--g-base)] p-6 sm:p-8 lg:p-10">
          <GynLeadForm />
        </Reveal>
      </div>
    </section>
  )
}

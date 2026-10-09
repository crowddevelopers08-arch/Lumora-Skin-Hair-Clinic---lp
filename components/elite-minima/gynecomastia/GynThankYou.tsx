"use client"

import { useEffect } from "react"
import { ArrowLeft, CalendarCheck, Check, Phone, PhoneCall, Stethoscope } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { track } from "../track"
import { PHONES, WHATSAPP_URL } from "../config"
import { GYN_BRANCH } from "./content"

/** What actually happens next, so the wait after submitting is accounted for. */
const NEXT_STEPS = [
  { icon: PhoneCall, title: "We call you back", body: "Our coordinator rings the number you shared, inside your preferred call window." },
  { icon: CalendarCheck, title: "We confirm your slot", body: "You pick a consultation time that suits you, and we hold it." },
  { icon: Stethoscope, title: "You meet Dr. Madan K", body: "A private chest evaluation, then a treatment plan built around your case." },
] as const

/**
 * Confirmation panel for the gynecomastia form.
 *
 * Its own component rather than the shared ThankYouPanel: that one is written
 * in `.elite` — rounded card, pill buttons, green-on-white — and would land a
 * visitor from this page on paper they have not seen before, at the one moment
 * they most need to believe they are still in the right place.
 */
export default function GynThankYou() {
  useEffect(() => track("lead_thank_you", { branch: GYN_BRANCH }), [])

  return (
    <div className="w-full max-w-[860px]">
      <div className="border border-[var(--g-line)] bg-[var(--g-surface)] p-7 sm:p-10">
        <span className="inline-flex h-12 w-12 items-center justify-center border border-[var(--g-accent)] text-[var(--g-accent)]">
          <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
        </span>

        <p className="g-eyebrow mt-7">Request received</p>
        <h1 className="mt-5 text-[clamp(2rem,1.4rem+2.6vw,3.2rem)]">Thank You</h1>
        <p className="mt-5 max-w-[58ch] text-[0.98rem] leading-relaxed text-[var(--g-dim)]">
          Your consultation request is with our team. We&apos;ll call you shortly on the number you shared, during your preferred call time,
          to confirm your slot with Dr. Madan K.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {PHONES.map((p, i) => (
            <a
              key={p.tel}
              href={`tel:${p.tel}`}
              onClick={() => track("call_click", { branch: GYN_BRANCH, section: "thank-you" })}
              className={`g-btn w-full whitespace-nowrap sm:w-auto ${i === 0 ? "g-btn-solid" : "g-btn-line"}`}
            >
              <Phone className="h-4 w-4 flex-none" />
              Call {p.display}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { branch: GYN_BRANCH, section: "thank-you" })}
            className="g-btn g-btn-line w-full whitespace-nowrap sm:w-auto"
          >
            <FaWhatsapp className="h-4 w-4 flex-none" />
            Chat on WhatsApp
          </a>
        </div>

      </div>

      <ol className="mt-px grid gap-px bg-[var(--g-line)] sm:grid-cols-3">
        {NEXT_STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="bg-[var(--g-surface)] p-6">
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 flex-none text-[var(--g-accent)]" aria-hidden />
              <span className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[var(--g-dim)]">Step {i + 1}</span>
            </div>
            <p className="g-display mt-4 text-[1rem] leading-tight text-[var(--g-text)]">{title}</p>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-[var(--g-dim)]">{body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8">
        <a
          href="/gynecomastia"
          className="inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[var(--g-accent)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Elite-Minima
        </a>
      </p>
    </div>
  )
}

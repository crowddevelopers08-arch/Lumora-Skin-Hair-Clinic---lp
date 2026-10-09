"use client"

import { useEffect } from "react"
import { CheckCircle2, Phone, ArrowLeft, PhoneCall, CalendarCheck, Stethoscope } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { track } from "./track"
import { WHATSAPP_URL } from "./config"

/** What actually happens next, so the wait after submitting feels accounted for. */
const NEXT_STEPS = [
  { icon: PhoneCall, title: "We call you back", body: "Our care coordinator rings the number you shared, in your preferred call window." },
  { icon: CalendarCheck, title: "We confirm your slot", body: "You pick a consultation time that suits you, and we hold it for you." },
  { icon: Stethoscope, title: "You meet the specialist", body: "A private evaluation, then a treatment plan built around your case." },
] as const

interface ThankYouPanelProps {
  /** Numbers to offer back, in display order — the first is the primary CTA. */
  phones: readonly { display: string; tel: string }[]
  /** Where "back to home" goes, and what it is called. */
  homeHref: string
  homeLabel?: string
  /** Branch tag pushed to the dataLayer, so conversions are separable by page. */
  branch: string
}

/**
 * The confirmation itself — everything between a page's header and footer.
 *
 * Shared because there is one per landing page (/, /general) and they differ
 * only in which number leads, where "back" goes, and the branch they report.
 * The copy is deliberately not parameterised: what happens after a booking is
 * the same promise on every page, and two drifting versions of it would be a
 * worse outcome than one that reads slightly general.
 */
export default function ThankYouPanel({ phones, homeHref, homeLabel = "Back to home", branch }: ThankYouPanelProps) {
  /* Same dataLayer push as before, through the helper that owns the window
     typing — and, being neither lead_submit nor a click, still no Pixel event. */
  useEffect(() => track("lead_thank_you", { branch }), [branch])

  return (
    <div className="relative z-10 w-full max-w-[680px]">
      <div className="rounded-[28px] border border-[var(--e-line)] bg-white p-6 text-center shadow-[0_30px_60px_-30px_rgba(14,22,38,0.3)] sm:p-10 md:p-12">
        {/* the tick sits in a green ring with a purple halo — both brand inks */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--e-green-soft)] ring-8 ring-[var(--e-purple-soft)] sm:h-20 sm:w-20">
          <CheckCircle2 className="h-8 w-8 text-[var(--e-green-deep)] sm:h-10 sm:w-10" />
        </div>

        <p className="kicker justify-center">Request received</p>
        <h1 className="mt-3 text-[clamp(1.7rem,6vw,2.6rem)] leading-tight">Thank you!</h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-[var(--e-muted)] sm:text-[1.05rem]">
          Your consultation request is with our team. We&apos;ll call you shortly on the number you shared, during your preferred call time,
          to confirm your slot.
        </p>

        {/* A grid, not a flex row. Three buttons abreast could not hold two full
            phone numbers and "Chat on WhatsApp" inside a 680px card, so each
            label wrapped mid-number and the three ended up different widths.
            Two equal columns fit a number comfortably; WhatsApp takes the row
            under them, where it reads as the alternative it is. */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {phones.map((p, i) => (
            <a
              key={p.tel}
              href={`tel:${p.tel}`}
              onClick={() => track("call_click", { branch, section: "thank-you" })}
              className={`btn w-full whitespace-nowrap ${i === 0 ? "btn-primary" : "btn-ghost"}`}
            >
              <Phone className="h-4 w-4 flex-none" />
              Call {p.display}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-purple w-full whitespace-nowrap sm:col-span-2"
          >
            <FaWhatsapp className="h-4 w-4 flex-none" />
            Chat on WhatsApp
          </a>
        </div>

      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {NEXT_STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="card flex h-full flex-col p-5 text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--e-purple-soft)] text-[var(--e-purple-deep)]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--e-muted)]">Step {i + 1}</span>
            </div>
            <p className="mt-3 text-[0.95rem] font-semibold text-[var(--e-ink)]">{title}</p>
            <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--e-muted)]">{body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-center">
        <a href={homeHref} className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[var(--e-green-deep)] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          {homeLabel}
        </a>
      </p>
    </div>
  )
}

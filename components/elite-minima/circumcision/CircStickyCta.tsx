"use client"

import { CalendarDays, Phone } from "lucide-react"
import { track } from "../track"
import { CIRCUMCISION_BRANCH, CIRC_PHONE_TEL } from "./content"

/**
 * Phone-only bottom action bar.
 *
 * Below lg the booking form is a long way up the page from wherever the reader
 * currently is, so the two things this page wants — a call or a booking — are
 * pinned instead. The page reserves the height for it (see the wrapper's
 * bottom padding in CircPage), so it never covers the end of the footer.
 */
export default function CircStickyCta() {
  return (
    <div
      aria-label="Quick contact actions"
      className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-[0.85fr_1.15fr] gap-px border-t border-[var(--c-line-strong)] bg-[var(--c-line-strong)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${CIRC_PHONE_TEL}`}
        onClick={() => track("call_click", { branch: CIRCUMCISION_BRANCH, section: "sticky" })}
        className="c-btn c-btn-line min-h-[56px] border-0 bg-[var(--c-surface)] px-3"
      >
        <Phone className="h-4 w-4" aria-hidden />
        Call
      </a>
      <a
        href="#book"
        onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "sticky" })}
        className="c-btn c-btn-solid min-h-[56px] px-3"
      >
        <CalendarDays className="h-4 w-4" aria-hidden />
        Book Consultation
      </a>
    </div>
  )
}

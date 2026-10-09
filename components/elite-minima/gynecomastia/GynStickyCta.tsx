"use client"

import { CalendarCheck, Phone } from "lucide-react"
import { track } from "../track"
import { GYN_BRANCH, GYN_PHONE_TEL } from "./content"

/** Phone-only action bar. Two squared halves, edge to edge — the page's
    geometry rather than the other pages' pill pair inside a padded strip. */
export default function GynStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-2 gap-px border-t border-[var(--g-line-strong)] bg-[var(--g-line-strong)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${GYN_PHONE_TEL}`}
        onClick={() => track("call_click", { branch: GYN_BRANCH, section: "sticky" })}
        className="flex items-center justify-center gap-2.5 bg-[var(--g-base)] py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[var(--g-text)]"
      >
        <Phone className="h-4 w-4 text-[var(--g-accent)]" />
        Call now
      </a>
      <a
        href="#book"
        onClick={() => track("book_click", { branch: GYN_BRANCH, section: "sticky" })}
        className="flex items-center justify-center gap-2.5 bg-[var(--g-accent)] py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#04140a]"
      >
        <CalendarCheck className="h-4 w-4" />
        Book now
      </a>
    </div>
  )
}

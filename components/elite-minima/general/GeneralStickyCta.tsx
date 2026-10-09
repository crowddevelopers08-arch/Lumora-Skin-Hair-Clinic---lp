"use client"

import { track } from "../track"
import { GENERAL_PHONE_TEL } from "./content"

const BRANCH = "Elite Minima Clinic — General"

export default function GeneralStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-[var(--e-line)] bg-white/95 px-3.5 pt-2.5 backdrop-blur-[10px] lg:hidden"
      style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
    >
      <a
        href={`tel:${GENERAL_PHONE_TEL}`}
        onClick={() => track("call_click", { branch: BRANCH, section: "sticky" })}
        className="btn btn-ghost flex-1 px-3 py-3 text-[0.9rem]"
      >
        Call now
      </a>
      <a
        href="#book"
        onClick={() => track("book_click", { branch: BRANCH, section: "sticky" })}
        className="btn btn-primary flex-1 px-3 py-3 text-[0.9rem]"
      >
        Book now
      </a>
    </div>
  )
}

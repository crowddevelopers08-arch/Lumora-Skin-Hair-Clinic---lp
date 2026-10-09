"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, Phone, X } from "lucide-react"
import { track } from "../track"
import { BRAND_FULL, IMAGES } from "../config"
import { GYN_BRANCH, GYN_PHONE_DISPLAY, GYN_PHONE_TEL } from "./content"

const NAV = [
  { label: "Reviews", href: "#reviews", id: "reviews" },
  { label: "Journey", href: "#journey", id: "journey" },
  { label: "Treatment", href: "#treatment", id: "treatment" },
  { label: "Doctor", href: "#surgeon", id: "surgeon" },
  { label: "Clinic", href: "#clinic", id: "clinic" },
  { label: "Location", href: "#visit", id: "visit" },
]

/**
 * Full-bleed bar pinned to the top edge.
 *
 * Squared and edge-to-edge, where both other pages float a rounded pill inside
 * a gutter — the two systems are not meant to be mistaken for each other. The
 * active section is marked by a rule under the label rather than a sliding
 * pill, for the same reason.
 *
 * The logo is printed in dark ink for white paper, so on this ground it sits on
 * its own white plate rather than being knocked out.
 */
export default function GynHeader() {
  const [active, setActive] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the panel, and crossing into lg drops it — otherwise it can
  // be left open and invisible, trapping focus in a hidden panel.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    const mq = window.matchMedia("(min-width: 1024px)")
    const onWide = () => mq.matches && setMenuOpen(false)
    onWide()
    window.addEventListener("keydown", onKey)
    mq.addEventListener("change", onWide)
    return () => {
      window.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onWide)
    }
  }, [menuOpen])

  // Tracking exits as well as entries lets `active` fall back to "" up in the
  // hero, where no nav section crosses the band.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const inBand = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) inBand.add(e.target.id)
          else inBand.delete(e.target.id)
        })
        setActive(NAV.find((n) => inBand.has(n.id))?.id ?? "")
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--g-line)] bg-[rgba(8,12,20,0.92)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex flex-none items-center" aria-label={`${BRAND_FULL} — top of page`}>
          <span className="flex items-center bg-white px-3 py-2">
            <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} priority className="h-7 w-auto sm:h-8" />
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`relative py-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors duration-200 ${
                active === n.id ? "text-[var(--g-accent)]" : "text-[var(--g-dim)] hover:text-[var(--g-text)]"
              }`}
            >
              {n.label}
              <span
                aria-hidden
                className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[var(--g-accent)] transition-transform duration-300 ${
                  active === n.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-3">
          <a
            href={`tel:${GYN_PHONE_TEL}`}
            onClick={() => track("call_click", { branch: GYN_BRANCH, section: "header" })}
            className="hidden text-[0.8rem] font-bold tracking-[0.06em] text-[var(--g-text)] transition-colors hover:text-[var(--g-accent)] xl:inline-block"
          >
            {GYN_PHONE_DISPLAY}
          </a>

          <a
            href="#book"
            onClick={() => track("book_click", { branch: GYN_BRANCH, section: "header" })}
            className="g-btn g-btn-solid px-4 py-3 text-[0.68rem] sm:px-6 sm:py-3.5 sm:text-[0.72rem]"
          >
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book Consultation</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="gyn-mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--g-line-strong)] text-[var(--g-text)] transition-colors hover:border-[var(--g-accent)] hover:text-[var(--g-accent)] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Indexed list rather than a stack of pills — the same numeral motif the
          journey and the treatment list use, so the menu belongs to the page. */}
      <div id="gyn-mobile-nav" hidden={!menuOpen} className="border-t border-[var(--g-line)] bg-[var(--g-surface)] lg:hidden">
        <nav className="mx-auto w-full max-w-[1320px] px-5 py-2 sm:px-8">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-baseline gap-4 border-b border-[var(--g-line)] py-3.5 text-[0.95rem] font-semibold uppercase tracking-[0.1em] transition-colors last:border-b-0 ${
                active === n.id ? "text-[var(--g-accent)]" : "text-[var(--g-text)]"
              }`}
            >
              <span className="text-[0.68rem] font-bold tracking-[0.2em] text-[var(--g-dim)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {n.label}
            </a>
          ))}

          <a
            href={`tel:${GYN_PHONE_TEL}`}
            onClick={() => {
              track("call_click", { branch: GYN_BRANCH, section: "header-menu" })
              setMenuOpen(false)
            }}
            className="mt-1 flex items-center gap-3 py-4 text-[0.95rem] font-bold tracking-[0.06em] text-[var(--g-text)]"
          >
            <Phone className="h-4 w-4 text-[var(--g-accent)]" />
            {GYN_PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  )
}

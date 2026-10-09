"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, Phone, X } from "lucide-react"
import { track } from "../track"
import { BRAND_FULL, IMAGES } from "../config"
import { SHELL } from "./ui"
import { CIRCUMCISION_BRANCH, CIRC_PHONE_DISPLAY, CIRC_PHONE_TEL, NAV } from "./content"

/**
 * Sticky page header.
 *
 * A flat hairline bar on the dark ground — no floating pill, no radius, in
 * keeping with a page that has no rounded corner anywhere. Below lg the links
 * collapse into a panel under the bar; the book CTA never collapses, because
 * it is the page's job and burying it behind a hamburger on the screen size
 * most of the traffic arrives on would be the wrong trade.
 *
 * The lockup is printed for white, so on this ground it sits on its own paper
 * chip rather than being knocked out.
 */
export default function CircHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Escape closes the panel, and crossing into lg drops it — otherwise it can
  // be left open and invisible, trapping focus in a hidden element.
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
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-[var(--c-line)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[12px]"
          : "border-transparent bg-[rgba(255,255,255,0.72)] backdrop-blur-[6px]"
      }`}
    >
      <div className={`${SHELL} flex h-16 items-center gap-4 sm:h-[70px] sm:gap-7`}>
        <a href="#top" className="flex flex-none items-center py-1.5" aria-label={`${BRAND_FULL} — top of page`}>
          <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} priority className="h-6 w-auto sm:h-7" />
        </a>

        <nav aria-label="Page sections" className="hidden min-w-0 flex-1 items-center justify-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              aria-current={active === n.id ? "true" : undefined}
              className={`border-b-2 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-colors duration-200 ${
                active === n.id
                  ? "border-[var(--c-violet)] text-[var(--c-violet)]"
                  : "border-transparent text-[var(--c-dim)] hover:text-[var(--c-text)]"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-2.5 lg:ml-0">
          <a
            href={`tel:${CIRC_PHONE_TEL}`}
            onClick={() => track("call_click", { branch: CIRCUMCISION_BRANCH, section: "header" })}
            className="hidden text-[0.82rem] font-bold text-[var(--c-text)] transition-colors hover:text-[var(--c-violet)] xl:inline-block"
          >
            {CIRC_PHONE_DISPLAY}
          </a>

          <a
            href="#book"
            onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "header" })}
            className="c-btn c-btn-solid min-h-[38px] px-3.5 text-[0.64rem] tracking-[0.12em] sm:min-h-[42px] sm:px-5 sm:text-[0.7rem]"
          >
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book Consultation</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="circ-mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--c-line-strong)] text-[var(--c-text)] transition-colors hover:border-[var(--c-violet)] hover:text-[var(--c-violet)] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div id="circ-mobile-nav" hidden={!menuOpen} className="border-t border-[var(--c-line)] bg-[var(--c-surface)] lg:hidden">
        <nav aria-label="Page sections" className={`${SHELL} flex flex-col py-2`}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              aria-current={active === n.id ? "true" : undefined}
              className={`border-b border-[var(--c-line)] py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.2em] last:border-b-0 ${
                active === n.id ? "text-[var(--c-violet)]" : "text-[var(--c-text)]"
              }`}
            >
              {n.label}
            </a>
          ))}
          <a
            href={`tel:${CIRC_PHONE_TEL}`}
            onClick={() => {
              track("call_click", { branch: CIRCUMCISION_BRANCH, section: "menu" })
              setMenuOpen(false)
            }}
            className="mt-2 flex items-center gap-3 border-t border-[var(--c-line)] pt-4 text-[0.95rem] font-bold text-[var(--c-text)]"
          >
            <Phone className="h-4 w-4 text-[var(--c-green)]" aria-hidden />
            {CIRC_PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  )
}

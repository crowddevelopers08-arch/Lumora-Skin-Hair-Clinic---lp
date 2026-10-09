"use client"

import Image from "next/image"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import { track } from "../track"
import { BRAND_FULL, EMAIL, IMAGES } from "../config"
import { SHELL } from "./ui"
import { CIRCUMCISION_BRANCH, CIRC_PHONES, FOOTER, FOOTER_LINKS } from "./content"

/**
 * Section 07 — the footer, and the page's last CTA.
 *
 * The deck's own contents: brand line, blurb, three contact details, the menu,
 * one button, the copyright. No columns invented around them.
 *
 * On `--c-deep` — the deepest tint on the page, so the footer still closes it
 * rather than continuing it. It was a near-black slab before the white theme;
 * `--c-deep` exists so it can be the closing band without being that.
 */
export default function CircFooter() {
  return (
    <footer className="border-t border-[var(--c-line)] bg-[var(--c-deep)] text-[var(--c-dim)]">
      <div className={`${SHELL} grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:py-14`}>
        <div className="min-w-0 max-w-[44ch]">
          {/* The mark is printed for white, so on this ground it sits on its
              own paper chip rather than being knocked out. */}
          <span className="inline-flex bg-white px-3 py-2">
            <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} className="h-7 w-auto sm:h-8" />
          </span>
          <p className="c-display mt-6 text-[1rem] leading-snug text-[var(--c-text)]">{FOOTER.brand}</p>
          <p className="mt-3 text-[0.9rem] leading-relaxed">{FOOTER.blurb}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--c-text)]">Contact</p>
          <ul className="mt-5 space-y-4 text-[0.9rem]">
            {/* Both lines, per the site convention in config.ts — a footer
                lists the clinic's numbers rather than dialling one. */}
            <li className="flex items-start gap-3">
              <Phone className="mt-1 h-3.5 w-3.5 flex-none text-[var(--c-violet)]" aria-hidden />
              <span>
                Call:{" "}
                {CIRC_PHONES.map((p, i) => (
                  <span key={p.tel}>
                    {/* --c-dim, not --c-line-strong: a hairline colour is for
                        rules, and at this size on the footer ink it left the
                        two numbers looking like one run with a gap in it. */}
                    {i > 0 && <span className="text-[var(--c-dim)]"> · </span>}
                    <a
                      href={`tel:${p.tel}`}
                      onClick={() => track("call_click", { branch: CIRCUMCISION_BRANCH, section: "footer" })}
                      className="whitespace-nowrap font-bold text-[var(--c-text)] transition-colors hover:text-[var(--c-violet)]"
                    >
                      {p.display}
                    </a>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-1 h-3.5 w-3.5 flex-none text-[var(--c-violet)]" aria-hidden />
              <span>
                Email:{" "}
                <a href={`mailto:${EMAIL}`} className="break-all transition-colors hover:text-[var(--c-text)]">
                  {EMAIL}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-3.5 w-3.5 flex-none text-[var(--c-violet)]" aria-hidden />
              <span>{FOOTER.location}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* The menu and the closing button share a rule, so the deck's
          pipe-separated list and its CTA read as one band, not two stray rows. */}
      <div className="border-t border-[var(--c-line)]">
        <div className={`${SHELL} flex flex-col gap-6 py-7 lg:flex-row lg:items-center lg:justify-between`}>
          <nav aria-label="Site" className="flex flex-wrap items-center text-[0.7rem] font-bold uppercase tracking-[0.18em]">
            {FOOTER_LINKS.map((l, i) => (
              <span key={l.label} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden className="px-3 text-[var(--c-line-strong)]">
                    |
                  </span>
                )}
                <a href={l.href} className="py-1 transition-colors hover:text-[var(--c-violet)]">
                  {l.label}
                </a>
              </span>
            ))}
          </nav>

          <a
            href="#book"
            onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "footer" })}
            className="c-btn c-btn-solid group/btn w-full flex-none lg:w-auto"
          >
            {FOOTER.button}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
          </a>
        </div>
      </div>

      <div className="border-t border-[var(--c-line)]">
        <div className={`${SHELL} py-5 text-center text-[0.72rem] tracking-[0.06em]`}>
          © {new Date().getFullYear()} Elite-Minima. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

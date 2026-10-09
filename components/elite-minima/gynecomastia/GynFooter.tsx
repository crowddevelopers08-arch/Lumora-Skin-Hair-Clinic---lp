"use client"

import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { track } from "../track"
import {
  ADDRESS_FULL,
  ADDRESS_SHORT,
  BRAND,
  BRAND_FULL,
  EMAIL,
  FACEBOOK_URL,
  IMAGES,
  INSTAGRAM_URL,
  PHONES,
  WHATSAPP_URL,
} from "../config"
import { FOOTER_LINKS, FOOTER_SERVICES, GYN_BRANCH } from "./content"

const SOCIALS = [
  { Icon: FaInstagram, href: INSTAGRAM_URL, label: "Instagram" },
  { Icon: FaFacebookF, href: FACEBOOK_URL, label: "Facebook" },
  { Icon: FaWhatsapp, href: WHATSAPP_URL, label: "WhatsApp" },
]

export default function GynFooter() {
  return (
    <footer className="border-t border-[var(--g-line)] bg-[#05080e] text-[var(--g-dim)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        {/* Service line — the four things this page is about, set as a rule
            across the top of the footer rather than buried in a column. */}
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--g-line)] py-6">
          {FOOTER_SERVICES.map((s, i) => (
            <li key={s} className="inline-flex items-center gap-6 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--g-text)]">
              {i > 0 && <span aria-hidden className="text-[var(--g-accent)]">·</span>}
              {s}
            </li>
          ))}
        </ul>

        <div className="grid gap-8 py-9 sm:gap-10 sm:py-12 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:gap-16">
          <div className="max-w-[38ch]">
            {/* Printed for white paper — on this ground it keeps its own plate
                rather than being knocked out. */}
            <span className="inline-flex bg-white px-4 py-3">
              <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} className="h-9 w-auto sm:h-10" />
            </span>
            <p className="g-display mt-5 text-[1rem] tracking-[0.06em] text-[var(--g-text)]">Aesthetic, Plastic &amp; Reconstructive Care</p>
            <p className="mt-2 text-[0.9rem]">{ADDRESS_SHORT}</p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center border border-[var(--g-line-strong)] text-[var(--g-dim)] transition-colors hover:border-[var(--g-accent)] hover:bg-[var(--g-accent)] hover:text-[#04140a]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[0.68rem] tracking-[0.24em] text-[var(--g-accent)]">Quick Links</h4>
            <ul className="mt-5 space-y-2.5 text-[0.9rem]">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-[var(--g-text)]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[0.68rem] tracking-[0.24em] text-[var(--g-accent)]">Reach Us</h4>
            <ul className="mt-5 space-y-4 text-[0.9rem]">
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 flex-none text-[var(--g-accent)]" aria-hidden />
                <span className="flex flex-col gap-1">
                  {PHONES.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      onClick={() => track("call_click", { branch: GYN_BRANCH, section: "footer" })}
                      className="font-semibold text-[var(--g-text)] transition-colors hover:text-[var(--g-accent)]"
                    >
                      {p.display}
                    </a>
                  ))}
                </span>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-start gap-3 transition-colors hover:text-[var(--g-text)]">
                  <Mail className="mt-1 h-4 w-4 flex-none text-[var(--g-accent)]" aria-hidden />
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 flex-none text-[var(--g-accent)]" aria-hidden />
                <span className="leading-relaxed">{ADDRESS_FULL}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--g-line)] py-5 sm:py-7">
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[0.76rem]">
            {/* Literal, as on the other two footers: a client-rendered year can
                disagree with the server's across a timezone boundary and trip
                hydration on New Year's Eve for the sake of nothing. */}
            <span>© 2026 {BRAND}. All rights reserved.</span>
            <a href="/privacy-policy" className="font-semibold text-[var(--g-text)] transition-colors hover:text-[var(--g-accent)]">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Image from "next/image"
import { LuPhone, LuMail, LuMapPin } from "react-icons/lu"
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { track } from "./track"
import {
  BRAND,
  BRAND_FULL,
  ADDRESS_FULL,
  EMAIL,
  FACEBOOK_URL,
  IMAGES,
  INSTAGRAM_URL,
  PHONES,
  WHATSAPP_URL,
} from "./config"

const EXPLORE = [
  { label: "Reviews", href: "#reviews" },
  { label: "Journey", href: "#journey" },
  { label: "Treatments", href: "#treatments" },
  { label: "Specialist", href: "#doctor" },
  { label: "Clinic", href: "#clinic" },
  { label: "FAQ", href: "#faq" },
]

const TREATMENTS = ["Laser Piles Treatment", "Minimally Invasive Piles Treatment", "Non-Surgical Piles Treatment", "Advanced Piles Surgery", "Fissure & Fistula Treatment"]

const SOCIALS = [
  { Icon: FaInstagram, href: INSTAGRAM_URL, label: "Instagram" },
  { Icon: FaFacebookF, href: FACEBOOK_URL, label: "Facebook" },
  { Icon: FaWhatsapp, href: WHATSAPP_URL, label: "WhatsApp" },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--e-ink)] text-white/70">
      <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="max-w-[34ch]">
          {/* The mark is printed for white; on the dark footer it sits on its own
              paper chip rather than being knocked out. */}
          <span className="inline-flex rounded-2xl bg-white px-4 py-3">
            <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} className="h-9 w-auto sm:h-10" />
          </span>
          <p className="mt-4 text-[0.92rem] leading-relaxed text-white/60">
            {BRAND_FULL} — specialized, personalized evaluation and advanced treatment for piles, fissures, fistulas and other proctology
            conditions.
          </p>
          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-[var(--e-green)] hover:bg-[var(--e-green)] hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--e-purple-light)]">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-[0.9rem]">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--e-purple-light)]">Treatments</h4>
          <ul className="mt-4 space-y-2.5 text-[0.9rem]">
            {TREATMENTS.map((t) => (
              <li key={t}>
                <a href="#treatments" className="transition-colors hover:text-white">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--e-purple-light)]">Contact</h4>
          <ul className="mt-4 space-y-3.5 text-[0.9rem]">
            {/* Both clinic lines, one per row, each with its own chip so
                neither reads as a stray continuation of the other. */}
            {PHONES.map((p) => (
              <li key={p.tel}>
                <a
                  href={`tel:${p.tel}`}
                  onClick={() => track("call_click", { branch: "Elite Minima Clinic" })}
                  className="flex items-center gap-3 font-semibold text-white transition-colors hover:text-[var(--e-purple-light)]"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 text-[var(--e-purple-light)]">
                    <LuPhone className="h-4 w-4" />
                  </span>
                  {p.display}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-white/70 transition-colors hover:text-[var(--e-purple-light)]"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 text-[var(--e-purple-light)]">
                  <LuMail className="h-4 w-4" />
                </span>
                {EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/60">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 text-[var(--e-purple-light)]">
                <LuMapPin className="h-4 w-4" />
              </span>
              {ADDRESS_FULL}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-5 text-[0.78rem] text-white/50 sm:px-8">
          <span>© 2026 {BRAND}. All rights reserved.</span>
          <a href="/privacy-policy" className="font-semibold text-white/80 transition-colors hover:text-white">
            Privacy policy
          </a>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Image from "next/image"
import { LuPhone, LuMail, LuMapPin } from "react-icons/lu"
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { track } from "../track"
import { ADDRESS_FULL, BRAND, BRAND_FULL, EMAIL, FACEBOOK_URL, IMAGES, INSTAGRAM_URL, PHONES, WHATSAPP_URL } from "../config"

const BRANCH = "Elite Minima Clinic — General"

const EXPLORE = [
  { label: "Home", href: "#top" },
  { label: "Treatments", href: "#treatments" },
  { label: "Doctors", href: "#doctors" },
  { label: "Patient Reviews", href: "#reviews" },
  { label: "Clinic", href: "#clinic" },
  { label: "Location", href: "#visit" },
  { label: "Contact", href: "#book" },
]

const SOCIALS = [
  { Icon: FaInstagram, href: INSTAGRAM_URL, label: "Instagram" },
  { Icon: FaFacebookF, href: FACEBOOK_URL, label: "Facebook" },
  { Icon: FaWhatsapp, href: WHATSAPP_URL, label: "WhatsApp" },
]

export default function GeneralFooter() {
  return (
    <footer className="relative overflow-hidden bg-[var(--e-ink)] text-white/70">
      {/* Three columns, the reference's split: brand + socials · Explore · Reach */}
      <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.6fr_1fr_1.3fr] lg:gap-16">
        <div className="max-w-[36ch]">
          {/* The mark is printed for white; on the dark footer it sits on its own
              paper chip rather than being knocked out. */}
          <span className="inline-flex rounded-2xl bg-white px-4 py-3">
            <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} className="h-9 w-auto sm:h-10" />
          </span>
          <p className="mt-4 text-[0.92rem] leading-relaxed text-white/60">
            Elite-Minima – The Surgical Speciality Clinic. Advanced surgical and minimally invasive care with a focus on safety, privacy,
            personalized treatment, and patient comfort.
          </p>
          {/* Folded in from the dropped fourth column — the specialities still
              need to be on the page, but they don't warrant a column of links. */}
     

          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
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
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--e-purple-light)]">Reach</h4>
          <ul className="mt-4 space-y-3.5 text-[0.9rem]">
            <li>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 text-[var(--e-purple-light)]">
                  <LuPhone className="h-4 w-4" />
                </span>
                <div className="flex flex-col gap-1.5">
                  {PHONES.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      onClick={() => track("call_click", { branch: BRANCH, section: "footer" })}
                      className="font-semibold text-white transition-colors hover:text-[var(--e-purple-light)]"
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-white/70 transition-colors hover:text-[var(--e-purple-light)]">
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
        <div className="mx-auto w-full max-w-[1180px] px-5 py-6 sm:px-8">
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-[0.78rem] text-white/50">
            <span>© 2026 {BRAND}. All rights reserved.</span>
            <a href="/privacy-policy" className="font-semibold text-white/80 transition-colors hover:text-white">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

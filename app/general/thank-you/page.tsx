import type { Metadata } from "next"
import Image from "next/image"

import ThankYouPanel from "@/components/elite-minima/ThankYouPanel"
import { BRAND_FULL, IMAGES, PHONE_ALT_DISPLAY, PHONE_ALT_TEL, PHONE_DISPLAY, PHONE_TEL } from "@/components/elite-minima/config"

export const metadata: Metadata = {
  title: "Thank you — Elite-Minima – The Surgical Speciality Clinic",
  description: "Your consultation request has been received. Our team will call you shortly to confirm your slot.",
  // A confirmation page has nothing to offer a search result, and indexing it
  // would let someone land here without ever having submitted the form.
  robots: { index: false, follow: false },
}

/* The general page's CTAs all dial the second line, so it leads here too — the
   number someone was asked to call throughout should not change at the
   confirmation. The primary line follows as the alternative. */
const PHONES = [
  { display: PHONE_ALT_DISPLAY, tel: PHONE_ALT_TEL },
  { display: PHONE_DISPLAY, tel: PHONE_TEL },
] as const

/**
 * Confirmation for the general page's booking form.
 *
 * Its own page rather than a shared one so the conversion is attributable to
 * /general in analytics, and so the number offered back matches the number that
 * page advertises.
 *
 * Deliberately without GeneralHeader / GeneralFooter: every link in both is an
 * in-page anchor (#treatments, #book) belonging to /general, and on this page
 * they would be a full nav of controls that do nothing. A confirmation wants
 * one way forward anyway, so the chrome is a logo back to the page and the
 * panel's own "back" link.
 */
export default function GeneralThankYouPage() {
  return (
    <div className="elite flex min-h-screen flex-col bg-[var(--e-canvas)]">
      <header className="px-5 pt-5 sm:px-8">
        <a href="/" className="mx-auto flex w-full max-w-[1180px] items-center" aria-label={`${BRAND_FULL} — back to the home page`}>
          <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} priority className="h-9 w-auto sm:h-10" />
        </a>
      </header>

      <main className="ribbon-wash relative flex flex-1 items-center justify-center overflow-hidden px-5 py-12 sm:py-16">
        <ThankYouPanel
          phones={PHONES}
          homeHref="/"
          homeLabel="Back to Elite-Minima"
          branch="Elite Minima Clinic — General"
        />
      </main>
    </div>
  )
}

import type { Metadata } from "next"
import Image from "next/image"

import GynThankYou from "@/components/elite-minima/gynecomastia/GynThankYou"
import { BRAND_FULL, IMAGES } from "@/components/elite-minima/config"

export const metadata: Metadata = {
  title: "Thank you — Elite-Minima, Anna Nagar",
  description: "Your gynecomastia consultation request has been received. Our team will call you shortly to confirm your slot.",
  // A confirmation page has nothing to offer a search result, and indexing it
  // would let someone land here without ever having submitted the form.
  robots: { index: false, follow: false },
}

/**
 * Confirmation for the gynecomastia booking form.
 *
 * Its own page rather than a shared one so the conversion is attributable to
 * /gynecomastia in analytics, and so the visitor stays on the design system
 * they just booked through.
 *
 * Deliberately without GynHeader / GynFooter: every link in both is an in-page
 * anchor belonging to /gynecomastia, and here they would be a full nav of
 * controls that do nothing. The chrome is a logo back to the page, and the
 * panel carries its own way back.
 */
export default function GynecomastiaThankYouPage() {
  return (
    <div className="gyn flex min-h-screen flex-col">
      <header className="border-b border-[var(--g-line)] px-5 py-4 sm:px-8">
        <a
          href="/gynecomastia"
          className="mx-auto flex w-full max-w-[1320px] items-center"
          aria-label={`${BRAND_FULL} — back to the gynecomastia page`}
        >
          <span className="flex items-center bg-white px-3 py-2">
            <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} priority className="h-8 w-auto sm:h-9" />
          </span>
        </a>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-14 sm:py-20">
        <div
          aria-hidden
          className="g-grid-tex pointer-events-none absolute inset-0 opacity-40"
          style={{
            maskImage: "radial-gradient(70% 60% at 50% 0%,#000,transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%,#000,transparent)",
          }}
        />
        <div className="relative flex w-full justify-center">
          <GynThankYou />
        </div>
      </main>
    </div>
  )
}

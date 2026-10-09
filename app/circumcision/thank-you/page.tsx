import type { Metadata } from "next"
import Image from "next/image"

import ThankYouPanel from "@/components/elite-minima/ThankYouPanel"
import { BRAND_FULL, IMAGES, PHONE_ALT_DISPLAY, PHONE_ALT_TEL, PHONE_DISPLAY, PHONE_TEL } from "@/components/elite-minima/config"
import { CIRCUMCISION_BRANCH } from "@/components/elite-minima/circumcision/content"

export const metadata: Metadata = {
  title: "Thank you — Elite-Minima, Anna Nagar",
  description: "Your circumcision consultation request has been received. Our team will call you shortly to confirm your slot.",
  // A confirmation page has nothing to offer a search result, and indexing it
  // would let someone land here without ever having submitted the form.
  robots: { index: false, follow: false },
}

/* The circumcision page advertises the primary line throughout, so it leads
   here too — the number someone was asked to call should not change at the
   confirmation. The second line follows as the alternative. */
const PHONES = [
  { display: PHONE_DISPLAY, tel: PHONE_TEL },
  { display: PHONE_ALT_DISPLAY, tel: PHONE_ALT_TEL },
] as const

/**
 * Confirmation for the circumcision booking form.
 *
 * Its own route rather than the piles one at `/thank-you`, which is where this
 * form used to post: that page's "back" link returns to `/piles`, so a visitor
 * who had just booked a circumcision consultation was handed a different
 * condition's landing page. Its own route also makes the conversion
 * attributable to /circumcision in analytics.
 *
 * Deliberately without CircHeader / CircFooter: every link in both is an
 * in-page anchor (#treatment, #book) belonging to /circumcision, and here they
 * would be a full nav of controls that do nothing. The chrome is a logo back
 * to the page, and the panel carries its own way back.
 *
 * `.elite`, not `.circ`: ThankYouPanel is built on the elite tokens and its
 * buttons are `.btn`. The panel is the same on every page, and re-skinning it
 * for one confirmation is not worth a second copy of it.
 */
export default function CircumcisionThankYouPage() {
  return (
    <div className="elite flex min-h-screen flex-col bg-[var(--e-canvas)]">
      <header className="border-b border-[var(--e-line)] bg-white px-5 py-4 sm:px-8">
        <a
          href="/circumcision"
          className="mx-auto flex w-full max-w-[1180px] items-center"
          aria-label={`${BRAND_FULL} — back to the circumcision page`}
        >
          <Image src={IMAGES.logoLockup} alt={BRAND_FULL} width={776} height={180} priority className="h-9 w-auto sm:h-10" />
        </a>
      </header>

      <main className="ribbon-wash relative flex flex-1 items-center justify-center overflow-hidden px-5 py-12 sm:py-16">
        <ThankYouPanel
          phones={PHONES}
          homeHref="/circumcision"
          homeLabel="Back to circumcision treatment"
          branch={CIRCUMCISION_BRANCH}
        />
      </main>
    </div>
  )
}

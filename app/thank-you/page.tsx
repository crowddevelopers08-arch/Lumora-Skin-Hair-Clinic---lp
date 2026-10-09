import Header from "@/components/elite-minima/Header"
import Footer from "@/components/elite-minima/Footer"
import ThankYouPanel from "@/components/elite-minima/ThankYouPanel"
import { PHONES } from "@/components/elite-minima/config"

/** Confirmation for the piles landing page at `/piles`. The home page has its
    own at /general/thank-you; both render the same panel.

    "Back" returns to /piles rather than `/` — the visitor booked a piles
    consultation, and `/` is the multi-speciality page now. /piles/thank-you
    still redirects here, so the URL this form posts to has not changed. */
export default function ThankYouPage() {
  return (
    <div className="elite flex min-h-screen flex-col">
      <Header />

      <main className="ribbon-wash relative flex flex-1 items-center justify-center overflow-hidden bg-[var(--e-canvas)] px-5 py-14 sm:py-20">
        <ThankYouPanel phones={PHONES} homeHref="/piles" branch="Elite Minima Clinic" />
      </main>

      <Footer />
    </div>
  )
}

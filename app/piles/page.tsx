import type { Metadata } from "next"

import SmoothScroll from "@/components/elite-minima/SmoothScroll"
import ScrollProgress from "@/components/elite-minima/ScrollProgress"
import RunningBar from "@/components/elite-minima/RunningBar"
import Header from "@/components/elite-minima/Header"
import Hero from "@/components/elite-minima/Hero"
import Reviews from "@/components/elite-minima/Reviews"
import TreatmentJourney from "@/components/elite-minima/TreatmentJourney"
import TreatmentOptions from "@/components/elite-minima/TreatmentOptions"
import Doctor from "@/components/elite-minima/Doctor"
import Clinic from "@/components/elite-minima/Clinic"
import Faq from "@/components/elite-minima/Faq"
import MapSection from "@/components/elite-minima/MapSection"
import Footer from "@/components/elite-minima/Footer"
import StickyCta from "@/components/elite-minima/StickyCta"

const TITLE = "Elite Minima — Advanced Piles Treatment | Laser & Minimally Invasive Care"
const DESCRIPTION =
  "Elite Minima — The Surgical Speciality Clinic offers advanced piles treatment in Anna Nagar, Chennai: laser and minimally invasive options with personalized, specialist-led care. Book your consultation."

// The OG block is spelled out here rather than inherited: the root layout's
// defaults describe the clinic as a whole now, and a share card for this page
// should say piles.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Elite Minima — The Surgical Speciality Clinic",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

/**
 * The piles landing page.
 *
 * This used to be `/`, and `/piles` used to be a redirect pointing back at it.
 * The two swapped when the multi-speciality page became the site's front door:
 * the page itself is unchanged, it simply lives at the URL it is named after
 * now, and `/piles` was already the address people were sent to.
 *
 * Its form still posts through to `/thank-you`, and `/piles/thank-you`
 * redirects there, so neither confirmation route moved.
 */
export default function PilesPage() {
  return (
    <div className="elite pb-[72px] lg:pb-0">
      {/* Lenis owns scroll position, so no `scroll-smooth` class here. */}
      <SmoothScroll />
      {/* <ScrollProgress /> */}
      {/* 1 · Running bar */}
      <RunningBar />
      <Header />
      <main>
        {/* 2 · Hook + primary CTA */}
        <Hero />
        {/* 2 · Social proof */}
        <Reviews />
        {/* 3 · How it works */}
        <TreatmentJourney />
        {/* 3 · Treatment options */}
        <TreatmentOptions />
        {/* 4 · Authority — meet the specialist */}
        <Doctor />
        {/* 5 · Clinic */}
        <Clinic />
        {/* Objection handling */}
        <Faq />
        {/* 6 · Map */}
        <MapSection />
      </main>
      {/* 7 · Footer */}
      <Footer />
      <StickyCta />
    </div>
  )
}

import type { Metadata } from "next"

import SmoothScroll from "@/components/elite-minima/SmoothScroll"
import GeneralRunningBar from "@/components/elite-minima/general/GeneralRunningBar"
import GeneralHeader from "@/components/elite-minima/general/GeneralHeader"
import GeneralHero from "@/components/elite-minima/general/GeneralHero"
import GeneralReviews from "@/components/elite-minima/general/GeneralReviews"
import GeneralTreatments from "@/components/elite-minima/general/GeneralTreatments"
import GeneralJourney from "@/components/elite-minima/general/GeneralJourney"
import GeneralDoctors from "@/components/elite-minima/general/GeneralDoctors"
import GeneralClinic from "@/components/elite-minima/general/GeneralClinic"
import GeneralLocation from "@/components/elite-minima/general/GeneralLocation"
import GeneralFinalCta from "@/components/elite-minima/general/GeneralFinalCta"
import GeneralFooter from "@/components/elite-minima/general/GeneralFooter"
import GeneralStickyCta from "@/components/elite-minima/general/GeneralStickyCta"

export const metadata: Metadata = {
  title: "Elite-Minima — Piles, Circumcision & Gynecomastia Treatment in Anna Nagar, Chennai",
  description:
    "Elite-Minima – The Surgical Speciality Clinic offers specialist-led surgical and minimally invasive care for piles, circumcision and gynecomastia in Anna Nagar, Chennai. Book a private consultation.",
}

/**
 * The home page — the general (multi-speciality) landing page.
 *
 * It routes a visitor to one of three treatment pathways rather than speaking
 * to a single condition, which is why it is the front door: the two
 * condition-specific pages, `/piles` and `/gynecomastia`, are where a visitor
 * arrives from an ad that already knows what they came for.
 *
 * `/general` is the address this page used to live at and now redirects here,
 * so existing links and campaigns still land on it. Its sections live in
 * components/elite-minima/general/ and share nothing with the piles page
 * beyond the brand primitives (Reveal, TitleUnderline, CountUp, config).
 */
export default function HomePage() {
  return (
    <div className="elite pb-[72px] lg:pb-0">
      {/* Lenis owns scroll position, so no `scroll-smooth` class here. */}
      <SmoothScroll />
      <GeneralRunningBar />
      <GeneralHeader />
      <main>
        <GeneralHero />
        <GeneralReviews />
        <GeneralTreatments />
        <GeneralJourney />
        <GeneralDoctors />
        <GeneralClinic />
        <GeneralLocation />
        <GeneralFinalCta />
      </main>
      <GeneralFooter />
      <GeneralStickyCta />
    </div>
  )
}

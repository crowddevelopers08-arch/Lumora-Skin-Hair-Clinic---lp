import type { Metadata } from "next"

import SmoothScroll from "@/components/elite-minima/SmoothScroll"
import GynHeader from "@/components/elite-minima/gynecomastia/GynHeader"
import GynHero from "@/components/elite-minima/gynecomastia/GynHero"
import GynBooking from "@/components/elite-minima/gynecomastia/GynBooking"
import GynReviews from "@/components/elite-minima/gynecomastia/GynReviews"
import GynJourney from "@/components/elite-minima/gynecomastia/GynJourney"
import GynOptions from "@/components/elite-minima/gynecomastia/GynOptions"
import GynOutcomes from "@/components/elite-minima/gynecomastia/GynOutcomes"
import GynSurgeon from "@/components/elite-minima/gynecomastia/GynSurgeon"
import GynClinic from "@/components/elite-minima/gynecomastia/GynClinic"
import GynLocation from "@/components/elite-minima/gynecomastia/GynLocation"
import GynFinalCta from "@/components/elite-minima/gynecomastia/GynFinalCta"
import GynFooter from "@/components/elite-minima/gynecomastia/GynFooter"
import GynStickyCta from "@/components/elite-minima/gynecomastia/GynStickyCta"

export const metadata: Metadata = {
  title: "Gynecomastia Surgery in Chennai | Male Breast Reduction — Elite-Minima, Anna Nagar",
  description:
    "Gynecomastia treatment in Anna Nagar, Chennai. Specialist evaluation with Dr. Madan K — liposuction, gland excision and chest contouring for a flatter, more masculine chest. Book a private consultation.",
  openGraph: {
    title: "Gynecomastia Surgery in Chennai | Male Breast Reduction — Elite-Minima",
    description:
      "Specialist-led male breast reduction at Elite-Minima, Anna Nagar: liposuction, gland excision and advanced chest contouring, planned after clinical evaluation.",
    type: "website",
    locale: "en_IN",
  },
}

/**
 * The gynecomastia landing page.
 *
 * The third landing page on the site, and deliberately the odd one out. `/`
 * and `/general` both wear the `.elite` design system — white paper, pill
 * buttons, soft shadows, Lato throughout — and a third page in it would have
 * been the same page with different words. This one runs on `.gyn` instead
 * (see globals.css): near-black surfaces cut by bone-white bands, square
 * corners, hairline rules, outlined numerals and uppercase headings — set in
 * Lato, the site's only typeface. Its sections live in
 * components/elite-minima/gynecomastia/ and share nothing with the other two
 * beyond the brand primitives — the motion helpers, CountUp, the clinic config
 * and the lead API.
 */
export default function GynecomastiaPage() {
  return (
    <div className="gyn pb-[60px] lg:pb-0">
      {/* Lenis owns scroll position, so no `scroll-smooth` class here. */}
      <SmoothScroll />
      <GynHeader />
      <main>
        {/* 1 · Hook + the surgeon's face */}
        <GynHero />
        {/* 1b · Lead capture, immediately under the hook */}
        <GynBooking />
        {/* 2 · Social proof */}
        <GynReviews />
        {/* 3 · What happens, in order */}
        <GynJourney />
        {/* 3b · Which procedure, and why */}
        <GynOptions />
        {/* 3c · Outcomes, scars, recovery */}
        <GynOutcomes />
        {/* 4 · Authority */}
        <GynSurgeon />
        {/* 5 · The clinic and who it serves */}
        <GynClinic />
        {/* 6 · Getting there */}
        <GynLocation />
        {/* 7 · Close */}
        <GynFinalCta />
      </main>
      <GynFooter />
      <GynStickyCta />
    </div>
  )
}

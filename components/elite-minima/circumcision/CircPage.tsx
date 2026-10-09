import SmoothScroll from "../SmoothScroll"
import CircHeader from "./CircHeader"
import CircHero from "./CircHero"
import CircReviews from "./CircReviews"
import CircTreatment from "./CircTreatment"
import CircDoctor from "./CircDoctor"
import CircClinic from "./CircClinic"
import CircLocation from "./CircLocation"
import CircFooter from "./CircFooter"
import CircStickyCta from "./CircStickyCta"

/**
 * The circumcision landing page.
 *
 * The hero, five numbered bands and a footer, in the order and with the copy
 * of the approved content deck (transcribed in ./content.ts):
 *
 *   Hero — headline, assurances, CTAs, and the booking form
 *   01 · Patient reviews
 *   02 · Treatment journey + circumcision options
 *   03 · Doctor
 *   04 · Clinic
 *   05 · Map
 *   Footer
 *
 * The booking band that used to sit between the hero and the reviews is gone:
 * the form moved back into the hero's right column, where the deck has it, and
 * a second band asking for the same six fields was a scroll spent on nothing.
 * `#book` now lands on the hero's form column.
 *
 * The header and the phone-only action bar are page chrome rather than deck
 * sections: nothing here is reachable without a way to navigate to it, and on
 * a phone the form ends up a long way from most of the page.
 *
 * ── The design ────────────────────────────────────────────────────────────
 * `.circ` (see globals.css). The structure is `.gyn`'s editorial treatment —
 * square corners, hairline rules, outlined numerals, underlined form fields,
 * uppercase headings — on a white ground.
 *
 * It was a dark page. The client read it as too heavy, so it was inverted to
 * the white theme entirely in the `.circ` tokens; nothing in this file or in
 * the sections below changed shape for it, and the `tone` prop each section
 * passes still selects between two grounds — they are simply both light now.
 *
 * What keeps it off `.elite`, the white theme `/` and `/piles` already wear:
 * nothing here is neutral grey. Every tone above the white ground is mixed
 * toward the logo's purple, violet leads and green is reserved for actions,
 * the texture is diagonal hairlines, and every band under the hero is numbered
 * 01–05, which makes the sections countable on the way down.
 *
 * Bands alternate weight so no two neighbours are the same, and no section
 * carries its own shell width — they all use SHELL from ./ui, which keeps the
 * columns aligned.
 */
export default function CircPage() {
  return (
    // The bottom padding reserves the sticky action bar's height below lg, so
    // it never covers the end of the footer.
    <div id="top" className="circ pb-[56px] lg:pb-0">
      {/* Lenis owns scroll position, so no `scroll-smooth` class here. */}
      <SmoothScroll />
      <CircHeader />

      <main>
        <CircHero />
        <CircReviews />
        <CircTreatment />
        <CircDoctor />
        <CircClinic />
        <CircLocation />
      </main>

      <CircFooter />
      <CircStickyCta />
    </div>
  )
}

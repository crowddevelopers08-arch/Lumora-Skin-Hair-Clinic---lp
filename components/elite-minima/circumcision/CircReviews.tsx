"use client"

import { ArrowRight, ArrowUpRight, Star } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { GOOGLE_REVIEW_FALLBACK_URL } from "../config"
import { Eyebrow, SECTION_Y, SHELL } from "./ui"
import {
  CIRCUMCISION_BRANCH,
  REVIEWS,
  REVIEWS_CTA,
  REVIEWS_DISCLAIMER,
  REVIEWS_LEAD,
  REVIEWS_TITLE,
} from "./content"

/**
 * Section 02 — patient reviews, as a row that scrolls itself.
 *
 * The gynecomastia page's marquee rather than a static grid or a
 * button-and-dots carousel. For a set of quotes there is no "current" one to
 * point a dot at, and arrows that fight a moving track are controls for
 * something that no longer holds still — hover, or tab into a card, and the
 * row pauses instead. Under `prefers-reduced-motion` it stops and becomes a
 * plain horizontal scroller, so every card stays reachable.
 *
 * The cards are rendered twice and the track slides exactly one set before
 * looping, which is what makes the wrap seamless — see `.c-marquee` in
 * globals.css for why the spacing is a margin on each card rather than a gap
 * on the track. The second copy is hidden from assistive tech: it is the same
 * six quotes, and a screen reader should meet each patient once.
 *
 * ⚠ Every review in REVIEWS is invented placeholder copy — see the warning
 * above it in content.ts. It has to be replaced with reviews the clinic has
 * actually received before this page goes live.
 */
export default function CircReviews() {
  return (
    <section id="reviews" className={`bg-[var(--c-bone)] text-[var(--c-ink)] ${SECTION_Y}`}>
      <div className={SHELL}>
        <Reveal className="max-w-[60ch]">
          <Eyebrow n="01" tone="ink">
            Patient Reviews
          </Eyebrow>
          <h2 className="mt-5">{REVIEWS_TITLE}</h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-[var(--c-ink-dim)]">{REVIEWS_LEAD}</p>
        </Reveal>
      </div>

      {/* Full-bleed, outside the shell: the fade at each edge is the thing that
          says there is more, and it only reads as an edge if the cards
          actually reach it. The first card is inset by the shell's own gutter
          so the row still starts on the page's left margin. */}
      <div className="c-marquee mt-9 sm:mt-12">
        <div className="c-marquee-track">
          {[0, 1].map((copy) => (
            <div className="flex" key={copy} aria-hidden={copy === 1 || undefined}>
              {REVIEWS.map((r, i) => (
                <article
                  key={`${copy}-${r.name}`}
                  className={`group relative mr-4 flex w-[82vw] max-w-[380px] shrink-0 flex-col border border-[var(--c-bone-line)] bg-[var(--c-bone)] p-7 transition-colors duration-300 hover:bg-[var(--c-bone-2)] sm:w-[360px] sm:p-8 ${
                    copy === 0 && i === 0 ? "ml-5 sm:ml-8" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="c-numeral c-numeral--ink pointer-events-none absolute right-6 top-6 text-[3.2rem] transition-colors duration-300 group-hover:[-webkit-text-stroke-color:var(--c-violet-deep)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-1" role="img" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-[var(--c-violet-deep)] text-[var(--c-violet-deep)]" aria-hidden />
                    ))}
                  </div>

                  <p className="mt-4 text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[var(--c-ink-dim)]">{r.tag}</p>

                  {/* pr-10 keeps the quote clear of the numeral in the corner. */}
                  <blockquote className="mt-5 flex-1 pr-10 text-[0.98rem] leading-relaxed text-[var(--c-ink)]">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>

                  <footer className="mt-7 flex items-baseline gap-3 border-t border-[var(--c-bone-line)] pt-5">
                    <span className="c-display text-[1.05rem] leading-none text-[var(--c-ink)]">{r.name}</span>
                    <span className="text-[0.8rem] text-[var(--c-ink-dim)]">{r.place}</span>
                  </footer>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={SHELL}>
        <Reveal className="mt-10 flex flex-col items-start gap-6 border-t border-[var(--c-bone-line)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[52ch] text-[0.82rem] leading-relaxed text-[var(--c-ink-dim)]">{REVIEWS_DISCLAIMER}</p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={GOOGLE_REVIEW_FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("google_reviews_click", { branch: CIRCUMCISION_BRANCH, section: "reviews" })}
              className="c-btn c-btn-ink-line w-full sm:w-auto"
            >
              See us on Google
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#book"
              onClick={() => track("book_click", { branch: CIRCUMCISION_BRANCH, section: "reviews" })}
              className="c-btn c-btn-ink group/btn w-full sm:w-auto"
            >
              {REVIEWS_CTA}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

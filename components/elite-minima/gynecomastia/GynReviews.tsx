"use client"

import { ArrowUpRight, Star } from "lucide-react"
import CountUp from "../CountUp"
import { Reveal } from "../motion"
import { track } from "../track"
import { GOOGLE_REVIEW_FALLBACK_URL } from "../config"
import { GYN_BRANCH, REVIEWS, REVIEW_PROOF, REVIEWS_INTRO } from "./content"

/**
 * Patient experiences, as a row that scrolls itself.
 *
 * The cards are rendered twice and the track slides one full set before
 * looping, which is what makes the wrap seamless — see the `.g-marquee` rules
 * in globals.css for why the spacing is a margin on each card rather than a
 * gap on the track. The second copy is hidden from assistive tech: it is the
 * same four quotes, and a screen reader should meet each patient once.
 *
 * It replaced a button-and-dots carousel. Arrows that fight a moving track and
 * dots that point at scroll offsets which never stop moving were both
 * controls for a thing that no longer holds still; hover, or tab into a card,
 * and the row pauses instead.
 */
export default function GynReviews() {
  return (
    <section id="reviews" className="bg-[var(--g-bone)] text-[var(--g-ink)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[46ch]">
            <p className="g-eyebrow g-eyebrow--ink">Patient Reviews</p>
            <h2 className="mt-5">{REVIEWS_INTRO.title}</h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-[var(--g-ink-dim)]">{REVIEWS_INTRO.body}</p>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-none gap-10 border-[var(--g-bone-line)] sm:border-l sm:pl-8">
            {REVIEW_PROOF.map((p) => (
              <div key={p.label}>
                <p className="g-display text-[clamp(3.4rem,2.3rem+3.2vw,5.2rem)] leading-none text-[var(--g-ink)]">
                  <CountUp end={p.value} suffix={p.suffix} separator="," />
                </p>
                <p className="mt-2 max-w-[12ch] text-[0.76rem] uppercase tracking-[0.14em] text-[var(--g-ink-dim)]">{p.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* The row is deliberately allowed to run past the shell's gutters —
            the fade at each edge is the thing that says there is more, and it
            only reads as an edge if the cards actually reach it. */}
        <div className="g-marquee mt-8 sm:mt-12">
          <div className="g-marquee-track">
            {[0, 1].map((copy) => (
              <div className="flex" key={copy} aria-hidden={copy === 1 || undefined}>
                {REVIEWS.map((r, i) => (
                  <article
                    key={`${copy}-${r.name}`}
                    className="relative mr-4 flex w-[84vw] max-w-[380px] shrink-0 flex-col rounded-lg border border-[var(--g-bone-line)] bg-[var(--g-bone)] p-7 transition-colors duration-300 hover:bg-[var(--g-bone-2)] sm:w-[360px] sm:p-9"
                  >
                    <span
                      aria-hidden
                      className="g-numeral g-numeral--ink pointer-events-none absolute right-6 top-6 text-[3.4rem] transition-colors duration-300 group-hover:[-webkit-text-stroke-color:var(--g-accent-deep)]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-1" role="img" aria-label="Rated 5 out of 5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-[var(--g-accent-deep)] text-[var(--g-accent-deep)]" aria-hidden />
                      ))}
                    </div>

                    <p className="mt-4 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[var(--g-ink-dim)]">{r.tag}</p>

                    <blockquote className="mt-5 flex-1 pr-10 text-[1rem] leading-relaxed text-[var(--g-ink)]">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>

                    <footer className="mt-7 flex items-baseline gap-3 border-t border-[var(--g-bone-line)] pt-5">
                      <span className="g-display text-[1.05rem] leading-none text-[var(--g-ink)]">{r.name}</span>
                      <span className="text-[0.8rem] text-[var(--g-ink-dim)]">{r.place}</span>
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Reveal delay={0.05} className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[52ch] text-[0.82rem] leading-relaxed text-[var(--g-ink-dim)]">
            Individual experiences, treatment requirements, and recovery vary between patients.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={GOOGLE_REVIEW_FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("google_reviews_click", { branch: GYN_BRANCH, section: "reviews" })}
              className="g-btn g-btn-ink-line w-full sm:w-auto"
            >
              See us on Google
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#book"
              onClick={() => track("book_click", { branch: GYN_BRANCH, section: "reviews" })}
              className="g-btn g-btn-ink w-full sm:w-auto"
            >
              Book a consultation
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
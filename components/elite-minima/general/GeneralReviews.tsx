"use client"

import { Star, User, ArrowRight } from "lucide-react"
import Reveal from "../Reveal"
import TitleUnderline from "../TitleUnderline"
import { track } from "../track"
import { WASH } from "../tokens"
import { ADDRESS_SHORT } from "../config"
import { REVIEWS } from "./content"

const BRANCH = "Elite Minima Clinic — General"

/* Cards cycle through the three brand washes so the rail has a gentle rhythm
   as it loops, rather than reading as one long white band. */
const TINTS = [WASH.green, WASH.purple, WASH.slate]

const PROOF = ["4,000+ Surgeries", "12+ Years of Experience", ADDRESS_SHORT]

type Review = (typeof REVIEWS)[number]

function StoryCard({ r, tint }: { r: Review; tint: string }) {
  return (
    // Borderless tinted tile — the wash itself separates it from the white
    // section, so it needs no hairline. Inline background because `.elite .card`
    // sets `background:#fff` and would win over a utility class on specificity.
    <article
      className="flex h-full w-[280px] flex-col rounded-[20px] p-6 sm:w-[330px]"
      style={{ backgroundColor: tint }}
    >
      <div className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-3.5 w-3.5 fill-[var(--e-purple)] text-[var(--e-purple)]" />
        ))}
      </div>
      {/* white chip rather than a green wash — it stays legible on all three tints */}
      <span className="mt-3 inline-flex w-fit items-center rounded-full border border-[var(--e-green-line)] bg-white px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[var(--e-green-deep)]">
        {r.tag}
      </span>
      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[var(--e-ink)]">&ldquo;{r.quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-[var(--e-line)] pt-4">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-[var(--e-muted)]">
          <User className="h-4.5 w-4.5" />
        </span>
        <div className="leading-tight">
          <p className="text-[0.88rem] font-bold text-[var(--e-ink)]">{r.name}</p>
          <p className="text-[0.78rem] text-[var(--e-muted)]">{r.place}</p>
        </div>
      </div>
    </article>
  )
}

/** One pass of the reviews. Rendered twice so the loop has no visible seam. */
function Track({ duplicate }: { duplicate?: boolean }) {
  return (
    <ul aria-hidden={duplicate} className={`flex shrink-0 items-stretch ${duplicate ? "marquee-dup" : ""}`}>
      {REVIEWS.map((r, i) => (
        <li key={r.tag + i} className="mr-5 flex shrink-0">
          <StoryCard r={r} tint={TINTS[i % TINTS.length]} />
        </li>
      ))}
    </ul>
  )
}

export default function GeneralReviews() {
  return (
    <section id="reviews" className="overflow-hidden border-b border-[var(--e-line)] bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        {/* Two columns from `lg` up; a single ordered stack below it. On phones
            the rail is pulled up between the intro copy and the proof line — the
            reviews are what the section is selling, and leaving them under the
            stats and the CTA buried them a full screen down. `contents` lets the
            intro and the proof block sit directly in the mobile flex so the rail
            can order itself between them, then the wrapper becomes a normal
            block again at `lg` and the two halves rejoin the left column. */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <div className="contents lg:block lg:max-w-[420px]">
            <Reveal className="order-1">
              <p className="kicker">Patient Reviews</p>
              <h2 className="mt-4">Trusted Surgical Care. Real Patient Experiences.</h2>
              <TitleUnderline className="mt-3" />
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
                Every patient&apos;s condition and treatment journey is different. Hear from patients who chose Elite-Minima for specialist
                consultation, treatment, and follow-up care.
              </p>
            </Reveal>

            <Reveal className="order-3 lg:mt-5">
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.85rem] font-semibold text-[var(--e-ink-soft)]">
                {PROOF.map((p, i) => (
                  <span key={p} className="inline-flex items-center gap-2.5">
                    {i > 0 && <span className="text-[var(--e-green)]">•</span>}
                    {p}
                  </span>
                ))}
              </p>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-[var(--e-muted)]">
                Individual experiences, treatment requirements, and recovery may vary.
              </p>

              <a
                href="#book"
                onClick={() => track("book_click", { branch: BRANCH, section: "reviews" })}
                className="btn btn-primary group/btn mt-6"
              >
                Book Your Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </a>
            </Reveal>
          </div>

          {/* Cards drift right → left, forever. Bleeds past the shell gutter so
              the rail reads as continuing off-screen rather than stopping at a
              margin. */}
          <Reveal className="marquee-rail marquee-fade order-2 -mr-5 min-w-0 sm:-mr-8">
            <div className="marquee py-1 [--marquee-duration:38s]">
              <Track />
              <Track duplicate />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

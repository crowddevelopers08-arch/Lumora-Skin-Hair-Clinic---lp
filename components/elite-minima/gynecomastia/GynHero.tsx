"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, Check, Phone, Play } from "lucide-react"
import { track } from "../track"
import { EASE } from "../tokens"
import { GYN_BRANCH, GYN_PHONE_TEL, HERO, HERO_CONCERNS, HERO_MEDIA, HERO_SURGEON } from "./content"

/** How long each hero slide holds before the frame cross-fades to the next. */
const SLIDE_MS = 5000

/**
 * Hero — media-led, form-free.
 *
 * Both other pages put the booking card in the hero's right column. Here the
 * right column is the film, and the form is the band immediately below (see
 * GynBooking): a visitor deciding whether to be evaluated for their chest
 * wants to see the clinic and the surgeon before they are asked for a phone
 * number, and the form is still the first thing under the fold either way.
 */
export default function GynHero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--g-base)]">
      {/* Ground: hairline grid, faded out toward the bottom so the band below
          starts on clean black rather than a hard edge. */}
      <div
        aria-hidden
        className="g-grid-tex pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{ maskImage: "linear-gradient(180deg,#000,transparent 88%)", WebkitMaskImage: "linear-gradient(180deg,#000,transparent 88%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-[-12rem] h-[34rem] w-[34rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(63,191,119,0.28), transparent 68%)" }}
      />

      {/* Three blocks in one grid rather than two columns of stacked copy.
          On phones they simply follow each other, which is what puts the
          media between the lead and the concerns; from lg the copy halves are
          placed back into column one and the media spans both their rows.
          Splitting it this way keeps one HeroMedia in the tree — the
          alternative, a mobile copy and a desktop copy, would run two
          carousels and two timers to show one image. */}
      <div className="relative mx-auto grid w-full max-w-[1320px] px-5 pb-10 pt-4 sm:px-8 sm:pb-10 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14 lg:py-10">
        {/* ── Copy, above the media on mobile ──────────────────────────── */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="g-rise g-d1 g-eyebrow">Male Breast Reduction</p>

          <h1 className="g-rise g-d2 mt-5 max-w-[18ch]">
            <MarkedFirstWord text={HERO.title} />
          </h1>

          <p className="g-rise g-d3 mt-6 max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--g-dim)]">{HERO.lead}</p>
        </div>

        {/* ── Media + surgeon plate ────────────────────────────────────── */}
        <div className="g-rise g-d3 mt-8 min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:self-center">
          <HeroMedia />

          {/* The surgeon is named on the media, not in a card of his own —
              the film and the face are one credential. */}
          <div className="flex items-center gap-4 border border-t-0 border-[var(--g-line)] bg-[var(--g-surface)] p-4">
            <span className="relative h-14 w-14 flex-none overflow-hidden bg-[var(--g-raised)]">
              {/* object-center, not object-top: the crop is done upstream in
                  the URL and is already centred on the face. */}
              <Image
                src={HERO_SURGEON.photo}
                alt={`${HERO_SURGEON.name} — ${HERO_SURGEON.title}`}
                fill
                sizes="56px"
                className="object-cover object-center"
              />
            </span>
            <div className="min-w-0">
              <p className="g-display text-[1.05rem] leading-none text-[var(--g-text)]">{HERO_SURGEON.name}</p>
              <p className="mt-1.5 text-[0.78rem] leading-snug text-[var(--g-dim)]">{HERO_SURGEON.title}</p>
            </div>
          </div>
        </div>

        {/* ── Copy, below the media on mobile ──────────────────────────── */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <div className="g-rise g-d4 mt-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--g-text)]">Common concerns we treat</p>
            {/* Hairline rows, two columns from sm. A tinted chip per concern
                would have been six coloured pills in the hero — the rule does
                the separating instead. */}
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {HERO_CONCERNS.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-3 border-b border-[var(--g-line)] py-2.5 text-[0.9rem] text-[var(--g-text)]"
                >
                  <Check className="h-3.5 w-3.5 flex-none text-[var(--g-accent)]" strokeWidth={3} aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="g-rise g-d5 mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#book"
              onClick={() => track("book_click", { branch: GYN_BRANCH, section: "hero" })}
              className="g-btn g-btn-solid group/btn w-full sm:w-auto"
            >
              {HERO.primaryCta}
              <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-y-0.5" />
            </a>
            <a
              href={`tel:${GYN_PHONE_TEL}`}
              onClick={() => track("call_click", { branch: GYN_BRANCH, section: "hero" })}
              className="g-btn g-btn-line w-full sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              {HERO.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The headline, with its first word highlighted.
 *
 * Only the first word is marked — "Gynecomastia" is what the page is about.
 * The highlight itself is `.g-mark` in globals.css.
 */
function MarkedFirstWord({ text }: { text: string }) {
  const [word, ...rest] = text.split(" ")

  return (
    <>
      <span className="g-mark">{word}</span>
      {rest.length > 0 && ` ${rest.join(" ")}`}
    </>
  )
}

/**
 * The hero frame.
 *
 * A real `<video>` when one is configured in content.ts, and the slides
 * otherwise — the clinic has no chest-contouring film yet, and a play button
 * over an image that cannot play is worse than no button. Dropping a URL into
 * HERO_MEDIA.video is the only change needed to turn this into a player.
 *
 * With more than one slide the still becomes a cross-fade carousel. Every
 * slide is mounted at once and only opacity moves, so the browser has each
 * image decoded before its turn and the frame never flashes empty mid-fade —
 * two images is cheap enough to afford that, and it keeps the corner ticks and
 * the caption chip layered over a frame that never changes size.
 */
function HeroMedia() {
  const { video, slides } = HERO_MEDIA
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const many = !video && slides.length > 1

  // No timer under prefers-reduced-motion: the dots below still work, so the
  // other slides stay reachable — they just never arrive on their own.
  useEffect(() => {
    if (!many || paused || reduced) return
    const id = window.setInterval(() => setIndex((n) => (n + 1) % slides.length), SLIDE_MS)
    return () => window.clearInterval(id)
  }, [many, paused, reduced, slides.length])

  const active = slides[index] ?? slides[0]

  return (
    // Taller than the 4:3 it started as, and taller again from lg, where the
    // frame sits beside a copy column running to roughly the viewport height —
    // at 4:3 it finished well short of it and the row read as top-heavy. Square
    // overshot the other way, so lg sits just under it.
    <div className="relative aspect-[9/7] w-full overflow-hidden border border-[var(--g-line)] bg-[var(--g-raised)] sm:aspect-[6/5] lg:aspect-[10/9]">
      {video ? (
        <video
          className="h-full w-full object-cover"
          src={video}
          poster={slides[0].src}
          controls
          playsInline
          preload="metadata"
          aria-label={slides[0].alt}
        />
      ) : (
        <div
          className="absolute inset-0"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          {...(many ? { role: "group", "aria-roledescription": "carousel", "aria-label": "Clinic images" } : {})}
        >
          {slides.map((s, i) => (
            <motion.div
              key={s.src}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
              // Off-screen slides are decorative until they come round, and
              // announcing all of them at once would read as one run-on image.
              aria-hidden={i !== index}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                priority={i === 0}
                className="object-cover object-center"
              />
            </motion.div>
          ))}

          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,20,0.05),rgba(8,12,20,0.72))]" />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2.5 border border-white/25 bg-[rgba(8,12,20,0.6)] px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-[6px]"
          >
            <Play className="h-3 w-3 fill-current" />
            {active.caption}
          </span>

          {/* Bars rather than dots — square ends, in keeping with a page that
              has no rounded corner anywhere. */}
          {many && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.caption}`}
                  aria-current={i === index}
                  className={`h-[3px] transition-all duration-500 ${
                    i === index ? "w-7 bg-[var(--g-accent)]" : "w-4 bg-white/45 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Corner ticks — the viewfinder motif this page uses wherever an image
          is framed. */}
      {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map(
        (c) => (
          <span key={c} className={`pointer-events-none absolute h-5 w-5 border-[var(--g-accent)] ${c}`} aria-hidden />
        ),
      )}
    </div>
  )
}

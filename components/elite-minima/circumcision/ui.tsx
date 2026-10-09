import type { ReactNode } from "react"
import Image from "next/image"
import { Check, ImageIcon } from "lucide-react"

/* Layout primitives shared by every section of /circumcision.
 *
 * These exist so the page has one spine: the same max width, the same gutters
 * and the same vertical rhythm everywhere. The gynecomastia page this design
 * is drawn from repeats its shell utilities in each section; here they are one
 * constant, because the alignment defects on the last circumcision build all
 * came from sections carrying their own width. */

/** The page's content shell. Every text section uses it, no exceptions. */
export const SHELL = "mx-auto w-full max-w-[1280px] px-5 sm:px-8"

/**
 * A wider track, for the hero panel only.
 *
 * The one place on the page where widening does not cost alignment: the hero
 * is a bordered panel with its own internal padding, so its copy's left edge
 * is set by that padding rather than by the shell, and the sections below keep
 * their own spine either way. Running it 160px wider gives the portrait column
 * enough room to read as a half of the composition rather than a slot.
 *
 * Do not reach for this in a text section — two different measures down the
 * page is the alignment problem the single SHELL exists to prevent.
 */
export const SHELL_WIDE = "mx-auto w-full max-w-[1440px] px-5 sm:px-8"

/** Section vertical rhythm — generous on desktop, tightened on phones so the
    page is not mostly empty space on a 390px screen. */
export const SECTION_Y = "py-12 sm:py-16 lg:py-20"

/**
 * The band index and its name: "01 ─── Treatment".
 *
 * The numeral is this page's addition to the treatment it inherits — the
 * content deck is seven numbered sections, and printing the number makes that
 * sequence legible while scrolling rather than only in the deck.
 */
export function Eyebrow({ n, children, tone = "dark" }: { n: string; children: ReactNode; tone?: "dark" | "ink" }) {
  return (
    <p className={`c-eyebrow ${tone === "ink" ? "c-eyebrow--ink" : ""}`}>
      <span className="c-eyebrow-n">{n}</span>
      {children}
    </p>
  )
}

/**
 * Green tick + label, the page's list row.
 *
 * The tick sits in its own fixed-width box so a label that wraps hangs off a
 * straight left edge rather than tucking under the icon. Green here is the
 * one place the action colour appears outside a button — a tick is an
 * affirmative, and the violet is carrying structure everywhere else.
 */
export function Tick({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "ink" }) {
  return (
    <li
      className={`flex items-start gap-3 border-b py-2.5 text-[0.9rem] leading-snug ${
        tone === "ink" ? "border-[var(--c-bone-line)] text-[var(--c-ink)]" : "border-[var(--c-line)] text-[var(--c-text)]"
      }`}
    >
      <Check
        className={`mt-0.5 h-3.5 w-3.5 flex-none ${tone === "ink" ? "text-[var(--c-green-deep)]" : "text-[var(--c-green)]"}`}
        strokeWidth={3}
        aria-hidden
      />
      <span className="min-w-0">{children}</span>
    </li>
  )
}

/**
 * A picture frame that also works before there is a picture.
 *
 * The content deck leaves several images outstanding — the doctor's portrait
 * and three of the four clinic frames. Rendering nothing would collapse the
 * layouts built around them and rendering a broken <Image> is worse, so an
 * empty `src` draws a labelled slot at the same size instead. Filling the
 * constant in content.ts is the only change needed to go live.
 */
export function MediaFrame({
  src,
  alt,
  label,
  sizes,
  className = "",
  priority = false,
  tone = "dark",
  focus = "center",
  children,
}: {
  src: string
  alt: string
  /** Shown in the empty state, e.g. "Reception". */
  label: string
  sizes: string
  className?: string
  priority?: boolean
  tone?: "dark" | "ink"
  /** Where the crop holds when the frame is a different shape to the file.
      "top" for portraits — centring one crops the crown off. */
  focus?: "center" | "top"
  /** Overlaid on the filled state — captions, scrims, corner ticks. */
  children?: ReactNode
}) {
  const ink = tone === "ink"

  return (
    <div
      className={`relative overflow-hidden border ${
        ink ? "border-[var(--c-bone-line)] bg-[var(--c-bone-2)]" : "border-[var(--c-line)] bg-[var(--c-raised)]"
      } ${className}`}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover ${focus === "top" ? "object-top" : "object-center"}`}
          />
          {children}
        </>
      ) : (
        <div
          className={`c-tex absolute inset-0 grid place-content-center p-2 ${
            ink ? "bg-[var(--c-bone-2)]" : "bg-[var(--c-surface)]"
          }`}
        >
          {/* The label sits on its own solid chip rather than straight on the
              texture — the diagonals run through small tracked caps and take
              them below legible, most visibly on the bone tone.

              The chip is sized to the smallest frame it has to survive: the
              third column of the clinic mosaic is about 110px wide on a phone,
              where "Consultation Room" at the page's usual 0.24em tracking
              spilled past both edges. Tracking is dialled back, the icon is
              stacked above rather than beside, and the whole chip is capped at
              the frame's width so it wraps instead of overflowing. */}
          <span
            className={`inline-flex max-w-full flex-col items-center gap-1.5 px-2 py-2 text-center text-[0.58rem] font-bold uppercase leading-tight tracking-[0.1em] ${
              ink ? "bg-[var(--c-bone)] text-[var(--c-violet-deep)]" : "bg-[var(--c-raised)] text-[var(--c-violet)]"
            }`}
          >
            <ImageIcon className="h-4 w-4 flex-none" aria-hidden />
            <span className="min-w-0 break-words">{label}</span>
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Viewfinder ticks — the four corner brackets the gynecomastia page puts on a
 * framed image. Kept, because it is the motif that says "this is a frame" on a
 * page with no rounded corner anywhere; tinted violet rather than green, like
 * everything structural here.
 */
export function CornerTicks() {
  return (
    <>
      {[
        "left-0 top-0 border-l border-t",
        "right-0 top-0 border-r border-t",
        "left-0 bottom-0 border-l border-b",
        "right-0 bottom-0 border-r border-b",
      ].map((c) => (
        <span key={c} aria-hidden className={`pointer-events-none absolute h-5 w-5 border-[var(--c-violet)] ${c}`} />
      ))}
    </>
  )
}

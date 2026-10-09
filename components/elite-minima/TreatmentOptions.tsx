"use client"

import { useRef, useState } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"
import { Magnetic } from "./motion"
import { C, EASE } from "./tokens"
import { track } from "./track"
import { IMAGES } from "./config"

/* The four clinical images are illustrative of the condition, not of the
   individual procedures — `w`/`h` are the files' true intrinsic sizes, since
   next.config sets `images.unoptimized` and does no resizing of its own. */
const OPTIONS = [
  {
    img: IMAGES.pilesCausesAndSymptoms,
    w: 745,
    h: 470,
    alt: "A man holding his lower back in discomfort, with a magnifying glass revealing a cross-section of the anal canal",
    title: "Non-Surgical Piles Treatment",
    desc: "For suitable early-stage piles, treatment may include medications, stool softeners, dietary modifications and lifestyle guidance to relieve symptoms, reduce straining and support healthier bowel habits.",
  },
  {
    img: IMAGES.pilesDiagram,
    w: 612,
    h: 611,
    alt: "Cross-section diagram of the anal canal labelling internal and external hemorrhoids and bleeding",
    title: "Minimally Invasive Piles Treatment",
    desc: "For selected cases, minimally invasive procedures may be recommended to treat piles while limiting tissue disruption and supporting a smoother recovery.",
  },
  {
    img: IMAGES.pilesModel,
    w: 250,
    h: 250,
    alt: "Anatomical model showing hemorrhoids within the anal canal",
    title: "Laser Piles Treatment",
    desc: "For suitable moderate or advanced cases, laser piles treatment offers a precise, minimally invasive approach. Depending on the condition and procedure, it may offer benefits such as minimal bleeding, same-day discharge and a faster return to routine activities.",
  },
  {
    img: IMAGES.clinicianWithModel,
    w: 700,
    h: 461,
    alt: "A clinician in a white coat holding an anatomical model of the anal canal and pointing to it with a pen",
    title: "Advanced Piles Surgery",
    desc: "For complex or advanced piles where conservative or minimally invasive treatments may not be suitable, surgical treatment may be recommended following a thorough specialist evaluation.",
  },
]

const GRID: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const CARD: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
}

export default function TreatmentOptions() {
  const reduced = useReducedMotion()

  return (
    <section id="treatments" className="border-b border-[var(--e-line)] bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="kicker justify-center">Treatment Options</p>
          <h2 className="mt-4">Our Piles Treatment Options</h2>
          <TitleUnderline className="mx-auto mt-3" />
          <p className="mt-2 text-[1.02rem] font-semibold text-[var(--e-green-deep)]">Advanced Care, Personalized to Your Condition</p>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            At Elite Minima, piles treatment begins with a detailed evaluation to understand the type, grade, severity and symptoms of your
            condition. Based on the diagnosis, our specialists recommend a personalized treatment plan focused on effective management, minimal
            intervention where appropriate, and a comfortable recovery.
          </p>
        </Reveal>

        <motion.div
          // Two-up only from lg. At sm the 160px image and the 2-col grid landed
          // together and crushed the copy to a 40px column; one card per row
          // below lg keeps it at 340px+.
          className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2"
          variants={GRID}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        >
          {OPTIONS.map((o, i) => (
            <OptionCard key={o.title} {...o} index={i} reduced={!!reduced} />
          ))}
        </motion.div>

        <CtaPanel reduced={!!reduced} />
      </div>
    </section>
  )
}

/* ── Option card ───────────────────────────────────────────────────────────
   Pointer-driven rather than scroll-driven, so this section reads differently
   from the journey timeline above it. The spotlight is written straight to
   motion values — it never re-renders React on pointer move.               */
function OptionCard({
  img,
  w,
  h,
  alt,
  title,
  desc,
  index,
  reduced,
}: {
  img: string
  w: number
  h: number
  alt: string
  title: string
  desc: string
  index: number
  reduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState(false)
  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, rgba(23,116,60,0.09), transparent 70%)`

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <motion.div variants={CARD}>
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={(e) => {
          onMove(e) // seed the spotlight so it doesn't fade in from off-card
          setHot(true) // touch taps light the card too — there is no hover there
        }}
        onPointerLeave={() => {
          setHot(false)
          mx.set(-9999)
          my.set(-9999)
        }}
        className="group relative h-full overflow-hidden rounded-[22px] border bg-white p-6 sm:p-7"
        initial={false}
        animate={{
          y: hot ? -6 : 0,
          borderColor: hot ? "#C8E4D3" : C.line,
          boxShadow: hot ? ELEV_HOT : ELEV_REST,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {/* cursor spotlight */}
        {!reduced && (
          <motion.span
            className="pointer-events-none absolute inset-0"
            style={{ background: spotlight }}
            animate={{ opacity: hot ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden
          />
        )}

        {/* sheen that sweeps the card once on enter */}
        {!reduced && (
          <motion.span
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-[rgba(23,116,60,0.07)] to-transparent"
            initial={false}
            animate={hot ? { x: ["0%", "460%"] } : { x: "0%" }}
            transition={{ duration: 0.9, ease: EASE }}
            aria-hidden
          />
        )}

        {/* index watermark */}
        <motion.span
          className="pointer-events-none absolute right-5 top-3 text-[3.25rem] font-extrabold leading-none tracking-tight text-[var(--e-ink)]"
          initial={false}
          animate={{ opacity: hot ? 0.07 : 0.035, y: hot ? 2 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Stacked on mobile: side-by-side at this image size leaves the copy a
            ~155px column, which wraps to four words a line and clips the
            intervention label. */}
        <div className="relative flex flex-col gap-4 sm:flex-row sm:gap-5">
          {/* The pulsing ring is a sibling, not a child: the frame clips its
              contents, which would swallow a ring that scales past its bounds. */}
          <div className="relative h-40 w-40 flex-none">
            <motion.div
              className="h-full w-full overflow-hidden rounded-2xl border bg-white"
              initial={false}
              animate={{
                borderColor: hot ? C.green : C.line,
                scale: hot ? 1.04 : 1,
              }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Image src={img} alt={alt} width={w} height={h} className="h-full w-full object-cover" />
            </motion.div>

            {hot && !reduced && (
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-2xl border border-[var(--e-green)]"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                aria-hidden
              />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-[1.05rem] leading-snug text-[var(--e-ink)]">{title}</h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--e-muted)]">{desc}</p>

            {/* where this option sits on the escalation scale the list follows */}
            <div className="mt-5 flex items-center gap-3">
              <span
                className="flex gap-1"
                role="img"
                aria-label={`Intervention level ${index + 1} of ${OPTIONS.length}`}
              >
                {OPTIONS.map((_, seg) => (
                  <motion.span
                    key={seg}
                    className="h-1 w-6 origin-left rounded-full"
                    style={{ backgroundColor: seg <= index ? C.green : C.line }}
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 + seg * 0.07, ease: EASE }}
                    aria-hidden
                  />
                ))}
              </span>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--e-muted)]">
                Intervention level
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}

/* ── Closing CTA ───────────────────────────────────────────────────────────
   Slow-drifting aurora behind the ink panel, plus the shared magnetic button. */
function CtaPanel({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="relative mt-12 flex flex-col items-center gap-4 overflow-hidden rounded-[24px] bg-[var(--e-ink)] px-6 py-10 text-center sm:px-10"
      initial={reduced ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {!reduced && (
        <>
          <motion.span
            className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[rgba(23,116,60,0.38)] blur-[70px]"
            animate={{ x: [0, 70, 0], y: [0, 34, 0], scale: [1, 1.16, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.span
            className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[rgba(201,162,39,0.18)] blur-[80px]"
            animate={{ x: [0, -60, 0], y: [0, -28, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-0 dot-tex opacity-[0.06]" aria-hidden />

      {/* Scrim over the aurora — the blobs drift, so text contrast has to be
          guaranteed at every frame, not just where they happen to sit. */}
      <div className="pointer-events-none absolute inset-0 bg-[rgba(14,22,38,0.45)]" aria-hidden />

      {/* Inline colour, not `text-white`: `.elite h3` in globals.css is a
          higher-specificity selector and would repaint this ink-on-ink. */}
      <h3 className="relative max-w-[36ch] text-[1.4rem] font-bold sm:text-[1.6rem]" style={{ color: "#ffffff" }}>
        Not Sure Which Piles Treatment Is Right for You?
      </h3>
      <p className="relative max-w-[52ch] text-[0.95rem] leading-relaxed text-white/85">
        Get evaluated by an Elite Minima specialist to understand your condition and explore the treatment options most appropriate for you.
      </p>
      <Magnetic className="relative mt-2">
        <a
          href="#book"
          onClick={() => track("book_click", { branch: "Elite Minima Clinic", section: "treatments" })}
          className="btn group bg-white text-[var(--e-ink)] hover:bg-white/90"
        >
          Book Your Consultation
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Magnetic>
    </motion.div>
  )
}

const ELEV_REST = "0 1px 2px rgba(14,22,38,0.03), 0 18px 36px -28px rgba(14,22,38,0.10)"
const ELEV_HOT = "0 2px 4px rgba(14,22,38,0.06), 0 30px 56px -26px rgba(14,22,38,0.28)"

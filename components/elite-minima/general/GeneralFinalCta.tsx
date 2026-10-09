"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"
import { track } from "../track"
import { EASE } from "../tokens"
import { PHONES } from "../config"

const BRANCH = "Elite Minima Clinic — General"

const PATHS = ["Piles Treatment", "Circumcision", "Gynecomastia"]

export default function GeneralFinalCta() {
  const reduced = useReducedMotion()

  return (
    <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
      <motion.div
        className="relative mx-auto flex w-full max-w-[1180px] flex-col items-center gap-4 overflow-hidden rounded-[28px] bg-[var(--e-ink)] px-6 py-12 text-center sm:px-10"
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
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
              className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[rgba(81,62,152,0.32)] blur-[80px]"
              animate={{ x: [0, -60, 0], y: [0, -28, 0], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          </>
        )}

        <div className="pointer-events-none absolute inset-0 dot-tex opacity-[0.06]" aria-hidden />
        {/* Scrim over the aurora — the blobs drift, so text contrast has to hold
            at every frame, not just where they happen to sit. */}
        <div className="pointer-events-none absolute inset-0 bg-[rgba(14,22,38,0.45)]" aria-hidden />

        {/* Inline colour, not `text-white`: `.elite h2` in globals.css is a
            higher-specificity selector and would repaint this ink-on-ink. */}
        <h2 className="relative max-w-[24ch]" style={{ color: "#ffffff" }}>
          Your Concern Deserves the Right Evaluation
        </h2>
        <p className="relative max-w-[62ch] text-[0.98rem] leading-relaxed text-white/85">
          Whether you&apos;re dealing with piles symptoms, foreskin concerns, or gynecomastia, start by understanding your condition and
          available treatment options.
        </p>
        <p className="relative mt-1 text-[1.05rem] font-bold" style={{ color: "#ffffff" }}>
          Book a Private Consultation at Elite-Minima
        </p>
        <p className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.85rem] font-medium text-white/70">
          {PATHS.map((p, i) => (
            <span key={p} className="inline-flex items-center gap-2.5">
              {i > 0 && <span className="text-[var(--e-purple-light)]">•</span>}
              {p}
            </span>
          ))}
        </p>

        <div className="relative mt-3 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <a
            href="#book"
            onClick={() => track("book_click", { branch: BRANCH, section: "final-cta" })}
            className="btn group/btn w-full bg-white text-[var(--e-ink)] hover:bg-white/90 sm:w-auto"
          >
            Book Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </a>
          {PHONES.map((p) => (
            <a
              key={p.tel}
              href={`tel:${p.tel}`}
              onClick={() => track("call_click", { branch: BRANCH, section: "final-cta" })}
              className="btn w-full border-white/40 text-white hover:border-white hover:bg-white/10 sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Call {p.display}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

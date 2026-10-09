"use client"

import { type ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { MapPin, Phone, Clock } from "lucide-react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"
import { track } from "./track"
import { EASE } from "./tokens"
import { ADDRESS_FULL, MAP_QUERY, PHONES } from "./config"

/* Viewfinder brackets — top corners only. The bottom of a Google embed is
   occupied by attribution and the zoom/fullscreen controls. */
const CORNERS = ["left-4 top-4 border-l-2 border-t-2", "right-4 top-4 border-r-2 border-t-2"]

const VIEW = { once: true, margin: "-10% 0px" } as const

const ROWS: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } } }
const ROW: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}

const CHIP =
  "relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[var(--e-green-soft)] text-[var(--e-green-deep)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--e-green)] group-hover:text-white"

export default function MapSection() {
  const reduced = useReducedMotion()

  return (
    <section id="visit" className="border-b border-[var(--e-line)] bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <p className="kicker justify-center">Find Us</p>
          <h2 className="mt-4">Visit Elite Minima</h2>
          <TitleUnderline className="mx-auto mt-3" />
        </Reveal>

        <motion.div
          className="relative mt-10 overflow-hidden rounded-[24px] border border-[var(--e-line)]"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* map + its overlays, scoped so the scan pass can't run over the
              detail row below it */}
          <div className="relative">
            {/* iris wipe — the map is uncovered rather than faded in */}
            <motion.div
              initial={reduced ? false : { clipPath: "inset(12% 12% 12% 12%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={VIEW}
              transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
            >
              <iframe
                title="Elite Minima clinic location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                className="block h-[360px] w-full sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

            {/* single brand-green scan pass over the revealed map */}
            {!reduced && (
              <motion.span
                className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(to_bottom,rgba(23,116,60,0)_0%,rgba(23,116,60,0.5)_1.6%,rgba(23,116,60,0)_5%)]"
                initial={{ y: "-100%" }}
                whileInView={{ y: "100%" }}
                viewport={VIEW}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.25 }}
                aria-hidden
              />
            )}

            {CORNERS.map((c, i) => (
              <motion.span
                key={c}
                className={`pointer-events-none absolute h-7 w-7 rounded-[6px] border-[var(--e-green)] ${c}`}
                initial={reduced ? false : { opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.7, scale: 1 }}
                viewport={VIEW}
                transition={{ duration: 0.55, ease: EASE, delay: 0.75 + i * 0.1 }}
                aria-hidden
              />
            ))}
          </div>

          <motion.div
            className="grid grid-cols-1 divide-y divide-[var(--e-line)] border-t border-[var(--e-line)] bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            variants={ROWS}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={VIEW}
          >
            <Cell icon={Phone} label="Phone" reduced={!!reduced}>
              {PHONES.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  onClick={() => track("call_click", { branch: "Elite Minima Clinic", section: "map" })}
                  className="block text-[0.95rem] font-semibold leading-relaxed text-[var(--e-ink)] transition-colors duration-200 hover:text-[var(--e-green-deep)]"
                >
                  {p.display}
                </a>
              ))}
            </Cell>

            <Cell icon={MapPin} label="Address" reduced={!!reduced}>
              <p className="max-w-[30ch] text-[0.88rem] leading-relaxed text-[var(--e-ink-soft)]">{ADDRESS_FULL}</p>
            </Cell>

            {/* Opening hours are not published on the site any more — the cell
                says how to be seen instead of when the door is open. */}
            <Cell icon={Clock} label="Consultations" reduced={!!reduced}>
              <p className="text-[0.88rem] leading-relaxed text-[var(--e-ink-soft)]">By appointment</p>
            </Cell>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* One detail column: chip stacked over a label and its value, centred. Cells
   are top-aligned so the three chips sit on one line no matter how many lines
   the address wraps to. */
function Cell({
  icon: Icon,
  label,
  children,
  offset = 0,
  reduced,
}: {
  icon: typeof MapPin
  label: string
  children: ReactNode
  /** phase-shifts this chip's beacon so the three never pulse in unison */
  offset?: number
  reduced: boolean
}) {
  return (
    <motion.div variants={ROW} className="group flex flex-col items-center px-6 py-8 text-center sm:px-5">
      <span className={CHIP}>
        {!reduced &&
          [0, 1].map((r) => (
            <motion.span
              key={r}
              className="absolute inset-0 rounded-full border border-[var(--e-green)]"
              initial={{ opacity: 0.45, scale: 1 }}
              animate={{ opacity: 0, scale: 1.85 }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: r * 1.3 + offset }}
              aria-hidden
            />
          ))}
        <Icon className="relative h-5 w-5" />
      </span>

      <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--e-muted)]">{label}</span>
      {/* column, so a cell holding more than one value (the two phone lines)
          stacks instead of running them together on one row */}
      <div className="mt-1.5 flex flex-col items-center gap-1">{children}</div>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Info } from "lucide-react"
import { Reveal } from "../motion"
import { track } from "../track"
import { EASE } from "../tokens"
import { GYN_BRANCH, OPTIONS, OPTIONS_NOTE } from "./content"

/**
 * Treatment options as a spec sheet: the four approaches listed down one
 * column, the selected one shown in full beside it.
 *
 * Not the other pages' card grid or tab strip. Gynecomastia is one condition
 * with four routes through it, and what a reader needs is a comparison — the
 * list keeps all four in view while one is being read, which a grid of equal
 * cards and a tabbed panel both fail to do.
 *
 * On phones the panel drops under the list, so the same component is an
 * accordion without a second implementation.
 */
export default function GynOptions() {
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useState(OPTIONS[0].id)
  const active = OPTIONS.find((o) => o.id === activeId) ?? OPTIONS[0]

  return (
    <section id="treatment" className="bg-[var(--g-bone)] text-[var(--g-ink)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        <Reveal className="max-w-[54ch]">
          <p className="g-eyebrow g-eyebrow--ink">Treatment Options</p>
          <h2 className="mt-5">Gynecomastia Treatment Options</h2>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-[var(--g-ink-dim)]">
            Which approach suits you depends on what the enlargement is made of fat, glandular tissue, or both.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-px border border-[var(--g-bone-line)] bg-[var(--g-bone-line)] sm:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* ── The list ─────────────────────────────────────────────── */}
          <div className="bg-[var(--g-bone)]">
            <ul>
              {OPTIONS.map((o, i) => {
                const on = o.id === active.id
                return (
                  <li key={o.id} className="border-b border-[var(--g-bone-line)] last:border-b-0">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setActiveId(o.id)
                        track("treatment_option", { branch: GYN_BRANCH, option: o.name })
                      }}
                      className={`flex w-full items-start gap-5 px-6 py-6 text-left transition-colors duration-300 sm:px-8 ${
                        on ? "bg-[var(--g-ink)] text-[var(--g-bone)]" : "hover:bg-[var(--g-bone-2)]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`g-numeral flex-none text-[1.9rem] leading-none ${
                          on ? "[-webkit-text-stroke-color:var(--g-accent)]" : "g-numeral--ink"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="min-w-0">
                        <span
                          className={`block text-[0.64rem] font-bold uppercase tracking-[0.22em] ${
                            on ? "text-[var(--g-accent)]" : "text-[var(--g-ink-dim)]"
                          }`}
                        >
                          {o.category}
                        </span>
                        <span className={`g-display mt-2 block text-[1.15rem] leading-tight ${on ? "text-[var(--g-bone)]" : "text-[var(--g-ink)]"}`}>
                          {o.name}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── The panel ────────────────────────────────────────────── */}
          <div className="bg-[var(--g-bone)]">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                key={active.id}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                className="flex h-full flex-col"
              >
                {/* Split frame, two up, on every option — the columns are fixed
                    rather than derived from the array so the panel cannot
                    change shape as the selection moves down the list. The
                    tuple in content.ts guarantees there are exactly two. */}
                <div className="grid grid-cols-2 gap-px bg-[var(--g-bone-line)]">
                  {active.images.map((img, i) => (
                    <div key={`${active.id}-${i}`} className="relative aspect-[4/3] bg-[var(--g-bone-2)]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 20vw, 50vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <h3 className="text-[var(--g-ink)]">{active.name}</h3>
                  <p className="mt-4 max-w-[56ch] text-[0.98rem] leading-relaxed text-[var(--g-ink-dim)]">{active.desc}</p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <Reveal className="mt-6 flex items-start gap-3 text-[0.85rem] leading-relaxed text-[var(--g-ink-dim)]">
          <Info className="mt-0.5 h-4 w-4 flex-none text-[var(--g-accent-deep)]" aria-hidden />
          {OPTIONS_NOTE}
        </Reveal>
      </div>
    </section>
  )
}

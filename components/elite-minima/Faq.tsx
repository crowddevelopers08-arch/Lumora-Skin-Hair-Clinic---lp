"use client"

import { useState } from "react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"

const FAQS = [
  {
    q: "What is the best treatment for piles?",
    a: "The appropriate piles treatment depends on the type, grade, symptoms and individual condition. Early-stage cases may respond to conservative management, while persistent or advanced piles may require minimally invasive or laser treatment.",
  },
  {
    q: "Can piles be treated without surgery?",
    a: "Yes, some early-stage cases can be managed using medication, stool softeners, dietary changes, hydration and lifestyle modification. A clinical assessment determines whether non-surgical piles treatment is suitable.",
  },
  {
    q: "Is laser treatment available for piles?",
    a: "Yes. Laser piles treatment may be recommended for suitable patients depending on the grade and nature of the condition.",
  },
  {
    q: "Is laser piles treatment painful?",
    a: "Laser treatment is minimally invasive, but the treatment experience and discomfort vary between patients and procedures. Your doctor can explain anesthesia, recovery and pain-management expectations before treatment.",
  },
  {
    q: "How long does recovery take after laser piles treatment?",
    a: "Recovery varies between patients. Elite Minima's existing treatment information notes that many suitable patients can resume normal activities within approximately 24–48 hours, subject to their doctor's advice.",
  },
  {
    q: "How much does piles laser treatment cost in Chennai?",
    a: "The piles laser treatment cost varies based on the grade of piles, diagnostic requirements and procedure selected. An evaluation is required for an individualized cost estimate.",
  },
  {
    q: "Which doctor should I consult for piles?",
    a: "A surgeon or proctology specialist experienced in diagnosing and treating anorectal conditions can evaluate piles and recommend appropriate treatment.",
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b border-[var(--e-line)] bg-[var(--e-canvas)] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 px-5 sm:px-8 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <Reveal className="lg:sticky lg:top-28">
          <p className="kicker">FAQ</p>
          <h2 className="mt-4">Frequently Asked Questions</h2>
          <TitleUnderline className="mt-3" />
        </Reveal>

        <Reveal index={1} className="rounded-[24px] border border-[var(--e-line)] bg-white">
          <div className="divide-y divide-[var(--e-line-soft)]">
            {FAQS.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-[1rem] font-semibold transition-colors ${isOpen ? "text-[var(--e-green-deep)]" : "text-[var(--e-ink)]"}`}>
                      {f.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border text-[1.1rem] transition-all duration-300 ${
                        isOpen ? "rotate-45 border-[var(--e-green)] bg-[var(--e-green)] text-white" : "border-[var(--e-line)] text-[var(--e-green-deep)]"
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 pr-12 text-[0.94rem] leading-relaxed text-[var(--e-muted)]">{f.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

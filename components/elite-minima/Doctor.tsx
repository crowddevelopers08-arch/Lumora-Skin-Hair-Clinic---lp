"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"
import { track } from "./track"
import { ADDRESS_SHORT, DOCTOR, IMAGES } from "./config"

const EXPERTISE = ["Piles Treatment", "Laser Piles Treatment", "Fissure Treatment", "Fistula Treatment", "Minimally Invasive Procedures"]

export default function Doctor() {
  return (
    <section id="doctor" className="border-b border-[var(--e-line)] bg-[var(--e-canvas)] py-10 sm:py-12 lg:py-14">
      {/* Heading and body are separate children so the portrait can sit between
          them on mobile. At lg they are placed back into one column via explicit
          rows, with the portrait spanning both alongside. */}
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-5 sm:px-8 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-x-16 lg:gap-y-0">
        <Reveal className="min-w-0 lg:col-start-2 lg:row-start-1">
          <p className="kicker">Meet Your Specialist</p>
          <h2 className="mt-4">Expert Care for Piles &amp; Proctology Conditions</h2>
          <TitleUnderline className="mt-3" />
        </Reveal>

        {/* portrait — object-top so the 2:3 source loses its crop from the shirt
            rather than the top of the head when it fills this 4:5 frame */}
        <Reveal index={1} className="mx-auto w-full max-w-[360px] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-[var(--e-line)] bg-white">
            <Image
              src={IMAGES.doctor}
              alt={`${DOCTOR.name}, ${DOCTOR.title}`}
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        <Reveal index={2} className="min-w-0 lg:col-start-2 lg:row-start-2">
          {/* no base margin — the flex gap spaces this off the portrait on mobile;
              at lg the row gap is 0 so it needs its own offset from the underline */}
          <p className="max-w-[60ch] text-[0.98rem] leading-relaxed text-[var(--e-muted)] lg:mt-4">
            At Elite Minima – The Surgical Speciality Clinic, our specialists provide personalized evaluation and advanced treatment for piles,
            fissures, fistulas and other proctology conditions, with both non-surgical and minimally invasive treatment options.
          </p>

          <div className="mt-7 rounded-[20px] border border-[var(--e-line)] bg-white p-6">
            <h3 className="text-[1.15rem] text-[var(--e-ink)]">{DOCTOR.name}</h3>
            <p className="mt-1 text-[0.9rem] font-semibold text-[var(--e-green-deep)]">{DOCTOR.title}</p>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-[var(--e-muted)]">{DOCTOR.qualifications}</p>
            <p className="mt-3 border-t border-[var(--e-line-soft)] pt-3 text-[0.88rem] leading-relaxed text-[var(--e-ink-soft)]">
              {DOCTOR.highlight}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {EXPERTISE.map((e) => (
                <span
                  key={e}
                  className="inline-flex items-center rounded-full border border-[var(--e-line)] bg-[var(--e-canvas)] px-3 py-1.5 text-[0.78rem] font-medium text-[var(--e-ink-soft)]"
                >
                  {e}
                </span>
              ))}
            </div>

            <a
              href="#book"
              onClick={() => track("book_click", { branch: "Elite Minima Clinic", section: "doctor" })}
              className="btn btn-primary group/btn mt-6"
            >
              Book a Consultation with the Doctor
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </a>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.85rem] font-medium text-[var(--e-muted)]">
            <span>Personalized Care</span>
            <span className="text-[var(--e-green)]">•</span>
            <span>Advanced Treatment</span>
            <span className="text-[var(--e-green)]">•</span>
            <span>{ADDRESS_SHORT}</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import { ShieldCheck, Stethoscope, Award } from "lucide-react"
import CountUp from "./CountUp"
import TitleUnderline from "./TitleUnderline"
import { HERO_IMAGE } from "./config"
import LeadForm from "./LeadForm"

const STATS = [
  { icon: Stethoscope, value: 4000, suffix: "+", label: "Surgeries performed" },
  { icon: Award, value: 12, suffix: "+", label: "Years of experience" },
  { icon: ShieldCheck, value: null, label: "Safe & Secure care" },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--e-canvas)]">
      <div className="mx-auto grid w-full max-w-[1350px] gap-5 px-5 py-4 sm:px-8 sm:py-5 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-8 lg:py-4">
        <div className="min-w-0 self-center">
          <div className="rise d2">
            <h1 className="text-[clamp(1.8rem,1.15rem+2.4vw,2.9rem)] font-extrabold leading-none tracking-tight text-[var(--e-ink)] lg:whitespace-nowrap">
              Advanced Piles Treatment
            </h1>
            <TitleUnderline className="mt-3" />

            {/* wraps below sm — as a single nowrap row this was clipped on every
                phone width. The spans keep their own phrases intact. */}
            <p className="mt-3 flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[clamp(0.72rem,0.58rem+0.5vw,0.98rem)] leading-relaxed text-[var(--e-muted)] [&>span]:whitespace-nowrap">
              <span>Laser &amp; Minimally Invasive Care</span>
              <span className="text-[var(--e-green)]">•</span>
              <span>Personalized Treatment</span>
              <span className="text-[var(--e-green)]">•</span>
              <span>Specialist Consultation</span>
            </p>
          </div>

          {/* The frame keeps the video slot's fixed heights so the column stays
              balanced against the booking form. The source is 16:9 and the box is
              wider than that at lg, so object-cover trims top and bottom — the
              model sits centred, which is what survives the crop. */}
          <div className="rise d4 mt-4 overflow-hidden rounded-[24px] border border-[var(--e-line)] bg-[var(--e-line-soft)] shadow-[0_18px_60px_-30px_rgba(14,22,38,0.42)]">
            <div className="relative h-[220px] w-full sm:h-[290px] lg:h-[355px]">
              <Image
                src={HERO_IMAGE}
                alt="A clinician holding an anatomical cross-section model of the anal canal showing hemorrhoids"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Four columns on mobile with each card spanning two, so the odd third
              card can start at column 2 and sit centred under the other two.
              A plain 2-col grid can only left-align or full-width it. */}
          <div className="rise d5 mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {STATS.map(({ icon: Icon, value, suffix, label }, i) => (
              <div
                key={label}
                className={`card col-span-2 flex items-center gap-2.5 p-3 sm:col-span-1 sm:col-start-auto sm:gap-3 sm:p-4 ${
                  i === STATS.length - 1 ? "col-start-2" : ""
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--e-green-soft)] text-[var(--e-green-deep)] sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </span>
                <div className="min-w-0">
                  {value !== null ? (
                    <p className="text-[1.05rem] font-extrabold leading-none text-[var(--e-ink)] sm:text-[1.3rem]">
                      <CountUp end={value} suffix={suffix} />
                    </p>
                  ) : (
                    <p className="text-[0.95rem] font-extrabold leading-none text-[var(--e-ink)] sm:text-[1.15rem]">Safe &amp; Secure</p>
                  )}
                  <p className="mt-1 text-[0.68rem] leading-tight text-[var(--e-muted)] sm:text-[0.72rem]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="book" className="lg:self-center">
          <LeadForm compact />
        </div>
      </div>
    </section>
  )
}

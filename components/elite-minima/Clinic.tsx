"use client"

import { Cpu, Stethoscope, Activity, UserCheck, ArrowRight } from "lucide-react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"
import { track } from "./track"

const FEATURES = [
  { icon: Cpu, label: "Advanced Technology" },
  { icon: Stethoscope, label: "Specialist Care" },
  { icon: Activity, label: "Minimally Invasive Treatments" },
  { icon: UserCheck, label: "Personalized Approach" },
]

export default function Clinic() {
  return (
    <section id="clinic" className="border-b border-[var(--e-line)] bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <p className="kicker">About Elite Minima</p>
          <h2 className="mt-4">Advanced Surgical Care. Personalized for You.</h2>
          <TitleUnderline className="mt-3" />
          <p className="mt-4 max-w-[58ch] text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            Elite Minima – The Surgical Speciality Clinic in Anna Nagar provides specialized care for piles, fissures, fistulas and other
            proctology conditions.
          </p>
          <p className="mt-3 max-w-[58ch] text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
            With advanced diagnostic and minimally invasive treatment options, our focus is on accurate diagnosis, personalized treatment and
            supportive recovery care for every patient.
          </p>
          <a
            href="#book"
            onClick={() => track("book_click", { branch: "Elite Minima Clinic", section: "clinic" })}
            className="btn btn-primary group/btn mt-7"
          >
            Book Your Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </a>
        </Reveal>

        <Reveal index={1} className="grid grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="card flex flex-col items-start gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--e-green-soft)] text-[var(--e-green-deep)]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-[0.92rem] font-semibold leading-snug text-[var(--e-ink)]">{label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

"use client"

import { useRef, useState } from "react"
import { motion, useAnimationFrame, useMotionValue, useTransform, useReducedMotion } from "framer-motion"
import { ShieldCheck, Sparkles, Stethoscope, HeartPulse } from "lucide-react"
import { C } from "../tokens"

/* Four claims rather than the piles page's three — this page speaks for the
   whole speciality clinic, not one condition. */
const ITEMS = [
  { icon: ShieldCheck, label: "Advanced Surgical Care" },
  { icon: Sparkles, label: "Minimally Invasive Options" },
  { icon: Stethoscope, label: "Specialist Consultation" },
  { icon: HeartPulse, label: "Personalized Treatment" },
] as const

/** Percent of the doubled track travelled per second. */
const SPEED = 1.8

export default function GeneralRunningBar() {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  pausedRef.current = paused

  // Track is rendered twice; wrapping at -50% makes the loop seamless.
  const x = useMotionValue(0)
  const xPct = useTransform(x, (v) => `${v}%`)

  useAnimationFrame((_, delta) => {
    if (reduced || pausedRef.current) return
    let next = x.get() - (delta / 1000) * SPEED
    if (next <= -50) next += 50
    x.set(next)
  })

  return (
    <div
      className="relative z-50 overflow-hidden"
      style={{
        background: `linear-gradient(90deg, ${C.greenInk} 0%, ${C.greenDeep} 42%, ${C.purpleDeep} 100%)`,
        borderBottom: `1px solid ${C.purpleLight}33`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{ background: `radial-gradient(60% 140% at 50% 0%, ${C.purpleLight} 0%, transparent 70%)` }}
      />

      {reduced ? (
        <ul className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-1 px-5 py-2.5">
          {ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.09em] text-white/90">
              <Icon className="h-3.5 w-3.5" style={{ color: C.purpleLight }} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="relative py-2.5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          style={{
            maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)",
            WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)",
          }}
        >
          <motion.div style={{ x: xPct, willChange: "transform" }} className="flex w-max">
            <Track />
            <Track aria-hidden />
          </motion.div>
        </div>
      )}
    </div>
  )
}

function Track({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean }) {
  return (
    <ul aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {Array.from({ length: 3 }).flatMap((_, rep) =>
        ITEMS.map(({ icon: Icon, label }) => (
          <li key={`${rep}-${label}`} className="inline-flex shrink-0 items-center gap-2.5 px-5 sm:px-7">
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: C.purpleLight }} aria-hidden />
            <span className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/90 sm:text-[0.74rem]">
              {label}
            </span>
            <span aria-hidden className="ml-3 h-1 w-1 shrink-0 rounded-full" style={{ background: C.purpleLight }} />
          </li>
        )),
      )}
    </ul>
  )
}

"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { C } from "./tokens"

/**
 * Hairline reading-progress bar pinned to the very top of the viewport.
 *
 * Animates `scaleX` only (compositor-only, never triggers layout), and is
 * purely decorative — hidden from assistive tech.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        background: `linear-gradient(90deg, ${C.greenDeep}, ${C.green} 55%, ${C.purple})`,
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px]"
    />
  )
}

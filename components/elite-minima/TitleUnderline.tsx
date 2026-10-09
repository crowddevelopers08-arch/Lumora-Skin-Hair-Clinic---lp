"use client"

import { useId } from "react"

/**
 * Hand-drawn stroke that sits under a section heading.
 *
 * The path, cap and `preserveAspectRatio="none"` are verbatim from the
 * supplied markup — the "none" is what lets one 288-unit path stretch to any
 * heading width without the curve getting taller.
 *
 * Departures from the snippet:
 *  - the 2u uniform stroke is now a filled outline of the same curve, 4u at
 *    the centre easing to 2.1u at the tips. The viewBox is padded 1u top and
 *    bottom to fit it (the original height of 6 hugged the 2u stroke exactly).
 *  - the gradient it pointed at (`#paint_culture`) wasn't included, so one is
 *    defined here in brand green;
 *  - the id is per-instance via useId, since a fixed id would collide once
 *    more than one heading is on the page.
 */
/**
 * `maxWidth` caps the stroke's drawn length in px. It rides on an inline style
 * rather than a utility class because callers pass `className` through, and two
 * competing width utilities resolve by stylesheet order, not attribute order —
 * the override would win or lose at random.
 */
export default function TitleUnderline({ className = "", maxWidth = 288 }: { className?: string; maxWidth?: number }) {
  const gradientId = `title-underline-${useId()}`

  return (
    <svg
      style={{ width: `min(${maxWidth}px, 100%)` }}
      className={`title-underline block h-[8px] ${className}`}
      width="288"
      height="8"
      viewBox="0 -1 288 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Outline of the original curve, offset by a half-width that eases from
          1.05u at each tip to 2u at the centre. A plain stroke can't vary its
          width along a path, so the taper has to be baked into geometry. */}
      <path
        d="M1.1 6.05L3.46 5.88L5.98 5.72L8.65 5.57L11.47 5.42L14.44 5.27L17.55 5.12L20.81 4.98L24.2 4.84L27.73 4.71L31.39 4.58L35.17 4.45L39.08 4.33L43.12 4.21L47.27 4.1L51.54 3.99L55.92 3.89L60.4 3.79L65 3.69L69.7 3.6L74.49 3.52L79.39 3.44L84.38 3.36L89.45 3.3L94.62 3.23L99.87 3.18L105.2 3.13L110.6 3.09L116.08 3.05L121.64 3.02L127.26 3L132.94 2.99L138.69 2.98L144.49 2.98L150.36 2.99L156.27 3.01L162.23 3.04L168.24 3.08L174.29 3.13L180.38 3.18L186.51 3.25L192.67 3.33L198.86 3.42L205.08 3.52L211.32 3.63L217.59 3.76L223.87 3.9L230.16 4.05L236.47 4.21L242.78 4.39L249.1 4.58L255.42 4.78L261.74 5.01L268.06 5.24L274.36 5.49L280.66 5.76L286.94 6.05A1.05 1.05 0 0 1 287.06 3.95L280.78 3.56L274.48 3.18L268.17 2.83L261.85 2.49L255.53 2.16L249.21 1.85L242.89 1.56L236.57 1.29L230.26 1.03L223.96 0.79L217.68 0.56L211.41 0.35L205.16 0.15L198.94 -0.02L192.74 -0.19L186.57 -0.33L180.44 -0.47L174.34 -0.58L168.28 -0.68L162.27 -0.77L156.3 -0.84L150.38 -0.9L144.51 -0.94L138.7 -0.97L132.94 -0.99L127.25 -0.99L121.62 -0.97L116.06 -0.95L110.57 -0.91L105.16 -0.86L99.82 -0.79L94.56 -0.72L89.39 -0.63L84.31 -0.53L79.31 -0.42L74.41 -0.29L69.61 -0.16L64.9 -0.02L60.3 0.14L55.81 0.3L51.42 0.48L47.15 0.66L42.99 0.85L38.95 1.05L35.03 1.26L31.24 1.47L27.58 1.69L24.05 1.92L20.65 2.16L17.39 2.4L14.27 2.65L11.3 2.9L8.47 3.16L5.79 3.42L3.27 3.69L0.9 3.95A1.05 1.05 0 0 1 1.1 6.05Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        {/* fully opaque at both ends — a taper leaves the tips looking blurred */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="288" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--e-green-deep)" />
          <stop offset="0.5" stopColor="var(--e-green)" />
          <stop offset="1" stopColor="var(--e-green-deep)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

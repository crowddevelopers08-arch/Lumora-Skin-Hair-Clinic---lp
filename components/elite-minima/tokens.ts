// Design tokens for the Elite Minima landing page.
//
// Styling is inline-Tailwind only — there is no custom CSS layer — so these
// constants are the single source of truth for values that repeat across
// sections. Import them rather than retyping hex codes.

/* ── Palette ──────────────────────────────────────────────────────────────
   Sampled directly from the Elite Minima logo: the forest green of the
   "ELITE - MINIMA" wordmark, the royal purple of the EM monogram and
   tagline, and the slate navy of the monogram's left stroke.

   Green and purple both clear WCAG AA as text on white, so either may
   carry copy. The -light and -soft tints are decorative only: fills,
   hairlines, icon chips. Never body copy.                                 */
export const C = {
  greenInk: "#08381C",
  greenDeep: "#0F5A2D", // 8.3:1 on white
  green: "#17743C", // 5.9:1 on white — the wordmark colour
  greenSoft: "#E7F4EC",
  greenLine: "#C8E4D3",

  purpleDeep: "#3A2B72",
  purple: "#513E98", // 8.4:1 on white — the monogram colour
  purpleSoft: "#F0ECFA",
  purpleLine: "#D9CFF2",
  purpleLight: "#B9A7E8", // for dark surfaces only

  slate: "#394B79", // the monogram's cool half

  canvas: "#F8F7FB", // faintest lavender, from the logo's ribbon wash
  paper: "#FFFFFF",

  ink: "#0E1626",
  inkSoft: "#23304A",
  muted: "#5A6478", // 5.9:1 on white — AA body text
  line: "#E5E7EF",
  lineSoft: "#EFF0F6",

  success: "#17743C",
} as const

/* ── Surface washes ───────────────────────────────────────────────────────
   Very light tints of the brand inks, for cards that need to lift off a white
   section without introducing a new hue. Body copy at C.muted clears 5.3:1 on
   all three, so these are safe under text.                                  */
export const WASH = {
  green: "#F1F8F3",
  purple: "#F4F1FB",
  slate: "#F2F4F9",
} as const

/* ── Fluid type scale ─────────────────────────────────────────────────────
   One continuous clamp() curve from 360px → 1920px, so there are no jarring
   size jumps at breakpoints.                                               */
export const T = {
  display: "clamp(2.15rem,1.15rem+4.4vw,4.75rem)",
  h2: "clamp(1.8rem,1.15rem+2.4vw,3.25rem)",
  h3: "clamp(1.15rem,1rem+0.7vw,1.6rem)",
  bodyLg: "clamp(1rem,0.96rem+0.22vw,1.15rem)",
  body: "clamp(0.94rem,0.92rem+0.12vw,1.02rem)",
  small: "0.85rem",
  eyebrow: "0.7rem",
} as const

/* Section vertical rhythm — luxurious on desktop, tightened on mobile so the
   page doesn't feel like scrolling through empty space on a 390px screen. */
export const SECTION_Y = "clamp(4.5rem,9vw,11.25rem)"

/* Shell width + gutters, shared by every section for a consistent spine. */
export const SHELL = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10"

/* Two-layer elevation: a tight contact shadow plus a wide diffuse one.
   A single blurry drop shadow is the tell of an amateur design. */
export const ELEV = {
  card: "0 1px 2px rgba(14,22,38,0.04), 0 12px 28px -12px rgba(14,22,38,0.12)",
  cardHover: "0 2px 4px rgba(14,22,38,0.06), 0 28px 56px -20px rgba(14,22,38,0.22)",
  float: "0 2px 6px rgba(14,22,38,0.06), 0 32px 64px -24px rgba(23,116,60,0.28)",
} as const

/* Shared easing — a soft, expensive-feeling deceleration. */
export const EASE = [0.16, 1, 0.3, 1] as const

// Copy for the gynecomastia landing page at /gynecomastia.
//
// Same split as the general page: clinic-level facts (phones, address, map,
// image URLs) stay in ../config.ts and are imported by the sections directly.
// Everything below is this page's own editorial content, kept out of the
// components so a copy edit never means touching layout.

import { cldTransform, IMAGES } from "../config"

/** Branch tag on every lead, analytics event and CRM row from this page, so
    gynecomastia traffic is separable from / and /general. */
export const GYN_BRANCH = "Elite Minima Clinic — Gynecomastia"

export { PHONE_DISPLAY as GYN_PHONE_DISPLAY, PHONE_TEL as GYN_PHONE_TEL } from "../config"

/* ── Hero ────────────────────────────────────────────────────────────────── */

export const HERO = {
  title: "Gynecomastia Breast Reduction Surgery",
  lead: "Enlarged or puffy male breasts can happen due to excess fat, glandular tissue, hormonal factors, or a combination of causes. Get evaluated by a specialist and understand the right treatment approach for your chest.",
  primaryCta: "Book Your Consultation",
  secondaryCta: "Talk to Our Team",
} as const

export interface GynHeroSlide {
  src: string
  alt: string
  /** Label in the frame's bottom-left chip while this slide is showing. */
  caption: string
}

/**
 * Hero media.
 *
 * `video` is the file the frame plays. Leave it empty and `slides` are shown
 * instead — that is the current state, since the clinic has not supplied a
 * chest-contouring film yet. Drop a URL in and the same frame becomes a real
 * player with no other change; the first slide doubles as its poster.
 *
 * Two or more slides turn the frame into a cross-fading carousel. One slide is
 * a plain still — no controls are drawn and no timer runs — so removing the
 * animation later means deleting an entry, not editing GynHero.
 */
export const HERO_MEDIA: { video: string; slides: GynHeroSlide[] } = {
  video: "",
  slides: [
    {
      src: IMAGES.chestContouring,
      alt: "Advanced male chest contouring — gynecomastia correction at Elite-Minima",
      caption: "Chest contouring",
    },
    {
      src: IMAGES.surgicalTeam,
      alt: "The Elite-Minima surgical team in theatre",
      caption: "Our surgical team",
    },
  ],
}

/** Named under the hero media, so the face on the page is the surgeon's.
 *
 *  The portrait is a 1536px studio shot and the plate draws it at 56px. Served
 *  raw it is downscaled by the browser in a single step — visibly soft — and
 *  cropped square from the top, which frames a forehead. Cloudinary does the
 *  resize instead, at 2× for retina, with the crop held on the face. */
export const HERO_SURGEON = {
  name: "Dr. Madan K",
  title: "Aesthetic, Plastic & Reconstructive Surgeon",
  photo: cldTransform(IMAGES.drMadan, "c_fill,g_face,w_224,h_224,q_auto"),
} as const

export const HERO_CONCERNS = [
  "Puffy or enlarged chest",
  "Protruding nipples",
  "Excess chest fat",
  "Firm glandular tissue",
  "Uneven chest appearance",
  "Chest tenderness or discomfort",
] as const

/* ── Patient reviews ─────────────────────────────────────────────────────── */

export const REVIEWS_INTRO = {
  title: "Real Patients. Real Experiences.",
  body: "Choosing gynecomastia treatment can be a personal decision. Hear from patients about their consultation, procedure, recovery, and overall experience at Elite-Minima.",
} as const

export interface GynReview {
  quote: string
  name: string
  place: string
  /** What they were treated for — the chip above the quote. */
  tag: string
}

export const REVIEWS: GynReview[] = [
  {
    quote:
      "I had been putting this off for years because I did not know who to ask. The consultation was private and straightforward the doctor explained what was causing it and what the procedure would involve before anything was decided.",
    name: "Pradeep M",
    place: "Mogappair",
    tag: "Liposuction + Gland Excision",
  },
  {
    quote:
      "What helped most was being told clearly which part of it was fat and which part was gland. The plan made sense after that, and the follow-up visits were properly scheduled rather than left to me to chase.",
    name: "Arun V",
    place: "Anna Nagar",
    tag: "Gland Excision",
  },
  {
    quote:
      "Recovery was explained in detail the compression garment, what I could lift and when, and when I could get back to the gym. Knowing the timeline in advance took most of the anxiety out of it.",
    name: "Sathish K",
    place: "Kilpauk",
    tag: "Liposuction",
  },
  {
    quote:
      "I went in expecting to be pushed into surgery on day one. Instead I was evaluated first and the options were laid out with what each one could and could not change. That is why I went ahead here.",
    name: "Vignesh R",
    place: "Thirumangalam",
    tag: "Specialist Consultation",
  },
]

/** Aggregate shown beside the reviews. Figures the clinic already claims on
    the other two pages — nothing new is invented here. */
export const REVIEW_PROOF = [
  { value: 4000, suffix: "+", label: "Surgeries performed" },
  { value: 12, suffix: "+", label: "Years of experience" },
] as const

/* ── Treatment journey ───────────────────────────────────────────────────── */

export interface JourneyStep {
  n: string
  title: string
  desc: string
}

export const JOURNEY: JourneyStep[] = [
  {
    n: "01",
    title: "Specialist Consultation",
    desc: "Meet Dr. Madan K for a detailed assessment of your chest, medical history, concerns, and desired outcome.",
  },
  {
    // The three causes were a nested list with a caveat under it, which made
    // this the one cell in the row that looked like a different component.
    // They read the same as prose, and the row now scans as five equal steps.
    n: "02",
    title: "Chest Evaluation",
    desc: "The doctor evaluates whether the enlargement is caused primarily by excess fat (pseudogynecomastia), glandular tissue (true gynecomastia), or a combination of both. Imaging, blood work, or hormone testing may be advised when clinically appropriate.",
  },
  {
    n: "03",
    title: "Personalized Treatment Plan",
    desc: "Based on your chest anatomy and severity, your surgeon recommends the most suitable approach.",
  },
  {
    n: "04",
    title: "Gynecomastia Correction",
    desc: "The procedure is planned to remove excess tissue and create a flatter, more proportionate masculine chest contour.",
  },
  {
    n: "05",
    title: "Recovery & Follow-Up",
    desc: "You receive guidance on compression garments, wound care, physical activity, medications, and follow-up visits throughout recovery.",
  },
]

/* ── Treatment options ───────────────────────────────────────────────────── */

export interface GynImage {
  src: string
  alt: string
}

export interface GynOption {
  id: string
  name: string
  /** Two-word category above the name — must not wrap. */
  category: string
  desc: string
  /**
   * The preview panel's split frame — exactly two images, always, so every
   * option is laid out identically and one card can't end up wearing a
   * full-bleed still while its neighbours wear a pair.
   *
   * ⚠️ Gland excision and the combined option draw on a three-shot CDN set and
   * so reuse it between them; liposuction and contouring each have their own
   * dedicated pair. Upload more to give the other two the same.
   */
  images: [GynImage, GynImage]
}

/* Named once so a swapped file is a one-line change rather than a hunt through
   the pairs below.

   Two sources, deliberately. The CDN set is the site library in config.ts,
   shared with /general — leave it alone. The /public set is specific to this
   page: four files supplied for the liposuction and contouring options only.

   The /public shots are surgical-planning photographs rather than male chests,
   so their alt text describes the markings actually pictured instead of naming
   a procedure the photo does not show. */
const LIPO: GynImage = { src: IMAGES.liposuction, alt: "Liposuction for gynecomastia correction" }
const GLAND: GynImage = { src: IMAGES.glandExcision, alt: "Gland excision for gynecomastia correction" }
const CONTOUR: GynImage = { src: IMAGES.chestContouring, alt: "Advanced chest contouring for gynecomastia" }

const LIPO_ONE: GynImage = { src: "/Liposuction.jpg", alt: "Liposuction planning markings drawn on the flank" }
const LIPO_TWO: GynImage = { src: "/Liposuctiontwo.webp", alt: "Liposuction planning markings drawn on the abdomen" }
const CONTOUR_BODY: GynImage = { src: "/contouring.jpg", alt: "Body contouring markings drawn before surgery" }
const CONTOUR_FACE: GynImage = { src: "/Face-contouring.jpg", alt: "Facial contouring markings drawn before surgery" }

export const OPTIONS: GynOption[] = [
  {
    id: "liposuction",
    name: "Liposuction",
    category: "Fat Removal",
    desc: "Used when excess fatty tissue is a major contributor to chest fullness. Targeted fat removal helps improve chest contour and definition.",
    images: [LIPO_ONE, LIPO_TWO],
  },
  {
    id: "gland-excision",
    name: "Gland Excision",
    category: "Gland Removal",
    desc: "When firm glandular tissue is present, it can be surgically removed through carefully planned incisions.",
    images: [GLAND, CONTOUR],
  },
  {
    id: "combination",
    name: "Liposuction + Gland Excision",
    category: "Combined Approach",
    desc: "For patients with both excess fat and glandular tissue, a combination approach may provide better contouring and symmetry.",
    images: [LIPO, GLAND],
  },
  {
    id: "contouring",
    name: "Advanced Contouring",
    category: "Chest Shaping",
    desc: "Where appropriate, additional contouring techniques may be used to improve chest shape and skin appearance.",
    images: [CONTOUR_BODY, CONTOUR_FACE],
  },
]

export const OPTIONS_NOTE = "The exact procedure is recommended only after clinical evaluation."

/* ── Outcomes, scars, recovery ───────────────────────────────────────────── */

export const IMPROVEMENTS = [
  "Flatter, more masculine chest contour",
  "Reduced chest fullness and puffiness",
  "Improved chest symmetry",
  "Reduced discomfort caused by excess tissue",
  "Better chest definition",
  "Greater comfort while wearing fitted clothing",
] as const

export const ANSWERS = [
  {
    q: "What about scars?",
    a: "Incisions are planned carefully with the goal of keeping visible scarring as limited as reasonably possible. Scar location and extent depend on the type and severity of gynecomastia and the procedure required.",
  },
  {
    q: "How long is recovery?",
    a: "Recovery varies between patients and procedures. Many patients can gradually return to routine activities within 1–2 weeks, while strenuous exercise and heavy lifting may need to be restricted for approximately 4–6 weeks, depending on the surgeon's advice.",
  },
] as const

/** Recovery milestones, drawn from the answer above — the same guidance as a
    timeline, because "1–2 weeks / 4–6 weeks" is easier to hold as a scale. */
export const RECOVERY_MARKS = [
  { when: "Day 0", what: "Procedure day" },
  { when: "1–2 weeks", what: "Gradual return to routine activities" },
  { when: "4–6 weeks", what: "Strenuous exercise and heavy lifting, as advised" },
] as const

/* ── Surgeon ─────────────────────────────────────────────────────────────── */

export const SURGEON = {
  name: "Dr. Madan K",
  title: "Aesthetic, Plastic & Reconstructive Surgeon",
  qualifications: "M.S. (General Surgery), M.Ch (Plastic Surgery), FIAGES, FIAAPS",
  body: [
    "Dr. Madan K specializes in aesthetic and reconstructive procedures, including gynecomastia correction, liposuction, and body contouring.",
    "His approach focuses on understanding each patient's anatomy and expectations before creating an individualized surgical plan designed around chest proportion, symmetry, safety, and natural-looking results.",
  ],
  reasons: [
    "Experience in gynecomastia & male chest contouring",
    "Advanced liposuction and surgical techniques",
    "Personalized treatment planning",
    "Focus on chest proportion and symmetry",
    "Pre-operative and post-operative guidance",
  ],
  photo: IMAGES.drMadan,
  cta: "Consult Dr. Madan K",
} as const

/* ── Clinic ──────────────────────────────────────────────────────────────── */

export const CLINIC = {
  title: "Expert Gynecomastia Care in Anna Nagar",
  body: [
    "At Elite-Minima, gynecomastia treatment is planned around one goal: providing the right correction for the individual patient.",
    "From your first evaluation through surgery and follow-up, the team focuses on clear communication, personalized treatment planning, patient safety, and comfortable recovery.",
  ],
  reasons: [
    "Specialist-led consultation",
    "Personalized chest assessment",
    "Modern surgical & contouring techniques",
    "Focus on minimal visible scarring",
    "Pre- and post-operative guidance",
    "Dedicated follow-up care",
  ],
} as const

export const SERVICE_AREAS = [
  "Anna Nagar",
  "Shenoy Nagar",
  "Kilpauk",
  "Thirumangalam",
  "Mogappair",
  "Koyambedu",
  "Arumbakkam",
  "Padi",
  "Kolathur",
  "Korattur",
] as const

/* ── Footer ──────────────────────────────────────────────────────────────── */

export const FOOTER_LINKS = [
  { label: "Treatment", href: "#treatment" },
  { label: "Doctor", href: "#surgeon" },
  { label: "Patient Reviews", href: "#reviews" },
  { label: "Clinic", href: "#clinic" },
  { label: "Location", href: "#visit" },
  { label: "Contact", href: "#book" },
] as const

export const FOOTER_SERVICES = [
  "Gynecomastia Treatment",
  "Male Breast Reduction",
  "Liposuction",
  "Body Contouring",
] as const

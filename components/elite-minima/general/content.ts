// Copy for the general (multi-speciality) landing page at /general.
//
// The clinic-level facts — phones, address, map, images — stay in
// ../config.ts, which this page imports directly. Everything here is the
// page's own editorial content, kept out of the components so copy edits
// never mean touching layout.

import { IMAGES } from "../config"

/** The number the general page's call CTAs dial. Keep it aligned with the
    clinic's primary line used on the piles page. */
export { PHONE_DISPLAY as GENERAL_PHONE_DISPLAY, PHONE_TEL as GENERAL_PHONE_TEL } from "../config"

/* ── Hero ────────────────────────────────────────────────────────────────── */

/**
 * Hero carousel slides — one per treatment pathway.
 *
 * `caption` is the label overlaid on the slide; `alt` describes what is
 * actually in the file, so the two are deliberately not the same string.
 */
export const HERO_IMAGES: { src: string; alt: string; caption: string }[] = [
  {
    src: IMAGES.pilesCausesAndSymptoms,
    alt: "Piles treatment visual showing anorectal anatomy and symptoms",
    caption: "Piles & Proctology",
  },
  {
    src: IMAGES.clinicianWithModel,
    alt: "Surgeon holding an anatomical model of the anal canal and pointing to a haemorrhoid",
    caption: "Specialist Consultation",
  },
  {
    src: IMAGES.liposuction,
    alt: "Liposuction treatment image representing gynecomastia correction",
    caption: "Gynecomastia Correction",
  },
  {
    src: IMAGES.glandExcision,
    alt: "Surgeon marking a swelling on a patient's neck before gland excision",
    caption: "Lump & Gland Surgery",
  },
]
// The stapler device shot used to sit second here. It reads as hardware
// rather than care — a bare instrument on a page whose hero is asking a nervous
// visitor to book. It is still the Stapler Circumcision option card in PATHWAYS
// below, where the surrounding copy gives it the context it needs.

/** Concern points under the hero video. Empty → the block is skipped entirely.
    Typed rather than `as const` so it still compiles with every row removed. */
export const HERO_CONCERNS: { title: string; body: string }[] = [
  // { title: "Piles", body: "Bleeding, pain, swelling or recurring discomfort" },
  // { title: "Circumcision", body: "Tight foreskin, pain, irritation or recurrent infections" },
  // { title: "Gynecomastia", body: "Puffy or enlarged male chest, excess fat or glandular tissue" },
]

/* ── Treatment pathways ──────────────────────────────────────────────────── */

export interface PathwayOption {
  name: string
  desc: string
  /** Small coloured label above the card title, e.g. "LASER". Keep it to two
      words — it sits on one line above the heading and is not allowed to wrap. */
  category: string
  /** Clinical image for the card's header. Options with no image supplied fall
      back to the icon block — see OPTION_ICONS in GeneralTreatments.tsx. */
  img?: string
  /** the file's true intrinsic size — next.config sets images.unoptimized */
  w?: number
  h?: number
  alt?: string
}

export interface Pathway {
  /** tab id, also the panel's aria target */
  id: "piles" | "circumcision" | "gynecomastia"
  tab: string
  title: string
  lead: string
  body: string[]
  optionsLabel: string
  options: PathwayOption[]
  /** caption under each card's progress meter */
  meterLabel: string
  concerns: string[]
  /** optional line under the options, e.g. the day-care note */
  note?: string
  cta: string
}

export const PATHWAYS: Pathway[] = [
  {
    id: "piles",
    tab: "Piles Treatment",
    title: "Advanced Piles & Hemorrhoids Care",
    lead: "Experiencing bleeding, pain, itching, swelling, or a lump around the anal area?",
    body: [
      "Piles can vary in type and severity. At Elite-Minima, the doctor first evaluates your symptoms and condition before recommending an appropriate treatment approach.",
    ],
    optionsLabel: "Treatment options may include",
    meterLabel: "Intervention level",
    options: [
      {
        name: "Non-Surgical Management",
        desc: "For suitable early-stage cases, medication, dietary changes, stool softeners, hydration, and bowel-habit modifications may be recommended.",
        category: "Conservative Care",
        img: IMAGES.pilesCausesAndSymptoms,
        w: 745,
        h: 470,
        alt: "A man holding his lower back in discomfort, with a magnifying glass revealing a cross-section of the anal canal",
      },
      {
        name: "Minimally Invasive Treatment",
        desc: "Selected cases may be treated using minimally invasive techniques designed to limit tissue disruption.",
        category: "Minimally Invasive",
        img: IMAGES.pilesDiagram,
        w: 612,
        h: 611,
        alt: "Cross-section diagram of the anal canal labelling internal and external hemorrhoids and bleeding",
      },
      {
        name: "Laser Piles Treatment",
        desc: "For suitable patients, laser treatment may provide a precise, minimally invasive approach to treating piles.",
        category: "Laser",
        img: IMAGES.pilesModel,
        w: 250,
        h: 250,
        alt: "Anatomical model showing hemorrhoids within the anal canal",
      },
      {
        name: "Advanced Piles Surgery",
        desc: "For complex or advanced conditions, surgical treatment may be recommended after specialist evaluation.",
        category: "Surgical",
        img: IMAGES.clinicianWithModel,
        w: 700,
        h: 461,
        alt: "A clinician in a white coat holding an anatomical model of the anal canal and pointing to it with a pen",
      },
    ],
    concerns: [
      "Bleeding during bowel movements",
      "Pain or discomfort",
      "Swelling or anal lump",
      "Itching or irritation",
      "Recurring piles symptoms",
    ],
    cta: "Consult for Piles",
  },
  {
    id: "circumcision",
    tab: "Circumcision",
    title: "Modern Stapler & Laser Circumcision",
    lead: "Circumcision may be considered for medical concerns involving the foreskin, including phimosis, painful retraction, recurrent infections, irritation, or foreskin-related discomfort.",
    body: [
      "Elite-Minima provides private specialist evaluation and modern circumcision options based on your condition.",
    ],
    optionsLabel: "Treatment options",
    meterLabel: "Technique",
    options: [
      {
        name: "Stapler Circumcision",
        desc: "Uses a specialized circular stapling device for controlled and uniform foreskin removal.",
        category: "Device-Assisted",
        img: IMAGES.staplerCircumcision,
        alt: "Circumcision treatment illustration for stapler circumcision",
      },
      {
        name: "Laser Circumcision",
        desc: "Uses surgical laser technology for precise foreskin removal while helping control bleeding during the procedure.",
        category: "Laser",
        img: IMAGES.laserCircumcision,
        alt: "Laser circumcision treatment illustration",
      },
    ],
    concerns: [
      "Tight foreskin / Phimosis",
      "Difficulty retracting foreskin",
      "Pain or discomfort",
      "Repeated infections or balanitis",
      "Foreskin tears or irritation",
    ],
    note: "Circumcision is commonly performed as a day-care procedure, with same-day discharge possible for suitable patients.",
    cta: "Consult for Circumcision",
  },
  {
    id: "gynecomastia",
    tab: "Gynecomastia",
    title: "Male Breast Reduction & Chest Contouring",
    lead: "Concerned about a puffy, enlarged, or disproportionate male chest?",
    body: [
      "Male chest enlargement may result from excess fatty tissue, glandular tissue, or a combination of both. A specialist evaluation helps determine the cause and appropriate treatment approach.",
    ],
    optionsLabel: "Treatment options",
    meterLabel: "Extent of correction",
    options: [
      {
        name: "Liposuction",
        desc: "Targeted removal of excess fatty tissue to improve chest contour.",
        category: "Fat Removal",
        img: IMAGES.liposuction,
        alt: "Liposuction treatment image for gynecomastia correction",
      },
      {
        name: "Gland Excision",
        desc: "Removal of firm glandular tissue when clinically appropriate.",
        category: "Gland Removal",
        img: IMAGES.glandExcision,
        alt: "Gland excision treatment image for gynecomastia correction",
      },
      {
        name: "Advanced Chest Contouring",
        desc: "Additional contouring techniques may be considered depending on chest anatomy and treatment requirements.",
        category: "Contouring",
        img: IMAGES.chestContouring,
        alt: "Advanced gynecomastia contouring treatment image",
      },
    ],
    concerns: [
      "Puffy or enlarged chest",
      "Protruding nipples",
      "Excess chest fat",
      "Firm glandular tissue",
      "Uneven chest appearance",
      "Chest tenderness or discomfort",
    ],
    cta: "Consult for Gynecomastia",
  },
]

/* ── Treatment journey ───────────────────────────────────────────────────── */

export const JOURNEY = [
  {
    n: "01",
    title: "Private Consultation",
    desc: "Discuss your symptoms, concerns, medical history, and treatment expectations privately with the doctor.",
  },
  {
    n: "02",
    title: "Clinical Evaluation",
    desc: "Your doctor evaluates your condition, severity, and relevant medical factors to understand what treatment may be appropriate.",
  },
  {
    n: "03",
    title: "Personalized Treatment Plan",
    desc: "Available treatment options, procedure details, expected recovery, and aftercare are explained before proceeding.",
  },
  {
    n: "04",
    title: "Treatment",
    desc: "Receive the recommended treatment or procedure in an appropriate clinical environment with a focus on patient safety and comfort.",
  },
  {
    n: "05",
    title: "Recovery & Follow-Up",
    desc: "Get personalized instructions covering medications, hygiene, diet or activity restrictions where relevant, wound care, and follow-up appointments.",
  },
] as const

/* ── Specialists ─────────────────────────────────────────────────────────── */

export interface Specialist {
  name: string
  title: string
  qualifications?: string
  body?: string
  expertise: string[]
  /** Portrait URL. Empty → the initials chip renders instead. */
  photo: string
  cta: string
}

export const SPECIALISTS: Specialist[] = [
  {
    // Proctology specialist — kept in sync with DOCTOR in ../config.ts.
    name: "Dr. Lohit Sai K",
    title: "Consultant Surgeon & Proctology Specialist",
    qualifications: "M.B.B.S, M.S. (General Surgery), DNB, F.MAS, D.MAS, M.MAS, FALS, FISCP, FAIS, FIAGES",
    body: "Evaluation and treatment of piles, fissures, fistulas and related proctology conditions, with both non-surgical and minimally invasive options.",
    expertise: [
      "Piles Treatment",
      "Laser Piles Treatment",
      "Fissure Treatment",
      "Fistula Treatment",
      "Minimally Invasive Procedures",
    ],
    photo: IMAGES.drLohitSai,
    cta: "Consult Dr. Lohit Sai K",
  },
  {
    name: "Dr. Madan K",
    title: "Aesthetic, Plastic & Reconstructive Surgeon",
    qualifications: "M.S. (General Surgery), M.Ch (Plastic Surgery), FIAGES, FIAAPS",
    body: "Specialist in aesthetic surgeries, hair transplant, cosmetic procedures, liposuction, gynecomastia correction, and laser lipoma excision. His treatment approach focuses on individualized surgical planning, patient safety, and appropriate post-operative care.",
    expertise: [
      "Gynecomastia Correction",
      "Liposuction",
      "Body Contouring",
      "Hair Transplant",
      "Laser Lipoma Excision",
      "Aesthetic Surgery",
    ],
    photo: IMAGES.drMadan,
    cta: "Consult Dr. Madan K",
  },
  {
    name: "Dr. G. Vijayalakshmi",
    title: "Surgical Oncologist & Women's Health Specialist",
    qualifications: "M.B.B.S, M.S. (General Surgery), MRCS (Edinburgh), M.Ch (Surgical Oncology)",
    body: "Specialized in cancer care, preventive oncology, advanced laparoscopic surgeries, palliative care, and comprehensive women's health care.",
    expertise: [
      "Cancer Care",
      "Preventive Oncology",
      "Advanced Laparoscopic Surgery",
      "Palliative Care",
      "Women's Health",
    ],
    photo: IMAGES.drVijayalakshmi,
    cta: "Consult Dr. Vijayalakshmi",
  },
]

/* ── Clinic ──────────────────────────────────────────────────────────────── */

export const EXPECTATIONS = [
  "Specialist-led evaluation",
  "Modern & minimally invasive treatment options",
  "Personalized treatment planning",
  "Private & confidential consultation",
  "Modern surgical facility",
  "Sterilization & safety protocols",
  "Day-care procedures where appropriate",
  "Post-treatment guidance & follow-up",
] as const

export const TREATMENT_GROUPS = [
  { title: "Piles & Proctology", items: "Piles • Fissure • Fistula • Laser & Minimally Invasive Procedures" },
  { title: "Circumcision", items: "Stapler Circumcision • Laser Circumcision • Phimosis Treatment" },
  { title: "Gynecomastia", items: "Male Breast Reduction • Liposuction • Gland Excision • Chest Contouring" },
] as const

/* ── Location ────────────────────────────────────────────────────────────── */

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

/* ── Patient reviews ─────────────────────────────────────────────────────────
   Review cards shown in the marquee on the general landing page. */

export const REVIEWS = [
  {
    quote:
      "I consulted for piles after weeks of pain and bleeding. The doctor explained the options clearly, the procedure felt organized, and my recovery was much smoother than I expected.",
    name: "Karthik R",
    place: "Anna Nagar",
    tag: "Piles Treatment",
  },
  {
    quote:
      "I was anxious about circumcision, but the consultation was private and reassuring. Everything from the procedure to aftercare was explained properly, and I felt comfortable throughout.",
    name: "Naveen S",
    place: "Kilpauk",
    tag: "Circumcision",
  },
  {
    quote:
      "I had been postponing treatment for gynecomastia for a long time. After my evaluation, the doctor helped me understand the plan clearly, and I am happy with the confidence I regained after treatment.",
    name: "Pradeep M",
    place: "Mogappair",
    tag: "Gynecomastia",
  },
] as const

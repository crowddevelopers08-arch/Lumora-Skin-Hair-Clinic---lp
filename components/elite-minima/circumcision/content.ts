// Copy for the circumcision landing page at /circumcision.
//
// This file is the approved content deck, transcribed. The page is seven
// sections and this is all of their copy — components hold layout only, so a
// wording change never means touching a component.
//
// Square-bracketed strings below are the deck's own placeholders, still
// waiting on the clinic: the doctor's name and qualification, the three
// patient reviews, the film, and the clinic photographs. Each is a single
// constant, so filling it in is a one-line edit. See PLACEHOLDERS at the end.

// Aliased on import: this file exports its own `DOCTOR` — the section's copy —
// and the clinic record it is built from has the same name in config.ts.
import { DOCTOR as CLINIC_DOCTOR, IMAGES } from "../config"
// Dr. Madan K's record lives on the gynecomastia page, which is where he is
// the sole surgeon. Imported rather than copied so his qualifications cannot
// end up saying two different things on two pages of the same site.
import { SURGEON as GYN_SURGEON } from "../gynecomastia/content"

/** Branch tag so leads from this page are separable in TeleCRM / the sheet. */
export const CIRCUMCISION_BRANCH = "Elite Minima Clinic — Circumcision"

/* This page's number: the clinic's primary line, +91 95000 91428. Every call
   CTA on the page dials it — header, hero, booking band, map section, footer
   and the sticky bar — so it is aliased once here rather than each section
   reaching into config.ts for itself and one of them picking the wrong line.
   Repoint this single export to swap the number everywhere.

   (The content deck originally specified the second line, 98949 84103. It was
   changed to the primary on request; the second line still appears on the
   confirmation page as the alternative.) */
export { PHONE_DISPLAY as CIRC_PHONE_DISPLAY, PHONE_TEL as CIRC_PHONE_TEL } from "../config"

/* Both lines, in display order, for the places that list them rather than
   dial one. config.ts sets the convention the whole site follows: the primary
   alone in the navbar and behind any single-button call CTA, both numbers
   wherever they are actually listed — the booking band, the map section, the
   footer, and the form's failure message. */
export { PHONES as CIRC_PHONES } from "../config"

/* ── Navigation ──────────────────────────────────────────────────────────────
   Not from the deck — the deck describes the seven content sections, and this
   is the header's route through them. */

export const NAV = [
  { label: "Reviews", href: "#reviews", id: "reviews" },
  { label: "Treatment", href: "#treatment", id: "treatment" },
  { label: "Doctors", href: "#doctor", id: "doctor" },
  { label: "Clinic", href: "#clinic", id: "clinic" },
  { label: "Location", href: "#visit", id: "visit" },
] as const

/* ── Section 01 · Hero ───────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: "Circumcision",
  /* The headline is split so the closing run can be set in the accent colour,
     the way the reference layout carries its own: plain text, not the `.c-mark`
     highlight block. Joined they read "Advanced Circumcision Treatment". */
  headline: "Advanced",
  headlineAccent: "Circumcision Treatment",
  subtext: "Modern Stapler & Laser Circumcision With Private, Specialist Care",
  primaryCta: "Book My Appointment",
  secondaryCta: "Call Now",
  /* The hero portrait. A cut-out (transparent PNG, 1224×1285) served from
     /public rather than a Cloudinary URL, so it carries no studio backdrop of
     its own and stands directly on the panel colour — which is the whole point
     of the treatment, and why it must not be swapped for a rectangular photo
     without changing the object-fit in CircHero too.

     The doctor section further down keeps the framed studio portraits; see
     DOCTORS[n].photo. */
  portrait: "/docnew.png",
} as const

/** The doctor-led explainer. `src` empty → the frame renders as a labelled
    slot rather than a play button over something that cannot play. */
// export const HERO_VIDEO = {
//   src: "",
//   label: "Doctor-led treatment overview",
//   body: "30–45 sec video explaining the treatment, who may need it, available techniques and recovery expectations.",
//   /** Still shown in the frame until `src` is filled in. */
//   poster: IMAGES.staplerCircumcision,
//   posterAlt: "Clinical illustration of a single-use circular stapling device used for circumcision",
// } as const

export const HERO_ASSURANCES = [
  "Private Consultation",
  "Day-Care Treatment",
  "Stapler & Laser Options",
  "Personalized Aftercare",
] as const

/* ── Section 01 · Booking form ───────────────────────────────────────────────
   The heading above the fields in the hero's right column, which is where the
   deck puts them. They spent a while in a band of their own under the hero,
   back when the surgeon's portrait held that column; the band is gone and the
   copy came back unchanged.

   The deck's "concerns we treat" list and the second phone number went with
   the band. The list is the treatment section's subject and the number is in
   the header, the sticky bar and the footer, so neither lost its only home. */

export const BOOKING = {
  title: "Book Your Consultation",
  lead: "Share your details and our team will call you back to confirm a time that suits you.",
} as const

export const FORM_CONCERNS = ["Bleeding", "Pain", "Swelling or Lump", "Itching", "Other"] as const

/* The deck's three call windows — 9 AM–12 PM / 12 PM–3 PM / 3 PM–6 PM — are
   deliberately not here. The form asks for a date and an hourly slot instead,
   the same 10 AM – 7 PM set the piles, general and gynecomastia forms use:
   one clinic and one phone room, so the times offered should not depend on
   which page the visitor happened to land on, and a window with no date is not
   something the team can actually hold. The slot maths lives in CircForm.tsx
   alongside the field that renders it. */

/* ── Section 02 · Patient reviews ────────────────────────────────────────── */

export const REVIEWS_TITLE = "What Our Patients Say"
export const REVIEWS_LEAD = "Real experiences from patients who chose Elite-Minima for surgical care."

/**
 * ⚠ DUMMY CONTENT — NOT REAL PATIENT REVIEWS. REPLACE BEFORE LAUNCH.
 *
 * Written to fill the carousel so the section can be designed and signed off.
 * Every name, place and quote below is invented; none of it came from a
 * patient. Publishing invented testimonials for a medical practice is a
 * misrepresentation and, for a clinic advertising in India, exposure under the
 * Consumer Protection Act's rules on misleading advertising — so these must be
 * swapped for reviews the clinic has actually received before this page is
 * pointed at any ad spend.
 *
 * Six entries rather than the deck's three: the row scrolls itself, and with
 * three the same card comes back around too quickly to read as a set.
 *
 * `tag` is the treatment the review describes; keep it accurate once these are
 * real, so a review of another procedure is never mistaken for a circumcision
 * one.
 *
 * The quotes name both surgeons — two Dr. Lohit Sai K, two Dr. Madan K, two
 * neither — so the section matches the pair of profiles in section 03 rather
 * than crediting every case to one of them. That split is invented along with
 * the rest of the text and carries a second problem the rest does not:
 * attributing praise to a named, real doctor for work that no identified
 * patient described is a claim about a person, not just filler. When the real
 * reviews arrive, let them fall where they fall — do not redistribute names to
 * keep the balance even.
 */
export const REVIEWS = [
  {
    quote:
      "Dr. Lohit Sai was patient and attentive, and explained my condition and treatment options clearly. I felt comfortable asking questions, and all my concerns were addressed. The treatment has been effective, and I would definitely recommend him.",
    name: "Vidya Sharosh",
    place: "Choolaimedu",
    tag: "Stapler Circumcision",
  },
  {
    quote:
      "From the first consultation to the post surgery follow-ups, Dr. Madan made sure I was comfortable at every stage. The professional and compassionate approach made a real difference to my experience. Thank you, Dr. Madan.",
    name: "Pankaj Ranka",
    place: "Sowkarpet",
    tag: "Laser Circumcision",
  },
  {
    quote:
      "Dr. Lohit Sai handled my treatment and surgery gently and politely, and his experience as a surgeon really showed. Whenever you reach out he replies instantly and gives a solution immediately. A very reassuring experience overall.",
    name: "uma shankar",
    place: "Avadi",
    tag: "Phimosis Treatment",
  },
  {
    quote:
      "We chose Elite Minima for a family member's treatment, and it was the right decision. The doctor explained the condition clearly and answered every question patiently. The staff were kind, the facilities neat, and the recovery smooth.",
    name: "Sethu Pathi",
    place: "Redhills",
    tag: "Stapler Circumcision",
  },
  {
    quote:
      "My family member received excellent treatment at Elite Minima. The doctor was calm and confident, and the staff supported us throughout the process. The care and pain management after surgery made recovery smooth and relieving.",
    name: "PRAKASH G",
    place: "Padiyanallur",
    tag: "Circumcision",
  },
  {
    quote:
      "Dr. Madan explained the procedure clearly and made me feel comfortable. The surgery was smooth and well handled, the staff supportive, and the clinic clean. The post-surgery instructions were clear and helpful too.",
    name: "mani",
    place: "Sowkarpet",
    tag: "Laser Circumcision",
  },
] as const

export const REVIEWS_DISCLAIMER = "Patient experiences and recovery may vary."
export const REVIEWS_CTA = "Book Your Consultation"

/* ── Section 03 · Treatment journey ──────────────────────────────────────── */

export const JOURNEY_TITLE = "Your Circumcision Treatment Journey"
export const JOURNEY_LEAD =
  "From your first consultation to follow-up care, our team guides you through each stage with privacy and clear communication."

export const JOURNEY = [
  {
    n: "01",
    title: "Private Consultation",
    desc: "Discuss your symptoms and concerns with the doctor. Your condition and medical history are evaluated before treatment is recommended.",
  },
  {
    n: "02",
    title: "Choose the Right Treatment",
    desc: "Based on your evaluation, the doctor will explain whether Stapler Circumcision, Laser Circumcision or another approach is appropriate.",
  },
  {
    n: "03",
    title: "Procedure",
    desc: "The procedure is performed in a sterile surgical environment using appropriate anesthesia for patient comfort.",
  },
  {
    n: "04",
    title: "Day-Care & Discharge",
    desc: "Circumcision is commonly performed as a day-care procedure, with same-day discharge possible for suitable patients.",
  },
  {
    n: "05",
    title: "Recovery & Follow-Up",
    desc: "Receive clear instructions for wound care, hygiene, medications, activity and follow-up appointments.",
  },
] as const

/* ── Section 03 · Circumcision options ───────────────────────────────────── */

export const OPTIONS_TITLE = "Circumcision Options"

export const OPTIONS = [
  {
    id: "stapler",
    name: "Stapler Circumcision",
    desc: "Uses a specialized single-use circular stapling device for controlled and uniform foreskin removal.",
    points: [
      "Short procedure time",
      "Minimal bleeding",
      "Uniform removal",
      "Day-care treatment in suitable cases",
      "Straightforward aftercare",
    ],
    img: IMAGES.staplerCircumcision,
    alt: "Clinical illustration of a single-use circular stapling device used for circumcision",
  },
  {
    id: "laser",
    name: "Laser Circumcision",
    desc: "Uses a surgical laser for precise foreskin removal while controlling bleeding during the procedure.",
    points: [
      "Precise tissue removal",
      "Minimal bleeding",
      "Minimally invasive approach",
      "Day-care procedure in suitable cases",
      "Designed to support smooth recovery",
    ],
    img: IMAGES.laserCircumcision,
    // The file behind this constant is a theatre photograph, not a diagram, so
    // the alt describes the photograph.
    alt: "Surgeons at work in the operating theatre during a laser procedure",
  },
] as const

export const OPTIONS_CTA = {
  title: "Not Sure Which Treatment You Need?",
  body: "Your doctor will recommend an appropriate technique after examining your condition and discussing your medical history.",
  button: "Consult the Doctor",
} as const

/* ── Section 04 · Doctor ─────────────────────────────────────────────────── */

/**
 * The surgeon this page fronts.
 *
 * Circumcision is general surgery, so this is the clinic's general /
 * minimally invasive surgeon — the same person the piles page fronts. The
 * name, speciality and qualifications are read off `DOCTOR` in ../config.ts
 * rather than retyped, so the two pages cannot drift apart: change the record
 * there and every page that names them follows.
 *
 * The deck sets this line as "[Qualification] | [Specialization]". They are
 * kept as two fields instead: the qualification string is a 90-character run
 * of comma-separated abbreviations, and pushed through the page's tracked
 * uppercase caps on one line with the speciality it was illegible. The
 * component sets the speciality in caps and the abbreviations in plain text
 * underneath.
 */
/**
 * The section's own copy — everything that belongs to the band rather than to
 * either surgeon. The two profiles are DOCTORS below.
 */
export const DOCTOR_SECTION = {
  title: "Meet Your Circumcision Specialists",
  lead: "Get evaluated by an experienced surgeon for concerns including phimosis, recurrent infections, painful foreskin retraction, frenulum problems and other foreskin-related conditions.",
  pointsTitle: "Specialist Care From Consultation to Recovery",
  points: [
    "Detailed clinical evaluation",
    "Treatment based on individual condition",
    "Clear explanation before the procedure",
    "Focus on patient privacy and comfort",
    "Post-procedure guidance and follow-up",
  ],
  /* The deck's "BOOK A CONSULTATION WITH DR. ______". The blank used to be
     filled with the one surgeon's name; with two on the section there is no
     single name to put in it, and naming one of them under a pair of profiles
     reads as a preference the clinic has not expressed. */
  button: "Book a Consultation",
} as const

/**
 * The surgeons on this section, in display order.
 *
 * Both records take their name, title and qualifications from the existing
 * clinic data rather than restating it — CLINIC_DOCTOR is config.ts's record
 * for Dr. Lohit Sai K, and GYN_SURGEON is the gynecomastia page's for
 * Dr. Madan K. A qualification string is the one thing on this page that must
 * never drift between the pages it appears on, so neither is retyped here.
 *
 * ⚠ `body` is the exception, and it is the one field on each record that was
 * WRITTEN FOR THIS PAGE rather than carried over. Both are grounded in what
 * the clinic already publishes about each surgeon — Dr. Lohit Sai K's from his
 * config.ts `title` and `highlight`, Dr. Madan K's from the gynecomastia
 * page's SURGEON.body — but neither has been confirmed by the clinic as an
 * accurate description of their role in circumcision cases specifically.
 *
 * Dr. Madan K in particular is published elsewhere on this site as an
 * aesthetic, plastic and reconstructive surgeon, and nothing in the repository
 * states that he takes circumcision consultations. His copy below is
 * deliberately written around approach rather than around this procedure, so
 * it claims nothing that has not been claimed for him already. GET BOTH
 * SIGNED OFF BY THE CLINIC BEFORE LAUNCH, and if he does not in fact see
 * circumcision patients, remove this record rather than rewording it.
 */
export const DOCTORS = [
  {
    name: CLINIC_DOCTOR.name,
    speciality: CLINIC_DOCTOR.title,
    qualifications: CLINIC_DOCTOR.qualifications,
    photo: IMAGES.drLohitSai,
    body: "Dr. Lohit Sai K evaluates and treats foreskin-related conditions, and advises on whether a stapler or laser approach is appropriate for your case. His practice covers advanced laparoscopic, laser and minimally invasive procedures.",
  },
  {
    name: GYN_SURGEON.name,
    speciality: GYN_SURGEON.title,
    qualifications: GYN_SURGEON.qualifications,
    photo: IMAGES.drMadan,
    body: "Dr. Madan K assesses each patient's anatomy and expectations before agreeing an individual treatment plan, with attention to safety, healing and the appearance of the result.",
  },
] as const

/* ── Section 05 · Clinic ─────────────────────────────────────────────────── */

export const CLINIC = {
  title: "Why Choose Elite-Minima?",
  strapline: "Advanced Surgical Care. Private Environment. Personalized Attention.",
  body: [
    "Elite-Minima – The Surgical Speciality Clinic provides modern minimally invasive surgical care in Anna Nagar, Chennai.",
    "From your first consultation through treatment and recovery, our focus is on safety, hygiene, privacy and clear communication.",
  ],
  expectTitle: "What You Can Expect",
  expect: [
    "Stapler & Laser Circumcision Options",
    "Experienced Surgical Care",
    "Modern Surgical Facility",
    "Sterilization & Safety Protocols",
    "Private & Confidential Consultation",
    "Day-Care Treatment",
    "Dedicated Aftercare Guidance",
  ],
} as const

/**
 * The clinic mosaic, one entry per frame the deck asks for.
 *
 * All four are filled now: the theatre shot from the clinic's Cloudinary set,
 * and three photographs of the premises served from /public. `label` is only
 * drawn while a frame is still empty (see MediaFrame), so with every `src` set
 * it survives as the frame's identifier — the visible description is `alt`.
 *
 * If a frame is ever emptied again, it renders as a labelled slot rather than
 * a broken image. Do not fill one from the piles page's image set: those are
 * anorectal anatomical models and belong nowhere near this page.
 */
export const CLINIC_MEDIA = [
  {
    /* Portrait, which is what the lead frame wants — it spans two columns and
       all three rows, and the landscape theatre shot this replaced had to be
       cropped hard to fill it.

       ⚠ 1.9 MB PNG at 1122×1402. next/image runs `unoptimized` (see
       next.config.mjs), so this is served byte-for-byte to every visitor —
       roughly thirty times the three .webp frames beside it. Re-export it as
       webp and this section stops being the heaviest thing on the page. */
    src: "/treatment.png",
    label: "Clinic",
    alt: "Two surgeons operating under theatre lights at Elite-Minima, Anna Nagar",
  },
  {
    src: "/rec.webp",
    label: "Reception",
    alt: "Reception and waiting area at Elite-Minima, with seating either side of the front desk",
  },
  {
    src: "/cons.webp",
    label: "Consultation Room",
    alt: "Private consultation room at Elite-Minima, with a desk and seating for two",
  },
  {
    src: "/tre.webp",
    label: "Facility",
    alt: "Treatment room at Elite-Minima, with an examination couch and instrument storage",
  },
] as const

export const CLINIC_CTA = {
  title: "Have Questions Before Deciding?",
  body: "Speak privately with our team and understand the procedure, treatment options and expected recovery.",
  button: "Talk to Our Team",
} as const

/* ── Section 06 · Map ────────────────────────────────────────────────────── */

export const VISIT = {
  title: "Circumcision Treatment in Anna Nagar, Chennai",
  lead: "Conveniently located in Anna Nagar for patients from nearby areas including Shenoy Nagar, Kilpauk, Thirumangalam, Mogappair, Koyambedu, Arumbakkam, Padi, Kolathur and Korattur.",
  clinicName: "Elite-Minima – The Surgical Speciality Clinic",
  address:
    "Ground Floor, New No. 47/1, Old No. Z-165, MIG Flat 64 A, Block 64, 5th Avenue, Anna Nagar, Chennai, Tamil Nadu – 600040",
  timing: "Consultation Timing: 4:00 PM – 8:00 PM",
  timingNote: "By Appointment",
  directions: "Get Directions",
  book: "Book Appointment",
} as const

/* ── Section 07 · Footer ─────────────────────────────────────────────────── */

export const FOOTER = {
  brand: "Elite-Minima – The Surgical Speciality Clinic",
  blurb: "Modern surgical care with a focus on safety, privacy and patient comfort.",
  location: "Location: Anna Nagar, Chennai – 600040",
  button: "Book a Private Consultation",
} as const

/* The deck's footer menu. None of these exist as routes yet, so each points at
   the section of this page that answers it; repoint them at real URLs once
   those pages are built. */
export const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#clinic" },
  { label: "Services", href: "#treatment" },
  { label: "Gallery", href: "#clinic" },
  { label: "Contact Us", href: "#book" },
] as const

/* ── Outstanding placeholders ────────────────────────────────────────────────
   Everything the deck left blank, in one list, so none of it reaches a live
   page unnoticed:

     REVIEWS                all six are INVENTED — see the warning above them

   The doctor's details and all four clinic photographs have since been filled
   in, so the reviews are the only thing left on this list.                   */

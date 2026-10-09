"use client"

import { Star, User } from "lucide-react"
import Reveal from "./Reveal"
import TitleUnderline from "./TitleUnderline"
import { WASH } from "./tokens"

/* Cards cycle through the three brand washes so the rail has a gentle rhythm
   as it loops, rather than reading as one long white band. */
const TINTS = [WASH.green, WASH.purple, WASH.slate]

const STORIES = [
  {
    tag: "Laser Piles Treatment",
    quote: "I was suffering from piles with bleeding and pain for months.",
    body: "After my consultation, the doctor explained my condition and recommended laser piles treatment. The procedure and aftercare were clearly explained, and the team supported me throughout my recovery.",
    name: "Arshad",
    place: "Chennai",
  },
  {
    tag: "Grade 3 Piles",
    quote: "My Grade 3 piles were affecting my everyday routine.",
    body: "I had recurring swelling, discomfort and bleeding during bowel movements. After evaluation, I underwent the recommended minimally invasive piles treatment. The entire process, from diagnosis to follow-up, was well managed.",
    name: "Paul Jacob",
    place: "Anna Nagar",
  },
  {
    tag: "Hemorrhoids Treatment",
    quote: "I kept ignoring my hemorrhoids because I was embarrassed to consult a doctor.",
    body: "When the bleeding and discomfort continued, I finally booked a consultation. The doctor made me feel comfortable, explained the hemorrhoids treatment options, and recommended a treatment plan based on my condition.",
    name: "Sangeetha",
    place: "Mogappair",
  },
  {
    tag: "Non-Surgical Piles Treatment",
    quote: "I was worried that piles would automatically mean surgery.",
    body: "After evaluation, the doctor explained that my condition could be managed with non-surgical piles treatment, along with medication, diet and bowel-habit changes. Having a clear treatment plan gave me confidence.",
    name: "Rajesh Kumar",
    place: "Kilpauk",
  },
  {
    tag: "Advanced Piles Treatment",
    quote: "Recurring piles symptoms kept coming back despite temporary remedies.",
    body: "I consulted Elite Minima after experiencing repeated pain and bleeding. Following an assessment, the doctor recommended an appropriate advanced piles treatment and provided clear guidance for recovery and prevention.",
    name: "Venkat Raman",
    place: "Chennai",
  },
]

type Story = (typeof STORIES)[number]

function StoryCard({ s, tint }: { s: Story; tint: string }) {
  return (
    // inline background: `.elite .card` sets `background: #fff` and would win
    // over a utility class on specificity
    <article className="card flex h-full w-[280px] flex-col p-6 sm:w-[330px]" style={{ backgroundColor: tint }}>
      <div className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-3.5 w-3.5 fill-[var(--e-purple)] text-[var(--e-purple)]" />
        ))}
      </div>
      {/* white chip rather than a green wash — it stays legible on all three tints */}
      <span className="mt-3 inline-flex w-fit items-center rounded-full border border-[var(--e-green-line)] bg-white px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[var(--e-green-deep)]">
        {s.tag}
      </span>
      <p className="mt-4 text-[0.98rem] font-semibold leading-snug text-[var(--e-ink)]">&ldquo;{s.quote}&rdquo;</p>
      <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-[var(--e-muted)]">{s.body}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-[var(--e-line)] pt-4">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-[var(--e-muted)]">
          <User className="h-4.5 w-4.5" />
        </span>
        <div className="leading-tight">
          <p className="text-[0.88rem] font-bold text-[var(--e-ink)]">{s.name}</p>
          <p className="text-[0.78rem] text-[var(--e-muted)]">{s.place}</p>
        </div>
      </div>
    </article>
  )
}

/** One pass of the stories. Rendered twice so the loop has no visible seam. */
function Track({ duplicate }: { duplicate?: boolean }) {
  return (
    <ul aria-hidden={duplicate} className={`flex shrink-0 items-stretch ${duplicate ? "marquee-dup" : ""}`}>
      {STORIES.map((s, i) => (
        <li key={s.tag + i} className="mr-5 flex shrink-0">
          <StoryCard s={s} tint={TINTS[i % TINTS.length]} />
        </li>
      ))}
    </ul>
  )
}

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="overflow-hidden border-b border-[var(--e-line)] bg-white py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
          <Reveal className="lg:max-w-[400px]">
            <p className="kicker">Patient Stories</p>
            <h2 className="mt-4">What Our Patients Say</h2>
            <TitleUnderline className="mt-3" />
            <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--e-muted)]">
              Real experiences from patients who consulted Elite Minima for their piles diagnosis and treatment.
            </p>
          </Reveal>

          {/* Cards drift right → left, forever. Bleeds past the shell gutter so the
              rail reads as continuing off-screen rather than stopping at a margin. */}
          <Reveal className="marquee-rail marquee-fade -mr-5 min-w-0 sm:-mr-8">
            <div className="marquee py-1 [--marquee-duration:46s]">
              <Track />
              <Track duplicate />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

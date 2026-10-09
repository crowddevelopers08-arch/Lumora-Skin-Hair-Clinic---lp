"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Lock } from "lucide-react"
import { track } from "../track"
import { CIRCUMCISION_LEADS_FORM } from "@/lib/forms"
// CIRC_PHONES is still needed: it names the numbers to ring in the failure
// alert, which is the one place the form does still have to give them.
import { CIRCUMCISION_BRANCH, CIRC_PHONES, FORM_CONCERNS } from "./content"

const LEAD_ENDPOINT = "/api/leads"

/* ── Callback window (clinic time, IST) ───────────────────────────────────
   Slots are minutes-since-midnight so "is this one in the past?" is a number
   comparison rather than string wrangling. Same window and the same hourly
   step as the piles, general and gynecomastia forms — one clinic, one phone
   room, so a visitor should not be offered a different set of times depending
   on which page they landed on.

   This replaces the three broad windows the content deck asked for
   (9 AM–12 PM / 12 PM–3 PM / 3 PM–6 PM): those ran outside the hours the team
   actually calls back on, and gave no way to drop a slot that had already
   passed. */
const OPEN_MIN = 10 * 60 // 10:00 AM — first bookable slot
const CLOSE_MIN = 19 * 60 // 7:00 PM — end of the last slot
const STEP_MIN = 60

function toLabel(mins: number) {
  const h = Math.floor(mins / 60)
  return `${h % 12 || 12}:${String(mins % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
}

const SLOTS: { mins: number; label: string }[] = []
for (let m = OPEN_MIN; m <= CLOSE_MIN - STEP_MIN; m += STEP_MIN) {
  SLOTS.push({ mins: m, label: `${toLabel(m)} - ${toLabel(m + STEP_MIN)}` })
}

/** "Now" in the clinic's timezone, wherever the visitor happens to be. */
function istNow() {
  const d = new Date()
  const ist = new Date(d.getTime() + d.getTimezoneOffset() * 60_000 + 5.5 * 3_600_000)
  return {
    minutes: ist.getHours() * 60 + ist.getMinutes(),
    date: `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, "0")}-${String(ist.getDate()).padStart(2, "0")}`,
  }
}

/**
 * The booking form — section 01's right-hand column.
 *
 * The deck's six fields — name, phone, email, address, concern and a call-time
 * preference — plus a date, so the callback can actually be scheduled. That
 * pairing is what the piles, general and gynecomastia forms all ask for, and a
 * time with no date is not a slot the phone room can hold.
 *
 * Fields are underlines rather than boxes — the gynecomastia treatment, kept,
 * because a boxed input would drag the page back toward `.elite`.
 *
 * Validation is the browser's (`required`, `pattern`, `min`) and submit is
 * gated on `checkValidity()`, so a malformed number never reaches the API. The
 * hidden attribution inputs are filled on mount, which is what makes a lead
 * traceable back to the ad that produced it.
 */
export default function CircForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [today, setToday] = useState("") // IST date, also the date input's min
  const [nowMins, setNowMins] = useState(0)
  const [callDate, setCallDate] = useState("")
  const [callTime, setCallTime] = useState("")

  useEffect(() => {
    const { minutes, date } = istNow()
    setNowMins(minutes)
    setToday(date)
  }, [])

  /* Only today's remaining slots are restricted; any later date opens them all.
     `today` is "" until the effect above runs, so the server render and the
     first client render agree on the full list and there is no hydration
     mismatch — the past slots drop out a tick later. */
  const open = useMemo(() => {
    const isToday = callDate !== "" && callDate === today
    return SLOTS.filter((s) => !isToday || s.mins > nowMins)
  }, [callDate, today, nowMins])

  // Keep the selection reachable: a slot that has just fallen into the past —
  // or that belongs to a date the visitor moved off — must not stay selected.
  useEffect(() => {
    if (callTime && !open.some((s) => s.label === callTime)) setCallTime("")
  }, [open, callTime])

  // Fill the attribution fields once the URL is readable on the client.
  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const q = new URLSearchParams(window.location.search)
    ;["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"].forEach((k) => {
      const el = form.querySelector<HTMLInputElement>(`[name="${k}"]`)
      if (el) el.value = q.get(k) || ""
    })
    const pageUrl = form.querySelector<HTMLInputElement>('[name="page_url"]')
    if (pageUrl) pageUrl.value = window.location.href
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setSubmitting(true)
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, string>

    // The lead API has no dedicated concern column, so the clinical answer
    // rides the existing generic `area` field, same as the other pages.
    const payload = {
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      address: raw.address,
      area: raw.concern,
      callDate: raw.callDate, // ISO yyyy-mm-dd, so the sheet sorts correctly
      callTime: raw.callTime, // 12-hour range, e.g. "3:00 PM - 4:00 PM"
      branch: CIRCUMCISION_BRANCH,
      formName: CIRCUMCISION_LEADS_FORM,
      source: raw.utm_source || "direct",
      medium: raw.utm_medium || "",
      campaign: raw.utm_campaign || "",
      pageUrl: raw.page_url || window.location.href,
    }

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Request failed with ${res.status}`)

      track("lead_submit", { branch: CIRCUMCISION_BRANCH, concern: raw.concern })
      // This page's own confirmation, not the piles one — see
      // app/circumcision/thank-you/page.tsx.
      window.location.href = "/circumcision/thank-you"
    } catch {
      setSubmitting(false)
      // Both lines here: the submission has just failed, so this is the last
      // thing standing between the visitor and giving up on the clinic.
      alert(`That did not go through. Please call ${CIRC_PHONES.map((p) => p.display).join(" or ")} instead.`)
    }
  }

  return (
    // Bare fields, no card and no heading of its own: the hero's form column
    // supplies both, and a second "Book Your Consultation" inside the panel
    // would repeat the one already above it.
    //
    // @container: the field grid pairs up on the panel's own width, not the
    // viewport's — it is full-bleed on phones and pairs up again once the
    // hero's form column is wide enough at lg.
    <form ref={formRef} onSubmit={onSubmit} noValidate className="c-form @container">
      <div className="grid gap-x-8 gap-y-2.5 @min-[440px]:grid-cols-2">
        <Field label="Name" htmlFor="circ-name">
          <input id="circ-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className="c-field" />
        </Field>

        <Field label="Phone Number" htmlFor="circ-phone">
          <input
            id="circ-phone"
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            title="A 10-digit Indian mobile number, starting 6–9"
            className="c-field"
          />
        </Field>

        <Field label="Email" htmlFor="circ-email">
          <input id="circ-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="c-field" />
        </Field>

        <Field label="Address" htmlFor="circ-address">
          <input
            id="circ-address"
            name="address"
            type="text"
            required
            autoComplete="street-address"
            placeholder="Area / city"
            className="c-field"
          />
        </Field>

        <Field label="Concern" htmlFor="circ-concern" full>
          <select id="circ-concern" name="concern" required defaultValue="" className="c-field c-select">
            <option value="" disabled>
              Select your concern
            </option>
            {FORM_CONCERNS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Preferred Call Date" htmlFor="circ-date">
          <input
            id="circ-date"
            name="callDate"
            type="date"
            required
            min={today}
            value={callDate}
            onChange={(e) => setCallDate(e.target.value)}
            className="c-field"
          />
        </Field>

        <Field label="Preferred Call Time (IST)" htmlFor="circ-time">
          <select
            id="circ-time"
            name="callTime"
            required
            value={callTime}
            onChange={(e) => setCallTime(e.target.value)}
            className="c-field c-select"
          >
            <option value="" disabled>
              {open.length ? "Select a slot" : "No slots left today"}
            </option>
            {open.map((s) => (
              <option key={s.label}>{s.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <p className="mt-2 text-[0.72rem] text-[var(--c-dim)]">Callbacks run 10:00 AM – 7:00 PM, clinic time.</p>

      <input type="hidden" name="utm_source" />
      <input type="hidden" name="utm_medium" />
      <input type="hidden" name="utm_campaign" />
      <input type="hidden" name="utm_content" />
      <input type="hidden" name="utm_term" />
      <input type="hidden" name="fbclid" />
      <input type="hidden" name="gclid" />
      <input type="hidden" name="page_url" />

      <button type="submit" disabled={submitting} className="c-btn c-btn-solid mt-4 w-full">
        {submitting ? "Sending…" : "Book Your Consultation"}
      </button>

      {/* No phone number under the button. The header, the sticky bar on
          phones, the map section and the footer all carry it, and repeating
          it here gave the form a second, competing way out at the exact
          point the reader is being asked to submit. */}
      <p className="mt-2.5 flex items-start gap-2.5 text-[0.76rem] leading-snug text-[var(--c-dim)]">
        <Lock className="mt-0.5 h-3.5 w-3.5 flex-none text-[var(--c-green)]" aria-hidden />
        Your details are handled privately and confidentially.
    </p>
    </form>
  )
}

/** Label above a baseline. `full` spans both columns of the field grid. */
function Field({
  label,
  htmlFor,
  children,
  full = false,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={`min-w-0 ${full ? "@min-[440px]:col-span-2" : ""}`}>
      <label htmlFor={htmlFor} className="c-label">
        {label}
      </label>
      {children}
    </div>
  )
}

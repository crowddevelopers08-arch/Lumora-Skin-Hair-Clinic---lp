"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Lock } from "lucide-react"
import { track } from "../track"
import { PHONES } from "../config"
import { GYNECOMASTIA_LEADS_FORM } from "@/lib/forms"
import { GYN_BRANCH } from "./content"

const LEAD_ENDPOINT = "/api/leads"

/** What the visitor thinks they need. Rides the lead API's generic `area`
    field, which is the Concern column in the sheet. */
const CONCERNS = [
  "Gynecomastia — not sure of the cause",
  "Excess chest fat",
  "Firm glandular tissue",
  "Puffy / protruding nipples",
  "Revision or second opinion",
] as const

/* ── Callback window (clinic time, IST) ───────────────────────────────────
   Slots are minutes-since-midnight so "is this one in the past?" is a number
   comparison rather than string wrangling. Same window as the other two forms
   — one clinic, one phone room. */
const OPEN_MIN = 10 * 60 // 10:00 AM — first bookable slot
const CLOSE_MIN = 19 * 60 // 7:00 PM — end of the last slot
const STEP_MIN = 60

function toLabel(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
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
 * The booking form, as a set of underlined fields on the dark ground.
 *
 * Deliberately not the other pages' form: no card, no rounded filled inputs,
 * and the time is a native select of the same hour slots rather than a custom
 * popup listbox. Fewer moving parts, and it matches the page's rule-and-
 * baseline geometry instead of fighting it.
 */
export default function GynLeadForm() {
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

  // Only today's remaining slots are restricted; any later date opens them all.
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

    const payload = {
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      address: raw.address,
      // No dedicated treatment column on the lead API — the clinical answer
      // rides `area`, which is the sheet's Concern column.
      area: raw.concern,
      callDate: raw.callDate, // ISO yyyy-mm-dd, so the sheet sorts correctly
      callTime: raw.callTime, // 12-hour range, e.g. "3:00 PM - 4:00 PM"
      branch: GYN_BRANCH,
      // Own TeleCRM FormName and own tab of the sheet — see lib/forms.ts.
      formName: GYNECOMASTIA_LEADS_FORM,
      source: raw.utm_source || "direct",
      medium: raw.utm_medium || "",
      campaign: raw.utm_campaign || "",
      pageUrl: raw.page_url || (typeof window !== "undefined" ? window.location.href : ""),
    }

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Request failed with ${res.status}`)

      track("lead_submit", { branch: GYN_BRANCH, treatment: raw.concern })
      window.location.href = "/gynecomastia/thank-you"
    } catch {
      setSubmitting(false)
      alert(`That did not go through. Please call ${PHONES[0].display} or ${PHONES[1].display} instead.`)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="g-form @container">
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 @min-[540px]:grid-cols-2">
        <Field label="Name" htmlFor="gyn-name">
          <input id="gyn-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className="g-field" />
        </Field>

        <Field label="Phone number" htmlFor="gyn-phone">
          <input
            id="gyn-phone"
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            className="g-field"
          />
        </Field>

        <Field label="Email" htmlFor="gyn-email">
          <input id="gyn-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="g-field" />
        </Field>

        <Field label="Area / city" htmlFor="gyn-address">
          <input
            id="gyn-address"
            name="address"
            type="text"
            required
            autoComplete="address-level2"
            placeholder="e.g. Anna Nagar, Chennai"
            className="g-field"
          />
        </Field>

        <Field label="What describes your concern?" htmlFor="gyn-concern" full>
          <select id="gyn-concern" name="concern" required defaultValue="" className="g-field">
            <option value="" disabled>
              Select your concern
            </option>
            {CONCERNS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Preferred call date" htmlFor="gyn-date">
          <input
            id="gyn-date"
            name="callDate"
            type="date"
            required
            min={today}
            value={callDate}
            onChange={(e) => setCallDate(e.target.value)}
            /* appearance-none: iOS Safari sizes a bare date input from its own
               content and ignores width:100%, overflowing the column. */
            className="g-field appearance-none"
          />
        </Field>

        <Field label="Preferred call time (IST)" htmlFor="gyn-time">
          <select
            id="gyn-time"
            name="callTime"
            required
            value={callTime}
            onChange={(e) => setCallTime(e.target.value)}
            className="g-field"
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

      <input type="hidden" name="utm_source" />
      <input type="hidden" name="utm_medium" />
      <input type="hidden" name="utm_campaign" />
      <input type="hidden" name="utm_content" />
      <input type="hidden" name="utm_term" />
      <input type="hidden" name="fbclid" />
      <input type="hidden" name="gclid" />
      <input type="hidden" name="page_url" />

      <div className="mt-8 flex flex-col gap-4 @min-[540px]:flex-row @min-[540px]:items-center">
        <button type="submit" disabled={submitting} className="g-btn g-btn-solid group/btn w-full @min-[540px]:w-auto">
          {submitting ? "Sending…" : "Request a consultation"}
          {!submitting && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />}
        </button>

        <p className="flex items-start gap-2 text-[0.76rem] leading-snug text-[var(--g-dim)]">
          <Lock className="mt-0.5 h-3.5 w-3.5 flex-none text-[var(--g-accent)]" aria-hidden />
          Your details stay private and confidential.
        </p>
      </div>
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
    <div className={`min-w-0 ${full ? "@min-[540px]:col-span-2" : ""}`}>
      <label htmlFor={htmlFor} className="block text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[var(--g-dim)]">
        {label}
      </label>
      {children}
    </div>
  )
}

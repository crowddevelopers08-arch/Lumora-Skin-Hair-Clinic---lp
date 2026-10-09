"use client"

import { useEffect, useRef, useState } from "react"
import { track } from "./track"
import { BRANCH, PHONE_ALT_DISPLAY, PHONE_DISPLAY, PHONES } from "./config"

const LEAD_ENDPOINT = "/api/leads"

const CONCERNS = ["Bleeding", "Pain", "Swelling or Lump", "Itching", "Other"]

/* ── Callback window (clinic time, IST) ───────────────────────────────────
   Slots are held as minutes-since-midnight so "is this one in the past?" is a
   plain number comparison rather than string wrangling.                     */
const OPEN_MIN = 10 * 60 // 10:00 AM — first bookable slot
const CLOSE_MIN = 19 * 60 // 7:00 PM — last bookable slot, inclusive
const STEP_MIN = 60

function toLabel(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
}

function toRangeLabel(startMins: number) {
  return `${toLabel(startMins)} - ${toLabel(startMins + STEP_MIN)}`
}

const SLOTS: { mins: number; label: string }[] = []
for (let m = OPEN_MIN; m <= 18 * 60; m += STEP_MIN) SLOTS.push({ mins: m, label: toRangeLabel(m) })

/** "Now" in the clinic's timezone, regardless of where the visitor is. */
function istNow() {
  const d = new Date()
  const ist = new Date(d.getTime() + d.getTimezoneOffset() * 60_000 + 5.5 * 3_600_000)
  return {
    minutes: ist.getHours() * 60 + ist.getMinutes(),
    date: `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, "0")}-${String(ist.getDate()).padStart(2, "0")}`,
  }
}

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [today, setToday] = useState("") // IST date, also the date input's min
  const [nowMins, setNowMins] = useState(0)
  const [callDate, setCallDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [showTimePicker, setShowTimePicker] = useState(false)
  const timePickerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Only today's remaining slots are restricted; any later date opens them all.
  const isToday = callDate !== "" && callDate === today
  const isPast = (mins: number) => isToday && mins <= nowMins
  const firstOpen = SLOTS.find((s) => !isPast(s.mins))

  useEffect(() => {
    const { minutes, date } = istNow()
    setNowMins(minutes)
    setToday(date)
  }, [])

  // Keep the selection valid: land on the first open slot, and move off one
  // that has since become unreachable (e.g. after switching back to today).
  useEffect(() => {
    if (!today) return
    const stillOpen = SLOTS.find((s) => s.label === selectedTime && !isPast(s.mins))
    if (!stillOpen) setSelectedTime(firstOpen ? firstOpen.label : "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, callDate, nowMins])

  const closePicker = () => {
    setShowTimePicker(false)
    inputRef.current?.focus()
  }

  // While the popup is open: Escape closes it, and outside clicks dismiss it.
  useEffect(() => {
    if (!showTimePicker) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePicker()
    }
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!timePickerRef.current?.contains(e.target as Node)) setShowTimePicker(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTimePicker])

  // Open on the current choice rather than always at the top of the list
  useEffect(() => {
    if (!showTimePicker) return
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    el?.scrollIntoView({ block: "center" })
    requestAnimationFrame(() => (el ?? listRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])"))?.focus())
  }, [showTimePicker])

  /** Arrow keys walk the open slots; the chips are buttons, so Enter is free. */
  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (!e.key.startsWith("Arrow")) return
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? [])
    if (!items.length) return
    e.preventDefault()
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    const cols = 3
    const step = e.key === "ArrowDown" ? cols : e.key === "ArrowUp" ? -cols : e.key === "ArrowRight" ? 1 : -1
    const next = Math.min(Math.max((i === -1 ? 0 : i) + step, 0), items.length - 1)
    items[i === -1 ? 0 : next].focus()
  }

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
      area: raw.concern,
      callDate: raw.callDate, // ISO yyyy-mm-dd, so the sheet sorts it correctly
      callTime: raw.callTime, // 12-hour with AM/PM, e.g. "3:30 PM"
      branch: raw.branch || BRANCH,
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

      track("lead_submit", { branch: BRANCH, concern: raw.concern })
      setDone(true)
      window.location.href = "/thank-you"
    } catch {
      setSubmitting(false)
      alert(`That did not go through. Please call ${PHONE_DISPLAY} or ${PHONE_ALT_DISPLAY} instead.`)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowTimePicker(false)
    // Update the hidden input value
    const form = formRef.current
    if (form) {
      const input = form.querySelector<HTMLInputElement>('[name="callTime"]')
      if (input) input.value = time
    }
  }

  return (
    // @container: the date/time row pairs up on the card's own width, not the
    // viewport's. The card is full-bleed on phones but drops into the hero's
    // narrow 2fr column at lg, so a viewport breakpoint would get it wrong at
    // one end or the other.
    <div className={`@container rounded-[24px] border border-[var(--e-line)] bg-white ${compact ? "p-4 sm:p-5" : "p-5 sm:p-6"} shadow-[0_30px_60px_-36px_rgba(14,22,38,0.28)]`}>
      {!done ? (
        <form ref={formRef} onSubmit={onSubmit} noValidate>
          <h3 className="text-[1.05rem] font-bold text-[var(--e-ink)]">Book a Consultation</h3>
          <p className="mt-1 text-[0.85rem] text-[var(--e-muted)]">Share 5 quick details and our team will call you back to confirm.</p>

          <div className="mt-4 space-y-3">
            <Field label="Name" htmlFor="lf-name">
              <input id="lf-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputCls} />
            </Field>

            <Field label="Phone Number" htmlFor="lf-phone">
              <input
                id="lf-phone"
                name="phone"
                type="tel"
                required
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                autoComplete="tel"
                placeholder="10-digit mobile number"
                className={inputCls}
              />
            </Field>

            <Field label="Email" htmlFor="lf-email">
              <input
                id="lf-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>

            <Field label="Concern" htmlFor="lf-concern">
              <select id="lf-concern" name="concern" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Select your concern
                </option>
                {CONCERNS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            {/* Stacked until the card can hold two slot labels ("10:00 AM -
                11:00 AM") without wrapping — below that the two controls wrap
                to unequal heights and the date field loses its picker icon. */}
            <div className="grid grid-cols-1 gap-3 @min-[420px]:grid-cols-2 @min-[420px]:gap-2.5">
              <Field label="Preferred Date" htmlFor="lf-calldate">
                <input
                  id="lf-calldate"
                  name="callDate"
                  type="date"
                  required
                  min={today}
                  value={callDate}
                  onChange={(e) => setCallDate(e.target.value)}
                  /* appearance-none: iOS Safari sizes a bare date input from
                     its own content and ignores width:100%, which overflows
                     the column on a phone. */
                  className={`${inputCls} min-w-0 appearance-none`}
                />
              </Field>

              <Field label="Preferred Time" htmlFor="lf-calltime">
                <div className="relative" ref={timePickerRef}>
                  <button
                    id="lf-calltime"
                    ref={inputRef as React.RefObject<HTMLButtonElement>}
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={showTimePicker}
                    aria-controls="lf-timelist"
                    onClick={() => setShowTimePicker((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setShowTimePicker(true)
                        requestAnimationFrame(() =>
                          listRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus(),
                        )
                      }
                    }}
                    className={`${inputCls} min-w-0 cursor-pointer whitespace-nowrap text-left ${selectedTime ? "" : "text-[var(--e-muted)]"}`}
                  >
                    {selectedTime || "Select time"}
                  </button>
                  {/* the real field — a button carries no form value of its own */}
                  <input type="hidden" name="callTime" value={selectedTime} />

                  {showTimePicker && (
                    <div
                      id="lf-timelist"
                      ref={listRef}
                      role="listbox"
                      aria-label="Preferred call time, clinic time"
                      onKeyDown={onListKeyDown}
                      className="absolute bottom-full z-50 mb-1 max-h-64 w-full overflow-y-auto rounded-xl border border-[var(--e-line)] bg-white shadow-[0_20px_60px_-20px_rgba(14,22,38,0.35)]"
                    >
                      <div className="sticky top-0 z-10 border-b border-[var(--e-line)] bg-[var(--e-canvas)] px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--e-muted)]">
                        Clinic time (IST) · 10:00 AM – 7:00 PM
                      </div>

                      {!firstOpen && (
                        <p className="px-3 py-4 text-center text-[0.82rem] leading-relaxed text-[var(--e-muted)]">
                          No slots left today. Please pick another date.
                        </p>
                      )}

                      {SLOTS.map(({ mins, label }) => {
                        const past = isPast(mins)
                        const isSelected = label === selectedTime
                        return (
                          <button
                            key={label}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            disabled={past}
                            onClick={() => handleTimeSelect(label)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[0.9rem] transition-colors duration-150 ${
                              past
                                ? "cursor-not-allowed text-[var(--e-line)] line-through"
                                : isSelected
                                  ? "bg-[var(--e-green-soft)] font-semibold text-[var(--e-green-deep)]"
                                  : "text-[var(--e-ink)] hover:bg-[var(--e-green-soft)]"
                            }`}
                          >
                            <span>{label}</span>
                            {isSelected && <span aria-hidden className="text-[var(--e-green-deep)]">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </div>

          <input type="hidden" name="utm_source" />
          <input type="hidden" name="utm_medium" />
          <input type="hidden" name="utm_campaign" />
          <input type="hidden" name="utm_content" />
          <input type="hidden" name="utm_term" />
          <input type="hidden" name="fbclid" />
          <input type="hidden" name="gclid" />
          <input type="hidden" name="branch" defaultValue={BRANCH} />
          <input type="hidden" name="page_url" />

          <button
            type="submit"
            disabled={submitting}
            style={{ paddingTop: 13, paddingBottom: 13 }}
            className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Booking..." : "Book Your Consultation"}
          </button>

          <p className="mt-2.5 text-center text-[0.75rem] leading-relaxed text-[var(--e-muted)]">
            Or call{" "}
            {PHONES.map((p, i) => (
              <span key={p.tel}>
                {i > 0 && " or "}
                <a href={`tel:${p.tel}`} onClick={() => track("call_click", { branch: BRANCH })} className="font-semibold text-[var(--e-green-deep)]">
                  {p.display}
                </a>
              </span>
            ))}
          </p>
        </form>
      ) : (
        <div className="px-2 py-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--e-green-soft)] text-[1.6rem] text-[var(--e-green-deep)]">
            ✓
          </div>
          <h3 className="mb-2 text-[1.1rem] font-bold text-[var(--e-ink)]">Booked. We&apos;ll call you shortly.</h3>
          <p className="text-[0.9rem] text-[var(--e-muted)]">Our team will reach you on the number you shared to confirm your slot.</p>
        </div>
      )}
    </div>
  )
}

/* min-h-11 keeps every control on a 44px touch target and, more importantly,
   keeps the date input and the time button the same height side by side — the
   two render at different intrinsic heights otherwise. */
const inputCls =
  "min-h-11 w-full rounded-xl border border-[var(--e-line)] bg-[var(--e-canvas)] px-4 py-2.5 text-[0.95rem] text-[var(--e-ink)] transition-all duration-150 focus:border-[var(--e-green)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--e-green-soft)]"

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[var(--e-muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Star } from "lucide-react"
import { LUMORA_LOGO, LUMORA_NAME, PHONES } from "@/components/elite-minima/config"

type Status = { type: "success" | "error"; text: string } | null

const EMPTY = { name: "", email: "", phone: "", suggestions: "" }

export default function ClientFeedbackPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>(null)
  const [rating, setRating] = useState(0)

  // /review sends ?rating=1..3 through. Read it off the URL rather than with
  // useSearchParams, which would force this page behind a Suspense boundary.
  useEffect(() => {
    const raw = Number(new URLSearchParams(window.location.search).get("rating"))
    if (Number.isInteger(raw) && raw >= 1 && raw <= 5) setRating(raw)
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (status) setStatus(null)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const el = formRef.current
    if (el && !el.checkValidity()) {
      el.reportValidity()
      return
    }

    setSubmitting(true)
    setStatus(null)

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating, // 0 when they came straight here without rating first
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus({ type: "success", text: "Thank you — your feedback has reached our team." })
        setForm(EMPTY)
      } else {
        setStatus({ type: "error", text: result.error || "We couldn't submit that. Please try again." })
      }
    } catch {
      setStatus({ type: "error", text: "Network error. Please check your connection and try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    // inline background: `.elite` sets `background: var(--e-paper)` as unlayered
    // CSS, which outranks a Tailwind bg-* utility no matter the specificity
    <div
      className="elite lumora flex min-h-screen items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "var(--e-green-deep)" }}
    >
      <div className="mx-auto my-6 w-full max-w-[560px] rounded-[28px] bg-[var(--e-paper)] p-5 shadow-[0_40px_80px_-40px_rgba(30,15,8,0.75)] sm:p-8">
        <div className="mb-5 flex justify-center sm:mb-7">
          <Image
            src={LUMORA_LOGO.src}
            alt={LUMORA_NAME}
            width={LUMORA_LOGO.width}
            height={LUMORA_LOGO.height}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-[clamp(1.35rem,4.5vw,2rem)] leading-tight text-[var(--e-green-deep)]">Help Us Improve</h1>
          <p className="mx-auto mt-2.5 max-w-[46ch] text-[0.9rem] leading-relaxed text-[var(--e-muted)] sm:text-[0.98rem]">
            Tell us what didn&apos;t meet your expectations. We genuinely value your feedback and will work on making things
            better.
          </p>

          {/* Echo the score they gave on /review, so it is clear it carried over */}
          {rating > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--e-purple-soft)] px-3.5 py-1.5">
              <span className="flex items-center gap-0.5" aria-hidden>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-3.5 w-3.5 ${
                      n <= rating
                        ? "fill-[var(--e-purple)] text-[var(--e-purple)]"
                        : "fill-transparent text-[var(--e-purple-line)]"
                    }`}
                  />
                ))}
              </span>
              <span className="text-[0.78rem] font-semibold text-[var(--e-purple-deep)]">
                You rated us {rating} out of 5
              </span>
            </p>
          )}
        </div>

        {status && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 flex items-start gap-2.5 rounded-2xl border-l-4 p-4 text-[0.9rem] leading-relaxed ${
              status.type === "success"
                ? "border-[var(--e-green)] bg-[var(--e-green-soft)] text-[var(--e-green-deep)]"
                : "border-red-500 bg-red-50 text-red-800"
            }`}
          >
            {status.type === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden />}
            {status.text}
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-3.5">
          <Field label="Full Name" htmlFor="fb-name">
            <input
              id="fb-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              disabled={submitting}
              placeholder="Your full name"
              className={inputCls}
            />
          </Field>

          <Field label="Email Address" htmlFor="fb-email">
            <input
              id="fb-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              disabled={submitting}
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>

          <Field label="Phone Number" htmlFor="fb-phone">
            <input
              id="fb-phone"
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              autoComplete="tel"
              value={form.phone}
              onChange={onChange}
              disabled={submitting}
              placeholder="10-digit mobile number"
              className={inputCls}
            />
          </Field>

          <Field label="Your Suggestions" htmlFor="fb-suggestions">
            <textarea
              id="fb-suggestions"
              name="suggestions"
              required
              rows={4}
              value={form.suggestions}
              onChange={onChange}
              disabled={submitting}
              placeholder="Tell us what we could have done better..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* .elite .btn sets 14px block padding and outranks a py-* utility,
              so the trimmed height is applied inline — same as the lead form. */}
          <button
            type="submit"
            disabled={submitting}
            style={{ paddingTop: 13, paddingBottom: 13 }}
            className="btn btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <a href="/review" className="btn btn-ghost mt-3 w-full">
          <ArrowLeft className="h-4 w-4" />
          Back
        </a>

        <p className="mt-4 text-center text-[0.8rem] leading-relaxed text-[var(--e-muted)]">
          Prefer to talk?{" "}
          {PHONES.map((p, i) => (
            <span key={p.tel}>
              {i > 0 && " or "}
              <a href={`tel:${p.tel}`} className="font-semibold text-[var(--e-green-deep)]">
                {p.display}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-[var(--e-line)] bg-[var(--e-canvas)] px-4 py-2.5 text-[0.95rem] text-[var(--e-ink)] transition-all duration-150 focus:border-[var(--e-green)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--e-green-soft)] disabled:cursor-not-allowed disabled:opacity-60"

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

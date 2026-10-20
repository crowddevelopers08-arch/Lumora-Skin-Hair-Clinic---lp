export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { isValidIndianPhone, normalizeIndianPhone, sendToTeleCRM, TELECRM_PAGES } from "@/lib/telecrm"
import { sendFeedbackToGoogleSheet } from "@/lib/sheets"

/**
 * Private feedback from /client-feedback (1–3 star ratings on /review).
 *
 * Sent in parallel to:
 *  - the "Lumora Feedback" tab of the spreadsheet (lumora-apps-script.gs)
 *  - TeleCRM, as a lead with Lead Request Type "feedback" so the team can
 *    call the client back
 * The client sees success if at least one of the two saved it.
 */

const FEEDBACK_FORM = "Lumora Client Feedback"

interface FeedbackInput {
  name: string
  email: string
  phone: string // normalised 10 digits
  rating: number // 1–5, 0 when they came here without rating
  suggestions: string
  pageUrl: string
}

function isValidEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)
}

function sendFeedbackToTeleCRM(data: FeedbackInput) {
  const ratingLabel = data.rating ? `${data.rating}/5` : "Not given"
  return sendToTeleCRM({
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: `Client feedback (${ratingLabel}): ${data.suggestions}`,
    requestType: "feedback",
    pageName: TELECRM_PAGES.feedback,
    formName: FEEDBACK_FORM,
    sourceUrl: data.pageUrl,
    notes: [
      `Lead Source: ${FEEDBACK_FORM}`,
      `Live URL: ${data.pageUrl || "Not provided"}`,
      `Rating: ${ratingLabel}`,
      `Email: ${data.email}`,
    ],
    fields: {
      Rating: data.rating || "",
      Feedback: data.suggestions,
      Lead_Source: "client-feedback",
    },
  })
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const name = String(body.name ?? "").trim().slice(0, 120)
  const email = String(body.email ?? "").trim().slice(0, 200)
  const rawPhone = String(body.phone ?? "")
  const suggestions = String(body.suggestions ?? "").trim().slice(0, 3000)
  const pageUrl = String(body.pageUrl ?? "").trim().slice(0, 1000)
  const ratingNum = Number(body.rating)
  const rating = Number.isInteger(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : 0

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (!isValidIndianPhone(rawPhone)) {
    return NextResponse.json({ error: "Please enter a valid 10-digit Indian mobile number." }, { status: 400 })
  }
  if (!suggestions) {
    return NextResponse.json({ error: "Please share your suggestions." }, { status: 400 })
  }

  const data: FeedbackInput = { name, email, phone: normalizeIndianPhone(rawPhone), rating, suggestions, pageUrl }

  const [sheetResult, crmResult] = await Promise.allSettled([
    sendFeedbackToGoogleSheet(data),
    sendFeedbackToTeleCRM(data),
  ])

  if (sheetResult.status === "rejected") console.error("[Google Sheets - Feedback] Error:", sheetResult.reason?.message)
  if (crmResult.status === "rejected") console.error("[TeleCRM - Feedback] Error:", crmResult.reason?.message)

  const sheet = sheetResult.status === "fulfilled" ? "ok" : "failed"
  const crm = crmResult.status === "fulfilled" ? "ok" : "failed"

  if (sheet === "failed" && crm === "failed") {
    return NextResponse.json({ error: "We couldn't submit that. Please try again.", sheet, crm }, { status: 502 })
  }

  return NextResponse.json({ success: true, sheet, crm }, { status: 201 })
}

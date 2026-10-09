import { NextRequest, NextResponse } from "next/server"
import { sendFeedbackToGoogleSheet } from "@/lib/sheets"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Client feedback from /client-feedback. Nothing is persisted locally — the
// Lumora Google Sheet (lumora-apps-script.gs) is the system of record.

/** Same rule the booking form enforces client-side, applied again server-side. */
function isValidIndianPhone(raw: string) {
  const cleaned = raw.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "")
  return /^[6-9]\d{9}$/.test(cleaned)
}

function isValidEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim())
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { name = "", email = "", phone = "", suggestions = "", pageUrl = "" } = body

  // Star score from /review. 0 means they reached this page without rating.
  const parsedRating = Number(body.rating)
  const rating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 0

  if (!name.trim()) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (!isValidIndianPhone(phone)) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit Indian mobile number." },
      { status: 400 },
    )
  }
  if (!suggestions.trim()) {
    return NextResponse.json({ error: "Please share your suggestions." }, { status: 400 })
  }

  try {
    await sendFeedbackToGoogleSheet({ name, email, phone, suggestions, pageUrl, rating })
    return NextResponse.json(
      { success: true, sheetSynced: true, message: "Feedback delivered to Google Sheets" },
      { status: 201 },
    )
  } catch (err) {
    console.error("Google Sheets feedback sync failed:", err)
    return NextResponse.json(
      { success: false, sheetSynced: false, error: "We couldn't submit that. Please try again." },
      { status: 502 },
    )
  }
}

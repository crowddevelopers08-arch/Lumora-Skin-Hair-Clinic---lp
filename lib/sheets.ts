// lib/sheets.ts
// Pushes Elite Minima submissions to the Google Sheet via the Apps Script web
// app (see eliteminima-apps-script.gs). One deployment serves both forms; the
// `formType` field decides which tab the row lands in.
//
// Best-effort by design: callers should catch and record the failure without
// blocking the visitor's submission.

import { PILES_LEADS_FORM } from "./forms"

/** Tab names — these must match the ones in eliteminima-apps-script.gs. */
export const LEADS_TAB = PILES_LEADS_FORM
/** Lumora feedback tab — must match FEEDBACK_TAB in lumora-apps-script.gs. */
export const FEEDBACK_TAB = "Lumora Feedback"

export interface SheetLead {
  name: string
  phone: string
  email?: string | null
  address?: string | null
  area?: string | null // the concern picked in the booking form
  duration?: string | null // how long it has been
  callDate?: string | null // preferred call date, ISO yyyy-mm-dd
  callTime?: string | null // preferred call time, e.g. "3:30 PM"
  branch?: string | null
  source?: string | null // utm_source or "direct"
  medium?: string | null
  campaign?: string | null
  pageUrl?: string | null
  /** Which form this came from — see lib/forms.ts. Doubles as the sheet tab. */
  formName?: string | null
}

export interface SheetFeedback {
  name: string
  email: string
  phone: string
  suggestions: string
  pageUrl?: string | null
  /** Star score from /review, 1–5. 0 when they skipped the rating step. */
  rating?: number | null
}

export interface SheetResult {
  synced: boolean
  raw?: unknown
}

/** Shared transport. Apps Script /exec 302-redirects to its content, and
 *  returns an HTML error page if the script throws before our JSON response. */
async function postToAppsScript(payload: Record<string, unknown>): Promise<SheetResult> {
  const endpoint = process.env.GOOGLE_SHEETS_URL
  if (!endpoint) {
    throw new Error("GOOGLE_SHEETS_URL environment variable is not set")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
    })

    const responseText = await response.text()

    let data: { error?: string; success?: boolean } = {}
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch {
      throw new Error("Google Sheets returned a non-JSON response")
    }

    if (!response.ok || data.error) {
      throw new Error(data.error || `HTTP ${response.status} from Google Sheets`)
    }

    return { synced: true, raw: data }
  } finally {
    clearTimeout(timeout)
  }
}

export async function sendToGoogleSheet(lead: SheetLead): Promise<SheetResult> {
  return postToAppsScript({
    formType: "lead",
    // Each form has its own tab. Unnamed submissions keep landing in the piles
    // tab, which is where every lead went before there was a second form.
    sheetTab: lead.formName || LEADS_TAB,
    formName: lead.formName || LEADS_TAB,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name: lead.name,
    phone: lead.phone.replace(/\D/g, ""),
    email: lead.email || "",
    address: lead.address || "",
    area: lead.area || "",
    duration: lead.duration || "",
    callDate: lead.callDate || "",
    callTime: lead.callTime || "",
    branch: lead.branch || "Elite Minima Clinic",
    source: lead.source || "direct",
    medium: lead.medium || "",
    campaign: lead.campaign || "",
    pageUrl: lead.pageUrl || "",
  })
}

export async function sendFeedbackToGoogleSheet(feedback: SheetFeedback): Promise<SheetResult> {
  return postToAppsScript({
    formType: "feedback",
    sheetTab: FEEDBACK_TAB,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name: feedback.name.trim(),
    email: feedback.email.trim(),
    phone: feedback.phone.replace(/\D/g, ""),
    rating: feedback.rating || "",
    suggestions: feedback.suggestions.trim(),
    pageUrl: feedback.pageUrl || "",
    source: "Lumora — Client Feedback",
  })
}

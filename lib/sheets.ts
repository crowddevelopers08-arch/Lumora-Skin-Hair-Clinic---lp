// lib/sheets.ts
// Pushes Lumora submissions to the Google Sheet via the Apps Script web app
// (see lumora-apps-script.gs). One deployment serves both the landing page
// lead form and client feedback; `formType` decides which tab the row lands in.
//
// Best-effort by design: callers should catch and record the failure without
// blocking the visitor's submission.

import { LUMORA_LEADS_FORM } from "./forms"

/** Lead tab — must match LEADS_TAB in lumora-apps-script.gs. */
export const LEADS_TAB = LUMORA_LEADS_FORM
/** Lumora feedback tab — must match FEEDBACK_TAB in lumora-apps-script.gs. */
export const FEEDBACK_TAB = "Lumora Feedback"

export interface SheetLead {
  name: string
  phone: string
  area?: string | null // the concern picked in the booking form
  source?: string | null // utm_source or "direct"
  medium?: string | null
  campaign?: string | null
  term?: string | null
  content?: string | null
  gclid?: string | null
  fbclid?: string | null
  formId?: string | null // which form on the page: form1 hero, form2 footer, form3 pop-up
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
  const formName = lead.formName || LEADS_TAB
  return postToAppsScript({
    formType: "lead",
    sheetTab: formName,
    formName,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name: lead.name.trim(),
    phone: lead.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""),
    area: lead.area || "",
    source: lead.source || "direct",
    medium: lead.medium || "",
    campaign: lead.campaign || "",
    term: lead.term || "",
    content: lead.content || "",
    gclid: lead.gclid || "",
    fbclid: lead.fbclid || "",
    formId: lead.formId || "",
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

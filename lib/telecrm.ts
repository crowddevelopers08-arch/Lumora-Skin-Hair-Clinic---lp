// lib/telecrm.ts
// Pushes Elite Minima submissions to TeleCRM — booking leads from the landing
// page form, and client feedback from /client-feedback. Best-effort: callers
// should catch and record the failure without blocking the submission.

export interface TeleCRMLead {
  name: string
  phone: string
  email?: string | null
  address?: string | null
  area?: string | null // hair concern / symptom
  duration?: string | null // how long it has been
  callDate?: string | null // preferred call date, ISO yyyy-mm-dd
  callTime?: string | null // preferred call time, e.g. "3:30 PM"
  branch?: string | null
  source?: string | null // utm_source or "direct"
  medium?: string | null
  campaign?: string | null
  pageUrl?: string | null
  /** Which form this came from — see lib/forms.ts. Lands in TeleCRM's FormName
   *  so the two landing pages can be filtered apart in the same inbox. */
  formName?: string | null
}

export interface TeleCRMResult {
  synced: boolean
  telecrmId: string | null
  raw?: unknown
}

const FALLBACK_PAGE = "https://eliteminima.in/"

export async function sendToTeleCRM(lead: TeleCRMLead): Promise<TeleCRMResult> {
  const endpoint = process.env.TELECRM_API_URL
  if (!endpoint) {
    throw new Error("TELECRM_API_URL environment variable is not set")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  const sourceURL = lead.pageUrl || FALLBACK_PAGE
  const branch = lead.branch || "Elite Minima Clinic"
  /* Unnamed submissions keep the label every lead carried before there was a
     second form, so nothing already in the CRM changes meaning. */
  const formName = lead.formName || "Elite Minima LP Leads"

  const payload = {
    fields: {
      Id: "",
      name: lead.name,
      phone: lead.phone.replace(/\D/g, ""),
      Country: "",
      LeadID: "",
      CreatedOn: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      "Lead Stage": "",
      "Lead Status": "new",
      "Lead Request Type": "consultation",
      PageName: sourceURL,
      Source_URL: sourceURL,
      Branch: branch,
      Email: lead.email || "",
      Address: lead.address || "",
      Area_of_Pain: lead.area || "",
      Duration: lead.duration || "",
      Preferred_Call_Date: lead.callDate || "",
      Preferred_Call_Time: lead.callTime || "",
      FormName: formName,
      Lead_Source: lead.source || "direct",
      Campaign: lead.campaign || "",
      Medium: lead.medium || "",
      Source: sourceURL,
    },
    actions: [
      { type: "SYSTEM_NOTE", text: `Form: ${formName}` },
      { type: "SYSTEM_NOTE", text: `Branch: ${branch}` },
      { type: "SYSTEM_NOTE", text: `Email: ${lead.email || "Not specified"}` },
      { type: "SYSTEM_NOTE", text: `Address: ${lead.address || "Not specified"}` },
      { type: "SYSTEM_NOTE", text: `Concern: ${lead.area || "Not specified"}` },
      { type: "SYSTEM_NOTE", text: `Duration: ${lead.duration || "Not specified"}` },
      {
        type: "SYSTEM_NOTE",
        text: `Preferred callback: ${[lead.callDate, lead.callTime].filter(Boolean).join(" at ") || "Not specified"}`,
      },
      { type: "SYSTEM_NOTE", text: `Campaign source: ${lead.source || "direct"}` },
      { type: "SYSTEM_NOTE", text: `Campaign: ${lead.campaign || "Not specified"}` },
      { type: "SYSTEM_NOTE", text: `Landing page: ${sourceURL}` },
    ],
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TELECRM_API_KEY}`,
        "X-Client-ID": "nextjs-website-integration",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    // TeleCRM commonly returns 204 No Content on success.
    if (response.status === 204) {
      return { synced: true, telecrmId: null }
    }

    const responseText = await response.text()

    if (
      responseText.trim().startsWith("<!DOCTYPE") ||
      responseText.trim().startsWith("<html") ||
      responseText.includes("<!DOCTYPE html>")
    ) {
      throw new Error("TeleCRM returned an HTML response instead of JSON")
    }

    const data = responseText ? JSON.parse(responseText) : {}
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status} from TeleCRM`)
    }

    return {
      synced: true,
      telecrmId: data?.id || data?.leadId || null,
      raw: data,
    }
  } finally {
    clearTimeout(timeout)
  }
}

/* ── Client feedback ─────────────────────────────────────────────────────── */

export interface TeleCRMFeedback {
  name: string
  email: string
  phone: string
  suggestions: string
  pageUrl?: string | null
  /** Star score from /review, 1–5. 0 when they skipped the rating step. */
  rating?: number | null
}

/**
 * Feedback lands in the same TeleCRM inbox as a lead, tagged so it can be
 * filtered apart: Lead Request Type "feedback" and a distinct FormName. It is
 * still worth pushing — someone unhappy enough to write in is the contact the
 * clinic most needs to see.
 */
export async function sendFeedbackToTeleCRM(feedback: TeleCRMFeedback): Promise<TeleCRMResult> {
  const endpoint = process.env.TELECRM_API_URL
  if (!endpoint) {
    throw new Error("TELECRM_API_URL environment variable is not set")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  const sourceURL = feedback.pageUrl || `${FALLBACK_PAGE}client-feedback`
  const suggestions = feedback.suggestions.trim()
  const rating = feedback.rating || 0
  const ratingLabel = rating ? `${rating}/5` : "Not rated"

  const payload = {
    fields: {
      Id: "",
      name: feedback.name.trim(),
      phone: feedback.phone.replace(/\D/g, ""),
      Email: feedback.email.trim(),
      Country: "India",
      LeadID: "",
      CreatedOn: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      "Lead Stage": "",
      "Lead Status": "new",
      "Lead Request Type": "feedback",
      PageName: sourceURL,
      Source_URL: sourceURL,
      Branch: "Elite Minima Clinic",
      Feedback: suggestions,
      Rating: rating || "",
      FormName: "Elite Minima Client Feedback",
      Lead_Source: "client-feedback",
      Source: sourceURL,
    },
    actions: [
      { type: "SYSTEM_NOTE", text: "Lead Source: Elite Minima client feedback form" },
      { type: "SYSTEM_NOTE", text: `Star rating: ${ratingLabel}` },
      { type: "SYSTEM_NOTE", text: `Feedback: ${suggestions}` },
      { type: "SYSTEM_NOTE", text: `Email: ${feedback.email.trim()}` },
      { type: "SYSTEM_NOTE", text: `Submitted from: ${sourceURL}` },
    ],
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TELECRM_API_KEY}`,
        "X-Client-ID": "nextjs-website-integration",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (response.status === 204) {
      return { synced: true, telecrmId: null }
    }

    const responseText = await response.text()

    if (
      responseText.trim().startsWith("<!DOCTYPE") ||
      responseText.trim().startsWith("<html") ||
      responseText.includes("<!DOCTYPE html>")
    ) {
      throw new Error("TeleCRM returned an HTML response instead of JSON")
    }

    const data = responseText ? JSON.parse(responseText) : {}
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status} from TeleCRM`)
    }

    return {
      synced: true,
      telecrmId: data?.id || data?.leadId || null,
      raw: data,
    }
  } finally {
    clearTimeout(timeout)
  }
}

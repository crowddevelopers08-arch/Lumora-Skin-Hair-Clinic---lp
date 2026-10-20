// lib/telecrm.ts
// One generic TeleCRM sender, used by both routes:
//   - app/api/leads     → requestType "consultation" (landing page booking form)
//   - app/api/feedback  → requestType "feedback"     (/client-feedback, 1–3 stars)
// Both land in the same TeleCRM inbox and are told apart by Lead Request Type,
// PageName and FormName. Callers run this beside the Google Sheet write and
// treat a failure as non-fatal.

const BRANCH = "Lumora Skin and Hair"

/** Site root, for leads that arrive without a page URL. */
export const SITE_URL = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://lumoraskinandhair.com").replace(/\/$/, "")}/`

/** TeleCRM PageName per form — how the team filters the inbox. */
export const TELECRM_PAGES = {
  lead: "lumora-skin-hair-lp",
  feedback: "lumora-client-feedback",
} as const

/**
 * Normalises an Indian mobile to its 10 digits: strips spaces, dashes,
 * brackets, and a +91 / 91 / 0 prefix. Returns "" when nothing usable is left,
 * so callers can validate the result with /^[6-9]\d{9}$/.
 */
export function normalizeIndianPhone(raw: string): string {
  let d = String(raw ?? "").replace(/\D/g, "")
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2)
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1)
  return d
}

export function isValidIndianPhone(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianPhone(raw))
}

export interface TeleCRMInput {
  name: string
  phone: string
  email?: string | null
  /** One-line summary, shown first in the lead's notes. */
  message: string
  requestType: "consultation" | "feedback"
  /** TELECRM_PAGES.lead / .feedback */
  pageName: string
  /** Label shown in TeleCRM's FormName — see lib/forms.ts. */
  formName: string
  /** The live URL the form was submitted from. */
  sourceUrl?: string | null
  /** Each becomes its own SYSTEM_NOTE on the lead, in this order. */
  notes?: string[]
  /** Extra TeleCRM custom fields (Concern, Campaign, Rating…). Empty values are dropped. */
  fields?: Record<string, string | number | null | undefined>
}

export interface TeleCRMResult {
  synced: boolean
  telecrmId: string | null
  raw?: unknown
}

export async function sendToTeleCRM(input: TeleCRMInput): Promise<TeleCRMResult> {
  const endpoint = process.env.TELECRM_API_URL
  if (!endpoint) throw new Error("TELECRM_API_URL environment variable is not set")
  if (!process.env.TELECRM_API_KEY) throw new Error("TELECRM_API_KEY environment variable is not set")

  const sourceURL = input.sourceUrl || SITE_URL
  const extra = Object.fromEntries(
    Object.entries(input.fields ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  )

  const payload = {
    fields: {
      Id: "",
      name: input.name.trim(),
      phone: normalizeIndianPhone(input.phone),
      Email: input.email?.trim() || "",
      Country: "India",
      LeadID: "",
      CreatedOn: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      "Lead Stage": "",
      "Lead Status": "new",
      "Lead Request Type": input.requestType,
      PageName: input.pageName,
      Source_URL: sourceURL,
      Source: sourceURL,
      Branch: BRANCH,
      FormName: input.formName,
      ...extra,
    },
    actions: [input.message, ...(input.notes ?? [])]
      .filter(Boolean)
      .map((text) => ({ type: "SYSTEM_NOTE", text })),
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

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
      cache: "no-store",
    })

    // TeleCRM commonly returns 204 No Content on success.
    if (response.status === 204) return { synced: true, telecrmId: null }

    const text = await response.text()
    if (/^\s*<(!DOCTYPE|html)/i.test(text)) {
      throw new Error(`TeleCRM returned an HTML page (HTTP ${response.status}) — check TELECRM_API_URL`)
    }

    let data: { id?: string; leadId?: string; message?: string; error?: string } = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      if (!response.ok) throw new Error(`HTTP ${response.status} from TeleCRM: ${text.slice(0, 200)}`)
    }
    if (!response.ok) throw new Error(data.message || data.error || `HTTP ${response.status} from TeleCRM`)

    return { synced: true, telecrmId: data.id || data.leadId || null, raw: data }
  } finally {
    clearTimeout(timeout)
  }
}

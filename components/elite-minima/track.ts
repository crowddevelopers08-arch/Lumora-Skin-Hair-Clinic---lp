// Lightweight analytics helper.
// Pushes to dataLayer (GTM), forwards Lead / Contact events to Meta Pixel when
// fbq is present, and reports the Google Ads click-to-call conversion when
// gtag is present.

declare global {
  interface Window {
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    /** Google's own snippet, defined in app/layout.tsx for inline onclick use. */
    gtag_report_conversion?: (url?: string) => boolean
  }
}

/** Click-to-call conversion, from the Google Ads UI. Also in the layout's
    gtag_report_conversion; kept in step with it by hand. */
const CALL_CONVERSION = "AW-18361786197/g1x2CPjm1N8cENW-yrNE"

export function track(name: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(Object.assign({ event: name }, data || {}))
  if (typeof window.fbq === "function") {
    if (name === "lead_submit") window.fbq("track", "Lead")
    if (name === "call_click" || name === "whatsapp_click") window.fbq("track", "Contact")
  }
  // Every phone link on the site already reports call_click, so hanging the
  // Ads conversion here covers all of them rather than needing an onclick
  // added to each one.
  //
  // No event_callback and no preventDefault, unlike Google's snippet: a `tel:`
  // link hands off to the dialler without unloading the page, so there is
  // nothing to delay — and swallowing the click would stop the call.
  if (name === "call_click" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: CALL_CONVERSION,
      value: 1.0,
      currency: "INR",
    })
  }
}

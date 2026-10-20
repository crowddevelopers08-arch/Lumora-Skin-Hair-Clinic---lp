// Clinic details for the review flow — /review and /client-feedback.

export const LUMORA_NAME = "Lumora Skin & Hair Clinic"
/** Lumora logo with a transparent background. */
export const LUMORA_LOGO = { src: "/logo.png", width: 427, height: 128 } as const

/** Shown under the feedback form as "Prefer to talk?". */
export const PHONES = [{ display: "+91 93602 09743", tel: "+919360209743" }] as const

const MAP_QUERY = "Lumora Skin and Hair, KK Road, Viluppuram"

/* 4–5 stars on /review go here. Google Business Profile → "Ask for reviews"
   → copy the g.page link. While it still holds the placeholder, the review
   page falls back to a Maps search for the clinic instead of 404-ing. */
export const GOOGLE_REVIEW_URL = "https://g.page/r/Cbt7OaXlaHYWEBM/review"

export const GOOGLE_REVIEW_FALLBACK_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(MAP_QUERY)

/** True while GOOGLE_REVIEW_URL is still the untouched placeholder. */
export const REVIEW_LINK_IS_PLACEHOLDER = GOOGLE_REVIEW_URL.includes("REPLACE_WITH")

import { redirect } from "next/navigation"

/**
 * The general page moved to `/` when it became the site's front door. This
 * redirect keeps every existing link, ad and bookmark pointing at `/general`
 * working, and keeps one canonical URL for the content rather than serving it
 * from two — the same arrangement `/piles` had before the swap.
 *
 * `/general/thank-you` is a separate route and is untouched: the general lead
 * form still posts through to it.
 */
export default function GeneralRedirect() {
  redirect("/")
}

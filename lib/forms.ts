// lib/forms.ts
// One label per lead form on the site.
//
// The same string does two jobs: TeleCRM records it as `FormName`, and the Apps
// Script uses it to pick which tab of the sheet the row lands in. Keeping them
// identical is the point — a form can then be filtered the same way in either
// system, and there is one string to change rather than two that can drift.
//
// Safe to import from client components: no dependencies, no env access.
//
// NOTE: Adding a form here means adding the matching tab in
// lumora-apps-script.gs and re-deploying it.

/** The Lumora landing page form (/). Must match LEADS_TAB in
 *  lumora-apps-script.gs and tracking.formName in components/lumora/config.js. */
export const LUMORA_LEADS_FORM = "Lumora LP Leads"

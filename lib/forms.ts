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
// ⚠️ Adding a form here means adding the matching tab in
// eliteminima-apps-script.gs (LEAD_TABS) and re-deploying it, or its rows fall
// back to the piles tab.

/** The original landing page form (/), which sells piles treatment. */
export const PILES_LEADS_FORM = "Elite Minima Piles Leads"

/** The general page form (/general) — piles, circumcision and gynecomastia. */
export const GENERAL_LEADS_FORM = "Elite Minima General Leads"

/** The gynecomastia page form (/gynecomastia) — male breast reduction only. */
export const GYNECOMASTIA_LEADS_FORM = "Elite Minima Gynecomastia Leads"

/** The dedicated circumcision page form (/circumcision). */
export const CIRCUMCISION_LEADS_FORM = "Elite Minima Circumcision Leads"

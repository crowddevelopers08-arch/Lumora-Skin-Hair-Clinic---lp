export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { isValidIndianPhone, normalizeIndianPhone, sendToTeleCRM, TELECRM_PAGES } from '@/lib/telecrm'
import { sendToGoogleSheet } from '@/lib/sheets'
import { LUMORA_LEADS_FORM } from '@/lib/forms'

/**
 * Booking form on the landing page (/) — hero, map section and pop-up.
 *
 * Sent in parallel to:
 *  - the "Lumora LP Leads" tab of the spreadsheet (lumora-apps-script.gs)
 *  - TeleCRM, as a "consultation" lead
 * Nothing is stored locally. The visitor sees success if at least one of the
 * two saved it; if both fail they get an error and the call-us fallback.
 */

const FORM_POSITIONS: Record<string, string> = { form1: 'Hero', form2: 'Map section', form3: 'Pop-up' }

interface LeadInput {
  name: string
  phone: string // normalised 10 digits
  concern: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
  gclid: string
  fbclid: string
  formId: string
  pageUrl: string
}

/** Trims a string field and caps its length; anything else becomes ''. */
function clean(value: unknown, max = 300) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function sendLeadToTeleCRM(lead: LeadInput) {
  const position = FORM_POSITIONS[lead.formId] || lead.formId || 'Not specified'
  return sendToTeleCRM({
    name: lead.name,
    phone: lead.phone,
    message: `Consultation enquiry - ${lead.concern || 'Skin & hair treatment'} at Lumora Skin and Hair`,
    requestType: 'consultation',
    pageName: TELECRM_PAGES.lead,
    formName: LUMORA_LEADS_FORM,
    sourceUrl: lead.pageUrl,
    notes: [
      `Lead Source: ${LUMORA_LEADS_FORM}`,
      `Live URL: ${lead.pageUrl || 'Not provided'}`,
      `Concern: ${lead.concern || 'Not specified'}`,
      `Form: ${position}`,
      `Campaign: ${[lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'direct'}`,
      ...(lead.term ? [`Keyword / Term: ${lead.term}`] : []),
      ...(lead.gclid ? ['Click: Google Ads (gclid)'] : []),
      ...(lead.fbclid ? ['Click: Meta Ads (fbclid)'] : []),
    ],
    fields: {
      Concern: lead.concern,
      Area_of_Pain: lead.concern,
      Lead_Source: lead.source,
      Medium: lead.medium,
      Campaign: lead.campaign,
      Term: lead.term,
      Content: lead.content,
      GCLID: lead.gclid,
      FBCLID: lead.fbclid,
    },
  })
}

function sendLeadToSheet(lead: LeadInput) {
  return sendToGoogleSheet({
    name: lead.name,
    phone: lead.phone,
    area: lead.concern,
    source: lead.source,
    medium: lead.medium,
    campaign: lead.campaign,
    term: lead.term,
    content: lead.content,
    gclid: lead.gclid,
    fbclid: lead.fbclid,
    formId: lead.formId,
    pageUrl: lead.pageUrl,
    formName: LUMORA_LEADS_FORM,
  })
}

export async function GET() {
  return NextResponse.json({ message: 'Leads are stored in Google Sheets and TeleCRM, not in a database.' })
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const name = clean(body.name, 120)
  const rawPhone = clean(body.phone, 20)

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  }
  if (!isValidIndianPhone(rawPhone)) {
    return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 })
  }

  const lead: LeadInput = {
    name,
    phone: normalizeIndianPhone(rawPhone),
    concern: clean(body.area || body.concern),
    source: clean(body.source) || 'direct',
    medium: clean(body.medium),
    campaign: clean(body.campaign),
    term: clean(body.term),
    content: clean(body.content),
    gclid: clean(body.gclid, 500),
    fbclid: clean(body.fbclid, 500),
    formId: clean(body.formId, 40),
    pageUrl: clean(body.pageUrl, 1000),
  }

  const [sheetResult, crmResult] = await Promise.allSettled([sendLeadToSheet(lead), sendLeadToTeleCRM(lead)])

  if (sheetResult.status === 'rejected') console.error('[Google Sheets] Error:', sheetResult.reason?.message)
  if (crmResult.status === 'rejected') console.error('[TeleCRM] Error:', crmResult.reason?.message)

  const sheet = sheetResult.status === 'fulfilled' ? 'ok' : 'failed'
  const crm = crmResult.status === 'fulfilled' ? 'ok' : 'failed'

  // Both failed → the lead exists nowhere, so the visitor must be told.
  if (sheet === 'failed' && crm === 'failed') {
    return NextResponse.json({ error: "We couldn't submit that. Please call us.", sheet, crm }, { status: 502 })
  }

  return NextResponse.json(
    { success: true, sheet, crm, route: LUMORA_LEADS_FORM, timestamp: new Date().toISOString() },
    { status: 201 },
  )
}

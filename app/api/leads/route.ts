import { NextRequest, NextResponse } from 'next/server'
import { sendToTeleCRM } from '@/lib/telecrm'
import { sendToGoogleSheet } from '@/lib/sheets'

export const runtime = 'nodejs'

// Leads are NOT persisted to a database. Each submission is delivered straight
// to TeleCRM and the Google Sheet, which together act as the system of record.

export async function GET() {
  // Nothing to read — leads live in Google Sheets / TeleCRM.
  return NextResponse.json({
    leads: [],
    message: 'Leads are stored in Google Sheets and TeleCRM, not in a database.',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, address, area, duration, callDate, callTime, branch, source, medium, campaign, pageUrl, formName } =
      body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const leadPayload = {
      name,
      phone,
      email,
      address,
      area,
      duration,
      callDate,
      callTime,
      branch: branch || 'Elite Minima Clinic',
      source,
      medium,
      campaign,
      pageUrl,
      // Which form this came from (lib/forms.ts). TeleCRM files it under
      // FormName and the Apps Script routes it to the matching tab; left unset
      // both fall back to the piles form, which is where every lead used to go.
      formName,
    }

    // Deliver to TeleCRM + Google Sheet in parallel; independent best-effort.
    const [telecrmOutcome, sheetOutcome] = await Promise.allSettled([
      sendToTeleCRM(leadPayload),
      sendToGoogleSheet(leadPayload),
    ])

    let telecrmSynced = false
    if (telecrmOutcome.status === 'fulfilled') {
      telecrmSynced = telecrmOutcome.value.synced
    } else {
      console.error('TeleCRM sync failed:', telecrmOutcome.reason)
    }

    let sheetSynced = false
    if (sheetOutcome.status === 'fulfilled') {
      sheetSynced = sheetOutcome.value.synced
    } else {
      console.error('Google Sheets sync failed:', sheetOutcome.reason)
    }

    // The lead is captured as long as it reached at least one destination.
    const captured = telecrmSynced || sheetSynced

    return NextResponse.json(
      {
        success: captured,
        telecrmSynced,
        sheetSynced,
        message: captured
          ? telecrmSynced && sheetSynced
            ? 'Lead delivered to TeleCRM and Google Sheets'
            : 'Lead captured; one integration failed'
          : 'Lead could not be delivered to any destination',
      },
      { status: captured ? 200 : 502 },
    )
  } catch (error) {
    console.error('Error handling lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

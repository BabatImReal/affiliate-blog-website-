import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Stub: returns the standard envelope. Real query logic added in admin-dashboard feature.
export async function GET() {
  return NextResponse.json({ success: true, data: { views: 0, clicks: 0 } })
}

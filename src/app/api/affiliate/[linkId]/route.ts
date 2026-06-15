import { type NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { affiliateLinks, linkClicks } from '@/lib/db/schema'
import { hashIp } from '@/lib/affiliate'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { linkId: string } },
) {
  // 1. Look up the affiliate link (server-side only).
  const [link] = await db
    .select()
    .from(affiliateLinks)
    .where(eq(affiliateLinks.id, params.linkId))
    .limit(1)

  if (!link) {
    return NextResponse.json(
      { success: false, error: 'Affiliate link not found' },
      { status: 404 },
    )
  }

  // 2. Log the click FIRST (financial data — must not be lost on redirect).
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  await db.insert(linkClicks).values({
    affiliateLinkId: link.id,
    userAgent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer'),
    ipHash: hashIp(ip),
  })

  // 3. Server-side 302 redirect to destination. NEVER redirect client-side.
  return NextResponse.redirect(link.url, 302)
}

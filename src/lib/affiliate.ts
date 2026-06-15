import { createHash } from 'crypto'

// Hash an IP address (SHA-256). Never store or log the raw IP.
export function hashIp(ip: string | null): string | null {
  if (!ip) return null
  return createHash('sha256').update(ip).digest('hex')
}

export type AffiliatePlatform =
  | 'tiktok_shop'
  | 'shopee'
  | 'lazada'
  | 'amazon'
  | 'other'

// The canonical tracked URL the UI must use — never a raw affiliate href.
export function trackedHref(linkId: string): string {
  return `/api/affiliate/${linkId}`
}

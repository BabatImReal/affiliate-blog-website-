import { ExternalLink } from 'lucide-react'
import { trackedHref } from '@/lib/affiliate'
import { cn } from '@/lib/utils'

interface AffiliateButtonProps {
  linkId: string
  platform: string
  label: string
  displayUrl?: string
}

const PLATFORM_STYLES: Record<string, string> = {
  tiktok_shop: 'bg-[#FE2C55] hover:bg-[#e0244a] text-white focus-visible:ring-[#FE2C55]',
  shopee: 'bg-[#EE4D2D] hover:bg-[#d54225] text-white focus-visible:ring-[#EE4D2D]',
  lazada: 'bg-[#6E2EBC] hover:bg-[#5d27a0] text-white focus-visible:ring-[#6E2EBC]',
  amazon: 'bg-[#FF9900] hover:bg-[#e88b00] text-editorial-ink focus-visible:ring-[#FF9900]',
  other: 'bg-editorial-ink hover:bg-black text-white focus-visible:ring-editorial-ink',
}

const PLATFORM_NAMES: Record<string, string> = {
  tiktok_shop: 'TikTok Shop',
  shopee: 'Shopee',
  lazada: 'Lazada',
  amazon: 'Amazon',
  other: 'Mua hàng',
}

export function AffiliateButton({
  linkId,
  platform,
  label,
  displayUrl,
}: AffiliateButtonProps) {
  const style = PLATFORM_STYLES[platform] ?? PLATFORM_STYLES.other
  const platformName = PLATFORM_NAMES[platform] ?? PLATFORM_NAMES.other

  return (
    <div className="w-full">
      <a
        href={trackedHref(linkId)}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={cn(
          'flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold shadow-sm',
          'transition-all duration-200 ease-out active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          style
        )}
      >
        <span>{label}</span>
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      </a>
      <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-editorial-muted">
        <span className="font-medium text-editorial-secondary">{platformName}</span>
        {displayUrl && (
          <>
            <span aria-hidden="true">·</span>
            <span>{displayUrl}</span>
          </>
        )}
      </p>
    </div>
  )
}

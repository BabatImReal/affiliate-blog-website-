'use client'
import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { trackedHref } from '@/lib/affiliate'
import type { MockAffiliateLink } from '@/lib/mock-data'

interface MobileBuyBarProps {
  productName: string
  affiliateLinks: MockAffiliateLink[]
  /** Ref to the element after which the bar becomes visible (e.g. verdict callout) */
  sentinelId: string
}

const PLATFORM_COLORS: Record<string, string> = {
  tiktok_shop: 'bg-[#FE2C55]',
  shopee: 'bg-[#EE4D2D]',
  lazada: 'bg-[#6E2EBC]',
  amazon: 'bg-[#FF9900]',
  other: 'bg-editorial-ink',
}

export function MobileBuyBar({ productName, affiliateLinks, sentinelId }: MobileBuyBarProps) {
  const [visible, setVisible] = useState(false)
  const primaryLink = affiliateLinks[0]

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId)
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinelId])

  if (!primaryLink) return null

  const bgColor = PLATFORM_COLORS[primaryLink.platform] ?? PLATFORM_COLORS.other

  return (
    <div
      aria-hidden={!visible}
      className={[
        'fixed bottom-0 left-0 right-0 z-40 border-t border-editorial-border bg-surface px-4 pb-[env(safe-area-inset-bottom)] pt-3 shadow-lg transition-transform duration-300 ease-out md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-editorial-ink">
          {productName}
        </p>
        <a
          href={trackedHref(primaryLink.id)}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className={[
            'flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm',
            'transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
            bgColor,
          ].join(' ')}
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Mua ngay
        </a>
      </div>
    </div>
  )
}

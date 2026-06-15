import { Award } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AffiliateButton } from './affiliate-button'
import { ScoreBadge } from './score-badge'
import { StarRating } from './star-rating'
import type { MockAffiliateLink, Verdict } from '@/lib/mock-data'

interface VerdictCalloutProps {
  verdict: Verdict
  productName: string
  why: string
  affiliateLinks: MockAffiliateLink[]
  score?: number
  rating?: number
}

export function VerdictCallout({
  verdict,
  productName,
  why,
  affiliateLinks,
  score,
  rating,
}: VerdictCalloutProps) {
  const t = useTranslations('Blog')

  const badgeLabel: Record<Verdict, string> = {
    best: t('ourPickFull'),
    great: t('alsoGreat'),
    budget: t('budgetPick'),
  }

  return (
    <div className="rounded-lg border border-editorial-border bg-surface p-6 shadow-sm sm:p-8" style={{ borderLeftWidth: '4px', borderLeftColor: '#C41230' }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
            <Award className="h-4 w-4" />
            {badgeLabel[verdict]}
          </div>
          <h2 className="mb-2 font-serif text-2xl font-bold text-editorial-ink sm:text-3xl">
            {productName}
          </h2>
          {rating !== undefined && (
            <StarRating rating={rating} size="md" showLabel className="mb-3" />
          )}
        </div>
        {score !== undefined && (
          <ScoreBadge score={score} size="lg" className="shrink-0" />
        )}
      </div>

      <p className="mb-6 max-w-2xl text-base leading-relaxed text-editorial-secondary">
        {why}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {affiliateLinks.map((link) => (
          <AffiliateButton
            key={link.id}
            linkId={link.id}
            platform={link.platform}
            label={link.label}
            displayUrl={link.displayUrl}
          />
        ))}
      </div>
    </div>
  )
}

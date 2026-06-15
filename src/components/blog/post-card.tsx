import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ScoreBadge } from './score-badge'
import { StarRating } from './star-rating'
import type { Verdict } from '@/lib/mock-data'

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  verdict?: Verdict
  score?: number
  rating?: number
  featured?: boolean
}

const VERDICT_CHIP: Record<Verdict, string> = {
  best: 'bg-brand text-white',
  great: 'bg-editorial-ink text-white',
  budget: 'bg-amber-500 text-editorial-ink',
}

export function PostCard({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  verdict,
  score,
  rating,
  featured = false,
}: PostCardProps) {
  const t = useTranslations('Blog')

  const verdictLabel: Record<Verdict, string> = {
    best: t('ourPick'),
    great: t('alsoGreat'),
    budget: t('budgetPick'),
  }

  return (
    <Link
      href={`/blog/${slug}`}
      aria-label={`${title} — ${t('readMore')}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-editorial-border bg-surface',
        'shadow-sm transition-all duration-200 ease-out',
        'hover:-translate-y-1 hover:shadow-md hover:border-editorial-border/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        featured && 'sm:flex-row'
      )}
    >
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden bg-surface-muted',
          featured && 'sm:aspect-auto sm:w-1/2'
        )}
      >
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes={featured ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 33vw'}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        {verdict && (
          <span
            className={cn(
              'absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-semibold shadow-sm',
              VERDICT_CHIP[verdict]
            )}
          >
            {verdictLabel[verdict]}
          </span>
        )}
        {score !== undefined && (
          <ScoreBadge
            score={score}
            size="sm"
            className="absolute bottom-3 right-3 shadow-md"
          />
        )}
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col p-5',
          featured && 'sm:justify-center sm:p-8'
        )}
      >
        <span className="mb-2 inline-block w-fit rounded bg-brand-light px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand">
          {category}
        </span>
        <h3
          className={cn(
            'mb-2 line-clamp-2 font-serif font-bold leading-snug text-editorial-ink transition-colors duration-200 group-hover:text-brand',
            featured ? 'text-2xl sm:text-3xl' : 'text-lg'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'mb-4 line-clamp-2 text-sm leading-relaxed text-editorial-secondary',
            featured && 'sm:text-base'
          )}
        >
          {excerpt}
        </p>
        {rating !== undefined && (
          <StarRating rating={rating} size="sm" showLabel className="mb-3" />
        )}
        <span
          aria-hidden="true"
          className="mt-auto text-sm font-semibold text-brand transition-colors duration-200 group-hover:text-brand-dark"
        >
          {t('readMore')} →
        </span>
      </div>
    </Link>
  )
}

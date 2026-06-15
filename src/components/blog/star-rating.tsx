import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number  // 0–5, supports half-steps (e.g. 4.5)
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export function StarRating({ rating, size = 'sm', showLabel = false, className }: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(5, rating))
  const fullStars = Math.floor(clampedRating)
  const hasHalf = clampedRating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'
  const id = `star-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${clampedRating} trên 5 sao`}
      role="img"
    >
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id={`${id}-half`} x1="0" x2="100%" y1="0" y2="0">
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#E4E4E0" />
          </linearGradient>
        </defs>
      </svg>

      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} fill="#D97706" className={starSize} />
      ))}
      {hasHalf && (
        <StarIcon key="half" fill={`url(#${id}-half)`} className={starSize} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon key={`empty-${i}`} fill="#E4E4E0" className={starSize} />
      ))}

      {showLabel && (
        <span className="ml-1 text-xs font-medium text-editorial-secondary">
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

function StarIcon({ fill, className }: { fill: string; className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path
        fill={fill}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  )
}

import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function scoreColor(score: number): string {
  if (score >= 9) return 'bg-green-600 text-white'
  if (score >= 8) return 'bg-green-500 text-white'
  if (score >= 7) return 'bg-amber-500 text-white'
  return 'bg-editorial-muted text-white'
}

const SIZE: Record<NonNullable<ScoreBadgeProps['size']>, string> = {
  sm: 'h-10 w-10 text-sm font-bold',
  md: 'h-14 w-14 text-lg font-bold',
  lg: 'h-20 w-20 text-2xl font-bold',
}

export function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {
  const display = score.toFixed(1)

  return (
    <div
      role="img"
      aria-label={`Điểm đánh giá: ${display} trên 10`}
      className={cn(
        'flex shrink-0 flex-col items-center justify-center rounded-full shadow-sm',
        scoreColor(score),
        SIZE[size],
        className
      )}
    >
      <span className="leading-none">{display}</span>
      <span className="text-[9px] font-medium leading-none opacity-80">/10</span>
    </div>
  )
}

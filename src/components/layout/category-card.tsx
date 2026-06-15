import { Link } from '@/i18n/navigation'

interface CategoryCardProps {
  name: string
  icon: string
  count: number
}

export function CategoryCard({ name, icon, count }: CategoryCardProps) {
  return (
    <Link
      href="/blog"
      className={[
        'group flex flex-col items-center gap-3 rounded-xl border border-editorial-border bg-surface p-6 text-center',
        'shadow-sm transition-all duration-200 ease-out',
        'hover:-translate-y-1 hover:border-brand/40 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-3xl transition-transform duration-200 group-hover:scale-110"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <p className="font-serif text-base font-bold text-editorial-ink transition-colors duration-200 group-hover:text-brand">
          {name}
        </p>
        <p className="mt-0.5 text-xs font-medium text-editorial-muted">
          {count} đánh giá
        </p>
      </div>
    </Link>
  )
}

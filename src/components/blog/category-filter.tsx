'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PostCard } from './post-card'
import { cn } from '@/lib/utils'
import type { MockPost } from '@/lib/mock-data'

interface CategoryFilterProps {
  posts: MockPost[]
  categories: string[]
}

const ALL = '__all__'

export function CategoryFilter({ posts, categories }: CategoryFilterProps) {
  const t = useTranslations('Blog')
  const [active, setActive] = useState<string>(ALL)

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((post) => post.category === active)),
    [active, posts]
  )

  const tabs = [{ key: ALL, label: t('allCategories') }].concat(
    categories.map((c) => ({ key: c, label: c }))
  )

  return (
    <div>
      {/* Filter pills */}
      <div
        role="group"
        aria-label="Lọc theo danh mục"
        className="mb-6 flex flex-wrap gap-2 border-b border-editorial-border pb-4"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(tab.key)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out',
                'min-h-[36px] cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                isActive
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-surface-muted text-editorial-secondary hover:bg-editorial-border hover:text-editorial-ink'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <p className="mb-6 text-sm text-editorial-muted" aria-live="polite" aria-atomic="true">
        {filtered.length} {t('reviewCount')}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              coverImage={post.coverImage}
              category={post.category}
              verdict={post.verdict}
              score={post.score}
              rating={post.rating}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-editorial-border bg-surface-muted py-16 text-center">
          <p className="text-base font-medium text-editorial-secondary">Chưa có bài đánh giá</p>
          <p className="mt-1 text-sm text-editorial-muted">
            Hãy thử chọn danh mục khác hoặc xem tất cả bài viết.
          </p>
          <button
            type="button"
            onClick={() => setActive(ALL)}
            className="mt-4 cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Xem tất cả
          </button>
        </div>
      )}
    </div>
  )
}

import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { CategoryFilter } from '@/components/blog/category-filter'
import { MOCK_POSTS, CATEGORIES } from '@/lib/mock-data'

export default function BlogListingPage() {
  const t = useTranslations('Blog')
  const tNav = useTranslations('Nav')

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-editorial-muted"
      >
        <Link href="/" className="hover:text-brand">
          {tNav('home')}
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="text-editorial-secondary">{t('listingTitle')}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-editorial-ink sm:text-4xl">
          {t('listingTitle')}
        </h1>
      </header>

      <CategoryFilter posts={MOCK_POSTS} categories={CATEGORIES} />
    </main>
  )
}

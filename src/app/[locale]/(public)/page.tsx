import { useTranslations } from 'next-intl'
import { PostCard } from '@/components/blog/post-card'
import { TrustBar } from '@/components/layout/trust-bar'
import { CategoryCard } from '@/components/layout/category-card'
import { Link } from '@/i18n/navigation'
import { MOCK_POSTS, CATEGORY_META } from '@/lib/mock-data'

export default function HomePage() {
  const t = useTranslations('Home')

  const featured = MOCK_POSTS[0]
  const latest = MOCK_POSTS.slice(1)

  return (
    <main>
      {/* Hero */}
      <section className="bg-editorial-ink">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Trust bar — social proof strip */}
      <TrustBar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top pick */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-editorial-ink sm:text-3xl">
              {t('topPickTitle')}
            </h2>
          </div>
          <PostCard
            title={featured.title}
            slug={featured.slug}
            excerpt={featured.excerpt}
            coverImage={featured.coverImage}
            category={featured.category}
            verdict={featured.verdict}
            score={featured.score}
            rating={featured.rating}
            featured
          />
        </section>

        {/* Category grid */}
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl font-bold text-editorial-ink sm:text-3xl">
            {t('categoriesTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(CATEGORY_META).map(([name, { icon, count }]) => (
              <CategoryCard key={name} name={name} icon={icon} count={count} />
            ))}
          </div>
        </section>

        {/* Latest reviews */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-editorial-ink sm:text-3xl">
              {t('latestTitle')}
            </h2>
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand hover:underline"
            >
              {t('seeAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
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
        </section>

        {/* CTA banner */}
        <section className="my-16 rounded-xl bg-brand px-6 py-12 text-center sm:px-12">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            {t('ctaTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">
            {t('ctaSubtitle')}
          </p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              {t('emailPlaceholder')}
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              className="h-11 flex-1 rounded-md border-0 px-4 text-sm text-editorial-ink outline-none ring-2 ring-transparent focus:ring-white focus-visible:ring-white"
            />
            <button
              type="submit"
              className="h-11 cursor-pointer rounded-md bg-editorial-ink px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            >
              {t('subscribe')}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

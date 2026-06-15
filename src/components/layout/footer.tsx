import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('Footer')
  const tNav = useTranslations('Nav')
  const tBlog = useTranslations('Blog')

  return (
    <footer className="mt-20 bg-editorial-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand font-serif text-base font-bold text-white">
                R
              </span>
              <span className="font-serif text-lg font-bold">ReviewHub</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {t('tagline')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
              {t('categories')}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  {tNav('tech')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  {tNav('home_appliance')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  {tNav('audio')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  {tNav('beauty')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
              {t('legal')}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <span className="transition-colors hover:text-white">
                  {t('privacy')}
                </span>
              </li>
              <li>
                <span className="transition-colors hover:text-white">
                  {t('terms')}
                </span>
              </li>
              <li>
                <span className="transition-colors hover:text-white">
                  {t('affiliate')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('rights')}</p>
          <p className="max-w-md">{tBlog('affiliateDisclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}

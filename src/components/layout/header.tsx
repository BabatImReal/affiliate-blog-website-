'use client'
import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from './locale-switcher'
import { cn } from '@/lib/utils'

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('Nav')
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/blog', label: t('tech') },
    { href: '/blog', label: t('home_appliance') },
    { href: '/blog', label: t('audio') },
    { href: '/blog', label: t('beauty') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface">
      {/* Brand accent bar */}
      <div className="h-[3px] w-full bg-brand" />

      <div className="border-b border-editorial-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand font-serif text-lg font-bold text-white"
              aria-hidden="true"
            >
              R
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-editorial-ink">
              ReviewHub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Điều hướng chính" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link, i) => (
              <Link
                key={`${link.label}-${i}`}
                href={link.href}
                className="rounded-sm py-1 text-sm font-medium text-editorial-secondary transition-colors duration-200 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <LocaleSwitcher locale={locale} />
            <button
              type="button"
              aria-label={t('search')}
              className="hidden h-10 w-10 items-center justify-center rounded-md text-editorial-secondary transition-colors duration-200 hover:bg-surface-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:flex"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-editorial-ink transition-colors duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav — always in DOM, animated via max-height */}
        <nav
          id="mobile-nav"
          aria-label="Điều hướng mobile"
          aria-hidden={!mobileOpen}
          className={cn(
            'overflow-hidden border-t border-editorial-border bg-surface transition-all duration-200 ease-in-out md:hidden',
            mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-1">
            {navLinks.map((link, i) => (
              <Link
                key={`m-${link.label}-${i}`}
                href={link.href}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-editorial-secondary transition-colors duration-200 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

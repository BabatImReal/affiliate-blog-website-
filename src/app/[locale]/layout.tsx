import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Be_Vietnam_Pro } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import '../globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as 'vi' | 'en')) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale} className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Bỏ qua nội dung
          </a>
          <div className="flex min-h-dvh flex-col">
            <Header locale={locale} />
            <div id="main-content" className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

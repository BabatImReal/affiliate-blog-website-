import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function isAdminPath(pathname: string): boolean {
  // Matches /vi/admin/... or /en/admin/... (route group (admin) is not in the URL,
  // so admin pages are reached via /[locale]/dashboard, /posts, /links, /media).
  return /^\/(vi|en)\/(dashboard|posts|links|media)(\/|$)/.test(pathname)
}

export async function middleware(request: NextRequest) {
  // 1. Locale routing first
  const response = intlMiddleware(request)

  // 2. Admin guard (stub: verifies a Supabase session exists)
  if (isAdminPath(request.nextUrl.pathname)) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            )
          },
        },
      },
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const locale =
        request.nextUrl.pathname.split('/')[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}

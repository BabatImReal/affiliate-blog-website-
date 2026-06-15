# Project Scaffold — Implementation Plan

- Plan ID: project-scaffold_PLAN_15-06-26
- Created: 15-06-26
- Mode: FAST (RIPER-5) — COMPLEX plan shape
- Status: AWAITING EXECUTE APPROVAL
- Author handoff: scaffolds the greenfield Next.js 14 app per `process/context/all-context.md`

---

## Objective

Scaffold the initial Next.js 14 (App Router) project for the Vietnamese affiliate blog
review website, wiring TypeScript strict mode, Tailwind + shadcn/ui, Supabase
(`@supabase/ssr` + Drizzle ORM), next-intl (vi/en), Cloudinary, and the financially
critical affiliate redirect Route Handler. Result: a project that runs with `pnpm dev`,
builds with `pnpm build`, has the full directory structure, a generated Drizzle migration,
working locale routing, shadcn/ui initialized, combined middleware, and `.env.example`.

---

## Touchpoints

New files created (all under repo root `D:\Data\review-blog-project\affiliate-blog-website-`):

- Config: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`,
  `postcss.config.mjs`, `components.json`, `drizzle.config.ts`, `.env.example`,
  `.gitignore`, `.eslintrc.json`
- i18n: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`,
  `src/middleware.ts`, `src/messages/vi.json`, `src/messages/en.json`
- App shell: `src/app/[locale]/layout.tsx`, `src/app/[locale]/(public)/page.tsx`,
  `src/app/[locale]/(public)/blog/page.tsx`,
  `src/app/[locale]/(public)/blog/[slug]/page.tsx`,
  `src/app/[locale]/(admin)/dashboard/page.tsx`,
  `src/app/[locale]/(admin)/posts/page.tsx`,
  `src/app/[locale]/(admin)/posts/new/page.tsx`,
  `src/app/[locale]/(admin)/posts/[id]/edit/page.tsx`,
  `src/app/[locale]/(admin)/links/page.tsx`,
  `src/app/[locale]/(admin)/media/page.tsx`,
  `src/app/[locale]/login/page.tsx`
- API: `src/app/api/affiliate/[linkId]/route.ts`, `src/app/api/analytics/route.ts`
- Global: `src/app/globals.css`, `src/app/layout.tsx` (root passthrough)
- lib/db: `src/lib/db/index.ts`, `src/lib/db/schema.ts`, `src/lib/db/migrations/*`
- lib/auth: `src/lib/auth/server.ts`, `src/lib/auth/client.ts`, `src/lib/auth/middleware.ts`
- lib: `src/lib/cloudinary.ts`, `src/lib/affiliate.ts`, `src/lib/utils.ts`
- components dirs: `src/components/ui/` (shadcn), `src/components/blog/.gitkeep`,
  `src/components/admin/.gitkeep`, `src/components/layout/locale-switcher.tsx`

No existing source files are modified (greenfield). `process/` is untouched except this plan.

## Public Contracts

- `GET /api/affiliate/[linkId]` → 302 redirect to destination, logs to `link_clicks` first.
  Returns `Response.redirect(url, 302)`. On not-found returns 404 JSON envelope.
- `GET|POST /api/analytics` → JSON envelope `{ success, data?, error? }`.
- Drizzle schema exports (table objects) from `src/lib/db/schema.ts`:
  `posts, categories, postCategories, affiliateLinks, linkClicks, postViews, media`.
- Supabase clients: `createServerSupabaseClient()` (server), `supabaseBrowser` (client).
- next-intl `routing` exports `locales = ['vi','en']`, `defaultLocale = 'vi'`.
- Env contract documented in `.env.example` (11 variables — names only, never values).

## Blast Radius

Greenfield: no runtime code exists yet, so blast radius is the entire app baseline. The
financially critical surface is `src/app/api/affiliate/[linkId]/route.ts` and
`src/lib/affiliate.ts` — these are stubbed but MUST keep the "log before redirect, never
client-side" contract. Middleware (`src/middleware.ts`) gates all routes; a mistake here
either leaks admin routes or breaks locale routing for the whole site.

---

## Pinned Versions (verified against npm registry on 15-06-26)

> Rationale captured from RESEARCH. Pin these to avoid Tailwind v4 / next-intl v4 churn.

| Package | Pinned | Why |
|---|---|---|
| next | `14.2.35` | Latest stable 14.x (confirmed decision: Next 14) |
| react / react-dom | `^18.3.1` | Required peer for Next 14 |
| typescript | `^5` | strict mode |
| tailwindcss | `^3.4.19` | **Tailwind v4 breaks shadcn/Next14 toolchain** — pin v3 |
| postcss / autoprefixer | `^8` / `^10` | Tailwind v3 PostCSS pipeline |
| next-intl | `^3.26.5` | **v4 has breaking config API** — spec requires v3 |
| @supabase/ssr | `^0.12.0` | modern `getAll`/`setAll` cookie API |
| @supabase/supabase-js | `^2.108.2` | peer of ssr |
| drizzle-orm | `^0.36.4` | stable Supabase pairing baseline |
| drizzle-kit (dev) | `^0.28.1` | matches drizzle-orm 0.36 line |
| postgres | `^3.4.9` | postgres.js driver for Drizzle + Supabase |
| next-cloudinary | `^6.17.5` | CldImage / CldUploadWidget frontend |
| cloudinary | `^2.10.0` | server-side signed uploads |
| class-variance-authority, clsx, tailwind-merge, lucide-react | latest | shadcn/ui deps |

> Known compatibility gotcha: `create-next-app` now defaults to Tailwind **v4**. The plan
> explicitly downgrades to Tailwind v3 BEFORE `shadcn init`, otherwise shadcn generates a
> v4 `globals.css` that the rest of this plan does not match.

---

## Phase 0 — Pre-flight

- [ ] Confirm `pnpm -v` works (install via `corepack enable` if missing).
- [ ] Confirm repo root is clean and `src/` does not yet exist.
- [ ] Verify Node >= 18.18 (`node -v`).

Verification: `pnpm -v && node -v` print versions.

---

## Phase 1 — Init Next.js app

Run from repo root. `create-next-app` into the current (non-empty) directory — the
`process/` folder and this plan already exist, so use `.` and accept the "directory not
empty" continue prompt is avoided by these flags.

```bash
pnpm dlx create-next-app@14.2.35 . \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack \
  --use-pnpm
```

If the CLI refuses due to non-empty dir, scaffold into a temp dir and move:

```bash
pnpm dlx create-next-app@14.2.35 .scaffold-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
# then move generated files (not node_modules) into repo root, preserving process/
```

Then **force Tailwind v3** (create-next-app may install v4):

```bash
pnpm remove tailwindcss @tailwindcss/postcss 2>/dev/null || true
pnpm add -D tailwindcss@^3.4.19 postcss@^8 autoprefixer@^10
pnpm dlx tailwindcss init -p   # regenerates tailwind.config + postcss config for v3
```

Verification:
- [ ] `package.json` shows `next@14.2.35` and `tailwindcss@^3.4.19`.
- [ ] `pnpm dev` boots default Next page at `http://localhost:3000` (kill after check).

---

## Phase 2 — Install remaining dependencies

```bash
# i18n
pnpm add next-intl@^3.26.5

# Supabase + Drizzle
pnpm add @supabase/ssr@^0.12.0 @supabase/supabase-js@^2.108.2 drizzle-orm@^0.36.4 postgres@^3.4.9
pnpm add -D drizzle-kit@^0.28.1

# Cloudinary
pnpm add next-cloudinary@^6.17.5 cloudinary@^2.10.0

# shadcn/ui runtime deps (shadcn init also adds these, harmless to pre-add)
pnpm add class-variance-authority clsx tailwind-merge lucide-react
```

Verification:
- [ ] `pnpm ls next-intl @supabase/ssr drizzle-orm drizzle-kit postgres next-cloudinary` all resolve.

---

## Phase 3 — Initialize shadcn/ui

```bash
pnpm dlx shadcn@latest init
# Answers: style = New York (or Default), base color = Slate (editorial neutral),
# CSS variables = Yes. It writes components.json, updates globals.css + tailwind.config,
# and creates src/lib/utils.ts (cn helper).

# Install base components used by the scaffold
pnpm dlx shadcn@latest add button card input label badge separator table
```

Verification:
- [ ] `components.json` exists with `"aliases": { "components": "@/components", "ui": "@/components/ui" }`.
- [ ] `src/components/ui/button.tsx` etc. exist.
- [ ] `src/lib/utils.ts` exports `cn`.

> If shadcn rewrites `globals.css` for Tailwind v4 (`@import "tailwindcss"`), replace it with
> the Tailwind v3 directives shown in Phase 5 (`@tailwind base/components/utilities`).

---

## Phase 4 — Config files

### `next.config.ts`

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone', // VPS migration readiness from day one
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

> If `create-next-app` produced `next.config.mjs`, delete it and create `next.config.ts`.

### `drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### `tsconfig.json` — ensure strict + path alias (create-next-app sets most)

Confirm these fields:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  }
}
```

### `.env.example`

```dotenv
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# --- Cloudinary ---
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# --- Analytics ---
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# --- App ---
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### `.gitignore` — ensure these lines exist (append if missing)

```
.env
.env.local
.env*.local
/.next/
/node_modules
.scaffold-tmp/
```

Add a package.json script block for Drizzle:

```jsonc
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

Verification:
- [ ] `next.config.ts` has `output: 'standalone'` and the next-intl plugin.
- [ ] No leftover `next.config.mjs`.

---

## Phase 5 — i18n wiring (next-intl v3)

### `src/i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
})
```

### `src/i18n/navigation.ts`

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

### `src/i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'vi' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

### `src/messages/vi.json` (primary)

```json
{
  "Home": {
    "title": "Đánh giá sản phẩm đáng tin cậy",
    "subtitle": "So sánh và lựa chọn thông minh"
  },
  "Nav": {
    "home": "Trang chủ",
    "blog": "Bài viết",
    "admin": "Quản trị"
  },
  "Blog": {
    "listingTitle": "Tất cả bài đánh giá"
  }
}
```

### `src/messages/en.json`

```json
{
  "Home": {
    "title": "Trustworthy product reviews",
    "subtitle": "Compare and choose smartly"
  },
  "Nav": {
    "home": "Home",
    "blog": "Blog",
    "admin": "Admin"
  },
  "Blog": {
    "listingTitle": "All reviews"
  }
}
```

### `src/app/globals.css`

Keep the shadcn-generated CSS-variable theme block, but ensure the **Tailwind v3**
directives are at the top (replace any `@import "tailwindcss"`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* shadcn :root + .dark CSS variables block stays below (as generated) */
```

Verification:
- [ ] `src/i18n/request.ts` path matches the plugin arg in `next.config.ts`.

---

## Phase 6 — Combined middleware (locale + admin auth stub)

### `src/middleware.ts`

```ts
import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { createServerClient } from '@supabase/ssr'

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
      const locale = request.nextUrl.pathname.split('/')[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

> Note: route groups `(public)` and `(admin)` do NOT appear in the URL. Admin pages render
> at `/[locale]/dashboard`, `/[locale]/posts`, etc. The matcher excludes `/api` so the
> affiliate Route Handler runs without the intl/auth wrapper.

Verification:
- [ ] Visiting `/` redirects to `/vi`.
- [ ] Visiting `/vi/dashboard` (no session) redirects to `/vi/login`.

---

## Phase 7 — Drizzle schema + client

### `src/lib/db/schema.ts` (full planned schema)

```ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  titleVi: text('title_vi').notNull(),
  titleEn: text('title_en'),
  contentVi: text('content_vi').notNull(),
  contentEn: text('content_en'),
  excerptVi: text('excerpt_vi'),
  excerptEn: text('excerpt_en'),
  coverImage: text('cover_image'),
  status: text('status').notNull().default('draft'), // 'draft' | 'published'
  authorId: uuid('author_id'), // references auth.users(id) — managed by Supabase
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  nameVi: text('name_vi').notNull(),
  nameEn: text('name_en'),
})

export const postCategories = pgTable(
  'post_categories',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
  }),
)

export const affiliateLinks = pgTable('affiliate_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // tiktok_shop | shopee | lazada | amazon | other
  labelVi: text('label_vi').notNull(),
  labelEn: text('label_en'),
  url: text('url').notNull(), // destination — never exposed to client
  displayUrl: text('display_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const linkClicks = pgTable('link_clicks', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateLinkId: uuid('affiliate_link_id')
    .notNull()
    .references(() => affiliateLinks.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at', { withTimezone: true }).defaultNow(),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  ipHash: text('ip_hash'), // SHA-256 of IP, never raw IP
})

export const postViews = pgTable('post_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow(),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
})

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  cloudinaryPublicId: text('cloudinary_public_id').notNull(),
  url: text('url').notNull(),
  resourceType: text('resource_type').notNull(), // 'image' | 'video'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
```

### `src/lib/db/index.ts`

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Server-only admin client (full access; service role bypasses RLS via DATABASE_URL).
const connectionString = process.env.DATABASE_URL!

// Disable prefetch — not supported by Supabase "Transaction" pooler.
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export { schema }
```

### Generate migration

```bash
pnpm db:generate   # writes SQL into src/lib/db/migrations/
```

> `db:generate` reads `DATABASE_URL` only for `push`/`studio`. `generate` works offline from
> schema alone, so a real DB connection is NOT required to produce the first migration file.

Verification:
- [ ] `src/lib/db/migrations/0000_*.sql` exists and contains all 7 tables.
- [ ] `pnpm build` type-checks `schema.ts` and `index.ts` with no errors.

---

## Phase 8 — Auth + lib helpers

### `src/lib/auth/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // called from a Server Component — safe to ignore (middleware refreshes)
          }
        },
      },
    },
  )
}
```

### `src/lib/auth/client.ts`

```ts
'use client'
import { createBrowserClient } from '@supabase/ssr'

export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
```

### `src/lib/auth/middleware.ts` (helper kept for future refactor)

```ts
// Re-export of the admin-path matcher so middleware.ts and tests share one source.
export function isAdminPath(pathname: string): boolean {
  return /^\/(vi|en)\/(dashboard|posts|links|media)(\/|$)/.test(pathname)
}
```

### `src/lib/cloudinary.ts`

```ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Helper stub: produce a signed upload signature for the admin uploader.
export function signUpload(paramsToSign: Record<string, string>) {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  )
}
```

### `src/lib/affiliate.ts`

```ts
import { createHash } from 'crypto'

// Hash an IP address (SHA-256). Never store or log the raw IP.
export function hashIp(ip: string | null): string | null {
  if (!ip) return null
  return createHash('sha256').update(ip).digest('hex')
}

export type AffiliatePlatform =
  | 'tiktok_shop'
  | 'shopee'
  | 'lazada'
  | 'amazon'
  | 'other'

// The canonical tracked URL the UI must use — never a raw affiliate href.
export function trackedHref(linkId: string): string {
  return `/api/affiliate/${linkId}`
}
```

Verification:
- [ ] `pnpm build` resolves `@supabase/ssr` and `crypto` imports with no type errors.

---

## Phase 9 — Affiliate redirect Route Handler (CRITICAL) + analytics stub

### `src/app/api/affiliate/[linkId]/route.ts`

```ts
import { type NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { affiliateLinks, linkClicks } from '@/lib/db/schema'
import { hashIp } from '@/lib/affiliate'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { linkId: string } },
) {
  // 1. Look up the affiliate link (server-side only).
  const [link] = await db
    .select()
    .from(affiliateLinks)
    .where(eq(affiliateLinks.id, params.linkId))
    .limit(1)

  if (!link) {
    return NextResponse.json(
      { success: false, error: 'Affiliate link not found' },
      { status: 404 },
    )
  }

  // 2. Log the click FIRST (financial data — must not be lost on redirect).
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  await db.insert(linkClicks).values({
    affiliateLinkId: link.id,
    userAgent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer'),
    ipHash: hashIp(ip),
  })

  // 3. Server-side 302 redirect to destination. NEVER redirect client-side.
  return NextResponse.redirect(link.url, 302)
}
```

### `src/app/api/analytics/route.ts`

```ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Stub: returns the standard envelope. Real query logic added in admin-dashboard feature.
export async function GET() {
  return NextResponse.json({ success: true, data: { views: 0, clicks: 0 } })
}
```

Verification:
- [ ] `pnpm build` compiles both route handlers.
- [ ] Manual: with a seeded link, `GET /api/affiliate/<id>` returns 302 (deferred to feature work — connection-dependent).

---

## Phase 10 — App shell + stub pages

### `src/app/[locale]/layout.tsx`

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

> The root `src/app/layout.tsx` generated by create-next-app must be deleted (the
> `[locale]/layout.tsx` owns `<html>`). If Next requires a root layout, keep a minimal
> passthrough `src/app/layout.tsx` returning `children` only. Decide during EXECUTE based
> on build output; documented here as a known fork.

### `src/app/[locale]/(public)/page.tsx` (homepage)

```tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('Home')
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('subtitle')}</p>
    </main>
  )
}
```

### `src/app/[locale]/(public)/blog/page.tsx`

```tsx
import { useTranslations } from 'next-intl'

export default function BlogListingPage() {
  const t = useTranslations('Blog')
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">{t('listingTitle')}</h1>
    </main>
  )
}
```

### `src/app/[locale]/(public)/blog/[slug]/page.tsx`

```tsx
export default function BlogDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Review: {params.slug}</h1>
      <p className="text-muted-foreground">Detail stub.</p>
    </main>
  )
}
```

### Admin stubs (all follow the same minimal pattern)

`(admin)/dashboard/page.tsx`, `(admin)/posts/page.tsx`, `(admin)/posts/new/page.tsx`,
`(admin)/posts/[id]/edit/page.tsx`, `(admin)/links/page.tsx`, `(admin)/media/page.tsx`:

```tsx
export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-xl font-semibold">Admin — stub</h1>
    </main>
  )
}
```

(Each file uses a uniquely named component, e.g. `DashboardPage`, `PostsPage`,
`NewPostPage`, `EditPostPage`, `LinksPage`, `MediaPage`.)

### `src/app/[locale]/login/page.tsx`

```tsx
export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <p className="text-muted-foreground">Login form stub.</p>
    </main>
  )
}
```

### `src/components/layout/locale-switcher.tsx`

```tsx
'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="rounded border px-2 py-1"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
```

### Empty component dirs

- [ ] `src/components/blog/.gitkeep`
- [ ] `src/components/admin/.gitkeep`

Verification:
- [ ] All stub pages compile; no hardcoded user-visible strings outside translation files
      except placeholder admin/detail text (acceptable for scaffold stubs).

---

## Phase 11 — Smoke test (final gate)

- [ ] `pnpm install` clean (no peer-dep errors that block build).
- [ ] `pnpm dev` boots; `http://localhost:3000` redirects to `/vi`.
- [ ] `/vi` shows Vietnamese homepage title; `/en` shows English title.
- [ ] LocaleSwitcher (if mounted on a page) swaps locale and preserves path.
- [ ] `/vi/dashboard` without a Supabase session redirects to `/vi/login`.
- [ ] `pnpm build` completes with `output: 'standalone'` (check `.next/standalone/` exists).
- [ ] `pnpm db:generate` produced a migration containing all 7 tables.
- [ ] `.env.example` lists all 11 variable names; no real values committed.
- [ ] `src/components/ui/button.tsx` (shadcn) imports `cn` from `@/lib/utils` and compiles.

---

## Verification Evidence

Capture during EXECUTE (paste outputs into the completion report):

1. `pnpm ls next next-intl @supabase/ssr drizzle-orm drizzle-kit tailwindcss` — version proof.
2. `pnpm build` tail showing success + route table including `/[locale]` and `/api/affiliate/[linkId]`.
3. `ls src/lib/db/migrations` + first 30 lines of the generated `0000_*.sql`.
4. `curl -I http://localhost:3000/` showing 307/308 redirect to `/vi`.
5. `ls .next/standalone` proving standalone output.

---

## Resume and Execution Handoff

- Selected plan: `process/general-plans/active/project-scaffold_PLAN_15-06-26.md`
- Execute phases in order 0 → 11; do not skip the Tailwind v3 downgrade in Phase 1.
- Two documented forks to decide live during EXECUTE:
  1. `create-next-app` into non-empty dir (use `.scaffold-tmp` fallback if `.` is rejected).
  2. Root `src/app/layout.tsx` — delete vs. minimal passthrough (decide from build output).
- If `db:push`/`studio` is attempted, real `DATABASE_URL` is required; `db:generate` is offline.
- On completion: run smoke test, capture Verification Evidence, then move plan to
  `process/general-plans/completed/` and update `process/context/database/all-database.md`
  status line ("migrations exist") + `all-context.md` repo-structure status to "scaffolded".
- Suggested follow-up: route remaining work into feature folders
  (`blog-reviews`, `affiliate-tracking`, `admin-dashboard`).

---

## Out of Scope (explicitly deferred)

- Real Supabase project + RLS policy SQL (database feature work).
- Functional login form / session refresh wiring (admin-dashboard feature).
- Real analytics queries, Plausible script injection, click aggregation.
- Cloudinary upload widget UI, signed-upload endpoint wiring.
- Tests (unit/integration/e2e) — add per testing.md once features land.
- Editorial design system / theme tokens (uxui context group, post-scaffold).

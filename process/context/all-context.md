# Affiliate Review Blog - All Context

Last updated: 2026-06-15

This file is the root context entrypoint for the repo.

Use it for two things:

1. Quick routing to the right context pack or root file
2. Broad architecture and repository understanding

Start here before loading deeper context files.

---

## How This File Works (the `all-*.md` Convention)

Every `process/context/` directory has one `all-*.md` entrypoint. This root file (`all-context.md`) is the top-level router. Context groups each have their own `all-{group}.md` entrypoint.

Agents MUST:
1. Read `all-context.md` first (this file)
2. Find the relevant context group from the routing tables below
3. Read that group's `all-{group}.md` entrypoint
4. Only then load the specific deep doc needed

Never load the whole `process/context/` tree — use the routing tables.

---

## Quick Start

For most substantial tasks:

1. Read this file first
2. Choose the smallest relevant root file or context group from the tables below
3. Only then load deeper files

---

## Current Root Entry Points

| File | Read when |
|---|---|
| `process/context/all-context.md` | any substantial planning, research, review, or implementation task |
| `process/context/tests/all-tests.md` | testing, verification, debugging test failures, execution planning |
| `process/context/planning/all-planning.md` | plan-shape calibration, planning examples, SIMPLE vs COMPLEX reference docs |

## Current Context Groups

| Group | Entry point | Scope |
|---|---|---|
| `planning/` | `process/context/planning/all-planning.md` | plan-shape calibration, SIMPLE vs COMPLEX reference docs |
| `tests/` | `process/context/tests/all-tests.md` | test runners, commands, debugging, gaps |
| `database/` | `process/context/database/all-database.md` | Drizzle schema, Supabase connection, table definitions, RLS, migrations |
| `auth/` | `process/context/auth/all-auth.md` | Supabase Auth setup, admin middleware, route protection, session handling |
| `infra/` | `process/context/infra/all-infra.md` | Vercel deployment, environment management, CI/CD |

## Task Routing Table

| If the task involves... | Start with |
|---|---|
| architecture or stack questions | this file |
| testing or verification | `process/context/tests/all-tests.md` |
| creating a new plan | `process/context/planning/all-planning.md` |
| database schema, migrations, Drizzle queries | `process/context/database/all-database.md` |
| admin auth, protected routes, Supabase Auth | `process/context/auth/all-auth.md` |
| deployment, Vercel config, environment variables | `process/context/infra/all-infra.md` |
| blog/review feature work | `process/features/blog-reviews/active/` |
| affiliate link redirect or click tracking | `process/features/affiliate-tracking/active/` |
| admin panel or analytics dashboard | `process/features/admin-dashboard/active/` |
| UI components, design system, styling | this file (uxui context group not yet created — see uxui note below) |

---

## Repository Structure

> **Status:** Planned architecture — greenfield as of 2026-06-15. No source code exists yet.
> This structure represents the agreed architecture from project setup.

```
affiliate-blog-website/
  src/
    app/
      [locale]/                    -- next-intl locale segment (vi | en)
        (public)/                  -- visitor-facing route group (no auth)
          page.tsx                 -- homepage: featured reviews, categories
          blog/
            page.tsx               -- review listing with filters/categories
            [slug]/
              page.tsx             -- full review detail page + affiliate links
        (admin)/                   -- admin-only route group (Supabase Auth protected)
          dashboard/
            page.tsx               -- analytics: views, clicks, revenue proxy
          posts/
            page.tsx               -- blog post management list
            new/
              page.tsx             -- rich-text post editor (new post)
            [id]/edit/
              page.tsx             -- edit existing post
          links/
            page.tsx               -- affiliate link CRUD
          media/
            page.tsx               -- Cloudinary media library
      api/
        affiliate/
          [linkId]/
            route.ts               -- CRITICAL: server-side redirect + click log
        analytics/
          route.ts                 -- analytics query endpoints (views, click stats)
    components/
      ui/                          -- shadcn/ui base components (Button, Card, etc.)
      blog/                        -- BlogCard, PostLayout, ProsConsBlock, AffiliateButton
      admin/                       -- AdminForm, DataTable, Sidebar, MediaUploader
      layout/                      -- Header, Footer, LocaleSwitcher, Nav
    lib/
      db/
        index.ts                   -- Drizzle client (Supabase connection)
        schema.ts                  -- all table definitions (posts, links, clicks, views)
        migrations/                -- generated Drizzle migration files
      auth/
        middleware.ts              -- admin route protection
        server.ts                  -- server-side Supabase client
        client.ts                  -- browser Supabase client
      cloudinary.ts                -- Cloudinary upload helpers + signed URLs
      affiliate.ts                 -- redirect utility + platform detection helpers
    messages/
      vi.json                      -- Vietnamese translations (primary)
      en.json                      -- English translations (secondary)
    middleware.ts                  -- combined: next-intl locale + admin auth check
  drizzle.config.ts                -- Drizzle ORM config (Supabase PostgreSQL)
  next.config.ts                   -- Next.js config with next-intl plugin + image domains
  tailwind.config.ts               -- Tailwind CSS config with shadcn/ui paths
  components.json                  -- shadcn/ui alias configuration
  .env.local                       -- secrets (git-ignored)
  .env.example                     -- variable names template (committed to git)
  process/                         -- agent harness (not deployed)
```

## Technology Stack

> **Status:** Decided and confirmed during setup on 2026-06-15.

- **Framework:** Next.js 14 (App Router) — SSR/SSG for SEO, Vercel-native deployment
- **Language:** TypeScript (strict mode throughout)
- **UI:** Tailwind CSS + shadcn/ui — editorial design inspired by Wirecutter but with distinct visual identity; component-first
- **Database:** Supabase (PostgreSQL) — hosted, Row Level Security for admin/public separation
- **ORM:** Drizzle ORM — lightweight, type-safe, excellent Supabase PostgreSQL pairing
- **Auth:** Supabase Auth (email + password) — admin-only, no public user registration
- **Media:** Cloudinary — image/video upload, CDN delivery, transform API; no binary in Supabase Storage
- **i18n:** next-intl — Vietnamese (`vi`) primary, English (`en`) secondary; App Router-native
- **Affiliate tracking:** Custom server-side Route Handler — logs every click before redirecting
- **Analytics:** Custom Supabase-based click/view counters (revenue proxy) + Plausible (page-level analytics)
- **Package manager:** pnpm
- **Deployment:** Vercel (initial phase) — VPS migration planned later

## Key Patterns and Conventions

### Affiliate link tracking (CRITICAL — financially important)

Every affiliate link click MUST go through `GET /api/affiliate/[linkId]`. This Route Handler:
1. Looks up the affiliate link record by ID from Supabase
2. Logs the click to `link_clicks` table (clicked_at, user_agent, referrer, ip_hash)
3. Returns `Response.redirect(affiliateUrl, 302)` to the destination

**Never** link directly to affiliate URLs with `<a href>`. That bypasses tracking and loses revenue attribution.
The affiliate button/link in the UI must always point to `/api/affiliate/[linkId]`.

### Admin auth pattern

- Supabase Auth manages credentials (email + password login)
- `middleware.ts` checks for a valid Supabase session on all routes under `/(admin)/`
- Server-side DB operations in admin routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- Public-facing server components use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (subject to RLS)
- Only 2 admin accounts — no admin self-registration; accounts created via Supabase dashboard

### Server vs. Client components

- Default to React Server Components — fetch data directly in components
- Add `'use client'` only for interactivity: forms with state, event handlers, browser APIs
- Admin forms use Server Actions for mutations where possible (avoids separate API routes)

### i18n pattern

- `[locale]` dynamic segment wraps all routes
- `vi` is the default locale (primary audience: Vietnamese consumers)
- All user-visible text must use next-intl translation keys — never hardcode Vietnamese or English strings
- Translation files: `src/messages/vi.json` (primary), `src/messages/en.json`
- URL slugs use ASCII kebab-case (no Vietnamese diacritics in URLs)

### Naming conventions

- Files: kebab-case (`blog-card.tsx`, `affiliate-link.ts`)
- React components: PascalCase (`BlogCard`, `AffiliateButton`)
- Functions and variables: camelCase (`getPostBySlug`, `affiliateUrl`)
- Database tables: snake_case (Drizzle convention)
- URL slugs: ASCII kebab-case (`iphone-15-review`, not `đánh-giá-iphone-15`)

### Media pattern

- All images/videos uploaded via Cloudinary admin UI
- Only Cloudinary CDN URLs (and `public_id`) stored in database
- No binary blobs in Supabase Storage
- Cloudinary `public_id` stored alongside URL to enable transform operations

### Error handling

- API Route Handlers return `{ success: boolean, data?: T, error?: string }` envelope
- Server components use Next.js error boundaries (`error.tsx`) for rendering errors
- Never silently swallow errors — log server-side with context, surface user-friendly message client-side

### Immutability

- All data updates return new objects — never mutate existing ones
- Drizzle updates use explicit field lists, not spread of entire objects

## Environment and Configuration

> Variable names only — never commit values.

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (Supabase direct connection string for Drizzle migrations)

**Cloudinary:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

**Analytics:**
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional, for Plausible script)

**App:**
- `NEXT_PUBLIC_BASE_URL` (e.g., `https://yoursite.com`)

**Config files:**
- `next.config.ts` — next-intl plugin, Cloudinary image domains, `output: 'standalone'` for VPS migration readiness
- `drizzle.config.ts` — dialect: postgresql, schema path, migrations output path, DATABASE_URL
- `middleware.ts` — next-intl locale detection + Supabase admin session guard combined
- `tailwind.config.ts` — shadcn/ui content paths, custom editorial color palette
- `components.json` — shadcn/ui import alias (`@/components/ui`)

## Current Features

Active feature folders in `process/features/`:

| Feature | Folder | Status |
|---|---|---|
| Blog & Reviews | `process/features/blog-reviews/` | Planning — not started |
| Affiliate Tracking | `process/features/affiliate-tracking/` | Planning — not started |
| Admin Dashboard | `process/features/admin-dashboard/` | Planning — not started |

**Feature routing rule:** When working on a specific feature, check `process/features/{feature}/active/` for existing plans before creating new ones.

## Context Group Lifecycle

Context groups are durable knowledge domains, not feature folders.

Create a group when:
- a topic has 3+ durable docs
- a single doc exceeds roughly 800 lines with separable subtopics
- multiple agents repeatedly need only one slice of a large context file

**Planned but not yet created:**
- `uxui/` — create when UI component library and design token conventions are documented (after initial UI build)

Run `vc-audit-context` after every context organization change.

## Scan Metadata

- Generated: 2026-06-15
- HEAD: initial setup (greenfield — no source code)
- Mode: STUDY (vc-setup bootstrap)
- Package manager: pnpm (planned)

# Database Context

This file is the canonical Database context entrypoint for the Affiliate Review Blog.

Use it after `process/context/all-context.md` when the task needs schema changes, Drizzle queries, migrations, or Supabase connection setup.

---

## Scope

This group covers:

- Drizzle ORM schema definitions and table conventions
- Supabase PostgreSQL connection setup (service role vs. anon key)
- Row Level Security (RLS) policy patterns for admin/public separation
- Migration workflow (Drizzle Kit generate + push)
- Key table relationships and data model

It does not cover:

- Database hosting or infrastructure (belongs in `infra/`)
- Test database setup (belongs in `tests/`)
- Auth user management (belongs in `auth/`)

## Read When

Read this entrypoint when:

- adding or modifying database tables or columns
- writing or reviewing Drizzle queries
- running or creating migrations
- debugging database connection or query issues
- understanding how tables relate to features

## Quick Routing

No deeper docs yet — all database context is in this file. Create subdocs when schema docs exceed ~400 lines or migration procedures need their own doc.

## Source Paths

- `process/context/database/all-database.md` (this file)

## Update Triggers

Update this group when:

- schema changes are made (new tables, columns, relations)
- Drizzle version or migration tooling changes
- RLS policies change materially
- connection setup changes (pooler, new Supabase project)

---

## Planned Schema

> **Status:** Planned — no migrations exist yet as of 2026-06-15. Update this file when `schema.ts` is created.

### Tables

**`posts`** — blog review articles

```
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug          text UNIQUE NOT NULL        -- ASCII kebab-case, used in URL
title_vi      text NOT NULL               -- Vietnamese title (primary)
title_en      text                        -- English title (optional)
content_vi    text NOT NULL               -- rich HTML content (Vietnamese)
content_en    text                        -- rich HTML content (English, optional)
excerpt_vi    text                        -- short summary for listing cards
excerpt_en    text
cover_image   text                        -- Cloudinary CDN URL
status        text NOT NULL DEFAULT 'draft'  -- 'draft' | 'published'
author_id     uuid REFERENCES auth.users(id)
published_at  timestamptz
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

**`categories`** — product categories

```
id       uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug     text UNIQUE NOT NULL
name_vi  text NOT NULL
name_en  text
```

**`post_categories`** — M2M: posts ↔ categories

```
post_id      uuid REFERENCES posts(id) ON DELETE CASCADE
category_id  uuid REFERENCES categories(id) ON DELETE CASCADE
PRIMARY KEY (post_id, category_id)
```

**`affiliate_links`** — affiliate links for a specific post

```
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
post_id      uuid REFERENCES posts(id) ON DELETE CASCADE
platform     text NOT NULL   -- 'tiktok_shop' | 'shopee' | 'lazada' | 'amazon' | 'other'
label_vi     text NOT NULL   -- button text shown to Vietnamese users
label_en     text
url          text NOT NULL   -- actual affiliate destination URL (kept server-side)
display_url  text            -- human-readable URL shown to user (optional)
created_at   timestamptz DEFAULT now()
```

**`link_clicks`** — click event log (CRITICAL — financial data, one row per click)

```
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
affiliate_link_id uuid REFERENCES affiliate_links(id) ON DELETE CASCADE
clicked_at        timestamptz DEFAULT now()
user_agent        text
referrer          text
ip_hash           text    -- SHA-256 hash of IP address, never raw IP
```

**`post_views`** — page view event log

```
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
post_id    uuid REFERENCES posts(id) ON DELETE CASCADE
viewed_at  timestamptz DEFAULT now()
user_agent text
referrer   text
```

**`media`** — Cloudinary media attached to posts

```
id                   uuid PRIMARY KEY DEFAULT gen_random_uuid()
post_id              uuid REFERENCES posts(id) ON DELETE CASCADE
cloudinary_public_id text NOT NULL    -- for future transforms
url                  text NOT NULL    -- Cloudinary CDN URL
resource_type        text NOT NULL    -- 'image' | 'video'
created_at           timestamptz DEFAULT now()
```

### Key Relationships

```
posts ──< post_categories >── categories
posts ──< affiliate_links ──< link_clicks
posts ──< post_views
posts ──< media
auth.users ──< posts (author_id)
```

### RLS Policy Pattern

- **Visitors (anon key):** SELECT on `posts` WHERE `status = 'published'`; INSERT only on `link_clicks` and `post_views` (tracking); no access to `affiliate_links.url` or admin data
- **Admins (service role key):** full access to all tables — bypasses RLS entirely
- `affiliate_links.url` should never be exposed to the client — the redirect Route Handler reads it server-side and does not return it to the browser

### Connection Setup

Two Drizzle clients used throughout the app:

- **Server admin client** (`src/lib/db/index.ts` with service role key): used in admin route handlers and server actions that need full write access
- **Server public client** (anon key): used in public-facing server components; subject to RLS

Drizzle config (`drizzle.config.ts`):

```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Migration Workflow

```bash
pnpm drizzle-kit generate   # generate migration SQL from schema changes
pnpm drizzle-kit push       # apply to Supabase (dev)
pnpm drizzle-kit studio     # visual DB browser (optional)
```

Always review generated SQL before pushing to production. Never push directly to production without reviewing migration files.

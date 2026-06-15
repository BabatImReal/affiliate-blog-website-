# Infrastructure Context

This file is the canonical Infrastructure context entrypoint for the Affiliate Review Blog.

Use it after `process/context/all-context.md` when the task needs deployment configuration, environment variable setup, or hosting migration guidance.

---

## Scope

This group covers:

- Vercel deployment configuration (current hosting)
- VPS migration planning (future)
- Environment variable management
- Next.js `output` mode for deployment compatibility
- Domain and CDN configuration

It does not cover:

- Supabase database hosting (belongs in `database/`)
- Cloudinary media CDN (covered inline in `all-context.md`)
- CI/CD pipelines (not configured yet — add a doc here when CI is set up)

## Read When

Read this entrypoint when:

- configuring Vercel deployment settings
- adding or managing environment variables
- planning VPS migration
- debugging production-only issues related to build or runtime

## Quick Routing

No deeper docs yet. Create subdocs when CI/CD, Docker config, or VPS migration procedures need documentation.

## Source Paths

- `process/context/infra/all-infra.md` (this file)

## Update Triggers

Update this group when:

- deployment platform changes (Vercel → VPS)
- new environment variables are added
- build output mode changes
- CI/CD pipeline is configured

---

## Current Deployment: Vercel

### Setup

- Connect GitHub repo to Vercel project
- Framework: Next.js (auto-detected)
- Build command: `pnpm build`
- Output directory: `.next` (default)
- Root directory: `/` (not a monorepo)

### Environment Variables in Vercel

Set via Vercel dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL          (all environments)
NEXT_PUBLIC_SUPABASE_ANON_KEY     (all environments)
SUPABASE_SERVICE_ROLE_KEY         (production + preview only)
DATABASE_URL                      (production + preview only)
CLOUDINARY_CLOUD_NAME             (all environments)
CLOUDINARY_API_KEY                (production + preview only)
CLOUDINARY_API_SECRET             (production + preview only)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (all environments)
NEXT_PUBLIC_BASE_URL              (set per environment)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN      (production only)
```

Never commit real values to git. Use `.env.example` to document variable names.

### Vercel preview deployments

Each PR gets a preview URL. This is useful for testing admin UI. Preview deployments use the same Supabase project unless a separate test project is configured.

---

## Future: VPS Migration

When traffic or cost justifies moving off Vercel:

- Next.js must be built with `output: 'standalone'` in `next.config.ts` — configure this from day one so migration is non-breaking
- Serve the standalone build with Node.js or inside a Docker container
- Reverse proxy: Nginx or Caddy in front of the Node.js process
- Environment variables: inject via `.env` file or system environment on the VPS

`next.config.ts` setting to add from day one:

```ts
const nextConfig = {
  output: 'standalone',
  // ... other config
}
```

This ensures the build is VPS-compatible without changes when migration happens.

---

## Domain Configuration

- Primary domain: configured in Vercel (add custom domain → update DNS)
- Vietnamese SEO: ensure `hreflang` tags are set correctly via next-intl for `vi` and `en`
- Cloudinary: add Cloudinary CDN domain (`res.cloudinary.com`) to Next.js `images.domains` in `next.config.ts`

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' }
  ]
}
```

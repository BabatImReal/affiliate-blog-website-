# UI Prototype: Wirecutter-inspired Editorial Design

- Feature: blog-reviews
- Date: 15-06-26
- Mode: FAST (user pre-approved EXECUTE)
- Reports: D:\Data\review-blog-project\affiliate-blog-website-\process\features\blog-reviews\reports
- Plans: D:\Data\review-blog-project\affiliate-blog-website-\process\features\blog-reviews\active

## Objective

Build a polished, editorial Wirecutter-genre UI prototype for a Vietnamese affiliate
review site. Real Next.js 14 / Tailwind v3 / shadcn components and pages, static mock
data, tracked affiliate buy buttons. Own identity (editorial red #C41230).

## Touchpoints

Create:
- src/lib/mock-data.ts
- src/components/layout/header.tsx
- src/components/layout/footer.tsx
- src/components/blog/post-card.tsx
- src/components/blog/verdict-callout.tsx
- src/components/blog/pros-cons-block.tsx
- src/components/blog/affiliate-button.tsx
- src/components/blog/category-filter.tsx (client filter, replaces Tabs dep)

Update:
- tailwind.config.ts (design tokens)
- src/app/globals.css (body background/color)
- next.config.mjs (unsplash remotePattern)
- src/messages/vi.json, src/messages/en.json (new keys)
- src/components/layout/locale-switcher.tsx (VI | EN buttons)
- src/app/[locale]/layout.tsx (Header + Footer wrap)
- src/app/[locale]/(public)/page.tsx (homepage)
- src/app/[locale]/(public)/blog/page.tsx (listing)
- src/app/[locale]/(public)/blog/[slug]/page.tsx (detail)

## Public Contracts

- MockPost type + MOCK_POSTS export from src/lib/mock-data.ts
- trackedHref(linkId) from @/lib/affiliate is the ONLY affiliate href source
- Link/usePathname/useRouter from @/i18n/navigation for all internal links
- Verdict union: 'best' | 'great' | 'budget'

## Blast Radius

UI-only. No DB, no API, no schema changes. Layout wrapping affects all [locale] routes
including admin/login (Header/Footer added at locale layout). Mitigation: keep Header
links to public routes; admin pages render under same chrome which is acceptable for a
prototype. No changes to middleware, affiliate API, or DB.

## Decisions

- Category filter: custom client component (no shadcn Tabs install needed).
- Images: add images.unsplash.com to remotePatterns, use optimized next/image.
- Header is client (mobile toggle); Footer + pages are server components.

## Verification Evidence

- Inspect imports/prop types for TS correctness after writing.
- Confirm all user-visible strings route through next-intl keys.
- Confirm every affiliate button uses trackedHref(linkId).
- Optional: user runs `pnpm dev` / `pnpm build` to confirm.

## Implementation Checklist

1. tailwind.config.ts — add brand/surface/editorial colors + serif/sans fonts
2. src/app/globals.css — body background #F7F7F5, color #1C1C1A
3. next.config.mjs — add unsplash remotePattern
4. src/messages/vi.json — add Nav/Home/Blog/Footer keys
5. src/messages/en.json — EN equivalents
6. src/lib/mock-data.ts — MockPost type + 6 MOCK_POSTS
7. src/components/layout/locale-switcher.tsx — VI | EN buttons
8. src/components/layout/header.tsx — sticky header, red bar, nav, mobile toggle
9. src/components/layout/footer.tsx — dark 3-col footer
10. src/components/blog/affiliate-button.tsx — tracked CTA with platform badge
11. src/components/blog/post-card.tsx — editorial card
12. src/components/blog/verdict-callout.tsx — our-pick box
13. src/components/blog/pros-cons-block.tsx — pros/cons columns
14. src/components/blog/category-filter.tsx — client filter pills + grid
15. src/app/[locale]/layout.tsx — wrap with Header + Footer
16. src/app/[locale]/(public)/page.tsx — homepage sections
17. src/app/[locale]/(public)/blog/page.tsx — listing with filter
18. src/app/[locale]/(public)/blog/[slug]/page.tsx — full review detail
19. Self-review imports/types; report any manual commands

## Resume and Execution Handoff

- Selected plan: process/features/blog-reviews/active/ui-prototype_PLAN_15-06-26.md
- Execute in checklist order, tokens first.
- If shadcn Tabs preferred later: `pnpm dlx shadcn@latest add tabs`.

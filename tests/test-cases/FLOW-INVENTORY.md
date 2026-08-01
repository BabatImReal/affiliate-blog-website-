# Flow Inventory: ReviewHub (affiliate-blog-website)

- **Last updated:** 2026-08-01
- **Source of truth for:** which flows exist, their priority, and test status.
- **Target environment:** `http://localhost:3000` — LOCAL dev, non-production.
- **Real writes:** NOT opted in. All destructive flows are mocked via `page.route`.

## User-confirmed notes
> Verbatim answers from the user about scope, priorities, and flows to include
> or exclude. Never overwrite — append with dates.

- 2026-08-01: "Target: my local dev server at http://localhost:3000 — this is a LOCAL, NON-PRODUCTION environment. Set TEST_BASE_URL=http://localhost:3000 (never the :4321 default)."
- 2026-08-01: "I have NOT opted into real writes — keep every create/modify/delete case MOCKED by default."
- 2026-08-01: "Do not run anything against any non-local target."
- 2026-08-01: "Inventory confirmed. Fix observation #5, split F-07 into a read-only href check (F-07a) and the mocked click (F-07b), then proceed with F-02."
- 2026-08-01: "lets revert it, and fix the skill, add that cannot fix the code." → The obs-#5 category-filter feature was implemented in product code during the F-02 pass; **reverted** (QA must not change the product). Feature preserved at `git stash@{0}`; tracked as **FIX-002** with 8 deferred F-02 tests. See `TEST-LOG.md` and `FIX-BACKLOG.md`.

## Environment findings that gate testing

| Finding | Evidence | Impact on testing |
|---|---|---|
| No `.env.local` exists; only `.env.example` | `ls .env*` | Supabase + Cloudinary unavailable |
| All 4 admin routes return **500**, not a login redirect | live probe; `src/middleware.ts:20-33` calls `createServerClient` with `process.env.NEXT_PUBLIC_SUPABASE_URL!` which is `undefined` | F-19 cannot assert the intended redirect until env vars exist |
| `/api/affiliate/[linkId]` returns **500** | live probe; `src/app/api/affiliate/[linkId]/route.ts:14` queries Drizzle/Postgres | F-26/F-27 must be mocked or deferred |
| All 6 admin pages are 7-line stubs (`<h1>Admin — stub</h1>`) | `src/app/[locale]/(admin)/**/page.tsx` | F-20…F-25 have no behavior to test yet |
| Login page is a stub (`"Login form stub."`, no form) | `src/app/[locale]/login/page.tsx` | F-18 has no form to exercise |
| Content comes from `src/lib/mock-data.ts`, not the DB | `MOCK_POSTS` imported by home/blog/detail pages | Public flows are **fully testable with no secrets** |

## Flows

| ID | Flow | Area | Entry route | Auth | ⚠️ Destructive | Priority | Status | Test-case doc |
|----|------|------|-------------|------|----------------|----------|--------|---------------|
| F-01 | Homepage renders (hero, trust bar, top pick, category grid, latest reviews, CTA) | public | `/[locale]` | none | no | P1 | untested | — |
| F-02 | Blog listing + **category filter** (pills, live count, empty state, reset) — client-side | public | `/[locale]/blog` | none | no | P0 | **covered** (13 cases) | `tests/test-cases/f-02-category-filter.md` |
| F-02b | Category filter via **`?category=` URL** + nav-link filtering (feature reverted — see FIX-002) | public | `/[locale]/blog?category=` | none | no | P1 | **deferred** (8 `test.skip`) | `tests/test-cases/f-02-category-filter.md` |
| F-03 | Post card → review detail navigation | public | `/[locale]/blog` → `/blog/[slug]` | none | no | P1 | untested | — |
| F-04 | Review detail renders (breadcrumb, verdict callout, pros/cons, score, sidebar, disclaimer) | public | `/[locale]/blog/[slug]` | none | no | P1 | untested | — |
| F-05 | Unknown review slug → 404 | public | `/[locale]/blog/<bad>` | none | no | P2 | untested | — |
| F-06 | Category card (homepage) → blog listing | public | `/[locale]` → `/blog` | none | no | P2 | untested | — |
| F-07a | **Affiliate button href integrity** — every buy button points at `/api/affiliate/[linkId]`, never a raw merchant URL; correct `rel="nofollow sponsored noopener noreferrer"` + `target="_blank"` | public | `/[locale]/blog/[slug]` | none | no (no navigation) | P0 | untested | — |
| F-07b | **Affiliate click → tracked redirect** (click the button, assert the tracked request fires and lands on the destination) | public/api | `/api/affiliate/[linkId]` | none | ⚠️ yes (logs click) — **mocked** | P0 | untested | — |
| F-08 | Mobile buy bar appears after scrolling past verdict (IntersectionObserver) | public | `/[locale]/blog/[slug]` @ mobile | none | ⚠️ yes (links to tracked URL) | P1 | untested | — |
| F-09 | Header desktop nav + logo → home | public | all pages | none | no | P2 | untested | — |
| F-10 | Header mobile menu toggle (open/close, `aria-expanded`, focus trapping via `tabIndex`) | public | all pages @ mobile | none | no | P1 | untested | — |
| F-11 | Locale switcher vi ↔ en preserves current path | cross-cutting | all pages | none | no | P0 | untested | — |
| F-12 | Locale routing: `/` → `/vi`; unknown locale segment handling | cross-cutting | `/` | none | no | P1 | untested | — |
| F-13 | Footer links + legal/affiliate policy | public | all pages | none | no | P2 | untested | — |
| F-14 | Skip-to-content a11y link becomes visible on focus | cross-cutting | all pages | none | no | P2 | untested | — |
| F-15 | Newsletter subscribe form (homepage CTA) | public | `/[locale]` | none | ⚠️ yes (would submit) | P1 | untested | — |
| F-16 | Header search button | public | all pages | none | no | P2 | untested | — |
| F-17 | i18n integrity: no raw translation keys / no missing-message errors in either locale | cross-cutting | all pages | none | no | P1 | untested | — |
| F-18 | Admin login | auth | `/[locale]/login` | n/a | ⚠️ yes | P0 | untested | — |
| F-19 | **Admin route guard** — unauthenticated → redirect to `/[locale]/login` | auth | `/[locale]/{dashboard,posts,links,media}` | required | no | P0 | untested | — |
| F-20 | Admin dashboard analytics | admin | `/[locale]/dashboard` | required | no | P1 | untested | — |
| F-21 | Admin posts list | admin | `/[locale]/posts` | required | no | P1 | untested | — |
| F-22 | Admin create post | admin | `/[locale]/posts/new` | required | ⚠️ yes | P0 | untested | — |
| F-23 | Admin edit post | admin | `/[locale]/posts/[id]/edit` | required | ⚠️ yes | P0 | untested | — |
| F-24 | Admin affiliate-link CRUD | admin | `/[locale]/links` | required | ⚠️ yes | P0 | untested | — |
| F-25 | Admin media library (Cloudinary upload) | admin | `/[locale]/media` | required | ⚠️ yes | P1 | untested | — |
| F-26 | `GET /api/affiliate/[linkId]` — 302 to destination + click row written | api | `/api/affiliate/[linkId]` | none | ⚠️ yes | P0 | untested | — |
| F-27 | `GET /api/affiliate/[linkId]` — unknown id → 404 envelope | api | `/api/affiliate/<bad>` | none | no | P1 | untested | — |
| F-28 | `GET /api/analytics` — `{success, data}` envelope | api | `/api/analytics` | none | no | P2 | untested | — |
| F-29 | Responsive layout across mobile / tablet / desktop | cross-cutting | all pages | none | no | P1 | untested | — |
| F-30 | Accessibility baseline (roles, labels, contrast-independent structure, keyboard nav) | cross-cutting | all pages | none | no | P1 | untested | — |

## Blocked / not-yet-meaningful flows

These are in the inventory for completeness but cannot produce signal today:

- **F-18, F-20 – F-25** — pages are stubs with a single `<h1>`. Testing them now asserts placeholder text, which would have to be rewritten the moment they're built.
- **F-19** — the *intended* behavior (redirect to login) is untestable while missing env vars make the middleware throw a 500 first. Testable as a **bug-reproduction** case today.
- **F-26, F-27** — require either a live DB or full request mocking.

## Product observations found during discovery (not yet bugs, worth your call)

1. **`CATEGORY_META` counts are fictional.** Homepage advertises Công nghệ 24 / Gia dụng 18 / Âm thanh 11 / Làm đẹp 9 reviews, but `MOCK_POSTS` holds 2 / 2 / 2 / **0**. (`src/lib/mock-data.ts:120-125`)
2. **"Làm đẹp" filter yields zero results** — the empty state at `category-filter.tsx:80-92` is reachable in the default dataset. Good news for testing; possibly bad news for users.
3. **Newsletter form has no `action` and no `onSubmit`** (`page.tsx:102-120`) — submitting navigates to `?email=...` and silently loses the address.
4. **Header search button has no handler** (`header.tsx:64-70`) — a visible, focusable dead control.
5. ~~**All 5 header nav links point to `/blog`** — Tech/Home/Audio/Beauty are not category-filtered.~~ **FIXED 2026-08-01.** Added `CATEGORY_NAV` (navKey ↔ category ↔ ASCII slug) as the single source of truth in `src/lib/mock-data.ts`; header now links to `/blog?category=<slug>`; `blog/page.tsx` resolves the slug server-side and passes `initialCategory` to `CategoryFilter` (keyed so a new nav click resets state). Unknown slugs fall back to "all". Verified for `vi` + `en`.
6. **Empty-state and filter strings are hardcoded Vietnamese**, bypassing next-intl (`category-filter.tsx:81,83,90`) — they stay Vietnamese on `/en`. Confirmed by `TC-f02-022` (expected-failure).
7. **Reset button doesn't clear `?category=`** (found while testing F-02). From a deep-linked filter, clicking reset shows all posts but leaves the param in the URL — a reload silently re-applies the old filter. Confirmed by `TC-f02-016`.
8. **Pill filtering never touches the URL** (`category-filter.tsx` is local state only) — filtered views aren't shareable or restored on reload. Design choice, not a bug; pinned by `TC-f02-015` so it can't change silently.

## Test harness

- Config: `playwright.config.ts` (repo root) — `baseURL` from `TEST_BASE_URL`,
  default `http://localhost:3000`; prod-guard aborts on any non-loopback,
  non-allowlisted host; projects `chromium` + `mobile-chrome` (Pixel 5).
- Run: `pnpm test:e2e` · Report: `pnpm test:e2e:report`
- Specs live in `tests/*.spec.ts`, one per flow, each test titled with its case ID.

## Run history

| Date | Flow | Result |
|---|---|---|
| 2026-08-01 | F-02 | 39 passed, 3 skipped, 0 unexpected failures (exit 0). 1 documented expected-failure: `TC-f02-022`. **Superseded** — this run included the obs-#5 product change that was later reverted. |
| 2026-08-01 | F-02 (post-revert re-verify) | 25 passed, 17 skipped, 0 unexpected failures (exit 0). Product code clean vs HEAD. 23 genuine passes + 2 expected-failures (`TC-f02-022` × 2 projects); 17 skips = 8 FIX-002-deferred cases × 2 projects, plus `TC-f02-021` (mobile-only) on chromium. |

## Status lifecycle

`untested` → `in-progress` → `covered` (or `waived` with a reason).

## Update rule

Every run: pick the highest-priority `untested` flow, confirm with the user, test
it, then update its row (status + doc link) and report which flows remain.

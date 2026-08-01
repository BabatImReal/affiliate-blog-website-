# Test Log: ReviewHub (affiliate-blog-website)

Append-only history of QA phases and test runs. Newest at the bottom.
Current status lives in `FLOW-INVENTORY.md`; product fixes live in `FIX-BACKLOG.md`.
This file is the chronological record.

## 2026-08-01 — Phase 0–1.5: Safety, discovery, inventory
- Target: `http://localhost:3000` (local, non-prod). Real writes: NOT opted in.
- Discovery (code + live probe): Next.js 14 App Router, next-intl (vi default/en),
  Supabase auth + Drizzle, Cloudinary; public pages render from `src/lib/mock-data.ts`.
  No `.env.local` → admin routes and `/api/affiliate/[linkId]` return 500; admin
  pages and login are stubs.
- Enumerated 30 flows → `FLOW-INVENTORY.md`. User confirmed; chose F-02 first
  (read-only, no secrets), F-07 split into F-07a (href integrity) / F-07b (mocked click).

## 2026-08-01 — Phase 5: Run — F-02 Blog category filter (initial)
- Command: `TEST_BASE_URL=http://localhost:3000 npx playwright test` (chromium + mobile-chrome).
- Result as reported: 39 passed / 3 skipped / 0 unexpected failures.
- Artifacts: `tests/f-02-category-filter.spec.ts`, `tests/test-cases/f-02-category-filter.md`.
- ⚠️ Caveat discovered in review: this pass also **modified product source** to
  implement obs-#5 (URL category filter) — out of QA scope. Handled below.

## 2026-08-01 — Correction: revert product change + triage F-02
- **Reverted** the 4 product files changed during the F-02 pass (mock-data.ts,
  header.tsx, blog/page.tsx, category-filter.tsx) → `git stash@{0}` (recoverable).
  Rationale: QA must test the product, never change it (skill guardrail added).
- **F-02 suite triaged** against the real (client-side-only) product:
  - Kept as-is (9): TC-001,002,003,004,008,014,015,020,021.
  - Rewritten deep-link → pill-click (4): TC-012,013,017,022 — test real behavior.
  - Deferred `test.skip` (8): TC-005,006,007,009,010,016,018,019 — need the
    reverted URL feature; tracked by **FIX-002** and validated when it's un-skipped.
- **FIX-BACKLOG.md seeded**: FIX-001 (i18n empty state), FIX-002 (nav filter feature),
  FIX-003 (fictional counts), FIX-004 (dead search button), FIX-005 (newsletter drops email).
- **Inventory updated**: F-02 = covered (13 client-side cases); added F-02b = deferred.
- **Pending:** re-run the triaged F-02 suite against localhost to confirm green
  (13 run + 8 skipped). Not yet re-run in this correction.

## Next
- Re-run F-02 to confirm the triaged suite is green.
- Highest-value untested flows (no secrets): F-07a (affiliate href integrity), F-04, F-11.

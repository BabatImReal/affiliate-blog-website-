# Fix Backlog: ReviewHub (affiliate-blog-website)

Product defects and required fixes found during QA. **QA does not fix these** —
they are handed to developers and **re-validated** by re-running the linked test
after the fix. Separate from the tests on purpose.

See `.claude/skills/qa-test-generator/references/fix-backlog.md` for the format
and the re-validation loop.

| ID | Title | Type | Severity | Flow | Pinned by (test) | Status | Owner |
|----|-------|------|----------|------|------------------|--------|-------|
| FIX-001 | Empty-state copy is hardcoded Vietnamese on `/en` | bug (i18n) | medium | F-02 | TC-f02-022 (`test.fail`) | open | — |
| FIX-002 | Category nav links don't filter (obs #5) — no `?category=` URL feature | missing-feature | low | F-02b | 8 deferred cases (see below) | open | — |
| FIX-003 | `CATEGORY_META` counts are fictional (24/18/11/9 vs actual 2/2/2/0) | bug | low | F-01 | _(to be pinned when F-01 is tested)_ | open | — |
| FIX-004 | Header search button has no handler (dead control) | bug | low | F-16 | _(to be pinned when F-16 is tested)_ | open | — |
| FIX-005 | Newsletter form has no `action`/`onSubmit`; submitting drops the address | bug | medium | F-15 | _(to be pinned when F-15 is tested)_ | open | — |

---

### FIX-001 — Empty-state copy is hardcoded Vietnamese on `/en`
- **Type:** bug (i18n) | **Severity:** medium | **Flow:** F-02
- **Where:** `src/components/blog/category-filter.tsx:81,83,90` — literal strings
  ("Chưa có bài đánh giá", "Hãy thử chọn danh mục khác…", "Xem tất cả") bypass next-intl.
- **Repro:** open `/en/blog`, select the empty category (Làm đẹp) → empty-state
  renders in Vietnamese instead of English.
- **Expected:** localized English copy via next-intl.
- **Pinned by:** `TC-f02-022` (`test.fail` — documents the defect; flips red when
  someone "fixes" it wrong, passes when fixed right).
- **Status:** open → _(dev)_ → fixed → _(QA re-runs TC-f02-022)_ → validated

### FIX-002 — Category nav links don't filter (obs #5) — no `?category=` URL feature
- **Type:** missing-feature | **Severity:** low | **Flow:** F-02b
- **Context:** During the F-02 QA pass this feature was implemented in product
  code, then **reverted** — QA must not change the product. The reverted work is
  preserved at **`git stash@{0}`** ("obs-5 URL category-filter feature").
- **What's wanted:** header category links carry `/blog?category=<slug>`; the
  listing resolves the slug server-side and preselects the filter; unknown/blank
  slugs fall back to "all"; a second nav click re-applies (needs a `key=` remount);
  and the **reset control should clear `?category=`** (the stale-param bug the
  earlier implementation had).
- **Pinned by / validated by:** the 8 deferred `test.skip` cases in
  `tests/f-02-category-filter.spec.ts` — `TC-f02-005, 006, 007, 009, 010, 016,
  018, 019`. **Un-skip and run them to validate the fix.**
- **Status:** open → _(dev builds it)_ → fixed → _(QA un-skips the 8 cases)_ → validated

### FIX-003 — `CATEGORY_META` counts are fictional
- **Type:** bug | **Severity:** low | **Flow:** F-01 (homepage)
- **Where:** `src/lib/mock-data.ts:120-125` — advertises Công nghệ 24 / Gia dụng 18 /
  Âm thanh 11 / Làm đẹp 9, but `MOCK_POSTS` holds 2 / 2 / 2 / 0.
- **Expected:** displayed counts reflect real data (or are clearly placeholder).
- **Pinned by:** to be added when F-01 is tested.
- **Status:** open

### FIX-004 — Header search button is a dead control
- **Type:** bug (a11y/UX) | **Severity:** low | **Flow:** F-16
- **Where:** `src/components/layout/header.tsx:64-70` — visible, focusable
  `<button>` with no `onClick`.
- **Expected:** either wire up search or remove the control.
- **Pinned by:** to be added when F-16 is tested.
- **Status:** open

### FIX-005 — Newsletter form silently drops the address
- **Type:** bug | **Severity:** medium | **Flow:** F-15
- **Where:** homepage newsletter form — no `action`, no `onSubmit`; submitting
  navigates to `?email=…` and loses the address.
- **Expected:** submission is handled (persisted or sent) with user feedback.
- **Pinned by:** to be added when F-15 is tested.
- **Status:** open

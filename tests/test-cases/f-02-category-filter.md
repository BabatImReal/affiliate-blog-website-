# Test Cases: F-02 — Blog listing + category filter

- **Scope:** The review listing page and its category filter — pill selection, result
  count, empty state, reset, `?category=` deep-linking, and header-nav entry. Covers
  `vi` and `en`. **Not** covered here: review detail rendering (F-04), affiliate
  buttons (F-07a/b), general i18n sweep (F-17).
- **App under test:** `http://localhost:3000` — LOCAL dev, non-production.
- **Preconditions (global):** Dev server running. No auth required — this flow is
  fully public. Content comes from `MOCK_POSTS` in `src/lib/mock-data.ts`, so the
  dataset is deterministic and needs no DB or seed.
- **Destructive actions:** **None.** Every case in this document is read-only —
  no request creates, modifies, or deletes data. Nothing requires mocking, and no
  real-write opt-in is needed.
- **Last updated:** 2026-08-01

> **2026-08-01 — Triage note (revert of obs #5).** The `?category=` URL feature
> that several cases below assume was implemented in product code during this pass,
> then **reverted** (QA must not change the product; tracked as **FIX-002**,
> preserved at `git stash@{0}`). This suite now tests the **real, client-side**
> filter:
> - **Kept as-is (9):** TC-001, 002, 003, 004, 008, 014, 015, 020, 021
> - **Rewritten deep-link → pill-click (4):** TC-012, 013, 017, 022 — same
>   behavior, no URL dependency
> - **Deferred `test.skip` (8):** TC-005, 006, 007, 009, 010, 016, 018, 019 —
>   validate by un-skipping once FIX-002 is built. Their descriptions below still
>   describe the intended feature behavior.

## Dataset under test (`src/lib/mock-data.ts`)

| Category | Slug | Posts |
|---|---|---|
| Công nghệ | `cong-nghe` | 2 |
| Gia dụng | `gia-dung` | 2 |
| Âm thanh | `am-thanh` | 2 |
| Làm đẹp | `lam-dep` | **0** |
| **Total** | — | **6** |

## Coverage matrix

| Feature / Input | Happy | Negative | Edge | Boundary | Worst-case | Authorization |
|---|---|---|---|---|---|---|
| Filter pills | default=All shows 6; select category filters (001, 002, 003, 004) | — (pills are a closed set; no invalid input reachable) | double-click same pill is idempotent (014); pill click does not alter URL (015) | max=all 6 (001); min=0 results (012) | — (no network; pure client state) | n/a — public |
| `?category=` deep-link | valid slug preselects + filters (005) | unknown slug → falls back to All (009); blank value → All (010) | deep-link straight to the empty category (012) | 1000-char value handled without crash (019) | value containing markup is escaped, not executed (018) | n/a — public |
| Header nav entry | nav link applies the filter (006); category→category re-applies (007) | — | — | — | — | n/a — public |
| Result count (`aria-live`) | count matches rendered cards per category (002, 017) | — | 0 shown for empty category (012) | per-category counts sum to total (017) | — | n/a — public |
| Empty state | reset button restores full list (013) | — | reachable by default via Làm đẹp (012); reset leaves stale URL param (016) | — | — | n/a — public |
| Localization | `en` renders English count (008) | — | — | — | empty-state copy not translated (022 — **known defect**) | n/a — public |
| Accessibility / viewport | keyboard-operable pills, `aria-pressed` tracks state (020) | — | mobile viewport renders filter + results (021) | — | — | n/a — public |

**Empty cells are deliberate:** filter pills accept no free-form input, so there is
no negative case; the filter is pure client-side state with no network call, so there
is no backend-failure case. Authorization is uniformly n/a — the listing is public,
requires no session, and exposes no per-user data.

---

## Cases

### TC-f02-001 — Listing shows all reviews by default
- **Type:** happy | **Priority:** P0 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/vi/blog`.
- **Test data:** —
- **Expected result:** The "Tất cả" pill has `aria-pressed="true"`; exactly 6 review
  cards render; the live-count region reads `6` followed by the review-count label.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-001`

### TC-f02-002 — Selecting a category filters the list and updates the count
- **Type:** happy | **Priority:** P0 | **Destructive:** —
- **Precondition:** On `/vi/blog`, unfiltered.
- **Steps:**
  1. Click the **Công nghệ** pill.
- **Test data:** category = `Công nghệ` (2 posts)
- **Expected result:** Exactly 2 cards render; the live count reads `2`; **Công nghệ**
  becomes the only pressed pill inside the filter group; every rendered card shows
  the Công nghệ category label.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-002`

### TC-f02-003 — Switching directly between two categories replaces the results
- **Type:** happy | **Priority:** P1 | **Destructive:** —
- **Precondition:** On `/vi/blog` with **Âm thanh** selected.
- **Steps:**
  1. Click the **Âm thanh** pill.
  2. Click the **Gia dụng** pill.
- **Test data:** Âm thanh (2) → Gia dụng (2)
- **Expected result:** After step 2 only Gia dụng posts render; no Âm thanh post
  remains; exactly one pill is pressed.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-003`

### TC-f02-004 — "Tất cả" restores the full list after filtering
- **Type:** happy | **Priority:** P1 | **Destructive:** —
- **Precondition:** On `/vi/blog`.
- **Steps:**
  1. Click **Công nghệ**.
  2. Click **Tất cả**.
- **Test data:** —
- **Expected result:** 6 cards render again; live count reads `6`; **Tất cả** is pressed.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-004`

### TC-f02-005 — Deep-link with a valid `?category=` slug preselects that filter
- **Type:** happy | **Priority:** P0 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate directly to `/vi/blog?category=cong-nghe`.
- **Test data:** slug = `cong-nghe`
- **Expected result:** Page renders already filtered — 2 cards, live count `2`,
  **Công nghệ** pressed on first paint (no click required).
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-005`

### TC-f02-006 — Header nav category link lands on the filtered listing
- **Type:** happy | **Priority:** P0 | **Destructive:** —
- **Precondition:** On the homepage `/vi`, desktop viewport.
- **Steps:**
  1. Click the **Âm thanh** link in the main navigation.
- **Test data:** —
- **Expected result:** URL becomes `/vi/blog?category=am-thanh`; 2 cards render;
  **Âm thanh** is pressed. *(Regression guard for the fix to observation #5 — these
  links previously all pointed at an unfiltered `/blog`.)*
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-006`

### TC-f02-007 — Navigating category → category re-applies the new filter
- **Type:** happy | **Priority:** P1 | **Destructive:** —
- **Precondition:** On `/vi/blog?category=am-thanh`, desktop viewport.
- **Steps:**
  1. Click the **Công nghệ** link in the main navigation.
- **Test data:** am-thanh → cong-nghe
- **Expected result:** URL becomes `/vi/blog?category=cong-nghe`; **Công nghệ** is
  pressed and Âm thanh is not; Công nghệ posts render. *(Guards the `key=` remount —
  without it the client filter state would survive the navigation and show the old
  category.)*
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-007`

### TC-f02-008 — English locale renders the localized count label
- **Type:** happy | **Priority:** P1 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/en/blog`.
- **Test data:** locale = `en`
- **Expected result:** Live count reads `6 reviews`; the all-pill is labelled `All`.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-008`

### TC-f02-009 — Unknown `?category=` slug falls back to showing everything
- **Type:** negative | **Priority:** P1 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/vi/blog?category=bogus-not-a-category`.
- **Test data:** slug = `bogus-not-a-category`
- **Expected result:** No error; 6 cards render; **Tất cả** is pressed. The page does
  not 404 and does not render an empty state.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-009`

### TC-f02-010 — Blank `?category=` value falls back to showing everything
- **Type:** negative | **Priority:** P2 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/vi/blog?category=`.
- **Test data:** slug = `` (empty)
- **Expected result:** 6 cards render; **Tất cả** is pressed.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-010`

### TC-f02-012 — Category with zero posts shows the empty state
- **Type:** edge | **Priority:** P0 | **Destructive:** —
- **Precondition:** None. (Làm đẹp has 0 posts in the default dataset.)
- **Steps:**
  1. Navigate to `/vi/blog?category=lam-dep`.
- **Test data:** slug = `lam-dep` (0 posts)
- **Expected result:** Zero review cards; live count reads `0`; the empty-state
  message and a reset button are visible; **Làm đẹp** is pressed.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-012`

### TC-f02-013 — Reset button in the empty state restores the full list
- **Type:** edge | **Priority:** P0 | **Destructive:** —
- **Precondition:** On `/vi/blog?category=lam-dep` showing the empty state.
- **Steps:**
  1. Click the reset button ("Xem tất cả").
- **Test data:** —
- **Expected result:** 6 cards render; live count reads `6`; **Tất cả** is pressed;
  the empty state is gone.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-013`

### TC-f02-014 — Clicking the same pill twice is idempotent
- **Type:** edge | **Priority:** P2 | **Destructive:** —
- **Precondition:** On `/vi/blog`.
- **Steps:**
  1. Click **Gia dụng**.
  2. Click **Gia dụng** again.
- **Test data:** —
- **Expected result:** Still exactly 2 cards; count still `2`; **Gia dụng** still the
  only pressed pill. No duplicate rendering, no toggle-off.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-014`

### TC-f02-015 — Pill selection is client-only and does not alter the URL
- **Type:** edge | **Priority:** P2 | **Destructive:** —
- **Precondition:** On `/vi/blog`.
- **Steps:**
  1. Record the current URL.
  2. Click **Âm thanh**.
  3. Compare the URL.
- **Test data:** —
- **Expected result:** Results filter to 2, but the URL is unchanged (no `?category=`
  appended). **Documents current design:** a pill-filtered view is not shareable and
  not restored by reload. Asserted so the behavior can't change silently.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-015`

### TC-f02-016 — Reset from a deep-linked filter leaves a stale URL param
- **Type:** edge | **Priority:** P2 | **Destructive:** —
- **Precondition:** On `/vi/blog?category=lam-dep`.
- **Steps:**
  1. Click the reset button.
  2. Inspect the URL.
  3. Reload the page.
- **Test data:** —
- **Expected result (current behavior):** After step 1 all 6 posts show, but the URL
  still reads `?category=lam-dep`; reloading re-applies the Làm đẹp filter and returns
  to the empty state. **Minor defect — logged, not silently accepted:** the reset
  control should clear the query param.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-016`

### TC-f02-017 — Per-category counts are correct and sum to the total
- **Type:** boundary | **Priority:** P1 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. For each category, deep-link to its `?category=` slug.
  2. Record the live count and the number of rendered cards.
- **Test data:** cong-nghe=2, gia-dung=2, am-thanh=2, lam-dep=0
- **Expected result:** Each category's live count equals its rendered card count and
  equals the expected value; the four category counts sum to 6, the unfiltered total.
  Catches off-by-one and stale-count bugs.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-017`

### TC-f02-018 — Markup in the `?category=` value is neutralized, not executed
- **Type:** worst-case (security-adjacent) | **Priority:** P1 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/vi/blog?category=<script>alert(1)</script>`.
- **Test data:** slug = `<script>alert(1)</script>`
- **Expected result:** No dialog fires; no script executes; the value is treated as an
  unknown slug so all 6 posts render with **Tất cả** pressed; no unescaped markup is
  injected into the DOM.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-018`

### TC-f02-019 — Oversized `?category=` value is handled without crashing
- **Type:** boundary | **Priority:** P2 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/vi/blog?category=<1000 'a' characters>`.
- **Test data:** slug = `'a'.repeat(1000)`
- **Expected result:** Page responds normally (no 5xx, no error boundary); falls back
  to all 6 posts with **Tất cả** pressed.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-019`

### TC-f02-020 — Filter pills are keyboard operable and expose state
- **Type:** cross-cutting (accessibility) | **Priority:** P1 | **Destructive:** —
- **Precondition:** On `/vi/blog`.
- **Steps:**
  1. Focus the **Công nghệ** pill via the keyboard.
  2. Activate it with the keyboard.
- **Test data:** —
- **Expected result:** The pill receives focus, activates on keypress, and the results
  filter to 2. `aria-pressed` flips to `true` on the active pill and `false` on the
  previously active one. The filter group exposes an accessible name.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-020`

### TC-f02-021 — Filter works at a mobile viewport
- **Type:** cross-cutting (responsive) | **Priority:** P1 | **Destructive:** —
- **Precondition:** Mobile viewport (Pixel 5 project).
- **Steps:**
  1. Navigate to `/vi/blog`.
  2. Click **Công nghệ**.
- **Test data:** —
- **Expected result:** All 5 pills are visible and tappable; filtering yields 2 cards;
  the count region updates. Runs under the `mobile-chrome` project.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-021`

### TC-f02-022 — Empty-state copy should be localized on `/en` — **KNOWN DEFECT**
- **Type:** worst-case (i18n) | **Priority:** P1 | **Destructive:** —
- **Precondition:** None.
- **Steps:**
  1. Navigate to `/en/blog?category=lam-dep`.
- **Test data:** locale = `en`, slug = `lam-dep`
- **Expected result (correct behavior):** The empty-state heading and helper text and
  the reset button render in English.
- **Actual behavior:** They render hardcoded Vietnamese — "Chưa có bài đánh giá",
  "Hãy thử chọn danh mục khác…", "Xem tất cả" — because
  `src/components/blog/category-filter.tsx:81,83,90` bypasses next-intl.
- **Status:** Marked `test.fail()` — it runs, is expected to fail today, and will
  turn red the moment someone "fixes" it without updating this case. Not weakened
  to pass.
- **Automated:** ✅ `tests/f-02-category-filter.spec.ts` › `TC-f02-022`

---

## Summary

| ID | Type | Priority | Destructive | Automated |
|----|------|----------|-------------|-----------|
| TC-f02-001 | happy | P0 | — | ✅ |
| TC-f02-002 | happy | P0 | — | ✅ |
| TC-f02-003 | happy | P1 | — | ✅ |
| TC-f02-004 | happy | P1 | — | ✅ |
| TC-f02-005 | happy | P0 | — | ✅ |
| TC-f02-006 | happy | P0 | — | ✅ |
| TC-f02-007 | happy | P1 | — | ✅ |
| TC-f02-008 | happy | P1 | — | ✅ |
| TC-f02-009 | negative | P1 | — | ✅ |
| TC-f02-010 | negative | P2 | — | ✅ |
| TC-f02-012 | edge | P0 | — | ✅ |
| TC-f02-013 | edge | P0 | — | ✅ |
| TC-f02-014 | edge | P2 | — | ✅ |
| TC-f02-015 | edge | P2 | — | ✅ |
| TC-f02-016 | edge | P2 | — | ✅ |
| TC-f02-017 | boundary | P1 | — | ✅ |
| TC-f02-018 | worst-case | P1 | — | ✅ |
| TC-f02-019 | boundary | P2 | — | ✅ |
| TC-f02-020 | a11y | P1 | — | ✅ |
| TC-f02-021 | responsive | P1 | — | ✅ |
| TC-f02-022 | i18n | P1 | — | ✅ (expected-fail) |

> `TC-f02-011` was folded into `TC-f02-018` during matrix review. The ID is retired
> and deliberately not reused — case IDs are stable and never renumbered.

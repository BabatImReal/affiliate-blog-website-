import { test, expect, type Page } from '@playwright/test'

/**
 * F-02 — Blog listing + category filter
 * Cases: tests/test-cases/f-02-category-filter.md
 *
 * SAFETY: every case here is READ-ONLY. Nothing in this flow creates, modifies,
 * or deletes data, so no page.route mocking is required and no real-write
 * opt-in is needed. Target is the local dev server (see playwright.config.ts
 * prod-guard).
 */

/** Deterministic dataset from src/lib/mock-data.ts — titles are content, and stable. */
const POSTS_BY_CATEGORY: Record<string, string[]> = {
  'Công nghệ': [
    'iPhone 15 Pro Max: Đáng mua nhất 2024?',
    'Samsung Galaxy S24: Đối thủ xứng tầm iPhone',
  ],
  'Gia dụng': [
    'Dyson V15 Detect: Máy hút bụi không dây tốt nhất',
    'Xiaomi Robot Vacuum S20: Dọn nhà tự động giá tốt',
  ],
  'Âm thanh': [
    'Sony WH-1000XM5: Vẫn là vua chống ồn',
    'AirPods Pro 2: Tốt nhất cho hệ sinh thái Apple',
  ],
  'Làm đẹp': [],
}

const SLUGS: Record<string, string> = {
  'Công nghệ': 'cong-nghe',
  'Gia dụng': 'gia-dung',
  'Âm thanh': 'am-thanh',
  'Làm đẹp': 'lam-dep',
}

const TOTAL_POSTS = 6

// --- Locators, all derived from the live accessibility tree -----------------

/** The filter pill group. Scoping here is required: the locale switcher is also
 *  a `group` and its active button is likewise `aria-pressed="true"`. */
const filterGroup = (page: Page) =>
  page.getByRole('group', { name: 'Lọc theo danh mục' })

/** exact:true matters — the reset button "Xem tất cả" contains "Tất cả". */
const pill = (page: Page, name: string) =>
  filterGroup(page).getByRole('button', { name, exact: true })

const pressedPill = (page: Page) =>
  filterGroup(page).getByRole('button', { pressed: true })

/** One h3 per review card; the page h1 is level 1 and the footer is outside <main>. */
const cardHeadings = (page: Page) =>
  page.getByRole('main').getByRole('heading', { level: 3 })

const countRegion = (page: Page) =>
  page.getByRole('main').locator('[aria-live="polite"]')

/** Asserts the live count starts with n — i18n-safe (ignores the unit label). */
const expectCount = (page: Page, n: number) =>
  expect(countRegion(page)).toHaveText(new RegExp(`^\\s*${n}\\b`))

const expectCards = async (page: Page, titles: string[]) => {
  await expect(cardHeadings(page)).toHaveCount(titles.length)
  if (titles.length > 0) {
    await expect(cardHeadings(page)).toHaveText(titles.map((t) => new RegExp(escapeRe(t))))
  }
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// --- Cases ------------------------------------------------------------------

test.describe('F-02 — Blog listing + category filter', () => {
  test('TC-f02-001: listing shows all reviews by default', async ({ page }) => {
    await page.goto('/vi/blog')

    await expect(pill(page, 'Tất cả')).toHaveAttribute('aria-pressed', 'true')
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
    await expectCount(page, TOTAL_POSTS)
  })

  test('TC-f02-002: selecting a category filters the list and updates the count', async ({
    page,
  }) => {
    await page.goto('/vi/blog')
    await pill(page, 'Công nghệ').click()

    await expectCards(page, POSTS_BY_CATEGORY['Công nghệ'])
    await expectCount(page, 2)
    await expect(pressedPill(page)).toHaveCount(1)
    await expect(pressedPill(page)).toHaveText('Công nghệ')
  })

  test('TC-f02-003: switching directly between two categories replaces the results', async ({
    page,
  }) => {
    await page.goto('/vi/blog')

    await pill(page, 'Âm thanh').click()
    await expectCards(page, POSTS_BY_CATEGORY['Âm thanh'])

    await pill(page, 'Gia dụng').click()
    await expectCards(page, POSTS_BY_CATEGORY['Gia dụng'])
    await expect(pressedPill(page)).toHaveCount(1)
    await expect(pressedPill(page)).toHaveText('Gia dụng')
  })

  test('TC-f02-004: "Tất cả" restores the full list after filtering', async ({ page }) => {
    await page.goto('/vi/blog')

    await pill(page, 'Công nghệ').click()
    await expectCount(page, 2)

    await pill(page, 'Tất cả').click()
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
    await expectCount(page, TOTAL_POSTS)
    await expect(pressedPill(page)).toHaveText('Tất cả')
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-005: deep-link with a valid ?category= slug preselects that filter', async ({
    page,
  }) => {
    await page.goto('/vi/blog?category=cong-nghe')

    await expect(pressedPill(page)).toHaveText('Công nghệ')
    await expectCards(page, POSTS_BY_CATEGORY['Công nghệ'])
    await expectCount(page, 2)
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-006: header nav category link lands on the filtered listing', async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, 'Desktop nav is hidden below the md breakpoint')
    await page.goto('/vi')

    await page
      .getByRole('navigation', { name: 'Điều hướng chính' })
      .getByRole('link', { name: 'Âm thanh' })
      .click()

    await expect(page).toHaveURL(/\/vi\/blog\?category=am-thanh$/)
    await expect(pressedPill(page)).toHaveText('Âm thanh')
    await expectCards(page, POSTS_BY_CATEGORY['Âm thanh'])
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-007: navigating category → category re-applies the new filter', async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, 'Desktop nav is hidden below the md breakpoint')
    await page.goto('/vi/blog?category=am-thanh')
    await expect(pressedPill(page)).toHaveText('Âm thanh')

    await page
      .getByRole('navigation', { name: 'Điều hướng chính' })
      .getByRole('link', { name: 'Công nghệ' })
      .click()

    await expect(page).toHaveURL(/\/vi\/blog\?category=cong-nghe$/)
    await expect(pressedPill(page)).toHaveCount(1)
    await expect(pressedPill(page)).toHaveText('Công nghệ')
    await expectCards(page, POSTS_BY_CATEGORY['Công nghệ'])
  })

  test('TC-f02-008: English locale renders the localized count label', async ({ page }) => {
    await page.goto('/en/blog')

    await expect(countRegion(page)).toHaveText(/^\s*6\s+reviews/i)
    await expect(pill(page, 'All')).toHaveAttribute('aria-pressed', 'true')
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-009: unknown ?category= slug falls back to showing everything', async ({
    page,
  }) => {
    const response = await page.goto('/vi/blog?category=bogus-not-a-category')

    expect(response?.status()).toBe(200)
    await expect(pressedPill(page)).toHaveText('Tất cả')
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
    await expectCount(page, TOTAL_POSTS)
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-010: blank ?category= value falls back to showing everything', async ({
    page,
  }) => {
    await page.goto('/vi/blog?category=')

    await expect(pressedPill(page)).toHaveText('Tất cả')
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
  })

  test('TC-f02-012: category with zero posts shows the empty state', async ({ page }) => {
    await page.goto('/vi/blog')
    await pill(page, 'Làm đẹp').click()

    await expect(pressedPill(page)).toHaveText('Làm đẹp')
    await expect(cardHeadings(page)).toHaveCount(0)
    await expectCount(page, 0)
    await expect(
      page.getByRole('main').getByRole('button', { name: 'Xem tất cả' }),
    ).toBeVisible()
  })

  test('TC-f02-013: reset button in the empty state restores the full list', async ({
    page,
  }) => {
    await page.goto('/vi/blog')
    await pill(page, 'Làm đẹp').click()
    const reset = page.getByRole('main').getByRole('button', { name: 'Xem tất cả' })
    await expect(reset).toBeVisible()

    await reset.click()

    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
    await expectCount(page, TOTAL_POSTS)
    await expect(pressedPill(page)).toHaveText('Tất cả')
    await expect(reset).toHaveCount(0)
  })

  test('TC-f02-014: clicking the same pill twice is idempotent', async ({ page }) => {
    await page.goto('/vi/blog')

    await pill(page, 'Gia dụng').click()
    await expectCards(page, POSTS_BY_CATEGORY['Gia dụng'])

    await pill(page, 'Gia dụng').click()
    await expectCards(page, POSTS_BY_CATEGORY['Gia dụng'])
    await expectCount(page, 2)
    await expect(pressedPill(page)).toHaveCount(1)
  })

  test('TC-f02-015: pill selection is client-only and does not alter the URL', async ({
    page,
  }) => {
    await page.goto('/vi/blog')
    const urlBefore = page.url()

    await pill(page, 'Âm thanh').click()
    await expectCount(page, 2) // filter applied…

    expect(page.url()).toBe(urlBefore) // …but the URL never changed
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): the stale-?category= behavior only exists with the URL feature. Un-skip when built.
  test.skip('TC-f02-016: reset from a deep-linked filter leaves a stale URL param', async ({
    page,
  }) => {
    await page.goto('/vi/blog?category=lam-dep')
    await page.getByRole('main').getByRole('button', { name: 'Xem tất cả' }).click()
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)

    // Known minor defect: reset does not clear ?category=.
    expect(page.url()).toContain('category=lam-dep')

    // Consequence: a reload silently re-applies the filter.
    await page.reload()
    await expect(cardHeadings(page)).toHaveCount(0)
    await expect(pressedPill(page)).toHaveText('Làm đẹp')
  })

  test('TC-f02-017: per-category counts are correct and sum to the total', async ({
    page,
  }) => {
    await page.goto('/vi/blog')
    let sum = 0

    for (const [category, titles] of Object.entries(POSTS_BY_CATEGORY)) {
      await test.step(`${category} → ${titles.length}`, async () => {
        await pill(page, category).click()
        await expectCards(page, titles)
        await expectCount(page, titles.length)
        sum += titles.length
      })
    }

    expect(sum).toBe(TOTAL_POSTS)
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-018: markup in the ?category= value is neutralized, not executed', async ({
    page,
  }) => {
    let dialogFired = false
    page.on('dialog', async (dialog) => {
      dialogFired = true
      await dialog.dismiss()
    })

    const payload = encodeURIComponent('<script>alert(1)</script>')
    const response = await page.goto(`/vi/blog?category=${payload}`)

    expect(response?.status()).toBe(200)
    expect(dialogFired).toBe(false)
    await expect(pressedPill(page)).toHaveText('Tất cả')
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
  })

  // ⏸ DEFERRED (FIX-002 / F-02b): needs the ?category= URL feature, reverted from product. Un-skip when built.
  test.skip('TC-f02-019: oversized ?category= value is handled without crashing', async ({
    page,
  }) => {
    const response = await page.goto(`/vi/blog?category=${'a'.repeat(1000)}`)

    expect(response?.status()).toBe(200)
    await expect(pressedPill(page)).toHaveText('Tất cả')
    await expect(cardHeadings(page)).toHaveCount(TOTAL_POSTS)
  })

  test('TC-f02-020: filter pills are keyboard operable and expose state', async ({
    page,
  }) => {
    await page.goto('/vi/blog')

    await expect(filterGroup(page)).toHaveAttribute('aria-label', 'Lọc theo danh mục')

    const target = pill(page, 'Công nghệ')
    await target.focus()
    await expect(target).toBeFocused()

    await page.keyboard.press('Enter')

    await expect(target).toHaveAttribute('aria-pressed', 'true')
    await expect(pill(page, 'Tất cả')).toHaveAttribute('aria-pressed', 'false')
    await expectCards(page, POSTS_BY_CATEGORY['Công nghệ'])
  })

  test('TC-f02-021: filter works at a mobile viewport', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Runs under the mobile-chrome project')
    await page.goto('/vi/blog')

    await expect(filterGroup(page).getByRole('button')).toHaveCount(5)
    for (const name of ['Tất cả', ...Object.keys(POSTS_BY_CATEGORY)]) {
      await expect(pill(page, name)).toBeVisible()
    }

    await pill(page, 'Công nghệ').click()
    await expectCards(page, POSTS_BY_CATEGORY['Công nghệ'])
    await expectCount(page, 2)
  })

  // KNOWN DEFECT — empty-state copy bypasses next-intl and is hardcoded Vietnamese
  // (src/components/blog/category-filter.tsx:81,83,90). This test asserts the
  // CORRECT behavior and is expected to fail until that is fixed. It is not
  // weakened to make the suite green.
  test.fail(
    'TC-f02-022: empty-state copy should be localized on /en',
    async ({ page }) => {
      await page.goto('/en/blog')
      await pill(page, 'Làm đẹp').click()

      await expect(countRegion(page)).toHaveText(/^\s*0\s+reviews/i)
      await expect(page.getByRole('main')).not.toContainText('Chưa có bài đánh giá')
      await expect(
        page.getByRole('main').getByRole('button', { name: /view all|see all|show all/i }),
      ).toBeVisible()
    },
  )
})

import { defineConfig, devices } from '@playwright/test'

/**
 * Base URL comes from an env var — never hardcoded in specs.
 * This project's confirmed test target is the LOCAL dev server on :3000.
 */
const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3000'

/**
 * PROD-URL GUARD (Phase 0 safety gate).
 *
 * The suite refuses to run unless the target is a confirmed non-production
 * environment. Loopback hosts are always allowed; anything else must be
 * explicitly allowlisted via TEST_ALLOWED_HOSTS.
 */
function assertNonProductionTarget(rawUrl: string): void {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error(`[prod-guard] TEST_BASE_URL is not a valid URL: ${rawUrl}`)
  }

  const loopback = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0']
  const safePattern = /(^|[.-])(staging|test|qa|dev|preview)([.-]|$)/i
  const allowlist = (process.env.TEST_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)

  const host = url.hostname
  const permitted =
    loopback.includes(host) || safePattern.test(host) || allowlist.includes(host)

  if (!permitted) {
    throw new Error(
      `[prod-guard] Refusing to run against "${rawUrl}".\n` +
        `Host "${host}" is not a confirmed non-production target.\n` +
        `Allowed: loopback hosts, hosts matching staging/test/qa/dev/preview, ` +
        `or hosts listed in TEST_ALLOWED_HOSTS.`,
    )
  }
}

assertNonProductionTarget(BASE_URL)

const isLocalTarget = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].includes(
  new URL(BASE_URL).hostname,
)

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // Only manage a server when the target is local. Reuses the dev server if
  // one is already listening on :3000.
  ...(isLocalTarget
    ? {
        webServer: {
          command: 'pnpm dev',
          url: BASE_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }
    : {}),
})

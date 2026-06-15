# Tests Context

Last updated: 2026-06-15

Attach this file first when the task involves testing, verification, or test debugging.

This is the fast operator guide for the testing surface:

- which runner to use
- what command to start with
- how to quickly debug common failures
- which deeper file to read next

---

## Scope

This group covers:

- test runner selection and commands
- quick debugging procedures for test failures
- current testing gaps worth remembering

It does not cover:

- CI/CD pipeline config (belongs in `infra/`)
- database seeding for tests (belongs in `database/`)

## Read When

Use this file when you need to:

- run tests after implementation
- decide between test runners or test types
- debug failing tests

## Quick Routing

No deeper test docs yet. Add routing entries here as e2e, integration, or unit-specific docs are created.

## Tech Stack (Testing)

> **Status:** Planned — no test setup exists yet as of 2026-06-15. Update when tests are initialized.

Planned testing approach:
- **Unit/Integration:** Vitest — component tests, utility function tests, API handler tests
- **E2E:** Playwright — critical user flows (blog navigation, affiliate link redirect, admin login)
- **Type checking:** TypeScript compiler (`tsc --noEmit`) as part of CI

## Quick Decision Guide

### Use Vitest when

- the change is in React components, hooks, utility functions, or lib modules
- testing API Route Handlers in isolation (mocked Supabase client)
- unit-testing affiliate tracking logic (the redirect + log pattern is testable in isolation)

### Use Playwright when

- verifying the full affiliate click tracking flow (click → redirect → link_clicks row inserted)
- verifying admin auth protection (unauthenticated request blocked from /admin/*)
- verifying i18n routing (vi default, en secondary)
- any end-to-end browser flow that crosses multiple routes

### Use `tsc --noEmit` when

- after any schema or type change to catch type errors across the codebase

## Default Verification Order

Unless the task clearly needs a different path:

1. `tsc --noEmit` — catch type errors first
2. Vitest unit/integration tests — narrowest scope
3. Playwright e2e — only when the real browser behavior is the thing being verified

## Commands

> **Status:** Pending — update when `package.json` scripts are defined.

| Runner | Command | Notes |
|---|---|---|
| Vitest (unit) | `pnpm test` | (pending — update after init) |
| Vitest (watch) | `pnpm test:watch` | (pending) |
| Playwright (e2e) | `pnpm test:e2e` | (pending — needs dev server) |
| TypeScript check | `pnpm typecheck` | (pending) |
| Lint | `pnpm lint` | (pending) |

## Critical Test Cases to Write (Priority)

These tests are financially or security-critical and should be written before anything else:

1. **Affiliate redirect flow** — `GET /api/affiliate/[linkId]` must insert a `link_clicks` row AND return 302. Never return 200 or redirect without logging.
2. **Admin route protection** — unauthenticated requests to `/(admin)/*` must redirect to login, not 404 or 200.
3. **Affiliate link not found** — `GET /api/affiliate/[invalidId]` must return 404, not redirect to a broken URL.

## Known Gaps

- No tests yet (greenfield — test setup happens during initial scaffold phase)
- E2E tests require Supabase test project and Playwright setup (document in deeper test docs once initialized)

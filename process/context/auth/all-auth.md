# Auth Context

This file is the canonical Auth context entrypoint for the Affiliate Review Blog.

Use it after `process/context/all-context.md` when the task needs admin auth setup, route protection, Supabase session handling, or middleware configuration.

---

## Scope

This group covers:

- Supabase Auth setup (email + password, admin-only)
- Admin route protection via Next.js middleware
- Server-side vs. client-side Supabase client usage
- Session handling and cookie management
- Admin account provisioning

It does not cover:

- Database RLS policies (belongs in `database/`)
- Deployment environment variables (belongs in `infra/`)
- Public user features (there is no public auth — visitors browse anonymously)

## Read When

Read this entrypoint when:

- setting up or modifying admin authentication
- adding or changing protected route patterns
- debugging session or cookie issues
- provisioning a new admin account
- implementing server actions or API routes that require admin authorization

## Quick Routing

No deeper docs yet — all auth context is in this file. Create subdocs when middleware or auth helpers are complex enough to warrant their own docs.

## Source Paths

- `process/context/auth/all-auth.md` (this file)

## Update Triggers

Update this group when:

- the admin auth flow changes (e.g., adding OAuth, MFA)
- protected route patterns change
- Supabase auth library version changes materially
- new admin roles or permission levels are introduced

---

## Auth Model

### Who authenticates

Only **admins** authenticate. Visitors browse the site entirely without any account or session. There is no public user registration or login.

Two admin accounts exist. Accounts are created directly via the Supabase dashboard — no self-registration endpoint.

### Supabase Auth setup

- Provider: Email + Password
- Session managed via Supabase's `@supabase/ssr` package (cookie-based)
- No OAuth providers in v1 (can be added later)

### Admin verification pattern

After Supabase confirms a valid session, optionally verify the user ID is in an `admins` whitelist stored in Supabase (simple table: `admin_user_ids uuid[]` or a single-column table). This prevents accidentally granting admin access if additional Supabase users are created for other purposes.

---

## Client Setup

### Server-side client (`src/lib/auth/server.ts`)

Used in Server Components, Route Handlers, and Server Actions. Reads cookies from the request.

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: ... } }
  )
}
```

### Browser client (`src/lib/auth/client.ts`)

Used in Client Components for auth state and login form submission.

```ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## Middleware (Route Protection)

`src/middleware.ts` combines two responsibilities:

1. **next-intl locale routing** — detect and inject locale into all routes
2. **Admin route protection** — check Supabase session for routes under `/(admin)/`

Pattern (pseudocode):

```ts
export async function middleware(request: NextRequest) {
  // 1. next-intl locale routing
  const response = await intlMiddleware(request)

  // 2. Admin route check
  if (request.nextUrl.pathname.includes('/(admin)/') || isAdminPath(request)) {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

The actual admin path detection must account for the `[locale]` prefix in URLs (e.g., `/vi/admin/dashboard`, `/en/admin/dashboard`).

---

## Admin Account Provisioning

New admin accounts are created via the Supabase dashboard (Authentication → Users → Invite user). No code-level admin signup endpoint exists — this is intentional to prevent unauthorized admin access.

After creating a Supabase user, optionally add their `user.id` to the admin whitelist table in the database.

---

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client — only use it server-side
- Admin session validation happens in middleware (blocks request before reaching route handler)
- Route Handlers under `/api/` that perform admin operations must also verify session — middleware alone is not sufficient for API routes if they can be called directly
- Log failed admin auth attempts (useful for security monitoring)

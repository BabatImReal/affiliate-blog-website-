import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Server-only admin client (full access; service role bypasses RLS via DATABASE_URL).
const connectionString = process.env.DATABASE_URL!

// Disable prefetch — not supported by Supabase "Transaction" pooler.
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export { schema }

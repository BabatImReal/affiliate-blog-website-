# Planning Context

This file is the canonical planning context entrypoint for the Affiliate Review Blog.

Use it after `process/context/all-context.md` when the task needs plan-shape calibration,
planning conventions, or implementation-plan examples.

## Scope

This group covers:

- example plan shapes (SIMPLE and COMPLEX)
- SIMPLE vs COMPLEX plan calibration rules
- durable planning references that inform `vc-generate-plan` output

It does not cover:

- active implementation plans (those belong in `process/general-plans/active/` or `process/features/*/active/`)
- feature reports or research outputs
- backlog items

## Read When

Read this entrypoint when:

- creating a new plan with `vc-generate-plan`
- checking whether work should be `SIMPLE` or `COMPLEX`
- comparing an active plan against the repo's example plan shapes

## Quick Routing

- use `process/development-protocols/references/example-simple-prd.md` to calibrate a one-session plan
- use `process/development-protocols/references/example-complex-prd.md` to calibrate a complex or multi-phase plan
- use `process/development-protocols/references/program-goal-charter-template.md` for large multi-phase programs

## SIMPLE vs COMPLEX Decision Rules

**Use SIMPLE when:**
- single-session implementation (estimated < 4 hours)
- single file or small cluster of files
- no schema changes, no new dependencies, no API surface changes
- no security-sensitive code (auth, payments, affiliate tracking)

**Use COMPLEX when:**
- multi-session or multi-phase work
- new database tables or schema changes
- new API routes or external service integrations
- involves the affiliate tracking system (financially critical — always COMPLEX)
- involves admin auth or RLS policy changes
- UI feature spanning multiple components and routes

**Affiliate tracking and auth are always COMPLEX** — financial and security consequences make them require the full RIPER-5 flow with explicit plan approval.

## Source Paths

- `process/context/planning/all-planning.md` (this file)
- `process/development-protocols/references/example-simple-prd.md`
- `process/development-protocols/references/example-complex-prd.md`
- `process/development-protocols/references/program-goal-charter-template.md`

## Update Triggers

Update this group when:

- the plan artifact contract changes (new required sections)
- `vc-generate-plan` expects different plan shapes
- SIMPLE/COMPLEX thresholds are adjusted for this project

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**buildml** is a full-stack ML education platform where users solve AI/ML coding challenges. Built on the T3 Stack: Next.js 15 (App Router), React 19, TypeScript, Prisma + PostgreSQL, tRPC, NextAuth.js v5, Tailwind CSS v4, and shadcn/ui.

## Commands

```bash
# Development
bun run dev              # Start dev server (next dev --turbo)
bun run typecheck        # TypeScript type checking (tsc --noEmit)

# Code quality (Biome - replaces ESLint + Prettier)
bun run check            # Lint and format check
bun run check:write      # Auto-fix linting and formatting
bun run check:unsafe     # Auto-fix with unsafe transformations

# Build
bun run build            # Production build
bun run start            # Start production server

# Database (Prisma + PostgreSQL)
bun run db:push          # Push schema to database (prototyping)
bun run db:migrate       # Create migration (production changes)
bun run db:generate      # Generate Prisma client (prisma migrate dev)
bun run db:studio        # Open Prisma Studio GUI
```

No test framework is currently configured.

## Architecture

### Code Execution Flow

This is the core domain logic:

1. User submits code via tRPC (`submission.run` or `submission.submit`)
2. Rate limiting is enforced (run: 5/10s, submit: 2/30s) via Upstash Redis
3. Job is published to Upstash QStash async queue
4. QStash calls the webhook at `api/webhooks/process-submission/`
5. Webhook calls a FastAPI executor service at `EXECUTOR_URL/execute`
6. Results stored in Redis (run) or PostgreSQL (submit)
7. Client polls tRPC for status updates

### tRPC API Layer

Routers live in `src/server/api/routers/`. The root router (`src/server/api/root.ts`) combines: `feedback`, `problem`, `problemSet`, `submission`, `user`.

- `publicProcedure` - open endpoints with timing middleware
- `protectedProcedure` - requires authenticated session
- Input validation with Zod schemas
- Client consumed via `api.[router].[procedure].useQuery/useMutation`

### Authentication

NextAuth.js v5 with Google OAuth and JWT strategy. Config at `src/server/auth/config.ts`. Middleware (`src/middleware.ts`) protects `/dashboard/*`, `/practice/*`, `/leaderboard`, `/profile/*`.

### Database

Prisma schema at `prisma/schema.prisma`. Core models: `User`, `ProblemSet`, `Problem`, `Submission` (status: PENDING|PASS|FAIL|ERROR). Client singleton at `src/db/client.ts` uses `@prisma/adapter-pg`.

Seed scripts: `prisma/seed.ts`, `seed-numpy.ts`, `seed-nn.ts`.

### Environment Variables

Validated via `@t3-oss/env-nextjs` in `src/env.js`. Always use `env.VAR_NAME` (imported from `~/env.js`), never `process.env` directly. Set `SKIP_ENV_VALIDATION=true` to skip validation during Docker builds.

Required server vars: `DATABASE_URL`, `GOOGLE_CLIENT_ID/SECRET`, `UPSTASH_REDIS_REST_URL/TOKEN`, `QSTASH_*` keys, `DEPLOYMENT_URL`, `EXECUTOR_URL`, `EXECUTOR_SECRET`.

## Code Conventions

- **Path alias**: `~/` maps to `./src/` (e.g., `~/lib/utils`)
- **Formatting/Linting**: Biome (`biome.jsonc`) - enforces sorted Tailwind classes (`useSortedClasses`), organized imports
- **Styling**: `cn()` utility (clsx + tailwind-merge) for conditional classes. CSS variables for theming in `src/styles/globals.css`
- **Components**: shadcn/ui in `src/components/ui/` with `class-variance-authority` (CVA) for variants
- **TypeScript**: Strict mode with `noUncheckedIndexedAccess`
- **Imports**: Group by: external -> third-party -> local -> types. Use `~/` alias, prefer named imports
- **Naming**: PascalCase for components/types, camelCase for functions/variables, kebab-case for filenames

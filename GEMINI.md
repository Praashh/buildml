# buildml - Project Context for Gemini

## Project Overview

**buildml** is a full-stack web application built using the [T3 Stack](https://create.t3.gg/). It leverages the latest features of the Next.js ecosystem.

**Key Technologies:**
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Database:** PostgreSQL (managed via Prisma ORM)
*   **API:** tRPC (for end-to-end type safety)
*   **Authentication:** NextAuth.js (Auth.js) v5 (Beta)
*   **Styling:** Tailwind CSS v4, with `shadcn/ui` components
*   **Tooling:** Biome (Linting/Formatting), Bun (Package Manager)

## Building and Running

The project uses `bun` as the package manager (indicated by `bun.lock`).

**Key Commands:**

| Action | Command | Description |
| :--- | :--- | :--- |
| **Install Dependencies** | `bun install` | Install project dependencies. |
| **Development Server** | `bun run dev` | Starts the dev server with Turbo mode (`next dev --turbo`). |
| **Build for Production** | `bun run build` | Builds the application for production. |
| **Start Production** | `bun run start` | Starts the built application. |
| **Type Check** | `bun run typecheck` | Runs TypeScript validation (`tsc --noEmit`). |
| **Lint & Format** | `bun run check` | Checks code quality using Biome. |
| **Fix Lint/Format** | `bun run check:write` | Auto-fixes linting and formatting issues. |
| **Database Push** | `bun run db:push` | Pushes the Prisma schema state to the database (prototyping). |
| **Database Studio** | `bun run db:studio` | Opens the Prisma Studio GUI. |

## Development Conventions

### Code Style & Structure
*   **Linting/Formatting:** strictly enforced via **Biome**.
    *   Configuration: `biome.jsonc`
    *   Features: Sorts imports, organizes attributes, and enforces Tailwind class sorting (via `useSortedClasses` rule).
*   **Component Library:** Uses `shadcn/ui` components located in `src/components/ui`.
    *   Uses `class-variance-authority` (cva) for variants.
    *   Uses `cn()` utility (clsx + tailwind-merge) for class manipulation.
*   **Path Aliases:** Use `~/` to refer to the `src/` directory (e.g., `~/lib/utils`).

### Architecture Pattern
*   **API:** uses tRPC.
    *   **Routers:** Located in `src/server/api/routers`.
    *   **Procedures:** Use `publicProcedure` for open endpoints and `protectedProcedure` for authenticated ones.
    *   **Client:** consumed via `api.[router].[procedure].useQuery/useMutation`.
*   **Database:** Prisma ORM.
    *   Schema: `prisma/schema.prisma`.
    *   Client: `src/db/client.ts`.
    *   **Migration:** Prefer `db:push` for rapid dev, `db:migrate` for production changes.
*   **Env Variables:** Defined in `.env`, validated in `src/env.js`. Always use `env.VAR_NAME` in code, not `process.env`.

### Testing
*   Currently, no specific test runner (Vitest/Jest) is explicitly configured in `package.json` scripts, though `AGENTS.md` suggests using Vitest/Jest/Playwright if needed.

### Specific Instructions (from AGENTS.md)
*   **Strict Mode:** TypeScript strict mode is enabled.
*   **Imports:** Group imports: External -> Third-party -> Local -> Types.
*   **Naming:** PascalCase for components (`UserProfile.tsx`), camelCase for functions (`handleSubmit`).

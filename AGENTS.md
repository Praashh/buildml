# Agent Instructions for 100xPractice

This document provides comprehensive guidelines for AI coding agents working on the 100xPractice project.

## Project Overview

100xPractice is a Next.js application built with the T3 Stack, featuring:
- Next.js 15 with React 19
- TypeScript with strict type checking
- Prisma ORM with PostgreSQL
- tRPC for type-safe APIs
- NextAuth.js for authentication
- Tailwind CSS with shadcn/ui components
- Biome for linting and formatting

## Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start development server with Turbo mode
npm run typecheck    # Run TypeScript type checking
```

### Building and Deployment
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Build and start preview server
```

### Code Quality
```bash
npm run check        # Lint and format check with Biome
npm run check:write  # Auto-fix linting and formatting issues
npm run check:unsafe # Auto-fix with unsafe transformations
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create new migration
npm run db:studio    # Open Prisma Studio
```

### Testing
No test framework is currently configured. When adding tests:
- Use Vitest or Jest for unit/component tests
- Use Playwright for E2E tests
- Run single test: `npm run test -- <test-file-pattern>`

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled** with `noUncheckedIndexedAccess`
- Target ES2022 with ESNext modules
- Use path aliases: `~/` maps to `./src/`
- JSX preserve mode for Next.js

### Imports and Organization
```typescript
// External imports first
import * as React from "react"
import { useState } from "react"

// Third-party libraries
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"

// Local imports
import { cn } from "~/lib/utils"

// Type imports
import type { User } from "~/db/schema"
```

- Group imports by category with blank lines between groups
- Use absolute imports with `~/` alias
- Prefer named imports over default imports
- Place type imports at the end

### Component Patterns

#### shadcn/ui Components
Use class-variance-authority (cva) for component variants:

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        destructive: "destructive-styles",
      },
      size: {
        default: "default-size",
        sm: "small-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

#### Tailwind CSS Classes
- Use the `cn()` utility for conditional classes
- Follow Tailwind CSS conventions
- Use CSS variables for theming
- Sort classes with Biome's `useSortedClasses` rule

### API Layer (tRPC)

#### Router Structure
```typescript
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"

export const exampleRouter = createTRPCRouter({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.example.findUnique({
        where: { id: input.id },
      })
    }),

  createData: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.example.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      })
    }),
})
```

#### Error Handling
- Use `TRPCError` for API errors
- Zod validation errors are automatically formatted
- Protected procedures check for authenticated users

### Database (Prisma)

#### Schema Patterns
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts Post[]

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("posts")
}
```

#### Client Usage
```typescript
import { prisma } from "~/db/client"

// In server-side code only
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true },
})
```

### Authentication (NextAuth.js)

#### Usage in Components
```typescript
import { useSession } from "next-auth/react"

function ProtectedComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Please sign in</div>

  return <div>Welcome, {session.user.name}!</div>
}
```

#### Server-side Auth
```typescript
import { auth } from "~/server/auth"

export default async function ServerComponent() {
  const session = await auth()

  if (!session) {
    // Handle unauthenticated state
  }

  return <div>User: {session.user.email}</div>
}
```

### File Structure Conventions

```
src/
├── app/                 # Next.js app router
│   ├── api/
│   ├── (routes)/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── db/                 # Database client and schema
├── env.js              # Environment validation
├── lib/                # Utilities
├── server/
│   ├── api/            # tRPC routers
│   └── auth/           # Authentication config
├── styles/
│   └── globals.css     # Global styles
└── trpc/               # tRPC client setup
```

### Naming Conventions

#### Components
- PascalCase for component names: `UserProfile.tsx`
- kebab-case for file names: `user-profile.tsx`
- Use descriptive names: `CreatePostForm` not `Form`

#### Functions and Variables
- camelCase for variables and functions: `handleSubmit`
- PascalCase for types and interfaces: `UserData`
- SCREAMING_SNAKE_CASE for constants: `MAX_RETRY_COUNT`

#### Database
- camelCase for model fields: `createdAt`
- PascalCase for model names: `UserProfile`
- snake_case for table names via `@@map("user_profiles")`

### Error Handling

#### Client-side
```typescript
try {
  const result = await api.example.create.mutate(data)
  // Handle success
} catch (error) {
  // Handle TRPC errors
  console.error("Failed to create:", error.message)
}
```

#### Server-side
```typescript
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    })
  }
  return next()
})
```

### Environment Variables

Use the validated environment setup:
```typescript
import { env } from "~/env.js"

// env.DATABASE_URL is validated and typed
const db = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
})
```

### Performance Considerations

- Use React 19 features when appropriate
- Memoize expensive computations
- Use tRPC's built-in caching
- Optimize images and assets
- Use Next.js App Router features

### Security Best Practices

- Validate all inputs with Zod schemas
- Use protected procedures for sensitive operations
- Never expose sensitive data in client bundles
- Use HTTPS in production
- Validate environment variables

### Git Workflow

When committing changes:
1. Run `npm run check` and `npm run typecheck`
2. Ensure all linting passes
3. Use conventional commit messages
4. Test database migrations if schema changes

### Additional Tools

- **Biome**: Code formatting and linting (replaces ESLint + Prettier)
- **SuperJSON**: Enhanced JSON serialization for dates and more
- **class-variance-authority**: Type-safe component variants
- **clsx + tailwind-merge**: Optimized className handling

---

This document should be updated as the codebase evolves. When making significant changes to tooling or patterns, update this file accordingly.</content>
<parameter name="filePath">/Users/prashantvarma/Desktop/100xpractice/AGENTS.md
# Contributing to buildml

Thanks for your interest in contributing! Here's how to get started.

## Prerequisites

- [Bun](https://bun.sh) installed
- PostgreSQL database running
- Google OAuth credentials (for auth)
- Copy `.env.example` to `.env` and fill in the values

## Setup

```bash
bun install
bun run db:push
bun run dev
```

## Development Workflow

1. Fork the repo and create a branch from `master`
2. Make your changes
3. Run checks before committing:

```bash
bun run check        # Lint & format check
bun run typecheck    # TypeScript validation
```

4. If you changed the database schema, run `bun run db:migrate`
5. Open a pull request against `master`

## Code Style

- Formatting and linting are handled by **Biome** — run `bun run check:write` to auto-fix
- Use the `~/` path alias for imports from `src/`
- Use `cn()` for conditional Tailwind classes
- Follow existing patterns in the codebase

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new problem set page
fix: resolve submission polling timeout
refactor: simplify rate limiter logic
docs: update README badges
```

## Pull Requests

- Keep PRs focused — one feature or fix per PR
- Provide a clear description of what changed and why
- Ensure `bun run check` and `bun run typecheck` pass
- Link related issues if applicable

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Browser/OS info if relevant

## License

By contributing, you agree that your contributions will be subject to the project's [All Rights Reserved license](./LICENSE).

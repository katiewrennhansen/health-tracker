# Health Tracker

An activity tracker that tells you how hard to train today, and why.

You log your activities and the things that affect recovery: alcohol, changes in altitude, and illness. A **Today** screen turns those logs into a readiness level (rest, easy, moderate or go), a suggested session, and a short explanation.

> **Status:** early development. The monorepo, TypeScript build and linting are set up; the app itself is not built yet. See [Roadmap](#roadmap).

## How the advice works

The app keeps the AI on a short leash:

1. **A rules engine** (plain, unit-tested TypeScript) computes the facts: training load over the last 7 days compared with the 28-day average, plus flags for recent drinks, recent altitude gain and active illness.
2. **Hard rules** override everything. For example, fever or chest symptoms always means rest.
3. **An LLM** receives those signals as JSON and writes the advice. It runs on the server only, and its output is validated before it reaches the client.
4. **Advice is cached** once per day and regenerated only when you log something new.

This keeps the advice cheap, testable and conservative. It is not medical advice.

## Features (MVP)

- Sign up, sign in and password reset (Clerk)
- Activity log: date, type, duration and perceived effort (1–10)
- Event log: alcohol, elevation and illness
- Today's advice: readiness, suggested session and reasons
- History: one timeline of activities and events, with edit and delete

Not in the MVP: wearable integrations, set and rep tracking, GPS elevation, a native mobile app, social features and chat.

## Tech stack

| Area    | Choice                                                                       |
| ------- | ---------------------------------------------------------------------------- |
| Client  | Vite, React, Tailwind, HeroUI, TanStack Query                                |
| Server  | Node, Express, Drizzle ORM, PostgreSQL                                       |
| Auth    | Clerk                                                                        |
| Shared  | Zod schemas and inferred TypeScript types                                    |
| Tooling | npm workspaces, TypeScript project references, ESLint with typescript-eslint |

## Project structure

```
health-tracker/
├── shared/   Zod schemas and types used by both client and server
├── server/   Express API, database, auth and the LLM call
└── client/   React web app
```

The client and server import shared code as `@health-tracker/shared`, so data shapes are defined once and checked on both sides.

## Getting started

Requires Node 22 (a `.nvmrc` is included) and PostgreSQL installed locally (`initdb`, `pg_ctl` and `psql` on your PATH).

```bash
nvm use
npm install
npm run db:start     # first run creates a local Postgres in .postgres-data/ on port 5433
npm run db:migrate
npm run dev
```

The project runs its own Postgres server on port 5433, so it doesn't clash with another Postgres on the default port. The server connects to `postgres://postgres@localhost:5433/health_tracker` unless `DATABASE_URL` is set.

Before `npm run dev`, add your Clerk keys (Clerk dashboard → API keys):

- `client/.env`: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
- `server/.env`: `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (copy `server/.env`)

### Scripts

Run from the repo root:

| Command               | What it does                                                                          |
| --------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`         | Start the API (http://localhost:3001) and the client (http://localhost:5173) together |
| `npm run build`       | Type-check and build all packages, then bundle the client with Vite                   |
| `npm run typecheck`   | Type-check everything without writing output                                          |
| `npm run lint`        | Run ESLint across all packages                                                        |
| `npm run lint:fix`    | Fix what ESLint can fix automatically                                                 |
| `npm run format`      | Format all files with Prettier (`npm run format:check` only reports)                  |
| `npm run clean`       | Remove build output                                                                   |
| `npm run db:start`    | Start the local Postgres server, creating it and the database on first run            |
| `npm run db:stop`     | Stop the local Postgres server                                                        |
| `npm run db:generate` | Create a migration from changes in `server/src/db/schema.ts`                          |
| `npm run db:migrate`  | Apply pending migrations                                                              |

Both reload on save, and Ctrl+C stops both. The API has one endpoint so far: `GET /health`, which returns 503 if the database is unreachable.

## Roadmap

| Week | Epic                          | Status      |
| ---- | ----------------------------- | ----------- |
| 1    | Foundation and authentication | Completed   |
| 2    | Activity logging              | In progress |
| 3    | Event logging                 | Not started |
| 4    | Rules engine                  | Not started |
| 5    | AI advice and Today screen    | Not started |
| 6    | Polish and deploy             | Not started |

## Contributing

Guidance for AI coding agents, and the conventions the code follows, is in [AGENTS.md](AGENTS.md).

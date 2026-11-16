# AGENTS.md

Guidance for AI coding agents working in this repo. Read this before making changes.

## Project

A web app with two logs (workouts and life events: alcohol, elevation, illness) and a "Today" screen that says how hard to train and why.

- Full scope, architecture and ticket plan: [Notion project scope](https://app.notion.com/p/Project-scope-workout-tracker-with-context-aware-AI-advice-41a2e6dc989181aca788d39334f59ac9)
- Work is organised as tickets (F-1, W-2, R-4, ...). Work on one ticket at a time, and meet its "Done when" criterion before calling it done.

## Environment

- Node 22 via nvm. Run `nvm use` first: the system `node` is v10 and will not work.
- npm workspaces only. Do not add pnpm, yarn or Turborepo without asking.
- TypeScript is pinned to 6.0.x because typescript-eslint does not support TypeScript 7 yet. Do not upgrade it until typescript-eslint does.

## Commands (run from the repo root)

| Command | What it does |
| --- | --- |
| `npm install` | Install all workspaces |
| `npm run build` | `tsc -b`: builds shared, then server and client |
| `npm run typecheck` | Type-check everything without emitting |
| `npm run clean` | Remove build output |
| `npm run lint` | ESLint with type-aware typescript-eslint rules |
| `npm run lint:fix` | Auto-fix what ESLint can |

Run `npm run lint` and `npm run build` (and tests, once they exist) before reporting a change as finished. Fix lint errors rather than disabling rules; if a disable is truly needed, use a single-line `eslint-disable-next-line` with a reason.

## Layout

- `shared/`: Zod schemas and inferred types (Workout, Event, Advice, Signals). The single source of truth for data shapes.
- `server/`: Node + Express API, Drizzle + SQLite, Clerk auth, LLM call.
- `client/`: Vite + React + Tailwind + HeroUI, TanStack Query for all fetching.

Packages import shared code as `@health-tracker/shared`. Never import across packages with relative paths.

## Rules

- **Types come from Zod.** Define the schema in `shared`, derive the type with `z.infer`. Do not hand-write duplicate interfaces.
- **Validate at the boundary.** Every request body on the server is parsed with the shared Zod schema; invalid bodies return 400 with field errors.
- **Every query is scoped to the user.** Tables store the Clerk user ID as `userId`, and every read and write filters by the signed-in user.
- **The LLM only writes advice.** Signals and readiness are computed by pure, unit-tested TypeScript functions. The LLM call runs on the server only, its output is validated with Zod, and the API key never reaches the client.
- **Hard rules win.** Fever or chest symptoms always means "rest", whatever the model says. Keep a rules-only fallback when the LLM call fails.
- **Health-adjacent wording.** Keep advice conservative and keep the "not medical advice" note on the Today screen.
- **Client data flow.** All fetching goes through TanStack Query hooks. Any workout or event mutation invalidates the advice query.
- TypeScript is strict; do not use `any` or `@ts-ignore` to get past errors.

## Working style

- Keep changes scoped to the ticket. Do not scaffold later tickets early.
- Ask before adding a dependency that is not in the planned stack above.
- Do not commit, push or deploy unless asked.

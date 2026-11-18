# AGENTS.md

Guidance for AI coding agents working in this repo. Read this before making changes.

## Project

A web app with two logs (activities and life events: alcohol, elevation, illness) and a "Today" screen that says how hard to train and why.

- Full scope, architecture and ticket plan: [Notion project scope](https://app.notion.com/p/Project-scope-workout-tracker-with-context-aware-AI-advice-41a2e6dc989181aca788d39334f59ac9)
- Work is organised as tickets (F-1, W-2, R-4, ...). Work on one ticket at a time, and meet its "Done when" criterion before calling it done.

## Environment

- Node 22 via nvm (pinned in `.nvmrc`). If `node -v` is older, run `nvm use` before any npm command.
- npm workspaces only. Do not add pnpm, yarn or Turborepo without asking.
- TypeScript is pinned to 6.0.x because typescript-eslint does not support TypeScript 7 yet. Do not upgrade it until typescript-eslint does.

## Commands (run from the repo root)

| Command | What it does |
| --- | --- |
| `npm install` | Install all workspaces |
| `npm run dev` | API server on http://localhost:3001 and client (Vite) on http://localhost:5173, both reloading on save |
| `npm run build` | `tsc -b` (type-checks and builds shared, server, client), then `vite build` for the client |
| `npm run typecheck` | Type-check everything without emitting |
| `npm run clean` | Remove build output |
| `npm run db:start` / `db:stop` | Start or stop this project's own Postgres (data in `.postgres-data/`, port 5433) |
| `npm run db:generate` | Generate a migration from `server/src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run lint` | ESLint with type-aware typescript-eslint rules |
| `npm run lint:fix` | Auto-fix what ESLint can |

Run `npm run lint` and `npm run build` (and tests, once they exist) before reporting a change as finished. Fix lint errors rather than disabling rules; if a disable is truly needed, use a single-line `eslint-disable-next-line` with a reason.

## Layout

- `shared/`: Zod schemas and inferred types (Activity, LifeEvent, Advice, Signals). The single source of truth for data shapes.
- `server/`: Node + Express API, Drizzle + PostgreSQL (`pg` driver), Clerk auth, LLM call.
- `client/`: Vite + React + Tailwind + HeroUI, React Router for routes, TanStack Query for all fetching.

Packages import shared code as `@health-tracker/shared`. Never import across packages with relative paths.

Inside the client, import from `client/src` with the `@/` alias (`@/components/ActivityForm`). Use `./` only for files in the same folder; ESLint rejects `../` imports. The alias is defined in both `client/tsconfig.app.json` (`paths`) and `client/vite.config.ts` (`resolve.alias`); change both together.

## Rules

- **Types come from Zod.** Define the schema in `shared`, derive the type with `z.infer`. Do not hand-write duplicate interfaces.
- **Validate at the boundary.** Every request body on the server is parsed with the shared Zod schema; invalid bodies return 400 with field errors.
- **Every query is scoped to the user.** Tables store the Clerk user ID as `userId`, and every read and write filters by the signed-in user.
- **The LLM only writes advice.** Signals and readiness are computed by pure, unit-tested TypeScript functions. The LLM call runs on the server only, its output is validated with Zod, and the API key never reaches the client.
- **Hard rules win.** Fever or chest symptoms always means "rest", whatever the model says. Keep a rules-only fallback when the LLM call fails.
- **Health-adjacent wording.** Keep advice conservative and keep the "not medical advice" note on the Today screen.
- **HeroUI is v3.** It needs no provider, uses compound components (`Card.Header`, `Select.Item`) and React Aria events (`onPress`, not `onClick`). Its styles come from `@import "@heroui/styles"` in `client/src/index.css`. Check the installed types rather than v2 docs or examples.
- **Shared in dev.** `shared/package.json` has a `development` export pointing at `src/index.ts`. Vite uses it automatically and the server's dev script passes `--conditions=development`, so neither needs `shared` built. Type-checking and production builds use the built `dist`.
- **Server and shared run as TypeScript under Node.** Node 22 strips types itself (no tsx/ts-node). So in `server` and `shared`: write relative imports with a `.ts` extension (`./app.ts`; `tsc` rewrites them to `.js`), and use only erasable syntax (no `enum`, `namespace` or constructor parameter properties; `erasableSyntaxOnly` enforces this).
- **Database changes go through migrations.** Edit `server/src/db/schema.ts`, run `npm run db:generate`, review the SQL in `server/drizzle/`, then `npm run db:migrate`. Commit the generated files; never edit an applied migration or change the database by hand. npm swallows extra flags on root scripts, so for drizzle-kit options run `npx drizzle-kit ...` inside `server/`.
- **Database connection.** Use the `db` from `server/src/db/client.ts`; don't create other pools. It falls back to the local dev database when `DATABASE_URL` is unset.
- **Server auth.** Everything under `/api` goes through `clerkMiddleware()` and `requireSignedIn` (`server/src/middleware/auth.ts`) and returns 401 without a Clerk session; `/health` is public. In handlers, get the user with `signedInUserId(req)` and filter every query by it; never trust a user ID from the body, query string or headers. The server reads `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` from `server/.env` (see `server/.env.example`). Client fetches send `Authorization: Bearer <useAuth().getToken()>`, and user-specific query keys include the Clerk `userId`.
- **Server errors.** Throw or reject from handlers and let `server/src/middleware/error-handler.ts` respond. Express 5 forwards async errors itself, so no try/catch-and-next boilerplate. Unexpected errors return a generic 500; never send stack traces or internal messages to the client.
- **Client routes and auth.** Routes live in `client/src/router.tsx` (React Router 8, `createBrowserRouter`; import from `react-router`, and `RouterProvider` from `react-router/dom`). New app pages go under the `RequireSignedIn` layout route, which sends signed-out users to `/sign-up`; sign-up/sign-in sit under `RequireSignedOut` (both in `components/RouteGuards.tsx`, using Clerk's `useAuth()`). There is no full-page loading screen: guards render nothing until Clerk has loaded, and actions show loading on the control that started them. Clerk reads its key from `VITE_CLERK_PUBLISHABLE_KEY` in `client/.env`.
- **Client data flow.** All fetching goes through TanStack Query hooks. Any activity or event mutation invalidates the advice query.
- TypeScript is strict; do not use `any` or `@ts-ignore` to get past errors.

## Working style

- Keep changes scoped to the ticket. Do not scaffold later tickets early.
- Ask before adding a dependency that is not in the planned stack above.
- Do not commit, push or deploy unless asked.

<!-- HEROUI-NATIVE-AGENTS-MD-START -->
[HeroUI Native Docs Index]|root: ./.heroui-docs/native|STOP. What you remember about HeroUI Native is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: heroui agents-md --native --output AGENTS.md|components/(buttons):{button.mdx,close-button.mdx,link-button.mdx}|components/(collections):{menu.mdx,tag-group.mdx}|components/(controls):{slider.mdx,switch.mdx}|components/(data-display):{chip.mdx}|components/(feedback):{alert.mdx,skeleton-group.mdx,skeleton.mdx,spinner.mdx}|components/(forms):{checkbox.mdx,control-field.mdx,description.mdx,field-error.mdx,input-group.mdx,input-otp.mdx,input.mdx,label.mdx,radio-group.mdx,search-field.mdx,select.mdx,text-area.mdx,text-field.mdx}|components/(layout):{card.mdx,separator.mdx,surface.mdx}|components/(media):{avatar.mdx}|components/(navigation):{accordion.mdx,list-group.mdx,tabs.mdx}|components/(overlays):{bottom-sheet.mdx,dialog.mdx,popover.mdx,toast.mdx}|components/(typography):{text.mdx}|components/(utilities):{pressable-feedback.mdx,scroll-shadow.mdx}|getting-started/(handbook):{animation.mdx,colors.mdx,composition.mdx,portal.mdx,provider.mdx,styling.mdx,theming.mdx}|getting-started/(overview):{design-principles.mdx,quick-start.mdx}|getting-started/(ui-for-agents):{agent-skills.mdx,agents-md.mdx,design-md.mdx,llms-txt.mdx,mcp-server.mdx}|releases:{beta-10.mdx,beta-11.mdx,beta-12.mdx,beta-13.mdx,cli-v1-0-0.mdx,rc-1.mdx,rc-2.mdx,rc-3.mdx,rc-4.mdx,v1-0-0.mdx,v1-0-1.mdx,v1-0-10.mdx,v1-0-11.mdx,v1-0-2.mdx,v1-0-3.mdx,v1-0-4.mdx,v1-0-5.mdx,v1-0-6.mdx,v1-0-7.mdx,v1-0-8.mdx,v1-0-9.mdx}
<!-- HEROUI-NATIVE-AGENTS-MD-END -->

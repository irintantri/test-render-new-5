# Tech stack

This file is the single source of truth for the technologies and conventions
the generated `/app/` must follow. `spec/AGENTS.md` defers every stack-specific
decision to the named sections below — adding sections is fine, but renaming
or removing them breaks the contract with `spec/AGENTS.md`.

## Runtime

Node.js 20

## Language

TypeScript

## Backend framework

Express

## Frontend framework

React 19 + Vite 5

## Validation library

Zod

## Package manager

npm

## Project layout

Mirror the pseudocode structure under `/app`:

- `/app/data/<feature>/`        → entity types + Zod schemas + `validate()` (one file per entity in `spec/pseudocode/Data/<feature>/`)
- `/app/controller/<feature>/`  → API controllers + handlers (one file per file in `spec/pseudocode/Logic/<feature>/`)
- `/app/frontend/<feature>/`    → React components + hooks (one file per file in `spec/pseudocode/Frontend/<feature>/`)
- `/app/server/`                → server entrypoint that mounts every controller under `/api/*`
- `/app/client/`                → Vite + React entrypoint with a router that renders each feature page
- `/app/.env.example`           → `DB_URL`, `VITE_API_BASE_URL`, `PORT`, `USE_MOCK_DB`, etc.; dev defaults must be empty/local
- `/app/package.json`           → root scripts: `dev`, `build`, `start`, `test`; wires server + client together

## Shared modules

A `/app/shared/` tree holds every cross-feature concern. Feature folders
(`/app/data/<feature>`, `/app/controller/<feature>`, `/app/frontend/<feature>`)
MUST NOT import from each other — only from `/app/shared/`.

- `/app/shared/lib/`         → framework-agnostic utilities (logger, Result type, date/format helpers)
- `/app/shared/errors/`      → `AppError`, `NotFoundError`, `ValidationError`; one class per error category
- `/app/shared/http/`        → typed fetch wrapper (`apiClient.get<T>()`, `apiClient.post<T>()`); the ONLY fetch surface the frontend uses
- `/app/shared/schema/`      → base Zod primitives (`zId`, `zTimestamp`, `zPagination`, `zEnum`) — every feature schema composes these
- `/app/shared/db/`          → `Repository<T>` base, `withTransaction()` helper, query builders; feature repos extend, never reimplement
- `/app/shared/middleware/`  → `requestLogger`, `errorHandler`, `validateBody(schema)`, `requireAuth` — mounted once in `/app/server/`
- `/app/shared/ui/`          → reusable React primitives: `Button`, `Input`, `Form`, `Field`, `Modal`, `ErrorBoundary`, `Spinner`, `EmptyState`
- `/app/shared/hooks/`       → `useApi`, `useForm`, `useDebounce`, `usePagination` — feature pages compose these, never write their own fetch/loading state machines
- `/app/shared/types/`       → contracts shared between client and server (`ApiResponse<T>`, `Paginated<T>`, DTOs derived from Zod schemas via `z.infer`)

**Small-app exception.** If the app has only one feature, omit `/app/shared/`
entirely and inline these concerns into the feature folder. The shared tree
exists to eliminate duplication across features — with one feature there is
nothing to dedupe and an empty `/app/shared/` is just dead weight. Re-introduce
the tree the moment a second feature lands.

## DRY rule

If a function, component, schema, or type is needed by **two or more features**,
extract it to the appropriate `/app/shared/` subdirectory **before** writing the
second copy. The generator MUST NOT duplicate fetch wrappers, error handling,
form state, validation helpers, or UI primitives across feature folders.

## Standard cross-cutting concerns

Implement these once in `/app/shared/`; every feature reuses them:

| Concern | Module | Used by |
|---|---|---|
| Request logging | `shared/middleware/requestLogger.ts` | server |
| Error envelope | `shared/middleware/errorHandler.ts` + `shared/errors/*` | server + client |
| Typed API calls | `shared/http/apiClient.ts` | every frontend feature |
| Form state + validation | `shared/hooks/useForm.ts` + `shared/ui/Form.tsx` | every frontend form |
| Auth context | `shared/auth/AuthContext.tsx` | client root + protected routes |
| DB transactions | `shared/db/withTransaction.ts` | any controller mutating ≥2 tables |
| Pagination | `shared/schema/zPagination.ts` + `shared/hooks/usePagination.ts` | list endpoints + list pages |

## Naming & import conventions

- Absolute imports from `/app/shared/*` via a `@shared/*` path alias (set in `tsconfig.json` + `vite.config.ts`).
- Feature code uses `@shared/...` only; never `../../shared/...`.
- Barrel exports (`index.ts`) on every `/app/shared/<subdir>/` so call sites stay one line.

## Type contracts

Server-side Zod schemas are the source of truth. Derive client-side TypeScript
types with `type Foo = z.infer<typeof fooSchema>` and re-export from
`/app/shared/types/`. Never hand-write a duplicate interface on the client.

## Frontend API base URL

Read from `import.meta.env.VITE_API_BASE_URL`. The dev default MUST be an empty
string so every fetch is same-origin and intercepted by the Vite proxy. Never
hardcode an absolute URL (`api.example.com`, production hosts, placeholders).

## Install command

```sh
npm install
```

## Dev command

```sh
npm run dev
```

## Verification gate

`GET /api/health` returns `{ "status": "ok" }`.

## Server scaffolding example

The shape the agent should produce for `/app/server/` (Express + adapter-pattern
DB so dev runs without a real database):

```ts
// Initialize database adapter
if (USE_MOCK_DB) {
  console.log("[server] Using mock database");
  Database.setAdapter(new MockDatabase());
} else {
  console.log("[server] Using real database");
  Database.setAdapter(new RealDatabase());
}

// Middleware
app.use(express.json());

// Mount controllers under /api
app.use("/api", productController);
app.use("/api", cartController);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Mock DB: ${USE_MOCK_DB}`);
});

export default app;
```

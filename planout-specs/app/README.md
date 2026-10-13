# Consent IQ

AI-assisted Informed Consent Form (ICF) authoring: Setup → Generate → Edit & Refine → Review → Preview/Publish.

**Stack:** Node 20+, TypeScript, Express 5, React 19 + Vite 5, Zod.

## Run

```sh
npm install
npm run dev        # API on :3001 + Vite on http://localhost:5173 (proxies /api)
```

Open http://localhost:5173 and click **Sign in**. You'll be signed in as the demo ICF author, Mike Evans.

| Script | What it does |
|---|---|
| `npm run dev` | API (`tsx watch`) + Vite dev server |
| `npm run build` | Type-check + production client build to `dist/` |
| `npm start` | Production server; serves `dist/` + `/api` on `PORT` |
| `npm test` | API behaviour tests (Vitest, in-memory DB) |

Verification gate: `GET /api/health` → `{ "status": "ok" }`.

## Configuration (`.env`, see `.env.example`)

- `USE_MOCK_DB=true` (default): seeded in-memory database, reset on restart. `false` gives a file-backed JSON DB at `DB_URL`.
- `OPENROUTER_API_KEY`: enables real AI rewrites/generation via OpenRouter. When it's empty, a deterministic offline rewriter is used.
- `GENERATION_DURATION_MS`: simulated ICF generation time (default 15 s).
- `VITE_API_BASE_URL`: leave empty in dev (same-origin through the Vite proxy).

## Routes

`/` sign-in · `/dashboard` welcome · `/icf-management` ICF dashboard · `/setup[/:protocolId]` ·
`/icf-creation-generate/:jobId` · `/edit/:id` · `/review/:id` · `/preview/:id` · `/ai/generate`

## Layout

```
data/<feature>/        Zod schemas + types + validate() (+ data-lane routers)
controller/<feature>/  API controllers/services and client-side logic hooks
frontend/<feature>/    React components + hooks
shared/                lib, errors, http, schema, db, middleware, ui, hooks, types, auth, ai
server/                app.ts (createApp) + index.ts (listen)
client/                Vite entry, router, page compositions
```

Feature folders import only from `@shared/*`. Cross-feature composition (shell, stepper, TOC, bottom bars) happens in `client/pages/`, via slot/render props.

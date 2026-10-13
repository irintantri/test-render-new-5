# Stage 03 — Logic layer

Goal: implement every API controller defined under `spec/pseudocode/<lane>/<feature>/Logic/` against the data layer from stage 02.

## Inputs

- `spec/pseudocode/<lane>/<feature>/Logic/*.md` — controller definitions: HTTP method, path, request shape, response shape, status codes, conditional branches.
- `spec/summary/<feature>.html` — user-facing copy, logic and any numeric limits the logic must enforce.
- `/app/data/` — the type + schema + `validate()` exports from stage 02.
- `spec/tech-stack.md` — **Backend framework**, **Project layout** (for the API prefix and server entrypoint location), and **Verification gate**.
- `spec/reference_code/<lane>/<feature>/logic/` — optional; if present, reuse handler patterns from it.

## Steps

For every controller defined in the pseudocode:

1. Implement each API ENDPOINT using the **Backend framework** from `spec/tech-stack.md`. Match the exact HTTP method, path (including path params), input shape, response status codes, and response body keys declared in the pseudocode.
2. Preserve every conditional branch (stock checks, auth checks, existence checks, etc.) and the exact status codes + error payloads listed for each branch.
3. Inject a repository/service layer so the same handler runs against either a real DB or a mock adapter. Choose at startup based on an env var (e.g. `USE_MOCK_DB`); both implementations must satisfy the same interface.
4. Enforce numeric limits from `/spec/summary` or `/spec/pseudocode` (e.g. "limit to N items").

Then in the server entrypoint named in `spec/tech-stack.md`'s **Project layout**:

5. Mount every controller under the API prefix the **Project layout** specifies.
6. Expose the **Verification gate** endpoint from `spec/tech-stack.md`, returning the exact response body that section names.
7. Wire the dev-vs-real DB selection from step 3.

## Success criterion

The server boots without errors using the **Dev command** from `spec/tech-stack.md`. The **Verification gate** endpoint returns the response body declared in `spec/tech-stack.md`. Every controller endpoint is reachable at the path the pseudocode names.

Do not advance to stage 04 until this criterion is met.

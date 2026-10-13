# Stage 01 — Scaffold

Goal: create the empty project skeleton that subsequent stages fill in.

## Inputs

- `spec/tech-stack.md` — the **Project layout**, **Package manager**, **Install command**, and **Dev command** sections describe the directory structure and root manifest you must create.
- `spec/pseudocode/` — read directory names only at this stage. Each `<lane>/<feature>/` pair maps to a sub-folder under the layered directories named in `spec/tech-stack.md`'s **Project layout** (data, logic/controller, frontend).

## Steps

1. Create the top-level `/app/` directory.
2. Create every directory listed in **Project layout** of `spec/tech-stack.md`.
3. Generate the root manifest the **Package manager** in `spec/tech-stack.md` expects (e.g. `package.json`, `pyproject.toml`, `go.mod`). It must declare:
   - the **Install command** from `spec/tech-stack.md` exactly as written
   - the **Dev command** from `spec/tech-stack.md` exactly as written
   - any other commands referenced elsewhere in `spec/tech-stack.md` (build, start, test if listed)
4. Create the `.env.example` referenced in **Project layout**, with empty/local defaults for every variable named there.
5. Stub the server and frontend entrypoints (e.g. `/app/server/index.*`, `/app/client/index.*`) with a minimal "TODO" body — actual content lands in stages 03 and 04.

## Success criterion

Running the **Install command** from `spec/tech-stack.md` in `/app/` succeeds. The directory tree matches **Project layout** exactly (every named folder exists; no extras).

Do not advance to stage 02 until this criterion is met.

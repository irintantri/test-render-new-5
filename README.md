# Build app

Five ways to build `/app/` from this bundle:

1. **In Claude Code:** open this folder and type `/planout`. Runs the build interactively, in your own session, with your normal tool-approval prompts.
2. **In Antigravity / Cursor / VS Code:** open this folder → Command Palette → `Tasks: Run Task` → `Build App`.
3. **Double-click `build.sh`.** Headless — defaults to Claude Code. (Windows: run it from WSL or Git Bash — there's no native `.bat`.)
4. **Swap providers:** `build.sh` runs the build inside your repl over SSH when `REPLIT_SSH_HOST` is set, falling back to local `claude` if that fails; it exits with instructions if neither is available. Point it at any other agent yourself with `AGENT_CMD="gemini -p" ./build.sh`. Set `REPLIT_GIT_REMOTE` to also push the finished `app/` to a Replit-linked GitHub repo as a last step (any plan, no SSH — see `REPLIT_GUIDE.md`). See the header of `build.sh` for all env-var knobs (`AGENT_CMD`, `REPLIT_SSH_HOST`, `REPLIT_AGENT_CMD`, `REPLIT_GIT_REMOTE`, `PROMPT_FILE`, `PROGRESS_LOG`).
5. **In Replit:** upload this bundle's ZIP at **replit.com/import** (any plan). The root `replit.md` tells Replit Agent that `spec/AGENTS.md` is the contract, so one sentence in Agent chat starts the build — or run `./build.sh` in the Repl's Shell with Claude Code installed. Paid plans can also script it from your own terminal over SSH (`REPLIT_SSH_HOST=… ./build.sh`). All in `REPLIT_GUIDE.md`.

## Layout

Running a build produces three top-level directories:

- `spec/` — the specification bundle (inputs the build agent reads).
- `app/` — the generated application (built by the agent).
- `plan/` — a placeholder for change plans. Used when a change falls outside
  the staged build: the agent writes a plan into `plan/` first, then executes
  it against `app/`. Ships as `plan/README.md` only.

### What's in `spec/`

- `spec/AGENTS.md` — thin orchestrator. Sequences the five stage prompts; every entry point above reads this same file.
- `spec/tech-stack.md` — runtime, language, frameworks, project layout, install/dev commands, verification gate. Override per-request via the `tech_stack` field on the artifact API.
- `spec/prompts/01-…05-…md` — staged build instructions, each with its own success criterion.
- `spec/pseudocode/` `spec/summary/` `spec/assets/` `spec/reference_code/` — the inputs the stages read.
- `spec/tests/` — runnable scenarios.
- `spec/GxP/` — GxP validation-pack prompt scaffold (authored into `spec/summary/` at build time).

### Workspace root

- `build.sh` — the headless build entry point.
- `replit.js` — `build.sh`'s `REPLIT_GIT_REMOTE` deploy step; pushes `app/` to a Replit-linked GitHub repo, first refreshing `app/.design-reference/` (a copy of `spec/assets/`) and `app/replit.md` so Replit Agent still has the design spec to match once only `app/` has made the trip. Also runnable directly: `node replit.js`.
- `.claude/commands/planout.md` — the `/planout` interactive build entry point.
- `CLAUDE.md` — points Claude Code at `spec/AGENTS.md` automatically when you reopen **this folder** (Claude Code auto-loads `CLAUDE.md`, not `AGENTS.md`), so the rules below apply without retyping `/planout`. Opening Claude Code from inside `/app/` instead is a different project root and won't pick this up — reopen the bundle root, or ask the agent to read `spec/AGENTS.md` directly.
- `replit.md` — auto-read by Replit Agent after a ZIP import at replit.com/import; points it at `spec/AGENTS.md`, the same way `CLAUDE.md` does for Claude Code.
- `REPLIT_GUIDE.md` — Replit walkthrough: ZIP import (any plan), or SSH so `build.sh` runs inside your repl from your own terminal (paid plans).
- `.vscode/tasks.json` — `Build App` Command Palette entry.
- `.devcontainer/devcontainer.json` — Codespaces / VS Code dev container for the bundle itself.

## Run the built app

Once a build finishes, `/app/` is runnable on its own — no rebuild needed to
start it again. Run the **Install command**, then the **Dev command**, from
`spec/tech-stack.md`, from inside `/app/`.

## Further changes

The staged build above produces the initial `/app/`. Any change requested
**after** that — an iteration, fix, or addition — follows a **plan-then-execute**
workflow: write a plan into `plan/` first (one markdown file per change),
*then* execute it against `/app/`.

Do not edit `/app/` for an out-of-band change until the plan file exists under `plan/`.

See `spec/AGENTS.md` → *Further changes* for the full rule, and `plan/README.md`
for the placeholder's format.

## Logs

`build.sh` tees the raw NDJSON event stream to `.build/progress.log` while rendering pretty dots/text on stdout. Tail it from another terminal or an IDE panel for structured progress.

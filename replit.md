# replit.md

## Project

This Repl is a PlanOut code-generation bundle, not a finished app. The app
does not exist yet — it is built from the specification in `spec/`.

- `spec/AGENTS.md` is the complete build contract: read it first and follow
  it exactly, start to finish. It sequences the staged prompts under
  `spec/prompts/` and names every input (`spec/tech-stack.md`,
  `spec/pseudocode/`, `spec/summary/`, `spec/assets/`, `spec/reference_code/`).
- Write the generated application into `app/` at this Repl's root — nowhere
  else. `spec/` is read-only input.
- Use `spec/tech-stack.md` for the runtime, framework, layout, install and
  dev commands. Do not substitute a different stack.
- Do not second-guess or reorder the staged build. Each stage has its own
  success criterion; complete it before moving on.

## To build

Say "build the app" (or just start): follow `spec/AGENTS.md`. When it
finishes, `app/` runs on its own with the install and dev commands from
`spec/tech-stack.md`. Configure this Repl's run command to the dev command
from inside `app/`.

## Further changes

**For any change beyond the initial staged build:** write a plan into `plan/`
first (one markdown file per change), then execute it against `/app/`.

Do not edit `/app/` for an out-of-band change until the plan file exists under `plan/`.

See `spec/AGENTS.md` → *Further changes* for the full workflow.

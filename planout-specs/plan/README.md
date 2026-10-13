# Plans

This directory is a **placeholder**. It ships empty and is filled at build /
iteration time.

Use it for any change that falls **outside** the standard staged build
(`spec/prompts/01–05`, run headless via `build.sh` or
interactively via `/planout`): iterations, fixes, additions, or rework
requested after the initial `/app/` exists.

## Workflow: plan, then execute

When a requested change is not already covered by the staged build pipeline:

1. **Plan** — write a concise change plan here, one markdown file per change
   (`plan/<change>.md`). State what to change, why, and the `/app/` files it
   will touch.
2. **Execute** — carry out the plan against `/app/`, then record the outcome
   (what changed, verification result) in the same plan file.

Do not edit `/app/` for an out-of-band change until the plan file exists under `plan/`.

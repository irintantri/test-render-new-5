# Stage 05 — Verify

Goal: install dependencies, boot the dev environment, and confirm the **Verification gate** from `spec/tech-stack.md` passes end-to-end.

## Inputs

- `spec/tech-stack.md` — **Install command**, **Dev command**, and **Verification gate** sections drive this stage.
- `/app/` — the project as built by stages 01-04.

## Steps

1. Run the **Install command** from `spec/tech-stack.md` in `/app/`. It must complete without errors.
2. Start the project with the **Dev command** from `spec/tech-stack.md`. The server must boot without unhandled errors.
3. Hit the **Verification gate** endpoint from `spec/tech-stack.md`. The response must match the body declared in that section exactly.
4. Open at least one frontend page from `spec/pseudocode/<feature>/Frontend/` and confirm it loads — both the network request to the API and the rendered output.  If the technology requires compilation, make sure we have all the compile error fixed before finishing.
5. If any of steps 1-4 fail, report which stage's output the failure traces back to (01 scaffold, 02 data, 03 logic, or 04 frontend) and stop. Do not silently patch around a stage's missing or incorrect output here.  If the technology requires compilation, make sure we have all the compile error fixed before finishing.

## Success criterion

All four checks pass:
- Install completes cleanly.
- Dev server boots cleanly.
- The **Verification gate** endpoint returns the declared response.
- At least one feature page loads end-to-end.

This is the final pass/fail for the whole bundle. If green, the build is complete.

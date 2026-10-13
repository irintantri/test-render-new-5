---
description: Build /app from this bundle's spec/AGENTS.md, interactively, in this session
---

Read `spec/AGENTS.md` and follow it exactly, start to finish, using your own
tools in this session — file read/write, Bash, everything it asks for.
`spec/AGENTS.md` is the complete build sequence; don't second-guess or
reorder it.

This is the interactive counterpart to `build.sh`: same spec, same staged
build, but driven by you right here instead of a headless subprocess — so you
keep your normal tool-approval prompts instead of `build.sh`'s
`--dangerously-skip-permissions` run. If a stage needs a decision
`spec/AGENTS.md` doesn't cover, ask rather than guessing.

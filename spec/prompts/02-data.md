# Stage 02 — Data layer

Goal: for every entity defined under `spec/pseudocode/<lane>/<feature>/Data/`, generate a typed model + runtime validator in `/app/data/<feature>/`.

## Inputs

- `spec/pseudocode/<lane>/<feature>/Data/*.md` — entity definitions: field names, types, VALIDATE rules.
- `spec/tech-stack.md` — **Language** and **Validation library** sections name what to generate with.
- `spec/reference_code/<lane>/<feature>/data/` — optional; if present, reuse type/schema patterns from it.


## Steps

For every entity defined in the pseudocode:

1. Export a type using the **Language** named in `spec/tech-stack.md`, with the exact field names and types declared in the pseudocode.
2. Export a runtime schema using the **Validation library** named in `spec/tech-stack.md`, mirroring the type 1:1.
3. Export a `validate(entity)` function that enforces every VALIDATE rule listed in the pseudocode and throws a descriptive error naming the failing rule.

Constraints:
- Do not add fields, rename fields, or relax VALIDATE rules from the pseudocode.
- Match the file/directory naming from `spec/pseudocode/Data/<feature>/` so stage 03 can import by path.

## Success criterion

For every entity file under `spec/pseudocode/<lane>/<feature>/Data/`, a corresponding implementation file exists under `/app/data/<feature>/`, exporting all three of: type, schema, `validate()`. The data layer compiles in isolation (the **Language**'s type-checker / linter passes on `/app/data/**`).

Do not advance to stage 03 until this criterion is met.

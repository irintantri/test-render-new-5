# Stage 04 — Frontend

Goal: build every component and page declared under `spec/pseudocode/<lane>/<feature>/Frontend/` against the API surface from stage 03.

## Inputs

- `spec/pseudocode/<lane>/<feature>/Frontend/*.md` — component + hook definitions: props, return shape, event handlers, lifecycle, render logic.
- `spec/assets/<nodeId>.png` — visual reference for layout, spacing, colours, radii, typography.
- `spec/assets/<nodeId>.structure.txt` — structural hints derived from the source SVG.
- `spec/assets/<nodeId>.svg` — original artwork; use directly for icons and illustrations.
- `spec/summary/<feature>.html` — user-facing implementation and copy (including localised strings).
- `spec/tech-stack.md` — **Frontend framework**, **Frontend API base URL**, **Project layout**.
- `spec/reference_code/<lane>/<feature>/frontend/` — optional; if present, reuse component/hook patterns from it.

## Steps

For every component and hook defined in the pseudocode:

1. Use the **Frontend framework** named in `spec/tech-stack.md` and follow its conventions for components and hooks.
2. Match the exported surface (props, return shape, event-handler names) declared in the pseudocode exactly.
3. Implement the "LIFECYCLE / DATA FETCHING", "EVENT HANDLERS", and "RENDER LOGIC" sections from the pseudocode faithfully — do not merge, skip, or reorder steps.
4. Call only the API endpoints defined in `spec/pseudocode/Logic/`. Read the API base URL from the source the **Frontend API base URL** section of `spec/tech-stack.md` specifies; the dev default MUST resolve to same-origin so requests are intercepted by the dev server's proxy. Never hardcode an absolute URL (`api.example.com`, production hosts, placeholders).
5. Handle every response branch the pseudocode mentions (success, out-of-stock, error, etc.) and surface the user-facing copy exactly as spelled in `/spec/summary` (including localised strings).
6. If the feature is localised, derive the locale from the source the pseudocode specifies (e.g. URL path segment) and switch all user-facing copy accordingly.
7. Layout, spacing, colors, radii, and typography must visibly match the `.png` / `.structure.txt` for the feature. Use referenced `.svg` assets directly for artwork.

Then write the page and app root:

8. Place each component in the corresponding feature subdirectory of the frontend folder named in `spec/tech-stack.md`'s **Project layout**.
9. Write the page composition + app root with design matching the `.png`s.

## Success criterion

The frontend builds without errors using the **Dev command** from `spec/tech-stack.md`. Every page declared in `spec/pseudocode/<feature>/Frontend/` renders and loads its data. Visual output is recognisable as the design in the corresponding `.png`.

Do not advance to stage 05 until this criterion is met.

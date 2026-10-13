# GxP Validation Pack — Agent Prompt Scaffold (`spec/GxP/`)

This directory is a **prompt-driven scaffold** for producing a GxP software-validation pack for the
application in this bundle. It ships **structure and prompts only** — no rendered documents. The build
agent (the one `build.sh` runs) authors the documents from these prompts after it builds the app.

## What the build agent does

After the app is built, for each prompt in `prompts/`, write exactly one **self-contained HTML file**
under `src/`:

| # | Document | Prompt | Output |
|---|---|---|---|
| 01 | Intended Use & Scope | `prompts/01-intended-use-and-scope.prompt.md` | `src/01-intended-use-and-scope.html` |
| 03 | Requirements / URS | `prompts/03-requirements-urs.prompt.md` | `src/03-requirements-urs.html` |
| 05 | Functional / Design Specifications | `prompts/05-functional-design-specs.prompt.md` | `src/05-functional-design-specs.html` |
| 07 | Test Strategy & Scripts (IQ/OQ/PQ) | `prompts/07-test-strategy-and-scripts.prompt.md` | `src/07-test-strategy-and-scripts.html` |
| 10 | Part 11 Controls | `prompts/10-part11-controls.prompt.md` | `src/10-part11-controls.html` |
| 11 | Training / SOPs | `prompts/11-training-and-sops.prompt.md` | `src/11-training-and-sops.html` |

The full GxP pack also defines 02 Validation Plan, 04 Risk Assessment, 06 Traceability Matrix,
08 Execution Evidence, 09 Deviations & Defects, and 12 Validation Summary Report. They are out of
scope for this bundle.

## How to run it

1. **Read the contract.** `CONVENTIONS.md` (IDs, status taxonomy, no-overclaim gate, HTML format,
   front-matter) and `PROVENANCE.md` (which reference governs each document's structure).
2. **Ground every claim in the built app.** This bundle *is* the system under validation. Derive the
   system's facts from what you built: the workspace/app name, `spec/tech-stack.md`, `spec/AGENTS.md`, the
   `spec/pseudocode/` and generated source, and the data/API surface. Every `Implemented` claim must cite
   a real `file:line` in the built app. Never claim a capability the app does not have — mark it
   `Partial` or `Planned`.
3. **Author each document** by following its prompt, writing one self-contained HTML fragment
   `src/NN-*.html` — flat, concrete `<h2>` headings (see `CONVENTIONS.md` § HTML format), not generic
   template labels. No `<html>/<head>/<body>/<style>`; the shared print stylesheet is applied at
   assembly.
4. **Maintain the spine.** As 03/05/07 introduce `URS-`/`FS-`/`TC-` ids, append a row to `RTM.csv`.
   No orphan ids.

## Output

There is **no PDF engine, no pandoc, and no project libraries** — the documents *are* HTML, and a
headless browser turns them into PDFs. When `build.sh` finishes the run it:

1. wraps each `src/*.html` with the shared print stylesheet (`assets/_head.html`) into `out/html/`,
2. assembles a cover-first **`spec/summary/User Requirements Specification.html`** at the bundle root, and
3. **renders the PDFs** — one per document in **`spec/GxP/out/pdf/`** plus the merged
   **`spec/summary/User Requirements Specification.pdf`** — using a system Chrome/Chromium/Edge, or a
   one-off headless Chromium via `npx puppeteer` when none is installed.

The print CSS handles margins, page size, and per-document page breaks. If automatic rendering can't
run (no browser **and** no network), open the merged HTML and choose **Print → "Save as PDF"** (A4).

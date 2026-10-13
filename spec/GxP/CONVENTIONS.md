# Conventions — Shared Contract for Every GxP Document

Every prompt in `prompts/` obeys this file. Read it before authoring any `src/NN-*.html`. These rules
are what make the pack auditable: stable ids, honest status, and a single traceability spine.

---

## System facts (derive from this bundle)

This bundle is the system under validation. Derive each fact below from what you built, and use it
consistently across all documents.

| Fact | Where to get it |
|---|---|
| System name | The workspace / app name (`spec/AGENTS.md`, `README.md`, `app/package.json`) |
| System tagline | One line describing what the app does |
| Document prefix | A short uppercase code for controlled doc numbers, e.g. `APP-VAL` (→ `APP-VAL-01`) |
| Organisation | The owning org, if known; otherwise omit |
| Ground-truth capability set | The features actually present in the built app (routes, data model, UI) |
| Regulated records | The records/data the app stores that fall under the regulation in scope |

If the application is not a regulated/clinical system, still produce the pack but state the GxP
classification honestly (e.g. "illustrative — not a regulated record system") in document 01.

---

## Status taxonomy

Applied to every requirement, control, functional spec, and test.

- **Implemented** — real in the built app; **must** carry a `file:line` citation.
- **Partial** — present but not enforced/complete; carries a citation **and** the gap.
- **Planned** — a "to-be" target; design + test written but marked *deferred*.

### No-overclaim gate

A document fails review if it states `Implemented` for anything the app does not actually do, or if
an `Implemented` claim lacks a resolvable `file:line` citation. When unsure, downgrade to `Partial`.

### Test-status nuance (document 07)

A requirement that is implemented and cited but has **not** been witnessed in a signed execution run
is **`Ready (citation-based)`** — never `Pass`. `Pass` requires a recorded, signed execution. A
Planned item's test is `Deferred`.

---

## Authoring rigor (applies to every document)

These rules are the difference between the reference-grade samples and a thin skeleton. Every prompt
assumes them:

1. **Tables sit beside prose.** Every table is introduced and explained by narrative that says *why*
   each row holds (the rule, the gap, the rationale). Tables alone fail review.
2. **Cite `file:line` throughout.** Thread citations through the narrative, not only the rows a prompt
   flags. Every claim about what the app does resolves to code.
3. **Quote load-bearing logic verbatim.** Gates, fallbacks, state transitions, version bumps — quote
   the source with its `file:line`; do not paraphrase.
4. **Quantify the built surface.** State real counts (endpoints, tables, requirements) and reconcile
   them (e.g. "33 validated of 42 handlers"; "26 requirements — 20 Implemented, 3 Partial, 3 Planned").
5. **Route every gap to a deviation.** Each `Partial`/`Planned` item names a deviation id (`DEV-NNN`)
   even though the deviations document (09) is out of scope here; roll the gaps up in the document's
   summary.
6. **State an honest posture.** Close with a summary that never implies compliance the evidence does
   not support.
7. **Match the sample's breadth.** Do not emit a 3-row table where the system has 20 items; cover the
   real surface.
8. **Explain every section in this system's context — this is the difference between a real document
   and a downgraded one.** Open each section with **2–4 sentences of prose** that say what it is *for
   this specific application*: name the actual feature the **canvas** defines, describe what it does
   and how it works, and why it matters for validation — drawn from the rendered design
   (`spec/pseudocode/`, the node assets, `spec/summary/`, `spec/tech-stack.md`) **and** the built code, with
   `file:line`. Only then place the table, and follow it with a sentence interpreting it. A section
   that is just a table, or prose generic enough to paste into any other app's pack, **fails review.**
   Name the real screens, endpoints, entities, jobs, and business steps — never placeholders.

---

## Id scheme (stable across all documents)

| Prefix | Introduced in | Meaning |
|---|---|---|
| `URS-NNN` | 03 Requirements | A user/business/compliance/security/data/workflow requirement |
| `FS-NNN` | 05 Functional/Design | A functional or design spec satisfying a URS |
| `TC-IQ-NNN` / `TC-OQ-NNN` / `TC-PQ-NNN` | 07 Test | Installation / Operational / Performance test case |

Ids are introduced in their home document and **resolved in `RTM.csv`**. An id used anywhere that
does not resolve in `RTM.csv` is an orphan — not allowed. `NNN` is zero-padded and stable; never
renumber. (`RISK-`, `EV-`, `DEV-` ids belong to the out-of-scope documents 04/08/09; reference them
by name only if needed.)

## Traceability spine — `RTM.csv`

`RTM.csv` is the single source of truth. Columns:

```
URS_ID, URS_title, FS_ID, RISK_ID, TC_ID, EV_ID, status, regulatory_ref, source_file_line, notes
```

As documents 03/05/07 introduce ids, append a row per `URS_ID` linking it to its FS, test, status,
regulatory driver, and source `file:line`. Leave `RISK_ID`/`EV_ID` blank when those documents are
out of scope. Keep the file complete so the in-scope documents stay internally consistent.

## Citation format

- Code: `relative/path/file.ext:LINE` (or `:START-END`), e.g. `src/server/routes/consent.ts:42`.
- Tests: the test/scenario path, e.g. `tests/scenarios/approval-gate/`.
- Regulatory: name the standard and clause, e.g. `21 CFR Part 11 §11.10(e)`, `21 CFR 50.25(a)`,
  `ICH E6(R3)`. A local reference library is optional; cite by name when none is bundled.

---

## Shared front-matter (every `src/NN-*.html` starts with this)

Each document is a **self-contained HTML fragment** — no `<html>`, `<head>`, `<body>`, or `<style>`
(the build wraps every fragment with the shared print stylesheet). Open with the title and the three
control blocks, substituting the derived system facts for each `<…>`:

```html
<h1>&lt;Document Title&gt;</h1>
<p class="docmeta">&lt;System Name&gt; &mdash; &lt;System Tagline&gt; &middot; &lt;DOC_PREFIX&gt;-NN &middot; &lt;ISO date&gt;</p>

<h2>Document Control</h2>
<table>
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>Document number</td><td>&lt;DOC_PREFIX&gt;-NN</td></tr>
  <tr><td>Revision</td><td>0</td></tr>
  <tr><td>Status</td><td>Draft</td></tr>
  <tr><td>Issue date</td><td>&lt;ISO date&gt;</td></tr>
  <tr><td>Prepared by</td><td>&lt;author&gt;, &lt;Organisation&gt;</td></tr>
</table>

<h2>Approval / Signatures</h2>
<table>
  <tr><th>Name</th><th>Role</th><th>Signature</th><th>Date</th></tr>
  <tr><td></td><td>Author</td><td></td><td></td></tr>
  <tr><td></td><td>Quality Assurance</td><td></td><td></td></tr>
  <tr><td></td><td>Validation Lead</td><td></td><td></td></tr>
  <tr><td></td><td>System Owner</td><td></td><td></td></tr>
  <tr><td></td><td>Business Owner</td><td></td><td></td></tr>
</table>

<h2>Revision History</h2>
<table>
  <tr><th>Rev</th><th>Date</th><th>Author</th><th>Description</th></tr>
  <tr><td>0</td><td>&lt;ISO date&gt;</td><td>&lt;author&gt;</td><td>Initial issue</td></tr>
</table>
```

## HTML format (the document is HTML)

The deliverable for each document is a **self-contained HTML fragment** at `src/<NN>-*.html`. The build
wraps it in the shared print shell (`assets/_head.html` / `_foot.html`) and assembles the pack — you
never run a converter. Write clean, semantic HTML:

- **No document wrapper and no styling.** Do not emit `<!doctype>`, `<html>`, `<head>`, `<body>`, or
  `<style>`/`style="…"` — the shared stylesheet owns all layout. Start straight at the `<h1>` title.
- **Headings are flat `<h2>`.** Each `##` item in your prompt's skeleton becomes one `<h2>`. Do **not**
  nest with `<h3>` unless a section genuinely has sub-parts, and **do not hand-number** headings — the
  shared CSS and reading order carry the structure. The `1.`, `§5.1` markers in prompts are references,
  not literal text.
- **Use concrete, content-specific heading names — never the generic template label.** A prompt item
  like "System Description" is a *content requirement*: break it into the system's real parts, one
  `<h2>` each (e.g. `<h2>The login request workflow</h2>`, `<h2>API surface</h2>`,
  `<h2>Audit and versioning</h2>`), instead of one generic heading. Split scope into `<h2>In scope</h2>`
  and `<h2>Out of scope</h2>`. Emit Objectives / Scope / Assumptions / Exclusions as their own `<h2>`
  sections, not under an `<h2>Introduction</h2>` parent.
- **Tables are `<table>`** with a `<tr><th>…</th></tr>` header row, one per spec'd table, each introduced
  by a `<p>` of prose.
- **Quote source in `<pre><code>…</code></pre>`**; keep `file:line` citations inline as `<code>` or
  plain text. Escape `<`, `>`, `&` inside code as `&lt;`, `&gt;`, `&amp;`.
- **No Markdown and no LaTeX** in the source — write HTML elements, not Markdown headings, pipe-tables,
  or LaTeX commands.

## Viewing and printing (how the PDF is made)

There is **no PDF engine and no pandoc** — the documents are HTML and a headless browser makes the PDF.
You author only the HTML fragments; **`build.sh` produces the PDFs automatically.** After the agent
finishes, `build.sh`:

1. wraps each `src/*.html` with `assets/_head.html` (the print stylesheet) + `assets/_foot.html` into a
   standalone `out/html/<NN>-*.html`,
2. assembles a cover-first **`spec/summary/User Requirements Specification.html`** at the bundle root — every
   document on its own A4 page, and
3. **renders every document to PDF** — one PDF per document in `spec/GxP/out/pdf/`, plus the merged
   **`spec/summary/User Requirements Specification.pdf`** — driving a system Chrome/Chromium/Edge, or a
   one-off headless Chromium via `npx puppeteer` when none is installed.

The `@page` / print rules in `_head.html` own margins, page size, and per-document page breaks. You do
not author a cover — `build.sh` generates it from the app name. If automatic rendering cannot run (no
browser **and** no network), open `spec/summary/User Requirements Specification.html` and choose
**Print → "Save as PDF"** (A4) as a fallback.

# Prompt — Document 01: Intended Use & Scope

> **Agent instruction.** Read `../CONVENTIONS.md` and `../PROVENANCE.md` first. Produce **exactly one**
> file: `../src/01-intended-use-and-scope.html`
> (CONVENTIONS § HTML format). Do not author any other document.

## Objective

Define what this application is, who uses it, which regulated records/processes are in scope, and the
validation boundary — readable by a **non-GxP** reviewer. Ground every statement in the `/app` you
just built, citing `file:line`.

## Skeleton — author these sections in order, all as flat `##` headings

> **For EVERY section below:** first write **2–4 sentences explaining what it is for THIS canvas/app**
> — name the real feature/screen/endpoint, describe what it does and why it matters for validation,
> cite `file:line` — and only then the table/content. A bare table or generic boilerplate fails
> review (CONVENTIONS § Authoring rigor #8).

Start with the shared front-matter block (CONVENTIONS § Shared front-matter). Then emit, in order:

```
## Objectives                  — what this document fixes; one paragraph.
## Scope                       — what the module is and what this validation covers.
## Assumptions                  — conditions taken as true for the claims here to hold.
## Exclusions                  — what this document deliberately leaves out (and where it is covered).
## Acronyms and Definitions     | Term | Meaning |   (≥8 rows; app terms cite file:line)
## References                  — prose naming the governing standards (21 CFR Part 11, FDA CSA/GPSV, GAMP 5).

<<< SYSTEM DESCRIPTION — do NOT emit a generic "## System Description" heading. >>>
Instead emit ONE flat `##` section per real subsystem of THIS app, named concretely. Mirror how the
reference pack did it for its app (it used: `## The seven-step workflow`, `## API controllers`,
`## Generation pipeline`, `## AI compliance check`, `## Audit and versioning model`). For THIS app,
choose the concrete equivalents, e.g.:
## The <primary> request/workflow   | Step | Screen / function | What it does | Record produced |  (one row per step, each citing controller file:line)
## API surface                       | Method | Path | Purpose | Source (file:line) |
## <data & persistence>              — entities/stores, with file:line
## <any pipeline / gate / job>       — quote the load-bearing logic verbatim with file:line
## Audit and versioning              — how changes are recorded (or the gap, if none)

## Intended use and users     — plain-language: who uses it to do what; what it is NOT for.
## Regulated records and data in scope   | Data item | Where it lives | Regulated record? |
## In scope                   | Capability | In scope | Basis (as-built, file:line) |
## Out of scope (Planned — specified, not built)   | Capability | Status | Deviation |
## GxP classification and validation rationale  — GxP category; GAMP 5 (by name); FDA CSA risk-based
                                                  note; **state honestly if the app is illustrative / not a regulated system.**
## Use disclaimer            — the statement limiting how the system may be relied on, given its as-built state.
```

## Rules

- Obey **CONVENTIONS § Authoring rigor** and **§ Markdown format**: flat concrete `##` headings (never
  the generic label), each table introduced by prose, `file:line` everywhere, quantified counts, no
  overclaim. Anything the app does not do is `Out of scope`/`Planned`, never `In scope`.

## Output

The document is a **self-contained HTML fragment** at `../src/01-intended-use-and-scope.html` (CONVENTIONS § HTML format) — no `<html>/<head>/<body>/<style>`. Do **not** render or convert it; `build.sh` wraps it with the shared print stylesheet and assembles `spec/summary/User Requirements Specification.html`, which you print to PDF from any browser.

## Done when

A non-GxP reader can state what the app does and what is / isn't validated; the workflow, regulated-
records, In-scope and Out-of-scope tables are present with `file:line`; and the HTML is authored per CONVENTIONS § HTML format.

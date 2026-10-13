# Prompt — Document 05: Functional / Design Specifications

> **Agent instruction.** Read `../CONVENTIONS.md` and `../PROVENANCE.md` first. Produce **exactly one**
> file: `../src/05-functional-design-specs.html`, append every `FS-NNN` to `../RTM.csv` (CONVENTIONS § HTML format).

## Objective

Describe **how** the built app meets the URS — behaviour, data model, APIs, processing, gating, audit
— as `FS-NNN` items, each tracing up to a `URS-NNN` and down to code (`file:line`) or marked
design-only (Planned). This is the **most code-specific document in the pack**; quote load-bearing
logic verbatim.

## Skeleton — author these sections in order, all as flat `##` headings

> **For EVERY section below:** first write **2–4 sentences explaining what it is for THIS canvas/app**
> — name the real feature/screen/endpoint, describe what it does and why it matters for validation,
> cite `file:line` — and only then the table/content. A bare table or generic boilerplate fails
> review (CONVENTIONS § Authoring rigor #8).

Shared front-matter, then:

```
## Objectives                — what this FS establishes: how the system meets the URS (one paragraph).
## Scope                     — the behaviour/design this document specifies, and what it omits.
## Assumptions               — conditions taken as true for these specs to hold.
## Exclusions                — design deliberately out of scope here (and where it is covered).
## Acronyms and Definitions     | Term | Meaning |
## References                — governing standards + the URS (03) and Part 11 (10) docs this traces to.

## 3.1 Software and Stack       | Layer | Technology | Version (declared) | Source |
## 3.2 Software Architecture    | Area | Path | Role |   (+ a store/adapter table if relevant)
## 3.3 Design Principles        | Principle | How it is realised | Source |
## 3.4 Security — Current State  | Control | Current state | Source / evidence |

## 4.1 Data Dictionary          — ONE table per persisted entity: | Column | Type | Notes |
                                  (columns verbatim from the schema), covering every entity,
                                  PLUS a relationships table: | From → To | Column | On delete | Effect | Source |
## 4.2 API Specification        — endpoint inventory grouped per controller:
                                  | Method | Path | Line | Purpose | URS |   then prose on
                                  request/response/behaviour per group, and reconcile the count
                                  ("N validated of M handlers").

<<< Behaviour subsystems — one concrete flat `##` each (mirror the reference pack): >>>
## Trigger and observation              — how the main flow starts and is observed
## Pipeline stages                       | # | Stage label | Progress | Source |  (if the app has a pipeline)
## Content generation: <engine>          — LLM/deterministic/fallback path, with file:line
## <source grounding / known limitation>  — what inputs the logic trusts and any limitation (cite file:line).
## <validation / compliance gate>          — the rule that blocks/permits an action; quote it with file:line.
## Approval-gate predicate (`file:line`) — **quote the predicate verbatim** in a code block
## Edit log                              — where/whether edits are recorded; cite file:line or mark absent → DEV.
## Section / record versioning           — how record versions are tracked (or the gap → DEV).
## Composed audit trail                  — how the audit view is assembled from its sources (or its absence → DEV).
   (Keep only the subsystems THIS app actually has; name each concretely.)

## Planned design     | FS_ID | Capability | Design intent | Deviation |   (a sketch per Planned item)
## FS register        | FS_ID | Description | URS | Status | Source file:line | TC |
```

## Rules

- Obey **CONVENTIONS § Authoring rigor**: real counts reconciled; decision logic quoted verbatim, not
  paraphrased; every table beside prose. Every `URS-NNN` has ≥1 `FS-NNN`; Implemented FS cite
  `file:line`; Planned FS are marked and routed to a deviation. Append each `FS-NNN` to `../RTM.csv`.

## Output

The document is a **self-contained HTML fragment** at `../src/05-functional-design-specs.html` (CONVENTIONS § HTML format) — no `<html>/<head>/<body>/<style>`. Do **not** render or convert it; `build.sh` wraps it with the shared print stylesheet and assembles `spec/summary/User Requirements Specification.html`, which you print to PDF from any browser.

## Done when

Data dictionary covers every entity (+ relationships); the API inventory is per-controller with a
`Line` column + count reconciliation; the pipeline/gate/audit subsystems each have a concrete section
with verbatim predicates; the Planned-design and FS-register tables are present; the HTML is authored per CONVENTIONS § HTML format.

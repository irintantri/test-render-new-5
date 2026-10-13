# Prompt — Document 07: Test Strategy & Scripts (IQ / OQ / PQ)

> **Agent instruction.** Read `../CONVENTIONS.md` (esp. § Test-status nuance) and `../PROVENANCE.md`
> first. Produce **exactly one** file: `../src/07-test-strategy-and-scripts.html`, append every `TC-` id
> to `../RTM.csv`.

## Objective

Define the test approach and the executable scripts that prove the requirements: IQ (install/config),
OQ (functional + Part 11 controls + negative/boundary), PQ (real-user end-to-end).

## Skeleton — author these sections in order, all as flat `##` headings

> **For EVERY section below:** first write **2–4 sentences explaining what it is for THIS canvas/app**
> — name the real feature/screen/endpoint, describe what it does and why it matters for validation,
> cite `file:line` — and only then the table/content. A bare table or generic boilerplate fails
> review (CONVENTIONS § Authoring rigor #8).

Shared front-matter, then:

```
## Objectives                — what this test plan proves and how it is structured (one paragraph).
## Scope                     — which requirements/functions are tested here, and what is out of scope.
## Assumptions               — environment/state taken as true before execution.
## Exclusions                — testing deliberately not done here (and where it is covered).
## Acronyms and Definitions   | Term | Meaning |
## References                — governing standards + the URS (03)/FS (05) the cases trace to.

## Responsibilities          | Role | Responsibility in testing |   (Validation Lead, Tester, QA, System Owner)
## Pre-execution approval     | Role | Name | Signature | Date |   (scripts approved before any run)

## General                   — test strategy: risk-based depth, IQ/OQ/PQ split.
## Documentation             — the records that must exist before/around execution (protocol, scripts, approvals).
## Equipment / Materials      — the environment, tools, and test data needed to run the scripts.
## Status legend             — `Ready (citation-based)` · `Partial` · `Deferred (Planned; never Pass)`.

<<< One `##` block PER test case, titled "## TC-IQ-001 — <concrete title>": >>>
For each: an Objective sentence; a meta line `URS: URS-NNN | Status: <legend> | Evidence: EV-NNN`;
Preconditions; Acceptance criteria; then TWO tables —
   | Step | Procedure | Expected result |              (exact method+path+body; verbatim status/body/error string)
   | Step | Actual result | Pass / Fail | Performed by | Date |   (left BLANK for the witnessed run)
and a final `Code basis: file.ext:LINE` line.

Cover: ≥2 IQ (build+health, config baseline); OQ = one per implemented function + its negative/boundary
case + each Part 11 control; ≥1 PQ end-to-end. Low-risk OQ cases MAY go in:
## Additional OQ cases (compact register)   | TC | Procedure | Expected result | URS | Code |

## Deferred / Planned test stubs   | TC | Target to-be | Confirmed absence | Deviation |
## Test inventory and coverage     — reconcile RTM count (IQ/OQ/PQ) vs readiness (Ready/Partial/Deferred).
## Post-execution approval         — execution-summary table + post-exec signatures.
```

## Rules

- **Never** a bare "Pass" without a witnessed, signed execution — implemented+cited+un-run is
  `Ready (citation-based)` (CONVENTIONS § Test-status nuance). Every Implemented URS has ≥1 `Ready`
  test; every Planned URS a `Deferred` stub. Every `TC-` id resolves in `../RTM.csv`. Obey
  **CONVENTIONS § Authoring rigor** and **§ Markdown format**.

## Output

The document is a **self-contained HTML fragment** at `../src/07-test-strategy-and-scripts.html` (CONVENTIONS § HTML format) — no `<html>/<head>/<body>/<style>`. Do **not** render or convert it; `build.sh` wraps it with the shared print stylesheet and assembles `spec/summary/User Requirements Specification.html`, which you print to PDF from any browser.

## Done when

Each Implemented URS has a `Ready` per-step TC (Procedure table + blank Execution-record table); each
Planned URS a `Deferred` stub; Pre/Post-execution approval and the coverage reconciliation present;
the HTML is authored per CONVENTIONS § HTML format.

# Prompt — Document 10: Part 11 Controls

> **Agent instruction.** Read `../CONVENTIONS.md` and `../PROVENANCE.md` first. Produce **exactly one**
> file: `../src/10-part11-controls.html`.

## Objective

Assess the built app **clause-by-clause** against 21 CFR Part 11. Each clause gets a state —
**Met / Partial / Planned / N/A** — with evidence (`file:line`) or a gap routed to a deviation.

## Skeleton — author these sections in order, all as flat `##` headings

> **For EVERY section below:** first write **2–4 sentences explaining what it is for THIS canvas/app**
> — name the real feature/screen/endpoint, describe what it does and why it matters for validation,
> cite `file:line` — and only then the table/content. A bare table or generic boilerplate fails
> review (CONVENTIONS § Authoring rigor #8).

Shared front-matter, then:

```
## Acronyms and Definitions   | Term | Meaning |
## References                — 21 CFR Part 11 (subparts B/C) and the URS (03)/FS (05) evidence sources.

## Applicability determination — which records are in scope (§11.1); closed/open system
   (§11.3(b)(4)); electronic-signature scope (§11.3(b)(7)). State which clauses this makes
   Planned/N/A *by determination*. Prose, grounded in what the app actually stores/signs.

## Subpart B clause analysis — every §11.10(a)–(k) + §11.30 clause with a state and evidence or gap.
   | Clause | Requirement | State | Evidence (file:line) or gap → DEV |
   Enumerate **§11.10(a)–(k) + §11.30** (every clause, none omitted). Then per-clause prose
   justifying each state — `Met` needs a resolvable file:line; `Partial` carries a file:line AND the
   missing attribute; `Planned` carries the gap → DEV.

## Subpart C — Electronic Signatures
   | Clause | Requirement | State | Gap → DEV |
   Enumerate **§11.50, §11.70, §11.100, §11.200, §11.300**, then prose.

## Summary                   — the verdict distribution across clauses, reconciled to a total.
   | Verdict | Count | Clauses |          (Met / Partial / Planned / N/A)
   Then an explicit total that reconciles (11 §11.10 + §11.30 + 5 Subpart C = 17), and a roll-up:
   | Deviation | Closes (clauses) |

## Remediation / CAPA Plan   — the corrective/preventive actions that close each gap, by deviation.
   | Clause(s) | Gap | Corrective / preventive action | Deviation | Release |
   Close with an effectiveness check and a one-paragraph **honest posture** statement.
```

## Rules

- Obey **CONVENTIONS § Authoring rigor**. `Met` only with a resolvable `file:line`; every Partial/
  Planned gap routes to a named `DEV-xxx` and rolls up in the Summary. Every applicable clause
  appears. **Never imply compliance the evidence does not support** — state the posture plainly.

## Output

The document is a **self-contained HTML fragment** at `../src/10-part11-controls.html` (CONVENTIONS § HTML format) — no `<html>/<head>/<body>/<style>`. Do **not** render or convert it; `build.sh` wraps it with the shared print stylesheet and assembles `spec/summary/User Requirements Specification.html`, which you print to PDF from any browser.

## Done when

Every clause (§11.10(a)–(k), §11.30, §11.50/70/100/200/300) has a state + evidence or `→ DEV`; the
Applicability determination, verdict-distribution + total reconciliation, and CAPA plan are present;
the HTML is authored per CONVENTIONS § HTML format.

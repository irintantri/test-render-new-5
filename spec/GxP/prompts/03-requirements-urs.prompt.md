# Prompt — Document 03: Requirements / URS

> **Agent instruction.** Read `../CONVENTIONS.md` and `../PROVENANCE.md` first. Produce **exactly one**
> file: `../src/03-requirements-urs.html`, append every `URS-NNN` to `../RTM.csv` (CONVENTIONS § HTML format).

## Objective

Capture every user / business / compliance / security / data / workflow requirement of the built app
as an atomic, testable `URS-NNN` row, each paired with prose explaining why its status holds. This
document introduces the `URS-` ids the rest of the pack traces.

## Skeleton — author these sections in order, all as flat `##` headings

> **For EVERY section below:** first write **2–4 sentences explaining what it is for THIS canvas/app**
> — name the real feature/screen/endpoint, describe what it does and why it matters for validation,
> cite `file:line` — and only then the table/content. A bare table or generic boilerplate fails
> review (CONVENTIONS § Authoring rigor #8).

Shared front-matter, then:

```
## Objectives                — what this URS establishes and the problem it addresses (one paragraph).
## Scope                     — the part of the system whose requirements this captures, and what it omits.
## Assumptions               — conditions taken as true for these requirements to hold.
## Exclusions                — requirements deliberately out of scope here (and where they live instead).
## Acronyms and Definitions       | Term | Meaning |   (≥8 rows)
## References                — governing standards (21 CFR Part 11, GAMP 5, FDA CSA) + sibling pack docs.

<<< SYSTEM DESCRIPTION — one flat `##` per part (mirror the reference pack): >>>
## Software            — language/framework/stack, with file:line
## Platform            — runtime, store(s), config
## System Hardware     — deployment surface (or "n/a — single service")
## Security Description — what guards access today; cite file:line; name the gaps

## System interfaces   | # | Screen / Interface | Backing endpoint(s) (file:line) | Serves URS |
   …then one short `##` sub-narrative per screen if the app has several.

<<< REGULATORY REQUIREMENTS — keep the OFNI 5.x numbering in the heading text: >>>
## 5.1 Controls for Closed Systems — 21 CFR 11 §11.10
   | §11.10 clause | Control | URS | Status |   (enumerate (a)–(k)), then per-clause prose.
## 5.2 E-Signature Manifestations — §11.50 / §11.70   — signature record/linkage rules; mark Planned/N/A if the app has no e-signatures.
## 5.3 User Password / Access Controls   — how passwords and access are enforced today; cite file:line; name the gaps.
## 5.4 Additional System Controls      | Requirement | URS | Status |
## 5.5 User-Level Security   — per-user identity and role enforcement; mark Planned if access is shared or absent.

## 6.1 Procedural Regulatory Requirements   — SOP/procedural duties met outside code (training, review, change control).
## 6.2 Organisational Requirements   — roles, responsibilities, and governance the operating organisation provides.

## Domain content requirements   — only if the app produces regulated content (e.g. an ICF). 
   | Required element | App section (verbatim, file:line) | Status |   (incl. a Planned row for anything missing)

## Requirements register     — the master table of every URS as an atomic, traced `shall` statement.
   | URS_ID | Requirement (shall) | Priority | Status | Regulatory ref | FS | Source file:line |
   - Atomic **shall** statements; group by functional area; expect **~20–30 rows**.
   - `Implemented` rows cite file:line; `Partial`/`Planned` rows append the gap (`… → DEV-00x`).
   - Close with a summary line: "N requirements — X Implemented, Y Partial, Z Planned" reconciled to RTM.csv.
```

## Rules

- Obey **CONVENTIONS § Authoring rigor** and **§ Markdown format**. Every table sits beside prose
  explaining *why* each status holds — tables alone fail review. Every `URS-NNN` resolves in
  `../RTM.csv` with an `FS_ID`. No overclaim.

## Output

The document is a **self-contained HTML fragment** at `../src/03-requirements-urs.html` (CONVENTIONS § HTML format) — no `<html>/<head>/<body>/<style>`. Do **not** render or convert it; `build.sh` wraps it with the shared print stylesheet and assembles `spec/summary/User Requirements Specification.html`, which you print to PDF from any browser.

## Done when

Every URS is atomic, testable, status-tagged with rationale, has an `FS_ID` and an RTM row; the §11.10
clause table and the register (with summary line) are present; the HTML is authored per CONVENTIONS § HTML format.

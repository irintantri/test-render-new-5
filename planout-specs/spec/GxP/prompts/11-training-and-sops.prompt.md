# Prompt — Document 11: Training / SOPs

> **Agent instruction.** Read `../CONVENTIONS.md` and `../PROVENANCE.md` first. Produce **exactly one**
> file: `../src/11-training-and-sops.html`.

## Objective

Provide the operating procedures and training record so a user can run the validated workflow of the
built app. Every SOP step maps to a specific screen, names the exact endpoint(s), states the control
enforced, and flags any not-yet-available gap.

## Skeleton — author these sections in order, all as flat `##` headings

> **For EVERY section below:** first write **2–4 sentences explaining what it is for THIS canvas/app**
> — name the real feature/screen/endpoint, describe what it does and why it matters for validation,
> cite `file:line` — and only then the table/content. A bare table or generic boilerplate fails
> review (CONVENTIONS § Authoring rigor #8).

Shared front-matter, then:

```
## Objectives             — what these SOPs and the training record establish (one paragraph).
## Scope                  — in/out; include | Not-yet-available capability | Status | Deviation |
## Purpose                — tie the SOPs to the URS / FS / risk docs.
## Rules                  — a numbered list (~8–12), each citing the enforcing file:line/endpoint
                            or the not-yet-available gap it guards.
## Acronyms and Definitions   | Term | Meaning |   (app terms cite file:line/endpoint)
## System documents       | Document / record | Where it lives (table/endpoint) | Owner |

<<< Responsibilities — one concrete `##` per role (duty bullets w/ endpoints + SOP-step refs): >>>
## <Author role>           — who creates/edits records; their screens, endpoints, and SOP steps.
## <Reviewer role>         — who reviews/comments; what they can and cannot approve.
## <QA role>               — who owns approval/quality gates and deviations.
## <Administrator role>    — who installs, configures, seeds, and operates the system.

<<< SOPs — one `##` each; number steps stably so docs 06/07 can cite them: >>>
## SOP-01 — <Author a record>
## SOP-02 — <Review and approve>
## SOP-03 — <Administration and operations>   (sub-steps: install & health, environment
            | Variable | Default | Effect |, seeding, credential rotation, backup, logs/hardening)
   For EACH step emit a detail table + a numbered procedure:
   | Field | Detail |   with rows incl. "Screen", "Endpoint(s)", "Control at this step",
                        "Authentication", "Not yet available" — then the concrete clicks, each naming
                        the endpoint/action and its recorded effect. Never document a Planned
                        capability as a live procedure; flag it (with its deviation).

## Training content by role      — the topics each role must be trained on before operating the system.
## Training matrix (role × SOP)   | Role | SOP-01 | SOP-02 | SOP-03 |   (Required / Awareness / Not-required + legend)
## Acknowledgement form           | Name | Role(s) | SOP(s) trained | App version/date | Trainer |
                                    Attestation (incl. not-yet-available controls) | Trainee signature | Date | QA acceptance |
```

## Rules

- Each SOP step matches an **as-built** screen/action and cites endpoints/`file:line` so it doubles as
  a test anchor. Obey **CONVENTIONS § Authoring rigor** and **§ Markdown format** (flat concrete
  headings, tables beside prose, no overclaim).

## Output

The document is a **self-contained HTML fragment** at `../src/11-training-and-sops.html` (CONVENTIONS § HTML format) — no `<html>/<head>/<body>/<style>`. Do **not** render or convert it; `build.sh` wraps it with the shared print stylesheet and assembles `spec/summary/User Requirements Specification.html`, which you print to PDF from any browser.

## Done when

Each in-scope role has a duty section + an acknowledgement entry; every SOP step has the detail table
(Screen/Endpoint/Control/Not-yet-available) + numbered procedure; the matrix and full acknowledgement
form are present; the HTML is authored per CONVENTIONS § HTML format.

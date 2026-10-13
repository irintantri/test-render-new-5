# Provenance — Where Each Document's Structure Comes From

A GxP pack is trusted because its **format is not invented** — each document's structure maps to a
recognised governing reference, and any system-specific section is flagged so nothing is silently
fabricated.

## The one-to-one rule

1. Every section maps to a **governing reference** section. Tag each authored section with a
   `← source` note naming the reference (the prompts list the expected tags).
2. A genuinely system-specific section (the app's record list, data model, roadmap) carries
   **`★ SYNTHESIZED`** + a one-line justification. `★ SYNTHESIZED` means "no direct reference —
   app-specific or engagement-required", never "invented for convenience".
3. If an authored structure diverges from its governing reference, the reference governs.

## Shared front-matter family — OFNI FastVal

Cover/control, signatures, revision history, and TOC follow the OFNI FastVal sample skeleton
(Cover → Signatures → Revision History → §1 Introduction → §2 Acronyms & References). `§3` onward is
document-type specific. `CONVENTIONS.md` § Shared front-matter encodes it.

## OFNI structural families (used by 01, 03, 05, 07)

- **Specification family** (URS / Functional / Design): §1 Introduction · §2 Acronyms & References ·
  §3 System Description · §4 System Interfaces · §5 Regulatory Requirements · §6 Additional
  Requirements.
- **Plan / Protocol family** (IQ/OQ/PQ): §1 Introduction · §2 Acronyms & References ·
  §3 Responsibilities · §4 System Description · §5 [Strategy or Procedure Test Plan] · §6 [Tests].

## Governing reference per in-scope document

| # | Document | Governing reference(s) for format |
|---|---|---|
| 01 | Intended Use & Scope | OFNI front matter + VMP §1 (Purpose/Scope) + OFNI Spec §3 (System Description) |
| 03 | Requirements / URS | OFNI URS (Specification family) + 21 CFR 50.25 (domain content, if clinical) |
| 05 | Functional / Design Specs | OFNI Functional Requirements + Design Specification (Spec family) |
| 07 | Test Strategy & Scripts | OFNI IQ + OQ + PQ (Protocol family) |
| 10 | Part 11 Controls | SimplerQMS Part 11 checklist + 21 CFR Part 11 (clause enumeration) |
| 11 | Training / SOPs | NNUH SOP (one-to-one) |

## References

Cite standards by name; a local PDF library is optional. Relevant standards for a regulated software
release: 21 CFR Part 11; 21 CFR 50.25 (+ §50.25(c) Q&A) for informed-consent content; FDA CSA; FDA
GPSV; FDA/OHRP eConsent Q&A; ICH E6(R3); WHO TRS1019 Annex 3; GAMP 5 (by name — copyrighted).
Structural example documents: the OFNI FastVal sample set, VMP examples, CT-DSS RTM, PQRI FMEA guide,
SimplerQMS Part 11 checklists, NNUH SOP. Each in-scope document cites **≥1 structural example + ≥1
regulatory/guidance basis**; if a cited reference is unavailable, note it inline rather than dropping
the citation.

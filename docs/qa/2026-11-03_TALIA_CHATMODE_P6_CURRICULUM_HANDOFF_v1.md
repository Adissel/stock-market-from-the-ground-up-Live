# Talia Tutor — Chat Mode Package 6: Canonical Curriculum Handoff Contract

| Control | Record |
|---|---|
| Company / project | Cyber Nexus Publishing / Crown & Lantern Press — The Stock Market: From the Ground Up |
| Document ID | SMFGU-TALIA-CHAT-P6-CURRICULUM-001 |
| Version / date | 1.0 / 2026-11-03 |
| Filename / type | `docs/qa/2026-11-03_TALIA_CHATMODE_P6_CURRICULUM_HANDOFF_v1.md` / Markdown |
| Machine file | `data/talia-chat-mode-p6-curriculum-handoff-v1.json` / JSON |
| GitHub / Google Drive | `Adissel/stock-market-from-the-ground-up-Live` / main; Drive not created / ID unassigned |
| Status | Chat Mode contract complete; real 419-Lab/274-day member acceptance OPEN |
| Dependencies | Existing 419 Lab registry, Academy v0.14.0.168, Tutor Academy context resolver, Lab v3.2, Learning v3.3, authenticated member entitlements |

## Scope and validated invariants

**419 distinct canonical Lab IDs**, **30 distinct official competencies**, **274 Boot Camp day positions across ten registered programs**, plus **five separate Free Foundations days**. None of these counts establishes independently approved grading, completed individual student journeys or professional source-rights acceptance.

| Boot Camp program | Registered days | Disposition |
|---|---:|---|
| `truth5` | 5 | CURRENT_EXISTING_UNGRADED_SOURCE |
| `watchlist7` | 7 | CURRENT_EXISTING_UNGRADED_SOURCE |
| `scanners10` | 10 | CURRENT_EXISTING_UNGRADED_SOURCE |
| `foundations30` | 30 | CURRENT_ORIGINAL_APPROVED_DAY_SOURCE |
| `charts45` | 45 | INDEPENDENT_INSTRUCTION_ACCEPTANCE_OPEN |
| `risk60` | 60 | INDEPENDENT_INSTRUCTION_ACCEPTANCE_OPEN |
| `practicum90` | 90 | INDEPENDENT_INSTRUCTION_ACCEPTANCE_OPEN |
| `tape10` | 10 | DRAFT_BETA_FLAG_REQUIRED |
| `indicators10` | 10 | DRAFT_BETA_FLAG_REQUIRED |
| `filings7` | 7 | DRAFT_BETA_FLAG_REQUIRED |
| **Total Boot Camp positions** | **274** | Source registry, not a release metric |

Free `free5` is a separate member-authorized Foundation course and is not double-counted as a Boot Camp.

## Server-owned handoff contract

- Client requests a **canonical Lab ID or program code and day**, one of nine approved stages, and a bounded question. The server verifies authenticated member identity, entitlement, registered curriculum, live/controlled-beta course flag and requested stage.
- Server resolves titles, public competency identifiers, source version, authorized return link and only authorized historical cutoff. Client-provided title, proof of completion, role, premium tier or alleged grades are never trusted.
- The existing Academy context resolver's `prerequisiteStatus='sequence_reference_only_not_completion_verified'`, `progressVerified=false`, `officiallyGraded=false`, `masteryAwarded=false` are controlling and **must not be presented as achieved member progress**.
- `Assess`: only generic study-process guidance and uncertainty; no protected grading key, exact answer, unrevealed event, private rubric or unauthorized case-specific correction. Other stages allow only entitled formative teaching; official grade writes remain exclusively within protected learning infrastructure.
- A missing course/day, disabled beta, revoked entitlement, identity switch or future event must fail closed; do not introduce a second learning engine, private history store, simulator, or fee.

## Required test suite

All 419 Lab IDs and 274 day keys remain stable; each server-derived context has a canonical route and public skill mapping. Test malformed IDs, denied draft-course access, unauthorized cross-member conversation IDs, stage Assess leakage, stale source, no-lookahead and no-progress-write boundaries. Signoff requires genuine Free/Founder and two-account browser tests plus independent source/editorial QA.

## Revision history
| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-03 | Frozen original ID-preserving curricular Tutor handoff across 419 Labs, 274 days, 30 competencies and nine stages; separate five Free lessons |

Footer: SMFGU-TALIA-CHAT-P6-CURRICULUM-001 · v1.0 · Unreleased integrations remain held.

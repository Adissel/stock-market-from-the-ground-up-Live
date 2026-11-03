# Talia — Immutable Source-Register and Editorial Closeout Integration

| Control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-TALIA-QA-031 |
| Filename/type | docs/qa/2026-11-03_TALIA_QA_MAIN_SOURCE_CROSSWALK_v1.md / Markdown |
| Google Drive location / ID | Not created / unassigned |
| Date/version | 2026-11-03 / 1.0 |
| Status | Internal QA and educational correction; main release HOLD |
| Dependencies | Main source releases B21–22, B25–28 and B10, Batch 06 dividend revision; market Tutor CI |
| Purpose | Keep immutable historical source decisions while accepting newly scoped citations from main without replacing authoritative content files |

Main already contains current topic-specific citations for Batches 06, 10, 21–22 and 25–28. Do not overwrite their independently merged research or lesson source pointers. This integration reconciles legacy P2 claim-source tests against the original documented source URL (`previousGenericSourceUrl`) when the live lesson has a newer source; each exception requires an HTTPS replacement, appropriate claim-scope notes and false independent math, rights and publication approvals. The old registers remain historical source evidence.

The Batch 26 legacy expectation of an outstanding EDGAR index citation is corrected to assert that its generic pointers are removed, with the previous Batch 10 generic citations retained for audit. The two Batch 10 common-error explanations now correctly warn against mixing adjusted historical charts with unadjusted fills and applying announced splits before effective time. No numeric examples, protected answers, member progress or grading entitlement is modified.

A new 600-lesson source-pattern test verifies zero remaining known broad generic indices and 600 independent publication holds. This is a known-pattern and structural audit, **not** source URL availability verification, full claim-level editorial acceptance or market-data licensing clearance. The previous overlapping PR #14 is superseded and should not be merged. Exact-commit CI and matching production release remain required.

Revision history: v1.0 — 2026-11-03 — Main-compatible source-crosswalk CI and two educational wording corrections.
Footer: SMFGU-TALIA-QA-031 · 2026-11-03 · Internal QA · Publication HOLD.

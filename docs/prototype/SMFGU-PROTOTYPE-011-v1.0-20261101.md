# SMFGU-PROTOTYPE-011 — Integrated Prototype and Chart Pan Correction
**Document ID:** SMFGU-PROTOTYPE-011
**Project:** The Stock Market: From the Ground Up / Prototype Center
**Filename:** docs/prototype/SMFGU-PROTOTYPE-011-v1.0-20261101.md
**File type:** Markdown (.md)
**Version:** 1.0
**Date:** 2026-11-01
**Status:** Source implemented; exact-SHA CI/deployment evidence pending
**Google Drive location / document ID:** Unassigned / none
**Branch:** main
**Purpose:** Correct drag panning, improve data graphics, align teaching prototype and show integrated product capabilities.
**Dependencies:** AGENTS.md; React/TypeScript build; Apache ECharts 6.1; protected Prototype Center; 419 canonical Labs; nine authoritative learning stages.
**New file required:** Yes.
## Implementation
- Remove native HTML5 drag from the entire chart panel. Reordering begins on a dedicated handle.
- Pointer capture: drag chart only while primary button is pressed; pointerup, pointercancel and lostpointercapture end panning.
- Stronger up/down candle edges, volume columns, heatmap palette, equity/radar graphics and terminal styling.
- Ten visible teaching steps with Calculate as separate ungraded display while keeping nine saved stage IDs.
- Interactive eight-section product experience preview in all three protected pages. No real orders, member records, protected grading, Lumen debits or LIVE payment changes.
- 61 researched indicator guides are distinct from 15 prototype calculations.
## Verification
Browser test adds pointer-release, native-drag isolation, ten-step display and eight-product navigation assertions. Passing source CI is not proof of paid-member, accessibility or human visual acceptance.
**Rollback:** Revert the source commit on main; no SQL migration.
## Revision history
| Version | Date | Status |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Implemented in source; CI pending |

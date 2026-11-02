# Academy and Learning — 20 Live Database Integrity Assertions

**Document ID:** SMFGU-ACADEMY-DB-QA-020-20261102  
**Company / imprint:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up — Academy, Labs and Historical Replay  
**Version:** 1.0  
**Prepared and reviewed:** November 2, 2026  
**Status:** 20/20 narrow read-only assertions PASSED; authenticated cross-account, protected grading, release CI and member acceptance remain OPEN  
**Filename / type:** `2026-11-02_ACADEMY_20_LIVE_INTEGRITY_ASSERTIONS_V1.md` / Markdown  
**GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/qa/` (`main`)  
**Google Drive location / ID:** Not created / unassigned. GitHub is the authoritative execution record.  
**Purpose:** Preserve twenty *independently executed* production PostgreSQL metadata/data-integrity checks with no production mutation, without inflating Academy's fixed acceptance register.  
**Dependencies:** Supabase project `oxihglyfgzywsupnyicb`; the fixed 380-unit Academy acceptance ledger; frozen canonical Lab and course identities; RLS ownership policy; source/data rights review; exact-commit CI and Cloudflare release evidence.  
**New file required:** Yes; independent batch distinct from the existing twenty RLS/privilege metadata checks.

## Execution results

Exactly twenty individually targeted read-only SQL assertions were run through the connected Supabase production project. A01–A10 checked each named existing table's `pg_class.relrowsecurity` flag. A11–A20 independently counted violations in specific Academy/replay data integrity invariants. Each returned **PASS**; for the second group every violation count was **0**. No permissions or records were changed.

| Test | Individually tested property | Observed |
| --- | --- | --- |
| A01 | Academy enrollments table has RLS enabled | PASS |
| A02 | Academy progress table has RLS enabled | PASS |
| A03 | Academy stage checkpoint table has RLS enabled | PASS |
| A04 | Academy protected case metadata table has RLS enabled | PASS |
| A05 | Academy audit table has RLS enabled | PASS |
| A06 | Lab instruction table has RLS enabled | PASS |
| A07 | Lab attempts table has RLS enabled | PASS |
| A08 | Lab progress table has RLS enabled | PASS |
| A09 | Market dataset table has RLS enabled | PASS |
| A10 | Replay bars table has RLS enabled | PASS |
| A11 | No duplicate Academy `(user_id,program_code)` enrollments | 0 violations |
| A12 | No duplicate Academy `(user_id,program_code,day_number)` progress rows | 0 violations |
| A13 | No duplicate Academy `(user_id,program_code,day_number)` stage checkpoints | 0 violations |
| A14 | No duplicate protected `(program_code,day_number,variant)` case records | 0 violations |
| A15 | No protected case with null/blank program or case identity | 0 violations |
| A16 | No protected case with null/impossible day outside 1–365 | 0 violations |
| A17 | No Academy progress row with null/negative revision | 0 violations |
| A18 | No Academy checkpoint row with null/negative revision | 0 violations |
| A19 | No replay bar with inconsistent OHLC, null OHLC or negative volume | 0 violations |
| A20 | No published market dataset missing basic source attribution or license note | 0 violations |

**Scope and limitations:** Passing A01–A10 proves *enabled RLS*, not that each table's actual policy denies anonymous/cross-member access. A11–A20 prove only the listed zero-violation conditions at query time; they do not establish protected-answer fairness, licensed data redistribution, historical correctness, real browser persistence, server authorization, or accessibility. In A20, license-note presence does **not** prove a valid redistribution license. Some tests can pass when no rows are present.

**Acceptance impact:** The prior fixed Academy register remains **93/380 (24.47%) accepted; 287 open** until independently substantiated instructional release criteria pass. Recent Risk60 Days 25–44 source authoring does not add units to that numerator. This security/integrity batch is **20/20 (100%) of its own limited scope only**.

**Unresolved technical gates:** Exact-current-SHA source and Chromium CI; successful exact/descendant production deployment; authenticated two-member denial and persistence on changed Academy surfaces; 54 protected grading case decisions; six genuine full invited-member journeys; data rights and independent review.

**Revision history:** v1.0 — November 2, 2026 — recorded executed A01–A20 live SELECT assertions, their zero-violation results, limitations and unreleased acceptance boundary.

**Footer:** Crown & Lantern Press · SMFGU-ACADEMY-DB-QA-020-20261102 · v1.0 · Read-only technical evidence · Not final release certification.

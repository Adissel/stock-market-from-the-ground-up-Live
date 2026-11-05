# Knowledge Database P25 — Numerical Review Packet 01

**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-KDB-P25-NUMERIC-REVIEW-PACK01-20261104  
**Version:** 1.0 | **Status:** DRAFT — NOT PUBLISHED / NOT INDEPENDENTLY APPROVED  
**Date:** 2026-11-04 (America/Chicago)  
**Google Drive location:** Not assigned. **Drive document ID:** None.  
**Repository location:** `data/knowledge/kdb-priority25-numeric-review-pack01-v1.json`  
**Dependencies:** P0 #106, quality backlog #107, claim ledger PR #112, curriculum crosswalk PR #118  
**Purpose:** Original, mathematically testable teaching insertions for five of the 25 priority Knowledge articles.

## Scope

The five records are `P25-01` (SMA), `P25-02` (trade VWAP), `P25-03` (trade VWAP vs HLC3 proxy), `P25-04` (EMA initialization), and `P25-05` (Bollinger bands). Each includes formula inputs, an independently recomputable fictional worked example, an incorrect-convention counterexample, accessible text visualization, five instructional tabs, the exact reference page and relevant section.

## Acceptance criteria

1. Run `node --test tests/test_kdb_priority25_numeric_review_pack01_v1.mjs`. Six automated test cases include five independent arithmetic derivations and one evidence/review-state control. Retain failure evidence instead of overriding assertions.
2. Confirm the article's live version and signed-in entitlement before any Owner-directed replacement of sections. Preserve existing published content and revision history using the approved authoring workflow.
3. Each substantive claim needs claim-span-to-authoritative-URL mapping, reviewer identity, date, source snapshot/version, independent decision, and rights classification. The method URLs in this packet do **not** establish reuse permission, legal review or independent editorial acceptance.
4. Preserve all existing member entitlements, progress, Talia lesson IDs and protected grades; no live data redistribution and no new engine.
5. Require approved source-controlled manuscript, true Owner/Admin preview, two-account privacy, keyboard/mobile accessibility, all exact-SHA CI jobs green and Cloudflare production matching that SHA before declaring published upgrades.

## Release decision

**HOLD.** The packet increases prepared technical depth but represents **0 of 5 live article upgrades** and **0 independent approvals**. The other 20 priority candidates remain for staged review.

## Revision history

| Version | Date | Change | Decision |
|---|---|---|---|
| 1.0 | 2026-11-04 | Created five source-grounded fictional indicator cases and math regressions | Draft only |

**Footer:** Crownlight | Knowledge Quality | Internal editorial evidence | Do not represent as investment advice or cleared third-party content.

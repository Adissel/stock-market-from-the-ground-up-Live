# SMA Example Clarification — Controlled Owner Editorial Correction

Document ID: SMFGU-KDB-SMA-CASE-001
Project: THE STOCK MARKET: FROM THE GROUND UP — Knowledge Database
File type: Markdown; SQL and test source in GitHub
Filename: docs/qa/SMFGU-KDB-SMA-CASE-001-20261104.md
Version: 1.0
Status: Owner-directed instructional correction; independent financial, legal and licensing review still open
Date: 2026-11-04
Google Drive location/document ID: Not created / unassigned
Dependencies: gu_knowledge_mutate_v1, gu_knowledge_complete_article_v2, article research-study-sma v9
Purpose: Remove misleading change-of-input in the three-bar SMA case without modifying membership or unrelated material
New files: Yes — SQL, controlled memo and deterministic contract test

## Correct original numerical teaching
Initial completed closes: $10, $11 and $12, 3-SMA = $11.
Newly completed fourth bar closes at $13. Subsequent 3-SMA window is $11, $12 and $13, yielding $12. This *is not the answer to the original three-bar prompt* unless the new bar is explicitly supplied and completed.

## Change and evidence
The original instructor explanation included an unstated fourth completed close and referred to a $12 "new" SMA. The correction makes the new fourth completed bar a new scenario. The old provenance wrongly described the already-published article as an unapproved publication; replacement states actual owner publication and retains independent validation disclaimer.
Existing official StockCharts moving averages reference: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential
Source link is topical support; not permission to reuse third-party prose or charts.

## Release
All mutations are transactional via pre-existing Owner RPCs, preserving 3 revision snapshots, stable slug, source list and membership plans. Recheck production body and authoring_state, exact-SHA CI and Cloudflare separately.

Revision history: v1.0 2026-11-04 — Authoring correction plus owner publication-status normalization.
Footer: SMFGU-KDB-SMA-CASE-001 • Member article correction • No independent professional certification.
# Talia Tutor — Chat Mode Package 2, Wave 1: Foundation Editorial Preflight and Review Queue

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Talia Market Tutor |
| Document ID | SMFGU-TALIA-CHAT-P2-EDITORIAL-045-001 |
| GitHub filename/type | `docs/qa/2026-11-03_TALIA_CHATMODE_P2_EDITORIAL_WAVE1_v1.md` / Markdown |
| Google Drive / document ID | Not created / unassigned |
| Repo/location | `Adissel/stock-market-from-the-ground-up-Live` / main / docs/qa |
| Version/date | 1.0 / 2026-11-03 |
| Source baseline commit | `dd0817a39c17f9a788d5c203d952a4de4c971ccc` |
| Purpose | Reuse the existing 45 original internal editorial reviews and owner-accepted 600-draft authoring milestone; prepare bounded independent claim/math/rights review in priority order |
| Status | CHAT MODE PACKAGE 2 WAVE 1 PREPARED — INDEPENDENT PUBLICATION HOLD |

## Existing evidence — do not overwrite

- **600/600 original Foundation drafts** are accepted by the Owner for the authoring target, not independent factual correctness or commercial publication.
- Exactly **45 review items** exist in `data/talia-training-editorial45-v1.json`: 20 from Batch 13, 20 from Batch 14, three from Batch 6, two from Batch 7. This file reports **0 independent final publication approvals** and **0 commercial third-party reuse approvals**.
- The other 555 draft topics do **not** appear in this one named 45-item register. This does not establish that they have no internal review elsewhere; previously authored batch-specific triage and 120-lesson evidence registers must be deduplicated.
- `2` of the 30 owner-accepted batch-source blob snapshots differ at the current audited source commit. A changed blob does not automatically imply changed teaching copy, but claim-level review needs the actual diff before final acceptance. Changed batches: B29, B30.
- Claim, numerical review and rights are **separate external evidence gates**, and a cited publisher URL is not a redistribution license.

## Internal priority queue — not a professional risk rating

| Risk-ranking class | Previously internally reviewed items | Share of this 45-item subset |
|---|---:|---:|
| P0_HIGH | 21 | 46.7% |
| P1_MEDIUM | 15 | 33.3% |
| P2_ROUTINE | 9 | 20.0% |

The risk tags are **deterministic planning heuristics** from the original title, stated teaching objective and risk limitation. They do not assert that the formula, legal requirement or citation is wrong.

### First 20 review-queue items

| Review queue ID | Batch | Original lesson | Priority | Source snapshot |
|---|---|---|---|---|
| TALIA-P2-001 | B13 | Share volume and dollar notional trade volume are different measurements | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-012 | B13 | Split-adjusted and unadjusted prices cannot be mixed in a simple return comparison | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-031 | B14 | Execution time and settlement time describe different stages of a transaction | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-035 | B14 | A pre-halt last price does not determine the price of a later reopening fill | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-036 | B14 | Time-and-sales prints cannot identify the actual beneficial buyer by color | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-040 | B14 | A reported zero-volume interval is not evidence that price never moved in every venue | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-041 | B06 | A share repurchase and a cash dividend distribute value through different mechanisms | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-043 | B06 | A bond's stated maturity and its sensitivity to yield changes are different measurements | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-007 | B13 | Average entry price must weight each partial purchase by its share count | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-008 | B13 | Cash available and purchase price place an arithmetic ceiling on whole-share quantity | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-009 | B13 | Fractional-share quantity is not automatically rounded to a whole share | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-011 | B13 | A reverse split changes share quantity and the comparable price scale | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-013 | B13 | An earlier displayed ask is not a confirmed market-order purchase price | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-014 | B13 | A buy limit places a price boundary without guaranteeing an execution | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-015 | B13 | Multiple partial executions require a weighted average fill price | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-026 | B14 | Sequential percentage changes compound rather than simply adding together | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-028 | B14 | Gross sales proceeds and deposited net proceeds are different amounts | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-032 | B14 | Displayed order-book depth is not evidence that those shares traded | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-034 | B14 | A day-order duration does not establish whether an order executed | P0_HIGH | Unchanged from owner snapshot |
| TALIA-P2-037 | B14 | Historical print reports can arrive later than the underlying execution time | P0_HIGH | Unchanged from owner snapshot |

The complete 45-item original-content queue, source URLs, prior dispositions, risk tags and required reviewer checkpoints is recorded in `data/talia-chat-mode-p2-editorial45-review-queue-v1.json`.

## Required independent reviewer response, per item

1. **Claim:** Record the exact claim being approved, identify its authoritative primary-source passage, distinguish topical references from direct support and record dated exceptions.
2. **Numerical method:** Reproduce original fictional calculations independently; validate units, formulas, rounding, indicator warmup, timing, results and counterexamples.
3. **Scope and suitability:** Explain why a member could misinterpret the result as a guaranteed fill, risk limit, causal prediction, investor recommendation or officially calculated index; revise explanation where necessary.
4. **Rights and provenance:** Check actual third-party terms, embedded copyrights, licensed quotes, data reuse and each distinct reference. A public URL or Owner's prior source-directory approval is not a blanket license.
5. **Disposition:** Capture a genuine review identity, date, specific text/evidence, revision link and independent acceptance decision before changing any `independentEditorialApproved` or publication fields.

## Execution-order handoff

- Continue Package 2 with **de-duplication and risk triage for the remaining 555 topics** using all previous batch-specific source registers. Do not rewrite any of the 600 approved authoring drafts.
- Resolve source drift against current files; keep the original owner authoring acceptance unaltered.
- Research primary claim details and numerical-source variants in prioritised bounded groups. Keep SCTR and official VIX methods under their independent restrictions.
- Prepare reviewer packets for qualified independent editorial and legal/IP/source-rights checks; do not self-attest external acceptance. Codex may later automate exact-source diffs, numerical fixtures, and release evidence capture.

## Revision history

| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-11-03 | Reconciled 45 existing internal reviews, 600 authoring source identity snapshots and risk-ranked next editorial checks | Internal prep only; independent publication HOLD |

**Footer:** SMFGU-TALIA-CHAT-P2-EDITORIAL-045-001 · 2026-11-03 · v1.0 · No entitlement, price, provider, protected grade, or publication authorization.

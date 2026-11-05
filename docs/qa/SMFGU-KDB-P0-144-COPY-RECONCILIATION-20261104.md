# Knowledge Database — P0 Publication Copy Reconciliation (144 Articles)

| Document control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP — Knowledge Database |
| Document ID | SMFGU-KDB-P0-144-20261104 |
| Filename | docs/qa/SMFGU-KDB-P0-144-COPY-RECONCILIATION-20261104.md |
| Type | Markdown (GitHub) |
| Version | 1.0 |
| Effective date | 2026-11-04 |
| Status | Owner-directed textual reconciliation; independent technical/editorial/rights acceptance not established |
| Google Drive | Not created; GitHub is the source record; Drive document ID unassigned |
| Dependencies | Existing authorized Supabase editorial RPC and authoring-completeness gate, linked GitHub P0 issue #106 |
| New files | Source-signature 144-manifest, transactional SQL, this execution-control record |
| Purpose | Correct false notices stating 144 already published articles are unpublished drafts, while preserving all safeguards and revisions |

## Strict change control
Each original article is checked by unique slug and version baseline digest. Four matched phrases in its original provenance paragraph are replaced by accurate Owner-publication language and explicit outstanding source, numerical, member-experience, and rights review warnings. Original title, slug, lesson math, illustrative case, source list, access plans, and sort order are unchanged.

The first technical attempt (direct save of a published text body) was blocked by the mandatory Supabase trigger resetting authoring_state to outline. The corrected script uses **save hidden draft → authoring complete → owner republish**, in a single SQL transaction with 3 versioned revisions per article. A failed article rolls back the whole transaction, rather than partly unpublishing lessons. The script refuses altered source versions.

## Reviewer and rights policy
Owner publication permission is not independent editorial signoff. Publication may proceed as educational content by Owner decision only under the existing authoring rules. No licensed professional audit, external data redistribution permission, fact check of every linked source, or graded/certification permission is represented.

## Acceptance conditions
1. Exactly 144 source rows, unchanged expected signature before execution.
2. Exactly 144 revised provenance paragraphs, all four obsolete statements removed.
3. All 260 records remain published/visible/author-complete, titles/slugs/plan access unchanged.
4. Exactly 432 new article revision snapshots and their owner-audited transitions; one summary batch audit.
5. Independent legal, mathematical, source/rights and external tester acceptance remain open.
6. GitHub exact commit and Cloudflare production parity checked separately.

## Revision history
| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-11-04 | Corrected trigger-compatible transactional owner editorial runbook |

Footer: SMFGU-KDB-P0-144-20261104 · Owner publication ≠ independent review.
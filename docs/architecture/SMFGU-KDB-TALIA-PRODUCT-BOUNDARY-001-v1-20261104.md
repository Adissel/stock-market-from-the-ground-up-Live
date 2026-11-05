# Knowledge Database and Talia Classroom — Product Separation Control

| Document control | Value |
|---|---|
| Company | Cyber Nexus / The Stock Market: From the Ground Up |
| Project | Stock Market from the Ground Up |
| Document ID | SMFGU-KDB-TALIA-PRODUCT-BOUNDARY-001 |
| Version | 1.0 |
| Status | Owner-directed architectural boundary implemented in GitHub; production/browser acceptance pending |
| Effective source date | November 4, 2026 (America/Chicago) |
| Filename | docs/architecture/SMFGU-KDB-TALIA-PRODUCT-BOUNDARY-001-v1-20261104.md |
| File type | Markdown (.md) |
| Google Drive location | Not created; GitHub is the source of record |
| Google Drive document ID | Unassigned |
| New file required | Yes — this boundary control and automated regression test |
| Purpose | Prohibit embedding or coupling the Knowledge Database with Talia Classroom |
| Dependencies | Existing independent membership/Auth and page/API contracts; no new database migration |

## Owner decision (controlling)

The **Knowledge Database** is its own article, research and educational-reference product. It does **not** belong inside **Talia Classroom**. Subject overlap (candlesticks, VWAP, EMA, indicators and market structure) does not imply shared product navigation, publisher roles, member authorization or progress recording.

## Scope and routes

| Product | Routes | Responsibilities |
|---|---|---|
| Knowledge Database | `/knowledge-database.html`, `/knowledge-article.html?slug=...`, `/admin-knowledge.html` | Free reference inventory, article library, independent article search, publication controls, membership-restricted article content and article-local ungraded guided study |
| Talia Classroom | `/talia-classroom.html`, separate staff prototype `/talia-tutor-prototype.html` | Tutor conversations, tiered instructional depth, chart evidence, completed-bar replay, ungraded practice and private Tutor access |

## Runtime boundary and authorization

1. Never mount the Knowledge article directory in Talia Classroom; never load the Knowledge Database article directory scripts or styles on the member Classroom page.
2. Knowledge articles and in-article guided activities are authorized and rendered only by the Knowledge Database's existing APIs and article reader. Their ungraded guided-study features remain part of the Knowledge Database, not a separate Tutor entitlement.
3. Talia Classroom must not require article publication, an article membership response, Knowledge Database metadata or Knowledge content for its own chart-based teaching or acceptance.
4. A learner may navigate between standalone products through ordinary website navigation without embedding, copying or silently sharing a product session. Dedicated member access checks continue for each product.
5. Preserve Knowledge Database records, published/draft states, independent membership policies, article-body permissions and the existing Tutor's replay/assessment restrictions. No data migration, payment or grade modification is authorized by this separation.
6. Historical filenames containing `talia-kdb` or the internal Knowledge article DOM identifier `kal-talia-classroom` remain temporarily for compatibility with deployed content and tests; they do not authorize cross-product embedding. User-facing guided-study labels identify the Knowledge Database.
7. The legacy standalone `assets/js/talia-kdb-directory-v1.js` source is retained only as an inactive historical asset; no Classroom runtime loads it. Deletion or repurposing requires separate dependency review.

## Acceptance

- `tests/kdb-classroom-product-boundary-v1.test.mjs` verifies product markup, runtime separation, API references, independently mounted Knowledge study and removal of the cross-product teaching link.
- Separate Knowledge Database CI and Talia Classroom CI enforce the same architectural boundary; the Pages build also blocks regressions.
- Validate final exact-deployment SHA, accessible navigation, independent member permissions, publication privacy and authenticated browser behavior before marking production acceptance complete.

## Revision history

| Version | Date | Changes | Status |
|---|---|---|---|
| 1.0 | 2026-11-04 | Defines and implements Knowledge Database / Classroom separation and independent QA gates | Source implementation; acceptance open |

# Repository-Wide Acceptance and Quality Audit — Baseline V1

**Document ID:** SMFGU-QA-REPO-001  
**Project:** The Stock Market: From the Ground Up / Website and Learning Platform  
**Owner:** Crown & Lantern Press / Cyber Nexus  
**Filename:** `docs/qa/2026-10-31_REPOSITORY_WIDE_AUDIT_BASELINE_v1.md`  
**File type:** Markdown  
**Version:** 1.0  
**Review date:** October 31, 2026 (America/Chicago)  
**Status:** **AUTOMATED TRACKED-FILE LINE SCAN COMPLETED; HIGH-RISK TRIAGE, MANUAL SEMANTIC REVIEW, LIVE E2E AND RELEASE ACCEPTANCE OPEN**  
**Repository location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up`, main  
**Google Drive location / document ID:** Not established; no new Drive file created. GitHub is the document of record.  
**Purpose:** Establish an auditable source-file inventory, findings baseline and distinct follow-up acceptance evidence across all six P0 release gates.  
**Dependencies:** `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, P0 issues #153–#158, release register SMFGU-P0-EXEC-001 v1.1, accepted Stripe TEST report SMFGU-COMMERCE-CHART-MIXED-TEST-001 v1.1, original 671-position curriculum freeze and separately gated 27 draft days.

## 1. Exact automated source-scan baseline

**Audited commit:** `1bfc9f7006ec7ebef740e94d6742b9883d3296a6`.  
**GitHub evidence:** https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/158#issuecomment-6545546108  
**Runner:** GitHub Actions, `scripts/repository-line-audit-v1.mjs`; `.github/workflows/repository-line-audit-v1.yml`. A later exact-commit rerun is required for newer main changes.

| Measure | Verified static scan |
|---|---:|
| Total Git-tracked files enumerated | 3,222 |
| Readable UTF-8 text files line-scanned | 3,130 |
| Individual UTF-8 source/document lines scanned | 319,705 |
| Binary/non-UTF-8 files inventoried by bytes/hash only | 92 |
| Symlinks | 0 |
| Unreadable tracked files | 0 |
| Node syntax checks reported | 1,259 |
| Oversized JavaScript files deferred from syntax checks | 0 |
| JSON parsed | 86 |
| JSON parse failures | 0 |
| Static pattern candidates | 1,292 |
| P0 candidate matches | 10 |
| P1 candidate matches | 327 |
| P2 candidate matches | 534 |
| P3 review/inventory matches | 421 |

**Critical interpretation:** A line-pattern match is not a proven exploit or a confirmed defect; these are triage candidates. The workflow scans every valid UTF-8 line with a defined rule set and inventories all tracked files, but does **not** human-read and semantically certify 319,705 lines, deeply inspect binary contents, execute a penetration test, grant rights to market data, or verify member/Stripe behavior. Binary types must be reviewed by appropriate native tools as warranted. A later SHA must be separately audited.

**Generated evidence:** GitHub Actions artifact `repository-line-audit-v1`, with `tracked-file-manifest.csv` (every tracked filename, size, lines, hash and scan status), `line-findings.csv` (line-numbered triage candidates, no source/secret values), `summary.json` and `SCOPE.md`. Preserve the artifact link and exact run ID when available; do not invent a run ID.

## 2. Required P0/P1 issue triage

1. Open the exact commit Actions artifact; enumerate each of the 10 P0 pattern matches and 327 P1 matches. Verify raw source *privately* before labeling any as vulnerabilities. Do not post tokens, private endpoints, credentials, account IDs or user data publicly.
2. Distinguish credential literals from defensive regexes/test fixtures; exported browser/server code from nonpublished build scripts; SQL grants made to service-only functions from direct anon authority; review real execution privilege and RLS separately.
3. Record exact file/line, code owner, impact, reproduction, downstream dependencies, fix, test, commit and status in the issue/QA register. False positives require a short grounded disposition, not a silent deletion.
4. Handle the 534 P2 and 421 P3 candidates as grouped review batches after P0/P1, prioritizing checkout, auth, privileged RPC, private grading, public bundles and chart/replay authorization.

## 3. Verified live-data facts — independent of static scan

- **Mixed TEST purchase/refund:** three real-wallet mixed TEST orders ultimately refunded; three private paid and three refunded event records; twelve Lumens debited and all twelve returned. Genuine provider-backed Professional purchase/refund accepted, but actual mixed cancellation/expiration, actual dispute and genuine fully-Lumen-funded browser acceptance remain outstanding. No LIVE payment toggles are authorized.
- **Chart Studio:** one live member workspace record; tier middleware and stored-layout paths implemented. Authenticated tier downgrade, cross-account workspace isolation and post-refund reopening are not yet formally accepted.
- **Grading:** 419 canonical Lab assessment sets remain draft/unreviewed in Supabase. Twenty B01 review-frozen sets have reviewer timestamps but source-status text says individual review pending; reconcile the actual sign-off evidence. Never assign official mastery from formative progress.
- **Training:** frozen original 671 positions = 419 canonical Labs + 247 original Boot Camp days + five Free Foundations days. Original seven programs now have **52 day-specific authored instructional modules, 195 remaining to author, zero independently accepted days** in controlled register v0.2; an additional 27 drafted days (`tape10`, `indicators10`, `filings7`) are independently gated, creating ten authored program definitions/274 potential Boot Camp days. No automatic expansion of the original freeze or customer release.
- **Historical data:** 419 published original fictional datasets, **two published QA-only** historical datasets, 87 historical drafts NOT LICENSED FOR MEMBER DISPLAY; 10,116 private replay bars. A published database status is not independent license clearance.
- **Database security advisors:** 204 informational RLS-no-policy notices, 8 anon-executable and 91 authenticated-executable `SECURITY DEFINER` notices, one Auth leaked-password warning. Review context; counts do not prove direct exploit and blind grants/revokes are prohibited.

## 4. Recommended manual semantic audit order

| Batch | Scope | Mandatory review focus | Exit evidence |
|---|---|---|---|
| A | `functions/api/`, `functions/_lib/`, `supabase/migrations/`, `supabase/rollbacks/` | Authorization, payment idempotency, signed webhook verification, role privilege, RLS, migration/rollback consistency and protected scoring | Privileged-route security review, independent negative tests and DB advisor dispositions |
| B | `assets/js/`, `assets/css/`, `*.html`, Pages build and public data | Member identity/scrubbing, chart permissions and persistence, unsafe DOM sinks, accessibility, unsupported claims and obsolete member labels | Genuine Free/Founder/QA/Owner browser matrix, responsive/keyboard evidence |
| C | `data/`, `docs/curriculum*`, lesson content, seven original and three draft curricula | Exact-source factual claims, numerical calculations, worked and transfer cases, review status, formative-versus-protected grading | Signed per-unit content and independent assessment acceptance; B01 reference first |
| D | Historical ingest, datasets and replay | Feed rights/coverage, timestamp cutoff, data provenance, gap handling and QA-only flags | Dated per-dataset license and reviewer, no-lookahead authenticated QA |
| E | `tests/`, `.github/workflows/`, `scripts/`, dependency manifests | Test truthfulness, skipped/dummy browser tests, unpinned packages, exact-head build and CI results, audit artifacts | Exact-main CI run list, job logs and Cloudflare matching SHA |
| F | Documentation, public policies, media and binary assets | Product claims, commerce/membership text, media copyright and accessibility, licensing, binary provenance | Document-control register and media/legal review dispositions |

**Priority order:** Chart Studio authenticated QA; outstanding genuine Stripe TEST lifecycle scenarios; B01 five-day educational/grading quality reference; remaining original 195 authoring and 419 Lab editorial work; separately gated three new programs; historical/legal/security final release.

## 5. Remaining acceptance and governance

All six GitHub P0 issues remain OPEN and are separately reconciled:
- #153 — shared Lab teaching and graded assessment
- #154 — Chart Studio authenticated access, workspace and downgrade
- #155 — real historical rights and no-lookahead
- #156 — remaining mixed Stripe TEST reversal and Lumen tests
- #157 — seven original plus three separately gated draft Boot Camps
- #158 — security, whole-repo audit, CI and production acceptance

A successful Cloudflare deployment is not a GitHub Actions or user-journey acceptance. The earlier confirmed deployed commit `a257a05f0d88d0c2700fea87bf3342e80d411bfb` is **not** claimed to equal this scan's SHA; compare with current production deployment before acceptance.

## 6. Audit-control policies and revision history

- No secrets, raw private answer keys, member identifiers or service-role credentials may be placed in public issues or audit exports.
- No LIVE Stripe charge/refund, membership entitlement modification, Lumen credit adjustment, access-rule weakening, historical dataset release or unreviewed certificate issuance during source audit.
- Do not close a P0 based on source scan alone. False-positive disposition, manual semantic scrutiny, user acceptance and release approval are separate gates.
- **Version 1.0 — October 31, 2026:** First exact-commit Git-tracked inventory, every readable line static scan, explicit binary/semantic limits, workstream disposition and grounded production status. No production configuration or data changed.

**Footer:** Crown & Lantern Press / Cyber Nexus — Controlled engineering audit record. Source inventory and automated line scan are not independent security certification or educational accreditation.

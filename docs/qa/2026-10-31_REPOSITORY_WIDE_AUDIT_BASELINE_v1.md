# Repository-Wide Acceptance and Quality Audit — Baseline V1

**Document ID:** SMFGU-QA-REPO-001  
**Project:** The Stock Market: From the Ground Up / Website and Learning Platform  
**Owner:** Crown & Lantern Press / Cyber Nexus  
**Filename:** `docs/qa/2026-10-31_REPOSITORY_WIDE_AUDIT_BASELINE_v1.md`  
**File type:** Markdown  
**Version:** 1.2  
**Review date:** October 31, 2026 (America/Chicago)  
**Status:** **EXACT-COMMIT AUTOMATED SCAN PASSED; P0 FIXTURE DISPOSITION DOCUMENTED; SQL/DOM SECURITY REVIEW, BINARY AND HUMAN SEMANTIC ACCEPTANCE OPEN**  
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

## 1A. Successful audited rerun and first findings disposition — v1.1

**Controlling updated scan:** [GitHub Actions run 41216163811](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216163811), job status **success**, exact scanned `main` commit `137705dace7c4b14d9f6f64c61e521419f99abed`, with artifact ID **13048825517** and Issue #158 [published summary](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/158#issuecomment-6545566426).

| Updated metric | Rerun value |
|---|---:|
| Git-tracked files | 3,224 |
| Readable UTF-8 files | 3,132 |
| UTF-8 lines scanned | 319,888 |
| Binary/non-UTF-8 inventory entries | 92 |
| JavaScript syntax checks passing | 1,261 |
| JSON parses passing | 86 |
| Unreadable files / JSON failures / JavaScript syntax errors reported | 0 |
| Pattern candidate matches | 1,292 (10 P0, 327 P1, 534 P2, 421 P3) |

The initial `1bfc9f7` audit of 3,222 files and 319,705 lines is preserved as historical evidence; the updated `137705d` audit supersedes it for the **particular** later SHA. Further commits require a new exact-SHA run.

### Manual triage of severity classes — initial pass
- **P0, ten matches:** all ten literal-pattern matches occur in `tests/` Stripe LIVE mock, Founder provider, webhook and signed-reconciliation fixtures. Source-line inspection found obvious fabricated/mock/QA values rather than production provider credentials, including the one non-obvious `whsec_` QA-only fixture. **Disposition: test-fixture-pattern false positives for these ten lines**, not confirmed live credential leakage. Do not reveal complete fixture strings in public reports. This does not certify every possible secret-exposure vector.
- **P1, 14 dynamic-code matches:** all 14 are in `tests/`, mostly VM/evaluation harnesses. **Disposition: test-only candidates; inspect execution context for unintended use or untrusted injection before final closure**, not evidence of site runtime `eval`.
- **P1, 313 SQL EXECUTE-grant matches:** historical migration and admin scripts, not 313 active vulnerabilities. **Disposition: LIVE permission analysis required for each relevant target function rather than changing historical migrations blindly.** Production read-only catalog confirms eight currently anonymous-executable privileged `SECURITY DEFINER` functions and 91 authenticated-executable advisor warnings. High-priority review: public `email_is_available` may reveal email-account existence (privacy/rate limiting); `prepare_book_key_claim` creates a pending claim token when a valid secret code is provided (abuse, guessing, privilege and throttling); trigger-only `gu_site_card_layout_audit_trigger_v1` has unnecessary direct grant to review. Public quote/catalog/username availability functions appear designed for public reads, but require authorization and payload checks.
- **P2, 497 innerHTML/outerHTML assignment matches:** **source-to-sink manual XSS review pending**; some code already escapes or uses trusted templates, so count does not mean 497 exploitable XSS defects. Prioritize auth, admin, Store, Tutor, Forum, member wallet, chart, and payment pages.
- **P2, 17 legacy `Founding 600` label matches:** inspected customer-facing `assets/js/store.js`, `assets/js/store-inventory-ui-v014174.js` and `assets/js/store-product-detail-v01484.js` use obsolete visible labels. **Confirmed member-facing copy defect**; approved name is `Founding Members`. Internal/admin labels are permissible; published legal documents and URLs need controlled legal/version review, not blind replacement.
- **P2, 14 external-link `target=_blank` matches; six huge single lines:** check actual `rel=noopener noreferrer`, accessible link text and minified-source provenance. A match alone is not a defect.
- **P3, 420 SQL function declarations plus one TODO:** expected inventory for permissions/security analysis, not 421 independently discovered vulnerabilities.

**Open follow-up:** no full semantic human sign-off of 3,132 text files, no type-specific inspection of 92 binary assets, no authenticated production/browser acceptance, and no universal validation of all historic migrations or media licenses.

## 2. Required P0/P1 issue triage

1. Open the exact commit Actions artifact; enumerate each of the 10 P0 pattern matches and 327 P1 matches. Verify raw source *privately* before labeling any as vulnerabilities. Do not post tokens, private endpoints, credentials, account IDs or user data publicly.
2. Distinguish credential literals from defensive regexes/test fixtures; exported browser/server code from nonpublished build scripts; SQL grants made to service-only functions from direct anon authority; review real execution privilege and RLS separately.
3. Record exact file/line, code owner, impact, reproduction, downstream dependencies, fix, test, commit and status in the issue/QA register. False positives require a short grounded disposition, not a silent deletion.
4. Handle the 534 P2 and 421 P3 candidates as grouped review batches after P0/P1, prioritizing checkout, auth, privileged RPC, private grading, public bundles and chart/replay authorization.

## 3. Verified live-data facts — independent of static scan

- **Mixed TEST purchase/refund:** four real-wallet mixed TEST paid/refunded orders and one mixed unpaid/expired session; four private paid, four refunded and one genuine signed expired event; 14 Lumens debited and all 14 returned. Genuine provider-backed Professional purchase/refund accepted, and a genuine provider-confirmed mixed unpaid expiration/one-Lumen restoration, but member-facing cancellation-button invocation, actual dispute and genuine fully-Lumen-funded browser acceptance remain outstanding. No LIVE payment toggles are authorized.
- **Chart Studio:** one live member workspace record; tier middleware and stored-layout paths implemented. Authenticated tier downgrade, cross-account workspace isolation and post-refund reopening are not yet formally accepted.
- **Grading:** 419 canonical Lab assessment sets remain draft/unreviewed in Supabase. Twenty B01 review-frozen sets have reviewer timestamps but source-status text says individual review pending; reconcile the actual sign-off evidence. Never assign official mastery from formative progress.
- **Training:** frozen original 671 positions = 419 canonical Labs + 247 original Boot Camp days + five Free Foundations days. Original seven programs now have **97 day-specific authored instructional modules, 150 remaining to author, zero independently accepted days** in controlled register v0.2; an additional 27 drafted days (`tape10`, `indicators10`, `filings7`) are independently gated, creating ten authored program definitions/274 potential Boot Camp days. No automatic expansion of the original freeze or customer release.
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

**Priority order:** Chart Studio authenticated QA; outstanding Stripe TEST member-facing cancellation UI/dispute/zero-cash scenarios; B01 five-day educational/grading quality reference; remaining original 195 authoring and 419 Lab editorial work; separately gated three new programs; historical/legal/security final release.

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
- **Version 1.2 — October 31, 2026:** Updated the final live ledger to four refunds and one genuine provider-expired mixed session with all 14 Lumens restored; authoring ledger now records 97 authored/150 remaining Boot Camp days. Existing audit SHA and human-review limitations unchanged.\n- **Version 1.1 — October 31, 2026:** Added successful exact-SHA rerun, file/line artifact, initial P0 fixture disposition, SQL privilege/DOM risk triage, and identified member-facing terminology conflicts. Final audit remains OPEN.
- **Version 1.0 — October 31, 2026:** First exact-commit Git-tracked inventory, every readable line static scan, explicit binary/semantic limits, workstream disposition and grounded production status. No production configuration or data changed.

**Footer:** Crown & Lantern Press / Cyber Nexus — Controlled engineering audit record. Source inventory and automated line scan are not independent security certification or educational accreditation.

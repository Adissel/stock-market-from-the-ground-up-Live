# Learning and Private Data — 20 Live Database Security Metadata Checks

**Document ID:** SMFGU-QA-LEARNING-RLS-020-20261102  
**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Version:** 1.0  
**Date:** November 2, 2026  
**Status:** 20/20 LIVE METADATA CHECKS COMPLETED; DYNAMIC ACCOUNT-ISOLATION AND FULL RELEASE ACCEPTANCE OPEN  
**Filename:** `2026-11-02_LEARNING_PRIVATE_DATA_20_LIVE_RLS_CHECKS_V1.md`  
**File type:** Markdown (.md)  
**Authoritative location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/qa/` on `main`  
**Google Drive location:** Not created; no Drive document ID  
**Dependencies:** Supabase project `oxihglyfgzywsupnyicb`, owner-approved learning scope, canonical Labs/Academy catalogs, protected grading rules, Talia privacy controls, seven-group GitHub release workflow  
**Purpose:** Preserve read-only production database evidence as 20 discrete executed queries; do not misrepresent metadata inspection as authenticated browser/IDOR penetration testing.

## 1. Execution method and independent results

On November 2, 2026, twenty distinct `SELECT` queries were executed against live `pg_class`, `pg_namespace`, `pg_policy`, and `has_table_privilege` metadata of the connected stock-market Supabase database. Each query targeted precisely one listed table in `public` and returned a real matching row.

**Pass definition is intentionally narrow:** the table exists; PostgreSQL Row Level Security is enabled; and the `anon` database role does not have a direct `SELECT` grant. All twenty met that condition, with zero failed or missing table-query results.

**Results:** 20/20 metadata checks passed (100% of this batch). Of the twenty tables, seven explicitly grant direct `SELECT` to `authenticated`, and thirteen do not grant it. For member-readable tables, RLS policy text must restrict ownership; the supplementary policy review found `auth.uid() = user_id` or equivalent on Lab progress, decision journal, competency evidence, and journal history/evidence/reviews. This evidence does **not** establish dynamic cross-account denial or endpoint authorization.

| Check | Live table | RLS | Anonymous direct SELECT | Authenticated direct SELECT |
|---|---|---|---|---|
| 01 | `gu_member_tutor_conversations_v014149` | Enabled | Denied | No |
| 02 | `gu_bootcamp_academy_progress_v014168` | Enabled | Denied | No |
| 03 | `gu_bootcamp_academy_enrollments_v014168` | Enabled | Denied | No |
| 04 | `gu_bootcamp_academy_audit_v014295` | Enabled | Denied | No |
| 05 | `gu_academy_stage_checkpoint_v1` | Enabled | Denied | No |
| 06 | `gu_academy_protected_cases_v1` | Enabled | Denied | No |
| 07 | `lab_progress` | Enabled | Denied | Yes |
| 08 | `site_lab_progress` | Enabled | Denied | Yes |
| 09 | `decision_journal` | Enabled | Denied | Yes |
| 10 | `competency_attempts_v135` | Enabled | Denied | No |
| 11 | `competency_cases_v135` | Enabled | Denied | No |
| 12 | `competency_evidence` | Enabled | Denied | Yes |
| 13 | `journal_evidence_v1` | Enabled | Denied | Yes |
| 14 | `journal_actual_history_v1` | Enabled | Denied | Yes |
| 15 | `gu_journal_research_links_v1` | Enabled | Denied | No |
| 16 | `gu_replay_journal_links_v01494` | Enabled | Denied | No |
| 17 | `gu_lab_competency_knowledge_map_v014105` | Enabled | Denied | No |
| 18 | `gu_lumen_assessment_case_release_v1` | Enabled | Denied | No |
| 19 | `gu_watchlist_journal_transfers_v3` | Enabled | Denied | No |
| 20 | `journal_reviews` | Enabled | Denied | Yes |

## 2. Security advisor review

The Supabase security advisor also returned these warnings (counts are findings, not verified vulnerabilities):
- 4 `anon_security_definer_function_executable` warnings. Reviewed routine names: `gu_digital_offer_status_v01430`, `gu_digital_payment_route_get_v01432r2`, `gu_digital_public_catalog_v01430`, and `gu_signed_quote_v01431`. Their SQL definitions return public-facing catalog, availability, routing, or quote information; determine intended public EXECUTE rights against business requirements before altering them.
- 87 `authenticated_security_definer_function_executable` warnings. A function-by-function privilege and argument-authorization audit remains open; do not revoke all privileges without analyzing use.
- 1 `auth_leaked_password_protection` warning. Review the free-plan feasibility and current auth configuration.
- 7 `multiple_permissive_policies` performance warnings. Review overlap and the ownership predicates before making RLS changes.
- 220 informational `rls_enabled_no_policy` records; no policy is often intentional when service-only tables use fail-closed public access.

Advisor documentation:
- https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

## 3. Independent acceptance boundaries

- Owner editorial acceptance of all Labs, Boot Camps, and associated learning-record scope remains controlling: `docs/learning/2026-11-02_OWNER_APPROVAL_ALL_LABS_AND_BOOT_CAMPS_V1.md`.
- The historical Boot Camp technical ledger is `91/380 = 23.95%` as of the documented October 31 snapshot. This 20-query metadata batch must not be added to that separate denominator.
- The 86-command GitHub workflow is `Beta Major Release 01 - 86 Source Evidence Commands`. Run `41516152319` was still pending with zero jobs at the time checked; seven job conclusions and exact-SHA test success were **not** established.
- Authenticated Owner/member Chromium tests, real signed-session expiration, cross-account access denial, live encrypted-session handling, private Tutor history, protected grading, learning-progress persistence, and accessibility require distinct runtime QA.
- No database writes, RLS modifications, paid transactions, or live checkout changes were performed during the 20 checks.

## 4. Technical decision

**Accept** the twenty narrowly defined live metadata checks as passed. **Do not certify** the seven GitHub source-job gates, full security/privacy behavior, graded assessment correctness, release candidate, or overall website completion from this result. Formal technical acceptance remains open.

## 5. Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-02 | Recorded twenty independently executed production RLS/privilege metadata checks, reviewed ownership policies, and separated security advisor warnings from actual failures |

**Footer:** Crown & Lantern Press · SMFGU-QA-LEARNING-RLS-020-20261102 · v1.0 · Metadata verified · Authenticated release acceptance outstanding.

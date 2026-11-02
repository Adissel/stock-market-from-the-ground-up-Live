# Security Definer / RPC Authorization — Next 20 Live Source Audits

**Document ID:** SMFGU-QA-RPC-020-20261102  
**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Version:** 1.0  
**Date:** November 2, 2026  
**Status:** 20/20 LIVE DATABASE FUNCTION-DEFINITION AUDITS COMPLETED; RUNTIME ACCOUNT ISOLATION OPEN  
**Filename:** `2026-11-02_SECURITY_DEFINER_NEXT20_SOURCE_AUDIT_V1.md`  
**File type:** Markdown  
**Authoritative location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/qa/`, branch `main`  
**Google Drive location:** Not created; document ID not assigned  
**Dependencies:** Supabase project `oxihglyfgzywsupnyicb`, GitHub release workflow, owner editorial acceptance, existing RLS and privacy decisions  
**Purpose:** Preserve evidence from twenty independently executed read-only live `pg_proc` queries that inspect member-executable `SECURITY DEFINER` routine visibility and source-based authorization boundaries. These are not successful authenticated calls to the business RPCs.

## 1. Execution record

Each of the following functions was individually queried through the connected production Supabase SQL API with `pg_get_functiondef`, `prosecdef`, and `has_function_privilege`. All 20 definitions were found, all 20 grant execution to the authenticated PostgreSQL role, and all 20 deny direct execution to the anonymous role. **Narrow metadata result: 20/20 passed, 0/20 anonymous EXECUTE grants.** Guard descriptions are static implementation findings and must be tested with genuine Owner/member identities.

| Check | Audited PostgreSQL function | Auth boundary observed in source | Anonymous EXECUTE |
|---:|---|---|---|
| 1 | `gu_founder_discount_eligibility_v014221` | Caller UUID bound to auth.uid unless service_role | Denied |
| 2 | `gu_founder_noncommercial_qa_v014289` | Claimed user must equal auth.uid | Denied |
| 3 | `gu_mod_case_history_v01425` | Delegates to gu_mod_case_actor_v01424 role check | Denied |
| 4 | `gu_mod_case_list_v01424` | Delegates to gu_mod_case_actor_v01424 role check | Denied |
| 5 | `gu_mod_case_transition_v01424` | Delegates to gu_mod_case_actor_v01424 role check | Denied |
| 6 | `gu_owner_digital_books_get_v01430` | Delegates to gu_digital_owner_guard_v01430 | Denied |
| 7 | `gu_owner_digital_books_save_v01430` | Delegates to gu_digital_owner_guard_v01430 | Denied |
| 8 | `gu_owner_digital_payment_route_read_v01432r2` | Checks staff identity and OWNER/ADMIN | Denied |
| 9 | `gu_owner_digital_payment_route_save_v01432r2` | Checks staff identity and OWNER | Denied |
| 10 | `gu_owner_operations_save_v01431r1` | Owner guard plus step-up | Denied |
| 11 | `gu_signed_owner_payment_switch_save_v01431` | Owner guard plus step-up | Denied |
| 12 | `gu_signed_owner_transition_v01431` | Owner guard plus step-up | Denied |
| 13 | `gu_staff_console_v01431r1` | Delegates to gu_staff_identity_v01431r1 | Denied |
| 14 | `gu_staff_send_notice_v01431r1` | Delegates to gu_staff_identity_v01431r1 | Denied |
| 15 | `gu_signed_order_start_v01431` | Member and age-eligibility checks | Denied |
| 16 | `gu_signed_owner_session_v01431` | Owner guard plus step-up | Denied |
| 17 | `gu_founder_legacy_list_v014186` | Calls gu_founder_commons_access_v014174('shared') | Denied |
| 18 | `gu_founder_legacy_my_status_v014187` | Uses auth.uid for own founder number | Denied |
| 19 | `gu_founder_commons_access_v014174` | Uses auth.uid and membership checks | Denied |
| 20 | `gu_v014121_my_free_week_usage` | Uses auth.uid for member usage | Denied |

## 2. Reviewed authorization dependencies

- `gu_mod_case_actor_v01424` denies unauthenticated, suspended/restricted, Showcase, and unauthorized role holders; it checks active OWNER and `forum.moderate` permissions.
- `gu_staff_identity_v01431r1` denies users without eligible OWNER/ADMIN role, and checks suspended/restricted/Showcase access; `gu_staff_console_v01431r1` uses this helper before returning its directory and notices.
- `gu_founder_discount_eligibility_v014221` rejects cross-user UUID requests from a non-`service_role` caller.
- `gu_founder_legacy_list_v014186` denies access unless the Founders Commons shared-scope guard passes. It returns voluntarily opted-in display labels rather than all member identities.
- Owner commerce mutation functions reviewed delegate to Owner guards and, for sensitive switches/transitions, recent password step-up. **None were invoked**; no charging or commerce state changed.

## 3. Outstanding security gates / current warnings

Supabase security advisor reports four anonymous `SECURITY DEFINER` functions for public catalog/quote/route APIs and 87 authenticated `SECURITY DEFINER` findings. These are warnings for privilege review, not proof of exploitability. This batch sampled 20 member-executable functions; it does not attest to all 87. Review public `gu_digital_payment_route_get_v01432r2` and the three other anonymous functions against intended guest contracts before revoking any permission.

Required independent tests remain: signed authenticated API execution for Owner, Moderator, Free, Founding 14/30/60 and restricted roles; malicious UUID/cross-account attempts; session expiration and token revocation; history, private grading, replay and progress persistence; responsive browser/keyboard/screen reader.

GitHub release workflow: `.github/workflows/beta-major-release-01-60-gates.yml`; prior run `41516152319` registered all seven required jobs but their conclusions remained queued when reviewed. Commit `902bb00fcb149b9fcff8b0679feb72babd661a19` removed branch-level concurrency serialization while preserving all 86 test commands and seven required jobs. No passing group or full-release claim should be made until exact-SHA job results exist.

## 4. Approval and sign-off

Owner editorial approval of all Labs, Boot Camps and learning records remains controlling under `docs/learning/2026-11-02_OWNER_APPROVAL_ALL_LABS_AND_BOOT_CAMPS_V1.md`. The audit accepts only the twenty verified function-permission metadata checks and static guard observations, not authenticated technical acceptance or LIVE commerce clearance.

## 5. Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-02 | Recorded twenty independently queried function execution rights, static guard boundaries, and continuing runtime QA requirements |

**Footer:** Crown & Lantern Press · SMFGU-QA-RPC-020-20261102 · v1.0 · Metadata verified · Production access tests outstanding.

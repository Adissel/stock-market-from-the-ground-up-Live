# Public Signup RPC and Book-Key Privilege Review — October 31, 2026

**Document ID:** SMFGU-SEC-PUBLIC-RPC-20261031-001  
**Project:** The Stock Market: From the Ground Up — Website / Security and Governance  
**Filename/file type:** `docs/security/2026-10-31_PUBLIC_SIGNUP_AND_BOOK_KEY_RPC_REVIEW_v1.md` / Markdown  
**Version:** 1.0  
**Status:** **READ-ONLY PRIVILEGE REVIEW COMPLETE; ABUSE/RATE-LIMIT HARDENING NOT ACCEPTED**  
**Created/last reviewed:** October 31, 2026, America/Chicago.  
**Controlled location:** GitHub repository `cybernexuspublishing/stock-market-from-the-ground-up`, `main` only.  
**Google Drive folder/document ID:** Not created / unassigned. GitHub is the source of record.  
**Purpose:** Verify actual live database privileges and data exposure for public signup, book-key claim and trigger-only helper routines; identify narrow security-hardening options that preserve registration and email verification.  
**Dependencies:** `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, `assets/js/signup.js`, `supabase/migrations/v0.5.3_identity_book_keys.sql`, `supabase/migrations/20261028_sitewide_card_layout_editor_v1.sql`, `docs/qa/2026-10-31_CHART_B01_SECURITY_ACCEPTANCE_EXECUTION_v1.md` and P0 security issue #158.

## Evidence and scope

Source inspection was performed through the connected GitHub plugin; production `pg_proc` privilege checks, `pg_class` RLS/table privilege checks and aggregate-only key/claim counts were executed through the connected Supabase plugin. This review performed **zero SELECTs of individual users, plaintext key values, key hashes, token UUIDs, personal identifiers or wallet balances**; no valid codes were attempted.

### Live privilege matrix (2026-10-31)

| `public` function | Anonymous EXECUTE | Member EXECUTE | Service EXECUTE | Disposition |
| --- | --- | --- | --- | --- |
| `email_is_available(candidate text)` | Yes | Yes | By service role | Needed by current signup, but reveals whether a guessed email is registered |
| `username_is_available(candidate text)` | Yes | Yes | By service role | Needed by current signup, but reveals whether a guessed username is in use |
| `prepare_book_key_claim(candidate text)` | Yes | Yes | By service role | Needed by current optional pre-signup key claim; accepts arbitrary candidates |
| `gu_site_card_layout_audit_trigger_v1()` | Yes | Yes | By service role | Trigger-only; public role EXECUTE likely unnecessary; verify safe privilege narrowing |
| `admin_generate_book_key(...)` | No | No | Yes | Correct service-only boundary |
| `activate_pending_book_key_claim(target_user uuid)` | No | No | Yes | Correct service-only boundary |
| `apply_book_key_for_user(target_user uuid, target_book_key_id bigint)` | No | No | Yes | Correct service-only boundary; prevents direct member misuse of arbitrary target UUID/book ID |
| `redeem_book_key(candidate text)` | No | Yes | Yes | Normal authenticated redemption; independent per-user and consumption logic still needs source/role tests |
| `my_book_key_redemptions()` | No | Yes | Yes | User's own record view; independently verify actual auth.uid binding |

Relevant tables `book_keys`, `book_key_claims`, `gu_site_card_layout_v1`, `gu_site_card_layout_audit_v1`, `lab_training_sets_v014` and `crownlight_chart_workspaces_v1` have **RLS enabled and no direct SELECT/INSERT grants** to anonymous or authenticated roles. Read-only inventory found **3 active book-key records**, whose stored code hashes were 64 characters (consistent with SHA-256 hex), and **0 pending book-key claim rows**. The plaintext book key's entropy cannot be inferred from hash length; no security-strength conclusion is made.

## Material findings

**S-01 — Account enumeration surface (confirmed design behavior, mitigation open).** The public boolean `email_is_available` queries `auth.users` by normalized email and `username_is_available` queries public profiles by normalized username through SECURITY DEFINER. `assets/js/signup.js` calls both functions from the unauthenticated browser while users type, on 550 ms and 450 ms debounce, and displays exact registered/available status. The server signup endpoint uses a later CAPTCHA, but the availability RPC calls precede it. This exposes existence information to an attacker who can call the RPC directly; the presence, absence and effectiveness of upstream Supabase/PostgREST rate limiting were **not independently measured**. Do not claim a privacy breach or exploitation occurred.

**S-02 — Pre-signup Book Key probe and claim-table write surface (confirmed public privilege, mitigation open).** `prepare_book_key_claim` normalizes candidate codes, requires at least eight characters, hashes each candidate, matches an active/unexpired/unexhausted stored key, then inserts a two-hour claim token and returns its random UUID on a valid match; invalid candidates return null. It has no in-function per-IP, per-user, per-key attempt counter or CAPTCHA verification. Because the browser calls this RPC *before* the later signup CAPTCHA, an attacker can also call it directly without the approved registration UI. Theoretical feasibility depends on actual key entropy, external rate limits, logging and other operational controls not established by this review. Random token expiry and the service-only redemption/activation functions are positive mitigating controls; they do not replace throttling.

**S-03 — Trigger-only function privilege (non-exploit hardening candidate).** `gu_site_card_layout_audit_trigger_v1()` has anonymous/member EXECUTE. Its backing tables are service-only, and this PostgreSQL trigger function is intended to be executed as a trigger rather than a general RPC. A narrow grant reduction is advisable only after verifying the trigger still audits actual Owner changes and any production Postgres role behavior; do not revoke all SECURITY DEFINER functions or disable auditing.

**S-04 — Critical direct-redemption/entitlement escalation check (PASS at privilege level).** `admin_generate_book_key`, `activate_pending_book_key_claim` and `apply_book_key_for_user` are not directly executable by `anon` or `authenticated`. Even though the last function accepts an arbitrary target UUID and can grant training entitlements, the live database ACL blocks ordinary users from directly invoking it. API-level misuse through a separately privileged caller was not exercised; this is a privilege check, not a full redemption audit.

## Recommended next change, only with compatible acceptance

1. Preserve native account creation, Turnstile verification, email verification, book-key optionality and the member Book Key redemption flow. Do not immediately revoke public signup RPCs; that would break current registration.
2. Move email/username availability and pre-signup book-key candidate processing behind a server-controlled, rate-limited same-origin endpoint with an appropriate challenge or risk-based verification. Never return `exists/does-not-exist` from an unrestricted public endpoint, and never allow the old direct Supabase RPC to remain reachable as a bypass. Determine whether a less revealing email-address UI is needed before changing the approved registration UX. Record permitted origins, rate controls, privacy-safe audit metrics and legitimate accessibility.
3. Check actual key generation entropy and redemption replay/claim expiry, **without logging the keys**. Add per-identifier/code throttling and cleanup as operationally appropriate; validate abuse tests only with purposely created QA values, never customer codes.
4. Test trigger EXECUTE reduction in a reversible migration and confirm actual service-role Owner layout write still emits the existing audit row. Apply privileges only after review of trigger invocation and tool migration policy.
5. Recheck `redeem_book_key` and `my_book_key_redemptions` actor scoping, and test role revocation, expired claims, duplicate attempts, and noncommercial QA code issuance without affecting any customer entitlements.

## Not performed

No real signup, password reset, book-code guessing, claim token issuance, key redemption, new account, privilege or RLS change, LIVE Stripe action, or production registration disruption. Do not close security issue #158 or claim external compliance from this inventory.

## Revision history

| Version | Date | Description | Acceptance |
| --- | --- | --- | --- |
| 1.0 | 2026-10-31 | Read-only verified ACL/RLS, exact signup and claim code paths, risk-segmented remediation and direct privileged redemption boundary | Source and database privilege verification only; adversarial abuse testing open |

**Footer:** Crown & Lantern Press / Cyber Nexus — Internal controlled security audit evidence; not legal advice, penetration-test certification, or comprehensive compliance signoff.

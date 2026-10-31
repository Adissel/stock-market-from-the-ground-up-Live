# B001 — Authenticated Noncommercial QA Entitlement and Persistence Acceptance

| Document control | Value |
| --- | --- |
| Project | The Stock Market: From the Ground Up |
| Document ID | SMFGU-B001-AUTH-QA-20261031 |
| Filename | `docs/qa/2026-10-31_B001_AUTHENTICATED_QA_ENTITLEMENT_ACCEPTANCE.md` |
| Type | Markdown |
| Version | 1.0 |
| Date | October 31, 2026 |
| Status | **AUTHENTICATED API PERSISTENCE ACCEPTED; HUMAN BROWSER/CROSS-MEMBER ACCEPTANCE OPEN** |
| Source of truth | GitHub `main`; production Supabase and GitHub Actions |
| Google Drive | Not created; Drive file ID not assigned |
| Purpose | Confirm a time-limited, noncommercial training QA permission and its rollback, and link real authenticated production acceptance evidence |
| Dependencies | Existing Supabase Auth, `user_tool_passes`, `admin_audit_log`, `ONDEMAND_TRAINING`, `gu_bootcamp_academy_save_v014168`, `groundup_question_pass_summary`, Cloudflare Pages |

## Authorization and exact account

The Owner authorized temporarily provisioning **the existing GitHub Actions QA identity** for B001. The signed-in production Auth account observed in the preceding failed run was verified, via read-only login timing and profile data, as the previously documented `James_Test` free-baseline QA account.

Preflight verified a real eligible member profile, no active training pass, no active paid subscription, no staff/showcase privilege and no restricted/suspended status. Prior ONDEMAND_TRAINING manual QA history existed but had been canceled. No paid plan or real-customer balance was altered.

The connected Supabase management session made one **owner-delegated, noncommercial, short-lived manual tool grant**. This used the existing `user_tool_passes` record model and the established admin audit log. As this was a connected **control-plane operation**, not a signed-in Owner browser request through `gu78_admin_account_resource_grant`, both audit records accurately use a null actor, identify chat-delegated authorization and **do not falsely impersonate an Owner session**. This distinction must not be relabeled as an Owner UI event.

- Temporary tool code: `ONDEMAND_TRAINING`
- Record ID: 5 (existing canonical tool-right table)
- Granted: 2026-10-31 17:57:00 UTC
- Automatic expiration set: 2026-10-31 19:27:00 UTC (90 minutes)
- Provider/subscription: NULL / NULL
- Commercial charge: none
- Grant audit action: `qa.owner_delegated.noncommercial_tool_grant`

## Exact authenticated evidence

GitHub Actions workflow **Live Academy Persistence QA (authenticated, no billing)**:
- [Run 41219419170, attempt 2](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41219419170)
- Workflow source SHA: `95a40e2f9e5f6cd751c9541f63fac4117d81f1af`
- Result: **COMPLETED / SUCCESS**, 2026-10-31 17:57:42 UTC.
- Actual production HTTPS API calls and real Supabase-issued access and refresh tokens were exercised. This is **not** a graphical human browser or CAPTCHA interaction.

Individual logged PASS steps:
1. Genuine Supabase authentication and signed identity; no credentials disclosed.
2. Existing Crownlight Lumens wallet read with reconciliation; anonymous wallet denial.
3. Real `ONDEMAND_TRAINING` entitlement positively returned.
4. B001 five-day curriculum and private progress GET on an unclaimed day.
5. Authenticated start, repeated-start idempotency, no grade/mastery.
6. Saved original fictional reflection and verified independent GET reload.
7. Stale revision returned HTTP 409 without replacing the saved reflection.
8. Foreign-origin mutation, invalid day, and anonymous GET rejected.
9. Genuine refresh grant and original user identity retained.
10. Saved reflection found following refreshed-token resume.

The original failed run [attempt 1](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41219419170) verified the same account was denied without a training entitlement; it was not silently bypassed.

## Reversion and postflight

After attempt 2 passed, the temporary record was revoked in a separately auditable transaction:
- `user_tool_passes.id=5` is canceled with `ends_at` no later than the postflight.
- Exactly **zero** currently active ONDEMAND_TRAINING passes remain for `James_Test`.
- Matching revoke audit action `qa.owner_delegated.noncommercial_tool_revoked`: **one**.
- B001 fictional saved reflection records: **two**, including the new independent QA note.
- This QA account's `site_orders`: **zero**; `site_subscriptions`: **zero**.
- No Lumen grant, transfer, Stripe event, protected grading publication or unrelated member progress modification.

## Scope limits / next acceptance

**Accepted:** genuine authenticated API-level authorization, wallet balance read, private Academy save/reload/refresh, single-actor error and denial handling, audit and restoration of noncommercial QA baseline.

**Not independently tested in this run:** interactive Turnstile browser login, keyboard/mobile rendering, a *second genuine user token* attempting cross-member access (the run did test anonymous and foreign-origin denial), server-verified official Lab grading and reward issuance, or a completed five-day learner experience. These remain separate beta and release gates.

The B001 content-topic freeze remains controlling. No expansion is authorized by this evidence record.

## Revision history
| Date | Version | Action | Decision |
|---|---|---|---|
| 2026-10-31 | 1.0 | Authoritative QA permission, authenticated API test, revocation and postflight evidence | B001 API persistence accepted; interactive/cross-member acceptance open |

Footer: Crown & Lantern Press / Cyber Nexus — QA evidence only, not actual paid member acceptance, professional trading certification, or financial advice.

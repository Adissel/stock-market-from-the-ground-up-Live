# Crownlight Lumens — Genuine Member Wallet and Two-Account Production Acceptance

| Document control | Value |
|---|---|
| Document ID | SMFGU-QA-WALLET-TWO-ACCOUNT-20261031-001 |
| Project | The Stock Market: From the Ground Up — Integrated Version 1 |
| Filename | `2026-10-31_MEMBER_WALLET_TWO_ACCOUNT_PRODUCTION_ACCEPTANCE_v1.md` |
| File type | Markdown |
| Repository location | `docs/qa/` on `cybernexuspublishing/stock-market-from-the-ground-up` |
| Google Drive location | Not created; no Drive location or Drive document ID assigned |
| Version | 1.0 |
| Date | 2026-10-31 |
| Status | **ACCEPTED: genuine Dashboard browser and two-member read-only isolation; remaining rewards/gifting release gates OPEN** |
| Owner decision | Preserve 12-milestone acceptance register; these two accepted milestones bring evidenced progress to 8/12 = 66.7% (reported 67%) |
| Dependencies | Real Supabase Auth, 2 noncommercial test profiles, Cloudflare Pages, Chart tier access, private Lumen history, private Academy/Lab progress, GitHub Actions |
| Purpose | Evidence independently observed for the resolved Dashboard and two-user blockers and remaining safety limitations |

## Scope and control baseline

The Owner delegated ordinary noncommercial QA, source changes and safety-preserving administration. Only `main` is used. Original James_Test membership, existing Studio Pass and wallet were preserved. No paid service, LIVE charge, official grade, Lumen award or gift was performed.

### 1. Dashboard — accepted on actual authenticated Chromium

- [GitHub Actions run 41236175250](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236175250), source commit `ca37e1be7f5ba2ad12d267db922543aaf5b426b3`.
- Result: **COMPLETED / SUCCESS**.
- Real Supabase-issued James_Test session was established in Chromium (not a human CAPTCHA-form acceptance).
- Browser verified visible wallet, included/purchased/other breakdown, real private wallet-history rendering, combined five nearest started Labs and Boot Camps, user-opened accessible wallet disclosure and details URL, visible gifting widget disabled by server release policy, and unauthenticated ledger denial.
- The actual defects corrected: an earlier test relied on `innerText` before page/disclosure visibility was established; the member gifting script mounted before its Dashboard DOM node existed; Dashboard now loads a versioned defer script directly and the browser checks actual visible state.
- Browser run reported no protected workspace/payment/entitlement/Lumen writes.

### 2. Two genuinely distinct Auth users — accepted

- [GitHub Actions run 41236357869](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236357869), source commit `300535d1882f9d43e0799ce37bf1ffc48a99df1e`.
- Result: **COMPLETED / SUCCESS**.
- Existing `James_Test` retained Advanced access; `QA_Secondary` independently authenticated as a separate, Standard-tier Supabase GoTrue user.
- Two real JWT identities and account identifiers were validated; both directions of forged user/member selectors were ignored for private Chart workspaces, Lab/Academy study progress and Lumen activity. Guest workspace access was denied. No protected production writes.
- The new QA identity was created through Supabase Auth `/signup` using a project-owned Gmail plus-address with noncommercial metadata and a separate password derived securely at test runtime from an existing protected QA secret. No password/token was committed or printed.
- The verification message was received and inspected through the connected project Gmail inbox. Because the confirmation link could not be opened using available browser tools, an **owner-delegated, narrowly scoped administrative confirmation** was applied to this QA-only Auth user, with its exact origin, Gmail message reference, and method recorded in `admin_audit_log`. This is **not** a claim that the normal email link was clicked; the site's global email-verification policy was not changed.
- Management SQL postflight: the second account has 0 orders, 0 subscriptions, 0 plan grants, 0 tool passes, 0 staff roles and 0 Lumen wallet buckets. Noncommercial app metadata remains present.
- Operational recommendation: replace the runtime-derived QA credential with a separately managed encrypted GitHub second-account secret when supported by the Owner's existing credential workflow, to eliminate the shared-root credential dependency.

### 3. Production and full-suite qualification

- Connected Cloudflare Pages returned **production deployment success** for exact tested source SHA `300535d1882f9d43e0799ce37bf1ffc48a99df1e`.
- At the final status check for that source SHA, **18 of 26** triggered GitHub Actions workflows had succeeded; **8 remained in progress**. Therefore overall full-suite CI was **not yet accepted**.
- The source-only wallet/rewards/gifting gate also passed in the prior [run 41234004916](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41234004916); this is separate from actual browser acceptance.

## Still open: release and accounting controls

1. Protected assessment-to-reward integration: reviewed canonical assessments and independent completion evidence must yield exactly one server-owned award; ungraded reflections cannot generate credits.
2. Earning amounts and wallet reconciliation: owner-reviewed publication schedule, server/catalog parity, idempotent credits and complete transaction history must be accepted.
3. Member gifting: currently **DISABLED**; implement/approve privacy, legal review, limits, disputed transfers and reversal rules, recipient opt-in and full genuine-member lifecycle. The atomic DB function having passed synthetic rollback tests is not authorization for live transfers.
4. Final exact-commit release: complete required `main` CI and verify the final approved release SHA and Cloudflare deployment match. The evidence above does not assert full-site production launch acceptance.

## Revision history

| Date | Version | Change | Acceptance decision |
|---|---|---|---|
| 2026-10-31 | 1.0 | Genuine member Dashboard Chromium and two independent Supabase Auth identity tests, QA-only administrative email confirmation, financial hold and production SHA evidence | Milestones 1 and 2 accepted; 8/12 = 67% work-package milestones; remaining four held |

Footer: © Crown & Lantern Press / Cyber Nexus — internal noncommercial QA acceptance only. Not legal, securities, consumer payments or professional trading advice.

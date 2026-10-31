# Talia — Sitewide, Genuine Founding QA, and Independent Editorial Continuation

| Document control | Value |
|---|---|
| Project | The Stock Market: From the Ground Up |
| Document ID | SMFGU-TALIA-REVIEW-027 |
| Version / date | 2.1 / October 31, 2026 |
| Status | PARTIALLY IMPLEMENTED — FULL ACCEPTANCE BLOCKED |
| Filename / type | `2026-10-31_sitewide_founder_editorial_acceptance_v2.md` / Markdown |
| Controlling location | GitHub `main` → `docs/research/talia/` |
| Google Drive location / document ID | Not created / not assigned |
| Purpose | Record verified full-site evidence, actual Founder QA availability, original source-reviewed lessons, tests, deployment and remaining gates |
| Dependencies | Approved canonical 419 Labs, existing Market Tutor, actual Supabase RLS, plan grants, encrypted QA identities, independent editorial reviewer |

## 1. Sitewide CI — verified exact-commit baseline, later changes open

Full configured Sitewide Playwright & Stripe Noncharging Regression workflow [run 41225322722](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41225322722) **succeeded** for commit `15629348f2fa2cc0671fcdd2d2eb4e688613264e`. Both Website Playwright and mocked Stripe lifecycle jobs completed. OHLC chart-first, hidden assessment boundaries, Academy private progress and account-switch coverage were included. This establishes exact-commit acceptance, not acceptance of later commits.

Run `41227321592` on `4d756e738c2295fe9ae20b1b9c89e91055b17cc7` was later **cancelled** by concurrent main activity. Run `41227774040` on `3b6d1201106ba32c914bf1d3f286758416975345` was also cancelled. This is not evidence of a failed assertion or of successful latest-commit testing.

The workflow's existing concurrency policy isolates deliberate manual dispatch and reruns by `run_id`. For a release acceptance attempt on the final stable commit, run `workflow_dispatch` manually or rerun the current exact-commit sitewide job; do not weaken assertions or bypass tests. GitHub's automated push checks may be cancelled by rapid concurrent source changes. Sitewide completion and exact Cloudflare deployment must both be rechecked at final SHA.

## 2. Genuine Founding 14/30/60 — production evidence and gated browser test

Read-only SQL reverified the authoritative production `platform_plans`, `user_plan_grants` and `site_subscriptions` tables on October 31, 2026. Plans `FOUNDING_14`, `FOUNDING_30`, and `FOUNDING_60` are active with `includes_all_tools=true`, but **each has zero active real grants and zero active/trialing subscriptions**. Zero paying Founder customers prelaunch is expected and not by itself a release defect.

A genuine Free Tutor session **cannot** certify Founding access because authorized Free Tutor is separately available. Founder-specific acceptance requires checking the verified signed-in identity, that identity's own RLS-visible active plan grant or subscription, the current plan window, and the protected Tutor route.

**Implemented manual-only browser gate:**
- `tests/test_talia_founding_real_browser_v1.mjs`
- `.github/workflows/talia-founding-three-real-browser-qa-v1.yml`
- Static syntax gate included in the existing Market Tutor Trust workflow. No secrets or account records copied into source.

The browser test accepts **three separate encrypted QA logins and user IDs** from GitHub Actions secrets named `FOUNDING_14_QA_EMAIL`, `FOUNDING_14_QA_PASSWORD`, `FOUNDING_14_QA_USER_ID`, and corresponding `30` and `60` variants. If any account is absent the run refuses to report a pass. It checks the actual Supabase GoTrue session, original user ID, member-owned RLS plan rows, an active period, authoritatively granted Market Tutor, source-based Learn/Assess responses, source-link rendering, no grading/mastery/history or paid AI, then verified logout.

If a grant is noncommercial Admin QA (not a provider subscription), the test additionally requires owner-controlled immutable `app_metadata.smfgu_qa_only`, `noncommercial` and matching `qa_target_plan`. For a genuine paid subscription it requires a matching eligible Founder RPC/current plan. A noncommercial grant is **never presented as real paid-customer lifecycle acceptance**. The manual QA workflow makes no plan grants, purchases, Stripe calls, account creations, CAPTCHA bypass or access-policy changes.

**BLOCKER:** All three real plan logins and legitimate active plan evidence are absent in the current inspection. The existing owner-only `Membership Test Accounts` Admin panel can create noncommercial users but expressly does **not** issue Founding plan grants. Appropriate, auditable QA entitlement provisioning must therefore be performed through an authorized Owner/Admin access workflow before the manual browser test can succeed. Do not directly manufacture paid Founder identities or consume the 600 commercial capacity for QA. No production member records were changed by this continuation.

## 3. Four original source-reviewed lessons — technical implementation

The user's supplied controlled packet is retained verbatim as `2026-10-31_four_lesson_editorial_packet_v1.json` (document ID `SMFGU-TALIA-REVIEW-027A`). Its four previously frozen source-review entries are **PENDING**, each with `independentReviewer=null` and `assessmentPublicationAuthorized=false`. Owner-supplied SHA-256 strings are retained as provided metadata; they are **not asserted to be post-edit content checksums** without a documented normalization/serialization rule.

The existing `data/tutor-lab-claim-evidence-v1.json` now contains additional original learning-objective, evidence-procedure and fresh **unsolved** transfer fields for four exact canonical Lab records:
- `F2-C04-L01` — bid/ask/last, midpoint and quoted-size limits (SEC original bid/ask definition). Fictional fresh transfer: 19.95/20.10 spread $0.15/share; mathematical midpoint $20.025, not proof of a fill.
- `F2-C04-L02` — quote widths versus liquidity; correct SEC liquidity glossary replaces a generic FINRA disclosure-document URL. The fictional 8.40/8.48 vs 8.40/8.56 widths are $0.08 and $0.16/share; neither guarantees a 1,000-share execution.
- `DT-C41-L01` — market order execution uncertainty; $6.00 last trade, $6.08 ask for 25 shares and a proposed 200-share market buy cannot establish a full-order execution price.
- `DT-C41-L02` — marketable buy limit $6.10 versus ask $6.08 for only ten shares; the price ceiling is not a full-fill guarantee.

The existing `functions/_lib/tutor-lab-context-v014149.js` checks the optional fields as a complete group, requires minimum substantive length, and falls back to original approved Lab guidance if malformed. It displays objectives/evidence procedures and fresh transfer in **ungraded non-Assess stages only**. Protected Assess continues to expose only concept boundaries and the allowed primary source; private keys, future bars, answer feedback and grades remain inaccessible. No second Tutor, model provider or private database has been introduced.

**Test added:** `tests/test_talia_four_lesson_editorial_packet_v1.mjs` validates exact source, canonical title, owner-supplied review status, original fictional cases, an independently recomputed midpoint/spreads, fill-size uncertainty and no fabricated reviewer; `tests/test_tutor_lab_claim_evidence_v1.mjs` now checks Learn versus Assess and malformed optional-field fallback. Both are wired to the existing Market Tutor Trust workflow.

Independent source confirmation: SEC Investor.gov Bid Price/Ask Price glossary and Liquidity glossary, and the SEC Types of Orders educational page, independently support the **general** bid/ask, liquidity, market-price and buy-limit concepts. They do not verify any fictional fills, charts, historical trades, user outcomes, protected assessments or the complete lesson. External copyrighted content is linked and independently summarized, not bulk ingested.

**Editorial disposition:** TECHNICAL SOURCE PREFLIGHT REVIEWED; **INDEPENDENT EDITORIAL DECISION PENDING** for all four. A separate named independent reviewer must verify objective fit, original arithmetic, common failure, unsolved transfer, source date/rights and assessment boundaries before approving a complete Lab. The other 415 canonical Labs and 252 Academy positions continue under their individual source-integrity queues; no general-source or code-test pass certifies them.

## 4. QA, release and governance restrictions

All new code changes are to GitHub `main`, using current contents/blob SHA to avoid overwriting concurrent work. Cloudflare Pages, source/build, Tutor CI, sitewide Chromium, and any authenticated member tests must be reported separately at exact commit. The Project does not approve unverified data as historical execution, trading returns, order-flow motives, independent mastery or a paid AI call.

**Release classification:** PARTIALLY IMPLEMENTED — NOT ACCEPTED. Historical sitewide acceptance passed for its exact prior commit; four source-reviewed lessons are implemented and protected; an honest three-plan genuine Founder browser test exists but remains blocked by missing valid identities/entitlements; independent editorial signoff remains required.

## Revision history

| Version | Date | Change |
|---|---|---|
| v1.0 (archived) | 2026-10-31 | Prior local handoff: successful earlier sitewide run, zero Founder members, pending four-lesson packet, remote mutation originally blocked |
| v2.0 | 2026-10-31 | Archived handoff and editorial packet to GitHub, integrated four protected source lesson enrichments, added exact QA access gate, source/Assess tests and verified zero Founder grants |

**Footer:** This document reports evidence and unresolved gates, not investment advice, customer subscription status, licensed trade outcomes or independent editorial approval.

## Version 2.1 — independent citation-scope correction and additional verified sources

The four original owner-provided editorial decisions remain `PENDING`. Technical source review found that single-source claims needed complementary references to support their *execution uncertainty* or *quote-definition* components. The exact original references remain unchanged, while all four records now have a bounded `supplementarySourceUrls` field:
- `F2-C04-L01`: SEC Bid Price/Ask Price glossary is appropriate for quote and spread definitions; SEC [Executing an Order](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order) separately supports the limitation that an observed quote or last trade is not a guaranteed later execution.
- `F2-C04-L02`: SEC [Liquidity](https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability) supports liquidity/price-impact limitations; SEC [Bid Price/Ask Price](https://www.investor.gov/introduction-investing/investing-basics/glossary/ask-price) separately supports the arithmetic definition of the spread.
- `DT-C41-L01`: SEC Types of Orders describes market-order price uncertainty; SEC Executing an Order addresses displayed order quantity and execution latency.
- `DT-C41-L02`: SEC Types of Orders supports the ceiling on a buy-limit execution price, while SEC Executing an Order describes why a displayed quote is not proof of eventual complete fill.

The original fictional transfer cases remain non-historical and unsolved. The existing Tutor loader validates secondary URLs against its exact regulator-domain allowlist, rejects malformed/duplicate/unbounded references, and fails closed to original approved guidance when the optional research asset is invalid. The existing Tutor API and member interface display the primary and supplementary SEC links without allowing arbitrary URLs or introducing additional scraping/provider requests.

**Related changes (main):** `105bb69a` (source set v1.4); `48024319` (source schema and rendering); `fa149d48` (structured citations); `169e342a` (citation test); `d49e563a` (poisoned source/link regression). Content remains outside Assess, with the SEC link permitted as educational reference.

**Review caveat:** The SEC ask-price page did not reliably load through one direct fetch, but its official search result with exact definition and the official glossary listing were available. Do not assert a fresh direct-page fetch occurred. No historical exchange data, proprietary chart, execution record, independent editorial decision or consumer investment advice follows from the source correction.

**Editorial disposition remains:** four technical evidence reviews ready for a separately named independent reviewer; no assessment publication, mastery, protected answer key or whole-Lab acceptance permitted until that reviewer signs each decision.

### Revision history supplement
- **v2.1 — October 31, 2026:** added four narrowly validated SEC secondary sources and corresponding API/Tutor source-link protections; full editorial and production acceptance remain pending.

# Crownlight Lumens — Rewards, Wallet Integrity and Gifting Controls: Execution Evidence

| Document control | Value |
| --- | --- |
| Document ID | SMFGU-LUMEN-REWARDS-GIFTS-ACCEPTANCE-20261031-001 |
| Project | The Stock Market: From the Ground Up — Integrated V1 Completion |
| Filename | `2026-10-31_LUMEN_REWARDS_CATALOG_GIFT_REVERSAL_WALLET_QA_v1.md` |
| File type | Markdown |
| Version | 1.1 |
| Date | October 31, 2026 |
| Status | **ENGINEERING QA PARTIAL PASS; REWARDS, GIFTING AND FINAL RELEASE HELD** |
| Location | GitHub `main` → `docs/qa/` |
| Google Drive | No Drive copy created; no Google Drive file ID or folder established |
| Purpose | Record actions actually performed against protected service role, rollback-only QA, and live Cloudflare without falsely accepting unexecuted graded or legal gates |
| Dependencies | Supabase Auth, official protected grading/competency evidence, 419 canonical Labs, 10 Academy programs, existing single Crownlight Lumens wallet, `gu_lumen_completion_release_v1`, existing Stripe TEST acceptance, Cloudflare Pages |
| Decision authority | GPT-6 / OWNER_DELEGATED_AI_EDITOR for product architecture and noncommercial QA. No independent human-beta signature or licensed legal attestation inferred. |

## Previously accepted controls preserved

The authenticated James_Test Dashboard Chromium test (Actions run 41236175250) and genuine two-member Chart Studio, wallet-activity and private progress isolation (run 41236357869) remain accepted. Paid TEST checkout/refund evidence remains historical evidence; no LIVE payment was attempted. B001's frozen editorial decisions remain controlling.

## Changes executed on `main` and Supabase

1. **Protected staged earning catalog:** Migration `20261031_lumen_draft_catalog_429_v1.sql` seeded 419 Lab scopes at 2 Lumens each and ten Boot Camp scopes at the previously proposed amounts (15, 25, 35, 70, 95, 130, 180, 35, 35, 25). All 429 definitions are `published=false`, no reviewer impersonation, no member grants. These are product-planning values, not an existing earned award.
2. **Single authority for member-facing figures:** `functions/api/learning-reward-preview.js` now queries those exact 429 Supabase definitions plus the release flag; it no longer independently hardcodes amounts or claims a reward can be earned while the protected award gate is disabled. Actual live no-charge QA Actions run [41237338454](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237338454): **PASS** — catalog size, ten Boot Camps, Lab rate, amounts, disabled earning, and anonymous gift API denial.
3. **Protected assessment bridge:** Migration `20261031_lumen_protected_assessment_bridge_v1.sql` added the service-role-only `gu_lumen_issue_from_protected_assessment_v1` bridge from an independently approved `competency_evidence` system assessment to the existing idempotent once-only Lumen issuer. Requires approved official grading, scope/revision parity, score and critical-error checks, reviewer-attributed release evidence, and protected staff approval. Ungraded reflections cannot qualify.
4. **Gift dispute and reversal:** Migration `20261031_lumen_gifting_dispute_reversal_v1.sql` added staff-authorized, repeat-safe reversal. Unspent recipient credits are voided while their original earned sender credits are restored atomically. Previously spent gifts become open noncash disputes, never a silent negative wallet balance. Gifting remains disabled pending privacy/legal/security acceptance.
5. **Ledger-integrity snapshot:** Migration `20261031_lumen_private_wallet_integrity_v1.sql` added a service-only private check comparing authoritative current wallet summary to active credit buckets and checking award/gift references. `functions/api/member-lumen-integrity.js` exposes only the authenticated member's scoped status. `assets/js/crownlight-member-quickview-v1.js` now shows account-specific reconciliation status adjacent to recent wallet activity. Reversed gifts generate paired outgoing/restoration and incoming/voiding history entries rather than disappearing from member history.
6. **Regression execution:** Wallet/rewards/gifting source gate includes new API tests; genuine James_Test Chromium and two-identity privacy QA now also check wallet-integrity status. The latter updated runs were queued when this document version was prepared; do not cite them as successful before GitHub reports completion.

## Actually executed transaction-level tests

All synthetic credit activity ran in a Postgres `BEGIN ... ROLLBACK` transaction with the original two separately authenticated QA member identities as test fixtures.

- Earning disabled rejects official bridge; absent protected grading source rejects an award even after the TEST-only release flag is enabled inside the transaction.
- Synthetic noncustomer completion award of 25 Lumens credited once; duplicate request returned idempotent without minting another credit.
- Genuine QA account recipients with synthetic, TEST-only opt-in received a 10-Lumen gift; recipient available balance and sender balance reconciled.
- Authorized reversal restored original earned credit and zeroed the unspent recipient gift credit. Repeated reversal was idempotent. After one gift credit was partially spent, reversal instead created an open manual-review dispute within the rollback transaction, without restoring the sender prematurely.
- A missing recipient opt-in and out-of-range 201-Lumen gift were rejected in another rollback-only test.
- Separate read-only integrity checks for both `James_Test` and `QA_Secondary` returned `balanced=true`, zero invalid award links and zero invalid gift links.

**Persistent postflight:** 429 catalog definitions staged, 0 published rewards, 0 independently verified learning records, 0 award credits, 0 gifts, 0 disputes, 0 newly created reward/gift buckets. Release flags `learning_rewards_enabled=false`, `member_gifts_enabled=false`, `legal_gifting_clearance=false`. `authenticated` cannot directly invoke privileged reward issuance or reversal functions.

## Open acceptance gates; DO NOT self-certify

**Milestone 3 — Actual protected grading and rewards:** B001 / protected assessment human-beta independent case acceptance is not complete. No genuine independently reviewed protected completion record exists in the live authoritative evidence table. The bridge is implemented and fail-closed, but the end-to-end genuine grade → once-only real award cannot yet pass without such evidence and a separately approved activation.

**Milestone 4 — Published earning and real wallet settlement:** The full 429-item draft catalog and balances are server-reconciled. Individual award amounts remain unpublished, and no real awarded credits exist to compare against member transaction history. Finalize independent editorial / economics approval and verify a legitimate accepted earning through the actual protected grader before publication. Do not assume a truncated recent-activity list is a full lifetime cash/Lumen statement.

**Milestone 5 — Gifting:** Conditional atomic gifts/reversal and abuse denial were tested rollback-only. Actual irreversible or paid gifting must remain disabled until documented consumer/financial legal assessment, real opting-in member tests, fraud and anti-abuse acceptance, and staff operator API review. The connected AI's editorial and product-owner delegation is **not** a licensed professional legal signoff.

**Milestone 6 — Final exact release:** Must prove all REQUIRED GitHub CI checks completed successfully, no canceled or pending jobs in the accepted release set, and matching Cloudflare production commit. This is distinct from individual workflow success.

## Overall acceptance

Using the previously approved twelve equal engineering-and-acceptance milestones, **8/12 = 66.7%, reported as 67% accepted; 33% remains**. This work materially strengthens open milestones 3, 4 and 5 but does **not** count any of them as fully accepted absent required real signed assessment/financial/legal evidence. Production deployment success alone does not close milestone 6.

## Supplemental execution — service-only grading outbox and exact production CI

- **Assessment handoff:** Migration `20261031_lumen_protected_grade_outbox_v1.sql` deployed. The existing protected `competency_evidence` table now queues only independently graded, approved, released, human-beta-accepted `system_assessment` records; routine journal reflections are excluded. Service-role-only processor rechecks the approved grade, staff reviewer, award schedule and global release flag before invoking the existing exactly-once issuer.
- **Rollback-only trigger QA:** A synthetic passing protected-grade fixture entered the outbox within a transaction and an ungraded journal fixture did not. Both transactions rolled back. A disabled processor returned `issued=0, enabled=false`. Postflight verified zero queued production grades or persistent awards and no direct `authenticated` SELECT/EXECUTE access to the outbox or processor.
- **Complete Lumen activity scope:** Member private wallet history now includes mixed cash/Lumen reservation debit events and paired positive returned-credit events from the authoritative mixed checkout debit table; it never labels these as cash receipts. Production contained **zero** mixed-checkout intents and zero mixed debit rows when inspected, so this additional branch is source-tested but **not** real-commerce history accepted.
- **Real browser regression fixed:** The sitewide member quickview previously called `client.auth.onAuthStateChange` on a test stub lacking that method, which failed one sitewide Founders Commons browser check on commit `01281e6b`. Commit `3e4ed469` now checks for genuine Auth methods and also starts wallet integrity on initial Dashboard load. GitHub run `41241450647` passed wallet/reward/gift source checks and `41241450678` passed real James_Test Chromium. Cloudflare deployed exact `3e4ed469b8130b5a88de7d6bf71095cc9802fd26` successfully. The complete sitewide CI run `41241450715` required an isolated rerun, and its result is not represented here as accepted unless its current attempt reports success.
- **Signoff boundaries:** Internal engineering source and rollback-only QA evidence accepted by delegated owner/editorial operator. No genuine member earned an official protected reward, no actual transfer or real refund was initiated, no live paid charge was authorized, and no licensed legal review took place. All earning, gifting and grading activation holds remain unchanged.

## Revision history

| Date | Version | Action | Status |
| --- | --- | --- | --- |
| 2026-10-31 | 1.1 | Protected assessment outbox, synthetic positive/negative trigger tests, mixed checkout history, exact-deployment browser regression fix | Internal engineering QA recorded; activation holds unchanged |
| 2026-10-31 | 1.0 | Deployed protected catalog, assessment adapter, gift reversal/dispute, member wallet integrity; completed read-only and rollback QA | Partial engineering acceptance; earning, gifting and final release on hold |

Footer: Crown & Lantern Press / Cyber Nexus — internal QA and product-control document. Not licensed legal advice or proof of real protected assessment acceptance.

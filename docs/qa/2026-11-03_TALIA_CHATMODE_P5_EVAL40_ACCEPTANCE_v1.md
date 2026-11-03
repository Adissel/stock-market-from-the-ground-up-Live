# Talia Tutor — Chat Mode Package 5: Forty-Scenario Acceptance Contract

| Control | Value |
|---|---|
| Company / project | Cyber Nexus Publishing / Crown & Lantern Press — The Stock Market: From the Ground Up |
| Document ID | SMFGU-TALIA-CHAT-P5-EVAL40-001 |
| Version/date | 1.0 / 2026-11-03 |
| Filename/type | `docs/qa/2026-11-03_TALIA_CHATMODE_P5_EVAL40_ACCEPTANCE_v1.md` / Markdown |
| Data file | `data/talia-chat-mode-p5-eval40-acceptance-v1.json` / JSON |
| GitHub location | `Adissel/stock-market-from-the-ground-up-Live` / main |
| Google Drive/document ID | Not created/unassigned |
| Status | Chat Mode 40-case evidence and PASS/PARTIAL/FAIL contract complete; real-account and replay acceptance open |
| Dependencies | EVAL40 v2, actual evaluation function, original 45 internally reviewed topics, existing Auth/RLS, fictional replay and existing source-only Tutor API |

## Preserve the exact baseline without inflating it

- **Cases 001–020:** 20 source-only PASS. These are evidence-derived instructional source checks; they are not authenticated production, source-rights, editorial or full Tutor acceptance.
- **Cases 021–030:** 10 PARTIAL requiring `authenticated_same_member_continuity` and `cross_account_denial`.
- **Cases 031–040:** 10 PARTIAL requiring `authorized_chart_cutoff` and `no_future_candle`.
- Total: **20 PASS, 20 PARTIAL, 0 FAIL**, exactly as the existing evaluator reports. Do not mark 40 PASS based solely on scripted simulated booleans.

## Core evidence for all forty

Every case must show diagnosis, classification of a real specific misconception, targeted correction, a changed-input guided retry, independent transfer, the expected limitation, no grading or private answer exposure, and **correct mathematical reasoning where relevant**. Source formatter presence and numeric-looking text alone do not establish correct arithmetic. The existing `evaluateInstructionalCycle` function is preserved for regression compatibility, while the acceptance contract demands independent worked-math tests and human QA evidence.

### Authenticated follow-up cases: 021–030

Use two genuinely different authorized test member accounts through existing protected test credentials. Persist only with affirmative consent; reload saved conversation and verify same-member continuity. Verify cross-account forged-ID access is denied by server and database, that client state clears on identity change, and that sessions expired/revoked no longer authorize history. Do not grant staff roles or alter payments to obtain passing results. Log anonymized evidence and exact source/deployed SHA.

### Chart/historical cases: 031–040

Use original fictional or adequately licensed timestamped fixtures. Record decision cutoff and source history; verify every completed bar, trade or quote used in Tutor reasoning was available at the cutoff, excluding late reports or future candles. Exercise missing data and no-lookahead counterexamples. This is not proof of a live exchange-feed right or official grading.

## Outcome decision table

| Result | Required evidence |
|---|---|
| PASS | All core educational checks and each required authentic external gate verified, exact SHA and sanitized logs attached |
| PARTIAL | Core checks pass but a specified external/authenticated/chart check remains unverified |
| FAIL | A source-core check fails, math is wrong, or unauthorized member/grade/future data leaks |

The data file defines **40 individual test IDs**, topic-specific source prompts/limitations/transfers, exact required external keys, execution steps and evidence schema. No independent publisher acceptance can be inferred from any result.

## Codex handoff

Use existing authenticated Tutor/history endpoints, members' confirmed entitlements and a server-owned completed-bar or authorized replay contract. Add repeatable test fixtures and a genuine two-account browser harness. Do not rewrite 600 lessons or modify billing. Preserve the specific 20 source PASS findings and do not change their category to manufacture 40 live PASS.

## Revision

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-03 | Individualized 40 case IDs with actual expected external evidence; preserved evidence-derived status and release holds |

Footer — SMFGU-TALIA-CHAT-P5-EVAL40-001 · v1.0 · No member release or independent signoff.

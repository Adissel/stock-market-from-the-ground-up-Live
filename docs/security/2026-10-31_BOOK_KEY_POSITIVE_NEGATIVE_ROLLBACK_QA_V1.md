# Book Key Redemption — Production PostgreSQL Rollback-Only Positive/Negative QA

**Document ID:** SMFGU-SEC-BOOKKEY-QA-019  
**Company:** Crown & Lantern Press / Cyber Nexus  
**Project:** The Stock Market: From the Ground Up — Authentication / Book Key  
**GitHub location:** cybernexuspublishing/stock-market-from-the-ground-up/docs/security/ (main)  
**File name/type:** 2026-10-31_BOOK_KEY_POSITIVE_NEGATIVE_ROLLBACK_QA_V1.md / Markdown  
**Version / date:** 1.0 / October 31, 2026  
**Google Drive location/document ID:** Not created; unassigned.  
**Status:** ACCEPTED for **database-function contract QA only**; native CAPTCHA/browser and entire security gate remain HOLD.  
**Purpose:** Preserve actual SQL function test evidence for accepted, duplicate, expired, inactive, missing and throttled codes without exposing a private customer Book Key or leaving QA entitlements.  
**Dependencies:** Applied 20261031_book_key_member_only_throttle_v1.sql; actual redeem_book_key(text), apply_book_key_for_user(uuid,bigint); private attempt table; existing GoTrue QA actor.

## Method and classification

A connected production Supabase PostgreSQL test executed **BEGIN; DO; ROLLBACK; SELECT** in one query. It selected the single existing noncommercial QA actor from private attempt records, set a temporary JWT request claim for this SQL session, generated three fresh random synthetically hashed keys in a transaction (valid, expired, inactive), and briefly reset that actor's existing attempt counter. This is **SQL-function testing in a simulated authenticated context**, NOT a real native GoTrue login, human browser flow or customer registration. No production real Book Key plaintext or actual customer key was accessed.

After each temporary code was submitted to the genuine production redeem_book_key function, the test checked response status and the transient entitlement/redemption fields. **The full transaction, including keys, 30-day grant and attempt-counter changes, was rolled back.** No Stripe/payment operations were performed.

## Verified outcomes

| Contract case | Test result |
|---|---|
| Valid active synthetic key | **PASS:** accepted, one temporary redemption and 30-day trialing full_learning_access entitlement |
| Repeated valid key | **PASS:** already_redeemed, no duplicate redemption |
| Expired candidate | **PASS:** invalid |
| Inactive candidate | **PASS:** invalid |
| Unknown candidate | **PASS:** invalid |
| Sixth attempt in same 60-minute window | **PASS:** rate_limited |
| Explicit transaction rollback | **PASS:** production catalog remains **3** keys, **0** stored redemptions, original QA attempt table **1** actor row |

The SQL tool returned **PASS** after postflight; this result was actually observed, not inferred. Postgres identity-sequence consumption may not roll back, but no persistent catalog key, entitlement or redemption was created.

## Independent real authenticated negative test

The separate genuine noncommercial QA GoTrue user test passed [Actions 41245509418](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41245509418), verifying five wrong codes, the sixth limit and protected public/member RPC and ledger permissions. That test and the rollback SQL test prove different scopes; neither constitutes a real native positive UI redemption.

## Owner disposition and unresolved gates

**ACCEPT function-level positive/duplicate/expired/inactive/throttle behavior**, with zero durable QA entitlements. Keep **Gate 22 PARTIAL** until real native registration/CAPTCHA/email verification, a valid noncommercial member Settings UI redemption, multi-role authorization checks, concurrency controls and accessible user errors have been demonstrated. Keep Gate 24 full release gate HOLD. Never represent this work as an independent human penetration test or regulatory certification.

**Reviewer:** GPT-6 acting under the delegated Owner/internal engineering QA function; not a separately accountable human security reviewer.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-31 | Production rollback-only Book Key function test and no-persistence postflight |

**Footer:** Crown & Lantern Press — confidential internal QA evidence; no customer account, membership entitlement or monetary transaction permanently modified.

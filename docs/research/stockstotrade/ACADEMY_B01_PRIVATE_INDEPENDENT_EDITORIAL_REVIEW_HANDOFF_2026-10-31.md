# B01 — Private Independent Assessment Editorial Review Handoff

**Document ID:** SMFGU-B01-PROTECTED-REVIEW-002  
**Company:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up — B01 Protected Assessment  
**Version:** 1.1  
**Prepared:** October 31, 2026  
**Status:** DRAFT; AWAITING SEPARATE, ATTRIBUTABLE HUMAN EDITORIAL DECISIONS  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main` only  
**File/type:** `docs/research/stockstotrade/ACADEMY_B01_PRIVATE_INDEPENDENT_EDITORIAL_REVIEW_HANDOFF_2026-10-31.md` / Markdown  
**Google Drive:** No file created. Drive location and Drive document ID not assigned  
**Dependencies:** `252_instruction_source_field_QA_v2.csv`; `MASTER_671_ROW_EVIDENCE_AND_ACCEPTANCE_v1.csv`; 20 private `lab_training_sets_v014` version-98 Draft records; `functions/api/interactive-training.js`; genuine-member API and browser evidence  
**Purpose:** Hand off the actual private assessment to an independent reviewer without publishing confidential prompts, answers, answer keys or scoring rubrics in GitHub.

## Source of truth and security

- The 252-day and 671-row registers alone control final editorial acceptance. This document is a supplementary *review assignment and evidence receipt*, not a new approval system.
- The original version-97 B01 teaching decisions and private question sets remain frozen. All 20 version-98 sets are **Draft**, with 0 learner attempts, 0 reviewer sign-offs and 0 independently approved feedback entries.
- Confidential question texts, correct keys, selected-option feedback and grading rules remain in service-role-restricted Supabase rows. Reviewers must use a separately authenticated, authorized access path; do not paste a private question or key in a GitHub issue, commit, link preview or public artifact.
- As of this handoff the preflight examined the 100 choice stems/alternatives and 20 numeric prompts, and **200 individually reworded incorrect-option coaching drafts** were stored privately. They are identified as AI-authored Drafts. Text uniqueness is not proof of independent editorial quality.

## Review inventory — 20 private sets

Each set contains 6 prompts: 5 multiple-choice and 1 numerical. Each choice question has 2 incorrect-option coaching drafts (10 per set).

| Private Lab ID | Concept | Independent review emphasis | Choice / numeric / feedback | Independent disposition |
|---|---|---|---|---|
| `F1-C02-L01` | Replay finality and correct timestamp | Bar finality, delivery before pause | 5 / 1 / 10 | UNREVIEWED |
| `F1-C02-L02` | Blind replay independence | Future-bar contamination | 5 / 1 / 10 | UNREVIEWED |
| `F1-C04-L01` | Secondary shares | Issuer issuance vs seller proceeds | 5 / 1 / 10 | UNREVIEWED |
| `F1-C06-L01` | OHLC vs participant motive | Observed body vs inference | 5 / 1 / 10 | UNREVIEWED |
| `F1-C07-L01` | Common stock share fraction | Equity class vs dividends | 5 / 1 / 10 | UNREVIEWED |
| `F1-C07-L02` | Index vs ETF | Points, price and tracking | 5 / 1 / 10 | UNREVIEWED |
| `F1-C08-L01` | Market capitalization | Share count and trading liquidity | 5 / 1 / 10 | UNREVIEWED |
| `F1-C08-L02` | Reverse split and market value | Scale, reciprocal shares | 5 / 1 / 10 | UNREVIEWED |
| `F1-C08-L03` | Bid–ask spread | Displayed quote vs fill | 5 / 1 / 10 | UNREVIEWED |
| `F1-C09-L01` | Buying-power arithmetic | Account size vs prudent risk | 5 / 1 / 10 | UNREVIEWED |
| `F1-C10-L01` | Long unrealized losses | Mark vs realized fill | 5 / 1 / 10 | UNREVIEWED |
| `F1-C10-L02` | Short adverse movement | Borrow fees and uncapped exposure | 5 / 1 / 10 | UNREVIEWED |
| `F1-C12-L01` | Filing and tradability | Two independent trade vetoes | 5 / 1 / 10 | UNREVIEWED |
| `F1-C13-L01` | Scalping duration | Intent vs actual overnight risk | 5 / 1 / 10 | UNREVIEWED |
| `F1-C13-L02` | Setup vs trading style | Spread as execution veto | 5 / 1 / 10 | UNREVIEWED |
| `F2-C01-L01` | Trading sessions | Pre/post eligibility and shortened day | 5 / 1 / 10 | UNREVIEWED |
| `F2-C02-L01` | Intraday volume | Comparability and pattern extrapolation | 5 / 1 / 10 | UNREVIEWED |
| `F2-C02-L02` | Candle ranges | Amplitude vs direction | 5 / 1 / 10 | UNREVIEWED |
| `F2-C02-L03` | Preclose quote | Closing auction is not quote | 5 / 1 / 10 | UNREVIEWED |
| `F2-C03-L01` | After-hours print | Rounded 3.06% vs executable return | 5 / 1 / 10 | UNREVIEWED |

Total = **100 choice + 20 numeric questions + 200 individual wrong-answer explanations**.

## Mandatory per-question decision — no automatic approvals

For each **choice** question, the independent reviewer must inspect the full private case, all three alternatives, the actual correct-answer key, the explanation and the TWO separately rewritten misconception corrections. Confirm a single defensible correct option; plausible and distinct distractors; time-consistent evidence; proportional cognitive load; no unintentional cues or answer-position shortcuts; false-positive/NO TRADE outcomes where appropriate; and distinct feedback that explains *why that particular wrong selection fails*. Unclear, repetitive or trivial distractors require authored replacement and a subsequent independent recheck.

For each **numerical** question, independently calculate the source values and correct result, record units and denominator, test required rounding precision and accepted numeric inputs, check any partial credit, and verify the post-submission explanation. The server accepts **numeric-only** responses. For the illustrative after-hours percentage case, version 98 currently uses a **0.0049 percentage-point** tolerance around the two-decimal expected result to accommodate legitimate intermediate precision. This is an AI-proposed Draft policy, **not** an accepted rubric.

For each reviewed decision, record **reviewer user UUID, independent reviewer role, reviewed UTC date, case/evidence reference, specific decision `APPROVE` or `REVISE` and documented rationale**. A source author, automated script or generic “reviewed” database flag must not stand in for independent case-level sign-off. Confirm explicit source/market-data and hindsight restrictions.

## Secure gating and implementation

The authenticated API now requires both an attributed reviewed set and option-level `independentReview` metadata before using special post-answer corrective feedback. Incomplete attribution, AI-only Drafts, generic copied feedback and unreviewed set versions continue to receive the existing safe general feedback. Protected official B01 assessment start, resume and answer remain restricted while pending-review `source_status` is present; guided/practice/blind educational paths remain usable where entitled.

Do **not** set `review_state='reviewed'`, set `reviewed_at`, promote a feedback status, change answer keys, unlock competency awards or update the controlling registers without independent evidence. Changes in this document alone **never** release grades.

## Owner-assigned AI reviewer and beta-test human validation

**Owner directive:** GPT-6 is assigned the working **AI content reviewer** for all currently incomplete source, instructional, numerical, and confidential assessment checks. This is a legitimate delegated authoring/editing and evidence-gathering role; it is **not** an independently qualified human signature. Earlier AI-authored source triage, 42-day rework decisions, numeric checks and 200 correction drafts remain credited to the AI; do not relabel them as human decisions.

**Human editorial cohort:** The Owner separately designated actual eligible beta testers to perform attributable human reading and review. They can submit independent feedback; qualified reviewers chosen for restricted confidential review are distinct from answer-blind test participants. Track B needs a newly tested least-privilege permission route; no unrestricted private key release is authorized.

The AI reviewer must review the **actual** source, answer and option material, document clear individual findings and revisions, and identify uncertainty. A reviewer signoff requires a genuinely separate authenticated human review event, scope, evidence, case/version hash and explicitly recorded decision, not a fictitious name or scripted approval. No v97 frozen rubric, v98 Draft status, private answer key or official member grade may be promoted solely because the Owner assigned GPT-6 as reviewer.

**Current record:** no participating beta editor has signed a question or day; the 42 study-day and 20 private set editorial acceptance gates remain open.

## Review receipt / sign-off fields

**Assigned independent editor:** UNASSIGNED  
**Independent editor authenticated ID:** NOT RECORDED  
**Private questions assessed:** 0 / 120 signed  
**Individual wrong-answer explanations signed:** 0 / 200  
**Private sets accepted:** 0 / 20  
**Reviewer evidence reference:** NOT ISSUED  
**Controlling 252/671 approval updates:** NONE  
**Final technical/API acceptance:** Requires an independent true graded test using a newly approved version after sign-off; existing 22-day browser tests were ungraded.

## Revision history

| Version | Date | Change | Approval |
|---|---|---|---|
| 1.0 | 2026-10-31 | Case-specific secure reviewer handoff, required evidence, numerical precision and distinct answer-feedback checks | DRAFT — independent review open |
| 1.1 | 2026-10-31 | Owner assigned GPT-6 as accountable working AI reviewer; beta testers remain separate human validation cohort | AI findings authorized; no human signoff, protected grade release remains HOLD |

**Footer:** Crown & Lantern Press / Cyber Nexus. Confidential grading content resides in protected Supabase only. Nothing in this handoff is a trading signal, financial advice, independent audit certification or protected grade approval.

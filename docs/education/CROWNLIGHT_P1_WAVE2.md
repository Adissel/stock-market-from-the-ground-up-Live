# Crownlight P1 Chart Investigation Toolkit — Wave 2
Project: THE STOCK MARKET: FROM THE GROUND UP
Version: 1.1.0
Document status: Implementation candidate; independent member and accessibility acceptance outstanding
Date: 2026-11-03
File: docs/education/CROWNLIGHT_P1_WAVE2.md (Markdown)
Google Drive location / document ID: Not created; no connected Drive write.

## New execution scope
Added Market Structure Builder, Pattern Comparison Lab and Wick and Rejection Investigator to the existing optional, ungraded authorized member Lab interface. The original Candle Anatomy Explorer, Candle-by-Candle Investigation and 1-, 3-, 5-minute Microscope are preserved. The two added fictional datasets explicitly demonstrate that an OHLC candle does not establish intrabar high/low order, and similar shapes do not establish similar context.

## Mathematical, teaching and data safeguards
The numeric core validates only the revealed chronological prefix, not unseen future data. Strict three-bar pivots require a completed bar on both sides; the active forming bar does not confirm a high or low. The learner must choose a swing point before drawing it. All source data is fictional and locally authored. No read/write access to member progress, Supabase, protected grading, accounts, payments or external market data is added.

## Acceptance gates
- [ ] Exact commit CI green including new 40+ regression cases
- [ ] Authenticated Guided/Practice Lab browser verification on canonical candle lessons
- [ ] Negative authorization and protected assessment/Blind mode tests
- [ ] Keyboard, small-screen, reduced motion and screen-reader testing
- [ ] Verify progress persistence remains canonical and no alternate records are written
- [ ] Confirm the Cloudflare deployed SHA matches the accepted GitHub SHA
- [ ] Validate instructions and fictional-context limitations with independent editorial review

## Rollback
Revert the P1 Wave 2 source commit; there is no SQL migration or persistent member state to roll back.

## Revision
1.1.0 | 2026-11-03 | Extended P1 fictional investigations and removed future-validation dependency.

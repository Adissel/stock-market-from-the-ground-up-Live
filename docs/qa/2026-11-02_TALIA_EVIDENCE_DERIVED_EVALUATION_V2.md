# Talia EVAL40 — Evidence-Derived Methodology v2

Status: **Source methodology implemented and tested. Authenticated, chart, accessibility, independent editorial, production and release acceptance remain open.**

## Correction

The former EVAL40 test printed PASS for foundational/mathematical categories and PARTIAL for misconception/historical categories. Its source assertions were useful, but category-based result assignment did not satisfy the controlling methodology gate.

`functions/_lib/talia-instructional-evaluation-v1.js` now derives each result from observed evidence:

- diagnostic question present;
- mathematical, conceptual, interpretive or process misconception classified;
- targeted correction present;
- guided retry uses the specific misconception and a different transfer;
- independent transfer is present and differs from the worked case;
- limitation is preserved;
- no unofficial grade/mastery claim;
- mathematical scenarios expose calculation reasoning;
- explicitly required authenticated or chart evidence is present.

A failed core teaching check produces `FAIL`. A complete core cycle with missing required external evidence produces `PARTIAL`. Complete required evidence produces `PASS`. Category does not select the result; the same scenario is regression-tested in all three states by changing its evidence.

## Current result

The preserved forty scenarios remain **20 PASS / 20 PARTIAL / 0 FAIL**, now for evidence-derived reasons. All forty source scenarios demonstrate diagnosis, misconception classification, correction, guided retry and independent transfer. Ten multi-turn scenarios remain partial pending authenticated same-member continuity and cross-account denial. Ten historical scenarios remain partial pending authorized chart-cutoff and no-future-candle evidence.

This closes source implementation for execution Gates 1 and 2 and advances Gates 11–20. It does not close membership, history, chart, Lab/Academy, accessibility, editorial, CI/deployment or final-register acceptance.

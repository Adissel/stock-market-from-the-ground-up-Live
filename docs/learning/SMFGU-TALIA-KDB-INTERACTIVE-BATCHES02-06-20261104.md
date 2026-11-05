# Talia Classroom — Knowledge Database Interactive Lesson Batches 02–06

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Interactive Classroom |
| Document ID | SMFGU-TALIA-KDB-INTERACTIVE-ALL-245-20261104 |
| Filename | docs/learning/SMFGU-TALIA-KDB-INTERACTIVE-BATCHES02-06-20261104.md |
| File type | Markdown (.md) |
| Version / date | 1.0 / November 4, 2026 |
| Status | Source-derived engineering candidate; CI and independent article-level editorial and learner acceptance required |
| Google Drive | Not created; GitHub draft branch is the source of record |
| Google Drive document ID | Unassigned |
| Purpose | Convert all remaining 229 published Knowledge Database articles to individual source-linked nine-stage interactive teaching journeys, alongside 16 previously authored first-wave lessons |
| Dependencies | Existing Cloudflare/Supabase article permissions; original 30 competencies; canonical 419 Labs; Shared Learning Engine v3.3, Lab Engine v3.2; authorized Talia Tutor entitlement |
| New files required | Five source-register batches, public metadata-only index, source-driven runner, searchable Classroom directory, stylesheet integration, regression tests, and existing page/build changes |

## Quantified source reconciliation

Published, visible, nondeleted original Knowledge articles: 245. Prior fully authored Wave 1: 16 articles with 48 tested original fictional scenarios. Unconverted articles before this work: 229. Each of 229 records is tied to the canonical Knowledge Database slug, exact title, subject, learning level, source-host inventory, and source-section availability. 245/245 articles have Independent application and Self-check and answer guide sections. 244/245 use the same original Instructor explanation and Fictional exercise headings; the remaining Simple Moving Average (SMA) article uses its distinct "Explanation" and "Fictional case and independent self-check" headings, which are explicitly supported. All 245 have an evidence-limits section and at least one referenced source candidate.

The additional 229 lessons are not individually reauthored 48-case numerical packages. Their instructional steps are generated from existing topic-specific original research prose served after per-member authorization, then completed interactively with the learner's open responses. A programmatic written response and source guide are not proof of mathematical correctness; any future graded assessments must have independent rubrics and numerical validators.

### Batch execution register

| Batch | Registered new interactive lessons | Source file | Controlled acceptance |
|---|---:|---|---|
| 02 | 50 | data/talia-kdb-interactive-batch02-v1.json | Original source cases, guided reasoning and no-lookahead practice; review open |
| 03 | 50 | data/talia-kdb-interactive-batch03-v1.json | Indicator/strategy research guided practice; review open |
| 04 | 50 | data/talia-kdb-interactive-batch04-v1.json | Strategy/watchlist/foundational applied scenarios; review open |
| 05 | 50 | data/talia-kdb-interactive-batch05-v1.json | Financial, macroeconomic and engineering original article applications; review open |
| 06 | 29 | data/talia-kdb-interactive-batch06-v1.json | Quantitative, market microstructure and research controls; review open |
| **02–06** | **229** | Five independent JSON metadata packs | Engineering candidate |

## Functional nine-stage interface

1. **Start:** Learning objective, article subject, planned evidence and limitation.
2. **Learn:** Actual authorized article definition, formula/method and observation controls.
3. **Experiment:** Original article's fictional numerical or classification case; learner enters reasoning before source instructor explanation.
4. **Predict:** Conditional hypothesis and specific source-based counterexample; no future price inference.
5. **Practice:** Independently apply the article's own distinct application case; revise work and compare the described procedure.
6. **Assess:** Explicit UNGRADED learner self-check; answer-guide text concealed inside the stage until response, no protected official grades.
7. **Review:** Learner's attempted reasoning, original worked explanation, common misconception and source limitations.
8. **Transfer:** Changed parameter, observation cutoff or input and alternative invalidation on a different fictional case; original reasoning only.
9. **Results:** Browser-only response count and boundary disclosure; no claims of mastery.

The lessons are integrated within the existing authenticated Knowledge article page. The Talia Classroom page also offers a searchable public-metadata-only lesson directory linking to this authorized learning journey. The original six Tutor topics, membership-controlled Tutor depth, article access control and learning engine remain intact.

## Sources independently consulted for category-level validation

- SEC Investor.gov — order types: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14
- SEC Investor.gov — stop and stop-limit orders: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15
- SEC EDGAR API documentation: https://www.sec.gov/search-filings/edgar-application-programming-interfaces
- FINRA intraday trading education (current rule transition must be checked): https://syndication.finra.org/content/frequent-intraday-trading-understanding-basics
- FINRA intraday-margin change guidance: https://syndication.finra.org/content/understanding-new-intraday-margin-requirements
- Options Industry Council — Greeks: https://prd-web.optionseducation.org/advancedconcepts/understanding-options-greeks
- Federal Reserve Bank of St. Louis — FRED vintage observations: https://fred.stlouisfed.org/docs/api/fred/series_observations.html
- ChartSchool — indicator definitions: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators

These external sources were compared at the category level. Their availability and topical relevance do NOT certify all 229 specific calculations or article claims. Each manifest retains REQUIRES_INDEPENDENT_ITEM_LEVEL_VERIFICATION until qualified editorial assessment. Do not generalize strategy research into profitable, tradeable or broker-executed methods.

## Security and access

Access is checked by the preexisting authenticated Cloudflare /api/knowledge-library?action=read endpoint before a lesson receives an article body. The public static manifest contains only already-public article titles, slugs, subjects and source-section flags. It contains no paywalled article text, credentials, member records, rubric keys or market feed. No request-time external AI service, student history write, official grading, Lumens event, payment, entitlements, Supabase schema change or broker trade. Always distinguish a publisher's content status from independent math, science, regulatory and rights approval.

## Acceptance gates

- Register exactly 16 + 229 = 245 disjoint slugs and all five batches, with no unlicensed text in publicly built assets.
- Verify safe, original nine-stage progression and signed-in article authorization boundaries.
- Run JavaScript syntax checks and the two deterministic Talia Knowledge lesson suites in the existing Cloudflare site build.
- Run genuine authorized Free, Founding 14/30/60 and restricted member journeys, including two-account privacy, keyboard, mobile and screen-reader acceptance.
- Complete independent mathematical/financial claim validation, current regulatory checks, rights and editorial sign-offs.
- Verify exact merged GitHub SHA, all mandatory workflows green and corresponding production Cloudflare deployment before declaring the release LIVE.

## Revision history

| Version | Date | Status | Change |
|---|---|---|---|
| 1.0 | 2026-11-04 | Engineering candidate | Registered and wired the remaining 229 original article-derived guided nine-stage lessons across five batches; preserved prior 16 source-validated math/decision lessons |

Footer: SMFGU-TALIA-KDB-INTERACTIVE-ALL-245-20261104 | v1.0 | 2026-11-04 | Research instruction only, not investment advice or independent regulatory certification.

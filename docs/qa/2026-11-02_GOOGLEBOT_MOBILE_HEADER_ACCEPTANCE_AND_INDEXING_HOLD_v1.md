# Googlebot Mobile Homepage Acceptance and Search Indexing Gate

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Public Homepage, Crownlight, Learning Systems |
| Document ID | SMFGU-SEO-MOBILE-ACCEPTANCE-20261102 |
| Filename / file type | `2026-11-02_GOOGLEBOT_MOBILE_HEADER_ACCEPTANCE_AND_INDEXING_HOLD_v1.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up` / `main` / `docs/qa/` |
| Google Drive location | Not created or synchronized; GitHub is the authoritative source |
| Google Drive document ID | Not assigned |
| Version | 1.0 |
| Decision / evidence date | November 2, 2026 |
| Document status | **Mobile header ACCEPTED; Google indexing/sitemap processing OPEN** |
| New document required | Yes — targeted Googlebot closure without reopening historical member acceptance |
| Dependencies | `assets/js/navigation.js`, `assets/css/mobile-auth.css`, `tests/test_googlebot_mobile_header_browser_v1.mjs`, `.github/workflows/homepage-mobile-header-chromium-v1.yml`, Search Console screenshots provided November 2, 2026, Cloudflare Pages |
| Purpose | Preserve real mobile Chromium and Owner Googlebot screenshot evidence; distinguish rendering from Google's indexing and XML sitemap ingestion |

## 1. Defect, remediation and verified visual acceptance

Original Google Inspection Tool mobile screenshot showed two simultaneously visible `Menu` controls. Independent real Chromium browser diagnostics reproduced:
- `.sm-shell-menu` (competing shell navigation) and `#v1341-mobile-menu` (canonical mobile drawer) both visible at 390, 600 and 768 CSS-pixel viewports.
- At 390 px the original site-header height was **186.21875 px**; at 600 and 768 px **136.828125 px**.
- Educational homepage H1 remained visible and HTTP response was 200.

Implemented fixes on `main`:
- `009b110d368997ab812cd099c08c18fd29ebe216`: suppress competing visible shell menu, preserve search/alerts and compact mobile header layout.
- `53e8073f755be7d301ce1f1cf210bcf73c7573ca`: retire late-injected shell duplicate, preserving approved member-aware drawer.
- `9345a5e7f22bf38339dfd2e474e151a4c1f5e434`: make Escape reliably dismiss the drawer before focus settles.

**Machine acceptance evidence:** [GitHub Actions run 41547596429](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41547596429), job 125626883213, latest completed attempt **SUCCESS**. Actual Playwright Chromium loaded the deployed public homepage at 390, 600, 768 and 1280 px. It passed one visible mobile menu, open/close by keyboard, Escape, click close, source accessibility state, search and alerts visibility, absence of horizontal overflow, accessible heading and HTTP 200. Test output includes `PASS real mobile header Chromium 4 viewports full keyboard and visible-menu acceptance`.

| Measured browser result | 390 px | 600 px | 768 px | 1280 px |
|---|---:|---:|---:|---:|
| Visible mobile menu buttons | 1 | 1 | 1 | 0 |
| Header height in CSS px | 119.0625 | 108.1875 | 108.1875 | 99.671875 |
| Search control visible | Yes | Yes | Yes | Yes |
| Alerts control visible | Yes | Yes | Yes | Yes |
| Horizontal overflow | No | No | No | No |

**Google-specific acceptance evidence:** The Owner supplied Google Search Console's **Tested page → Screenshot** (live test November 2, 2026, 5:53 PM local time), showing only one `☰ Menu`, a compact header, `Search site` and `Alerts`, the main educational headline, public Free Foundations/Academy/membership links, the 419-Labs summary, and a visible Crownlight fictional candlestick chart. The Search Console panel said **URL is available to Google**, **Page can be indexed**. These screenshots are evidence in the conversation, **not committed image binaries to the repository**.

**Decision:** ACCEPT the targeted Googlebot mobile rendering and accessibility defect. Do not repeat the mobile Owner walkthrough for unchanged source.

## 2. Separate Google Search index and sitemap gate — OPEN

- The site has one approved canonical origin: `https://stock-market-from-the-ground-up-d1r.pages.dev/`.
- Public `/sitemap.xml` and `/sitemap-v2.xml` both list **19 public canonical URLs**; `robots.txt` advertises them.
- Owner screenshots of Search Console **Sitemaps** report on November 2, 2026 stated `Couldn't fetch`/`Sitemap could not be read`, type `Unknown` and 0 discovered pages. The screenshot of live URL inspection separately showed successful XML retrieval.
- Live Google URL inspection and HTTPS report demonstrate crawler reachability, but **do not establish that the homepage is in Google's index**, or that Google has ingested a submitted sitemap. Search analytics API returning zero rows is likewise not proof of either indexing or deindexing.
- The connected Search Console data source returned one property record with null sitemap path/submit/download dates. This is not enough to override the Owner's specific Search Console screenshots.
- Preserve both current sitemap URLs. Do not resubmit repeatedly, invent indexed-page counts, expose private routes in `robots.txt`, or treat a successfully crawled XML file as successfully processed.

**Google external acceptance requires:** Search Console **Google Index** view for the homepage actually showing index status and the **Sitemaps** report showing successful processing/last read and the discovered URL count. These results cannot be certified using only current website-side checks.

## 3. Chart Studio and curriculum acceptance boundaries

- Historical real authenticated Standard, Advanced, Professional and two-account workspace acceptance remains preserved without re-requesting Owner tests. Independent historical successful jobs: [41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069), [41237482584](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237482584), and [41233580742](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233580742). Refer to `docs/qa/2026-11-02_OWNER_ACCEPTANCE_NO_REPEAT_CROSSWALK_v1.md`.
- Isolated Crownlight Chromium run 41518562107 and owner-approved Labs/Academy/Talia source integration run 41526308834 have successful jobs, **but this alone is not sitewide exact-production-commit certification**.
- Canonical 419 Labs and authored Boot Camps and related learning records retain standing Owner approval. Preserve Shared Learning Engine v3.3, Shared Lab Engine v3.2, protected answers and server-enforced entitlements. Owner approval does not waive independent data rights, authenticated production and graded-approval gates.

## 4. What is next, in execution order

1. Retain the accepted mobile fix and automate its 390/600/768/1280 px regression after any future header changes.
2. Confirm the homepage status on Search Console's `Google Index` tab; distinguish live eligibility from inclusion in the index.
3. Confirm `/sitemap-v2.xml` processing on the Search Console `Sitemaps` page; retain XML until a specific underlying technical error is found.
4. Close only changed-surface Chart Studio authenticated regressions; do not recreate or recharge previously tested member accounts.
5. Continue measurable 419-Lab, ten Academy-path and Talia source/teaching integration acceptance and compare final GitHub SHA with Cloudflare deployment before sitewide release.

## Revision history

| Version | Date | Decision |
|---|---|---|
| 1.0 | 2026-11-02 | Accepted corrected Googlebot mobile header based on successful actual Chromium and Owner's subsequent Google live-render evidence; retained Google Index and sitemap-processing holds |

**Footer:** SMFGU-SEO-MOBILE-ACCEPTANCE-20261102 · v1.0 · GitHub `main` source of record · No fees, payments, brokerage transactions, production member changes, or new learning entitlement changes authorized by this document.

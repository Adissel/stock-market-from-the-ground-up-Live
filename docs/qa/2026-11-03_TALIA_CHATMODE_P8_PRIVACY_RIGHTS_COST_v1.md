# Talia Tutor — Chat Mode Package 8: Privacy, AI Cost and Source-Use Controls

| Control | Record |
|---|---|
| Company/project | Cyber Nexus Publishing / Crown & Lantern Press — The Stock Market: From the Ground Up |
| Document ID | SMFGU-TALIA-CHAT-P8-GOVERNANCE-001 |
| Filename / file type | `docs/qa/2026-11-03_TALIA_CHATMODE_P8_PRIVACY_RIGHTS_COST_v1.md` / Markdown |
| Machine file | `data/talia-chat-mode-p8-governance-v1.json` / JSON |
| Version / date / status | 1.0 / 2026-11-03 / Scope decisions specified, external legal and live security signoff HOLD |
| GitHub / Google Drive | `Adissel/stock-market-from-the-ground-up-Live` / main; Drive file not created, ID unassigned |
| Dependencies | Existing Auth/RLS, four-edition policy, member Tutor history, source directory, SCTR/VIX restrictions, no spend |

## 17 owner-scope security, rights and cost decisions

- **SEC-01 — Identity:** Tutor interactive endpoints require current authenticated eligible member, server-issued identity and tool access; deny anonymous, suspended, deleted, showcase and stale session. *Disposition: FROZEN_SCOPE.*
- **SEC-02 — Entitlement:** Resolve Foundation, Advanced, Professional, Enterprise effective edition server-side using entitlement, add-on, release flag, and versioned audit; visual dropdown never grants privilege. *Disposition: FROZEN_SCOPE_RUNTIME_HOLD.*
- **PRIV-01 — Saving consent:** Saving Tutor conversation exchanges is strictly affirmative opt-in, default off. A new unsaved topic must not be represented as deletion of historical saved exchanges. *Disposition: FROZEN_SCOPE.*
- **PRIV-02 — Isolation:** Every conversation/history/feedback/export read or write is filtered by server-validated user ID, and RLS & API authorization enforced; client-submitted user_id ignored or denied. *Disposition: RELEASE_GATED.*
- **PRIV-03 — Switch/revocation:** On account switch, signout, session expiry or revoked membership, abort pending requests, clear transient transcript/chart/private cached data, reauthorize new token. *Disposition: RELEASE_GATED.*
- **PRIV-04 — Retention/export/deletion:** Provide user-visible access to consent scope and documented records retention, export and deletion; don't assert deletion before verified DB and backup retention policy is reviewed. *Disposition: OPEN_LEGAL_PRODUCT_REVIEW.*
- **COST-01 — Basic cost:** Ordinary source-only Explain/Teach Deeper, correction and ungraded retries are always free; no Lumen debit and no member AI credentials. *Disposition: FROZEN_SCOPE.*
- **COST-02 — Optional inference:** No new billable provider or site-controlled inference without independent Owner budget approval, explicit optional member consent, finite server quota and safe deterministic fallback. *Disposition: FROZEN_SCOPE_NO_SPEND.*
- **DATA-01 — Fictional:** Use original fictional OHLCV, original trade prints and separately labeled bar proxies for no-cost Tutor examples; chronological cutoff and source provenance required. *Disposition: FROZEN_SCOPE.*
- **DATA-02 — Member market feeds:** Preserve existing BYO Alpaca/Tiingo feeds for separately entitled member-owned market data without granting central republication or additional Tutor AI-key policy. *Disposition: FROZEN_SCOPE_WITH_LICENSE_HOLD.*
- **RIGHTS-01 — Source reference vs reproduction:** A free public URL is only a research citation. Do not copy vendor course prose, chart graphics, methods code, sample feeds or protected indices until individually licensed or independently rewritten where legally allowed. *Disposition: LEGAL_REVIEW_HOLD.*
- **RIGHTS-02 — FRED terms:** FRED API terms and broader FRED service terms require series-specific rights review and restrict AI/ML applications, storage/caching and redistribution in relevant contexts. Disable automated model ingestion and redistribution by default. *Disposition: SOURCE_TERMS_REVIEW_HOLD.*
- **RIGHTS-03 — SEC access:** Use SEC EDGAR/XBRL primary official references for fact checking; if automated retrieval is subsequently enabled, comply with SEC declaration, fair-access, rate and source-use policies; never infer filing as-of before public acceptance. *Disposition: SOURCE_USAGE_CONTRACT.*
- **RIGHTS-04 — Official index:** SCTR and official VIX remain conceptual education only; do not claim exact official numeric reproduction or authorized brand and feed usage. *Disposition: FROZEN_HOLD.*
- **TRUST-01 — No regulated trading:** Instructional, not personalized securities advice; no live broker execution, order placement or automatic trade signal from Tutor. *Disposition: FROZEN_SCOPE.*
- **TRUST-02 — Protected assessments:** Never make real Assess answers, private rubrics, future replay, official grade or mastery award accessible via prompt, chat history, context or higher editions. *Disposition: FROZEN_SCOPE.*
- **TRUST-03 — Security logging:** No secrets, raw member responses or provider tokens in GitHub Actions artifacts, analytics, public app cache or support logs. Keep auditable decision IDs and sanitized QA metadata. *Disposition: RELEASE_GATED.*

## External source terms checked

The current FRED API terms distinguish third-party copyrighted data and require permission beyond individual personal use; broader FRED service terms prohibit certain AI/ML and API caching/archiving uses. FRED is **not enabled as an automated Tutor AI-ingestion source** in this contract: https://fred.stlouisfed.org/docs/api/terms_of_use.html and https://fred.stlouisfed.org/legal/fraud-awareness . SEC developer guidelines require compliant automated EDGAR access, identification, request moderation and a current published limit of no more than ten requests per second: https://www.sec.gov/about/developer-resources . Research URLs do not license charts, vendor indicator formulas-as-implementation-code, copyrighted materials, commercial data, or official index trademarks.

## Release and legal boundary

Individually verify original Member Terms, privacy notices, state/national privacy applicability, retention/export/deletion, audit access, third-party terms and licenses. No legal compliance or attorney approval is established by an AI-maintained register. Source-only instruction and use of original fictional input are V1 safe defaults; no new provider spend, new centralized live feeds, or private key procurement.

## Revision history

| Version | Date | Decision |
|---|---|---|
| 1.0 | 2026-11-03 | Reconciled identity, opt-in history, cross-account privacy, cost, FRED/SEC/source restrictions and retention holds |

Footer: SMFGU-TALIA-CHAT-P8-GOVERNANCE-001 · v1.0 · Hold external legal and member release.

# Crownlight Prototype 015 — Learning Constellation 3D and Classic Builder V3

## Document control

| Field | Value |
| --- | --- |
| Company | Cyber Nexus Publishing / Crownlight |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-PROTOTYPE-015 |
| Filename | `SMFGU-PROTOTYPE-015_CONSTELLATION_3D_CLASSIC_BUILDER_V3_20261103.md` |
| File type | Markdown |
| Authoritative GitHub location | `Adissel/stock-market-from-the-ground-up-Live/docs/prototype/` |
| Google Drive location | Not created; GitHub document is controlling for this feature branch |
| Google Drive document ID | Not assigned |
| Version | 1.0 |
| Date | 2026-11-03 (America/Chicago) |
| Status | FEATURE BRANCH / DRAFT PR — NOT PRODUCTION ACCEPTED |
| Dependencies | Staff-only `prototype.html`, existing authenticated role gate, `prototype-center-v1.js`, `prototype-learning-constellation-v1.js`, existing ECharts player, `prototype-teaching-v2.js`, membership preview controller, canonical Lab and Tutor indexes |
| Purpose | Improve spatial curriculum exploration and unify Classic Builder without replacing shared learning, grade, and member-record services |
| New file required | Yes — implementation and acceptance traceability |

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-03 | First consolidated 3D Constellation and Classic Builder V3 implementation record |

## Implemented source scope

1. **Constellation**: local 3D perspective projection of semantic DOM curriculum nodes and SVG edges, orbit/tilt controls, adjustable depth, zoom/pan controls, keyboard orbit, selectable flat 2D fallback and responsive dimensional styling. This is perspective 3D, not a Three.js/WebGL mesh engine.
2. **Classic Builder**: replaces the old duplicate instructional tile group with a single integrated classroom presentation using existing `pt-chart`/ECharts and existing `pt-case-host` protected case player. Member and case data remain untouched.
3. **Stage navigator**: preserves Start, Learn, Experiment, Predict, Practice, Assess, Review, Transfer, Results. Stage navigation is **preview position only**; does not record completion, graded scores or membership entitlements.
4. **Teaching panels**: Understand, Recognize, Apply, Common mistake and Limitations provide non-answer-key context. Talia's actual authenticated engine is not replaced by hardcoded dialogue.
5. **Boot Camp**: makes the authorized Academy accessible. The three additional authored draft paths remain controlled beta, and grading/awards stay unavailable until independent acceptance.
6. **Accessibility**: semantic buttons, keyboard camera controls, 2D fallback, reduced-motion CSS, focused controls and responsive layout.

## Source tests

- `tests/prototype-learning-constellation-v1-browser.test.mjs` extended for 3D projection, depth, flat fallback, orbit keyboard and reset, preserving drag tests.
- `tests/prototype-center-v2-browser.test.mjs` extended for one Classic Builder, nine stages and five instructional facets.
- Updated JavaScript modules: syntax checked as valid on 2026-11-03; actual browser acceptance is not certified until CI/browser runners finish.

## Acceptance gates / release hold

- **CI**: all relevant source, build, and authenticated browser jobs must finish successfully on a common head SHA; queued or pending is NOT success.
- **Roles**: Owner/Admin must be authorized, and unauthenticated/non-staff access denied by the existing server gate. Preview cannot grant entitlements or disclose private questions.
- **State**: stage preview is not mastery; genuine learning mode locks and grade persistence remain the responsibility of the shared authenticated engine.
- **Interaction**: verify mouse/touch drag release, keyboard orbit, zoom, mobile overflow, 2D mode and reduced motion.
- **Deployment**: verify Cloudflare production SHA matches the accepted merge commit; no separate GitHub account or branch automatically changes Cloudflare production.
- **Editorial**: three new controlled-beta Boot Camp assessments and graded Lumens awards remain on hold.
- **Licensing**: synthetic instructional datasets only; no redistribution of third-party market feeds.

## Known limits

The new learning map is 3D perspective projection rather than full volumetric WebGL. The Classic Builder remains a restricted design prototype, not a member-facing Academy replacement or a verified live Talia service. It must not be described as 100% integrated production learning functionality.

## Decision

Continue on the feature branch with a draft PR. Do not merge, enable grading, unlock draft courses, or deploy until matching CI and authenticated browser acceptance support the release.

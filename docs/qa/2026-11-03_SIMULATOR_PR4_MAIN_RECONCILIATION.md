# Simulator teaching-order PR4 main-first reconciliation

Project: THE STOCK MARKET: FROM THE GROUND UP
Document ID: SMFGU-SIMULATOR-MAIN-PR4-RECON-001
Version: 1.0
Filename: docs/qa/2026-11-03_SIMULATOR_PR4_MAIN_RECONCILIATION.md
Date: 2026-11-03
Type: Markdown
Status: Main-source integrated, sitewide browser OAT still pending
Google Drive location: Not created
Google Drive document ID: Not assigned

The original PR4's purpose was to preserve the canonical simulator instructional sequence and unblock mobile chart overlays. Its source failed one D17 source control job on the older branch, so it was not copied wholesale.
The current main assets/js/frontend-complete.js was retained except for the simulatorEnhance function. The function was ported with the correct existing route regular expression for /simulator(.html) and with unconditional removal of saved legacy panel reorder state. Display presets remain available without uncontrolled drag/drop of teaching stages.
The CSS mobile overlay adjustments were ported exactly, while the newer dashboard ordering, environment provenance, full source route contracts, and current ownership test inventory were retained. Regressions were updated only for simulator sequence and mobile overlay behavior.
No protected quiz, learner progress, Stripe, grading, authorization or member data privileges were changed. The branch itself is recorded as a second-parent merge for GitHub history. The resulting main commit requires regular CI and authenticated browser acceptance before public feature claims.

Revision history: 1.0 / 2026-11-03 / correction port with route regex fix and no regression of approved dashboard behavior.

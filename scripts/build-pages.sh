#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
# Enforce the unchanged LIVE safety gate *before* expensive static checks.
# This file is also executed directly by the fast deterministic flag-matrix test.
source scripts/_lib/live-build-guard.sh
# Cloudflare retains only a bounded prefix of very verbose TAP output. Run the
# identical build once in a child process and emit a useful terminal tail so a
# late Pages-only failure is diagnosable. Other CI/local runs keep full output.
if [[ "${CF_PAGES:-0}" == "1" && "${SMFGU_PAGES_LOG_WRAPPED:-0}" != "1" ]]; then
  pages_build_log="$(mktemp)"
  export SMFGU_PAGES_LOG_WRAPPED=1
  if bash "${BASH_SOURCE[0]}" >"$pages_build_log" 2>&1; then
    tail -n 120 "$pages_build_log"
    rm -f "$pages_build_log"
    exit 0
  else
    pages_build_status=$?
  fi
  echo "Cloudflare Pages build failed with exit $pages_build_status; terminal output follows." >&2
  tail -n 300 "$pages_build_log" >&2
  rm -f "$pages_build_log"
  exit "$pages_build_status"
fi
# Validate public navigation before lengthy integration suites; surface broken-link diagnostics in retained build logs.
node --test tests/tool-registry-navigation-fallback-v1.test.mjs
node --test tests/watchlist-offline-credential-boundary-v1.test.mjs
node --test tests/home-stable-first-paint-v1.test.mjs
# Unique tie-breaker for published Knowledge metadata pagination (no protected body).
node --test tests/knowledge-library-stable-pagination-v1.test.mjs
# Dedicated React chart classrooms must not load legacy global DOM/CSS enhancers.
node --test tests/runtime-owned-talia-v1.test.mjs
# Student-facing Tutor desk must keep chart and instruction aligned and preserve revealed-evidence boundaries.
node --test tests/talia-student-desk-v1.test.mjs
node --test tests/talia-classroom-teaching-depth-v1.test.mjs
node --check functions/api/talia-classroom-curriculum-v1.js
# Block stale async chart libraries from overriding the active Studio tier.
node --test tests/chart-studio-runtime-ownership-v1.test.mjs
node --test tests/crownlight-chart-context-menu-v1.test.mjs
# Legacy copy fixes must not delete learning workspaces or parent containers.
node --test tests/legacy-copy-runtime-ownership-v1.test.mjs
# Preserve member verification links and future catalog links against legacy DOM removers.
node --test tests/runtime-legacy-navigation-membership-v1.test.mjs
# Route-safe runtime consolidation, input gesture ownership and source-level release contracts.
node --test tests/runtime-ownership-consolidation-100.test.mjs
node --test tests/public-navigation-five-page-links-v1.test.mjs
node --test tests/group1-public-copy-and-entitlements-v1.test.mjs
# Section C release integrity: fail a deployment on mathematical or workspace defects.
# Headless graphical Chromium acceptance remains in the dedicated GitHub workflow.
node --check assets/js/crownlight-echarts-studio-v1.js
node --check assets/js/crownlight-workspace-v2.js
node --check assets/js/prototype-indicator-workbench-v2.js
node tests/test_section_c_indicator_edge_crosslanguage_v1.mjs
node tests/prototype-indicator-workbench-v2.test.mjs
node --test tests/prototype-chart-context-v1.test.mjs
node --check assets/js/crownlight-classroom-chart-bridge-v1.js
node --test tests/crownlight-shared-classroom-v1.test.mjs
node --check assets/js/site-brand-academy-sync-v1.js
node tests/test_crownlight_chart_workspace_v2.mjs
# Independent real chart engine arithmetic, private workspace, and source-only Python parity.
node --test tests/test_crownlight_workspace_projection_20_v1.mjs
node --test tests/test_crownlight_chart_math_20_independent_v1.mjs
node tests/test_chart_quant_crosslanguage_v1.mjs
# Twenty runtime authorization, data-minimization and UTF-8 payload tests.
node --test tests/crownlight-workspace-phase2-behavior-20.test.mjs
# Lumens V1 consolidated noncharging regression runs in the actual Pages build.
node tests/lumens-v1-consolidated-20261104.mjs
node tests/lumens-v1-batch-readiness-20261104.mjs
node tests/lumens-v1-static-dashboard-wallet-contract.mjs
node tests/lumens-v1-release-eight-batch-source-20261104.mjs
node tests/lumens-v1-founder-60day-rollover-source-20261104.mjs
# Verify Chart Pass requests before privileged atomic wallet redemption.
node --test tests/crownlight-sparks-pass-20-behavior-v1.test.mjs
# Talia React classroom: original fictional arithmetic, protected source-only chat.
node tests/test_site_shell_acceptance_v1.cjs
node --test tests/atelier-sitewide-theme-v1.test.mjs
node --test tests/studio-spectrum-theme-v1.test.mjs
node --test tests/talia-spectrum-theme-v1.test.mjs
node --test tests/crownlight-integrated-40-gates-v1.test.mjs
node --test tests/crownlight-member-acceptance-phase2-40.test.mjs
# Member-facing founding matrix must distinguish unknown entitlements from exclusions.
node tests/test_founding_members_public_names.mjs
node --test tests/home-market-terminal-v1.test.mjs
node --test tests/community-source-copy-and-disclosure-v1.test.mjs
node --test tests/sitewide-simulation-vocabulary-ui-v1.test.mjs
node --test tests/sitewide-display-terminology-v1.test.mjs
node --check assets/js/home-learning-constellation-v1.js
# Member-facing evidence response contract: choices for decisions, typed inputs only for calculations.
node --check assets/js/learning-response-choice-v1.js
node --check assets/js/lab-v33-instructor.js
node --check assets/js/lab-engine-v32-universal.js
node --check assets/js/academy-guided-v1.js
node --check assets/js/bootcamp-academy-v014168.js
node --test tests/learning-interactive-response-policy-v1.test.mjs
node --test tests/evidence-based-mastery-learning-v1.test.mjs
node --test tests/home-realistic-prototype-constellation-v1.test.mjs
node --check assets/js/prototype-shared-learning-market-v1.js
node --test tests/prototype-shared-learning-market-v1.test.mjs
node --test tests/crownlight-evidence-core-v1.test.mjs
node --test tests/crownlight-evidence-scenarios-v1.test.mjs
node --test tests/crownlight-indicator-experiments-v1.test.mjs
node --test tests/crownlight-interactive-evidence-v1.test.mjs
node --test tests/shared-home-market-learning-replay-v1.test.mjs
# Public fictional candle inspector: 24 runtime accuracy/privacy regressions.
node --test tests/home-market-tooltip-20-behavior-v1.test.mjs
node --test tests/basic-five-study-dom-interaction-20.test.mjs
node tests/basic-quant-worked-inspection-v1.test.mjs
node tests/academy-20-actual-progress-validation-v1.test.mjs
node tests/academy-member-day-restoration-v1.test.mjs
node tests/basic-all-419-lab-bridge-integrity-v1.test.mjs
node tests/basic-learning-49-executable-gates-v1.test.mjs
node tests/basic-indicator-20-negative-safety-gates-v1.test.mjs
node tests/basic-five-indicator-parity-v1.test.mjs
node tests/basic-engine-six-gate-closeout-v1.test.mjs
node --test tests/learning-lab-edition-workspace-v1.test.mjs
# Force private premium two-identity / Academy bookmark contract on every Pages build.
node --test tests/learning-lab-edition-two-account-contract-v1.test.mjs
node tests/talia-classroom-source-v1.test.mjs
node --test tests/talia-live-interactive-v1.test.mjs
node --test tests/talia-classroom-professional-v2.test.mjs
node --test tests/talia-terminal-v4.test.mjs
node --test tests/talia-classroom-route-alias-v4.test.mjs
node tests/talia-tutor-prototype-v1.test.mjs
node tests/talia-prototype-professional-chart-v1.test.mjs
node tests/talia-membership-only-v1.test.mjs
node tests/talia-member-conversations-isolation-v1.test.mjs
node tests/talia-foundation-batch13-gates-v1.test.mjs
node tests/talia-foundation-batch14-gates-v1.test.mjs
node tests/talia-foundation-batches15-16-gates-v1.test.mjs
node tests/talia-foundation-batches17-18-gates-v1.test.mjs
node tests/talia-foundation-batches19-20-gates-v1.test.mjs
node --test tests/talia-foundation-batches25-30-gates-v1.test.mjs
node tests/talia-source-indicator8-python-js-v1.test.mjs
node tests/talia-production-asset-sync-v1.test.mjs
node tests/talia-batch13-20-transfer-v1.test.mjs
node tests/talia-upload5-reconciliation-v1.test.mjs
node tests/talia-upload5-and-claims-v1.test.mjs
node tests/talia-indicator-16-20-python-js-crosscheck-v1.test.mjs
node tests/talia-indicators21-30-source-math-v1.test.mjs
node tests/talia-indicators21-30-crosslanguage-v1.test.mjs
node tests/talia-indicator46-73-python-js-v1.test.mjs
node --check functions/api/credentials.js
node --check functions/api/market-tutor-v01492.js
node --check assets/js/member-tutor-version-loader-v1.js
python3 scripts/qa/talia_classroom_fictional_ohlc_v1.py
# Journal V1 critical financial, policy-source and guided UI regressions.
# This test is deterministic: it uses fictional inputs and no database/payment action.
node tests/test_journal_guided_integrity_v1.mjs
# Journal V2 must pass before any main-branch production publication.
node tests/test_journal_v2.mjs
# Professional Journal V3: visual data integrity and no fabricated historical candles.
node tests/test_journal_visual_v3.mjs
node tests/test_journal_calendar_setup_replay_v3.mjs
node --check assets/js/journal-market-calendar-v3.js
node --check assets/js/simulator-mode-v014112.js
node --check assets/js/verified-replay-v01492.js
node --check assets/js/lesson-gusim-dt-c01-l02-echarts-v1.js
node tests/test_gusim_dt_c01_l02_echarts_v1.mjs
node --check assets/js/lab-dt-c01-l02-teaching-v2.js
node tests/test_dt_c01_l02_nine_stage_teaching_v2.mjs
node --check assets/js/gusim-dt-c01-l02-coach-v3.js
node tests/test_gusim_dt_c01_l02_coach_v3.mjs
node --check assets/js/crownlight-candle-measurements-v28.js
node tests/test_crownlight_candle_v28.mjs
node --check assets/js/watchlist-talia-research-v4.js
node --check assets/js/watchlist-talia-workstation-v4.js
node tests/test_talia_watchlist_v4.mjs
node --check functions/api/talia-watchlist-reports-v1.js
node tests/test_talia_watchlist_persistence_v1.mjs
# Foundation source-only mathematics and expanded indicator retrieval must pass before release.
node --check functions/_lib/tutor-foundation-worked-math-v1.js
node tests/talia-foundation-worked-math-v1.test.mjs
node tests/talia-foundation-indicator-expansion-v1.test.mjs
node tests/talia-foundation-extended-guided-v1.test.mjs
node tests/talia-foundation-explanations-batch01-v1.test.mjs
node --check functions/_lib/talia-foundation-quant-v1.js
node tests/talia-foundation-quant-v1.test.mjs
node tests/talia-foundation-explanations-batch02-v1.test.mjs
node tests/talia-foundation-explanations-batch03-v1.test.mjs
node --check functions/_lib/talia-foundation-risk-quant-v1.js
node tests/talia-foundation-risk-quant-v1.test.mjs
node tests/talia-foundation-explanations-batch04-v1.test.mjs
node --check functions/_lib/talia-research-math-v1.js
node tests/talia-research-math-v1.test.mjs
node tests/talia-foundation-seven-math-review-v1.test.mjs
node tests/talia-research-math-second-seven-v1.test.mjs
node tests/talia-indicators13-24-review-v1.test.mjs
node tests/talia-indicators25-36-review-v1.test.mjs
node tests/talia-indicators37-48-review-v1.test.mjs
node tests/talia-indicators49-60-review-v1.test.mjs
node tests/talia-indicators61-73-review-v1.test.mjs
node tests/talia-foundation-batches08-09-gates-v1.test.mjs
node tests/talia-foundation-batches10-11-gates-v1.test.mjs
node tests/talia-foundation-batch12-gates-v1.test.mjs
node tests/talia-tier-research-contracts-v1.test.mjs
node tests/talia-premium-prototypes-batch18-v1.test.mjs
node tests/talia-claim-triage-and-math-v1.test.mjs
node tests/talia-rule605-options-primary-evidence-v1.test.mjs
node tests/talia-indicator-15-python-js-crosscheck-v1.test.mjs
node tests/talia-indicators16-30-independent-math-v1.test.mjs
node tests/talia-indicators31-45-python-js-v1.test.mjs
node tests/talia-indicators46-60-python-js-v1.test.mjs
node tests/talia-indicators61-73-python-js-v1.test.mjs
node tests/talia-release-evidence-crosswalk-v1.test.mjs
node tests/talia-recursive-indicators-python-js-v1.test.mjs
node tests/talia-claim-40-source-disposition-v1.test.mjs
node tests/talia-40-source-register-consistency-v1.test.mjs
node tests/talia-tutor40-conversational-quality-v1.test.mjs
node tests/talia-regulatory-timing-notices-v1.test.mjs
node tests/talia-40-claim-multiturn-source-v1.test.mjs
node tests/talia-claims101-140-python-js-editorial-v1.test.mjs
node tests/talia-five-qualitative-source-dispositions-v1.test.mjs
node tests/talia-training45-evaluation40-v1.test.mjs
node tests/talia-evaluation-methodology-v2.test.mjs
node --test tests/talia-membership-history-matrix-v1.test.mjs
node tests/talia-training40-server-authorization-v1.test.mjs
node tests/talia-training-synthetic-followup-privacy-v1.test.mjs
node tests/talia-foundation-adaptive-reflection-v1.test.mjs
node --test tests/talia-formative-diagnostic-route-v1.test.mjs tests/talia-formative-practice-server-v1.test.mjs
node tests/talia-echarts-independent-python-js-v1.test.mjs
node tests/talia-source-remediation-specificity-v1.test.mjs
node scripts/curriculum-evidence-master-register-v1.mjs --write
node tests/talia-foundation-six-gate-teaching-review-v1.test.mjs
node tests/talia-foundation-explanations-batch05-v1.test.mjs
node tests/talia-foundation-explanations-batch06-07-v1.test.mjs
node --check functions/_lib/talia-indicator-worked-v1.js
node tests/talia-indicator-worked-v1.test.mjs
node scripts/talia-indicator-editorial-review-v1.mjs
node tests/talia-foundation-misconception-v1.test.mjs
node scripts/talia-foundation-coverage-v1.mjs
node tests/talia-foundation-ema-visual-v1.test.mjs
for asset in assets/js/journal-visual-v3.js assets/js/journal-trade-story-v3.js; do
  node --check "$asset"
done
for asset in assets/js/journal-v2-logic.js assets/js/journal-guided-v2.js assets/js/journal-weekly-v2.js; do
  node --check "$asset"
done
for asset in assets/js/journal-common.js assets/js/journal-entry.js assets/js/journal-guided-v1.js assets/js/journal-evidence-v1.js assets/js/journal-actual-history-v1.js assets/js/journal-weekly-v1.js; do
  node --check "$asset"
done
output="public"
rm -rf "$output"
mkdir -p "$output"
for must in index.html config.js sw.js release-manifest.json lab-catalog.json manifest.webmanifest feed.xml _headers _redirects _routes.json; do
  test -f "$must" || { echo "Missing public asset: $must" >&2; exit 1; }
done
cp -- ./*.html config.js sw.js release-manifest.json manifest.webmanifest lab-catalog.json feed.xml _headers _redirects _routes.json "$output"/
# IndexNow proof is a public ownership-verification file, not an API secret.
INDEXNOW_VERIFICATION_KEY="0f6a1a00e2945eb90d24e5c5b6e75946"
test -f "$INDEXNOW_VERIFICATION_KEY.txt"
test "$(tr -d '\r\n' < "$INDEXNOW_VERIFICATION_KEY.txt")" = "$INDEXNOW_VERIFICATION_KEY" || { echo "IndexNow key file mismatch" >&2; exit 6; }
cp -- "$INDEXNOW_VERIFICATION_KEY.txt" "$output/$INDEXNOW_VERIFICATION_KEY.txt"
if [[ -e data/interactive-labs.json ]]; then
  echo 'SECURITY BUILD BLOCK: data/interactive-labs.json is present in repository.' >&2
  exit 4
fi
for directory in assets learn; do
  test -d "$directory" || { echo "Missing directory: $directory" >&2; exit 1; }
  cp -R -- "$directory" "$output"/
done
# Pin and serve the full ECharts runtime from OUR OWN Pages origin.
# This removes runtime reliance on a third-party CDN and keeps the Apache-2.0
# package license beside the published asset. No proprietary TV assets.
# Install in a throwaway directory outside public, never publish node_modules.
vendor_temp="$(mktemp -d)"
trap 'rm -rf "$vendor_temp"' EXIT
npm install --prefix "$vendor_temp" --no-save --no-package-lock --ignore-scripts --no-audit --no-fund echarts@6.1.0 @supabase/supabase-js@2.109.0 react@19.1.1 react-dom@19.1.1 three@0.179.1 esbuild@0.25.9 typescript@5.9.3 @types/react@19.1.10 @types/react-dom@19.1.7 @types/three@0.179.0 >/dev/null
vendor_source="$vendor_temp/node_modules/echarts"
test -s "$vendor_source/dist/echarts.min.js" || { echo "ECharts 6.1.0 missing after installation" >&2; exit 7; }
mkdir -p "$output/assets/vendor/echarts/6.1.0"
cp -- "$vendor_source/dist/echarts.min.js" "$output/assets/vendor/echarts/6.1.0/echarts.min.js"
if [[ -f "$vendor_source/LICENSE" ]]; then
  cp -- "$vendor_source/LICENSE" "$output/assets/vendor/echarts/6.1.0/LICENSE"
else
  echo 'ECharts license missing from npm package; refusing build.' >&2; exit 7
fi
# The chart loader MUST reference this exact self-hosted version.
grep -Fq '/assets/vendor/echarts/6.1.0/echarts.min.js' assets/js/crownlight-echarts-loader-v1.js || {
 echo 'ECharts loader does not match published pinned bundle' >&2; exit 7;
}
printf 'Verified same-origin Apache ECharts 6.1.0 static asset (%s bytes)\n' "$(wc -c < "$output/assets/vendor/echarts/6.1.0/echarts.min.js")"
# Pin the browser Auth/REST runtime locally too. Previously every signed-in
# journey depended on jsDelivr's dynamically imported +esm URL; if the browser
# could not access that CDN, even OWNER access to /prototype.html failed.
# Supabase UMD exposes window.supabase.createClient and runs from our own Pages.
supabase_source="$vendor_temp/node_modules/@supabase/supabase-js"
test -s "$supabase_source/dist/umd/supabase.js" || { echo "Supabase 2.109.0 UMD artifact missing" >&2; exit 7; }
mkdir -p "$output/assets/vendor/supabase-js/2.109.0"
cp -- "$supabase_source/dist/umd/supabase.js" "$output/assets/vendor/supabase-js/2.109.0/supabase.js"
if [[ -f "$supabase_source/LICENSE" ]]; then
 cp -- "$supabase_source/LICENSE" "$output/assets/vendor/supabase-js/2.109.0/LICENSE"
else
 echo "Supabase license missing from package" >&2; exit 7
fi
grep -Fq '/assets/vendor/supabase-js/2.109.0/supabase.js' assets/js/supabase-client.js || {
 echo "Shared Supabase client not configured for pinned same-origin bundle" >&2; exit 7;
}
printf 'Verified same-origin Supabase 2.109.0 browser bundle (%s bytes)\n' "$(wc -c < "$output/assets/vendor/supabase-js/2.109.0/supabase.js")"

# Build the optional staff-only React/TypeScript/Three.js experiment to a
# same-origin ESM bundle. The source is outside the public static tree; only
# the compiled asset and permissive dependency licenses are published.
test -s src/prototype/PrototypeThreeLab.tsx
cp -- src/prototype/PrototypeThreeLab.tsx "$vendor_temp/PrototypeThreeLab.tsx"
node "$vendor_temp/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck \
  --module esnext --moduleResolution bundler --jsx react-jsx --target es2022 \
  "$vendor_temp/PrototypeThreeLab.tsx"
node "$vendor_temp/node_modules/esbuild/bin/esbuild" "$vendor_temp/PrototypeThreeLab.tsx" \
  --bundle --format=esm --target=es2022 --minify \
  --define:process.env.NODE_ENV='"production"' \
  --outfile="$output/assets/js/prototype-three-lab-v1.bundle.js"
test -s "$output/assets/js/prototype-three-lab-v1.bundle.js" || { echo "3D prototype bundle missing" >&2; exit 7; }
for package in react react-dom three; do
  test -s "$vendor_temp/node_modules/$package/LICENSE" || { echo "3D dependency license missing: $package" >&2; exit 7; }
  mkdir -p "$output/assets/vendor/$package"
  cp -- "$vendor_temp/node_modules/$package/LICENSE" "$output/assets/vendor/$package/LICENSE"
done
printf 'Verified same-origin React/Three.js demo bundle (%s bytes)\\n' "$(wc -c < "$output/assets/js/prototype-three-lab-v1.bundle.js")"

# React/TypeScript command deck is visible on the default authenticated
# Prototype page; compile independently to keep Three.js lazy-loaded.
test -s src/prototype/PrototypeWorkbenchDeck.tsx
cp -- src/prototype/PrototypeWorkbenchDeck.tsx "$vendor_temp/PrototypeWorkbenchDeck.tsx"
node "$vendor_temp/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck \
  --module esnext --moduleResolution bundler --jsx react-jsx --target es2022 \
  "$vendor_temp/PrototypeWorkbenchDeck.tsx"
node "$vendor_temp/node_modules/esbuild/bin/esbuild" "$vendor_temp/PrototypeWorkbenchDeck.tsx" \
  --bundle --format=esm --target=es2022 --minify \
  --define:process.env.NODE_ENV='"production"' \
  --outfile="$output/assets/js/prototype-deck-v6.bundle.js"
test -s "$output/assets/js/prototype-deck-v6.bundle.js" || { echo "React Prototype command deck missing" >&2; exit 7; }

# React/TypeScript three-page Experience Suite. Shares the existing same-origin
# ECharts loader and staff-only Prototype gate; no extra public route.
test -s src/prototype/PrototypeExperiences.tsx
cp -- src/prototype/PrototypeExperiences.tsx "$vendor_temp/PrototypeExperiences.tsx"
node "$vendor_temp/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck \
  --module esnext --moduleResolution bundler --jsx react-jsx --target es2022 \
  "$vendor_temp/PrototypeExperiences.tsx"
node "$vendor_temp/node_modules/esbuild/bin/esbuild" "$vendor_temp/PrototypeExperiences.tsx" \
  --bundle --format=esm --target=es2022 --minify \
  --define:process.env.NODE_ENV='"production"' \
  --outfile="$output/assets/js/prototype-experiences-v1.bundle.js"
test -s "$output/assets/js/prototype-experiences-v1.bundle.js"
test -s "$output/assets/css/prototype-experiences-v1.css"
test -s "$output/assets/js/prototype-experiences-boot-v1.js"

# Public React/TypeScript ECharts experience, with no privileged API or assessment state.
test -s src/experience/HomeMarketTerminal.tsx
cp -- src/experience/HomeMarketTerminal.tsx "$vendor_temp/HomeMarketTerminal.tsx"
node "$vendor_temp/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck \
  --module esnext --moduleResolution bundler --jsx react-jsx --target es2022 \
  "$vendor_temp/HomeMarketTerminal.tsx"
node "$vendor_temp/node_modules/esbuild/bin/esbuild" "$vendor_temp/HomeMarketTerminal.tsx" \
  --bundle --format=esm --target=es2022 --minify \
  --define:process.env.NODE_ENV='"production"' \
  --outfile="$output/assets/js/home-market-terminal-v1.bundle.js"
test -s "$output/assets/js/home-market-terminal-v1.bundle.js"

# Member-only React/ECharts analytics; reads existing dashboard statistics, never private APIs.
cp -- src/experience/MemberProgressVisual.tsx "$vendor_temp/MemberProgressVisual.tsx"
node "$vendor_temp/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck \
 --module esnext --moduleResolution bundler --jsx react-jsx --target es2022 \
 "$vendor_temp/MemberProgressVisual.tsx"
node "$vendor_temp/node_modules/esbuild/bin/esbuild" "$vendor_temp/MemberProgressVisual.tsx" \
 --bundle --format=esm --target=es2022 --minify \
 --define:process.env.NODE_ENV='"production"' \
 --outfile="$output/assets/js/member-progress-visual-v1.bundle.js"
test -s "$output/assets/js/member-progress-visual-v1.bundle.js"

# Talia member classroom is a new presentation over the existing Tutor API.
# Type-check against the same pinned React/TypeScript toolchain used by prototypes.
test -s src/tutor/TaliaClassroom.tsx
# Talia now reuses the same React chart as Classic Labs. Keep source files in
# their original relative positions within the isolated temporary toolchain.
mkdir -p "$vendor_temp/tutor" "$vendor_temp/prototype"
cp -- src/tutor/TaliaClassroom.tsx "$vendor_temp/tutor/TaliaClassroom.tsx"
cp -- src/prototype/PrototypeExperiences.tsx "$vendor_temp/prototype/PrototypeExperiences.tsx"
node "$vendor_temp/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck \
  --module esnext --moduleResolution bundler --jsx react-jsx --target es2022 \
  "$vendor_temp/tutor/TaliaClassroom.tsx"
node "$vendor_temp/node_modules/esbuild/bin/esbuild" "$vendor_temp/tutor/TaliaClassroom.tsx" \
  --bundle --format=esm --target=es2022 --minify \
  --define:process.env.NODE_ENV='"production"' \
  --outfile="$output/assets/js/talia-classroom-v1.bundle.js"
test -s "$output/assets/js/talia-classroom-v1.bundle.js"
test -s "$output/assets/css/talia-classroom-v1.css"
test -s "$output/talia-classroom.html"

mkdir -p "$output/data"
for file in crownlight-sparks-store-v014167.json books.json challenges.json commerce-config.json stripe-product-registry-v01437.json environments.json interactive-lab-index.json journal-taxonomy.json labs.json releases.json simulator_csv_template.csv skills.json store-products.json tutor-index.json competency-study-guides-v01499.json talia-foundation-explanations-batch{01..30}-v1.json tutor-research-guides-v1.json tutor-video-transcript-research-v1.json tutor-decision-playbooks-v1.json tutor-advanced-decision-guides-v1.json tutor-indicator-study-v1.json tutor-indicator-expansion-v1.json tutor-watchlist-study-v1.json tutor-strategy-study-v1.json tutor-guided-practice-v1.json tutor-guided-practice-expansion-v1.json free-foundations-evidence-v1.json academy-specific-source-instruction-v1.json tutor-lab-claim-evidence-v1.json competency-lab-paths-v01499.json lab-teaching-bridges-v014168.json bootcamp-formative-v014154.json bootcamp-source-cases-v014166.json; do
  test -f "data/$file" || { echo "Missing public data: data/$file" >&2; exit 1; }
  cp -- "data/$file" "$output/data/$file"
done
# Tutor curricula are original, public and ungraded. Publish the exact assets
# retrieved by ASSETS.fetch; absent data silently degrades source-only teaching.
for tutor_asset in talia-foundation-explanations-batch{01..30}-v1.json tutor-research-guides-v1.json tutor-video-transcript-research-v1.json tutor-decision-playbooks-v1.json tutor-advanced-decision-guides-v1.json tutor-indicator-study-v1.json tutor-indicator-expansion-v1.json tutor-watchlist-study-v1.json tutor-strategy-study-v1.json tutor-guided-practice-v1.json tutor-guided-practice-expansion-v1.json; do
  test -s "$output/data/$tutor_asset" || { echo "Missing public Tutor catalog: $tutor_asset" >&2; exit 6; }
done
test -s "$output/assets/js/tutor-guided-practice-v1.js"
test -s "$output/assets/css/tutor-guided-practice-v1.css"
# Public display projection from canonical founder terms. Preserve the internal
# seat limit ONLY in protected commercial contracts, not public static JSON;
# never expose billing state or treat this artifact as checkout authority.
python3 - "$output/data/founding-catalog.json" <<'PYFOUNDERS'
import json,sys
from pathlib import Path
terms=json.loads(Path('data/founding600-terms-v014170.json').read_text())
fields=('name','billingIntervalDays','recurringCents','foundingDiscountBps','incSparks','includedSparksNeverExpire')
public={'plans':{code:{key:terms['plans'][code][key] for key in fields} for code in ('FOUNDING_14','FOUNDING_30','FOUNDING_60')}}
Path(sys.argv[1]).write_text(json.dumps(public,separators=(',',':'))+'\n')
PYFOUNDERS
# Both bootcamp lesson sources contain original, non-secret, ungraded teaching
# references. Do not publish private rubrics or authenticated research exports.
test -s "$output/data/bootcamp-formative-v014154.json"
test -s "$output/data/bootcamp-source-cases-v014166.json"
# All 419 original public teaching bridges must ship, without any private rubric.
test -s "$output/data/lab-teaching-bridges-v014168.json"
test -f "$output/bootcamp-academy.html"
test -f "$output/assets/js/bootcamp-academy-v014168.js"
test ! -e "$output/supabase/migrations/v0.14.0.168_BOOTCAMP_ACADEMY_OWNER_REVIEW_REQUIRED.sql"
# In an explicitly marked preview staging build, browser auth must use the SAME
# separate Supabase staging project as the Cloudflare Functions payment API.
# Never insert service keys. A missing/inconsistent preview config fails the build.
if [[ "${GU_STRIPE_V38_STAGING:-false}" == "true" || "${GU61_STAGING_ENABLED:-false}" == "true" ]]; then
  if [[ "${CF_PAGES_BRANCH:-main}" == "main" ]]; then
    echo 'Refusing to build staging checkout on production branch.' >&2; exit 5
  fi
  python3 - "$output/config.js" <<'PYSTAGE'
import os,re,sys
path=sys.argv[1]
ref=os.getenv('GU61_STAGING_PROJECT_REF','') if os.getenv('GU61_STAGING_ENABLED')=='true' else os.getenv('GU_STRIPE_V38_STAGING_PROJECT_REF','')
url=os.getenv('SUPABASE_URL','')
pub=os.getenv('SUPABASE_PUBLISHABLE_KEY','')
if not re.fullmatch('[a-z0-9]{20}',ref) or ref=='oxihglyfgzywsupnyicb' or url!=f'https://{ref}.supabase.co' or not pub:
 raise SystemExit('Staging Supabase URL, ref and public key must be configured consistently.')
s=open(path,encoding='utf8').read()
s,n1=re.subn(r"SUPABASE_URL: '[^']*'",f"SUPABASE_URL: '{url}'",s,count=1)
s,n2=re.subn(r"SUPABASE_ANON_KEY: '[^']*'",f"SUPABASE_ANON_KEY: '{pub}'",s,count=1)
if (n1,n2)!=(1,1):raise SystemExit('Expected frontend config fields missing.')
with open(path,'w',encoding='utf8') as f:f.write(s)
PYSTAGE
fi
# Build metadata is authoritative only if the deployment uses this build command.
python3 - "$output/release-manifest.json" <<'PYBUILD'
import json,sys,os,datetime,subprocess
p=sys.argv[1];data=json.load(open(p,encoding='utf-8'))
sha=os.environ.get('CF_PAGES_COMMIT_SHA','').strip() or subprocess.getoutput('git rev-parse HEAD').strip()
if len(sha)==40 and all(c in '0123456789abcdefABCDEF' for c in sha):data['gitCommit']=sha.lower()
data['builtAtUtc']=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
data['status']='built-source-not-live-verified'
with open(p,'w',encoding='utf-8') as f:json.dump(data,f,indent=2);f.write('\n')
PYBUILD
# Reproducible two-engine four-edition evidence audit; no member requests or paid services.
node --test tests/learning-lab-engine-feature-audit-v1.test.mjs
node scripts/build-site-accessibility.mjs
node scripts/build-site-brand-academy-v1.mjs
node scripts/build-chart-controls-sitewide-v1.mjs
node --test tests/chart-controls-sitewide-v1.test.mjs
node tests/test_site_brand_academy_v1.mjs
node scripts/build-public-seo.mjs
# Deployment-blocking, zero-network SEO artifact gate: verify published output,
# never merely the source generator. A bad sitemap stops Cloudflare publication.
node --input-type=module <<'SITEMAP_GATE'
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=process.env.GU_SITE_BUILD_DIR||'public';
const sitemapPath=join(root,'sitemap.xml');
const sitemapV2Path=join(root,'sitemap-v2.xml');
const robotsPath=join(root,'robots.txt');
assert.ok(existsSync(sitemapPath),'Missing generated public/sitemap.xml');
assert.ok(existsSync(sitemapV2Path),'Missing new public/sitemap-v2.xml');
assert.ok(existsSync(robotsPath),'Missing generated public/robots.txt');
const xml=readFileSync(sitemapPath,'utf8');
assert.equal(readFileSync(sitemapV2Path,'utf8'),xml,'V2 sitemap and compatibility URL must agree');
const robots=readFileSync(robotsPath,'utf8');
const origin=new URL(process.env.GU_PUBLIC_SITE_ORIGIN||'https://stock-market-from-the-ground-up-d1r.pages.dev').origin;
assert.match(xml,/^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.match(xml,/<\/urlset>\s*$/);
assert.doesNotMatch(xml,/<html\b|<!DOCTYPE|<script\b/i);
const entries=[...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<\/url>/g)].map(x=>x[1]);
assert.ok(entries.length>0&&entries.includes(origin+'/'),'Sitemap must include canonical homepage');
assert.equal((xml.match(/<url>/g)||[]).length,entries.length,'Malformed sitemap url entries');
assert.equal((xml.match(/<loc>/g)||[]).length,entries.length,'Malformed sitemap loc entries');
assert.equal(new Set(entries).size,entries.length,'Duplicate sitemap URL');
assert.ok(entries.every(url=>!new URL(url).pathname.endsWith('.html')),'Sitemap loc must be the final extensionless public URL');
for(const item of entries){const url=new URL(item);assert.equal(url.origin,origin,'Noncanonical sitemap URL');assert.equal(url.protocol,'https:');assert.equal(url.search,'');assert.equal(url.hash,'');}
assert.deepEqual(robots.split(/\r?\n/).filter(s=>/^Sitemap:/i.test(s.trim())),['Sitemap: '+origin+'/sitemap-v2.xml','Sitemap: '+origin+'/sitemap.xml'],'robots.txt sitemap reference mismatch');
console.log('PASS: generated sitemap-v2.xml, compatible sitemap.xml + robots.txt production build gate, '+entries.length+' canonical URLs');
SITEMAP_GATE
# Require the public-only GA4 and SEO fixture acceptance on every production build.
# This is entirely local; no Google requests, member data or paid operations.
node tests/test_public_sitemap_v2.mjs
node tests/test_v014157_public_seo.mjs
node tests/test_public_acquisition_v1.mjs
node tests/test_member_growth_v1.mjs
node tests/test_growth_v2.mjs
node tests/test_owner_growth_funnel_v1.mjs
node tests/test_owner_free5_isolation_source_v1.mjs
node tests/test_ga4_public_funnel_v1.mjs
printf 'Cloudflare Pages static output: %s files\n' "$(find "$output" -type f | wc -l)"

/* November 1 Owner-only roadmap reconciliation.
 * Read-only evidence snapshot, NOT live CI availability, commercial authorization,
 * Supabase-saved Owner progress, or an independent editorial certification.
 * Do not put this source into public/ or turn limited Beta into retail approval.
 */
const base='https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/blob/main/';
const evidence=(label,path)=>({label,url:base+path});
export const ownerRoadmapRelease20261101=Object.freeze({
 id:'SMFGU-WEB-ROADMAP-RECON-20261101-001',
 version:'1.0',asOf:'2026-11-01',scope:'owner_private_evidence_snapshot',
 title:'Current delivery, instructional acceptance and engine tier roadmap',
 disclaimer:'These are separately dated acceptance baselines, not a universal percentage for the entire website. Always recheck current main, required CI and Cloudflare SHA. Saved Owner checklist decisions remain authoritative.',
 originalChecklist:{primary:375,reference:1815,total:2190,immutable:true},
 metrics:[
  {id:'labs',label:'Canonical Lab teaching bridges',value:'419',unit:'source-linked; 419 official protected assessments are NOT approved',state:'source_implemented'},
  {id:'competencies',label:'Public competency guides',value:'30',unit:'subject guides; official scoring separately protected',state:'source_implemented'},
  {id:'academy',label:'Academy advanced-depth Beta units accepted',value:'93/380',percent:24.47,unit:'24.47% of fixed ungraded instructional acceptance ledger; 287 remaining',state:'partial'},
  {id:'source',label:'Original Academy day source cases',value:'247/247',unit:'source authored only; 225 original positions were parent-derived',state:'source_implemented'},
  {id:'newcamps',label:'Three invitation-only Beta courses',value:'27/27',unit:'ungraded instructional scope approved; public retail and official grading HOLD',state:'accepted_scoped'},
  {id:'private',label:'Private three-course graded cases approved',value:'0/54',unit:'41/54 cases had completed DRAFT packages in the Oct 31 snapshot; NOT approved for scoring',state:'blocked'},
  {id:'indicators',label:'Tutor source-only indicator teaching guides',value:'73',unit:'61 retained plus 12 extensions across nine families; not executable overlays or independent editorial acceptance',state:'source_implemented'},
  {id:'computed',label:'Computed prototype chart study choices',value:'16',unit:'distinct from 73 teaching guides and eight source-only fictional Tutor computations; full numerical/market-data acceptance open',state:'partial'},
  {id:'tutor',label:'Tutor study modules',value:'134',unit:'source module catalog; no blanket individual editorial sign-off',state:'source_implemented'},
  {id:'chart',label:'Chart Studio strict acceptance',value:'3/14',percent:21.43,unit:'10 partial, 1 open; engineering half-credit estimate 57.1% is not strict acceptance',state:'partial'},
  {id:'b01',label:'B01 graded Beta preparation',value:'62%',percent:62,unit:'weighted work estimate; 0/20 private sets independently approved; grading HOLD',state:'blocked'},
  {id:'free',label:'Free Membership V1 planning readiness',value:'88%',percent:88,unit:'earlier Owner planning estimate; two-account and accessibility acceptance remain open',state:'partial'}
 ],
 engines:{
  sourceLearning:'Shared Learning v3.3 Basic',sourceLab:'Shared Lab v3.2 Basic',
  sourceTutor:'Talia Foundation Basic (v0.14.0.149 member-facing label)',
  note:'Membership target, presentation source version, operating capability and per-product entitlement are distinct. Basic explanations, worked examples, mistakes and retries remain included for every entitled lesson. Only separately released and server-verified engine editions may be sold.',
  premiumCheckoutEnabled:false,
  rows:[
   {code:'FREE',name:'Free',learning:'Basic',lab:'Basic',tutor:'Foundation',state:'Basic included'},
   {code:'FOUNDING_14',name:'Founding 14-Day',learning:'Basic',lab:'Basic',tutor:'Foundation',state:'Basic included'},
   {code:'PICK_WHAT_YOU_WANT',name:'Pick What You Want',learning:'Basic',lab:'Basic',tutor:'Foundation',state:'Basic included; separate add-on targets, no checkout'},
   {code:'ONDEMAND_MONTHLY',name:'OnDemand',learning:'Product dependent',lab:'Product dependent',tutor:'Product dependent',state:'Explicit existing product entitlement required'},
   {code:'FOUNDING_30',name:'Founding 30-Day',learning:'Advanced target',lab:'Advanced target',tutor:'Advanced target',state:'Premium runtime unreleased'},
   {code:'FOUNDING_60',name:'Founding 60-Day',learning:'Professional target',lab:'Professional target',tutor:'Professional target',state:'Premium runtime unreleased'},
   {code:'FULL_MONTHLY',name:'Full Monthly',learning:'Professional target',lab:'Professional target',tutor:'Professional target',state:'Premium runtime unreleased'},
   {code:'LIFETIME',name:'Full Lifetime',learning:'Enterprise target',lab:'Enterprise target',tutor:'Enterprise target',state:'Premium runtime unreleased'},
   {code:'FULL_ANNUAL',name:'Full Annual and historical plans',learning:'Unassigned',lab:'Unassigned',tutor:'Unassigned',state:'Owner terms require reconciliation; never auto-grant'}
  ]
 },
 gates:[
  {id:'R01',title:'Exact-commit sitewide CI and production SHA',state:'open',proof:'Completed mandatory GitHub workflows on the chosen stable main SHA; same SHA successfully deployed by Cloudflare, no cancelled required checks',next:'Requery live provider state; freeze release candidate and repair/rerun failing workflows. Previous run success is not current-head acceptance.'},
  {id:'R02',title:'Genuine Owner/Admin prototype and account authority',state:'open',proof:'Actual authorized login to /prototype.html and advanced A/B/C, role revocation, sign-out and session expiry, not simulated roles',next:'Run authenticated staff and denied-role production browser matrix.'},
  {id:'R03',title:'419 Lab teaching-to-prototype parity',state:'partial',proof:'Ten visible teaching steps, original five facets, worked arithmetic, why-right/wrong feedback, retries and independent transfer; protected keys remain private',next:'Individually review 20-Lab batches while preserving previously frozen B01 decisions.'},
  {id:'R04',title:'Academy classroom parity and 380-unit editorial backlog',state:'partial',proof:'93/380 approved restricted ungraded depth, original 247/247 source cases, 225 parent-derived baseline, invited 27/27 Beta; draft vs published enforced',next:'Verify per-day Talia/prerequisites/progress; complete remaining 287 advanced units without converting authoring into editorial approval.'},
  {id:'R05',title:'73 original Tutor indicator guide editorial audit',state:'partial',proof:'Seven research families: authoritative source, formula, units, settings, warm-up/session, interpretation, common errors and limitations; distinguish research vs calculations',next:'Record per-indicator evidence and independent review decision.'},
  {id:'R06',title:'16 computed prototype chart study numerical verification',state:'partial',proof:'Independent deterministic expected values; missing-data recovery, EMA/MACD seed, volume/session resets, completed bars/no future-bar leakage',next:'Extend current source numerical regression to every study and parameter boundary.'},
  {id:'R07',title:'Professional ECharts and React/TypeScript Chart Studio interaction',state:'partial',proof:'Press/release pan, wheel zoom, linked charts, OHLCV, pane resize, desktop/mobile/keyboard; Standard/Advanced/Professional restrictions',next:'Validate actual accessible production Studio, not only fictional prototype fixture.'},
  {id:'R08',title:'Two genuine authenticated accounts and private records',state:'blocked',proof:'Both authorized sessions deny foreign read/write/ID substitution across Labs, Academy, Talia, Watchlist, Replay, Journal, saved workspaces',next:'Provide separately authorized second QA identity to the existing secure test workflow; do not bypass email verification.'},
  {id:'R09',title:'Accessible instructional and qualified independent review',state:'partial',proof:'Keyboard-only, actual screen reader, focus/errors, reduced motion, responsive chart alternative; independent teaching and market-claim verification',next:'Resolve accessibility issues, preserve source rights and obtain actual separate reviewer evidence where required.'},
  {id:'R10',title:'Consolidated controlled public release and commercial safeguards',state:'blocked',proof:'Same-SHA CI/deployment, privacy, graded-content approval, payment TEST lifecycle, legal/publishing, revocation, rollback and explicit Owner sign-off',next:'Close only supported scoped gates; keep unauthorized premium add-ons, unreviewed grades and unaccepted paid checkout disabled.'}
 ],
 sources:[
  evidence('Repository entry point and authority','README_START_HERE.md'),
  evidence('Owner agent rules','AGENTS.md'),
  evidence('Current Academy acceptance 93/380','docs/releases/2026-10-31_ACADEMY_PARALLEL_GATES_93_OF_380_AND_41_PROTECTED_DRAFTS_V1.md'),
  evidence('Original 247-day source completion','docs/releases/2026-10-31_BOOTCAMP_247_SOURCE_COMPLETE_OWNER_ADDENDUM_v1.md'),
  evidence('B01 graded readiness and limits','docs/research/stockstotrade/ACADEMY_B01_GRADED_BETA_READINESS_SCORECARD_2026-10-31.md'),
  evidence('Chart Studio strict acceptance','docs/qa/2026-10-31_CHART_STUDIO_SIX_PLUS_EIGHT_ACCEPTANCE_v1.md'),
  evidence('Free program acceptance','docs/qa/2026-10-31_FREE_V1_EDITORIAL_AND_MEMBER_ACCEPTANCE_V1.md'),
  evidence('Three independent engines','docs/learning/SMFGU-ENGINE-ARCH-001-v1-20261101.md'),
  evidence('Membership engine editions','docs/learning/SMFGU-ENGINES-ENTITLEMENTS-001-v1.0-20261101.md'),
  evidence('Prototype parity','docs/prototype/SMFGU-PROTOTYPE-012-v1.0-20261101.md'),
  evidence('Legal publication versus compliance','docs/legal/2026-10-26_LEGAL_PUBLICATION_RECORD_V2.md')
 ]
});

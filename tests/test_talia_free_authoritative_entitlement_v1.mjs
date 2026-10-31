/* Release contract: Free Market Tutor is authorized via the server-side
 * Free flag, not UI appearance, arbitrary membership labels or paid charges.
 * This static contract complements actual read-only production RPC checks. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const migration=read('supabase/migrations/20261031_market_tutor_free_source_access_v1.sql');
const access=read('functions/api/member-tool-access.js');
const tutor=read('functions/api/market-tutor-v01492.js');
const workflow=read('.github/workflows/talia-free-genuine-browser-qa-v1.yml');
const browser=read('tests/test_talia_free_genuine_browser_qa_v1.mjs');
assert(migration.includes("IF target_tool='MARKET_TUTOR'"),'Exact Tutor-only Free branch');
assert(migration.includes("c.product_code='MARKET_TUTOR' AND c.free_access IS TRUE"),
 'Free must be an authoritative DB toggle, not a client label');
assert(migration.includes("p.plan_code='FREE' AND p.active IS TRUE"),
 'The Free plan must itself remain active');
assert(migration.includes("AND t.active=true AND t.status IN ('live','beta')"),
 'No unreleased tool is unlocked');
assert(migration.includes("p.account_kind='member' AND p.deleted_at IS NULL"),
 'Only current production members qualify');
assert(migration.includes("lower(f.status) IN ('suspended','restricted')"),
 'Suspended and restricted must remain denied');
assert(migration.includes("r.role_code='SHOWCASE_VIEWER'"),
 'Showcase members remain excluded');
assert(migration.indexOf("IF target_tool='MARKET_TUTOR'")>
 migration.indexOf("Catalog visibility and checkout are *not* entitlements"),
 'Free grant must follow existing risk/access checks');
assert(migration.includes("g.starts_at<=now()")&&migration.includes("s.current_period_end>now()"),
 'Original paid-term validations must be retained');
assert(migration.includes('MARKET_TUTOR_FREE_POLICY_PRECONDITION_FAILED')&&
 migration.includes('MARKET_TUTOR_ACCESS_FUNCTION_DRIFT'),'Migration must fail closed on unexpected DB drift');
assert(migration.endsWith('COMMIT;\n'),'Atomic committed migration required');
assert(access.includes("toolAccess(env,req,toolCode)")&&
 access.includes("const allowed=await ask(c.base+'/rest/v1/rpc/user_has_tool_access'"),
 'All member tool routes must continue using the authoritative entitlement RPC');
assert(tutor.includes("toolAccess(env,request,'MARKET_TUTOR')"),
 'Tutor route must continue checking entitlement');
assert(tutor.includes("body.allowModel!==true")&&tutor.includes('reserveAiRequest'),
 'AI requires explicit user request and verified quota/cost controls');
assert(tutor.includes("body.saveHistory===true"),
 'Member history remains explicitly opt-in');
assert(browser.includes("assert.equal(actor.id,expectedUser"),
 'Real QA requires exactly the pre-existing intended member');
assert(browser.includes("guard.enabled,false")&&
 !browser.includes('page.route('),'CAPTCHA must never be bypassed');
assert(browser.includes("allowModel:false,saveHistory:false"),
 'Real QA stays source-only, noncharging and read-only');
assert(workflow.includes("secrets.LAB_QA_EMAIL")&&workflow.includes("secrets.LAB_QA_PASSWORD"),
 'Use encrypted pre-existing QA credentials, not stored passwords');
assert(workflow.includes('workflow_dispatch')&&workflow.includes('pull_request')===false,
 'Real QA must be controlled by configured workflow trigger');
console.log('PASS Free Tutor exact authoritative entitlement migration, member restrictions, AI and privacy gates, encrypted real-browser QA source.');

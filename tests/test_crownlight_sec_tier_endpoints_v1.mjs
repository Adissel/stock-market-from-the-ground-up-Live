import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest as tierRequest} from '../functions/api/sec-scanner-tier-v1.js';
import {onRequest as scannerRequest} from '../functions/api/sec-scanner-research-v1.js';
import {onRequest as ownerRequest} from '../functions/api/owner-sec-scanner-tier-v1.js';
import {onRequest as originalRequest} from '../functions/api/sec-issuer-research-v1.js';
const A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const env={SUPABASE_URL:'https://mock.supabase.co',SUPABASE_PUBLISHABLE_KEY:'publish',
 SUPABASE_SECRET_KEY:'private',SEC_EDGAR_USER_AGENT:'Crownlight SEC Research research@example.org',SEC_EDGAR_BETA_ENABLED:'true'};
const T='2026-11-03T18:00:00Z';
const idx={0:{cik_str:789019,title:'Gusim Original Inc',ticker:'GUSIM'}};
const sample={cik:789019,name:'Gusim Original Inc',tickers:['GUSIM'],exchanges:['Nasdaq'],
 filings:{recent:{accessionNumber:['0000789019-26-000001','0000789019-26-000002'],
 form:['8-K','10-Q'],filingDate:['2026-11-03','2026-11-03'],reportDate:['2026-10-31','2026-10-31'],
 acceptanceDateTime:[T,null],primaryDocument:['event.htm','q.htm']}}};
const facts={cik:789019,facts:{'us-gaap':{
 Revenues:{units:{USD:[{val:500000,end:'2026-10-31',filed:'2026-11-03',
  accn:'0000789019-26-000002',form:'10-Q'}]}}}}};
let activeUser=A,grant=null,ownerRole=false,hasTool=true,sourceAvailable=true,budget=true,
 secCalls=0,budgetCalls=0,grantLookup=0,rpcCalls=0,rpcConflict=false,serviceFailure=false,lastRpc=null;
const old=globalThis.fetch;
const reply=(data,status=200)=>new Response(JSON.stringify(data),
 {status,headers:{'content-type':'application/json'}});
globalThis.fetch=async(url,opts={})=>{
 const u=String(url);
 if(u.endsWith('/auth/v1/user'))return reply({id:activeUser});
 if(u.includes('/profiles?'))return reply([{account_kind:'member',deleted_at:null}]);
 if(u.includes('/admin_user_flags?'))return reply([{status:'active'}]);
 if(u.includes('/admin_user_roles?'))return reply([{role_code:ownerRole?'OWNER':'MEMBER',expires_at:null}]);
 if(u.includes('/platform_tools?'))return reply([{tool_code:'CATALYST_RESEARCH',status:'beta',active:true,free_preview:false}]);
 if(u.endsWith('/rpc/user_has_tool_access'))return reply(hasTool);
 if(u.includes('gu_product_access_config_v1')||u.includes('product_access_config'))return reply([]);
 if(u.includes('/gu_sec_scanner_tier_grants_v1?')){
  grantLookup++;
  if(serviceFailure)return reply({message:'storage down'},503);
  const matched=grant?.user_id===activeUser?grant:null;
  return reply(matched?[matched]:[]);
 }
 if(u.endsWith('/rpc/gu_sec_scanner_set_tier_v1')){
  rpcCalls++;lastRpc=JSON.parse(opts.body);
  if(rpcConflict)return reply({code:'40001'},409);
  return reply({ok:true,tier:lastRpc.p_tier,status:lastRpc.p_status,
   version:lastRpc.p_expected_version+1,expiresAt:lastRpc.p_expires_at});
 }
 if(u.endsWith('/rpc/gu_sec_edgar_take_budget_v1')){budgetCalls++;return reply(budget)}
 if(u.startsWith('https://data.sec.gov/')||u.startsWith('https://www.sec.gov/')){
  if(!sourceAvailable)return reply({},503);
  secCalls++;assert.match(opts.headers['User-Agent'],/research@example.org/);
  if(u.includes('company_tickers.json'))return reply(idx);
  if(u.includes('/submissions/'))return reply(sample);
  if(u.includes('/companyfacts/'))return reply(facts);
 }
 throw Error('Unexpected URL '+u);
};
function req(path,method='GET',body,auth=true){
 return new Request('https://example.org'+path,{method,headers:{
  ...(auth?{authorization:'Bearer member-token'}:{}),
  ...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
}
const g={tier:'ADVANCED',status:'active',version:2,expires_at:null,user_id:A};
const reset=()=>{activeUser=A;grant=null;ownerRole=false;hasTool=true;sourceAvailable=true;
 budget=true;secCalls=0;budgetCalls=0;grantLookup=0;rpcCalls=0;rpcConflict=false;
 serviceFailure=false;lastRpc=null;};
try{
 await test('SEC tier lookup honors Catalyst entitlement, not a URL-supplied tier',async()=>{
  reset();
  let res=await tierRequest({request:req('/api/sec-scanner-tier-v1'),env}),body=await res.json();
  assert.equal(res.status,200);assert.equal(body.tier,'BASIC');assert.equal(body.capabilities.fundamentals,false);
  assert.equal(res.headers.get('cache-control'),'private, no-store');
  assert.equal((await tierRequest({request:req('/api/sec-scanner-tier-v1?tier=ADVANCED'),env})).status,400);
  res=await tierRequest({request:req('/api/sec-scanner-tier-v1','GET',null,false),env});
  assert.equal(res.status,401);
  hasTool=false;
  res=await tierRequest({request:req('/api/sec-scanner-tier-v1'),env});
  assert.equal(res.status,403);
  assert.equal(secCalls,0);
 });
 await test('Basic exposes source chronology but no acceptance timestamps or financial facts',async()=>{
  reset();
  const res=await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM'),env});
  assert.equal(res.status,200);
  const body=await res.json();
  assert.equal(body.tier,'BASIC');
  assert.equal(body.filings.length,2);
  assert.equal(Object.hasOwn(body.filings[0],'acceptedAt'),false);
  assert.equal(body.fundamentals,null);
  assert.equal(body.marketWideScanner,false);
  assert.equal(body.tradeSignal,false);
  assert.equal(secCalls,2);assert.equal(budgetCalls,2);
 });
 await test('Basic/Plus cannot request SEC companyfacts, prior to any SEC access',async()=>{
  reset();
  for(const tier of ['BASIC','PLUS']){
   grant={...g,tier};
   const res=await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM&include=fundamentals'),env});
   assert.equal(res.status,403);assert.equal((await res.json()).error,'SEC_ADVANCED_ENTITLEMENT_REQUIRED');
  }
  assert.equal(secCalls,0);assert.equal(budgetCalls,0);
 });
 await test('Plus includes exact acceptance-time research, not financial companyfacts',async()=>{
  reset();grant={...g,tier:'PLUS'};
  const res=await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM'),env});
  const body=await res.json();assert.equal(res.status,200);assert.equal(body.tier,'PLUS');
  assert.equal(body.filings[0].acceptedAt,T);assert.equal(body.filings[1].acceptedAt,null);
  assert.equal(body.capabilities.acceptedTimeWindows,true);
  assert.equal(body.capabilities.fundamentals,false);
 });
 await test('Advanced receives reported financial data behind same SEC budget',async()=>{
  reset();grant=g;
  const res=await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM&include=fundamentals'),env});
  const body=await res.json();assert.equal(res.status,200);
  assert.equal(body.tier,'ADVANCED');
  assert.equal(body.fundamentals.find(x=>x.metric==='Revenue').observations[0].value,500000);
  assert.equal(secCalls,3);assert.equal(budgetCalls,3);
  assert.equal(body.historicalReplayCertified,false);
 });
 await test('One member cannot inherit another member SEC tier grant',async()=>{
  reset();grant=g;activeUser=B;
  const res=await tierRequest({request:req('/api/sec-scanner-tier-v1'),env});
  assert.equal((await res.json()).tier,'BASIC');
  activeUser=A;
  const other=await tierRequest({request:req('/api/sec-scanner-tier-v1'),env});
  assert.equal((await other.json()).tier,'ADVANCED');
 });
 await test('Revocation and expiry drop enhanced access without removing base purchased tool entitlement',async()=>{
  reset();grant={...g,status:'revoked'};
  assert.equal((await (await tierRequest({request:req('/api/sec-scanner-tier-v1'),env})).json()).tier,'BASIC');
  grant={...g,expires_at:'2026-01-01T00:00:00Z'};
  assert.equal((await (await tierRequest({request:req('/api/sec-scanner-tier-v1'),env})).json()).tier,'BASIC');
  grant={...g,tier:'PROFESSIONAL'};
  assert.equal((await tierRequest({request:req('/api/sec-scanner-tier-v1'),env})).status,503);
 });
 await test('Invalid inputs and absent entitlement cannot cause SEC source requests',async()=>{
  reset();
  for(const q of ['?symbol=GUSIM&url=https://evil.test','?symbol=GUSIM&symbol=OTHER',
   '?symbol=<script>','?include=fundamentals','?symbol=GUSIM&include=unknown',
   '?symbol=GUSIM&tier=ADVANCED']){
   const res=await scannerRequest({request:req('/api/sec-scanner-research-v1'+q),env});
   assert.equal(res.status,400,q);
  }
  assert.equal(secCalls,0);
  hasTool=false;
  assert.equal((await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM'),env})).status,403);
  assert.equal(secCalls,0);
 });
 await test('SEC global budget failure prevents upstream requests',async()=>{
  reset();budget=false;
  const res=await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM'),env});
  assert.equal(res.status,429);assert.equal(secCalls,0);
  assert.ok(budgetCalls>0);
 });
 await test('Disabled SEC source blocks all issuer fetches, no accidental public API',async()=>{
  reset();
  const res=await scannerRequest({request:req('/api/sec-scanner-research-v1?symbol=GUSIM'),env:{...env,SEC_EDGAR_BETA_ENABLED:'false'}});
  assert.equal(res.status,503);assert.equal(secCalls,0);
  serviceFailure=true;
  const denied=await tierRequest({request:req('/api/sec-scanner-tier-v1'),env});
  assert.equal(denied.status,503);
 });
 await test('Existing Watchlist SEC endpoint still uses its original entitlement and full response',async()=>{
  reset();
  const res=await originalRequest({request:req('/api/sec-issuer-research-v1?symbol=GUSIM&include=fundamentals'),env});
  assert.equal(res.status,200);const data=await res.json();
  assert.equal(data.filings[0].acceptedAt,T);
  assert.equal(data.fundamentals.find(x=>x.metric==='Revenue').observations[0].value,500000);
  assert.equal(grantLookup,0,'Original Watchlist must not be affected by SEC Scanner grants');
 });
 await test('Only genuine Owner can inspect SEC tier grant records or write changes',async()=>{
  reset();grant=g;
  assert.equal((await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1'),env})).status,403);
  assert.equal(rpcCalls,0);
  ownerRole=true;
  const res=await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1?target='+A),env});
  const body=await res.json();assert.equal(res.status,200);assert.equal(body.grant.version,2);
  assert.equal(body.nextExpectedVersion,2);
  assert.equal((await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1?target=bad'),env})).status,400);
 });
 await test('Owner audited write sends authenticated actor and expected optimistic revision',async()=>{
  reset();ownerRole=true;grant=g;
  const body={target:A,tier:'PLUS',status:'active',expectedVersion:2,
   expiresAt:'2028-01-01T00:00:00Z',reason:'Owner beta QA test grant'};
  const res=await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1','POST',body),env});
  assert.equal(res.status,200);assert.equal((await res.json()).grant.version,3);
  assert.equal(rpcCalls,1);assert.equal(lastRpc.p_actor,A);assert.equal(lastRpc.p_target,A);
  assert.equal(lastRpc.p_expected_version,2);assert.equal(lastRpc.p_tier,'PLUS');
  rpcConflict=true;
  const stale=await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1','POST',body),env});
  assert.equal(stale.status,409);assert.equal((await stale.json()).error,'STALE_SEC_TIER_REVISION');
 });
 await test('Owner editor rejects unchecked member IDs, professional grants, non-owner writes and unknown fields',async()=>{
  reset();ownerRole=true;
  const template={target:A,tier:'ADVANCED',status:'active',expectedVersion:0,
   expiresAt:null,reason:'Owner controlled research release'};
  const bads=[
   {...template,tier:'PROFESSIONAL'},{...template,expectedVersion:-1},
   {...template,target:'not-a-uuid'},{...template,reason:'short'},
   {...template,expiresAt:'2020-01-01T00:00:00Z'},{...template,user_id:B},
   {...template,status:'unlocked'}];
  for(const input of bads){
   const res=await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1','POST',input),env});
   assert.equal(res.status,400,JSON.stringify(input));
  }
  assert.equal(rpcCalls,0);
  ownerRole=false;
  assert.equal((await ownerRequest({request:req('/api/owner-sec-scanner-tier-v1','POST',template),env})).status,403);
  assert.equal(rpcCalls,0);
 });
}finally{globalThis.fetch=old}

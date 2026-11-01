// SMFGU-TALIA-MEMBER-ACCESS-001 v1.0: original Tutor membership-only contract.
// Pure local tests; no paid API keys, third-party model calls or live accounts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {onRequest as tutorApi} from '../functions/api/market-tutor-v01492.js';
const file=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const request=(token)=>new Request('https://site.test/api/market-tutor',{
 method:'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},
 body:JSON.stringify({question:'What is an EMA?',mode:'explain',allowModel:false,saveHistory:false})
});
test('anonymous Tutor requests cannot access server teaching',async()=>{
 const result=await tutorApi({request:request(null),env:{}});
 assert.equal(result.status,401);
 assert.equal((await result.json()).ok,false);
});
test('nonmember, suspended and showcase identities are refused before content retrieval',async()=>{
 const original=globalThis.fetch;
 let profile='guest',restriction='active',showcase=false;
 globalThis.fetch=async url=>{
  const u=String(url);
  const body=value=>new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}});
  if(u.endsWith('/auth/v1/user'))return body({id:'11111111-1111-4111-8111-111111111111'});
  if(u.includes('/rest/v1/profiles?'))return body([{account_kind:profile,deleted_at:null}]);
  if(u.includes('/rest/v1/admin_user_flags?'))return body([{status:restriction}]);
  if(u.includes('/rest/v1/admin_user_roles?'))return body(showcase?[{role_code:'SHOWCASE_VIEWER',expires_at:null}]:[]);
  throw Error('Unauthorized request reached unexpected endpoint '+u);
 };
 const env={SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_fixture_public',
  SUPABASE_SECRET_KEY:'sb_fixture_private'};
 try{
  for(const [kind,flag,show] of [['guest','active',false],['member','restricted',false],['member','active',true]]){
   profile=kind;restriction=flag;showcase=show;
   const response=await tutorApi({request:request('fixture-session'),env});
   assert.equal(response.status,403);
   assert.equal((await response.json()).ok,false);
  }
 }finally{globalThis.fetch=original}
});
test('both Tutor page and version loader require authenticated eligible membership',()=>{
 const html=file('market-tutor.html'),loader=file('assets/js/member-tutor-version-loader-v1.js');
 assert.match(html,/data-auth-required="true"/);
 assert.match(loader,/getSession\(\)/);
 assert.match(loader,/\/api\/member-tool-access\?tool=MARKET_TUTOR/);
 assert.match(loader,/entitlement\.freeEligible!==true/);
 assert.match(loader,/\/signin\.html\?next=/);
 assert.ok(loader.indexOf('entitlement.freeEligible!==true')<loader.indexOf("document.createElement('script')"));
 assert.doesNotMatch(html,/tutor-byok-use|personal API key/i);
 assert.doesNotMatch(loader,/TALIA_OPENAI_BYO|tutorByok/);
});
test('current Tutor cannot provide an anonymous local glossary answer or use personal member API keys',()=>{
 const ui=file('assets/js/market-tutor.js'),route=file('functions/api/market-tutor-v01492.js');
 const parser=file('functions/_lib/tutor-request-boundary-v014147.js');
 const provider=file('functions/_lib/tutor-provider-v014107.js');
 assert.match(ui,/if\(!TUTOR\.user\)\{status\('Sign in with an eligible membership/);
 assert.match(ui,/const data=await memberExplanation\(/);
 assert.doesNotMatch(ui,/const data=TUTOR\.user\?await memberExplanation/);
 assert.doesNotMatch(ui,/tutor-byok-use|useMemberKey/);
 assert.doesNotMatch(route,/getMemberTutorApiKey|reserveMemberTutorByokRequest/);
 assert.doesNotMatch(parser,/useMemberKey/);
 assert.doesNotMatch(provider,/memberApiKey/);
 assert.match(route,/if\(!auth\.authorized&&!auth\.freeEligible\)/);
});
test('existing data BYO connections are preserved independently of Talia',()=>{
 const credentials=file('functions/api/credentials.js');
 const prod=file('src/ts/production-completion.ts');
 assert.match(credentials,/\['TIINGO_BYO','ALPACA_BYO'\]/);
 assert.match(prod,/TIINGO_BYO/);assert.match(prod,/ALPACA_BYO/);
 assert.doesNotMatch(credentials,/TALIA_OPENAI_BYO|talia-member-byok/);
 assert.doesNotMatch(prod,/TALIA_OPENAI_BYO/);
});

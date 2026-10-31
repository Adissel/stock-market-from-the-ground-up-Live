/* PT3 — public-launcher and authenticated document security contracts.
 * No live accounts, secrets, payments, writes, or commercial browser services.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {onRequest as middleware} from '../functions/_middleware.js';
import {onRequest as protectedDocument} from '../functions/api/prototype-document.js';
const html=fs.readFileSync('prototype.html','utf8');
const state={roles:['OWNER'],perms:['control_panel.access'],profile:'member',flag:'active',expired:false};
const env={SUPABASE_URL:'https://abcdefghijklmnopqrst.supabase.co',SUPABASE_PUBLISHABLE_KEY:'synthetic_public_key',SUPABASE_SECRET_KEY:'sb_secret_SYNTHETIC_NEVER_REAL',ASSETS:{fetch:async req=>new Response(html,{status:200,headers:{'content-type':'text/html'}})}};
const previousFetch=globalThis.fetch;
globalThis.fetch=async input=>{
 const url=String(input);
 const ok=data=>new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
 if(url.endsWith('/auth/v1/user'))return ok({id:'fake-qa-user'});
 if(url.includes('/admin_user_roles'))return ok(state.roles.map(role_code=>({role_code,expires_at:state.expired?'2024-01-01T00:00:00Z':null})));
 if(url.includes('/profiles?'))return ok([{account_kind:state.profile,deleted_at:null}]);
 if(url.includes('/admin_user_flags?'))return ok([{status:state.flag}]);
 if(url.includes('/admin_role_permissions?'))return ok(state.perms.map(permission_code=>({permission_code})));
 throw Error('Unexpected mock endpoint '+url);
};
const origin='https://example.test';
const req=(path,token=false,method='GET')=>new Request(origin+path,{method,headers:token?{authorization:'Bearer SYNTHETIC_TOKEN'}:{}});
try{
 for(const path of ['/prototype.html','/prototype']){
  let nextCalls=0;
  const res=await middleware({request:req(path),env,next:async()=>{nextCalls++;throw Error('Should not read public prototype.html asset')}});
  assert.equal(res.status,200);assert.equal(nextCalls,0);
  assert.match(res.headers.get('cache-control'),/no-store/);
  assert.match(res.headers.get('x-robots-tag'),/noindex/);
  const body=await res.text();
  assert.match(body,/prototype-bootstrap-v3\.js/);
  assert.doesNotMatch(body,/id="pt-app"/,'must not leak actual application shell before authorization');
  assert.doesNotMatch(body,/Crownlight Prototype Center<\/h1>/);
 }
 let res=await protectedDocument({request:req('/api/prototype-document'),env});
 assert.equal(res.status,401);
 res=await protectedDocument({request:req('/api/prototype-document',true,'POST'),env});assert.equal(res.status,405);
 for(const role of ['MODERATOR','FREE','SHOWCASE_VIEWER']){
  state.roles=[role];res=await protectedDocument({request:req('/api/prototype-document',true),env});assert.equal(res.status,403,role);
 }
 state.roles=['OWNER','SHOWCASE_VIEWER'];res=await protectedDocument({request:req('/api/prototype-document',true),env});assert.equal(res.status,403);
 state.roles=['OWNER'];state.perms=[];res=await protectedDocument({request:req('/api/prototype-document',true),env});assert.equal(res.status,403);
 state.perms=['control_panel.access'];state.flag='suspended';res=await protectedDocument({request:req('/api/prototype-document',true),env});assert.equal(res.status,403);
 state.flag='active';state.profile='showcase';res=await protectedDocument({request:req('/api/prototype-document',true),env});assert.equal(res.status,403);
 state.profile='member';state.expired=true;res=await protectedDocument({request:req('/api/prototype-document',true),env});assert.equal(res.status,403);
 state.expired=false;
 for(const role of ['OWNER','ADMIN','TECH_ADMIN']){
  state.roles=[role];
  res=await protectedDocument({request:req('/api/prototype-document',true),env});
  assert.equal(res.status,200,role);
  assert.match(res.headers.get('cache-control'),/no-store/);
  assert.match(res.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  const content=await res.text();assert.match(content,/id="pt-app" hidden/);
  assert.match(content,/prototype-teaching-v2\.js/);
 }
 const disabledEnv={...env,ASSETS:undefined};
 res=await protectedDocument({request:req('/api/prototype-document',true),env:disabledEnv});assert.equal(res.status,503,'missing asset should fail closed');
 const bootstrap=fs.readFileSync('assets/js/prototype-bootstrap-v3.js','utf8');
 assert.match(bootstrap,/api\/prototype-document/);
 assert.doesNotMatch(bootstrap,/localStorage\.setItem|document\.cookie|location\.(?:search|hash)\s*=/);
 assert.match(bootstrap,/headers:\{authorization:'Bearer '\+session\.access_token/);
 console.log('PASS PT3: unauthenticated shell exclusion, 9 negative decisions, three approved roles, strict no-store responses and fail-closed document authorization.');
}finally{globalThis.fetch=previousFetch;}

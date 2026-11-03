/* Runtime-auth regression for membership article API. Pure fictional fixtures; no production credentials. */
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/knowledge-library.js';
const uid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const aid='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const env={SUPABASE_URL:'https://test-project.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',SUPABASE_SECRET_KEY:'sb_secret_test'};
let paid=false, restricted=false, showcase=false, manager=false, ownerAdmin=false, founder=false, launch=false;
let usedSlugSelector=false;
const live={id:aid,title:'Original Market Structure Study',slug:'market-structure-original',summary:'Original research lesson',
 subject:'Market Microstructure',learning_level:'professional',access_plans:['FOUNDING_60','FULL_MONTHLY','LIFETIME'],
 tags:['market-structure'],sort_order:100,updated_at:'2026-11-02T00:00:00Z',status:'published',
 review_state:'accepted',is_visible:true,deleted_at:null,body_markdown:'PROTECTED PAYWALL CONTENT',sources:[{url:'https://www.investor.gov/',title:'SEC'}]};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async (raw,options={})=>{
 const url=new URL(String(raw));
 if(url.pathname==='/auth/v1/user'){
   if(options.headers?.authorization==='Bearer active-session')return json({id:uid});
   return json({error:'invalid session'},401);
 }
 if(url.pathname.startsWith('/rest/v1/')){
  const t=url.pathname.split('/').at(-1),adminQuery=url.searchParams.get('select')||'';
  if(t==='profiles')return json([{account_kind:'member',deleted_at:null}]);
  if(t==='admin_user_flags')return json(restricted?[{status:'suspended'}]:[]);
  if(t==='admin_user_roles')return json(url.searchParams.get('role_code')==='eq.SHOWCASE_VIEWER'?
   (showcase?[{role_code:'SHOWCASE_VIEWER',expires_at:null}]:[]):
   url.searchParams.get('role_code')==='in.(OWNER,ADMIN)'?
    (ownerAdmin?[{role_code:'OWNER',expires_at:null}]:[]):
   (showcase?[{role_code:'SHOWCASE_VIEWER',expires_at:null}]:manager?[{role_code:'CONTENT_MANAGER',expires_at:null}]:[]));
  if(t==='admin_role_permissions')return json(manager?[{role_code:'CONTENT_MANAGER',permission_code:'content.manage'}]:[]);
  if(t==='user_plan_grants')return json(paid?[{plan_code:'FULL_MONTHLY',status:'active',starts_at:'2026-10-01',ends_at:'2027-01-01'}]:[]);
  if(t==='site_subscriptions')return json([]);
  if(t==='gu_founder_members_v014173')return json(founder?[{earned_plan_code:'FOUNDING_14',revoked_at:null}]:[]);
  if(t==='gu_founder_release_v014173')return json([{public_launch_open:launch}]);
  if(t==='gu_knowledge_articles_v1'){
   if(url.searchParams.get('slug')==='eq.market-structure-original')usedSlugSelector=true;
   if(url.searchParams.get('status')==='eq.published'||url.searchParams.get('is_visible')==='eq.true')
    return json([adminQuery.includes('body_markdown')?live:Object.fromEntries(Object.entries(live).filter(([k])=>!['body_markdown','sources','status','review_state','deleted_at','is_visible'].includes(k)))]);
   return json([live]);
  }
  if(t==='gu_knowledge_article_revisions_v1')return json([]);
  if(t==='gu_knowledge_mutate_v1')return json({...live,version:2});
  throw Error('Unexpected REST table '+t);
 }
 throw Error('Unexpected external fetch '+url.toString());
};
const call=async(action,{auth=false,method='GET',body,id=aid}={})=>{
 const url='https://website.example/api/knowledge-library?action='+encodeURIComponent(action)+'&id='+id;
 const request=new Request(url,{method,headers:auth?{'authorization':'Bearer active-session',...(body?{'content-type':'application/json'}:{})}: {},body:body?JSON.stringify(body):undefined});
 const response=await onRequest({request,env});
 return {status:response.status,data:await response.json(),headers:response.headers};
};
let x=await call('list');
assert.equal(x.status,200);
assert.equal(x.data.articles.length,1);
assert.equal(JSON.stringify(x.data).includes('PROTECTED PAYWALL CONTENT'),false,'catalog metadata must not expose body');
assert.equal(x.headers.get('cache-control'),'private, no-store');
x=await call('read');assert.equal(x.status,401,'anonymous cannot read protected article');
x=await call('read',{auth:true});assert.equal(x.status,403,'Free account cannot read a Professional article');
assert.equal(JSON.stringify(x.data).includes('PROTECTED PAYWALL CONTENT'),false);
paid=true;
x=await call('read',{auth:true});assert.equal(x.status,200);assert.equal(x.data.article.body_markdown,live.body_markdown);
const bySlug=await onRequest({request:new Request('https://website.example/api/knowledge-library?action=read&slug=market-structure-original',{headers:{authorization:'Bearer active-session'}}),env});
assert.equal(bySlug.status,200,'Authenticated member can read published article through stable slug');
assert.equal(usedSlugSelector,true,'Slug read must use the server-side slug lookup');
paid=false;ownerAdmin=true;
x=await call('read',{auth:true});assert.equal(x.status,200,'Verified Owner may review published article without a paid membership');
ownerAdmin=false;
x=await call('read',{auth:true});assert.equal(x.status,403,'Ordinary Free member must not bypass paid article access');
paid=true;
const malformed=await onRequest({request:new Request('https://website.example/api/knowledge-library?action=read&slug=../other'),env});
assert.equal(malformed.status,400,'Unsafe slug must be rejected without leaking body');
restricted=true;
x=await call('read',{auth:true});assert.equal(x.status,403,'Suspended member must be denied');
restricted=false;paid=false;showcase=true;
x=await call('read',{auth:true});assert.equal(x.status,403,'Showcase role must be denied');
showcase=false;
x=await call('admin/list',{auth:true});assert.equal(x.status,403,'Ordinary member must not see private drafts');
x=await call('save',{auth:true,method:'POST',body:{article:live}});assert.equal(x.status,403,'Member cannot edit articles');
manager=true;
x=await call('admin/list',{auth:true});assert.equal(x.status,200,'Content manager may manage article inventory');
x=await call('save',{auth:true,method:'POST',body:{article:{...live,id:undefined}}});assert.equal(x.status,200,'Authorized editor may send article to audited mutation RPC');
manager=false;founder=true;launch=false;
x=await call('read',{auth:true});assert.equal(x.status,200,'Verified pre-LIVE Founding member has access during beta');
launch=true;
x=await call('read',{auth:true});assert.equal(x.status,403,'Founder override must cease when public LIVE launches');
console.log('PASS: anonymous denial, paid read, expired status/role boundaries, Founding beta, staff scope, no public body leakage.');

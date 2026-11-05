import assert from 'node:assert/strict';import{onRequest}from'../functions/api/knowledge-library.js';
const uid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',aid='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const env={SUPABASE_URL:'https://test-project.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',SUPABASE_SECRET_KEY:'sb_secret_test'};
let privileged=false,showcase=false,restricted=false;
const secret='OWNER ADMIN SECRET ARTICLE BODY';
const draft={id:aid,slug:'owner-private-draft',title:'Private Unreleased Educational Draft',summary:'Private research',subject:'Foundations / Risk',learning_level:'beginner',access_plans:['FOUNDING_30'],tags:['draft'],sort_order:100,updated_at:'2026-11-04',status:'draft',review_state:'draft',is_visible:false,version:3,deleted_at:null,body_markdown:secret,sources:[{title:'Official source',url:'https://www.investor.gov/'}]};
const response=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async(raw,opt={})=>{
 const u=new URL(String(raw)),tab=u.pathname.split('/').at(-1);
 if(u.pathname==='/auth/v1/user')return opt.headers?.authorization==='Bearer active'?response({id:uid}):response({},401);
 if(tab==='profiles')return response([{account_kind:'member',deleted_at:null}]);
 if(tab==='admin_user_flags')return response(restricted?[{status:'suspended'}]:[]);
 if(tab==='admin_user_roles'){
  if(u.searchParams.get('role_code')==='eq.SHOWCASE_VIEWER')return response(showcase?[{role_code:'SHOWCASE_VIEWER',expires_at:null}]:[]);
  return response(privileged?[{role_code:'ADMIN',expires_at:null}]:[{role_code:'CONTENT_MANAGER',expires_at:null}]);
 }
 if(tab==='gu_knowledge_articles_v1')return response(u.searchParams.get('status')==='eq.published'?[]:[draft]);
 throw Error('Unexpected mock fetch: '+u.pathname);
};
const call=async(action,auth=false)=>{
 const r=await onRequest({request:new Request('https://site.example/api/knowledge-library?action='+encodeURIComponent(action)+'&id='+aid,{headers:auth?{authorization:'Bearer active'}:{}}),env});
 return {status:r.status,body:await r.json(),cache:r.headers.get('cache-control')};
};
let x=await call('admin/preview');assert.equal(x.status,401);
x=await call('admin/preview',true);assert.equal(x.status,403);assert(!JSON.stringify(x.body).includes(secret));
privileged=true;x=await call('admin/preview',true);assert.equal(x.status,200);
assert.equal(x.body.article.body_markdown,secret);assert.equal(x.body.article.status,'draft');assert.equal(x.cache,'private, no-store');
x=await call('list');assert.equal(x.status,200);assert.equal(x.body.articles.length,0);
x=await call('read',true);assert.equal(x.status,404);assert(!JSON.stringify(x.body).includes(secret));
showcase=true;x=await call('admin/preview',true);assert.equal(x.status,403);showcase=false;
restricted=true;x=await call('admin/preview',true);assert.equal(x.status,403);
console.log('PASS Owner/Admin saved full-page draft preview with restricted session and metadata-only public catalog.');

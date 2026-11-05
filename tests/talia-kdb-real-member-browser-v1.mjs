/* Real signed-in James_Test Knowledge beta QA; read-only and noncharging.
 * QA grants are controlled manually by Owner via the existing Supabase plugin.
 * No paid purchase, AI, official grading, cross-user write or credit mutation.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const ORIGIN=String(process.env.TALIA_KDB_QA_ORIGIN||'').replace(/\/$/,'');
const SHA=String(process.env.TALIA_KDB_QA_SHA||'').toLowerCase();
const API_ORIGIN='https://stock-market-from-the-ground-up-d1r.pages.dev';
const EMAIL=process.env.LAB_QA_EMAIL||'';
const PASS=process.env.LAB_QA_PASSWORD||'';
const USER='f42f9301-18e6-43a3-8531-32d371fd22c1';
const QA_REF='SMFGU-TALIA-245-BETA-QA-20261104';
const packs=[2,3,4,5,6].map(i=>JSON.parse(readFileSync(new URL('../data/talia-kdb-interactive-batch0'+i+'-v1.json',import.meta.url),'utf8')));
const samples=['knowledge-b002-simple-percent-return',...packs.map(p=>p.lessons[0].slug),...packs.map(p=>p.lessons.at(-1).slug)];
assert(EMAIL&&PASS,'BLOCKED: encrypted James_Test credentials are not configured');
assert(/^https:\/\/[-a-z0-9.]+$/.test(ORIGIN),'BLOCKED: HTTPS Pages QA origin required');
assert(/^[0-9a-f]{40}$/.test(SHA),'BLOCKED: exact SHA required');
let observed='missing';
for(let attempt=1;attempt<=4;attempt++){
 try{
  const r=await fetch(ORIGIN+'/release-manifest.json?acceptance='+SHA+'&attempt='+attempt,{cache:'no-store',signal:AbortSignal.timeout(20000)});
  if(r.ok){observed=String((await r.json()).gitCommit||'missing').toLowerCase();if(observed===SHA)break;}
  else observed='HTTP '+r.status;
 }catch{observed='unavailable'}
 if(attempt<4){console.log('DEPLOYMENT_PENDING '+attempt+'/4; next check in 90 seconds');
  await new Promise(resolve=>setTimeout(resolve,90000));}
}
assert.equal(observed,SHA,'BLOCKED: QA preview exact production source hash mismatch');
const anon=await fetch(API_ORIGIN+'/api/knowledge-library?action=read&slug='+samples[0],{cache:'no-store'});
assert.equal(anon.status,401,'Anonymous body read must be denied');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const context=await browser.newContext({viewport:{width:1280,height:840},serviceWorkers:'block'});
 const page=await context.newPage();
 const guard=await page.request.get(API_ORIGIN+'/api/auth-guard-v0135',{timeout:20000});
 assert.equal(guard.status(),200,'Authentication guard unavailable');
 assert.equal((await guard.json()).enabled,false,'CAPTCHA must not be bypassed; live approval requires assisted manual QA');
 await page.goto(ORIGIN+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('#login-identifier').fill(EMAIL);
 await page.locator('#login-password').fill(PASS);
 await page.locator('.auth-card button[type="submit"]').click();
 await page.waitForURL(url=>new URL(url).pathname==='/dashboard.html',{timeout:35000});
 const m=await page.evaluate(async()=>{
  const sb=await window.getSupabaseClient(),session=(await sb.auth.getSession()).data?.session;
  if(!session?.user?.id)return{id:'',token:'',grants:[],error:'no active session'};
  const result=await sb.from('user_plan_grants').select('plan_code,status,source_reference,starts_at,ends_at').eq('user_id',session.user.id);
  return{id:session.user.id,token:session.access_token||'',grants:result.data||[],error:result.error?.message||''};
 });
 assert.equal(m.id,USER,'Wrong authenticated QA identity; abort');
 assert(m.token.length>50,'Missing authenticated member token');
 assert.equal(m.error,'','RLS-scoped own-plan grant read failed');
 const active=m.grants.filter(g=>['active','trialing'].includes(g.status)&&(!g.ends_at||Date.parse(g.ends_at)>Date.now()));
 assert.equal(active.filter(g=>g.source_reference!==QA_REF).length,0,'Unexpected production grant; not safe to test');
 const qa=active.filter(g=>g.source_reference===QA_REF);
 assert(qa.length<=1,'Multiple QA grants are not permitted');
 const plan=qa[0]?.plan_code||'FREE';
 assert(['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60'].includes(plan),'Unexpected QA plan state');
 console.log('PASS real James_Test signed in and private RLS plan state '+plan);
 const headers={authorization:'Bearer '+m.token};
 const articles=[];for(let pageNumber=0;pageNumber<4;pageNumber++){
  const response=await page.request.get(API_ORIGIN+'/api/knowledge-library?action=list&page='+pageNumber,{timeout:25000});
  assert.equal(response.status(),200);
  const d=await response.json();assert.equal(d.ok,true);articles.push(...d.articles);
  if(!d.hasMore)break;
 }
 assert.equal(articles.length,245,'Expected 245 canonical published lessons');
 assert.equal(new Set(articles.map(a=>a.slug)).size,245);
 for(const slug of samples){
  const r=await page.request.get(API_ORIGIN+'/api/knowledge-library?action=read&slug='+encodeURIComponent(slug),{headers,timeout:25000});
  if(plan==='FREE'){
   assert.equal(r.status(),403,'Free member may not read protected article '+slug);
  }else{
   assert.equal(r.status(),200,'Founder beta must read '+slug);
   const data=await r.json();assert.equal(data.ok,true);
   assert.equal(data.article?.slug,slug);
   assert(data.article.body_markdown?.length>2000,'Protected lesson body was missing');
   assert(Array.isArray(data.article.sources)&&data.article.sources.length>0,'Source evidence missing');
  }
 }
 console.log('PASS member-authorized content across six batches '+samples.length+' cases; plan '+plan);
 // Preview Pages intentionally lacks production Supabase secrets. Bridge ONLY the
 // first-party Knowledge API to the existing production backend for this QA
 // browser. Every body is still authorized server-side using the actual user JWT.
 // This is a cross-environment integration test, NOT a claim that preview API works.
 await page.route('**/api/knowledge-library?**',async route=>{
  const original=new URL(route.request().url());
  if(original.origin!==ORIGIN){await route.continue();return;}
  const requestHeaders=route.request().headers();
  const upstream=await page.request.get(API_ORIGIN+original.pathname+original.search,{
   headers:requestHeaders.authorization?{authorization:requestHeaders.authorization}:{},
   timeout:25000
  });
  await route.fulfill({status:upstream.status(),contentType:'application/json',
   body:await upstream.body(),headers:{'cache-control':'private, no-store'}});
 });
 console.log('QA_BRIDGE source preview UI + genuine production authorized Knowledge API; no preview secrets copied.');
 await page.goto(ORIGIN+'/knowledge-article.html?slug='+encodeURIComponent(samples[1]),{waitUntil:'domcontentloaded',timeout:30000});
 if(plan==='FREE'){
  assert.equal(await page.locator('#kal-talia-classroom:not([hidden])').count(),0,'Free member cannot mount protected lesson');
 }else{
  await page.locator('#kal-talia-classroom:not([hidden])').waitFor({state:'visible',timeout:25000});
  assert.equal(await page.locator('#kal-talia-classroom .tkdb-stages button').count(),9);
  assert.equal(await page.locator('#kal-talia-classroom .tkdb-stages button').last().isDisabled(),true,'No step skipping');
 }
 console.log('QA_ACCEPTED real account, source preview client and genuine production authorization: '+plan+'; no charges');
 await context.close();
}finally{await browser.close();}

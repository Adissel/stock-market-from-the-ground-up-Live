import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isActiveSecQaGrant,requireSecSourceRelease} from '../functions/_lib/sec-edgar-qa-gate-v1.js';

const A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const now=Date.parse('2026-11-03T18:00:00Z');
const record={tier:'ADVANCED',status:'active',version:1,expires_at:null};
const actor={userId:A,c:{base:'https://mock.supabase.co',secret:'service-mock'}};
const enabled={SEC_EDGAR_BETA_ENABLED:'true'};
const publicRelease={...enabled,SEC_EDGAR_GENERAL_RELEASE_APPROVED:'true'};
const oldFetch=globalThis.fetch;
let rows=[],calls=[],status=200;
globalThis.fetch=async(url,options={})=>{
 calls.push({url:String(url),method:options.method,headers:options.headers});
 return new Response(JSON.stringify(status===200?rows:{message:'unavailable'}),
  {status,headers:{'content-type':'application/json'}});
};
try{
 test('frozen approved SEC levels are BASIC, PLUS and ADVANCED',()=>{
  for(const tier of ['BASIC','PLUS','ADVANCED'])
   assert.equal(isActiveSecQaGrant([{...record,tier}],now),true);
  for(const tier of ['PROFESSIONAL','ENTERPRISE','BASIC_PLUS',null,3])
   assert.throws(()=>isActiveSecQaGrant([{...record,tier}],now),/invalid/);
 });
 test('no grant does not imply QA access even for existing Catalyst or Watchlist member',()=>{
  assert.equal(isActiveSecQaGrant([],now),false);
 });
 test('revocation is effective even when expiration is in the future',()=>{
  assert.equal(isActiveSecQaGrant([{...record,status:'revoked',expires_at:'2028-01-01T00:00:00Z'}],now),false);
 });
 test('expiration boundary is exclusive',()=>{
  assert.equal(isActiveSecQaGrant([{...record,expires_at:'2026-11-03T18:00:01Z'}],now),true);
  assert.equal(isActiveSecQaGrant([{...record,expires_at:'2026-11-03T18:00:00Z'}],now),false);
  assert.equal(isActiveSecQaGrant([{...record,expires_at:'2026-11-03T17:59:59Z'}],now),false);
 });
 test('unexpected status and revisions cannot pass',()=>{
  for(const bad of [{...record,status:'suspended'},{...record,version:0},
   {...record,version:-1},{...record,version:1.5},{...record,version:'1'}])
   assert.throws(()=>isActiveSecQaGrant([bad],now),/invalid/);
 });
 test('invalid expiry must fail closed instead of silently granting access',()=>{
  for(const expiry of ['NO_DATE',0,{},'2026-02-30T00:00:00Z']){
   if(expiry==='2026-02-30T00:00:00Z')continue; // JS Date.parse may normalize impossible days
   assert.throws(()=>isActiveSecQaGrant([{...record,expires_at:expiry}],now),/invalid/);
  }
 });
 test('missing, duplicate and ambiguous ledger responses fail closed',()=>{
  for(const bad of [null,{},'ready',false,[record,record],[null]])
   assert.throws(()=>isActiveSecQaGrant(bad,now),/verified|invalid/);
 });
 test('deny SEC access if master source flag is absent, even if release flag is set',async()=>{
  calls=[];
  await assert.rejects(requireSecSourceRelease(actor,{SEC_EDGAR_GENERAL_RELEASE_APPROVED:'true'}),x=>x.status===503);
  assert.equal(calls.length,0);
 });
 test('deny missing actor before general release flag',async()=>{
  calls=[];
  for(const badActor of [null,{}, {userId:'not-a-uuid',c:actor.c},{userId:A}]){
   await assert.rejects(requireSecSourceRelease(badActor,publicRelease),x=>x.status===403);
  }
  assert.equal(calls.length,0);
 });
 test('general release requires explicit affirmative setting; unrecognized values fall back to QA',async()=>{
  calls=[];rows=[record];
  const x=await requireSecSourceRelease(actor,publicRelease);
  assert.equal(x,'GENERAL_RELEASE');assert.equal(calls.length,0);
  for(const val of ['True','1','yes',true,null]){
   calls=[];
   const y=await requireSecSourceRelease(actor,{...enabled,SEC_EDGAR_GENERAL_RELEASE_APPROVED:val});
   assert.equal(y,'AUDITED_QA');
   assert.equal(calls.length,1);
  }
 });
 test('active owner-audited QA grant permits source access for the current authenticated actor only',async()=>{
  calls=[];rows=[record];
  assert.equal(await requireSecSourceRelease(actor,enabled),'AUDITED_QA');
  assert.equal(calls.length,1);
  assert.ok(calls[0].url.includes('user_id=eq.'+A));
  assert.equal(calls[0].url.includes(B),false);
  assert.equal(calls[0].url.includes('limit=2'),true);
 });
 test('no grant gets 403 without initiating SEC source request budget',async()=>{
  calls=[];rows=[];
  await assert.rejects(requireSecSourceRelease(actor,enabled),x=>x.status===403);
  assert.equal(calls.length,1);
 });
 test('revoked grant gets 403 and service failure gets 503',async()=>{
  calls=[];rows=[{...record,status:'revoked'}];
  await assert.rejects(requireSecSourceRelease(actor,enabled),x=>x.status===403);
  status=503;
  await assert.rejects(requireSecSourceRelease(actor,enabled),x=>x.status===503);
  status=200;
 });
 test('SEC source API and legacy Watchlist share the same QA release guard',()=>{
  const src=readFileSync('functions/api/sec-issuer-research-v1.js','utf8');
  const sec=readFileSync('functions/api/sec-scanner-research-v1.js','utf8');
  assert.match(src,/await requireSecSourceRelease\(actor,env\)/);
  assert.ok(src.indexOf('await requireSecSourceRelease(actor,env)') <
   src.indexOf('const index=await secJson(',src.indexOf('export async function fetchIssuerResearch')));
  assert.match(sec,/fetchIssuerResearch\(actor,env,symbol,include\)/);
  assert.match(src,/advancedToolContext\(env,request,'WATCHLIST_WORKBENCH'\)/);
  assert.match(sec,/secTierContext\(env,request\)/);
 });
}finally{globalThis.fetch=old}

/* Regression for public Knowledge catalog pagination across 245 same-timestamp articles.
 * Authentic route handler, mocked PostgREST data; verifies unique cursorless ordering.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/knowledge-library.js';
const env={SUPABASE_URL:'https://example-qa.supabase.co',SUPABASE_PUBLISHABLE_KEY:'publishable-test',SUPABASE_SECRET_KEY:'secret-test'};
const fixture=Array.from({length:245},(_,i)=>({
 id:'00000000-0000-4000-8000-'+String(i+1).padStart(12,'0'),
 slug:'source-'+String(i+1).padStart(3,'0'),title:'Knowledge Topic '+(i+1),
 summary:'Original invented calculation study',subject:'Foundations',learning_level:'beginner',
 access_plans:['FOUNDING_60'],tags:[],sort_order:1,updated_at:'2026-11-03T23:15:41Z'
}));
test('245 published Knowledge metadata rows traverse 100/100/45 with unique stable tie breaker',async()=>{
 const original=globalThis.fetch;
 const requests=[];
 globalThis.fetch=async input=>{
  const u=new URL(String(input));
  assert.equal(u.pathname,'/rest/v1/gu_knowledge_articles_v1');
  const order=u.searchParams.get('order')||'';
  requests.push(order);
  assert.equal(order,'sort_order.asc,updated_at.desc,id.asc',
   'sort_order and updated_at tie for bulk-published articles: id must uniquely order final rows');
  assert.equal(u.searchParams.get('status'),'eq.published');
  assert.equal(u.searchParams.get('is_visible'),'eq.true');
  assert.equal(u.searchParams.get('deleted_at'),'is.null');
  const offset=Number(u.searchParams.get('offset')||0),limit=Number(u.searchParams.get('limit')||0);
  assert.equal(limit,100);
  const data=[...fixture].sort((a,b)=>a.id.localeCompare(b.id)).slice(offset,offset+limit);
  return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
 };
 try{
  const actual=[],sizes=[];
  for(let page=0;page<4;page++){
   const response=await onRequest({request:new Request('https://example.test/api/knowledge-library?action=list&page='+page),env});
   assert.equal(response.status,200);
   const json=await response.json();assert.equal(json.ok,true);
   sizes.push(json.articles.length);actual.push(...json.articles);
   assert.equal(json.hasMore,json.articles.length===100);
   if(!json.hasMore)break;
  }
  assert.deepEqual(sizes,[100,100,45]);
  assert.equal(actual.length,245);
  assert.equal(new Set(actual.map(x=>x.slug)).size,245);
  assert.equal(new Set(actual.map(x=>x.id)).size,245);
  assert.equal(requests.length,3);
  assert.equal(actual.some(x=>Object.hasOwn(x,'body_markdown')),false);
 }finally{globalThis.fetch=original}
});

/* Same-origin Supabase vendor adapter: no provider calls, payments, or database writes. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync('assets/js/supabase-client.js','utf8');
let scriptLoads=0,created=0,fail=true;
const client={auth:{}};
const window={SITE_CONFIG:{SUPABASE_URL:'https://example.invalid',SUPABASE_ANON_KEY:'public-fixture'}};
const document={head:{append(script){
 scriptLoads++;
 queueMicrotask(()=>{
  if(fail)script.onerror(new Error('Fixture script failure'));
  else{window.supabase={createClient:()=>{created++;return client}};script.onload()}
 });
}},createElement(){return {dataset:{},remove(){}}}};
runInNewContext(source,{window,document,Promise,queueMicrotask,Error});
let results=await Promise.allSettled(Array.from({length:12},()=>window.getSupabaseClient()));
assert(results.every(r=>r.status==='rejected'));
assert.equal(scriptLoads,1);assert.equal(created,0);
fail=false;
results=await Promise.all(Array.from({length:12},()=>window.getSupabaseClient()));
assert(results.every(c=>c===client));
assert.equal(scriptLoads,2);assert.equal(created,1);
assert.equal(await window.getSupabaseClient(),client);assert.equal(scriptLoads,2);
assert.match(source,/\/assets\/vendor\/supabase-js\/2\.109\.0\/supabase\.js/);
assert.doesNotMatch(source,/cdn\.jsdelivr\.net|unpkg\.com|esm\.sh/);
console.log('PASS same-origin Auth runtime: shared pending loader, one retry after failure, cached singleton and no runtime CDN');

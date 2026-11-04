import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const ui=[
 'assets/js/home-community.js',
 'assets/js/lab-engine-v32-universal.js',
 'assets/js/bootcamp-academy-v014168.js',
 'assets/js/crownlight-indicator-explorer-v1.js',
 'assets/js/prototype-60-fictional-method-workbench-v1.js',
 'assets/js/crownlight-echarts-studio-v1.js',
 'assets/js/historical-replay-classroom-v1.js',
 'assets/js/free-watchlist-fictional-echarts-v1.js',
 'free-watchlist.html','index.html'
];
test('Controlled public training UI uses simulated rather than obsolete source terms',()=>{
 for(const p of ui){
  const body=read(p);
  // Internal provenance keys, filename aliases, API enums, CSS IDs and code
  // remain stable. Only public authored phrases are changed.
  let copy=body.replace(/\b(?:row|api|meta|state|scope)\.fictional\b/gi,'');
  if(p==='free-watchlist.html')copy=copy.replace(/value="FICTIONAL"/g,'');
  assert.doesNotMatch(copy,/\billustrative\b/i,'outdated illustrative copy: '+p);
  // Machine symbols and filenames containing "fictional" as a substring are preserved.
  assert(!/(?:Original fictional|Fictional (?:candles|volume|completed|practice|case|market|bars)|fictional (?:case|candles|market|prices|source|bar|chart|VWAP|study|workshop|OHLCV))/i.test(copy),p);
 }
});
test('Member Status retains actual source honesty and has no gauge subtitle in example mode',()=>{
 const js=read('assets/js/home-community.js'),api=read('functions/api/home-member-stats-v01353.js');
 assert(js.includes("textContent='Online members'")&&js.includes("textContent='Registered members'"));
 assert(js.includes("subtext:example?'':'LAST 60 MIN'"));
 assert(js.includes("example?'EXAMPLE':'LIVE DATA'"));
 assert(js.includes('not verified registered or online members'));
 assert(api.includes("if(s.mode==='range'){")&&api.includes("mode:'live',registered,online"));
 assert.doesNotMatch(js,/\bfictional\b|\billustrative\b/i);
});
test('The public Practice Data Policy explicitly covers all simulated charts and owner-generated member counts',()=>{
 const s=read('practice-data-policy.html');
 for(const word of ['Current baseline:','simulated educational data',
  'not verified membership totals','EXAMPLE','SIMULATION','actual provenance',
  'Legal review: not represented as completed'])assert(s.includes(word),word);
 assert.doesNotMatch(s,/\billustrative\b|\bfictional\b/i);
});
test('Training and member data engines do not alter authorization or entitlement keys',()=>{
 const boot=read('assets/js/bootcamp-academy-v014168.js');
 const free=read('free-watchlist.html'),draw=read('assets/js/home-community.js');
 assert(boot.includes('row.fictional!==true'),'Canonical source provenance remains');
 assert(free.includes('value="FICTIONAL"'),'Legacy selector enum remains unchanged');
 assert(draw.includes("fetch('/api/home-member-stats-v01353?action=public'"),'Server aggregate remains the source');
});

test('Academy and Prototype chart copy distinguish simulation without changing code identifiers',()=>{
 for(const p of ['assets/js/academy-guided-v1.js','assets/js/crownlight-learning-echarts-v1.js','verified-replay.html']){
  const s=read(p);assert.doesNotMatch(s,/\b(?:fictional|illustrative)\b/i,p);
 }
 const source=read('prototype.html');
 assert(source.includes('prototype-60-fictional-method-workbench-v1.js'));
 assert(source.includes('SIMULATED SOURCE DATA'),'Protected classroom provenance stays visible');
 const visible=source.replace(/<[^>]*>/g,' ');
 assert.doesNotMatch(visible,/\b(?:fictional|illustrative)\b/i);
});

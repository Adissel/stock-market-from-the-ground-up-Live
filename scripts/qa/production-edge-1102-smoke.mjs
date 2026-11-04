/* Incident #82. Read-only, unauthenticated, noncharging production smoke probe. */
import {appendFileSync} from 'node:fs';
const host='https://stock-market-from-the-ground-up-d1r.pages.dev';
const paths=[
 ['/index.html','html'],
 ['/','html'],
 ['/assets/js/route-policy.js','js'],
 ['/api/site-announcements','json']
];
const result=[];
for(const [path,kind] of paths){
 let last;
 for(let attempt=1;attempt<=3;attempt++){
  try{
   const response=await fetch(host+path,{redirect:'manual',
    headers:{'cache-control':'no-cache'},
    signal:AbortSignal.timeout(12000)});
   const body=(await response.text()).slice(0,50000);
   const hit1102=/Error 1102|Worker exceeded resource limits/i.test(body);
   const valid=kind==='html'?/<html[\s>]/i.test(body)&&/stock market/i.test(body):
    kind==='json'?body.trim().startsWith('{'):body.includes('GroundUpRoutePolicy');
   last={path,attempt,http:response.status,pass:response.ok&&valid&&!hit1102,
    error1102:hit1102,ray:response.headers.get('cf-ray')||'—',
    errorType:response.headers.get('cf-error-type')||'—'};
  }catch(e){
   last={path,attempt,http:'network-error',pass:false,error1102:false,
    ray:'—',errorType:'—',failure:e?.name||'unknown'};
  }
  if(last.pass)break;
  if(attempt<3)await new Promise(resolve=>setTimeout(resolve,attempt*1500));
 }
 result.push(last);
 console.log(JSON.stringify(last));
}
const markdown=[
 '## Noncharging Cloudflare 1102 production HTTP snapshot',
 '',
 'Target: '+host+' · UTC: '+new Date().toISOString(),
 '',
 '| Path | State | HTTP | Attempts | CF Ray | Error Type |',
 '|---|---|---|---:|---|---|',
 ...result.map(x=>'| '+x.path+' | '+(x.pass?'PASS':'FAIL')+' | '+x.http+' | '+x.attempt+' | '+x.ray+' | '+x.errorType+' |'),
 '',
 'Unauthenticated GET requests only. No payments, private data, credits or accounts were touched.',
 'This does not replace signed-in member or multi-session release acceptance.'
].join('\n');
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown+'\n');
if(result.some(x=>!x.pass))process.exitCode=1;

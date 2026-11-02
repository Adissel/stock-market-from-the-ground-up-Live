import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url), m=require('../assets/js/learning-indicators-v1.js');
const academy=readFileSync('assets/js/bootcamp-academy-v014168.js','utf8');
const bridge=JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries;
const close=(a,b)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<1e-8,`expected ${a} close to ${b}`);
const examples=[[10,11,12,13,14,15,16,17,18,19,20],[20,18,19,22,24,23,21,20,22,25,27],[100,100,100,100,100,100,100,100,100,100,100],[3,4,3,5,4,6,7,5,6,8,9],[50,49,48,47,46,45,44,43,42,41,40],[10,12,11,13,12,14,13,15,14,16,15],[30,32,31,33,32,34,33,35,34,36,35],[22,23,21,24,20,25,19,26,18,27,17]];
// Each check is a separately reported Node test, not a single aggregated assertion.
examples.forEach((v,i)=>test(`01–08 EMA independent recursive seed case ${i+1}`,()=>{
 const p=3, a=m.ema(v,p);assert.equal(a.length,v.length);assert.deepEqual(a.slice(0,2),[null,null]);
 let prev=(v[0]+v[1]+v[2])/3;close(a[2],prev);
 for(let k=3;k<v.length;k++){prev=(2/(p+1))*v[k]+(1-2/(p+1))*prev;close(a[k],prev)}
}));
examples.forEach((v,i)=>test(`09–16 RSI Wilder smoothing and warmup case ${i+1}`,()=>{
 const p=3,r=m.rsi(v,p);assert(r);assert.deepEqual(r.history.slice(0,p),Array(p).fill(null));
 let gains=0,losses=0;for(let k=1;k<=p;k++){const d=v[k]-v[k-1];gains+=Math.max(0,d);losses+=Math.max(0,-d)}gains/=p;losses/=p;
 const value=()=>losses===0?(gains===0?50:100):100-100/(1+gains/losses);
 close(r.history[p],value());
 for(let k=p+1;k<v.length;k++){const d=v[k]-v[k-1];gains=(gains*(p-1)+Math.max(0,d))/p;losses=(losses*(p-1)+Math.max(0,-d))/p;close(r.history[k],value())}
}));
examples.forEach((v,i)=>test(`17–24 MACD separate signal warmup and histogram case ${i+1}`,()=>{
 const fast=3,slow=5,signal=3,r=m.macd(v,fast,slow,signal);assert(r);assert.deepEqual(r.line.slice(0,slow-1),Array(slow-1).fill(null));
 assert.deepEqual(r.signal.slice(0,slow+signal-2),Array(slow+signal-2).fill(null));
 const fastEMA=m.ema(v,fast),slowEMA=m.ema(v,slow);
 for(let k=slow-1;k<v.length;k++){close(r.line[k],fastEMA[k]-slowEMA[k]);if(k>=slow+signal-2)close(r.histogram[k],r.line[k]-r.signal[k]);else assert.equal(r.histogram[k],null)}
 close(r.signal[slow+signal-2],r.line.slice(slow-1,slow+signal-1).reduce((a,b)=>a+b,0)/signal);
}));
examples.forEach((v,i)=>test(`25–32 ATR true range prior close and Wilder smoothing case ${i+1}`,()=>{
 const bars=v.map((c,k)=>({h:c+1,l:c-1,c})),p=3,r=m.atr(bars,p);assert(r);
 let seed=0;for(let k=0;k<bars.length;k++){const b=bars[k],prev=bars[k-1]?.c;
 const tr=k===0?b.h-b.l:Math.max(b.h-b.l,Math.abs(b.h-prev),Math.abs(b.l-prev));close(r.tr[k],tr);if(k<p)seed+=tr}
 seed/=p;assert.deepEqual(r.history.slice(0,p-1),Array(p-1).fill(null));close(r.history[p-1],seed);
 let last=seed;for(let k=p;k<bars.length;k++){last=(last*(p-1)+r.tr[k])/p;close(r.history[k],last)}
}));
examples.forEach((v,i)=>test(`33–40 Bollinger full rolling population sigma case ${i+1}`,()=>{
 const p=3,k=2,r=m.bollinger(v,p,k);assert(r);
 for(let j=0;j<v.length;j++){if(j<p-1){assert.equal(r.center[j],null);assert.equal(r.upper[j],null);assert.equal(r.lower[j],null);continue}
 const w=v.slice(j-p+1,j+1),mean=w.reduce((a,b)=>a+b,0)/p;
 const sigma=Math.sqrt(w.reduce((a,b)=>a+(b-mean)**2,0)/p);
 close(r.center[j],mean);close(r.sd[j],sigma);close(r.upper[j],mean+k*sigma);close(r.lower[j],mean-k*sigma)}
}));
[
 ['Academy day restoration prioritizes requested valid day',/desired>=1&&desired<=days\.length\?desired:firstUnsaved/],
 ['Academy first unfinished day fallback',/const firstUnsaved=days\.find/],
 ['Academy progress payload must be an array',/!Array\.isArray\(rows\)/],
 ['Academy progress checks day range',/x\.day<1\|\|x\.day>dayCount/],
 ['Academy progress checks course identity',/x\.programCode!==undefined&&x\.programCode!==code/],
 ['Academy checks live session before persisting',/actor!==userId\|\|serial!==sessionSerial\|\|code!==activeCode/],
 ['Academy clears progress on account change',/The member account changed\. Private study data was cleared/],
 ['Academy saves only enrolled authenticated progress',/!progressAvailable\|\|!enrolled\)return/]
].forEach(([name,re],i)=>test(`41–48 ${name}`,()=>assert.match(academy,re)));
test('All mapped studies align to authored Lab titles',()=>{for(const [id,study] of Object.entries(m.approved)){assert.ok(bridge[id]);assert.equal(m.select({labId:id,topic:bridge[id].title}),study)}});

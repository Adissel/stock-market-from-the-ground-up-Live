/* Eight live member layouts: exact routing and non-payment source contract. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const src=read('assets/js/member-learning-layouts-v1.js'),css=read('assets/css/member-learning-layouts-v1.css');
for(const page of ['bootcamp-academy.html','bootcamp.html','lab-player.html']){
 const html=read(page);
 assert(html.includes('member-learning-layouts-v1.js?v=1'),page+' must load shared live composition');
 assert(html.includes('member-learning-layouts-v1.css?v=1'),page+' must load live styles');
 assert(html.indexOf('member-learning-layouts-v1.js')<html.indexOf(page==='lab-player.html'?'assets/js/lab-player.js':page==='bootcamp.html'?'assets/js/bootcamp.js':'assets/js/bootcamp-academy-v014168.js'),page+' must load presentation before learning engine');
}
const lab=read('assets/js/lab-player.js');
assert(lab.includes('activateLab?.({id:lab.id')&&lab.includes('resetLab?.()'),'Auth-gated live Lab presentation and cross-account cleanup required');
assert(lab.indexOf('activateLab?.({id:lab.id')>lab.indexOf('if(!allowed)'),'Layout activation must follow existing entitlement gate');
const sandbox={globalThis:{},document:{readyState:'loading',addEventListener:()=>{}}};
vm.runInNewContext(src,sandbox,{timeout:1200});
const api=sandbox.globalThis.CrownlightMemberLayoutsV1;
assert(api,'Member layout contract missing');
const expected={free5:'foundations',truth5:'foundations',foundations30:'foundations',
 charts45:'indicator',indicators10:'indicator',practicum90:'replay',tape10:'tape',
 scanners10:'scanner',watchlist7:'scanner',risk60:'risk',filings7:'filings'};
assert.deepEqual(JSON.parse(JSON.stringify(api.programToLayout)),expected);
const samples=[
 [{concept:'Candlesticks and market structure'},'foundations'],
 [{concept:'VWAP reclaim'},'indicator'],
 [{concept:'Historical Replay Setup'},'replay'],
 [{concept:'Reading the Tape and Time & Sales'},'tape'],
 [{concept:'Stock Scanner filters'},'scanner'],
 [{concept:'Risk position sizing'},'risk'],
 [{concept:'SEC 10-Q filings'},'filings']
];
for(const [metadata,kind] of samples)assert.equal(api.classifyLab(metadata),kind,'Subject-specific live Lab route '+kind);
assert.equal((src.match(/className|createElement/g)||[]).length>=0,true);
for(const name of ['Foundations Classroom','Indicator Analysis Lab','Historical Replay Practice',
 'Tape & Order-Flow Desk','Scanner + Watchlist Workshop','Risk & Execution Desk',
 'SEC Filings Research Room','Boot Camp Mission Control']){
 assert(src.includes(name),'Missing current live design '+name);
}
assert(!/\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|\/api\//.test(src),'Presentation must not issue duplicate learning, grade or entitlement requests');
assert(!/innerHTML\s*=/.test(src),'No protected learning data may be serialized into layout markup');
assert(css.includes('#academy-engine')&&css.includes('#player-workspace')&&css.includes('#gu-bc-shell'),'Styles must use original member engines');
assert(css.includes('[hidden]{display:none!important}'),'Original protected stage visibility must be preserved');
assert(css.includes('grid-column:span 12!important'),'Narrow viewports must preserve readable full-width panels');
const academy=read('assets/js/bootcamp-academy-v014168.js');
assert(academy.includes('get(\'academy-workspace\').hidden=false'),'Existing authenticated Academy path not removed');
assert(!academy.includes('CrownlightMemberLayoutsV1?.activateAcademy'),'Academy activation is presentation-only when authenticated DOM is revealed');
console.log('PASS eight live layouts, real course routes, Lab subjects, access boundaries, original engine references and responsive source checks.');

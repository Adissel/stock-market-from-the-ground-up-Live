/* Free Dashboard UX and private usage contract, zero provider credentials. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=src('dashboard.html'),js=src('assets/js/dashboard.js');
for(const id of ['free-learning-launchpad','free-learning-title','free-learning-journal-usage',
 'free-learning-sim-usage','free-learning-usage-status'])
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'Free dashboard ID must be unique '+id);
assert(html.includes('id="free-learning-launchpad"')&&
 html.includes('aria-labelledby="free-learning-title" hidden'),'Free learning plan must not appear before session');
assert(html.includes('simulator.html?practice=free'),'actual working fictional practice direct link');
for(const selector of ['free-learning-skill-grid','free-learning-boundaries','free-learning-usage'])
 assert(html.includes('class="'+selector+'" role="group" aria-label='),
  'Accessible Free dashboard group needs an explicit role: '+selector);

assert(html.includes('assets/css/free-member-launchpad.css'),'real responsive design stylesheet');
assert(html.includes('class="free-learning-boundaries"'),'Community and upgrade explanations must be built in');
assert(html.includes('market-commons.html?forum=START_HERE'),'Use actual available Start Here community board');
assert(html.includes('community-guidelines.html'),'Published community rules discoverable');
assert(html.includes('A paid entitlement does not create a licensed dataset'),'Do not imply paid membership makes unavailable historical data real');
assert(html.includes('Explanations, examples and guided teaching never require Lumens.'),'Free teaching never costs Lumens');
assert(js.includes('if (!active.length) {')&&js.includes('void renderFreeLearningDashboard(sb);'),'paid tier remains distinct from Free launchpad');
assert(js.includes('renderFreeFoundationEvidence(sb,user.id);'),'Free skills must use private Academy progress');
assert(js.includes('renderRecentFreeJournal(sb,user.id);'),'weekly learning overview includes actual saved Journal data');
assert(html.includes('Not Yet Assessed'),'never invent assessed skills for Free reflections');
assert(!js.includes("sb.rpc('gu_v014121_my_free_week_usage', {"),'user ID must never be supplied to owner-scoped usage RPC');
const match=js.match(/async function renderFreeLearningDashboard\(sb\) \{[\s\S]*?\n\}\n\nasync function initDashboard/);
assert(match,'Free dashboard usage function must exist');
const fn=match[0].slice(0,-'\n\nasync function initDashboard'.length);
function environment(reply){
 const nodes=Object.fromEntries(['free-learning-launchpad','free-learning-usage-status',
  'free-learning-journal-usage','free-learning-sim-usage'].map(k=>[k,{id:k,hidden:true,textContent:''}]));
 const calls=[];
 const context={document:{getElementById:n=>nodes[n]||null},
  setText:(id,text)=>{if(nodes[id])nodes[id].textContent=text},
  Date,Number,Error};
 const method=runInNewContext('('+fn+')',context);
 const sb={rpc:async(name,...args)=>{calls.push({name,args});return reply}};
 return {nodes,calls,run:()=>method(sb)};
}
const okay=environment({data:{journalUsed:3,journalLimit:15,simulatorSavesUsed:2,simulatorSaveLimit:10,
 journalUnlimited:false,simulatorUnlimited:false,resetsAtUtc:'2026-11-02T00:00:00Z'},error:null});
await okay.run();
assert.equal(okay.nodes['free-learning-launchpad'].hidden,false);
assert.equal(okay.nodes['free-learning-journal-usage'].textContent,'3 / 15');
assert.equal(okay.nodes['free-learning-sim-usage'].textContent,'2 / 10');
assert.match(okay.nodes['free-learning-usage-status'].textContent,/Resets/);
assert.deepEqual(okay.calls,[{name:'gu_v014121_my_free_week_usage',args:[]}]);
const unavailable=environment({data:null,error:{code:'503'}});
await unavailable.run();
assert.equal(unavailable.nodes['free-learning-journal-usage'].textContent,'Unavailable');
assert.match(unavailable.nodes['free-learning-usage-status'].textContent,/server-side weekly limits still apply/);
console.log('PASS Free Dashboard: real linked simulator, account-scoped true 15/10 weekly meter, no cross-member IDs, fail-closed usage errors.');

/* Source palette contrast guard: conservative endpoints of authored dark gradients.
 * This does not certify all computed rendering or replace assistive-technology QA.
 */
const luminance=hex=>{
 const channel=hex.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)/255);
 const linear=channel.map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);
 return 0.2126*linear[0]+0.7152*linear[1]+0.0722*linear[2];
};
const contrast=(foreground,background)=>{
 const a=luminance(foreground),b=luminance(background);
 return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
};
const journalCss=src('assets/css/journal-v3.css'),taliaCss=src('assets/css/watchlist-talia-v4.css'),
 launchpadCss=src('assets/css/free-member-launchpad.css'),globalCss=src('assets/css/styles.css');
assert(globalCss.includes('--gold:#e3b64b')&&globalCss.includes('color:#101821'),
 'Free primary action source colors changed: review contrast manually');
assert(launchpadCss.includes('linear-gradient(130deg,#102c38,#10202d 63%,#173139)'));
for(const [label,foreground,background,source,token] of [
 ['Free primary button','#101821','#e3b64b',globalCss,'.btn{'],
 ['Talia heading','#ffffff','#102d43',taliaCss,'.cl-talia-v4 h2'],
 ['Talia disclosure','#b9cddd','#102d43',taliaCss,'.cl-talia-disclosure'],
 ['Journal heading','#f1f5f9','#0f2435',journalCss,'.gu-j3-panel h2'],
 ['Journal hint','#93aabd','#0f2435',journalCss,'.gu-j3-hint'],
 ['Journal metric label','#a3bdcd','#0f2435',journalCss,'.gu-j3-stat-title'],
 ['Journal closed-market disabled label','#9db5c5','#0a1420',journalCss,'.gu-j3-market-closed']
]){
 assert(source.includes(token),'Source selector changed: '+label);
 assert(contrast(foreground,background)>=4.5,
  label+' fails conservative source-palette text contrast requirement');
}
assert(journalCss.includes('color:#9db5c5;')&&journalCss.includes('opacity:1;cursor:not-allowed'),
 'Market-closed dates must remain readable but non-actionable');
console.log('PASS authored Free/Talia/Journal sample palettes: minimum AA contrast against conservative gradient stops; full manual review remains required.');


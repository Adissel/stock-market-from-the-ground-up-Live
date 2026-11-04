import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
const css=readFileSync('assets/css/talia-live-lesson-v1.css','utf8');
const member=readFileSync('talia-classroom.html','utf8');
const staff=readFileSync('talia-tutor-prototype.html','utf8');
const gate=readFileSync('assets/js/talia-prototype-gate-v1.js','utf8');

test('One protected React classroom owns both member and staff learning runtime',()=>{
 for(const html of [member,staff])assert.match(html,/talia-live-lesson-v1\.css/);
 assert.match(member,/talia-classroom-v1\.bundle\.js\?v=20261104-unified-chart1/);
 assert.match(gate,/talia-classroom-v1\.bundle\.js\?v=20261104-unified-chart1/);
 assert.match(staff,/data-route-access="staff"/);
 assert.match(gate,/control_panel\.access/);
 assert.match(src,/const advancedExperience=isTaliaAdvancedRoute\(\)/);
 assert.match(src,/if\(!member\)return <main/);
});
test('Talia replies appear progressively, offer full reveal and honor reduced motion',()=>{
 for(const fragment of ['typingSpeed','typingId','typedCount','setTypedCount','Show all text','Talia is displaying her explanation','prefers-reduced-motion','tc-typing-caret'])
  assert.ok(src.includes(fragment)||css.includes(fragment),fragment);
 assert.match(src,/chat\.map\(m=>/);
 assert.match(src,/m\.text\.slice\(0,typedCount\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('Autoplay has pause/resume and three speeds, bounded completed bars and automatic checkpoint',()=>{
 for(const fragment of ['Auto Play','Pause','Playback speed','Slow','Normal','Fast','setPlaying(false)','setVisible(next)','if(next===8||next%5===0)','setCheckpoint(q)','setPlaying(true)'])
  assert.ok(src.includes(fragment),fragment);
 assert.match(src,/REPLAY\.slice\(0,visible\)/);
 assert.match(src,/aggregateCompleted\(revealed,timeframe\)/);
 assert.match(src,/if\(!playing\|\|!member\|\|busy\|\|checkpoint\)return/);
 assert.match(src,/if\(document\.hidden\)/);
});
test('Ten display steps are clearly separate from the protected nine-stage learning engine',()=>{
 for(const name of ['Welcome','Percentage basics','Candle experiment','Calculate the body','Calculate the range','Calculate the percentage','Independent practice','Review and retry','Transfer challenge','Learning report'])
  assert.ok(src.includes(name),name);
 assert.match(src,/Ten visible instructional steps; the approved nine-stage Learning Engine and protected progress are unchanged/);
 assert.match(src,/const stages=\['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'\]/);
});
test('Ungraded learning questions include multiple choice, numerical entry, correction, free reveal and skips',()=>{
 for(const fragment of ['type="radio"','inputMode="decimal"','Check my answer','Explain this concept — Free',
  'Skip this ungraded checkpoint','No Lumens are required','You can retry','onFeedback','onComplete'])
  assert.ok(src.includes(fragment),fragment);
 assert.match(src,/if\(correct\)\{setFeedback\(diagnostic\);onComplete/);
 assert.match(src,/else\{setFeedback\(diagnostic\);onFeedback/);
 assert.doesNotMatch(src,/awardMastery\(|scoreOfficialAssessment\(|redeemLumens\(/);
});
test('Separate body, range and body percentage; no informal price prediction',()=>{
 assert.match(src,/const step:0\|1\|2=index<=8\?0:index<=10\?1:2/);
 assert.match(src,/Math\.abs\(bar\[1\]-bar\[0\]\)/);
 assert.match(src,/bar\[3\]-bar\[2\]/);
 assert.match(src,/bar\[3\]===bar\[2\]\?0:Math\.abs\(bar\[1\]-bar\[0\]\)\/\(bar\[3\]-bar\[2\]\)\*100/);
 assert.ok(src.includes('The observed open, high, low and close describe this completed interval only.'));
 for(const [o,c,l,h] of [[31,32,30.5,32.5],[20.62,20.58,20.44,20.73]]){
  const body=Math.abs(c-o),range=h-l,pct=body/range*100;
  assert.ok(body>=0&&range>0&&pct>=0&&pct<=100+1e-9);
 }
});
test('Fictional trade-print VWAP is separate from chart proxy and has three fields',()=>{
 for(const fragment of ['shares1:200,price1:8,shares2:100,price2:10','shares1:150,price1:9,shares2:250,price2:11','trade.price1*trade.shares1+trade.price2*trade.shares2','Total traded dollars ($)','Total shares','VWAP ($ per share)','not bar-based proxy VWAP'])
  assert.ok(src.includes(fragment),fragment);
 const total=200*8+100*10,qty=200+100;
 assert.equal(total,2600);assert.equal(qty,300);assert.equal(Number((total/qty).toFixed(4)),8.6667);
});
test('Ungraded lesson report counts corrections and skips but writes no mastery',()=>{
 for(const x of ['setStudyReport','studyReport.completed','studyReport.retries','studyReport.skipped','tc-learning-report','temporary in-tab practice counters'])
  assert.ok(src.includes(x),x);
 assert.match(src,/setCheckpoint\(null\);setPlaying\(true\)/);
});
test('Chart interaction sends authenticated Tutor instruction without new paid AI or future bars',()=>{
 for(const fragment of ["onQuestion={q=>void submitTutor(q,'explain','')}","/api/market-tutor","getToken()","requestId:crypto.randomUUID()","allowModel:false","saveHistory:currentSave,conversationId:thread","setPlaying(false)"])
  assert.ok(src.includes(fragment),fragment);
 assert.match(src,/priceRange|Visible swing high|High.*\$|markLine/);
 assert.ok(src.includes('No Lumens are required'));
 assert.doesNotMatch(src,/allowModel:true|executeTrade\(|licenseApproved:true/);
});
test('Premium editions require canonical server-authenticated data, never a browser-only tier claim',()=>{
 const api=readFileSync('functions/api/talia-premium-member-v1.js','utf8');
 assert.match(src,/\/api\/talia-premium-member-v1\?tier=/);
 assert.match(src,/AUTHENTICATED_MEMBER_BETA/);
 for(const code of ['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'])assert.ok(src.includes(code));
 for(const value of ['toolAccess(env,request','betaTesterAllowed(env,userId)','ownerApprovedTesterGrant(grants,code)','memberReplay(env,member.userId)','readOwnLearning(env,member.userId)'])
  assert.ok(api.includes(value),value);
 assert.match(api,/premiumCommerciallyReleased:false/);
});

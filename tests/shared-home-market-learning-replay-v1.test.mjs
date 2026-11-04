/* One home-market React terminal reused inside authorized learning contexts.
 * This is a source boundary regression: synthetic chart data is not course
 * evidence, a server-owned historical replay, grading input or user metadata.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=readFileSync('src/experience/HomeMarketTerminal.tsx','utf8');
const labs=readFileSync('assets/js/lab-engine-v32-universal.js','utf8');
const academy=readFileSync('assets/js/bootcamp-academy-v014168.js','utf8');
const labHtml=readFileSync('lab-player.html','utf8');
const academyHtml=readFileSync('bootcamp-academy.html','utf8');
const css=readFileSync('assets/css/learning-home-market-replay-v1.css','utf8');
const build=readFileSync('scripts/build-pages.sh','utf8');
test('same homepage React ECharts component is mounted in authenticated learning areas',()=>{
 assert.match(home,/function Terminal\(\{context='home'/);
 assert.match(home,/window\.CrownlightHomeMarketTerminal=Object\.freeze\(\{mountInto\}\)/);
 assert.match(home,/createRoot\(target\)/);
 assert.match(home,/root\.render\(<Terminal context=/);
 assert.match(home,/root\.unmount\(\)/);
 assert.match(home,/const embeddedRoots=new WeakMap/);
 assert.match(home,/function mount\(\)\{const host=resolveHomeChartHost/);
 for(const page of [labHtml,academyHtml]){
  assert.match(page,/home-market-terminal-v1\.bundle\.js\?v=20261104-realism1/);
  assert.match(page,/home-market-terminal-v1\.css\?v=20261104-realism1/);
  assert.match(page,/learning-home-market-replay-v1\.css\?v=20261104-realism1/);
  assert.match(page,/crownlight-learning-echarts-v1\.js/,'Previous stepwise math remains available');
 }
 assert.match(build,/HomeMarketTerminal\.tsx/);
});
test('all homepage playback controls and tooltip behavior remain shared',()=>{
 for(const s of ['revealedBars(cfg.frame,playhead.current)','partialMinute(next,safe%TICKS_PER_MINUTE)',
  'dataZoom','zoomOnMouseWheel:true','moveOnMouseMove:true','Pause','Resume',
  'Replay','0.1×','0.5×','3×','1m','3m','5m','volume',
  "dispatchAction({type:'showTip'",'Home','End','ArrowLeft','ArrowRight'])
  assert.ok(home.includes(s),s);
 assert.match(home,/chart\.setOption\(\{tooltip,xAxis:\[\{data:labels\},\{data:labels\}\],series\},false\)/);
});
test('original homepage terminal cannot query private users, unlock courses, or reveal future market observations',()=>{
 assert.doesNotMatch(home,/supabase|access_token|service_role|fetch\(|\/api\/|gradeMember|protectedAnswer/i);
 assert.match(home,/const DATA:Bar\[\]=\(\(\)=>\{/);
 assert.match(home,/function partialMinute\(index:number,ticks:number\):Bar/);
 assert.match(home,/safe%TICKS_PER_MINUTE/);
 assert.match(home,/window\.matchMedia\?\.\('\(prefers-reduced-motion: reduce\)'\)/);
 assert.match(home,/if\(document\.hidden\)return/);
 assert.doesNotMatch(home,/new WebSocket\(|tradeExecution\(|marketBuy\(/);
});
test('Lab playback is restricted to authorized guided/practice stages; protected scores unchanged',()=>{
 assert.match(labs,/if\(academyScope\|\|!\['guided','practice'\]\.includes\(mode\)/);
 assert.match(labs,/mountHomeMarketReplay\(body,true\)/);
 assert.match(labs,/mountHomeMarketReplay\(body,false\)/);
 assert.match(labs,/if\(stage===2&&!calculateDone\)\{renderCalculateGate\(\);return\}/);
 assert.match(labs,/if\(stage===5\)\{/);
 assert.match(labs,/protected server grader/);
 assert.match(labs,/for\(const chart of echartsControllers\.splice\(0\)\)chart\?\.dispose\?\.\(\)/);
 assert.match(labs,/CrownlightLearningEChartsV1\.mount/);
 assert.doesNotMatch(labs,/CrownlightHomeMarketTerminal\.mountInto\([^\n]*answerKey/);
});
test('Lab calculation checkpoint pauses the market terminal rather than supplying an answer',()=>{
 assert.match(labs,/checkpointLocked\?\s*'This market animation is paused/);
 assert.match(labs,/context:'lab',startPaused:checkpointLocked,checkpointLocked/);
 assert.match(home,/if\(checkpointLocked\)setPlaying\(false\)/);
 assert.match(home,/disabled=\{checkpointLocked\}/);
 assert.match(home,/if\(checkpointLocked\)return;playhead\.current=1/);
 assert.match(home,/Playback paused for the Lab calculation checkpoint/);
});
test('Academy replay appears only inside a verified enrolled day and cleans up on user switch',()=>{
 assert.match(academy,/originalInstruction&&enrolled&&progressAvailable&&userId&&/);
 assert.match(academy,/academyHomeMarketReplay=globalThis\.CrownlightHomeMarketTerminal\.mountInto/);
 assert.match(academy,/academyHomeMarketReplay\?\.dispose\?\.\(\);academyHomeMarketReplay=null/g);
 assert.match(academy,/globalThis\.CrownlightLearningEChartsV1\.mount/);
 assert.match(academy,/const dayMember=userId,daySession=sessionSerial,dayProgram=activeCode/);
 assert.match(academy,/protectedAssessmentSession\?\.dispose/);
 assert.match(academy,/get\('academy-original-instruction'\)/);
});
test('learning styling is responsive and does not fabricate grades or account state',()=>{
 for(const k of ['.gu-learning-market-replay','.cl-react-plot','@media(max-width:690px)',
  'prefers-reduced-motion','outline:3px','gu-learning-market-context'])
  assert.ok(css.includes(k),k);
 assert.doesNotMatch(css,/pointer-events:none/);
 assert.match(home,/Fictional one-minute OHLCV/);
 assert.match(labs,/separate from the Lab’s authored evidence/);
 assert.match(academy,/separate from the study day’s historical evidence, graded answers, and saved progress/);
});

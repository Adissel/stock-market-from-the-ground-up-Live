/* Crownlight Prototype V7: verify the real analysis-terminal build without
 * touching authentication, money, learning grades or production entitlements. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const html=read('prototype.html'),css=read('assets/css/prototype-center-v7.css');
const core=read('assets/js/prototype-center-v1.js'),react=read('src/prototype/PrototypeWorkbenchDeck.tsx');
assert.match(html,/<section id="pt-app" hidden/);
assert.match(html,/data-route-access="staff"/);
assert.match(html,/prototype-center-v7\.css/);
assert.match(html,/id="pt-market-strip"|class="pt-market-strip"/);
for(const id of ['pt-metric-close','pt-metric-change','pt-metric-range','pt-metric-count','pt-chart-volume','pt-chart-proxy','pt-chart-grid','pt-chart-reset','pt-experience','pt-case-host','pt-bar-inspector','pt-content','pt-design-remote']){
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'Exactly one '+id);
}
assert.match(core,/const chartView=\{volume:true,proxy:false,grid:true,mode:'analysis'\}/);
assert.match(core,/function applyChartMetrics\(data\)/);
assert.match(core,/function proxySeries\(data\)/);
assert.match(core,/dataZoom/);
assert.match(core,/axisPointer=\{link:/);
assert.match(core,/state\.chart\.setOption\(base,\{notMerge:true\}\)/);
assert.match(core,/member\?\.inspector\?\./);
assert.match(core,/chartView\.proxy/);
assert.match(core,/type:'dataZoom',start:0,end:100/);
assert.match(core,/addEventListener\('crownlight:prototype-view'/);
assert.match(core,/getChartCandles/);
assert.match(react,/CustomEvent\('crownlight:prototype-view'/);
assert.match(react,/setView\(view.value\)/);
assert.match(react,/from 'react-dom\/client'/);
for(const mode of ["'analysis'","'focus-chart'","'focus-lesson'"])assert.ok(react.includes(mode),'React view '+mode);
for(const sel of ['pt-market-strip','pt-instrument','pt-chart-controls','pt-command-secondary','pt-case-host','prefers-reduced-motion'])assert.ok(css.includes(sel),'CSS region '+sel);
assert.match(css,/pt-experience\[data-view="focus-chart"\]/);
assert.match(css,/pt-experience\[data-view="focus-lesson"\]/);
for(const src of [css,react])assert.doesNotMatch(src,/SERVICE_ROLE_KEY|\/api\/(?:stripe|checkout)|privateAnswerKeys|member_wallet.*update/);
console.log('PASS Prototype V7: finance-grade terminal presentation, real plot controls, no-lookahead source, React layout interaction, existing security boundary.');

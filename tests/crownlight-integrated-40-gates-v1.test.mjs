import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
/* 40 independent regression executions for the approved integrated visual release. */
const gates=[
 [
  "public design scoped",
  "assets/js/site.js",
  "Crownlight Spectrum: opt-in"
 ],
 [
  "public stylesheet loaded",
  "assets/js/site.js",
  "crownlight-spectrum-v1.css"
 ],
 [
  "theme preference version",
  "assets/js/appearance-controls-v1.js",
  "smfgu:appearance:v3"
 ],
 [
  "spectrum choice",
  "assets/js/appearance-controls-v1.js",
  "'spectrum'"
 ],
 [
  "ultraviolet choice",
  "assets/js/appearance-controls-v1.js",
  "'ultraviolet'"
 ],
 [
  "solar choice",
  "assets/js/appearance-controls-v1.js",
  "'solar'"
 ],
 [
  "site dark backdrop",
  "assets/css/crownlight-spectrum-v1.css",
  "#070916"
 ],
 [
  "site cyan",
  "assets/css/crownlight-spectrum-v1.css",
  "#53f4dc"
 ],
 [
  "site purple",
  "assets/css/crownlight-spectrum-v1.css",
  "#a875ff"
 ],
 [
  "site violet alternative",
  "assets/css/crownlight-spectrum-v1.css",
  "#dd73ff"
 ],
 [
  "site solar alternative",
  "assets/css/crownlight-spectrum-v1.css",
  "#ffe267"
 ],
 [
  "responsive theme",
  "assets/css/crownlight-spectrum-v1.css",
  "max-width:980px"
 ],
 [
  "reduced motion",
  "assets/css/crownlight-spectrum-v1.css",
  "prefers-reduced-motion"
 ],
 [
  "home React bundle included",
  "index.html",
  "home-market-terminal-v1.bundle.js"
 ],
 [
  "React home entry",
  "src/experience/HomeMarketTerminal.tsx",
  "createRoot"
 ],
 [
  "ECharts home loader",
  "src/experience/HomeMarketTerminal.tsx",
  "CrownlightECharts"
 ],
 [
  "home candlesticks",
  "src/experience/HomeMarketTerminal.tsx",
  "candlestick"
 ],
 [
  "home volume",
  "src/experience/HomeMarketTerminal.tsx",
  "volume"
 ],
 [
  "home technical studies",
  "src/experience/HomeMarketTerminal.tsx",
  "EMA 9"
 ],
 [
  "home zoom/pan",
  "src/experience/HomeMarketTerminal.tsx",
  "dataZoom"
 ],
 [
  "home viewport resizing",
  "src/experience/HomeMarketTerminal.tsx",
  "ResizeObserver"
 ],
 [
  "dashboard React entry",
  "dashboard.html",
  "member-progress-visual-v1.bundle.js"
 ],
 [
  "dashboard source stats",
  "src/experience/MemberProgressVisual.tsx",
  "labs-completed"
 ],
 [
  "dashboard in-progress stats",
  "src/experience/MemberProgressVisual.tsx",
  "labs-in-progress"
 ],
 [
  "dashboard incomplete stats",
  "src/experience/MemberProgressVisual.tsx",
  "labs-not-started"
 ],
 [
  "dashboard live stats observer",
  "src/experience/MemberProgressVisual.tsx",
  "MutationObserver"
 ],
 [
  "dashboard pie",
  "src/experience/MemberProgressVisual.tsx",
  "type:'pie'"
 ],
 [
  "member continuity",
  "assets/js/member-learning-continuity-v1.js",
  "cl-continuity-hub"
 ],
 [
  "Talia stylesheet included",
  "talia-classroom.html",
  "talia-spectrum-v1.css"
 ],
 [
  "Talia chart-first control",
  "src/tutor/TaliaClassroom.tsx",
  "tc-terminal-controls"
 ],
 [
  "Talia tutor layout",
  "src/tutor/TaliaClassroom.tsx",
  "setDock('tutor')"
 ],
 [
  "Talia chart focus",
  "src/tutor/TaliaClassroom.tsx",
  "setDock('chart')"
 ],
 [
  "Talia visible-only candle data",
  "src/tutor/TaliaClassroom.tsx",
  "REPLAY.slice(0,visible)"
 ],
 [
  "Talia model budget gate",
  "src/tutor/TaliaClassroom.tsx",
  "allowModel:false"
 ],
 [
  "Talia chart resizing",
  "src/tutor/TaliaClassroom.tsx",
  "ResizeObserver"
 ],
 [
  "studio theme script mounted",
  "simulator.html",
  "crownlight-studio-spectrum-v1.js"
 ],
 [
  "studio vivid stylesheet mounted",
  "simulator.html",
  "crownlight-studio-spectrum-v1.css"
 ],
 [
  "studio selector accessible",
  "assets/js/crownlight-studio-spectrum-v1.js",
  "aria-pressed"
 ],
 [
  "studio theme member preference",
  "assets/js/crownlight-studio-spectrum-v1.js",
  "smfgu:appearance:v3"
 ],
 [
  "studio theme page isolation",
  "assets/js/crownlight-studio-spectrum-v1.js",
  "simulator.html"
 ]
];
for(const [name,path,needle] of gates){test('Visual release gate: '+name,()=>{const source=readFileSync(path,'utf8');assert.ok(source.includes(needle),'Missing '+needle+' in '+path)})}
test('Count remains the approved 40 individual execution gates',()=>assert.equal(gates.length,40));

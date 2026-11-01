import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Batch04 uses only existing member Lab / ECharts loader and never grades',()=>{
 const player=read('lab-player.html'),ui=read('assets/js/lab-batch04-echarts-v1.js'),engine=read('assets/js/lab-engine-v32-universal.js');
 assert(player.indexOf('lab-batch04-echarts-v1.js')<player.indexOf('lab-engine-v32-universal.js'));
 assert(player.includes('lab-batch04-echarts-v1.css'));
 assert(ui.includes('CrownlightECharts.load')&&ui.includes("node('table')")&&ui.includes("node('caption'"));
 assert(ui.includes("chartInstance?.dispose()")&&ui.includes('ResizeObserver'));
 assert(ui.includes("Math.abs(Math.abs(pair[0]-pair[1])-item.expected)"));
 assert(ui.includes("min:0,scale:false"),'Bar chart must use a zero baseline so small price differences are not exaggerated');
 assert(ui.includes('bars start at zero'),'Learners must receive an explicit explanation of chart scaling');
 assert(ui.includes('fictionalOnly:true')&&!ui.includes('/api/grade')&&!ui.includes('/api/checkout'));
 assert(engine.includes("mode==='guided'")&&engine.includes('GroundUpLabBatch04EChartsV1.mount'));
 assert(engine.includes('batch04Bridge.tabs.apply[0]')&&engine.includes('if(stage===2&&!calculateDone)'));
});

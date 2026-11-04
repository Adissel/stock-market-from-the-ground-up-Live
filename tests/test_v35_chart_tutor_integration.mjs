/* v3.5 — one-on-one chart-linked teaching, educational-only.
 * Tests the approved content route and stage transition without customer
 * sessions, historical data, server grades, private rubrics or future replay.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const engine=read('assets/js/lab-engine-v32-universal.js');
const instructor=read('assets/js/lab-v33-instructor.js');
const graphic=read('assets/js/lab-v33-contextual-visuals.js');
const interaction=read('assets/js/lab-v33-visual-interactions.js');
const player=read('assets/js/lab-player.js');
const css=read('assets/css/lab-v33-experience.css');
for(const source of [engine,instructor,graphic,interaction,player])assert.doesNotThrow(()=>new Script(source));
assert(engine.includes('gu-v35-chart-worked'),'Worked steps must be inside the chart');
assert(engine.includes('Show and explain on chart'),'Worked example must be explicitly selectable');
assert(engine.includes('chart.setTeachingCandle?.(currentCase.values)'),
 'A new fictional case must update the displayed chart and OHLC metrics');
assert(graphic.includes('root.setTeachingCandle=values=>'),
 'All candle examples must update without breaking the highlight controls');
assert(interaction.includes("view.addEventListener('gu-v35-highlight'"),
 'The selected illustrated feature must highlight without hijacking Talia');
assert(engine.includes('instructorInstance?.teachWorkedStep?.('),
 'Talia must narrate the selected chart-backed worked step');
assert(engine.includes('instructorInstance?.teachSupplement?.(action.name,action.paragraphs)'),
 'All four instructional help actions must use the tutor dialogue, not static panels');
assert(!engine.includes("gu-v33-help-tabs';"),
 'Do not recreate the disconnected help-panel container');
assert(instructor.includes("onUnderstandingPassed?.()"),
 'An accepted ungraded understanding check must trigger lesson advancement');
assert(engine.includes("onUnderstandingPassed:()=>{if(stage===1)nextStage(true)}"),
 'The lesson should move from Learn to Experiment after accepted comprehension');
assert(engine.includes("'Bullish Candle'")&&engine.includes("'Bearish Candle'"),
 'Use familiar candle direction names while still teaching their construction');
assert(player.includes("return 'Bullish Candle'")&&player.includes("return 'Bearish Candle'"),
 'The member Lab title must agree with Talia');
assert(graphic.includes("variant==='bearish'?{o:32,hv:32.5,l:30.5,c:31}"),
 'Bearish lessons must visually show a descending candle');
assert(engine.includes("showVisual(1,topic==='Bearish Candle'?'bearish':visualType==='candle'?'worked':'default')"));
assert(css.includes('gu-v35-teaching-actions')&&css.includes('gu-v35-chart-worked'));
const optionalCss=read('assets/css/crownlight-learning-echarts-v1.css');
assert(engine.includes('Optional chart skills: measure a candlestick'),
 'The generic chart must have an honest, topic-secondary label');
assert(!engine.includes('Optional ECharts chart-reading rehearsal — separate from this Lab topic'),
 'Do not restore the oversized unrelated chart block');
assert(engine.includes('if(optionalChart)body.append(optionalChart)'),
 'Supplemental practice must follow the authored subject visual');
assert(engine.includes('A completed candle shows prices, not who traded'),
 'Supplemental practice must explicitly disclose market-evidence limitations');
assert(optionalCss.includes('.gu-v35-chart-skills .gu-echarts-lesson')&&
 optionalCss.includes('max-height:min(72vh,700px)')&&
 optionalCss.includes(':focus-visible'),'The expanded skills drawer must be bounded and keyboard visible');
for(const page of ['lab-player.html','bootcamp.html','bootcamp-academy.html'])
 assert(read(page).includes('crownlight-learning-echarts-v1.css?v=2'),
  'Teaching pages must load the updated classroom styling: '+page);

assert(engine.includes("if(![3,5].includes(stage)"),
 'Protected Predict and Assess cannot embed instructional assistance');
class E{
 constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.attrs={};
 this.style={};this.textContent='';this.value='';this.className='';this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(/\s+/).filter(Boolean),...names])].join(' ')}};this.hidden=false;this.disabled=false;}
 append(...xs){this.children.push(...xs)}
 replaceChildren(...xs){this.children=[...xs]}
 insertBefore(x,y){const i=this.children.indexOf(y);if(i<0)this.append(x);else this.children.splice(i,0,x)}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,fn){this.handlers[k]=fn}
 querySelector(selector){
  if(selector!=='input')throw Error('Unsupported DOM test selector: '+selector);
  const find=node=>{
   for(const child of node.children||[]){
    if(child?.tagName==='input')return child;
    const nested=child&&typeof child==='object'?find(child):null;
    if(nested)return nested;
   }
   return null;
  };
  return find(this);
 }
 focus(){this.focused=true}
}
const doc={createElement:t=>new E(t),createTextNode:t=>{const x=new E('text');x.textContent=t;return x}};
const world=createContext({document:doc,console});
new Script(read('assets/js/lab-v33-instruction-content.js')).runInContext(world);
new Script(read('assets/js/lab-v34-interactive-lessons.js')).runInContext(world);
new Script(read('assets/js/learning-response-choice-v1.js')).runInContext(world);
new Script(instructor).runInContext(world);
const walk=n=>[n,...(n.children||[]).flatMap(walk)];
let passed=0;
const teacher=world.GroundUpLabV33Instructor.create({
 stage:1,concept:'Bullish Candle',lessonContext:{visualType:'candle'},
 onUnderstandingPassed:()=>passed++
});
const nodes=walk(teacher.element);
const action=nodes.find(n=>n.textContent==='Check my understanding');
const prompt=nodes.find(n=>n.className==='gu-v33-instructor-prompt');
const choicePanel=nodes.find(n=>n.className==='gu-v33-evidence-decision');
const submit=nodes.find(n=>n.tagName==='button'&&n.textContent==='Submit answer');
const feedback=nodes.find(n=>n.className==='gu-v33-instructor-reply');
assert(action&&choicePanel&&submit&&feedback&&prompt,'Current classroom method-check controls must exist');
action.handlers.click();
assert.match(prompt.textContent,/Which prices determine/);
assert.equal(choicePanel.hidden,false,'Evidence choices appear after deliberate understanding check');
await submit.handlers.click();
assert.equal(passed,0,'Missing choice must not advance');
assert.match(feedback.textContent,/Choose an evidence-handling response/i);
const radio=code=>walk(choicePanel).find(n=>n.tagName==='input'&&n.type==='radio'&&n.value===code);
const wrong=radio('FORECAST'),correct=radio('EVIDENCE');
assert(wrong&&correct,'Original evidence-choice alternatives must be visible');
wrong.handlers.change();await submit.handlers.click();
assert.equal(passed,0,'An incorrect evidence-handling method cannot advance');
assert.match(feedback.textContent,/Not yet/i,'Incorrect selection receives retry guidance');
correct.handlers.change();await submit.handlers.click();
assert.equal(passed,1,'Accepted evidence-handling method advances once, without mastery credit');
assert.equal(typeof teacher.teachWorkedStep,'function');
assert.equal(typeof teacher.teachSupplement,'function');
assert.equal(world.GroundUpLabV33Instructor.create({stage:3}),null);
assert.equal(world.GroundUpLabV33Instructor.create({stage:5}),null);
teacher.dispose();
console.log('PASS v3.5: chart-linked one-step instruction, familiar candle labels, Talia response and guarded Learn advancement');

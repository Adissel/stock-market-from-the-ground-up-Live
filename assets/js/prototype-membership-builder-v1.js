/* Crownlight Advanced Classroom membership-specific prototype builder V1.
 * Visual preview state only: no membership grants, grade changes, purchases or profile writes.
 * All entitled learners receive the same depth of instruction and assessment protection.
 */
(()=>{'use strict';
const membershipBase=[
 ['FREE','Free Membership','Foundations Focus','#89bdd2','Reading-first','Comfortable','Right','foundation-focus'],
 ['FOUNDING_14','Founding 14-Day Starter','Guided Workshop','#deb677','Balanced','Comfortable','Right','guided-workshop'],
 ['FOUNDING_30','Founding 30-Day','Analysis Desk','#69c8c0','Chart-first','Comfortable','Right','analysis-desk'],
 ['FOUNDING_60','Founding 60-Day','Flagship Classroom','#c4b2e8','Chart-first','Compact','Bottom','flagship-classroom'],
 ['FULL_MONTHLY','Full Platform — Monthly','Professional Studies','#83bcdf','Chart-first','Comfortable','Right','technical-analysis'],
 ['FULL_ANNUAL','Full Platform — Annual','Study Academy','#92cdb2','Balanced','Comfortable','Right','knowledge-transfer'],
 ['LIFETIME','Lifetime Platform Access','Lifetime Study Suite','#edcd8a','Chart-first','Compact','Bottom','full-detail-bars'],
 ['ONDEMAND_MONTHLY','Historical Replay / OnDemand — Monthly','Replay Classroom','#9db8dd','Chart-first','Comfortable','Bottom','replay-control']
];
const allMemberships=membershipBase.map(([code,label,identity,accent,layout,density,tutor,defaultPreset])=>({code,label,identity,accent,layout,density,tutor,defaultPreset,status:code.startsWith('FOUNDING')?'Founding design':'Platform plan design'}));
const definitions=[
 ['foundation-focus','Foundations Focus','Reading-first','Comfortable','Right','Analytical',19,1.5,370],
 ['guided-workshop','Guided Workshop','Balanced','Comfortable','Right','Instructional',17,1.5,400],
 ['analysis-desk','Analysis Desk','Chart-first','Comfortable','Right','Technical',16,1.8,450],
 ['flagship-classroom','Flagship Classroom','Chart-first','Compact','Bottom','Expert',15,2,500],
 ['first-principles','First Principles','Reading-first','Comfortable','Bottom','Clean',22,2,370],
 ['numerical-walkthrough','Numerical Walkthrough','Balanced','Comfortable','Right','Analytical',18,1.8,410],
 ['candle-anatomy','Candle Anatomy','Chart-first','Comfortable','Bottom','Expert',24,3,530],
 ['vwap-laboratory','VWAP Proxy Laboratory','Chart-first','Compact','Right','Technical',17,2,500],
 ['volume-evidence','Volume Evidence','Balanced','Compact','Bottom','Technical',16,2,470],
 ['market-structure','Market Structure','Chart-first','Comfortable','Right','Expert',18,2,530],
 ['breakout-diagnostics','Breakout Diagnostics','Chart-first','Comfortable','Right','Expert',18,2.5,510],
 ['replay-control','Historical Replay Control','Chart-first','Comfortable','Bottom','Instructional',18,2,530],
 ['talia-coaching','Talia Coaching','Reading-first','Comfortable','Right','Instructional',18,1.5,390],
 ['socratic-inquiry','Socratic Inquiry','Reading-first','Comfortable','Bottom','Analytical',19,2,420],
 ['risk-planning','Risk Planning','Balanced','Comfortable','Right','Expert',17,2,470],
 ['protected-assessment','Assessment Layout Preview','Reading-first','Comfortable','Bottom','Clean',21,2,350],
 ['knowledge-transfer','Knowledge Transfer','Balanced','Comfortable','Right','Analytical',19,1.5,430],
 ['presentation','Presentation','Reading-first','Comfortable','Bottom','Clean',25,2.5,570],
 ['accessibility-first','Accessibility First','Balanced','Comfortable','Bottom','Instructional',25,3,530],
 ['full-detail-bars','Full-Detail Bar Analysis','Chart-first','Compact','Bottom','Expert',16,2.5,560]
];
const presets=definitions.map(([id,label,layout,density,tutor,detail,barWidth,wickWidth,chartHeight])=>Object.freeze({id,label,layout,density,tutor,detail,barWidth,wickWidth,chartHeight}));
const lookup=new Map(presets.map(p=>[p.id,p]));
const modes=['Clean','Analytical','Technical','Instructional','Expert'];
const allowedLayouts=['Balanced','Reading-first','Chart-first'];
const clamp=(n,min,max,defaultValue)=>Number.isFinite(Number(n))?Math.min(max,Math.max(min,Number(n))):defaultValue;
const copy=code=>{
 const m=allMemberships.find(x=>x.code===code)||allMemberships[0],p=lookup.get(m.defaultPreset)||presets[0];
 return {...p,grid:true,labels:true,highContrast:false,showVolume:true,teachingNotes:true};
};
let drafts=Object.fromEntries(allMemberships.map(m=>[m.code,copy(m.code)])),active='FREE',userId='',updateUI=()=>{},selectedIndex=0;
function sanitize(input,code){
 const fallback=copy(code);
 if(!input||typeof input!=='object'||Array.isArray(input))return fallback;
 const choose=(k,values)=>values.includes(input[k])?input[k]:fallback[k];
 const id=choose('id',presets.map(p=>p.id));
 return {id,label:lookup.get(id).label,
  layout:choose('layout',allowedLayouts),
  density:choose('density',['Comfortable','Compact']),
  tutor:choose('tutor',['Right','Bottom']),detail:choose('detail',modes),
  barWidth:clamp(input.barWidth,6,36,fallback.barWidth),wickWidth:clamp(input.wickWidth,1,5,fallback.wickWidth),
  chartHeight:clamp(input.chartHeight,260,680,fallback.chartHeight),
  grid:input.grid!==false,labels:input.labels!==false,highContrast:input.highContrast===true,
  showVolume:input.showVolume!==false,teachingNotes:input.teachingNotes!==false
 };
}
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n;};
function selected(){return drafts[active]}
function membership(){return allMemberships.find(t=>t.code===active)||allMemberships[0]}
function snapshot(){return {active,drafts:structuredClone(drafts)}}
function save(){if(!userId)return false;try{localStorage.setItem('crownlight:prototype:membership-layouts:v1:'+userId,JSON.stringify(snapshot()));return true}catch{return false}}
function restore(){if(!userId)return;try{
 const data=JSON.parse(localStorage.getItem('crownlight:prototype:membership-layouts:v1:'+userId)||'null');
 if(!data||typeof data!=='object')return;
 for(const m of allMemberships)drafts[m.code]=sanitize(data.drafts?.[m.code],m.code);
 if(allMemberships.some(m=>m.code===data.active))active=data.active;
 }catch{}}
function notify(){const el=document.getElementById('pt-membership');if(el)el.value=active;updateUI();}
function changeMembership(code){if(!allMemberships.some(m=>m.code===code))return;active=code;selectedIndex=0;notify();}
function selectPreset(id){if(!lookup.has(id))return;const prior=selected(),next=lookup.get(id);drafts[active]={...prior,...next};notify();}
function adjust(key,value){const current=selected();if(!(key in current))return;drafts[active]=sanitize({...current,[key]:value},active);notify();}
function reset(){drafts[active]=copy(active);notify();}
function clear(){userId='';active='FREE';drafts=Object.fromEntries(allMemberships.map(m=>[m.code,copy(m.code)]));updateUI=()=>{};}
function createSelect(title,items,value,onChange){
 const label=node('label',title),sel=node('select');sel.setAttribute('aria-label',title);
 for(const item of items){const option=node('option',typeof item==='string'?item:item.label);option.value=typeof item==='string'?item:item.id;sel.append(option)}
 sel.value=value;sel.addEventListener('change',()=>onChange(sel.value));label.append(sel);return label
}
function slider(title,min,max,step,value,change){
 const label=node('label',title+': '+value),input=node('input');input.type='range';input.min=String(min);input.max=String(max);input.step=String(step);input.value=String(value);
 input.setAttribute('aria-label',title);input.addEventListener('change',()=>change(Number(input.value)));label.append(input);return label
}
function toggle(title,value,change){
 const label=node('label',undefined,'pt-membership-toggle'),input=node('input');input.type='checkbox';input.checked=value;input.addEventListener('change',()=>change(input.checked));label.append(input,node('span',title));return label
}
function render(root){
 if(!userId||!root)return;const m=membership(),d=selected();
 root.dataset.memberPreview=active;
 root.style.setProperty('--pt-preview-accent',m.accent);
 const box=node('section',undefined,'pt-card pt-membership-panel');
 box.append(node('h3',m.identity+' — Classroom Editor'));
 box.append(node('p',m.label+' · '+m.status+' · This is a visual preview only; switching does not change enrollment or access.'));
 const settings=node('div',undefined,'pt-membership-controls');
 settings.append(
  createSelect('Classroom preset — 20 available',presets,d.id,selectPreset),
  createSelect('Layout',allowedLayouts,d.layout,v=>adjust('layout',v)),
  createSelect('Density',['Comfortable','Compact'],d.density,v=>adjust('density',v)),
  createSelect('Talia placement',['Right','Bottom'],d.tutor,v=>adjust('tutor',v)),
  createSelect('Bar detail',modes,d.detail,v=>adjust('detail',v)),
  slider('Candle body width',6,36,1,d.barWidth,v=>adjust('barWidth',v)),
  slider('Wick thickness',1,5,.5,d.wickWidth,v=>adjust('wickWidth',v)),
  slider('Chart height (px)',260,680,20,d.chartHeight,v=>adjust('chartHeight',v))
 );box.append(settings);
 const checks=node('div',undefined,'pt-membership-flags');
 for(const [label,key] of [['Price gridlines','grid'],['Detailed labels','labels'],['High-contrast candles','highContrast'],['Show volume in bar inspector','showVolume'],['Instructor notes','teachingNotes']])
  checks.append(toggle(label,d[key],v=>adjust(key,v)));
 box.append(checks);
 box.append(node('p','The complete first-principles lessons, worked numerical steps, guided examples, Talia explanations, independent assessment protection, and retries remain unchanged for any lesson legitimately accessible to the selected membership.','pt-note'));
 const actions=node('div',undefined,'pt-row'),restoreBtn=node('button','Restore this membership default');restoreBtn.type='button';restoreBtn.addEventListener('click',reset);actions.append(restoreBtn);box.append(actions);
 root.prepend(box);
}
function analyze(data,index){
 if(!Array.isArray(data)||!data.length)return null;
 index=Math.max(0,Math.min(data.length-1,Math.trunc(Number(index)||0)));
 const c=data[index],open=Number(c.open),close=Number(c.close),high=Number(c.high),low=Number(c.low),volume=Number(c.volume);
 if(![open,close,high,low].every(Number.isFinite)||high<Math.max(open,close)||low>Math.min(open,close))return null;
 const range=high-low,body=Math.abs(close-open),up=high-Math.max(open,close),down=Math.min(open,close)-low;
 const previous=index>0?Number(data[index-1].close):NaN;
 return {index,time:String(c.t||c.time||'Bar '+(index+1)),open,high,low,close,
  volume:Number.isFinite(volume)?volume:null,range,body,upper:up,lower:down,
  change:close-open,pctOpen:open?100*(close-open)/open:null,
  vsPrevious:Number.isFinite(previous)?close-previous:null,
  pctPrevious:Number.isFinite(previous)&&previous?100*(close-previous)/previous:null,
  closePosition:range?100*(close-low)/range:null,
  bodyPct:range?100*body/range:null,
  upperPct:range?100*up/range:null,lowerPct:range?100*down/range:null,
  midpoint:(high+low)/2,typicalPrice:(high+low+close)/3,
  direction:close>open?'Bullish':close<open?'Bearish':'Doji / unchanged'
 };
}
const money=n=>n===null?'N/A':'$'+n.toFixed(4);
const percent=n=>n===null?'N/A':n.toFixed(2)+'%';
function inspector(host,data,index){
 if(!host)return;const b=analyze(data,index);host.replaceChildren();
 if(!b){host.append(node('p','Select a fictional OHLC bar for detailed analysis.'));return}
 const m=membership(),d=selected();host.style.setProperty('--pt-preview-accent',m.accent);
 const top=node('div',undefined,'pt-bar-title');top.append(node('h3','Precision Bar Inspector — '+b.time),node('span',b.direction+' · '+m.label));host.append(top);
 const values=[
  ['Open',money(b.open)],['High',money(b.high)],['Low',money(b.low)],['Close',money(b.close)],
  ['Full range',money(b.range)],['Body',money(b.body)],['Upper wick',money(b.upper)],['Lower wick',money(b.lower)],
  ['Body / range',percent(b.bodyPct)],['Upper wick / range',percent(b.upperPct)],['Lower wick / range',percent(b.lowerPct)],
  ['Move from open',money(b.change)+' ('+percent(b.pctOpen)+')'],['Close versus prior',b.vsPrevious===null?'N/A':money(b.vsPrevious)+' ('+percent(b.pctPrevious)+')'],
  ['Close location in range',percent(b.closePosition)],['Range midpoint',money(b.midpoint)],['Typical price (H+L+C)/3',money(b.typicalPrice)]
 ];
 if(d.showVolume)values.splice(4,0,['Bar volume',b.volume===null?'N/A':b.volume.toLocaleString()+' shares']);
 const grid=node('dl',undefined,'pt-bar-facts');
 for(const [name,value] of values){const p=node('div');p.append(node('dt',name),node('dd',value));grid.append(p)}
 host.append(grid);
 if(d.teachingNotes)host.append(node('p','Fictional OHLCV evidence only. Intrabar trades, bid/ask delta, true transaction VWAP, live spreads, market structure and indicators require independently verified datasets. No lookahead is inferred from this bar.','pt-note'));
}
function chartOptions(data){
 const d=selected(),m=membership();const activeColor=d.highContrast?'#4dffbe':'#57c5ab',downColor=d.highContrast?'#ff8277':'#dd7777';
 const width=clamp(d.barWidth,6,36,16);
 return {
  barWidth:width,up:activeColor,down:downColor,
  itemStyle:{color:activeColor,color0:downColor,borderColor:activeColor,borderColor0:downColor,borderWidth:d.wickWidth},
  axisSplit:d.grid?{show:true,lineStyle:{color:'#324d61',width:1}}:{show:false},
  height:d.chartHeight,
  tooltip:function(params){
   const item=Array.isArray(params)?params[0]:params;
   const b=analyze(data,item?.dataIndex??0);
   if(!b)return 'Fictional analysis unavailable';
   return [b.time,m.label,'O '+money(b.open)+'  H '+money(b.high)+'  L '+money(b.low)+'  C '+money(b.close),
     'Range '+money(b.range)+' · Body '+money(b.body),
     'Upper wick '+money(b.upper)+' · Lower wick '+money(b.lower),
     d.showVolume?'Volume '+(b.volume===null?'N/A':b.volume.toLocaleString()+' shares'):'Volume hidden',
     'Close position '+percent(b.closePosition)].join('\n');
  }
 };
}
function init(options={}){
 userId=String(options.userId||'');updateUI=typeof options.onChange==='function'?options.onChange:()=>{};
 drafts=Object.fromEntries(allMemberships.map(m=>[m.code,copy(m.code)]));active='FREE';restore();
 const selector=document.getElementById('pt-membership');
 if(selector){selector.replaceChildren();for(const m of allMemberships){const option=node('option',m.label);option.value=m.code;selector.append(option)}
  selector.value=active;selector.addEventListener('change',()=>changeMembership(selector.value));}
 notify();
}
window.CrownlightClassroomMemberships=Object.freeze({
 init,render,save,reset,clear,selected,snapshot,membership,changeMembership,selectPreset,adjust,
 presets:()=>presets.map(({id,label})=>({id,label})),
 memberships:()=>allMemberships.map(({code,label})=>({code,label})),
 chartOptions,analyze,inspector
});
})();

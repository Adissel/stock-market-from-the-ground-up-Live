/**
 * Crownlight Experience Suite v1 — staff-only presentation experiments.
 * Three pages within the existing protected /prototype.html document:
 * ?experience=a (six-design lab), ?experience=b (three flagship apps),
 * ?experience=c (side-by-side membership studio).
 * No server write, pricing change, authorization grant, grade or live data.
 */
import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {createPortal} from 'react-dom';

type Page='a'|'b'|'c';
type Topic='vwap'|'candle';
type LearningMode='guided'|'practice'|'blind'|'assessment';
type EngineEdition='Basic'|'Advanced'|'Professional'|'Enterprise';
const educationModes:{id:LearningMode;label:string;description:string}[]=[
{id:'guided',label:'Guided',description:'Full first-principles teaching with worked examples and free retries.'},
{id:'practice',label:'Practice',description:'Independent exercises with free corrective feedback and transfer tasks.'},
{id:'blind',label:'Blind Decision',description:'Record an independent hypothetical decision before viewing Talia explanations.'},
{id:'assessment',label:'Assessment',description:'Official assessment requires a reviewed private question bank and server authorization; unavailable in this staff preview.'}
];
type Studio='Standard'|'Advanced'|'Professional';
type ChartKind='price'|'heat'|'equity'|'radar'|'volume';
type Viz={init:(el:HTMLElement,theme?:string,opts?:object)=>any,connect?:(group:string)=>void};
type HomeChartSession={pause:()=>void;resume:()=>void;dispose:()=>void};
type ChartWindow=Window & {
 CrownlightECharts?:{load:()=>Promise<Viz>};
 CrownlightHomeMarketTerminal?:{mountInto:(node:HTMLElement,options?:{
  context?:'lab'|'bootcamp';startPaused?:boolean;checkpointLocked?:boolean
 })=>HomeChartSession|null};
};
function HomeMarketEmbed({context='lab'}:{context?:'lab'|'bootcamp'}){
 const ref=useRef<HTMLDivElement>(null);
 const [error,setError]=useState('');
 useEffect(()=>{
  if(!ref.current)return;
  const session=(window as ChartWindow).CrownlightHomeMarketTerminal?.mountInto(ref.current,{
   context,startPaused:false
  });
  if(!session)setError('The shared market chart is unavailable. Use the original source-backed Lab evidence below.');
  else setError('');
  return()=>session?.dispose();
 },[context]);
 return <div className="cx-home-shared-market" aria-label="Exact homepage animated fictional market chart">
   <div className="cx-pan-controls cx-home-context-toolbar" role="toolbar" aria-label="Prototype homepage chart tools">
    <button type="button" aria-label="Open chart indicator context menu" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();window.dispatchEvent(new CustomEvent('crownlight:prototype-chart-menu',{detail:{x:r.left,y:r.bottom+6,view:'indicators'}}))}}>Indicators menu</button>
    <button type="button" aria-label="Open chart drawing controls" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();window.dispatchEvent(new CustomEvent('crownlight:prototype-chart-menu',{detail:{x:r.left,y:r.bottom+6,view:'drawings'}}))}}>Drawings</button>
    <span>Right-click the chart for all computed studies and Custom settings</span>
   </div>
   <div ref={ref} className="cx-home-shared-market-host"/>
   {error&&<p role="status">{error}</p>}
   <p className="cx-home-shared-market-source">The same React ECharts candle-formation engine as the homepage.
   Its original fictional market tape is separate from authored Lab or Boot Camp instructional case data.</p>
 </div>;
}
type Plan={code:string;label:string;preset:string;description:string;founder:boolean;commons:boolean};
type Bar={time:string;o:number;h:number;l:number;c:number;v:number;ema9:number;ema20:number;proxy:number};
const plans:Plan[]=[
 {code:'FREE',label:'Free Membership',preset:'Foundations Focus',description:'Foundational classroom, accessible learning, and independently entitled core tools.',founder:false,commons:false},
 {code:'PICK_WHAT_YOU_WANT',label:'Pick What You Want',preset:'Build Your Classroom',description:'Basic learning engines, free instructional fundamentals and individually purchased add-on access; no purchases in this preview.',founder:false,commons:false},
 {code:'FOUNDING_14',label:'Founding 14-Day Starter',preset:'Guided Workshop',description:'Full eligible published-content and Professional Studio beta access; Basic learning engines and Founders Commons.',founder:true,commons:true},
 {code:'FOUNDING_30',label:'Founding 30-Day',preset:'Analysis Desk',description:'Full eligible published-content and Professional Studio beta access; Advanced learning engines and Founders Commons.',founder:true,commons:true},
 {code:'FOUNDING_60',label:'Founding 60-Day',preset:'Flagship Classroom',description:'Full eligible published-content and Professional Studio beta access; Professional learning engines, Founders Commons and exclusive design/governance voting.',founder:true,commons:true},
 {code:'FULL_MONTHLY',label:'Full Platform — Monthly',preset:'Professional Studies',description:'Full-platform monthly product design; product availability requires live catalog verification.',founder:false,commons:false},
 {code:'FULL_ANNUAL',label:'Full Platform — Annual',preset:'Study Academy',description:'Full-platform annual product design; pricing and availability unverified.',founder:false,commons:false},
 {code:'LIFETIME',label:'Lifetime Platform Access',preset:'Lifetime Study Suite',description:'Lifetime product design; no entitlement or sale is created.',founder:false,commons:false},
 {code:'ONDEMAND_MONTHLY',label:'Historical Replay / OnDemand — Monthly',preset:'Replay Classroom',description:'Replay-centered product design; actual access is server controlled.',founder:false,commons:false}
];
/* Product-design scenarios, not authoritative subscription grants. The curriculum stays equally rich for every accessible lesson. */
type MemberProfile={
 name:string;eyebrow:string;headline:string;value:string;accent:string;modules:string[];
 tools:string[];defaultStudio:Studio;defaultTopic:Topic;route:'foundation'|'workshop'|'analysis'|'flagship'|'academy'|'ownership'|'replay';
 pitch:string;workspaces:string[];suggestions:string[];
};
const membershipExperiences:Record<string,MemberProfile>={
 FREE:{name:'Foundations Portal',eyebrow:'LEARN / UNDERSTAND / PRACTICE',headline:'Your first clear view of the market.',value:'Full-quality instruction. One approachable chart, one observation at a time. Upgrade for expanded workspaces and research workflows—not explanations.',accent:'#73dfb9',modules:['Guided lesson','Single-chart practice','Foundational journal preview'],tools:['Teaching-first charts','One-chart inspection','Foundational replay'],defaultStudio:'Standard',defaultTopic:'candle',route:'foundation',pitch:'Your learning experience is never a stripped-down explanation.',workspaces:['Guided Chart','Candlestick Builder','Learning Record'],suggestions:['Complete an OHLC calculation','Explain one misconception','Record a no-trade observation']},
 PICK_WHAT_YOU_WANT:{name:'À-la-Carte Learning Workspace',eyebrow:'PICK WHAT YOU WANT / BASIC',headline:'Build the teaching workspace you need.',value:'Basic Learning v3.3, Lab v3.2 and Basic Talia remain included; specific higher-level engines, tools, Labs and Boot Camps require independently purchased entitlements.',accent:'#80cdb9',modules:['Full-quality basic teaching','Selected product access','Independent engine add-ons planned'],tools:['Foundational chart studies','Purchased learning modules','Individual product upgrades'],defaultStudio:'Standard',defaultTopic:'candle',route:'foundation',pitch:'Only separately purchased products are unlocked; preview selections do not purchase or grant access.',workspaces:['Learning Home','Selected Training','Add-On Catalog'],suggestions:['Review one core concept','Inspect a purchased-module scenario','Compare planned engine editions']},
 FOUNDING_14:{name:'Founding Starter Workshop',eyebrow:'14-DAY GUIDED STUDIO',headline:'Build a repeatable study routine.',value:'Full eligible published-content and Professional Chart Studio beta access, with the Basic learning engines and Talia. Founders Commons is included; governance voting is restricted to 60-Day founders.',accent:'#7ce3e8',modules:['Daily training pathway','Coach-assisted replay','Review checklist'],tools:['Professional Studio beta','Founders Commons','Workshop tracker'],defaultStudio:'Professional',defaultTopic:'vwap',route:'workshop',pitch:'Practice the same high-quality lesson within a more structured routine.',workspaces:['Today’s Workshop','Guided Replay','Review Desk'],suggestions:['Mark VWAP context','Make a watch/no-trade decision','Review a wrong answer']},
 FOUNDING_30:{name:'Founding Analysis Desk',eyebrow:'30-DAY ANALYSIS EXPERIENCE',headline:'Turn chart observations into a process.',value:'Full eligible published-content and Professional Chart Studio beta access, with next-best available learning engines and Advanced Talia when released. Founders Commons is included.',accent:'#83acff',modules:['Advanced workspace preview','Analytical overlays','Scenario comparison'],tools:['Professional Studio beta','Founders Commons','Research notes'],defaultStudio:'Professional',defaultTopic:'vwap',route:'analysis',pitch:'More analytical surfaces and continuity, with identical accessible teaching quality.',workspaces:['Analysis Desk','Replay Comparison','Study Journal'],suggestions:['Compare EMA and VWAP','Confirm a level','Document invalidation']},
 FOUNDING_60:{name:'Founding Flagship',eyebrow:'FLAGSHIP FOUNDER EXPERIENCE',headline:'A connected trading-learning command center.',value:'Premium multidimensional workspace, evidence review, and the approved Founders Commons benefit. Chart Studio features remain subject to actual server entitlement.',accent:'#dcc18d',modules:['Flagship workspace concept','Advanced visual analytics','Founders Commons'],tools:['Multi-panel analytics preview','Cumulative review','Private Founders community'],defaultStudio:'Professional',defaultTopic:'vwap',route:'flagship',pitch:'The most expansive Founder presentation without placing understanding behind a paywall.',workspaces:['Command Center','Advanced Replay','Founder Commons'],suggestions:['Compare two evidence streams','Run a transfer exercise','Record research reasoning']},
 FULL_MONTHLY:{name:'Full Platform Workspace',eyebrow:'FULL PLATFORM / MONTHLY CONCEPT',headline:'One home for charts, learning, and research.',value:'Unified full-platform product concept; current sale availability and exact entitlements are not asserted.',accent:'#a2a8fa',modules:['Cross-product workspace','Advanced charts','Learning intelligence'],tools:['Multi-tool navigation','Analytics overview','Workflow continuity'],defaultStudio:'Advanced',defaultTopic:'vwap',route:'analysis',pitch:'Broad product navigation and study continuity, not exclusive explanations.',workspaces:['Platform Home','Chart Research','Learning Review'],suggestions:['Select a research module','Review indicator context','Document observations']},
 FULL_ANNUAL:{name:'Long-Horizon Academy',eyebrow:'FULL PLATFORM / ANNUAL CONCEPT',headline:'Study deliberately. Measure your progress.',value:'A longer-horizon academy experience with lesson sequences, practice planning and evidence reviews. Commercial terms require independent validation.',accent:'#76d5d9',modules:['Learning pathways','Competency evidence','Annual study planning'],tools:['Plan by competency','Knowledge checkpoints','Longitudinal review'],defaultStudio:'Advanced',defaultTopic:'candle',route:'academy',pitch:'More structured planning and learning continuity, never reduced teaching for others.',workspaces:['Academy Home','Skills Dashboard','Chart Practice'],suggestions:['Set a competency goal','Complete a transfer task','Review common errors']},
 LIFETIME:{name:'Crownlight Legacy Studio',eyebrow:'LIFETIME PLATFORM CONCEPT',headline:'Build a durable learning workspace.',value:'A long-term ownership presentation with organized research archives and reusable preferences. No purchase or lifetime entitlement is created.',accent:'#d5cbaf',modules:['Evergreen learning library','Research history preview','Custom tool arrangements'],tools:['Study archive concept','Saved-layout designs','Progress preservation'],defaultStudio:'Professional',defaultTopic:'candle',route:'ownership',pitch:'A durable personal learning organization, not claims of lifetime data licensing.',workspaces:['Personal Archive','Studio Workspace','Mastery Record'],suggestions:['Organize study material','Revisit an old observation','Compare an independent case']},
 ONDEMAND_MONTHLY:{name:'Historical Replay Arena',eyebrow:'ONDEMAND / REPLAY CONCEPT',headline:'Rewind the chart. Never know the next bar.',value:'Replay-first scenario training with pause decisions, evidence cutoff, and post-decision debrief. Actual OnDemand entitlement is enforced separately.',accent:'#f0b87b',modules:['Replay-first layout','Decision checkpoints','Post-replay debrief'],tools:['Time-bound bar reveal','Scenario reasoning','No-lookahead review'],defaultStudio:'Advanced',defaultTopic:'vwap',route:'replay',pitch:'An immersive practice experience where doing nothing can be the right decision.',workspaces:['Replay Arena','Decision Review','Observation Journal'],suggestions:['Pause at a candle','Choose WATCH or NO TRADE','Debrief after reveal']}
};

/* UI-only assignment reference. Actual subscriptions, entitlements and versions remain server-controlled. */
const editionPolicy:Record<string,{learning:EngineEdition;lab:EngineEdition;tutor:EngineEdition;note:string}>={
 FREE:{learning:'Basic',lab:'Basic',tutor:'Basic',note:'Included Basic'},
 FOUNDING_14:{learning:'Basic',lab:'Basic',tutor:'Basic',note:'Included Basic'},
 PICK_WHAT_YOU_WANT:{learning:'Basic',lab:'Basic',tutor:'Basic',note:'Basic plus separately entitled add-ons'},
 ONDEMAND_MONTHLY:{learning:'Basic',lab:'Basic',tutor:'Basic',note:'Product-dependent assignment; Basic preview only'},
 FOUNDING_30:{learning:'Advanced',lab:'Advanced',tutor:'Advanced',note:'Next-best edition preview'},
 FOUNDING_60:{learning:'Professional',lab:'Professional',tutor:'Professional',note:'Best-available edition preview'},
 FULL_MONTHLY:{learning:'Professional',lab:'Professional',tutor:'Professional',note:'Best-available edition preview'},
 LIFETIME:{learning:'Enterprise',lab:'Enterprise',tutor:'Enterprise',note:'Highest approved edition target — all three engines; premium capabilities not released'},
 FULL_ANNUAL:{learning:'Basic',lab:'Basic',tutor:'Basic',note:'Assignment unresolved; safe Basic preview'}
};
function EditionPreview({plan,selected,setSelected}:{plan:Plan;selected:{learning:EngineEdition;lab:EngineEdition;tutor:EngineEdition};setSelected:(key:'learning'|'lab'|'tutor',value:EngineEdition)=>void}){
 return <section className="cx-edition-preview" aria-label="Instruction system edition preview">
 <span className="cx-overline">MEMBERSHIP / LEARNING SYSTEM EDITIONS · STAFF PREVIEW</span>
 <p><strong>{plan.label}:</strong> {editionPolicy[plan.code]?.note}. Basic remains full-quality teaching; the advanced editions are development proposals and are not available through this selector.</p>
 <div className="cx-edition-grid">{([['learning','Shared Learning Engine','v3.3'],['lab','Shared Lab Engine','v3.2'],['tutor','Talia Market Tutor','v0.14.0.149']] as const).map(([key,label,version])=><label key={key}>{label}<small>{version} · Basic source</small><select aria-label={label+' edition preview'} value={selected[key]} onChange={e=>setSelected(key,e.target.value as EngineEdition)}>{(['Basic','Advanced','Professional','Enterprise'] as EngineEdition[]).map(e=><option value={e} key={e}>{e}{e==='Basic'?' (current)':' (planned)'}</option>)}</select></label>)}</div>
 <p>Visual selection: Learning {selected.learning}; Lab {selected.lab}; Tutor {selected.tutor}. No purchase, grant, AI inference or membership change occurs. OnDemand requires a specific authorized product, and Full Annual remains unresolved.</p>
 </section>;
}
function MemberExperience({plan,reveal,setReveal,stage,setStage,setTopic}:{plan:Plan;reveal:number;setReveal:(n:number)=>void;stage:number;setStage:(n:number)=>void;setTopic:(t:Topic)=>void}){
 const m=membershipExperiences[plan.code]||membershipExperiences.FREE;
 const [tab,setTab]=useState(0),[status,setStatus]=useState(''),[draft,setDraft]=useState(''),[notes,setNotes]=useState<string[]>([]);
 useEffect(()=>{setTab(0);setStatus('');setDraft('');setNotes([])},[plan.code]);
 const open=(topic:Topic,next:number)=>{setTopic(topic);setStage(next);setStatus('Opened '+topic+' teaching at Stage '+(next+1)+'. The linked workspace is above.');document.getElementById('cx-workspace')?.scrollIntoView({block:'start',behavior:'smooth'})};
 const act=()=>{if(tab===0)open('candle',2);else if(tab===1)open('vwap',3);else setStatus('Learning Record is a session-only preview. Add an observation below; no grades or real learning progress are saved.')};
 const addNote=()=>{if(!draft.trim()){setStatus('Enter an observation before adding it.');return}setNotes(old=>[...old.slice(-4),draft.trim().slice(0,180)]);setDraft('');setStatus('Ungraded local learning note added.')};
 return <section className={'cx-member-experience cx-member-'+m.route} style={{'--cx-member-accent':m.accent} as React.CSSProperties} aria-label={plan.label+' proposed member experience'}>
  <div className="cx-member-hero"><div className="cx-member-copy"><div className="cx-overline">{m.eyebrow} · PRODUCT EXPERIENCE PREVIEW</div><h2>{m.headline}</h2><p>{m.value}</p><div className="cx-member-benefits">{m.modules.map(x=><span key={x}>{x}</span>)}</div></div>
  <div className="cx-member-monogram" aria-hidden="true"><span>{m.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><small>01 / {m.defaultStudio.toUpperCase()}</small></div></div>
  <div className="cx-member-actions"><div><div className="cx-overline">YOUR EXPERIENCE / {m.name.toUpperCase()}</div><nav className="cx-member-workspaces" aria-label="Membership-specific workspace tabs">{m.workspaces.map((w,i)=><button key={w} aria-pressed={tab===i} onClick={()=>setTab(i)}>{String(i+1).padStart(2,'0')} {w}</button>)}</nav></div><div className="cx-member-detail"><strong>{m.workspaces[tab]}</strong><p>{m.suggestions[tab]}. {m.pitch}</p><div className="cx-member-quickactions"><button onClick={act}>{tab===2?'Open learning record':tab===1?'Open guided VWAP chart':'Open candlestick worked example'}</button>{tab===2&&<button onClick={()=>{setReveal(Math.min(96,reveal+1));setStatus('Advanced fictional replay one completed bar. This does not save a Journal or grade.')}} disabled={reveal===96}>Advance replay one bar</button>}<span>READ-ONLY / FICTIONAL WORKSPACE</span></div><p className="cx-member-feedback" role="status">{status}</p>{tab===2&&<div className="cx-member-record"><label>Local learning record observation<input aria-label="Local learning record note" value={draft} maxLength={180} onChange={e=>setDraft(e.target.value)} placeholder="Explain an observation or misconception"/></label><button onClick={addNote}>Add local learning note</button><ul>{notes.map((entry,i)=><li key={i}>{entry}</li>)}</ul><small>Session-only preview; not a Journal or mastery record.</small></div>}<a className="cx-member-jump" href="#cx-workspace">View active teaching workspace</a></div></div>
 </section>;
}
const designs=[
 {key:'quantum',label:'Quantum Command',caption:'Multichart mission control'},
 {key:'neon',label:'Neon Flux',caption:'Spectral intelligence'},
 {key:'green',label:'Green / Black',caption:'Trader terminal'},
 {key:'ember',label:'Ember Forge',caption:'Precision analysis'},
 {key:'aurora',label:'Aurora Flow',caption:'Learning intelligence'},
 {key:'onyx',label:'Onyx Prime',caption:'Quiet professional'}
] as const;
type Design=typeof designs[number]['key'];
const n=(v:number)=>Number(v.toFixed(4));
const dollars=(v:number)=>'$'+v.toFixed(2);
/* Synthetic one-minute tape: seeded, reproducible, with plausible opening activity,
 * consolidations and directional moves. Not a reconstructed real market security. */
const series:Bar[]=(()=>{
 const arr:Bar[]=[];let price=43.65,ema9=price,ema20=price,dollar=0,shares=0,seed=1357911;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<96;i++){
  const o=price,regime=i<15?.055:i<37?-.031:i<57?.006:i<74?.067:i<86?-.035:.028;
  const volatility=i<14?.235:i>58&&i<78?.17:.125;
  const surprise=(rand()+rand()+rand()+rand()-2)*volatility;
  const c=n(Math.max(2,o+regime+surprise));
  const upper=.018+rand()*.12*(i<15?1.5:1),lower=.02+rand()*.11*(i<15?1.5:1);
  const h=n(Math.max(o,c)+upper),l=n(Math.min(o,c)-lower);
  const activity=i<12?1.6:i>59&&i<76?1.5:1;
  const v=Math.round((900+rand()*1600+Math.abs(c-o)*3600+(i%17===0?1800:0))*activity);
  ema9=n(ema9+(c-ema9)*.2);ema20=n(ema20+(c-ema20)*2/21);
  dollar+=((h+l+c)/3)*v;shares+=v;
  const minute=570+i;
  arr.push({time:String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0'),o,h,l,c,v,ema9,ema20,proxy:n(dollar/shares)});
  price=c;
 }
 return arr;
})();
const demoTrades=[{price:10,volume:100},{price:11,volume:300},{price:12,volume:200}];
function dataFor(reveal:number){return series.slice(0,Math.max(1,Math.min(series.length,reveal)))}
function CandleShape({o,h,l,c}:{o:number;h:number;l:number;c:number}){
 const low=Math.min(l,o,c),high=Math.max(h,o,c),range=Math.max(.01,high-low);
 const y=(v:number)=>14+(high-v)/range*154;
 const color=c>=o?'#55e5b6':'#fb829d';
 return <svg className="cx-candle-svg" viewBox="0 0 240 185" role="img" aria-label="Candlestick showing open high low and close"><line x1="118" y1={y(high)} x2="118" y2={y(low)} stroke={color} strokeWidth="4"/><rect x="82" y={Math.min(y(o),y(c))} width="72" height={Math.max(3,Math.abs(y(o)-y(c)))} rx="2" fill={color}/>{([['H',h],['O',o],['C',c],['L',l]] as [string,number][]).map(([k,v],i)=><g key={k}><line x1={i%2?155:15} y1={y(v)} x2={i%2?215:81} y2={y(v)} stroke="#6b8895" strokeDasharray="3 3"/><text x={i%2?169:10} y={y(v)-5} fill="#c8dce7" fontSize="10">{k} {v.toFixed(2)}</text></g>)}</svg>
}

type IndicatorSpec={id:string;label:string;family:string;setting:string|null;placement:string};
type IndicatorPrefs={settings:Record<string,number>;enabled:Record<string,boolean>;studio:Studio;setSettings:(name:string,value:number)=>void;setEnabled:(name:string,value:boolean)=>void;reset:()=>void;enableAll:()=>void};
const basicStudyCodes=new Set(['EMA_FAST','EMA_SLOW','VWAP','VOLUME']);
const studyAllowed=(studio:Studio,id:string)=>studio!=='Standard'||basicStudyCodes.has(id);
const IndicatorContext=React.createContext<IndicatorPrefs|null>(null);
const specs:IndicatorSpec[]=([
 ['EMA_FAST','EMA · Fast','Trend','emaFast','Price overlay'],
 ['EMA_SLOW','EMA · Slow','Trend','emaSlow','Price overlay'],
 ['EMA_200','EMA · 200','Trend','ema200','Price overlay — contextual warmup'],
 ['SMA','Simple moving average','Trend','sma','Price overlay'],
 ['VWAP','Session VWAP estimate','Volume/Price',null,'HLC3 bar proxy only'],
 ['BB','Bollinger Bands','Volatility','bbPeriod','Price overlay'],
 ['HOD','Observed HOD','Price levels',null,'Price overlay'],
 ['LOD','Observed LOD','Price levels',null,'Price overlay'],
 ['OR','Opening range H/L','Price levels','orb','Price overlay'],
 ['STRUCTURE','Confirmed market structure','Structure','pivot','Chart pivots'],
 ['VOLUME','Bar volume','Participation',null,'Volume pane'],
 ['VOLMA','Volume moving average','Participation','volPeriod','Volume pane'],
 ['RSI','Wilder RSI','Momentum','rsi','Oscillator pane'],
 ['MACD','MACD (fast / slow / signal)','Momentum','macdFast','Oscillator pane'],
 ['ATR','Wilder ATR','Volatility','atr','Oscillator pane'],
 ['OBV','On-balance volume','Participation',null,'Oscillator pane']
] as Array<[string,string,string,string|null,string]>).map(([id,label,family,setting,placement])=>({id,label,family,setting,placement}));
const defaults:Record<string,number>={emaFast:9,emaSlow:20,ema200:200,sma:20,bbPeriod:20,bbDeviation:2,rsi:14,macdFast:12,macdSlow:26,macdSignal:9,atr:14,volPeriod:20,orb:5,pivot:2};
const defaultVisible:Record<string,boolean>={EMA_FAST:true,EMA_SLOW:true,EMA_200:false,VWAP:true,VOLUME:true,RSI:false};

type ChartTimeframe=1|3|5;
type ChartAppearance={bullish:string;bearish:string;doji:string;grid:string;rightBuffer:number;gap:number;timeframe:ChartTimeframe;showStructure:boolean;colors:Record<string,string>;types:Record<string,'solid'|'dashed'|'dotted'>};
const defaultChartAppearance:ChartAppearance={bullish:'#24e2b4',bearish:'#ff6395',doji:'#eed68d',grid:'#355b72',rightBuffer:12,gap:8,timeframe:1,showStructure:false,
 colors:{EMA_FAST:'#70e9f7',EMA_SLOW:'#f0d17b',EMA_200:'#bb9bff',VWAP:'#7f9cff',VOLUME:'#52e5ba',RSI:'#d0a9ed',MACD:'#7ec8f5',ATR:'#d89dca',SMA:'#c4a7ff',BB:'#ca9be7',STRUCTURE:'#ffdd8c'},types:{}};
const ChartAppearanceContext=React.createContext<{style:ChartAppearance;setStyle:React.Dispatch<React.SetStateAction<ChartAppearance>>}|null>(null);
function ChartCustomizer(){
 const a=React.useContext(ChartAppearanceContext);
 if(!a)return null;
 const {style}=a;
 const patch=(v:Partial<ChartAppearance>)=>a.setStyle(old=>({...old,...v}));
 const color=(id:string,c:string)=>a.setStyle(old=>({...old,colors:{...old.colors,[id]:c}}));
 const line=(id:string,t:'solid'|'dashed'|'dotted')=>a.setStyle(old=>({...old,types:{...old.types,[id]:t}}));
 return <section className="cx-chart-customizer" aria-label="Chart appearance personalization">
  <div className="cx-overline">CROWNLIGHT / CHART PERSONALIZATION</div><h3>Colors, indicators and replay display</h3>
  <div className="cx-chart-style-grid">
  {([['bullish','Bullish candle'],['bearish','Bearish candle'],['doji','Doji candle'],['grid','Grid lines']] as const).map(([key,label])=><label key={key}>{label}<input aria-label={label+' color'} type="color" value={style[key]} onChange={e=>patch({[key]:e.target.value})}/></label>)}
  <label>Timeframe<select aria-label="Chart timeframe" value={style.timeframe} onChange={e=>patch({timeframe:Number(e.target.value) as ChartTimeframe})}><option value={1}>1 minute</option><option value={3}>3 minutes</option><option value={5}>5 minutes</option></select></label>
  <label>Right-side buffer<input aria-label="Right chart buffer" type="number" min="0" max="40" value={style.rightBuffer} onChange={e=>patch({rightBuffer:Math.max(0,Math.min(40,Number(e.target.value)||0))})}/></label>
  <label>Candle spacing<input aria-label="Candle spacing" type="range" min="0" max="50" step="2" value={style.gap} onChange={e=>patch({gap:Number(e.target.value)})}/><span>{style.gap}%</span></label>
  <label className="cx-structure-toggle"><input aria-label="Show confirmed HH HL LH LL" type="checkbox" checked={style.showStructure} onChange={e=>patch({showStructure:e.target.checked})}/> Confirmed HH / HL / LH / LL</label>
  </div>
  <details><summary>Indicator colors and line styles</summary><div className="cx-chart-line-grid">{specs.filter(ind=>ind.id!=='VOLUME').map(ind=><div className="cx-chart-line-row" key={ind.id}><span>{ind.label}</span><input aria-label={ind.label+' line color'} type="color" value={style.colors[ind.id]||'#7f9cff'} onChange={e=>color(ind.id,e.target.value)}/><select aria-label={ind.label+' line type'} value={style.types[ind.id]||'solid'} onChange={e=>line(ind.id,e.target.value as 'solid'|'dashed'|'dotted')}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select></div>)}</div></details>
  <p className="cx-small">Visual settings are saved locally in this browser preview. Underlying prices and indicator calculations remain unchanged.</p>
 </section>;
}
type PrototypeMenu={x:number;y:number;view:'indicators'|'drawings';selected:string|null;custom:boolean};
function PrototypeChartContextMenu({menu,close,setMenu,studio,prefs,appearance,setAppearance}:{
 menu:PrototypeMenu|null;close:()=>void;setMenu:React.Dispatch<React.SetStateAction<PrototypeMenu|null>>;
 studio:Studio;prefs:IndicatorPrefs;appearance:ChartAppearance;setAppearance:React.Dispatch<React.SetStateAction<ChartAppearance>>;
}){
 const box=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!menu)return;
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();close()}};
  const outside=(event:PointerEvent)=>{if(box.current&&!box.current.contains(event.target as Node))close()};
  document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside,true);
  return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside,true)};
 },[menu,close]);
 useEffect(()=>{
  if(!menu||!box.current)return;
  const el=box.current;
  el.style.left=Math.max(8,Math.min(menu.x,window.innerWidth-el.offsetWidth-8))+'px';
  el.style.top=Math.max(8,Math.min(menu.y,window.innerHeight-Math.min(el.offsetHeight,window.innerHeight-16)-8))+'px';
 },[menu]);
 if(!menu)return null;
 const selected=specs.find(x=>x.id===menu.selected);
 const permitted=selected?studyAllowed(studio,selected.id):false;
 const help='Locked in Standard preview — Advanced or Professional Chart Studio required. This design preview never grants membership access.';
 const changeLine=(color:string)=>selected&&setAppearance(a=>({...a,colors:{...a.colors,[selected.id]:color}}));
 const changeStyle=(type:'solid'|'dashed'|'dotted')=>selected&&setAppearance(a=>({...a,types:{...a.types,[selected.id]:type}}));
 const field=(key:string,label:string,min:number,max:number,step=1)=><label key={key} className="cx-context-setting">{label}<input type="number" min={min} max={max} step={step} value={prefs.settings[key]??min} onChange={e=>prefs.setSettings(key,Math.max(min,Math.min(max,Number(e.target.value)||min)))}/></label>;
 const activate=(id:string,period?:number)=>{
  if(!studyAllowed(studio,id)){setMenu(m=>m?{...m,selected:id}:m);return}
  if(period!==undefined){const study=specs.find(x=>x.id===id);if(study?.setting)prefs.setSettings(study.setting,period)}
  prefs.setEnabled(id,true);close();
 };
 return createPortal(<div ref={box} className="cx-context-menu" data-selected={!!selected} role="dialog" aria-modal="false" aria-label="Prototype chart indicator context menu" style={{left:8,top:8}} onContextMenu={e=>e.preventDefault()}>
  <div className="cx-context-head"><strong>CROWNLIGHT / CHART TOOLS</strong><button type="button" aria-label="Close chart menu" onClick={close}>×</button></div>
  <nav className="cx-context-tabs" aria-label="Chart tool groups"><button aria-pressed={menu.view==='indicators'} onClick={()=>setMenu({...menu,view:'indicators',selected:null,custom:false})}>Indicators</button><button aria-pressed={menu.view==='drawings'} onClick={()=>setMenu({...menu,view:'drawings',selected:null,custom:false})}>Drawings</button></nav>
  {menu.view==='indicators'?<div className="cx-context-columns">
   <div className="cx-context-indicator-list" role="group" aria-label="All 16 computed prototype chart studies">
    {specs.map(item=><button type="button" key={item.id} data-prototype-indicator={item.id} className={menu.selected===item.id?'is-selected':''} aria-pressed={menu.selected===item.id} aria-disabled={!studyAllowed(studio,item.id)} title={studyAllowed(studio,item.id)?item.id==='VOLUME'?'Click to show or hide volume':item.family:help}
      onMouseEnter={()=>setMenu(m=>m&&m.view==='indicators'?{...m,selected:item.id,custom:false}:m)}
      onFocus={()=>setMenu(m=>m&&m.view==='indicators'?{...m,selected:item.id,custom:false}:m)}
      onClick={()=>{if(item.id==='VOLUME'&&studyAllowed(studio,item.id)){prefs.setEnabled(item.id,!prefs.enabled[item.id]);close();return}setMenu(m=>m?{...m,selected:item.id,custom:false}:m)}}>
      <span>{item.label}</span><small>{studyAllowed(studio,item.id)?prefs.enabled[item.id]?'ACTIVE':'AVAILABLE':'LOCKED · ADVANCED'}</small>
     </button>)}
   </div>
   <div className="cx-context-detail" aria-live="polite">{selected?<><strong>{selected.label}</strong><p>{selected.family} · {selected.placement}</p>
    {!permitted?<p className="cx-context-locked">{help}</p>:<>
     {selected.id==='EMA_FAST'||selected.id==='EMA_SLOW'||selected.id==='EMA_200'?<div className="cx-context-presets">{[9,20,200].map(period=><button key={period} type="button" onClick={()=>activate(period===9?'EMA_FAST':period===20?'EMA_SLOW':'EMA_200',period)} disabled={!studyAllowed(studio,period===9?'EMA_FAST':period===20?'EMA_SLOW':'EMA_200')}>EMA {period}{studio==='Standard'&&period===200?' · Locked':''}</button>)}</div>:null}
     <button type="button" onClick={()=>{prefs.setEnabled(selected.id,!prefs.enabled[selected.id]);close()}}>{prefs.enabled[selected.id]?'Hide':'Show'} {selected.label}</button>
     {selected.id!=='VOLUME'&&<button type="button" aria-expanded={menu.custom} onClick={()=>setMenu({...menu,custom:!menu.custom})}>{menu.custom?'Close settings':'Customize'}</button>}
     {menu.custom&&selected.id!=='VOLUME'&&<div className="cx-context-editor">
       {selected.setting?field(selected.setting,selected.id==='EMA_200'?'EMA long period':selected.label+' period',selected.id==='EMA_200'?100:2,selected.id==='EMA_200'?400:200):null}
       {selected.id==='BB'?field('bbDeviation','Standard-deviation multiplier',.5,4,.1):null}
       {selected.id==='MACD'?<>{field('macdFast','MACD fast',2,50)}{field('macdSlow','MACD slow',3,100)}{field('macdSignal','MACD signal',2,50)}</>:null}
       <label>Line color<input type="color" value={appearance.colors[selected.id]||'#7f9cff'} onChange={e=>changeLine(e.target.value)}/></label>
       <label>Line style<select value={appearance.types[selected.id]||'solid'} onChange={e=>changeStyle(e.target.value as 'solid'|'dashed'|'dotted')}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select></label>
       <button type="button" onClick={()=>{prefs.setEnabled(selected.id,true);close()}}>Apply</button>
      </div>}
    </>}
    </>:null}
   </div>
  </div>:<div className="cx-context-drawings"><strong>Drawing controls</strong><p>Drawing placement is only available where a prototype chart has an implemented time/price drawing adapter. Selecting a tool here does not activate unsupported drawing behavior.</p>{['Horizontal price level','Trendline','Fibonacci levels','Rectangle / range','Annotation'].map((name,i)=><div key={name} className="cx-context-locked">{name} · {studio==='Standard'&&i>0?'Locked · Advanced preview required':'Drawing adapter not yet connected'}</div>)}</div>}
  <p className="cx-context-foot">Fictional revealed OHLCV only · {studio} design preview · no entitlement changes</p>
 </div>,document.body);
}
function IndicatorDock(){
 const prefs=React.useContext(IndicatorContext);
 const barLook=React.useContext(BarLookContext);
 const [open,setOpen]=useState(false),[search,setSearch]=useState(''),[guides,setGuides]=useState<Array<{code:string;title:string;family:string;concept:string;formula:string;limit?:string;limits?:string;howToUse?:string;commonError?:string}>>([]);
 const [chosen,setChosen]=useState('STUDY_EMA');
 useEffect(()=>{let live=true;fetch('/data/tutor-indicator-study-v1.json',{cache:'no-store',credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(d=>{if(live&&d?.count===61&&Array.isArray(d.guides)&&d.guides.length===61)setGuides(d.guides)}).catch(()=>{});return()=>{live=false}},[]);
 if(!prefs)return null;
 const guide=guides.find(g=>g.code===chosen);
 const matches=specs.filter(x=>(x.label+' '+x.family).toLowerCase().includes(search.toLowerCase()));
 const settingRow=(k:string,title:string,min:number,max:number,step=1)=><label key={k} className="cx-indicator-number">{title}<input type="number" aria-label={title} min={min} max={max} step={step} value={prefs.settings[k]} onChange={e=>prefs.setSettings(k,Math.max(min,Math.min(max,Number(e.target.value)||min)))}/></label>;
 return <section className="cx-indicator-workbench" aria-label="Configurable trading indicator library">
  <div className="cx-indicator-heading"><div><div className="cx-overline">STUDY COMMAND CENTER / INTERACTIVE INDICATORS</div><h2>Indicators & settings <small>16 calculated studies · 61 authored research guides</small></h2><div className="cx-study-live-badges"><span>STUDIES ACTIVE · {Object.entries(prefs.enabled).filter(([id,enabled])=>enabled&&studyAllowed(prefs.studio,id)).length}</span><span>OHLCV ENGINE / NO LOOKAHEAD</span><span>HOVER TO INSPECT · CLICK TO CONFIGURE</span></div></div><div className="cx-tool-row"><button onClick={()=>setOpen(v=>!v)} aria-expanded={open}>{open?'Collapse indicators':'Expand indicators'}</button><button onClick={prefs.enableAll}>Show all calculated</button><button onClick={prefs.reset}>Restore defaults</button></div></div>
  {open&&<><div className="cx-indicator-layout"><div><label className="cx-study-search">Filter chart studies<input aria-label="Filter indicator list" value={search} onChange={e=>setSearch(e.target.value)} placeholder="EMA, RSI, volume, range…"/></label><div className="cx-study-list" role="group" aria-label="Toggle chart indicators">{matches.map(item=><label className={'cx-study-choice '+(!studyAllowed(prefs.studio,item.id)?'cx-study-locked':'')} key={item.id}><input type="checkbox" aria-label={'Show '+item.label} disabled={!studyAllowed(prefs.studio,item.id)} checked={studyAllowed(prefs.studio,item.id)&&!!prefs.enabled[item.id]} onChange={e=>prefs.setEnabled(item.id,e.target.checked)}/><span><strong>{item.label}</strong><small>{item.family} · {item.placement}</small></span><b>{!studyAllowed(prefs.studio,item.id)?'ADVANCED PREVIEW':prefs.enabled[item.id]?'ON':'OFF'}</b></label>)}{matches.length===0&&<p>No supported chart study matches your search.</p>}</div></div>
  <div><div className="cx-overline">ADJUSTABLE CALCULATION PARAMETERS · {prefs.studio.toUpperCase()} TOOL PREVIEW</div><div className="cx-indicator-params">{settingRow('emaFast','Fast EMA period',2,100)}{settingRow('emaSlow','Slow EMA period',3,100)}{settingRow('ema200','EMA 200 period',100,400)}{settingRow('sma','SMA period',2,100)}{settingRow('rsi','RSI period',2,100)}{settingRow('bbPeriod','Bollinger period',2,100)}{settingRow('bbDeviation','Bollinger standard deviation',.5,4,.1)}{settingRow('macdFast','MACD fast',2,50)}{settingRow('macdSlow','MACD slow',3,100)}{settingRow('macdSignal','MACD signal',2,50)}{settingRow('atr','ATR period',2,100)}{settingRow('volPeriod','Volume SMA period',2,100)}{settingRow('orb','Opening range minutes',1,30)}{settingRow('pivot','Structure confirmation bars',1,5)}</div><p className="cx-small">Values update only after each fictional bar completes. Warm-up gaps remain empty, not zero. Signal studies do not predict or authorize trades.</p></div></div>
  <div className="cx-indicator-catalog"><div><div className="cx-overline">TALIA / FULL AUTHORED STUDY LIBRARY</div><label>Explore all {guides.length||61} indicator topics <select aria-label="Indicator teaching guide" value={chosen} onChange={e=>setChosen(e.target.value)}><option value="STUDY_EMA">Exponential Moving Average</option>{guides.filter(g=>g.code!=='STUDY_EMA').map(g=><option key={g.code} value={g.code}>{g.title} · {g.family}</option>)}</select></label></div><div className="cx-guide-copy"><strong>{guide?.title||'Exponential Moving Average'}</strong><p>{guide?.concept||'A recent-price-weighted moving average. View the calculation settings, bar history and limitations.'}</p><p><b>Formula:</b> {guide?.formula||'EMA(t) = α × price(t) + (1−α) × EMA(t−1), α=2/(N+1)'}</p><p><b>Where it fails:</b> {guide?.limit||guide?.limits||'Indicators derived from historical bars are not future price guarantees.'}</p><p><b>Common live-trading error:</b> {guide?.commonError||'Treating a crossover alone as a trade signal.'}</p><span className="cx-chip">61 topics are teaching references; 16 studies are calculated on this synthetic OHLCV fixture</span></div></div></>}
 </section>;
}


type BarLook='quantum'|'glass'|'holographic'|'classic';
const barLooks:{id:BarLook;label:string}[]=[
 {id:'quantum',label:'Quantum Neon'},
 {id:'glass',label:'Precision Glass'},
 {id:'holographic',label:'Holographic Intelligence'},
 {id:'classic',label:'Market Classic'}
];
const BarLookContext=React.createContext<BarLook>('quantum');
function barVisual(look:BarLook,up:boolean,good:string,bad:string){
 const base=up?good:bad;
 if(look==='classic')return {color:base,borderColor:base,borderWidth:.8,borderRadius:[2,2,0,0]};
 const tint=(percent:number)=>{
  const hex=base.slice(1);if(!/^[0-9a-f]{6}$/i.test(hex))return base;
  const channels=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));
  return '#'+channels.map(x=>Math.max(0,Math.min(255,Math.round(percent>=0?x+(255-x)*percent:x*(1+percent)))).toString(16).padStart(2,'0')).join('');
 };
 const colors=look==='holographic'?[tint(.79),tint(.42),base,tint(-.45)]:
  look==='glass'?[tint(.9),tint(.55),tint(.05),tint(-.6)]:
  [tint(.84),tint(.42),base,tint(-.52)];
 return {color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:colors.map((color,i)=>({offset:i/3,color}))},
  borderColor:tint(.53),borderWidth:look==='glass'?1.2:.9,
  borderRadius:look==='glass'?[6,6,1,1]:[5,5,0,0],
  shadowBlur:look==='glass'?7:look==='holographic'?12:14,
  shadowColor:up?'rgba(42,222,185,.32)':'rgba(238,75,141,.32)',shadowOffsetY:2};
}


/** Earlier synthetic session context available BEFORE lesson replay. No future training bars used. */
const contextBars:Bar[]=(()=>{
 const result:Bar[]=[];let price=43.38,seed=20261101,ema9=price,ema20=price,weighted=0,total=0;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<1080;i++){
  const o=price,c=n(Math.max(2,o+.00015+(rand()-.5)*.058)),h=n(Math.max(o,c)+rand()*.055),lo=n(Math.min(o,c)-rand()*.053),v=Math.round(700+rand()*1400);
  ema9=n(ema9+(c-ema9)*.2);ema20=n(ema20+(c-ema20)*2/21);weighted+=(h+lo+c)/3*v;total+=v;
  result.push({time:'PRIOR '+String(i+1).padStart(4,'0'),o,h,l:lo,c,v,ema9,ema20,proxy:n(weighted/total)});price=c;
 }
 return result;
})();
function completedTimeframe(bars:Bar[],minutes:ChartTimeframe):Bar[]{
 if(minutes===1)return bars;
 const result:Bar[]=[];
 for(let i=0;i<bars.length;i+=minutes){const slice=bars.slice(i,i+minutes),first=slice[0],last=slice[slice.length-1];if(!first||!last)continue;
  result.push({...last,time:first.time+' / '+minutes+'m'+(slice.length<minutes?' (forming '+slice.length+'/'+minutes+')':''),o:first.o,h:Math.max(...slice.map(b=>b.h)),l:Math.min(...slice.map(b=>b.l)),c:last.c,v:slice.reduce((sum,b)=>sum+b.v,0)});
 }
 return result;
}

function EChart({kind,reveal,showVolume,showEma,showProxy,focusBar,onSelect,design,height=320,syncGroup,chartRole,forming,sourceBars}:{kind:ChartKind;reveal:number;showVolume:boolean;showEma:boolean;showProxy:boolean;focusBar:number;onSelect?:(index:number)=>void;design:Design;height?:number;syncGroup?:string;chartRole?:'technical'|'reference';forming?:Bar|null;sourceBars?:Bar[]}){
 const ref=useRef<HTMLDivElement>(null),inst=useRef<any>(null),viewport=useRef({start:Math.max(0,100-40/Math.max(1,reveal)*100),end:100});
 const [viewportLabel,setViewportLabel]=useState('Full session or revealed chart window');
 const activePointer=useRef<{id:number;x:number;start:number;end:number;width:number}|null>(null);
 const onPanStart=(e:React.PointerEvent<HTMLDivElement>)=>{if(kind!=='price'||e.button!==0||activePointer.current)return;const r=e.currentTarget.getBoundingClientRect();activePointer.current={id:e.pointerId,x:e.clientX,start:viewport.current.start,end:viewport.current.end,width:r.width};e.currentTarget.setPointerCapture(e.pointerId)};
 const onPanMove=(e:React.PointerEvent<HTMLDivElement>)=>{const p=activePointer.current;if(!p||p.id!==e.pointerId)return;const range=p.end-p.start,start=Math.max(0,Math.min(100-range,p.start-(e.clientX-p.x)/Math.max(1,p.width)*range));viewport.current={start,end:start+range};inst.current?.dispatchAction({type:'dataZoom',start,end:start+range});setViewportLabel('Visible window: '+start.toFixed(1)+'%–'+(start+range).toFixed(1)+'%')};
 const onPanStop=(e:React.PointerEvent<HTMLDivElement>)=>{if(activePointer.current?.id!==e.pointerId)return;activePointer.current=null;if(e.currentTarget.hasPointerCapture?.(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)};

 const prefs=React.useContext(IndicatorContext);
 const barLook=React.useContext(BarLookContext);
 const appearance=React.useContext(ChartAppearanceContext)?.style||defaultChartAppearance;
 const onSelectRef=useRef(onSelect);onSelectRef.current=onSelect;
 const settings=prefs?.settings,enabled=prefs?.enabled;
 const currentEnabled=Object.fromEntries(Object.entries({...enabled,EMA_FAST:showEma&&!!enabled?.EMA_FAST,EMA_SLOW:showEma&&!!enabled?.EMA_SLOW,VWAP:showProxy&&!!enabled?.VWAP,VOLUME:showVolume&&!!enabled?.VOLUME}).map(([k,v])=>[k,Boolean(v)&&studyAllowed(prefs?.studio||'Standard',k)]));
 if(chartRole==='technical')currentEnabled.VWAP=false;
 if(chartRole==='reference'){currentEnabled.EMA_FAST=false;currentEnabled.EMA_SLOW=false;currentEnabled.SMA=false;currentEnabled.BB=false;}
 const subpaneCount=kind==='price'?Object.entries(currentEnabled).filter(([k,v])=>v&&['RSI','MACD','ATR','OBV'].includes(k)).length:0;
 const actualHeight=kind==='price'?Math.max(height,360+subpaneCount*122):height;
 const resetViewport=()=>{viewport.current={start:0,end:100};setViewportLabel('Visible window: 0%–100%');inst.current?.dispatchAction({type:'dataZoom',start:0,end:100})};
 const moveWindow=(direction:number)=>{const {start,end}=viewport.current,windowSize=end-start,delta=direction*windowSize*.33;const left=Math.max(0,Math.min(100-windowSize,start+delta));inst.current?.dispatchAction({type:'dataZoom',start:left,end:left+windowSize})};
 const zoomWindow=(direction:number)=>{const {start,end}=viewport.current,mid=(start+end)/2;const width=Math.max(8,Math.min(100,(end-start)*(direction>0?.7:1.4)));const left=Math.max(0,Math.min(100-width,mid-width/2));inst.current?.dispatchAction({type:'dataZoom',start:left,end:left+width})};
 useEffect(()=>{
  let alive=true,resize:ResizeObserver|undefined;
  (async()=>{try{
   const echarts=await (window as ChartWindow).CrownlightECharts?.load();
   if(!alive||!ref.current||!echarts)return;
   const style=getComputedStyle(ref.current.closest('.cx-theme-green,.cx-theme-aurora,.cx-theme-quantum,.cx-theme-neon,.cx-theme-ember,.cx-theme-onyx')||ref.current);
   const cv=(k:string,fallback:string)=>style.getPropertyValue(k).trim()||fallback;
   const accent=cv('--cx-accent','#72e0d1'),good=appearance.bullish,bad=appearance.bearish,muted=cv('--cx-muted','#99aebe'),grid=appearance.grid;
    const luminous=(base:string,light:string)=>({type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:light},{offset:.32,color:base},{offset:1,color:base}]});
   const paintBar=(up:boolean)=>barVisual(barLook,up,good,bad);
   const bars=completedTimeframe(sourceBars?sourceBars.slice(0,reveal):dataFor(reveal),appearance.timeframe);
   const earlier=completedTimeframe(contextBars,appearance.timeframe);
   const context:Bar[]=[],offset=context.length; // Every prototype chart starts with a single observed fictional candle.
   const plotted=[...context,...bars,...(kind==='price'&&forming?[forming]:[])];
   const names=plotted.map(b=>b.time).concat(Array.from({length:appearance.rightBuffer},(_,i)=>'PADDING '+(i+1)));
   const pad=(items:any[])=>Array(offset).fill(null).concat(items);
   const isDoji=(bar:Bar)=>Math.abs(bar.c-bar.o)<0.005;
   const paintCandle=(bar:Bar)=>isDoji(bar)?{color:appearance.doji,color0:appearance.doji,borderColor:appearance.doji,borderColor0:appearance.doji,borderWidth:2}
     :{color:barVisual(barLook,true,good,bad).color,color0:barVisual(barLook,false,good,bad).color,borderColor:good,borderColor0:bad,borderWidth:2};
   const indicatorKey=(label:string)=>label.includes('EMA '+settings?.ema200)?'EMA_200':label.includes('EMA '+settings?.emaFast)?'EMA_FAST':label.startsWith('EMA ')?'EMA_SLOW':
      label.includes('volume-weighted')?'VWAP':label.startsWith('Bollinger')?'BB':label.startsWith('Wilder RSI')?'RSI':label.startsWith('Wilder ATR')?'ATR':
      label.startsWith('MACD')?'MACD':label.startsWith('Volume SMA')?'VOLMA':label.startsWith('Volume')?'VOLUME':label.startsWith('SMA ') ?'SMA':label;
   const ink=(label:string,fallback:string)=>appearance.colors[indicatorKey(label)]||fallback;
   const stroke=(label:string):'solid'|'dotted'|'dashed'=>appearance.types[indicatorKey(label)]||'solid';
   const axis={axisLine:{lineStyle:{color:grid}},axisTick:{show:false},axisLabel:{color:muted,fontSize:10},splitLine:{lineStyle:{color:grid,opacity:.55}}};
   let option:any={animation:false,backgroundColor:'transparent',textStyle:{color:muted,fontFamily:'Inter,system-ui'},tooltip:{trigger:'axis',confine:true,backgroundColor:'#0b1929',borderWidth:1,padding:[12,16],extraCssText:'box-shadow:0 18px 50px #0009;border-radius:10px;backdrop-filter:blur(16px);',borderColor:grid,textStyle:{color:'#eaf6fd',fontSize:12},axisPointer:{type:'cross',label:{backgroundColor:'#18364c'}}},grid:{left:46,right:12,top:20,bottom:34},xAxis:{type:'category',data:names,...axis,axisLabel:{color:muted,fontSize:9,interval:Math.max(0,Math.floor(reveal/8)),formatter:(value:string)=>value.startsWith('PADDING ')?'':value}},yAxis:{type:'value',scale:true,...axis},series:[]};
   if(kind==='price'){
    const math=(window as any).CrownlightPrototypeIndicators;
    const calculated=math?.compute?.(bars,settings||defaults,{...currentEnabled,EMA_200:!!currentEnabled.EMA_200&&bars.length>=(settings?.ema200||200),STRUCTURE:appearance.showStructure&&studyAllowed(prefs?.studio||'Standard','STRUCTURE')});
    if(!calculated)throw Error('Shared math library unavailable');
    const volumePane=calculated.volume.length>0;
    const panes:string[]=calculated.panes;
    const gridRows=[{id:'price',height:Math.max(185,actualHeight-65-(volumePane?95:0)-panes.length*120)}];
    if(volumePane)gridRows.push({id:'volume',height:81});
    for(const id of panes)gridRows.push({id,height:105});
    let top=18;
    option.grid=gridRows.map((x)=>{const out={left:16,right:76,top,height:x.height,containLabel:false,backgroundColor:'#06131c',show:true,borderWidth:0};top+=x.height+19;return out});
    option.xAxis=gridRows.map((x,i)=>({type:'category',gridIndex:i,data:names,boundaryGap:true,...axis,
      axisLabel:{show:i===gridRows.length-1,color:muted,fontSize:10,interval:Math.max(0,Math.floor(reveal/10)),formatter:(value:string)=>value.startsWith('PADDING ')?'':value}}));
    option.yAxis=gridRows.map((x,i)=>({type:'value',gridIndex:i,position:'right',scale:x.id!=='rsi',min:x.id==='rsi'?0:undefined,max:x.id==='rsi'?100:undefined,...axis,
      axisLabel:{color:muted,margin:12,fontSize:10,formatter:(v:number)=>Number(v).toFixed(x.id==='rsi'?0:2)},splitNumber:4}));
    const xIndexes=gridRows.map((_,i)=>i);
    const autoFollow=viewport.current.end>=99.5;
    const followStart=Math.max(0,100*(names.length-Math.max(34,34+appearance.rightBuffer))/names.length);
    const {start,end}=autoFollow?{start:followStart,end:100}:viewport.current;
    if(autoFollow)viewport.current={start,end};
    option.dataZoom=[
      {id:'drag-pan',type:'inside',xAxisIndex:xIndexes,start,end,moveOnMouseMove:false,zoomOnMouseWheel:true,moveOnMouseWheel:false,preventDefaultMouseMove:true,filterMode:'none'},
      {id:'range',type:'slider',xAxisIndex:xIndexes,start,end,bottom:0,height:13,brushSelect:false,
       fillerColor:'rgba(95,204,190,.23)',borderColor:grid,backgroundColor:'#0a1c2a',handleStyle:{color:accent},textStyle:{color:muted},filterMode:'none'}
    ];
    option.axisPointer={link:[{xAxisIndex:'all'}],lineStyle:{color:accent,type:'dashed',width:1,opacity:.5},label:{backgroundColor:'#183242'}};
    option.graphic=[{type:'text',right:100,top:45,silent:true,z:-2,style:{text:'CROWNLIGHT  ·  SIMULATION',fill:'rgba(126,167,182,.10)',font:'700 22px Inter,system-ui',textAlign:'right'}}];
    const markerData=[...calculated.marks.map((m:any)=>({name:m.label,coord:[offset+m.index,m.value],value:m.label,symbol:'pin',symbolSize:22,
 itemStyle:{color:appearance.colors.STRUCTURE||'#f8d18c'},label:{show:true,formatter:m.label,color:'#0b2334',backgroundColor:'#f8d18c',fontWeight:800,fontSize:9}}))];
    if(focusBar>=0&&focusBar<reveal){const focusIndex=Math.min(bars.length-1,Math.floor(focusBar/appearance.timeframe));markerData.push({name:'Talia inspected bar',coord:[offset+focusIndex,bars[focusIndex].h],symbol:'pin',symbolSize:25,value:bars[focusIndex].time,itemStyle:{color:'#f6cb7a',borderColor:'#fff2bc',borderWidth:1},label:{show:true,color:'#0a2432',fontWeight:900,fontSize:8,formatter:()=>String(focusBar+1)}});}
    option.series=[{id:'price-candles',type:'candlestick',name:'Fictional completed OHLCV',data:plotted.map(b=>({value:[b.o,b.c,b.l,b.h],itemStyle:paintCandle(b)})),barCategoryGap:appearance.gap+'%',
      itemStyle:{color:paintBar(true).color,color0:paintBar(false).color,borderColor:paintBar(true).borderColor,borderColor0:paintBar(false).borderColor,borderWidth:barLook==='classic'?1:2,shadowBlur:barLook==='classic'?0:5,shadowColor:'#102f3c'},barMaxWidth:30,barMinWidth:7,
      markLine:{silent:true,symbol:'none',lineStyle:{color:good,type:'dashed',opacity:.65,width:1},label:{show:true,position:'end',formatter:()=>dollars(bars[bars.length-1].c),color:'#041516',backgroundColor:good,padding:[4,7],borderRadius:3,fontWeight:800},data:[{yAxis:bars[bars.length-1].c},...(focusBar>=0&&focusBar<reveal?[{xAxis:names[offset+Math.floor(focusBar/appearance.timeframe)],lineStyle:{color:'#f6cb7a',type:'dotted',width:2,opacity:.75},label:{show:false}}]:[])]},
      markPoint:{silent:true,data:markerData}}];
    for(const x of calculated.price)option.series.push({id:'ind-'+x.label,name:x.label,type:'line',data:pad(x.data),showSymbol:false,connectNulls:false,animation:false,
       lineStyle:{color:ink(x.label,x.color),width:x.width,type:stroke(x.label)},itemStyle:{color:ink(x.label,x.color)},symbol:'none'});
    if(currentEnabled.EMA_200){
      const mathApi=(window as any).CrownlightIndicatorMath;
      const historyPlusObserved=bars; // Never warm up a visible study with undisclosed earlier fictional bars.
      const longPeriod=settings?.ema200||200;
      const longEma=mathApi?.ema?.(historyPlusObserved.map((b:Bar)=>b.c),longPeriod);
      if(Array.isArray(longEma))option.series.push({id:'ind-ema200',name:'EMA '+longPeriod,type:'line',showSymbol:false,connectNulls:false,animation:false,
       data:longEma.slice(-offset-bars.length),lineStyle:{color:appearance.colors.EMA_200||'#bb9bff',width:2.5,type:appearance.types.EMA_200||'solid'},symbol:'none'});
    }
    for(const x of calculated.volume){
      const index=gridRows.findIndex(x=>x.id==='volume');if(index<0)continue;
      option.series.push({id:'volume-'+x.label,name:x.label,type:x.kind==='bar'?'bar':'line',xAxisIndex:index,yAxisIndex:index,
       data:x.kind==='bar'?pad(x.data.map((v:number,i:number)=>({value:v,itemStyle:Math.abs(bars[i].o-bars[i].c)<.005?{color:appearance.doji}:paintBar(bars[i].c>=bars[i].o)}))):pad(x.data),
       showSymbol:false,itemStyle:{color:x.color},lineStyle:{color:ink(x.label,x.color),width:2,type:stroke(x.label)},barMaxWidth:17,animation:false});
    }
    for(const x of calculated.pane){
     const index=gridRows.findIndex(g=>g.id===x.axis);if(index<0)continue;
     const series:any={id:'pane-'+x.label,name:x.label,type:x.kind==='bar'?'bar':'line',xAxisIndex:index,yAxisIndex:index,
       data:x.kind==='bar'?pad(x.data.map((v:number)=>({value:v,itemStyle:barVisual(barLook,v>=0,x.color,'#e9678d')}))):pad(x.data),showSymbol:false,animation:false,itemStyle:{color:ink(x.label,x.color)},lineStyle:{color:ink(x.label,x.color),width:2.5,type:stroke(x.label)},connectNulls:false};
     if(x.axis==='rsi'&&x.label.startsWith('Wilder'))series.markLine={silent:true,symbol:'none',lineStyle:{type:'dashed',color:grid},data:[{yAxis:30},{yAxis:70}]};
     option.series.push(series);
    }
   }else if(kind==='heat'){
    const rows=['Price response','Volume','VWAP proxy','Trend','Momentum','Recognition'];
    const blocks=Array.from({length:12*6},(_,k)=>[k%12,Math.floor(k/12),Math.round(40+55*Math.abs(Math.sin(k*.37+reveal*.04)))]);
    option={...option,tooltip:{position:'top'},visualMap:{show:false,min:0,max:100,inRange:{color:['#172c43','#2c6a8b',accent,'#f0d187']}},grid:{left:90,right:12,top:12,bottom:33},
      xAxis:{type:'category',data:Array.from({length:12},(_,i)=>'T'+(i+1)),...axis,splitArea:{show:false}},yAxis:{type:'category',data:rows,...axis},
      series:[{type:'heatmap',data:blocks,label:{show:false},itemStyle:{borderColor:'#081722',borderWidth:2,borderRadius:3}}]};
   }else if(kind==='radar'){
    option={...option,tooltip:{show:true},radar:{indicator:[{name:'Knowledge',max:100},{name:'Recognition',max:100},{name:'Decision',max:100},{name:'Process',max:100},{name:'Review',max:100}],
      splitLine:{lineStyle:{color:grid}},splitArea:{areaStyle:{color:['transparent']}},axisLine:{lineStyle:{color:grid}},axisName:{color:muted}},
      series:[{type:'radar',data:[{value:[84,71,67,88,76],name:'Fictional learning record',areaStyle:{color:accent,opacity:.27},lineStyle:{color:accent,width:3},symbol:'circle',symbolSize:7,itemStyle:{color:'#f0faff',borderColor:accent,borderWidth:2}}]}]};
   }else if(kind==='equity'){
    const values=Array.from({length:30},(_,i)=>n(10000+i*17+Math.sin(i*.65)*120+Math.cos(i*.2)*170));
    option={...option,xAxis:{type:'category',data:values.map((_,i)=>String(i+1)),...axis},
      series:[{type:'line',name:'Fictional practice equity',data:values,smooth:.24,showSymbol:false,lineStyle:{color:accent,width:3},areaStyle:{opacity:.35,color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:accent},{offset:1,color:'rgba(9,25,40,0)'}]}}}]};
   }else if(kind==='volume'){
    option={...option,xAxis:{type:'category',data:names,...axis},series:[{type:'bar',name:'Illustrative volume',barMaxWidth:22,data:bars.map(b=>({value:b.v,itemStyle:Math.abs(b.c-b.o)<.005?{color:appearance.doji}:paintBar(b.c>=b.o)}))}]};
   }
   inst.current=echarts.init(ref.current);
   inst.current.setOption(option,true);
   if(syncGroup&&kind==='price'){inst.current.group=syncGroup;echarts.connect?.(syncGroup)}
   if(kind==='price'){
    inst.current.on('datazoom',()=>{
      if(!inst.current)return;
      const state=inst.current.getOption()?.dataZoom?.[0];
      if(state&&Number.isFinite(state.start)&&Number.isFinite(state.end)){viewport.current={start:state.start,end:state.end};setViewportLabel('Visible window: '+state.start.toFixed(1)+'%–'+state.end.toFixed(1)+'%');}
    });
    inst.current.on('click',(p:any)=>{if(typeof p.dataIndex==='number'&&p.dataIndex>=offset&&p.dataIndex<offset+bars.length)onSelectRef.current?.(Math.min(reveal-1,(p.dataIndex-offset)*appearance.timeframe+appearance.timeframe-1))});
   }
   resize=new ResizeObserver(()=>inst.current?.resize());resize.observe(ref.current);
  }catch(error){if(ref.current)ref.current.textContent='Chart unavailable: check the locally hosted ECharts and shared indicator math bundles.';console.error('Crownlight synthetic chart',error)}
  })();
  return()=>{alive=false;resize?.disconnect();inst.current?.dispose();inst.current=null};
 },[kind,reveal,showVolume,showEma,showProxy,focusBar,design,settings,enabled,actualHeight,syncGroup,chartRole,barLook,appearance,forming,sourceBars]);
 return <div className="cx-interactive-chart">
 {kind==='price'&&<div className="cx-pan-controls" role="toolbar" aria-label="Chart navigation and panning">
    <button type="button" aria-label="Open chart indicator context menu" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();window.dispatchEvent(new CustomEvent('crownlight:prototype-chart-menu',{detail:{x:r.left,y:r.bottom+6,view:'indicators'}}))}}>Indicators menu</button>
    <button type="button" aria-label="Open chart drawing controls" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();window.dispatchEvent(new CustomEvent('crownlight:prototype-chart-menu',{detail:{x:r.left,y:r.bottom+6,view:'drawings'}}))}}>Drawings</button>
    <span>DRAG CHART TO PAN · SCROLL WHEEL TO ZOOM · RANGE SLIDER TO NAVIGATE</span>
    <button aria-label="Pan chart left" onClick={()=>moveWindow(-1)}>← Pan</button>
    <button aria-label="Pan chart right" onClick={()=>moveWindow(1)}>Pan →</button>
    <button aria-label="Zoom chart in" onClick={()=>zoomWindow(1)}>Zoom +</button>
    <button aria-label="Zoom chart out" onClick={()=>zoomWindow(-1)}>Zoom −</button>
    <button aria-label="Fit all revealed candles" onClick={resetViewport}>Fit</button><output className="cx-viewport-status" aria-live="polite">{viewportLabel}</output>
   </div>}
 <div ref={ref} className={'cx-chart '+(kind==='price'?'cx-chart-grabbable':'')} style={{height:actualHeight}} onPointerDown={onPanStart} onPointerMove={onPanMove} onPointerUp={onPanStop} onPointerCancel={onPanStop} onLostPointerCapture={onPanStop}
   role="img" aria-label={kind==='price'?'Draggable synthetic OHLCV candlestick chart. Hold mouse button and drag to pan; release stops movement, wheel zooms; keyboard-accessible pan and zoom buttons appear above.':kind+' fictional visualization'}/>
 </div>;
}

const Icon=({type}:{type:string})=><span aria-hidden="true" className="cx-glyph">{type}</span>;
type CoachMode='Explain This Concept'|'Guided Example'|'Try Another Example'|'Teach This in More Depth';
function Talia({topic,step,bar,stage=0,onStage}:{topic:Topic;step:number;bar?:Bar;stage?:number;onStage?:(n:number)=>void}){
 const [mode,setMode]=useState<CoachMode>('Explain This Concept');
 const [typed,setTyped]=useState(0),[playing,setPlaying]=useState(false),[typing,setTyping]=useState(true),[speed,setSpeed]=useState(24);
 useEffect(()=>setMode('Explain This Concept'),[topic,step]);
 const stagesVWAP=[
 ['Objective','Explain why weighting by trade size matters; compute the weighted mean with units; distinguish trade-print VWAP from a candle-level approximation.'],
 ['First principles','VWAP asks: At what average price did the observed shares trade? Each transaction contributes price × shares. Larger share lots influence the mean more.'],
 ['Worked numerical example','100 shares at $10 = $1,000; 300 at $11 = $3,300; $4,300 ÷ 400 shares = $10.75/share. Simple mean $10.50 is wrong for unequal quantities.'],
 ['Guided chart observation','Compare a completed close with cumulative HLC3 × volume proxy. This uses bar typical prices, not the individual trade-print VWAP.'],
 ['Knowledge checkpoint','Identify numerator (traded dollars), denominator (shares), units, and whether a VWAP value is trade-print based or an approximation.'],
 ['Guided practice','Change trade inputs. Recompute each trade value, the total traded dollars and total shares before checking the final answer.'],
 ['Independent practice preview','Calculate without copying the worked example. This preview is ungraded, and protected official assessment questions are not exposed.'],
 ['Transfer','A new case is shown in the independent transfer form below. Compute its answer from the new inputs before requesting feedback. Do not copy the worked-example value.'],
 ['Review and decision','VWAP is retrospective. Above/below a mean cannot alone establish liquidity, a confirmed entry, or next-bar behavior.']
 ];
 const stagesCandle=[
 ['Objective','Identify OHLC, body, wicks, range and body-to-range percent. Avoid predictions from candle shape alone.'],
 ['First principles','A candle summarizes one fixed interval. Open is first, close is final, high is maximum and low is minimum; the order inside the bar is not known.'],
 ['Worked numerical example','O=$31.00, H=$32.50, L=$30.50, C=$32.00. Body=$1.00; range=$2.00; upper wick=$0.50; lower wick=$0.50; body/range=50%.'],
 ['Guided chart observation','Choose a completed candle and record four prices, close versus open, body size and the upper and lower wicks.'],
 ['Knowledge checkpoint','Distinguish full high–low range from close–open body; green color alone cannot establish bullish continuation.'],
 ['Guided practice','Change OHLC in the builder. Confirm high ≥ open/close and low ≤ open/close. Examine body and wick recalculations.'],
 ['Independent practice preview','Work independently before checking. This preview never accesses or reveals the protected official assessment answer keys.'],
 ['Transfer','Use the new candle below to calculate body as a percent of the full range. Explain the formula before checking your independent response.'],
 ['Review and decision','A long wick shows price excursion, not who traded or what must come next. Check volume, structure, time and invalidation.']
 ];
 const stages=topic==='vwap'?stagesVWAP:stagesCandle;
 const base=stages[Math.min(8,Math.max(0,step))];
 const evidence=bar?'Current revealed candle '+bar.time+': O '+dollars(bar.o)+', H '+dollars(bar.h)+', L '+dollars(bar.l)+', C '+dollars(bar.c)+', volume '+bar.v.toLocaleString()+' shares, range '+dollars(bar.h-bar.l)+', body '+dollars(Math.abs(bar.c-bar.o))+'.':'The active learning example uses fictional OHLCV.';
 const alternate=topic==='vwap'?'150 shares at $12 and 50 shares at $16: $1,800 + $800 = $2,600. Divide by 200 shares = $13/share. The simple mean $14 is wrong because quantities differ.':'O=$28.50, H=$29.20, L=$28.00, C=$28.90. Body=$0.40; range=$1.20; upper wick=$0.30; lower wick=$0.50; body/range=33.33%.';
 const deep=topic==='vwap'?'Price ($/share) × shares = dollars; divided by shares gives $/share. Bar HLC3 proxy uses (high+low+close)/3 × bar volume, not a true trade price. Future bars cannot be used to evaluate a prior replay decision.':'Body=|C−O|; upper wick=H−max(O,C); lower wick=min(O,C)−L; range=H−L. Three parts sum to the range. Body-to-range is undefined at zero range; intrabar price order is unknown.';
 const diagnostic=topic==='vwap'?'Averaging transaction prices without weighting shares, or treating HLC3 as exact print VWAP. Correct by computing every price×shares subtotal and declaring source limitations.':'Confusing body with high–low range or reading a wick as a guaranteed reversal. Correct by labeling O/H/L/C separately and calculating each component.';
 const content=mode==='Guided Example'?(topic==='vwap'?stagesVWAP[2][1]:stagesCandle[2][1]):mode==='Try Another Example'?alternate:mode==='Teach This in More Depth'?base[1]+' '+deep+' '+diagnostic:base[1];
 useEffect(()=>{if(!typing||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){setTyped(content.length);return}setTyped(0);let pos=0;const id=window.setInterval(()=>{pos=Math.min(content.length,pos+2);setTyped(pos);if(pos===content.length)window.clearInterval(id)},speed);return()=>window.clearInterval(id)},[content,typing,speed]);
 useEffect(()=>{if(!playing||!onStage||stage>=9||[4,6,8].includes(stage)||typed<content.length)return;const id=window.setTimeout(()=>onStage(stage+1),1500);return()=>window.clearTimeout(id)},[playing,onStage,stage,typed,content]);
 useEffect(()=>{if([4,6,8].includes(stage))setPlaying(false)},[stage]);
 return <section className="cx-talia" aria-label="Talia Mercer guided teaching"><div className="cx-orb" aria-hidden="true">T</div><div className="cx-coach-content"><div className="cx-overline">TALIA MERCER / INSTRUCTIONAL COACH</div><strong>{base[0]} · {topic==='vwap'?'VWAP':'Candlestick anatomy'}</strong>
  <div className="cx-coach-actions">{(['Explain This Concept','Guided Example','Try Another Example','Teach This in More Depth'] as CoachMode[]).map(m=><button type="button" key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m}</button>)}</div>
  <div className="cx-talia-playback" role="group" aria-label="Talia instructional playback"><button onClick={()=>setPlaying(x=>!x)} disabled={!onStage} aria-pressed={playing}>{playing?'Pause auto-play':'Auto-play lessons'}</button><button onClick={()=>{setTyping(true);setTyped(0);setMode('Explain This Concept')}}>Replay typed instruction</button><button onClick={()=>{setTyping(false);setPlaying(false);setTyped(content.length)}}>Show all text</button><label>Typing speed<select aria-label="Talia typing speed" value={speed} onChange={e=>{setTyping(true);setSpeed(Number(e.target.value))}}><option value={45}>Slow</option><option value={24}>Normal</option><option value={10}>Fast</option></select></label></div><p className="cx-coach-typed" aria-hidden="true">{typing?content.slice(0,typed):content}{typing&&typed<content.length&&<span className="cx-type-cursor" aria-hidden="true">▌</span>}</p><span className="cx-sr-only" aria-live="polite">{content}</span><small>Auto-play stops at Predict, Assess and Transfer checkpoints; no grades or membership charges.</small>
  {step===3&&<p className="cx-coach-evidence">{evidence}</p>}
  {step===5&&<p className="cx-coach-evidence"><b>Guided process:</b> identify inputs → formula → substitute values → calculate → label units → explain limitations.</p>}
  {step===8&&<p className="cx-coach-evidence"><b>Common mistake and correction:</b> {diagnostic}</p>}
  <small>Complete explanations and retries are not paywalled within an accessible lesson. This is authored deterministic teaching, not a claim of a live AI conversation.</small>
 </div></section>;
}
type EvidenceTab='inspect'|'compare'|'practice'|'source';
function TutorEvidenceDesk({topic,stage,focus,reveal,onFocus,onStage}:{topic:Topic;stage:number;focus:number;reveal:number;onFocus:(v:number)=>void;onStage:(v:number)=>void}){
 const [tab,setTab]=useState<EvidenceTab>('inspect'),[decision,setDecision]=useState(''),[checked,setChecked]=useState(false),[number,setNumber]=useState(''),[numericFeedback,setNumericFeedback]=useState('');
 const idx=Math.max(0,Math.min(reveal-1,focus)),bar=series[idx],prev=idx>0?series[idx-1]:null;
 const visible=dataFor(idx+1),averageVolume=visible.reduce((sum,b)=>sum+b.v,0)/visible.length;
 const closeDelta=prev?bar.c-prev.c:0;
 const typical=(bar.h+bar.l+bar.c)/3,body=Math.abs(bar.c-bar.o);
 const expected=topic==='vwap'?typical:body;
 useEffect(()=>{setChecked(false);setDecision('');setNumber('');setNumericFeedback('')},[topic,stage,idx,reveal]);
 const chartStyle=React.useContext(ChartAppearanceContext)?.style;
 const indicatorPrefs=React.useContext(IndicatorContext);
 const confirmed=chartStyle?.showStructure&&studyAllowed(indicatorPrefs?.studio||'Standard','STRUCTURE')
  ?(window as any).CrownlightPrototypeIndicators?.compute?.(dataFor(idx+1),indicatorPrefs?.settings||defaults,{STRUCTURE:true,...Object.fromEntries(specs.filter(s=>s.id!=='STRUCTURE').map(s=>[s.id,false]))})?.marks||[]:[];
 const structure=confirmed.length?confirmed[confirmed.length-1]:null;
 const context='SIM-01 / '+bar.time+' / BAR '+(idx+1)+' OF '+reveal;
 const response=()=>{if(!number.trim()||!Number.isFinite(Number(number))){setNumericFeedback('Enter a finite numerical result first.');return}
  const actual=Number(number);
  setNumericFeedback(Math.abs(actual-expected)<=0.011?'Correct. '+(topic==='vwap'?'('+dollars(bar.h)+' + '+dollars(bar.l)+' + '+dollars(bar.c)+') ÷ 3 = '+dollars(typical)+'. This is a single-candle typical price, NOT a trade-print VWAP.':'|'+dollars(bar.c)+' − '+dollars(bar.o)+'| = '+dollars(body)+' candle body. The full high–low range is '+dollars(bar.h-bar.l)+'.'):
   'Not yet. '+(topic==='vwap'?'Add the selected candle high, low, and close, then divide by three. This is not a VWAP calculation.':'Subtract open from close, take the absolute value, and preserve dollars-per-share units.')+' This is ungraded and can be retried.');
 };
 return <section className="cx-tutor-evidence" aria-label="Talia interactive chart evidence desk">
  <div className="cx-tutor-evidence-head"><div><span className="cx-overline">TALIA MERCER / INTERACTIVE CHART INSTRUCTOR</span><h4>Explore the evidence, not a prediction.</h4><p>Selection follows the actual chart cursor and the current completed-bar replay boundary.</p></div><span className="cx-tutor-evidence-tag">SOURCE-BOUNDED</span></div>
  <output className="cx-tutor-context" aria-live="polite"><span>SELECTED CONTEXT</span><strong>{context}</strong><small>{topic==='vwap'?'VWAP + market structure':'Candle anatomy'} · display stage {stage+1}/10</small></output>
  <nav className="cx-tutor-tabs" aria-label="Talia evidence desk modes">{([['inspect','Inspect candle'],['compare','Compare bars'],['practice','Practice reasoning'],['source','Sources & limits']] as const).map(([id,name])=><button key={id} aria-pressed={tab===id} onClick={()=>setTab(id)}>{name}</button>)}</nav>
  {tab==='inspect'&&<div className="cx-tutor-evidence-body"><p><strong>Observed evidence:</strong> The completed {bar.time} candle opened at {dollars(bar.o)}, traded as high as {dollars(bar.h)} and as low as {dollars(bar.l)}, and closed at {dollars(bar.c)} on {bar.v.toLocaleString()} simulated shares.</p>
   <div className="cx-tutor-metrics"><div><span>PRICE BODY</span><b>{dollars(body)}</b></div><div><span>FULL RANGE</span><b>{dollars(bar.h-bar.l)}</b></div><div><span>OHLCV HLC3</span><b>{dollars(typical)}</b></div><div><span>VOLUME / TO-DATE AVG.</span><b>{(bar.v/averageVolume).toFixed(2)}×</b></div></div>
   <p className="cx-tutor-caution"><strong>Interpretation:</strong> {bar.c>bar.o?'The close was above the open, but that alone cannot establish continuation.':bar.c<bar.o?'The close was below the open, but that alone cannot establish a reversal.':'The open and close matched; intrabar movements are still possible.'} {topic==='vwap'?'Candle HLC3 is not the execution-price volume-weighted average.':'The candle does not reveal the precise order of trades inside its timeframe.'}</p>
   {structure&&<p className="cx-structure-tutor" role="status"><strong>Talia · confirmed structure:</strong> {structure.label} at ${dollars(structure.value)} (pivot bar {structure.index+1}, confirmed only after bar {structure.confirmedAt+1}). This marker uses no unrevealed bars.</p>}
  <div className="cx-tutor-controls"><button disabled={idx===0} onClick={()=>onFocus(idx-1)}>Inspect previous completed bar</button><button disabled={idx===reveal-1} onClick={()=>onFocus(reveal-1)}>Select latest revealed bar</button></div>
  </div>}
  {tab==='compare'&&<div className="cx-tutor-evidence-body"><p><strong>Compare observations, not outcomes.</strong> {prev?'Against '+prev.time+', the selected close moved '+(closeDelta>=0?'+':'')+dollars(closeDelta)+'; volume '+(bar.v>=prev.v?'increased':'decreased')+' from '+prev.v.toLocaleString()+' to '+bar.v.toLocaleString()+' synthetic shares.':'This is the first revealed candle; there is no earlier bar in this session.'}</p>
   <div className="cx-tutor-metrics"><div><span>PREVIOUS CLOSE</span><b>{prev?dollars(prev.c):'N/A'}</b></div><div><span>SELECTED CLOSE</span><b>{dollars(bar.c)}</b></div><div><span>CHANGE</span><b>{prev?(closeDelta>=0?'+':'')+dollars(closeDelta):'N/A'}</b></div><div><span>VOLUME CHANGE</span><b>{prev?((bar.v-prev.v)/prev.v*100).toFixed(1)+'%':'N/A'}</b></div></div><p className="cx-tutor-caution">Two completed bars do not reveal order-book intent, liquidity, or the unrevealed next candle. A market interpretation needs more context and an invalidation condition.</p><button disabled={!prev} onClick={()=>onFocus(idx-1)}>Inspect comparison bar on chart</button></div>}
  {tab==='practice'&&<div className="cx-tutor-evidence-body"><div className="cx-overline">UNGRADED / INDEPENDENT REASONING</div><p>Which conclusion can be supported from the selected completed candle without seeing future data?</p><div className="cx-tutor-choices" role="group" aria-label="Talia no-lookahead practice question">{([['certainty','The next candle must move in the same direction.'],['evidence','The selected OHLCV bar is observed; the next movement remains unknown.'],['signal','The price/volume combination guarantees a profitable trade.']] as const).map(([value,label])=><button key={value} aria-pressed={decision===value} onClick={()=>{setDecision(value);setChecked(false)}}>{label}</button>)}</div>
   <button onClick={()=>setChecked(true)} disabled={!decision}>Check reasoning</button>{checked&&<p className="cx-tutor-feedback" role="status">{decision==='evidence'?'Correct. Observations can support a trading hypothesis but cannot guarantee the next movement. Explain your invalidation and risk before considering a hypothetical trade.':'Not supported. Completed candles and indicators cannot establish a guaranteed future price or profit. Identify observed evidence separately from conjecture.'}</p>}
   <div className="cx-tutor-calc"><label>{topic==='vwap'?'Calculate selected HLC3 typical price ($/share; NOT VWAP)':'Calculate selected candle body ($/share)'}<input aria-label="Talia selected candle calculation" type="number" step=".01" value={number} onChange={e=>{setNumber(e.target.value);setNumericFeedback('')}}/></label><button onClick={response}>Check calculation</button><p role="status">{numericFeedback||'No grade, membership charge, reward, or mastery is recorded for these guided exercises.'}</p></div>
   <div className="cx-tutor-controls"><button onClick={()=>onStage(2)}>Open worked example</button><button onClick={()=>onStage(8)}>Open transfer challenge</button></div></div>}
  {tab==='source'&&<div className="cx-tutor-evidence-body"><p><strong>Data provenance:</strong> In-browser deterministic fictional case SIM-01, seeded generator 1357911; one-minute candles from 09:30 onward. Tutor evidence stops at {visible[visible.length-1].time}, selected bar {idx+1} of 96; current chart replay has {reveal} bars revealed. This panel does not use bars after the selected timestamp.</p><p><strong>Calculation:</strong> OHLCV HLC3 = (high + low + close) / 3. This does not reconstruct trade-print VWAP or NBBO. The 16 calculated prototype studies are separate from the 61 authored indicator guides.</p><p><strong>Trust boundaries:</strong> Current chart context is local synthetic data; there is no authenticated member learning history, paid AI inference, independent grade, protected answer key, real market feed, brokerage order or Lumen debit in this preview.</p><p><strong>Instruction policy:</strong> Explain This Concept, Guided Example, Try Another Example and Teach This in More Depth remain free within any accessible lesson. The full production Tutor requires separate authenticated API and editorial acceptance.</p></div>}
  <div className="cx-tutor-evidence-foot"><span>OBSERVE → CALCULATE → INTERPRET → PRACTICE → TRANSFER</span><span>FICTIONAL · NO LOOKAHEAD · NO MASTERY WRITES</span></div>
 </section>;
}
const teachingDisplay=['Start','Learn','Calculate','Experiment','Predict','Replay / Practice','Assess','Review & Retry','Transfer Challenge','Results'] as const;
function Lesson({topic,setTopic,stage,setStage,bar,setBar,focus=0,reveal=54,setFocus=()=>{}}:{topic:Topic;setTopic:(v:Topic)=>void;stage:number;setStage:(v:number)=>void;bar:Bar;setBar:(v:Bar)=>void;focus?:number;reveal?:number;setFocus?:(v:number)=>void}){
 const authoritativeStage=([0,1,2,3,4,5,6,5,7,8] as const)[stage]??8;
 const [trades,setTrades]=useState(demoTrades);
 const [prediction,setPrediction]=useState(''),[predictionFeedback,setPredictionFeedback]=useState('');
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState('');
 const [o,setO]=useState(31),[h,setH]=useState(32.5),[l,setL]=useState(30.5),[c,setC]=useState(32);
 const sumV=trades.reduce((s,x)=>s+x.volume,0),sumPV=trades.reduce((s,x)=>s+x.price*x.volume,0);
 const trueVWAP=sumV?sumPV/sumV:0;
 const [transferAnswer,setTransferAnswer]=useState(''),[transferFeedback,setTransferFeedback]=useState('');
 const check=()=>{
  const result=topic==='vwap'?trueVWAP:Math.abs(c-o),guess=Number(answer);
  if(!answer.trim()||!Number.isFinite(guess)){setFeedback('Enter a finite numeric value in dollars per share. Show your units.');return}
  if(Math.abs(guess-result)<.011){setFeedback('Correct: '+(topic==='vwap'?dollars(sumPV)+' total traded dollars ÷ '+sumV.toLocaleString()+' shares = '+dollars(result)+' per share. A simple mean ignores volume.':'|'+dollars(c)+' − '+dollars(o)+'| = '+dollars(result)+' body. Full range is '+dollars(h-l)+', not the body.')+' Now state what cannot be inferred.');return}
  if(topic==='vwap'){
    const mean=trades.reduce((a,t)=>a+t.price,0)/trades.length;
    setFeedback(Math.abs(guess-mean)<.011?'You calculated the unweighted mean. Each lot has a different number of shares; first multiply each price by shares.':
      'Your weighted average is not yet correct. Add the dollar values '+trades.map(t=>dollars(t.price*t.volume)).join(' + ')+' = '+dollars(sumPV)+'. Divide by '+sumV.toLocaleString()+' shares; keep units $/share.');
  }else{
    setFeedback(Math.abs(guess-(h-l))<.011?'You used the full high–low range, which includes both wicks. Body uses close minus open.':
      'Compare only OPEN '+dollars(o)+' and CLOSE '+dollars(c)+'. The body is the absolute difference; high and low determine the full range and wicks.');
  }
 };
 const checkTransfer=()=>{
  const target=topic==='vwap'?12.4:.25,got=Number(transferAnswer);
  if(!transferAnswer.trim()||!Number.isFinite(got)){setTransferFeedback('Enter a numeric answer with units; this is separate from the guided example.');return}
  setTransferFeedback(Math.abs(got-target)<.011?
   'Correct. '+(topic==='vwap'?'$12,400 ÷ 1,000 shares = $12.40/share.':'$0.40 body ÷ $1.60 full range × 100 = 25%.')+' A calculation alone does not justify a trade.':
   'Not yet. '+(topic==='vwap'?'Use (200×$12 + 800×$12.50) ÷ (200+800) and check the units.':'Use |$40.40−$40.00| ÷ ($41.20−$39.60) × 100. The answer is a percent, not a dollar value.'));
 };
 const adjust=(name:'o'|'h'|'l'|'c',v:number)=>{
  if(name==='o')setO(v);if(name==='c')setC(v);
  if(name==='h')setH(Math.max(v,o,c));if(name==='l')setL(Math.min(v,o,c));
  if(name==='o'||name==='c'){setH(old=>Math.max(old,v));setL(old=>Math.min(old,v));}
  setFeedback('');
 };
 return <section className="cx-panel cx-learning">
  <div className="cx-panel-head"><div><div className="cx-overline">CROWNLIGHT LEARNING ENGINE / NINE STAGES</div><h3>{topic==='vwap'?'Understanding VWAP':'Build & Understand a Candlestick'}</h3></div><div className="cx-switch"><button aria-pressed={topic==='vwap'} onClick={()=>{setTopic('vwap');setAnswer('');setFeedback('')}}>VWAP</button><button aria-pressed={topic==='candle'} onClick={()=>{setTopic('candle');setAnswer('');setFeedback('')}}>Candles</button></div></div>
  <div className="cx-stepper" role="group" aria-label="Teaching stage">{teachingDisplay.map((x,i)=><button title={x==='Transfer Challenge'?'Transfer':x} key={x} aria-label={'Stage '+(i+1)+': '+x} aria-pressed={stage===i} onClick={()=>setStage(i)}>{i+1}</button>)}</div>
  <div className="cx-stage-name">STAGE {stage+1} / 10 · {['Learning objectives','First principles','I DO · Worked calculation','WE DO · Chart experiment','Predict with uncertainty','Replay and guided practice','Protected assessment preview','Review and corrective retry','Independent transfer task','Results and diagnostic review'][stage]}</div>
  <div className="cx-teaching-badge"><span>I DO / DEMONSTRATE</span><span>WE DO / INVESTIGATE</span><span>YOU DO / TRANSFER</span></div>
  <Talia topic={topic} step={authoritativeStage} bar={bar} stage={stage} onStage={setStage}/>
  {stage===4&&<section className="cx-predict-gate" aria-label="Prediction and uncertainty checkpoint"><div className="cx-overline">PAUSE · MAKE AN EVIDENCE-BASED DECISION</div><p>At the current fictional candle, what can we responsibly conclude before seeing the next bar?</p><div role="group" aria-label="Prediction evidence choices">{[['forecast','A rising candle guarantees the next candle rises'],['observe','The completed candle is evidence; the next price is unknown'],['certainty','VWAP or a wick proves where price must go']].map(([k,v])=><button key={k} aria-pressed={prediction===k} onClick={()=>{setPrediction(k);setPredictionFeedback('')}}>{v}</button>)}</div><button className="cx-predict-check" onClick={()=>setPredictionFeedback(!prediction?'Choose a conclusion before checking.':prediction==='observe'?'Correct. You distinguished an observed price bar from a future outcome. Identify what context would improve the decision.':'Not supported. Indicators and completed candles summarize past observations. They cannot establish the next bar as a certainty.')}>Check my reasoning</button><p role="status">{predictionFeedback}</p></section>}
  
  <div className="cx-practice-pair" aria-label="Side-by-side learning evidence and worked calculation"><TutorEvidenceDesk topic={topic} stage={stage} focus={focus} reveal={reveal} onFocus={setFocus} onStage={setStage}/>
  {topic==='candle'?<div className="cx-lesson-body"><CandleShape o={o} h={h} l={l} c={c}/><div className="cx-input-grid">{([['o','Open',o],['h','High',h],['l','Low',l],['c','Close',c]] as ['o'|'h'|'l'|'c',string,number][]).map(([id,label,value])=><label key={id}>{label}<input type="number" min="1" step=".1" value={value} onChange={e=>adjust(id,Number(e.target.value)||1)}/></label>)}</div><div className="cx-numeric"><span>Body <b>{dollars(Math.abs(c-o))}</b></span><span>Range <b>{dollars(h-l)}</b></span><span>Upper wick <b>{dollars(h-Math.max(o,c))}</b></span><span>Lower wick <b>{dollars(Math.min(o,c)-l)}</b></span></div><p className="cx-small">Selected replay candle: {bar.time} · O {dollars(bar.o)} · H {dollars(bar.h)} · L {dollars(bar.l)} · C {dollars(bar.c)}. Builder is an independent fictional example.</p></div>:<div className="cx-lesson-body"><div className="cx-overline">EXACT TRADE-PRINT VWAP · FICTIONAL TRANSACTIONS</div><div className="cx-trade-rows">{trades.map((t,i)=><div key={i} className="cx-trade"><label>Price <input type="number" min=".01" step=".5" value={t.price} onChange={e=>setTrades(v=>v.map((x,j)=>i===j?{...x,price:Math.max(.01,Number(e.target.value)||.01)}:x))}/></label><label>Shares <input type="number" min="1" step="50" value={t.volume} onChange={e=>setTrades(v=>v.map((x,j)=>i===j?{...x,volume:Math.max(1,Math.round(Number(e.target.value)||1))}:x))}/></label><strong>{dollars(t.price*t.volume)}</strong></div>)}</div><div className="cx-numeric"><span>Total traded value <b>{dollars(sumPV)}</b></span><span>Shares <b>{sumV.toLocaleString()}</b></span><span>VWAP <b>{dollars(trueVWAP)}</b></span></div><p className="cx-small">Formula: Σ(price × shares) ÷ Σ(shares). The chart overlay is a separate OHLCV approximation and is explicitly labeled as such.</p></div>}
  </div>
  {stage===8&&<div className="cx-transfer"><div className="cx-overline">TRANSFER TASK / FRESH FICTIONAL CASE</div><p>{topic==='vwap'?'200 shares at $12 and 800 shares at $12.50. Calculate the volume-weighted average price in dollars per share.':'O=$40.00, H=$41.20, L=$39.60, C=$40.40. Calculate the body as a percentage of full range.'}</p>
 <label>{topic==='vwap'?'New-case VWAP ($/share)':'New-case body / range (%)'}<input aria-label="Transfer answer" type="number" step=".01" value={transferAnswer} onChange={e=>setTransferAnswer(e.target.value)}/></label>
 <button onClick={checkTransfer} type="button">Check transfer reasoning</button><p role="status">{transferFeedback||'Use the new case, not the worked-example answer. The transfer check is ungraded.'}</p></div>}
  <div className="cx-check"><label>{topic==='vwap'?'Calculate the trade-print VWAP ($/share)':'Calculate the candle body ($/share)'}<input aria-label="Practice answer" type="number" step=".01" value={answer} onChange={e=>setAnswer(e.target.value)}/></label><button onClick={check}>Check ungraded answer</button><p role="status">{feedback||'Try the calculation. Explanations, retries and feedback are free within any accessible lesson.'}</p></div>
 </section>;
}
const engineProfile=(code:string)=>({FREE:'Basic v3.3 / v3.2 / Basic Talia',PICK_WHAT_YOU_WANT:'Basic, plus individually purchased upgrades',FOUNDING_14:'Basic v3.3 / v3.2 / Basic Talia',FOUNDING_30:'Advanced target (not released)',FOUNDING_60:'Professional target (not released)',FULL_MONTHLY:'Professional target (not released)',FULL_ANNUAL:'Requires separately reconciled terms',LIFETIME:'Enterprise target (not released)',ONDEMAND_MONTHLY:'Based on verified purchased product'} as Record<string,string>)[code]||'Not assigned';
const featureRows=[
 ['First-principles lesson','Identical instruction quality whenever accessible'],
 ['Guided explanations and retry','Available within any accessible Lab'],
 ['Core chart preview','Independently controlled by Chart Studio entitlement'],
 ['Drawing tools','Advanced tool-preview scenario'],
 ['Synchronized charts','Professional tool-preview scenario'],
 ['Historical replay','Separate product or membership entitlement'],
 ['Founders Commons','All active Founding 14/30/60 members'],
 ['Design/governance voting','Exclusive qualifying Founding 60-Day benefit'],
 ['Saved workspace','Requires account permissions and storage policy']
];
function Access({plan,studio}:{plan:Plan;studio:Studio}){
 const profile=membershipExperiences[plan.code]||membershipExperiences.FREE;
 const features=[true,true,true,studio!=='Standard',studio==='Professional',plan.founder||plan.code==='ONDEMAND_MONTHLY'||plan.code==='FULL_MONTHLY'||plan.code==='FULL_ANNUAL'||plan.code==='LIFETIME',plan.commons,plan.code==='FOUNDING_60',studio!=='Standard'];
 return <section className="cx-panel"><div className="cx-panel-head"><h3>{profile.name} · Capabilities</h3><span className="cx-chip">PREVIEW ONLY</span></div><div className="cx-profile-brief"><div className="cx-overline">DESIGNED FOR THIS MEMBER · {engineProfile(plan.code)}</div>{profile.tools.map(t=><span key={t}>{t}</span>)}</div><p className="cx-small">Membership design and Chart Studio level are independent selectors. Icons below are illustrative UI scenarios, not verified product entitlements.</p>{featureRows.map(([name,desc],i)=><div className="cx-access-row" key={name}><span className={features[i]?'cx-yes':'cx-maybe'}>{features[i]?'●':'◇'}</span><div><strong>{name}</strong><small>{desc}</small></div><span>{features[i]?'Demo':'Conditional'}</span></div>)}</section>
}
function Workstation({plan,studio,design,topic,setTopic,stage,setStage,reveal,setReveal,volume,setVolume,ema,setEma,proxy,setProxy,focus,setFocus}:{plan:Plan;studio:Studio;design:Design;topic:Topic;setTopic:(t:Topic)=>void;stage:number;setStage:(v:number)=>void;reveal:number;setReveal:(v:number)=>void;volume:boolean;setVolume:(v:boolean)=>void;ema:boolean;setEma:(v:boolean)=>void;proxy:boolean;setProxy:(v:boolean)=>void;focus:number;setFocus:(v:number)=>void}){
 const bar=series[Math.min(focus,reveal-1)]||series[0];
 const timeframe=React.useContext(ChartAppearanceContext)?.style.timeframe||1;
 const [playing,setPlaying]=useState(false),[phase,setPhase]=useState(0),[speed,setSpeed]=useState(1),[simulationInfo,setSimulationInfo]=useState(false);
 useEffect(()=>{if(!playing)return;if(reveal>=series.length){setPlaying(false);return}
  const id=window.setTimeout(()=>{if(phase>=3){setReveal(reveal+1);setPhase(0)}else setPhase(phase+1)},Math.round(650/speed));
  return()=>window.clearTimeout(id);
 },[playing,phase,reveal,speed,setReveal]);
 const forming:Bar|null=phase>0&&reveal<series.length?(()=>{
  const next=series[reveal],path=[next.o,next.h,next.l,next.c];
  const visited=path.slice(0,phase+1),last=visited[visited.length-1];
  return {...next,time:next.time+' · FORMING',o:next.o,h:Math.max(...visited),l:Math.min(...visited),c:last,v:phase*280};
 })():null;
 const [panels,setPanels]=useState(['primary','analysis']);
 const profile=membershipExperiences[plan.code]||membershipExperiences.FREE;
 const ordered:Record<Design,string[]>={quantum:['primary','analysis','learning'],neon:['analysis','primary','learning'],green:['primary','learning','analysis'],ember:['learning','primary','analysis'],aurora:['learning','analysis','primary'],onyx:['analysis','learning','primary']};
 useEffect(()=>{const route=profile.route;setPanels(studio==='Standard'||route==='foundation'||route==='academy'?['primary']:route==='ownership'?['analysis','primary']:['primary','analysis'])},[design,plan.code,studio]);
 const swap=(i:number,dir:number)=>setPanels(current=>{const arr=[...current],j=i+dir;if(j<0||j>=arr.length)return current;[arr[i],arr[j]]=[arr[j],arr[i]];return arr});
 const content:Record<string,React.ReactNode>={
 primary:<section className="cx-panel cx-chart-card cx-market-terminal"><div className="cx-terminal-bar"><div><span className="cx-terminal-marketmark">C</span><span><b>CROWNLIGHT · SIM-01</b><small>FICTIONAL INTRADAY EQUITY · {timeframe} MIN · DEMO</small></span></div><div className="cx-terminal-price"><b>{dollars(series[reveal-1].c)}</b><span className={series[reveal-1].c>=series[0].o?'positive':'negative'}>{series[reveal-1].c>=series[0].o?'+':''}{(series[reveal-1].c-series[0].o).toFixed(2)} / SESSION</span></div><button className="cx-terminal-status cx-simulation-status" type="button" aria-label="Simulation source status" aria-expanded={simulationInfo} onClick={()=>setSimulationInfo(v=>!v)}>● {playing?'PLAYING':'PAUSED'} · SIMULATION / OFFLINE</button></div>{simulationInfo&&<p className="cx-simulation-detail" role="status">LOCAL SIM-01 · Deterministic fictional OHLCV fixture · no market-data connection, no orders, no grading. Playback animates a synthetic intrabar path, not actual transaction prints.</p>}<div className="cx-panel-head"><div><div className="cx-overline">MARKET STRUCTURE / CHART WORKSPACE</div><h3>Professional candle & volume analysis</h3></div><span className="cx-chip">{bar.time} · {dollars(bar.c)}</span></div><div className="cx-tool-row"><button aria-pressed={volume} onClick={()=>setVolume(!volume)}>Volume</button><button aria-pressed={ema} onClick={()=>setEma(!ema)}>EMA 9 / 20</button><button aria-pressed={proxy} onClick={()=>setProxy(!proxy)}>OHLCV VWAP proxy</button><button onClick={()=>setReveal(96)}>Full series</button></div><HomeMarketEmbed context="lab"/><div className="cx-chart-foot">One candle starts the homepage-format replay. A separate lesson case tracks {reveal} practice bars; no future observations are used for grading.</div>
 <div className="cx-simulation-controls" aria-label="Separate lesson-case playback (not linked to the shared market chart)"><button aria-label="Play fictional candle formation" onClick={()=>setPlaying(v=>!v)} disabled={reveal>=series.length}>{playing?'Pause intrabar animation':'Play intrabar animation'}</button>
 <label>Playback speed<select aria-label="Intrabar speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
 <button onClick={()=>{setPlaying(false);setPhase(0)}}>Stop playback</button></div><div className="cx-replay"><button onClick={()=>{setPlaying(false);setPhase(0);setReveal(Math.max(1,reveal-1))}}>− Previous</button><input type="range" aria-label="Reveal fictional candles" min="1" max="96" value={reveal} onChange={e=>{setPlaying(false);setPhase(0);setReveal(Number(e.target.value))}}/><span>{reveal}/96</span><button onClick={()=>{setPlaying(false);setPhase(0);setReveal(Math.min(96,reveal+1))}}>Next +</button></div></section>,
 analysis:<section className="cx-panel cx-analysis-suite"><div className="cx-panel-head"><div><div className="cx-overline">MEMBERSHIP-RESPONSIVE ANALYTICAL ENVIRONMENT</div><h3>{studio==='Professional'?'Professional synchronized analysis':'Advanced analytical studies'}</h3></div><span className="cx-chip">{studio.toUpperCase()} / TOOL PREVIEW</span></div>
 {studio==='Professional'&&<div className="cx-pro-sync"><div className="cx-pro-charthead"><span>LINKED CHART 02 / VWAP REFERENCE</span><span>SHARED TIME AXIS · DRAG / WHEEL SYNC</span></div><EChart kind="price" reveal={reveal} showVolume={false} showEma={false} showProxy={true} focusBar={focus} onSelect={setFocus} design={design} height={345} syncGroup="cl-professional-sync-a" chartRole="reference"/><p className="cx-small">Live linked-viewport demonstration using two ECharts instances and the same completed fictional bars. This is not a live-feed claim.</p></div>}
 <div className="cx-double-chart"><div><div className="cx-overline">FICTIONAL MARKET STRUCTURE · INTENSITY MAP</div><EChart kind="heat" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={205}/></div>{studio==='Professional'&&<div><div className="cx-overline">FICTIONAL PRACTICE PERFORMANCE</div><EChart kind="equity" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={205}/></div>}</div><p className="cx-small">Research and performance visuals are training fixtures, not real fills or measurements.</p></section>,
 learning:<Lesson topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} bar={bar} setBar={()=>{}} focus={focus} reveal={reveal} setFocus={setFocus}/>
 };
 return <div className={'cx-workgrid cx-workgrid-'+profile.route}><div className="cx-maincolumn"><div className="cx-kpis"><div><span>LAST REVEALED CLOSE</span><b>{dollars(series[reveal-1].c)}</b></div><div><span>VISIBLE BARS</span><b>{reveal}</b></div><div><span>OHLCV PROXY</span><b>{dollars(series[reveal-1].proxy)}</b></div><div><span>PREVIEW PRESET</span><b>{plan.preset}</b></div></div>{panels.map((key,i)=><div key={key} className="cx-reorderable" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from))setPanels(a=>{const b=[...a],moving=b.splice(from,1)[0];b.splice(i,0,moving);return b})}}><div className="cx-reorder-tools"><span draggable title="Drag only this handle to move the panel; keyboard users can use arrows" onDragStart={e=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(i))}}>MOVE PANEL {i+1} · DRAG HANDLE</span><button disabled={i===0} onClick={()=>swap(i,-1)}>↑</button><button disabled={i===panels.length-1} onClick={()=>swap(i,1)}>↓</button></div>{content[key]}</div>)}</div><aside className="cx-right"><Lesson topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} bar={bar} setBar={()=>{}} focus={focus} reveal={reveal} setFocus={setFocus}/><Access plan={plan} studio={studio}/><section className="cx-panel"><div className="cx-panel-head"><h3>Replay candle inspector</h3><span className="cx-chip">BAR {Math.min(focus+1,reveal)}</span></div>{[['Open',bar.o],['High',bar.h],['Low',bar.l],['Close',bar.c],['Full range',bar.h-bar.l],['Real body',Math.abs(bar.c-bar.o)],['Upper wick',bar.h-Math.max(bar.o,bar.c)],['Lower wick',Math.min(bar.o,bar.c)-bar.l]].map(([name,value])=><div className="cx-data-row" key={name}><span>{name}</span><b>{dollars(Number(value))}</b></div>)}<div className="cx-small">A candle identifies the range of completed prices; it does not reveal the sequence of trades inside the bar.</div></section>{profile.route!=='foundation'&&<section className="cx-panel"><h3>Competency intelligence</h3><EChart kind="radar" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={220}/><p className="cx-small">Illustrative learning measures; not real member progress.</p></section>}</aside></div>;
}
function Flagships(props:Parameters<typeof Workstation>[0]){
 const [which,setWhich]=useState<'quantum'|'aurora'|'green'>('quantum');
 useEffect(()=>{const route=membershipExperiences[props.plan.code]?.route;setWhich(route==='foundation'||route==='academy'||route==='workshop'?'aurora':route==='replay'?'green':'quantum')},[props.plan.code]);
 const [dimension,setDimension]=useState<'chart'|'lesson'>('chart');
 const d=which==='quantum'?'quantum':which==='aurora'?'aurora':'green';
 const chart=<HomeMarketEmbed context="lab"/>;
 const lesson=<Lesson topic={props.topic} setTopic={props.setTopic} stage={props.stage} setStage={props.setStage} bar={series[Math.min(props.focus,props.reveal-1)]} setBar={()=>{}} focus={props.focus} reveal={props.reveal} setFocus={props.setFocus}/>;
 return <section className={'cx-flagship cx-flagship-'+which+' cx-theme-'+which}><div className="cx-flagship-tabs">{([['quantum','01 / Quantum Command'],['aurora','02 / Aurora Learning'],['green','03 / Green / Black Terminal']] as const).map(([k,t])=><button key={k} aria-pressed={k===which} onClick={()=>setWhich(k)}>{t}</button>)}</div><div className="cx-flagship-intro"><div><span className="cx-overline">{which.toUpperCase()} / FLAGSHIP DESIGN SYSTEM</span><h2>{which==='quantum'?'The analytical edge.':which==='aurora'?'Make the market understandable.':'Signal. Structure. Discipline.'}</h2><p>{which==='quantum'?'A high-density multichart cockpit with data-linked research and replay.':which==='aurora'?'A guided education environment where explanations, calculations and chart evidence are always connected.':'A high-contrast operational workstation for focused chart and replay work.'}</p></div><span className="cx-chip">{props.plan.label} · {props.studio} tool preview</span></div>{which==='quantum'?<div className="cx-flagship-quantum"><div className="cx-panel"><div className="cx-panel-head"><h3>Price / participation</h3><span className="cx-chip">SIMULATED</span></div>{chart}</div><div className="cx-panel"><h3>{props.studio==='Professional'?'Synchronized VWAP reference':'Scenario heatmap'}</h3>{props.studio==='Professional'&&<EChart kind="price" reveal={props.reveal} showVolume={false} showEma={false} showProxy={true} focusBar={props.focus} onSelect={props.setFocus} design={d} height={285} syncGroup="cl-professional-sync-b" chartRole="reference"/>}<EChart kind="heat" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={270}/><h3>Practice performance</h3><EChart kind="equity" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={170}/></div></div>:which==='aurora'?<div className="cx-flagship-aurora"><div>{lesson}</div><div className="cx-panel"><div className="cx-panel-head"><h3>Chart evidence in context</h3><span className="cx-chip">TEACHING OVERLAY</span></div>{chart}<div className="cx-overline">GUIDED OBSERVATION</div><p>Use the chart to identify a completed candle, then explain the applicable calculation. The OHLCV approximation is never a substitute for trade-print VWAP.</p></div></div>:<div className="cx-flagship-green"><div className="cx-green-ticker"><span>SIM-01 / FICTITIOUS</span><span>{dollars(series[props.reveal-1].c)}</span><span>VOLUME {series[props.reveal-1].v.toLocaleString()}</span><span>NO LIVE ORDERS</span></div><div className="cx-panel cx-black-chart">{chart}<div className="cx-replay"><button onClick={()=>props.setReveal(Math.max(1,props.reveal-1))}>BACK</button><input type="range" min="1" max="96" aria-label="Visible replay bars" value={props.reveal} onChange={e=>props.setReveal(Number(e.target.value))}/><button onClick={()=>props.setReveal(Math.min(96,props.reveal+1))}>FORWARD</button></div></div><div className="cx-green-side"><section className="cx-panel"><h3>Indicator stack</h3><div className="cx-tool-row"><button aria-pressed={props.ema} onClick={()=>props.setEma(!props.ema)}>EMA 9/20</button><button aria-pressed={props.proxy} onClick={()=>props.setProxy(!props.proxy)}>Proxy VWAP</button><button aria-pressed={props.volume} onClick={()=>props.setVolume(!props.volume)}>Volume</button></div><EChart kind="volume" reveal={props.reveal} showVolume={props.volume} showEma={props.ema} showProxy={props.proxy} focusBar={props.focus} design={d} height={230}/></section><section className="cx-panel">{lesson}</section></div></div>}<div className="cx-flagship-bottom"><button aria-pressed={dimension==='chart'} onClick={()=>setDimension('chart')}>Chart diagnostics</button><button aria-pressed={dimension==='lesson'} onClick={()=>setDimension('lesson')}>Instructor view</button><span>{dimension==='chart'?'Visible candles '+props.reveal+'/96 · no future data':'Nine-stage teaching engine · identical instructional quality'}</span></div></section>;
}
function ComparisonExperience({plan,setTopic,setStage,setReveal,reveal}:{plan:Plan;setTopic:(t:Topic)=>void;setStage:(n:number)=>void;setReveal:(n:number)=>void;reveal:number}){
 const m=membershipExperiences[plan.code]||membershipExperiences.FREE;
 const [active,setActive]=useState(0),[note,setNote]=useState('');
 useEffect(()=>{setActive(0);setNote('')},[plan.code]);
 const act=()=>{if(active===0){setTopic(m.defaultTopic);setStage(2);setNote('Opened the plan-specific teaching mode and its worked example.')}else if(active===1){setTopic('vwap');setStage(3);setNote('Opened guided chart interpretation and the evidence pause.')}else{setReveal(Math.min(96,reveal+1));setNote('Revealed one additional completed fictional candle, without preloading a future bar.')}};
 return <section className={'cx-compare-experience cx-member-'+m.route} style={{'--cx-member-accent':m.accent} as React.CSSProperties}><div className="cx-overline">{m.eyebrow}</div><div className="cx-compare-emblem">{m.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><h3>{m.headline}</h3><p>{m.value}</p><div className="cx-compare-tiles">{m.workspaces.map((w,i)=><button key={w} aria-pressed={active===i} onClick={()=>{setActive(i);setNote('')}}>{w}</button>)}</div><div className="cx-compare-action"><strong>{m.tools[active]}</strong><p>{m.suggestions[active]}</p><button onClick={act}>{active===2?'Reveal next completed bar':'Open learning workflow'}</button><p role="status">{note}</p></div></section>;
}
function Compare({design,studio,topic,setTopic,stage,setStage,reveal,setReveal,volume,ema,proxy,focus,setFocus}:{design:Design;studio:Studio;topic:Topic;setTopic:(v:Topic)=>void;stage:number;setStage:(v:number)=>void;reveal:number;setReveal:(v:number)=>void;volume:boolean;ema:boolean;proxy:boolean;focus:number;setFocus:(v:number)=>void}){
 const [left,setLeft]=useState('FREE'),[right,setRight]=useState('FOUNDING_60');
 const a=plans.find(x=>x.code===left)||plans[0],b=plans.find(x=>x.code===right)||plans[3];
 const selector=(value:string,set:(v:string)=>void)=><select aria-label="Comparison membership" value={value} onChange={e=>set(e.target.value)}>{plans.map(x=><option key={x.code} value={x.code}>{x.label}</option>)}</select>;
 return <div className="cx-comparison"><div className="cx-compare-head"><div><div className="cx-overline">PRODUCT DESIGN / NINE SOURCE-GROUNDED MEMBERSHIP IDENTITIES</div><h2>Compare member experiences. Not just prices.</h2><p>Membership preview affects the proposed classroom presentation. Chart Studio tier remains a separate hypothetical entitlement. No checkout, account, grade or subscription changes occur.</p></div><span className="cx-chip">SIDE-BY-SIDE INSPECTION</span></div><div className="cx-compare-cols">{[a,b].map((p,i)=><section key={i} className="cx-compare-col"><div className="cx-compare-top"><div className="cx-overline">PREVIEW {i===0?'A':'B'}</div>{selector(i===0?left:right,i===0?setLeft:setRight)}<h3>{p.preset}</h3><p>{p.description}</p><span className="cx-chip">{p.commons?'Founders Commons: benefit documented':'Founders Commons: not asserted'}</span></div><ComparisonExperience plan={p} setTopic={setTopic} setStage={setStage} setReveal={setReveal} reveal={reveal}/><div className="cx-panel"><div className="cx-panel-head"><h3>{topic==='vwap'?'VWAP evidence':'Candlestick evidence'}</h3><span className="cx-chip">FICTIONAL</span></div><EChart kind="price" reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} onSelect={setFocus} design={design} height={255}/></div><div className="cx-panel"><h3>Learning access quality</h3><Talia topic={topic} step={stage<3?stage:stage-1}/><p className="cx-small">The same complete first-principles instruction, guided examples, free explanations, diagnostics, independent assessment protection and retries are used whenever the lesson is accessible.</p></div><Access plan={p} studio={studio}/></section>)}</div><section className="cx-panel"><div className="cx-panel-head"><h3>Illustrative capability scenario matrix</h3><span className="cx-chip">NOT AUTHORIZATION DATA</span></div><div className="cx-matrix"><div>Capability</div><div>{a.label}</div><div>{b.label}</div>{featureRows.map(([title,desc],i)=><React.Fragment key={title}><div><strong>{title}</strong><small>{desc}</small></div><div>{i<2?'Equal quality':i===6?(a.commons?'Documented benefit':'Not asserted'):i===7?(a.code==='FOUNDING_60'?'Restricted Founder right':'Not included'):'Depends on entitlement'}</div><div>{i<2?'Equal quality':i===6?(b.commons?'Documented benefit':'Not asserted'):i===7?(b.code==='FOUNDING_60'?'Restricted Founder right':'Not included'):'Depends on entitlement'}</div></React.Fragment>)}</div></section><div className="cx-panel"><div className="cx-overline">DECISION SUPPORT</div><p>The comparison documents visual differences without making unverified claims about currently purchasable plans or entitlements. Actual access must come from the authoritative server-side product catalog and permission checks.</p></div></div>;
}

type AtlasTab='labs'|'academy'|'guides'|'computed';
type AtlasRecord={key:string;title:string;category:string;detail:string;formula?:string;limitations?:string;mistake?:string;sources?:string[];status?:string};
type AtlasState={labs:AtlasRecord[];academy:AtlasRecord[];guides:AtlasRecord[];computed:AtlasRecord[];errors:string[]};
const atlasLabels:{id:AtlasTab;label:string}[]=[{id:'labs',label:'419 Labs'},{id:'academy',label:'Boot Camp days'},{id:'guides',label:'73 indicator guides'},{id:'computed',label:'16 chart studies'}];
const atlasStageNames=['Start','Learn','Calculate','Experiment','Predict','Replay / Practice','Assess','Review & Retry','Transfer Challenge','Results'];
function AtlasCoverage({counts}:{counts:{labs:number;academy:number;guides:number;computed:number}}){
 const ref=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{let running=true,chart:any;const el=ref.current;if(!el)return;
 (async()=>{try{const engine=await (window as ChartWindow).CrownlightECharts?.load();if(!running||!engine||!el)return;
 chart=engine.init(el,undefined,{renderer:'canvas'});
 chart.setOption({backgroundColor:'transparent',animationDuration:350,grid:{left:105,right:43,top:8,bottom:15},xAxis:{type:'value',min:0,axisLabel:{color:'#b0cad8'},splitLine:{lineStyle:{color:'#284453',opacity:.55}}},yAxis:{type:'category',inverse:true,data:['Learning Labs','Academy days','Indicator guides','Chart studies'],axisTick:{show:false},axisLine:{show:false},axisLabel:{color:'#d2e8f1',fontSize:11}},series:[{type:'bar',data:[counts.labs,counts.academy,counts.guides,counts.computed].map((n,i)=>({value:n,itemStyle:{color:{type:'linear',x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:['#156985','#125a83','#5153a1','#94743b'][i]},{offset:1,color:['#66e6d0','#8abefe','#c6b1ff','#ffdc88'][i]}]},borderRadius:[0,6,6,0]}})),barWidth:17,label:{show:true,position:'right',color:'#f4fcff',fontSize:12,fontWeight:700}}]});
 const resize=()=>chart?.resize();window.addEventListener('resize',resize);(chart as any).__atlasResize=resize;
 }catch{ /* Source counts remain available as text when graphics are unavailable. */ }})();
 return()=>{running=false;if(chart){window.removeEventListener('resize',(chart as any).__atlasResize);chart.dispose()}}
 },[counts.labs,counts.academy,counts.guides,counts.computed]);
 return <div className="cx-atlas-coverage" ref={ref} role="img" aria-label={'Source record counts: '+counts.labs+' Labs, '+counts.academy+' Academy study days, '+counts.guides+' indicator guides and '+counts.computed+' computed chart studies'}/>;
}
function CurriculumAtlas(){
 const [state,setState]=useState<AtlasState>({labs:[],academy:[],guides:[],computed:[],errors:[]});
 const [tab,setTab]=useState<AtlasTab>('labs'),[search,setSearch]=useState(''),[selected,setSelected]=useState(''),[limit,setLimit]=useState(24),[loading,setLoading]=useState(true);
 useEffect(()=>{let alive=true;const load=async(url:string)=>{const response=await fetch(url,{cache:'no-store',credentials:'same-origin',headers:{accept:'application/json'}});if(!response.ok)throw Error('HTTP '+response.status);return response.json()};
 (async()=>{
  const results=await Promise.allSettled([load('/data/competency-lab-paths-v01499.json'),load('/data/tutor-indicator-study-v1.json'),load('/data/tutor-indicator-expansion-v1.json'),load('/api/bootcamp-academy?action=catalog')]);
  if(!alive)return;const errors:string[]=[];const get=(i:number):any=>{const result=results[i];if(result.status==='fulfilled')return result.value;errors.push(['Lab registry','Indicator registry','Indicator expansion','Academy catalog'][i]+' unavailable');return null};
  const labs=get(0),base=get(1),extension=get(2),academy=get(3);
  const labRows:AtlasRecord[]=labs?.totalCanonicalLabs===419&&labs?.byLab&&Object.keys(labs.byLab).length===419?Object.entries(labs.byLab).map(([key,v])=>{const r=v as any;return {key,title:r.title||key,category:r.bookCode||'Foundations',detail:'Canonical Lab ID '+key+' · '+(r.relatedCompetencies||[]).join(', '),status:'Mapped curriculum record · individual grading and historical evidence not certified'}}):[];
  if(labs&&!labRows.length)errors.push('Lab registry count mismatch');
  const original=base?.count===61&&base.guides?.length===61?base.guides:[],newGuides=extension?.count===12&&extension.guides?.length===12?extension.guides:[];
  const guideRows:AtlasRecord[]=[...original,...newGuides].map((r:any)=>({key:r.code,title:r.title,category:r.family||'Indicator',detail:r.concept||'No concept recorded',formula:r.formula,limitations:r.limit||r.limits,mistake:r.commonError,sources:Array.isArray(r.sourceUrls)?r.sourceUrls.filter((x:unknown)=>typeof x==='string'&&/^https:\/\//.test(x as string)):[],status:newGuides.some((x:any)=>x.code===r.code)?'NEW 12 · independent editorial approval pending':'Original authored guide · independent numerical acceptance separate'}));
  if(base&&original.length!==61)errors.push('Original indicator registry count mismatch');
  if(extension&&newGuides.length!==12)errors.push('Extension guide registry count mismatch');
  const academyRows:AtlasRecord[]=academy?.ok===true&&Array.isArray(academy.programs)?academy.programs.filter((r:any)=>Number.isInteger(Number(r.days))&&Number(r.days)>0).map((r:any)=>({key:r.code,title:r.name||r.title||r.code,category:r.code,detail:String(r.days)+' study days · '+(r.description||r.summary||'Catalog metadata'),status:'Published program metadata; individual study-day approval requires separate review'})):[];
  if(academy&&!academyRows.length)errors.push('Academy source catalog not verified');
  const studyRows:AtlasRecord[]=specs.map(r=>({key:r.id,title:r.label,category:r.family,detail:'Original ECharts calculated preview, synthetic completed bars only',status:'Implementation exists · independent numerical/editorial acceptance separate'}));
  if(studyRows.length!==16)errors.push('Calculated study count mismatch');
  setState({labs:labRows,academy:academyRows,guides:guideRows,computed:studyRows,errors});setLoading(false);
 })();return()=>{alive=false}},[]);
 const rows=state[tab],matching=useMemo(()=>rows.filter(r=>(r.key+' '+r.title+' '+r.category+' '+r.detail).toLowerCase().includes(search.toLowerCase().trim())),[rows,search]);
 const current=matching.find(r=>r.key===selected)||matching[0];
 const counts={labs:state.labs.length,academy:state.academy.reduce((sum,r)=>sum+Number.parseInt(r.detail,10),0),guides:state.guides.length,computed:state.computed.length};
 return <section className="cx-curriculum-atlas" aria-label="Live source curriculum navigator">
   <header><div><span className="cx-overline">CURRENT CANONICAL SOURCE / NO PRIVATE ANSWER KEYS</span><h2>Curriculum Intelligence Console</h2><p>Inspect the actual website's published Lab, Academy and indicator metadata. These records feed the same learning architecture; this preview does not create another lesson or grading engine.</p></div><span className="cx-chip">SOURCE-VERIFIED / READ-ONLY</span></header>
   <div className="cx-atlas-dashboard"><div className="cx-atlas-stat-grid">{[["LAB IDENTITIES",counts.labs],["ACADEMY STUDY DAYS",counts.academy],["INDICATOR GUIDES",counts.guides],["CALCULATED STUDIES",counts.computed]].map(([name,n])=><div className="cx-atlas-stat" key={name}><span>{name}</span><strong>{loading?'…':n||'—'}</strong></div>)}</div><AtlasCoverage counts={counts}/></div>
   <div className="cx-atlas-stages" aria-label="Ten visible learning steps">{atlasStageNames.map((x,i)=><span key={x}><b>{String(i+1).padStart(2,'0')}</b>{x}</span>)}</div>
   <div className="cx-atlas-controls"><nav aria-label="Curriculum source categories">{atlasLabels.map(t=><button key={t.id} aria-pressed={tab===t.id} onClick={()=>{setTab(t.id);setSelected('');setSearch('');setLimit(24)}}>{t.label}</button>)}</nav><label>Search current course and indicator source<input type="search" value={search} onChange={e=>{setSearch(e.target.value);setLimit(24);setSelected('')}} placeholder="VWAP, EMA, historical replay, ticker…"/></label></div>
   {state.errors.length>0&&<p role="status" className="cx-atlas-warning">Source access or counts are incomplete: {state.errors.join('; ')}. Unavailable metadata is not counted as accepted or published.</p>}
   {loading?<p role="status" className="cx-atlas-warning">Loading canonical sources…</p>:<div className="cx-atlas-columns"><div className="cx-atlas-list" aria-label="Available source records"><p role="status">{matching.length} matching records · showing {Math.min(limit,matching.length)}</p>{matching.slice(0,limit).map(r=><button key={r.key} onClick={()=>setSelected(r.key)} aria-pressed={current?.key===r.key}><span>{r.category}</span><strong>{r.title}</strong><small>{r.key}</small></button>)}{matching.length>limit&&<button className="cx-atlas-more" onClick={()=>setLimit(n=>n+24)}>Show next records</button>}</div>
     <article className="cx-atlas-inspector">{current?<><span className="cx-overline">{current.category} / {current.key}</span><h3>{current.title}</h3><p>{current.detail}</p>{current.formula&&<div className="cx-atlas-explainer"><b>FORMULA AND DEFINED INPUTS</b><p>{current.formula}</p></div>}{current.mistake&&<div className="cx-atlas-explainer"><b>COMMON TRADING MISTAKE</b><p>{current.mistake}</p></div>}{current.limitations&&<div className="cx-atlas-explainer"><b>LIMITS / INVALIDATION</b><p>{current.limitations}</p></div>}<p className="cx-atlas-evidence">{current.status}</p>{current.sources?.length?<details><summary>Original research references ({current.sources.length})</summary><ul>{current.sources.slice(0,6).map(url=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details>:null}</>:<p>No matching source records. Select another category or search term.</p>}</article>
    </div>}
    <footer>Actual member entitlements, progress, independent assessment, historical data provenance and source licensing remain governed by their existing authenticated services. STT transcript research is excluded from this public-source preview.</footer>
 </section>;
}


type ClassroomLayoutCode='foundations'|'indicator'|'replay'|'tape'|'scanner'|'risk'|'filings'|'academy';
type ClassroomLayout={id:ClassroomLayoutCode;title:string;track:string;purpose:string;codes:string[];visual:ChartKind;topic:Topic;first:string;second:string;third:string;accent:string};
const classroomLayouts:ClassroomLayout[]=[
 {id:'foundations',title:'Foundations Classroom',track:'FREE FOUNDATIONS / TRUTH5 / FOUNDATIONS30',purpose:'Learn the language, work the OHLC math, identify a misconception, then independently explain a candle.',codes:['free5','truth5','foundations30'],visual:'price',topic:'candle',first:'Read the candle',second:'Guided explanation',third:'Source & definition',accent:'#70d9bb'},
 {id:'indicator',title:'Indicator Analysis Lab',track:'CHARTS45 / INDICATORS10 / LABS',purpose:'Inspect price/volume, calculate a study with defined inputs, compare its limitations and retry on new fictional data.',codes:['charts45','indicators10'],visual:'price',topic:'vwap',first:'Interactive chart',second:'Indicator calculation',third:'Method & uncertainty',accent:'#85b2ff'},
 {id:'replay',title:'Historical Replay Practice',track:'PRACTICUM90 / LABS',purpose:'Reveal only the next completed fictional bar, record a hypothesis, and separate a genuine independent decision from hindsight.',codes:['practicum90','charts45'],visual:'price',topic:'candle',first:'Replay workstation',second:'Decision journal',third:'Outcome boundary',accent:'#ecc279'},
 {id:'tape',title:'Tape & Order-Flow Desk',track:'TAPE10 / MICROSTRUCTURE',purpose:'Separate observed trade prints from displayed bid and ask, compare timestamps and avoid claims about hidden trader intent.',codes:['tape10'],visual:'volume',topic:'vwap',first:'Quote/print timeline',second:'Spread arithmetic',third:'Liquidity caveats',accent:'#bda7ff'},
 {id:'scanner',title:'Scanner + Watchlist Workshop',track:'SCANNERS10 / WATCHLIST7',purpose:'Adjust transparent research thresholds, explain what a scan cannot prove, and document why a candidate warrants research or no trade.',codes:['scanners10','watchlist7'],visual:'heat',topic:'candle',first:'Candidate matrix',second:'Filter controls',third:'Research decision',accent:'#68dec8'},
 {id:'risk',title:'Risk & Execution Desk',track:'RISK60 / PRACTICUM90',purpose:'Calculate position limits from an illustrative risk budget and stop distance while identifying slippage, liquidity, and execution uncertainty.',codes:['risk60','practicum90'],visual:'equity',topic:'candle',first:'Risk calculator',second:'Execution constraints',third:'Process review',accent:'#ffa6a8'},
 {id:'filings',title:'SEC Filings Research Room',track:'FILINGS7 / TRUTH5',purpose:'Review an issuer identity and filing chronology; distinguish an official disclosure from a promotional statement or a price forecast.',codes:['filings7','truth5'],visual:'radar',topic:'candle',first:'Document verification',second:'Source checklist',third:'Claims & caveats',accent:'#eccb88'},
 {id:'academy',title:'Boot Camp Mission Control',track:'ALL TEN ACADEMY PROGRAMS',purpose:'Choose the source-grounded daily training path, see the nine-stage learning progression, and keep official progress separate from this preview.',codes:['truth5','watchlist7','scanners10','foundations30','charts45','risk60','practicum90','tape10','indicators10','filings7'],visual:'radar',topic:'vwap',first:'Curriculum pathway',second:'Teaching itinerary',third:'Skill review',accent:'#a1c9ff'}
];
const layoutAcademyNames:Record<string,string>={
 free5:'Free Foundations / five lessons',truth5:'The Truth Behind the Ticker',watchlist7:'Build Your Own Stock Watchlist',scanners10:'Mastering Stock Scanners',
 foundations30:'The Complete Trading Foundations Boot Camp',charts45:'Chart Reading and Trading Setups',risk60:'Risk, Execution, and Trading Discipline',
 practicum90:'Advanced Simulated Trading Practicum',tape10:'Reading the Tape & Market Microstructure',indicators10:'VWAP, EMA & Technical Indicator Mastery',filings7:'SEC Filings, Catalysts & Corporate Actions'
};
const classroomCoaching:Partial<Record<ClassroomLayoutCode,{principle:string;method:string;mistake:string;transfer:string}>>={
 replay:{principle:'A replay decision must use only the completed bars visible when the decision was made.',method:'Record the observed structure, a clear invalidation condition and a defensible watch/no-trade alternative BEFORE revealing the next candle.',mistake:'Explaining a prior decision using a later price move is look-ahead bias.',transfer:'Repeat on another fictional sequence without viewing its unrevealed bars.'},
 tape:{principle:'A quote describes displayed interest; a trade print records an execution. They are different observations with timestamps and venue scope.',method:'Write the bid, ask, size, timestamp and print on separate lines. Calculate spread as ask minus bid. Compare only contemporaneous observations.',mistake:'A green or red time-and-sales print does not by itself prove an individual trader’s intent.',transfer:'Apply the same method to the second fictional quote and explain which routing facts remain unknown.'},
 scanner:{principle:'A scanner is a reproducible research filter, not an independently validated trading setup.',method:'Define the universe, market session, data provider, reference-volume window and thresholds. Reject missing or stale fields rather than assuming they are current.',mistake:'An impressive relative-volume number without a matched reference interval cannot establish a reliable signal.',transfer:'Change the threshold, explain the resulting pass/fail, and document a separate catalyst and liquidity check.'},
 risk:{principle:'Planned per-share risk for a long hypothesis is entry minus the predefined lower invalidation level. The distance must be positive.',method:'Convert prices to integer cents, divide the hypothetical cash risk budget by the stop distance and round DOWN to whole shares. Then compare additional buying-power, spread, liquidity and concentration constraints.',mistake:'A calculated stop-loss cap does not guarantee the execution price after a gap or halt.',transfer:'Change the hypothetical entry, stop and budget. Explain why the planned loss differs from stressed slippage.'},
 filings:{principle:'Issuer identity and primary disclosure chronology must be verified before interpreting a company claim.',method:'Identify the legal filer and CIK, original EDGAR accession, form, reporting period and publication/acceptance timestamps. Distinguish original text from commentary.',mistake:'Matching only a ticker or headline to a later price move treats correlation as causation.',transfer:'Review a second fictional issuer claim and state which identity and timing details are still missing.'},
 academy:{principle:'Boot Camp progress is a sequence of learning evidence; opening a source catalog does not prove mastery.',method:'Read the assigned day, work a numerical or evidence-based example, practice independently, evaluate reasoning without leaked keys and transfer to a fresh case.',mistake:'Treating finished page views, synthetic competency radar scores or reread lessons as actual independent assessment results.',transfer:'Select a different Academy track and explain the specific evidence its independent daily assessment would require.'}
};
function ClassroomLayoutGallery({design,reveal,setReveal,topic,setTopic,stage,setStage,focus,setFocus}:{
 design:Design;reveal:number;setReveal:(n:number)=>void;topic:Topic;setTopic:(t:Topic)=>void;stage:number;setStage:(n:number)=>void;focus:number;setFocus:(n:number)=>void}){
 const [selected,setSelected]=useState<ClassroomLayoutCode>(()=>{
  const q=new URLSearchParams(window.location.search).get('layout');
  return classroomLayouts.some(x=>x.id===q)?q as ClassroomLayoutCode:'foundations';
 });
 const [module,setModule]=useState('free5'),[scenario,setScenario]=useState(0),[riskBudget,setRiskBudget]=useState(75),[riskEntry,setRiskEntry]=useState(10),[riskStop,setRiskStop]=useState(9.7),[scannerVol,setScannerVol]=useState(2),[researchChecks,setResearchChecks]=useState<Record<string,boolean>>({});
 const [hypothesis,setHypothesis]=useState(''),[locked,setLocked]=useState(false);
 const layout=classroomLayouts.find(x=>x.id===selected)||classroomLayouts[0];
 const selectLayout=(id:ClassroomLayoutCode)=>{
  const target=classroomLayouts.find(x=>x.id===id);
  setSelected(id);setModule(target?.codes[0]||'free5');setTopic(target?.topic||'candle');setScenario(0);setLocked(false);setHypothesis('');
  setResearchChecks({});const next=new URL(window.location.href);next.searchParams.set('layout',id);window.history.replaceState(window.history.state,'',next.pathname+next.search+next.hash);
  window.requestAnimationFrame(()=>document.getElementById('cx-layout-preview')?.scrollIntoView({block:'start',behavior:'auto'}));
 };
 const inspected=series[Math.max(0,Math.min(focus,reveal-1))]||series[0];
 const bid=scenario?10.1:10,ask=scenario?10.14:10.06;
 const distance=riskEntry-riskStop;
 const stopCents=Math.round(riskEntry*100)-Math.round(riskStop*100);
 const shares=stopCents>0&&riskBudget>=0?Math.floor(Math.round(riskBudget*100)/stopCents):null;
 const rvol=scenario?2.8:1.6;
 const recordDecision=()=>{if(hypothesis.trim().length>=15)setLocked(true)};
 const flip=()=>setScenario(v=>v===0?1:0);
 const displayChart=<div className="cx-lp-card cx-lp-visual"><div className="cx-lp-cardhead"><span>{layout.first}</span><span className="cx-lp-status">FICTIONAL · NO LIVE FEED</span></div><HomeMarketEmbed key={selected} context={selected==='foundations'||selected==='indicator'?'lab':'bootcamp'}/><div className="cx-lp-chartnote">Source: synthetic completed bars / instructional analytics, not licensed price history or brokerage execution.</div></div>;
 const authoredCoach=classroomCoaching[selected];
 const lesson=<section className="cx-lp-card cx-lp-coach"><div className="cx-lp-cardhead"><span>Talia · Guided learning</span><span className="cx-lp-status">ORIGINAL UNGRADED INSTRUCTION</span></div>{selected==='foundations'||selected==='indicator'?<><div className="cx-lp-topic"><button aria-pressed={topic==='candle'} onClick={()=>setTopic('candle')}>Candlesticks</button><button aria-pressed={topic==='vwap'} onClick={()=>setTopic('vwap')}>VWAP</button></div><Talia topic={topic} step={Math.min(8,stage)} bar={inspected} stage={stage} onStage={setStage}/></>:<div className="cx-lp-guided-script"><span className="cx-overline">SOURCE-ALIGNED / NOT LIVE AI INFERENCE</span><h3>{atlasStageNames[stage]||'Learn'}</h3><strong>First principle</strong><p>{authoredCoach?.principle}</p><strong>How to work it</strong><p>{authoredCoach?.method}</p><strong>Common trading mistake</strong><p>{authoredCoach?.mistake}</p><strong>Independent transfer</strong><p>{authoredCoach?.transfer}</p><button onClick={()=>setStage(Math.min(9,stage+1))} disabled={stage>=9}>Next teaching step</button></div>}</section>;
 const mission=<section className="cx-lp-card cx-lp-mission"><div className="cx-lp-cardhead"><span>Today's source-linked mission</span><span className="cx-lp-status">NO GRADES WRITTEN</span></div><h3>{layout.title}</h3><p>{layout.purpose}</p><label>Preview the existing course track<select aria-label="Classroom source course" value={layout.codes.includes(module)?module:layout.codes[0]} onChange={e=>setModule(e.target.value)}>{layout.codes.map(code=><option key={code} value={code}>{layoutAcademyNames[code]} · {code}</option>)}</select></label><p className="cx-lp-caveat">Catalog mapping only. Enrollment, official lesson-day access and published progress remain on the existing Academy service.</p><a className="cx-lp-course-link" href={'/bootcamp-academy.html?program='+encodeURIComponent(layout.codes.includes(module)?module:layout.codes[0])}>Open the existing Academy course page</a></section>;
 const steps=<section className="cx-lp-card cx-lp-steps"><div className="cx-lp-cardhead"><span>Learning pathway</span><span className="cx-lp-status">10 DISPLAY STEPS / 9 SAVED STAGES</span></div><div className="cx-lp-stepsgrid">{atlasStageNames.map((s,i)=><button key={s} aria-pressed={stage===i} onClick={()=>setStage(i)}><b>{String(i+1).padStart(2,'0')}</b><span>{s}</span></button>)}</div><p>Changing the step previews teaching navigation only. Protected assessments and progress are never changed here.</p></section>;
 const sourcePanel=<section className="cx-lp-card cx-lp-evidence"><div className="cx-lp-cardhead"><span>{layout.third}</span><span className="cx-lp-status">SOURCE BOUNDARIES</span></div><dl><div><dt>Learning evidence</dt><dd>Completed fictional OHLCV only</dd></div><div><dt>Research standard</dt><dd>Defined inputs, timestamps, seed and uncertainty</dd></div><div><dt>Editorial acceptance</dt><dd>Independent review required per subject and day</dd></div><div><dt>Member records</dt><dd>Protected existing Supabase/Academy services</dd></div></dl><p className="cx-lp-caveat">The 73 study guides are research briefs; only 16 studies are calculated in this prototype. Reading a guide never awards mastery.</p></section>;
 const tools=<section className="cx-lp-card cx-lp-tools"><div className="cx-lp-cardhead"><span>{layout.second}</span><span className="cx-lp-status">INTERACTIVE TRAINING</span></div>
  {selected==='foundations'?<><p>Inspect the selected completed candle, including all four input prices and wick geometry.</p><div className="cx-lp-numbers">{[['Open',inspected.o],['High',inspected.h],['Low',inspected.l],['Close',inspected.c],['Real body',Math.abs(inspected.c-inspected.o)],['Full range',inspected.h-inspected.l]].map(([n,v])=><div key={n}><span>{n}</span><strong>{dollars(Number(v))}</strong></div>)}</div></>:null}
  {selected==='indicator'?<><p>OHLCV HLC3 VWAP is a bar-based proxy; it is not exact transaction-print VWAP.</p><div className="cx-lp-numbers"><div><span>HLC3 bar proxy</span><strong>{dollars((inspected.h+inspected.l+inspected.c)/3)}</strong></div><div><span>Visible proxy</span><strong>{dollars(inspected.proxy)}</strong></div><div><span>Completed volume</span><strong>{inspected.v.toLocaleString()}</strong></div></div><button onClick={()=>setTopic('vwap')}>Teach proxy versus trade VWAP</button></>:null}
  {selected==='replay'?<><label>Reveal completed fictional bars<input type="range" aria-label="Layout replay completed bars" min="1" max="96" value={reveal} onChange={e=>{setReveal(Number(e.target.value));setLocked(false)}}/></label><div className="cx-lp-inline"><button onClick={()=>{setReveal(Math.max(1,reveal-1));setLocked(false)}}>Previous</button><output>{reveal} / 96</output><button onClick={()=>{setReveal(Math.min(96,reveal+1));setLocked(false)}}>Reveal next bar</button></div><label>Evidence-based hypothesis<textarea aria-label="Fictional replay hypothesis" value={hypothesis} onChange={e=>{setHypothesis(e.target.value);setLocked(false)}} maxLength={400} placeholder="Describe observed evidence and invalidation before the next candle."/></label><button disabled={hypothesis.trim().length<15} onClick={recordDecision}>Lock local practice decision</button><p role="status">{locked?'Local decision recorded for this preview only. No grade, member Journal or protected first-decision lock was written.':'No decision saved. Later unseen bars cannot be used to justify this observation.'}</p></>:null}
  {selected==='tape'?<><p>Quote and print fields are separate fictional observations; color does not prove aggressor identity.</p><div className="cx-lp-tape"><span>09:31:00 · BID <b>{dollars(bid)}</b></span><span>09:31:00 · ASK <b>{dollars(ask)}</b></span><span>09:31:02 · PRINT <b>{dollars(scenario?10.12:10.03)}</b></span></div><div className="cx-lp-numbers"><div><span>Bid–ask spread</span><strong>{dollars(ask-bid)}</strong></div><div><span>Quote midpoint</span><strong>{dollars((ask+bid)/2)}</strong></div></div><button onClick={flip}>Compare another quote case</button></>:null}
  {selected==='scanner'?<><p>Research filter is not a trade signal; the reference interval and feed scope must be defined.</p><label>Minimum fictional relative volume<input type="range" aria-label="Scanner relative volume minimum" min="1" max="4" step=".5" value={scannerVol} onChange={e=>setScannerVol(Number(e.target.value))}/></label><div className="cx-lp-numbers"><div><span>RVOL filter</span><strong>{scannerVol.toFixed(1)}×</strong></div><div><span>Example RVOL</span><strong>{rvol.toFixed(1)}×</strong></div></div><p role="status">{rvol>=scannerVol?'Passes numerical RVOL filter; catalyst, liquidity and timestamp still need verification.':'Does not pass the stated RVOL filter. No trade conclusion follows.'}</p><button onClick={flip}>Switch fictional candidate</button></>:null}
  {selected==='risk'?<><p>Fictional risk-distance example; positive long-side planned distance required. Fills, fees and slippage can exceed the planned loss.</p><div className="cx-lp-riskgrid"><label>Illustrative risk budget ($)<input type="number" min="0" max="100000" step="5" value={riskBudget} onChange={e=>setRiskBudget(Math.min(100000,Math.max(0,Number(e.target.value)||0)))}/></label><label>Entry ($)<input type="number" min=".01" step=".05" value={riskEntry} onChange={e=>setRiskEntry(Number(e.target.value))}/></label><label>Invalidation ($)<input type="number" min=".01" step=".05" value={riskStop} onChange={e=>setRiskStop(Number(e.target.value))}/></label></div><div className="cx-lp-numbers"><div><span>Long-side distance</span><strong>{distance>0?dollars(distance):'Invalid'}</strong></div><div><span>Theoretical whole-share cap</span><strong>{shares===null?'Invalid':shares}</strong></div></div><p role="status">This does not account for buying power, liquidity, gaps or brokerage restrictions.</p></>:null}
  {selected==='filings'?<><p>Research the real legal issuer and disclosure time before connecting a filing to a price move. No live SEC filing is loaded here.</p>{['Confirm legal issuer and CIK','Check original filing/accession','Record acceptance time and reporting period','Separate disclosed facts from claims'].map(item=><label className="cx-lp-check" key={item}><input type="checkbox" checked={!!researchChecks[item]} onChange={e=>setResearchChecks(v=>({...v,[item]:e.target.checked}))}/>{item}</label>)}<p role="status">{Object.values(researchChecks).filter(Boolean).length}/4 local research checklist steps marked; verification evidence not supplied.</p><a href="https://www.sec.gov/edgar/search/" target="_blank" rel="noopener noreferrer">SEC EDGAR source lookup</a></>:null}
  {selected==='academy'?<><p>Review all ten canonical Boot Camp code paths. Select a training track; this does not enroll anyone.</p><div className="cx-lp-pathlist">{layout.codes.map((code,i)=><button key={code} aria-pressed={module===code} onClick={()=>setModule(code)}><b>{String(i+1).padStart(2,'0')}</b><span>{layoutAcademyNames[code]}</span></button>)}</div><p>Fictional competency radar and teaching steps are illustrations, not actual member scores.</p></>:null}
 </section>;
 return <section className="cx-eight-layouts" aria-label="Eight distinct Lab and Boot Camp layouts">
  <div className="cx-eight-head"><div><span className="cx-overline">LEARNING EXPERIENCE ARCHITECTURE · EIGHT WORKING LAYOUTS</span><h2>Eight ways to learn. One shared teaching engine.</h2><p>Select a classroom below. Each option changes the content hierarchy, tools and chart presentation to suit its Labs and Boot Camps—not just its colors.</p></div><span className="cx-chip">STAFF PROTOTYPE · READ ONLY</span></div>
  <nav className="cx-eight-picker" aria-label="Select one of eight Lab and Boot Camp layouts">
   {classroomLayouts.map((v,i)=><button key={v.id} data-layout-choice={v.id} aria-pressed={selected===v.id} onClick={()=>selectLayout(v.id)}><span className={'cx-eight-mini cx-eight-mini-'+v.id} aria-hidden="true"><i/><i/><i/><i/><i/></span><span className="cx-eight-id">{String(i+1).padStart(2,'0')} / {v.codes[0].toUpperCase()}</span><strong>{v.title}</strong><small>{v.codes.length} existing source track{v.codes.length===1?'':'s'}</small></button>)}
  </nav>
  <div id="cx-layout-preview" className={'cx-lab-layout cx-lab-layout-'+selected} data-layout={selected} style={{'--cx-lp-accent':layout.accent} as React.CSSProperties}>
   <header className="cx-lp-header"><div><span className="cx-overline">{layout.track}</span><h2>{layout.title}</h2><p>{layout.purpose}</p></div><span>LAYOUT {String(classroomLayouts.findIndex(v=>v.id===selected)+1).padStart(2,'0')} / 08</span></header>
   <div className="cx-lp-scene">
    <div className="cx-lp-region cx-lp-region-visual">{displayChart}</div>
    <div className="cx-lp-region cx-lp-region-mission">{mission}</div>
    <div className="cx-lp-region cx-lp-region-tools">{tools}</div>
    <div className="cx-lp-region cx-lp-region-coach">{lesson}</div>
    <div className="cx-lp-region cx-lp-region-steps">{steps}</div>
    <div className="cx-lp-region cx-lp-region-evidence">{sourcePanel}</div>
   </div>
  </div>
  <p className="cx-eight-footnote">All eight layouts are rendered from original React/TypeScript components, reused ECharts fictional charts and source-linked teaching. They are staff design previews, not eight separate paid products or production member entitlements.</p>
 </section>;
}

const platformAreas=[{code:'studio',name:'Chart Studio',description:'Completed-bar candlesticks, EMA/VWAP studies, no-lookahead replay and synchronized Professional charts',kind:'volume' as ChartKind},{code:'labs',name:'Learning Labs',description:'419 canonical Labs, ten display steps over nine saved stages, first-principles teaching and protected grading',kind:'radar' as ChartKind},{code:'bootcamps',name:'Boot Camp Academy',description:'Daily instruction, Calculate, Predict, Replay, guided correction, independent transfer',kind:'radar' as ChartKind},{code:'indicators',name:'Indicator Research',description:'61 authored study guides versus 15 numerically calculated prototype studies',kind:'heat' as ChartKind},{code:'journal',name:'Trading Journal',description:'Risk/reward, simulated results, MFE/MAE and process-review analytics',kind:'equity' as ChartKind},{code:'store',name:'Lumens Store',description:'One authoritative currency and ledger, cosmetic products and server-protected redemptions',kind:'heat' as ChartKind},{code:'commons',name:'Market Commons',description:'Discussion, chart context, moderation and Founders Commons role restrictions',kind:'radar' as ChartKind},{code:'admin',name:'Admin Control Center',description:'Learning governance, access, commerce, operational reporting and audit',kind:'volume' as ChartKind}];
function PlatformExplorer({design,reveal,volume,ema,proxy,focus}:{design:Design;reveal:number;volume:boolean;ema:boolean;proxy:boolean;focus:number}){
 const [selected,setSelected]=useState('studio'),area=platformAreas.find(x=>x.code===selected)||platformAreas[0];
 return <section className="cx-platform-explorer" aria-label="Crownlight integrated product prototypes"><header><span className="cx-overline">CONNECTED WEBSITE / DESIGN EXPERIENCE</span><h2>Explore the complete Crownlight platform</h2><p>Interactive product previews use synthetic figures. They are not member activity, financial records, checkout or production feature acceptance.</p></header><nav aria-label="Platform prototype sections">{platformAreas.map(x=><button key={x.code} aria-pressed={selected===x.code} onClick={()=>setSelected(x.code)}>{x.name}</button>)}</nav><div className="cx-platform-preview"><div><span className="cx-overline">APPLICATION PREVIEW</span><h3>{area.name}</h3><p>{area.description}</p><strong>Source-grounded demonstration · read-only</strong><p>Official access, answer keys, Lumens and member data remain protected server-side. Python analytics is planned, not represented as deployed.</p></div><div><span className="cx-overline">FICTIONAL / CHART ENGINE</span><EChart kind={area.kind} reveal={reveal} showVolume={volume} showEma={ema} showProxy={proxy} focusBar={focus} design={design} height={255}/></div></div></section>
}

type LayoutKind='cards'|'buttons'|'labels'|'text';
type LayoutChange={x:number;y:number;width?:number;height?:number;hidden?:boolean;deleted?:boolean;name?:string;detached?:boolean;frameLess?:boolean;fontSize?:number;textAlign?:'left'|'center'|'right';textColor?:string;textOverride?:string};
const layoutTargets={
 cards:'section,article,aside,.cx-panel,.cx-talia,.cx-tutor-evidence,.cx-lesson-body,.cx-practice-pair,.cx-kpis>div,.cx-desk-banner,.cx-desk-identity,.cx-desk-price,.cx-platform-explorer,.cx-platform-preview>div,.cx-member-experience,.cx-member-hero,.cx-member-actions,.cx-chart-card,.cx-chart,.cx-chart-grabbable,.cx-trade-rows,.cx-trade,.cx-flagship-intro,.cx-flagship-aurora,.cx-flagship-quantum,.cx-edition-preview,.cx-edition-grid>label,.cx-member-workspaces,.cx-controlstrip,.cx-designs>button,.cx-indicator-catalog,.cx-reorderable,.cx-reorder-tools,.cx-learning,.cx-left,.cx-right,.cx-workgrid',
 buttons:'button,a,[role="button"],.cx-chip',
 labels:'label,.cx-overline,.cx-stage-name,.cx-statusline span,.cx-tutor-context,.cx-numeric>span',
 text:'h1,h2,h3,h4,p,small,strong,.cx-coach-typed,.cx-overline'
} as const;
/** Staff-only visual layout draft. Browser storage is for screenshot experiments, not a publishing API. */
function LayoutStudio({page}:{page:Page}){
 const [editing,setEditing]=useState(false),[clean,setClean]=useState(false),[hidePreview,setHidePreview]=useState(false);
 const [snapToGrid,setSnapToGrid]=useState(true),[inlineText,setInlineText]=useState(false);
 const snap=(v:number)=>snapToGrid?Math.round(v/10)*10:Math.round(v);
 const [kind,setKind]=useState<LayoutKind>('cards'),[selected,setSelected]=useState(''),[version,setVersion]=useState(0);
 const [note,setNote]=useState('Click to select an element, then drag a corner to resize or enter exact dimensions.');
 const [inventory,setInventory]=useState<Array<{id:string;label:string}>>([]);
 const [search,setSearch]=useState('');
 const [textDraft,setTextDraft]=useState('');
 const items=useRef<Record<string,LayoutChange>>({}),history=useRef<Record<string,LayoutChange>[]>([]);
 const selectedNode=useRef<HTMLElement|null>(null);
 const simpleText=(el:HTMLElement|null)=>!!el&&!el.closest('a,button,[role="button"],[data-cx-editor]')&&el.childNodes.length>0&&Array.from(el.childNodes).every(n=>n.nodeType===Node.TEXT_NODE);
 const clearInline=()=>document.querySelectorAll<HTMLElement>('.cx-app [data-cx-inline-editable]').forEach(el=>{el.removeAttribute('contenteditable');delete el.dataset.cxInlineEditable;delete el.dataset.cxBefore});

 const keyFor=useCallback((el:HTMLElement,root:HTMLElement)=>{
  const parts:string[]=[];let node:HTMLElement|null=el;
  while(node&&node!==root&&node.parentElement){parts.push(String(Array.from(node.parentElement.children).indexOf(node)));node=node.parentElement}
  return parts.reverse().join('.');
 },[]);
 const storageKey=useMemo(()=>('smfgu:prototype-visual-layout:v2:'+page+':'+(window.innerWidth<700?'mobile':window.innerWidth<1100?'tablet':'desktop')),[page]);
 const save=useCallback(()=>{try{window.localStorage.setItem(storageKey,JSON.stringify(items.current))}catch{}},[storageKey]);
 const apply=useCallback(()=>{
  const root=document.querySelector<HTMLElement>('.cx-app');if(!root)return;
  root.classList.toggle('cx-layout-customized',Object.values(items.current).some(v=>Boolean(v.x||v.y||v.width||v.height||v.detached||v.deleted)));
  const targets=root.querySelectorAll<HTMLElement>(Object.values(layoutTargets).join(','));
  targets.forEach(el=>{
   if(el.closest('[data-cx-editor]'))return;
   const key=keyFor(el,root),v=items.current[key];
   el.dataset.cxLayoutKey=key;
   if(!v)return;
   el.style.transform=!v.detached&&(v.x||v.y)?'translate3d('+v.x+'px,'+v.y+'px,0)':'';
   el.style.position=v.detached?'fixed':(v.x||v.y)?'relative':'';
   el.style.left=v.detached?Math.round(v.x)+'px':'';
   el.style.top=v.detached?Math.round(v.y)+'px':'';
   el.style.zIndex=v.detached?'200':(v.x||v.y)?'20':'';
   el.style.width=v.width?Math.round(v.width)+'px':'';
   el.style.maxWidth=v.width?'none':'';
   el.style.height=v.height?Math.round(v.height)+'px':'';
   el.style.display=v.hidden||v.deleted?'none':'';
   el.dataset.cxDeleted=v.deleted?'true':'false';
   el.dataset.cxFrameLess=v.frameLess?'true':'false';
   if(v.fontSize&&el.matches('h1,h2,h3,h4,p,small,strong,span,label,button,a'))el.style.fontSize=v.fontSize+'px';
   else if(!v.fontSize)el.style.fontSize='';
   el.style.textAlign=v.textAlign||'';
   el.style.color=v.textColor||'';
   el.dataset.cxTextColored=v.textColor?'true':'false';
   el.style.setProperty('--cx-editor-text-color',v.textColor||'');
   if(v.textOverride!==undefined){
    const text=Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent?.trim());
    if(text&&text.textContent!==v.textOverride&&!(el.isContentEditable&&document.activeElement===el))text.textContent=v.textOverride;
   }
  });
  root.querySelectorAll<HTMLElement>('[data-cx-layout-key]').forEach(el=>{el.dataset.cxSelected=editing&&!clean&&el.dataset.cxLayoutKey===selected?'true':'false'});
 },[keyFor,editing,clean,selected]);
 const applyRef=useRef(apply);applyRef.current=apply;
 const describe=useCallback((el:HTMLElement)=>{
  const own=el.getAttribute('aria-label')||el.getAttribute('data-layout-label')||'';
  const heading=el.querySelector('h2,h3,h4')?.textContent||'';
  const title=own||heading||el.querySelector('strong,b')?.textContent||el.textContent||'';
  const suffix=(typeof el.className==='string'?el.className.split(/\s+/).filter(x=>x.startsWith('cx-')).slice(0,2).join(' '):el.tagName.toLowerCase());
  return (title.trim().replace(/\s+/g,' ').slice(0,55)||suffix||el.tagName)+' · '+suffix;
 },[]);
 const refreshInventory=useCallback(()=>{
  const root=document.querySelector<HTMLElement>('.cx-app');if(!root)return;
  const candidates=Array.from(root.querySelectorAll<HTMLElement>(layoutTargets[kind]));
  const rows=candidates.filter(el=>!el.closest('[data-cx-editor]')&&el.getBoundingClientRect().width>=35&&el.getBoundingClientRect().height>=12)
   .map(el=>({id:keyFor(el,root),label:describe(el)}));
  setInventory(rows.filter((row,i)=>rows.findIndex(other=>other.id===row.id)===i));
 },[kind,keyFor,describe]);
 const change=useCallback((key:string,update:Partial<LayoutChange>)=>{
  if(!key)return;
  history.current.push(JSON.parse(JSON.stringify(items.current)));if(history.current.length>30)history.current.shift();
  items.current={...items.current,[key]:{...(items.current[key]||{x:0,y:0}),...update}};
  save();applyRef.current();setVersion(v=>v+1);
  window.dispatchEvent(new Event('resize'));
 },[save]);
 useEffect(()=>{try{const prior=window.localStorage.getItem(storageKey);items.current=prior?JSON.parse(prior):{};setSnapToGrid(window.localStorage.getItem(storageKey+':snap')!=='false')}catch{items.current={};setSnapToGrid(true)}setSelected('');setVersion(v=>v+1);},[storageKey]);
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.cx-app');if(!root)return;
  root.classList.toggle('cx-layout-editing',editing&&!clean);
  root.classList.toggle('cx-layout-text-mode',editing&&!clean&&kind==='text');
  root.classList.toggle('cx-preview-hide-chrome',hidePreview||clean);
  root.classList.toggle('cx-clean-screenshot',clean);
  applyRef.current();
  let pending=false;const obs=new MutationObserver(()=>{if(!pending){pending=true;window.requestAnimationFrame(()=>{pending=false;applyRef.current()})}});
  obs.observe(root,{childList:true,characterData:true,subtree:true});
  return()=>{obs.disconnect();clearInline();root.classList.remove('cx-layout-editing','cx-layout-text-mode','cx-preview-hide-chrome','cx-clean-screenshot')};
 },[editing,clean,hidePreview,page,kind]);
 useEffect(()=>{applyRef.current()},[version,selected,kind,editing]);
 useEffect(()=>{if(editing&&!clean)refreshInventory()},[editing,clean,kind,page,refreshInventory]);
 const selectById=(id:string)=>{
  const root=document.querySelector<HTMLElement>('.cx-app');if(!root||!id)return;
  const el=Array.from(root.querySelectorAll<HTMLElement>(layoutTargets[kind]))
    .find(candidate=>!candidate.closest('[data-cx-editor]')&&keyFor(candidate,root)===id);
  if(!el){setNote('This item is no longer visible. Reopen the element list after switching learning views.');return;}
  selectedNode.current=el;setSelected(id);
  const text=Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent?.trim());
  setTextDraft(items.current[id]?.textOverride??text?.textContent?.trim()??'');
  setNote('Selected '+describe(el)+'. Edit text or freely position it.');
  el.scrollIntoView({behavior:'auto',block:'nearest',inline:'nearest'});
 };
 useEffect(()=>{
  function esc(ev:KeyboardEvent){if(ev.key==='Escape'&&clean){setClean(false);setEditing(true);setNote('Screenshot mode closed. Layout editing restored.');}}
  document.addEventListener('keydown',esc);return()=>document.removeEventListener('keydown',esc);
 },[clean]);
 useEffect(()=>{
  if(!editing||clean)return;
  const root=document.querySelector<HTMLElement>('.cx-app');if(!root)return;
  const selector=layoutTargets[kind];
  function targetFrom(evTarget:EventTarget|null){
   const node=evTarget instanceof Element?evTarget:evTarget instanceof Node?evTarget.parentElement:null;
   if(!node||node.closest('[data-cx-editor]'))return null;
   let el=node.closest<HTMLElement>(selector);
   if(!el&&kind==='cards'){
    // Canvas/SVG content and custom component wrappers may lack a registered class.
    const candidate=node.closest<HTMLElement>('div,main,header,nav');
    const fallback=candidate?.closest<HTMLElement>('[class*="cx-"]');
    if(fallback&&fallback!==root&&!fallback.closest('[data-cx-editor]'))el=fallback;
   }
   return el&&root!.contains(el)&&el!==root?el:null;
  }
  function down(ev:PointerEvent){
   if(ev.button!==0)return;
   const el=targetFrom(ev.target);
   if(!el)return;
   const key=keyFor(el,root!);
   selectedNode.current=el;setSelected(key);
   const text=Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent?.trim());
   setTextDraft(items.current[key]?.textOverride??text?.textContent?.trim()??'');
   if(kind==='text'){
    if(inlineText&&simpleText(el)){el.dataset.cxBefore=el.textContent||'';el.setAttribute('contenteditable','plaintext-only');el.dataset.cxInlineEditable='true'}
    setNote('Text selected. Highlight words or edit plain text directly; changes save on blur.');
    return;
   }
   ev.preventDefault();ev.stopPropagation();
   setNote('Selected '+describe(el)+'. Drag, detach or style it.');
   const original=items.current[key]||{x:0,y:0},startX=ev.clientX,startY=ev.clientY;
   const dragging={x:original.x,y:original.y};
   let moved=false;
   const move=(e:PointerEvent)=>{
    if(e.pointerId!==ev.pointerId)return;
    if(Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>3)moved=true;
    if(!moved)return;
    dragging.x=snap(original.x+e.clientX-startX);dragging.y=snap(original.y+e.clientY-startY);
    if(original.detached){el.style.left=dragging.x+'px';el.style.top=dragging.y+'px';el.style.position='fixed';}
    else{el.style.transform='translate3d('+dragging.x+'px,'+dragging.y+'px,0)';el.style.position='relative';}
    el.style.zIndex=original.detached?'200':'20';
    e.preventDefault();
   };
   const stop=(e:PointerEvent)=>{
    if(e.pointerId!==ev.pointerId)return;
    document.removeEventListener('pointermove',move,true);document.removeEventListener('pointerup',stop,true);document.removeEventListener('pointercancel',stop,true);
    if(moved&&e.type==='pointerup')change(key,{x:dragging.x,y:dragging.y,name:describe(el)});
    else if(moved&&original.detached){el.style.left=original.x+'px';el.style.top=original.y+'px'}
    else if(moved){el.style.transform='translate3d('+original.x+'px,'+original.y+'px,0)';}
   };
   document.addEventListener('pointermove',move,true);document.addEventListener('pointerup',stop,true);document.addEventListener('pointercancel',stop,true);
  }
  function suppress(ev:MouseEvent){
   if(kind==='text'){
    const target=ev.target instanceof Element?ev.target:null;
    if(target?.closest('[data-cx-editor]'))return; // The editor's own buttons and inputs must remain interactive.
    if(target?.closest('a,button,[role="button"]')){ev.preventDefault();ev.stopImmediatePropagation();}
    return;
   }
   if(targetFrom(ev.target)){ev.preventDefault();ev.stopImmediatePropagation();}
  }
  function finish(ev:FocusEvent){
   const el=ev.target instanceof HTMLElement?ev.target:null;
   if(!el||el.dataset.cxInlineEditable!=='true')return;
   const key=keyFor(el,root!),content=el.textContent||'',before=el.dataset.cxBefore||'';
   el.removeAttribute('contenteditable');delete el.dataset.cxInlineEditable;delete el.dataset.cxBefore;
   if(content!==before)change(key,{textOverride:content,name:describe(el)});
  }
  root.addEventListener('pointerdown',down,true);root.addEventListener('click',suppress,true);root.addEventListener('focusout',finish,true);
  return()=>{root.removeEventListener('pointerdown',down,true);root.removeEventListener('click',suppress,true);root.removeEventListener('focusout',finish,true)};
 },[editing,clean,kind,inlineText,snapToGrid,keyFor,change,describe]);

 const [resizeBounds,setResizeBounds]=useState<{left:number;top:number;width:number;height:number}|null>(null);
 const dimension=(value:number,min:number)=>Math.min(2200,Math.max(min,snap(value)));
 const beginCornerResize=(event:React.PointerEvent<HTMLButtonElement>,corner:'nw'|'ne'|'sw'|'se')=>{
  if(!editing||clean||!selected||event.button!==0)return;
  const el=selectedNode.current;
  if(!el||!el.isConnected||el.dataset.cxLayoutKey!==selected||items.current[selected]?.deleted||items.current[selected]?.hidden)return;
  event.preventDefault();event.stopPropagation();
  const start=el.getBoundingClientRect(),prior=items.current[selected]||{x:0,y:0};
  const button=event.currentTarget,pointer=event.pointerId,initialX=event.clientX,initialY=event.clientY;
  let currentSize={x:prior.x,y:prior.y,width:start.width,height:start.height},moved=false,finished=false;
  const revert=()=>{
   el.style.width=prior.width?Math.round(prior.width)+'px':'';
   el.style.height=prior.height?Math.round(prior.height)+'px':'';
   el.style.maxWidth=prior.width?'none':'';
   el.style.transform=!prior.detached&&(prior.x||prior.y)?'translate3d('+prior.x+'px,'+prior.y+'px,0)':'';
   el.style.left=prior.detached?prior.x+'px':'';
   el.style.top=prior.detached?prior.y+'px':'';
   const r=el.getBoundingClientRect();setResizeBounds({left:r.left,top:r.top,width:r.width,height:r.height});
  };
  const preview=(e:PointerEvent)=>{
   if(finished||e.pointerId!==pointer)return;
   const dx=e.clientX-initialX,dy=e.clientY-initialY;
   const left=corner.includes('w'),top=corner.includes('n');
   const width=dimension(start.width+(left?-dx:dx),60),height=dimension(start.height+(top?-dy:dy),30);
   currentSize={x:prior.x+(left?start.width-width:0),y:prior.y+(top?start.height-height:0),width,height};
   moved=moved||Math.abs(width-start.width)>.5||Math.abs(height-start.height)>.5;
   el.style.width=Math.round(width)+'px';el.style.maxWidth='none';el.style.height=Math.round(height)+'px';
   if(prior.detached){el.style.left=Math.round(currentSize.x)+'px';el.style.top=Math.round(currentSize.y)+'px';}
   else{el.style.position='relative';el.style.transform=currentSize.x||currentSize.y?'translate3d('+Math.round(currentSize.x)+'px,'+Math.round(currentSize.y)+'px,0)':'';}
   const r=el.getBoundingClientRect();setResizeBounds({left:r.left,top:r.top,width:r.width,height:r.height});
   e.preventDefault();
  };
  const cleanup=()=>{
   window.removeEventListener('pointermove',preview,true);
   window.removeEventListener('pointerup',finish,true);
   window.removeEventListener('pointercancel',cancel,true);
   window.removeEventListener('blur',cancel,true);
   try{if(button.hasPointerCapture(pointer))button.releasePointerCapture(pointer)}catch{}
  };
  const finish=(e:PointerEvent)=>{
   if(finished||e.pointerId!==pointer)return;
   finished=true;cleanup();
   if(moved){
    change(selected,{x:Math.round(currentSize.x),y:Math.round(currentSize.y),width:Math.round(currentSize.width),height:Math.round(currentSize.height),name:prior.name||describe(el)});
    setNote('Resized to '+Math.round(currentSize.width)+' × '+Math.round(currentSize.height)+' pixels. Undo remains available.');
   }else revert();
  };
  const cancel=()=>{
   if(finished)return;
   finished=true;cleanup();revert();setNote('Resize canceled; previous size restored.');
  };
  try{button.setPointerCapture(pointer)}catch{}
  window.addEventListener('pointermove',preview,true);
  window.addEventListener('pointerup',finish,true);
  window.addEventListener('pointercancel',cancel,true);
  window.addEventListener('blur',cancel,true);
 };
 useEffect(()=>{
  if(!editing||clean||!selected){setResizeBounds(null);return;}
  const el=selectedNode.current;
  if(!el||!el.isConnected||el.dataset.cxLayoutKey!==selected||items.current[selected]?.hidden||items.current[selected]?.deleted){setResizeBounds(null);return;}
  const sync=()=>{
   if(!el.isConnected){setResizeBounds(null);return;}
   const r=el.getBoundingClientRect();
   if(r.width<8||r.height<8){setResizeBounds(null);return;}
   setResizeBounds(old=>old&&Math.abs(old.left-r.left)<.5&&Math.abs(old.top-r.top)<.5&&Math.abs(old.width-r.width)<.5&&Math.abs(old.height-r.height)<.5?old:{left:r.left,top:r.top,width:r.width,height:r.height});
  };
  sync();
  const watcher=new ResizeObserver(sync);watcher.observe(el);
  window.addEventListener('scroll',sync,true);window.addEventListener('resize',sync);
  return()=>{watcher.disconnect();window.removeEventListener('scroll',sync,true);window.removeEventListener('resize',sync);};
 },[editing,clean,selected,version]);
 const current:LayoutChange=items.current[selected]||{x:0,y:0};
 const detach=()=>{if(!selected)return;
  if(current.detached){modify({detached:false,x:0,y:0});return;}
  const rect=selectedNode.current?.getBoundingClientRect();
  modify({detached:true,x:Math.round(rect?.left??0),y:Math.round(rect?.top??0),width:current.width||Math.round(rect?.width||300)});
 };
 const modify=(update:Partial<LayoutChange>)=>{if(!selected)return;change(selected,{...update,name:current.name||selectedNode.current?.getAttribute('aria-label')||selectedNode.current?.querySelector('h3,h4')?.textContent?.slice(0,55)||kind})};
 const hidden=Object.entries(items.current).filter(([,value])=>value.hidden&&!value.deleted);
 const deleted=Object.entries(items.current).filter(([,value])=>value.deleted);
 const removeDraft=()=>{
  if(!selected||!selectedNode.current)return;
  if(!window.confirm('Remove selected element from this browser-local prototype draft? This will not delete website content; Restore or Undo remains available.'))return;
  change(selected,{deleted:true,hidden:false,name:current.name||describe(selectedNode.current)});
  selectedNode.current=null;setSelected('');
  setNote('Element removed from this draft. Use Restore deleted or Undo.');
 };
 return <div className="cx-layout-studio" data-cx-editor="true" aria-label="Prototype layout designer">
  {editing&&!clean&&resizeBounds&&selected&&<div className="cx-layout-resize-outline" role="group" aria-label="Selected element resize handles" style={{left:resizeBounds.left,top:resizeBounds.top,width:resizeBounds.width,height:resizeBounds.height}}>
   {(['nw','ne','sw','se'] as const).map(corner=><button type="button" key={corner} data-resize-corner={corner} className={'cx-layout-resize-corner cx-layout-resize-'+corner} aria-label={'Resize selected element from '+({nw:'top left',ne:'top right',sw:'bottom left',se:'bottom right'} as const)[corner]+' corner'} title="Drag to resize; release to save; Snap to Grid applies" onPointerDown={e=>beginCornerResize(e,corner)}/>)}
  </div>}
  {!clean&&<button className="cx-layout-toggle" aria-expanded={editing} onClick={()=>setEditing(v=>!v)}>{editing?'Close Layout Designer':'Edit page layout'}</button>}
  {editing&&!clean&&<section className="cx-layout-toolbar" aria-label="Visual layout controls">
   <header><strong>Layout Designer · Staff only</strong><small>Edit page copy, remove draft elements, and position layouts. Changes stay in this browser.</small></header>
   <label>Choose elements to arrange<select aria-label="Layout element type" value={kind} onChange={e=>setKind(e.target.value as LayoutKind)}><option value="cards">Cards / charts</option><option value="buttons">Buttons / links</option><option value="labels">Labels</option><option value="text">Headings / text</option></select></label>
   <p><strong>Choose an element below or click it directly on the page.</strong> This works with cards, charts, buttons, labels and text. Drag to move or pull any selected corner to resize; exact dimensions remain available. Layout is saved locally for this screen size.</p>
   <label className="cx-layout-check"><input type="checkbox" aria-label="Snap to grid" checked={snapToGrid} onChange={e=>{setSnapToGrid(e.target.checked);try{window.localStorage.setItem(storageKey+':snap',String(e.target.checked))}catch{}}}/>Snap to grid (10 px)</label>
   <label className="cx-layout-check"><input type="checkbox" aria-label="Edit text directly" checked={inlineText} onChange={e=>{setInlineText(e.target.checked);if(e.target.checked)setKind('text');else clearInline()}}/>Edit text directly on page</label>
   <label>Find an element<input aria-label="Find page element" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search: Talia, VWAP, chart, button..."/></label>
   <label>Page elements ({inventory.length})<select aria-label="Select page element" value={selected} onChange={e=>selectById(e.target.value)}><option value="">Choose an element…</option>
    {inventory.filter(e=>!search||e.label.toLowerCase().includes(search.toLowerCase())).slice(0,400).map(e=><option key={e.id} value={e.id}>{e.label}</option>)}
   </select></label>
   <button type="button" className="cx-layout-refresh" onClick={refreshInventory}>Refresh element list</button>
   <output aria-live="polite">Selected: {selected?(current.name||selectedNode.current?.getAttribute('aria-label')||selectedNode.current?.tagName||'Element'):'None'}{resizeBounds?' · '+Math.round(resizeBounds.width)+' × '+Math.round(resizeBounds.height)+' px':''}</output>
   <div className="cx-layout-dimensions">
    <label>Width (px)<input aria-label="Selected element width" type="number" min="60" max="2200" value={current.width||''} placeholder="Auto" disabled={!selected} onChange={e=>modify({width:e.target.value?Math.min(2200,Math.max(60,Number(e.target.value))):undefined})}/></label>
    <label>Height (px)<input aria-label="Selected element height" type="number" min="30" max="2200" value={current.height||''} placeholder="Auto" disabled={!selected} onChange={e=>modify({height:e.target.value?Math.min(2200,Math.max(30,Number(e.target.value))):undefined})}/></label>
   </div>
   <div className="cx-layout-format" aria-label="Selected text formatting">
    <label>Text size (px)<input aria-label="Selected text size" type="number" min="8" max="120" placeholder="Default" disabled={!selected} value={current.fontSize||''} onChange={e=>modify({fontSize:e.target.value?Math.min(120,Math.max(8,Number(e.target.value))):undefined})}/></label>
    <label>Text color<input aria-label="Selected text color" type="color" disabled={!selected} value={current.textColor&&/^#[0-9a-f]{6}$/i.test(current.textColor)?current.textColor:'#e5f7ff'} onChange={e=>modify({textColor:e.target.value})}/></label>
    <label>Alignment<select aria-label="Selected text alignment" disabled={!selected} value={current.textAlign||''} onChange={e=>modify({textAlign:(e.target.value||undefined) as LayoutChange['textAlign']})}><option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
    <label className="cx-layout-text-editor">Replace selected text<textarea aria-label="Selected text content" disabled={!selected||!simpleText(selectedNode.current)} value={textDraft} onChange={e=>setTextDraft(e.target.value)} placeholder="Select a plain heading or paragraph"/></label>
    <button disabled={!selected||!simpleText(selectedNode.current)} onClick={()=>modify({textOverride:textDraft})}>Apply text</button>
    <button disabled={!selected} onClick={()=>modify({textOverride:undefined,fontSize:undefined,textAlign:undefined,textColor:undefined})}>Reset text style</button>
   </div>
   <div className="cx-layout-arrows" role="group" aria-label="Nudge selection">
    {([['←',-1,0],['↑',0,-1],['↓',0,1],['→',1,0]] as const).map(([title,x,y])=><button key={title} aria-label={'Nudge '+({ '←':'left','↑':'up','↓':'down','→':'right'} as Record<string,string>)[title]} disabled={!selected} onClick={()=>modify({x:snap(current.x+x*(snapToGrid?10:1)),y:snap(current.y+y*(snapToGrid?10:1))})}>{title}</button>)}
    <button disabled={!selected} onClick={()=>modify({x:0,y:0,width:undefined,height:undefined})}>Reset selected</button>
   </div>
   <div className="cx-layout-actions">
   <button type="button" onClick={()=>{setEditing(false);setClean(false);setNote('Layout editor closed; changes remain in this browser.')}}>Exit Editor</button>
   <button disabled={!selected} onClick={detach}>{current.detached?'Return to page flow':'Free position (detach)'}</button>
   <button disabled={!selected} aria-pressed={!!current.frameLess} onClick={()=>modify({frameLess:!current.frameLess})}>{current.frameLess?'Restore card frame':'Remove card frame'}</button>
   <button disabled={!selected} onClick={()=>modify({hidden:true})}>Hide selected</button><button className="cx-layout-delete" disabled={!selected} onClick={removeDraft}>Delete selected from draft</button>
   <button onClick={()=>setHidePreview(v=>!v)} aria-pressed={hidePreview}>{hidePreview?'Show prototype-only UI':'Hide prototype-only UI'}</button>
   <button onClick={()=>{setClean(true);setEditing(false)}}>Screenshot mode</button>
   <button disabled={!history.current.length} onClick={()=>{const last=history.current.pop();if(last){items.current=last;save();applyRef.current();setVersion(v=>v+1)}}}>Undo</button>
   <button onClick={()=>{items.current={};history.current=[];try{window.localStorage.removeItem(storageKey)}catch{};window.location.reload()}}>Reset page layout</button></div>
   {hidden.length>0&&<div className="cx-layout-hidden"><strong>Hidden elements ({hidden.length})</strong>{hidden.map(([key,value])=><button key={key} onClick={()=>change(key,{hidden:false})}>Show {value.name||'hidden item'}</button>)}</div>}
   {deleted.length>0&&<div className="cx-layout-deleted"><strong>Deleted draft elements ({deleted.length})</strong>{deleted.map(([key,value])=><button key={key} onClick={()=>change(key,{deleted:false})}>Restore deleted: {value.name||'item'}</button>)}</div>}
   <small className="cx-layout-status" role="status">{note} Press Escape to leave screenshot mode.</small>
  </section>}
 </div>;
}

function Suite({page}:{page:Page}){
 const [learningMode,setLearningMode]=useState<LearningMode>('guided'),[blindChoice,setBlindChoice]=useState(''),[blindReason,setBlindReason]=useState(''),[blindLocked,setBlindLocked]=useState(false);
 const changeMode=(next:LearningMode)=>{setLearningMode(next);setBlindChoice('');setBlindReason('');setBlindLocked(false);setStage(next==='practice'?8:0)};
 const [barLook,setBarLook]=useState<BarLook>('quantum');
 const [chartAppearance,setChartAppearance]=useState<ChartAppearance>(()=>{try{const saved=JSON.parse(window.localStorage.getItem('smfgu-chart-appearance-v1')||'{}');return {...defaultChartAppearance,...saved,colors:{...defaultChartAppearance.colors,...saved.colors},types:{...saved.types}}}catch{return defaultChartAppearance}});
 useEffect(()=>{try{window.localStorage.setItem('smfgu-chart-appearance-v1',JSON.stringify(chartAppearance))}catch{}},[chartAppearance]);
 const [planCode,setPlanCode]=useState('FREE'),[studio,setStudio]=useState<Studio>('Standard'),[design,setDesign]=useState<Design>('quantum');
 const [selectedEditions,setSelectedEditions]=useState<{learning:EngineEdition;lab:EngineEdition;tutor:EngineEdition}>(editionPolicy.FREE);
 const [topic,setTopic]=useState<Topic>('vwap'),[stage,setStage]=useState(2),[reveal,setReveal]=useState(1),[volume,setVolume]=useState(true),[ema,setEma]=useState(true),[proxy,setProxy]=useState(true),[focus,setFocus]=useState(0);
 const [chartMenu,setChartMenu]=useState<PrototypeMenu|null>(null);
 const closeChartMenu=useCallback(()=>setChartMenu(null),[]);
 const openChartMenu=useCallback((x:number,y:number,view:'indicators'|'drawings'='indicators')=>{
  setChartMenu({x,y,view,selected:null,custom:false});
 },[]);
 useEffect(()=>{
  const command=(event:Event)=>{
   const d=(event as CustomEvent<{x:number;y:number;view:'indicators'|'drawings'}>).detail;
   if(d&&Number.isFinite(d.x)&&Number.isFinite(d.y))openChartMenu(d.x,d.y,d.view);
  };
  window.addEventListener('crownlight:prototype-chart-menu',command);
  return()=>window.removeEventListener('crownlight:prototype-chart-menu',command);
 },[openChartMenu]);
 const [indicatorSettings,setIndicatorSettings]=useState<Record<string,number>>({...defaults});
 const [indicatorEnabled,setIndicatorEnabled]=useState<Record<string,boolean>>({...defaultVisible});
 const setSettings=(key:string,value:number)=>setIndicatorSettings(old=>({...old,[key]:Number.isFinite(value)?value:defaults[key]}));
 const setEnabled=(key:string,value:boolean)=>setIndicatorEnabled(old=>({...old,[key]:value}));
 const indicatorPrefs:IndicatorPrefs={settings:indicatorSettings,enabled:indicatorEnabled,studio,setSettings,setEnabled,
  reset:()=>{setIndicatorSettings({...defaults});setIndicatorEnabled({...defaultVisible})},
  enableAll:()=>setIndicatorEnabled(Object.fromEntries(specs.map(x=>[x.id,studyAllowed(studio,x.id)])))};
 const plan=plans.find(x=>x.code===planCode)||plans[0];
 const theme=page==='b'?'quantum':design;
 const safeSetReveal=(v:number)=>{setReveal(v);setFocus(x=>Math.min(x,v-1));};
 const props={plan,studio,design:theme,topic,setTopic,stage,setStage,reveal,setReveal:safeSetReveal,volume,setVolume,ema,setEma,proxy,setProxy,focus:Math.min(focus,reveal-1),setFocus};
 return <ChartAppearanceContext.Provider value={{style:chartAppearance,setStyle:setChartAppearance}}><BarLookContext.Provider value={barLook}><IndicatorContext.Provider value={indicatorPrefs}><div className={'cx-app cx-theme-'+design+' cx-page-'+page} onContextMenuCapture={e=>{
  const target=e.target as HTMLElement;
  if(!target.closest('.cx-chart-grabbable,.cx-home-shared-market'))return;
  e.preventDefault();openChartMenu(e.clientX,e.clientY);
 }}><LayoutStudio page={page}/>
  <PrototypeChartContextMenu menu={chartMenu} close={closeChartMenu} setMenu={setChartMenu}
   studio={studio} prefs={indicatorPrefs} appearance={chartAppearance} setAppearance={setChartAppearance}/>
  <header className="cx-top"><div className="cx-logo"><span className="cx-mark">CL</span><div><span>THE STOCK MARKET: FROM THE GROUND UP</span><strong>CROWNLIGHT / EXPERIENCE LABORATORY</strong></div></div><div className="cx-top-actions"><span>STAFF / READ ONLY</span><a className="cx-constellation-cta" href="/prototype.html?experience=map">NEW · Learning Constellation</a><a href="/prototype.html?view=classic">Classic Builder</a><a className="cx-exit-link" href="/admin.html">Exit prototype</a></div></header>
  <nav className="cx-pages" aria-label="Three prototype pages">{([['a','OPTION A','Six-design master workbench'],['b','OPTION B','Three flagship applications'],['c','OPTION C','Membership comparison']] as const).map(([k,t,s])=><a key={k} href={'/prototype.html?experience='+k} aria-current={page===k?'page':undefined}><b>{t}</b><small>{s}</small></a>)}</nav>
  <div className="cx-bar"><div><div className="cx-overline">CROWNLIGHT / PRODUCT EXPERIENCE · V12</div><h1>{page==='a'?'Chart Studio. From observation to decision.':page==='b'?'Three research and teaching workstations.':'Every membership. Full-quality teaching.'}</h1><p>{page==='a'?'Working market-style charts, 16 calculated studies, fictional replay, and integrated Talia teaching.':page==='b'?'Three distinct ECharts workstations, complete with interactive learning and chart controls.':'Compare authentic product concepts, not simulated entitlements or checkout.'}</p></div><span className="cx-beta">INTERNAL · FICTIONAL · READ ONLY</span></div>
  <ClassroomLayoutGallery design={theme} reveal={reveal} setReveal={safeSetReveal} topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} focus={Math.min(focus,reveal-1)} setFocus={setFocus}/>
  <div className="cx-controlstrip">
   <label>Membership design preview<select value={planCode} onChange={e=>{const next=e.target.value;setPlanCode(next);const profile=membershipExperiences[next];if(profile){setSelectedEditions(editionPolicy[next]||editionPolicy.FREE);changeMode('guided');setStudio(profile.defaultStudio);setTopic(profile.defaultTopic);setStage(0);setReveal(1);setFocus(0)}}}>{plans.map(p=><option value={p.code} key={p.code}>{p.label}</option>)}</select></label>
   <label>Independent Chart Studio preview<select value={studio} onChange={e=>setStudio(e.target.value as Studio)}>{(['Standard','Advanced','Professional'] as Studio[]).map(t=><option key={t}>{t}</option>)}</select></label>
   {page==='a'&&<label>Design system<select value={design} onChange={e=>setDesign(e.target.value as Design)}>{designs.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}</select></label>}
   <label>Learning Mode<select aria-label="Prototype learning mode" value={learningMode} onChange={e=>changeMode(e.target.value as LearningMode)}>{educationModes.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
   <label>Bar Appearance<select aria-label="Bar appearance preset" value={barLook} onChange={e=>setBarLook(e.target.value as BarLook)}>{barLooks.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
   <label>Teaching topic<select value={topic} onChange={e=>setTopic(e.target.value as Topic)}><option value="vwap">Understand VWAP</option><option value="candle">Build & Understand a Candlestick</option></select></label>
  </div>
  {page==='a'&&<nav className="cx-designs" aria-label="Choose one of six advanced designs">{designs.map((d,i)=><button key={d.key} aria-pressed={design===d.key} onClick={()=>setDesign(d.key)}><i className={'cx-swatch cx-swatch-'+d.key}/><span><small>0{i+1} / DESIGN SYSTEM</small><b>{d.label}</b><small>{d.caption}</small></span></button>)}</nav>}
  <details className="cx-chart-customizer-shell"><summary>Customize chart · candles, indicator colors, timeframes, structure, grid and buffer</summary><ChartCustomizer/></details>
  <section className="cx-desk-banner" aria-label="Fictional market workstation">
   <div className="cx-desk-identity"><span className="cx-desk-mark">CL</span><div><span className="cx-overline">SIM-01 / INTRADAY EQUITY / 1 MIN</span><strong>Crownlight market terminal</strong><small>Fictional completed bars · no live feed or real orders</small></div></div>
   <div className="cx-desk-price"><span>LAST OBSERVED PRICE</span><strong>{dollars(series[reveal-1].c)}</strong><small className={series[reveal-1].c>=series[0].o?'positive':'negative'}>{series[reveal-1].c>=series[0].o?'+':''}{(series[reveal-1].c-series[0].o).toFixed(2)} / SESSION</small></div>
   <nav className="cx-desk-links" aria-label="Jump to prototype module"><a href="#cx-workspace">Chart + Talia</a><a href="#cx-studies">Studies</a><a href="#cx-platform">Website tools</a><a href="#cx-members">Members</a></nav>
  </section>
  <div className="cx-statusline"><span><Icon type="◉"/> {plan.label} · {plan.preset}</span><span>Chart Studio: {studio} (preview only)</span><span>Independent fictional lesson-case records: {reveal}</span></div>
  <section className="cx-learning-mode-bar" aria-label="Learning mode behavior"><strong>{educationModes.find(m=>m.id===learningMode)?.label} Mode</strong><p>{educationModes.find(m=>m.id===learningMode)?.description}</p></section>
  {learningMode==='assessment'?<section className="cx-mode-lock" role="status"><h3>Assessment unavailable in this prototype</h3><p>No reviewed private question bank or authorized grading service is connected to this fictional preview. No official answer keys, grades or mastery records are exposed.</p><button onClick={()=>changeMode('guided')}>Return to Guided Learning</button></section>:learningMode==='blind'&&!blindLocked?<section className="cx-mode-lock"><h3>Blind Decision — record your evidence before Talia responds</h3><p>Use only the revealed fictional OHLCV evidence. A decision cannot establish a guaranteed future price.</p><label>Independent decision<select aria-label="Blind decision" value={blindChoice} onChange={e=>setBlindChoice(e.target.value)}><option value="">Choose an action</option><option value="WATCH">Watch</option><option value="NO TRADE">No trade</option><option value="MORE EVIDENCE">More evidence needed</option></select></label><label>Evidence and invalidation<textarea aria-label="Blind decision evidence" value={blindReason} maxLength={500} onChange={e=>setBlindReason(e.target.value)} placeholder="What observations support the decision and what would invalidate it?"/></label><button disabled={!blindChoice||blindReason.trim().length<12} onClick={()=>setBlindLocked(true)}>Lock fictional decision and reveal instruction</button></section>:<><div id="cx-workspace" className="cx-live-workspace">{page==='a'?<Workstation {...props}/>:page==='b'?<Flagships {...props}/>:<Compare design={design} studio={studio} topic={topic} setTopic={setTopic} stage={stage} setStage={setStage} reveal={reveal} setReveal={safeSetReveal} volume={volume} ema={ema} proxy={proxy} focus={focus} setFocus={setFocus}/>}</div>
  </>}
  <EditionPreview plan={plan} selected={selectedEditions} setSelected={(k,v)=>setSelectedEditions(old=>({...old,[k]:v}))}/>
  <div id="cx-studies"><IndicatorDock/></div>
  <CurriculumAtlas/>
  <div id="cx-platform"><PlatformExplorer design={theme} reveal={reveal} volume={volume} ema={ema} proxy={proxy} focus={Math.min(focus,reveal-1)}/></div>
  <div id="cx-members"><MemberExperience plan={plan} reveal={reveal} setReveal={safeSetReveal} stage={stage} setStage={setStage} setTopic={setTopic}/></div>
  <footer className="cx-footer"><span>CROWN & LANTERN PRESS / INTERNAL DESIGN STUDY</span><span>REACT · TYPESCRIPT · JAVASCRIPT · HTML5 · CSS3 · ECHARTS 6.1 · PYTHON PROPOSED</span><span>Demo only. Server membership rules unchanged.</span></footer>
 </div></IndicatorContext.Provider></BarLookContext.Provider></ChartAppearanceContext.Provider>;
}

/** Shared Experience B technical chart. Owner preview may compare studios and
 * already-disclosed case bars; ordinary members use the same calculation and
 * UI components with immutable Standard-only supplemental simulation. The
 * member caller provides no private lesson data or entitlement overrides. */
export type ClassicChartMeasurement={index:number;open:number;high:number;low:number;close:number;interval:string};
export type ClassicChartInput={mode:'lab'|'bootcamp'|'talia';caseBars?:Bar[];memberSafe?:boolean;onObservedBar?:(index:number,timeframe:ChartTimeframe)=>void;measurement?:ClassicChartMeasurement};
export function ClassicClassroomChart({mode,caseBars=[],memberSafe=false,onObservedBar,measurement}:ClassicChartInput){
 const [source,setSource]=useState<'demo'|'case'>(mode==='talia'?'case':'demo');
 const [reveal,setReveal]=useState(54);
 const [focus,setFocus]=useState(0);
 const [studio,setStudio]=useState<Studio>('Advanced');
 const [barLook,setBarLook]=useState<BarLook>('quantum');
 const [appearance,setAppearance]=useState<ChartAppearance>({...defaultChartAppearance});
 const [settings,setSettings]=useState<Record<string,number>>({...defaults});
 const [enabled,setEnabled]=useState<Record<string,boolean>>({...defaultVisible});
 const [menu,setMenu]=useState<PrototypeMenu|null>(null);
 const close=useCallback(()=>setMenu(null),[]);
 const open=useCallback((x:number,y:number,view:'indicators'|'drawings'='indicators')=>setMenu({x,y,view,selected:null,custom:false}),[]);
 useEffect(()=>{
  const onCommand=(e:Event)=>{
   const v=(e as CustomEvent<{x:number;y:number;view:'indicators'|'drawings'}>).detail;
   if(v&&Number.isFinite(v.x)&&Number.isFinite(v.y))open(v.x,v.y,v.view);
  };
  window.addEventListener('crownlight:prototype-chart-menu',onCommand);
  return()=>window.removeEventListener('crownlight:prototype-chart-menu',onCommand);
 },[open]);
 const available=source==='case'&&caseBars.length>0?caseBars:series;
 const count=mode==='talia'?Math.max(1,available.length):Math.max(1,Math.min(reveal,available.length));
 useEffect(()=>{if(mode==='talia'&&caseBars.length>0)setFocus(caseBars.length-1)},[mode,caseBars.length]);
 // A partial 3m/5m group is still forming. Never label it a completed
 // observation, supply it to an indicator, or ask Talia to assess it.
 const completedBars=mode==='talia'
  ?available.slice(0,Math.floor(available.length/appearance.timeframe)*appearance.timeframe)
  :available;
 const chartCount=mode==='talia'?completedBars.length:count;
 const focused=Math.max(0,Math.min(focus,chartCount-1));
 const completedGroup=mode==='talia'&&chartCount>0?completedBars.slice(-appearance.timeframe):[];
 const activeMeasurement=measurement&&mode==='talia'
  ?completedGroup.length===appearance.timeframe?{
    index:chartCount/appearance.timeframe,
    open:completedGroup[0].o,high:Math.max(...completedGroup.map(b=>b.h)),
    low:Math.min(...completedGroup.map(b=>b.l)),close:completedGroup[completedGroup.length-1].c,
    interval:appearance.timeframe+'-minute completed candle'
   }:null:measurement;
 const effectiveStudio:Studio=memberSafe?'Standard':studio;
 const prefs:IndicatorPrefs={settings,enabled,studio:effectiveStudio,
  setSettings:(name,value)=>setSettings(p=>({...p,[name]:value})),
  setEnabled:(name,value)=>setEnabled(p=>({...p,[name]:value})),
  reset:()=>{setSettings({...defaults});setEnabled({...defaultVisible})},
  enableAll:()=>setEnabled(Object.fromEntries(specs.map(item=>[item.id,studyAllowed(effectiveStudio,item.id)])))};
 const selectSource=(next:'case'|'demo')=>{setSource(next);setReveal(next==='case'?Math.max(1,caseBars.length):54);setFocus(0)};
 const revealTo=(next:number)=>{setReveal(Math.max(1,Math.min(next,available.length)));setFocus(Math.min(focus,next-1))};
 return <ChartAppearanceContext.Provider value={{style:appearance,setStyle:setAppearance}}>
  <BarLookContext.Provider value={barLook}><IndicatorContext.Provider value={prefs}>
  <section className="cx-app cx-theme-quantum cx-page-b cx-classic-shared-chart" aria-label="Classic Classroom ECharts workstation"
   onContextMenuCapture={e=>{if(!(e.target as HTMLElement).closest('.cx-chart-grabbable'))return;e.preventDefault();open(e.clientX,e.clientY)}}>
   {mode!=='talia'&&<div className="cx-classic-chart-top"><div><strong>Classroom chart · {mode==='bootcamp'?'Boot Camp':'Lab'}</strong>
    <p>{mode==='talia'?'Observe each revealed candle while reading Talia’s explanation. Use the chart controls to zoom, inspect, and compare completed evidence.':memberSafe?'Simulated price chart · pan, zoom, studies, and timeframes. Advanced tools remain locked.':'Actual Experience B ECharts controls: zoom, pan, 16 calculated studies, appearance, timeframes, and right-click. Owner-only design preview.'}</p></div>
    <span>SIMULATED · UNGRADED</span></div>}
   {mode!=='talia'&&<div className="cx-classic-chart-controls">
    {!memberSafe&&<label>Chart evidence <select aria-label="Classic chart evidence source" value={source} onChange={e=>selectSource(e.target.value as 'demo'|'case')}>
     <option value="demo">Simulated chart design fixture</option>
     {caseBars.length>0&&<option value="case">Only revealed current case bars ({caseBars.length})</option>}
    </select></label>}
    {!memberSafe&&<label>Chart Studio design preview <select aria-label="Classic chart edition design preview" value={studio} onChange={e=>setStudio(e.target.value as Studio)}>
     {(['Standard','Advanced','Professional'] as Studio[]).map(s=><option key={s}>{s}</option>)}
    </select></label>}
    <label>Bar appearance <select aria-label="Classic chart bar appearance" value={barLook} onChange={e=>setBarLook(e.target.value as BarLook)}>
     {barLooks.map(b=><option key={b.id} value={b.id}>{b.label}</option>)}
    </select></label>
    {mode!=='talia'&&<label>Revealed candles <input aria-label="Classic chart revealed candles" type="range" min="1" max={available.length} value={count} onChange={e=>revealTo(Number(e.target.value))}/><output>{count} of {available.length}</output></label>}
    {mode!=='talia'&&<button type="button" onClick={()=>revealTo(Math.max(1,count-1))} disabled={count===1}>Previous candle</button>}
    {mode!=='talia'&&<button type="button" onClick={()=>revealTo(Math.min(available.length,count+1))} disabled={count===available.length}>Reveal next candle</button>}
   </div>}
   <div className={activeMeasurement?'cx-classic-visual-region cx-classic-has-measurements':'cx-classic-visual-region'}>
    <EChart kind="price" reveal={chartCount} showVolume={true} showEma={true} showProxy={true}
     sourceBars={completedBars} focusBar={focused} onSelect={index=>{setFocus(index);onObservedBar?.(Math.floor(index/appearance.timeframe),appearance.timeframe)}} design="quantum" height={mode==='talia'?300:460}/>
    {activeMeasurement&&<aside className="cx-classic-measurements" aria-label="Latest revealed candle price measurements">
     <div className="cx-measure-heading"><strong>Price measurements</strong><small>Bar {activeMeasurement.index} · {activeMeasurement.interval}</small></div>
     <dl>
      <div><dt>High</dt><dd>${activeMeasurement.high.toFixed(2)}</dd></div>
      <div><dt>Close</dt><dd>${activeMeasurement.close.toFixed(2)}</dd></div>
      <div><dt>Open</dt><dd>${activeMeasurement.open.toFixed(2)}</dd></div>
      <div><dt>Low</dt><dd>${activeMeasurement.low.toFixed(2)}</dd></div>
     </dl>
     <p className="cx-measure-candle-type">{activeMeasurement.close>activeMeasurement.open?'Bullish':activeMeasurement.close<activeMeasurement.open?'Bearish':'Doji'} candle</p>
     <p>Body ${Math.abs(activeMeasurement.close-activeMeasurement.open).toFixed(2)} · Range ${(activeMeasurement.high-activeMeasurement.low).toFixed(2)}</p>
     <small>Simulated completed candle. No future bars.</small>
    </aside>}
   </div>
   <div className="cx-classic-chart-note" role="status">{mode==='talia'?'Timeframe: '+appearance.timeframe+' min · '+chartCount+' of '+available.length+' revealed bars complete.': 'Selected observed candle '+(focused+1)+' of '+chartCount+' · All calculations use revealed simulated bars only. This independent demonstration never supplies protected lesson evidence, assessment answers, grades or memberships.'}</div>
   {mode==='talia'?<details className="cx-optional-chart-settings"><summary>Chart settings &amp; studies</summary>
    <label className="cx-compact-look">Candle appearance <select aria-label="Talia chart candle appearance" value={barLook} onChange={e=>setBarLook(e.target.value as BarLook)}>{barLooks.map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></label>
    <ChartCustomizer/><IndicatorDock/>
   </details>:<><details><summary>Chart appearance · colors, timeframes, candle spacing and levels</summary><ChartCustomizer/></details><IndicatorDock/></>}
   <PrototypeChartContextMenu menu={menu} close={close} setMenu={setMenu} studio={effectiveStudio}
    prefs={prefs} appearance={appearance} setAppearance={setAppearance}/>
  </section>
  </IndicatorContext.Provider></BarLookContext.Provider>
 </ChartAppearanceContext.Provider>;
}
export function mountClassicClassroomChart(target:HTMLElement,input:ClassicChartInput):{
 update:(next:ClassicChartInput)=>void;dispose:()=>void
}{
 const root:Root=createRoot(target);
 let disposed=false;
 const render=(value:ClassicChartInput)=>{if(!disposed)root.render(<ClassicClassroomChart {...value}/>)};
 render(input);
 return {update:render,dispose:()=>{if(disposed)return;disposed=true;root.unmount();target.replaceChildren()}};
}

export function mountExperienceSuite(element:HTMLElement,page:Page):()=>void{
 const root:Root=createRoot(element);root.render(<Suite page={page}/>);return()=>root.unmount();
}

/* SMFGU-TALIA-CHAT-001 v1.0
 * React/TypeScript member classroom. New presentation only: ALL Tutor replies,
 * access decisions, source retrieval, quotas and history remain server-owned.
 * No provider call, broker execution, official grade or private rubric access.
 */
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';

type Mode='explain'|'question'|'review'|'practice';
type ChatLine={id:string;who:'member'|'talia';text:string;label?:string};
type Member={id:string;access:string};
type SupabaseSession={access_token:string;user:{id:string}};
type AuthClient={
  auth:{
    getUser:()=>Promise<{data:{user:{id:string}|null}}>;
    getSession:()=>Promise<{data:{session:SupabaseSession|null}}>;
    onAuthStateChange:(fn:(event:string,session:SupabaseSession|null)=>void)=>{data:{subscription:{unsubscribe:()=>void}}}
  }
};
type ChartInstance={
  setOption:(value:unknown,options?:unknown)=>void;
  on:(event:string,cb:(event:{dataIndex?:number})=>void)=>void;
  dispose:()=>void;
  resize:()=>void
};
type ChartApi={init:(el:HTMLElement)=>ChartInstance};
declare global{
  interface Window{
    getSupabaseClient:()=>Promise<AuthClient>;
    CrownlightECharts?:{load:()=>Promise<ChartApi>};
  }
}
const DEFAULT:ChatLine[]=[{id:'welcome',who:'talia',text:'Welcome. I am Talia, your market-learning instructor. Ask a concept question, request a worked example, or explain your reasoning. We will use reviewed educational material and fictional practice, not trading predictions.'}];
const EXAMPLES=[
  'Explain candlestick open, high, low and close from first principles.',
  'Teach VWAP and explain why bar-based VWAP differs from trade-print VWAP.',
  'Try another original fictional EMA 9 and EMA 20 example.',
  'What makes choosing NO TRADE a defensible decision?'
];
const REPLAY:number[][]=[
  [20,20.16,19.90,20.27],[20.16,20.25,20.04,20.34],
  [20.25,20.12,20.02,20.32],[20.12,20.40,20.08,20.48],
  [20.40,20.35,20.27,20.55],[20.35,20.62,20.29,20.71],
  [20.62,20.58,20.44,20.73],[20.58,20.79,20.52,20.91],
  [20.79,20.85,20.71,20.96],[20.85,20.66,20.60,20.94],
  [20.66,20.49,20.40,20.73],[20.49,20.57,20.43,20.65]
];
const initialQuestion=()=>new URLSearchParams(location.search).get('q')?.slice(0,450)||'';
/* Public canonical IDs and stage hints only. Server independently checks the
 * registered Lab and the member entitlement; never forward lesson answers. */
const labHandoff=(()=>{
  const params=new URLSearchParams(location.search);
  const id=(params.get('lab')||'').toUpperCase();
  const stage=params.get('stage')||'Learn';
  const stages=['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'];
  if(!/^(?:F[123]-C\d{2}-L\d{2}|DT-C\d{2}-L\d{2}|TAPE-C\d{2}-L\d{2})$/.test(id))return null;
  return {id,stage:stages.includes(stage)?stage:'Learn'};
})();
const labQuestion=(q:string)=>labHandoff
  ?('Lab '+labHandoff.id+'. Learning Journey stage: '+labHandoff.stage+'. '+q).slice(0,450):q;
function FictionalChart({onQuestion,memberId}:{onQuestion:(q:string)=>void;memberId:string}){
  const host=useRef<HTMLDivElement|null>(null);
  const [visible,setVisible]=useState(7);
  const prototype=typeof window!=='undefined'&&window.location.pathname.endsWith('/talia-tutor-prototype.html');
  const [study,setStudy]=useState<'none'|'sma3'|'ema3'|'ema9'|'ema20'|'ema200'|'vwap'>('ema9');
  const [zoom,setZoom]=useState(100);
  const [showVolume,setShowVolume]=useState(true);
  const [showStructure,setShowStructure]=useState(true);
  const [buffer,setBuffer]=useState(3);
  const [bull,setBull]=useState('#38c6a6');
  const [bear,setBear]=useState('#e37779');
  const [annotation,setAnnotation]=useState<number|null>(null);
  const [settingsLoaded,setSettingsLoaded]=useState(false);
  useEffect(()=>{
    if(!prototype||!memberId)return;
    setSettingsLoaded(false);
    try{
      const raw=window.localStorage.getItem('smfgu-talia-prototype-chart-v1:'+memberId);
      if(raw){const v=JSON.parse(raw);
        if(['none','sma3','ema3','ema9','ema20','ema200','vwap'].includes(v.study))setStudy(v.study);
        if([0,3,6].includes(v.buffer))setBuffer(v.buffer);
        if([45,70,100].includes(v.zoom))setZoom(v.zoom);
        if(typeof v.bull==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.bull))setBull(v.bull);
        if(typeof v.bear==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.bear))setBear(v.bear);
        if(typeof v.showVolume==='boolean')setShowVolume(v.showVolume);
        if(typeof v.showStructure==='boolean')setShowStructure(v.showStructure);
      }
    }catch{/* Settings storage is optional; chart continues with safe defaults. */}
    setSettingsLoaded(true);
  },[prototype,memberId]);
  useEffect(()=>{
    if(!prototype||!memberId||!settingsLoaded)return;
    try{window.localStorage.setItem('smfgu-talia-prototype-chart-v1:'+memberId,JSON.stringify({study,buffer,zoom,bull,bear,showVolume,showStructure}));}catch{/* Private browsing may disable storage. */}
  },[prototype,memberId,settingsLoaded,study,buffer,zoom,bull,bear,showVolume,showStructure]);
  const [status,setStatus]=useState('Fictional completed-bar teaching example; subsequent bars are concealed.');
  useEffect(()=>{
    let disposed=false,plot:ChartInstance|null=null;
    const resize=()=>plot?.resize();
    const mount=async()=>{
      try{
        if(!host.current||!window.CrownlightECharts?.load){
          setStatus('Chart unavailable; use the accessible candle table below.');return;
        }
        const echarts=await window.CrownlightECharts.load();
        if(disposed||!host.current)return;
        plot=echarts.init(host.current);
        const closes=REPLAY.slice(0,visible).map(r=>r[1]);
        const overlay=closes.map((_,i)=>{
          if(i<2||study==='none')return null;
          if(study==='sma3')return Number(((closes[i]+closes[i-1]+closes[i-2])/3).toFixed(4));
          let ema=(closes[0]+closes[1]+closes[2])/3;
          for(let j=3;j<=i;j++)ema=closes[j]*.5+ema*.5;
          return Number(ema.toFixed(4));
        });
        // Display only completed observations; longer lookback indicators correctly remain in warmup.
        const ema=(period:number)=>closes.map((_,i)=>{if(i<period-1)return null;let v=closes.slice(0,period).reduce((a,b)=>a+b,0)/period;for(let j=period;j<=i;j++)v=v+(closes[j]-v)*2/(period+1);return Number(v.toFixed(4))});
        const shown=REPLAY.slice(0,visible);
        const volumes=shown.map((r,i)=>200+Math.round(Math.abs(r[1]-r[0])*3700)+i*17); // labeled fictional proxy, NOT market volume
        const vwap=shown.map((_,i)=>{let sum=0,qty=0;for(let j=0;j<=i;j++){sum+=((shown[j][3]+shown[j][2]+shown[j][1])/3)*volumes[j];qty+=volumes[j]}return Number((sum/qty).toFixed(4))});
        const structure=shown.map((r,i)=>i>=2&&i<visible-1&&r[3]>shown[i-1][3]&&r[3]>shown[i+1][3]?{coord:[i,r[3]],value:'Swing H'}:null).filter((x):x is {coord:number[],value:string}=>x!==null);
        const horizon=Array.from({length:prototype?buffer:0},(_,i)=>'Buffer '+(i+1));
        plot.setOption({
          animation:false,backgroundColor:'transparent',
          dataZoom:prototype?[{type:'inside',start:Math.max(0,100-zoom),end:100,zoomOnMouseWheel:true,moveOnMouseMove:true,moveOnMouseWheel:false},{type:'slider',start:Math.max(0,100-zoom),end:100,height:13,bottom:7}]:[],
          grid:showVolume&&prototype?[{top:26,left:52,right:25,height:'58%'},{top:'74%',left:52,right:25,height:'14%'}]:{top:24,left:50,right:25,bottom:55},
          xAxis:showVolume&&prototype?[{type:'category',data:[...shown.map((_,i)=>'Bar '+(i+1)),...horizon],axisLabel:{color:'#a4b7c9'},axisLine:{lineStyle:{color:'#536578'}}},{type:'category',gridIndex:1,data:[...shown.map((_,i)=>'Bar '+(i+1)),...horizon],axisLabel:{show:false},axisLine:{show:false}}]:{type:'category',data:[...shown.map((_,i)=>'Bar '+(i+1)),...horizon],axisLabel:{color:'#a4b7c9'},axisLine:{lineStyle:{color:'#536578'}}},
          yAxis:showVolume&&prototype?[{scale:true,type:'value',axisLabel:{color:'#a4b7c9'},splitLine:{lineStyle:{color:'#34465a',opacity:0.35}}},{type:'value',gridIndex:1,axisLabel:{color:'#88a8bb'},splitLine:{show:false}}]:{scale:true,type:'value',axisLabel:{color:'#a4b7c9'},splitLine:{lineStyle:{color:'#34465a',opacity:0.35}}},
          tooltip:{trigger:'item',formatter:(x:{dataIndex:number})=>{
            const r=REPLAY.slice(0,visible)[x.dataIndex];return r?'Fictional bar '+(x.dataIndex+1)+' | O '+r[0]+' H '+r[3]+' L '+r[2]+' C '+r[1]:'';
          }},
          series:[{type:'candlestick',name:'Fictional completed bars',
            data:shown,itemStyle:{color:prototype?bull:'#38c6a6',color0:prototype?bear:'#e37779',borderColor:prototype?bull:'#38c6a6',borderColor0:prototype?bear:'#e37779'},
            markLine:prototype&&showStructure?{symbol:'none',lineStyle:{color:'#668ba1',type:'dashed'},data:[{yAxis:Math.max(...shown.map(r=>r[3])),name:'Visible high'},{yAxis:Math.min(...shown.map(r=>r[2])),name:'Visible low'}]}:undefined,
            markPoint:prototype&&annotation!==null&&annotation<visible?{symbol:'pin',symbolSize:42,label:{formatter:'Study',color:'#091827'},data:[{coord:[annotation,REPLAY[annotation][1]],value:'Study'}]}:undefined},
            ...(prototype&&study!=='none'?[{type:'line',name:study==='sma3'?'SMA 3':study.toUpperCase(),data:study==='ema9'?ema(9):study==='ema20'?ema(20):study==='ema200'?ema(200):study==='vwap'?vwap:overlay,showSymbol:false,connectNulls:false,lineStyle:{width:2,color:'#e9bc72'},itemStyle:{color:'#e9bc72'},smooth:false}]:[]),
            ...(prototype&&showVolume?[{type:'bar',name:'Fictional volume proxy',xAxisIndex:1,yAxisIndex:1,data:volumes,itemStyle:{color:'#3c8192'}}]:[]),
            ...(prototype&&showStructure&&structure.length?[{type:'scatter',name:'Visible swing highs',data:structure.map(x=>x.coord),symbolSize:9,itemStyle:{color:'#d6b77f'}}]:[])]
        });
        plot.on('click',e=>{
          const i=Number(e.dataIndex);
          if(Number.isInteger(i)&&i>=0&&i<visible){
            const bar=REPLAY[i];
            onQuestion(('Fictional completed bar '+(i+1)+': open '+bar[0].toFixed(2)+', high '+bar[3].toFixed(2)+', low '+bar[2].toFixed(2)+', close '+bar[1].toFixed(2)+'. Only '+visible+' bars have been revealed. Coach me through its body, wicks and prior visible structure. Ask what I observe before explaining. Do not use future bars or grade me.').slice(0,450));
          }
        });
        window.addEventListener('resize',resize);
        setStatus(visible+' of '+REPLAY.length+' fictional completed bars are currently visible.');
      }catch{if(!disposed)setStatus('Chart unavailable; the completed-candle table remains available.')}
    };
    void mount();
    return ()=>{disposed=true;window.removeEventListener('resize',resize);plot?.dispose()};
  },[visible,onQuestion,prototype,study,zoom,annotation,showVolume,showStructure,buffer,bull,bear]);
  const latest=REPLAY[visible-1];
  return <section className="tc-chart-panel" aria-label="Optional fictional completed-candle teaching chart">
    <div className="tc-row tc-row-between"><h2>Chart classroom</h2><span className="tc-pill">FICTIONAL / REVEALED PREFIX</span></div>
    <p>Inspect only the completed fictional candles revealed at this exercise boundary. This static demonstration keeps its synthetic fixture in client code; it is not a secure historical replay, protected assessment, or market-data feed.</p>
    {prototype&&<div className="tc-row tp-chart-tools" aria-label="Chart analysis controls">
      <label>Completed-bar study <select value={study} onChange={e=>setStudy(e.target.value as 'none'|'sma3'|'ema3'|'ema9'|'ema20'|'ema200'|'vwap')}><option value="ema3">EMA 3</option><option value="sma3">SMA 3</option><option value="ema9">EMA 9</option><option value="ema20">EMA 20 (requires 20 bars)</option><option value="ema200">EMA 200 (requires 200 bars)</option><option value="vwap">Fictional proxy VWAP</option><option value="none">No overlay</option></select></label>
      <label>Visible window <select value={zoom} onChange={e=>setZoom(Number(e.target.value))}><option value={100}>All revealed bars</option><option value={70}>70%</option><option value={45}>45%</option></select></label>
      <label>Right buffer <select value={buffer} onChange={e=>setBuffer(Number(e.target.value))}><option value={0}>None</option><option value={3}>3 bars</option><option value={6}>6 bars</option></select></label>
      <label>Bull <input aria-label="Bull candle color" type="color" value={bull} onChange={e=>setBull(e.target.value)}/></label>
      <label>Bear <input aria-label="Bear candle color" type="color" value={bear} onChange={e=>setBear(e.target.value)}/></label>
      <label><input type="checkbox" checked={showVolume} onChange={e=>setShowVolume(e.target.checked)}/> Volume proxy</label>
      <label><input type="checkbox" checked={showStructure} onChange={e=>setShowStructure(e.target.checked)}/> Structure</label>
      <button type="button" className="tc-secondary" onClick={()=>setAnnotation(visible-1)}>Annotate latest</button>
      <button type="button" className="tc-secondary" onClick={()=>setAnnotation(null)} disabled={annotation===null}>Clear annotation</button>
      <button type="button" className="tc-secondary" onClick={()=>onQuestion('Explain the '+(study==='none'?'candle structure':study.toUpperCase())+' visible through completed fictional bar '+visible+'. State any warmup limitation and do not reference future candles.')}>Teach this chart</button>
    </div>}
    <div className="tc-chart" ref={host} role="img" aria-label={'Fictional price chart showing '+visible+' completed candlesticks'} />
    <p className="tc-muted" role="status">{status}{prototype?' Volume is a fictional proxy, not observed trading volume. EMA 20/200 remain unavailable until sufficient bars exist; blank right-side buffer contains no future data.':''}</p>
    <table className="tc-candle-table"><caption>Latest visible completed candle</caption>
      <thead><tr><th>Bar</th><th>Open</th><th>High</th><th>Low</th><th>Close</th></tr></thead>
      <tbody><tr><td>{visible}</td><td>{latest[0].toFixed(2)}</td><td>{latest[3].toFixed(2)}</td><td>{latest[2].toFixed(2)}</td><td>{latest[1].toFixed(2)}</td></tr></tbody>
    </table>
    <div className="tc-row">
      <button type="button" onClick={()=>setVisible(v=>Math.min(REPLAY.length,v+1))} disabled={visible===REPLAY.length}>Reveal next fictional bar</button>
      <button type="button" className="tc-secondary" onClick={()=>setVisible(7)} disabled={visible===7}>Reset</button>
      <button type="button" className="tc-secondary" onClick={()=>onQuestion(('The latest revealed fictional bar is '+visible+' with open '+latest[0].toFixed(2)+', high '+latest[3].toFixed(2)+', low '+latest[2].toFixed(2)+', close '+latest[1].toFixed(2)+'. Guide me through one observation question using only these completed bars; do not reveal later candles.').slice(0,450))}>Ask Talia about this candle</button>
    </div>
  </section>;
}
function Classroom(){
  const [member,setMember]=useState<Member|null>(null);
  const [ready,setReady]=useState(false);
  const [chat,setChat]=useState<ChatLine[]>(DEFAULT);
  const [question,setQuestion]=useState(initialQuestion);
  const [reasoning,setReasoning]=useState('');
  const [mode,setMode]=useState<Mode>('explain');
  const [save,setSave]=useState(false);
  const [conversationId,setConversationId]=useState<string|null>(null);
  const [conversationLabel,setConversationLabel]=useState('');
  const [busy,setBusy]=useState(false);
  const phases=['Observe','Explain','Attempt','Correct','Retry','Transfer'] as const;
  type Phase=typeof phases[number];
  const [phase,setPhase]=useState<Phase>('Observe');
  const [attempts,setAttempts]=useState(0);
  const [sessionTopic,setSessionTopic]=useState('Reading completed candles');
  const [dimension,setDimension]=useState<'Knowledge'|'Recognition'|'Decision'|'Process'>('Recognition');
  const phaseInstructions:Record<Phase,{mode:Mode;prompt:string}>={
    Observe:{mode:'question',prompt:'Ask me to identify two observable facts from the current completed candle or concept. Do not interpret for me yet.'},
    Explain:{mode:'explain',prompt:'Teach the concept from first principles. Separate the observed evidence from assumptions and use a fictional worked example.'},
    Attempt:{mode:'question',prompt:'Ask one diagnostic question. Wait for my answer before providing the explanation. This is ungraded.'},
    Correct:{mode:'review',prompt:'Help me inspect my reasoning for a specific misconception. Explain the correction and why my inference may fail. Do not supply a private rubric.'},
    Retry:{mode:'question',prompt:'Give me a DIFFERENT ungraded question focused on the same misconception; wait for my attempt.'},
    Transfer:{mode:'practice',prompt:'Give a new fictional scenario requiring an independent decision including NO TRADE. Do not grade or award mastery.'}
  };
  const preparePhase=(next:Phase)=>{
    setPhase(next);
    setMode(phaseInstructions[next].mode);
    setQuestion((sessionTopic+'. '+phaseInstructions[next].prompt).slice(0,450));
    setStatus('Instruction prepared for '+next+'. Review the question and send it to Talia.');
  };
  const [status,setStatus]=useState('Verifying member sign-in...');
  const epoch=useRef(0),pending=useRef<AbortController|null>(null);
  const log=useRef<HTMLOListElement|null>(null);
  const client=useRef<AuthClient|null>(null);
  const identity=useRef<string|null>(null);
  const reset=useCallback((id:string|null)=>{
    epoch.current++;pending.current?.abort();pending.current=null;
    identity.current=id;setMember(null);setChat(DEFAULT);
    setConversationId(null);setConversationLabel('');setSave(false);
    setReasoning('');setBusy(false);setPhase('Observe');setAttempts(0);setSessionTopic('Reading completed candles');setStatus(id?'Member identity changed. Verifying the new session...':'Signed out. Private Tutor content was cleared.');
  },[]);
  useEffect(()=>{
    let live=true,unsubscribe:(()=>void)|null=null;
    const authorize=async(userId:string,access:string)=>{
      try{
        const response=await fetch('/api/member-tool-access?tool=MARKET_TUTOR',{
          cache:'no-store',headers:{authorization:'Bearer '+access}});
        const data=await response.json().catch(()=>null);
        if(!live||identity.current!==userId)return;
        if(!response.ok||data?.ok!==true||(data.authorized!==true&&data.freeEligible!==true)){
          setMember(null);
          setStatus('Talia requires an eligible, unrestricted membership. Sign in with an active member account.');
          return;
        }
        setMember({id:userId,access});
        setStatus('Membership verified. Original source-grounded Tutor ready; no personal API key required.');
      }catch{
        if(live&&identity.current===userId){
          setMember(null);setStatus('Membership could not be verified. Tutor remains locked.');
        }
      }
    };
    const init=async()=>{
      try{
        const sb=await window.getSupabaseClient();if(!live)return;
        client.current=sb;
        const [verified,current]=await Promise.all([sb.auth.getUser(),sb.auth.getSession()]);
        if(!live)return;
        const userId=verified.data.user?.id,session=current.data.session;
        if(userId&&session?.user.id===userId&&session.access_token){
          identity.current=userId;await authorize(userId,session.access_token);
        }else{
          setMember(null);setStatus('Sign in with an eligible membership to use Talia.');
        }
        const change=sb.auth.onAuthStateChange((event,next)=>{
          if(!live)return;
          const id=next?.user?.id||null;
          if(event==='SIGNED_OUT'||id!==identity.current)reset(id);
          if(id&&next?.access_token)void authorize(id,next.access_token);
          else setMember(null);
        });
        unsubscribe=()=>change.data.subscription.unsubscribe();
      }catch{if(live)setStatus('Member authentication is unavailable. No private Tutor request was sent.')}
      finally{if(live)setReady(true)}
    };
    void init();
    return ()=>{live=false;epoch.current++;pending.current?.abort();unsubscribe?.()};
  },[reset]);
  useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:'auto'})},[chat,busy]);
  const getToken=useCallback(async()=>{
    if(!client.current||!identity.current)return null;
    const result=(await client.current.auth.getSession()).data.session;
    return result?.user.id===identity.current?result.access_token:null;
  },[]);
  const send=async(e:React.FormEvent)=>{
    e.preventDefault();const q=question.trim();
    if(busy||!member||!ready)return;
    if(q.length<4||q.length>450){setStatus('Question must contain 4–450 characters.');return}
    if(mode==='review'&&!reasoning.trim()){setStatus('Provide your reasoning to request an ungraded review.');return}
    const targetId=member.id,version=epoch.current;
    const controller=new AbortController();pending.current=controller;setBusy(true);
    const currentSave=save,thread=save?conversationId:null;
    setChat(x=>[...x,{id:crypto.randomUUID(),who:'member',text:q}]);
    setQuestion('');setStatus('Talia is preparing a source-grounded explanation...');
    try{
      const access=await getToken();if(!access)throw Error('Member session expired. Please sign in.');
      const res=await fetch('/api/market-tutor',{method:'POST',cache:'no-store',credentials:'same-origin',signal:controller.signal,
        headers:{authorization:'Bearer '+access,'content-type':'application/json'},
        body:JSON.stringify({question:labQuestion(q),mode,learnerAnswer:reasoning.trim().slice(0,1800),
          requestId:crypto.randomUUID(),allowModel:false,saveHistory:currentSave,conversationId:thread})});
      const result=await res.json().catch(()=>null);
      if(controller.signal.aborted||version!==epoch.current||identity.current!==targetId)return;
      if(!res.ok||result?.ok!==true||typeof result.answer!=='string'||!result.answer.trim())
        throw Error(res.status===429?'Tutor rate limit reached. Your other lessons remain accessible.':
          res.status===403?'Tutor access could not be verified for this account.':
          res.status===401?'Member session expired.':result?.error||'No verified Tutor explanation is available.');
      setChat(x=>[...x,{id:crypto.randomUUID(),who:'talia',text:result.answer.slice(0,7000),label:result.generation||'source-grounded'}]);
      setReasoning('');setAttempts(n=>n+1);
      setStatus(currentSave?(result.historySaved?'Saved to the existing private Tutor history.':'Response displayed, but private saving was not confirmed.'):
        'Response displayed in this tab only. No model request, grade or saved history was created by this interface.');
    }catch(err){
      if(version===epoch.current&&identity.current===targetId)setStatus(controller.signal.aborted?
        'Stopped waiting. The server may still have processed this request; no automatic paid retry will occur.':
        err instanceof Error?err.message:'Tutor request unavailable.');
    }finally{
      if(version===epoch.current&&identity.current===targetId){setBusy(false);pending.current=null}
    }
  };
  const newConversation=async()=>{
    if(!member||busy)return;
    const title=window.prompt('Private conversation title (maximum 80 characters):','Learning session');
    if(title===null)return;
    if(title.trim().length<1||title.trim().length>80){setStatus('Use 1–80 characters for the conversation title.');return}
    const uid=member.id,version=epoch.current;
    try{
      const access=await getToken();if(!access)throw Error('Session expired.');
      const res=await fetch('/api/member-tutor-conversations',{method:'POST',cache:'no-store',
        headers:{authorization:'Bearer '+access,'content-type':'application/json'},body:JSON.stringify({title:title.trim()})});
      const data=await res.json().catch(()=>null);
      if(version!==epoch.current||identity.current!==uid)return;
      if(!res.ok||!data?.ok||typeof data.id!=='string')throw Error('Private conversation storage is unavailable for this membership.');
      setConversationId(data.id);setConversationLabel(title.trim());setChat(DEFAULT);setSave(true);
      setStatus('Private conversation created. Only server-verified saved turns can supply verified follow-up context.');
    }catch(e){if(version===epoch.current)setStatus(e instanceof Error?e.message:'Unable to create private conversation.')}
  };
  const loadHistory=async()=>{
    if(!member||busy)return;
    const uid=member.id,version=epoch.current;
    try{
      const access=await getToken();if(!access)throw Error('Session expired.');
      const res=await fetch('/api/member-tutor-history',{cache:'no-store',headers:{authorization:'Bearer '+access}});
      const data=await res.json().catch(()=>null);
      if(version!==epoch.current||identity.current!==uid)return;
      if(!res.ok||!data?.ok||!Array.isArray(data.history))throw Error('Private Tutor history is not available.');
      const rows=data.history.slice(-30).reverse().flatMap((item:{id?:string;question?:string;answer?:string})=>[
        {id:String(item.id||crypto.randomUUID())+'-q',who:'member' as const,text:String(item.question||'').slice(0,450)},
        {id:String(item.id||crypto.randomUUID())+'-a',who:'talia' as const,text:String(item.answer||'').slice(0,7000),label:'Previously saved'}]);
      setChat([DEFAULT[0],...rows]);setConversationId(null);setConversationLabel('');
      setStatus(rows.length/2+' previously saved Tutor exchanges loaded for display only. New replies remain separate unless you select private saving.');
    }catch(e){if(version===epoch.current)setStatus(e instanceof Error?e.message:'Unable to load history.')}
  };
  const safeSuggest=useCallback((q:string)=>{setQuestion(q.slice(0,450));setStatus('Review the suggested question, then send it to Talia.');},[]);
  const latestExchange=chat.length>=3&&chat[chat.length-1]?.who==='talia'?
    [...chat].reverse().find(line=>line.who==='member')?.text||'the current topic':'the current topic';
  const continueLesson=(kind:'clarify'|'challenge'|'transfer')=>{
    const subject=latestExchange.slice(0,170);
    if(kind==='clarify'){
      setMode('explain');safeSuggest('Continue our previous lesson about '+subject+'. Explain one difficult part more clearly, using a distinct fictional example. Do not assume I understood.');
    }else if(kind==='challenge'){
      setMode('question');safeSuggest('Continue our previous lesson about '+subject+'. Ask ONE evidence-based diagnostic question and wait for my attempt before correcting.');
    }else{
      setMode('practice');safeSuggest('Continue our previous lesson about '+subject+'. Give a different fictional transfer case and invite NO TRADE as an option; do not grade.');
    }
  };
  if(!member)return <main className="tc-main" aria-label="Talia membership access">
    <div className="tc-top"><div><p className="tc-eyebrow">THE STOCK MARKET: FROM THE GROUND UP / MEMBER TUTOR</p>
      <h1>Talia Interactive Classroom</h1><p>{status}</p>
      <p>The interactive chart, conversations and private study functions are available only to verified members. No personal API key is required.</p>
      <p><a href={'/signin.html?next='+encodeURIComponent(window.location.pathname.endsWith('/talia-tutor-prototype.html')?'/talia-tutor-prototype.html':'/talia-classroom.html')}>Sign in with your membership</a></p>
    </div></div>
  </main>;
  return <main className="tc-main">
    <div className="tc-top"><div><p className="tc-eyebrow">THE STOCK MARKET: FROM THE GROUND UP / TUTOR</p><h1>Talia Interactive Classroom</h1><p>Talk through a concept. Inspect a fictional chart. Practice your reasoning. Learn from reviewed explanations.</p></div><div className="tc-row"><a href="/market-tutor.html">Classic Tutor</a><a href="/labs.html">Labs</a><a href="/bootcamp-academy.html">Boot Camps</a></div></div>
    {labHandoff&&<p className="tc-muted" role="note">Lab context: {labHandoff.id} · {labHandoff.stage}. Only the public registered Lab ID and learning stage are sent to Talia. Your assessment answers and progress remain in the Lab. <a href={'/labs.html?q='+encodeURIComponent(labHandoff.id)}>Return to Lab</a></p>}
    <div className="tc-grid"><section className="tc-chat" aria-labelledby="tc-chat-title">
      <div className="tc-chat-top"><div><h2 id="tc-chat-title">Conversation with Talia</h2><p className="tc-muted">{conversationLabel||'Source-grounded member session · AI provider disabled'}</p></div><span className="tc-pill">{member?'SIGNED IN':'MEMBER SIGN-IN REQUIRED'}</span></div>
      <ol className="tc-transcript" ref={log} role="log" aria-label="Talia conversation transcript" aria-live="polite" aria-relevant="additions">
        {chat.map(m=><li className={'tc-message tc-'+m.who} key={m.id}><strong>{m.who==='talia'?'Talia Mercer':'You'}</strong><p>{m.text}</p>{m.label&&<small>{m.label}</small>}</li>)}
      </ol>
      {busy&&<p className="tc-wait" role="status">Talia is preparing the explanation… <button type="button" onClick={()=>pending.current?.abort()}>Stop</button></p>}
      <div className="tc-chipbar" aria-label="Example questions">
        {EXAMPLES.map(item=><button type="button" key={item} onClick={()=>safeSuggest(item)}>{item}</button>)}
      </div>
      {window.location.pathname.endsWith('/talia-tutor-prototype.html')&&<section className="tp-instruction-engine" aria-label="Six-phase guided lesson">
        <div className="tp-instruction-header"><div><strong>Guided lesson pathway</strong><p>Instructor-directed practice, not a grade or verified mastery record.</p></div><span>{attempts} Tutor exchanges in this session</span></div>
        <div className="tp-instruction-controls">
          <label>Current study focus<input value={sessionTopic} maxLength={90} onChange={e=>setSessionTopic(e.target.value)} aria-label="Current study focus"/></label>
          <label>Practice dimension<select value={dimension} onChange={e=>setDimension(e.target.value as typeof dimension)}>
            <option>Knowledge</option><option>Recognition</option><option>Decision</option><option>Process</option>
          </select></label>
        </div>
        <div className="tp-instruction-steps" role="group" aria-label="Instruction phases">
          {phases.map((p,i)=><button type="button" key={p} aria-pressed={phase===p} onClick={()=>preparePhase(p)} disabled={busy}><span>{String(i+1).padStart(2,'0')}</span>{p}</button>)}
        </div>
        <p className="tc-muted">Current instructional lens: {dimension}. Select a phase to prepare an editable question. Only the existing authenticated Tutor API can provide the explanation; this prototype does not assign scores.</p>
      </section>}
      {window.location.pathname.endsWith('/talia-tutor-prototype.html')&&chat.length>=3&&chat[chat.length-1]?.who==='talia'&&
        <section className="tp-followup" aria-label="Continue the current learning session">
          <strong>Continue this lesson</strong>
          <p className="tc-muted">Choose how Talia should build on the conversation. You can edit the question before submitting it.</p>
          <div className="tc-row">
            <button type="button" className="tc-secondary" onClick={()=>continueLesson('clarify')} disabled={busy}>Explain it another way</button>
            <button type="button" className="tc-secondary" onClick={()=>continueLesson('challenge')} disabled={busy}>Check my understanding</button>
            <button type="button" className="tc-secondary" onClick={()=>continueLesson('transfer')} disabled={busy}>Practice a new scenario</button>
          </div>
          <p className="tc-muted">For verified server-side follow-up context, create or select an authorized private conversation and enable saving.</p>
        </section>}
      {window.location.pathname.endsWith('/talia-tutor-prototype.html')&&<section className="tp-teaching-loop" aria-label="Progressive ungraded instructional pathway">
        <div className="tp-teaching-loop-heading"><strong>Guided learning cycle</strong><span>Choose a phase; review the prepared question and submit it to the authenticated Tutor.</span></div>
        <div className="tp-teaching-loop-actions">
          <button type="button" className="tc-secondary" onClick={()=>{setMode('explain');safeSuggest('Teach this concept from first principles with a fully worked fictional example and describe the observable evidence.')}}>1 · Explain & demonstrate</button>
          <button type="button" className="tc-secondary" onClick={()=>{setMode('question');safeSuggest('Ask me one ungraded diagnostic question about the current concept. Withhold the explanation until I attempt an answer.')}}>2 · Diagnose understanding</button>
          <button type="button" className="tc-secondary" onClick={()=>{setMode('review');safeSuggest('Identify a misconception in my reasoning, explain why it fails using completed evidence, and guide me toward a correction without giving a protected answer key.')}}>3 · Correct reasoning</button>
          <button type="button" className="tc-secondary" onClick={()=>{setMode('practice');safeSuggest('Give me a new fictional transfer scenario requiring an independent decision, including NO TRADE as an option. Do not grade it.')}}>4 · Independent transfer</button>
        </div>
        <p className="tc-muted">Ungraded teaching aid. These prompts do not advance a Lab stage, generate mastery credits, or record a protected assessment.</p>
      </section>}
      <form onSubmit={send} className="tc-composer">
        <label htmlFor="tc-question">Your question or follow-up</label>
        <textarea id="tc-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={450} rows={3} placeholder="Ask Talia to explain a concept, show an example, or clarify a mistake" disabled={!member||busy}/>
        <div className="tc-row"><label htmlFor="tc-mode">Teaching mode</label>
          <select id="tc-mode" value={mode} onChange={e=>setMode(e.target.value as Mode)} disabled={!member||busy}>
            <option value="explain">Explain concept</option><option value="question">Guided self-check</option>
            <option value="review">Review reasoning (ungraded)</option><option value="practice">Recommend practice</option>
          </select><span className="tc-muted">{question.length}/450</span>
        </div>
        {mode==='review'&&<><label htmlFor="tc-reasoning">Your reasoning (ungraded)</label>
          <textarea id="tc-reasoning" value={reasoning} onChange={e=>setReasoning(e.target.value)} maxLength={1800} rows={3} disabled={!member||busy}/></>}
        <div className="tc-row tc-row-between">
          <label className="tc-check"><input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)} disabled={!member||busy}/> Save responses to private Tutor history</label>
          <button type="submit" disabled={!member||busy||question.trim().length<4}>Ask Talia</button>
        </div>
        {!member&&<p><a href={'/signin.html?next='+encodeURIComponent(window.location.pathname.endsWith('/talia-tutor-prototype.html')?'/talia-tutor-prototype.html':'/talia-classroom.html')}>Sign in to use the member classroom</a></p>}
      </form>
      <p className="tc-status" role="status" aria-live="polite">{status}</p>
      <div className="tc-row tc-actions">
        <button type="button" className="tc-secondary" onClick={()=>{pending.current?.abort();setChat(DEFAULT);setConversationId(null);setConversationLabel('');setSave(false);setStatus('Current view cleared. Saved history was not deleted.')}}>New unsaved topic</button>
        <button type="button" className="tc-secondary" onClick={()=>void newConversation()} disabled={!member||busy}>Create private conversation</button>
        <button type="button" className="tc-secondary" onClick={()=>void loadHistory()} disabled={!member||busy}>Load my saved history</button>
      </div>
      <p className="tc-muted">This classroom uses the existing authenticated Tutor API and approved source materials. It does not use paid model inference, award grades, access protected answer keys, or send future market bars. Saved follow-up context is verified only when the server confirms the member-owned conversation.</p>
    </section><FictionalChart onQuestion={safeSuggest} memberId={member.id}/></div>
  </main>;
}
const host=document.getElementById('talia-classroom-root');if(host)createRoot(host).render(<Classroom/>);

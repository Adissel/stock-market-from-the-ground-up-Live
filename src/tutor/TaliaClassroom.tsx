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
function FictionalChart({onQuestion}:{onQuestion:(q:string)=>void}){
  const host=useRef<HTMLDivElement|null>(null);
  const [visible,setVisible]=useState(7);
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
        plot.setOption({
          animation:false,backgroundColor:'transparent',
          grid:{top:24,left:50,right:18,bottom:42},
          xAxis:{type:'category',data:REPLAY.slice(0,visible).map((_,i)=>'Bar '+(i+1)),axisLabel:{color:'#a4b7c9'},axisLine:{lineStyle:{color:'#536578'}}},
          yAxis:{scale:true,type:'value',axisLabel:{color:'#a4b7c9'},splitLine:{lineStyle:{color:'#34465a',opacity:0.35}}},
          tooltip:{trigger:'item',formatter:(x:{dataIndex:number})=>{
            const r=REPLAY[x.dataIndex];return r?'Fictional bar '+(x.dataIndex+1)+' | O '+r[0]+' H '+r[3]+' L '+r[2]+' C '+r[1]:'';
          }},
          series:[{type:'candlestick',name:'Fictional completed bars',
            data:REPLAY.slice(0,visible),itemStyle:{color:'#38c6a6',color0:'#e37779',borderColor:'#38c6a6',borderColor0:'#e37779'}}]
        });
        plot.on('click',e=>{
          const i=Number(e.dataIndex);
          if(Number.isInteger(i)&&i>=0&&i<visible){
            onQuestion('Explain how to interpret fictional completed candle '+(i+1)+' using only its OHLC and preceding visible context. Do not predict a future bar.');
          }
        });
        window.addEventListener('resize',resize);
        setStatus(visible+' of '+REPLAY.length+' fictional completed bars are currently visible.');
      }catch{if(!disposed)setStatus('Chart unavailable; the completed-candle table remains available.')}
    };
    void mount();
    return ()=>{disposed=true;window.removeEventListener('resize',resize);plot?.dispose()};
  },[visible,onQuestion]);
  const latest=REPLAY[visible-1];
  return <section className="tc-chart-panel" aria-label="Optional fictional completed-candle teaching chart">
    <div className="tc-row tc-row-between"><h2>Chart classroom</h2><span className="tc-pill">FICTIONAL / NO LOOKAHEAD</span></div>
    <p>Inspect only the candles revealed at the current exercise boundary. This is not a market feed or a graded historical replay.</p>
    <div className="tc-chart" ref={host} role="img" aria-label={'Fictional price chart showing '+visible+' completed candlesticks'} />
    <p className="tc-muted" role="status">{status}</p>
    <table className="tc-candle-table"><caption>Latest visible completed candle</caption>
      <thead><tr><th>Bar</th><th>Open</th><th>High</th><th>Low</th><th>Close</th></tr></thead>
      <tbody><tr><td>{visible}</td><td>{latest[0].toFixed(2)}</td><td>{latest[3].toFixed(2)}</td><td>{latest[2].toFixed(2)}</td><td>{latest[1].toFixed(2)}</td></tr></tbody>
    </table>
    <div className="tc-row">
      <button type="button" onClick={()=>setVisible(v=>Math.min(REPLAY.length,v+1))} disabled={visible===REPLAY.length}>Reveal next fictional bar</button>
      <button type="button" className="tc-secondary" onClick={()=>setVisible(7)} disabled={visible===7}>Reset</button>
      <button type="button" className="tc-secondary" onClick={()=>onQuestion('Teach me to interpret completed fictional bar '+visible+' without using later candles.')}>Ask Talia about this candle</button>
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
  const [status,setStatus]=useState('Verifying member sign-in...');
  const epoch=useRef(0),pending=useRef<AbortController|null>(null);
  const log=useRef<HTMLOListElement|null>(null);
  const client=useRef<AuthClient|null>(null);
  const identity=useRef<string|null>(null);
  const reset=useCallback((id:string|null)=>{
    epoch.current++;pending.current?.abort();pending.current=null;
    identity.current=id;setMember(null);setChat(DEFAULT);
    setConversationId(null);setConversationLabel('');setSave(false);
    setReasoning('');setBusy(false);setStatus(id?'Member identity changed. Verifying the new session...':'Signed out. Private Tutor content was cleared.');
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
        body:JSON.stringify({question:q,mode,learnerAnswer:reasoning.trim().slice(0,1800),
          requestId:crypto.randomUUID(),allowModel:false,saveHistory:currentSave,conversationId:thread})});
      const result=await res.json().catch(()=>null);
      if(controller.signal.aborted||version!==epoch.current||identity.current!==targetId)return;
      if(!res.ok||result?.ok!==true||typeof result.answer!=='string'||!result.answer.trim())
        throw Error(res.status===429?'Tutor rate limit reached. Your other lessons remain accessible.':
          res.status===403?'Tutor access could not be verified for this account.':
          res.status===401?'Member session expired.':result?.error||'No verified Tutor explanation is available.');
      setChat(x=>[...x,{id:crypto.randomUUID(),who:'talia',text:result.answer.slice(0,7000),label:result.generation||'source-grounded'}]);
      setReasoning('');
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
  if(!member)return <main className="tc-main" aria-label="Talia membership access">
    <div className="tc-top"><div><p className="tc-eyebrow">THE STOCK MARKET: FROM THE GROUND UP / MEMBER TUTOR</p>
      <h1>Talia Interactive Classroom</h1><p>{status}</p>
      <p>The interactive chart, conversations and private study functions are available only to verified members. No personal API key is required.</p>
      <p><a href={'/signin.html?next='+encodeURIComponent('/talia-classroom.html')}>Sign in with your membership</a></p>
    </div></div>
  </main>;
  return <main className="tc-main">
    <div className="tc-top"><div><p className="tc-eyebrow">THE STOCK MARKET: FROM THE GROUND UP / TUTOR</p><h1>Talia Interactive Classroom</h1><p>Talk through a concept. Inspect a fictional chart. Practice your reasoning. Learn from reviewed explanations.</p></div><div className="tc-row"><a href="/market-tutor.html">Classic Tutor</a><a href="/labs.html">Labs</a><a href="/bootcamp-academy.html">Boot Camps</a></div></div>
    <div className="tc-grid"><section className="tc-chat" aria-labelledby="tc-chat-title">
      <div className="tc-chat-top"><div><h2 id="tc-chat-title">Conversation with Talia</h2><p className="tc-muted">{conversationLabel||'Source-grounded member session · AI provider disabled'}</p></div><span className="tc-pill">{member?'SIGNED IN':'MEMBER SIGN-IN REQUIRED'}</span></div>
      <ol className="tc-transcript" ref={log} role="log" aria-label="Talia conversation transcript" aria-live="polite" aria-relevant="additions">
        {chat.map(m=><li className={'tc-message tc-'+m.who} key={m.id}><strong>{m.who==='talia'?'Talia Mercer':'You'}</strong><p>{m.text}</p>{m.label&&<small>{m.label}</small>}</li>)}
      </ol>
      {busy&&<p className="tc-wait" role="status">Talia is preparing the explanation… <button type="button" onClick={()=>pending.current?.abort()}>Stop</button></p>}
      <div className="tc-chipbar" aria-label="Example questions">
        {EXAMPLES.map(item=><button type="button" key={item} onClick={()=>safeSuggest(item)}>{item}</button>)}
      </div>
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
        {!member&&<p><a href={'/signin.html?next='+encodeURIComponent('/talia-classroom.html')}>Sign in to use the member classroom</a></p>}
      </form>
      <p className="tc-status" role="status" aria-live="polite">{status}</p>
      <div className="tc-row tc-actions">
        <button type="button" className="tc-secondary" onClick={()=>{pending.current?.abort();setChat(DEFAULT);setConversationId(null);setConversationLabel('');setSave(false);setStatus('Current view cleared. Saved history was not deleted.')}}>New unsaved topic</button>
        <button type="button" className="tc-secondary" onClick={()=>void newConversation()} disabled={!member||busy}>Create private conversation</button>
        <button type="button" className="tc-secondary" onClick={()=>void loadHistory()} disabled={!member||busy}>Load my saved history</button>
      </div>
      <p className="tc-muted">This classroom uses the existing authenticated Tutor API and approved source materials. It does not use paid model inference, award grades, access protected answer keys, or send future market bars. Saved follow-up context is verified only when the server confirms the member-owned conversation.</p>
    </section><FictionalChart onQuestion={safeSuggest}/></div>
  </main>;
}
const host=document.getElementById('talia-classroom-root');if(host)createRoot(host).render(<Classroom/>);

/* Five nearest-to-finish study records. This is saved-reflection progress,
   not an achievement, graded score or Lumen reward entitlement. */
(()=>{'use strict';const root=document.querySelector('[data-academy-study-progress]');if(!root)return;
const plans=[['truth5','Truth Behind the Ticker',5],['watchlist7','Watchlist',7],
 ['scanners10','Scanners',10],['charts45','Chart Reading',45],
 ['risk60','Risk and Execution',60],['practicum90','Advanced Practicum',90],
 ['tape10','Reading the Tape',10],['indicators10','Technical Indicators',10],
 ['filings7','SEC Filings',7]];
const el=(tag,text)=>{const v=document.createElement(tag);v.textContent=text;return v};
(async()=>{
 root.replaceChildren(el('p','Checking saved Academy study activity…'));
 try{
  const sb=await window.getSupabaseClient(),{data:{session}}=await sb.auth.getSession();
  if(!session?.access_token)throw Error('Not signed in');
  const records=await Promise.all(plans.map(async ([code,name,days])=>{
   try{
    const r=await fetch('/api/bootcamp-academy?program='+encodeURIComponent(code),
     {headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
    if(!r.ok)return null;const x=await r.json();
    if(x.ok!==true||x.progressAvailable!==true||!Array.isArray(x.progress))return null;
    const count=x.progress.filter(y=>y.status==='reflection_saved').length;
    if(count===0||count>=days)return null;
    return {code,name,days,count,pct:Math.floor(count*100/days)};
   }catch{return null}
  }));
  const current=await sb.auth.getSession();
  if(current.data?.session?.user?.id!==session.user.id)throw Error('Account changed');
  const items=records.filter(Boolean).sort((a,b)=>b.pct-a.pct||b.count-a.count).slice(0,5);
  root.replaceChildren(el('h3','Closest to finishing saved Academy reflections'));
  if(!items.length){root.append(el('p','No eligible in-progress Academy reflection records could be verified.'));return}
  for(const x of items){
   const row=el('div','');row.className='academy-progress-mini';
   const link=el('a',x.name);link.href='bootcamp-academy.html?program='+encodeURIComponent(x.code);
   const count=el('p',x.pct+'% of daily reflections saved ('+x.count+'/'+x.days+')');
   const bar=document.createElement('progress');bar.max=x.days;bar.value=x.count;
   bar.setAttribute('aria-label',x.name+' saved reflections');
   row.append(count,link,bar);root.append(row);
  }
  root.append(el('p','Study-reflection progress is ungraded and does not establish completion or earned Lumens.'));
 }catch{root.replaceChildren(el('p','Academy progress unavailable. No completion can be verified.'))}
})();
})();
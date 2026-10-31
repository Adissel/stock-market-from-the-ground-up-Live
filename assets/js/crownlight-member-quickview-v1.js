/* Sitewide member Quick Wallet and Dashboard learning + ledger details.
 * Authoritative reads only; saved stage progress never implies mastery/rewards.
 */
(()=>{'use strict';
const h=(tag,txt,cls)=>{const el=document.createElement(tag);if(txt!==undefined)el.textContent=txt;if(cls)el.className=cls;return el};
const walletUrl='/dashboard.html?tab=wallet';
let client=null,actor=null,started=false,progress=null;
const known=new Set(['lab','bootcamp']);
function link(text,href){const a=h('a',text);a.href=href;return a}
function wipe(){
 actor=null;progress=null;
 document.querySelectorAll('[data-crownlight-quick-progress]').forEach(e=>e.remove());
 const target=document.querySelector('[data-academy-study-progress]');
 if(target)target.replaceChildren(h('p','Sign in to review saved Lab and Boot Camp progress.'));
 const history=document.querySelector('[data-member-lumen-history]');
 if(history)history.replaceChildren(h('p','Sign in to view private Lumen transactions.'));
 const integrity=document.querySelector('[data-member-lumen-integrity]');
 if(integrity)integrity.replaceChildren(h('p','Sign in to verify your Lumen wallet.'));
}
function renderRows(root,items,label){
 root.replaceChildren();
 root.append(h('h3',label));
 if(!items.length){root.append(h('p','No started, incomplete Lab or Boot Camp progress could be verified.'));return}
 for(const item of items){
  if(!known.has(item.type)||!Number.isSafeInteger(item.percent)||item.percent<0||item.percent>99)continue;
  const block=h('div',undefined,'gu-quick-study-item');
  const pct=h('strong',item.percent+'%', 'gu-quick-study-percent');
  const bar=document.createElement('progress');bar.max=100;bar.value=item.percent;
  bar.setAttribute('aria-label',item.name+': '+item.percent+'% saved study progress');
  const name=link(item.name,item.href);
  const desc=h('small',item.metric+' · '+(item.type==='lab'?'Stage '+item.step+' of '+item.total:
   item.step+' of '+item.total+' reflections saved'));
  block.append(pct,bar,name,desc);root.append(block);
 }
 root.append(h('p','Progress represents saved study activity, not approved grading or a Lumen award.','small'));
}
function mountProgress(){
 const target=document.querySelector('[data-academy-study-progress]');
 if(target&&progress?.ok===true)renderRows(target,progress.items||[],'Closest to completion · Labs and Boot Camps');
 const popup=document.querySelector('.gu-nav-sparks-popup');
 if(!popup||!actor)return;
 let section=popup.querySelector('[data-crownlight-quick-progress]');
 if(!section){section=h('section',undefined,'gu-nav-quick-progress');section.dataset.crownlightQuickProgress='1';popup.prepend(section)}
 if(progress?.ok===true)renderRows(section,progress.items||[],'Closest study progress');
 else section.replaceChildren(h('p','Learning progress is temporarily unavailable.'));
 for(const a of popup.querySelectorAll('a'))if(a.textContent?.includes('How to use'))a.href=walletUrl;
}
async function fetchSecured(path,token){
 const r=await fetch(path,{headers:{authorization:'Bearer '+token},cache:'no-store'});
 if(!r.ok)throw Error('Private data unavailable');
 return r.json();
}
async function refreshProgress(){
 if(!client)return;
 const {data:{session}}=await client.auth.getSession();
 if(!session?.access_token||!session?.user?.id){wipe();return}
 const id=session.user.id;
 try{
  const j=await fetchSecured('/api/member-learning-quick-view',session.access_token);
  const now=await client.auth.getSession();
  if(now.data?.session?.user?.id!==id){wipe();return}
  actor=id;progress=j;mountProgress();
 }catch{
  if(actor&&actor!==id){wipe();return}
  actor=id;progress={ok:false};mountProgress();
 }
}
function showHistory(root,items,more){
 root.replaceChildren(h('h3','Recent Lumen wallet activity'));
 if(!items.length){root.append(h('p','No wallet transactions recorded.'));return}
 const ul=h('ul',undefined,'gu-wallet-activity-items');
 for(const row of items){
  if(!Number.isSafeInteger(row.lumens)||typeof row.description!=='string')continue;
  const li=h('li');
  const label=h('span',row.description);
  const num=h('strong',(row.lumens>0?'+':'')+row.lumens+' Lumens');
  const date=h('small',row.occurredAt?new Date(row.occurredAt).toLocaleDateString():'Date unavailable');
  li.append(label,num,date);ul.append(li);
 }
 root.append(ul);
 if(more)root.append(h('p','Showing the newest 30 ledger events.','small'));
 root.append(h('p','These are Lumen ledger events, not cash receipts or transfer confirmations.','small'));
}
async function refreshHistory(){
 const root=document.querySelector('[data-member-lumen-history]');
 if(!root||!client)return;
 const {data:{session}}=await client.auth.getSession();
 if(!session?.access_token){root.replaceChildren(h('p','Sign in to view wallet activity.'));return}
 const uid=session.user.id;
 try{
  const j=await fetchSecured('/api/member-lumen-activity',session.access_token);
  const b=await client.auth.getSession();
  if(b.data?.session?.user?.id!==uid){wipe();return}
  if(j.ok!==true||!Array.isArray(j.events))throw Error('History unavailable');
  showHistory(root,j.events,j.hasMore);
 }catch{root.replaceChildren(h('p','Wallet activity unavailable; no transaction totals are assumed.'))}
}
async function refreshIntegrity(){
 const history=document.querySelector('[data-member-lumen-history]');
 if(!history||!client)return;
 let section=document.querySelector('[data-member-lumen-integrity]');
 if(!section){section=h('section',undefined,'gu-wallet-integrity');section.dataset.memberLumenIntegrity='1';
   section.setAttribute('aria-live','polite');history.before(section)}
 const {data:{session}}=await client.auth.getSession();
 if(!session?.access_token){section.replaceChildren(h('p','Sign in to verify wallet integrity.'));return}
 const uid=session.user.id;
 try{
  const j=await fetchSecured('/api/member-lumen-integrity',session.access_token);
  const now=await client.auth.getSession();
  if(now.data?.session?.user?.id!==uid){wipe();return}
  if(j.ok!==true||!Number.isSafeInteger(j.available)||typeof j.balanced!=='boolean')
   throw Error('Unverified wallet status');
  const note=j.balanced?
   'Lumen balance reconciled to your current authoritative wallet ledger.':
   'Wallet reconciliation needs review; no balance is assumed settled.';
  const detail=j.openDisputes>0?' Open gift disputes: '+j.openDisputes+'.':'';
  section.replaceChildren(h('p',note+detail));
  section.dataset.ledgerVerified=j.balanced?'true':'false';
 }catch{
  section.replaceChildren(h('p','Wallet reconciliation is temporarily unavailable.'));
  section.dataset.ledgerVerified='unavailable';
 }
}
async function init(){
 if(started)return;started=true;
 for(let i=0;i<32&&!client;i++){
  try{if(typeof window.getSupabaseClient==='function')client=await window.getSupabaseClient()}catch{}
  if(!client)await new Promise(done=>setTimeout(done,150));
 }
 if(!client||typeof client.auth?.getSession!=='function'||typeof client.auth?.onAuthStateChange!=='function')return;
 client.auth.onAuthStateChange((event,session)=>{
  if(event==='SIGNED_OUT'||(actor&&session?.user?.id!==actor))wipe();
  if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED')setTimeout(()=>{void refreshProgress();void refreshHistory();void refreshIntegrity()},150);
 });
 void refreshProgress();void refreshHistory();void refreshIntegrity();
 setInterval(()=>{if(!document.hidden)void refreshProgress()},45000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){void refreshProgress();void refreshHistory();void refreshIntegrity()}});
 new MutationObserver(()=>{if(actor&&progress?.ok===true&&document.querySelector('.gu-nav-sparks-popup')&&!document.querySelector('[data-crownlight-quick-progress]'))mountProgress()})
 .observe(document.querySelector('.site-header')||document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else void init();
})();
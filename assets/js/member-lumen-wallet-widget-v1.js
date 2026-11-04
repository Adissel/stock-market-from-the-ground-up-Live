/* Member Dashboard Lumens: read-only authoritative balance, session-scoped.
 * Supports the approved static Dashboard layout and optional compact widget.
 * No credit grants, checkout, transfer or other balance-changing operation.
 */
(()=>{'use strict';
const mount=document.querySelector('[data-member-lumen-wallet]');
const dashboard=document.getElementById('member-sparks-wallet');
if(!mount&&!dashboard)return;
const el=(tag,txt)=>{const e=document.createElement(tag);e.textContent=txt;return e};
const set=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=String(value)};
let sb=null,epoch=0,authUser=null;
const clear=(message)=>{
 authUser=null;
 if(mount)mount.replaceChildren(el('p',message));
 set('sparks-wallet-total','—');
 set('sparks-wallet-included','—');
 set('sparks-wallet-purchased','—');
 set('sparks-wallet-manual','—');
 set('sparks-wallet-expiry','—');
 set('sparks-wallet-status',message);
};
const valid=n=>Number.isSafeInteger(n)&&n>=0&&n<=1000000000;
const nextExpiry=x=>{
 if(typeof x!=='string'||!Number.isFinite(Date.parse(x)))return 'No upcoming expiration recorded for current buckets';
 return new Date(x).toLocaleDateString();
};
async function render(){
 const generation=++epoch;
 if(dashboard)set('sparks-wallet-status','Verifying your private Lumens wallet…');
 if(mount)mount.replaceChildren(el('p','Checking your Crownlight Lumens wallet…'));
 try{
  if(!sb)throw Error('Member client unavailable');
  const {data:{session}}=await sb.auth.getSession();
  if(generation!==epoch)return;
  if(!session?.access_token||!session.user?.id){clear('Sign in to see your Lumens.');return}
  const id=session.user.id;
  const response=await fetch('/api/member-sparks-balance',{
   headers:{authorization:'Bearer '+session.access_token},
   cache:'no-store'});
  if(!response.ok)throw Error('Member wallet service unavailable');
  const r=await response.json();
  const current=(await sb.auth.getSession()).data?.session;
  if(generation!==epoch)return;
  if(current?.user?.id!==id){clear('Account changed. Sign in again to verify your wallet.');return}
  const w=r.wallet||{};
  if(r.ok!==true||!['available','included','purchased','manual'].every(k=>valid(w[k]))||
      w.included+w.purchased+w.manual!==w.available)
   throw Error('Unreconciled wallet: no balance may be shown');
  authUser=id;
  set('sparks-wallet-total',w.available.toLocaleString());
  set('sparks-wallet-included',w.included.toLocaleString());
  set('sparks-wallet-purchased',w.purchased.toLocaleString());
  set('sparks-wallet-manual',w.manual.toLocaleString());
  set('sparks-wallet-expiry',nextExpiry(w.nextExpiry));
  set('sparks-wallet-status','Your private Crownlight Lumens balance is verified.');
  if(mount){
   const title=el('h3','Crownlight Lumens');
   const amount=el('p',w.available.toLocaleString()+' Lumens available');
   amount.className='gu-lumen-wallet-balance';
   const breakdown=el('p','Included: '+w.included+' · Purchased: '+w.purchased+
    ' · Other issued: '+w.manual+' Lumens');
   breakdown.className='small';
   const note=el('p','Lumens have no cash-out value; this is your single verified member wallet.');
   const links=el('p','');
   const details=el('a','How to use & wallet details');details.href='/dashboard.html?tab=wallet';
   const shop=el('a','Lumen Store');shop.href='/store-sparks.html';
   links.append(details,document.createTextNode(' · '),shop);
   mount.replaceChildren(title,amount,breakdown,note,links);
  }
 }catch{
  if(generation===epoch)clear('Wallet data is unavailable. No balance is assumed.');
 }
}
async function init(){
 try{
  if(typeof window.getSupabaseClient!=='function')throw Error('Member client missing');
  sb=await window.getSupabaseClient();
  if(!sb?.auth?.getSession||!sb?.auth?.onAuthStateChange)throw Error('Member auth missing');
  sb.auth.onAuthStateChange(event=>{
   if(event==='SIGNED_OUT'){++epoch;clear('Sign in to see your Lumens.')}
   else if(['SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event))
    setTimeout(()=>{void render()},0);
  });
  void render();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)void render()});
  setInterval(()=>{if(!document.hidden)void render()},45000);
 }catch{clear('Wallet data is unavailable. No balance is assumed.')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{void init()},{once:true});
else void init();
})();
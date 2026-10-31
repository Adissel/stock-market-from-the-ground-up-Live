/* Read-only Lumen wallet for the member dashboard. No grants, debits or transfers. */
(()=>{'use strict';
const mount=document.querySelector('[data-member-lumen-wallet]');
if(!mount)return;
const p=(tag,txt)=>{const e=document.createElement(tag);e.textContent=txt;return e};
async function render(){
 mount.replaceChildren(p('p','Checking your Crownlight Lumens wallet…'));
 try{
  if(typeof window.getSupabaseClient!=='function')throw Error('Sign-in client unavailable');
  const sb=await window.getSupabaseClient();
  const a=await sb.auth.getUser();const uid=a.data?.user?.id;
  if(!uid){mount.replaceChildren(p('p','Sign in to see your Lumens.'));return}
  const {data:{session}}=await sb.auth.getSession();
  if(!session?.access_token)throw Error('Sign-in session unavailable');
  const response=await fetch('/api/member-sparks-balance',{headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
  if(!response.ok)throw Error('Wallet unavailable');
  const r=await response.json();
  const b=await sb.auth.getUser();
  if(b.data?.user?.id!==uid){mount.replaceChildren(p('p','Account changed. Reload your wallet.'));return}
  if(r.ok!==true||!r.wallet||!Number.isSafeInteger(r.wallet.available)||r.wallet.available<0)
   throw Error('Wallet balance is unavailable');
  mount.replaceChildren();
  const title=p('h3','Crownlight Lumens');
  const balance=p('p',r.wallet.available.toLocaleString()+' Lumens available');
  balance.className='gu-lumen-wallet-balance';
  const details=p('p','Lumens have no cash-out value. The wallet uses your existing member balance.');
  const links=p('p','');
  const wallet=document.createElement('a');wallet.href='lumen-store.html';wallet.textContent='Lumen Store';
  links.append(wallet);
  mount.append(title,balance,details,links);
 }catch{mount.replaceChildren(p('p','Lumen wallet data is unavailable. No balance is assumed.'))}
}
render();
})();
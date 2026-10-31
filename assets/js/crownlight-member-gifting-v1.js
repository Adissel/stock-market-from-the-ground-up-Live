/* Crownlight member gifting form. No balance writes unless the verified
 * legal/security release switch is active on the server.
 */
(()=>{'use strict';const mount=()=>{let root=document.querySelector('[data-member-lumen-gifting]');
if(!root){const history=document.querySelector('[data-member-lumen-history]');
 if(!history)return;root=document.createElement('section');root.dataset.memberLumenGifting='1';
 root.className='wrap';root.setAttribute('aria-label','Member-to-member Lumen gifts');
 history.after(root)}
const el=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x};
const msg=el('p','Checking member gifting availability…');msg.setAttribute('role','status');
const h=el('h3','Send Lumens to another member');
root.append(h,msg);
const form=document.createElement('form');form.className='gu-lumen-gifting-form';
const label1=el('label','Recipient @username');const handle=document.createElement('input');
handle.type='text';handle.name='recipient';handle.required=true;handle.maxLength=25;
handle.placeholder='@username';handle.pattern='@[A-Za-z][A-Za-z0-9_]{2,23}';handle.autocomplete='off';
label1.append(handle);
const label2=el('label','Lumens to send (10–200)');const amount=document.createElement('input');
amount.type='number';amount.name='lumens';amount.min='10';amount.max='200';amount.step='1';amount.required=true;
label2.append(amount);
const lookup=el('button','Verify recipient');lookup.type='button';
const send=el('button','Review and send Lumens');send.type='submit';
const consent=el('label','Make my @username discoverable for member gifts');
const opt=document.createElement('input');opt.type='checkbox';consent.prepend(opt);
const optSave=el('button','Save gifting preference');optSave.type='button';
const note=el('p','Gifts have no cash-out value. Only authorized, available earned Lumens will be transferable.');
const outcome=el('p','');outcome.setAttribute('role','status');outcome.setAttribute('aria-live','polite');
form.append(label1,label2,lookup,send,consent,optSave,note,outcome);root.append(form);
let client,ready=false,verified='';
function toggle(enabled){ready=enabled;for(const x of [handle,amount,lookup,opt,optSave])x.disabled=!enabled;send.disabled=true}
toggle(false);
async function request(path,init={}){
 const {data:{session}}=await client.auth.getSession();
 if(!session?.access_token)throw Error('Sign in again to use your wallet.');
 const id=session.user.id;
 const r=await fetch(path,{cache:'no-store',...init,headers:{authorization:'Bearer '+session.access_token,
 ...(init.headers||{})}});
 const j=await r.json().catch(()=>({}));
 const fresh=await client.auth.getSession();
 if(fresh.data?.session?.user?.id!==id)throw Error('Account changed. Please reload.');
 if(!r.ok||j.ok!==true)throw Error(j.error||'This action is unavailable.');
 return j;
}
async function init(){
 try{
  client=await window.getSupabaseClient();
  const status=await request('/api/member-lumen-gifts');
  toggle(status.enabled===true);msg.textContent=status.enabled?
   'Member gifting is available for eligible accounts.':'Member-to-member gifting is in development. Transfers are not yet enabled.';
 }catch{toggle(false);msg.textContent='Gifting unavailable. Sign in to view eligibility.'}
}
lookup.addEventListener('click',async()=>{
 verified='';send.disabled=true;outcome.textContent='Checking recipient availability…';
 try{
  if(!handle.checkValidity())throw Error('Enter an exact valid @username.');
  const j=await request('/api/member-lumen-gifts?handle='+encodeURIComponent(handle.value.trim()));
  if(j.found!==true)throw Error('Recipient unavailable or has not opted in.');
  verified=j.handle;send.disabled=!ready;outcome.textContent='Verified opt-in recipient '+verified;
 }catch(e){outcome.textContent=e.message}
});
handle.addEventListener('input',()=>{verified='';send.disabled=true});
optSave.addEventListener('click',async()=>{
 outcome.textContent='Saving privacy preference…';
 try{await request('/api/member-lumen-gifts',{method:'POST',
  headers:{origin:location.origin,'content-type':'application/json'},
  body:JSON.stringify({action:'optin',discoverable:opt.checked,receivingEnabled:opt.checked})});
  outcome.textContent='Gifting preference saved.';
 }catch(e){outcome.textContent=e.message}
});
form.addEventListener('submit',async e=>{
 e.preventDefault();if(!ready||send.disabled||verified!==handle.value.trim())return;
 const n=Number(amount.value);
 if(!Number.isSafeInteger(n)||n<10||n>200){outcome.textContent='Enter 10–200 whole Lumens.';return}
 if(!window.confirm('Send '+n+' Lumens to '+verified+'? Review the recipient carefully.'))return;
 send.disabled=true;outcome.textContent='Verifying transaction…';
 try{
  const j=await request('/api/member-lumen-gifts',{method:'POST',
   headers:{origin:location.origin,'content-type':'application/json'},
   body:JSON.stringify({action:'send',recipient:verified,lumens:n,requestId:crypto.randomUUID()})});
  outcome.textContent='Confirmed transfer '+j.transactionId;verified='';window.dispatchEvent(new Event('focus'));
 }catch(e){outcome.textContent=e.message}finally{send.disabled=true}
});
void init();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();
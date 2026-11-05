/* Staff-only Talia prototype boot. All Tutor operations remain authenticated by existing APIs. */
(()=>{'use strict';
const status=document.getElementById('tp-auth'),workspace=document.getElementById('tp-workspace');
const connection=document.getElementById('tp-connection');
const fail=message=>{workspace.hidden=true;status.hidden=false;status.textContent=message;if(connection)connection.textContent='Access not verified';};
let mounted=false,checking=false,revision=0,authorizedUserId=null,authObserved=false;
const invalidate=()=>{revision++;fail('Revalidating staff session…');};
// Do not trust a previously authorized identity after auth/session events.
const observeAuth=client=>{
 if(authObserved||typeof client?.auth?.onAuthStateChange!=='function')return;
 authObserved=true;
 try{client.auth.onAuthStateChange(event=>{
  if(['SIGNED_OUT','SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event)){
   invalidate();
   if(!document.hidden)queueMicrotask(()=>void verify());
  }
 });}catch{authObserved=false;}
};
async function verify(){
 if(checking)return;checking=true;const requestRevision=revision;
 try{
  if(typeof window.getSupabaseClient!=='function')throw Error('Authentication is unavailable.');
  const client=await window.getSupabaseClient();
  observeAuth(client);
  const [sessionResult,userResult]=await Promise.all([client.auth.getSession(),client.auth.getUser()]);
  const session=sessionResult?.data?.session,user=userResult?.data?.user;
  if(!session?.access_token||!user?.id||session.user?.id!==user.id)throw Error('Sign in with an authorized staff account to access this prototype.');
  const response=await fetch('/api/admin?action=context',{headers:{authorization:'Bearer '+session.access_token,accept:'application/json'},credentials:'same-origin',cache:'no-store'});
  if(!response.ok)throw Error('Unable to verify staff permissions.');
  const context=await response.json();
  if(requestRevision!==revision)return;
  const current=await client.auth.getSession();
  if(requestRevision!==revision||!current?.data?.session?.access_token||current.data.session.user?.id!==user.id||current.data.session.access_token!==session.access_token)throw Error('Your session changed during verification.');
  const roles=Array.isArray(context.roles)?context.roles:[];
  const permissions=Array.isArray(context.permissions)?context.permissions:[];
  if(context.ok!==true||roles.includes('SHOWCASE_VIEWER')||!roles.some(role=>['OWNER','ADMIN','TECH_ADMIN'].includes(role))||!permissions.includes('control_panel.access'))throw Error('This prototype requires Owner or authorized Administrator access.');
  // Another staff identity must not inherit the first account's Tutor DOM/state.
  if(mounted&&authorizedUserId&&authorizedUserId!==user.id){
   fail('Staff identity changed. Reloading to isolate previous account data.');
   window.location.reload();return;
  }
  if(!mounted){
   mounted=true;authorizedUserId=user.id;
   const script=document.createElement('script');script.type='module';script.src='/assets/js/talia-classroom-v1.bundle.js?v=20261105-chart-tabs1';
   script.onerror=()=>{mounted=false;fail('The Tutor application could not load. Reload the page to retry.');};document.head.append(script);
  }
  status.hidden=true;workspace.hidden=false;
  if(connection)connection.textContent='Authorized staff session';
 }catch(error){fail(error?.message||'Prototype access unavailable.')}
 finally{checking=false;if(requestRevision!==revision&&!document.hidden)queueMicrotask(()=>void verify());}
}
document.addEventListener('DOMContentLoaded',()=>{
 void verify();
 window.addEventListener('focus',()=>{invalidate();void verify()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)invalidate();else void verify()});
 // Verify revocation and expiry in foreground tabs without reload/role mutation.
 const refresh=window.setInterval(()=>{if(!document.hidden)void verify()},30000);
 window.addEventListener('pagehide',()=>window.clearInterval(refresh),{once:true});
});
})();
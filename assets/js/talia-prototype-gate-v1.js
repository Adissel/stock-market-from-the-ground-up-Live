/* Staff-only Talia prototype boot. All Tutor operations remain authenticated by existing APIs. */
(()=>{'use strict';
const status=document.getElementById('tp-auth'),workspace=document.getElementById('tp-workspace');
const connection=document.getElementById('tp-connection');
const fail=message=>{workspace.hidden=true;status.hidden=false;status.textContent=message;if(connection)connection.textContent='Access not verified';};
let mounted=false,checking=false,revision=0;
const invalidate=()=>{revision++;fail('Revalidating staff session…');};
async function verify(){
 if(checking)return;checking=true;const requestRevision=revision;
 try{
  if(typeof window.getSupabaseClient!=='function')throw Error('Authentication is unavailable.');
  const client=await window.getSupabaseClient();
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
  if(!mounted){
   mounted=true;
   const script=document.createElement('script');script.type='module';script.src='/assets/js/talia-classroom-v1.bundle.js';
   script.onerror=()=>{mounted=false;fail('The Tutor application could not load. Reload the page to retry.');};document.head.append(script);
  }
  status.hidden=true;workspace.hidden=false;
  if(connection)connection.textContent='Authorized staff session';
 }catch(error){fail(error?.message||'Prototype access unavailable.')}
 finally{checking=false;}
}
document.addEventListener('DOMContentLoaded',()=>{void verify();window.addEventListener('focus',()=>{invalidate();void verify()});document.addEventListener('visibilitychange',()=>{if(document.hidden)invalidate();else void verify()})});
})();
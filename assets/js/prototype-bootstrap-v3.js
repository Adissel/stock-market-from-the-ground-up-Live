/* Minimal public launcher: only retrieves the real Prototype document after
 * verified Supabase authentication AND server OWNER/ADMIN authorization.
 * Never places credentials in query strings, links, session cookies or local drafts.
 */
(async()=>{'use strict';
 const target=document.getElementById('prototype-access-status');
 const fail=(message)=>{if(target)target.textContent=message};
 try{
  const sb=await window.getSupabaseClient?.();
  if(!sb?.auth)throw Error('Authentication service unavailable');
  const {data:{session},error}=await sb.auth.getSession();
  if(error)throw Error('Authentication session unavailable');
  if(!session?.access_token){
   const next=encodeURIComponent(location.pathname+location.search+location.hash);
   location.replace('/signin.html?next='+next);return;
  }
  const verified=await sb.auth.getUser();
  if(verified.error||!verified.data?.user||verified.data.user.id!==session.user?.id)throw Error('Session verification failed');
  const res=await fetch('/api/prototype-document',{method:'GET',
   headers:{authorization:'Bearer '+session.access_token,accept:'text/html'},cache:'no-store',credentials:'same-origin'});
  if(res.status===401||res.status===403){fail('Prototype Center access denied. An active Owner or Administrator role is required.');return}
  if(!res.ok)throw Error('Protected page unavailable ('+res.status+').');
  const markup=await res.text();
  if(!markup.includes('id="pt-app" hidden')||!markup.includes('/assets/js/prototype-center-v1.js'))throw Error('Protected page response invalid');
  document.open();document.write(markup);document.close();
 }catch(err){fail(err?.message||'Protected page unavailable');}
})();

/* Only Owner and authorized Admin users see the Prototype Center entry.
   No permissions are conferred by the link; the destination independently checks. */
(()=>{'use strict';
async function install(){
 try{
  const sb=await window.getSupabaseClient?.();if(!sb)return;
  const {data:{session}}=await sb.auth.getSession();if(!session?.access_token)return;
  const r=await fetch('/api/admin?action=context',{headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
  if(!r.ok)return;const ctx=await r.json(),roles=Array.isArray(ctx.roles)?ctx.roles:[],perms=Array.isArray(ctx.permissions)?ctx.permissions:[];
  if(!ctx.ok||roles.includes('SHOWCASE_VIEWER')||!roles.some(x=>['OWNER','ADMIN','TECH_ADMIN'].includes(x))||!perms.includes('control_panel.access'))return;
  const main=document.querySelector('main');if(!main||document.getElementById('pt-admin-shortcut'))return;
  const panel=document.createElement('div');panel.id='pt-admin-shortcut';panel.setAttribute('role','region');panel.setAttribute('aria-label','Prototype Center access');
  panel.style.cssText='padding:.65rem 1rem;margin:.7rem auto;max-width:1250px;border:1px solid #4d7183;border-radius:8px;display:flex;flex-wrap:wrap;gap:.7rem;align-items:center;justify-content:space-between';
  const summary=document.createElement('span');summary.textContent='Internal design and testing: Crownlight Prototype Center';
  const link=document.createElement('a');link.href='/prototype.html#classroom';link.textContent='Open Prototype Center';link.className='btn secondary';
  panel.append(summary,link);main.prepend(panel);
  sb.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT')panel.remove()});
 }catch{}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else void install();
})();

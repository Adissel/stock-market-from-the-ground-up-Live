(function(){
'use strict';
// Public registry is a discovery surface, not an entitlement authority.
// Server-side advanced-tool-access continues to control each workbench.
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fallback='<div class="notice" role="status"><p>The tool catalog is temporarily unavailable. Free lessons and the learning resources remain accessible.</p><p><a href="/learn.html">Learning System</a> · <a href="/lab-samples.html">Sample Labs</a> · <a href="/membership.html">Membership availability</a></p></div>';
function safeHref(value){
 try{
  const url=new URL(String(value||'membership.html'),location.origin);
  if(url.origin!==location.origin||!/^\/[A-Za-z0-9/_-]+(?:\.html)?$/.test(url.pathname))return '/membership.html';
  return url.pathname+url.search+url.hash;
 }catch{return '/membership.html'}
}
async function init(){
 const host=document.getElementById('tools-hub');
 const status=document.getElementById('tools-status');
 if(!host)return;
 host.setAttribute('aria-busy','true');
 try{
  if(typeof window.getSupabaseClient!=='function')throw Error('Client configuration unavailable.');
  const sb=await window.getSupabaseClient();
  if(!sb)throw Error('Client configuration unavailable.');
  const [catalogResult,accessResult]=await Promise.allSettled([
   sb.from('platform_tools').select('*').eq('active',true).eq('public_visible',true).order('sort_order'),
   sb.rpc('my_platform_access')
  ]);
  if(catalogResult.status!=='fulfilled'||catalogResult.value?.error)throw Error('Public registry unavailable.');
  const accessReady=accessResult.status==='fulfilled'&&!accessResult.value?.error;
  const access=accessReady?accessResult.value.data:null;
  const map=new Map((Array.isArray(access?.tools)?access.tools:[]).map(x=>[x.toolCode,x]));
  const hash=location.hash.replace(/^#/,'').toLowerCase();
  const listed=(Array.isArray(catalogResult.value.data)?catalogResult.value.data:[])
    .filter(t=>!hash||String(t.category||'').toLowerCase().replace(/\s+/g,'-').includes(hash));
  host.innerHTML=listed.length?listed.map(t=>{
   const mine=map.get(t.tool_code),allowed=!!mine?.included||t.free_preview===true;
   const cents=Number(t.individual_price_cents);
   const price=Number.isFinite(cents)&&cents>=0?'$'+(cents/100).toFixed(2)+'/month':'Check availability';
   const state=String(t.status||'unavailable');
   return '<article class="v11-tool-card" data-category="'+esc(t.category)+'">'+
    '<div class="eyebrow">'+esc(t.category)+'</div><h3>'+esc(t.name)+'</h3><p>'+esc(t.description||'')+'</p>'+
    '<div class="v11-tool-meta"><span class="v11-badge '+(state==='live'?'active':'')+'">'+esc(state.toUpperCase())+'</span>'+
    (allowed?'<span class="v11-badge active">Your Access</span>':'<span class="v11-badge">'+esc(price)+'</span>')+'</div>'+
    '<a class="btn '+(allowed?'':'secondary')+'" href="'+esc(safeHref(t.href))+'">'+
    (state==='planned'?'View Roadmap':allowed?'Open Tool':'Preview / Check Access')+'</a></article>';
  }).join(''):'<div class="notice" role="status">No public tools match this category. <a href="/membership.html">Review current availability</a>.</div>';
  if(status){
   status.textContent=!accessReady?'Public tools are shown; personal entitlements could not be verified. Sign in again or retry.':
    !access?.authenticated?'Sign in to see which tools are included with your account. Public previews remain available where labeled.':'';
  }
 }catch{
  host.innerHTML=fallback;
  if(status)status.textContent='The public tool registry could not load. Existing learning pages remain available.';
 }finally{host.removeAttribute('aria-busy')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

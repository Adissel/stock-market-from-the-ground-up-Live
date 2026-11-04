/* Crownlight Home first-paint guard v1.
 * Static Pages HTML renders before Supabase auth and the server's published
 * page-style setting have been resolved. Prevent the public/Classic homepage
 * from flashing before the verified Owner/Continuous Desk view.
 *
 * This script runs synchronously in the homepage <head>. No storage, grant,
 * billing, design publication or other user data is modified.
 */
(()=>{
 'use strict';
 const html=document.documentElement;
 if(html.dataset.clHomeFirstPaintGuard==='1')return;
 html.dataset.clHomeFirstPaintGuard='1';
 html.classList.add('cl-home-initializing');
 const sheet=document.createElement('style');
 sheet.setAttribute('data-cl-home-first-paint','1');
 sheet.textContent=`
  html.cl-home-initializing .site-header,
  html.cl-home-initializing main.gu-premium-home,
  html.cl-home-initializing .cl-page-style-livebar{visibility:hidden!important}
  html.cl-home-initializing #cl-home-initial-loading{
   display:flex!important;align-items:center;justify-content:center;
   position:fixed;left:50%;top:46%;transform:translate(-50%,-50%);
   z-index:1000;padding:14px 22px;border:1px solid #47617e;
   border-radius:10px;background:#101c32;color:#e0ecfb;
   font:600 15px/1.5 system-ui,sans-serif;text-align:center;
   box-shadow:0 12px 28px #0005;max-width:calc(100vw - 32px)
  }
 `;
 document.head.append(sheet);
 let observer=null,done=false,queued=false;
 const release=()=>{
  if(done)return;done=true;observer?.disconnect();
  clearTimeout(safety);
  html.classList.remove('cl-home-initializing');
  sheet.remove();
 };
 // Network, auth or a third-party resource must never make the page vanish
 // indefinitely. Cap the loading shell to four seconds for availability.
 // The published style remains server-authoritative; failures show the page.
 const safety=setTimeout(release,4000);
 const ready=()=>{
  if(done||queued)return;
  const nav=document.querySelector('.site-header .navlinks');
  if(!document.body?.dataset.clWorkspace||nav?.dataset.v11Owned!=='1')return;
  queued=true;
  // Let the published-layout CSS and the signed-in header settle together.
  requestAnimationFrame(()=>requestAnimationFrame(release));
 };
 const watch=()=>{
  if(done)return;
  observer=new MutationObserver(ready);
  observer.observe(document.body,{attributes:true,childList:true,subtree:true});
  ready();
 };
 if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',watch,{once:true});
 }else watch();
})();

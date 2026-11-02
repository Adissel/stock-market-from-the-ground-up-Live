/* Unified theme controller; never touches Labs, Boot Camps or private APIs. */
(()=>{'use strict';
const excluded=/^(labs|lab-|bootcamp|boot-camp|academy|prototype)/i;
const current=location.pathname.split('/').pop()||'index.html';
if(excluded.test(current))return;
const key='smfgu:appearance:v2',themes=['atelier','midnight','slate'];
function apply(v){const theme=themes.includes(v)?v:'atelier';document.documentElement.dataset.smfguTheme=theme;if(document.body)document.body.classList.toggle('cl-atelier',theme==='atelier');try{localStorage.setItem(key,theme)}catch(_){ }document.querySelectorAll('[data-smfgu-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.smfguTheme===theme)))}
let start='atelier';try{start=localStorage.getItem(key)||start}catch(_){}apply(start);
function init(){
const nav=document.querySelector('.site-header .navlinks');if(!nav)return;
const controls=document.createElement('div');controls.className='sm-theme-picker';controls.setAttribute('role','group');controls.setAttribute('aria-label','Website appearance');
themes.forEach(t=>{let b=document.createElement('button');b.type='button';b.dataset.smfguTheme=t;b.className='sm-theme-dot';b.title=t==='atelier'?'Atelier light theme':t==='midnight'?'Midnight theme':'Slate theme';b.setAttribute('aria-label',b.title);b.addEventListener('click',()=>apply(t));controls.appendChild(b)});
nav.append(controls);apply(document.documentElement.dataset.smfguTheme);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
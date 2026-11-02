/* Unified theme controller; never touches Labs, Boot Camps or private APIs. */
(()=>{'use strict';
const excluded=/^(labs|lab-|bootcamp|boot-camp|academy|prototype)/i;
const current=location.pathname.split('/').pop()||'index.html';
if(excluded.test(current))return;
const key='smfgu:appearance:v3',themes=['spectrum','ultraviolet','solar'];
function apply(v){const theme=themes.includes(v)?v:'spectrum';document.documentElement.dataset.smfguTheme=theme;if(document.body)document.body.classList.toggle('cl-spectrum',true);document.body.classList.remove('cl-atelier');try{localStorage.setItem(key,theme)}catch(_){ }document.querySelectorAll('button[data-smfgu-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.smfguTheme===theme)))}
let start='spectrum';try{start=localStorage.getItem(key)||start}catch(_){}apply(start);
function init(){
const nav=document.querySelector('.site-header .navlinks');if(!nav)return;
const controls=document.createElement('div');controls.className='sm-theme-picker';controls.setAttribute('role','group');controls.setAttribute('aria-label','Website appearance');
themes.forEach(t=>{let b=document.createElement('button');b.type='button';b.dataset.smfguTheme=t;b.className='sm-theme-dot';b.title=t==='spectrum'?'Cyber spectrum':t==='ultraviolet'?'Ultraviolet':'Solar flare';b.setAttribute('aria-label',b.title);b.addEventListener('click',()=>apply(t));controls.appendChild(b)});
nav.append(controls);apply(document.documentElement.dataset.smfguTheme);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

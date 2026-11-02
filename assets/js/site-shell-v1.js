/* Crownlight Site Shell: progressive enhancements. No learning or assessment mutations. */
(()=>{'use strict';
const name=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(/^(labs|lab-|bootcamp|boot-camp|academy|prototype)/.test(name))return;
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
function navigation(){
 const header=document.querySelector('.site-header'),nav=header?.querySelector('.navlinks');if(!header||!nav||nav.dataset.smShell)return;nav.dataset.smShell='1';
 const toggle=document.createElement('button');toggle.type='button';toggle.className='sm-shell-menu';toggle.setAttribute('aria-label','Open site navigation');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','sm-shell-links');toggle.textContent='Menu';nav.id='sm-shell-links';
 const brand=header.querySelector('.brand');(brand?.parentElement||header).insertBefore(toggle,nav);
 const open=(value)=>{nav.classList.toggle('sm-shell-links-open',value);toggle.setAttribute('aria-expanded',String(value));toggle.setAttribute('aria-label',value?'Close site navigation':'Open site navigation');toggle.textContent=value?'Close':'Menu'};
 toggle.addEventListener('click',()=>open(toggle.getAttribute('aria-expanded')!=='true'));
 nav.addEventListener('click',e=>{if(e.target.closest('a'))open(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){open(false);toggle.focus()}});
 const media=matchMedia('(min-width: 981px)');const reset=()=>{if(media.matches)open(false)};media.addEventListener?.('change',reset);
}
function mainLandmark(){const main=document.querySelector('main');if(!main)return;let skip=document.querySelector('.sm-shell-skip');if(!skip){skip=document.createElement('a');skip.href='#sm-shell-main';skip.className='sm-shell-skip';skip.textContent='Skip to main content';document.body.prepend(skip)}if(!main.id)main.id='sm-shell-main';else skip.href='#'+main.id;main.setAttribute('tabindex','-1')}
function observe(){const footer=document.querySelector('footer');if(footer&&!footer.querySelector('[data-sm-shell-info]')){const p=document.createElement('p');p.dataset.smShellInfo='1';p.className='sm-shell-disclaimer';p.textContent='Educational information only. Fictional simulations are not investment recommendations.';footer.append(p)}}
ready(()=>{document.body.classList.add('sm-experience-v7');navigation();mainLandmark();observe()});
})();

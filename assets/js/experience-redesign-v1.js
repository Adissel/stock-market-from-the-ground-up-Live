/* Site experience redesign: all enhancements progressive; original auth, commerce, and progress controllers remain authoritative. */
(()=>{'use strict';
const onReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const link=(name,url,cls='')=>{const a=el('a',cls,name);a.href=url;return a};
const heading=(eyebrow,title,detail)=>{const w=el('div','gu-x-head');w.append(el('p','gu-x-kicker',eyebrow),el('h2','',title),el('p','gu-x-copy',detail));return w};
function createPromo(){const main=document.querySelector('main.gu-premium-home');if(!main)return;
const stage=main.querySelector('.gu-home-stage');const section=el('section','gu-x-learning-gallery');section.setAttribute('aria-label','Explore learning experiences');const wrap=el('div','wrap');wrap.append(heading('THE TRAINING ENVIRONMENT','From your first candle to confident analysis','Read a concept, practice it on a chart, explain your decision, and keep a learning record. Each stage advances the same learning workflow.'));
const grid=el('div','gu-x-feature-grid');const features=[
['01 / START HERE','Foundations','Learn market structure, candlesticks, orders and the language of price.','Explore free Foundations','free-foundations-challenge.html'],
['02 / PRACTICE','Interactive Labs','Work through scenarios with staged teaching, process feedback and deliberate retries.','View 419 Labs','labs.html'],
['03 / DEVELOP','Boot Camp Academy','Build disciplined routines through sequenced lessons and evidence of skill.','Explore Boot Camps','bootcamp-academy.html'],
['04 / ANALYZE','Crownlight Chart Studio','Use charting, indicators and replay to connect market observations with decisions.','Discover Chart Studio','store.html#store-chart-upgrades-heading']
];features.forEach(([step,title,copy,cta,url])=>{const card=el('article','gu-x-feature');card.append(el('span','gu-x-step',step),el('h3','',title),el('p','',copy),link(cta,url,'gu-x-card-link'));grid.append(card)});wrap.append(grid);section.append(wrap);stage?.insertAdjacentElement('afterend',section)}
function improveStore(){const main=document.querySelector('main.gu-redesign-store');if(!main)return;const core=main.querySelector('.gu-store-ad-core .wrap');if(!core)return;
const bar=el('div','gu-x-store-search');bar.setAttribute('role','search');const label=el('label','', 'Find a learning product');label.htmlFor='gu-x-product-search';const input=el('input');input.id='gu-x-product-search';input.type='search';input.autocomplete='off';input.placeholder='Search books, memberships, learning tools…';const stat=el('span','gu-x-search-status');stat.setAttribute('role','status');bar.append(label,input,stat);
const section=el('section','gu-x-store-intro');section.append(heading('PURPOSE-BUILT FOR YOUR NEXT SKILL','Choose your next learning experience','Compare education products and access levels without losing track of what is available. Prices and checkout remain controlled by the existing Store system.'),bar);
const tabs=core.querySelector('#store-tabs')||core.querySelector('.gu-store-catalog-discovery');if(tabs)tabs.insertAdjacentElement('beforebegin',section);else core.prepend(section);
const panels=[...core.querySelectorAll('[id^="store-panel-"]')];
input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let found=0;const active=panels.filter(p=>!p.hidden&&getComputedStyle(p).display!=='none');active.forEach(p=>{const cards=[...p.querySelectorAll('.card,article,[data-product-id]')].filter(n=>!n.closest('.card .card'));cards.forEach(c=>{if(!q){c.classList.remove('gu-x-filtered');return}const match=(c.textContent||'').toLowerCase().includes(q);c.classList.toggle('gu-x-filtered',!match);if(match)found++})});stat.textContent=q?(found?found+' matching visible products':'No matching products in the selected category'):''});
core.addEventListener('click',e=>{if(e.target.closest('[id^="store-tab-"]')){input.value='';stat.textContent='';core.querySelectorAll('.gu-x-filtered').forEach(n=>n.classList.remove('gu-x-filtered'))}});
}
function dashboard(){const root=document.querySelector('.gu-member-dashboard-shell');if(!root)return;const intro=root.querySelector('.gu-dashboard-intro');if(!intro)return;
const sec=el('section','gu-x-command');sec.setAttribute('aria-label','Your learning command center');sec.append(heading('YOUR LEARNING COMMAND CENTER','Make the next decision count','Resume a lesson, review your process, or study progress recorded by your learning workspace.'));
const nav=el('div','gu-x-command-actions');[['Continue a Lab','labs.html'],['Enter Boot Camp','bootcamp-academy.html'],['Explore Chart Studio','store.html#store-chart-upgrades-heading'],['Learning Journal','journal.html']].forEach(([n,u])=>nav.append(link(n,u,'gu-x-command-link')));sec.append(nav);
const chart=el('div','gu-x-progress-visual');const copy=el('div','gu-x-progress-copy');copy.append(el('h3','', 'Your Lab progression'),el('p','', 'Based on your account’s actual Lab totals. Your saved progress remains managed by the existing member dashboard.'));const chartEl=el('div','gu-x-chart');chartEl.setAttribute('role','img');chartEl.setAttribute('aria-label','Lab progress distribution');const fallback=el('p','gu-x-chart-fallback','Your completed, in-progress and remaining Lab counts will appear here once loaded.');chart.append(copy,chartEl,fallback);sec.append(chart);intro.insertAdjacentElement('afterend',sec);
const ids=['labs-completed','labs-in-progress','labs-not-started'];let chartInstance=null;
const update=()=>{const nums=ids.map(id=>{const t=document.getElementById(id)?.textContent?.trim()||'';return /^\d[\d,]*$/.test(t)?Number(t.replace(/,/g,'')):null});if(nums.some(n=>n===null)||nums.reduce((a,b)=>a+b,0)===0){fallback.hidden=false;if(chartInstance){chartInstance.dispose();chartInstance=null}return}
fallback.hidden=true;
if(!window.echarts){chartEl.textContent=nums.map((n,i)=>['Completed','In progress','Not started'][i]+': '+n).join(' · ');return}
chartEl.textContent='';chartInstance=chartInstance||window.echarts.init(chartEl,null,{renderer:'canvas'});chartInstance.setOption({backgroundColor:'transparent',color:['#4acbb2','#d7b56c','#506b87'],tooltip:{trigger:'item',formatter:'{b}: {c} Labs ({d}%)'},legend:{bottom:0,textStyle:{color:'#c4d2e3'}},series:[{name:'Lab Progress',type:'pie',radius:['60%','78%'],center:['50%','43%'],label:{show:false},data:nums.map((value,i)=>({name:['Completed','In progress','Not started'][i],value}))}]},true)};
let debounce=0;const schedule=()=>{clearTimeout(debounce);debounce=setTimeout(update,100)};ids.forEach(id=>{const node=document.getElementById(id);if(node)new MutationObserver(schedule).observe(node,{childList:true,characterData:true,subtree:true})});window.addEventListener('resize',()=>chartInstance?.resize());update();
}
function auth(){
const signin=document.querySelector('.gu-signin-page'),signup=document.querySelector('.gu-signup-page');if(!signin&&!signup)return;
const main=signin||signup,wrap=main.querySelector('.auth-page');if(!wrap)return;
const sidebar=el('aside','gu-x-auth-sidebar');
sidebar.append(el('p','gu-x-kicker','THE STOCK MARKET: FROM THE GROUND UP'),el('h2','',signup?'Learn it. Practice it. Build your skill.':'Your learning continues here.'),el('p','',signup?'Create an account to start your Foundations lessons and save eligible progress after email verification.':'Sign in to return to your Labs, Boot Camps, Journal and member learning workspace.'));
const list=el('ul','gu-x-assurance');['Guided lessons and learning paths','Fictional chart practice','Structured progress tracking'].forEach(t=>list.append(el('li','',t)));
sidebar.append(list,link(signup?'Already registered? Sign in':'New member? Create an account',signup?'signin.html':'create-account.html','gu-x-auth-alt'));
const content=el('div','gu-x-auth-content');
if(signin){const form=wrap.querySelector('.gu-signin-form-column');if(!form)return;content.append(form)}
else{[...wrap.children].forEach(child=>{if(child!==sidebar)content.append(child)})}
wrap.replaceChildren(sidebar,content);wrap.classList.add('gu-x-auth-layout');
}

onReady(()=>{createPromo();improveStore();dashboard();auth()});
})();

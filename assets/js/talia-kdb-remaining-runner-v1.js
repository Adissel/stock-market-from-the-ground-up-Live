/* Independent Knowledge Database guided study, batches 02-07.
 * Source body is received ONLY after existing per-member authorization.
 * No progress, official assessment, wallet, inference, or protected rubric writes.
 */
(function(root){
'use strict';
const stages=Object.freeze(['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results']);
const reg=Object.freeze({...((root.CrownlightTaliaKdbBatches)||{}),...((root.CrownlightKdbWatchlistStories)||{})});
const el=tag=>document.createElement(tag);
const node=(tag,body,cls)=>{const n=el(tag);n.textContent=String(body??'');if(cls)n.className=cls;return n;};
const div=cls=>node('div','',cls);
const button=(label,onClick,disabled=false)=>{const b=node('button',label);b.type='button';b.disabled=disabled;b.addEventListener('click',onClick);return b;};
function sections(text){
 const out=Object.create(null);
 const src=String(text||'').replace(/\r\n/g,'\n').slice(0,20000);
 const re=/^##\s+(.+?)\s*$/gm,heads=[...src.matchAll(re)];
 heads.forEach((m,i)=>{const start=m.index+m[0].length,end=i+1<heads.length?heads[i+1].index:src.length;out[m[1].toLowerCase().trim()]=src.slice(start,end).trim();});
 return out;
}
function pick(s,...names){for(const name of names){const v=s[name];if(typeof v==='string'&&v.length>=12)return v;}return '';}
function explainData(article){
 const s=sections(article.body_markdown);
 const story=(root.CrownlightKdbWatchlistStories||{})[article.slug];
 if(story&&story.headingMap){
  const mapped=Object.create(null);
  for(const [key,heading] of Object.entries(story.headingMap))mapped[key]=pick(s,String(heading).toLowerCase());
  return mapped;
 }
 return {
  objective:pick(s,'learning objective','definition and observable evidence','scope and learning outcomes','formula / definition'),
  definition:pick(s,'definition and observable evidence','definition or calculation framework','formula / definition','learning objective'),
  procedure:pick(s,'observation and research procedure','observation method','evidence preparation and reproducible procedure','research and data method'),
  worked:pick(s,'fictional exercise','fictional worked example','fictional case and independent self-check','worked example','independent application'),
  explanation:pick(s,'instructor explanation','explanation','self-check and answer guide'),
  error:pick(s,'common misconception','common mistake and counterexample','frequent error','common mistake'),
  limit:pick(s,'evidence and limits','limits and invalidation','limitations','limits'),
  independent:pick(s,'independent application'),
  questions:pick(s,'self-check and answer guide')
 };
}
const squish=(s,max=2500)=>String(s||'').replace(/!\[([^\]]*)\]\([^)]*\)/g,'[$1]').replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g,'$1').replace(/[*_#]+/g,'').trim().slice(0,max);
function canMount(a){
 const item=a&&reg[a.slug];if(!item||!a.id||!a.body_markdown||!Array.isArray(a.access_plans))return false;
 if(a.title!==item.title||a.learning_level!==item.learningLevel)return false;
 const data=explainData(a);
 return Boolean(data.definition&&data.worked&&data.independent&&data.limit&&data.questions);
}
function mount({article,element}={}){
 if(!element)return false;
 element.replaceChildren();element.hidden=true;
 if(!canMount(article))return false;
 const meta=reg[article.slug],data=explainData(article);
 const state={index:0,reached:0,attempts:Object.create(null),revisions:Object.create(null)};
 element.hidden=false;
 const heading=node('h2','Knowledge Database · Guided Study · '+meta.title),intro=node('p',meta.subject+' · '+meta.learningLevel+' · First-party guided practice, ungraded','tkdb-lead');
 const nav=el('nav');nav.className='tkdb-stages';nav.setAttribute('aria-label','Nine learning stages');
 const body=div('tkdb-stage-content'),live=node('p','','tkdb-live');live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 const actions=div('tkdb-actions');element.append(heading,intro,nav,body,live,actions);
 function textBlock(label,source,max=2400){
  if(!source)return;
  body.append(node('h4',label));
  for(const p of squish(source,max).split(/\n{2,}/).filter(Boolean).slice(0,8))body.append(node('p',p));
 }
 function task(key,title,prompt,feedback){
  body.append(node('h3',title));textBlock('Source-specific evidence',prompt,2600);
  const label=el('label');label.className='tkdb-answer-label';label.append(node('span','Write your reasoning, observable inputs, method and at least one limitation'));
  const field=el('textarea');field.rows=5;field.maxLength=2000;field.value=state.attempts[key]||'';field.setAttribute('aria-label',title+' response');
  label.append(field);body.append(label);
  const hint=div('tkdb-feedback');hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');
  const check=button('Show instructor feedback after submission',()=>{
   const value=field.value.trim();
   if(value.length<25){hint.textContent='Describe your reasoning in at least 25 characters before revealing feedback.';return;}
   state.attempts[key]=value;state.revisions[key]=(state.revisions[key]||0)+1;
   hint.textContent=squish(feedback||data.limit,1900);
   check.textContent='Update my response and reread feedback';
   live.textContent='Ungraded response held in this browser tab only.';
   controls();
  });
  body.append(check,hint);
  if(state.attempts[key])hint.textContent=squish(feedback||data.limit,1900);
  body.append(node('p','Practice only: free-text submissions are not automatically graded and never establish independent mastery.','tkdb-muted'));
 }
 function canNext(){const key={2:'experiment',3:'predict',4:'practice',5:'assess',7:'transfer'}[state.index];return !key||Boolean(state.attempts[key]);}
 function go(i){if(i>=0&&i<9&&i<=state.reached){state.index=i;render();}}
 function next(){if(!canNext()||state.index>=8)return;state.reached=Math.max(state.reached,state.index+1);state.index++;render();}
 function controls(){actions.replaceChildren(button('Previous stage',()=>go(state.index-1),state.index===0));if(state.index<8)actions.append(button('Continue to '+stages[state.index+1],next,!canNext()));}
 function render(){
  nav.replaceChildren();stages.forEach((label,i)=>{const b=button((i+1)+'. '+label,()=>go(i),i>state.reached);if(i===state.index)b.setAttribute('aria-current','step');nav.append(b);});
  live.textContent='Stage '+(state.index+1)+' of 9: '+stages[state.index]+'. No official grades.';
  body.replaceChildren();
  switch(state.index){
   case 0:
    body.append(node('h3','Your learning objectives'),node('p','Study '+meta.title+'. Define the observable evidence, reproduce the source worked example, identify a counterexample and apply the method to changed assumptions.'));
    textBlock('Specific objectives from your authorized research article',data.objective,1400);break;
   case 1:
    body.append(node('h3','Learn · Understand the method'));
    textBlock('Definition and calculation',data.definition,2000);textBlock('Observation procedure',data.procedure,1700);textBlock('Evidence boundary',data.limit,1300);break;
   case 2:task('experiment','Experiment · Reproduce the original fictional example',data.worked,data.explanation);break;
   case 3:task('predict','Predict · What would falsify this interpretation?',
    'For '+meta.title+', identify which source evidence is visible now, a conditional interpretation, and one observation that would refute it. Consider this topic-specific misconception:\n\n'+data.error,
    'Reason about the following documented limitation; do not import a future price or unseen data:\n'+data.limit);break;
   case 4:task('practice','Practice · Apply the method independently',data.independent,
    'Compare your response with the source instructor method and identify where an input, timestamp, or convention changes the conclusion:\n'+data.explanation);break;
   case 5:
    body.append(node('p','Ungraded learning self-check only. This is not the official protected Academy Assess stage and awards no grades.'));
    task('assess','Assess · Explain a self-check before seeing the guide',data.questions.replace(/\bAnswer:\s*[^\n]+/gi,'Answer: [concealed until your response]'),data.questions);
    break;
   case 6:
    body.append(node('h3','Review · Your evidence and corrections'));
    for(const key of ['experiment','predict','practice','assess']){
     body.append(node('h4',key.charAt(0).toUpperCase()+key.slice(1)),node('p','Your last response: '+(state.attempts[key]||'Not attempted')));
    }
    textBlock('Instructor worked explanation',data.explanation,1700);
    textBlock('Common mistake',data.error,1100);
    textBlock('Limits and invalidation',data.limit,1100);break;
   case 7:
    task('transfer','Transfer · A fresh changed-assumption case',
     'Create a DIFFERENT fictional case for '+meta.title+'. Change one declared input, observation time, period, definition, available market field, or eligibility gate. Explain the outcome or why the conclusion becomes NOT VERIFIED. State one alternative hypothesis and one concrete invalidation rule. Base the method on this source application:\n'+data.independent,
     'Check the new example against the original evidence procedure and limitations; a favorable future price is never proof.\n'+data.procedure+'\n'+data.limit);break;
   case 8:{
    const count=Object.keys(state.attempts).length,edits=Object.values(state.revisions).reduce((a,b)=>a+b,0);
    body.append(node('h3','Results · Browser-only study record'),
     node('p','You submitted '+count+' of five reasoning checkpoints with '+edits+' total attempts.'),
     node('p','This ungraded work is not independently marked correct. It does not create official learning progress, protected assessment results, or trading authorization.'));
    textBlock('Continuing limitation',data.limit,1300);
    const returnLink=el('a');returnLink.href='#kal-article-content';returnLink.textContent='Return to the source article';body.append(returnLink);
    body.append(button('Restart lesson',()=>{state.index=0;state.reached=0;state.attempts=Object.create(null);state.revisions=Object.create(null);render();}));break;
   }
  }
  controls();
 }
 render();return true;
}
root.CrownlightKnowledgeRemaining=Object.freeze({mount,canMount,sections,explainData,stages,registeredCount:Object.keys(reg).length});
})(window);

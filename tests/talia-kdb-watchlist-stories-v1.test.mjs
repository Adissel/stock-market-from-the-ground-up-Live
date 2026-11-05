import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const batch=JSON.parse(read('data/talia-kdb-interactive-batch07-watchlist-stories-v1.json'));
const w={};const cx=vm.createContext({window:w,document:{createElement:t=>({tagName:t,replaceChildren(){},append(){},setAttribute(){},addEventListener(){},hidden:false})}});
vm.runInContext(read('assets/js/talia-kdb-remaining-index-v1.js'),cx);
vm.runInContext(read('assets/js/talia-kdb-watchlist-stories-v1.js'),cx);
vm.runInContext(read('assets/js/talia-kdb-remaining-runner-v1.js'),cx);
const R=w.CrownlightKnowledgeRemaining;
test('16 original + 229 remaining + 15 Watchlist Stories = 260 nonoverlapping slugs',()=>{
 assert.equal(batch.lessons.length,15);assert.equal(Object.keys(w.CrownlightTaliaKdbBatches).length,229);assert.equal(R.registeredCount,244);
 const wave=[...read('assets/js/talia-kdb-lessons-wave1.js').matchAll(/\bslug:'([a-z0-9-]+)'/g)].map(x=>x[1]);
 assert.equal(wave.length,16);
 assert.equal(new Set([...wave,...Object.keys(w.CrownlightTaliaKdbBatches),...Object.keys(w.CrownlightKdbWatchlistStories)]).size,260);
});
test('all 15 authorized narrative cases yield complete 9-stage sections',()=>{
 const keys=['objective','definition','procedure','worked','explanation','error','limit','independent','questions'];
 for(const r of batch.lessons){
  assert.equal(r.factualReview,'REQUIRES_INDEPENDENT_ITEM_LEVEL_VERIFICATION');
  assert.equal(r.memberAccess,'VERIFY_ON_AUTHENTICATED_ARTICLE_READ');
  assert.equal(Object.keys(r.headingMap).length,9);
  const body='# '+r.title+'\n\n'+[...new Set(Object.values(r.headingMap))].map(x=>'## '+x+'\n\n'+x+' carries an original fictional observation and a research evidence limitation.').join('\n\n');
  const a={id:'11111111-1111-4111-8111-111111111111',slug:r.slug,title:r.title,learning_level:r.learningLevel,body_markdown:body,access_plans:['FOUNDING_60']};
  assert.equal(R.canMount(a),true,r.slug);
  const d=R.explainData(a);for(const k of keys)assert(d[k]?.length>20,r.slug+':'+k);
  assert.equal(R.canMount({...a,body_markdown:null}),false);
  assert.equal(R.canMount({...a,title:'wrong title'}),false);
 }
});
test('post-authorization mount and no paid inference / protected writing',()=>{
 const h=read('knowledge-article.html'),p=read('assets/js/knowledge-article-page-v1.js'),r=read('assets/js/talia-kdb-remaining-runner-v1.js');
 assert(h.indexOf('talia-kdb-watchlist-stories-v1.js')<h.indexOf('talia-kdb-remaining-runner-v1.js'));
 assert(p.indexOf("if(!response.ok||!data.ok)")<p.indexOf('CrownlightKnowledgeRemaining?.mount'));
 assert(!/localStorage|sessionStorage|service_role|paidInference|supabase\.(from|rpc)/i.test(r));
 assert(read('scripts/build-pages.sh').includes('node --test tests/talia-kdb-watchlist-stories-v1.test.mjs'));
});

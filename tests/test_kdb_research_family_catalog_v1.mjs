import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const s=readFileSync(new URL('../assets/js/knowledge-article-library-v1.js',import.meta.url),'utf8');
const page=readFileSync(new URL('../knowledge-database.html',import.meta.url),'utf8');
for(const text of ["const family=elem('select')","familyOf=label=>","All research families","fillFamilies();fillSubjects();render()","a.subject","a.learning_level","access_plans.includes","matched.slice(0,visible)","visible+=50","/knowledge-article.html?slug="])assert(s.includes(text),text);
assert.match(s,/uuid=\/\^\[0-9a-f\]\{8\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{12\}\$\/i/);
assert(page.includes('gu-article-library-v1'));
assert(!s.includes('body_markdown'),'Only published metadata, no protected body');
console.log('PASS: non-destructive research-family facets, member tiers, incremental rendering, canonical UUID redirect.');

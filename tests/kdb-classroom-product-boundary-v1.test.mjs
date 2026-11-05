/* Product boundary: Knowledge Database is independent of the Tutor Classroom.
 * This gate does not fetch members, change authorizations, or use real market data.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');

test('Talia Classroom exposes its own authorized chart tutor, not the Knowledge Database',()=>{
 const classroom=read('talia-classroom.html');
 const tutor=read('src/tutor/TaliaClassroom.tsx');
 const api=read('functions/api/talia-classroom-curriculum-v1.js');
 const browser=read('tests/talia-classroom-real-member-depth-v2.mjs');
 assert.match(classroom,/id="talia-classroom-root"/);
 assert.match(classroom,/talia-classroom-v1\.bundle\.js/);
 assert.doesNotMatch(classroom,/talia-kdb-directory|talia-kdb-guided-v1\.css|talia-kdb-directory-v1\.js|knowledge-article-page-v1\.js/i);
 assert.doesNotMatch(tutor,/\/api\/knowledge-library|\/knowledge-article\.html|talia-kdb-directory/i);
 assert.doesNotMatch(api,/\/api\/knowledge-library|Knowledge Database entitlement/i);
 assert.doesNotMatch(browser,/\/api\/knowledge-library|research-study-vwap|body_markdown/,'Tutor browser acceptance must not depend on publication of Knowledge articles');
});

test('Knowledge Database retains its own routes, catalog, publisher and independently authorized study',()=>{
 const database=read('knowledge-database.html'),article=read('knowledge-article.html');
 const reader=read('assets/js/knowledge-article-page-v1.js');
 const wave1=read('assets/js/talia-kdb-runner-v1.js'),remaining=read('assets/js/talia-kdb-remaining-runner-v1.js');
 assert.match(database,/id="academy-free-knowledge"/);
 assert.match(database,/id="gu-article-library-v1"/);
 assert.match(database,/knowledge-article-library-v1\.js/);
 assert.match(article,/href="\/knowledge-database\.html"/);
 assert.match(article,/aria-label="Independent Knowledge Database guided study"/);
 assert.match(article,/knowledge-article-page-v1\.js/);
 assert.ok(reader.indexOf('if(!response.ok||!data.ok)')>=0);
 assert.ok(reader.indexOf('CrownlightKnowledgeLesson?.mount')>reader.indexOf('if(!response.ok||!data.ok)'));
 assert.match(wave1,/Knowledge Database · Guided Study/);
 assert.match(remaining,/Knowledge Database · Guided Study/);
 assert.doesNotMatch(wave1,/\/talia-classroom\.html|Continue the discussion in Talia Classroom/);
 assert.doesNotMatch(remaining,/\/talia-classroom\.html/);
 assert.match(read('functions/api/knowledge-library.js'),/onRequest/);
 assert.match(read('admin-knowledge.html'),/Knowledge/i);
});

test('two product boundaries stay enforced by sitewide and dedicated CI without changing stored progress',()=>{
 const build=read('scripts/build-pages.sh');
 const kdb=read('.github/workflows/knowledge-library-membership-admin-v1.yml');
 const tutor=read('.github/workflows/talia-classroom-depth-acceptance-v2.yml');
 assert.match(build,/node --test tests\/kdb-classroom-product-boundary-v1\.test\.mjs/);
 assert.match(kdb,/node --test tests\/kdb-classroom-product-boundary-v1\.test\.mjs/);
 assert.match(tutor,/node --test tests\/kdb-classroom-product-boundary-v1\.test\.mjs/);
 assert.doesNotMatch(read('assets/css/talia-kdb-guided-v1.css'),/\.tc-body \.tkdb-directory/);
});

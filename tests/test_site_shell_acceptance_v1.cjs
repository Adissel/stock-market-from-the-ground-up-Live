/* Built-in Node.js repository regression check; no paid services or dependencies. */
const fs=require('node:fs');const assert=require('node:assert/strict');
const paths=['index.html','store.html','dashboard.html','signin.html','create-account.html'];
const page=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,'utf8')]));
const site=fs.readFileSync('assets/js/site.js','utf8');
const shell=fs.readFileSync('assets/js/site-shell-v1.js','utf8');
const appearance=fs.readFileSync('assets/js/appearance-controls-v1.js','utf8');
for(const [filename,source] of Object.entries(page)){
 assert.match(source,/class="[^"]*sm-experience-v7/,'theme body: '+filename);
 assert.match(source,/site-experience-v7\.css/,'design css: '+filename);
}
for(const key of ['labs-completed','labs-in-progress','labs-not-started','overall-progress','recent-activity','membership-tier'])assert.ok(page['dashboard.html'].includes(key),'missing member data binding '+key);
for(const key of ['signin.js','supabase-client.js'])assert.ok(page['signin.html'].includes(key),'missing auth dependency '+key);
for(const key of ['signup.js','supabase-client.js'])assert.ok(page['create-account.html'].includes(key),'missing registration dependency '+key);
assert.ok(page['store.html'].includes('store.js'),'commerce runtime missing');
for(const p of ['lab.html','lab-runner.html','bootcamp.html','candle-practice.html'])assert.ok(!site.includes("'"+p+"'"),'Interactive layout must not receive design shell: '+p);
assert.match(site,/new Set\(/,'site shell must have explicit page allowlist');
for(const key of ['site-shell-v1.js','appearance-controls-v1.js'])assert.ok(site.includes(key),'site shell integration missing '+key);
assert.match(shell,/aria-expanded/);assert.match(shell,/Skip to main content/);assert.match(appearance,/aria-pressed/);
for(const p of ['assets/js/site.js','assets/js/site-shell-v1.js','assets/js/appearance-controls-v1.js','assets/js/site-experience-v5.js'])new Function(fs.readFileSync(p,'utf8'));

const continuity=fs.readFileSync('assets/js/member-learning-continuity-v1.js','utf8');
assert.match(page['dashboard.html'],/member-learning-continuity-v1\.js/);
assert.match(page['dashboard.html'],/member-learning-continuity-v1\.css/);
for(const destination of ['/learn.html','/labs.html','/simulator.html','/talia-classroom.html','/journal.html','/market-tutor.html'])assert.ok(continuity.includes(destination),'missing curriculum continuity destination: '+destination);
assert.match(continuity,/getElementById\('dashboard-content'\)/,'requires authenticated dashboard content');
assert.match(continuity,/getElementById\('overall-progress'\)/,'real member progress source');
assert.doesNotMatch(continuity,/fetch\(|localStorage|sessionStorage|supabase\.from|innerHTML\s*\+=/,'read-only navigation must not touch private state');
new Function(continuity);

console.log('PASS: core page design, protected curricula, retained dashboard statistics, auth, commerce, accessible shell, JavaScript syntax');

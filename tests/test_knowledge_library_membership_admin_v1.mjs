/* Secure article store contract. No payment, Lab grade, member progress or existing Free articles modified. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sql=read('supabase/migrations/20261102_knowledge_library_membership_admin_v1.sql');
const api=read('functions/api/knowledge-library.js');
const page=read('knowledge-database.html');
const admin=read('admin-knowledge.html');
const owner=read('admin.html');
const ui=read('assets/js/admin-knowledge-v1.js');
const catalog=read('assets/js/knowledge-article-library-v1.js');
const article=read('knowledge-article.html');
const reader=read('assets/js/knowledge-article-page-v1.js');
for(const required of [
 'gu_knowledge_articles_v1','gu_knowledge_article_revisions_v1','row level security',
 'enable row level security','revoke all','service_role',
 'content.manage','admin_audit_log','gu_knowledge_mutate_v1',
 'is distinct from p_expected_version','review_state','is_visible',
 'length(body_markdown)>=400','jsonb_array_length(sources)>=1',
 "status in ('draft','in_review','published','archived')"
])assert(sql.toLowerCase().includes(required.toLowerCase()),'Missing database protection: '+required);
assert.match(sql,/learning_level in \('beginner','intermediate','advanced','professional','institutional_quantitative'\)/);
assert.match(sql,/access_plans <@ array\[/);
assert(!/to anon|to authenticated/.test(sql),'Private articles cannot grant unrestricted client access');
for(const required of [
 'auth/v1/user','profiles','admin_user_flags','SHOWCASE_VIEWER','admin_role_permissions',
 'content.manage','gu_founder_members_v014173','public_launch_open','user_plan_grants',
 'site_subscriptions','access_plans.some','status=eq.published','is_visible=eq.true',
 'memberPlans','gu_knowledge_mutate_v1','no-store','cache-control'
])assert(api.includes(required),'Missing server access check: '+required);
assert(!api.includes('user_metadata?.membership'),'User-editable metadata must not control paywall');
assert(page.includes('id="gu-article-library-v1"'),'New article browser must be on existing Knowledge Database');
assert(page.includes('id="academy-free-knowledge"'),'Existing free reference baseline must remain');
assert(page.includes('knowledge-database-expanded-v2.js?v=20261031-v3'),'Legacy 26 deep dives preserved');
assert(owner.includes('href="/admin-knowledge.html"'),'Admin Control Center must link article manager');
for(const required of ['ak-visible','ak-publication','ak-review','ak-plans','ak-upload','ak-form','ak-history','ak-archive','ak-restore','ak-export','ak-order'])assert(admin.includes(required));
for(const required of ['admin/list','admin/get','admin/history','confirm(','save','restore','archive','version','access_plans'])assert(ui.includes(required));
assert(catalog.includes('/knowledge-article.html?slug='),'Catalog cards must navigate to standalone article URLs');
assert(catalog.includes("location.replace('/knowledge-article.html?article='"),'Old UUID deep links must redirect to dedicated page');
assert(!catalog.includes('body_markdown'),'Public article catalog must never embed article bodies');
assert(article.includes('id="kal-article-content"'),'Standalone page must provide a dedicated article body');
assert(article.includes('knowledge-article-page-v1.js'),'Standalone page must load authenticated reader');
assert(reader.includes("authorization:'Bearer '"),'Member article read must supply Supabase session');
assert(reader.includes('content.replaceChildren()'),'Reader must remove previous sensitive body');
assert(reader.includes('textContent'),'Article Markdown must render without executable HTML');
assert(!reader.includes('innerHTML'),'No raw untrusted article markup allowed');
assert(reader.includes('renderMarkdown'),'Article content must be formatted on its own page');
console.log('PASS: private article database, live membership tiers, owner permissions, article editor, standalone member-gated article reader and legacy free-content invariants.');

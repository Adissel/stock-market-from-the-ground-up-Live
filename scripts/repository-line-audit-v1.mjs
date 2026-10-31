/**
 * Repository-wide static source audit. Noncharging/read-only; examines every
 * git-tracked file and scans every line of valid UTF-8 text. Does not claim
 * independent human review, authenticated E2E testing, or binary contents audit.
 * No file contents, credentials, or tokens are copied into the reports.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=process.cwd(),out=path.join(root,'artifacts/repository-line-audit');
const readGit=(args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}).trim();
const paths=execFileSync('git',['ls-files','-z'],{cwd:root,maxBuffer:64*1024*1024})
  .toString('utf8').split('\0').filter(Boolean).sort();
if(paths.length===0)throw Error('No tracked repository files; audit cannot proceed');
const sha=readGit(['rev-parse','HEAD']);
const findings=[],files=[],byArea={};
const cap=(s)=>String(s).replace(/[\r\n\t]/g,' ').slice(0,300);
function record(file,line,severity,rule,details){
 findings.push({file,line,severity,rule,details:cap(details)});
}
const riskyPatterns=[
 {rule:'GIT_CONFLICT_MARKER',sev:'P0',re:/^(?:<{7}|>{7})(?:\s|$)/},
 {rule:'POSSIBLE_LIVE_SECRET_LITERAL',sev:'P0',re:/\b(?:sk_live_|rk_live_|whsec_|sb_secret_)[A-Za-z0-9]{12,}/},
 {rule:'DYNAMIC_CODE_EXECUTION',sev:'P1',re:/\b(?:eval\s*\(|new\s+Function\s*\()/},
 {rule:'POTENTIAL_AUTH_PRIVILEGE_GRANT',sev:'P1',re:/^\s*GRANT\s+EXECUTE\b.*\b(?:anon|authenticated|PUBLIC)\b/i},
 {rule:'HTML_WINDOW_OPEN_TARGET',sev:'P2',re:/\btarget\s*=\s*["']_blank["']/i},
 {rule:'UNSAFE_DOM_SINK_REVIEW',sev:'P2',re:/\b(?:innerHTML|outerHTML)\s*=/},
 {rule:'RELEASE_TODO',sev:'P3',re:/\b(?:FIXME|TODO|HACK|XXX)\b/}
];
let totals={tracked:paths.length,textFiles:0,binaryFiles:0,symlinks:0,unreadable:0,
 bytes:0,textLines:0,syntaxChecked:0,syntaxSkipped:0,jsonParsed:0,jsonFailed:0};
const extensions={};
for(const name of paths){
 const abs=path.join(root,name),ext=path.extname(name).toLowerCase()||'[none]';
 const area=name.split('/')[0];byArea[area]=(byArea[area]||0)+1;
 extensions[ext]=(extensions[ext]||0)+1;
 let stat,bytes;
 try{
  stat=fs.lstatSync(abs);
  if(stat.isSymbolicLink()){
   totals.symlinks++;
   const target=fs.readlinkSync(abs);
   files.push({file:name,kind:'symlink',bytes:Buffer.byteLength(target),lines:0,status:'target_only',sha256:'',sourceChecked:false});
   continue;
  }
  bytes=fs.readFileSync(abs);
 }catch(e){
  totals.unreadable++;record(name,0,'P1','UNREADABLE_TRACKED_FILE',e.code||'read error');
  files.push({file:name,kind:'unreadable',bytes:0,lines:0,status:'failed',sha256:'',sourceChecked:false});
  continue;
 }
 totals.bytes+=bytes.length;
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 let value;
 try{
  if(bytes.includes(0))throw Error('NUL byte');
  value=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
 }catch{
  totals.binaryFiles++;
  files.push({file:name,kind:'binary_or_non_utf8',bytes:bytes.length,lines:0,status:'binary_inventory_only',sha256:hash,sourceChecked:false});
  continue;
 }
 totals.textFiles++;
 let lines=value.split('\n');
 if(value.endsWith('\n'))lines.pop();
 totals.textLines+=lines.length;
 let count=0;
 const clientSource=/^(?:assets\/(?:js|data)\/|public\/|data\/)/.test(name)||/\.html$/i.test(name);
 const codeSource=/\.(?:mjs|cjs|js|jsx|ts|tsx|sql|html|htm|css)$/i.test(name);
 const isDocs=/\.(?:md|mdx|txt|csv)$/i.test(name)||/^docs\//.test(name);
 const isJs=/\.(?:js|mjs|cjs)$/i.test(name);
 for(let i=0;i<lines.length;i++){
  const s=lines[i],n=i+1;
  count++;
  if(s.length>20000)record(name,n,'P2','HUGE_SINGLE_LINE','Line exceeds 20,000 characters; individual semantic review required');
  if(/^(?:\.env|\.env\..*|\.npmrc|id_rsa|.*\.pem|.*\.key)$/i.test(path.basename(name))&&!/example|sample|template/i.test(name))
   if(i===0)record(name,n,'P0','TRACKED_CREDENTIAL_FILE','Potential real secret-bearing filename; review privately');
  if(clientSource&&/\b(?:service_role|supabase_service_role|SECRET_KEY|STRIPE_SECRET_KEY)\b/i.test(s)&&
    !/^\s*(?:\/[/*]|<!--|\*|#)/.test(s))record(name,n,'P1','CLIENT_PRIVILEGE_REFERENCE','Potential privileged key reference in client or published data; inspect packaging and actual values');
  if(clientSource&&/\bFounding 600\b/i.test(s)&&!isDocs)record(name,n,'P2','LEGACY_MEMBER_LABEL','Owner requires member-facing Founding Members naming');
  if(clientSource&&/\bBoot Camps are not sold individually\b/i.test(s))record(name,n,'P1','STALE_BOOT_CAMP_SALE_POLICY','Standalone Boot Camp entitlements are intended where eligible');
  if(clientSource&&/["'](?:answer_key|private_rubric|grading_secret)["']\s*:/i.test(s))
   record(name,n,'P1','POTENTIAL_PRIVATE_ANSWER_KEY_IN_CLIENT','Review public bundle and assessment separation');
  if(/\.sql$/i.test(name)&&/^\s*CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION/i.test(s))record(name,n,'P3','SQL_FUNCTION_REVIEW','Function definition; inspect search_path, grants, auth, invoker and ownership');
  for(const p of riskyPatterns){
   if(p.rule==='HTML_WINDOW_OPEN_TARGET'&&!/\.html?$/.test(name))continue;
   if(p.rule==='UNSAFE_DOM_SINK_REVIEW'&&!codeSource)continue;
   if(p.rule==='DYNAMIC_CODE_EXECUTION'&&!codeSource)continue;
   if(p.rule==='RELEASE_TODO'&&!codeSource)continue;
   if(p.rule==='POTENTIAL_AUTH_PRIVILEGE_GRANT'&&!/\.sql$/i.test(name))continue;
   if(p.rule==='POSSIBLE_LIVE_SECRET_LITERAL'&&isDocs)continue;
   if(p.re.test(s))record(name,n,p.sev,p.rule,'Manual verification needed; line content deliberately omitted');
  }
 }
 let status='line_scanned',sourceChecked=false;
 if(ext==='.json'){
  try{JSON.parse(value);totals.jsonParsed++}
  catch(e){totals.jsonFailed++;record(name,0,'P1','JSON_PARSE_FAILURE',e.message?.slice(0,130)||'invalid JSON');status='json_invalid'}
 }
 if(isJs){
  if(bytes.length<=1024*1024){
   try{execFileSync(process.execPath,['--check',abs],{cwd:root,timeout:8000,stdio:'pipe'});totals.syntaxChecked++;sourceChecked=true}
   catch(e){record(name,0,'P1','JS_SYNTAX_FAILURE',(e.stderr||e.message||'node --check failed').toString().split('\n').filter(Boolean).slice(0,2).join(' ').slice(0,200));status='syntax_invalid'}
  }else{
   totals.syntaxSkipped++;record(name,0,'P2','LARGE_JS_SYNTAX_DEFERRED','JS > 1 MiB; all UTF-8 lines scanned but Node syntax check deferred');
  }
 }
 files.push({file:name,kind:ext,bytes:bytes.length,lines:count,status,sha256:hash,sourceChecked});
}
const counts={};
for(const finding of findings){const k=finding.severity+':'+finding.rule;counts[k]=(counts[k]||0)+1}
const summary={schema:'SMFGU-REPO-LINE-AUDIT-V1',project:'The Stock Market: From the Ground Up',
 scope:'Full git-tracked tree; all readable UTF-8 lines inspected by static patterns; binaries inventoried only',
 auditedCommit:sha,createdUtc:new Date().toISOString(),environment:os.platform(),
 totals,findings:findings.length,bySeverity:Object.fromEntries(['P0','P1','P2','P3'].map(k=>[k,findings.filter(f=>f.severity===k).length])),
 topFindingRules:Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,30),
 topAreas:Object.entries(byArea).sort((a,b)=>b[1]-a[1]).slice(0,50),
 extensions:Object.entries(extensions).sort((a,b)=>b[1]-a[1]).slice(0,50),
 limitations:[
  'Static scan is not human line-by-line semantic review, legal compliance, live authenticated acceptance or a comprehensive security penetration test.',
  'Binary and non-UTF8 files receive bytes/hashes and filenames only; they are not source-line auditable.',
  'Patterns are triage candidates and may contain false positives; absence of a finding is not proof of safety.',
  'No real customer identity, Stripe LIVE action, database mutation, network call or environment-secret access was performed.',
  'Only files tracked in the audited commit are enumerated; untracked generated/build outputs are intentionally excluded.'
 ]};
fs.mkdirSync(out,{recursive:true});
const csvEscape=(v)=>'"'+String(v??'').replaceAll('"','""')+'"';
function csv(name,cols,rows){
 fs.writeFileSync(path.join(out,name),
 [cols.join(','),...rows.map(row=>cols.map(k=>csvEscape(row[k])).join(','))].join('\n')+'\n');
}
csv('tracked-file-manifest.csv',['file','kind','bytes','lines','status','sha256','sourceChecked'],files);
csv('line-findings.csv',['file','line','severity','rule','details'],findings);
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync(path.join(out,'SCOPE.md'),[
 '# Repository-wide line scan — scope and limitations','',
 'Audited commit: '+sha,'',
 'Every tracked file is inventoried. Every readable UTF-8 text line is scanned by repeatable static rules.',
 'Binary and non-UTF8 files receive inventory/hash only. Node syntax checks apply to JS/MJS/CJS no larger than 1 MiB.',
 'An issue without findings is **not** independently human-reviewed or production-accepted.',
 'Review each P0/P1 finding against the full secure source before modifying code. Report hashes,',
 'GitHub Actions results, security context and authenticated QA separately.','',
 'Artifacts: summary.json; tracked-file-manifest.csv; line-findings.csv.',''
 ].join('\n'));
console.log('AUDIT_SUMMARY '+JSON.stringify({sha,totals,bySeverity:summary.bySeverity,findings:findings.length,topFindingRules:summary.topFindingRules.slice(0,12)}));
console.log('AUDIT_OUTPUT '+path.relative(root,out));
if(totals.unreadable>0||totals.jsonFailed>0)process.exitCode=1;

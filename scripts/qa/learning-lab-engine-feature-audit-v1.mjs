/* SMFGU-LEARNING-LAB-FEATURE-AUDIT-001 — read-only source evidence scoring. */
import {readFileSync,existsSync} from 'node:fs';
const FILE='data/learning-lab-engine-feature-audit-v1.json';
export function validateFeatureLedger(a){
 if(a?.schema!=='smfgu.learning-lab.audit.v1'||!Array.isArray(a.features)||a.features.length!==64)throw Error('Audit schema or count invalid');
 const seen=new Set(),grouped={};
 for(const f of a.features){
  if(!['learning','lab'].includes(f.engine)||!['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE'].includes(f.edition))throw Error('Unknown family or edition '+f.id);
  if(!/^(?:LE|LA)-(?:BAS|ADV|PRO|ENT)-0[1-8]$/.test(f.id)||seen.has(f.id))throw Error('Duplicate or invalid ID '+f.id);
  seen.add(f.id);
  if(!['integrated','partial','prototype','not_implemented'].includes(f.source_status))throw Error('Invalid status '+f.id);
  if(typeof f.title!=='string'||f.title.length<20||typeof f.acceptance_criterion!=='string'||f.acceptance_criterion.length<30||typeof f.unresolved!=='string'||f.unresolved.length<18)throw Error('Insufficient evidence description '+f.id);
  if(f.source_status!=='not_implemented'&&!f.evidence_file)throw Error('Source status without evidence '+f.id);
  if(f.evidence_file&&!existsSync(f.evidence_file))throw Error('Missing source file '+f.evidence_file+' for '+f.id);
  if(f.existing_test_file&&!existsSync(f.existing_test_file))throw Error('Missing test file '+f.existing_test_file+' for '+f.id);
  if(typeof f.real_member_accepted!=='boolean'||typeof f.independent_release_accepted!=='boolean')throw Error('Explicit acceptance states required '+f.id);
  if(f.real_member_accepted&&(!Array.isArray(f.member_acceptance_evidence)||f.member_acceptance_evidence.length<1))throw Error('Independent member evidence required '+f.id);
  if(f.independent_release_accepted&&(!f.real_member_accepted||f.source_status!=='integrated'||!Array.isArray(f.release_acceptance_evidence)||f.release_acceptance_evidence.length<1))throw Error('Independent release requires member evidence and source integration '+f.id);
  (grouped[f.engine+'_'+f.edition]??=[]).push(f);
 }
 for(const engine of ['learning','lab'])for(const edition of ['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE']){
  const key=engine+'_'+edition,rows=grouped[key];
  if(rows?.length!==8)throw Error('Feature denominator mismatch '+key);
  const counts=Object.fromEntries(['integrated','partial','prototype','not_implemented'].map(state=>[state,rows.filter(r=>r.source_status===state).length]));
  const checked=a.counts[key];
  if(!checked||checked.total!==8||Object.keys(counts).some(k=>checked[k]!==counts[k])||checked.integrated_percent!==Number((100*counts.integrated/8).toFixed(2))||checked.released_features!==0)throw Error('Stored numerator/denominator mismatch '+key);
  if(edition==='BASIC'&&counts.integrated!==8)throw Error('Frozen Basic source integration regressed '+key);
 }
 if(a.frozen?.learningBasic!=='v3.3'||a.frozen?.labBasic!=='v3.2'||a.frozen?.labIds!==419||a.frozen?.competencies!==30||a.frozen?.premiumFeaturesReleased!==false||a.frozen?.addonCheckout!==false)throw Error('Frozen safety boundary changed');
 return grouped;
}
export function featureReport(a){const grouped=validateFeatureLedger(a);return Object.fromEntries(Object.entries(grouped).map(([key,rows])=>[key,{integrated:rows.filter(f=>f.source_status==='integrated').length,total:8,pct:Number((100*rows.filter(f=>f.source_status==='integrated').length/8).toFixed(2)),partial:rows.filter(f=>f.source_status==='partial').length,prototype:rows.filter(f=>f.source_status==='prototype').length,releaseAccepted:rows.filter(f=>f.independent_release_accepted).length}]));}
if(process.argv[1]?.endsWith('learning-lab-engine-feature-audit-v1.mjs'))console.log(JSON.stringify(featureReport(JSON.parse(readFileSync(FILE,'utf8'))),null,2));

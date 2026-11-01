/** Research intake / provenance gate: local metadata only, no network/AI/data ingestion. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const rd=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const raw=rd('docs/research/master/master-source-registry-v1.json');
const catalog=JSON.parse(raw);
const guides=[...JSON.parse(rd('data/tutor-indicator-study-v1.json')).guides,
 ...JSON.parse(rd('data/tutor-indicator-expansion-v1.json')).guides];
const labs=JSON.parse(rd('data/lab-teaching-bridges-v014168.json')).entries;
assert.equal(catalog.schema,'SMFGU-MASTER-RESEARCH-SOURCE-001');
assert.equal(catalog.tiers.length,9);
assert.equal(catalog.sources.length,catalog.tiers.reduce((n,t)=>n+t.sourceCandidates,0));
assert.ok(catalog.sources.length>=50,'Research candidate breadth regressed');
assert.equal(Object.keys(labs).length,419,'Existing canonical Lab identity mismatch');
assert.equal(guides.length,73,'73 indicator guides must remain present');
assert.equal(new Set(guides.map(x=>x.code)).size,73,'Indicator IDs must remain distinct');
assert.equal(academyPrograms.length,10,'Ten Academy programs, including restricted beta');
assert.equal(academyPrograms.reduce((n,p)=>n+p.days,0),274,'Academy study day inventory drift');
assert.equal(new Set(catalog.sources.map(x=>x.id)).size,catalog.sources.length,'Duplicate source ID');
assert.equal(new Set(catalog.sources.map(x=>x.url)).size,catalog.sources.length,'Duplicate source URL (retain cross-tier reference by source ID instead)');
const forbidden=/\b(?:COPY_APPROVED|INGEST_APPROVED|PUBLICATION_APPROVED|COMMERCIAL_LICENSED)\b/;
for(const s of catalog.sources){
 assert(/^[A-Z][A-Z0-9-]+$/.test(s.id),'Bad source identity');
 const u=new URL(s.url);
 assert.equal(u.protocol,'https:','Source URL must be HTTPS');
 assert(!u.username&&!u.password&&!u.hash,'Source URL must not embed secrets or fragments');
 assert(catalog.tiers.some(t=>t.key===s.category),'Unknown source category');
 assert(['NOT_APPROVED'].includes(s.publicationRights),'Unverified publication rights cannot be granted by intake');
 assert.equal(s.dataIngestionRights,'NOT_APPROVED','Data ingestion must be separately licensed');
 assert(!forbidden.test(JSON.stringify(s)),'No silent commercial rights acceptance');
 if(/^(FRED-|STT-)/.test(s.id))assert(/restrict|FRED terms/i.test(s.rightsNotes),'Explicit rights caution required');
}
const byId=new Map(catalog.sources.map(s=>[s.id,s]));
const byCode=new Set(guides.map(g=>g.code));
const competencyCodes=new Set(JSON.parse(rd('data/competency-study-guides-v01499.json')).guides.map(g=>g.code));
assert.equal(catalog.subjectEvidencePilot.length,11);
for(const p of catalog.subjectEvidencePilot){
 assert(p.indicatorCode?byCode.has(p.indicatorCode):competencyCodes.has(p.competencyCode),'Pilot must use an existing canonical indicator guide or clearly labeled related competency');
 assert(p.sourceIds.length>=2,'Independent source candidates required');
 assert(new Set(p.sourceIds).size===p.sourceIds.length,'Duplicate pilot reference');
 assert(p.sourceIds.every(id=>byId.has(id)),'Source pilot contains missing ref');
 assert(p.formula&&p.inputWindow&&p.units&&p.seed&&p.limits);
 assert.equal(p.status,'REFERENCES_IDENTIFIED_NUMERICAL_ACCEPTANCE_PENDING','Intake may not grant editorial acceptance');
}
const guideSourceIssues=[];
for(const g of guides){
 if(!Array.isArray(g.sourceUrls)||!g.sourceUrls.length)guideSourceIssues.push({code:g.code,reason:'no_source_url'});
 else if(g.sourceUrls.some(u=>!/^https:\/\//.test(u)))guideSourceIssues.push({code:g.code,reason:'non_https_source_url'});
}
const report={
 version:'1.0',kind:'READ_ONLY_RESEARCH_INTAKE_SOURCE_AUDIT',
 registrySha256:createHash('sha256').update(raw).digest('hex'),
 sourceCount:catalog.sources.length,
 officialPagesObserved:catalog.sources.filter(s=>s.accessStatus==='official_page_observed_2026-11-01').length,
 categoryCounts:Object.fromEntries(catalog.tiers.map(t=>[t.key,t.sourceCandidates])),
 inventory:{canonicalLabs:419,academyPrograms:10,academyDays:274,tutorIndicatorGuides:73},
 pilotSubjectRecords:catalog.subjectEvidencePilot.length,
 pilotIndependentRecomputationCases:11,
 pilotSourceFixturesPassOnlyIfBothLanguages:true,
 pilotEditoriallyAccepted:0,
 sourceRightsApprovedForIngestion:0,
 sourceRightsApprovedForRepublication:0,
 indicatorGuidesWithHttpsSourceUrls:73-guideSourceIssues.length,
 guideSourceIssues,
 gatesNotSatisfied:['Individual source claim and formula review','Two independent numerical implementations','Exact data provenance, rights and time boundary','Private official assessment and member progression','Human/editorial acceptance','Live production member browser testing']
};
mkdirSync(new URL('../artifacts/',import.meta.url),{recursive:true});
writeFileSync(new URL('../artifacts/master-research-source-audit-v1.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log('PASS research metadata: '+report.sourceCount+' candidates across 9 tiers; 419 Labs, 274 Academy days and 73 indicator IDs preserved.');
console.log('NOT APPROVED: '+report.sourceRightsApprovedForIngestion+' market-data ingestion rights, '+report.pilotEditoriallyAccepted+' pilot editorial acceptances; source usage remains rights-gated.');
if(guideSourceIssues.length)console.warn('Indicator reference review candidates:',guideSourceIssues.length);

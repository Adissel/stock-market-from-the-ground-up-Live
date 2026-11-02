/* Production Days 1–5 acceptance using a REAL password-authenticated QA identity.
 * No service-role credentials, password logging, CAPTCHA bypass, checkout,
 * payment, protected answer keys, or writes to non-QA member records.
 * A new synthetic reflection is only saved when Day 1 has no existing record.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createRequire} from 'node:module';
import {createHmac} from 'node:crypto';
const axePath=createRequire(import.meta.url).resolve('axe-core/axe.min.js');
import {mkdirSync,writeFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const email=process.env.LAB_QA_EMAIL||'';
const password=process.env.LAB_QA_PASSWORD||'';
// QA_Secondary was created through normal GoTrue signup by the approved
// tests/setup-secondary-noncommercial-qa-v1.mjs onboarding program. Reuse its
// separately derived credential when optional second-account secrets are absent.
// This never logs or persists the password, changes Auth, or bypasses confirmation.
const qaSecondaryFallback=!process.env.LAB_QA_SECOND_EMAIL&&
 !process.env.LAB_QA_SECOND_PASSWORD&&!!password;
const secondEmail=process.env.LAB_QA_SECOND_EMAIL||
 (qaSecondaryFallback?'stockmarketfromthegroundup+smfgu-qa2v1@gmail.com':'');
const secondPassword=process.env.LAB_QA_SECOND_PASSWORD||
 (qaSecondaryFallback?createHmac('sha256',password)
  .update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!':'');
const expectedQaId=process.env.LAB_QA_EXPECTED_USER_ID||'f42f9301-18e6-43a3-8531-32d371fd22c1';
const report={scope:'Real production Chromium, signed-in Free Foundations Days 1–5',
 checkedAt:new Date().toISOString(),checks:[],blocked:[],failures:[],completed:false,
 constraints:['Never overwrite a pre-existing Day 1 record',
  'Second QA account is required for genuine cross-member isolation proof',
  'Tests fail closed if sign-in requires human CAPTCHA interaction']};
const note=(kind,message)=>{report[kind].push(message);console.log(kind.toUpperCase()+' '+message)};
async function authenticate(page,username,secret){
 const response=await page.goto(origin+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(response?.status(),200,'Sign-in page unavailable');
 await page.locator('#login-identifier').fill(username);
 await page.locator('#login-password').fill(secret);
 await page.locator('.auth-card button[type="submit"]').click();
 try {
  await page.waitForURL(u=>/\/dashboard(?:\.html)?$/.test(new URL(u).pathname),{timeout:30000});
 }catch{
  throw Error('Real password sign-in did not reach Dashboard. A human Turnstile challenge or invalid QA credentials may require Owner action; CAPTCHA must not be bypassed.');
 }
 const state=await page.evaluate(async()=>{
  const client=await window.getSupabaseClient();
  const result=await client.auth.getSession();
  return {access:result.data?.session?.access_token||'',id:result.data?.session?.user?.id||''};
 });
 assert(state.access.length>20&&state.id,'Genuine authenticated Supabase session required');
 return state;
}
async function progress(request,token){
 const result=await request.get(origin+'/api/bootcamp-academy?program=free5',{
  headers:{authorization:'Bearer '+token},timeout:30000});
 const body=await result.json().catch(()=>({}));
 return {status:result.status(),body};
}
if(!email||!password){
 note('blocked','Encrypted LAB_QA_EMAIL and LAB_QA_PASSWORD are unavailable; no member session was created.');
 process.exitCode=2;
}else{
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:390,height:900},serviceWorkers:'block'});
  const page=await context.newPage();
  const signed=await authenticate(page,email,password);
  assert.equal(signed.id,expectedQaId,'Signed-in member does not match the authorized noncommercial QA identity. Refusing any progress writes.');
  note('checks','Verified real QA sign-in at mobile viewport with an account-bound session.');
  const original=await progress(page.request,signed.access);
  assert.equal(original.status,200,'Signed-in private program GET requires success');
  assert.equal(original.body.ok,true);
  assert.equal(original.body.program?.code,'free5');
  assert.equal(original.body.curriculum?.length,5);
  assert.equal(original.body.progressAvailable,true,'Server-side progress must be available');
  const reflection='FICTIONAL QA DAY 1 REFLECTION: This is a synthetic study note for testing private persistence, not a real security, trade, grade, or recommendation. I will identify which prices are actual transactions, which quotes are displayed interest, what remains unknown, and why a No Trade choice can be appropriate.';
  const existingDay1=original.body.progress.find(x=>x.day===1);
  assert(!existingDay1||(existingDay1.status==='reflection_saved'&&existingDay1.reflection===reflection),
   'Day 1 contains another private note. Refusing to overwrite the existing member record.');
  note('checks',existingDay1?'Free5 Day 1 already holds the exact previously saved QA-only reflection; rerunning read-only.':'Free5 private GET returned exactly five lessons and an unused Day 1.');
  const startUrl=origin+'/bootcamp-academy.html?program=free5&day=1';
  await page.goto(startUrl,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.getElementById('academy-workspace')?.hidden===false,
   {timeout:30000});
  assert.equal(await page.locator('#academy-day-title').count(),1);
  assert.match(await page.locator('#academy-stage-label').innerText(),/Lesson 1 of 5/i);
  note('checks','Day 1 opened inside the real signed-in Academy learning workspace.');
  if(!existingDay1){
  if(await page.locator('#academy-enroll').isVisible()){
   await page.locator('#academy-enroll').click();
   await page.waitForFunction(()=>document.getElementById('academy-enroll')?.hidden===true,
    {timeout:15000});
  }
  await page.locator('#academy-start').click();
  await page.waitForFunction(()=>/Lesson started|previously saved reflection/i.test(
   document.getElementById('academy-save-status')?.textContent||''),{timeout:15000});
  await page.locator('#academy-reflection').fill(reflection);
  await page.locator('#academy-save').click();
  await page.waitForFunction(()=>/Your learning notes are saved/i.test(
   document.getElementById('academy-save-status')?.textContent||''),{timeout:18000});
  note('checks','Day 1 reflection saved through the actual browser button (fictional, ungraded).');
  }else note('checks','Previous QA save detected; no further progress write was performed.');
  await page.reload({waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.getElementById('academy-workspace')?.hidden===false,
   {timeout:30000});
  const displayed=await page.locator('#academy-reflection').inputValue();
  assert.equal(displayed,reflection,'Saved study note failed to reload into Day 1 UI');
  const reread=await progress(page.request,signed.access);
  assert.equal(reread.status,200);
  const row=reread.body.progress?.find(x=>x.day===1);
  assert(row&&row.status==='reflection_saved'&&row.reflection===reflection,
   'Private server record does not match saved browser note');
  note('checks','Day 1 note survived full signed-in browser reload and independent API GET.');
  // Genuine existing QA identity; never overwrite another private note.
  // Test each remaining day in sequence, save only original fictional QA text.
  for(const [day,topic] of [[2,'candlestick OHLC and undefined zero range'],
    [3,'issuer chronology and no lookahead'],[4,'research watchlist and NO TRADE'],
    [5,'planned position risk and uncertain execution']]){
   const reflection='FICTIONAL QA DAY '+day+' REFLECTION: I studied '+topic+
    '. This account-bound educational note describes only hypothetical evidence, not a real trade, independently graded assessment or financial recommendation.';
   const current=await progress(page.request,signed.access);
   assert.equal(current.status,200);
   const existing=current.body.progress?.find(x=>x.day===day);
   assert(!existing||(existing.status==='reflection_saved'&&existing.reflection===reflection),
    'Day '+day+' has a different existing note. Refusing to overwrite member work.');
   await page.goto(origin+'/bootcamp-academy.html?program=free5&day='+day,
    {waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>document.getElementById('academy-workspace')?.hidden===false,
    {timeout:30000});
   assert.match(await page.locator('#academy-stage-label').innerText(),
    new RegExp('Lesson '+day+' of 5','i'));
   if(!existing){
    if(await page.locator('#academy-enroll').isVisible()){
     await page.locator('#academy-enroll').click();
     await page.waitForFunction(()=>document.getElementById('academy-enroll')?.hidden===true,
      {timeout:15000});
    }
    await page.locator('#academy-start').click();
    await page.waitForFunction(()=>/Lesson started|previously saved reflection/i.test(
     document.getElementById('academy-save-status')?.textContent||''),{timeout:15000});
    await page.locator('#academy-reflection').fill(reflection);
    await page.locator('#academy-save').click();
    await page.waitForFunction(()=>/Your learning notes are saved/i.test(
     document.getElementById('academy-save-status')?.textContent||''),{timeout:18000});
    note('checks','Day '+day+' original fictional QA reflection saved through production browser.');
   }
   await page.reload({waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>document.getElementById('academy-workspace')?.hidden===false,
    {timeout:30000});
   assert.equal(await page.locator('#academy-reflection').inputValue(),reflection);
   const verified=await progress(page.request,signed.access);
   assert.equal(verified.status,200);
   const row=verified.body.progress?.find(x=>x.day===day);
   assert(row&&row.status==='reflection_saved'&&row.reflection===reflection,
    'Day '+day+' not persisted in account-bound private API');
   note('checks','Day '+day+' reload and authenticated API readback passed.');
  }
  const finalProgress=await progress(page.request,signed.access);
  assert.equal(finalProgress.status,200);
  // Extend the same genuine QA session to the two Free member services.
  // Only create new clearly fictional QA content; never overwrite a user's work.
  const bearer={authorization:'Bearer '+signed.access};
  const prefPreflight=await page.request.get(origin+'/api/free-learning-coach',
   {headers:bearer,timeout:30000});
  assert.equal(prefPreflight.status(),200,'Free learning preference API must authorize real QA member');
  const prefBefore=await prefPreflight.json();
  assert.equal(prefBefore.ok,true);
  try {
  if(!prefBefore.preferences.saved){
   const dashboardResponse=await page.goto(origin+'/dashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
   const loadedPath=new URL(page.url()).pathname;
   const controls=await page.locator('#free-start-choose').count();
   if(controls!==1)throw Error('Dashboard controls absent; requested=/dashboard.html; landing='+loadedPath+'; HTTP='+dashboardResponse?.status()+'; pageTitle='+String(await page.title()).slice(0,60));
   await page.locator('details.free-learning-starting-point summary').click();
   await page.locator('#free-start-level').selectOption('1');
   await page.locator('#free-coach-focus').selectOption('WATCHLIST');
   await page.locator('#free-coach-minutes').selectOption('10');
   await page.locator('#free-start-choose').click();
   await page.waitForFunction(()=>/Preferences saved to your account/i.test(
    document.getElementById('free-start-result')?.textContent||''),{timeout:20000});
   note('checks','Free learner preference saved through real signed-in Dashboard.');
  }else{
   assert.equal(prefBefore.preferences.focus,'WATCHLIST','Existing QA learner preferences differ; never overwrite.');
   assert.equal(prefBefore.preferences.sessionMinutes,10,'Existing QA study time differs; never overwrite.');
   note('checks','Existing QA-only study preference preserved without overwrite.');
  }
  const prefAgain=await page.request.get(origin+'/api/free-learning-coach',
   {headers:bearer,timeout:30000});
  assert.equal(prefAgain.status(),200);
  const prefBody=await prefAgain.json();
  assert.equal(prefBody.ok,true);
  assert.equal(prefBody.preferences.saved,true);
  assert.equal(prefBody.preferences.focus,'WATCHLIST');
  assert.equal(prefBody.preferences.sessionMinutes,10);
  assert.equal(prefBody.recommendation.savedReflections,5,
   'Talia must observe all five genuine saved ungraded reflections');
  note('checks','Talia private preferences and five-day progress verified by authenticated API.');
  }catch(e){
   note('failures','Real signed-in Talia preference workflow: '+String(e.message||e).slice(0,300));
  }
  const qaResearch='FICTIONAL QA STUDY ONLY: The GUSIM teaching candles do not represent an issuer, an executable quotation, or verified market liquidity. Choose NO TRADE until genuine independent evidence exists.';
  try {
  const watchPreflight=await page.request.get(origin+'/api/free-watchlist',
   {headers:bearer,timeout:30000});
  assert.equal(watchPreflight.status(),200);
  const watchBefore=await watchPreflight.json();
  assert.equal(watchBefore.ok,true);
  assert(Array.isArray(watchBefore.entries));
  const prior=watchBefore.entries.find(x=>x.symbol==='GUSIM');
  assert(!prior||(prior.sourceKind==='FICTIONAL'&&prior.status==='NO_TRADE'&&prior.researchNote===qaResearch),
   'Existing GUSIM research differs from authorized QA sample; refusing to change it.');
  await page.goto(origin+'/free-watchlist.html',{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#free-watchlist-content').waitFor({state:'visible',timeout:30000});
  if(!prior){
   await page.locator('#free-watchlist-symbol').fill('GUSIM');
   await page.locator('#free-watchlist-status').selectOption('NO_TRADE');
   await page.locator('#free-watchlist-source-kind').selectOption('FICTIONAL');
   await page.locator('#free-watchlist-research-note').fill(qaResearch);
   await page.locator('#free-watchlist-source-note').fill('Original platform fictional education only; no market feed.');
   await page.locator('#free-watchlist-save').click();
   await page.waitForFunction(()=>/GUSIM saved to your private member research watchlist/i.test(
    document.getElementById('free-watchlist-save-status')?.textContent||''),{timeout:20000});
   note('checks','Free fictional watchlist entry saved through real signed-in UI.');
  }else note('checks','Exact QA watchlist record already exists; no overwrite.');
  await page.reload({waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#free-watchlist-content').waitFor({state:'visible',timeout:30000});
  assert.match(await page.locator('#free-watchlist-list').innerText(),/GUSIM/);
  const watchAgain=await page.request.get(origin+'/api/free-watchlist',
   {headers:bearer,timeout:30000});
  assert.equal(watchAgain.status(),200);
  const watchBody=await watchAgain.json();
  assert(watchBody.entries?.some(x=>x.symbol==='GUSIM'&&x.sourceKind==='FICTIONAL'&&
   x.status==='NO_TRADE'&&x.researchNote===qaResearch),
   'Private watchlist did not preserve exact fictional QA research after reload');
  note('checks','Free watchlist persisted across reload and private authenticated API readback.');
  }catch(e){
   note('failures','Real signed-in Free Watchlist workflow: '+String(e.message||e).slice(0,300));
  }
  // Free fictional replay production lifecycle — QA account only, noncommercial.
  // No historical dataset, paid entitlement, real order, Journal write or grade.
  try{
   const base=origin+'/api/learning-replay-v01492?scope=fictional&action=';
   const preflight=await page.request.get(base+'resume',{headers:bearer,timeout:30000});
   assert.equal(preflight.status(),200);
   const resumed=await preflight.json();
   assert.equal(resumed.ok,true);
   if(resumed.session){
    note('blocked','Existing private fictional replay must not be modified by automated QA; authorized new session acceptance skipped.');
   }else{
    const catalogRes=await page.request.get(base+'catalog',{headers:bearer,timeout:30000});
    assert.equal(catalogRes.status(),200);
    const catalog=await catalogRes.json();
    assert.equal(catalog.ok,true);
    assert.equal(catalog.classification,'FICTIONAL');
    assert(catalog.datasets?.length>0&&catalog.datasets.every(x=>x.synthetic===true),
     'Free catalog contains unverified historical or non-fictional source');
    assert(!Object.hasOwn(catalog.datasets[0],'bars'),'Catalog exposed future candles');
    const dataset=catalog.datasets.find(x=>/^GUSIM_/.test(x.code));
    assert(dataset,'Missing approved original fictional GUSIM teaching dataset');
    await page.goto(origin+'/verified-replay.html?scope=fictional',
     {waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#vr-dataset option[value="'+dataset.code+'"]').waitFor({state:'attached',timeout:30000});
    assert.match(await page.locator('h1').innerText(),/Free Server-Controlled Fictional Replay/i);
    await page.locator('#vr-dataset').selectOption(dataset.code);
    await page.locator('#vr-start').click();
    await page.locator('#vr-session').waitFor({state:'visible',timeout:30000});
    assert.equal(await page.locator('#vr-bars tr').count(),1,'Start must reveal exactly one fictional bar');
    note('checks','Genuine Free member started one original fictional server-controlled replay, first bar only.');
    await page.locator('#vr-decision').selectOption('NO_TRADE');
    await page.locator('#vr-reason').fill('FICTIONAL QA: No real issuer or executable liquidity has been verified. Withhold a trade and reveal only the next synthetic candle after a documented no-trade decision.');
    await page.locator('#vr-lock').click();
    await page.locator('#vr-advance').waitFor({state:'visible',timeout:12000});
    await page.waitForFunction(()=>document.getElementById('vr-advance')?.disabled===false,{timeout:12000});
    await page.locator('#vr-advance').click();
    await page.waitForFunction(()=>document.querySelectorAll('#vr-bars tr').length===2,{timeout:22000});
    note('checks','Locked NO TRADE decision permitted one forward-only reveal; no estimated execution asserted.');
    assert.equal(await page.locator('#vr-execution').isVisible(),false,'Fictional NO TRADE must not imply a fill');
    await page.locator('#vr-finish').click();
    await page.locator('#vr-session').waitFor({state:'hidden',timeout:22000});
    assert.equal(await page.locator('#vr-journal-link').isVisible(),false,
     'Finishing fictional replay must not create a linked Journal or mastery result');
    const after=await page.request.get(base+'resume',{headers:bearer,timeout:30000});
    assert.equal(after.status(),200);
    const afterBody=await after.json();
    assert.equal(afterBody.ok,true);
    assert.equal(afterBody.session,null,'Finished QA replay must not remain active');
    note('checks','QA-only fictional replay finished and server has no active session; no Journal linked.');
   }
  }catch(e){
   note('failures','Real signed-in Free fictional replay lifecycle: '+String(e.message||e).slice(0,350));
  }
  // One noncommercial, explicitly fictional Journal UI record on the authorized QA identity.
  // Never overwrite or delete records and never exceed the original Free weekly quota.
  try{
   const marker='FICTIONAL QA FREE JOURNAL SMOKE 20261031';
   await page.goto(origin+'/journal.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('#journal-content').waitFor({state:'visible',timeout:30000});
   const jBefore=await page.evaluate(async(marker)=>{
    const sb=await window.getSupabaseClient();
    const current=(await sb.auth.getUser()).data?.user;
    const q=await sb.from('decision_journal')
     .select('id,user_id,ticker,journal_type,setup,status')
     .eq('user_id',current.id).eq('setup',marker).limit(2);
    const met=await sb.rpc('gu_v014121_my_free_week_usage');
    return {id:current?.id,rows:q.data,error:q.error?.message||null,
     usage:met.data,usageError:met.error?.message||null};
   },marker);
   assert.equal(jBefore.id,signed.id,'QA identity changed before Journal acceptance');
   assert.equal(jBefore.error,null,'Journal private list read failed');
   assert.equal(jBefore.usageError,null,'Server-account weekly usage unavailable');
   assert(Array.isArray(jBefore.rows)&&jBefore.rows.length<=1,'Unexpected duplicate QA Journal marker');
   if(!jBefore.rows.length){
    const u=jBefore.usage;
    assert(u&&Number.isInteger(u.journalUsed)&&Number.isInteger(u.journalLimit),
     'Journal weekly quota was not returned by authenticated server');
    if(u.journalUnlimited || u.journalUsed>=u.journalLimit){
     note('blocked','Authorized QA account cannot safely consume one more Free Journal slot; no record created.');
    }else{
     await page.locator('#new-journal-toggle').click();
     await page.locator('#new-journal-panel').waitFor({state:'visible',timeout:15000});
     await page.locator('#new-type').selectOption('observation');
     await page.locator('#new-ticker').fill('GUSIM');
     await page.locator('#new-setup').selectOption('__CUSTOM__');
     await page.locator('#new-setup-custom').fill(marker);
     await page.locator('#new-timeframe').fill('5-minute fictional');
     await page.locator('#new-journal-form button[type="submit"]').click();
     await page.waitForURL(url=>new URL(url).pathname.replace(/\.html$/,'')==='/journal-entry'&&
      Number(new URL(url).searchParams.get('id'))>0,{timeout:30000});
     note('checks','One original fictional observation Journal draft created via actual authenticated UI.');
    }
   }else note('checks','Existing exact QA-only fictional Journal marker preserved without duplicate creation.');
   const jAfter=await page.evaluate(async(marker)=>{
    const sb=await window.getSupabaseClient();
    const q=await sb.from('decision_journal')
     .select('id,user_id,ticker,journal_type,setup,status')
     .eq('user_id',(await sb.auth.getUser()).data.user.id)
     .eq('setup',marker).limit(2);
    const met=await sb.rpc('gu_v014121_my_free_week_usage');
    return {rows:q.data,error:q.error?.message||null,usage:met.data};
   },marker);
   if(!report.blocked.some(x=>x.includes('one more Free Journal slot'))){
    assert.equal(jAfter.error,null);
    assert.equal(jAfter.rows.length,1,'One QA-only Journal record should exist, not multiple');
    assert.equal(jAfter.rows[0].user_id,signed.id);
    assert.equal(jAfter.rows[0].ticker,'GUSIM');
    assert.equal(jAfter.rows[0].journal_type,'observation');
    assert.equal(jAfter.rows[0].setup,marker);
    await page.goto(origin+'/journal.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#journal-content').waitFor({state:'visible',timeout:25000});
    await page.locator('#journal-search').fill('GUSIM');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('#journal-rows tr'))
      .some(x=>x.textContent?.includes('GUSIM')),{timeout:15000});
    await page.locator('#journal-rows tr[data-id="'+jAfter.rows[0].id+'"] a[href*="journal-entry.html"]').click();
    await page.waitForURL(url=>new URL(url).pathname.replace(/\.html$/,'')==='/journal-entry' &&
     Number(new URL(url).searchParams.get('id'))>0,{timeout:20000});
    assert.equal(Number(new URL(page.url()).searchParams.get('id')),Number(jAfter.rows[0].id));
    note('checks','Fictional Journal save persisted and reopened through genuine signed-in UI with exact owned ID.');
   }
  }catch(e){note('failures','Real Free QA Journal create/reopen: '+String(e.message||e).slice(0,330)+'; landing='+new URL(page.url()).pathname+'; status='+String(await page.locator('#new-journal-message').textContent().catch(()=>'' )).slice(0,100))}
  // Actual Free Simulator-to-Journal persistence. One noncommercial, fictional
  // paper-plan fixture on James_Test; no paper order is entered or executed.
  // Idempotent across CI reruns: never modify a pre-existing QA record.
  try{
   const simMarker='FICTIONAL QA SIMULATOR PERSISTENCE V1';
   await page.goto(origin+'/simulator.html?practice=free',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('#sim-content').waitFor({state:'visible',timeout:45000});
   const simPreflight=await page.evaluate(async marker=>{
    const sb=await window.getSupabaseClient();
    const u=(await sb.auth.getUser()).data?.user;
    const list=await sb.from('decision_journal')
     .select('id,user_id,journal_type,thesis,simulator_source_label,plan_locked_at')
     .eq('user_id',u.id).eq('thesis',marker).limit(2);
    const usage=await sb.rpc('gu_v014121_my_free_week_usage');
    return {id:u.id,rows:list.data,error:list.error?.message||null,
     usage:usage.data,usageError:usage.error?.message||null};
   },simMarker);
   assert.equal(simPreflight.id,signed.id,'Simulator auth identity changed before save');
   assert.equal(simPreflight.error,null);
   assert.equal(simPreflight.usageError,null);
   assert(Array.isArray(simPreflight.rows)&&simPreflight.rows.length<=1,
    'Unexpected duplicate simulator QA plan');
   let simRecordId;
   if(simPreflight.rows.length){
    assert(simPreflight.rows[0].plan_locked_at,
     'Existing simulator QA marker was not successfully locked; preserve for review');
    simRecordId=simPreflight.rows[0].id;
    note('checks','Existing original fictional QA Simulator plan preserved without duplicate creation.');
   }else{
    const q=simPreflight.usage;
    assert(q&&q.journalUnlimited===false&&q.simulatorUnlimited===false,
     'Expected a genuine Free quota, not a premium or unverified Simulator entitlement');
    if(q.journalUsed>=q.journalLimit||q.simulatorSavesUsed>=q.simulatorSaveLimit){
     note('blocked','Free QA Simulator weekly save allowance exhausted; refused additional entry.');
    }else{
     await page.waitForFunction(()=>/Loaded 36 ORIGINAL FICTIONAL candles/i.test(
      document.getElementById('sim-load-msg')?.textContent||''),null,{timeout:35000});
     await page.locator('#sim-ticker').fill('GUSIM');
     await page.locator('#sim-shares').fill('10');
     await page.locator('#sim-stop').fill('1');
     await page.locator('#sim-thesis').fill(simMarker);
     await page.locator('#sim-entry-reason').fill(
      'Noncommercial educational QA: document an original fictional scenario only.');
     await page.locator('#sim-trigger').fill('No brokerage instruction; test plan persistence only.');
     await page.locator('#sim-invalidation').fill(
      'Invalid if any candle or source is interpreted as actual market data.');
     await page.locator('#sim-lock-plan').click();
     await page.waitForFunction(()=>/Simulator plan locked in journal record #\d+/i.test(
      document.getElementById('sim-plan-msg')?.textContent||''),null,{timeout:25000});
     note('checks','Genuine Free fictional Simulator plan locked and saved through UI without an order.');
    }
   }
   const simSaved=await page.evaluate(async marker=>{
    const sb=await window.getSupabaseClient();
    const u=(await sb.auth.getUser()).data.user;
    const list=await sb.from('decision_journal')
     .select('id,user_id,journal_type,ticker,thesis,simulator_source,simulator_source_label,plan_locked_at')
     .eq('user_id',u.id).eq('thesis',marker).limit(2);
    return {rows:list.data,error:list.error?.message||null};
   },simMarker);
   if(!report.blocked.some(x=>x.includes('Simulator weekly save allowance'))){
    assert.equal(simSaved.error,null);
    assert.equal(simSaved.rows.length,1,'Expected exactly one owned fictional Simulator QA record');
    const row=simSaved.rows[0];simRecordId=row.id;
    assert.equal(row.user_id,signed.id);
    assert.equal(row.journal_type,'paper');
    assert.equal(row.ticker,'GUSIM');
    assert(row.plan_locked_at,'Simulator paper plan must be locked server-side');
    assert.match(row.simulator_source_label||'',/ORIGINAL FICTIONAL STARTER/);
    await page.goto(origin+'/journal.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#journal-content').waitFor({state:'visible',timeout:30000});
    await page.locator('#journal-search').fill('GUSIM');
    await page.locator('#journal-rows tr[data-id="'+simRecordId+'"] a').first()
     .waitFor({state:'visible',timeout:20000});
    await page.locator('#journal-rows tr[data-id="'+simRecordId+'"] a').first().click();
    await page.waitForURL(url=>Number(new URL(url).searchParams.get('id'))===Number(simRecordId),
     {timeout:25000});
    await page.reload({waitUntil:'domcontentloaded',timeout:30000});
    const verify=await page.evaluate(async id=>{
     const sb=await window.getSupabaseClient();
     const u=(await sb.auth.getUser()).data.user;
     const q=await sb.from('decision_journal')
      .select('id,plan_locked_at,user_id').eq('id',id).eq('user_id',u.id).single();
     return {row:q.data,error:q.error?.message||null};
    },simRecordId);
    assert.equal(verify.error,null);
    assert.equal(verify.row?.id,simRecordId);
    assert(verify.row?.plan_locked_at);
    note('checks','Genuine Free Simulator save reopened from Journal and survived full reload.');
   }
  }catch(e){
   note('failures','Real Free Simulator paper-plan save/reopen: '+
    String(e.message||e).slice(0,360));
  }
  // Automated WCAG 2.0/2.1/2.2 A/AA audit of real authenticated Free surfaces.
  // Checks actual accessibility tree rules, not just CSS selector presence.
  // Human screen-reader review remains an independent required gate.
  try{
   const scans=[
    ['/dashboard.html','#free-learning-launchpad','#free-learning-launchpad'],
    ['/free-watchlist.html','#free-watchlist-content','#free-watchlist-symbol'],
    ['/journal.html','#journal-content','#new-journal-toggle']
   ];
   for(const [route,region,ready] of scans){
    await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator(ready).waitFor({state:'visible',timeout:30000});
    if(route==='/dashboard.html'){
     const accordion=page.locator('details.free-learning-starting-point');
     if(!await accordion.evaluate(el=>el.open))await accordion.locator('summary').click();
    }
    if(route==='/journal.html')await page.locator('#new-journal-toggle').click();
    await page.addScriptTag({path:axePath});
    const a=await page.evaluate(async(region)=>await window.axe.run(region,{
     runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}
    }),region);
    const problems=a.violations.map(v=>({
     id:v.id,impact:v.impact,count:v.nodes.length,
     sample:v.nodes.slice(0,2).map(n=>n.target.join(' '))
    }));
    note('checks','Axe WCAG audit executed for '+route+': '+a.passes.length+
     ' rules passed, '+a.violations.length+' violations, '+a.incomplete.length+' manual-review findings.');
    if(problems.length)note('failures','Axe '+route+' violations: '+JSON.stringify(problems).slice(0,450));
   }
  }catch(e){note('failures','Authenticated axe-core Free accessibility audit: '+String(e.message||e).slice(0,450))}
  const anonymous=await page.request.get(origin+'/api/bootcamp-academy?program=free5',
   {timeout:20000});
  assert([401,403].includes(anonymous.status()),
   'Unsigned requests must not receive private Academy records');
  note('checks','Unsigned access to private learning records is rejected.');
  // A client-controlled account selector must never switch the Academy's
  // database query away from the authenticated James_Test identity. Read only.
  const probe=await page.request.get(
   origin+'/api/bootcamp-academy?program=free5&user_id=00000000-0000-4000-8000-000000000000&member_id=00000000-0000-4000-8000-000000000000',
   {headers:{authorization:'Bearer '+signed.access},timeout:25000});
  assert.equal(probe.status(),200,'Identity-selector probe must retain normal authorized GET semantics');
  const probeBody=await probe.json();
  assert.equal(probeBody.ok,true);
  assert.equal(probeBody.progressAvailable,true);
  assert.deepEqual(probeBody.progress,finalProgress.body.progress,
   'A caller-supplied user_id/member_id altered the authenticated progress response');
  note('checks','Caller-controlled account selectors could not change the returned QA member records.');
  // The client must also be unable to query the private table directly,
  // even when it has a valid member access token.
  const direct=await page.evaluate(async()=>{
   const client=await window.getSupabaseClient();
   const result=await client.from('gu_bootcamp_academy_progress_v014168')
    .select('day_number').limit(1);
   return {rows:Array.isArray(result.data)?result.data.length:0,
     rejected:!!result.error,code:result.error?.code||''};
  });
  assert.equal(direct.rows,0,'Direct client obtained data from a service-private Academy table');
  assert(direct.rejected,'Direct Academy table read must fail closed, not silently return private rows');
  note('checks','Authenticated member browser cannot directly read the service-private progress table.');
  // Authenticated keyboard, programmatic names and responsive usability smoke.
  // Not a substitute for an independent screen-reader or WCAG audit.
  try{
   await page.setViewportSize({width:390,height:900});
   await page.goto(origin+'/dashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('#free-start-choose').waitFor({state:'attached',timeout:20000});
   await page.locator('details.free-learning-starting-point summary').click();
   const dashboardLabels=await page.evaluate(()=>{
    const fields=['free-start-level','free-coach-focus','free-coach-minutes'];
    const labeled=fields.every(id=>!!document.querySelector('label[for="'+id+'"]'));
    const live=document.getElementById('free-coach-suggestion')?.getAttribute('aria-live');
    return {labeled,live};
   });
   assert(dashboardLabels.labeled&&dashboardLabels.live==='polite',
    'Talia Free form needs programmatic labels and a nonintrusive live status');
   await page.locator('#free-coach-focus').focus();
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'free-coach-minutes',
    'Keyboard cannot tab from learning focus to session duration');
   await page.keyboard.press('Shift+Tab');
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'free-coach-focus',
    'Keyboard reverse navigation failed in Free Talia preferences');
   note('checks','Mobile 390px Talia form labels, live announcement and keyboard navigation passed.');
   await page.setViewportSize({width:1440,height:900});
   assert.equal(await page.locator('#free-start-choose').isVisible(),true,
    'Desktop Talia submit control must remain visible within the expanded Free section');
   note('checks','Desktop 1440px authenticated Free Talia control retained.');
   await page.setViewportSize({width:390,height:900});
   await page.goto(origin+'/free-watchlist.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('#free-watchlist-content').waitFor({state:'visible',timeout:25000});
   const watchLabels=await page.evaluate(()=>{
    const fields=['free-watchlist-symbol','free-watchlist-status','free-watchlist-research-note'];
    return {labeled:fields.every(id=>!!document.querySelector('label[for="'+id+'"]')),
     live:document.getElementById('free-watchlist-save-status')?.getAttribute('aria-live')};
   });
   assert(watchLabels.labeled&&watchLabels.live==='polite',
    'Free Watchlist needs labels and an accessible save status announcement');
   await page.locator('#free-watchlist-symbol').focus();
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'free-watchlist-status',
    'Watchlist keyboard navigation did not reach the next form field');
   note('checks','Mobile 390px Free research form labels, status announcement and keyboard navigation passed.');
  }catch(e){
   note('failures','Authenticated Free keyboard/responsive/accessibility smoke: '+String(e.message||e).slice(0,420));
  }
  if(secondEmail&&secondPassword){
   const anotherContext=await browser.newContext({viewport:{width:390,height:900},serviceWorkers:'block'});
   const secondPage=await anotherContext.newPage();
   const other=await authenticate(secondPage,secondEmail,secondPassword);
   assert.notEqual(other.id,signed.id,'Second QA credentials must identify a different member');
   if(qaSecondaryFallback)assert.equal(other.id,'bf3d5823-946d-4478-8d0f-cbea33495e5b',
    'Derived secondary credential must resolve to the existing verified QA_Secondary member');
   const their=await progress(secondPage.request,other.access);
   assert.equal(their.status,200,'Second QA member needs eligible Free learning access');
   assert(!(their.body.progress||[]).some(x=>x.reflection===reflection),
    'Member A\'s private reflection leaked to member B');
   note('checks','Second genuine QA account cannot read the first account\'s reflection.');
   // Verify the entire five-day record set and the other two Free member tools.
   const otherProgressProbe=await progress(secondPage.request,other.access);
   assert.equal(otherProgressProbe.status,200);
   assert.deepEqual(otherProgressProbe.body.progress,their.body.progress,
    'Second member course evidence changed between independent reads');
   const otherForgedProgress=await secondPage.request.get(origin+
    '/api/bootcamp-academy?program=free5&user_id='+signed.id+'&member_id='+signed.id,
    {headers:{authorization:'Bearer '+other.access},timeout:25000});
   assert.equal(otherForgedProgress.status(),200);
   assert.deepEqual((await otherForgedProgress.json()).progress,their.body.progress,
    'Caller supplied first member ID switched the second member course response');
   assert(!(their.body.progress||[]).some(x=>
    finalProgress.body.progress.some(a=>a.reflection&&a.reflection===x.reflection)),
    'Any of first member\'s five exact private reflections appeared in second member data');
   note('checks','Second authenticated member cannot read or select all five first-member reflections.');

   const secondAuth={authorization:'Bearer '+other.access};
   const secondPreferences=await secondPage.request.get(origin+'/api/free-learning-coach',
    {headers:secondAuth,timeout:25000});
   assert.equal(secondPreferences.status(),200);
   const secondPrefBody=await secondPreferences.json();
   assert.equal(secondPrefBody.ok,true);
   const forgedPrefs=await secondPage.request.get(origin+
    '/api/free-learning-coach?user_id='+signed.id,{headers:secondAuth,timeout:25000});
   assert.equal(forgedPrefs.status(),200);
   assert.deepEqual((await forgedPrefs.json()).preferences,secondPrefBody.preferences,
    'Another member\'s Talia preferences were exposed by a forged identity parameter');
   note('checks','Second authenticated member Talia preferences ignore first-member selector.');

   const secondResearch=await secondPage.request.get(origin+'/api/free-watchlist',
    {headers:secondAuth,timeout:25000});
   assert.equal(secondResearch.status(),200);
   const secondWatchBody=await secondResearch.json();
   assert.equal(secondWatchBody.ok,true);
   assert(!secondWatchBody.entries.some(x=>x.researchNote===qaResearch),
    'First-member fictional research leaked into another member\'s watchlist');
   const forgedResearch=await secondPage.request.get(origin+
    '/api/free-watchlist?user_id='+signed.id,{headers:secondAuth,timeout:25000});
   assert.equal(forgedResearch.status(),200);
   assert.deepEqual((await forgedResearch.json()).entries,secondWatchBody.entries,
    'Forged owner ID changed second member research records');
   if(!secondWatchBody.entries.some(x=>x.symbol==='GUSIM')){
    const unauthorizedUpdate=await secondPage.request.post(origin+'/api/free-watchlist',
     {headers:{...secondAuth,'content-type':'application/json'},
      data:{action:'update',symbol:'GUSIM',user_id:signed.id,status:'NO_TRADE',
       sourceKind:'FICTIONAL',researchNote:qaResearch,sourceNote:'Fictional security QA only'},
      timeout:25000});
    assert.equal(unauthorizedUpdate.status(),404,
     'Second member could modify first member watchlist through a forged owner ID');
   }
   note('checks','Second account cannot select or modify first member research data.');

   // The browser client must enforce real database row ownership for Journal.
   // These are read-only requests; they never insert, update or delete member work.
   const journalRead=await secondPage.evaluate(async(primaryId)=>{
    const client=await window.getSupabaseClient();
    const result=await client.from('decision_journal')
     .select('id,user_id').eq('user_id',primaryId).limit(5);
    return {rows:Array.isArray(result.data)?result.data:[],error:result.error?.code||null};
   },signed.id);
   assert.equal(journalRead.rows.length,0,
    'Second Free account could read first account private Journal records');
   note('checks','Second account private Journal query cannot expose first member rows.');
   // Replay is service-private. A member cannot read another member's sessions
   // through direct PostgREST or override the authenticated resume lookup.
   const secondReplayRead=await secondPage.evaluate(async(primaryId)=>{
    const client=await window.getSupabaseClient();
    const result=await client.from('gu_replay_sessions_v01492')
      .select('id,user_id').eq('user_id',primaryId).limit(1);
    return {rows:Array.isArray(result.data)?result.data:[],
      rejected:!!result.error,code:result.error?.code||null};
   },signed.id);
   assert.equal(secondReplayRead.rows.length,0,
     'Second member accessed primary member replay session table');
   assert(secondReplayRead.rejected,
     'Service-private replay sessions should reject direct member table access');
   const otherReplay=await secondPage.request.get(
    origin+'/api/learning-replay-v01492?scope=fictional&action=resume',
    {headers:secondAuth,timeout:25000});
   assert.equal(otherReplay.status(),200,'Second member should query only own replay session');
   const otherReplayBody=await otherReplay.json();
   const spoofedReplay=await secondPage.request.get(
    origin+'/api/learning-replay-v01492?scope=fictional&action=resume&user_id='+signed.id,
    {headers:secondAuth,timeout:25000});
   assert.equal(spoofedReplay.status(),200,
     'Spoofed replay query must retain authenticated GET semantics');
   const spoofedReplayBody=await spoofedReplay.json();
   assert.deepEqual(spoofedReplayBody.session,otherReplayBody.session,
     'Caller supplied first-member ID switched second-member replay session');
   note('checks','Second authenticated member cannot access first member private fictional replay sessions.');
   await anotherContext.close();
  }else{
   note('blocked','Full cross-account isolation needs separate existing LAB_QA_SECOND_EMAIL/PASSWORD GitHub secrets. Anonymous denial is proven but not sufficient for two-member acceptance.');
  }
  report.completed=report.blocked.length===0&&report.failures.length===0;
  await context.close();
 }catch(e){
  note('failures',String(e.message||e).slice(0,470));
  process.exitCode=1;
 }finally{await browser?.close()}
}
mkdirSync('artifacts/public-acquisition',{recursive:true});
writeFileSync('artifacts/public-acquisition/free5-production-browser.json',
 JSON.stringify(report,null,2));
console.log('FREE5_PRODUCTION_QA '+JSON.stringify({checks:report.checks.length,
 blocked:report.blocked.length,failed:report.failures.length,complete:report.completed}));
if(!report.completed)process.exitCode=process.exitCode||2;

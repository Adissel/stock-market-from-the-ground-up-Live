/* Creates only the owner's dedicated noncommercial QA email-alias account.
 * It uses Supabase's normal /signup path with email confirmation still ON.
 * Separate password is derived in GitHub runner from the existing secret;
 * no password, JWT or confirmation token is committed or logged.
 */
import {readFileSync} from 'node:fs';
import {createHmac} from 'node:crypto';
import assert from 'node:assert/strict';
const root='stockmarketfromthegroundup+smfgu-qa2v1@gmail.com';
const primary=process.env.LAB_QA_PASSWORD;
if(!primary)throw Error('BLOCKED: existing noncommercial QA credential unavailable');
const config=readFileSync('config.js','utf8');
const url=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const anon=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&anon);
const secret=createHmac('sha256',primary).update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!';
const r=await fetch(url+'/auth/v1/signup',{
 method:'POST',cache:'no-store',signal:AbortSignal.timeout(25000),
 headers:{apikey:anon,'content-type':'application/json'},
 body:JSON.stringify({email:root,password:secret,
  data:{username:'QA_Secondary',qa_noncommercial:true,qa_purpose:'two-distinct-member-isolation',first_party_qa_only:true}})});
const body=await r.json().catch(()=>({}));
if(!r.ok)throw Error('Second user signup HTTP '+r.status+': '+String(body.code||body.error_code||'signup_failed'));
if(body?.access_token)throw Error('Email confirmation unexpectedly bypassed');
console.log('PASS: genuine Supabase Auth signup request accepted; email confirmation remains required.');
console.log('QA secondary email alias: '+root);
console.log('No credentials, email tokens, credits, entitlements or payments were printed or manually issued.');

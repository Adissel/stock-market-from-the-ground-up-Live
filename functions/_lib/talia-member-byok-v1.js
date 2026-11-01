/* SMFGU-TALIA-BYOK-001: reuse existing user_secure_credentials vault.
 * Optional Tutor provider remains disabled without explicit independent
 * provider-terms, credential-collection and member-inference approvals.
 * Never expose decrypted secrets to the browser, logs or model prompt.
 */
export const TALIA_MEMBER_PROVIDER='TALIA_OPENAI_BYO';
export const memberTutorByokCredentialsAllowed=env=>
 env?.TALIA_BYOK_PROVIDER_APPROVED==='true'&&
 env?.TALIA_BYOK_CREDENTIALS_APPROVED==='true';
export const memberTutorByokInferenceAllowed=env=>
 memberTutorByokCredentialsAllowed(env)&&env?.TALIA_BYOK_ENABLED==='true'&&
 env?.TALIA_BYOK_BILLING_DISCLOSURE_APPROVED==='true'&&
 /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(String(env?.TALIA_BYOK_MODEL||''))&&
 String(env?.TALIA_BYOK_APPROVED_MODELS||'').split(',').map(x=>x.trim()).includes(String(env?.TALIA_BYOK_MODEL||''));
const b64bytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
export async function decryptMemberTutorApiKey(env,cipher,iv){
 const raw=String(env?.MARKET_DATA_ENCRYPTION_KEY||'').trim();
 if(raw.length<16)throw new Error('Credential decryption is unavailable.');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));
 const key=await crypto.subtle.importKey('raw',digest,{name:'AES-GCM'},false,['decrypt']);
 const result=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64bytes(iv)},key,b64bytes(cipher));
 const values=JSON.parse(new TextDecoder().decode(result));
 if(!values||typeof values.apiKey!=='string'||!/^sk-[A-Za-z0-9_-]{16,240}$/.test(values.apiKey))
  throw new Error('Stored Tutor credential is invalid.');
 return values.apiKey;
}
export async function getMemberTutorApiKey(env,userId){
 if(!memberTutorByokInferenceAllowed(env))return null;
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userId||'')))return null;
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,'');
 const secret=String(env.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+$/.test(base)||!secret)return null;
 const path='user_secure_credentials?select=credential_ciphertext,credential_iv,status,metadata&user_id=eq.'+
  encodeURIComponent(userId)+'&service_code=eq.'+TALIA_MEMBER_PROVIDER+'&limit=1';
 const headers={apikey:secret,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))headers.authorization='Bearer '+secret;
 try{
  const response=await fetch(base+'/rest/v1/'+path,{headers,cache:'no-store'});
  if(!response.ok)return null;
  const data=await response.json();
  const item=Array.isArray(data)?data[0]:null;
  if(!item||item.status!=='connected'||item.metadata?.providerVerification!=='verified'||
     item.metadata?.providerTermsVersion!==String(env.TALIA_BYOK_PROVIDER_TERMS_VERSION||''))return null;
  return await decryptMemberTutorApiKey(env,item.credential_ciphertext,item.credential_iv);
 }catch{return null}
}

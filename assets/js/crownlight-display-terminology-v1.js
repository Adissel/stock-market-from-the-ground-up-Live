/* Crownlight sitewide display terminology — approved text removals.
 * Presentation only. Never mutate price data, source/provenance identifiers,
 * input values, authentication, saved member text, or technical function code.
 * Preserve raw authored content and data identifiers; only visible display copy changes.
 */
(function(root){
 'use strict';
 if(root.CrownlightDisplayTerminologyV1)return;
 const WORD=/Affiliate advertisement|\bsimulated\b|\billustration\b/gi;
 const LABELS=['aria-label','title','placeholder','alt'];
 const BLOCKED=new Set(['SCRIPT','STYLE','TEMPLATE','NOSCRIPT','TEXTAREA','PRE','CODE','KBD','SAMP']);
 function translate(text){
  return String(text).replace(WORD,'');
 }
 function skipped(node){
  for(let p=node?.nodeType===1?node:node?.parentElement;p&&p.nodeType===1;p=p.parentElement){
   if(BLOCKED.has(p.tagName)||p.isContentEditable||p.getAttribute?.('data-raw-provenance')==='true')
    return true;
  }
  return false;
 }
 function process(node){
  if(!node||skipped(node))return;
  const doc=root.document;if(!doc)return;
  function mutate(n){
   if(n.nodeType===3){
    if(!skipped(n)&&WORD.test(n.nodeValue||''))n.nodeValue=translate(n.nodeValue);
    WORD.lastIndex=0;
   }else if(n.nodeType===1){
    if(skipped(n))return;
    for(const name of LABELS){
     const value=n.getAttribute(name);
     if(value&&WORD.test(value))n.setAttribute(name,translate(value));
     WORD.lastIndex=0;
    }
   }
  }
  mutate(node);
  if(node.nodeType!==1&&node.nodeType!==9&&node.nodeType!==11)return;
  const walker=doc.createTreeWalker(node,root.NodeFilter.SHOW_ELEMENT|root.NodeFilter.SHOW_TEXT);
  let child;
  while((child=walker.nextNode()))mutate(child);
 }
 const pending=new Set();let scheduled=false,observer=null;
 const schedule=node=>{
  if(!node)return;pending.add(node);
  if(scheduled)return;scheduled=true;
  const frame=root.requestAnimationFrame||((fn)=>root.setTimeout(fn,32));
  frame(()=>{
   scheduled=false;
   const work=[...pending];pending.clear();
   for(const item of work)process(item);
  });
 };
 function start(){
  if(!root.document?.body||observer)return;
  process(root.document.documentElement);
  observer=new root.MutationObserver(records=>{
   for(const record of records){
    if(record.type==='characterData'||record.type==='attributes')schedule(record.target);
    else for(const child of record.addedNodes)schedule(child);
   }
  });
  observer.observe(root.document.documentElement,{subtree:true,childList:true,characterData:true,
   attributes:true,attributeFilter:LABELS});
 }
 root.CrownlightDisplayTerminologyV1=Object.freeze({version:'1.1.0',translate,start});
 if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})(typeof window!=='undefined'?window:globalThis);

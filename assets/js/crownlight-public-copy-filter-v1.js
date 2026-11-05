/* Crownlight V1 — public-copy word removal, owner directive 2026-11-04.
 * Presentation-only; does not mutate source data, member input or engine calculations.
 */
(()=>{
 'use strict';
 if(window.__crownlightPublicCopyFilterV1)return;
 window.__crownlightPublicCopyFilterV1=true;
 const OMIT=/\b(?:affiliate[ \t]+advertisement|simulated|illustration)\b/gi;
 const TEXT_ATTRS=['aria-label','aria-description','alt','title','placeholder'];
 const META_ATTRS='meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]';
 const EXCLUDE=new Set(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE','TEXTAREA']);
 const clean=value=>{
   if(typeof value!=='string')return value;
   return value.replace(OMIT,'').replace(/[ \t]{2,}/g,' ').replace(/[ \t]+([.,;:!?])/g,'$1');
 };
 const blocked=parent=>{
   const element=parent?.nodeType===1?parent:parent?.parentElement;
   return !element||EXCLUDE.has(element.tagName)||Boolean(element.closest('[contenteditable="true"]'));
 };
 const textNode=node=>{
   if(!node||node.nodeType!==3||blocked(node.parentElement))return;
   const next=clean(node.nodeValue);
   if(next!==node.nodeValue)node.nodeValue=next;
 };
 const attributes=element=>{
   if(!element||element.nodeType!==1||EXCLUDE.has(element.tagName))return;
   for(const attr of TEXT_ATTRS){
     if(!element.hasAttribute(attr))continue;
     const original=element.getAttribute(attr),next=clean(original);
     if(next!==original)element.setAttribute(attr,next);
   }
   if(element.matches(META_ATTRS)){
     const original=element.getAttribute('content');
     if(original!==null){
       const next=clean(original);
       if(next!==original)element.setAttribute('content',next);
     }
   }
   if(element.matches('input[type="button"],input[type="submit"],input[type="reset"]')){
     const original=element.value,next=clean(original);
     if(next!==original)element.value=next;
   }
 };
 const visit=root=>{
   if(!root)return;
   if(root.nodeType===3){textNode(root);return;}
   if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
   if(root.nodeType===1&&EXCLUDE.has(root.tagName))return;
   if(root.nodeType===1)attributes(root);
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){
     const node=walker.currentNode;
     if(node.nodeType===3)textNode(node);
     else if(node.nodeType===1)attributes(node);
   }
 };
 const start=()=>{
   visit(document.documentElement);
   const observer=new MutationObserver(records=>{
     for(const record of records){
       if(record.type==='characterData')textNode(record.target);
       else if(record.type==='attributes')attributes(record.target);
       else for(const node of record.addedNodes)visit(node);
     }
   });
   observer.observe(document.documentElement,{
     subtree:true,childList:true,characterData:true,attributes:true,
     attributeFilter:['aria-label','aria-description','alt','title','placeholder','content','value']
   });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();

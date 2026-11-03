/* Crownlight visual scanner v1 — additive to authenticated SCANNER_BUILDER.
 * Original design. No live quotes, no vendor scanner cloning, no unlicensed observations.
 */
(function(root){
 'use strict';
 function mount({host,getRows,provenance,savePreset,loadPresets}){
  const C=root.CrownlightScannerRulesV1;
  if(!host||!C)throw Error('Scanner rule engine unavailable.');
  const tree={type:'group',op:'AND',children:[
   {type:'rule',field:'price',op:'GTE',value:0.1},
   {type:'rule',field:'price',op:'LTE',value:13.75},
   {type:'rule',field:'change_pct',op:'GTE',value:5},
   {type:'rule',field:'volume',op:'GTE',value:250000}
  ]};
  let current=tree;
  const mk=(tag,cls,label)=>{
   const e=document.createElement(tag);if(cls)e.className=cls;
   if(label!==undefined)e.textContent=label;return e;
  };
  const button=(name,fn)=>{
   const b=mk('button','cl-scr-btn',name);b.type='button';b.onclick=fn;return b;
  };
  const option=(select,v,label)=>{
   const o=mk('option','',label||v);o.value=v;select.append(o);
  };
  const dropdown=(items,value,update)=>{
   const s=mk('select','cl-scr-select');s.setAttribute('aria-label','Scanner rule option');
   for(const [v,label] of items)option(s,v,label);
   s.value=value;s.onchange=()=>update(s.value);return s;
  };
  const status=mk('p','cl-scr-status','Imported snapshot research only. No live exchange data.');
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const report=(message)=>{status.textContent=message;};
  const area=mk('section','cl-scr-root');area.setAttribute('aria-label','Original visual scanner rule editor');
  const title=mk('h2','', 'Crownlight Visual Scanner · Technical Beta');
  const intro=mk('p','', 'Build and compare original research rules. Requires the dated member-supplied CSV in the existing form above. Values are not independently verified.');
  const toolbar=mk('div','cl-scr-toolbar'),editor=mk('div','cl-scr-editor'),results=mk('div','cl-scr-results');
  const viewHost=mk('div','cl-scr-view-host');
  const V=root.CrownlightScannerViewV2;
  if(!V)throw Error('Source-aware result view unavailable.');
  const templateLibrary=root.CrownlightScannerPresetsV2||root.CrownlightScannerTemplatesV1;
  if(!templateLibrary)throw Error('Original scanner templates unavailable.');
  const sortLabel=mk('label','','Sort matched results ');
  const sort=dropdown(Object.entries(C.FIELDS).map(([k,v])=>[k,v]),'change_pct',()=>{});
  sort.setAttribute('aria-label','Sort results by metric');sortLabel.append(sort);
  const direction=dropdown([['desc','Descending'],['asc','Ascending']],'desc',()=>{});
  direction.setAttribute('aria-label','Sort direction');
  const viewControl=V.mount({host:viewHost,engine:C,primarySort:()=>sort.value});
  function activeView(){return C.validateView({sort:sort.value,descending:direction.value==='desc',...viewControl.value()});}
  function restoreView(saved){const value=C.validateView(saved);sort.value=value.sort;direction.value=value.descending?'desc':'asc';viewControl.restore(value);}
  function selectField(node){
   return dropdown(Object.entries(C.FIELDS).map(([k,v])=>[k,v]),node.field,v=>{node.field=v;});
  }
  function ruleEditor(node,parent){
   const line=mk('div','cl-scr-rule');
   line.append(selectField(node));
   line.append(dropdown(C.OPS.map(x=>[x,x]),node.op,v=>{
    node.op=v;
    if(v==='BETWEEN'){delete node.compareField;node.value=Number(node.value)||0;node.maxValue=Number(node.value)+1;}
    else{delete node.maxValue;}
    draw();
   }));
   const mode=dropdown([['value','Compare to number'],['field','Compare to field']],
     node.compareField===undefined?'value':'field',v=>{
      if(v==='field'){node.compareField='vwap';delete node.value;delete node.maxValue;if(node.op==='BETWEEN')node.op='GTE';}
      else{delete node.compareField;node.value=0;}draw();
     });
   line.append(mode);
   if(node.compareField!==undefined){
    line.append(dropdown(Object.entries(C.FIELDS).map(([k,v])=>[k,v]),node.compareField,v=>{node.compareField=v;}));
   }else{
    const x=mk('input','cl-scr-value');x.type='number';x.step='any';x.value=String(node.value);
    x.setAttribute('aria-label','Comparison value');x.oninput=()=>{node.value=x.value;};line.append(x);
    if(node.op==='BETWEEN'){
     const y=mk('input','cl-scr-value');y.type='number';y.step='any';y.value=String(node.maxValue);
     y.setAttribute('aria-label','Upper bound');y.oninput=()=>{node.maxValue=y.value;};line.append(y);
    }
   }
   line.append(button('Remove rule',()=>{parent.children.splice(parent.children.indexOf(node),1);draw();}));
   return line;
  }
  function groupEditor(node,parent,depth){
   const box=mk('fieldset','cl-scr-group');
   const legend=mk('legend','','Rule group '+(depth+1));box.append(legend);
   const header=mk('div','cl-scr-toolbar');
   header.append(dropdown([['AND','All conditions (AND)'],['OR','Any condition (OR)']],node.op,v=>{node.op=v;}));
   header.append(button('Add condition',()=>{
    node.children.push({type:'rule',field:'volume',op:'GTE',value:100000});draw();
   }));
   if(depth<2)header.append(button('Add nested group',()=>{
    node.children.push({type:'group',op:'OR',children:[
     {type:'rule',field:'change_5m_pct',op:'GTE',value:0}]});draw();
   }));
   if(parent)header.append(button('Remove group',()=>{
    parent.children.splice(parent.children.indexOf(node),1);draw();
   }));
   box.append(header);
   const list=mk('div','cl-scr-children');
   for(const child of node.children)list.append(child.type==='group'?
     groupEditor(child,node,depth+1):ruleEditor(child,node));
   box.append(list);return box;
  }
  function draw(){editor.replaceChildren(groupEditor(current,null,0));}
  function renderResults(value){
   results.replaceChildren();
   const summary=mk('p','','Matched '+value.matched+' of '+value.inspected+
    ' supplied rows. Excluded: '+value.rejections.invalidInput+' invalid, '+
    value.rejections.duplicateTicker+' duplicate, '+
    value.rejections.missingEvidence+' incomplete and '+
    value.rejections.failedRule+' nonmatching.');
   results.append(summary);
   const table=mk('table','cl-scr-table'),caption=mk('caption','','Unverified member snapshot; top '+value.limit+' matching candidates. Not a recommendation.');
   const head=mk('thead'),tr=mk('tr');
   const columns=[['symbol','Symbol'],...value.columns.map(key=>[key,C.FIELDS[key]])];
   for(const [,label] of columns){const th=mk('th','',label);th.scope='col';tr.append(th);}
   const whyHeader=mk('th','','Rule evidence');whyHeader.scope='col';tr.append(whyHeader);
   const handoffHeader=mk('th','','Continue research');handoffHeader.scope='col';tr.append(handoffHeader);
   head.append(tr);table.append(caption,head);
   const tbody=mk('tbody');
   for(const record of value.rows){
    const r=mk('tr');
    for(const [key] of columns){
     const v=record[key];r.append(mk('td','',v===null?'Not supplied':String(v)));
    }
    const details=mk('details','cl-scr-explanation'),summary=mk('summary','','Explain criteria');
    details.append(summary);
    const intro=mk('p','','Educational scanner criteria on the supplied snapshot; not a market-data verification.');
    details.append(intro);
    const list=mk('ul');
    for(const item of record.ruleTrail.details){
     const label=item.path+' · '+C.FIELDS[item.field]+' ('+(item.observed===null?'Not supplied':item.observed)+
      ') '+item.op+' '+(item.comparisonField?C.FIELDS[item.comparisonField]+' ('+(item.target===null?'Not supplied':item.target)+')':String(item.target))+
      (item.upper===null?'':' to '+item.upper)+' — '+item.result;
     list.append(mk('li','',label));
    }
    details.append(list);
    const cell=mk('td');cell.append(details);r.append(cell);
    const researchCell=root.CrownlightScannerHandoffV4?.makeCell?.(document,record.symbol);
    r.append(researchCell||mk('td','','Research unavailable'));
    tbody.append(r);
   }
   table.append(tbody);results.append(table);
  }
  const templateLabel=mk('label','cl-scr-preset-label','Research preset ');
  const templateSelect=dropdown([['','Choose one of the source-based presets'],...templateLibrary.items.map(x=>[x.id,x.name])],'',()=>{});
  templateSelect.setAttribute('aria-label','Choose Crownlight scanner research preset');
  templateLabel.append(templateSelect);
  if(templateLibrary.filter&&Array.isArray(templateLibrary.categories)){
   const categoryLabel=mk('label','cl-scr-preset-label','Preset category ');
   const category=dropdown([['','All categories'],...templateLibrary.categories.map(x=>[x,x])],'',()=>refreshPresets());
   category.setAttribute('aria-label','Filter presets by category');
   categoryLabel.append(category);
   const searchLabel=mk('label','cl-scr-preset-label','Find preset ');
   const search=mk('input','cl-scr-preset-search');
   search.type='search';search.maxLength=120;search.placeholder='Price, gap, VWAP, volume…';
   search.setAttribute('aria-label','Find scanner preset by topic or required field');
   search.oninput=()=>refreshPresets();searchLabel.append(search);
   const counter=mk('p','cl-scr-preset-counter',templateLibrary.count+' source-only presets. Imported snapshots are unverified.');
   counter.setAttribute('role','status');
   function refreshPresets(){
    const matches=templateLibrary.filter({category:category.value,query:search.value});
    const previouslySelected=templateSelect.value;
    templateSelect.replaceChildren();
    option(templateSelect,'','Choose a research preset');
    for(const item of matches)option(templateSelect,item.id,item.name);
    templateSelect.value=matches.some(x=>x.id===previouslySelected)?previouslySelected:'';
    counter.textContent=matches.length+' of '+templateLibrary.count+' presets available in this view; data and signal validity not certified.';
   }
   toolbar.append(categoryLabel,searchLabel,counter);
  }
  toolbar.append(templateLabel);
  toolbar.append(button('Apply preset',()=>{
   try{
    const template=templateLibrary.lookup(templateSelect.value);
    if(!template)throw Error('Select a preset first.');
    current=C.validate(template.rules);draw();results.replaceChildren();
    const sourcePaths=template.sourceFiles?.length?template.sourceFiles.slice(0,2).join(' · '):'Original scanner research files';
    report(template.name+': '+template.description+' Required supplied CSV fields: '+
      template.requiredFields.join(', ')+'. Source basis: '+sourcePaths+
      '. These are editable research criteria, not verified trade entries.');
   }catch(e){report(e.message);}
  }));
  toolbar.append(sortLabel,direction);
  toolbar.append(button('Run visual scan',()=>{
   try{
    if(!getRows().length)throw Error('Import an authorized dated snapshot above first.');
    const p=provenance(),result=C.analyze(getRows(),current,
      activeView());
    renderResults(result);
    report('Calculated locally on unverified snapshot '+p.sourceNote+' at '+p.asOf+'. No quote freshness or provider permissions verified.');
   }catch(e){results.replaceChildren();report(e.message);}
  }));
  toolbar.append(button('Save private rules',async()=>{
   try{
    const p=provenance(),normalized=C.validate(current);
    await savePreset({visualRules:normalized,view:activeView(),ruleEngine:'CROWNLIGHT_SCANNER_V1',
      sourceNote:p.sourceNote,asOf:p.asOf,verified:false,liveFeed:false,
      kind:'UNVERIFIED_RESEARCH_CRITERIA'});
    report('Rules and source note saved in your authenticated private workspace; input market data not saved.');
   }catch(e){report(e.message);}
  }));
  toolbar.append(button('Load latest saved rules',async()=>{
   try{
    const records=await loadPresets();
    const found=records.find(x=>x.payload&&x.payload.visualRules);
    if(!found)throw Error('No private visual scanner rule set found.');
    const loaded=C.validate(found.payload.visualRules);
    const restored=found.payload.view?C.validateView(found.payload.view):null;
    current=loaded;if(restored)restoreView(restored);draw();results.replaceChildren();
    report('Saved criteria restored. Market snapshot must be imported again; quotes are not stored.');
   }catch(e){report(e.message);}
  }));
  toolbar.append(button('Export criteria',()=>{
   try{
    const blob=new Blob([JSON.stringify({format:'CROWNLIGHT_SCANNER_V1',rules:C.validate(current),view:activeView()},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=mk('a');a.href=url;a.download='crownlight-scanner-rules.json';
    a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    report('Exported rules only, with no market data or credentials.');
   }catch(e){report(e.message);}
  }));
  const file=mk('input');file.type='file';file.accept='.json,application/json';file.setAttribute('aria-label','Import Crownlight rules JSON');
  file.onchange=async()=>{
   try{
    const f=file.files&&file.files[0];
    if(!f||f.size>24000)throw Error('Rule import must be 24 KB or less.');
    const input=JSON.parse(await f.text());
    if(input.format!=='CROWNLIGHT_SCANNER_V1')throw Error('Unknown import format.');
    const incoming=C.validate(input.rules);
    const nextView=input.view?C.validateView(input.view):null;
    current=incoming;if(nextView)restoreView(nextView);draw();results.replaceChildren();
    report('Rules imported locally. Verify their values and snapshot rights.');
   }catch(e){report(e.message);}finally{file.value='';}
  };
  area.append(title,intro,toolbar,viewHost,file,editor,status,results);
  host.append(area);draw();
 }
 root.CrownlightScannerVisualV1=Object.freeze({mount});
})(globalThis);

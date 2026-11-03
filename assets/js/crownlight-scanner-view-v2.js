/* Crownlight source-aware result columns — original, local-only display configuration. */
(function(root){
'use strict';
function mount({host,engine,primarySort}){
 if(!host||!engine||!engine.validateView)throw Error('Result view dependencies unavailable.');
 const section=document.createElement('fieldset');section.className='cl-scr-group';
 const heading=document.createElement('legend');heading.textContent='Result columns and secondary sorting';section.append(heading);
 const instruction=document.createElement('p');
 instruction.textContent='Select up to 12 research metrics. Missing values remain “Not supplied”. Columns do not authorize data feeds.';
 section.append(instruction);
 const fields=document.createElement('div');fields.className='cl-scr-column-choices';
 let columns=Array.from(engine.DEFAULT_COLUMNS);
 const note=document.createElement('p');note.className='cl-scr-status';
 note.setAttribute('role','status');note.setAttribute('aria-live','polite');
 const checkboxes=new Map();
 for(const [key,name] of Object.entries(engine.FIELDS)){
  const label=document.createElement('label');label.className='cl-scr-col-label';
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=key;checkbox.checked=columns.includes(key);
  checkbox.setAttribute('aria-label','Include result column: '+name);
  checkbox.onchange=()=>{
   if(checkbox.checked){
    if(columns.length>=12){checkbox.checked=false;note.textContent='Maximum 12 columns. Deselect another field first.';return;}
    columns.push(key);
   }else{
    if(columns.length===1){checkbox.checked=true;note.textContent='At least one result column is required.';return;}
    columns=columns.filter(x=>x!==key);
   }
   note.textContent=columns.length+' columns selected; symbol is always shown.';
  };
  checkboxes.set(key,checkbox);label.append(checkbox,document.createTextNode(name));fields.append(label);
 }
 section.append(fields,note);
 const row=document.createElement('div');row.className='cl-scr-toolbar';
 const sortLabel=document.createElement('label');sortLabel.textContent='Secondary sort ';
 const secondary=document.createElement('select');secondary.className='cl-scr-select';secondary.setAttribute('aria-label','Secondary sort field');
 function option(select,value,label){const x=document.createElement('option');x.value=value;x.textContent=label;select.append(x);}
 option(secondary,'','No secondary sorting');
 for(const [key,name] of Object.entries(engine.FIELDS))option(secondary,key,name);
 sortLabel.append(secondary);row.append(sortLabel);
 const descLabel=document.createElement('label');descLabel.textContent='Secondary direction ';
 const secondaryDirection=document.createElement('select');secondaryDirection.className='cl-scr-select';
 secondaryDirection.setAttribute('aria-label','Secondary sort direction');
 option(secondaryDirection,'desc','Descending');option(secondaryDirection,'asc','Ascending');descLabel.append(secondaryDirection);row.append(descLabel);
 section.append(row);host.append(section);
 function value(){
  const sort=secondary.value===primarySort()?'':secondary.value;
  if(sort!==secondary.value)note.textContent='Secondary field cannot equal primary sort; secondary sorting disabled.';
  return {columns:columns.slice(),secondarySort:sort||null,secondaryDescending:secondaryDirection.value==='desc'};
 }
 function restore(input){
  const valid=engine.validateView(input);
  columns=valid.columns.slice();
  for(const [key,checkbox] of checkboxes)checkbox.checked=columns.includes(key);
  secondary.value=valid.secondarySort||'';
  secondaryDirection.value=valid.secondaryDescending?'desc':'asc';
  note.textContent='Saved result columns and secondary sorting restored; market data not loaded.';
 }
 return Object.freeze({value,restore});
}
root.CrownlightScannerViewV2=Object.freeze({mount});
})(globalThis);

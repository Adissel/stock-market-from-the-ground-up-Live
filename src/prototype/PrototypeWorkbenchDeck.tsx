/** Crownlight Prototype Center V7 — executive-grade workbench navigation.
 * Read-only React presentation. Existing vanilla JavaScript owns auth, charts,
 * member draft state and protected teaching; no duplicate authority or APIs.
 */
import React, {useEffect, useState} from 'react';
import {createRoot, type Root} from 'react-dom/client';

type WorkspaceId = 'classroom'|'studio'|'labs'|'3d'|'visuals'|'bootcamps';
type WorkbenchMessage = CustomEvent<{id: string}>;
type ViewMode = 'analysis'|'focus-chart'|'focus-lesson';
const quick: ReadonlyArray<{id:WorkspaceId; code:string; title:string; subtitle:string}> = [
  {id:'classroom',code:'01',title:'Classroom',subtitle:'Design & teach'},
  {id:'studio',code:'02',title:'Chart Studio',subtitle:'Technical studies'},
  {id:'labs',code:'03',title:'Learning Labs',subtitle:'Guided practice'},
  {id:'3d',code:'04',title:'3D / WebGL',subtitle:'Spatial analysis'},
  {id:'visuals',code:'05',title:'Visualizations',subtitle:'ECharts engine'},
  {id:'bootcamps',code:'06',title:'Boot Camps',subtitle:'Learning paths'}
] as const;
const views: ReadonlyArray<{value:ViewMode;label:string;title:string}>=[
  {value:'analysis',label:'Split',title:'Chart and instruction side by side'},
  {value:'focus-chart',label:'Chart focus',title:'Expand the chart and move instruction below'},
  {value:'focus-lesson',label:'Lesson focus',title:'Expand instruction and move chart below'}
];
function Deck() {
  const [active,setActive] = useState<string>('classroom');
  const [mode,setMode] = useState<ViewMode>('analysis');
  useEffect(()=>{
    const onWorkspace=(event:Event)=>{const id=(event as WorkbenchMessage).detail?.id;if(typeof id==='string')setActive(id)};
    window.addEventListener('crownlight:prototype-workspace',onWorkspace);
    const initial=window.location.hash.slice(1);
    if(initial)setActive(initial);
    return ()=>window.removeEventListener('crownlight:prototype-workspace',onWorkspace);
  },[]);
  const open=(id:WorkspaceId)=>{
    window.dispatchEvent(new CustomEvent('crownlight:prototype-navigate',{detail:{id}}));
  };
  const setView=(value:ViewMode)=>{
    setMode(value);
    window.dispatchEvent(new CustomEvent('crownlight:prototype-view',{detail:{mode:value}}));
  };
  const scrollEditor=()=>document.getElementById('pt-designer')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  return <section className="pt-command" aria-label="Prototype workspace shortcuts">
    <div className="pt-command-heading">
      <div className="pt-command-identity">
        <span className="pt-command-mark" aria-hidden="true"><span>C</span><span className="pt-command-monogram">L</span></span>
        <div className="pt-command-identity-text"><span className="pt-command-kicker">CROWN & LANTERN / PRODUCT LABORATORY</span>
          <strong>Prototype <em>Workbench</em> <span className="pt-command-version">/ 07</span></strong>
          <small>EXPERIMENT · EVALUATE · REFINE</small>
        </div>
      </div>
      <div className="pt-command-actions">
        <span className="pt-command-live"><i aria-hidden="true"/> PRIVATE / STAFF ONLY</span>
        <button type="button" className="pt-command-editor" onClick={scrollEditor}>Open designer <span aria-hidden="true">↗</span></button>
      </div>
    </div>
    <div className="pt-command-secondary">
      <div className="pt-command-menu" role="group" aria-label="Quick workspace navigation">
        {quick.map(item=><button key={item.id} type="button" className="pt-command-link" aria-pressed={active===item.id} onClick={()=>open(item.id)}>
          <span className="pt-command-num">{item.code}</span>
          <span className="pt-command-label"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
          <span className="pt-command-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className="pt-command-layout" role="group" aria-label="Preview layout">
        <span className="pt-command-layout-label">CANVAS</span>
        {views.map(view=><button key={view.value} type="button" title={view.title} aria-pressed={mode===view.value}
          className="pt-command-view" onClick={()=>setView(view.value)}>{view.label}</button>)}
      </div>
    </div>
    <div className="pt-command-footer"><span><span className="pt-command-dot"/> READ-ONLY SYNTHETIC ENVIRONMENT</span><span>HTML5 / REACT / TYPESCRIPT / JAVASCRIPT / ECHARTS / THREE.JS</span></div>
  </section>;
}
export function mountPrototypeDeck(element:HTMLElement):()=>void{
  const root:Root=createRoot(element);root.render(<Deck/>);
  return ()=>root.unmount();
}

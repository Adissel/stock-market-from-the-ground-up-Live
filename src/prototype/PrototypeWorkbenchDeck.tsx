/** Crownlight Prototype Center v6 — React + TypeScript command deck.
 * Presentation and navigation only. Staff authorization remains server-controlled
 * in prototype-center-v1.js and the existing protected-document API.
 */
import React, {useEffect, useState} from 'react';
import {createRoot, type Root} from 'react-dom/client';

type WorkspaceId = 'classroom'|'studio'|'labs'|'3d'|'visuals'|'bootcamps';
type WorkbenchMessage = CustomEvent<{id: string}>;
const quick: ReadonlyArray<{id:WorkspaceId; code:string; title:string; subtitle:string}> = [
  {id:'classroom',code:'01',title:'Classroom',subtitle:'Design & teach'},
  {id:'studio',code:'02',title:'Chart Studio',subtitle:'Trading layouts'},
  {id:'labs',code:'03',title:'Learning Labs',subtitle:'Interactive cases'},
  {id:'3d',code:'04',title:'3D / WebGL',subtitle:'Spatial candles'},
  {id:'visuals',code:'05',title:'Visualizations',subtitle:'2D ECharts'},
  {id:'bootcamps',code:'06',title:'Boot Camps',subtitle:'Study journeys'}
] as const;

function Deck() {
  const [active,setActive] = useState<string>('classroom');
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
  const scrollEditor=()=>document.getElementById('pt-designer')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  return <section className="pt-command" aria-label="Prototype workspace shortcuts">
    <div className="pt-command-heading">
      <div className="pt-command-identity"><span className="pt-command-mark" aria-hidden="true">CL</span>
        <div><strong>Prototype Workbench <span className="pt-command-version">v6</span></strong><small>DESIGN SYSTEM / VISUAL ENGINEERING</small></div>
      </div>
      <div className="pt-command-actions">
        <span className="pt-command-live"><i aria-hidden="true"/> Authorized staff workspace</span>
        <button type="button" className="pt-command-editor" onClick={scrollEditor}>Open design controls</button>
      </div>
    </div>
    <div className="pt-command-menu" role="group" aria-label="Quick workspace navigation">
      {quick.map(item=><button key={item.id} type="button" className="pt-command-link" aria-pressed={active===item.id} onClick={()=>open(item.id)}>
        <span className="pt-command-num">{item.code}</span>
        <span className="pt-command-label"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
        <span className="pt-command-arrow" aria-hidden="true">↗</span>
      </button>)}
    </div>
  </section>;
}
export function mountPrototypeDeck(element:HTMLElement):()=>void{
  const root:Root=createRoot(element);root.render(<Deck/>);
  return ()=>root.unmount();
}

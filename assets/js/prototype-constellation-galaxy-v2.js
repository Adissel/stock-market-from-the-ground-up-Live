/* Crownlight Learning Constellation V4 — bounded, offline, additive WebGL starfield.
 * Browser-supplied GPU only. No third-party textures, subscriptions, data feeds,
 * cookies, network calls, user records, answers, entitlements or graded writes.
 * The semantic DOM nodes / SVG edges stay readable without WebGL.
 */
export function mountConstellationGalaxy(canvas, readCamera){
 const noop=()=>{};
 if(!canvas||typeof readCamera!=='function')return {render:noop,dispose:noop,supported:false};
 let gl;
 try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power'})}catch{}
 if(!gl){canvas.dataset.renderer='css-fallback';return {render:noop,dispose:noop,supported:false}}
 const vertexShader=`
 attribute vec3 aPos;
 attribute float aHue;
 uniform vec2 uOrbit;
 uniform float uDepth;
 uniform vec2 uSize;
 varying float vHue;
 varying float vBright;
 void main(){
  float cy=cos(uOrbit.x),sy=sin(uOrbit.x);
  float cp=cos(uOrbit.y),sp=sin(uOrbit.y);
  vec3 p=vec3(aPos.x*cy+aPos.z*sy,aPos.y,-aPos.x*sy+aPos.z*cy);
  p=vec3(p.x,p.y*cp-p.z*sp,p.y*sp+p.z*cp);
  float scale=clamp(940. / (940.-p.z*uDepth),.55,1.65);
  vec2 pos=vec2(p.x/525.,p.y/340.)*scale;
  pos.x *= min(1.,uSize.y*1.54/max(uSize.x,1.));
  gl_Position=vec4(pos,0.,1.);
  gl_PointSize=clamp((1.2+mod(aHue*31.,4.))*scale,1.,7.);
  vHue=aHue;
  vBright=.36+.5*scale;
 }
 `;
 const fragmentShader=`
 precision mediump float;
 varying float vHue;
 varying float vBright;
 void main(){
  float r=length(gl_PointCoord-vec2(.5));
  if(r>=.5)discard;
  vec3 ice=vec3(.36,.96,1.);
  vec3 lavender=vec3(.74,.46,1.);
  vec3 amber=vec3(1.,.76,.37);
  vec3 color=mix(ice,lavender,smoothstep(.45,.78,vHue));
  color=mix(color,amber,smoothstep(.86,.96,vHue));
  float core=pow(max(0.,1.-r*2.),3.);
  gl_FragColor=vec4(color,clamp((.18+.82*core)*vBright,0.,1.));
 }
 `;
 const makeShader=(type,source)=>{
  const shader=gl.createShader(type);if(!shader)return null;
  gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null}
  return shader;
 };
 const vertex=makeShader(gl.VERTEX_SHADER,vertexShader),fragment=makeShader(gl.FRAGMENT_SHADER,fragmentShader);
 const program=vertex&&fragment?gl.createProgram():null;
 if(!program){if(vertex)gl.deleteShader(vertex);if(fragment)gl.deleteShader(fragment);
  canvas.dataset.renderer='css-fallback';return {render:noop,dispose:noop,supported:false}}
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
  gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
  canvas.dataset.renderer='css-fallback';return {render:noop,dispose:noop,supported:false}
 }
 // Seeded points make screenshots repeatable across Owner/Admin sessions.
 let seed=146959810;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const count=matchMedia('(max-width: 700px)').matches?640:1250;
 const vertices=new Float32Array(count*4);
 for(let i=0;i<count;i++){
  const ring=i%7===0;
  const angle=random()*Math.PI*2;
  const r=ring?160+random()*260:Math.sqrt(random())*545;
  vertices[4*i]=Math.cos(angle)*r;
  vertices[4*i+1]=(random()-.5)*690;
  vertices[4*i+2]=(random()-.5)*870;
  vertices[4*i+3]=random();
 }
 const buffer=gl.createBuffer();
 if(!buffer){gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);canvas.dataset.renderer='css-fallback';return {render:noop,dispose:noop,supported:false}}
 gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
 const position=gl.getAttribLocation(program,'aPos'),hue=gl.getAttribLocation(program,'aHue');
 const orbit=gl.getUniformLocation(program,'uOrbit'),depth=gl.getUniformLocation(program,'uDepth');
 const viewport=gl.getUniformLocation(program,'uSize');
 let disposed=false,lost=false;const lostHandler=e=>{e.preventDefault();lost=true;canvas.dataset.renderer='css-fallback'};
 canvas.addEventListener('webglcontextlost',lostHandler,false);
 canvas.dataset.renderer='webgl';
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
 const render=()=>{
  if(disposed||lost)return;
  const rect=canvas.getBoundingClientRect();
  const ratio=Math.min(1.5,window.devicePixelRatio||1),w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
  if(w<10||h<10)return;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
  const camera=readCamera(),flat=Boolean(camera.flat);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  if(flat)return;
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  if(position>=0){gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,16,0)}
  if(hue>=0){gl.enableVertexAttribArray(hue);gl.vertexAttribPointer(hue,1,gl.FLOAT,false,16,12)}
  gl.uniform2f(orbit,Number(camera.yaw)||0,Number(camera.pitch)||0);
  gl.uniform1f(depth,Number(camera.depth)||0);
  gl.uniform2f(viewport,w,h);gl.drawArrays(gl.POINTS,0,count);
 };
 const dispose=()=>{
  if(disposed)return;disposed=true;
  canvas.removeEventListener('webglcontextlost',lostHandler,false);
  if(!lost){gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)}
  canvas.dataset.renderer='disposed';
 };
 return {render,dispose,supported:true};
}

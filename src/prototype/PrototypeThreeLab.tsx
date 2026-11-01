/**
 * Crownlight Prototype Three Lab — internal, fictional visualization only.
 * Build-time bundled React/TypeScript/Three.js; no private data or service calls.
 */
import React, { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type CameraMode = 'perspective' | 'orthographic';
type DemoBar = Readonly<{ label: string; open: number; high: number; low: number; close: number; volume: number }>;
const candles: readonly DemoBar[] = [
  {label:'09:30',open:101.0,high:101.8,low:100.5,close:101.6,volume:320},
  {label:'09:35',open:101.6,high:102.1,low:100.9,close:101.1,volume:380},
  {label:'09:40',open:101.1,high:101.4,low:100.2,close:100.5,volume:470},
  {label:'09:45',open:100.5,high:101.2,low:100.1,close:101.0,volume:510},
  {label:'09:50',open:101.0,high:102.6,low:100.8,close:102.3,volume:620},
  {label:'09:55',open:102.3,high:103.1,low:101.9,close:102.9,volume:660},
  {label:'10:00',open:102.9,high:103.4,low:102.0,close:102.2,volume:540},
  {label:'10:05',open:102.2,high:102.8,low:101.5,close:101.8,volume:480},
  {label:'10:10',open:101.8,high:103.0,low:101.6,close:102.7,volume:730},
  {label:'10:15',open:102.7,high:104.2,low:102.5,close:103.9,volume:910},
  {label:'10:20',open:103.9,high:104.5,low:103.0,close:103.2,volume:780},
  {label:'10:25',open:103.2,high:103.6,low:102.7,close:103.0,volume:650},
  {label:'10:30',open:103.0,high:104.1,low:102.9,close:103.8,volume:860},
  {label:'10:35',open:103.8,high:105.1,low:103.5,close:104.9,volume:1010},
  {label:'10:40',open:104.9,high:105.3,low:104.0,close:104.3,volume:890},
  {label:'10:45',open:104.3,high:105.4,low:104.1,close:105.0,volume:990}
];
const currency = (n: number): string => '$' + n.toFixed(2);

function ThreeCanvas({ shown, cameraMode, resetKey }: {shown: number; cameraMode: CameraMode; resetKey: number}) {
  const mount = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({alpha: false, antialias: true, powerPreference: 'low-power'});
    } catch {
      setMessage('WebGL is unavailable. The source-data table below remains available.');
      return;
    }
    setMessage('');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x091825);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    const scene = new THREE.Scene();
    const aspect = Math.max(1, host.clientWidth) / Math.max(1, host.clientHeight);
    const perspective = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    const orthographic = new THREE.OrthographicCamera(-9 * aspect, 9 * aspect, 9, -9, 0.1, 100);
    const camera: THREE.Camera = cameraMode === 'perspective' ? perspective : orthographic;
    camera.position.set(11, 12, 17);
    camera.lookAt(0, 3, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 3, 0);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 40;
    controls.update();
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 14, 10);
    scene.add(light);
    const grid = new THREE.GridHelper(18, 18, 0x5b7a8d, 0x274354);
    grid.position.y = -0.02;
    scene.add(grid);
    const up = new THREE.MeshStandardMaterial({color:0x56c7b8, roughness:0.54});
    const down = new THREE.MeshStandardMaterial({color:0xf37b80, roughness:0.54});
    const volumeMaterial = new THREE.MeshStandardMaterial({color:0x6688a0, transparent:true, opacity:0.68});
    const geom = new THREE.BoxGeometry(0.54, 1, 0.54);
    const volumeGeometry = new THREE.BoxGeometry(0.54, 1, 0.54);
    const wickGeometries: THREE.BufferGeometry[] = [];
    const wickMaterials: THREE.LineBasicMaterial[] = [];
    const minPrice = 99;
    const point = (value: number) => 1.1 + (value - minPrice) * 1.15;
    for (let i = 0; i < shown; i++) {
      const b = candles[i], x = (i - (shown - 1) / 2) * 0.91;
      const bottom = point(Math.min(b.open, b.close));
      const top = point(Math.max(b.open, b.close));
      const body = new THREE.Mesh(geom, b.close >= b.open ? up : down);
      body.scale.y = Math.max(0.09, top - bottom);
      body.position.set(x, (bottom + top) / 2, 0);
      scene.add(body);
      const wickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, point(b.low), 0), new THREE.Vector3(x, point(b.high), 0)
      ]);
      const wickMaterial = new THREE.LineBasicMaterial({color:b.close >= b.open ? 0x9aeee2 : 0xffadb0});
      wickGeometries.push(wickGeometry);
      wickMaterials.push(wickMaterial);
      scene.add(new THREE.Line(wickGeometry, wickMaterial));
      const vh = b.volume / 540;
      const volume = new THREE.Mesh(volumeGeometry, volumeMaterial);
      volume.position.set(x, vh / 2, -1.35);
      volume.scale.set(1, vh, 0.85);
      scene.add(volume);
    }
    function draw(): void { renderer.render(scene, camera); }
    function resize(): void {
      if (!host) return;
      const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
      } else if (camera instanceof THREE.OrthographicCamera) {
        camera.left = -9 * width / height; camera.right = 9 * width / height;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      draw();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    controls.addEventListener('change', draw);
    resize();
    return () => {
      observer.disconnect();
      controls.removeEventListener('change', draw);
      controls.dispose();
      scene.traverse(node => {
        if (node instanceof THREE.Mesh && node.geometry !== geom && node.geometry !== volumeGeometry) node.geometry.dispose();
      });
      geom.dispose();
      volumeGeometry.dispose();
      wickGeometries.forEach(g => g.dispose());
      wickMaterials.forEach(m => m.dispose());
      up.dispose(); down.dispose(); volumeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [shown, cameraMode, resetKey]);
  return <div className="pt-three-canvas" ref={mount} role="img"
    aria-label={"Three-dimensional fictional candlestick demonstration showing " + shown + " OHLC bars and synthetic volume columns."}>
    {message && <p className="pt-three-fallback" role="status">{message}</p>}
  </div>;
}

function PrototypeThreeLab() {
  const [shown, setShown] = useState(12);
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective');
  const [resetKey, setResetKey] = useState(0);
  const latest = candles[shown - 1];
  return <section className="pt-three-shell" aria-labelledby="pt-three-title">
    <header className="pt-three-head">
      <div>
        <p className="pt-eyebrow">WebGL × Three.js × React + TypeScript</p>
        <h3 id="pt-three-title">3D Market Structure Laboratory</h3>
        <p>Rotate and inspect a three-dimensional representation of fictional candles and volume. This is a demonstration of browser rendering, not an actual market replay.</p>
      </div>
      <span className="pt-three-status">FICTIONAL · READ ONLY</span>
    </header>
    <div className="pt-three-controls">
      <label htmlFor="pt-three-count">Visible candles: <strong>{shown} of {candles.length}</strong>
        <input id="pt-three-count" type="range" min="4" max={candles.length} value={shown}
          onChange={event => setShown(Number(event.currentTarget.value))} />
      </label>
      <label htmlFor="pt-three-camera">Camera projection
        <select id="pt-three-camera" value={cameraMode}
          onChange={event => setCameraMode(event.currentTarget.value as CameraMode)}>
          <option value="perspective">Perspective</option>
          <option value="orthographic">Orthographic</option>
        </select>
      </label>
      <button type="button" onClick={() => setResetKey(key => key + 1)}>Reset 3D view</button>
    </div>
    <div className="pt-three-view">
      <ThreeCanvas shown={shown} cameraMode={cameraMode} resetKey={resetKey} />
      <aside className="pt-three-readout" aria-label="Illustrative OHLC readout">
        <div><small>Latest displayed bar</small><strong>{latest.label}</strong></div>
        <dl>
          <div><dt>Open</dt><dd>{currency(latest.open)}</dd></div>
          <div><dt>High</dt><dd>{currency(latest.high)}</dd></div>
          <div><dt>Low</dt><dd>{currency(latest.low)}</dd></div>
          <div><dt>Close</dt><dd>{currency(latest.close)}</dd></div>
          <div><dt>Volume</dt><dd>{latest.volume.toLocaleString('en-US')} fictional shares</dd></div>
        </dl>
        <p>Rotate by dragging. Zoom with the mouse wheel or touch gestures. Use the controls above without a pointer.</p>
        <p className="pt-three-legend"><span className="pt-three-up">■</span> Close ≥ open <span className="pt-three-down">■</span> Close &lt; open</p>
      </aside>
    </div>
    <details className="pt-three-details">
      <summary>Accessible source-data table for displayed fictional candles</summary>
      <div className="pt-table-scroll" tabIndex={0}>
        <table className="pt-table">
          <caption>Fictional OHLC and volume values. No historical market data.</caption>
          <thead><tr><th scope="col">Time</th><th scope="col">Open</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Close</th><th scope="col">Volume</th></tr></thead>
          <tbody>{candles.slice(0, shown).map(bar => <tr key={bar.label}>
            <th scope="row">{bar.label}</th>
            <td>{currency(bar.open)}</td><td>{currency(bar.high)}</td><td>{currency(bar.low)}</td><td>{currency(bar.close)}</td><td>{bar.volume}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </details>
    <p className="pt-note">Prototype boundary: no live market feed, user account data, protected answer key, real-money action, or membership entitlement change.</p>
  </section>;
}
export function mountPrototypeThree(target: HTMLElement): () => void {
  const root: Root = createRoot(target);
  root.render(<PrototypeThreeLab />);
  return () => root.unmount();
}

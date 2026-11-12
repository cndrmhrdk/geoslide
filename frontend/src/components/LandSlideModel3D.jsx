import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './LandslideModel3D.css';

/**
 * LandslideModel3D — penampang lereng 3D yang bisa diputar.
 *
 * Cara kerjanya (urutan dari atas ke bawah file):
 *  1. LAYERS      : daftar lapisan tanah. Tiap lapisan = poligon 2D (x, y) penampang samping.
 *  2. makeLayer() : mengubah poligon 2D jadi balok 3D dengan "extrude" (ditarik ke arah z).
 *  3. useEffect   : menyiapkan scene, kamera, cahaya, kontrol putar, lalu loop render.
 */

const DEPTH = 5; // lebar model ke arah z

// Setiap titik [x, y]. Permukaan lereng turun dari kiri (puncak) ke kanan (kaki lereng).
const LAYERS = [
  {
    name: 'Batuan dasar',
    color: '#8e9089',
    points: [[0, -1], [13, -1], [13, 0.5], [10.6, 0.5], [3.2, 3.15], [0, 3.4]],
  },
  {
    name: 'Tanah lapuk',
    color: '#b58a58',
    points: [[0, 3.4], [3.2, 3.15], [10.6, 0.5], [13, 0.5], [13, 0.85], [10.4, 0.88], [7.6, 2.2], [3.8, 5.2], [2.8, 5.6], [0, 5.6]],
  },
  {
    name: 'Tanah pucuk',
    color: '#6e4a2c',
    points: [[0, 5.6], [2.8, 5.6], [3.8, 5.2], [7.6, 2.2], [10.4, 0.88], [13, 0.85], [13, 0.93], [10.4, 0.96], [7.6, 2.55], [3.8, 5.55], [2.8, 5.95], [0, 5.95]],
  },
  {
    name: 'Vegetasi',
    color: '#6f9b3f',
    points: [[0, 5.95], [2.8, 5.95], [3.8, 5.55], [7.6, 2.55], [10.4, 0.96], [13, 0.93], [13, 1.0], [10.4, 1.03], [7.6, 2.62], [3.8, 5.62], [2.8, 6.02], [0, 6.02]],
  },
];

function makeLayer({ points, color }) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
  geometry.translate(0, 0, -DEPTH / 2); // pusatkan di z = 0

  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 1 }));

  // Garis tepi tipis agar bentuk lapisan jelas
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 25),
    new THREE.LineBasicMaterial({ color: '#2b1d12', transparent: true, opacity: 0.35 }),
  );
  mesh.add(edges);
  return mesh;
}

export default function LandslideModel3D() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    // --- Scene, kamera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(9, 7.5, 15.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    // --- Cahaya
    scene.add(new THREE.HemisphereLight('#ffffff', '#b9b2a0', 0.8));
    const sun = new THREE.DirectionalLight('#ffffff', 1);
    sun.position.set(8, 12, 6);
    scene.add(sun);

    // --- Model
    const model = new THREE.Group();
    LAYERS.forEach((layer) => model.add(makeLayer(layer)));
    scene.add(model);

    // TODO 1: tambahkan garis merah "bidang gelincir" di batas Tanah lapuk & Batuan dasar
    // TODO 2: tambahkan muka air tanah (kotak biru transparan) yang tingginya mengikuti slider hujan
    // TODO 3: animasi longsor (geser mesh Tanah lapuk/pucuk/vegetasi ke arah bawah lereng)

    // --- Kontrol putar (seret mouse / jari)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(6.5, 2.4, 0);
    controls.enableDamping = true;
    controls.enableZoom = false; // supaya scroll halaman tidak terganggu
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.48; // tidak bisa melihat dari bawah tanah
    controls.update();

    // --- Ukuran mengikuti wadah
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    // --- Loop render
    let frame;
    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };
    loop();

    // --- Bersih-bersih saat komponen dilepas
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      model.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="ls3d"
      role="img"
      aria-label="Model 3D penampang lereng dengan lapisan tanah dan batuan. Seret untuk memutar."
    />
  );
}
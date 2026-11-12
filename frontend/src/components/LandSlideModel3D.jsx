import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './LandslideModel3D.css';

/**
 * LandslideModel3D — penampang lereng 3D yang bisa diputar.
 *
 * Isi file (dari atas ke bawah):
 *  1. NOISE & TEKSTUR : membuat tekstur tanah/batu lewat kode (tanpa file gambar)
 *  2. LAYERS          : bentuk lapisan tanah (poligon 2D yang ditarik jadi 3D)
 *  3. PERMUKAAN HIDUP : lumut bergelombang + semak + pohon di atas lereng
 *  4. LONGSOR         : cara massa tanah "meleleh" turun menyusuri bidang gelincir
 *  5. KOMPONEN        : scene, hujan, air tanah, label, kontrol (slider & tombol)
 *
 * Kunci agar tidak terlihat "tanah polos" (hasil studi referensi):
 *  - variasi warna di dalam satu material (bukan satu warna rata)
 *  - bump map (kesan kasar) + bayangan antar gumpalan
 *  - tepi/siluet yang tidak lurus
 *  - detail kecil (lumut, semak, pohon) tersebar acak
 */

const DEPTH = 5; // lebar model ke arah z
const LENGTH = 13; // panjang model ke arah x

/* ================= 1. NOISE & TEKSTUR ================= */

// Angka acak yang konsisten (sama input → sama output)
function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Noise halus (value noise). `period` membuatnya bisa diulang tanpa sambungan terlihat.
function valueNoise(x, y, period) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const wrap = (n) => (period ? ((n % period) + period) % period : n);
  const a = hash(wrap(xi), wrap(yi));
  const b = hash(wrap(xi + 1), wrap(yi));
  const c = hash(wrap(xi), wrap(yi + 1));
  const d = hash(wrap(xi + 1), wrap(yi + 1));
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// Beberapa lapis noise dengan ukuran berbeda → tampak alami. Hasil ± 0..1
function fbm(x, y, octaves = 4, tile = 0) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += amp * valueNoise(x * freq, y * freq, tile ? tile * freq : 0);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Membuat sepasang tekstur: `map` (warna) dan `bump` (kasar/halus).
 * Opsi: base warna dasar [r,g,b], shade seberapa kontras variasinya,
 * speckles = jumlah bintik/kerikil, strata = garis lapisan, cracks = retakan.
 */
function makeSurfaceTextures({ base, shade = 0.5, freq = 4, speckles = 0, strata = 0, cracks = 0, seed = 1 }) {
  const N = 256;
  const rand = seededRandom(seed * 9973 + 11);
  const canvas = document.createElement('canvas');
  canvas.width = N;
  canvas.height = N;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(N, N);

  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      const u = x / N;
      const v = y / N;
      const n = fbm(u * freq, v * freq, 4, freq);
      let k = 1 + (n - 0.5) * shade * 2.2;
      if (strata) {
        const warp = (fbm(u * 3, v * 3, 2, 3) - 0.5) * 1.6;
        k *= 1 + Math.sin((v * strata + warp) * Math.PI * 2) * 0.09;
      }
      const i = (y * N + x) * 4;
      image.data[i] = Math.min(255, base[0] * k);
      image.data[i + 1] = Math.min(255, base[1] * k);
      image.data[i + 2] = Math.min(255, base[2] * k);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  // Bintik/kerikil: lingkaran kecil lebih terang atau gelap
  for (let i = 0; i < speckles; i += 1) {
    const x = rand() * N;
    const y = rand() * N;
    const r = 0.7 + rand() * 2.2;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,245,220,0.30)' : 'rgba(25,15,8,0.38)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Retakan: garis patah-patah gelap
  ctx.strokeStyle = 'rgba(20,16,12,0.55)';
  ctx.lineWidth = 1;
  for (let i = 0; i < cracks; i += 1) {
    let x = rand() * N;
    let y = rand() * N;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s += 1) {
      x += (rand() - 0.5) * 34;
      y += (rand() - 0.2) * 22;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Bump map = versi hitam-putih dari warna (gelap = cekung)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = N;
  bumpCanvas.height = N;
  const bctx = bumpCanvas.getContext('2d');
  const src = ctx.getImageData(0, 0, N, N);
  const gray = bctx.createImageData(N, N);
  for (let i = 0; i < src.data.length; i += 4) {
    const l = src.data[i] * 0.3 + src.data[i + 1] * 0.59 + src.data[i + 2] * 0.11;
    gray.data[i] = gray.data[i + 1] = gray.data[i + 2] = l;
    gray.data[i + 3] = 255;
  }
  bctx.putImageData(gray, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(bumpCanvas);
  [map, bump].forEach((t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.4, 0.4); // 1 ubin = 2,5 satuan model
    t.anisotropy = 4;
  });
  return { map, bump };
}

function texturedMaterial({ bumpScale = 1.6, ...options }) {
  const { map, bump } = makeSurfaceTextures(options);
  return new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale, roughness: 1 });
}

/* ================= 2. LAPISAN TANAH ================= */

// Setiap titik [x, y]. Permukaan lereng turun dari kiri (puncak) ke kanan (kaki lereng).
const LAYERS = [
  {
    name: 'Batuan dasar',
    points: [[0, -1], [13, -1], [13, 0.5], [10.6, 0.5], [3.2, 3.15], [0, 3.4]],
    material: { base: [132, 130, 122], shade: 0.38, freq: 6, speckles: 300, strata: 6, cracks: 18, seed: 1, bumpScale: 0.7 },
  },
  {
    name: 'Tanah lapuk',
    points: [[0, 3.4], [3.2, 3.15], [10.6, 0.5], [13, 0.5], [13, 0.85], [10.4, 0.88], [7.6, 2.2], [3.8, 5.2], [2.8, 5.6], [0, 5.6]],
    material: { base: [176, 124, 74], shade: 0.5, freq: 5, speckles: 520, strata: 3, cracks: 0, seed: 2 },
  },
  {
    name: 'Tanah pucuk',
    points: [[0, 5.6], [2.8, 5.6], [3.8, 5.2], [7.6, 2.2], [10.4, 0.88], [13, 0.85], [13, 0.93], [10.4, 0.96], [7.6, 2.55], [3.8, 5.55], [2.8, 5.95], [0, 5.95]],
    material: { base: [92, 62, 36], shade: 0.5, freq: 6, speckles: 380, seed: 3 },
  },
  {
    name: 'Vegetasi',
    points: [[0, 5.95], [2.8, 5.95], [3.8, 5.55], [7.6, 2.55], [10.4, 0.96], [13, 0.93], [13, 1.0], [10.4, 1.03], [7.6, 2.62], [3.8, 5.62], [2.8, 6.02], [0, 6.02]],
    material: { base: [92, 138, 52], shade: 0.7, freq: 6, speckles: 200, seed: 4 },
  },
];

// Tepi dibuat tidak lurus: titik digeser oleh noise. Pergeseran bergantung pada
// posisi (x,y), jadi batas antar lapisan tetap menempel satu sama lain.
const ROUGH = 0.1;
function displace(x, y) {
  return [
    x + (fbm(x * 1.9 + 3, y * 1.9, 3) - 0.5) * ROUGH * 2,
    y + (fbm(x * 1.9, y * 1.9 + 7, 3) - 0.5) * ROUGH * 2,
  ];
}

function roughen(points, step = 0.3) {
  const out = [];
  for (let i = 0; i < points.length; i += 1) {
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % points.length];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let s = 0; s < n; s += 1) {
      out.push(displace(ax + ((bx - ax) * s) / n, ay + ((by - ay) * s) / n));
    }
  }
  return out;
}

// Potong poligon: simpan hanya bagian dengan a <= x <= b
function clipX(poly, a, b) {
  const clip = (pts, inside, cut) => {
    const out = [];
    pts.forEach((cur, i) => {
      const prev = pts[(i + pts.length - 1) % pts.length];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut(prev, cur));
        out.push(cur);
      } else if (inside(prev)) out.push(cut(prev, cur));
    });
    return out;
  };
  let out = poly;
  if (Number.isFinite(a)) {
    out = clip(out, (p) => p[0] >= a, (p, q) => [a, p[1] + ((q[1] - p[1]) * (a - p[0])) / (q[0] - p[0])]);
  }
  if (Number.isFinite(b)) {
    out = clip(out, (p) => p[0] <= b, (p, q) => [b, p[1] + ((q[1] - p[1]) * (b - p[0])) / (q[0] - p[0])]);
  }
  return out;
}

function extrude(points, depth) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geometry.translate(0, 0, -depth / 2); // pusatkan di z = 0
  return geometry;
}

function solidMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ================= 3. PERMUKAAN HIDUP ================= */

// Garis lurus antar titik: dipakai untuk permukaan lereng dan batas batuan dasar
function polyY(P, x) {
  for (let i = 0; i < P.length - 1; i += 1) {
    const [x0, y0] = P[i];
    const [x1, y1] = P[i + 1];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return P[P.length - 1][1];
}
const SURFACE = [[0, 6.02], [2.8, 6.02], [3.8, 5.62], [7.6, 2.62], [10.4, 1.03], [13, 1.0]];
const BEDROCK = [[0, 3.4], [3.2, 3.15], [10.6, 0.5], [13, 0.5]];
const surfaceY = (x) => polyY(SURFACE, x);
const bedY = (x) => polyY(BEDROCK, x);

// Gelombang kecil di permukaan lumut
function mossHeight(x, z) {
  return surfaceY(x) + 0.04 + (fbm(x * 1.7, z * 1.7, 4) - 0.5) * 0.34;
}

const MOSS_COLORS = ['#2f6a24', '#3f7d2a', '#5a9632', '#78ad3c', '#9bbd48', '#b4c85a'].map((c) => new THREE.Color(c));

// Lapisan lumut untuk rentang x0..x1: grid yang digeser naik-turun, tiap titik diberi hijau berbeda
function makeMossSurface(x0, x1) {
  const stepX = 0.07;
  const stepZ = 0.1;
  const nx = Math.max(2, Math.round((x1 - x0) / stepX) + 1);
  const nz = Math.round(DEPTH / stepZ) + 1;
  const positions = new Float32Array(nx * nz * 3);
  const colors = new Float32Array(nx * nz * 3);
  const tmp = new THREE.Color();

  for (let i = 0; i < nx; i += 1) {
    for (let j = 0; j < nz; j += 1) {
      const x = x0 + ((x1 - x0) * i) / (nx - 1);
      const z = -DEPTH / 2 + j * stepZ;
      const k = (i * nz + j) * 3;
      positions[k] = x;
      positions[k + 1] = mossHeight(x, z);
      positions[k + 2] = z;

      // warna: gabungan noise besar (bercak) dan kecil (butiran)
      const patch = fbm(x * 0.9 + 20, z * 0.9, 3);
      const grain = fbm(x * 5, z * 5 + 9, 3);
      const t = Math.min(0.999, Math.max(0, (patch * 0.65 + grain * 0.35 - 0.25) * 1.9));
      const f = t * (MOSS_COLORS.length - 1);
      const a = Math.floor(f);
      tmp.copy(MOSS_COLORS[a]).lerp(MOSS_COLORS[Math.min(a + 1, MOSS_COLORS.length - 1)], f - a);
      colors[k] = tmp.r;
      colors[k + 1] = tmp.g;
      colors[k + 2] = tmp.b;
    }
  }

  const indices = [];
  for (let i = 0; i < nx - 1; i += 1) {
    for (let j = 0; j < nz - 1; j += 1) {
      const a = i * nz + j;
      const b = (i + 1) * nz + j;
      const c = (i + 1) * nz + j + 1;
      const d = i * nz + j + 1;
      indices.push(a, d, b, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return solidMesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
}

// Gumpalan lumut/semak: satu bentuk bola yang dipakai ratusan kali (InstancedMesh)
function makeClumps(count, sizeRange, rand, palette, x0, x1) {
  const mesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({ roughness: 1 }),
    Math.max(1, count),
  );
  const items = [];
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const x = x0 + 0.1 + rand() * (x1 - x0 - 0.2);
    const z = (rand() - 0.5) * (DEPTH - 0.3);
    const s = sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]);
    items.push({
      x, z, y: mossHeight(x, z) + s * 0.25,
      sx: s, sy: s * (0.55 + rand() * 0.3), sz: s * (0.8 + rand() * 0.4),
      rx: rand() * 3, ry: rand() * 3, rz: rand() * 3,
    });
    color.copy(palette[Math.floor(rand() * palette.length)]).offsetHSL(0, 0, (rand() - 0.5) * 0.08);
    mesh.setColorAt(i, color);
  }
  const place = (deform) => {
    items.forEach((it, i) => {
      const [x, y] = deform ? deform(it.x, it.y) : [it.x, it.y];
      dummy.position.set(x, y, it.z);
      dummy.scale.set(it.sx, it.sy, it.sz);
      dummy.rotation.set(it.rx, it.ry, it.rz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  place(null);
  mesh.count = count;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  return { mesh, update: (deform) => place(deform) };
}

// Pohon sederhana: batang + tiga kerucut bertumpuk
const TREE_PARTS = {
  trunkGeo: new THREE.CylinderGeometry(0.05, 0.08, 0.5, 6),
  coneGeo: new THREE.ConeGeometry(1, 1, 7),
  trunkMat: new THREE.MeshStandardMaterial({ color: '#4a3220', roughness: 1 }),
  leafMats: ['#2e6a2a', '#3a7a30', '#477f2c'].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1, flatShading: true }),
  ),
};

function makeTrees(count, rand, x0, x1) {
  const group = new THREE.Group();
  const trees = [];
  for (let i = 0; i < count; i += 1) {
    const x = x0 + 0.2 + rand() * (x1 - x0 - 0.4);
    const z = (rand() - 0.5) * (DEPTH - 0.8);
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(TREE_PARTS.trunkGeo, TREE_PARTS.trunkMat);
    trunk.position.y = 0.25;
    trunk.castShadow = true;
    tree.add(trunk);
    const leaf = TREE_PARTS.leafMats[i % TREE_PARTS.leafMats.length];
    [[0.36, 0.55, 0.62], [0.28, 0.5, 0.95], [0.19, 0.42, 1.25]].forEach(([r, h, y]) => {
      const cone = new THREE.Mesh(TREE_PARTS.coneGeo, leaf);
      cone.scale.set(r, h, r);
      cone.position.y = y;
      cone.castShadow = true;
      tree.add(cone);
    });
    tree.scale.setScalar(0.75 + rand() * 0.7);
    tree.userData = {
      x, z, y: mossHeight(x, z) - 0.03,
      rx: (rand() - 0.5) * 0.12, ry: rand() * 6, rz: (rand() - 0.5) * 0.12,
      fall: (rand() - 0.4) * 1.1, // arah miring saat longsor
    };
    trees.push(tree);
    group.add(tree);
  }
  const place = (deform, e) => {
    trees.forEach((tree) => {
      const d = tree.userData;
      const [x, y] = deform ? deform(d.x, d.y) : [d.x, d.y];
      tree.position.set(x, y, d.z);
      tree.rotation.set(d.rx, d.ry, d.rz + d.fall * e);
    });
  };
  place(null, 0);
  return { group, update: place };
}

// Bayangan lembut di bawah model agar tidak tampak melayang
function makeContactShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
  g.addColorStop(0, 'rgba(30,25,15,0.38)');
  g.addColorStop(1, 'rgba(30,25,15,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 11),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(6.5, -1.06, 0);
  return mesh;
}

/* ================= 4. LONGSOR ================= */

/*
 * Massa tanah di antara X_AWAL dan X_AKHIR bisa longsor. Saat longsor, tiap titiknya
 * dipindahkan dari posisi asal ke posisi "endapan" di bawah lereng:
 *   - ke arah kanan sejauh GESER_AWAL (ujung atas) sampai GESER_AKHIR (ujung bawah)
 *   - menempel pada batuan dasar (bidang gelincir) yang kini terbuka
 *   - lebih tipis di tengah, menumpuk di kaki lereng
 * `e` = 0 (belum longsor) sampai 1 (sudah longsor).
 */
const X_AWAL = 3.0;
const X_AKHIR = 10.0;
const GESER_AWAL = 2.4;
const GESER_AKHIR = 2.0;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function deformPoint(x, y, e) {
  if (e <= 0) return [x, y];
  const u = clamp((x - X_AWAL) / (X_AKHIR - X_AWAL), 0, 1);
  const tebal = Math.max(0.25, surfaceY(x) - bedY(x));
  const kedalaman = clamp((surfaceY(x) - y) / tebal, -0.3, 1.2); // 0 = permukaan, 1 = dasar
  const xBaru = X_AWAL + GESER_AWAL + u * (X_AKHIR + GESER_AKHIR - X_AWAL - GESER_AWAL);
  const dasar = (xBaru < X_AKHIR ? bedY(xBaru) : surfaceY(xBaru)) - 0.02;
  const tinggiBaru = 0.62 * tebal + 0.55 * u * u;
  const yBaru = dasar + tinggiBaru * (1 - kedalaman);
  return [x + (xBaru - x) * e, y + (yBaru - y) * e];
}

// Membuat mesh yang titik-titiknya bisa digeser mengikuti deformPoint
function deformableMesh(mesh) {
  const pos = mesh.geometry.attributes.position;
  const base = pos.array.slice();
  mesh.frustumCulled = false;
  return {
    mesh,
    update(e) {
      for (let i = 0; i < pos.count; i += 1) {
        const [x, y] = deformPoint(base[i * 3], base[i * 3 + 1], e);
        pos.setXYZ(i, x, y, base[i * 3 + 2]);
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    },
  };
}

/* ================= 5. KOMPONEN ================= */

const HUJAN_RAWAN = 70; // persen hujan yang membuat lereng rawan
const LABELS = [
  { key: 'vegetasi', text: 'Vegetasi', mass: true },
  { key: 'lapuk', text: 'Tanah lapuk', mass: true },
  { key: 'air', text: 'Air tanah', mass: true },
  { key: 'bidang', text: 'Bidang gelincir', mass: false },
  { key: 'batuan', text: 'Batuan dasar', mass: false },
];
const LEGEND = [
  ['#5a9632', 'Vegetasi'],
  ['#5c3d24', 'Tanah pucuk'],
  ['#b07a48', 'Tanah lapuk'],
  ['#85847c', 'Batuan dasar'],
  ['#d7351f', 'Bidang gelincir'],
  ['#3b9ad9', 'Air tanah'],
];

function labelPoint(key, hw) {
  const front = DEPTH / 2;
  switch (key) {
    case 'vegetasi': return new THREE.Vector3(1.4, 6.15, front);
    case 'lapuk': return new THREE.Vector3(1.9, (surfaceY(1.9) - 0.4 + bedY(1.9)) / 2 + 0.2, front);
    case 'air': return new THREE.Vector3(4.4, bedY(4.4) + Math.min(hw, 2) * 0.5 + 0.05, front);
    case 'bidang': return new THREE.Vector3(7.2, bedY(7.2), front);
    default: return new THREE.Vector3(2.0, 1.3, front);
  }
}

export default function LandslideModel3D() {
  const stageRef = useRef(null);
  const labelRefs = useRef([]);
  const api = useRef({});
  const [rain, setRain] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | sliding | done
  const [showSlip, setShowSlip] = useState(true);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      setWebgl(false);
      return undefined;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scene, kamera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const HOME = { pos: new THREE.Vector3(9.8, 6.6, 20.5), target: new THREE.Vector3(6.5, 1.5, 0) };
    camera.position.copy(HOME.pos);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    stage.insertBefore(renderer.domElement, stage.firstChild);

    // --- Cahaya: matahari hangat + isian langit dingin
    scene.add(new THREE.HemisphereLight('#dfeaff', '#9a8a68', 1.0));
    const sun = new THREE.DirectionalLight('#fff0d4', 2.6);
    sun.position.set(9, 13, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 45 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
    sun.target.position.set(6.5, 2, 0);
    scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight('#cfe0ff', 1.1);
    fill.position.set(-8, 5, -7);
    scene.add(fill);

    // --- Model: bagian diam (static) dan bagian yang bisa longsor (mass)
    const rand = seededRandom(7);
    const model = new THREE.Group();
    const massItems = []; // setiap item punya update(e)
    const wetMaterials = [];

    LAYERS.forEach((layer, index) => {
      const material = texturedMaterial(layer.material);
      const rough = roughen(layer.points);
      if (index === 0) {
        model.add(solidMesh(extrude(rough, DEPTH), material)); // batuan dasar: utuh
        return;
      }
      wetMaterials.push(material);
      model.add(solidMesh(extrude(clipX(rough, -Infinity, X_AWAL), DEPTH), material));
      model.add(solidMesh(extrude(clipX(rough, X_AKHIR, Infinity), DEPTH), material));
      const mass = solidMesh(extrude(clipX(rough, X_AWAL, X_AKHIR), DEPTH - 0.02), material);
      model.add(mass);
      massItems.push(deformableMesh(mass));
    });

    const RANGES = [[0, X_AWAL, false], [X_AWAL, X_AKHIR, true], [X_AKHIR, LENGTH, false]];
    RANGES.forEach(([x0, x1, isMass]) => {
      const share = (x1 - x0) / LENGTH;
      const moss = makeMossSurface(x0, x1);
      const small = makeClumps(Math.round(900 * share), [0.07, 0.2], rand, MOSS_COLORS, x0, x1);
      const bushes = makeClumps(Math.round(110 * share), [0.22, 0.42], rand, MOSS_COLORS.slice(0, 4), x0, x1);
      const trees = makeTrees(Math.max(1, Math.round(24 * share)), rand, x0, x1);
      model.add(moss, small.mesh, bushes.mesh, trees.group);
      if (isMass) {
        massItems.push(
          deformableMesh(moss),
          { update: (e) => small.update((x, y) => deformPoint(x, y, e)) },
          { update: (e) => bushes.update((x, y) => deformPoint(x, y, e)) },
          { update: (e) => trees.update((x, y) => deformPoint(x, y, e), e) },
        );
      }
    });
    scene.add(model, makeContactShadow());

    // --- Bidang gelincir: pita merah di atas batuan dasar
    const slipPoints = [];
    const slipSteps = 48;
    for (let i = 0; i <= slipSteps; i += 1) {
      const x = X_AWAL + ((X_AKHIR - X_AWAL) * i) / slipSteps;
      slipPoints.push(displace(x, bedY(x) + 0.04));
    }
    for (let i = slipSteps; i >= 0; i -= 1) {
      const x = X_AWAL + ((X_AKHIR - X_AWAL) * i) / slipSteps;
      slipPoints.push(displace(x, bedY(x) - 0.04));
    }
    const slip = new THREE.Mesh(
      extrude(slipPoints, DEPTH + 0.04),
      new THREE.MeshStandardMaterial({ color: '#c9341e', emissive: '#2a0803', roughness: 0.7 }),
    );
    model.add(slip);

    // --- Air tanah (biru transparan) — dibuat ulang tiap slider hujan berubah
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: '#3b9ad9', transparent: true, opacity: 0.55, roughness: 0.25, depthWrite: false,
    });
    let waterStatic = [];
    let waterMass = null;
    const waterGeometry = (x0, x1, hw, depth) => {
      const n = Math.max(2, Math.ceil((x1 - x0) / 0.2));
      const top = [];
      const bottom = [];
      for (let i = 0; i <= n; i += 1) {
        const x = x0 + ((x1 - x0) * i) / n;
        const lo = bedY(x) + 0.05;
        top.push([x, Math.max(lo + 0.02, Math.min(lo + hw, surfaceY(x) - 0.42))]);
        bottom.unshift([x, lo]);
      }
      return extrude([...top, ...bottom], depth);
    };
    const clearWater = () => {
      waterStatic.forEach((m) => { model.remove(m); m.geometry.dispose(); });
      waterStatic = [];
      if (waterMass) { model.remove(waterMass.mesh); waterMass.mesh.geometry.dispose(); }
      waterMass = null;
    };

    // --- Hujan (titik biru yang jatuh)
    const DROPS = 480;
    const dropPos = new Float32Array(DROPS * 3);
    for (let i = 0; i < DROPS; i += 1) {
      dropPos[i * 3] = -1 + rand() * 15;
      dropPos[i * 3 + 1] = rand() * 12;
      dropPos[i * 3 + 2] = (rand() - 0.5) * 8;
    }
    const dropGeo = new THREE.BufferGeometry();
    dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPos, 3));
    const rainPoints = new THREE.Points(
      dropGeo,
      new THREE.PointsMaterial({ color: '#c4def5', size: 0.1, transparent: true, opacity: 0.85, depthWrite: false }),
    );
    rainPoints.frustumCulled = false;
    rainPoints.geometry.setDrawRange(0, 0);
    scene.add(rainPoints);

    // --- Kontrol putar (seret mouse / jari)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(HOME.target);
    controls.enableDamping = true;
    controls.enableZoom = false; // supaya scroll halaman tidak terganggu
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.48; // tidak bisa melihat dari bawah tanah
    controls.update();

    // --- Status simulasi
    let rainValue = 0;
    let state = 'idle';
    let e = 0;
    let t = 0;
    let hold = 0;
    const DURATION = reduceMotion ? 0.5 : 3.4;

    const applyDeform = (value) => {
      massItems.forEach((item) => item.update(value));
      waterMass?.update(value);
    };

    const applyRain = () => {
      const w = rainValue / 100;
      wetMaterials.forEach((m) => m.color.setRGB(1 - 0.42 * w, 1 - 0.46 * w, 1 - 0.5 * w));
      clearWater();
      const hw = w * 2.2;
      if (hw > 0.05) {
        const mk = (x0, x1, depth) => {
          const mesh = new THREE.Mesh(waterGeometry(x0, x1, hw, depth), waterMaterial);
          mesh.renderOrder = 2;
          model.add(mesh);
          return mesh;
        };
        waterStatic = [mk(0.12, X_AWAL, DEPTH + 0.012), mk(X_AKHIR, LENGTH - 0.12, DEPTH + 0.012)];
        waterMass = deformableMesh(mk(X_AWAL, X_AKHIR, DEPTH + 0.012));
      }
      rainPoints.geometry.setDrawRange(0, Math.floor(DROPS * w));
    };

    const start = () => {
      if (state !== 'idle') return;
      state = 'sliding';
      t = 0;
      setPhase('sliding');
    };

    api.current = {
      setRain(value) {
        rainValue = value;
        if (state === 'idle') applyRain();
      },
      trigger() {
        if (rainValue >= HUJAN_RAWAN) start();
      },
      reset() {
        state = 'idle';
        e = 0;
        t = 0;
        hold = 0;
        applyDeform(0);
        applyRain();
        setPhase('idle');
      },
      resetView() {
        camera.position.copy(HOME.pos);
        controls.target.copy(HOME.target);
        controls.update();
      },
      setShowSlip(value) {
        slip.visible = value;
      },
    };

    // --- Ukuran mengikuti wadah
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = stage;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();

    // --- Hanya render saat terlihat di layar
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(stage);

    // --- Loop render
    const clock = new THREE.Clock();
    const projected = new THREE.Vector3();
    let frame;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);

      if (state === 'idle') {
        hold = rainValue >= 96 ? hold + dt : 0;
        if (hold > 1) start();
      } else if (state === 'sliding') {
        t += dt / DURATION;
        const k = Math.min(t, 1);
        e = k < 0.5 ? 4 * k * k * k : 1 - ((-2 * k + 2) ** 3) / 2; // mulai pelan, lalu cepat, lalu melambat
        applyDeform(e);
        waterMaterial.opacity = 0.55 * (1 - e * 0.7);
        if (k >= 1) {
          state = 'done';
          setPhase('done');
        }
      }

      // hujan jatuh
      if (rainValue > 0 && !reduceMotion) {
        for (let i = 0; i < DROPS; i += 1) {
          dropPos[i * 3 + 1] -= 11 * dt;
          if (dropPos[i * 3 + 1] < surfaceY(clamp(dropPos[i * 3], 0, LENGTH)) - 0.1) {
            dropPos[i * 3 + 1] = 11 + rand() * 2;
          }
        }
        dropGeo.attributes.position.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);

      // posisi label (3D → layar)
      const { clientWidth: w, clientHeight: h } = stage;
      const hw = (rainValue / 100) * 2.2;
      const frontFacing = camera.position.z > 1;
      LABELS.forEach((label, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const hide = !frontFacing
          || (label.mass && state !== 'idle')
          || (label.key === 'air' && hw < 0.3);
        el.style.opacity = hide ? '0' : '1';
        if (hide) return;
        projected.copy(labelPoint(label.key, hw)).project(camera);
        el.style.transform = `translate(${(projected.x * 0.5 + 0.5) * w}px, ${(-projected.y * 0.5 + 0.5) * h}px)`;
      });
    };
    loop();

    // --- Bersih-bersih saat komponen dilepas
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((m) => {
          m?.map?.dispose();
          m?.bumpMap?.dispose();
          m?.dispose();
        });
      });
      renderer.dispose();
      renderer.domElement.remove();
      api.current = {};
    };
  }, []);

  // Sinkronkan state React → scene
  useEffect(() => { api.current.setRain?.(rain); }, [rain]);
  useEffect(() => { api.current.setShowSlip?.(showSlip); }, [showSlip]);

  const status = (() => {
    if (phase === 'done') return { text: 'Longsor terjadi', tone: 'high' };
    if (phase === 'sliding') return { text: 'Tanah meluncur…', tone: 'high' };
    if (rain >= HUJAN_RAWAN) return { text: 'Rawan longsor', tone: 'high' };
    if (rain >= 35) return { text: 'Tanah mulai jenuh', tone: 'mid' };
    return { text: 'Lereng stabil', tone: 'low' };
  })();

  const hint = (() => {
    if (phase === 'done') return 'Lihat bidang gelincir merah yang kini terbuka dan tanah yang menumpuk di kaki lereng.';
    if (phase === 'sliding') return 'Massa tanah meluncur menyusuri bidang gelincir.';
    if (rain >= HUJAN_RAWAN) return 'Tekan “Picu longsor”, atau naikkan hujan hingga 100% lalu tunggu sebentar.';
    return `Geser slider hujan hingga ${HUJAN_RAWAN}% atau lebih untuk membuat lereng rawan.`;
  })();

  if (!webgl) {
    return <p className="ls3d-fallback">Perangkat ini tidak mendukung tampilan 3D (WebGL).</p>;
  }

  return (
    <section className="ls3d-root">
      <div className="ls3d-stage" ref={stageRef}>
        {LABELS.map((label, i) => (
          <span
            key={label.key}
            className={`ls3d-label ls3d-label--${label.key}`}
            ref={(el) => { labelRefs.current[i] = el; }}
            aria-hidden="true"
          >
            {label.text}
          </span>
        ))}

        <ul className="ls3d-legend" aria-label="Keterangan warna">
          {LEGEND.map(([color, name]) => (
            <li key={name}><span style={{ background: color }} />{name}</li>
          ))}
        </ul>

        <div className={`ls3d-status ls3d-status--${status.tone}`} role="status">{status.text}</div>

        <p className="ls3d-drag" aria-hidden="true">Seret untuk memutar</p>

        <div className="ls3d-panel">
          <label className="ls3d-rain" htmlFor="ls3d-rain">
            <span>Curah hujan <strong>{rain}%</strong></span>
            <input
              id="ls3d-rain"
              type="range"
              min="0"
              max="100"
              step="1"
              value={rain}
              disabled={phase !== 'idle'}
              onChange={(event) => setRain(Number(event.target.value))}
              aria-valuetext={`Curah hujan ${rain} persen`}
            />
          </label>
          <div className="ls3d-actions">
            <button
              type="button"
              className="ls3d-btn ls3d-btn--danger"
              disabled={phase !== 'idle' || rain < HUJAN_RAWAN}
              onClick={() => api.current.trigger?.()}
            >
              Picu longsor
            </button>
            <button
              type="button"
              className="ls3d-btn"
              onClick={() => { setRain(0); api.current.reset?.(); }}
            >
              Atur ulang
            </button>
            <button type="button" className="ls3d-btn" onClick={() => api.current.resetView?.()}>
              Tampilan awal
            </button>
            <label className="ls3d-check">
              <input type="checkbox" checked={showSlip} onChange={(event) => setShowSlip(event.target.checked)} />
              Bidang gelincir
            </label>
          </div>
          <p className="ls3d-hint">{hint}</p>
        </div>
      </div>

      <div className="ls3d-info">
        <article>
          <h3>Bidang gelincir</h3>
          <p>
            Batas antara tanah lapuk dan batuan dasar yang kedap air. Air meresap lalu tertahan di
            atasnya, sehingga tanah di atasnya licin dan mudah tergelincir.
          </p>
        </article>
        <article>
          <h3>Hujan sebagai pemicu</h3>
          <p>
            Hujan lebat membuat muka air tanah naik. Tanah jenuh menjadi lebih berat dan kekuatan
            gesernya turun, sampai lereng tidak sanggup menahan dirinya sendiri.
          </p>
        </article>
        <article>
          <h3>Peran vegetasi</h3>
          <p>
            Akar pohon mengikat tanah dan membantu menyerap air. Lereng gundul lebih mudah longsor,
            tetapi akar yang dangkal tidak cukup menahan bidang gelincir yang dalam.
          </p>
        </article>
      </div>
    </section>
  );
}
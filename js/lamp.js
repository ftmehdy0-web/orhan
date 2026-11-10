// Zoro One — procedural lamp model.
// Everything is built from primitives so the page ships without any 3D assets.

import * as THREE from 'three';

export const FINISHES = {
  obsidian: { name: 'Obsidian', color: '#28292d', metalness: 0.9, roughness: 0.34 },
  moonstone: { name: 'Moonstone', color: '#d3d5d8', metalness: 0.95, roughness: 0.3 },
  brass: { name: 'Brass', color: '#c39650', metalness: 1.0, roughness: 0.27 },
};

// 1 unit ≈ 20 cm
const L1 = 2.0; // lower arm
const L2 = 1.9; // upper arm
const RING = 0.42; // halo radius
const NECK = 0.1;
const BASE_H = 0.1;
const SHOULDER_Y = 0.3;
const CONE_H = 4.4;
const SPOT_ANGLE = 0.66;

const SPOT_MAX = 150;
const FILL_MAX = 5;

function radialTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function beamMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(1, 1, 1) },
      uIntensity: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vT;
      void main() {
        vT = 1.0 - uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vT;
      void main() {
        float edge = pow(abs(dot(normalize(vNormal), normalize(vView))), 1.8);
        float fall = pow(1.0 - vT, 2.4) * smoothstep(0.0, 0.04, vT);
        float a = edge * fall * uIntensity;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

export function createLamp({ shadowSize = 2048 } = {}) {
  const root = new THREE.Group();

  const body = new THREE.MeshStandardMaterial({ ...pick(FINISHES.moonstone), envMapIntensity: 1.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.5, roughness: 0.5 });
  const diffuser = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const dialMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const solid = (geo, mat = body) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  // ── Base ──────────────────────────────────────────────────────────────────
  const baseProfile = [
    [0, 0], [0.47, 0], [0.495, 0.01], [0.5, 0.03], [0.5, 0.07], [0.49, 0.09], [0.46, BASE_H], [0, BASE_H],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  root.add(solid(new THREE.LatheGeometry(baseProfile, 96)));

  const dial = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.006, 8, 128), dialMat);
  dial.rotation.x = Math.PI / 2;
  dial.position.y = BASE_H + 0.001;
  root.add(dial);

  const pedestal = solid(new THREE.CylinderGeometry(0.05, 0.075, SHOULDER_Y - BASE_H, 40));
  pedestal.position.y = (SHOULDER_Y + BASE_H) / 2;
  root.add(pedestal);

  const joint = (radius, depth) => {
    const g = new THREE.Group();
    const barrel = solid(new THREE.CylinderGeometry(radius, radius, depth, 48));
    barrel.rotation.x = Math.PI / 2;
    const cap = solid(new THREE.CylinderGeometry(radius * 0.52, radius * 0.52, depth + 0.008, 40), dark);
    cap.rotation.x = Math.PI / 2;
    g.add(barrel, cap);
    return g;
  };

  // ── Shoulder + lower arm (twin rods) ──────────────────────────────────────
  const shoulder = new THREE.Group();
  shoulder.position.y = SHOULDER_Y;
  root.add(shoulder);
  shoulder.add(joint(0.07, 0.15));

  const rodGeo = new THREE.CylinderGeometry(0.022, 0.022, L1, 24);
  for (const z of [-0.05, 0.05]) {
    const rod = solid(rodGeo);
    rod.position.set(0, L1 / 2, z);
    shoulder.add(rod);
  }

  // ── Elbow + upper arm (single rod with counterweight) ─────────────────────
  const elbow = new THREE.Group();
  elbow.position.y = L1;
  shoulder.add(elbow);
  elbow.add(joint(0.058, 0.15));

  const TAIL = 0.34;
  const upper = solid(new THREE.CylinderGeometry(0.027, 0.027, L2 + TAIL, 24));
  upper.position.y = (L2 - TAIL) / 2;
  elbow.add(upper);

  const weight = solid(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 40));
  weight.position.y = -TAIL;
  elbow.add(weight);
  const weightCap = solid(new THREE.CylinderGeometry(0.03, 0.03, 0.17, 32), dark);
  weightCap.position.y = -TAIL;
  elbow.add(weightCap);

  // ── Wrist + halo head ─────────────────────────────────────────────────────
  const wrist = new THREE.Group();
  wrist.position.y = L2;
  elbow.add(wrist);
  wrist.add(joint(0.042, 0.1));

  const neck = solid(new THREE.CylinderGeometry(0.023, 0.023, NECK + 0.04, 20));
  neck.rotation.z = Math.PI / 2;
  neck.position.x = (NECK + 0.04) / 2;
  wrist.add(neck);

  const cx = NECK + RING; // halo centre, in wrist space
  const w = 0.105;
  const h = 0.034;
  const c = 0.012;
  const ringProfile = [
    [RING - w / 2 + c, -h / 2], [RING + w / 2 - c, -h / 2], [RING + w / 2, -h / 2 + c],
    [RING + w / 2, h / 2 - c], [RING + w / 2 - c, h / 2], [RING - w / 2 + c, h / 2],
    [RING - w / 2, h / 2 - c], [RING - w / 2, -h / 2 + c], [RING - w / 2 + c, -h / 2],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const halo = solid(new THREE.LatheGeometry(ringProfile, 128));
  halo.position.x = cx;
  halo.castShadow = false;
  wrist.add(halo);

  const led = new THREE.Mesh(new THREE.RingGeometry(RING - 0.034, RING + 0.034, 128), diffuser);
  led.rotation.x = Math.PI / 2;
  led.position.set(cx, -h / 2 - 0.0015, 0);
  wrist.add(led);

  // ── Light ─────────────────────────────────────────────────────────────────
  const spot = new THREE.SpotLight(0xffffff, 0, 16, SPOT_ANGLE, 0.85, 1.7);
  spot.position.set(cx, -0.02, 0);
  spot.target.position.set(cx, -4, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(shadowSize, shadowSize);
  spot.shadow.camera.near = 0.15;
  spot.shadow.camera.far = 12;
  spot.shadow.bias = -0.0004;
  spot.shadow.normalBias = 0.02;
  spot.shadow.radius = 5;
  wrist.add(spot, spot.target);

  const fill = new THREE.PointLight(0xffffff, 0, 5, 2);
  fill.position.set(cx, -0.25, 0);
  wrist.add(fill);

  const beamMat = beamMaterial();
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(RING * 0.92, RING * 0.92 + CONE_H * Math.tan(SPOT_ANGLE * 0.82), CONE_H, 72, 1, true),
    beamMat,
  );
  beam.position.set(cx, -CONE_H / 2 - 0.02, 0);
  beam.renderOrder = 2;
  wrist.add(beam);

  const glowMat = new THREE.SpriteMaterial({
    map: radialTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.setScalar(2.6);
  glow.position.set(cx, -0.05, 0);
  glow.renderOrder = 3;
  wrist.add(glow);

  // ── API ───────────────────────────────────────────────────────────────────
  const off = new THREE.Color(0x1c1c1e);
  const tmp = new THREE.Color();

  let reach = 1; // keeps the pool on the desk evenly lit as the head moves up and down

  function setPose(a1, a2, tilt) {
    const headY = SHOULDER_Y + L1 * Math.cos(a1) + L2 * Math.cos(a1 + a2);
    reach = THREE.MathUtils.clamp(Math.pow(headY / 2.3, 1.5), 0.3, 1.4);
    shoulder.rotation.z = a1;
    elbow.rotation.z = a2;
    wrist.rotation.z = -(a1 + a2) + tilt; // keep the halo level, plus an optional tilt
  }

  function setLight(color, intensity) {
    const i = Math.max(0, intensity);
    spot.color.copy(color);
    spot.intensity = SPOT_MAX * i * reach;
    fill.color.copy(color);
    fill.intensity = FILL_MAX * i;
    diffuser.color.copy(off).lerp(tmp.copy(color).multiplyScalar(1.5 + 5.5 * i), Math.min(1, i * 6));
    dialMat.color.copy(color).multiplyScalar(0.25 + 1.6 * i);
    beamMat.uniforms.uColor.value.copy(color);
    beamMat.uniforms.uIntensity.value = 0.2 * i;
    glowMat.color.copy(color);
    glowMat.opacity = 0.34 * i;
  }

  const finishFrom = { color: new THREE.Color(), metalness: 0, roughness: 0 };
  const finishTo = { color: new THREE.Color(), metalness: 0, roughness: 0 };
  let finishT = 1;

  function setFinish(key) {
    const f = FINISHES[key];
    if (!f) return;
    finishFrom.color.copy(body.color);
    finishFrom.metalness = body.metalness;
    finishFrom.roughness = body.roughness;
    finishTo.color.set(f.color);
    finishTo.metalness = f.metalness;
    finishTo.roughness = f.roughness;
    finishT = 0;
  }

  function update(dt) {
    if (finishT >= 1) return;
    finishT = Math.min(1, finishT + dt / 0.7);
    const e = finishT * finishT * (3 - 2 * finishT);
    body.color.copy(finishFrom.color).lerp(finishTo.color, e);
    body.metalness = THREE.MathUtils.lerp(finishFrom.metalness, finishTo.metalness, e);
    body.roughness = THREE.MathUtils.lerp(finishFrom.roughness, finishTo.roughness, e);
  }

  setPose(0.25, -1.75, 0);
  setLight(new THREE.Color(1, 1, 1), 0);

  return { root, setPose, setLight, setFinish, update };
}

function pick({ color, metalness, roughness }) {
  return { color, metalness, roughness };
}

// The 3D stage: renderer, desk scene, camera rig and post-processing.

import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass, OutputPass } from 'three';
import { createLamp } from './lamp.js';

const BG = 0x070708;

/** Colour temperature (Kelvin) → sRGB triplet in 0..1 (Tanner Helland's fit). */
export function kelvinToSRGB(k) {
  const t = Math.min(Math.max(k, 1000), 12000) / 100;
  let r;
  let g;
  let b;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  const c = (v) => Math.min(255, Math.max(0, v)) / 255;
  return [c(r), c(g), c(b)];
}

// The UI range (1800–6500 K) is stretched slightly on screen so cool white reads as cool.
const displayKelvin = (k) => 1800 + (k - 1800) * 1.4;

function noiseTexture(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 196 + Math.random() * 44;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(48, 48);
  return t;
}

function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x030304);
  const panel = (w, h, color, strength, pos, rot) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.rotation.set(...rot);
    env.add(m);
  };
  panel(9, 9, 0xffffff, 2.2, [0, 9, 1], [Math.PI / 2, 0, 0]); // overhead softbox
  panel(2.2, 12, 0xffd9b0, 5, [-10, 3, 2], [0, Math.PI / 2, 0]); // warm strip, left
  panel(2.2, 12, 0xbcd4ff, 4, [10, 3, -2], [0, -Math.PI / 2, 0]); // cool strip, right
  panel(14, 2.5, 0xffffff, 2.2, [0, 4, -10], [0, 0, 0]); // back bar
  panel(10, 1.2, 0xffffff, 1.6, [0, 1.5, 10], [0, Math.PI, 0]); // front kicker
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.03).texture;
  pmrem.dispose();
  return tex;
}

function wordmark() {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 600;
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const draw = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = '600 590px "Inter Tight", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-18px';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.strokeText('ZORO', c.width / 2, 515);
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts?.load) document.fonts.load('600 100px "Inter Tight"').then(draw, () => {});
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
    opacity: 0,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10.5, (10.5 * c.height) / c.width), mat);
  mesh.position.set(-0.5, 3.0, -5);
  return mesh;
}

export function createStage(canvas) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  let pixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.FogExp2(BG, 0.03);
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.4, 90);

  // ── Desk + props ──────────────────────────────────────────────────────────
  const grain = noiseTexture();
  const desk = new THREE.Mesh(
    new THREE.CircleGeometry(70, 96),
    new THREE.MeshStandardMaterial({ color: 0x3d3935, roughness: 0.72, metalness: 0, roughnessMap: grain, envMapIntensity: 0.18 }),
  );
  desk.rotation.x = -Math.PI / 2;
  desk.receiveShadow = true;
  scene.add(desk);

  const prop = (geo, mat) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };

  const cover = new THREE.MeshStandardMaterial({ color: 0x0e1412, roughness: 0.8, envMapIntensity: 0.4 });
  const paper = new THREE.MeshStandardMaterial({ color: 0x5d5850, roughness: 0.95, envMapIntensity: 0.2 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a25e, roughness: 0.3, metalness: 1 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x4a4641, roughness: 0.5, envMapIntensity: 0.5, side: THREE.DoubleSide });

  const book = new THREE.Group();
  const slab = (w, h, d, y, mat) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.y = y;
    m.castShadow = true;
    m.receiveShadow = true;
    book.add(m);
  };
  slab(1.25, 0.012, 0.9, 0.006, cover);
  slab(1.21, 0.05, 0.87, 0.037, paper);
  slab(1.25, 0.012, 0.9, 0.068, cover);
  book.position.set(1.72, 0, 0.78);
  book.rotation.y = -0.22;
  scene.add(book);
  const sheet = prop(new THREE.BoxGeometry(1.05, 0.006, 0.74), paper);
  sheet.position.set(2.0, 0.003, -0.55);
  sheet.rotation.y = 0.32;
  const pen = prop(new THREE.CylinderGeometry(0.017, 0.017, 0.72, 20), brass);
  pen.rotation.set(Math.PI / 2, 0, 0.9);
  pen.position.set(1.95, 0.024, -0.5);

  const mugProfile = [
    [0, 0], [0.15, 0], [0.17, 0.015], [0.175, 0.3], [0.168, 0.305], [0.155, 0.3], [0.15, 0.03], [0, 0.028],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const mug = prop(new THREE.LatheGeometry(mugProfile, 64), ceramic);
  mug.position.set(3.05, 0, 0.1);

  // ── Lamp ──────────────────────────────────────────────────────────────────
  const lamp = createLamp({ shadowSize: coarse ? 1024 : 2048 });
  scene.add(lamp.root);

  const ghost = wordmark();
  scene.add(ghost);

  // ── Ambient light ─────────────────────────────────────────────────────────
  scene.add(new THREE.HemisphereLight(0xb9bdc8, 0x1a1512, 0.1));
  const rim = new THREE.DirectionalLight(0xa9c1ff, 0.3);
  rim.position.set(-5, 5, -6);
  scene.add(rim);
  // "Window" daylight used to demonstrate ambient sensing.
  const daylight = new THREE.DirectionalLight(0xcfe0ff, 0);
  daylight.position.set(6, 7, 3);
  scene.add(daylight);

  // ── Post ──────────────────────────────────────────────────────────────────
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: coarse ? 2 : 4 });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(pixelRatio);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.75, 1.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ── State ─────────────────────────────────────────────────────────────────
  const S = {}; // smoothed
  let primed = false;
  let width = 1;
  let height = 1;
  let spinTarget = 0;
  let spin = 0;
  let orbitT = 0;
  let orbitP = 0;
  let px = 0;
  let py = 0;
  let slowFrames = 0;
  let ghostPortrait = null;

  const lightColor = new THREE.Color();
  const offset = new THREE.Vector3();
  const sph = new THREE.Spherical();

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /**
   * @param T      target shot state (plain numbers)
   * @param input  { pointerX, pointerY, orbitTheta, orbitPhi, power, reducedMotion }
   */
  function update(T, input, dt, time) {
    resize();

    const k = 1 - Math.exp(-dt * 3.6);
    if (!primed) {
      Object.assign(S, T);
      primed = true;
    } else {
      for (const key in T) S[key] += (T[key] - S[key]) * k;
    }

    const kFast = 1 - Math.exp(-dt * 6);
    px += (input.pointerX - px) * kFast;
    py += (input.pointerY - py) * kFast;
    orbitT += (input.orbitTheta - orbitT) * kFast;
    orbitP += (input.orbitPhi - orbitP) * kFast;
    spin += (spinTarget - spin) * (1 - Math.exp(-dt * 2.6));

    const aspect = width / height;
    const portrait = aspect < 0.9;

    // Lamp
    lamp.root.rotation.y = S.yaw + spin;
    lamp.setPose(S.a1, S.a2, S.tilt);
    const [r, g, b] = kelvinToSRGB(displayKelvin(S.k));
    lightColor.setRGB(r, g, b, THREE.SRGBColorSpace);
    lamp.setLight(lightColor, S.i * input.power);
    lamp.update(dt);

    daylight.intensity = S.amb * 2.4;
    ghost.material.opacity = 0.085 * S.word * (0.35 + 0.65 * input.power);
    ghost.material.color.copy(lightColor);
    if (portrait !== ghostPortrait) {
      ghostPortrait = portrait;
      ghost.scale.setScalar(portrait ? 0.45 : 1);
      ghost.position.set(portrait ? 0.75 : -0.5, portrait ? 2.3 : 3.0, -5);
    }

    // Camera rig
    offset.set(S.cx - S.lx, S.cy - S.ly, S.cz - S.lz);
    if (aspect < 1.15) {
      // narrow screens: pull back so the whole lamp fits, without shrinking the wide shots further
      const pull = Math.min(2.1, 0.66 + 0.5 / aspect);
      offset.multiplyScalar(Math.max(1, Math.min(pull, 17 / offset.length())));
    }
    sph.setFromVector3(offset);
    const drift = input.reducedMotion ? 0 : Math.sin(time * 0.22) * 0.02;
    sph.theta += px * 0.09 + orbitT + drift;
    sph.phi = THREE.MathUtils.clamp(sph.phi - py * 0.045 + orbitP, 0.12, 1.5);
    offset.setFromSpherical(sph);
    const lx = S.lx - (portrait ? 0.3 : 0); // centre the lamp itself, not lamp + pool
    camera.position.set(lx + offset.x, Math.max(0.2, S.ly + offset.y), S.lz + offset.z);
    camera.lookAt(lx, S.ly, S.lz);

    const sx = portrait ? 0 : S.shift;
    const sy = portrait ? S.shiftYp : S.shiftY;
    camera.setViewOffset(width, height, -sx * width, sy * height, width, height);

    composer.render(dt);

    // Step resolution down on devices that can't keep up.
    if (dt > 0.036) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 2);
    if (slowFrames > 45) {
      slowFrames = 0;
      if (pixelRatio > 1) {
        pixelRatio = Math.max(1, pixelRatio - 0.5);
        renderer.setPixelRatio(pixelRatio);
        composer.setPixelRatio(pixelRatio);
        composer.setSize(width, height);
      } else if (bloom.enabled) {
        bloom.enabled = false;
      }
    }

    return { r, g, b };
  }

  return {
    update,
    setFinish(key) {
      lamp.setFinish(key);
    },
    spin() {
      spinTarget += Math.PI * 2;
    },
  };
}

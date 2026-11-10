// Zoro landing page — scroll choreography and UI wiring.

import { createStage } from './stage.js';
import { FINISHES } from './lamp.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Camera + lamp keyframes, one per section ─────────────────────────────────
// c* camera position · l* look-at · shift/shiftY move the lamp inside the frame
// (fractions of the viewport; shiftYp is used on portrait screens) · a1/a2/tilt
// arm pose · k colour temperature · i brightness · amb daylight · word wordmark
const SHOTS = {
  hero:    { cx: 1.0, cy: 1.25, cz: 8.6, lx: 1.05, ly: 1.5, lz: 0, shift: 0.2, shiftY: 0.0, shiftYp: 0.26, yaw: -0.3, a1: 0.25, a2: -1.75, tilt: 0, k: 3000, i: 1, amb: 0, word: 1 },
  sense:   { cx: 4.3, cy: 1.35, cz: 4.4, lx: 1.35, ly: 1.7, lz: 0.45, shift: -0.2, shiftY: 0, shiftYp: 0.2, yaw: -0.5, a1: 0.35, a2: -1.9, tilt: 0, k: 4000, i: 1, amb: 0, word: 0 },
  rhythm:  { cx: -2.4, cy: 3.4, cz: 8.4, lx: 1.0, ly: 1.3, lz: 0, shift: 0.2, shiftY: 0, shiftYp: 0.2, yaw: 0.2, a1: 0.15, a2: -1.6, tilt: 0, k: 5200, i: 1, amb: 0, word: 0 },
  control: { cx: 1.0, cy: 2.7, cz: 9.2, lx: 0.55, ly: 1.25, lz: 0, shift: -0.2, shiftY: 0, shiftYp: 0.27, yaw: -0.25, a1: 0.7, a2: -2.4, tilt: 0, k: 5200, i: 1, amb: 0, word: 0 },
  form:    { cx: -2.7, cy: 1.15, cz: 3.7, lx: 0.1, ly: 1.0, lz: 0, shift: 0.2, shiftY: 0, shiftYp: 0.18, yaw: 0.55, a1: 0.3, a2: -1.8, tilt: 0, k: 3400, i: 0.9, amb: 0, word: 0 },
  specs:   { cx: 1.2, cy: 11, cz: 3.4, lx: 1.2, ly: 0.4, lz: 0, shift: 0, shiftY: 0, shiftYp: 0, yaw: -0.2, a1: 0.25, a2: -1.75, tilt: 0, k: 4200, i: 0.75, amb: 0, word: 0 },
  reserve: { cx: 1.0, cy: 1.0, cz: 13.5, lx: 1.0, ly: 1.45, lz: 0, shift: 0, shiftY: 0.25, shiftYp: 0.2, yaw: -0.35, a1: 0.1, a2: -1.5, tilt: 0, k: 2700, i: 1, amb: 0, word: 0 },
};

const MODES = {
  focus: { a1: 0.7, a2: -2.4, tilt: 0, k: 5200, i: 1 },
  read:  { a1: 0.1, a2: -1.45, tilt: 0, k: 4000, i: 0.8 },
  relax: { a1: 0.05, a2: -1.3, tilt: 0.15, k: 2700, i: 0.55 },
  night: { a1: 1.0, a2: -2.75, tilt: 0, k: 1900, i: 0.22 },
};

// ── Stage ────────────────────────────────────────────────────────────────────
let stage = null;
try {
  stage = createStage($('#stage'));
} catch (err) {
  console.warn('Zoro: WebGL unavailable, showing the static page.', err);
  document.documentElement.classList.add('no-webgl');
}

// ── Section geometry ─────────────────────────────────────────────────────────
const sections = $$('[data-shot]');
let centers = [];
const measure = () => {
  centers = sections.map((s) => {
    const r = s.getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2;
  });
};
measure();
addEventListener('resize', measure);
addEventListener('load', measure);
if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

const T = { ...SHOTS.hero };
let active = 'hero';
const weights = {};

function blend() {
  const mid = window.scrollY + window.innerHeight / 2;
  let i = 0;
  while (i < centers.length - 2 && mid > centers[i + 1]) i++;
  const span = centers[i + 1] - centers[i] || 1;
  const raw = clamp((mid - centers[i]) / span, 0, 1);
  const t = smooth(clamp((raw - 0.2) / 0.6, 0, 1)); // hold each shot, then glide
  const a = sections[i].dataset.shot;
  const b = sections[i + 1].dataset.shot;
  for (const key in T) T[key] = lerp(SHOTS[a][key], SHOTS[b][key], t);
  for (const id in SHOTS) weights[id] = 0;
  weights[a] = 1 - t;
  weights[b] = (weights[b] || 0) + t;
  const next = raw < 0.5 ? a : b;
  if (next !== active) {
    active = next;
    for (const link of $$('.nav__links a')) link.classList.toggle('is-active', link.dataset.for === active);
  }
}

// ── Pointer parallax + drag-to-orbit ─────────────────────────────────────────
const input = { pointerX: 0, pointerY: 0, orbitTheta: 0, orbitPhi: 0, power: 0, reducedMotion };

addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  input.pointerX = (e.clientX / innerWidth) * 2 - 1;
  input.pointerY = (e.clientY / innerHeight) * 2 - 1;
});

const controlSection = $('#control');
let drag = null;
controlSection.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.panel, a, button, input')) return;
  drag = { x: e.clientX, y: e.clientY, theta: input.orbitTheta, phi: input.orbitPhi };
  controlSection.classList.add('is-dragging');
});
addEventListener('pointermove', (e) => {
  if (!drag) return;
  input.orbitTheta = clamp(drag.theta - ((e.clientX - drag.x) / innerWidth) * 4.2, -2.4, 2.4);
  input.orbitPhi = clamp(drag.phi - ((e.clientY - drag.y) / innerHeight) * 1.4, -0.7, 0.3);
});
const endDrag = () => {
  drag = null;
  controlSection.classList.remove('is-dragging');
};
addEventListener('pointerup', endDrag);
addEventListener('pointercancel', endDrag);

// ── Control panel ────────────────────────────────────────────────────────────
const brightness = $('#brightness');
const warmth = $('#warmth');
const power = $('#power');
const outBrightness = $('#brightness-out');
const outWarmth = $('#warmth-out');
let isOn = true;

const fmtK = (k) => `${Math.round(k / 50) * 50} K`.replace(/(\d)(\d{3})/, '$1,$2');
const setFill = (el) => el.style.setProperty('--fill', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);

function syncPanel() {
  outBrightness.textContent = isOn ? `${brightness.value}%` : 'Off';
  outWarmth.textContent = fmtK(+warmth.value);
  setFill(brightness);
  setFill(warmth);
  SHOTS.control.i = isOn ? brightness.value / 100 : 0;
  SHOTS.control.k = +warmth.value;
  power.setAttribute('aria-checked', String(isOn));
}

function setMode(name) {
  const m = MODES[name];
  Object.assign(SHOTS.control, { a1: m.a1, a2: m.a2, tilt: m.tilt });
  brightness.value = Math.round(m.i * 100);
  warmth.value = m.k;
  isOn = true;
  for (const chip of $$('[data-mode]')) chip.setAttribute('aria-pressed', String(chip.dataset.mode === name));
  syncPanel();
}

for (const chip of $$('[data-mode]')) chip.addEventListener('click', () => setMode(chip.dataset.mode));
const clearMode = () => $$('[data-mode]').forEach((c) => c.setAttribute('aria-pressed', 'false'));
brightness.addEventListener('input', () => { isOn = true; clearMode(); syncPanel(); });
warmth.addEventListener('input', () => { clearMode(); syncPanel(); });
power.addEventListener('click', () => { isOn = !isOn; syncPanel(); });
setMode('focus');

// ── Finishes ─────────────────────────────────────────────────────────────────
const finishName = $('#finish-name');
for (const swatch of $$('[data-finish]')) {
  swatch.addEventListener('click', () => {
    const key = swatch.dataset.finish;
    for (const s of $$('[data-finish]')) s.setAttribute('aria-checked', String(s === swatch));
    finishName.textContent = FINISHES[key].name;
    stage?.setFinish(key);
    if (!reducedMotion) stage?.spin();
  });
}

// ── Rhythm: a day of light ───────────────────────────────────────────────────
// [hour, kelvin, brightness]
const DAY = [
  [0, 1800, 0.22], [5.5, 1900, 0.28], [7.5, 3600, 0.7], [9.5, 5200, 0.95], [12.5, 6500, 1],
  [16, 5400, 0.95], [18.5, 3600, 0.8], [21, 2400, 0.5], [23, 1900, 0.28], [24, 1800, 0.22],
];
const PHASES = [[5.5, 'Night glow'], [8.5, 'Sunrise'], [11.5, 'Energise'], [15.5, 'Deep focus'], [18.5, 'Golden hour'], [22, 'Wind down'], [24, 'Night glow']];

function dayAt(hour) {
  let i = 0;
  while (i < DAY.length - 2 && hour > DAY[i + 1][0]) i++;
  const [h0, k0, b0] = DAY[i];
  const [h1, k1, b1] = DAY[i + 1];
  const t = smooth(clamp((hour - h0) / (h1 - h0), 0, 1));
  return { k: lerp(k0, k1, t), i: lerp(b0, b1, t) };
}

const clockEl = $('#clock');
const clockK = $('#clock-k');
const clockPhase = $('#clock-phase');
const clockThumb = $('#clock-thumb');
let hour = 7;

function tickRhythm(dt) {
  if (!reducedMotion) hour = (hour + dt * (24 / 18)) % 24; // one day every 18 s
  else hour = 10;
  const { k, i } = dayAt(hour);
  SHOTS.rhythm.k = k;
  SHOTS.rhythm.i = i;
  const hh = Math.floor(hour);
  const mm = Math.floor(((hour - hh) * 60) / 10) * 10;
  clockEl.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  clockK.textContent = fmtK(k);
  clockPhase.textContent = PHASES.find(([end]) => hour < end)[1];
  clockThumb.style.left = `${(hour / 24) * 100}%`;
}

// ── Sense: daylight comes and goes, Zoro compensates ─────────────────────────
const luxEl = $('#lux');
const outEl = $('#output');
const luxBar = $('#lux-bar');
const outBar = $('#output-bar');

function tickSense(time) {
  const amb = reducedMotion ? 0.35 : smooth(0.5 + 0.5 * Math.sin(time * 0.55 - 1.2));
  const out = 1 - 0.66 * amb;
  SHOTS.sense.amb = amb;
  SHOTS.sense.i = out;
  luxEl.textContent = `${Math.round((60 + amb * 640) / 10) * 10} lx`;
  outEl.textContent = `${Math.round(out * 100)}%`;
  luxBar.style.transform = `scaleX(${0.08 + amb * 0.92})`;
  outBar.style.transform = `scaleX(${out})`;
}

// ── Reveal on scroll ─────────────────────────────────────────────────────────
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
);
for (const el of $$('[data-reveal]')) io.observe(el);

// ── Nav ──────────────────────────────────────────────────────────────────────
const nav = $('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Reserve form (front-end only) ────────────────────────────────────────────
const form = $('#reserve-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  form.classList.add('is-done');
  $('#reserve-note').textContent = `You're on the list — we'll write to ${form.email.value} when Zoro ships.`;
  form.email.blur();
});

// ── Power-on intro ───────────────────────────────────────────────────────────
function powerCurve(t) {
  // a short strike, a dip, then a slow bloom to full
  if (t < 0) return 0;
  if (t < 0.09) return 0.45 * (t / 0.09);
  if (t < 0.22) return lerp(0.45, 0.08, (t - 0.09) / 0.13);
  const u = clamp((t - 0.22) / 1.5, 0, 1);
  return lerp(0.08, 1, 1 - Math.pow(1 - u, 3));
}

// ── Loop ─────────────────────────────────────────────────────────────────────
const root = document.documentElement;
let last = performance.now();
let start = null;
let lampCss = '';

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  const time = now / 1000;
  if (start === null) start = time;

  blend();
  if (weights.rhythm > 0.02) tickRhythm(dt);
  if (weights.sense > 0.02) tickSense(time);
  if (active !== 'control' && !drag) {
    input.orbitTheta *= Math.exp(-dt * 3);
    input.orbitPhi *= Math.exp(-dt * 3);
  }
  input.power = reducedMotion ? 1 : powerCurve(time - start - 0.45);

  if (stage) {
    const { r, g, b } = stage.update(T, input, dt, time);
    const css = `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`;
    if (css !== lampCss) {
      lampCss = css;
      root.style.setProperty('--lamp-rgb', css);
    }
  }
  requestAnimationFrame(frame);
}

tickRhythm(0);
tickSense(0);
requestAnimationFrame(frame);
requestAnimationFrame(() => document.body.classList.add('is-ready'));

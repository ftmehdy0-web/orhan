# Zoro — smart desk lamp landing page

A scroll-driven 3D landing page for Zoro One, a smart desk lamp. The lamp is modelled
procedurally in three.js (no 3D assets), lit in real time, and choreographed to the page
as you scroll.

## Run it

It is a static site with no build step, but ES modules need to be served over HTTP:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Any static host (GitHub Pages, Netlify, Vercel…) works as is.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Markup and copy for every section |
| `css/styles.css` | All styling; `--lamp-rgb` is updated live from the lamp's colour temperature |
| `js/main.js` | Scroll choreography (`SHOTS`), control panel, finishes, day cycle, reserve form |
| `js/stage.js` | Renderer, desk scene, camera rig, bloom |
| `js/lamp.js` | The lamp model, its light and finishes (`FINISHES`) |
| `vendor/three.bundle.min.js` | three.js r187 + the post-processing passes used, bundled |
| `fonts/` | Inter Tight and Instrument Serif (SIL Open Font License) |

Each section has a `data-shot` attribute that maps to a keyframe in `SHOTS` (camera, arm pose,
colour temperature, brightness). Edit those numbers to re-direct the film.

The reserve form is front-end only — hook `#reserve-form` up to your own endpoint before launch.

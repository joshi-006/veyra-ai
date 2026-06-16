# Veyra — marketing site

Real-time AI voice translation that preserves meaning, tone, and human emotion. This is the full cinematic marketing site: a custom Three.js neural-communication-network hero, scroll-choreographed storytelling sections, an interactive translation demo, and a horizontal-scroll applications gallery.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production build: `npm run build && npm start`.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS, Three.js via `@react-three/fiber` 9 (React 19 compatible — drei was dropped since nothing here needed it; every visual system is a custom shader, not a primitive), Framer Motion for entrance choreography, GSAP + ScrollTrigger for scroll-linked animation, Lenis for smooth scroll.

## Design plan

**Color** — near-black void (`#08090B`), raised surface (`#0E1013`), hairline border (`#1C1F24`), soft white type (`#F4F3EF`), muted ash secondary text (`#9A9C9F`), warm signal accent for emotion/human moments (`#E8D9C0`), cool current accent for precision/machine moments (`#5C7C8A`). Two accents only, used as a pair throughout — the hero shader blends between them based on pulse, the demo blends them based on selected emotion. No third "pop" color; the brief explicitly asks for muted, not neon.

**Type** — a display face for headlines, a body face for prose, a mono face for eyebrows/labels (`TextReveal`'s mono eyebrow strings double as a structural device: every section opens with one, the way a paper opens with a section label). Drop in your licensed faces by setting `--font-display` / `--font-body` / `--font-mono` in `globals.css` — placeholders fall back to system sans so the build runs without licensed fonts.

**Signature element** — the hero's neural mesh isn't a stock particle field. It's built from a flattened, lumpy point distribution (never a sphere), connected via a spatial-hash nearest-neighbour search into slightly-curved bezier paths, with light traveling along each path as a moving sine band in the fragment shader. That same shader logic (curved paths, traveling light, no primitives) reappears in the interactive demo's particle stream, so the hero's "this is what communication looks like" idea pays off again at the centerpiece.

**Layout** — the brief's own scroll architecture (Arrival → Problem → Human Communication → Emotion Loss → Technology → Demo → Research → Applications → CTA) is followed exactly, since it's specific and already well-sequenced; no template hero/features/pricing stack.

## File map

```
src/
  app/
    layout.tsx              root layout, fonts, metadata
    page.tsx                assembles all sections, owns scroll progress ref
  components/
    smooth-scroll-provider.tsx   Lenis instance, reduced-motion aware
    text-reveal.tsx              mask / blur / character-stagger / word-stagger reveal primitive
    sections/                    one file per scroll chapter
  three/
    shaders/                     raw GLSL strings (neural mesh, signal stream)
    geometry/                    procedural point-field + curved connection builder
    scenes/                      R3F components that consume the shaders
  lib/
    scroll-choreography.ts       GSAP + ScrollTrigger registration, synced to Lenis
  styles/
    globals.css                  design tokens, type scale, reduced-motion overrides
```

## Performance notes

Pixel ratio is capped at 1.75 on both Three.js canvases. The hero and demo canvases use additive blending with `depthWrite: false` and no antialiasing (shader-drawn circles don't need MSAA). The neural mesh's connection search is spatial-hashed rather than O(n²). Horizontal scroll (Future Applications) and all text reveals are skipped/instant under `prefers-reduced-motion: reduce`. Three.js scenes are loaded via `next/dynamic` with `ssr: false` so they don't block first paint or ship to the server bundle.

## Extending

- Swap the placeholder font stack for licensed faces (e.g. self-hosted via `next/font/local`) — every type rule in `globals.css` already routes through the three CSS variables.
- The Emotion Loss waveform and Research graphs are 2D canvas/SVG by design, to keep the WebGL budget concentrated on the two scenes that need it (hero, demo). Convert them to Three.js only if you need them to interact with the hero's mesh directly.
- `EMOTION_COLORS` in `interactive-demo-scene.tsx` is the single place to retune the demo's palette per emotion.

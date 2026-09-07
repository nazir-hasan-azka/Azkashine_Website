"use client";

import { useEffect, useRef } from "react";
import { clearTraceOrigin, publishTraceOrigin } from "@/lib/film/origin";

/**
 * Option C's material: the headline as an aperture.
 *
 * The type is drawn into an offscreen 2D canvas and used as a mask. A fragment shader
 * paints a lit volume across the whole viewport and the mask lets it through only
 * inside the letterforms — so the words are windows onto something moving, and the page
 * around them stays paper.
 *
 * WHAT MAKES IT READ AS A CUT RATHER THAN AS A TEXTURE FILL. The first pass filled the
 * glyphs and stopped at their edges, which looks like a pattern inside type. Paper cut
 * away from something lit does two things at the edge: it casts a contact shadow on its
 * own thickness, and the light behind it spills onto the sheet. Both need to know how
 * far a pixel is from a letter, so the mask carries three fields in three channels —
 * red the sharp glyph, green a tight blur, blue a wide one. Their differences give the
 * shadow ring and the spill without a distance transform and without a second pass.
 *
 * THE CURSOR IS THE LIGHT SOURCE, not a thing that nudges the noise. Brightness and the
 * specular ridges both peak where the pointer is. On the previous hero a cursor light
 * was tried and removed because on a pale ground a radial gradient is just a blue blob
 * — there was nothing for it to illuminate. Here there is: it lights the volume, which
 * is only visible through the type, so it never touches the paper.
 *
 * WHY IT MEASURES NOTHING. Every way the previous canvas hero on this site broke came
 * from measuring an element — a stale backing store, a blank on maximise, a rebuild at
 * a breakpoint. This one never asks an element for anything: drawing surface, type size
 * and line layout all come from `window.innerWidth/innerHeight`. No `ResizeObserver`, no
 * IntersectionObserver, no second instance. A resize rebuilds from the window, which is
 * the only thing it ever read.
 *
 * The DOM keeps the real `<h1>`, in ink, underneath the canvas. The reveal is a wipe:
 * the canvas floods the letters with light from left to right over the ink, and only
 * once that has passed does the ink fade out. If WebGL2 or the font never arrives the
 * wipe never starts, and the page stays a heavy ink headline — finished, not broken.
 *
 * `prefers-reduced-motion` paints one frame with the reveal already complete and never
 * schedules another.
 */

/**
 * The hero has one material now — the colour-splitting, ring-striking one. What is
 * still open is the ground it sits on, so that is what this switches.
 */
export type HeroGround = "paper" | "deep";

/**
 * Per-variant tuning. Only the material and how far its light reaches change; the
 * composition, the type and the layout are identical across the three.
 */
const TUNING: Record<
  HeroGround,
  {
    /** How much light lands on the paper outside the letters. */
    spill: number;
    /** Depth of the contact shadow on the cut edge. */
    shadow: number;
    /** How present brand cyan is in the refractions. */
    cyan: number;
    /** Overall exposure of the volume. */
    exposure: number;
    /** Time multiplier. */
    speed: number;
    /** Width of the wide blur, as a multiple of the type size. */
    reach: number;
    /** Pointer movement pushes rings out through the volume. */
    ripple: number;
    /** Splits the refractions into colour, like light through thick glass. */
    prism: number;
    /** The colour of the cut edge. Ink on paper; a pale rim on a dark ground. */
    edge: [number, number, number];
  }
> = {
  // Prism and ripple were separate materials and are now one: the colour split is what
  // makes it worth looking at, the rings are what make it worth touching.
  paper: {
    spill: 0.12, shadow: 0.30, cyan: 0.95, exposure: 0.94, speed: 0.88, reach: 0.24,
    ripple: 1.0, prism: 1.0, edge: [0.04, 0.07, 0.15],
  },
  // On a dark ground a dark contact shadow is invisible and spilt light finally has
  // somewhere to land, so the edge inverts and the reach opens up.
  deep: {
    spill: 0.34, shadow: 0.26, cyan: 1.0, exposure: 1.0, speed: 0.88, reach: 0.42,
    ripple: 1.0, prism: 1.0, edge: [0.42, 0.72, 0.95],
  },
};

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uReveal;
uniform vec4 uTune;      // spill, shadow, cyan, exposure
uniform vec2 uFeat;      // ripple strength, prism strength
uniform vec3 uEdgeCol;   // the cut edge — ink on paper, a pale rim on dark
uniform vec3 uRipples[4]; // x, y in uv; z the time it was struck (negative = unused)
uniform sampler2D uMask; // r sharp glyph, g tight blur, b wide blur

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

/* Source-over in premultiplied terms, so the three layers stack correctly. */
void over(inout vec3 dc, inout float da, vec3 sc, float sa) {
  dc = sc * sa + dc * (1.0 - sa);
  da = sa + da * (1.0 - sa);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 mk = texture(uMask, uv).rgb;
  float sharp = mk.r;
  float near = mk.g;
  float far = mk.b;

  // A second opening, in the top corner, where the same volume is let through faintly.
  // A left-aligned headline leaves the right third of the frame empty, and empty on
  // white reads as unfinished rather than as restraint.
  float corner = smoothstep(0.26, 1.12, uv.x) * smoothstep(-0.05, 1.05, uv.y);
  corner = pow(corner, 1.25) * uTune.z;

  if (sharp + near + far < 0.004 && corner < 0.0015) { outColor = vec4(0.0); return; }

  float asp = uRes.x / uRes.y;
  vec2 lampP = (uMouse * vec2(0.5, -0.5)) + 0.5;
  float ld = distance(vec2(uv.x * asp, uv.y), vec2(lampP.x * asp, lampP.y));
  float lit = exp(-ld * ld * 2.6);

  // The wipe. Ahead of it the canvas is clear and the ink heading shows through.
  float wipe = 1.0 - smoothstep(uReveal - 0.03, uReveal + 0.22, uv.x);
  float edge = exp(-pow((uv.x - uReveal) * 7.0, 2.0)) * (1.0 - step(1.0, uReveal));

  float t = uTime * 0.06;
  vec2 p = uv * vec2(asp, 1.0) * 1.35;
  p += uMouse * 0.22;

  // Rings pushed out from wherever the pointer last moved. They displace the domain
  // the volume is sampled from, so the material genuinely deforms rather than having
  // a circle drawn on top of it.
  float ring = 0.0;
  if (uFeat.x > 0.0) {
    for (int i = 0; i < 4; i++) {
      vec3 rp = uRipples[i];
      if (rp.z < 0.0) continue;
      float age = uTime - rp.z;
      if (age < 0.0 || age > 2.4) continue;
      vec2 d = vec2((uv.x - rp.x) * asp, uv.y - rp.y);
      float dist = length(d);
      float band = exp(-pow((dist - age * 0.5) * 8.0, 2.0));
      float decay = 1.0 - age / 2.4;
      ring += band * decay;
      p += normalize(d + 1e-5) * band * decay * 0.09 * uFeat.x;
    }
  }

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.6));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.28 * t),
                fbm(p + 3.4 * q + vec2(8.3, 2.8) + 0.21 * t));
  float f = fbm(p + 3.6 * r);

  // Deep enough to read as a volume rather than a fill: ink-blue in the troughs,
  // blue-500 on the crests, with the ramp stretched so a single letter spans it.
  vec3 abyss = vec3(0.012, 0.055, 0.168);
  vec3 deep  = vec3(0.000, 0.208, 0.486);
  vec3 mid   = vec3(0.098, 0.392, 0.729);
  vec3 lift  = vec3(0.129, 0.522, 0.973);
  float body = smoothstep(0.22, 0.88, f);
  vec3 col = mix(abyss, deep, smoothstep(0.0, 0.45, body));
  col = mix(col, mid, smoothstep(0.35, 0.85, body));
  col = mix(col, lift, smoothstep(0.62, 1.0, length(r)) * 0.75);

  // Refraction: two bands at different rates, brightest under the pointer, so the
  // light reads as coming from somewhere rather than as a repeating stripe.
  // Prism shifts the phase of the refraction per channel, so the caustics split into
  // colour at their edges the way light does through something thick.
  float ph = uFeat.y * 0.42;
  vec3 ridge3 = vec3(
    pow(1.0 - abs(sin(f * 5.2 + t * 2.4 - ph)), 9.0),
    pow(1.0 - abs(sin(f * 5.2 + t * 2.4)), 9.0),
    pow(1.0 - abs(sin(f * 5.2 + t * 2.4 + ph)), 9.0)
  );
  float ridge2 = pow(1.0 - abs(sin(length(r) * 7.0 - t * 3.1)), 16.0) * 0.7;
  vec3 tint = mix(vec3(0.522, 0.886, 0.996), vec3(1.0), uFeat.y * 0.28);
  col += tint * (ridge3 + ridge2) * (0.5 + 0.8 * lit) * uTune.z;
  col += vec3(0.55, 0.85, 1.0) * ring * uFeat.x * 0.30;

  col *= mix(0.5, 1.25, smoothstep(0.0, 1.0, uv.y + 0.16 * sin(uTime * 0.13)));
  col *= (0.74 + 0.4 * lit) * uTune.w;
  col += vec3(0.36, 0.72, 0.95) * edge * 0.9;

  // Inner rim, so the letter has an edge of its own where it meets the paper.
  float rim = smoothstep(0.15, 0.95, sharp) * (1.0 - smoothstep(0.55, 1.0, sharp));
  col += vec3(0.52, 0.89, 1.0) * rim * 0.42;

  vec3 outC = vec3(0.0);
  float outA = 0.0;

  // 0 — the corner opening, underneath everything else.
  //
  // Built from the top of the ramp only. The volume's own body is near-ink, and near-ink
  // at low opacity over white composites to grey — the exact opposite of what this
  // corner is for. Taking blue-500 up through brand-light, plus the refraction, keeps it
  // colour instead of a wash.
  float cf = smoothstep(0.22, 0.92, f);
  vec3 cornerCol = mix(vec3(0.129, 0.522, 0.973), vec3(0.522, 0.886, 0.996), cf);
  cornerCol += (ridge3 + ridge2) * 0.5;
  over(outC, outA, cornerCol, corner * 0.82 * wipe);

  // 1 — light spilling from the opening onto the sheet. Paper is near-white, so this
  //     has to tint rather than brighten to read as light at all.
  float spill = clamp(far - near, 0.0, 1.0);
  over(outC, outA, vec3(0.42, 0.66, 0.92), spill * uTune.x * wipe);

  // 2 — the contact shadow along the cut edge, on the paper side.
  float shade = clamp(near - sharp, 0.0, 1.0);
  over(outC, outA, uEdgeCol, pow(shade, 1.15) * uTune.y * wipe);

  // 3 — the volume itself, seen through the glyph.
  over(outC, outA, col, smoothstep(0.12, 0.7, sharp) * wipe);

  // over() already accumulates premultiplied colour, so multiplying by alpha again
  // here darkened every partially-transparent layer twice. Invisible on the glyphs,
  // whose alpha is 1 — but it was turning the corner opening to grey.
  outColor = vec4(outC, outA);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("hero shader:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

/**
 * Vertical room the page chrome needs above and below the headline: the sticky header
 * and the top rule, and the lede and buttons at the foot. Mirrored exactly by
 * `--hero-top-reserve` / `--hero-bottom-reserve` in `globals.css` — if one moves, move
 * the other. On a phone the foot stacks the lede over the buttons and needs far more.
 *
 * Chosen from the widths, never measured, so this keeps the promise the rest of the
 * component makes: nothing here asks an element for its box.
 */
function reserves(w: number) {
  // Three buckets, because the copy block's height is what sets the bottom number and
  // it depends on how many lines the lede wraps to. Below 1200 it takes an extra line
  // or two and needs noticeably more room than a wide window does.
  if (w < 768) return { top: 140, bottom: 330 };
  if (w < 1200) return { top: 132, bottom: 262 };
  return { top: 132, bottom: 190 };
}

/**
 * Layout for the masked headline. Derived from the viewport only — never an element.
 *
 * The size is capped by BOTH the width and the height. Width alone was the bug: on a
 * short wide window (1516x685, say) four lines at 9vw need about 480px of a band that
 * is only 410px tall, so the type ran over the rule above it and the lede below it.
 */
/**
 * How big the headline can be, and where the block sits.
 *
 * Both caps are viewport-relative — there is no fixed pixel size anywhere — but they
 * cap different things, and on most laptops it is the HEIGHT that runs out first. A
 * 1280x720 window has room for 105px of type across but only 80px down, so raising the
 * width term there changes nothing at all.
 *
 * The width term used to be a flat 8.2vw, which is a guess about how wide the sentence
 * happens to be. `widestEm` replaces the guess with a measurement of the actual longest
 * line, so the type fills the column exactly rather than stopping short of it — at
 * 1440 the headline was ending 400px shy of its own gutter.
 */
function layout(w: number, h: number, lineCount: number, widestEm: number) {
  // Mirrors `--hero-gutter` in globals.css. The old formula collapsed to 24px on any
  // window under 1600, which put the headline and the hairlines hard against the
  // viewport edge — a border round the browser rather than a column on a page.
  const gutter = w < 768 ? 24 : Math.max(72, (w - 1440) / 2); // mirrors --page-gutter
  const { top, bottom } = reserves(w);
  const band = Math.max(120, h - top - bottom);
  // Was 0.09 and read as shouting. The height cap below usually wins on a laptop
  // window anyway; this is what governs on a tall screen.
  const byWidth = ((w - gutter * 2) * 0.985) / Math.max(1, widestEm);
  // A line box is 0.88em tall but the GLYPHS are not: Archivo Black's ascender and
  // descender overflow it by about a quarter of an em at each end, so a four-line block
  // paints roughly 4.01em of ink, not 3.52. Every earlier version of this sized the box
  // and ignored the overflow, which is why the headline kept landing on the eyebrow and
  // the copy at whichever size happened to expose the difference.
  const INK = lineCount * 0.88 + 0.49;
  const byHeight = (band * 0.98) / INK;
  const size = Math.min(Math.max(Math.min(byWidth, byHeight), 22), 175);
  const leading = size * 0.88;
  return { gutter, size, leading, blockTop: top + (band - leading * lineCount) / 2 };
}

export function ApertureCanvas({
  lines,
  fontFamily,
  ground = "paper",
}: {
  lines: string[];
  fontFamily: string;
  ground?: HeroGround;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const section = canvas.closest<HTMLElement>("[data-hero]");
    const tune = TUNING[ground];

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      // Deliberate. Without it the drawing buffer is thrown away after compositing and
      // `readPixels` returns zeroes, which is how an inverted reveal wipe once shipped
      // looking plausible — the material was masked out entirely and nothing could see
      // it. Keeping the buffer is what lets a test read a pixel out of a glyph and
      // assert the volume is actually painted. One fullscreen quad; the cost is noise.
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("hero link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uReveal = gl.getUniformLocation(prog, "uReveal");
    const uTuneLoc = gl.getUniformLocation(prog, "uTune");
    const uFeat = gl.getUniformLocation(prog, "uFeat");
    const uEdgeCol = gl.getUniformLocation(prog, "uEdgeCol");
    const uRipples = gl.getUniformLocation(prog, "uRipples");
    const uMask = gl.getUniformLocation(prog, "uMask");

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(uMask, 0);
    gl.uniform4f(uTuneLoc, tune.spill, tune.shadow, tune.cyan, tune.exposure);
    gl.uniform2f(uFeat, tune.ripple, tune.prism);
    gl.uniform3fv(uEdgeCol, tune.edge);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    if (!mctx) return;

    /**
     * The headline, as letters rather than as one shape.
     *
     * The mask used to be a single drawing of the whole sentence, which meant nothing
     * in it could move on its own — the same reason the first assembly hero had to be
     * rebuilt. Each glyph is now stamped once into its own small sprite, and a frame is
     * only a matter of compositing those sprites at wherever they have got to.
     *
     * Only the sharp field is baked into a sprite. Mid-flight there is no cut edge and
     * nothing for light to spill onto, so all three channels get the same stamp and the
     * shader's shadow and spill terms fall to zero on their own. The moment the letters
     * land, the original full-resolution mask is drawn once and the result is
     * pixel-for-pixel what this hero rendered before any of this.
     */
    type Sprite = { canvas: HTMLCanvasElement; w: number; h: number };
    type Letter = {
      ch: string;
      /** Where the glyph ink centre belongs, in CSS pixels. */
      x: number;
      y: number;
      /** Where it comes in from. */
      fx: number;
      fy: number;
      spin: number;
      delay: number;
    };

    const sprites = new Map<string, Sprite>();
    let letters: Letter[] = [];
    let cssW = 0;
    let cssH = 0;
    let devicePx = 1;

    let seed = 20260905 >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    /** The longest a letter waits before it starts moving, as a share of the whole. */
    const LAST_OFF = 0.4;

    const metrics = document.createElement("canvas").getContext("2d");

    /** Stamp one glyph, once, at the size the layout is currently using. */
    const spriteFor = (ch: string, size: number): Sprite | null => {
      const hit = sprites.get(ch);
      if (hit) return hit;
      if (!metrics) return null;
      const font = `400 ${size}px ${fontFamily}`;
      metrics.font = font;
      if ("letterSpacing" in metrics) metrics.letterSpacing = "-0.015em";
      const m = metrics.measureText(ch);
      const left = m.actualBoundingBoxLeft ?? 0;
      const right = m.actualBoundingBoxRight ?? 0;
      const asc = m.actualBoundingBoxAscent ?? 0;
      const desc = m.actualBoundingBoxDescent ?? 0;
      const w = Math.ceil(left + right) + 8;
      const h = Math.ceil(asc + desc) + 8;
      if (w <= 8 || h <= 8) return null; // a space, or a glyph with no ink

      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w * devicePx));
      c.height = Math.max(1, Math.round(h * devicePx));
      const g = c.getContext("2d");
      if (!g) return null;
      g.setTransform(devicePx, 0, 0, devicePx, 0, 0);
      g.fillStyle = "#000";
      g.fillRect(0, 0, w, h);
      g.font = font;
      if ("letterSpacing" in g) g.letterSpacing = "-0.015em";
      g.textBaseline = "alphabetic";
      // White, so every channel carries the same stamp.
      g.fillStyle = "#fff";
      g.fillText(ch, 4 + left, 4 + asc);

      const sprite = { canvas: c, w, h };
      sprites.set(ch, sprite);
      return sprite;
    };

    /**
     * Work out where every letter belongs, and where it flies in from.
     *
     * Positions come from measuring the prefix of each line rather than summing single
     * characters, so they land exactly where the browser would have laid the string out
     * — which is what keeps the settled state identical to the old mask.
     */
    const layoutLetters = (
      size: number,
      leading: number,
      gutter: number,
      blockTop: number,
    ) => {
      if (!metrics) return;
      sprites.clear();
      letters = [];
      metrics.font = `400 ${size}px ${fontFamily}`;
      if ("letterSpacing" in metrics) metrics.letterSpacing = "-0.015em";

      seed = 20260905 >>> 0;
      let widest = 0;
      for (const line of lines) {
        widest = Math.max(widest, metrics.measureText(line).width);
      }
      const originX = gutter + widest / 2;
      const originY = blockTop + (leading * lines.length) / 2;
      // Kept inside the block so nothing starts off the edge of the window, where it
      // would simply appear from nowhere instead of flying in.
      const reach = Math.min(widest * 0.42, cssH * 0.3);

      let index = 0;
      let total = 0;
      for (const line of lines) total += line.split(" ").join("").length;

      /* THE TRACE'S ORIGIN, and the only thing in this file that is not about the hero.
         The film's line has to leave a real letterform, so the point is taken from the
         layout that is happening here anyway rather than guessed at from the outside —
         the prototype's `gutter + w * 0.22` was a placeholder. It is the tittle of the
         first dotted letter on the LAST line: already a point, already at the bottom of
         the block, and a few pixels off the gutter because that letter starts a line.
         Publishing is a write to a two-field box (`lib/film/origin.ts`) that `/` never
         reads; nothing here measures an element, and nothing here waits on React. */
      let anchor: { x: number; y: number } | null = null;
      let lineAnchor: { x: number; y: number } | null = null;
      let lastGlyph: { x: number; y: number } | null = null;
      const DOTTED = /[ij]/;

      let baseline = blockTop + size * 0.76;
      for (const line of lines) {
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === " ") continue;
          const sprite = spriteFor(ch, size);
          if (!sprite) continue;
          const m = metrics.measureText(ch);
          const penX = gutter + metrics.measureText(line.slice(0, i)).width;
          // The sprite is padded evenly, so its middle is the glyph ink centre.
          const cx =
            penX + ((m.actualBoundingBoxRight ?? 0) - (m.actualBoundingBoxLeft ?? 0)) / 2;
          const cy =
            baseline +
            ((m.actualBoundingBoxDescent ?? 0) - (m.actualBoundingBoxAscent ?? 0)) / 2;

          if (!lineAnchor && DOTTED.test(ch)) {
            /* An "i" is a stem and a dot of about the same width, so its ink box is as
               wide as the tittle is across — which is close enough to how tall the
               tittle is to centre on it without a distance transform. Derived from the
               glyph, in other words, rather than nudged until it looked right. */
            const inkW =
              (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0);
            lineAnchor = {
              x: cx,
              y: baseline - (m.actualBoundingBoxAscent ?? 0) + inkW / 2,
            };
          }
          // The ink centre of the last glyph laid out, for a headline with no dot in it.
          lastGlyph = { x: cx, y: cy };

          const a = rand() * Math.PI * 2;
          const r = reach * (0.25 + rand() * 0.75);
          letters.push({
            ch,
            x: cx,
            y: cy,
            fx: originX + Math.cos(a) * r * 1.3,
            fy: originY + Math.sin(a) * r * 0.85,
            spin: (rand() - 0.5) * 2.4,
            delay: Math.min(LAST_OFF, (index / Math.max(1, total - 1)) * 0.3 + rand() * 0.1),
          });
          index++;
        }
        // Later lines win, so the point the line leaves from is the lowest one there is.
        if (lineAnchor) {
          anchor = lineAnchor;
          lineAnchor = null;
        }
        baseline += leading;
      }

      const from = anchor ?? lastGlyph;
      if (from) publishTraceOrigin(from.x, from.y, size);
    };

    const upload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    };

    /**
     * One frame of the arrival. Composited at a fraction of device resolution — the
     * letters are moving and the shader softens the mask anyway, and a full-resolution
     * upload every frame is megabytes of traffic for detail nobody can see.
     */
    const FLIGHT_SCALE = 0.75;
    const compose = (k: number) => {
      const mw = Math.max(1, Math.round(cssW * FLIGHT_SCALE));
      const mh = Math.max(1, Math.round(cssH * FLIGHT_SCALE));
      if (mask.width !== mw || mask.height !== mh) {
        mask.width = mw;
        mask.height = mh;
      }
      mctx.setTransform(FLIGHT_SCALE, 0, 0, FLIGHT_SCALE, 0, 0);
      mctx.globalCompositeOperation = "source-over";
      mctx.filter = "none";
      mctx.fillStyle = "#000";
      mctx.fillRect(0, 0, cssW, cssH);
      mctx.globalCompositeOperation = "lighter";

      for (const letter of letters) {
        const sprite = sprites.get(letter.ch);
        if (!sprite) continue;
        const local = clamp01((k - letter.delay) / (1 - LAST_OFF));
        const e = easeOut(local);
        const x = letter.fx + (letter.x - letter.fx) * e;
        const y = letter.fy + (letter.y - letter.fy) * e;
        mctx.save();
        mctx.translate(x, y);
        mctx.rotate(letter.spin * (1 - e));
        const sc = 0.68 + 0.32 * e;
        mctx.scale(sc, sc);
        mctx.drawImage(sprite.canvas, -sprite.w / 2, -sprite.h / 2, sprite.w, sprite.h);
        mctx.restore();
      }

      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.globalCompositeOperation = "source-over";
      upload();
    };

    /**
     * Rebuild the mask and the drawing surface from the window.
     *
     * Three fields, one texture. The ground is opaque black so every pixel has alpha
     * 1 — with a transparent ground the blurred passes come back unpremultiplied and
     * the low-alpha edges turn to noise.
     */
    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);

      canvas.width = pw;
      canvas.height = ph;
      mask.width = pw;
      mask.height = ph;
      cssW = w;
      cssH = h;
      devicePx = dpr;

      // The longest line, in ems. Measured once at a probe size so the width cap can
      // be about this sentence rather than about a constant.
      let widestEm = 1;
      if (metrics) {
        metrics.font = `400 100px ${fontFamily}`;
        if ("letterSpacing" in metrics) metrics.letterSpacing = "-0.015em";
        for (const line of lines) {
          widestEm = Math.max(widestEm, metrics.measureText(line).width / 100);
        }
      }

      const { gutter, size, leading, blockTop } = layout(w, h, lines.length, widestEm);
      // Same numbers the settled mask is drawn from, so the letters land exactly on it.
      layoutLetters(size, leading, gutter, blockTop);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.globalCompositeOperation = "source-over";
      mctx.filter = "none";
      mctx.fillStyle = "#000";
      mctx.fillRect(0, 0, w, h);

      mctx.textBaseline = "alphabetic";
      if ("letterSpacing" in mctx) mctx.letterSpacing = "-0.015em";
      mctx.font = `400 ${size}px ${fontFamily}`;
      mctx.globalCompositeOperation = "lighter";

      // Centred in the band between the chrome, not in the viewport. `.hero-h1` uses
      // the same reserves, so the ink heading underneath sits exactly where the
      // aperture will.
      const top = blockTop + size * 0.76;
      const pass = (blur: number, colour: string) => {
        mctx.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        mctx.fillStyle = colour;
        let y = top;
        for (const line of lines) {
          mctx.fillText(line, gutter, y);
          y += leading;
        }
      };
      pass(size * tune.reach, "#0000ff"); // blue  — how far the light reaches
      pass(size * 0.06, "#00ff00"); // green — the cut edge
      pass(0, "#ff0000"); // red   — the glyph itself

      mctx.filter = "none";
      mctx.globalCompositeOperation = "source-over";

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
      gl.viewport(0, 0, pw, ph);
      gl.uniform2f(uRes, pw, ph);
    };

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    // Four ripple slots as flat x, y, struck-at triples. z below zero means unused.
    const ripples = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]);
    let slot = 0;
    let lastStrike = { x: 0, y: 0 };
    let clock = 0;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      tx = nx * 2 - 1;
      ty = ny * 2 - 1;
      if (tune.ripple <= 0) return;
      // Strike only once the pointer has actually travelled, or a slow drag would
      // spawn a ring every frame and the whole surface would boil.
      const dx = nx - lastStrike.x;
      const dy = ny - lastStrike.y;
      if (dx * dx + dy * dy < 0.0055) return;
      lastStrike = { x: nx, y: ny };
      ripples[slot * 3] = nx;
      ripples[slot * 3 + 1] = 1 - ny; // the shader's y runs from the bottom
      ripples[slot * 3 + 2] = clock;
      slot = (slot + 1) % 4;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let start = 0;

    const draw = (seconds: number, reveal: number) => {
      clock = seconds;
      if (tune.ripple > 0) gl.uniform3fv(uRipples, ripples);
      gl.uniform1f(uTime, seconds);
      gl.uniform1f(uReveal, reveal);
      gl.uniform2f(uMouse, mx, my);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const REVEAL_MS = 900;
    const ASSEMBLE_MS = 2200;
    let settled = false;

    const frame = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;

      // The material comes up quickly; the letters take their time arriving.
      const k = Math.min(elapsed / REVEAL_MS, 1);
      const reveal = (1 - Math.pow(1 - k, 2)) * 1.25;

      if (!settled) {
        const a = Math.min(elapsed / ASSEMBLE_MS, 1);
        if (a < 1) {
          compose(a);
        } else {
          // Landed. Draw the full-resolution mask once — cut edge, spill and all —
          // and stop touching the texture from here on.
          settled = true;
          build();
          section?.setAttribute("data-lit", "true");
        }
      }

      draw((elapsed / 1000) * tune.speed, reveal);

      /* PARK WHEN THE HERO IS OFF SCREEN.
         The material is alive on purpose — it drifts, it takes ripples, it lights
         under the cursor — so this loop is not an arrival animation that finishes, it
         is a shader that runs for as long as the page is open. That was fine when the
         page was one screen. The home page is now thirty-eight, and profiling showed
         this full-viewport fragment shader was the single most expensive thing on it:
         hiding this canvas took the median frame from 32ms to 19ms.

         Nothing is measured to decide. `window.scrollY` and `window.innerHeight` are
         the only two numbers read, which is the same pair the layout already comes
         from — no element is asked for anything, and the rule in
         `.claude/rules/hero.md` still holds. Parking only happens once the arrival has
         landed, so the choreography is never interrupted. */
      if (settled && window.scrollY > window.innerHeight * 1.35) {
        raf = 0;
        parked = elapsed;
        window.addEventListener("scroll", unpark, { passive: true });
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    /**
     * Back on screen: pick the clock up where it was left.
     *
     * `start` is rebased so the material resumes rather than jumping — the shader's
     * time drives the drift, and a discontinuity in it would show as the volume
     * lurching the moment the hero comes back into view.
     */
    let parked = 0;
    const unpark = () => {
      if (raf || window.scrollY > window.innerHeight * 1.2) return;
      window.removeEventListener("scroll", unpark);
      start = performance.now() - parked;
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (reduce.matches) {
        mx = 0;
        my = 0;
        settled = true;
        build();
        draw(3.2, 1.25);
        section?.setAttribute("data-lit", "true");
      } else {
        settled = false;
        start = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // `build` re-lays the letters as well as redrawing the settled mask, so a hero
        // still in flight keeps its own mask and simply flies to the new positions.
        build();
        if (reduce.matches) draw(3.2, 1.25);
      }, 120);
    };

    let cancelled = false;
    const boot = async () => {
      // The mask is only as good as the loaded face; drawing before it lands gives a
      // fallback-font silhouette that then never updates.
      try {
        await document.fonts.load(`400 100px ${fontFamily}`);
        await document.fonts.ready;
      } catch {
        /* worst case the mask uses fallback metrics — still a headline */
      }
      if (cancelled) return;
      build();
      run();
      section?.setAttribute("data-canvas", "on");
      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      reduce.addEventListener("change", run);
    };
    void boot();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", unpark);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      reduce.removeEventListener("change", run);
      section?.removeAttribute("data-canvas");
      section?.removeAttribute("data-lit");
      // The published origin outlives this component otherwise, and a trace on the next
      // route would start from a letterform that is no longer on the page.
      clearTraceOrigin();
    };
  }, [lines, fontFamily, ground]);

  return <canvas ref={ref} aria-hidden="true" className="hero-canvas" />;
}

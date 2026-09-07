---
paths:
  - "components/hero/**"
---

# The hero

`ApertureCanvas.tsx` draws the headline as a WebGL volume; `Hero.tsx` holds the DOM
around it. Everything below cost real time to find.

- **The reserves live in two files and must agree.** `reserves()` in `ApertureCanvas.tsx`
  sizes the canvas. `--hero-top-reserve` / `--hero-bottom-reserve` in `globals.css` size
  the DOM fallback. They have drifted twice; both times the symptom was a collision, not
  an error. Change one, change the other, then run `npm test`.
- **A line box is not the ink.** Archivo Black's ascender and descender overflow a 0.88
  line-height by about a quarter of an em at each end, so four lines paint ~4.01em, not
  3.52. `INK = lineCount * 0.88 + 0.49` is that correction. Sizing the box and ignoring
  the overflow kept the headline landing on the copy.
- **`smoothstep(a, b, x)` rises with `x`.** A left-to-right reveal needs
  `1.0 - smoothstep(front, front + w, x)`, and the front must travel past 1.0 or the band
  never clears the right edge. Getting this backwards looks deliberate — the material is
  simply masked out.
- **Two y-flips cancel.** `UNPACK_FLIP_Y_WEBGL` already orients a canvas for a shader
  reading `gl_FragCoord`. Negating v as well renders the type mirrored.
- **`over()` accumulates premultiplied alpha.** Do not multiply by alpha again at the end:
  `outColor = vec4(outC, outA)`. The double premultiply is invisible on glyphs and turns
  the corner grey.
- **Screenshots of this page take 2–3 seconds.** A capture taken "early" lands after the
  2.2s arrival has finished, which looks exactly like a broken animation. To see it, slow
  `ASSEMBLE_MS` right down rather than trying to time the capture.
- **Nothing here measures the DOM.** Every failure of the canvas hero this replaced came
  from measuring. Keep it that way.
- `prefers-reduced-motion` skips the assembly and paints the final frame. Not optional.

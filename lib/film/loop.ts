/**
 * The film's one progress loop. There is exactly one of these for the whole site.
 *
 * A scene registers a wrapper and its sticky stage; every frame the loop reads the
 * wrapper's position, turns it into a 0→1 number, and writes that onto the stage as
 * `--p`. Painters (the trace canvas) register a callback and run after every scene has
 * been measured, so a canvas and the CSS it sits behind always draw the same frame.
 *
 * WHY ONE LOOP AND NOT AN OBSERVER PER SCENE. Six scenes with six observers is six
 * layout reads a frame, arriving in whatever order the browser schedules them. One loop
 * reads them all in a batch, and — this is the part that matters — does every read
 * before any write. A `style.setProperty` between two `getBoundingClientRect` calls
 * invalidates style and forces the next read to recalculate, so a naive read/write/read
 * loop pays for layout once per scene instead of once per frame.
 *
 * WHY NOT REACT STATE. Moving a line must not re-render a tree. Nothing in here calls
 * into React; scenes hand over two DOM nodes and get a number written onto one of them.
 *
 * `prefers-reduced-motion` pins every scene at p = 1 — its final state, content
 * complete, nothing moving. See the three tiers in `.claude/DIRECTION.md`.
 */

export type SceneState = {
  id: string;
  /** 0 before the scene starts, 1 once its scroll length is spent. */
  p: number;
  /** The sticky stage's top in viewport coordinates. 0 while it is pinned. */
  stageTop: number;
  stageHeight: number;
};

export type FilmFrame = {
  /** `performance.now()`, so a painter can breathe without keeping its own clock. */
  now: number;
  scrollY: number;
  /** Signed scroll since the previous frame. What a held scene reacts to. */
  scrolled: number;
  w: number;
  h: number;
  reduced: boolean;
  scene: (id: string) => SceneState | undefined;
};

type Entry = {
  wrap: HTMLElement;
  stage: HTMLElement;
  state: SceneState;
  /** Last value written, so an unchanged frame writes nothing at all. */
  written: number;
};

const scenes = new Map<string, Entry>();
const painters = new Set<(frame: FilmFrame) => void>();
/**
 * Things that need to MEASURE the DOM, run in the read pass before any write.
 *
 * This exists because of a real and expensive bug. The canvas's segments each read a
 * rectangle to find out where they are, and they were doing it inside the painter —
 * which runs after the loop has written `--p` onto six stages. Every one of those
 * writes invalidates style for a subtree whose opacity and transform are computed from
 * `--p`, so the next `getBoundingClientRect` forced a full style recalculation and
 * layout of a 34,000px document. Six times a frame.
 *
 * Measured before the fix: median frame 50ms, p90 517ms, worst 917ms, 89 frames over
 * 50ms across one pass down the page. It was not subtle — the page visibly hung.
 *
 * Reads first, then writes, then paint. The rule was already written at the top of this
 * file and the canvas was quietly breaking it from the outside.
 */
const measurers = new Set<(frame: FilmFrame) => void>();

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

let raf = 0;
let lastScroll = 0;
let reduced = false;
let motionQuery: MediaQueryList | null = null;

/** Reused, so a sixty-frame second allocates nothing. */
const frame: FilmFrame = {
  now: 0,
  scrollY: 0,
  scrolled: 0,
  w: 0,
  h: 0,
  reduced: false,
  scene: (id) => scenes.get(id)?.state,
};

function tick(now: number) {
  raf = requestAnimationFrame(tick);

  const scrollY = window.scrollY;
  frame.now = now;
  frame.scrolled = scrollY - lastScroll;
  frame.scrollY = scrollY;
  frame.w = window.innerWidth;
  frame.h = window.innerHeight;
  frame.reduced = reduced;
  lastScroll = scrollY;

  // Pass one: read. Nothing in this loop touches a style.
  for (const entry of scenes.values()) {
    const rect = entry.wrap.getBoundingClientRect();
    const stageH = entry.stage.offsetHeight || frame.h;
    // The stage is one viewport tall and the wrapper is several, so what is left is
    // the scroll distance the scene gets to spend. The wrapper's height IS the duration.
    const duration = Math.max(1, rect.height - stageH);
    entry.state.p = reduced ? 1 : clamp01(-rect.top / duration);
    entry.state.stageHeight = stageH;
    /* Where `position: sticky; top: 0` has actually put the stage, derived rather than
       measured — a second rect read per scene to learn a number the first one already
       determines. Above the scene it travels with the wrapper; while stuck it is 0; on
       the way out it rides up with the wrapper's bottom edge. */
    entry.state.stageTop =
      rect.top > 0 ? rect.top : Math.min(0, rect.bottom - stageH);
  }

  /* Still pass one: anything else that needs to measure. Every DOM read in the whole
     film happens above this line. */
  for (const measure of measurers) measure(frame);

  // Pass two: write.
  for (const entry of scenes.values()) {
    const p = entry.state.p;
    if (Math.abs(p - entry.written) < 0.0004) continue;
    entry.written = p;
    entry.stage.style.setProperty("--p", p.toFixed(4));
  }

  for (const paint of painters) paint(frame);

  mark(frame.h);
}

/**
 * The URL follows the film, quietly.
 *
 * `DIRECTION.md` asks that each chapter carry an id and that the address bar update as
 * you pass it, so a moment can be linked to and sent to somebody. It is `replaceState`,
 * never `pushState`: the back button has to leave the page, not walk back up seven
 * chapters one at a time.
 *
 * Only on a change — seven writes across a thirty-eight screen scroll. Doing it per
 * frame would hit the browser's own rate limit on history writes inside two seconds,
 * and the console warning is the only thing that would tell you.
 */
let currentChapter = "";

function mark(viewportH: number) {
  let live = "";
  /* Only registered SCENES are candidates. Chapter 03 carries `data-scene` and an id so
     `/#ledger` still resolves and still scrolls to it, but it is an ordinary band rather
     than a pinned stage, so it never claims the fragment. A chapter that does not hold
     the scroll should not claim to be where you are. */
  for (const entry of scenes.values()) {
    // The one holding the middle of the window. A scene is "the chapter you are in"
    // when its stage covers the centre, not when its edge has crept into view.
    const top = entry.state.stageTop;
    if (top <= viewportH / 2 && top + entry.state.stageHeight > viewportH / 2) {
      live = entry.state.id;
    }
  }
  if (live === currentChapter) return;
  currentChapter = live;
  try {
    const url = live ? `#${live}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  } catch {
    /* Some embedded contexts refuse history writes. Losing the fragment is not worth
       an exception in the middle of a paint. */
  }
}

function start() {
  if (raf) return;
  if (!motionQuery) {
    motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced = motionQuery.matches;
    motionQuery.addEventListener("change", (e) => {
      reduced = e.matches;
    });
  }
  lastScroll = window.scrollY;
  raf = requestAnimationFrame(tick);
}

function stop() {
  if (!raf || scenes.size || painters.size || measurers.size) return;
  cancelAnimationFrame(raf);
  raf = 0;
}

/**
 * Register a scene. Returns the unsubscribe, which is what an effect returns.
 *
 * `id` is how a chapter's canvas segment finds its own progress — the two are separate
 * registrations because the DOM half and the drawn half of a chapter are separate
 * components, and only one of them is allowed to own a canvas.
 */
export function registerScene(id: string, wrap: HTMLElement, stage: HTMLElement) {
  scenes.set(id, {
    wrap,
    stage,
    state: { id, p: 0, stageTop: 0, stageHeight: 0 },
    written: -1,
  });
  start();
  return () => {
    scenes.delete(id);
    stop();
  };
}

/** Register something that draws once per frame, after every scene has been measured. */
export function registerPainter(paint: (frame: FilmFrame) => void) {
  painters.add(paint);
  start();
  return () => {
    painters.delete(paint);
    stop();
  };
}

/**
 * Register something that READS the DOM once per frame.
 *
 * It runs in the read pass, before a single style is written. Anything that calls
 * `getBoundingClientRect` on a frame belongs here and nowhere else — see the note on
 * `measurers` above for what it costs to get this wrong.
 */
export function registerMeasure(measure: (frame: FilmFrame) => void) {
  measurers.add(measure);
  start();
  return () => {
    measurers.delete(measure);
    stop();
  };
}

/**
 * The ROOM — geometry for the spatial product floor.
 *
 * Every product has a FIXED place and never leaves it. Scroll turns the room — one
 * `rotateY` on one element — and the camera pulls back and looks down as it goes. That is
 * `ECOSYSTEM-BRIEF.md`'s first borrowed principle taken literally: *the camera moves, not
 * the objects.* The first attempt made a panel's position a function of its distance from
 * focus, which rearranges eight objects around a fixed camera — a carousel with depth of
 * field, however it is dressed.
 *
 * THE ROOM IS SIZED FROM THE PANEL, NOT FROM A CONSTANT. `radiusFor` takes the width the
 * stylesheet has actually given a panel and returns the ring that fits eight of them
 * without their planes cutting through each other. Everything else — the standoff, the
 * floor's depth, the height scatter — is a ratio of that radius. So one CSS rule decides
 * how big the room is at every window, and the geometry follows instead of disagreeing
 * with it. Fixed pixel radii are what made the first build fall apart away from 1440x900.
 *
 * PERFORMANCE IS A DESIGN CONSTRAINT HERE, NOT A TIDY-UP. Profiled at 1440x900 while
 * scrolling: the first version of this room ran at a median frame of 333ms — three frames
 * a second — against 16.7ms on `/products/`. Two things caused nearly all of it and both
 * are gone:
 *
 *   A ROTATING 3D PLANE COSTS ABOUT 16ms A FRAME WHATEVER ITS SIZE. The floor was inside
 *   the turning room, so its screen projection changed every frame and it was rasterised
 *   again every frame. 5200px and 1000px measured the same. The floor is now OUTSIDE the
 *   rotating element with a transform that never changes, so it is rasterised once.
 *
 *   `filter: blur()` AND A 120px GLOW ON EIGHT PANELS. Both force a re-raster of a whole
 *   coded interface every time the projected scale moves. Depth is carried by scale and
 *   by haze — see `Pose.haze` — which cost nothing.
 *
 * NOTHING IS IMPORTED HERE. `Room.tsx` is a Client Component; importing `products.ts` for
 * a count would drag five hundred lines of copy into the browser behind it.
 */

/* ── The hash ────────────────────────────────────────────────────────────────
   FNV-1a into an xorshift stream. The opening pose is rendered into the HTML, so the
   server and the browser have to agree exactly and forever: `Math.random()` at module
   scope would be a hydration bug on a static export. */

function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function stream(seed: number): () => number {
  let s = seed >>> 0 || 0x9e3779b9;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0x100000000;
  };
}

/** Where one product stands in the room. It never moves from here. */
export interface Stand {
  slug: string;
  /** Radians around the room. Evenly spaced, with a hashed wobble under half a slot. */
  angle: number;
  /** Radians between two neighbouring stands. Carried so `poseFor` can measure against
      it without a `count` parameter — the last time this file took a bare `number` next
      to `aim`, both call sites handed over the wrong one and the compiler could not tell. */
  slot: number;
  /** How far out, as a multiple of the room's radius. A narrow band — see below. */
  reach: number;
  /** Height off the floor as a FRACTION of the radius, -1 to 1. No shared baseline. */
  rise: number;
  /** Degrees. A small turn off dead-radial, so eight panels are not eight facets. */
  face: number;
  /** Degrees of resting tilt. */
  pitch: number;
  /** The ambient drift's phase, so the room is alive before you touch it. */
  phase: number;
  /** 0.72 to 1.34. Heavier panels answer the scroll later and settle slower. */
  mass: number;
  /** How much of the drift this panel takes sideways rather than vertically. */
  bias: number;
}

export function standFor(slug: string, i: number, count: number): Stand {
  const r = stream(hash32(slug));
  const slot = (Math.PI * 2) / Math.max(1, count);
  return {
    slug,
    slot,
    /* A third of a slot at most. Bigger and two panels swap places, which breaks the
       reading order the run depends on. */
    angle: i * slot + (r() - 0.5) * slot * 0.34,
    /* A NARROW BAND. At 0.84-1.18 two neighbouring panels sat far enough apart in radius
       that their planes INTERSECTED as they turned toward the camera — real 3D behaviour
       that looks exactly like a rendering fault: a hard diagonal seam across the
       interface you are trying to read. Depth between neighbours is the ring, not the
       reach. */
    reach: 0.94 + r() * 0.13,
    /* A FRACTION OF THE RADIUS, so the height scatter is the same shape of composition
       at every window size. Held small on purpose: this is the variation the eye reads
       as "not a grid", and at any more the panel in focus lands under the header. */
    rise: (r() * 2 - 1) * 0.09,
    face: (r() * 2 - 1) * 13,
    pitch: (r() * 2 - 1) * 5,
    phase: r() * Math.PI * 2,
    mass: 0.72 + r() * 0.62,
    bias: r() * 2 - 1,
  };
}

/** The signs on the walls: practice and industry names, parked outside the ring. */
export function signStand(label: string, i: number, count: number) {
  const r = stream(hash32(`sign:${label}`));
  const slot = (Math.PI * 2) / Math.max(1, count);
  return {
    /* Offset half a slot from the products, so a word is never directly behind the panel
       you are reading. */
    angle: i * slot + slot * 0.5 + (r() - 0.5) * slot * 0.3,
    reach: 2.05 + r() * 0.5,
    rise: (r() < 0.5 ? -1 : 1) * (0.24 + r() * 0.22),
  };
}

/* ── Sizing the room from the panel ──────────────────────────────────────────
   Eight stands on a ring of radius R sit 2*R*sin(pi/8) = 0.765*R apart along the chord.
   A panel wider than that chord cuts through the one beside it. 0.58 leaves the panel at
   about three quarters of the gap: they overlap as they should in a crowded room, and
   they never intersect. */

const PANEL_TO_RADIUS = 0.58;

export function radiusFor(panelWidth: number): number {
  return Math.max(240, panelWidth) / PANEL_TO_RADIUS;
}

/* ── Tuning ──────────────────────────────────────────────────────────────────
   RATIOS, not pixels. The only absolute length in the room is the panel width, which the
   stylesheet owns; everything here is a multiple of the radius that follows from it.

   Two of them, and the second is not the first scaled down. `ECOSYSTEM-BRIEF.md`:
   "Mobile — not disabled, and not the desktop shrunk. Two depth bands, no cursor
   influence, one product per screen, panels scaled for legibility rather than
   composition, drift amplitude roughly halved." */

export interface Tuning {
  /** How far outside the front panel the camera sits, as a multiple of the radius. */
  standoff: number;
  /** Degrees the camera looks down at rest. A room needs a floor; a floor needs this. */
  tilt: number;
  /** How far the floor sits below the ring, as a multiple of the radius. */
  floorDrop: number;
  /** Extra depth given up during the pull-back, as a multiple of the radius. */
  pull: number;
  /** How far the camera rises during the pull-back, as a multiple of the radius. */
  lift: number;
  /** Degrees it looks down by at the pull-back. */
  pullTilt: number;
  /** Ambient drift amplitude, px. */
  amb: number;
  /** Scroll delta to panel velocity. */
  kick: number;
  /** Velocity to degrees of bank. Capped at BANK_MAX whatever this says. */
  bank: number;
  /** Opacity of the haze laid over a panel at the back of the room. */
  dim: number;
  /** Camera yaw and pitch from the cursor, in degrees. 0 on touch. */
  cursor: number;
  /**
   * How much of each product's turn the camera spends STILL, at each end, 0 to 0.5.
   *
   * 0.33 leaves the middle third for the move. On a phone that is too long: the panel is
   * 320px of a 390px window, so the moment the room turns at all it is half out of the
   * frame, and a third of every product's turn was spent that way. 0.42 leaves the middle
   * sixth — the camera snaps between products and holds, which is also what the brief
   * means by one product per screen on mobile.
   */
  hold: number;
  /**
   * How far each panel turns back toward the camera, 0 to 1.
   *
   * WITHOUT THIS THE ROOM SHOWS YOU ITS BACK. A panel placed with
   * `rotateY(angle) translateZ(radius)` faces outward from the ring, so past ninety
   * degrees you are looking at the reverse of an interface — a mirrored dashboard, which
   * is the most broken-looking thing a 3D page can do. At 0.62 a panel directly behind
   * the front one ends up turned about seventy degrees: clearly side-on, clearly placed
   * in space, and never backwards.
   */
  billboard: number;
}

export const DESKTOP: Tuning = {
  standoff: 0.17,
  tilt: 6,
  floorDrop: 0.36,
  pull: 1.45,
  lift: 0.24,
  pullTilt: 20,
  amb: 7,
  kick: 0.05,
  bank: 0.85,
  dim: 0.34,
  cursor: 3,
  hold: 0.33,
  billboard: 0.62,
};

export const HANDHELD: Tuning = {
  standoff: 0.16,
  tilt: 5,
  floorDrop: 0.34,
  pull: 1.35,
  lift: 0.22,
  pullTilt: 17,
  /* Halved, per the brief. */
  amb: 3.5,
  kick: 0.042,
  bank: 0.8,
  dim: 0.42,
  /* Never on touch. A hover-driven camera lurches once when a finger lands and then holds
     that lurch forever. */
  cursor: 0,
  hold: 0.42,
  /* Higher on a phone: the frame is narrow, so a panel turned side-on is a sliver, and a
     sliver is not one of the two bands the brief allows. */
  billboard: 0.74,
};

export function tuningFor(width: number): Tuning {
  return width < 1024 ? HANDHELD : DESKTOP;
}

/* ── The timeline ──────────────────────────────────────────────────────────── */

const ENTER = 0.05;
const RUN_END = 0.78;
const GATHER_END = 0.9;
const EXIT = 0.96;

/** Rotation that comes from movement is capped here, and nowhere else. */
export const BANK_MAX = 6;

export interface Timeline {
  /** Which product faces you, as a float. 3.5 is halfway between four and five. */
  focus: number;
  /** Which product is READ as facing you. Something always faces you. */
  index: number;
  /** 0 to 1 across the pull-back, where the camera rises and the whole room appears. */
  gather: number;
  /** 0 to 1 as the camera comes in at the start. */
  arrival: number;
  /** 0 to 1 across the exit. */
  exit: number;
}

export function timeline(p: number, count: number): Timeline {
  const run = clamp01((p - ENTER) / (RUN_END - ENTER));
  const focus = run * Math.max(1, count - 1);
  return {
    focus,
    /* EXACTLY ONE PANEL HOLDS THE FRONT, always, changing at the halfway point between
       two products. The caption and the interactivity both hang off this, and both have
       to be a single answer rather than a blend. */
    index: Math.round(focus),
    gather: clamp01((p - RUN_END) / (GATHER_END - RUN_END)),
    arrival: clamp01(p / ENTER),
    exit: clamp01((p - EXIT) / (1 - EXIT)),
  };
}

/**
 * THE CAMERA COMES TO REST, and this is the function that makes it.
 *
 * Turning the room at a constant rate against a constant scroll is why the first pass
 * never had a moment: nothing was ever CENTRED. The front panel was square-on only at the
 * instant the focus crossed a whole number, and everywhere else it sat off to one side
 * with its caption drifting behind whatever happened to be nearer. A visitor scrolling at
 * any speed almost never saw the composition.
 *
 * So the turn holds and then moves: flat through the first and last part of a product's
 * turn, easing across the middle. How much is held is `Tuning.hold`, and it is bigger on
 * a phone, where a panel fills most of the window and any turn takes it out of frame. Each product gets a beat where it is dead centre
 * and readable, and the move between two is a gesture rather than a drift. That is
 * `DIRECTION.md`'s hold-and-operate rhythm applied to a camera, and it costs one line.
 */
function dwell(x: number, hold: number): number {
  const i = Math.floor(x);
  const f = x - i;
  return i + ease(clamp01((f - hold) / Math.max(0.02, 1 - hold * 2)));
}

/**
 * The angle the camera is pointed at, in radians — interpolated between the ACTUAL angles
 * of the two products it is between, not between their slots.
 *
 * Each stand carries a hashed wobble off its slot, which is what stops the ring reading
 * as a turntable. Pointing at the slot instead left the panel in focus up to a hundred
 * pixels off centre while it was supposed to be standing still. The irregularity belongs
 * in the SPACING between panels, never in whether the one you are reading is in the
 * middle of the screen.
 */
export function focusAngle(t: Timeline, angles: number[], hold: number): number {
  if (angles.length === 0) return 0;
  const d = dwell(t.focus, hold);
  const i = Math.min(angles.length - 1, Math.max(0, Math.floor(d)));
  const j = Math.min(angles.length - 1, i + 1);
  const f = clamp01(d - i);
  /* The short way round, so the last-to-first wrap does not spin the room backwards
     through seven products. */
  return angles[i] + wrap(angles[j] - angles[i]) * f;
}

/* ── The camera ────────────────────────────────────────────────────────────── */

export interface Camera {
  /** Degrees the room is turned by. */
  spin: number;
  /** px. Negative pushes the room away. */
  dist: number;
  /** px the scene drops, which is the camera rising. */
  lift: number;
  /** Degrees it looks down. */
  tilt: number;
  /** How much of the floor is still there, 1 to 0. */
  floor: number;
}

/**
 * Where you are standing. ONE transform on ONE element carries the turn, the height, the
 * look-down and the distance — which is why a room of eight coded interfaces writes a
 * single style per frame.
 *
 * THE VERTICAL CENTRING IS NOT HERE. It is `padding-top` on the stage's grid, which puts
 * the room's middle halfway between the header and the bottom of the window at any
 * height. A pixel constant here was what left a 820x1180 tablet with the whole
 * composition crammed into its lower third.
 */
export function camera(t: Timeline, aim: number, radius: number, k: Tuning): Camera {
  const g = ease(t.gather);
  return {
    spin: -(aim * 180) / Math.PI,
    dist:
      -radius * (1 + k.standoff) -
      (1 - t.arrival) * radius * 0.45 -
      g * radius * k.pull -
      t.exit * radius,
    lift: g * radius * k.lift + t.exit * radius * 0.1,
    tilt: k.tilt + g * k.pullTilt,
    /* The floor is a static element outside the turning room, so it cannot follow the
       camera up and over during the pull-back. It fades instead — which is also the
       right composition: the last beat is eight interfaces at once and wants nothing
       else in the frame. */
    floor: 1 - g,
  };
}

/* ── A panel's pose ────────────────────────────────────────────────────────── */

/**
 * `back` is not a depth band, it is a cull. A panel more than about 140 degrees round the
 * room is behind the one you are reading, scaled to under half size and mostly covered by
 * haze — and it still costs a full rasterisation of a coded interface every frame that its
 * projected scale moves. Two of the eight are usually in it. Not drawing them took a
 * 2560x1440 window from 50ms a frame to inside the budget and takes nothing off the
 * screen. It is switched off for the pull-back, where all eight ARE the composition.
 */
export type Band = "near" | "mid" | "far" | "back";

export interface Pose {
  /** Degrees around the room. */
  angle: number;
  /** px out from the centre. */
  radius: number;
  /** px above the ring's plane. */
  y: number;
  /** Degrees. */
  face: number;
  /** Degrees. */
  pitch: number;
  /**
   * How much of the room's ground is laid OVER this panel, 0 to 1 — atmospheric haze,
   * drawn inside an opaque panel.
   *
   * IT USED TO BE `opacity` ON THE PANEL AND THAT WAS WRONG. A white interface at 0.7
   * opacity is TRANSLUCENT: on the dark ground you could read the panel behind it through
   * it, and on the white one two panels merged into one grey shape. Depth is haze in
   * front of an opaque object, not an object you can see through.
   */
  haze: number;
  band: Band;
  /** 1 while the camera rests on this panel, 0 the instant the front changes hands. */
  caption: number;
}

/**
 * Where panel `i` is, seen from a camera pointed at `aim`.
 *
 * `aim` IS THE ANGLE THE CAMERA IS ACTUALLY POINTED AT — `focusAngle(t, angles)`, which
 * holds on each product and eases between them. It is not derivable from `t.focus` here:
 * `t.focus` moves at a constant rate and the camera does not, and a panel whose facing is
 * computed from one while the room is turned by the other is a panel that is edge-on when
 * it should be square to you. That shipped for one pass, and the compiler could not catch
 * it — this parameter used to be `count`, both are `number`, and both call sites were
 * quietly handing over the wrong one.
 */
export function poseFor(
  stand: Stand,
  i: number,
  aim: number,
  radius: number,
  t: Timeline,
  k: Tuning,
): Pose {
  /* How far round from the camera, signed and folded to the short way. This one number
     drives the band, the haze and the turn back toward the viewer. */
  const off = wrap(stand.angle - aim);
  const away = Math.abs(off) / Math.PI;
  /* At the pull-back every panel turns the rest of the way to face you, because the
     composition the page arrives at is eight interfaces READ AT ONCE, not eight
     rectangles seen edge-on. During the run they stay placed in the room. */
  const b = k.billboard + (1 - k.billboard) * ease(t.gather);

  return {
    angle: (stand.angle * 180) / Math.PI,
    radius: stand.reach * radius,
    y: stand.rise * radius,
    face: stand.face - ((off * 180) / Math.PI) * b,
    pitch: stand.pitch,
    haze: away * k.dim,
    /* THE NEAR BAND IS THE PANEL HOLDING THE FRONT, by definition rather than by
       threshold. An angle test does not agree with `t.index`, and there were scroll
       positions with no panel in the near band at all. */
    band:
      i === t.index
        ? "near"
        : away < 0.4
          ? "mid"
          : away > 0.78 && t.gather < 0.02
            ? "back"
            : "far",
    /* ONE CAPTION, EVER, and it belongs to the panel holding the front. Two adjacent
       panels sit in almost the same place on screen through a handover, so anything that
       fades a caption by distance prints two product names on top of each other — which
       is what the first version did, at four tenths of an opacity each, and it was the
       worst thing on the page.

       Full while the camera rests on it, nothing while it is moving: measured against how
       far round the room the camera actually is, so the name is at full strength for
       exactly as long as its panel is square-on, and at nothing through the move. */
    /* MEASURED IN SLOTS, and it has to be. This was written against a fraction of a
       whole turn — full inside 0.34 of one — which is nearly THREE slots, so the caption
       never faded at all: it stayed fully lit while its panel slid a hundred pixels off
       centre and out of the frame on a phone. It looked correct for two days because
       every screenshot was taken at a rest point, where the panel is centred anyway.
       The camera HOLDS on each product for two thirds of its turn and moves across the
       middle third, so this is full for the whole hold and off through the whole move —
       and at nothing on both sides of the swap, where two captions would otherwise print
       over each other. A caption lit on a panel that is halfway out of the frame is the
       thing this is guarding against, and on a phone the panel is 320px of a 390px
       window, so it is out of the frame the moment the room turns at all. */
    caption:
      i === t.index
        ? ease(clamp01((stand.slot * 0.3 - Math.abs(off)) / (stand.slot * 0.18))) *
          (1 - ease(t.gather))
        : 0,
  };
}

/**
 * The transform for a panel standing in the room.
 *
 * `rotateY(angle) translateZ(radius)` is what puts it on the ring facing outward; the
 * rest is its own character and whatever the scroll has just done to it.
 */
export function standTransform(
  p: Pose,
  drift: { x: number; y: number; bank: number },
): string {
  return (
    `rotateY(${p.angle.toFixed(2)}deg)` +
    ` translateZ(${p.radius.toFixed(1)}px)` +
    ` translate3d(${drift.x.toFixed(1)}px, ${(p.y + drift.y).toFixed(1)}px, 0px)` +
    ` rotateY(${p.face.toFixed(2)}deg)` +
    ` rotateX(${(p.pitch + drift.bank).toFixed(2)}deg)`
  );
}

/** The transform for the room itself. */
export function cameraTransform(c: Camera): string {
  return (
    `translate3d(0px, ${c.lift.toFixed(1)}px, ${c.dist.toFixed(1)}px)` +
    ` rotateX(${c.tilt.toFixed(2)}deg)` +
    ` rotateY(${c.spin.toFixed(2)}deg)`
  );
}

/**
 * The transform for the floor, which is OUTSIDE the turning room and written once per
 * resize rather than once per frame.
 *
 * That is the single biggest performance decision on this page. A large plane inside the
 * rotating element has a screen projection that changes every frame, so the browser
 * rasterises it again every frame — measured at about 16ms a frame at 1440x900, and the
 * same whether the plane was 5200px or 1000px. Static, it is rasterised once and then
 * only composited. The camera's resting tilt is baked in here so the floor and the room
 * agree about which way is down.
 */
export function floorTransform(radius: number, k: Tuning): string {
  return (
    `rotateX(${k.tilt.toFixed(2)}deg)` +
    ` translateY(${(radius * k.floorDrop).toFixed(0)}px)` +
    ` translateZ(${(-radius * 0.5).toFixed(0)}px)` +
    ` rotateX(90deg)`
  );
}

/* ── Small arithmetic ──────────────────────────────────────────────────────── */

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const clamp = (n: number, lo: number, hi: number) =>
  n < lo ? lo : n > hi ? hi : n;
/** Smoothstep. */
export const ease = (u: number) => u * u * (3 - 2 * u);
/** An angle folded into -PI..PI, so "how far round" is always the short way. */
export const wrap = (a: number) => {
  const x = (((a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return x - Math.PI;
};

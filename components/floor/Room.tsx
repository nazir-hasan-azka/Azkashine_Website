"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { FLOOR } from "@/lib/content/floor";
import { registerPainter, registerScene, type FilmFrame } from "@/lib/film/loop";
import {
  BANK_MAX,
  camera,
  cameraTransform,
  clamp,
  floorTransform,
  focusAngle,
  poseFor,
  radiusFor,
  standFor,
  standTransform,
  timeline,
  tuningFor,
  type Stand,
  type Tuning,
} from "@/lib/floor/room";

/**
 * THE FLOOR. `lib/floor/room.ts` carries the geometry and the argument for it.
 *
 * `look` picks the ground. `dark` ships; `paper` is kept because the two were built as
 * routes to be scrolled side by side and keeping the loser is a few custom properties.
 * `app/styles/floor.css` branches on `[data-look]` for the ground, the ruling on the
 * floor, and what colour the type has to be to survive on it.
 *
 * WHAT THIS WRITES PER FRAME, and nothing else: one transform on the room, one transform
 * and one haze opacity per panel, one caption opacity, two scrim opacities, and — only
 * when the front changes hands — eight `inert` attributes and a live-region line. Every
 * one is a non-inherited property on a single element, so nothing invalidates a
 * descendant and nothing causes layout.
 *
 * WHAT IT WRITES ONLY ON RESIZE: the floor's transform and the room's radius. The floor is
 * a static element OUTSIDE the turning room for the reason recorded on `floorTransform` —
 * a rotating 3D plane is rasterised again every frame and cost 16ms of a 16.7ms budget.
 * The radius comes from the panel's measured width, so the stylesheet decides how big the
 * room is at every window and the geometry follows instead of disagreeing with it.
 *
 * The rules from the first build that still stand:
 *
 *   NO VIRTUAL SCROLL. The document scrolls normally.
 *   `--p` NEVER LANDS ABOVE THE INTERFACES. It goes on a zero-width probe with no
 *   children; an inherited custom property over eight coded product UIs is the 5.78s of
 *   style recalculation `PLAN.md` records from the home page.
 *   POSITION SELECTS, VELOCITY ANIMATES. Scroll position picks which product faces you;
 *   scroll velocity feeds a spring with a hashed mass per product, so the eight settle at
 *   eight different moments.
 */

const SCENE = "room";

interface Live {
  el: HTMLElement;
  haze: HTMLElement | null;
  cap: HTMLElement | null;
  stand: Stand;
  name: string;
  vel: number;
  off: number;
  tf: string;
  hz: string;
  capOp: string;
  band: string;
  inert: boolean;
}

const STIFF = 0.045;
const DAMP = 0.86;
const OFF_MAX = 48;

export function Room({
  look,
  children,
}: {
  /** `dark` is a lit hall; `paper` keeps the site's white ground. */
  look: "dark" | "paper";
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const sayRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    const stage = stageRef.current;
    const floor = floorRef.current;
    const room = roomRef.current;
    const veil = veilRef.current;
    const say = sayRef.current;
    if (!wrap || !probe || !stage || !floor || !room || !veil || !say) return;

    const panels: Live[] = [...room.querySelectorAll<HTMLElement>(".room-panel")].map(
      (el, i, all) => ({
        el,
        haze: el.querySelector<HTMLElement>(".room-haze"),
        cap: el.querySelector<HTMLElement>(".room-cap"),
        stand: standFor(el.dataset.slug || "", i, all.length),
        name: el.dataset.name || "",
        vel: 0,
        off: 0,
        tf: "",
        hz: "",
        capOp: "",
        band: el.dataset.band || "",
        inert: false,
      }),
    );
    if (panels.length === 0) return;

    /* Fixed for the life of the room: it never moves, so its angles never change. */
    const angles = panels.map((p) => p.stand.angle);

    let aimYaw = 0;
    let aimPitch = 0;
    let lookYaw = 0;
    let lookPitch = 0;

    const fine =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      aimYaw = (e.clientX / window.innerWidth - 0.5) * 2;
      aimPitch = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (fine) stage.addEventListener("pointermove", onPointer, { passive: true });

    let index = -2;
    let driving = false;
    let camTf = "";
    let veilOp = "";
    let floorOp = "";

    /* THE ONE MEASUREMENT ON THIS PAGE, and it happens on resize rather than on a frame.
       The radius comes from the width the stylesheet has actually given a panel, so one
       CSS rule decides the composition at every window size. Fixed pixel radii are what
       made the first build fall apart everywhere except 1440x900. */
    let sized = "";
    let radius = radiusFor(320);

    const resize = (w: number, h: number, k: Tuning) => {
      const key = `${w}x${h}`;
      if (key === sized) return;
      sized = key;
      radius = radiusFor(panels[0].el.offsetWidth);
      floor.style.transform = floorTransform(radius, k);
    };

    /** Reduced motion arrived after the room had been driven. Hand it all back. */
    const rest = () => {
      driving = false;
      for (const p of panels) {
        p.el.style.transform = "";
        if (p.haze) p.haze.style.opacity = "";
        if (p.cap) p.cap.style.opacity = "";
        p.el.removeAttribute("inert");
        p.inert = false;
        p.tf = p.hz = p.capOp = "";
      }
      room.style.transform = "";
      floor.style.transform = "";
      floor.style.opacity = "";
      veil.style.opacity = "";
      say.textContent = "";
      camTf = veilOp = floorOp = "";
      sized = "";
      index = -2;
    };

    const offScene = registerScene(SCENE, wrap, probe);

    const offPaint = registerPainter((f: FilmFrame) => {
      const s = f.scene(SCENE);
      if (!s) return;

      /* Tier one of the three in `DIRECTION.md`: reduced motion collapses the room to a
         static composition with every product legible. The stylesheet lays the panels out
         as a plain grid and this stops writing. It can arrive mid-session, so the inline
         styles written up to that point have to come back off — a stylesheet cannot beat
         an inline transform. */
      if (f.reduced) {
        if (driving) rest();
        return;
      }
      driving = true;

      const k: Tuning = tuningFor(f.w);
      resize(f.w, f.h, k);

      const t = timeline(s.p, panels.length);
      /* Where the camera is pointed: between the ACTUAL angles of the two products it is
         between, with a hold on each one. See `focusAngle` and `dwell`. */
      const aim = focusAngle(t, angles, k.hold);
      const cam = camera(t, aim, radius, k);

      lookYaw += (aimYaw * k.cursor - lookYaw) * 0.07;
      lookPitch += (-aimPitch * k.cursor - lookPitch) * 0.07;

      const nextCam =
        `rotateY(${lookYaw.toFixed(2)}deg) rotateX(${lookPitch.toFixed(2)}deg) ` +
        cameraTransform(cam);
      if (nextCam !== camTf) {
        camTf = nextCam;
        room.style.transform = nextCam;
      }

      /* Opacity on a static element only composites; it never re-rasterises. That is why
         the floor can fade for free while it could not turn for free. */
      const nextFloor = cam.floor.toFixed(2);
      if (nextFloor !== floorOp) {
        floorOp = nextFloor;
        floor.style.opacity = nextFloor;
      }

      /* The exit, as a scrim rather than opacity on the room itself: opacity below 1 is a
         grouping property and would flatten `preserve-3d`, collapsing the whole room into
         one plane at exactly the moment it is meant to recede. */
      const nextVeil = (t.exit * 0.7).toFixed(3);
      if (nextVeil !== veilOp) {
        veilOp = nextVeil;
        veil.style.opacity = nextVeil;
      }

      for (let i = 0; i < panels.length; i++) {
        const p = panels[i];
        const pose = poseFor(p.stand, i, aim, radius, t, k);

        /* Velocity in, damping out. Scroll feeds the spring, the spring pulls back to rest
           and loses energy, and MASS is hashed per slug — so the room drifts after you
           stop and settles piece by piece rather than all at once. */
        p.vel = (p.vel + (f.scrolled * k.kick - p.off * STIFF) / p.stand.mass) * DAMP;
        p.off = clamp(p.off + p.vel, -OFF_MAX, OFF_MAX);

        /* The panel facing you takes a third of the drift and a third of the bank. Not
           frozen — a still object in a moving room reads as a bug — but steadied, which is
           what makes it the one you can read. */
        const calm = 1 - clamp(1 - Math.abs(i - t.focus), 0, 1) * 0.62;

        const drift = {
          x:
            (Math.cos(f.now * 0.00031 + p.stand.phase) * k.amb * 0.6 +
              p.off * p.stand.bias * 0.5) *
            calm,
          y: (Math.sin(f.now * 0.00042 + p.stand.phase) * k.amb + p.off) * calm,
          /* Banking, and the only rotation here that comes from movement. Capped at ±6°
             and it returns to rest on its own, because `vel` does. */
          bank: clamp(p.vel * k.bank, -BANK_MAX, BANK_MAX) * calm,
        };

        const tf = standTransform(pose, drift);
        if (tf !== p.tf) {
          p.tf = tf;
          p.el.style.transform = tf;
        }

        const hz = pose.haze.toFixed(2);
        if (hz !== p.hz && p.haze) {
          p.hz = hz;
          p.haze.style.opacity = hz;
        }

        const capOp = pose.caption.toFixed(2);
        if (capOp !== p.capOp && p.cap) {
          p.capOp = capOp;
          p.cap.style.opacity = capOp;
        }

        if (pose.band !== p.band) {
          p.band = pose.band;
          p.el.dataset.band = pose.band;
        }
      }

      /* Eight writes across the whole page, not sixty a second: only when the front
         changes hands. Off-band panels are `inert` — a panel turned seventy degrees away
         is not something to offer a pointer or a keyboard, and the index under the room
         carries all eight links in order for anyone who wants them. */
      if (t.index !== index) {
        index = t.index;
        for (let i = 0; i < panels.length; i++) {
          const p = panels[i];
          const off = i !== index;
          if (p.inert !== off) {
            p.inert = off;
            p.el.toggleAttribute("inert", off);
          }
        }
        const focused = index >= 0 ? panels[index] : null;
        say.textContent = focused ? `${FLOOR.announce}: ${focused.name}` : "";
      }
    });

    return () => {
      offPaint();
      offScene();
      if (fine) stage.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section className="room" data-look={look} aria-label={FLOOR.label}>
      <div
        ref={wrapRef}
        id={SCENE}
        className="room-scene"
        data-scene={SCENE}
        /* EIGHT SCREENS, NOT TWELVE. The floor opens `/products/`, and a buyer who
             came to compare eight products has to get past it to the grid — so it is a
             complete turn of the room at about three quarters of a screen per product
             rather than a leisurely one. It is this one number if it wants to be
             shorter still. */
        style={{ "--screens": "8", "--screens-sm": "6" } as CSSProperties}
      >
        <div ref={stageRef} className="room-stage">
          {/* Zero width, no children, and the only element `--p` is ever written onto. */}
          <div ref={probeRef} className="room-probe" aria-hidden="true" />

          {/* THE FLOOR, and it is deliberately NOT inside the room below it. A plane that
              turns has a screen projection that changes every frame, so it is rasterised
              every frame — measured at 16ms of a 16.7ms budget, and the same at 5200px as
              at 1000px. Here its transform is written once per resize and never again,
              and it fades rather than following the camera over the top. */}
          <div ref={floorRef} className="room-floor" aria-hidden="true">
            <span className="room-grid" />
            <span className="room-pool" />
          </div>

          <div ref={roomRef} className="room-space">
            {children}
          </div>

          <div ref={veilRef} className="room-veil" aria-hidden="true" />
          <p ref={sayRef} className="sr-only" aria-live="polite" />
        </div>
      </div>
    </section>
  );
}

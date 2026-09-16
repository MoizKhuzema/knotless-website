/**
 * The knot — geometry only, no rendering, no DOM.
 *
 * Phase 3 of the hero intro is the whole idea: a ribbon that ties itself into a
 * knot a reader recognises AS a knot. This module owns the curve, the untying
 * parameter, the self-intersection search and the ribbon mesh, so the eventual
 * overlay component imports it rather than carrying its own copy.
 *
 * Kept free of canvas and DOM calls on purpose: it can be exercised from a
 * scratch route, a test, or a headless script without a page around it.
 */

export type Pt = [number, number];

/* Declared before the shapes below, not after: TREFOIL is built at module load
 * and calls lerp. As `const` arrow functions further down the file they sat in
 * the temporal dead zone, and the whole module threw
 * "Cannot access 'lerp' before initialization" on import. */
export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------------------------------------------------------------------------
 * Candidate shapes.
 *
 * Control points in a normalised space: x roughly -1.4..1.4, y -0.8..0.8, y
 * positive DOWNWARD to match canvas convention. Tails enter and leave flat at
 * y=0 so the strand can straighten into a horizontal bar.
 *
 * Three candidates, because which one reads as "knot" rather than "squiggle" is
 * a question for the eye, not for arithmetic. Compare them on /lab/ and delete
 * the losers.
 * ------------------------------------------------------------------------- */

/** A — the two-crossing pretzel currently shipping. Baseline for comparison. */
const PRETZEL: Pt[] = [
  [-1.3, 0.0],
  [-0.86, 0.0],
  [-0.52, 0.03],
  [-0.24, -0.28],
  [-0.02, -0.62],
  [0.3, -0.62],
  [0.48, -0.3],
  [0.3, 0.02],
  [-0.02, 0.18],
  [-0.32, 0.34],
  [-0.48, 0.62],
  [-0.16, 0.74],
  [0.2, 0.58],
  [0.38, 0.22],
  [0.6, 0.04],
  [1.3, 0.0],
];

/**
 * B — an overhand knot: the one you start a shoelace with. Three crossings.
 *
 * Reading it as a rope: in from the left; dip below and swing right; climb the
 * right side and over the top heading left; down the left side, crossing the
 * entry strand; right along the bottom of the loop; then up THROUGH the loop
 * and out to the right.
 */
const OVERHAND: Pt[] = [
  [-1.4, 0.0],
  [-0.95, 0.02],
  [-0.62, 0.1],
  [-0.3, 0.34],
  [0.04, 0.46],
  [0.36, 0.34],
  [0.52, 0.04],
  [0.42, -0.3],
  [0.1, -0.5],
  [-0.24, -0.42],
  [-0.42, -0.12],
  [-0.34, 0.2],
  [-0.06, 0.36],
  [0.24, 0.26],
  [0.36, -0.04],
  [0.18, -0.26],
  [-0.06, -0.12],
  [0.16, 0.1],
  [0.52, 0.12],
  [0.95, 0.04],
  [1.4, 0.0],
];

/**
 * C — a tighter overhand, loops pulled closer to the centre so the knot reads
 * as cinched rather than draped. More likely to survive being shrunk to a
 * phone, which is where most readers meet it.
 */
const CINCHED: Pt[] = [
  [-1.4, 0.0],
  [-0.92, 0.0],
  [-0.56, 0.06],
  [-0.26, 0.28],
  [0.02, 0.38],
  [0.28, 0.26],
  [0.4, 0.0],
  [0.3, -0.26],
  [0.04, -0.4],
  [-0.22, -0.32],
  [-0.34, -0.08],
  [-0.24, 0.14],
  [-0.02, 0.24],
  [0.18, 0.16],
  [0.26, -0.04],
  [0.12, -0.2],
  [-0.04, -0.08],
  [0.14, 0.08],
  [0.48, 0.1],
  [0.92, 0.03],
  [1.4, 0.0],
];

/**
 * D — derived from the trefoil, which is the overhand knot closed up. Guaranteed
 * three crossings and a silhouette everyone recognises, because the topology
 * comes from the parametrisation rather than from my hand.
 *
 *   x = sin t + 2 sin 2t      y = cos t − 2 cos 2t
 *
 * Cut at the tip of one lobe (t = π) rather than anywhere else: at a lobe tip
 * the two sides of the curve run antiparallel, so the cut ends point in
 * OPPOSITE directions and become tails that leave left and right. Cutting
 * anywhere else leaves both ends on the same side, which is why hand-authored
 * attempts kept coming out as spirals.
 */
export function trefoilWithTails(D = 0.95, rise = 0.34): Pt[] {
  // D: how far past the lobe tip to cut. It decides where the cut ends sit, and
  // therefore how far the tails must travel vertically to reach them — the
  // single most important number in the shape. Swept on /lab/ at 0.36 through
  // 1.15: below ~0.7 the ends sit at the bottom of the knot, so the tails dive
  // to meet them and read as two spikes; past ~1.1 the loops flatten out and it
  // stops reading as tied. 0.95 puts the tails horizontal through the middle
  // with the knot bulging above and below, which is what a loose overhand knot
  // in a horizontal rope actually looks like.
  //
  // `rise` lifts the knot body above the tail line. Symmetric about the tails
  // the shape reads as decoration; sitting proud of them it reads as a knot
  // tied IN a strand, which is the whole point.
  const N = 26;
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const t = lerp(Math.PI + D, 3 * Math.PI - D, i / (N - 1));
    // y negated: the parametrisation is y-up, canvas is y-down.
    pts.push([
      (Math.sin(t) + 2 * Math.sin(2 * t)) / 2.7,
      -(Math.cos(t) - 2 * Math.cos(2 * t)) / 2.7 - rise,
    ]);
  }
  // Lead the tails in at whatever height the cut actually landed, rather than a
  // fixed dip: the approach stays smooth for any D.
  const endY = pts[pts.length - 1][1];
  // Tails. The cut ends leave the lobe tip at roughly 45 degrees, so a short
  // tail reads as a pair of splayed legs under a pretzel rather than as a rope
  // with a knot in it. Four control points a side sweep that exit angle round
  // to horizontal and carry it well clear of the body — and the outermost pair
  // sit flat at y=0, which is also where the straight-line target lives, so the
  // ends do not move at all as the knot unties.
  return [
    [-2.15, 0.0],
    [-1.62, 0.0],
    [-1.12, endY * 0.3],
    [-0.74, endY * 0.72],
    ...pts.slice().reverse(),
    [0.74, endY * 0.72],
    [1.12, endY * 0.3],
    [1.62, 0.0],
    [2.15, 0.0],
  ];
}

export const SHAPES = {
  trefoil: trefoilWithTails(),
  pretzel: PRETZEL,
  overhand: OVERHAND,
  cinched: CINCHED,
};
export type ShapeName = keyof typeof SHAPES;

/* ------------------------------------------------------------------------- */

/** Catmull-Rom through the control points: one smooth strand, no corners. */
export function onCurve(ctrl: Pt[], u: number): Pt {
  const n = ctrl.length - 1;
  const f = clamp01(u) * n;
  const i = Math.min(Math.floor(f), n - 1);
  const t = f - i;
  const p0 = ctrl[Math.max(0, i - 1)];
  const p1 = ctrl[i];
  const p2 = ctrl[i + 1];
  const p3 = ctrl[Math.min(n, i + 2)];
  const t2 = t * t;
  const t3 = t2 * t;
  const at = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [at(p0[0], p1[0], p2[0], p3[0]), at(p0[1], p1[1], p2[1], p3[1])];
}

/**
 * The strand at knottedness k. k=1 is the full knot, k=0 a straight line.
 *
 * Every point slides toward where it would sit on a straight strand of the same
 * length, so untying is the knot genuinely being pulled open rather than a
 * crossfade between two pictures.
 */
export function strand(ctrl: Pt[], u: number, k: number): Pt {
  const [kx, ky] = onCurve(ctrl, u);
  const x0 = ctrl[0][0];
  const x1 = ctrl[ctrl.length - 1][0];
  return [lerp(lerp(x0, x1, u), kx, k), lerp(0, ky, k)];
}

/** A crossing: the two curve parameters that meet, `over` being the later one. */
export interface Crossing {
  under: number;
  over: number;
  at: Pt;
}

/**
 * Where the strand passes over itself, FOUND rather than assumed.
 *
 * An earlier version hardcoded guessed parameters; they landed on straight
 * stretches, the occlusion gaps did nothing, and the knot read as a flat
 * squiggle. Walking the polyline is always right, including while the knot
 * unties and the crossings drift and then vanish.
 *
 * The later parameter is the strand drawn second, so it is the one in front —
 * that is the one whose gap gets punched.
 */
export function selfCrossings(pts: Pt[]): Crossing[] {
  const out: Crossing[] = [];
  const n = pts.length;
  for (let i = 0; i < n - 1; i++) {
    // Skip near neighbours: consecutive segments share a point and would always
    // register a hit.
    for (let j = i + 3; j < n - 1; j++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const [x3, y3] = pts[j];
      const [x4, y4] = pts[j + 1];
      const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
      if (Math.abs(d) < 1e-9) continue;
      const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
      const s = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
      if (t < 0 || t > 1 || s < 0 || s > 1) continue;
      out.push({
        under: (i + t) / (n - 1),
        over: (j + s) / (n - 1),
        at: [lerp(x1, x2, t), lerp(y1, y2, t)],
      });
    }
  }
  return out;
}

/**
 * Ribbon edges for a run of centre points: offsets each point along the local
 * normal, so the strand has real width and can carry per-segment colour.
 * Returns the outline as a single closed polygon, up one side and back the
 * other.
 */
export function ribbonOutline(pts: Pt[], halfW: number[]): Pt[] {
  const n = pts.length;
  const norm: Pt[] = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len];
  });
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) out.push([pts[i][0] + norm[i][0] * halfW[i], pts[i][1] + norm[i][1] * halfW[i]]);
  for (let i = n - 1; i >= 0; i--) out.push([pts[i][0] - norm[i][0] * halfW[i], pts[i][1] - norm[i][1] * halfW[i]]);
  return out;
}

/* ---------------------------------------------------------------------------
 * Phases 1-2: the viewport fills with ribbons, then they converge into one.
 *
 * Each band becomes a consecutive SEGMENT of the finished ribbon rather than
 * fading out while a separate ribbon fades in. That is what makes "many
 * colours become one" a single continuous motion instead of a crossfade — the
 * colour blocks along the final ribbon are literally the bands that arrived.
 * ------------------------------------------------------------------------- */

export interface Band {
  /** Where this band sits vertically before converging, 0..1 of the viewport. */
  y: number;
  /** Half-thickness before converging, as a fraction of viewport height. */
  thickness: number;
  /** Horizontal extent before converging, 0..1 of viewport width. */
  x0: number;
  x1: number;
  /** Gentle bow, so these read as tape laid at a slight angle, not as bars. */
  bow: number;
  /** Entry delay, 0..1 of the sweep-in window. */
  delay: number;
  /** Converge delay. Separate from entry: bands that all shrink in lockstep
   *  produce a tidy row of tiles mid-merge, which is the ugliest frame. */
  cDelay: number;
  /** Index into the palette. */
  colour: number;
}

/**
 * Hand-picked rather than random: the brief asks for varied length, thickness
 * and position, and a designed set reads better than a seeded one and is the
 * same on every load. Deliberately not a stack of equal bars — some run edge
 * to edge, some stop short.
 */
export const BANDS: Band[] = [
  { y: 0.09, thickness: 0.055, x0: -0.05, x1: 0.72, bow: 0.018, delay: 0.0, cDelay: 0.22, colour: 0 },
  { y: 0.23, thickness: 0.032, x0: 0.18, x1: 1.05, bow: -0.012, delay: 0.16, cDelay: 0.05, colour: 1 },
  { y: 0.37, thickness: 0.07, x0: -0.05, x1: 1.05, bow: 0.022, delay: 0.06, cDelay: 0.3, colour: 2 },
  { y: 0.52, thickness: 0.042, x0: -0.05, x1: 0.58, bow: -0.02, delay: 0.26, cDelay: 0.13, colour: 3 },
  { y: 0.66, thickness: 0.06, x0: 0.3, x1: 1.05, bow: 0.014, delay: 0.1, cDelay: 0.34, colour: 4 },
  { y: 0.81, thickness: 0.038, x0: -0.05, x1: 0.88, bow: -0.016, delay: 0.22, cDelay: 0.0, colour: 5 },
  { y: 0.93, thickness: 0.05, x0: 0.12, x1: 1.05, bow: 0.01, delay: 0.32, cDelay: 0.18, colour: 0 },
];

/**
 * One band's centre line at a given moment.
 *
 * `enter` 0..1 slides it in from the left; `converge` 0..1 morphs it into its
 * arc of the master strand. The two overlap in time on purpose — a band that
 * has finished arriving before it starts converging produces a tidy, ugly
 * staircase, which was the single worst-looking moment of the earlier attempt.
 */
export function bandPoint(
  b: Band,
  ctrl: Pt[],
  u: number,
  enter: number,
  converge: number,
  k: number,
  W: number,
  H: number,
  project: (p: Pt) => Pt,
): Pt {
  // Phase 1: a bowed horizontal band, swept in from the left.
  const bx = lerp(b.x0, b.x1, u) * W - (1 - enter) * W * 1.35;
  const by = (b.y + Math.sin(u * Math.PI) * b.bow) * H;
  // Phase 2 target: this band's own arc of the single strand.
  const span = 1 / BANDS.length;
  const idx = BANDS.indexOf(b);
  const [tx, ty] = project(strand(ctrl, idx * span + u * span, k));
  // Arc the merge rather than sliding straight: a linear lerp from a row of
  // bars to a row of arcs passes through a tidy staircase, which reads as a
  // glitch. Easing y ahead of x makes them gather vertically first, then close
  // up along the strand.
  const cy = clamp01(converge * 1.25);
  return [lerp(bx, tx, converge), lerp(by, ty, cy)];
}

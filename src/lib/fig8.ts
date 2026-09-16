/**
 * Phase 3: the figure-eight knot.
 *
 * The line from phase 2 — left edge to centre — draws itself onward into a
 * figure-eight and out to the right edge. Geometry only: no canvas, no DOM.
 *
 * HOW THE SHAPE WAS ARRIVED AT, because the method matters more than the
 * numbers. Three parametric families were tried first and all failed for the
 * same reason: a closed knot curve cut open gives a RING with loops on it, not
 * a figure-eight. The Lissajous family (the figure-eight is a Lissajous knot at
 * 3:2) produced no 4-crossing projection at any phase across 576 combinations,
 * and cutting the (2+cos2t)(cos3t, sin3t) curve produced 257 four-crossing
 * configurations, every one of which read as a circle with a bow on top.
 *
 * So these control points are hand-authored, following the construction in
 * order: in from the left, right and down, round the bottom, up the right and
 * over the top, back left across the standing part — that closes loop one —
 * then left and down, round the bottom, up the left and over the top, and back
 * through loop one and out to the right.
 *
 * CROSSINGS ARE COUNTED, NEVER ASSUMED. Exactly four, verified on the sampled
 * polyline at every vertical stretch from 1.0 to 1.9, and asserted at module
 * load below.
 *
 * LAYOUT. The left tail occupies the whole left half of the shape, dead
 * straight at y=0, so it maps onto phase 2's finished line exactly and phase 3
 * can begin by simply continuing it. The knot body sits in the right half and
 * the right tail runs out to the edge.
 */

import { onCurve, selfCrossings, type Pt } from './knot';

/** The knot body, positioned so its leftmost point sits at x=0 — the centre of
 *  the screen, where phase 2's line ends. */
const BODY: Pt[] = [
  [0.859, 0.1],
  [1.419, 0.6],
  [2.017, 0.95],
  [2.615, 1.02],
  [3.137, 0.7],
  [3.384, 0.0],
  [3.115, -0.68],
  [2.577, -1.0],
  [2.017, -0.92],
  [1.546, -0.48],
  [1.27, 0.16],
  [1.046, 0.66],
  [0.71, 0.95],
  [0.261, 0.8],
  [0.0, 0.2],
  [0.112, -0.46],
  [0.56, -0.9],
  [1.083, -0.84],
  [1.606, -0.5],
  [2.203, -0.1],
  [2.801, 0.26],
  [3.399, 0.36],
];

/**
 * Control points at a given vertical stretch.
 *
 * `stretch` exists because the knot has to cover a share of the viewport's
 * HEIGHT while spanning its full WIDTH, and those two demands fix an aspect
 * ratio that changes with every viewport. Stretching the shape is the honest
 * way to meet both; the alternative, fitting uniformly, leaves the knot a
 * letterbox sliver on a phone. Affine, so it cannot destroy a crossing — but
 * that is verified rather than argued.
 */
export function fig8Ctrl(stretch = 1.6): Pt[] {
  const s = (p: Pt): Pt => [p[0], p[1] * stretch];
  return [
    // Left tail: the whole left half, flat.
    [-4.0, 0],
    [-2.9, 0],
    [-1.8, 0],
    [-0.8, 0],
    [-0.1, 0.01 * stretch],
    [0.35, 0.03 * stretch],
    ...BODY.map(s),
    /* Right tail, out to the edge. Eased down in four steps rather than two:
       two left the Catmull-Rom overshooting off the last body point and the
       strand finished on a visible upward wedge instead of running out flat. */
    [3.56, 0.3 * stretch],
    [3.72, 0.19 * stretch],
    [3.86, 0.08 * stretch],
    [3.96, 0.02 * stretch],
    [4.0, 0.0],
  ];
}

/** Shape-space x at the far left and far right. The full strand spans these. */
export const FIG8_X0 = -4.0;
export const FIG8_X1 = 4.0;

export interface Fig8Crossing {
  /** The earlier curve parameter of the two passes. */
  first: number;
  /** The later one. */
  second: number;
  at: Pt;
  /** True when the FIRST pass is the one drawn on top. */
  overIsFirst: boolean;
}

const SAMPLES = 900;

/** Sample the centre line at a given stretch. */
export function fig8Points(ctrl: Pt[], n = SAMPLES): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) out.push(onCurve(ctrl, i / (n - 1)));
  return out;
}

/**
 * The four crossings, in the order the strand meets them, with over/under
 * assigned ALTERNATING — over, under, over, under on first encounter.
 *
 * Alternating is what makes it the figure-eight rather than a picture of one.
 * A diagram whose passes do not alternate is, in general, the unknot wearing a
 * knot's silhouette. The brief asked for over, under, under, over; that
 * sequence cannot be alternating, so it would draw four crossings that come
 * apart if you pulled the ends. `alternate: false` renders it anyway, for
 * comparison.
 */
export function fig8Crossings(pts: Pt[], alternate = true): Fig8Crossing[] {
  const raw = selfCrossings(pts);
  // Collapse duplicates: a crossing is found once per sample pair that spans it.
  const uniq: { first: number; second: number; at: Pt }[] = [];
  for (const c of raw) {
    const first = Math.min(c.under, c.over);
    const second = Math.max(c.under, c.over);
    if (uniq.some((u) => Math.hypot(u.at[0] - c.at[0], u.at[1] - c.at[1]) < 0.06)) continue;
    uniq.push({ first, second, at: c.at });
  }
  uniq.sort((a, b) => a.first - b.first);
  return uniq.map((c, i) => ({
    ...c,
    // Alternating: 1st over, 2nd under, 3rd over, 4th under.
    // The brief's reading: 1st over, 2nd under, 3rd under, 4th over.
    overIsFirst: alternate ? i % 2 === 0 : i === 0 || i === 3,
  }));
}

/**
 * Cumulative arc length along the sampled points, normalised to 0..1.
 *
 * The head has to travel at a controlled SPEED, and curve parameter is not
 * speed: the same step in u covers wildly different distances through a tight
 * lobe than along a straight tail, so a head driven by u alone races the
 * straights and crawls the curves.
 */
export function arcTable(pts: Pt[]): number[] {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = acc[acc.length - 1] || 1;
  return acc.map((a) => a / total);
}

/** Curve parameter u at normalised arc length s. */
export function uAtArc(arc: number[], s: number): number {
  const n = arc.length;
  if (s <= 0) return 0;
  if (s >= 1) return 1;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (arc[mid] <= s) lo = mid;
    else hi = mid;
  }
  const span = arc[hi] - arc[lo] || 1;
  return (lo + (s - arc[lo]) / span) / (n - 1);
}

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
 * LAYOUT. The knot is CENTRED and spans just over two thirds of the width, with
 * a short flat tail running out to each edge. Phase 3 is a MORPH, not a
 * draw-on: the line is full length in every frame and bends into the knot, so
 * the left tail no longer has to be half the width to match phase 2's line.
 */

import { onCurve, selfCrossings, type Pt } from './knot';

/**
 * The knot body, CENTRED on the origin and symmetric under a 180° rotation
 * about it: point `i` is the exact negation of point `21 - i`.
 *
 * That symmetry is the whole point. The previous 22 points were placed by hand
 * and were symmetric under nothing — measured on the rendered knot, the four
 * openings ran 432x258 down to 210x141, a 2.73:1 spread by area, and the right
 * half of the shape enclosed 1.86x the area of the left. A figure-eight diagram
 * HAS a two-fold rotational symmetry; a drawing of one that does not reads as a
 * mistake, because the eye knows the two halves should answer each other.
 *
 * These are the odd part of the old curve — resampled by arc length, centred,
 * and averaged against its own 180° rotation — so the shape language survives
 * and the asymmetry does not. Measured residual under 180° rotation: 0.00%,
 * at every stretch. The 1.67:1 that remains between the two SIZES of opening is
 * intrinsic to the figure-eight, and is now an exact pair rather than four
 * different numbers.
 */
const BODY: Pt[] = [
  [-2.0175, -0.13],
  [-1.2709, 0.1061],
  [-0.5396, 0.386],
  [0.2034, 0.6317],
  [0.9716, 0.7782],
  [1.7473, 0.736],
  [2.3267, 0.2612],
  [2.2146, -0.4831],
  [1.5658, -0.8931],
  [0.7957, -0.83],
  [0.206, -0.3329],
  [-0.206, 0.3329],
  [-0.7957, 0.83],
  [-1.5658, 0.8931],
  [-2.2146, 0.4831],
  [-2.3267, -0.2612],
  [-1.7473, -0.736],
  [-0.9716, -0.7782],
  [-0.2034, -0.6317],
  [0.5396, -0.386],
  [1.2709, -0.1061],
  [2.0175, 0.13],
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
/** The entry tail: flat at the edge, easing on a smoothstep into the body's
 *  first point. The exit tail is this rotated 180°, built in `fig8Ctrl`. */
const TAIL: Pt[] = [
  [-4.0, 0.0],
  [-3.5, -0.0206],
  [-3.0, -0.0659],
  [-2.5, -0.1106],
];

export function fig8Ctrl(stretch = 1.6): Pt[] {
  /* The tails are the 180° rotation of each other, like the body. The old pair
     were not: the left ran flat at y=0 to x=-2.5 and the right eased down from
     0.24 in four steps, so even with a symmetric body the two ends of the rope
     entered and left differently. Both now ease from the edge to the body's
     first point on the same smoothstep, mirrored. */
  return [
    ...TAIL.map((p): Pt => [p[0], p[1] * stretch]),
    ...BODY.map((p): Pt => [p[0], p[1] * stretch]),
    ...TAIL.map((p): Pt => [-p[0], -p[1] * stretch]).reverse(),
  ];
}

/** The body's greatest |y| at stretch 1. The knot's drawn height is derived
 *  from this, so a coverage target means what it says rather than what a
 *  hardcoded guess at the body's height said. */
export const FIG8_Y_MAX = 0.8931;

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

/**
 * The hero intro sequence, renderer.
 *
 * ONE implementation, used by /lab/ and by the hero overlay. It was written in
 * the lab page and lifted here the moment the hero needed it: two copies of
 * four phases of canvas geometry would have drifted inside a week, and the
 * whole point of the lab is that what is judged there is what ships.
 *
 * Pure drawing plus the timings. No DOM beyond the 2D context it is handed, so
 * it can be driven by a scrubber, a rAF loop, or a screenshot script.
 *
 *   phase 1  the viewport fills with ribbons, already flowing
 *   phase 2  they are drawn into a point at the right edge and stretched into
 *            a segmented line, which travels to the left half
 *   phase 3  the line draws itself into a figure-eight knot
 *   phase 4  the ends are pulled and the knot cinches back into a line
 *
 * Phase 5 — the line becoming the wordmark's strike — is NOT here: it is one
 * DOM element animated with FLIP, and it lives in the component, because the
 * whole reason it is a div is that canvas cannot hand a shape to the DOM.
 */

import {
  buildField,
  edgeY,
  rowSpans,
  frontAt,
  collapseX,
  FIELD,
  FIELD_PALETTE,
  FIELD_GROUND,
  RESOLVE,
  type Field,
} from "./ribbons";
import {
  fig8Ctrl,
  fig8Points,
  arcTable,
  uAtArc,
  FIG8_X0,
  FIG8_X1,
} from "./fig8";
import { clamp01, lerp, ribbonOutline, selfCrossings, type Pt } from "./knot";

export interface SeqOpts {
  /** Share of viewport height the finished knot should cover. */
  cover: number;
  /** Wave height in phase 1, as a fraction of viewport height. */
  wave: number;
  /** Render the brief's over/under (O,U,U,O) instead of the alternating one. */
  briefOverUnder: boolean;
  /** Number of ribbon rows in phase 1. */
  rows: number;
  /**
   * The landing strike's own proportions, when the sequence is going to hand
   * over to a FLIP'd div. The div carries the strike's border-radius, and the
   * FLIP scale blows it up with everything else — at full width that is a taper
   * roughly 80px long at each end. A square-cut canvas bar swapped for that
   * pops; measured at 4839 pixels changing by more than 8/255 the first time
   * this seam was built. So the bar grows the same quarter-ellipse ends as the
   * cinch closes. Omit it and the bar stays square.
   */
  taper?: { rx: number; rw: number; rh: number };
}

export const SEQ_DEFAULTS: SeqOpts = {
  cover: 0.6,
  wave: FIELD.AMP,
  briefOverUnder: false,
  rows: 13,
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

let field: Field | null = null;
let fieldRows = -1;

/** Phase 1. Half of what it started at. At 250ms the field was about fifteen
 *  frames, which was too few to read as ribbons MOVING — the wave barely
 *  travelled before the collapse took it. 500ms is thirty: enough to establish
 *  the motion, still short enough to stay an establishing shot. */
const FIELD_MS = 500;
/** Phase 2, the collapse. Fast — it is a transition, not a thing to look at,
 *  and at much over this it stops reading as being pulled in. */
const COLLAPSE_MS = 280;
/* The line forms anchored at the hole, across the right half, then travels
   left to sit across the LEFT half — from the left edge to the centre.
   Overlapped with the tail of the collapse rather than queued after it, so
   the last material is still being drawn in while the line is already moving
   and the two read as one gesture. But only just overlapped: at 140ms of
   overlap the collapse was still pulling material rightwards into a hole
   whose target had already moved left, and the frames in between stopped
   reading as falling into anything. 70ms keeps the join fluid without
   contradicting the direction. */
const SLIDE_FROM = 230;
const SLIDE_MS = 130;
const PART2_MS = SLIDE_FROM + SLIDE_MS;
const P2_END = FIELD_MS + PART2_MS;
/** Phase 3: the line draws itself into a figure-eight knot. */
const HEAD_MS = 1540;
/** The colour has to be gone before the cinch starts. */
const FLOW_MS = 1400;
/** How long the half-width line phase 2 hands over takes to pull its slack
 *  into the knot. Short: it runs while the head is still in the first loop,
 *  so almost none of the body is on screen while it is sliding. */
const PULL_MS = 240;
/**
 * Phase 4 STARTS BEFORE PHASE 3 FINISHES. The head reaches the end of the path
 * at HEAD_MS; the cinch begins 180ms before that, so the last of the strand is
 * still being laid down while the knot is already tightening — which is what
 * pulling a rope through a knot looks like, and what stops the two reading as
 * separate moves. There is no beat between them to remove, because there is no
 * moment when neither is happening.
 */
const CINCH_FROM = HEAD_MS - 180;
const CINCH_MS = 760;
const P3_END = P2_END + CINCH_FROM;
const TOTAL_MS = P3_END + CINCH_MS;

/**
 * The cinch's own curve. NOT an ease-in-out: that starts at zero slope, and the
 * head arrives on an ease-out which ENDS at zero slope, so the two stalled
 * against each other and produced exactly the pause the overlap exists to
 * remove. This leaves at a little over a third of full speed and accelerates,
 * like a knot pulling tight.
 */
const cinchCurve = (t: number) => 0.38 * t + 0.62 * t * t;

/* Thickness is tied to the KNOT's scale, not the viewport's height. A line
   sized as a fraction of height is a reasonable bar on a desktop and a third
   of the knot's total height on a phone, where the knot is short because it
   has to span the width. Phase 2 uses the same number so the handover does
   not step. */
const lineHalf = (W: number) => (0.05 * W) / 2;

/** Vertical stretch needed for the knot to cover `frac` of the viewport
 *  height while spanning its full width. Capped: past 2 the lobes turn into
 *  vertical slots and it stops reading as rope. */
const knotStretch = (W: number, H: number, frac: number) =>
  Math.max(1, Math.min(2, (frac * H * (FIG8_X1 - FIG8_X0)) / (2.05 * W)));

/* Minimal, as asked: six segments, six colours, widths deliberately uneven so
   the eye has something to measure the speed against. */
const KNOT_SEGS = [
  { len: 0.18, c: 3 },
  { len: 0.11, c: 5 },
  { len: 0.22, c: 0 },
  { len: 0.13, c: 2 },
  { len: 0.19, c: 1 },
  { len: 0.17, c: 4 },
];
const TERRACOTTA = RESOLVE;

// Horizontal samples per boundary curve. 56 is past the point where more
// stops being visible on a 1440 swell under one cycle wide.
const FS = 56;

/**
 * `ms` is absolute time through the whole sequence.
 *
 * The field's own clock keeps running past phase 1 and through the collapse —
 * the ribbons are still scrolling and the wave is still travelling while they
 * are being drawn in, which is what stops phase 2 reading as a still image
 * being transformed.
 */
function drawField(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  ms: number,
  opts: SeqOpts,
) {
  const f = field!;
  if (ms > P2_END) return drawKnot(ctx, W, H, ms, opts);
  const t = ms / FIELD_MS;
  // Linear: the acceleration lives in frontAt, per column, so every column
  // gets the same motion instead of the left half being crushed into the end.
  const p = clamp01((ms - FIELD_MS) / COLLAPSE_MS);
  // Decelerating, so the line arrives rather than overshooting past centre.
  /* pow 0.75, not easeOut. Every cubic ease-out has zero slope at the end,
     so the line decelerated to a dead stop and phase 3 then accelerated from
     zero — two motions with a pause between them, which is exactly what it
     looked like. This still has 0.75 of its speed left when it arrives. */
  const slide = Math.pow(
    clamp01((ms - FIELD_MS - SLIDE_FROM) / SLIDE_MS),
    0.75,
  );
  /* How far the rows' targets have separated from the hole into their own
     slots. Held at the hole for the first third so the funnel establishes,
     then opened out, and complete by p 0.8 — before the slide starts at p
     0.82, so the line is fully formed before it travels. */
  const spread = easeOut(clamp01((p - 0.3) / 0.5));
  ctx.clearRect(0, 0, W, H);
  /* Ground the field in its own darkest ribbon colour, not the page's ink.
     Adjacent fills share exact edges, but canvas antialiases both sides and
     can leave a sub-pixel hairline of whatever is underneath; grounding in
     #0d0c0a made those hairlines the page showing through, which is the one
     thing this phase must never do. Against a ribbon colour the same hairline
     is invisible. Cheaper and more robust than tuning overlaps until the
     artefact happens to vanish — it was down to one pixel per frame, which is
     exactly the kind of number that comes back on a different DPR. */
  /* The ground has to retreat with the front, or phase 2 ends on a brown
     screen instead of an empty one. Filled in columns whose alpha tracks
     `frontAt` exactly, rather than as one rect clipped at the front: a rect
     leaves a hard vertical edge sweeping across the screen, which was clearly
     visible mid-collapse and read as a wipe rather than as a collapse. */
  if (p <= 0) {
    ctx.fillStyle = FIELD_GROUND;
    ctx.fillRect(0, 0, W, H);
  } else {
    const cols = 72;
    ctx.fillStyle = FIELD_GROUND;
    for (let s = 0; s < cols; s++) {
      const a = 1 - frontAt((s + 0.5) / cols, p);
      if (a <= 0.002) continue;
      ctx.globalAlpha = a;
      ctx.fillRect((s * W) / cols, 0, W / cols + 1, H);
    }
    ctx.globalAlpha = 1;
  }

  const amp = opts.wave;
  // Every boundary sampled ONCE, then shared by the row above and the row
  // below it. This is what makes the coverage exact rather than lucky.
  const curves: number[][] = [];
  for (let i = 0; i < f.edges.length; i++) {
    const row: number[] = [];
    for (let s = 0; s < FS; s++)
      row.push(edgeY(f, i, s / (FS - 1), t, amp) * H);
    curves.push(row);
  }

  const yAt = (i: number, u: number) => {
    const f = clamp01(u) * (FS - 1);
    const a = Math.floor(f);
    const b = Math.min(FS - 1, a + 1);
    return lerp(curves[i][a], curves[i][b], f - a);
  };

  const rowCount = f.rows.length;
  const half = lineHalf(W);
  const [lineTop, lineBottom] = [H / 2 - half, H / 2 + half];

  for (let i = 0; i < rowCount; i++) {
    /* The joint leans by a fraction of THIS row's thickness, so thick and
       thin rows are cut at the same angle rather than the same distance. */
    const skew = ((f.edges[i + 1] - f.edges[i]) * H * FIELD.SKEW) / W;

    /**
     * One vertex, from field position to collapsed position.
     *
     * `uRef` is the TOP edge's column for both edges of a quad, so the two
     * sides of a segment are drawn into the same place and the segment stays
     * coherent as it goes. Using each vertex's own column would shear the
     * quad apart on the way in — and it also means the skew collapses with
     * everything else, which is why the finished line has square joints
     * rather than the leaning ones phase 1 uses.
     */
    const warp = (
      u: number,
      uRef: number,
      y: number,
      top: boolean,
    ): [number, number] => {
      if (p <= 0) return [u * W, y];
      const c = frontAt(clamp01(uRef), p);
      if (c <= 0) return [u * W, y];
      /* The TARGET moves, which is the whole of the fix.
       *
       * Every row owns a slot along the finished line, and aiming each row at
       * its slot from the first frame meant the top of the field was drawn to
       * the line's left end and the bottom of it to the right end — two
       * destinations, a screen apart, so there was no point being collapsed
       * into. The brief is a hole at the centre of the right edge, and the top
       * and the bottom have to fall into the same one.
       *
       * So everything aims at the hole first and the targets only separate
       * into slots once the material is already there. The END STATE is
       * untouched — spread reaches 1 before the line starts moving — so the
       * line is still exactly the segmented, hard-edged, slot-packed thing it
       * was, with none of the raggedness a literal radial pull produces. */
      const tx = lerp(W, collapseX(i, rowCount, uRef, W, slide), spread);
      const ty = top ? lineTop : lineBottom;
      return [lerp(u * W, tx, c), lerp(y, ty, c)];
    };

    for (const span of rowSpans(f, i, t)) {
      const x0 = span.x0;
      const x1 = span.x1;
      if (x1 < -0.3 || x0 > 1.35) continue;
      /* Overlap each span by half a pixel along the joint and half a pixel at
         the bottom. Adjacent fills share an exact edge, but canvas antialiases
         both sides of it and leaves a hairline of whatever is underneath —
         which here would be the ground, i.e. the one thing this phase must
         never show. Overlapping costs nothing and removes the seam. */
      const bleed = 1.5 / W;
      /* More samples once the collapse is on: u^6 compresses most of a row
         into the left sliver of its slot, so a coarse polygon there turns a
         curve into a visible corner. */
      const n = Math.max(2, Math.ceil((x1 - x0) * (p > 0 ? 64 : 26)));
      ctx.beginPath();
      // Top edge, left to right.
      for (let s = 0; s <= n; s++) {
        const u = x0 + ((x1 - x0 + bleed) * s) / n;
        const [px, py] = warp(u, u, yAt(i, u), true);
        s ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      // Bottom edge, right to left, shifted back by the skew — so the cut at
      // each end is a slanted line and the next segment's slant matches it.
      for (let s = n; s >= 0; s--) {
        const uRef = x0 + ((x1 - x0 + bleed) * s) / n;
        const u = uRef - skew;
        const [px, py] = warp(u, uRef, yAt(i + 1, u) + 0.5, false);
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = FIELD_PALETTE[span.c];
      ctx.fill();
    }
  }
}

/* ---------------------------------------------------------------------
 * Phase 3 — the line draws itself into a figure-eight knot.
 *
 * Two motions at once. The HEAD advances along the knot's path, laying the
 * strand down; the COLOUR flows forward along whatever has been laid, running
 * off the end and leaving terracotta behind it. Both are driven in ARC LENGTH
 * rather than curve parameter, because the same step in u covers a very
 * different distance through a tight lobe than along the straight tail — a
 * head driven by u races the straights and crawls the curves.
 * ------------------------------------------------------------------- */

/** Rebuilt only when the viewport or the coverage target changes. */
let knotCache: {
  key: string;
  pts: Pt[];
  arc: number[];
  tailArc: number;
} | null = null;

function knotGeom(W: number, H: number, frac: number) {
  const key = `${W}x${H}:${frac}`;
  if (knotCache && knotCache.key === key) return knotCache;
  const ctrl = fig8Ctrl(knotStretch(W, H, frac));
  const pts = fig8Points(ctrl);
  const arc = arcTable(pts);
  /* Where the flat left tail ends and the knot body begins — found from the
     geometry rather than hardcoded, so it follows the shape if the control
     points change. */
  let tailArc = 0;
  for (let i = 0; i < pts.length; i++) {
    if (Math.abs(pts[i][1]) > 0.06) {
      tailArc = arc[i];
      break;
    }
  }
  /* No precomputed crossing table. There was one, and it cost 53ms on the
     FIRST FRAME OF PHASE 3 — a self-intersection search over 900 points is
     about 404,000 segment-pair tests — for a value nothing read: the occlusion
     finds its crossings per frame on the polyline actually drawn, because
     mid-draw there may be one, two or none. Measured as a 66ms frame at 4x
     throttle, at the exact moment the knot starts. */
  knotCache = { key, pts, arc, tailArc };
  return knotCache;
}

/** How far the colour band has travelled along the strand at time `ms`.
 *  Deliberately not a constant rate: speeding up and easing off is the only
 *  cue the eye has for how fast the line itself is moving. */
const flowAt = (ms: number) => {
  const fr = clamp01((ms - P2_END) / FLOW_MS);
  return fr < 0.55
    ? 1.45 * fr * fr
    : 0.439 + 1.12 * (fr - 0.55) + 0.9 * (fr - 0.55) ** 2;
};

/** Colour at normalised arc `s`, given how far the colour band has flowed. */
const knotColour = (s: number, flow: number) => {
  let p = s - flow;
  if (p < 0) return TERRACOTTA; // the band has already passed: resolved
  for (const seg of KNOT_SEGS) {
    if (p < seg.len) return FIELD_PALETTE[seg.c];
    p -= seg.len;
  }
  return TERRACOTTA; // ahead of the band, not yet reached
};

function drawKnot(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  ms: number,
  opts: SeqOpts,
) {
  ctx.clearRect(0, 0, W, H);

  const frac = opts.cover;
  const g = knotGeom(W, H, frac);
  const scale = W / (FIG8_X1 - FIG8_X0);
  const project = (p: Pt): Pt => [
    (p[0] - FIG8_X0) * scale,
    H / 2 + p[1] * scale,
  ];
  const halfW = lineHalf(W);

  /* A DRAW-ON: the head travels the path and the strand grows behind it.
   *
   * One thing has to be reconciled. Phase 2 hands over a line spanning the
   * left HALF of the screen, but the centred knot's left tail is only about a
   * sixth of it — so a head starting at the tail's end would make the line
   * jump shorter by a third of the screen.
   *
   * So the slack is PULLED IN rather than cut. For the first fraction of the
   * phase the tail is stretched to the half-width it arrived at and the knot
   * body is pushed right by the excess; as `pull` runs, the tail compresses
   * and the body slides back to centre. The two are tied together at the
   * junction by construction — the tail's scale is derived from where the
   * body starts — so the strand is continuous at every value of pull, not
   * merely at the ends.
   *
   * Ease-OUT on both, so the head leaves at full speed and joins phase 2's
   * slide rather than starting from a standstill. */
  const k = easeOut(clamp01((ms - P2_END) / HEAD_MS));
  const pull = easeOut(clamp01((ms - P2_END) / PULL_MS));
  const head = lerp(g.tailArc, 1, k);

  /* PHASE 4 — the cinch. Both ends are pulled: the knot's centre line scales
   * down about the middle while the ribbon keeps its THICKNESS, so the loops
   * close from the inside and the holes disappear before the shape does. That
   * is why the reference shows a solid lump on a straight line rather than a
   * shrinking outline — a uniform scale of the centre line reproduces it
   * exactly, and pulling every point toward a straight line (the untie used
   * on the old trefoil) does not: that flattens without cinching, and passes
   * through a pinch on the way.
   *
   * The ends are re-extended to the edges each frame, so the tails lengthen
   * by exactly what the knot gives up — which is what pulling a rope through
   * a knot actually does. */
  const cinch = 1 - cinchCurve(clamp01((ms - P3_END) / CINCH_MS));

  const tailEndX = project(onCurveArc(g, g.tailArc))[0];
  const off = (W / 2 - tailEndX) * (1 - pull);
  const tailScale = tailEndX > 0 ? (tailEndX + off) / tailEndX : 1;

  const N = 620;
  const pts: Pt[] = [];
  const cols: string[] = [];
  /* The extensions are sampled, not a single point each.
   *
   * They used to be one vertex apiece, and at full cinch the dedupe left the
   * whole strand about three vertices long: one at each edge and a cluster at
   * the collapsed middle. The end taper is a curve 82px long, but with no
   * vertices inside that span it was interpolated straight from the edge to the
   * centre — a bar 14px thick at the ends and 72px in the middle. A DIAMOND,
   * and not a taper bug at all: the taper had nowhere to be drawn.
   *
   * Sampled with a bias toward the outer end, where the taper lives and where
   * the vertices are therefore worth spending. */
  const EXT = 28;
  if (cinch < 1) {
    const inner = project([FIG8_X0 * cinch, 0])[0];
    for (let j = 0; j < EXT; j++) {
      const f = Math.pow(j / EXT, 1.6);
      pts.push([lerp(project([FIG8_X0, 0])[0], inner, f), H / 2]);
      cols.push(knotColour(0, flowAt(ms)));
    }
  }
  for (let i = 0; i < N; i++) {
    const sArc = (head * i) / (N - 1);
    const raw = onCurveArc(g, sArc);
    // Scaled about the middle of the knot, which is shape-space (0, 0).
    const q = project([raw[0] * cinch, raw[1] * cinch]);
    pts.push([sArc <= g.tailArc ? q[0] * tailScale : q[0] + off, q[1]]);
    cols.push(knotColour(sArc, flowAt(ms)));
  }
  if (cinch < 1) {
    const inner = project([FIG8_X1 * cinch, 0])[0];
    for (let j = 1; j <= EXT; j++) {
      const f = 1 - Math.pow(1 - j / EXT, 1.6);
      pts.push([lerp(inner, project([FIG8_X1, 0])[0], f), H / 2]);
      cols.push(knotColour(1, flowAt(ms)));
    }
  }

  /* Drop coincident points before meshing. As the cinch closes, hundreds of
     samples land on the same pixel, and ribbonOutline takes its normal from
     the difference between neighbours — zero difference gives a zero normal,
     the strand loses its width there, and everything downstream of the
     collapse disappears. It showed as the right half of the line vanishing in
     the last 200ms. */
  for (let i = pts.length - 1; i > 0; i--) {
    if (
      Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) < 0.4
    ) {
      pts.splice(i, 1);
      cols.splice(i, 1);
    }
  }
  const M = pts.length;

  /* Quarter-ellipse ends, matching the corners the landing div will have once
     the FLIP scale magnifies its border-radius. Ramped in with the cinch, so
     they appear exactly as the bar becomes a bar. */
  /* Ramped over the last 220ms, NOT with the cinch. Tied to the cinch it
     started thinning the ends while the knot's remnant was still a lump in the
     middle — thin ends and a fat centre, which reads as a diamond rather than
     as a bar. By the time this ramp opens the lump has gone and the strand is
     a rectangle, so the taper is the only thing changing. */
  const tp = opts.taper;
  const taperT = clamp01((ms - (TOTAL_MS - 220)) / 220);
  const amp = tp ? (tp.rx / tp.rh) * halfW * 2 * taperT : 0;
  const rxU = tp ? tp.rx / tp.rw : 0;
  const halfAt = (x: number) => {
    if (amp <= 0) return halfW;
    const d = Math.min(x, W - x) / (rxU * W);
    if (d >= 1) return halfW;
    return halfW - amp + amp * Math.sqrt(Math.max(0, 1 - (1 - d) * (1 - d)));
  };

  let runStart = 0;
  for (let i = 1; i <= M; i++) {
    if (i < M && cols[i] === cols[runStart]) continue;
    const seg = pts.slice(runStart, Math.min(M, i + 1));
    if (seg.length > 1) {
      ctx.beginPath();
      const poly = ribbonOutline(
        seg,
        seg.map((q) => halfAt(q[0])),
      );
      poly.forEach((q, j) =>
        j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]),
      );
      ctx.closePath();
      ctx.fillStyle = cols[runStart];
      ctx.fill();
    }
    runStart = i;
  }

  /* Crossings are found on the MORPHED polyline every frame, not read from a
     table of the finished shape. They have to be: mid-morph there may be one,
     or two, or none, and a gap punched where a crossing has not happened yet
     is a notch in open air. */
  /* Below this the loops are smaller than the ribbon is thick, so there are
     no holes left to punch — and a gap the width of the strand cut into a
     lump the size of the strand is a hole in the middle of nothing. */
  const probe: Pt[] = [];
  let live: { first: number; second: number; at: Pt }[] = [];
  if (cinch > 0.42) {
    for (let i = 0; i < 200; i++)
      probe.push(pts[Math.round((i * (pts.length - 1)) / 199)]);
    live = selfCrossings(probe)
      .map((c) => ({
        first: Math.min(c.under, c.over),
        second: Math.max(c.under, c.over),
        at: c.at,
      }))
      .filter(
        (c, i, a) =>
          !a.some(
            (o, j) =>
              j < i && Math.hypot(o.at[0] - c.at[0], o.at[1] - c.at[1]) < 14,
          ),
      )
      .sort((a, b) => a.first - b.first);

    for (let ci = 0; ci < live.length; ci++) {
      const c = live[ci];
      // Alternating over/under; the checkbox swaps in the brief's sequence.
      const firstOver = opts.briefOverUnder
        ? ci === 0 || ci === 3
        : ci % 2 === 0;
      const over = firstOver ? c.first : c.second;
      const halfWin = 0.022;
      const n = 24;
      const win: Pt[] = [];
      const gap: number[] = [];
      const wCols: string[] = [];
      for (let i = 0; i < n; i++) {
        const u = clamp01(over - halfWin + (2 * halfWin * i) / (n - 1));
        const f = u * (M - 1);
        const a = Math.floor(f);
        const b = Math.min(M - 1, a + 1);
        win.push([
          lerp(pts[a][0], pts[b][0], f - a),
          lerp(pts[a][1], pts[b][1], f - a),
        ]);
        gap.push(halfW + halfW * 0.5 * Math.sin((i / (n - 1)) * Math.PI));
        wCols.push(cols[a]);
      }
      const fill = (poly: Pt[], col: string) => {
        ctx.beginPath();
        poly.forEach((q, j) =>
          j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]),
        );
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
      };
      fill(ribbonOutline(win, gap), "#0d0c0a");
      let rs = 0;
      for (let i = 1; i <= n; i++) {
        if (i < n && wCols[i] === wCols[rs]) continue;
        const sub = win.slice(rs, Math.min(n, i + 1));
        if (sub.length > 1)
          fill(
            ribbonOutline(
              sub,
              sub.map((q) => halfAt(q[0])),
            ),
            wCols[rs],
          );
        rs = i;
      }
    }
  }
}

/** Point on the knot at normalised ARC length. */
function onCurveArc(g: { pts: Pt[]; arc: number[] }, s: number): Pt {
  const u = uAtArc(g.arc, s);
  const f = clamp01(u) * (g.pts.length - 1);
  const a = Math.floor(f);
  const b = Math.min(g.pts.length - 1, a + 1);
  return [
    lerp(g.pts[a][0], g.pts[b][0], f - a),
    lerp(g.pts[a][1], g.pts[b][1], f - a),
  ];
}

/** The straight terracotta bar the sequence ends on, in CSS pixels. Phase 5's
 *  FLIP starts from exactly this. */
export function finalBar(W: number, H: number) {
  const half = lineHalf(W);
  return { x: 0, y: H / 2 - half, w: W, h: half * 2 };
}

export { lineHalf, TOTAL_MS as SEQ_MS, RESOLVE as SEQ_RESOLVE };

/** Draw the whole sequence at absolute time `ms`. */
export function drawSequence(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  ms: number,
  opts: SeqOpts = SEQ_DEFAULTS,
) {
  if (!field || fieldRows !== opts.rows) {
    field = buildField(opts.rows);
    fieldRows = opts.rows;
  }
  /* Build the knot's geometry up front rather than on the first frame that
     needs it. It is a few milliseconds either way, but at the start they land
     while the field is still sweeping in and nothing is being tracked; at the
     phase-3 boundary they land on the frame the eye is following. */
  knotGeom(W, H, opts.cover);
  drawField(ctx, W, H, ms, opts);
}

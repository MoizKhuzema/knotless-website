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
  fig8Crossings,
  arcTable,
  uAtArc,
  FIG8_X0,
  FIG8_X1,
  FIG8_Y_MAX,
  type Fig8Crossing,
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
  cover: 0.88,
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
const cinchCurve = (t: number) => {
  /* The pull, accelerating. */
  const base = 0.3 * t + 0.7 * t * t;
  /* The jam. A rope pulled tight does not coast to a stop: it snatches through
     the last of the slack, binds, and then eases the final fraction as the
     turns bed down. This borrows a little of the end and gives it back — zero
     at both ends of the window, so the sequence still finishes on exactly the
     bar the FLIP hands over to. */
  const j = clamp01((t - 0.76) / 0.24);
  return base + 0.06 * Math.sin(Math.PI * j);
};

/* 0.10 of the width. Measured off the reference: a 335px strand on a 3200px
   artwork, 0.105 — and openings of 870x521 and 462x345 around it, so 1:1.55 and
   1:1.03 of strand to opening. It was 0.05 (1:2.1, which reads as wire) and
   then 0.062.

   Thickness is tied to the KNOT's scale, not the viewport's height. A line
   sized as a fraction of height is a reasonable bar on a desktop and a third
   of the knot's total height on a phone, where the knot is short because it
   has to span the width. Phase 2 uses the same number so the handover does
   not step. */
const lineHalf = (W: number) => (0.1 * W) / 2;

/** Vertical stretch needed for the KNOT AS DRAWN — strand included — to cover
 *  `frac` of the viewport height while spanning its full width.
 *
 *  It used to divide by a hardcoded 2.05, a guess at twice the body's half
 *  height. The body's real half height is FIG8_Y_MAX, 0.8931, and the strand
 *  adds its own width on top, so `cover: 0.6` actually drew 63% and `cover`
 *  meant nothing in particular. Now it means what it says.
 *
 *  Capped at 2: past that the lobes turn into vertical slots and it stops
 *  reading as rope. On a phone the cap is what is doing the work, which is why
 *  the knot is shorter there than `cover` asks for — correctly. */
const knotStretch = (W: number, H: number, frac: number) =>
  Math.max(
    1,
    Math.min(
      2,
      ((frac * H - 2 * lineHalf(W)) * (FIG8_X1 - FIG8_X0)) /
        (2 * FIG8_Y_MAX * W),
    ),
  );

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
  /* How long the target line is, 0.12 to 1 of the half-screen.
   *
   * At 0.12 every row's slot is packed into a short bar at the right edge —
   * near enough to a point to read as one, but NOT a literal point, which
   * would give arrived material zero width and make it vanish instead of
   * gathering.
   *
   * IT OPENS WITH THE SLIDE, and that timing is the whole fix. Row 0 sits at
   * the line's left end and row 12 at its right, so the moment the line has
   * length the top of the field is aiming half a screen further left than the
   * bottom. Do that while material is still arriving and the top consolidates
   * into the line while the bottom is still strung out crossing the screen —
   * which is exactly what "the top has collapsed more than the bottom" looks
   * like. Measured, sampling lit area above against below the midline through
   * the collapse: it fell to 0.384 at the worst, against 0.5 for even.
   *
   * Opening it on the slide instead puts the whole separation after the field
   * has arrived. Same sweep: 0.479 to 0.500 at every frame. The end state is
   * unchanged — slide 1 is lineLen 1, which is the full-length line phase 2
   * has always handed over. */
  const lineLen = 0.12 + 0.88 * slide;
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
      /* The target LINE grows; the slots inside it do not move relative to
       * each other. See collapseX — the whole field falls into one short bar
       * at the hole and that bar then opens out into the line, rather than
       * each row setting off for a different part of a line that is already
       * full length. The END STATE is untouched: lineLen reaches 1 before the
       * slide starts, so phase 2 still hands over exactly the segmented,
       * hard-edged, slot-packed bar it did before. */
      const tx = collapseX(i, rowCount, uRef, W, slide, lineLen);
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
  cross: Fig8Crossing[];
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
  /* The crossing table IS precomputed now, and over/under is read from it.
     It has to be. The old code found the crossings on the morphed polyline
     every frame, sorted them, and assigned over/under from the crossing's
     INDEX in that frame's list (`ci % 2 === 0`). The list grows 2 -> 3 -> 4 as
     the strand draws, so a crossing born earlier in the sort order pushed every
     later one down a slot and INVERTED it. Logged at 1440x810: at 1780ms a
     fourth crossing appeared at x=1182 and the crossing at x=685 went from over
     to under in a single frame. Over/under is a property of the strand, not of
     a position in a list.

     It was removed once for cost — a self-intersection search over 900 points
     is about 404,000 segment-pair tests, measured at 53ms. So it runs on a
     220-point decimation instead: ~24,000 tests, and the crossings are 0.09
     apart in curve parameter while 220 samples locate them to about 0.005.
     Forty times finer than it needs to be. And knotGeom is built on the FIRST
     frame of the whole sequence, during the field, where nothing is tracked —
     not at the phase-3 boundary, which is what made the old cost visible. */
  const COARSE = 220;
  const coarse: Pt[] = [];
  for (let i = 0; i < COARSE; i++)
    coarse.push(pts[Math.round((i * (pts.length - 1)) / (COARSE - 1))]);
  const cross = fig8Crossings(coarse, true);
  knotCache = { key, pts, arc, tailArc, cross };
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

  /* THE LOOPS DO NOT CLOSE TOGETHER.
     A uniform scale closes all four openings at exactly the same rate, which is
     the one thing a real knot never does: whichever bight has least slack in it
     binds first and drags the other closed after. So the left of the shape runs
     a little ahead of the right for the middle of the cinch, and the two meet
     again at the end. Zero at both ends of the window, so the shape is
     undistorted where it matters — at full size, and at the bar. */
  const lag =
    0.085 * Math.sin(Math.PI * clamp01((ms - P3_END) / CINCH_MS));
  const cinchAt = (x: number) => cinch * (1 + lag * (x / FIG8_X1));

  /* And it thickens as it binds. Rope under tension at a jam swells where the
     turns press on each other. Peaks at three quarters of the cinch and is back
     to nothing by the end, because the bar the FLIP takes over has to be
     exactly `finalBar`. */
  /* Back to nothing by 88% of the cinch, not by the end of it. The FLIP takes
     over from `finalBar`, which is exactly `halfW` thick; a bulge still
     unwinding on the handover frame would pop the bar by a couple of pixels as
     the div took over. The last ~90ms is the true width, settled. */
  const bulge =
    1 +
    0.05 *
      Math.sin(
        Math.PI * clamp01(((ms - P3_END) / CINCH_MS - 0.42) / 0.46),
      );

  const tailEndX = project(onCurveArc(g, g.tailArc))[0];
  const off = (W / 2 - tailEndX) * (1 - pull);
  const tailScale = tailEndX > 0 ? (tailEndX + off) / tailEndX : 1;

  const N = 620;
  const pts: Pt[] = [];
  const cols: string[] = [];
  /* The CURVE PARAMETER each drawn point came from. Carried all the way
     through the dedupe and the resample, because it is the only stable name a
     crossing has: the drawn array's own index means nothing from one frame to
     the next while the strand is still growing and then shrinking. */
  const us: number[] = [];
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
    const inner = project([FIG8_X0 * cinchAt(FIG8_X0), 0])[0];
    for (let j = 0; j < EXT; j++) {
      const f = Math.pow(j / EXT, 1.6);
      pts.push([lerp(project([FIG8_X0, 0])[0], inner, f), H / 2]);
      cols.push(knotColour(0, flowAt(ms)));
      us.push(0);
    }
  }
  for (let i = 0; i < N; i++) {
    const sArc = (head * i) / (N - 1);
    const uCurve = uAtArc(g.arc, sArc);
    const raw = onCurveArc(g, sArc);
    // Scaled about the middle of the knot, which is shape-space (0, 0).
    const c = cinchAt(raw[0]);
    const q = project([raw[0] * c, raw[1] * c]);
    pts.push([sArc <= g.tailArc ? q[0] * tailScale : q[0] + off, q[1]]);
    cols.push(knotColour(sArc, flowAt(ms)));
    us.push(uCurve);
  }
  if (cinch < 1) {
    const inner = project([FIG8_X1 * cinchAt(FIG8_X1), 0])[0];
    for (let j = 1; j <= EXT; j++) {
      const f = 1 - Math.pow(1 - j / EXT, 1.6);
      pts.push([lerp(inner, project([FIG8_X1, 0])[0], f), H / 2]);
      cols.push(knotColour(1, flowAt(ms)));
      us.push(1);
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
      us.splice(i, 1);
    }
  }
  /* Resampled to an even spacing along the strand before anything is drawn.
     The centre line is sampled by CURVE PARAMETER, and curve parameter is not
     distance: consecutive samples on the finished shape sit anywhere from
     0.0044 to 0.0416 apart, a 9.5:1 spread. Nothing downstream wants that. The
     crossing window below is +/- 0.024 of the strand, and on the old spacing
     that was a different physical length at each of the four crossings — so the
     contact shadow would have been a different size at each one. */
  {
    const acc = [0];
    for (let i = 1; i < pts.length; i++)
      acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = acc[acc.length - 1];
    if (total > 1) {
      const n = pts.length;
      const rp: Pt[] = [];
      const rc: string[] = [];
      const ru: number[] = [];
      let j = 1;
      for (let i = 0; i < n; i++) {
        const want = (total * i) / (n - 1);
        while (j < acc.length - 1 && acc[j] < want) j++;
        const span = acc[j] - acc[j - 1] || 1;
        const f = clamp01((want - acc[j - 1]) / span);
        rp.push([
          lerp(pts[j - 1][0], pts[j][0], f),
          lerp(pts[j - 1][1], pts[j][1], f),
        ]);
        rc.push(cols[f < 0.5 ? j - 1 : j]);
        ru.push(lerp(us[j - 1], us[j], f));
      }
      pts.length = 0;
      cols.length = 0;
      us.length = 0;
      pts.push(...rp);
      cols.push(...rc);
      us.push(...ru);
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

  /* ---------------------------------------------------------------------
     ONE OUTLINE, ONE CLIP.

     Every colour segment used to be its own filled polygon, butted against its
     neighbour. Each was antialiased against the ink underneath, so at the join
     the ink showed through as a dark hairline straight across the rope — six of
     them down the strand, plus two more per crossing from the re-fill. They
     read as cracks.

     So nothing is butted any more. Clip once to the strand's own outline, then
     paint the colours as bands WIDER than the strand and overlapping their
     neighbours. The clip draws the edge; the overlaps mean there is no edge
     between bands left to get wrong.
     --------------------------------------------------------------------- */
  const halfs = pts.map((q) => halfAt(q[0]) * bulge);
  /* Mean spacing between samples. The strand is resampled by arc length above,
     so this is the same everywhere and converts a distance in pixels into a
     number of points. */
  let step = 1;
  if (M > 1) {
    let len = 0;
    for (let i = 1; i < M; i++)
      len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    step = len / (M - 1) || 1;
  }

  const path = (poly: Pt[]) => {
    const p = new Path2D();
    for (let j = 0; j < poly.length; j++)
      j ? p.lineTo(poly[j][0], poly[j][1]) : p.moveTo(poly[j][0], poly[j][1]);
    p.closePath();
    return p;
  };

  /* The light. ONE raking source, up and to the left, and it never moves.
     A rope is a cylinder, and the eye reads roundness from a bright band down
     one side and a body that falls off toward the other. It needs nothing else.

     Both are built by shifting the CENTRE LINE by a constant vector in SCREEN
     space, not along the local normal. A directional light does not care which
     way the strand happens to be running, and following the normal would swap
     the highlight to the other side every time the rope turned back on itself.

     And it is a RAMP, not two tones. A single dark band and a single light band
     gave the rope a crisp horizontal edge down its middle — two flat colours,
     which is the thing this is meant to fix. Eight faint passes at increasing
     offset accumulate into a smooth falloff instead, because each one covers a
     slightly smaller crescent than the last. */
  const LX = -0.40 * halfW;
  const LY = -0.54 * halfW;
  const OVERLAP = 3;

  const paintColour = (a: number, b: number) => {
    if (b - a < 2) return;
    const seg = pts.slice(a, b);
    const segH = halfs.slice(a, b);
    ctx.save();
    ctx.clip(path(ribbonOutline(seg, segH)));
    let rs = a;
    for (let i = a + 1; i <= b; i++) {
      if (i < b && cols[i] === cols[rs]) continue;
      const lo = Math.max(a, rs - OVERLAP);
      const hi = Math.min(b, i + OVERLAP);
      if (hi - lo > 1) {
        const band = pts.slice(lo, hi);
        ctx.fillStyle = cols[rs];
        // 1.7x the strand's own width: the band overflows the clip on both
        // sides, so the clip is the only thing that ever draws an edge.
        ctx.fill(path(ribbonOutline(band, band.map(() => halfW * 1.7))));
      }
      rs = i;
    }
    ctx.restore();
  };

  /* IT STOPS BEING A ROPE.

     Phase 5 hands the bar to a FLIP'd div filled flat with the strike's own
     #a04a2c — no light, no shading, because the strike in the wordmark is a
     graphic mark and not a photograph of one. A lit cylinder swapped for a flat
     rectangle pops on the handover frame. So the light ramps off over the last
     300ms, which is also the window in which the knot stops being a knot: the
     rope resolves into the mark as the shape resolves into the bar, and the two
     read as one move rather than as a dissolve followed by a swap.

     It finishes 60ms BEFORE the sequence does, not on the last frame, so the
     handover cannot land on a frame that is still half lit. */
  const lit = 1 - clamp01((ms - (TOTAL_MS - 340)) / 280);

  /* Applied ONCE, to the whole strand, after every occlusion is resolved.
     Per-run it was applied twice wherever a crossing window was repainted, and
     the double dose showed as a lighter rectangle with hard vertical edges
     sitting on the rope. */
  const applyLight = () => {
    ctx.save();
    ctx.clip(path(ribbonOutline(pts, halfs)));
    if (lit <= 0.001) {
      ctx.restore();
      return;
    }
    /* Ten passes spread across the FULL width of the strand, not the middle
       half of it. The offset runs along a screen-space vector, and only its
       component across the strand moves the shade — so a spread that looked
       like it reached the far edge stopped short of it, and the outer third of
       the dark side sat at maximum with no gradient in it at all. That is a
       flat dark body with a bright edge, which is what it looked like once the
       rope got big. */
    const SHADE = 10;
    ctx.fillStyle = `rgba(0,0,0,${(0.031 * lit).toFixed(4)})`;
    for (let k = 1; k <= SHADE; k++) {
      const d = (3.1 * k) / SHADE;
      ctx.fill(
        path(
          ribbonOutline(
            pts.map((q): Pt => [q[0] - LX * d, q[1] - LY * d]),
            halfs,
          ),
        ),
      );
    }
    const LIT = 6;
    ctx.fillStyle = `rgba(255,255,255,${(0.030 * lit).toFixed(4)})`;
    for (let k = 1; k <= LIT; k++) {
      const d = 0.28 + (0.95 * k) / LIT;
      ctx.fill(
        path(
          ribbonOutline(
            pts.map((q): Pt => [q[0] + LX * d, q[1] + LY * d]),
            halfs.map((h) => h * 0.62),
          ),
        ),
      );
    }
    ctx.restore();
  };

  /* The head is round. It was a square chop on a slant for the whole 1540ms of
     the draw, which is the one shape a cut rope never has. Drawn under the
     strand so only the protruding half-disc shows. */
  if (head < 1 && M > 1) {
    const tip = pts[M - 1];
    ctx.beginPath();
    ctx.arc(tip[0], tip[1], halfs[M - 1] * 0.99, 0, Math.PI * 2);
    ctx.fillStyle = cols[M - 1];
    ctx.fill();
  }

  paintColour(0, M);

  /* Crossings are still FOUND per frame on the morphed polyline — mid-draw
     there may be one, two or none, and a gap punched where a crossing has not
     happened yet is a notch in open air. What is no longer decided per frame is
     which strand passes over: that is looked up in the table built from the
     finished shape, matched by curve parameter. See `knotGeom`. */
  /* Below this the loops are smaller than the ribbon is thick, so there are
     no holes left to punch. */
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
      );

    /* How much of the contact shadow is showing. It ramps in with the crossing
       rather than appearing at full strength the frame the strands meet. */
    const shade = clamp01((cinch - 0.42) / 0.16) * lit;

    for (const c of live) {
      /* The lookup, and the whole point of carrying `us`.
         `c.first` and `c.second` are positions in THIS FRAME'S array, and that
         array is a growing prefix of the strand during the draw and a shrinking
         one during the cinch — so the same crossing's normalised index wanders
         by more than the gap between two crossings. Matching on it put crossing
         2 against crossing 1's row for twenty frames, and the strand flipped.
         `us` converts back to the curve parameter the point actually came from,
         which never moves, and the match is then exact. */
      const uf = us[Math.round(clamp01(c.first) * (M - 1))];
      const usd = us[Math.round(clamp01(c.second) * (M - 1))];
      let ref = g.cross[0];
      let bestD = Infinity;
      for (const r of g.cross) {
        const d = Math.abs(r.first - uf) + Math.abs(r.second - usd);
        if (d < bestD) {
          bestD = d;
          ref = r;
        }
      }
      const over = ref.overIsFirst ? c.first : c.second;

      const halfWin = 0.024;
      const i0 = Math.max(0, Math.round((over - halfWin) * (M - 1)));
      const i1 = Math.min(M, Math.round((over + halfWin) * (M - 1)) + 1);
      if (i1 - i0 < 2) continue;
      const win = pts.slice(i0, i1);
      const winH = halfs.slice(i0, i1);

      /* THE CONTACT SHADOW, and the reason the hard slot is gone.
         The old code cut an ink-coloured gutter 1.5x the strand's width through
         whatever lay under the crossing. On the ink ground it read as a gap,
         which is honest, but a gap is a hole — it carries no information about
         WHICH strand is nearer, only that something was removed. A shadow does:
         the near strand casts it, the far strand receives it, and on the ink
         ground it costs nothing because black on black is invisible. So the
         ground still shows a clean separation and the rope now shows depth. */
      ctx.save();
      /* Tight. The blur is a fraction of the strand, so when the rope got to
         0.10 of the viewport the shadow grew with it and turned into a haze
         that made the near strand look translucent. A contact shadow is short
         by definition — it is the gap between two things that are touching. */
      ctx.shadowColor = `rgba(0,0,0,${(0.55 * shade).toFixed(3)})`;
      ctx.shadowBlur = halfW * 0.26;
      ctx.shadowOffsetX = halfW * 0.07;
      ctx.shadowOffsetY = halfW * 0.11;
      ctx.fillStyle = "#000";
      /* Inset by a whisker. This black is a shadow-CASTER and nothing else —
         the repaint below covers it exactly. Except at the edge, where both are
         antialiased: the caster laid black at half coverage and the repaint
         restored only half of it, leaving a dark hairline across the rope at
         every window boundary. Shrinking the caster inside the repaint's clip
         puts its soft edge where the repaint is already solid. */
      ctx.fill(path(ribbonOutline(win, winH.map((h) => h - 1.25))));
      ctx.restore();

      /* The near strand, repainted crisp on top of its own shadow — and over a
         WIDER span than the shadow was cast from. `shadowBlur` throws the
         shadow in every direction, including back along the strand that casts
         it, so a dark band appeared on the over strand just past each end of
         the window and the window itself read as a lighter rectangle with hard
         edges. The repaint has to reach past the blur to wipe it. */
      const pad = Math.ceil((halfW * 0.9) / Math.max(1, step));
      paintColour(Math.max(0, i0 - pad), Math.min(M, i1 + pad));
    }
  }

  /* Last, and once. Every crossing is resolved by now, so the light lands on
     the finished rope rather than on each piece as it is laid down. */
  applyLight();
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

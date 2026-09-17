/**
 * Phase 1 of the hero intro: the ribbon field.
 *
 * The viewport is covered in ribbons from the first frame and they are already
 * flowing — right, and on a wave, rising then falling once across the second
 * this phase lasts. Nothing sweeps in from off-screen: the reader arrives to a
 * page that is already moving.
 *
 * Geometry and colour only. No canvas, no DOM — so it can be exercised from
 * /lab/, a test, or a headless script without a page around it.
 *
 * TWO DECISIONS WORTH THE WORDS:
 *
 * 1. COVERAGE IS STRUCTURAL, NOT TUNED. The field is defined by its BOUNDARIES,
 *    not by its ribbons: `edges` holds rowCount+1 curves, and row i is whatever
 *    lies between curve i and curve i+1. Row i's bottom edge is not a copy of
 *    row i+1's top edge, it is the same curve evaluated once. A gap cannot open
 *    between them, at any amplitude, any phase, any viewport. The alternative —
 *    independent ribbons with amplitudes chosen so they happen not to separate —
 *    is a tuning problem that comes back at every new aspect ratio.
 *
 * 2. LENGTH VARIES ALONG A ROW, NOT BY ROW. "Ribbons of different lengths" and
 *    "no gaps" are in tension if each ribbon is one object: short ribbons leave
 *    holes. So each row is a continuous run of SEGMENTS of varying width and
 *    colour, scrolling as one. The row never breaks, and the varying widths
 *    passing the eye are what make the movement legible — which is what the
 *    different lengths were for.
 */

export type Hex = string;

/**
 * The palette — ONE set, used by the ribbon field AND by the line's segments.
 *
 * They were separate, and the field's was nineteen earth tones. Two problems:
 * the field read as shades of terracotta rather than as colour, and the field
 * and the line looked like two different pieces of work, because they were
 * drawn from two different sets. Seven saturated hues, shared, fixes both — the
 * ribbons you watch in phase 1 are literally the segments you watch flow along
 * the line in phase 3.
 *
 * A DEVIATION, recorded rather than smuggled: DESIGN.md §02 allows five values
 * and forbids tints and shades, and these are neither five nor brand colours.
 * §02 was written for a printed-document register, not for motion, and the
 * whole sequence resolves to the brand's terracotta before the hero appears.
 * Nothing here is available to the page.
 */
export const FIELD_PALETTE: Hex[] = [
  '#cf5b30', // ember — the brand's orange
  '#e8a93a', // marigold
  '#efe9dd', // cream
  '#2f8a5f', // green
  '#7b6bc4', // periwinkle
  '#e08aa0', // rose
  '#8fc9b0', // mint
];

/** What every colour resolves to at the end. */
export const RESOLVE: Hex = '#a04a2c';

/** What the canvas is cleared to. Never the page's #0d0c0a: a sub-pixel
 *  antialiasing hairline grounded in the page colour is the page showing
 *  through, which is the one thing the field must not do. */
export const FIELD_GROUND: Hex = '#2b211b';

/** Relative luminance, for the adjacency guard. */
const LUM = FIELD_PALETTE.map((h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
});

/** Minimum luminance gap between two segments that touch along a row. Below
 *  this the joint disappears and two ribbons read as one long one. Lower than
 *  it was, because seven saturated hues differ by HUE as well as by value and
 *  demanding a big luminance step as well would rule out most pairs. */
const MIN_STEP = 0.035;

export const FIELD = {
  /** Wave height, as a fraction of viewport height. */
  AMP: 0.038,
  /** Wave cycles across the viewport width. Under one, so a row reads as a
   *  single long swell rather than corrugation. */
  WAVES: 0.85,
  /** Temporal cycles over the phase's full duration. Exactly one: every point
   *  rises, then falls, once — the "up then down" the motion is built around. */
  CYCLES: 1,
  /** How far past the top and bottom edges the field extends, so the wave can
   *  never lift a boundary into view. Must exceed AMP with room to spare. */
  BLEED: 0.12,
  /**
   * Lean of the cut between two segments, as a multiple of the row's own
   * thickness. Square joints turn the field into brickwork — thirteen rows of
   * butt-jointed rectangles read as a tiled wall, not as ribbons. An angled cut
   * reads as tape laid end over end, and because both segments are cut on the
   * same line it tiles exactly as before.
   */
  SKEW: 0.45,
} as const;

export interface FieldSegment {
  /** Width as a fraction of viewport width. */
  w: number;
  /** Index into FIELD_PALETTE. */
  c: number;
}

export interface FieldRow {
  /** Scroll distance over the phase, in viewport widths. */
  speed: number;
  segments: FieldSegment[];
  /** Sum of segment widths — the tile length this row repeats on. */
  total: number;
}

export interface Field {
  /** rowCount + 1 boundary positions, as fractions of viewport height. */
  edges: number[];
  /** Per-boundary phase offset, radians. Small, so the field breathes rather
   *  than shears. */
  phases: number[];
  rows: FieldRow[];
}

/** Deterministic PRNG. The field must be identical on every load — a reader who
 *  reloads should not get a different animation — but hand-authoring thirteen
 *  rows of a dozen segments each is a table nobody would maintain. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build the field.
 *
 * `rowCount` is a count, not a height, so rows scale with the viewport: the
 * field looks the same on a phone as on a desktop rather than turning into
 * hairlines or slabs.
 */
export function buildField(rowCount = 13, seed = 20260916): Field {
  const rnd = mulberry32(seed);
  const span = 1 + FIELD.BLEED * 2;

  /* Boundaries. Uneven on purpose — equal spacing is the thing that makes a
     stack of bands read as a chart rather than as fabric — but each gap is
     clamped so no row collapses to nothing or swallows the screen. */
  const gaps: number[] = [];
  for (let i = 0; i < rowCount; i++) gaps.push(0.55 + rnd() * 0.9);
  const gapSum = gaps.reduce((a, b) => a + b, 0);
  const edges: number[] = [-FIELD.BLEED];
  for (let i = 0; i < rowCount; i++) edges.push(edges[i] + (gaps[i] / gapSum) * span);

  /* Each boundary carries its own small phase offset, so neighbouring rows
     stretch and compress slightly as the wave passes instead of the whole field
     sliding as one rigid sheet. Kept under a third of a radian: past that the
     rows shear visibly and the field stops looking like one surface. */
  const phases = edges.map((_, i) => (i / rowCount) * 0.9 + rnd() * 0.3);

  const rows: FieldRow[] = [];
  let prevTone = -1;
  for (let i = 0; i < rowCount; i++) {
    /* Speeds spread nearly 3:1. Rows moving at visibly different rates is the
       single strongest cue that these are separate ribbons rather than one
       textured image being panned. */
    const speed = 0.1 + rnd() * 0.26;

    /* A colour this row leans on, never the one the row above leaned on — so
       vertical contrast is structural. It has to be structural because rows
       scroll at different speeds: which segment sits above which changes every
       frame, so no static pairing rule could hold. */
    let tone = Math.floor(rnd() * FIELD_PALETTE.length);
    if (tone === prevTone) tone = (tone + 1 + Math.floor(rnd() * (FIELD_PALETTE.length - 1))) % FIELD_PALETTE.length;
    prevTone = tone;

    const segments: FieldSegment[] = [];
    let total = 0;
    let last = -1;
    /* Tile past 2.6 viewport widths so a row is still covered at full scroll
       with a whole tile to spare. */
    while (total < 2.6) {
      /* LONG. A third of the viewport at the short end, well over a full
         viewport at the long end, so a row shows two or three colours at once
         rather than eight. Short segments were the other half of the brickwork
         problem: at 0.07-0.41 every row was a run of tiles, and no individual
         length was legible as a ribbon passing. */
      const w = 0.32 + rnd() * 0.95;

      /* Half the time the row's own colour, half the time anything else — so a
         row reads as predominantly one hue without being a single note. */
      const pool =
        rnd() < 0.45 ? [tone] : FIELD_PALETTE.map((_, i) => i).filter((i) => i !== tone);
      let c = pool[Math.floor(rnd() * pool.length)];

      /* Adjacency guard. Two touching segments close in luminance make the
         joint vanish and read as one long ribbon, which loses both the colour
         change and the length. Up to eight attempts, then whatever is furthest
         away — a loop that can fail to terminate is worse than a near miss. */
      if (last >= 0) {
        let tries = 0;
        while (Math.abs(LUM[c] - LUM[last]) < MIN_STEP && tries < 8) {
          c = pool[Math.floor(rnd() * pool.length)];
          tries++;
        }
        if (Math.abs(LUM[c] - LUM[last]) < MIN_STEP) {
          c = FIELD_PALETTE.reduce(
            (best, _, k) => (Math.abs(LUM[k] - LUM[last]) > Math.abs(LUM[best] - LUM[last]) ? k : best),
            0,
          );
        }
      }

      last = c;
      segments.push({ w, c });
      total += w;
    }
    rows.push({ speed, segments, total });
  }

  return { edges, phases, rows };
}

/**
 * Boundary `i` at horizontal position `u` (0..1 across the viewport) and time
 * `t` (0..1 through the phase), as a fraction of viewport height.
 *
 * Negated sine, so at t=0 the field is travelling UP. The brief asks for
 * rightward motion angled up first and down second; with +sin it starts at the
 * top of the swell and falls immediately, which reads as settling rather than
 * flowing.
 *
 * `amp` is overridable so /lab/ can sweep it; everything else takes the default.
 */
export function edgeY(field: Field, i: number, u: number, t: number, amp: number = FIELD.AMP): number {
  return (
    field.edges[i] -
    amp * Math.sin(Math.PI * 2 * (u * FIELD.WAVES + t * FIELD.CYCLES) + field.phases[i])
  );
}

/**
 * The segments of row `i` visible at time `t`, as x-fraction spans.
 *
 * Tiles from one full period left of the viewport so the left edge is covered
 * at every scroll offset, and runs to 1.3 rather than 1.0 on the right.
 *
 * That 0.3 is the skew. The renderer cuts each joint on a lean, which drags a
 * segment's BOTTOM edge back by up to about a fifth of a viewport width — so a
 * row tiled only to 1.0 covers the top-right corner and leaves the bottom-right
 * one bare. It showed up as a single uncovered column at x = W-1, in the
 * coverage scan rather than by eye.
 */
/* ---------------------------------------------------------------------------
 * Phase 2: the collapse.
 *
 * The field is the wordmark under a microscope. Pulling back, everything is
 * drawn into a point at the CENTRE OF THE RIGHT EDGE and stretched into a
 * single line that reaches from there back to the middle of the screen.
 *
 * THE END STATE IS THE SPECIFICATION, and the mapping is chosen to produce it
 * exactly rather than to simulate gravity and hope. A literal radial pull —
 * every point toward the attractor, distance preserved as length along the line
 * — is the physical model, and it does not work: rows far from the attractor's
 * y land at different lengths from rows near it, so the line comes out ragged
 * at both ends with the ground showing between stripes.
 *
 * So each ROW claims a SLOT: row i lands in the i-th thirteenth of the line,
 * occupying its full thickness. Slots abut exactly, so the line is continuous
 * and every joint is a hard vertical edge — no stripes, no ragged ends, and the
 * segment-after-segment reading the brief asks for falls out of the structure.
 *
 * The stretch is what makes it read as a collapse rather than a slide: within a
 * row, position maps through u^POW, so the last tenth of a row fills half its
 * slot and everything behind it is crushed into the remainder. That is also why
 * a slot ends up showing one or two colours — the content nearest the hole is
 * the content that survives, which is the right story as well as the right
 * picture.
 * ------------------------------------------------------------------------- */

export const COLLAPSE = {
  /**
   * How much of the phase is spent staggering the start across the width. The
   * right edge begins at once; the left edge begins this far in. Whatever is
   * left over is how long any single column takes to go, which is the same for
   * all of them.
   *
   * That decoupling matters. A moving front whose width is fixed in SCREEN
   * space gives every column a different collapse duration: the left edge can
   * only finish when the front has fully passed it, which is at the very last
   * instant, so the entire left half went in the final 68ms of a 400ms phase
   * and read as a snap. Staggering the START instead gives every column the
   * same motion and keeps the right-to-left reading.
   */
  SPREAD: 0.55,
  /** Stretch exponent. At 6, the rightmost tenth of a row fills half its slot.
   *  Lower and the row slides in whole rather than stretching; higher and
   *  everything but the last segment vanishes too abruptly to read. */
  POW: 6,
  /** Thickness of the resulting line, as a fraction of viewport height. */
  THICK: 0.055,
} as const;

const clamp01n = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * How far column `u` has been drawn in, 0..1, at collapse progress `p`.
 *
 * Squared on the way out, so a column accelerates as it goes rather than
 * sliding in at a constant rate — the pull belongs on the column, not on the
 * phase. `p` itself is linear, which is what keeps the front sweeping evenly.
 */
export function frontAt(u: number, p: number): number {
  const delay = (1 - clamp01n(u)) * COLLAPSE.SPREAD;
  const c = clamp01n((p - delay) / (1 - COLLAPSE.SPREAD));
  return c * c;
}

/**
 * The x a vertex of row `i` lands on, in pixels.
 *
 * The line FORMS anchored at the hole — spanning the right half, because that
 * is where the material is being pulled — and then travels left. `slide` 0..1
 * carries it, ending with the line across the LEFT half: from the left edge to
 * the centre of the screen.
 *
 * Forming it in the left half directly would be incoherent: the target is what
 * makes the field funnel toward the attractor, so a target on the left would
 * point the whole warp away from the hole it is supposed to be falling into.
 * It has to form on the right and then move.
 */
export function collapseX(
  i: number,
  rowCount: number,
  u: number,
  W: number,
  slide = 0,
  len = 1,
): number {
  const half = W / 2;
  /* The line's LENGTH, anchored at the hole and growing leftwards from it.
   *
   * At len 1 this is the finished line across the right half, which is what
   * phase 2 hands over. Below 1 the same slot packing is squeezed into a
   * shorter line at the right edge — every row still owns its slot, but the
   * slots are close enough together to read as one place.
   *
   * That is what makes the collapse symmetric. With the full-length line as
   * the target from the first frame, row 0 aimed at screen centre and row 12
   * at the right edge: the top of the field had half a screen further to
   * travel than the bottom, so it emptied first and the two halves visibly
   * collapsed at different rates. Length, not just position, has to open out
   * over time. */
  const L = half * len;
  const s = Math.pow(clamp01n(u), COLLAPSE.POW);
  return W - L + ((i + s) / rowCount) * L - slide * half;
}

/** Top and bottom of the finished line, in pixels. Every row collapses to the
 *  FULL thickness — they do not stack, because each owns its own length. */
export function collapseY(H: number): [number, number] {
  const h = (COLLAPSE.THICK * H) / 2;
  return [H / 2 - h, H / 2 + h];
}

export function rowSpans(field: Field, i: number, t: number): { x0: number; x1: number; c: number }[] {
  const row = field.rows[i];
  const out: { x0: number; x1: number; c: number }[] = [];
  let x = ((t * row.speed) % row.total) - row.total;
  let s = 0;
  while (x < 1.3) {
    const seg = row.segments[s % row.segments.length];
    out.push({ x0: x, x1: x + seg.w, c: seg.c });
    x += seg.w;
    s++;
  }
  return out;
}

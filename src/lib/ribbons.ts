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
 * The palette.
 *
 * A DEVIATION, recorded rather than smuggled: DESIGN.md §02 allows five values
 * and forbids tints and shades. A field that covers the whole viewport in
 * ribbons cannot be built from five, and §02 was written for a printed-document
 * register rather than for motion. This is the intro's palette only — nothing
 * here is available to the page.
 *
 * WHY THE FIRST VERSION WAS BORING, precisely: every one of its thirteen values
 * sat between hue 20 and 35 degrees. It was one warm ramp plus three oranges —
 * varied by measurement and monochrome to the eye. Adding more steps to that
 * ramp would only have made a smoother monochrome.
 *
 * So the additions are HUES, not steps: an ochre-amber pair well off the
 * terracotta hue, an oxblood below it, an apricot above it, and two near-neutral
 * cools. The cools do the most work per unit of intrusion — one slightly cool
 * tone is what makes an all-warm field stop looking like a sepia photograph —
 * and they are desaturated far enough to read as grey rather than as blue.
 */
export const FIELD_PALETTE: Hex[] = [
  /* 0-3   darks. The floor is #2b211b, not something nearer the page's
     #0d0c0a: a ribbon within a few levels of the ground stops reading as a
     ribbon and reads as a HOLE in the field. Technically covered, perceptually
     a gap — which fails the brief just as surely as an actual one. */
  '#2b211b',
  '#3a2c24',
  '#4a3730',
  '#4a2018',
  /* 4-7   warm mids */
  '#6e4a38',
  '#8a5a3a',
  '#5c564e',
  '#7a7268',
  /* 8-9   cool relief */
  '#4a5257',
  '#6e7a7a',
  /* 10-14 the terracotta family, brand value at 11 */
  '#7a2e1e',
  '#a04a2c',
  '#cf5b30',
  '#e07a4e',
  '#eb9a62',
  /* 15-16 ochre */
  '#c08a3c',
  '#d9a857',
  /* 17-18 lights */
  '#c4bba7',
  '#efe9dd',
];

/** What the canvas is cleared to. Never the page's #0d0c0a: a sub-pixel
 *  antialiasing hairline grounded in the page colour is the page showing
 *  through, which is the one thing this phase must not do. */
export const FIELD_GROUND: Hex = '#2b211b';

/**
 * Tonal families. A row draws mostly from ONE of these, and adjacent rows never
 * share one — so vertical contrast is structural rather than left to chance.
 *
 * It has to be structural because rows scroll at different speeds: which
 * segment sits above which changes every frame, so no static pairing rule could
 * hold. Giving each row a family means whatever lands next to whatever, the two
 * are from different parts of the range.
 */
const TONES: number[][] = [
  [0, 1, 2, 3, 10], // dark
  [4, 5, 6, 7, 8, 9], // mid
  [11, 12, 13, 15], // accent — saturated terracotta and ochre
  [14, 16, 17, 18], // light
];

/** Relative luminance, for the adjacency guard below. */
const LUM = FIELD_PALETTE.map((h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
});

/** Minimum luminance gap between two segments that touch along a row. Below
 *  this the joint disappears and two ribbons read as one long one. */
const MIN_STEP = 0.055;

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

    // This row's family, never the one above it.
    let tone = Math.floor(rnd() * TONES.length);
    if (tone === prevTone) tone = (tone + 1 + Math.floor(rnd() * (TONES.length - 1))) % TONES.length;
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

      /* Mostly this row's family, but a quarter of the time from another one —
         so a row is recognisably a tone without being a single note. */
      const pool = rnd() < 0.74 ? TONES[tone] : TONES[(tone + 1 + Math.floor(rnd() * 3)) % TONES.length];
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

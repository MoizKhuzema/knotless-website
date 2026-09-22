# BRAND.md

The locked parts of the Knotless identity. Everything not in this file is a
design decision and is free.

Tokens live in the `@theme` block in `src/styles/global.css`. **Tailwind v4, no
`tailwind.config.js`, ever.** Colour comes from a `--color-*` token or it does
not go in — `--color-*: initial` wipes Tailwind's palette first, which is what
makes off-brand colour unavailable rather than merely discouraged. If a value is
needed that no token names, add the token, with the reason in the comment.

---

## Colour

Six values. No tints, no shades, no gradients, no seventh colour.

| Token | Hex | Job |
|---|---|---|
| `--color-ink` | `#0D0C0A` | The page |
| `--color-cream` | `#EFE9DD` | Type on ink |
| `--color-cream-dim` | `#A29B91` | Secondary text, metadata |
| `--color-ember` | `#CF5B30` | **Marks only, ≥24px.** Rules, indices, carets, the logo strike |
| `--color-accent-type` | `#E0764D` | **Accent type, ≥14px** |
| `--color-terracotta` | `#B0461F` | Fills — a button, a panel. Never type |

Measured against the ink ground, computed from the hex (WCAG 2.2):

| | Ratio | |
|---|---|---|
| Cream on ink | 16.17 : 1 | APCA Lc −93.6 — above the ideal for body text |
| Dim on ink | 7.11 : 1 | AAA |
| `#E0764D` on ink | 6.39 : 1 | The accent, as type |
| Ember on ink | 4.83 : 1 | Enough for a graphic. Not for type |
| Terracotta on ink | **3.27 : 1** | **Fails AA** |

**The absolute rule: ember and terracotta are never type on the dark ground.**
Accent type is `--color-accent-type` or it does not exist. This was violated in
fifteen places in the previous build; it is the one real accessibility defect the
palette has ever carried, and it is a usage rule rather than a reason to change
the ground.

On a light ground the accent is oxide `#9E3418` (5.87 : 1 on cream), which is
what the light theme already sets.

---

## Type

IBM Plex, three registers, self-hosted in `src/assets/fonts/`. Declared as
`@font-face` in `BaseLayout.astro` so the URLs carry Astro's `base`.

| Token | Face | Use |
|---|---|---|
| `--font-serif` | Plex Serif 600 | **Display only, above 32px.** Hero, section headings |
| `--font-sans` | Plex Sans, variable `wght` 100–700 | Everything a reader reads, plus all UI |
| `--font-mono` | Plex Mono 400/500 | **Rendered arithmetic only.** Figures, the working, table columns |

Forbidden:

- **Mono on running words** — labels, nav, eyebrows, prose. The moment it leaves
  the arithmetic the technicality becomes costume, and this firm sells the rigour
  rather than a picture of it.
- **Serif below 32px.**
- **Any weight above 700.** The variable axis stops there; higher synthesises.
- **Mobile body below 16px.**

Plex was chosen on measurement, not taste: Sans, Serif and Mono are all tabular
by default with no CSS at all, and all distinguish `I` from `l`. Inter's digit
advances swing 407–646 and its `I` and `l` are the same rectangle. For a firm
whose deliverable is a column of figures a sceptic checks by hand, that is the
argument.

Carry `font-variant-numeric: tabular-nums lining-nums` on tables and figures
anyway — belt and braces that survives a family change.

---

## Logo

Thirteen SVGs in `src/assets/logo/`. Primary (wordmark + `AI UNTANGLED`),
secondary (wordmark alone) and icon (the struck `o`), each in normal, reverse,
mono and mono-reverse. The page is ink, so **reverse** is the variant to use.

The wordmark is **drawn**, not set. Do not re-set it in type, do not re-track it,
do not put `AI` inside it. The company is Knotless; `AI` lives in the tagline.

The strike sits inside the `o`'s boundary, never extends past it, and is present
at every size. It is never a standalone graphic.

### The one coupling in the codebase

`knotless-lockup-inline.svg` is the primary prepared for inlining. `BrandMark`
inlines it rather than shipping an `<img>`, because the hero intro flies a bar
onto the strike and an `<img>` cannot be measured from outside.

- Glyphs are `currentColor`; the theme drives them.
- The strike is `var(--color-ember)` — a mark. The tagline is
  `var(--color-accent-type)` — type. The rule above, enforced in the asset.
- An invisible `<rect data-strike>` sits at exactly the visible strike's bounding
  box, `x="1128" y="213" width="485" height="96"` in glyph units. The drawn
  strike is a boolean intersection of a bar with the `o`, so it is a path with no
  `width`/`height`/`rx` to read; the rect is the measurement target.

**If the wordmark is redrawn, that rect moves with it.** It is the only place
where a brand asset and a piece of motion code are coupled.

The intro's landing bar and `RESOLVE` in `src/lib/ribbons.ts` must equal the
strike's colour. Change one, change all three.

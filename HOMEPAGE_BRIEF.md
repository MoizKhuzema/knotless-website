# Build the Knotless homepage — brief for Claude Code

Build a **new homepage from scratch**. Do not treat the existing homepage as a
starting point, a reference, or a thing to improve. Read it once if you like, to
know what you are replacing, then design as if the page did not exist. Its
section order, its components and its layout decisions carry no authority here.

You have **full creative freedom** over layout, composition, grid, section order,
section count, motion, components and interaction. Three things are locked, and
they are listed under **Constraints**. Everything outside that list is yours.

---

## 0 · Before you write any code

Do these in order and report what you found. If any check fails, stop and say so
rather than working around it.

1. **Confirm the backup.** A full copy of the current site is at
   `../Website_BACKUP/v2`, taken after the brand was landed — it should contain
   `src/assets/fonts/plex-*.woff2` and `src/styles/global.css` declaring
   `--font-sans: 'Plex Sans'`. Verify both. **Never write to that folder.** If
   the check fails, make `../Website_BACKUP/v3` from the current working tree
   before doing anything else.

2. **Branch. Never commit to `main`.**
   ```
   git checkout -b feat/homepage-v4
   ```
   `main` is off limits for the whole job — no commits, no merges, no rebases
   onto it. The current work sits on `motion/knot-refinement`; branch from
   wherever HEAD is and say which commit you branched from.

3. **Confirm you can read all of these**, and say so explicitly:
   - `content/homepage-content-v4.md` — the copy. Final.
   - `src/assets/logo/*.svg` — thirteen files.
   - `src/assets/fonts/plex-*.woff2` — four files.
   - `BRAND.md` — the locked parts of the identity. Short, and the authority.

   The same logo files, plus a note on the strike, are also at
   `../Knotless/Branding/knotless_logo/` if you need them outside the repo.

4. **Read `BRAND.md` in full before designing.** It is about a hundred lines and
   it is the authority: it beats any design skill's default opinion. It also
   carries the two rules that are easiest to break — Tailwind v4 with no raw hex
   at a call site, and the accent rule in §Colour.

---

## 1 · Constraints — the only three

### Logo

Thirteen SVGs in `src/assets/logo/`. Primary (wordmark + `AI UNTANGLED`),
secondary (wordmark alone) and icon (the struck `o`), each in normal, reverse,
mono and mono-reverse. The page is ink, so **reverse** is the variant you want.

`knotless-lockup-inline.svg` is the primary prepared for inlining: glyphs are
`currentColor`, the strike is `var(--color-ember)`, the tagline is
`var(--color-accent-type)`, and it carries an invisible `<rect data-strike>`.
That rect is the hero intro's landing target — see §2.

The wordmark is drawn, not set. Do not re-set it in type, do not re-letter-space
it, do not put `AI` inside it.

### Palette

Six values. No tints, no shades, no gradients, no seventh colour. `global.css`
wipes Tailwind's palette with `--color-*: initial`, which is what makes off-brand
colour unavailable — keep that.

| Token | Hex | Job |
|---|---|---|
| `--color-ink` | `#0D0C0A` | The page |
| `--color-cream` | `#EFE9DD` | Type on ink. 16.17:1 |
| `--color-cream-dim` | `#A29B91` | Secondary text, metadata. 7.11:1 |
| `--color-ember` | `#CF5B30` | **Marks only, ≥24px.** Rules, indices, carets, the logo strike. 4.83:1 |
| `--color-accent-type` | `#E0764D` | **Accent type, ≥14px.** 6.39:1 |
| `--color-terracotta` | `#B0461F` | Fills — a button, a panel. Never type |

**The absolute rule: ember and terracotta are never type on the dark ground.**
Terracotta as type measures 3.27:1 and fails AA outright. Accent type is
`--color-accent-type` or it does not exist. This was violated in fifteen places
in the old site; do not reintroduce it.

### Type

IBM Plex, three registers, self-hosted. Tokens are `--font-serif`, `--font-sans`,
`--font-mono`.

- **Serif** — display only, above 32px. The hero, section headings, pull moments.
- **Sans** — everything a reader actually reads, plus all UI.
- **Mono** — **rendered arithmetic only.** Figures, the working, table columns.

Mono on running words is the failure to avoid: the moment it leaves the
arithmetic, the technicality becomes costume, and this firm sells the rigour
rather than a picture of it. No mono labels, no mono nav, no mono eyebrows.

The Sans variable axis stops at **700**. No 800, no 900 — they synthesise.

---

## 2 · The one thing that must survive: the knot intro

`src/components/KnotIntro.astro` and `src/lib/intro-render.ts` are a 2.98-second
canvas sequence that was rebuilt and measured in detail. **Keep it, and keep it
working.** It is the most distinctive thing the brand owns.

What it does: a field of ribbons in the brand palette collapses into a single
line, the line ties itself into a figure-eight knot, the knot cinches back into a
straight bar, and that bar **flies into the wordmark and becomes the strike
through the `o`**. Phases 1–4 are canvas; phase 5 is one FLIP'd `<div>`.

Three things must not break:

1. **`BrandMark` must render the lockup inlined**, not as an `<img>`, so
   `[data-strike]` can be measured with `getBoundingClientRect`. An `<img>`
   cannot be measured from the outside and the intro will bail.
2. **The bar's colour must equal the strike's colour.** Both are
   `var(--color-ember)`. The canvas resolves to `#CF5B30` in `ribbons.ts`. If you
   change one, change all three.
3. **The last 60 ms is a flat bar.** The light ramps off before the handover so
   the swap from canvas to div cannot land on a half-lit frame. Measured at
   2920 ms: the bar is **100% one flat colour**, 144 px tall, full width. Do not
   reintroduce shading at the end.

The intro is gated to once per session (`sessionStorage`), aborts on any scroll,
key or pointer input, and respects `prefers-reduced-motion`. Keep all three.

**Where the wordmark sits on the page is your decision** — the intro measures the
real element wherever it lands. Move it, resize it, place it in a different
composition. Just do not replace it with an `<img>` and do not remove the rect.

---

## 3 · The copy

`content/homepage-content-v4.md`. Seven sections plus a footer.

Use it **verbatim**. Do not rewrite the headlines, do not add a sentence that
sounds better, do not invent a statistic, a client name, a testimonial, a logo
wall or a case study. The firm has no clients yet and the copy is deliberately
honest about that. Inventing proof is the single worst thing this page could do.

You may decide how the copy is **arranged** — what gets emphasis, what becomes a
table, what becomes a list, what gets its own screen. That is design. Changing
the words is not.

The pricing table is real numbers; set them in mono with tabular figures.

---

## 4 · Who this is for

An Adelaide business owner, 40+, principal of an accounting practice or a
property management firm, who has stopped taking AI demos because every vendor
promises hours saved and none will put a dollar on it.

They are not impressed by motion. They are suspicious of polish that outruns
substance. They will read the pricing table before the hero. The page has to look
like it was made by people who can do arithmetic — which is the product.

**The register is an engineering drawing and an audit register: the working,
shown.** Hairline grids and index labels are *structure*, never decoration, and
never invented — a label on this site points at something real or it is deleted.
No fabricated telemetry, no `REV 2.6`, no `UNIT / D-01`, no version stamps. That
is set dressing for rigour, and this audience can tell the difference.

---

## 5 · Skills

Installed at `.agents/skills/`. Three are worth using. The rest were audited and
would fight this identity — do not load them.

### `design-taste-frontend` — use it, but never cold

Invoke it with the read and the dials stated up front, in the same breath:

> Trust-first B2B consultancy. Brand locked. DESIGN_VARIANCE 4 /
> MOTION_INTENSITY 2 / VISUAL_DENSITY 6. Hairlines and register labels are brand
> vocabulary, not decoration. Astro, not React. No stock photography.

Four of its rules collide with this brief. Override them deliberately:

- It bans hairline grids as decoration. Ours are structure — its own escape hatch
  is "use them only when they organize real content".
- It bans register-style labelling and per-row table borders. That is our audit
  vocabulary, applied to real content.
- It says "a pure-text page is not minimalism, it is incomplete work" and will
  push photography in. There is no photography. The typographic page is the
  deliverable.
- It assumes React/Next/Motion. Its Tailwind v4 notes still apply; the RSC and
  Motion sections do not.

Use its §14 pre-flight, its §4.2/§4.4/§4.11 consistency locks, its contrast
audits, its copy self-audit. Ignore its §10 vocabulary and its §12 block library
(the blocks do not exist).

### `web-design-guidelines` — run it at the end

Vercel's Web Interface Guidelines: keyboard support, visible focus rings, 24 px
minimum touch targets, inline form errors with focus management, explicit
dimensions to prevent CLS. Brand-agnostic. Triage its output rather than obeying
it blindly.

### `full-output-enforcement` — adopt it

Count the deliverables before starting, lock the number, verify the count before
saying you are done. No `// rest of code`, no skeletons, no "for brevity".

### Do not load

`gpt-taste`, `design-taste-frontend-v1`, `minimalist-ui`,
`industrial-brutalist-ui`, `high-end-visual-design`, `stitch-design-taste`,
`redesign-existing-projects`, and the four imagegen skills. Each was read in
full; each either needs a tool this session does not have, or prescribes a house
style that is the opposite of this one. `industrial-brutalist-ui` is the most
dangerous because it looks adjacent — it prescribes *invented* telemetry as
texture.

---

## 6 · Verify, do not assert

No visual change is finished because the code looks right.

- `npm run build` must pass and `npx astro check` must report **0 errors**.
- Screenshot at **1440 and 390** and look at both. Playwright is a dependency;
  there is no helper script, write one. The mobile breakpoint is
  `max-width: 639px` and is driven by token overrides, so a desktop check proves
  nothing about phones.
- **Compute** the contrast of every text colour against its actual background
  and report the ratios. Do not quote them from this brief — the backgrounds you
  choose are yours, so the numbers are yours to check.
- Report the achieved **character count** of the body measure at 1440. Target
  62–70.
- Play the intro (`?intro` forces it; the gate is once per session) and confirm
  the bar lands on the strike with no jump in size, position or colour.

---

## 7 · What to report when you are done

1. The branch, and the commit you branched from.
2. The section structure you chose, and one line on why — this is the part I most
   want to hear, because it is the part you had freedom over.
3. The measured contrast ratios.
4. The measured body measure.
5. Anything in `BRAND.md` you think is wrong. It is not sacred — but argue it,
   do not quietly deviate.

Build the whole page. Not a skeleton, not the hero with the rest stubbed.

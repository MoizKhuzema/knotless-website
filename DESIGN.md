# DESIGN.md — Knotless AI

**Status:** governing document for the website redesign.
**Supersedes:** Knotless AI Brand Guidelines v2.1 where the two conflict. Conflicts are listed explicitly in §10.
**Audience:** humans and coding agents. If a design skill's default opinion contradicts this file, this file wins.

---

## 01 · Principles

Three pillars, in order. **Simple** is load-bearing; the other two qualify it.

1. **Simple.** The reader is a busy principal at a professional services firm who has stopped taking AI demos. Every element must earn its place. When in doubt, remove.
2. **Honest.** We publish what is true today, not what we hope is true. No invented proof, no placeholder data, no claims we cannot substantiate.
3. **Safe.** Nothing on this site should feel like it is trying to get something out of the reader.

### The operating rule

**Default to subtraction.** A change that removes an element, a colour, a font size, or a sentence is likely correct. A change that adds one requires justification recorded in the commit message.

### What we are not

Not a SaaS product site. Not an agency showreel. Not a tech startup. The register is **an engineering drawing and an audit register** — the working, shown. Hairline grids and index labels are *structure*, never decoration, and never invented: a label on this site points at something real, or it is deleted.

---

## 02 · Colour

**One palette, two polarities.** The site is the dark polarity. The register — the printed
deliverable, which is photocopied and read round a table — is the light one. Not a rebrand and not
a theme toggle for its own sake: the same five values, inverted, because a dark document is bad on
toner and worse projected.

Five values. No tints, no shades, no gradients, no sixth colour. `global.css` wipes Tailwind's
palette with `--color-*: initial` before defining them, which makes off-brand colour literally
unavailable. **Keep that.**

| | Hex | Role |
|---|---|---|
| Ink | `#0D0C0A` | The page, dark polarity. Warm near-black, never pure black |
| Cream | `#EFE9DD` | Type on ink; the page in the light polarity |
| Dim | `#A29B91` | Secondary text, captions, metadata |
| **Oxide** | `#9E3418` | **The accent on a LIGHT ground.** Type, rules, fills |
| **Ember** | `#CF5B30` | **The accent on a DARK ground — graphic marks only, ≥24px** |
| Ember, lifted | `#E0764D` | **The accent on a DARK ground — type, ≥14px** |

### The accent rule

One hue, three values, each with a stated job. Measured, not asserted (WCAG 2.2, computed from the
hex):

| Pair | Ratio | Verdict |
|---|---|---|
| Cream on Ink — body copy | **16.17 : 1** | APCA Lc −93.6. The dark ground was never the problem |
| Dim on Ink — secondary | 7.11 : 1 | Passes AA and AAA |
| Oxide on Cream | **5.87 : 1** | The light polarity's accent. Passes AA |
| `#E0764D` on Ink | **6.39 : 1** | The dark polarity's accent **as type** |
| Ember `#CF5B30` on Ink | 4.83 : 1 | Marks only — a 1px rule, an index, a caret |
| Terracotta `#A04A2C` on Ink | **3.27 : 1** | **Fails AA. Never type.** |

**Terracotta and ember are never type on the dark ground.** This is absolute. It is the one real
accessibility defect the old system carried, and it is a usage rule, not a reason to flip the page.
Accent type on ink is `#E0764D` or it does not exist.

### Combinations

- **Cream on Ink** — the default register. Most of the site.
- **Ink on Cream** — the inverted panel. One per page maximum, and the register's own ground.
- **`#E0764D` on Ink** / **Oxide on Cream** — accent type, respectively.
- **Ember on Ink** — marks at 24px and above. Rules, indices, carets, the logo strike.
- **Never:** terracotta or ember as type on ink, cream on white, ink on terracotta.

---

## 03 · Typography

**This section overrides Brand Guidelines v2.1 §04 and every earlier version of this file.** The
site used Inter with Lora, then Inter with JetBrains Mono. It now uses one superfamily in three
registers.

### IBM Plex — Serif, Sans, Mono

| Face | Applies to | Never |
|---|---|---|
| **IBM Plex Serif** | Display only — hero, section headings, pull moments. Above 32px | Body, UI, anything small |
| **IBM Plex Sans** | Everything a reader actually reads, plus all UI: body, nav, buttons, labels, captions | — |
| **IBM Plex Mono** | **Rendered arithmetic only.** Figures, the working, table columns | Running words, labels, nav, eyebrows |

Mono on running words is the failure mode to watch. The moment it leaves the arithmetic, the
technicality becomes costume — and this firm sells the rigour, not a picture of it.

### Why this family

Measured from the binaries with fontTools, not taken from the specimen:

| Face | Digit widths | Tabular by default | `I` vs `l` |
|---|---|---|---|
| **IBM Plex Sans** | 600–600 | **yes** | **distinct** |
| **IBM Plex Serif** | 600–600 | **yes** | **distinct** |
| **IBM Plex Mono** | 600–600 | **yes** | **distinct** |
| Inter *(what we shipped)* | **407–646** | **no** | **identical forms** |

Plex is the only family measured that is tabular across sans, serif and mono **with no CSS at all**,
and that disambiguates `I` from `l`. For a firm whose deliverable is a column of figures a sceptic
checks by hand, that is the whole argument. Inter's digits swing 59% and its `I` and `l` are the
same rectangle.

It also releases the old lock. The previous system said headings could not leave Inter without
orphaning the wordmark. The wordmark is now drawn, so the UI type is chosen freely.

*Caveat on record: no `zero` (slashed-zero) feature was found in the Fontsource latin subsets. If a
slashed zero is ever wanted, verify against the full upstream binary first.*

### Scale

Desktop / mobile. The mobile breakpoint is `max-width: 639px`, applied by overriding tokens — never
by adding `sm:` variants at call sites.

| Role | Desktop | Mobile | Face | Weight | Tracking |
|---|---|---|---|---|---|
| Hero h1 | fluid to 104px | 44px | **Serif** | 600 | −4.5% |
| Section h2 | fluid to 60px | 34px | **Serif** | 600 | −3% |
| Sub-heading h3 | 24px | 20px | Sans | 600 | −1.5% |
| Standfirst / lead | fluid to 26px | 17px | Sans | 400 | 0 |
| **Body** | **18px** | **16px** | **Sans** | 400 | 0 |
| Label / eyebrow / nav | 12px | 11px | Sans | 500 | +8.5% |
| Caption / metadata | 13px | 13px | Sans | 400 | 0 |
| **Figures, the working** | — | — | **Mono** | 400–500 | 0 |

**Mobile body is 16px and never lower.** Not negotiable downward.

Carry `font-variant-numeric: tabular-nums lining-nums` on every table and figure. Plex is tabular by
default, so this is belt and braces rather than the mechanism — but it survives a family change.

### Measure

Body holds **62–70 characters** at desktop. `--container-prose` is the control. Verify empirically
at 1440px and report the achieved count; do not trust `max-w-prose`, which resolves to Tailwind's
`65ch` and overshoots.

### Delivery

Four files, self-hosted as woff2 in `src/assets/fonts/`, declared as `@font-face` in
`BaseLayout.astro` so the URLs carry Astro's `base`:

| File | Axis / weight | Size |
|---|---|---|
| `plex-sans-variable.woff2` | `wght` 100–700 | 45.7 KB |
| `plex-serif-600.woff2` | 600 | 20.5 KB |
| `plex-mono-400.woff2` | 400 | 14.7 KB |
| `plex-mono-500.woff2` | 500 | 14.9 KB |

Sans and Serif are preloaded — both are above the fold. Mono is not; it swaps.

**The variable axis stops at 700.** Anything asking for 800 or 900 gets a synthesised weight, so
those are forbidden.

**No Google Fonts and no third-party font request.** This is a privacy-posture requirement, not a
performance preference, for a firm that sells compliance assessment.

---

## 04 · Logo

### Assets

Twelve SVGs, all transparent, all cropped to the ink bounding box. Clear space lives in CSS.

| | Normal | Reverse | Mono | Mono reverse |
|---|---|---|---|---|
| **Primary** — wordmark + `AI UNTANGLED` | ink + oxide | cream + ember | ink | cream |
| **Secondary** — wordmark alone | ink + oxide | cream + ember | ink | cream |
| **Icon** — the struck `o` | ink + oxide | cream + ember | ink | cream |

On this site: **reverse** everywhere, because the page is ink. Mono variants exist for
single-colour reproduction — embroidery, fax, a client's own template.

### Rules

- Lowercase, always. Never `Knotless`, never `KNOTLESS`.
- The company is **Knotless**. `AI` appears in the tagline, never inside the wordmark.
- Clear space equals the cap height of the `k` on all sides; half the `o` height for the icon.
- The strike sits inside the `o`'s boundary and never extends past it, at any size.
- The strike is present at **every** size. It is not optional below a threshold.
- The strike is never a standalone graphic. The accent rule (§06) is a separate device.
- No containing shape *except* where a platform forces one (iOS, Android, app stores) — then
  specify it rather than pretend it will not happen.
- No effects, no rotation, no stretching, no italicising.

### The strike and the hero intro

`BrandMark.astro` inlines the primary lockup as SVG rather than shipping an `<img>`, because the
hero intro flies a bar onto the strike and an `<img>` cannot be measured from the outside. The
strike therefore carries `data-strike` and is measured with `getBoundingClientRect`.

In the drawn wordmark the visible strike is a **boolean intersection** of a bar with the `o`, so it
is a path with no `width`/`height`/`rx` to read. The SVG therefore also carries an invisible
`<rect data-strike>` at exactly the visible strike's bounding box, purely as the measurement target.

**If the wordmark is ever redrawn, that rect has to move with it.** It is the one place where an
asset and a piece of motion code are coupled.

---

## 05 · Spacing and layout

| Token | Value | Use |
|---|---|---|
| `--spacing-section` | 6rem / 96px | Minor section break |
| `--spacing-section-lg` | 9rem / 144px | Major movement |
| `--spacing-gutter` | 1.5rem / 24px | Page inline padding |
| `--container-prose` | 40rem / 640px | Body prose measure |
| `--container-text` | 48rem / 768px | Wider text blocks |
| `--container-page` | 72rem / 1152px | Page shell |

### Restore the two-tier rhythm

`--spacing-section` is currently defined but never emitted — every section on the site uses the 144px step. When everything is a major movement, nothing is.

**Assign deliberately:** 144px between major movements (hero → argument → proof → close). 96px between related sections inside a movement. If a page has only major movements, it has too few sections or too many.

### Layout rules

- Heroes are **type-led and left-aligned**. On phones the hero fills the first screen so the next section starts below the fold.
- One primary action per page. One reversed Ink panel per page maximum, at the close.
- Prose sits in `--container-prose` inside the page shell. **Do not leave a 738px text column stranded in the left half of a 1152px page** — either widen the container, or give the right side something that earns the space.
- No element may be centred unless there is a reason recorded in the commit.

---

## 06 · Components and states

### The accent rule

A ~3.5rem **ember `#CF5B30`** horizontal rule above a section heading, drawing left-to-right on reveal. **Once per composition.** It echoes the logo strike without reusing it. Ember because it is a mark, not type — see §02.

### Buttons

- Primary: terracotta `#B0461F` fill, cream text, Plex Sans 500, uppercase, +8.5% tracking. Minimum 44px tall. A **fill** is not type, so the fill may carry the brand value; the label on it must clear AA against it.
- Secondary: Ink outline, transparent fill.
- Inverse: for Ink panels.
- **Terracotta is never a button fill.**
- Hover **increases** prominence. It must not invert the fill to the page background.

### Focus

Every interactive element has a visible focus state. Site-wide standard:

```css
:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 4px;
}
```

`outline: none` without a replacement is forbidden anywhere in the codebase. The one exception is `main[tabindex="-1"]`, the skip-link target, where a ring around the whole content area is noise.

### Touch targets

Minimum 44 × 44px for anything tappable. This currently fails on nav links, footer email and phone links, ArrowLink, the footer LinkedIn icon, and TOC links.

### Interaction honesty

**A hover state implies clickability.** Do not apply hover treatments — especially full dark-panel inversions — to non-interactive elements. If a card looks clickable, make it clickable or stop styling it that way.

### Forms

- Every input has a real `<label for>`, correct `type`, correct `autocomplete`.
- Status messages are **visible**, not `sr-only`. Ink text, terracotta left rule.
- Inline errors beside fields, not native validation bubbles.
- White fill on cream page.

---

## 07 · Motion

Restrained and meaningful. Never decorative.

- Sections fade up on entry. **Opacity and transform only** — never animate layout properties.
- The accent rule draws left-to-right.
- The hero types one key word with the strike drawing beneath it.
- Everything disabled under `prefers-reduced-motion`. Nothing essential depends on motion.
- No animation exceeds 400ms.

**Spend motion on claims you can support.** Animating a word the page never substantiates draws attention to the gap.

---

## 08 · Voice and copy

Plain-spoken trusted advisor. The reader is sharp, busy, and tired of being sold to.

### Do

- Plain English. Replace jargon rather than explaining it.
- Lead with the business problem, not the technology.
- Be specific. Name figures, durations, and mechanisms.
- Say "not yet" when it is the right answer.
- Be short. Long copy is not serious copy.

### Do not

- AI hype vocabulary: revolutionary, game-changing, next-gen, cutting-edge, unlock, leverage, supercharge, transform.
- Fear framing. Nobody gets "left behind."
- **Two-beat antithesis.** "AI is complicated. Knotless isn't." This construction is a tell. One instance site-wide, maximum.
- **The negation tic.** "No commitment. No contract." / "No handovers. No account managers." Excellent once. There are currently four on the homepage. **Cap at one per page.**
- Copy about the webpage itself. "If you've read this far" describes our site, not the reader's business.
- Adjective-noun headline shapes that any competitor could also claim.

### Typography of copy

- **Curly apostrophes and quotes throughout.** `'` and `"`, never `'` and `"`. The homepage currently uses straight apostrophes — including in the 108px hero — while every other page uses curly.
- Sentence case for headings. Never title case.
- Australian English: organisation, judgement, recognise.

### What we cannot yet say

Until real engagements exist, the site has **no case studies, no client names, no testimonials, no logos**. This is deliberate and correct. Inventing them would destroy the one thing we sell.

Credibility therefore rests on two things that are true today:

1. **Method transparency.** Showing what an assessment actually produces — the deliverable structure, the scoring lenses, the fact that "not yet" is a valid verdict — is proof of rigour without claiming a track record.
2. **The founders.** Named, with real backgrounds. They are the product right now.

Any worked example that appears on this site must be **unambiguously labelled as illustrative**, never implied to be a client.

### Pricing language

We cannot publish a single price — it varies with firm size, workflow count, and complexity. Do not therefore say nothing. Say the **mechanism**:

> Priced on the size and complexity of your workflows. You'll have the number before the assessment starts, and it doesn't move.

"Fixed price" unanchored to anything, repeated three times, answers nothing.

---

## 09 · Conversion rules

The site's job is booking Fit Calls. These rules are as binding as the visual ones.

- **Never more than three screens without a primary action.** The homepage currently runs from the hero to the closing panel with nothing clickable between.
- **Every section answers a question the reader actually has.** The open ones: what does it cost, how long does it take, what do you actually build, who are you, has anyone bought this.
- **Group the verticals.** There are two — professional services and property management. The eight on the homepage are sub-verticals. Presented as a flat caps grid they read as *we'll take anyone*; grouped under two named verticals the same eight read as focused depth.
- **The founders section must show the founders.** A section headed "Who you'll be talking to" that shows two first names is the weakest moment on the page. Surnames at minimum.
- **Reserve a slot for the pricing calculator.** It is coming and is on-brand for a firm that quantifies value. Structure sections so it can be added without a redesign.

---

## 10 · Deviations from Brand Guidelines v2.1

Recorded so the guidelines can be amended to match.

| # | v2.1 | Here | Reason |
|---|---|---|---|
| 1 | One typeface family across the brand; face mixing forbidden | **IBM Plex superfamily — Serif, Sans, Mono** | One family, three registers. Measured tabular by default across all three, and `I` ≠ `l`. Inter's digits swing 59% |
| 2 | Wordmark set in a typeface | **Drawn** | Set in Inter 600, the wordmark was the default face of every AI product the buyer distrusts. Drawing it breaks the dependency between the logo and the UI type |
| 3 | Wordmark tracking −3% | Drawn, so not applicable | The shipping asset measured +1.9% against a stated −3%. That the two disagreed was the diagnosis: nobody owned the letterforms |
| 3a | Terracotta as the single accent | **Three values of one hue, by job** | Terracotta as type on ink measures 3.27:1 and fails AA. Oxide on light, ember for marks on dark, `#E0764D` for type on dark |
| 4 | Mobile body 14px | 16px | Below comfortable reading size, more so for a serif |
| 5 | "SMEs in professional services and property management" | Size qualifier removed | Open to all business sizes. Vertical focus retained |

---

## 11 · Forbidden

A flat list. Any of these in a diff is a defect.

1. A sixth colour, or any tint, shade, gradient or transparency of the five.
2. Terracotta or ember **as type on the dark ground**. Accent type on ink is `#E0764D` or it does not exist.
3. More than one terracotta element per composition.
4. A typeface other than IBM Plex Serif, Sans or Mono.
5. Plex Mono on running words — labels, nav, eyebrows, prose. Mono is rendered arithmetic only.
5a. Plex Serif below 32px.
5b. A font weight above 700. The variable axis stops there; anything higher is synthesised.
6. Mobile body type below 16px.
7. `outline: none` without a replacement focus style.
8. A hover state on a non-interactive element.
9. Tap targets under 44px.
10. Animating layout properties, or any animation not gated behind `prefers-reduced-motion`.
11. More than one reversed Ink panel per page.
12. Straight apostrophes or quotes.
13. Title-case headings.
14. Any hype word from §08.
15. More than one negation construction per page.
16. Invented proof: fabricated clients, testimonials, metrics, or unlabelled worked examples.
17. Placeholder data reaching production — addresses, ABNs, dead URLs, `TODO confirm` values.
18. Google Fonts or any third-party font request.
19. Centring without a recorded reason.
20. Adding an element where removing one would work.

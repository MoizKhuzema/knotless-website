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

Not a SaaS product site. Not an agency showreel. Not a tech startup. The register is **a printed document set by someone who cared** — an editorial white paper, not a landing page.

---

## 02 · Colour

Five values. No tints, no shades, no transparencies, no gradients, no sixth colour.

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#1F1F1D` | All type, line work, reversed surfaces. Warm near-black, never pure black |
| `--color-terracotta` | `#A04A2C` | Accent only. One per composition |
| `--color-cream` | `#EFE9DD` | Page and default surface |
| `--color-white` | `#FFFFFF` | Form fields and inset panels only. Never a page background |
| `--color-warm-grey` | `#8A8580` | Secondary text, captions, metadata, rules |

`global.css` wipes Tailwind's default palette with `--color-*: initial` before defining these. **Keep that.** It makes off-brand colour literally unavailable, which is the cheapest possible enforcement mechanism.

### Terracotta discipline

Terracotta is a **mark**, not a UI colour. Permitted uses, exhaustively:

- The logo strike
- The accent rule above a section heading (one per composition)
- The tagline in lockup form
- The left rule on a form status message
- Inline text links within body prose

**Never:** a button fill, a background, body type, an icon fill, a hover state, a border on more than one element per view, or any semantic role (error / success / warning). Errors are Ink with a terracotta rule, not terracotta text.

### Combinations

- **Ink on Cream** — the default register. Most of the site.
- **Cream on Ink** — reversed. One panel per page maximum, the closing CTA.
- **Terracotta on Cream** or **on Ink** — accent only.
- **Never:** Terracotta on White, Cream on White, Ink on Terracotta.

---

## 03 · Typography

**This section overrides Brand Guidelines v2.1 §04**, which specifies a single family. The site now uses two.

### The split

| Face | Applies to |
|---|---|
| **Inter** (variable, self-hosted) | Wordmark, h1–h3, nav, buttons, labels, eyebrows, captions, metadata, the industries grid, form labels, footer |
| **Lora** (variable, self-hosted) | Body paragraphs, standfirst/lead lines, pull quotes, legal prose |

### Why two, and why these two

The wordmark is **Inter SemiBold 600 with a custom knot-o** — confirmed by outline overlay, every glyph within 0.5% of Inter 600. Headings therefore cannot leave Inter without orphaning the logo on its own site.

Lora carries the body because an all-Inter page reads as framework default to precisely the audience most primed to notice. Restricting Lora to prose means the serif never appears adjacent to the mark, so the logo relationship stays exact.

**Rule:** Lora must never sit adjacent to the wordmark. Nav, footer and any lockup context stay wholly Inter.

### Scale

Desktop / mobile. Mobile breakpoint is `max-width: 639px`, applied by overriding the tokens — not by adding `sm:` variants at call sites.

| Role | Desktop | Mobile | Face | Weight | Line-height | Tracking |
|---|---|---|---|---|---|---|
| Hero h1 | fluid to 108px | 38px | Inter | 600 | 1.02 | −3.5% |
| Section h2 | 52px | 24px | Inter | 600 | 1.1 | −2% |
| Sub-heading h3 | 22px | 16px | Inter | 600 | 1.5 | −2% |
| Standfirst / lead | 22px | 16px | Lora | 400 | 1.5 | 0 |
| **Body** | **18px** | **16px** | **Lora** | 400 | 1.6 | 0 |
| Pull quote | 28px | 20px | Lora | 400 italic | 1.4 | 0 |
| Content sub-head | 18px | 16px | Inter | 600 | 1.5 | 0 |
| Label / eyebrow / nav | 12px | 11px | Inter | 500 | 1.4 | +8% |
| Tagline (lockup) | — | — | Inter | 500 | — | +15% |
| Caption / metadata | 14px | 13px | Inter | 400 | 1.5 | 0 |

**Mobile body is 16px, not 14px.** The previous 14px was below comfortable reading size, and a serif needs more room than a sans. This is not negotiable downward.

### Measure

Body copy holds **68–70 characters** at desktop.

`--container-prose` must be corrected. It is currently declared `38rem` but never emitted, because `max-w-prose` resolves to Tailwind's built-in `65ch` — producing 84–88 characters at 1440px, well past the target.

Fix by defining an explicit utility rather than relying on `max-w-prose`. Starting value: **40rem (640px)**, then measure and adjust — Lora is wider than Inter, so the Inter-derived 38rem will undershoot.

**Verify empirically at 1440px before accepting.** Report the achieved character count.

Below 640px the container caps the measure and 68 characters is physically unreachable. That is expected; do not compensate by shrinking type.

### Italics

Lora's italics are its strongest feature and give the site an emphasis device it currently lacks — one that is neither bold, nor terracotta, nor a strike.

**Reserve italics for pull quotes and for a single emphasised phrase within a paragraph.** Not for captions, not for UI, not for whole paragraphs.

### Delivery

Both faces self-hosted as variable woff2, subset, preloaded, `font-display: swap`, with a metric-matched fallback. **No Google Fonts CDN and no third-party font request** — this is a privacy-posture requirement, not a performance preference, for a firm that sells compliance assessment.

---

## 04 · Logo

### Assets

All logo SVGs are **transparent and cropped to the ink bounding box**. They no longer carry a baked-in background rect or empty artboard padding. Clear space lives in CSS.

| Variant | Use |
|---|---|
| `wordmark_secondary/Wordmark_Secondary.svg` | Nav and footer, on cream |
| `wordmark_primary/Wordmark.svg` | OG image, lockup contexts where the tagline appears |
| `wordmark_secondary/Reverse_Wordmark_Secondary.svg` | On Ink panels |
| `mark/Reverse_Mark.svg` | Favicons, app icons |

### Rules

- Wordmark is **lowercase, always**. Never `Knotless`, never `KNOTLESS`.
- Clear space equals the cap height of the lowercase `k` on all sides. For the icon mark, half the `o` height.
- Minimum icon mark size: 16px. Below this the strike may not resolve; accept a strikeless knot rather than thickening the strike, which would break the letter-weight-to-strike-weight relationship.
- The strike is never a standalone graphic. The **accent rule** (§06) is a separate device.
- No containing shape, no effects, no rotation, no stretching, no italicising.

### Wordmark metrics — corrected

Brand Guidelines v2.1 states Bold 700 and −3% letterspacing. Both are wrong against the shipping asset.

| | v2.1 says | Measured from SVG |
|---|---|---|
| Weight | Bold 700 | **SemiBold 600** |
| Tracking | −3% | **+1.9%** (open, not tight) |

`--tracking-wordmark: -0.03em` in `global.css` is unused and has the wrong sign. Correct it to `+0.019em` or delete it.

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

A ~3.5rem terracotta horizontal rule above a section heading, drawing left-to-right on reveal. **Once per composition.** It echoes the logo strike without reusing it.

### Buttons

- Primary: Ink fill, cream text, Inter 500, uppercase, +8% tracking. Minimum 44px tall.
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
| 1 | One typeface family across the brand; face mixing forbidden | Inter + Lora | An all-Inter page reads as framework default. Restricting Lora to prose preserves the logo relationship |
| 2 | Wordmark weight Bold 700 | SemiBold 600 | Measured from the shipping SVG |
| 3 | Wordmark tracking −3% | +1.9% | Measured from the shipping SVG |
| 4 | Mobile body 14px | 16px | Below comfortable reading size, more so for a serif |
| 5 | "SMEs in professional services and property management" | Size qualifier removed | Open to all business sizes. Vertical focus retained |

---

## 11 · Forbidden

A flat list. Any of these in a diff is a defect.

1. A sixth colour, or any tint, shade, gradient or transparency of the five.
2. Terracotta as a button fill, background, body type, or semantic state colour.
3. More than one terracotta element per composition.
4. A typeface other than Inter or Lora.
5. Lora in the nav, footer, buttons, labels, or adjacent to the wordmark.
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

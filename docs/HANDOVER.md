# Handover — Knotless AI website

Paste this at the start of a new session. It is what the last session would tell
you if it could, in the order you need it.

Written 21 September 2026, at commit `67a877e`.

---

## 1. Read these first, in this order

1. **`CLAUDE.md`** — the working agreement. Stack, commands, git workflow, and
   three rules that override any design instinct you arrive with.
2. **`DESIGN.md`** — governs every visual decision. **§11 is a flat list of 20
   forbidden things**; anything on it appearing in a diff is a defect, not a
   judgement call. Its §10 records deviations from the brand guidelines.
3. This file.

The three rules that matter most in practice: **DESIGN.md beats any design
skill's default opinion**, **verify every visual change by measurement, not by
eye**, and **subtraction is the default** — a change that removes an element is
probably right, one that adds carries the burden of proof.

---

## 2. Where things stand

| | |
|---|---|
| Repo | `/Users/moizkhozema/Knotless/Website`, remote `MoizKhuzema/knotless-website` |
| Branch | `main` at `67a877e` — the redesign is merged, working tree clean |
| **Unpushed** | `main` is **148 commits ahead of `origin/main`** |
| Deploy | Netlify, already connected, builds `main` automatically on push |
| Blocker | `git push` returns 403. The user's fine-grained PAT has **Contents: Read** but not **Read and write**. Their account has `admin: true` on the repo and `main` is unprotected — it is purely the token. Fix: re-auth with `gh auth login --web`, or add Contents: Read and write to the token. |

So: **the site is built and merged but not live.** Confirm the push landed
before assuming anything about production.

---

## 3. The design system as actually built

Tokens live in `src/styles/global.css` (`@theme` + layers). No
`tailwind.config.js`. Utility classes have been removed from every page that has
been rebuilt — the remaining pages use scoped `<style>` blocks.

### Layout

- `--vw` is JS-set from `clientWidth`, because `100vw` includes the scrollbar.
- `--page-x`, `--content-w`, `--grid-cell`, `--grid-cols` (**4 / 9 / 15** by
  breakpoint). **The odd column counts are load-bearing**: two cards with a
  one-cell gap need `(n−1)/2` whole cells each, which is only integral when `n`
  is odd. Do not "tidy" them to 4/8/16.
- `--main-clear` = `--nav-space` + `clamp(3rem, 5vw, 4.5rem)` — the one figure
  for "the bar, plus the air a page wants under it". `main`'s padding, the
  homepage hero and every full-screen hero read it. Three copies of that clamp
  is how the numbers drifted apart last time.

### Heroes

Every hero that holds the screen uses `min-height: calc(100svh - var(--main-clear))`.

- **`svh`, not `lvh` or `dvh`.** `svh` is the viewport with browser chrome
  showing, which is the state a page loads in.
- Air above the headline is **gated by height**: none under 48rem wide or 46rem
  tall, more above 50rem. On a phone that air comes straight out of the content
  at the bottom.
- **Type steps down by HEIGHT under 50rem, not by width.** A laptop is a wide
  screen and a short one — a 1440×900 display is a 1440×760 viewport once the
  browser takes its chrome, and height is the constraint that actually binds.

### Materials and devices

| device | where it is spent |
|---|---|
| Glass (`--color-glass-soft*`, blur 14px, hairline edge, inset specular, **no drop shadow**) | vignette cards, /about's delivery pane, /contact's field boxes, bullet beads |
| Cursor-light catchers (`data-catch="ring｜line｜dot"`) | every rule, card edge and bead on the site |
| Reveal (`[data-reveal]` + `.r` + `--i` stagger) | every section |
| `.rule-thread` | the measured hairline that opens a section |
| Ruled schedule (mono index + full-width rules) | /what-we-do implementation, legal contents |
| Spec band (label/value between two rules) | /what-we-do Assessment |
| Reversed cream panel | **one per page maximum** (§11.11) — the closing CTA |

**Do not repeat a device on a page that already uses it.** The user rejected the
two-pane grid explicitly: "The 2 box structure is over used. We already used it
twice on homepage." Each section should take the shape its own content asks for.

### Accents

Terracotta is a **mark**, not a UI colour. **The user chooses where it goes** —
they said so directly. Currently spent on:

- `/what-we-do` — the spec band's three labels; the ledger's `01–07`
- `/privacy`, `/terms` — the contents indices; inline links in body prose
- every page — the CTA button fill

§11.3 allows **one terracotta device per composition**. A repeated set (three
labels, seven indices) counts as one device. Ember on ink measures **4.83:1** at
13px — over the floor, but only just, so do not go smaller.

---

## 4. Page by page

| page | state |
|---|---|
| `/` | Rebuilt. 100svh hero anchored bottom-left; "What you get" two glass stages with connector; founders; cream close. |
| `/what-we-do` | Rebuilt. Hero **merged with the questions** — headline, standfirst, question line, and a continuously drifting row of six glass quote cards, all on one screen. Then the Assessment (spec band + threaded statements), Implementation (ruled schedule), cream close. |
| `/about` | Rebuilt. Hero carries the whole argument: headline, two ruled columns of observation, conclusion in cream. Then "How we deliver" (statement + glass pane), cream close. |
| `/contact` | Rebuilt. Hero does **not** hold the screen — the form is the point and must be visible on load. Three glass fields: Name, Work email, Company website. |
| `/privacy`, `/terms` | Rebuilt via `LegalDoc.astro`. Title, ruled two-column contents schedule, document body. **Not a word of either document was changed.** |
| `/404` | **Not rebuilt.** Still utility classes and the old `hero-screen` pattern. |
| `/lab` | Motion harness. **Not governed by DESIGN.md.** Never link it. It ships publicly at `/lab/` behind noindex + robots + sitemap exclusion. |

### The carousel on /what-we-do

Worth understanding before touching: one rAF owns `scrollLeft`; the drift is a
constant 18px/s; the arrows top up an eased `offset` budget rather than calling
`scrollBy`; the six cards are rendered **twice** (the copy `aria-hidden`) and the
position wraps at exactly one set's width. Scroll-snap is **off** — mandatory
snapping fights a continuous drift every frame — and goes back on only under
`prefers-reduced-motion`, where there is no drift to fight. Arrows are hidden
under 48rem.

---

## 5. Traps that cost the last session real time

1. **Scoped-style cascade order.** In an Astro `<style>` block, a media query at
   equal specificity **loses to a later base rule**. This silently did nothing
   three separate times. Declare `@media` overrides **after** the rules they
   override, and verify by reading the computed value, not by reading the diff.
2. **`ch` is the width of a zero**, which in Inter is ~0.63em, while the average
   character is nearer 0.5em. `62ch` sets about **77** characters, not 62. The
   site's prose measure is **52ch ≈ 69 characters**. Measure characters per
   line; do not trust the unit.
3. **`getComputedStyle().font` returns empty in Chrome.** Read `fontFamily`,
   `fontSize`, `fontWeight` separately. A broken probe once produced a confident,
   completely inverted recommendation.
4. **JSX whitespace.** A newline between a `<span>` and the text after it emits a
   real space — "pay back . It starts". Keep inline splits on one line. Same
   trap as `<wbr>`.
5. **`Range.getClientRects()` returns one rect per fragment**, not per line.
   Count **distinct line tops**.
6. **The Browser pane throttles rAF and IntersectionObserver when hidden.** A
   section can look unrevealed there and be fine in reality. Verify with a real
   Playwright run.
7. **Astro scoped styles never reach `set:html` content** — that is why
   `.legal-prose` is global.
8. **`scrollLeft` is quantised to whole pixels**, so a fractional loop period
   lands within half a pixel. Keep the float and round only at write time.
9. **Playwright `request.postData()` can return null** where the `request` event
   gives you the body. Use the event.
10. **Prettier is not a dependency.** `npx prettier` fetches it and its defaults
    fight the codebase (single → double quotes). The project has no formatter.

---

## 6. How to verify

Playwright is installed. The pattern that worked: write a throwaway `.mjs` in
the scratchpad, import Playwright **by absolute path**
(`/Users/.../node_modules/playwright/index.mjs`), drive the real dev server on
`http://localhost:4321`, print numbers.

Measure, every time:

- **Fold** — for a full-screen hero, the next section's top must be ≥ the fold at
  1920×1080, 1440×900, 1440×760, 1440×700, 1280×800, 1024×768, 768×1024,
  430×932, 414×896, 390×844, 375×667.
- **Characters per line** — per rendered line, by walking character offsets and
  grouping by rect top. Target 68–70.
- **Contrast** — WCAG relative luminance against the composited ground. The
  floor is 4.5:1; the site mostly runs 7.11 and 16.17.
- **Tap targets** — 44px minimum (§11.9).
- **Horizontal overflow** — `scrollWidth - innerWidth` must be 0.
- **Console errors** — must be empty.
- **Nav ground sensing** — scroll the page and confirm `.nav` reports both
  `dark` and `light` (it samples real pixels behind the capsule).

`npm run check` must be 0 errors before any commit, and `npm run build` must be
clean.

---

## 7. Open items — decisions the user has not made yet

- **`/404` has not been rebuilt.** It is the only page still on utility classes.
- **The footer's LinkedIn row points at the homepage** (`companyLinkedinUrl` is
  empty). It reads as a broken link to anyone who clicks it.
- **Three `SITE` values are declared and rendered nowhere**:
  `deliveryLocations`, `privacyActWording`, `registeredAddress`. The first two
  were surfaced on the old `/what-we-do`; the third was deliberately emptied and
  its line cut from both legal documents.
- **`/about` blows the negation budget.** §11.15 allows one negation
  construction per page; the supplied copy carries **ten**. Set verbatim as a
  recorded exception in `src/data/about.ts` — three or four could go without
  touching the argument. The user has not been asked to cut them.
- **`/what-we-do` and `/about` run past the fold at 375×667 and below.** A
  headline, a long standfirst and a card row do not fit a 667px screen in any
  arrangement. Accepted, not solved.
- **`/contact` requires all three fields.** A prospect without a website is
  blocked. Nobody has decided whether that is right.
- **The four old `/what-we-do` FAQs were deleted** in the rebuild (price,
  effort, who you deal with, what happens to your information). Only the first
  two partly survive, in the spec band.
- **The `/about` and `/what-we-do` section-closing links are no longer
  parallel** ("What we do" vs "Read more about us").
- **Homepage meta description still says "in the first year"** while the hero no
  longer does. Deliberate — a search result has one line and no page around it —
  but flagged.

---

## 8. How this user works

- **Terse numbered lists.** Each number is a separate instruction; answer all of
  them, and say plainly when one needs no change rather than inventing one.
- **They will tell you when something looks wrong before they can say why.**
  "Seems like html not rendered properly" meant *this has no structure*, not
  *fix the colour*. Diagnose the cause, do not patch the symptom.
- **They iterate on position and scale** — "bring it down", "bring it down
  more". Expect two or three rounds and measure the remaining headroom so you
  can say when the next step would cost something.
- **They reject aside/margin layouts for headings.** A heading must outrank its
  list and sit **above** it, not beside it.
- **They dislike "just paragraphs".** Prose needs structure — rules, panes, a
  size step — or they will say it looks bad.
- **They choose the accents.** Do not add terracotta unprompted; propose and
  wait.
- **They supply copy verbatim and mean it.** Format it, split it for typography,
  but do not rewrite it. Flag rule violations (negation budget) rather than
  silently fixing them.

One more thing the last session learned the hard way: **when a change appears to
do nothing, measure before re-editing.** Three of this project's longest
detours were edits that were silently overridden — by cascade order, by a
removed media block, by a broken probe — and in every case the code looked
right.

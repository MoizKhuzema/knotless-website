# Visual baseline

Full-page screenshots of every route, captured as a "before" reference for the
redesign. Structural comparison is the purpose — layout, rhythm, section order,
what appears at each breakpoint — not type or colour fidelity.

## Capture conditions

| | |
|---|---|
| **Captured at commit** | `c2b0bde5a4739b6e2958e3c4f4bc5bea972d2d20` (`c2b0bde`, branch `redesign`) |
| **Date** | 15 September 2026 |
| **Source** | Production build — `npm run build`, served by `astro preview` on `localhost:4321` |
| **Viewport widths** | 390px (phone) and 1440px (desktop) |
| **deviceScaleFactor** | `1` — 1 image pixel per CSS pixel, so PNG dimensions equal the CSS dimensions |
| **Motion** | `reducedMotion: 'reduce'` (see below) |
| **Browser** | Chrome for Testing 153 via `playwright-core`, headless |

The working tree was clean at `c2b0bde` when these were taken, so the images
correspond exactly to that commit's source.

### Why the build, not the dev server

`astro dev` does not serve `src/pages/404.astro` — it substitutes its own
`404: Not Found`. Only a production build emits `404.html` and serves the
branded page. The dev toolbar would also overlay every shot.

### Why reducedMotion is forced

Two of the site's motion systems would otherwise make full-page captures
unusable:

- **`[data-reveal]` scroll-reveal.** These elements sit at `opacity: 0` until an
  IntersectionObserver marks them `.is-visible`. In a full-page screenshot,
  everything that never entered the viewport stays blank.
- **The typewriter headings** (`.emph-type`, and the homepage hero's `worth`).
  These type in over roughly a second, so an un-waited capture catches a
  half-written headline.

Under `prefers-reduced-motion: reduce`, `BaseLayout`'s inline scripts
short-circuit: reveals are marked visible immediately and the typed words render
already resolved with their terracotta strike drawn. That is the same end state
a visitor sees once motion settles, but deterministic and re-shootable. The
capture script additionally force-adds `.is-visible` to every `[data-reveal]` as
a backstop, and awaits `document.fonts.ready` so Inter has swapped in before the
shot (otherwise the metric-matched Arial fallback renders).

## Files

One image per route per width, named `<route>-<width>.png`:

| Route | 390px | 1440px |
|---|---|---|
| `/` | `home-390.png` | `home-1440.png` |
| `/about/` | `about-390.png` | `about-1440.png` |
| `/what-we-do/` | `what-we-do-390.png` | `what-we-do-1440.png` |
| `/contact/` | `contact-390.png` | `contact-1440.png` |
| `/privacy/` | `privacy-390.png` | `privacy-1440.png` |
| `/terms/` | `terms-390.png` | `terms-1440.png` |
| `404.html` | `404-390.png` | `404-1440.png` |

Plus a variant pair:

| | |
|---|---|
| `what-we-do-faqopen-390.png` / `-1440.png` | `/what-we-do/` with all four FAQ `<details>` forced open. The plain `what-we-do-*` pair shows the true default state (collapsed); this pair shows the full content. |

Note the `/contact/` captures show the **form** state. The success state is
hidden until a successful submit and is not represented here.

## Reproducing

```bash
npm run build
npx astro preview --port 4321
```

Then drive it with `playwright-core` (installed with `npm install --no-save
playwright-core` so it stays out of `package.json`), pointing `executablePath` at
the cached Chrome for Testing binary under
`~/Library/Caches/ms-playwright/`. Context options that matter:
`deviceScaleFactor: 1`, `reducedMotion: 'reduce'`, `fullPage: true`.

## Known token defects

Found by measuring the rendered homepage against the built CSS at the commit
above. All three are **present in these baseline images** — they are part of the
"before" state, not capture artifacts. None is fixed as of this commit.

### `--container-prose` is never emitted

[`src/styles/global.css`](../../src/styles/global.css) defines
`--container-prose: 38rem` (608px), commented "~68–70 chars at 18px body". It
does not reach the output. The built CSS compiles:

```css
.max-w-prose{max-width:65ch}
```

`max-w-prose` is a **static built-in Tailwind utility** and does not read the
`--container-*` scale, so the token is dropped. Its siblings do work —
`.max-w-text` and `.max-w-page` compile to `var(--container-text)` /
`var(--container-page)` and measure 768px and 1152px exactly.

Measured consequence at 1440px: prose-capped paragraphs render at **738px wide,
84–88 characters per line**, against the documented 68–70 target. Every body
measure on the homepage sits above the intended line length. Hero subhead is
72 CPL (22px type in a 768px `max-w-text` measure).

### `--spacing-section` is never emitted

`global.css` defines both `--spacing-section: 6rem` (96px) and
`--spacing-section-lg: 9rem` (144px). Only `section-lg` appears in the built
CSS; no utility references the 6rem step.

Measured consequence: **every section on the homepage uses 144px** padding-top
(the hero excepted — 112px at 1440px, and 0 at 390px where `.hero-screen`
flex-centres against `min-height: calc(100dvh - 6rem)`). The intended two-tier
rhythm — 6rem between sections, 9rem between major movements — is currently one
tier.

### Page shell clears the nav by 1px too little

`BaseLayout`'s shell applies `pt-24` (96px). The fixed nav measures **97px** tall
at both 390px and 1440px (logo `h-14` + `py-5` + the 1px `border-b`), leaving a
1px shortfall.

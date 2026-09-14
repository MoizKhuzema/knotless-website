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

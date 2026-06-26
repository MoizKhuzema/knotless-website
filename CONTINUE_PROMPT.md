# Knotless AI marketing site — session handoff prompt

Continue work on the Knotless AI marketing site. Read this whole brief before doing anything.

## Project
- Astro static site + Tailwind v4, deployed to GitHub Pages (sub-path `/knotless-website`, `BASE_PATH` env-driven). Output is directory format (`/foo/index.html`), `trailingSlash: 'always'`.
- **Always work on branch `claude/inspiring-cerf-egxogk`.** `git pull origin claude/inspiring-cerf-egxogk` at the start of each task. Commit + push after each change. Do NOT open a PR unless I explicitly ask. Do NOT put the model identifier in commits/code.
- Propose ideas first and WAIT for my approval before building anything I didn't explicitly request.

## Brand constraints (do not violate)
- Palette = EXACTLY five values: Ink `#1F1F1D`, Terracotta `#A04A2C` (single accent per composition; I've relaxed "never in body" to allow emphasis `<strong>`), Cream `#EFE9DD`, White (UI surfaces only), Warm grey `#8A8580` (hairlines/icons only, not body text).
- Inter only; hierarchy via weight + size.
- No gradients/tints/transparencies. One exception: the faint paper grain (baked into `body` background-image in global.css — do NOT reintroduce a separate grain overlay div; it caused an iOS Safari repaint bug that ghosted content over the nav).
- Tokens live in `src/styles/global.css` `@theme`. Site-wide values live in `src/config/site.ts`. Page copy lives in `src/data/*.ts`.

## Key files
- `src/pages/what-we-do.astro` — the /what-we-do page (intro w/ typewriter "product.", "Sound familiar?" vignettes, stages `<details>` accordion, "We build it" process strip + fork + who-does-the-work, FAQs accordion, reversed-Ink final CTA).
- `src/data/whatWeDo.ts` — all /what-we-do copy.
- `src/components/hero/HeroVisual.astro` — homepage hero (two-line headline, typewriter "worth", knot→arrow untangle visual that scrolls to #assessment).
- `src/components/AssessmentSection.astro` — homepage stages (ghost numerals, Ink-flip hover rows, "thread").
- `src/components/Nav.astro` — fixed nav (not sticky), hamburger on mobile.
- `src/layouts/BaseLayout.astro` — shell (`pt-24` clears fixed nav), scroll-reveal + typewriter scripts.
- `src/lib/href.ts` — base-aware internal links (adds trailing slash to routes).

## Responsive rule
**Nothing should change on desktop.** Make mobile/iPad fixes with `sm:`-prefixed reverts (≥640px must stay identical to the prior design). iPad ≈ 768, mobile ≈ 390. Test both.

## Visual-check workflow
1. `npm run build`
2. `npx astro preview --port 4321 &`
3. Screenshot with playwright-core + sharp (already in node_modules but NOT in package.json — they're temp deps, so they won't be committed). Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Force-reveal before shooting: `document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-visible'))`. Stack crops into one image <2000px to view.
4. Remove any temp script (e.g. `_shot.mjs`) before committing.

## State as of this handoff (all pushed to `claude/inspiring-cerf-egxogk`)
- Homepage: hero untangle animation, two-line headline, downward scroll arrow in right half; Assessment section ghost numerals + Ink-flip rows + thread; accent rules draw in on scroll; consistent full-width hairlines; full mobile/iPad pass (hamburger, no nav bleed, even industry spacing, touch read-more arrows straighten).
- /what-we-do: built from content brief, linked from homepage nav + Assessment "Read more". Intro typewriter on "product." (no strike). Vignettes have Ink-flip hover. Stages + FAQs are `<details>` accordions. "We build it" = process strip merged in as lead-in (no hairline under it, "Build" in terracotta) + two-outcomes fork ("If it isn't" / "If it is") + "Who does the work" bullets.
- JUST COMPLETED: /what-we-do mobile pass — vignettes compacted on phones; process strip now wraps as a breadcrumb (`Fit Call › Assessment › Findings › Build…`) on mobile, stays the stretched arrow row at sm+. Mobile height ~7800→~6840px. iPad/desktop unchanged.

## Possible next steps (NOT yet approved — propose before building)
- Remove now-unused `deliveryLocations` from `src/config/site.ts` (the delivery line is verbatim in whatWeDo.ts).
- Open-first-stage / hash-auto-open behavior on the stages accordion.
- Deferred ideas from earlier brainstorms: credibility strip + deliverable mock (C+E), duotone founder portraits (needs real headshots), animated accent rules (F+G).
- Several PLACEHOLDER values remain in site.ts (abn, address, LinkedIn URLs, founder confirmations) — flag, don't invent.

## My next task
<describe what you want here>

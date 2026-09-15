# CLAUDE.md

## What this is

The marketing website for **Knotless AI** — an Adelaide firm that quantifies what AI is worth in
a business, then builds only what pays back. Five pages, two founders, no case studies yet.
Static, no backend, no CMS. The register is a printed document, not a landing page.

## Stack

- **Astro 5** — static output (`dist/`), no SSR adapter
- **Tailwind v4** via `@tailwindcss/vite` — configured entirely in `src/styles/global.css`
  (`@theme` block), not a `tailwind.config.js`
- **TypeScript** (`astro check`); **Fontsource** for self-hosted variable woff2 — never a Google
  Fonts CDN request, a privacy requirement for a firm selling compliance work
- Deploys to Netlify from `dist/`; a GitHub Pages path exists via `SITE_URL` / `BASE_PATH`

## Commands

```bash
npm run dev        # dev server, http://localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the built dist/
npm run check      # astro check — must be 0 errors before any commit
```

## Structure

```
DESIGN.md              governing design system — read before any visual work
docs/baseline/         pre-redesign screenshots, 1440 + 390, per page
docs/archive/          superseded snapshots — historical context, not live briefs
scripts/screenshot.mjs `npm run shot` — visual verification, rule 2
content/               source copy as delivered by the client
src/
  config/site.ts       site-WIDE values: legal entity, founders, contacts, domains
  data/*.ts            page CONTENT, one file per page
  styles/global.css    ALL design tokens (@theme) + base/component layers
  layouts/             BaseLayout — head, fonts, nav/footer shell
  components/          shared primitives + components/home/ for homepage sections
  pages/               file-based routes
  lib/href.ts          internal links go through this so `base` is respected
  legal/               privacy + terms markdown
  assets/              logo SVGs, Inter woff2
public/                favicons, OG image, static files
```

Copy lives in `src/data/`, never inline in a component. Tokens live in `global.css`, never as a
magic number at a call site.

## Git workflow

- **Never commit to `main`.** Work on a branch; `main` is the deploy source.
- **Small commits.** One logical change each. A visual change and a refactor are two commits.
- **Conventional commit messages**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`.
- If a change **adds** an element, colour, font size or sentence, the justification goes in the
  commit message. Removals need no justification. (See rule 3.)
- Run `npm run check` before committing.

## Rules

### 1. DESIGN.md governs every visual decision

`DESIGN.md` is the authority on colour, type, spacing, components, motion and copy. It supersedes
the Knotless Brand Guidelines v2.1 where they conflict (deviations are recorded in its §10).

**It also overrides any design skill's default opinion.** If a skill wants a gradient, a fifth
font size, a card grid, a hero image, an accent colour or a shadow, and `DESIGN.md` says no —
`DESIGN.md` wins, without asking. Skills supply technique, not taste, on this project.

`DESIGN.md` §11 is a flat list of 20 forbidden things. Anything on it appearing in a diff is a
defect, not a judgement call.

### 2. Verify every visual change with a screenshot before calling it done

No visual change is finished because the code looks right. Screenshot it, look at it, then say
it is done. Check **1440px and 390px** — the mobile breakpoint is `max-width: 639px` and is
driven by token overrides, so a desktop-only check proves nothing about phones.

Playwright is **not yet a dependency**. Add it before relying on this rule:

```bash
npm install --save-dev playwright && npx playwright install chromium
```

Compare against `docs/baseline/` to see what actually changed. When `DESIGN.md` asks for an
empirical check (e.g. the prose measure), report the measured number, not the intended one.

### 3. Simple is the lead pillar — default to subtraction

Of the three pillars (Simple, Honest, Safe), **Simple is load-bearing**. The reader is a busy
principal who has stopped taking AI demos. Every element must earn its place.

**Prefer removing to adding.** A change that deletes an element, a colour, a size or a sentence
is probably right. A change that adds one carries the burden of proof. When a section feels
weak, the first question is what to cut, not what to add. "Adding an element where removing one
would work" is forbidden (§11.20).

## Known trap

`--container-prose` is **declared but never emitted**. `max-w-prose` resolves to Tailwind v4's
built-in `65ch` — measured at 738px / **87 characters** on the live homepage, well past the
68–70 target. Do not assume a `--container-*` token is live because a `max-w-*` class exists;
check the computed value.

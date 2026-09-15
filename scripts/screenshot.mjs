/**
 * Visual verification for CLAUDE.md rule 2: no visual change is done until it
 * has been screenshotted and looked at, at BOTH widths.
 *
 * The two widths are not arbitrary. The mobile breakpoint is `max-width: 639px`
 * and is applied by overriding tokens in global.css, not by `sm:` variants at
 * call sites — so a desktop-only capture proves nothing whatsoever about how
 * the page renders on a phone.
 *
 * Usage (dev server must already be running — `npm run dev`):
 *
 *   npm run shot                    # every route, both widths
 *   npm run shot -- /about /        # just these routes
 *   npm run shot -- --out docs/baseline   # overwrite the baseline set
 *   npm run shot -- --motion /      # scroll-state capture, motion ENABLED
 *
 * Output lands in tmp/shots/ by default, named `<route>-<width>.png` to match
 * the convention already used by docs/baseline/, so the two sets diff by name.
 *
 * --motion exists because the default capture CANNOT photograph a
 * motion-gated state. It runs with reduced motion on (see below), so anything
 * the site deliberately disables under `prefers-reduced-motion` — the nav
 * wordmark reveal, for one — is captured in its resolved, reduced-motion form
 * and the actual behaviour never appears. A screenshot that can only ever show
 * one state does not verify a two-state feature.
 *
 * So --motion flips three things: motion is enabled, reveals are left to fire
 * on their own rather than being forced visible, and each route is captured as
 * a VIEWPORT shot at three scroll positions instead of one full-page shot:
 *
 *   <route>-<width>-top.png        at the top of the page
 *   <route>-<width>-scrolled.png   scrolled past the hero brand mark
 *   <route>-<width>-back.png       scrolled back to the top
 *
 * The third is not redundant. A reveal that latches — fires once and never
 * reverses — looks identical to a correct one until you scroll back up, and
 * `back` is the only frame that tells those two apart.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.SHOT_BASE ?? 'http://localhost:4321';
const WIDTHS = [1440, 390];
const ROUTES = ['/', '/what-we-do', '/about', '/contact', '/privacy', '/terms'];

// Long enough for the longest transition on the site to settle. DESIGN.md §07
// caps animation at 400ms, so 450 clears any of them with room to spare.
const SETTLE_MS = 450;

const argv = process.argv.slice(2);
const motion = argv.includes('--motion');
const outFlag = argv.indexOf('--out');
const outDir = outFlag === -1 ? 'tmp/shots' : argv[outFlag + 1];
// Guard the -1 case: without it, `outFlag + 1` is 0 and silently eats the
// first route argument.
const routes = argv.filter(
  (a, i) => !a.startsWith('--') && !(outFlag !== -1 && i === outFlag + 1),
);

const slug = (route) => (route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
// astro.config sets `trailingSlash: 'always'`, so '/about' is a 404 — normalise
// rather than making every caller remember the slash.
const normalise = (route) => (route.endsWith('/') ? route : `${route}/`);

const browser = await chromium.launch();
await mkdir(outDir, { recursive: true });

for (const route of routes.length ? routes : ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
      // Reveals are IntersectionObserver-driven and unobserve after firing, so
      // scrolling a full-page capture into position is unreliable — a single
      // jump can skip the middle of a long page and photograph it blank.
      // Under reduced motion BaseLayout marks every [data-reveal] visible up
      // front, which is both deterministic and a state the site must support.
      // --motion deliberately gives that up: it captures the viewport at fixed
      // scroll positions, where letting the reveals fire for real is the point.
      reducedMotion: motion ? 'no-preference' : 'reduce',
    });
    const url = new URL(normalise(route), BASE).href;
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    if (!res?.ok()) throw new Error(`${url} returned ${res?.status()}`);

    // Webfonts must be settled before capture or the shot records the
    // fallback's metrics, which is exactly the thing being checked.
    await page.evaluate(() => document.fonts.ready);

    // The dev-server toolbar floats over the page and would otherwise appear
    // in the middle of every capture.
    await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });

    if (motion) {
      // Scroll far enough that the hero brand mark clears the fixed nav. Routes
      // with no sentinel still get a useful "scrolled" frame from the fallback.
      const past = await page.evaluate(() => {
        const mark = document.querySelector('[data-brand-sentinel]');
        if (!mark) return window.innerHeight * 1.5;
        const nav = document.querySelector('.site-nav');
        return window.scrollY + mark.getBoundingClientRect().bottom + (nav?.offsetHeight ?? 96) + 40;
      });

      for (const [state, y] of [['top', 0], ['scrolled', past], ['back', 0]]) {
        await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), y);
        await page.waitForTimeout(SETTLE_MS);
        const file = path.join(outDir, `${slug(route)}-${width}-${state}.png`);
        await page.screenshot({ path: file }); // viewport only, not fullPage
        console.log(file);
      }
      await page.close();
      continue;
    }

    // Belt and braces: if reduced motion ever stops being honoured, this still
    // resolves the reveals rather than silently photographing a blank page.
    await page.evaluate(() =>
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')),
    );

    const file = path.join(outDir, `${slug(route)}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await page.close();
  }
}

await browser.close();

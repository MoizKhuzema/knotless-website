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
 *
 * Output lands in tmp/shots/ by default, named `<route>-<width>.png` to match
 * the convention already used by docs/baseline/, so the two sets diff by name.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.SHOT_BASE ?? 'http://localhost:4321';
const WIDTHS = [1440, 390];
const ROUTES = ['/', '/what-we-do', '/about', '/contact', '/privacy', '/terms'];

const argv = process.argv.slice(2);
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
    });
    const url = new URL(normalise(route), BASE).href;
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    if (!res?.ok()) throw new Error(`${url} returned ${res?.status()}`);

    // Webfonts must be settled before capture or the shot records the
    // fallback's metrics, which is exactly the thing being checked.
    await page.evaluate(() => document.fonts.ready);

    // Reveal animations are IntersectionObserver-driven; without this the
    // capture is full of elements still at opacity 0.
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
    });

    const file = path.join(outDir, `${slug(route)}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await page.close();
  }
}

await browser.close();

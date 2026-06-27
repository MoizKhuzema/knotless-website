// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/config/site';

// Static marketing site. Astro's default output is `static`, which is exactly
// what Netlify serves from the `dist/` folder (see netlify.toml). No SSR
// adapter is needed for a purely static build.
//
// `site` and `base` are env-driven so the same code serves three targets:
//   - local dev / Netlify / custom domain → root (defaults below)
//   - GitHub Pages project site → sub-path, set via SITE_URL + BASE_PATH in
//     .github/workflows/deploy.yml
// Internal links go through src/lib/href.ts so they respect `base`.
const SITE_URL = process.env.SITE_URL ?? `https://${SITE.primaryDomain}`;
const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // Pages build as directories (/what-we-do/index.html); emit trailing-slash
  // URLs to match, so internal links resolve directly on GitHub Pages without
  // relying on a 301 redirect.
  trailingSlash: 'always',
  // Auto-generated XML sitemap (sitemap-index.xml + sitemap-0.xml), built from
  // `site` above (the primaryDomain by default). robots.txt points crawlers to
  // it. lastmod is stamped at build; the 404 page is excluded.
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

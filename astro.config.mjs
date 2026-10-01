// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/config/site';

// Static marketing site. Astro's default output is `static`, which is exactly
// what Netlify serves from the `dist/` folder (see netlify.toml). No SSR
// adapter is needed for a purely static build.
//
// `site` and `base` default to the primary domain at the root, which is what
// Netlify serves. They stay env-overridable (SITE_URL, BASE_PATH) for a build
// to another host or sub-path — and any build whose host is not the primary
// domain comes out noindexed, with a Disallow-all robots.txt, so a copy can
// never compete with the real site in search. Internal links go through
// src/lib/href.ts so they respect `base`.
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
  // it. The 404 page is excluded.
  integrations: [
    sitemap({
      // 404 is the only route worth keeping out: it resolves, so it would be
      // listed as a page of the site otherwise.
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

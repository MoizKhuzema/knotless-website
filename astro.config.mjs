// @ts-check
import { defineConfig } from 'astro/config';

import { SITE } from './src/config/site';

// Static marketing site. Astro's default output is `static`, which is exactly
// what Netlify serves from the `dist/` folder (see netlify.toml). No SSR
// adapter is needed for a purely static build.
//
// `site` is set from our single config file so Astro can generate absolute
// URLs (sitemap, canonical links, etc.) without duplicating the domain here.
export default defineConfig({
  site: `https://${SITE.primaryDomain}`,
});

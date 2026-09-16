/**
 * /robots.txt — generated so the Sitemap URL tracks `site` (the primaryDomain
 * from site.ts by default). Allows all crawlers, with an explicit AdsBot-Google
 * group (AdsBot ignores the wildcard `User-agent: *`, so it must be named).
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = [
    'User-agent: *',
    'Allow: /',
    // /lab/ is a motion harness, not a site page. Also excluded from the
    // sitemap and carrying its own noindex meta.
    'Disallow: /lab/',
    '',
    '# AdsBot ignores the wildcard group above, so allow it explicitly.',
    'User-agent: AdsBot-Google',
    'Allow: /',
    'Disallow: /lab/',
    '',
    'User-agent: AdsBot-Google-Mobile',
    'Allow: /',
    'Disallow: /lab/',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

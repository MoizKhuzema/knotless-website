/**
 * /robots.txt — generated so the Sitemap URL tracks `site` (the primaryDomain
 * from site.ts by default). Allows all crawlers, with an explicit AdsBot-Google
 * group (AdsBot ignores the wildcard `User-agent: *`, so it must be named).
 */
import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

export const GET: APIRoute = ({ site }) => {
  // Any build that is not the primary domain is a duplicate: keep it out.
  if (site?.hostname !== SITE.primaryDomain) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AdsBot ignores the wildcard group above, so allow it explicitly.',
    'User-agent: AdsBot-Google',
    'Allow: /',
    '',
    'User-agent: AdsBot-Google-Mobile',
    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

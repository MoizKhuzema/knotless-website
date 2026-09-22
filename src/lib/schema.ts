/**
 * JSON-LD (schema.org) builders, driven from src/config/site.ts.
 *
 * Each builder returns a plain node; pages compose them into a connected
 * `@graph` via `graph()` and pass the result to BaseLayout's `schema` prop,
 * which serialises it into a <script type="application/ld+json"> tag.
 *
 * Cross-references use stable @ids anchored to the site origin (e.g.
 * `https://knotless.com.au/#organization`), so nodes on different pages all point at
 * the single canonical Organization/WebSite defined on the homepage.
 *
 * `site` is the absolute origin (Astro.site.origin, e.g. "https://knotless.com.au").
 */
import { SITE } from '../config/site';

export const SCHEMA_LANG = 'en-AU';

const trimSlash = (s: string) => s.replace(/\/+$/, '');

/** Organization (as a ProfessionalService) — the canonical business node. */
export function organization(site: string) {
  const root = trimSlash(site);
  return {
    '@type': 'ProfessionalService',
    '@id': `${root}/#organization`,
    name: SITE.legalEntityName,
    url: `${root}/`,
    email: SITE.contactEmail,
    image: `${root}/og-default.png`,
    slogan: SITE.tagline,
    address: { '@type': 'PostalAddress', addressCountry: 'AU' },
    areaServed: { '@type': 'Country', name: 'Australia' },
    // Only claim a profile we've confirmed — an unresolvable sameAs is worse
    // than none, since it's an explicit identity assertion to crawlers.
    ...(SITE.companyLinkedinUrl ? { sameAs: [SITE.companyLinkedinUrl] } : {}),
  };
}

/** WebSite node, published by the Organization. */
export function website(site: string) {
  const root = trimSlash(site);
  return {
    '@type': 'WebSite',
    '@id': `${root}/#website`,
    url: `${root}/`,
    name: SITE.legalEntityName,
    inLanguage: SCHEMA_LANG,
    publisher: { '@id': `${root}/#organization` },
  };
}

/** A WebPage node, part of the WebSite and about the Organization. */
export function webPage(
  site: string,
  opts: { url: string; name: string; description: string },
) {
  const root = trimSlash(site);
  return {
    '@type': 'WebPage',
    '@id': `${trimSlash(opts.url)}/#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': `${root}/#website` },
    about: { '@id': `${root}/#organization` },
    inLanguage: SCHEMA_LANG,
  };
}

/** A Service node, provided by the Organization. */
export function service(
  site: string,
  opts: { url: string; name: string; description: string; serviceType: string },
) {
  const root = trimSlash(site);
  return {
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': `${root}/#organization` },
    areaServed: { '@type': 'Country', name: 'Australia' },
  };
}

/** Wrap one or more nodes in a JSON-LD document with a connected @graph. */
export function graph(nodes: unknown[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

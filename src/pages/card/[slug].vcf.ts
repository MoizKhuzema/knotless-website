/**
 * "Save contact" — a vCard per card, built at /card/<slug>.vcf.
 *
 * vCard 3.0 because it is the version both iOS Contacts and Android Contacts
 * import without complaint. Lines end in CRLF as the spec requires; some
 * Android importers drop fields otherwise. The Content-Type that makes iOS
 * open its "Add to Contacts" sheet instead of a download is set for these
 * files in netlify.toml.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { CARDS, dial, type Card } from '../../data/cards';
import { SITE } from '../../config/site';

export const getStaticPaths = (() =>
  CARDS.map((card) => ({ params: { slug: card.slug }, props: { card } }))) satisfies GetStaticPaths;

/** Escape the characters vCard treats as structure inside a value. */
const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

export const GET: APIRoute = ({ props, site }) => {
  const card = (props as { card: Card }).card;
  const url = new URL(`/card/${card.slug}/`, site).href;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(card.familyName)};${esc(card.givenName)};;;`,
    `FN:${esc(card.name)}`,
    `ORG:${esc(SITE.brandName)}`,
    `TITLE:${esc(card.title)}`,
    `EMAIL;TYPE=INTERNET,WORK:${card.email}`,
    `TEL;TYPE=WORK,VOICE:${dial(card.phone)}`,
    `URL:https://${SITE.primaryDomain}/`,
    `NOTE:${esc(`${SITE.brandName} — ${SITE.tagline} Digital card: ${url}`)}`,
    'END:VCARD',
  ];
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/vcard; charset=utf-8' },
  });
};

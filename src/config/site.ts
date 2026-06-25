/**
 * Single source of truth for every site-wide value.
 *
 * HOW TO USE THIS FILE
 * --------------------
 * Values are either REAL (taken from the content brief) or placeholders. Search
 * for "PLACEHOLDER" to find everything still needing real data, and for
 * "TODO confirm" to find plausible-but-unconfirmed assumptions. Replace here
 * once — components and layouts read from this object.
 *
 * The `as const satisfies SiteConfig` at the bottom does two things:
 *   1. `satisfies SiteConfig` checks the object against the type, so a typo in
 *      a key or a missing field is a compile error (run `npm run check`).
 *   2. `as const` makes the values read-only and gives them precise literal
 *      types, which is handy for autocomplete.
 */

export interface Founder {
  /** Full name as it should appear on the site. */
  name: string;
  /** Role / title, e.g. "Co-Founder & CEO". */
  title: string;
  /** Full LinkedIn profile URL. */
  linkedinUrl: string;
}

export interface SiteConfig {
  /** Registered company name, e.g. on invoices and legal pages. */
  legalEntityName: string;
  /** Short brand tagline. Used in the hero. */
  tagline: string;
  /** Australian Business Number. */
  abn: string;
  /** Full registered business address. */
  registeredAddress: string;
  /** General contact email. */
  contactEmail: string;
  /** Email for privacy / data requests. */
  privacyEmail: string;
  /** Company LinkedIn page (footer). */
  companyLinkedinUrl: string;
  /** Primary domain WITHOUT protocol, e.g. "example.com". */
  primaryDomain: string;
  /** Secondary / alternate domain WITHOUT protocol. */
  secondaryDomain: string;
  /** The people behind the company, rendered as founder cards. */
  founders: readonly Founder[];
  /**
   * Phrasing used when referencing the Privacy Act in legal copy, so the exact
   * wording can be tuned without editing page content. Currently "handled under".
   */
  privacyActWording: string;
}

export const SITE = {
  legalEntityName: 'Knotless AI Pty Ltd',
  tagline: 'AI Untangled.',
  abn: 'XX XXX XXX XXX', // PLACEHOLDER — not in brief
  registeredAddress: 'PLACEHOLDER address line, Adelaide SA 5000, Australia', // PLACEHOLDER (founders are Adelaide-based)
  contactEmail: 'hello@knotless.ai',
  privacyEmail: 'privacy@knotless.ai', // TODO confirm — inferred from primary domain
  companyLinkedinUrl: 'https://www.linkedin.com/company/knotless-ai', // TODO confirm
  primaryDomain: 'knotless.ai',
  secondaryDomain: 'knotless.com.au', // TODO confirm — not in brief
  founders: [
    {
      name: 'Insiya Karbalai',
      title: 'Co-Founder & CEO',
      linkedinUrl: 'https://www.linkedin.com/in/placeholder-insiya', // PLACEHOLDER
    },
    {
      name: 'Huzefa Karbalai',
      title: 'Co-Founder & COO',
      linkedinUrl: 'https://www.linkedin.com/in/placeholder-huzefa', // PLACEHOLDER
    },
  ],
  privacyActWording: 'handled under',
} as const satisfies SiteConfig;

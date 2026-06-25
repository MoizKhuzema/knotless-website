/**
 * Single source of truth for every site-wide value.
 *
 * HOW TO USE THIS FILE
 * --------------------
 * Every value below is a PLACEHOLDER. Search the codebase for the string
 * "PLACEHOLDER" (or "example.invalid") to find everything that still needs
 * real data, then replace it here — once. Components and layouts read from
 * this object, so you never have to hunt through markup to update an address,
 * an email, or a founder's title.
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
  /** Path to the headshot, relative to /public — e.g. "/founders/jane.jpg". */
  photoPath: string;
  /** Full LinkedIn profile URL. */
  linkedinUrl: string;
}

export interface SiteConfig {
  /** Registered company name, e.g. on invoices and legal pages. */
  legalEntityName: string;
  /** Australian Business Number. */
  abn: string;
  /** Full registered business address. */
  registeredAddress: string;
  /** General contact email. */
  contactEmail: string;
  /** Email for privacy / data requests. */
  privacyEmail: string;
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
  legalEntityName: 'PLACEHOLDER LEGAL ENTITY PTY LTD',
  abn: '00 000 000 000',
  registeredAddress: '000 Placeholder Street, Placeholder Suburb, NSW 0000, Australia',
  contactEmail: 'hello@example.invalid',
  privacyEmail: 'privacy@example.invalid',
  primaryDomain: 'placeholder-primary.example.invalid',
  secondaryDomain: 'placeholder-secondary.example.invalid',
  founders: [
    {
      name: 'PLACEHOLDER Founder One',
      title: 'Co-Founder & CEO',
      photoPath: '/founders/placeholder-one.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/placeholder-one',
    },
    {
      name: 'PLACEHOLDER Founder Two',
      title: 'Co-Founder & CTO',
      photoPath: '/founders/placeholder-two.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/placeholder-two',
    },
  ],
  privacyActWording: 'handled under',
} as const satisfies SiteConfig;

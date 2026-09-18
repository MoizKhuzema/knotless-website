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
  /**
   * Full name, surname included. DESIGN.md §09: "The founders section must show
   * the founders. A section headed 'Who you'll be talking to' that shows two
   * first names is the weakest moment on the page. Surnames at minimum."
   *
   * Note this is the FORMAL credit, used on the founder cards and in JSON-LD.
   * /about's prose uses first names on their own — a narrative register, not
   * this one — and writes them into the copy rather than reading them here.
   */
  name: string;
  /** Role / title, e.g. "Co-Founder & CEO". */
  title: string;
  /** Direct email address (shown on the homepage founder cards). */
  email: string;
  /** Direct contact number (shown in the footer and on the founder cards). */
  phone: string;
  /**
   * Full LinkedIn profile URL. Empty string = no confirmed profile: the Person
   * node in the /about JSON-LD then omits `url` and `sameAs` entirely rather
   * than publishing a dead link (see founderPersons() in src/lib/schema.ts).
   */
  linkedinUrl: string;
}

export interface SiteConfig {
  /** Registered company name, e.g. on invoices and legal pages. */
  legalEntityName: string;
  /** Short brand tagline. Used in the hero. */
  tagline: string;
  /** Australian Business Number. */
  abn: string;
  /**
   * Full registered business address. Empty string = nothing to publish; the
   * legal pages omit the line rather than rendering an empty one.
   */
  registeredAddress: string;
  /** General contact email. */
  contactEmail: string;
  /**
   * The support line in the footer. Insiya's direct number, at the client's
   * instruction — it was an obviously-unassigned placeholder until then, which
   * §11.17 would not have let ship. It is a real person's mobile published on
   * a public page: empty the string and the footer drops the row entirely.
   */
  supportPhone: string;
  /** Email for privacy / data requests. */
  privacyEmail: string;
  /**
   * Company LinkedIn page (footer). Empty string = unconfirmed: the footer icon
   * is not rendered and the Organization node omits `sameAs`.
   */
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
  /**
   * Regions where technical delivery (the build) is carried out, via vetted
   * partner firms. Order matters: [primary, lower-cost]. Surfaced on /what-we-do.
   */
  deliveryLocations: readonly string[];
}

/**
 * Insiya's direct line, declared once because two places publish it: her founder
 * record, and the footer's support row. A number typed twice is a number that
 * gets changed once.
 */
const INSIYA_PHONE = '+61 416 588 531';

export const SITE = {
  legalEntityName: 'Knotless AI Pty Ltd',
  tagline: 'AI Untangled.',
  abn: '75 702 285 050',
  // Intentionally empty until there's a real registered office to publish.
  // NOTE: setting a value here alone will NOT render it anywhere. The legal
  // pages substitute a `[Registered address, City, State, Postcode, Australia]`
  // token, and that token line was deleted from src/legal/privacy-policy.md
  // (§13) and src/legal/terms-of-use.md (§14). To bring the address back, add
  // the value here AND restore the token line in both markdown files.
  registeredAddress: '',
  contactEmail: 'hello@knotless.com.au',
  supportPhone: INSIYA_PHONE,

  privacyEmail: 'privacy@knotless.com.au',
  /* Empty until the page exists. It was a guessed URL carrying a TODO, and it
     feeds schema.org sameAs as well as the footer — publishing an unverified
     profile as sameAs is a claim about identity, not a broken link. Empty, the
     Organization node omits sameAs entirely. The footer still shows a LinkedIn
     row; see Footer.astro for where it points in the meantime. */
  companyLinkedinUrl: '',
  primaryDomain: 'knotless.com.au',
  secondaryDomain: 'knotless.au',
  founders: [
    {
      name: 'Insiya Karbalai',
      title: 'Co-Founder & CEO',
      email: 'insiya.karbalai@knotless.com.au',
      phone: INSIYA_PHONE,
      linkedinUrl: '', // no confirmed profile yet — omitted from JSON-LD
    },
    {
      name: 'Huzefa Karbalai',
      title: 'Co-Founder & COO',
      email: 'huzefa.karbalai@knotless.com.au',
      phone: '+61 433 353 544',
      linkedinUrl: '', // no confirmed profile yet — omitted from JSON-LD
    },
  ],
  privacyActWording: 'handled under',
  deliveryLocations: ['Australia', 'Pakistan'], // TODO confirm — from /what-we-do brief
} as const satisfies SiteConfig;

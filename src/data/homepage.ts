/**
 * Homepage copy, lifted verbatim from the content brief.
 *
 * This is page CONTENT (the words on the homepage), kept separate from
 * src/config/site.ts, which holds site-WIDE values (legal entity, contacts).
 *
 * Three sections: hero, what you get, how to get started. Curly apostrophes
 * throughout (§11.12).
 *
 * NEGATION BUDGET: §11.15 caps this page at ONE negation construction, and it
 * is spent in GET_STARTED.steps[0] — "No AI knowledge needed, no homework."
 * Anything added here that reaches for a second one has to displace it.
 */

export const HERO = {
  // The h1. Also SITE.tagline, but set here as page content: the hero renders
  // it as the page heading, not as a lockup line under the mark.
  headline: 'AI Untangled.',
  standfirst:
    'We’re helping clients discover what AI is worth in their business. We calculate where AI saves money in their workflows, then build solutions that pay back.',
  cta: {
    label: 'Book a free Fit Call',
    href: '/contact', // all "Book a free Fit Call" CTAs route to the contact page
  },
} as const;

/**
 * Meta description, deliberately NOT the standfirst.
 *
 * The standfirst is 156 characters; search results cut off around 155, so
 * using it would publish a sentence truncated by a hair. This is the first
 * clause of the same claim, complete at 106 — and it still carries "in the
 * first year", which the hero has dropped. That is deliberate: a search result
 * has one line to make the claim and no page around it to qualify the claim
 * later.
 */
export const META = {
  description:
    'We calculate where AI saves money in your workflows, then build solutions that pay back in the first year.',
} as const;

/** Section 2 — what the work actually produces, then who it is for. */
export const WHAT_YOU_GET = {
  heading: 'What you get',
  /**
   * Two named stages, in order. They were two paragraphs of running prose; the
   * engagement is a sequence of discrete deliverables, and prose is the wrong
   * shape for a list of things you get — the reader had to extract the list
   * themselves. Naming them ("The Assessment", "The Build") also gives the
   * second stage its precondition: you reach it only if the first makes the
   * case.
   */
  stages: [
    {
      title: 'The Assessment',
      points: [
        'A map of where AI saves money in your workflows',
        'Readiness assessed and blockers surfaced before you spend',
        'Every opportunity grounded in evidence, with the working shown',
        'A list of safe AI investments to take away',
      ],
    },
    {
      title: 'The Build',
      points: [
        'A step-by-step roadmap to adopt each safe opportunity, in order',
        'ROI shown on every build before work starts',
        'Solutions designed to be responsible and scalable',
        'Governance built in to keep you compliant with every applicable law',
      ],
    },
  ],
  /**
   * Two named verticals, each with its sub-verticals. §09: "Group the
   * verticals… Presented as a flat caps grid they read as *we'll take anyone*;
   * grouped under two named verticals the same eight read as focused depth."
   * The members are set as running text for the same reason — a grid of equal
   * tiles reads as a menu.
   */
  verticalsLead: 'We specialise in two verticals',
  /** Out to the page that sets out the same engagement in full. */
  readMore: { label: 'What we do', href: '/what-we-do' },
  verticals: [
    {
      name: 'Professional services',
      members: [
        'accounting',
        'consulting',
        'medical clinics',
        'recruitment',
        'marketing',
        'engineering',
        'architecture',
      ],
    },
    {
      name: 'Property',
      members: ['property management', 'strata'],
    },
  ],
} as const;

/**
 * Section 3 — how to get started. The page's single reversed Ink panel.
 *
 * Two statements, not a numbered stepper: the copy describes one call and what
 * you leave with, which is a sequence of two, and numbering two things implies
 * a process that does not exist.
 */
export const GET_STARTED = {
  heading: 'How to get started',
  steps: [
    'You book a free 30-minute Fit Call. No AI knowledge needed, no homework.',
    'You leave knowing what we can do for your business, what the Assessment will cost and how long it will take, priced on the size and complexity of your workflows.',
  ],
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

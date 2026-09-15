/**
 * Homepage copy, lifted verbatim from the content brief.
 *
 * This is page CONTENT (the words on the homepage), kept separate from
 * src/config/site.ts, which holds site-WIDE values (legal entity, founders,
 * contacts). Founder names, titles, emails and phone numbers come from
 * site.ts, not here.
 *
 * Four sections: hero, what you get, who you'll be talking to, how to get
 * started. Curly apostrophes throughout (§11.12).
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
    'We’re helping clients discover what AI is worth in their business. We calculate where AI saves money in their workflows, then build solutions that pay back in the first year.',
  cta: {
    label: 'Book a free Fit Call',
    href: '/contact', // all "Book a free Fit Call" CTAs route to the contact page
  },
} as const;

/**
 * Meta description, deliberately NOT the standfirst.
 *
 * The standfirst is 174 characters; search results cut off around 155, so
 * using it would publish a truncated sentence. This is the first clause of the
 * same claim, complete at 105.
 */
export const META = {
  description:
    'We calculate where AI saves money in your workflows, then build solutions that pay back in the first year.',
} as const;

/** Section 2 — what the work actually produces, then who it is for. */
export const WHAT_YOU_GET = {
  heading: 'What you get',
  body: [
    'Knotless is built to make AI adoption simple and safe for you. We calculate money saving opportunities in your workflows, assess readiness, and surface blockers beforehand. In practice it’s usually the repetitive work like extracting data from documents, chasing handoffs between people, or assembling the same reports every month. Every opportunity we find is grounded in evidence and every number comes with the working shown. You leave with a list of safe AI investment opportunities.',
    'If the case is there, we provide a complete implementation roadmap to adopt each safe opportunity in order. We show you the ROI on each build before any work starts. We carefully design each AI solution to be responsible and scalable with robust governance frameworks that ensure compliance with all relevant laws.',
  ],
  /**
   * Two named verticals, each with its sub-verticals. §09: "Group the
   * verticals… Presented as a flat caps grid they read as *we'll take anyone*;
   * grouped under two named verticals the same eight read as focused depth."
   * The members are set as running text for the same reason — a grid of equal
   * tiles reads as a menu.
   */
  verticalsLead: 'We specialise in two verticals',
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

/** Section 3 — who you'll be talking to. Founder details come from site.ts. */
export const FOUNDERS_SECTION = {
  heading: 'Who you’ll be talking to',
  lead: 'Every Fit Call is taken by us. Every Assessment is run by us.',
  readMore: { label: 'Read more about us', href: '/about' },
} as const;

/**
 * Section 4 — how to get started. The page's single reversed Ink panel.
 *
 * Two statements, not a numbered stepper: the copy describes one call and what
 * you leave with, which is a sequence of two, and numbering two things implies
 * a process that does not exist.
 */
export const GET_STARTED = {
  heading: 'How to get started',
  steps: [
    'You book a free 30-minute Fit Call. No AI knowledge needed, no homework.',
    'You leave knowing what we can do for your business, what the Assessment will cost and how long it will take — priced on the size and complexity of your workflows.',
  ],
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

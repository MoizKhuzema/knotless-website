/**
 * Homepage copy, lifted verbatim from the content brief.
 *
 * This is page CONTENT (the words on the homepage), kept separate from
 * src/config/site.ts, which holds site-WIDE values (legal entity, founders,
 * contacts). Founder names, titles, emails and phone numbers come from
 * site.ts, not here.
 *
 * Seven sections: hero, problem, what you get, industries, pricing, founders,
 * how to get started.
 *
 * COPY RULES. Curly apostrophes and curly quotes throughout (§11.12). NO EM
 * DASHES anywhere in this file's strings — ranges are written "3,000 to 4,500"
 * and asides are punctuated with a colon or a full stop. Australian spelling
 * throughout ("specialise", not "specialize").
 */

export const HERO = {
  /**
   * The h1, and real type rather than the lockup's artwork. The mark has left
   * the hero entirely and lives in the nav now: the page's heading is a claim,
   * and a claim has to be a sentence a reader and a crawler can both read.
   */
  headline: 'The truth about what AI is worth in your business',
  standfirst:
    'Knotless helps you make safe AI investments. We find AI opportunities in your business, and calculate if they actually pay back. If the maths doesn’t support it, we say so. If the case is there, we build it.',
  cta: {
    label: 'Book a free Fit Call',
    href: '/contact', // all "Book a free Fit Call" CTAs route to the contact page
  },
  /** The line under the button: what the call actually costs the reader. */
  ctaNote: '30 mins. One of your workflows costed live.',
} as const;

/**
 * Meta description, deliberately NOT the standfirst.
 *
 * The standfirst runs past 200 characters and search results cut off around
 * 155, so using it would publish a sentence truncated by a hair. This is the
 * same claim compressed to 148.
 */
export const META = {
  description:
    'We find AI opportunities in your business and calculate if they actually pay back. If the maths doesn’t support it, we say so. If the case is there, we build it.',
} as const;

/**
 * Section 1 — the problem, told in the client's own words.
 *
 * Three quotes, three stages of the same failure. They are attributed to a
 * KIND of business rather than a named one, because none of them are
 * testimonials and dressing them up as testimonials would be a lie. The
 * attribution carries the stage; the quote carries the feeling.
 */
export const PROBLEM = {
  heading: 'Different industries. Same knots.',
  quotes: [
    {
      quote: 'We know we should be doing something. We don’t know what.',
      attribution:
        'An accounting practice. AI on every partner meeting agenda. Nobody owns the next step.',
    },
    {
      quote:
        'Every vendor promises we’ll save hours. None of them will put a dollar on it.',
      attribution:
        'A property management principal who stopped taking demos until someone shows working, not slides.',
    },
    {
      quote:
        'We bought something last year. I honestly couldn’t tell you what it’s done for us.',
      attribution:
        'A recruitment agency paying for a tool nobody’s quite sure how to evaluate.',
    },
  ],
  closing:
    'Three different stages. Same missing piece: nobody doing the maths gets paid if the answer is no.',
} as const;

/** Section 2 — what the engagement actually produces, in two stages. */
export const WHAT_YOU_GET = {
  heading: 'What you get',
  /**
   * Two named stages, in order. Naming them also gives the second its
   * precondition: you reach Implementation only if the Assessment makes the
   * case.
   */
  stages: [
    {
      title: 'Assessment',
      points: [
        'Every opportunity where AI saves money in your workflows',
        'Two opportunities per workflow, on average',
        'We tell you if an opportunity won’t pay back',
        'We tell you if a pain point isn’t a technology problem',
        'Readiness assessed and blockers surfaced before you spend',
        'Estimated recoverable cost on each opportunity',
        'We prove our maths and show the working',
      ],
    },
    {
      title: 'Implementation',
      points: [
        'Step-by-step roadmap from design to development to delivery',
        'Predicted ROI on each build',
        'Built to meet applicable laws and professional obligations',
        'Built to scale responsibly',
        'Built to fit how your team already works',
        'Built so your team actually uses it',
        'A governance framework covering security, oversight and upkeep',
        'Every data flow handled under the Australian Privacy Act',
      ],
    },
  ],
} as const;

/**
 * Section 3 — the two verticals, and the argument for having only two.
 *
 * Members are set as running text rather than as a grid of equal tiles: a grid
 * reads as a menu, and the point of this section is depth, not breadth.
 */
export const INDUSTRIES = {
  heading: 'Industries we specialise in',
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
  body: 'Two industries, on purpose. The workflows repeat inside them. We already know what a BAS quarter does to a practice and what compliance scheduling costs a rent roll. A generalist works that out on your time.',
  /** Was out to /what-we-do, which no longer exists. The link stays — the
      section is a claim about fit, and a reader who recognises their own
      industry in it wants somewhere to go next — but the only page left that
      continues the thought is the one that starts the conversation. */
  readMore: { label: 'Talk to us', href: '/contact' },
} as const;

/**
 * Section 4 — price, published.
 *
 * A firm whose whole pitch is "we do the maths and show the working" cannot
 * put its own price behind a form. The rows are the Assessment only; the build
 * is quoted against what the Assessment finds, which is stated rather than
 * left as a gap for the reader to worry about.
 *
 * `time` and `price` render in the mono face with tabular figures: they are
 * arithmetic, and the columns have to line up down the table.
 */
export const PRICING = {
  heading: 'What it costs',
  stage: 'Assessment',
  columns: ['Workflows', 'Your team’s time', 'Price'] as const,
  rows: [
    { workflows: '1', time: '3 hours', price: '$3,000 to $4,500' },
    { workflows: '2', time: '4 hours', price: '$4,500 to $6,500' },
    { workflows: '3', time: '6 hours', price: '$6,000 to $9,000' },
    { workflows: '4', time: '8 hours', price: '$7,500 to $12,000' },
  ],
  note: 'Exact price and duration are set on the free Fit Call, before you sign anything.',
  build: 'Build: quoted separately.',
} as const;

/** Section 5 — the founders. Details come from site.ts. */
export const FOUNDERS_SECTION = {
  heading: 'Meet the founders',
} as const;

/**
 * Section 6 — how to get started. The page's single reversed panel.
 *
 * Two steps, and numbered this time: the brief numbers them, and they are
 * genuinely sequential (you book, then you leave knowing).
 */
export const GET_STARTED = {
  heading: 'How to get started',
  steps: [
    'You book a free 30-minute Fit Call. No AI knowledge needed, no homework.',
    'You leave knowing what one of your workflows costs you, what an assessment would cost and how long it takes.',
  ],
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

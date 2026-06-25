/**
 * Homepage copy, lifted verbatim from the content brief.
 *
 * This is page CONTENT (the words on the homepage), kept separate from
 * src/config/site.ts, which holds site-WIDE values (legal entity, founders,
 * contacts). Founder names/titles come from site.ts, not here.
 */

export const HERO = {
  // The eyebrow/tagline ("AI Untangled.") is carried by the wordmark_primary
  // lockup shown in the hero, so it isn't repeated as separate text.
  headline: "AI that's worth building.",
  subhead:
    'We quantify what AI is worth in your business, then build only what pays back. For growing Australian businesses, 10 to 200 staff.',
  verticals: [
    'Accounting & bookkeeping',
    'Consulting',
    'Recruitment',
    'Marketing & digital agencies',
    'Engineering',
    'Architecture & design',
    'Property management',
    'Strata',
  ],
  cta: {
    label: 'Book a free Fit Call',
    href: '/contact', // all "Book a free Fit Call" CTAs route to the contact page
  },
} as const;

/** Section 2 — the Knotless Assessment. */
export const ASSESSMENT = {
  heading: "AI is complicated. Knotless isn't.",
  intro:
    "That's why we built the Knotless Assessment. One entry point for every client, scoped to where you are right now.",
  // `id` doubles as the nav anchor target (see Nav.astro).
  stages: [
    {
      n: '01',
      id: 'exploring-ai',
      title: 'Exploring AI',
      body: 'We identify where AI could pay back, what it’s worth in dollars, and what’s blocking implementation. If the answer is “not yet,” we say so.',
    },
    {
      n: '02',
      id: 'committing-ai',
      title: 'Committing to AI',
      body: 'We turn intent into an implementation plan. The right solution, fixed costs, a clear timeline. If you accept, we build it.',
    },
    {
      n: '03',
      id: 'already-running-ai',
      title: 'Already Running AI',
      body: 'We quantify the return, review what’s exposed, and map the compliance risks. A clear-eyed audit, not a sales pitch for a replacement.',
    },
  ],
  readMore: { label: 'Read more', href: '/what-we-do' },
  stepsHeading: 'How to get started',
  steps: [
    {
      n: '01',
      title: 'Book a free Fit Call',
      body: 'Thirty minutes. No commitment. No contract.',
    },
    {
      n: '02',
      title: 'We scope your Assessment, together',
      body: 'No AI knowledge needed, no homework. On the call, we work out what you need and what you don’t. You walk away with a fixed price, fixed scope, and a clear timeline.',
    },
    {
      n: '03',
      title: 'You decide what’s next',
      body: 'You’ll get a plain-English contract with everything we agreed. Run the Assessment, change the scope, or walk away.',
    },
  ],
} as const;

/** Section 3 — who you'll be talking to. Founder names/titles come from site.ts. */
export const FOUNDERS_SECTION = {
  heading: "Who you'll be talking to",
  body: [
    'Knotless is run by Insiya and Huzefa Karbalai, husband and wife, both based in Adelaide.',
    'Insiya spent over a decade in client success and account management, working with mid-market and SME firms across industries. She watched the same pattern repeat everywhere: capable people stuck doing repetitive work because there was no other option, and budgets stretched too thin to fix it.',
    'Huzefa spent fifteen years on the buyer’s side of complex technology rollouts. He learned the hard part of any technology is never the technology. It’s making it work inside a real business, with real budgets, real constraints, and people who just need it to work.',
    'Knotless is what happens when those two disciplines work on the same problem.',
    'Every Fit Call is taken by us. Every Assessment is run by us. No handovers. No account managers. Just the two people whose names are on the door.',
  ],
  readMore: { label: 'Read more about us', href: '/about' },
} as const;

/** Section 4 — final CTA. */
export const FINAL_CTA = {
  heading: 'Ready when you are.',
  body: "If you've read this far, the next step is the call.",
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

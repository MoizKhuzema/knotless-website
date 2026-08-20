/**
 * /about page copy (Draft v1.0, sections locked).
 *
 * Page CONTENT, kept separate from src/config/site.ts (site-WIDE values).
 * Founder NAMES and TITLES come from site.ts; the bios here are index-paired
 * with SITE.founders ([Insiya, Huzefa]).
 */

/**
 * Section 1 — page intro, rendered as a convergence diagram: two careers
 * (`careers`) that meet in one `conclusion`. The heading ("Two careers. One
 * conclusion.") is rendered in the page so "conclusion." can be typed. Each
 * career shows a `teaser` collapsed and the full `experience` when expanded.
 */
export const ABOUT_INTRO = {
  eyebrow: 'About us',
  metaDescription:
    'Two careers, one conclusion: judgement before technology. Meet Insiya and Huzefa, the founders behind Knotless.',
  // Hero standfirst — sets up the two careers without pre-empting the conclusion.
  lead: {
    pre: 'Before Knotless, we spent our careers on ',
    strong: 'opposite sides of the same problem',
    post: '.',
  },
  cta: { label: 'Book a free Fit Call', href: '/contact' },
  careersHeading: 'Where this comes from',
  conclusionHeading: 'One conclusion',
  careers: [
    {
      id: 'insiya',
      name: 'Insiya',
      teaser: 'A decade in client success',
      experience:
        'The same pattern across every mid-market and SME client: capable people stuck on repetitive work, budgets too thin to fix it. Not a technology problem. A human one nobody was solving at a price these businesses could pay.',
    },
    {
      id: 'huzefa',
      name: 'Huzefa',
      teaser: 'Fifteen years in technology rollouts',
      experience:
        'Getting technology to actually land inside real businesses taught one lesson: the hard part is never the tech. It’s the budgets, the constraints, and the questions nobody stops to ask. What’s the real problem? What’s the risk? Is this even the right tool?',
    },
  ],
  conclusion: {
    label: 'One conclusion',
    lead: 'Knotless',
    body: ' is the firm neither of us could find: judgement before technology. We work out where AI pays off and where it won’t, then build only what the numbers back.',
  },
} as const;

/** Section 2 — who you'll work with. Names/titles from site.ts; bios paired by index. */
export const ABOUT_FOUNDERS = {
  heading: 'The names on the door.',
  bios: [
    'Takes every Fit Call and runs every Assessment. She maps your business, asks the questions, and stands behind the findings.',
    'Scopes every engagement and oversees every build. If the case is there, he’s accountable for what gets built and how it lands.',
  ],
  location: 'Both based in Adelaide.',
  deliverHeading: 'How we deliver',
  deliverBody: [
    'We’re founder-led by design. Every project is scoped and overseen by us personally; for the build we use a small set of vetted partner firms. You choose where your build is delivered, disclosed up front, with every data flow handled under the Australian Privacy Act. Senior judgement on every decision, specialist hands on the build, no bench to pay for.',
  ],
} as const;

/** Section 3 — final CTA. */
export const ABOUT_FINAL_CTA = {
  heading: 'You’ve met us. Say hello back.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

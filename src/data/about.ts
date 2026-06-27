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
    'Two careers, one conclusion: judgement before technology. Meet Insiya and Huzefa Karbalai, the founders behind Knotless.',
  careers: [
    {
      id: 'insiya',
      name: 'Insiya',
      teaser: 'A decade in client success',
      experience:
        'Insiya spent a decade in client success, working with mid-market and SME firms across industries. Same pattern everywhere: capable people stuck doing repetitive work, and budgets too thin to fix it. Not a technology problem. A human one, and nobody was solving it at a size these businesses could buy.',
    },
    {
      id: 'huzefa',
      name: 'Huzefa',
      teaser: 'Fifteen years in technology rollouts',
      experience:
        'Huzefa spent fifteen years accountable for making technology rollouts work inside real businesses. The lesson: the hard part is never the technology. It’s real budgets, real constraints, and almost nobody asking the questions that decide whether any of it pays off. What’s the real problem? What’s the risk? Is this the right tool?',
    },
  ],
  conclusion: {
    label: 'One conclusion',
    lead: 'Knotless',
    body: ' is those careers pointed at one problem. We built the firm neither of us could find: judgement before technology. We work out where AI pays you back, and where it won’t. Then we build only what the numbers backed.',
  },
} as const;

/** Section 2 — who you'll work with. Names/titles from site.ts; bios paired by index. */
export const ABOUT_FOUNDERS = {
  heading: 'The names on the door.',
  bios: [
    'Insiya takes every Fit Call and runs every Assessment session. If you become a client, she’s the person who maps your business, asks the questions, and stands behind the findings. Based in Adelaide.',
    'Huzefa scopes every engagement and oversees every build, start to finish. If the case is there, he’s the person accountable for what gets built and how it lands inside your business. Based in Adelaide.',
  ],
  teamLine: 'They’re supported by a small internal team.',
  deliverHeading: 'How we deliver',
  deliverBody: [
    'We’re founder-led by design, not by stage. Every project is designed and overseen personally by us. For technical delivery we work with a small set of vetted partner firms in Australia and Pakistan. You choose where your build is delivered: Australian delivery, or Pakistan delivery at a lower cost. Either way it’s disclosed up front, with every data flow handled under the Australian Privacy Act.',
    'We chose this model deliberately: you get senior judgement on every decision and specialist hands on the build, without paying for a bench. Nothing reaches you without passing through us first.',
  ],
} as const;

/** Section 3 — final CTA. */
export const ABOUT_FINAL_CTA = {
  heading: 'You’ve met us. Say hello back.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

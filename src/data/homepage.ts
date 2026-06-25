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
    href: '/book', // PLACEHOLDER — booking destination not in brief
  },
} as const;

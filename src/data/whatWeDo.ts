/**
 * /what-we-do page copy.
 *
 * Page CONTENT, kept separate from src/config/site.ts (site-WIDE values).
 * Curly apostrophes throughout (§11.12).
 *
 * NEGATION BUDGET (§11.15, one construction per page): the brand's own copy
 * here spends none. The negations that appear — 'Nobody owns the next step',
 * 'None of them will put a dollar on it', 'commits to nothing' — are all inside
 * the vignettes, which are reported speech and description of the speaker, not
 * Knotless talking. The budget governs the voice, and the voice here is the
 * reader's.
 */

/** Section 1 — hero. */
export const WWD_HERO = {
  heading: 'We make AI simple to buy.',
  body: 'Whether you’re exploring what AI could do, stuck choosing between a hundred tools, or already running AI and want to know what’s next, we work it out for you with the Knotless Assessment, then build solutions that pay back. It starts with a free 30-minute Fit Call.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

/**
 * Meta description, deliberately not the hero body.
 *
 * The body is 264 characters and search results cut off around 155, so using it
 * would publish a sentence chopped mid-clause. This is the same claim, complete.
 */
export const WWD_META = {
  description:
    'We work out what AI is worth in your business with the Knotless Assessment, then build solutions that pay back. It starts with a free Fit Call.',
} as const;

/**
 * Section 2 — the questions people bring us.
 *
 * Six, not three: the point is the RANGE. One reader recognises the accounting
 * practice, another the engineering consultancy, and the section only works if
 * enough of them are on the page for that to happen.
 */
export const WWD_QUESTIONS = {
  heading: 'Sound familiar?',
  lead: 'Different industries, same knots.',
  vignettes: [
    {
      quote: 'We know we should be doing something. We don’t know what.',
      who: 'An accounting practice. AI on every partner meeting agenda. Nobody owns the next step.',
    },
    {
      quote:
        'Every vendor promises we’ll save hours. None of them will put a dollar on it.',
      who: 'A property management principal who has stopped taking demos until someone shows working, not slides.',
    },
    {
      quote:
        'There’s a new tool every week. Picking one feels like a coin toss.',
      who: 'A marketing agency where the team trials everything and commits to nothing.',
    },
    {
      quote: 'If the AI gets it wrong, it’s still our name on the drawings.',
      who: 'An engineering consultancy that wants the efficiency but won’t gamble its professional standing to get it.',
    },
    {
      quote: 'Half my staff are already using it. Should that worry me?',
      who: 'A consulting firm where client information is going into AI tools the firm hasn’t reviewed yet.',
    },
    {
      quote:
        'We bought something last year. I honestly couldn’t tell you what it’s done for us.',
      who: 'A recruitment agency paying for a tool nobody’s quite sure how to evaluate.',
    },
  ],
} as const;

/**
 * Section 3 — the Assessment.
 *
 * Two blocks, and deliberately NOT numbered. The homepage's two stages carry
 * ordinals and a connector because they are a sequence; these are two facets of
 * one thing — what it produces, and what it costs — and numbering them would
 * assert an order that does not exist.
 */
export const WWD_ASSESSMENT = {
  heading: 'The Knotless Assessment',
  blocks: [
    {
      title: 'You walk away with',
      points: [
        'Every opportunity where AI could save you money',
        'The arithmetic behind each saving',
        'How long each opportunity takes to pay back',
        'Every blocker that needs to be resolved before investing in AI',
      ],
    },
    {
      title: 'Time and cost',
      points: [
        'Completed within two to four weeks',
        'A few hours of your team’s time',
        'A fixed price quoted on the free Fit Call',
        'Price depends on your size and the scope you choose',
      ],
    },
  ],
} as const;

/** Section 4 — implementation. Seven commitments, no sub-blocks. */
export const WWD_IMPLEMENTATION = {
  heading: 'Implementation',
  points: [
    'Step-by-step roadmap from design to development to delivery',
    'ROI on each build shown before you sign anything',
    'Built to meet the laws and professional obligations',
    'Built to scale responsibly',
    'Built to fit how your team already works',
    'A governance framework covering security, oversight and upkeep',
    'Every data flow handled under the Australian Privacy Act',
  ],
} as const;

/** Section 5 — the close. The page's single reversed panel. */
export const WWD_CLOSE = {
  heading: 'Book a call.',
  body: 'Thirty minutes with the founders. You’ll leave with a fixed price and a clear scope.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

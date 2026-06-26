/**
 * /what-we-do page copy, lifted from the content brief (Draft v1.0).
 *
 * This is page CONTENT, kept separate from src/config/site.ts (site-WIDE
 * values). The delivery locations and Privacy-Act wording referenced in the
 * Implementation section are pulled from site.ts inside the page component, so
 * the business facts live in one place.
 */

/**
 * Section 1 — page intro.
 * The heading ("One product. Whole story.") is rendered in the page so the word
 * "product" can use the typewriter/strike treatment. `bodyParts` is the lead
 * with the two services marked `strong` so the page can highlight them.
 */
export const WWD_INTRO = {
  eyebrow: 'What we do',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
  bodyParts: [
    'Everything we sell is on this page: ',
    { strong: 'the Knotless Assessment' },
    ', and ',
    { strong: 'the implementation that follows' },
    '. No menu of services. No tiers to pick from. One product, one free call to scope it.',
  ],
} as const;

/** Section 2 — the questions people bring us. */
export const WWD_QUESTIONS = {
  heading: 'Sound familiar?',
  lead: 'Different industries, same knots.',
  vignettes: [
    {
      quote: 'We know we should be doing something. We don’t know what.',
      who: 'An accounting practice. AI on every partner meeting agenda. Nobody owns the next step.',
    },
    {
      quote: 'Every vendor promises we’ll save hours. None of them will put a dollar on it.',
      who: 'A property management principal who has stopped taking demos until someone shows working, not slides.',
    },
    {
      quote: 'There’s a new tool every week. Picking one feels like a coin toss.',
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
      quote: 'We bought something last year. I honestly couldn’t tell you what it’s done for us.',
      who: 'A recruitment agency paying for a tool nobody’s quite sure how to evaluate.',
    },
  ],
  close: 'Six questions, one honest answer each. That’s the job of the Knotless Assessment.',
} as const;

/** Process strip — the sequence, shown as a divider. */
export const WWD_PROCESS = ['Fit Call', 'Assessment', 'Findings', 'Build, if the case is there'] as const;

/** Section 3 — what you get at each stage. */
export const WWD_STAGES = {
  heading: 'What you get at each stage',
  lead: 'We scope the Assessment to the stage you’re in, so you only pay for what you need.',
  labels: { whatWeDo: 'What we do', walkAway: 'You walk away with' },
  // `id` doubles as the deep-link target (the homepage Assessment links here).
  stages: [
    {
      n: '01',
      id: 'exploring-ai',
      title: 'Exploring AI',
      oneLiner: 'You know AI matters. Not sure where to start.',
      whatWeDo: [
        'Map how your business actually runs, with the people who run it',
        'Anchor everything to real, recent cases. No idealised workflows',
        'Find where AI or automation could genuinely help, and where it can’t',
      ],
      walkAway: [
        'Every opportunity costed in dollars, calculation shown',
        'What each is worth to fix, and what’s blocking it',
        'An honest verdict per opportunity: ready, ready with preparation, or not yet',
        'Problems flagged “not a technology problem” before you spend money on technology',
      ],
    },
    {
      n: '02',
      id: 'committing-ai',
      title: 'Committing to AI',
      oneLiner: 'You’ve decided to move. The risk now is moving badly.',
      whatWeDo: [
        'Map the laws and professional obligations that apply to each opportunity',
        'Name the risks and the controls that keep it safe',
        'Settle the question vendors answer in their own favour: build, buy, or use what you already pay for',
      ],
      walkAway: [
        'An implementation plan you could hand to anyone: what, in what order, at what cost',
        'A verdict per opportunity: proceed, re-scope, or stop',
        'We build it, if you accept the plan. The plan is yours either way',
      ],
    },
    {
      n: '03',
      id: 'already-running-ai',
      title: 'Already Running AI',
      oneLiner: 'Something’s live. Whether it’s working is another question.',
      whatWeDo: [
        'Test what’s running against what it promised',
        'Measure what it’s actually returning, in dollars',
        'Re-check compliance, because obligations move even when your tools don’t',
      ],
      walkAway: [
        'A measured answer: what to fix, what to keep, what to switch off',
        'Where you’re exposed, and what closes the gap',
        'A verdict with nothing riding on it.',
      ],
    },
  ],
} as const;

/**
 * Section 4 — implementation. The delivery bullet is composed in the page from
 * SITE.deliveryLocations + SITE.privacyActWording, so it sits between these two.
 */
export const WWD_IMPLEMENTATION = {
  heading: 'The case is there? We build it.',
  // The two honest outcomes (verbatim from the brief), shown as a fork.
  forkNo:
    'If it isn’t, the Assessment stands on its own. You owe us nothing further, and that’s a real outcome, not a courtesy.',
  buildLead: 'When it is, the build follows the findings:',
  build: [
    'Only the opportunities the numbers backed',
    'In the order the plan set, inside the controls it defined',
    'Scope and price fixed before any work starts',
  ],
  whoHeading: 'Who does the work',
  whoFirst: 'The founders run every build, start to finish',
  whoDelivery:
    'Technical delivery is handled by a small set of vetted partner firms in Australia and Pakistan. You choose where your build is delivered: Australian delivery, or Pakistan delivery at a lower cost. Either way it’s disclosed up front, with every data flow handled under the Australian Privacy Act.',
  whoLast: 'Nothing reaches you without passing through us first',
} as const;

/** Section 5 — FAQs. */
export const WWD_FAQS = {
  heading: 'FAQs.',
  items: [
    {
      q: 'Why isn’t the price on this page?',
      a: 'Because we’d have to pad it to cover every case. Your price depends on your stage, the size of your firm, and the scope we agree together. It’s fixed, and quoted in full on the Fit Call, before you sign anything. No day rates, no surprises.',
    },
    {
      q: 'How much work is this for my team?',
      a: 'A few hours, not a few weeks. The Assessment runs on a small number of sessions with the people who do the work; we do the heavy lifting between them. No pre-reading, no forms, no homework. The exact session count and hours are agreed on the Fit Call, and we hold to them.',
    },
    {
      q: 'Who do we actually deal with?',
      a: 'The founders. We run the Fit Call, every Assessment session, and oversee every build start to finish. One point of contact from first call to final delivery; you’ll never be re-introduced to your own project.',
    },
    {
      q: 'What happens to our information?',
      a: 'It stays protected. Everything you share in an Assessment is handled under the Australian Privacy Act, used only to produce your findings, and never fed into AI tools we haven’t vetted ourselves. If a build goes ahead, anything shared with our delivery partners is disclosed to you first and covered by the same obligations. We’re the firm that checks AI for a living; we hold our own work to the standard we audit against.',
    },
  ],
} as const;

/** Section 6 — final CTA. */
export const WWD_FINAL_CTA = {
  heading: 'That’s everything.',
  body: 'One product, one call to scope it. The next thirty minutes of homework are ours, not yours.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

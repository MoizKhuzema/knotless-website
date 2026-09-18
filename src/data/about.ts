/**
 * /about page copy.
 *
 * Page CONTENT, kept separate from src/config/site.ts (site-WIDE values).
 * Founder names and titles live in site.ts; this file holds only the words on
 * the page. Curly apostrophes throughout (§11.12).
 *
 * NEGATION BUDGET — FLAGGED, NOT RESOLVED. §11.15 caps a page at ONE negation
 * construction. This copy, as supplied, carries ten: "the firm we couldn't
 * find", "didn't pay back", "Neither of us could point to", "nobody was solving
 * it", "never surfaced blockers", "neither of us could find", "doesn't support
 * the build", "without paying for a bench", "Nothing reaches you without", "No
 * preparation needed". It is set verbatim because it is the client's own voice
 * and the page's whole argument is built on the absence it names — but the rule
 * is a rule, and this is a deliberate, recorded exception rather than an
 * oversight. Three or four of them could go without touching the argument.
 */

/**
 * Meta description. 118 characters, so a search result does not cut it off, and
 * deliberately not the hero body, which is 221.
 */
export const ABOUT_META = {
  description:
    'Two careers, one conclusion: judgement before technology. Meet Insiya and Huzefa, the founders behind Knotless.',
} as const;

/** Section 1 — hero. */
export const ABOUT_HERO = {
  heading: 'We built the firm we couldn’t find.',
  body: 'Between us we spent twenty-five years watching businesses buy technology that didn’t pay back, Insiya on the client side and Huzefa on the buyer’s. Neither of us could point to a firm that would just tell the truth.',
} as const;

/**
 * Section 2 — the two careers, then what they add up to.
 *
 * Two observations and one conclusion, which is what the heading says and what
 * the layout does: two columns resolving into a single statement across the
 * measure. They carry no name labels — each paragraph opens with the founder's
 * name, so a label above it would set the same word twice.
 */
export const ABOUT_CAREERS = {
  heading: 'Two careers. One conclusion.',
  observations: [
    'Insiya kept seeing capable people stuck on repetitive work, with budgets too thin to fix it. The problem was rarely the technology. It was that nobody was solving it at a price these businesses could pay.',
    'Huzefa kept seeing firms lose money on AI because the vendor never surfaced blockers, overcharged, and wrote the ROI case to justify the sale.',
  ],
  conclusion:
    'Knotless is the firm neither of us could find: judgement before technology. We find AI opportunities and put a predicted ROI on each one. Every number comes with the working shown so you can check it yourself. If the arithmetic doesn’t support the build, we say so.',
} as const;

/**
 * Section 3 — how the work is actually delivered.
 *
 * One paragraph as supplied. The first sentence is lifted out as the section's
 * statement and the rest set beneath it — the same shape the Assessment's
 * deliverables take on /what-we-do. That is a formatting decision, not an edit:
 * put back together, `statement` + ' ' + `body` is the paragraph as written.
 */
export const ABOUT_DELIVER = {
  heading: 'How we deliver',
  statement: 'We’re founder-led by design.',
  body: 'We run every assessment, scope every engagement and oversee every build personally. For technical delivery we work with a small set of vetted partner firms, disclosed to you up front, with every data flow handled under the Australian Privacy Act. That model is deliberate: you get senior judgement on every decision and specialist hands on the build, without paying for a bench. Nothing reaches you without passing through us first.',
} as const;

/** Section 4 — the close. The page's single reversed panel. */
export const ABOUT_CLOSE = {
  heading: 'Say hello.',
  body: 'Thirty minutes with Insiya or Huzefa. No preparation needed.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

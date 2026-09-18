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
 *
 * The page is three sections now: the hero carries the argument, delivery
 * explains the model, and the panel closes. "Two careers. One conclusion." and
 * the old hero standfirst are gone with the merge.
 */

/**
 * Meta description. 118 characters, so a search result does not cut it off.
 */
export const ABOUT_META = {
  description:
    'Two careers, one conclusion: judgement before technology. Meet Insiya and Huzefa, the founders behind Knotless.',
} as const;

/**
 * Section 1 — the hero, which is now the whole of the page's argument.
 *
 * It carries the two observations and the conclusion that used to be a section
 * of their own under the heading "Two careers. One conclusion." The heading and
 * the old hero standfirst went with the merge: the h1 already says what the
 * absence was, and the observations say what each of us saw, so a standfirst
 * between them was saying it a third time.
 *
 * The three are kept as three fields rather than one paragraph because the page
 * sets them as three things — two observations beside each other, one
 * conclusion across both — and that shape is the argument.
 */
export const ABOUT_HERO = {
  heading: 'We built the firm we couldn’t find.',
  observations: [
    'Insiya kept seeing capable people stuck on repetitive work, with budgets too thin to fix it. The problem was rarely the technology. It was that nobody was solving it at a price these businesses could pay.',
    'Huzefa kept seeing firms lose money on AI because the vendor never surfaced blockers, overcharged, and wrote the ROI case to justify the sale.',
  ],
  conclusion:
    'Knotless is the firm neither of us could find: judgement before technology. We find AI opportunities and put a predicted ROI on each one. Every number comes with the working shown so you can check it yourself. If the arithmetic doesn’t support the build, we say so.',
} as const;

/**
 * Section 2 — how the work is actually delivered.
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

/** Section 3 — the close. The page's single reversed panel. */
export const ABOUT_CLOSE = {
  heading: 'Say hello.',
  body: 'Thirty minutes with Insiya or Huzefa. No preparation needed.',
  cta: { label: 'Book a free Fit Call', href: '/contact' },
} as const;

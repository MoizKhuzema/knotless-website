/**
 * /contact page copy (Draft v1.0).
 *
 * Page CONTENT, kept separate from src/config/site.ts (site-WIDE values). The
 * contact email and legal entity name come from site.ts; everything else here.
 * The heading is rendered in the page so "Call." can type in (the same emph
 * treatment used on the other heroes).
 */
export const CONTACT = {
  eyebrow: 'Contact',
  metaDescription:
    'Book a free 30-minute Fit Call with the founders of Knotless. Tell us who you are and we’ll come back within one business day to set a time.',
  body: 'Tell us who you are and we’ll come back within one business day to set a time. Thirty minutes, free, with the founders. No preparation needed.',
  fields: [
    { id: 'name', label: 'Name', type: 'text', autocomplete: 'name', required: true, optional: false },
    {
      id: 'company',
      label: 'Company',
      type: 'text',
      autocomplete: 'organization',
      required: true,
      optional: false,
    },
    { id: 'email', label: 'Email', type: 'email', autocomplete: 'email', required: true, optional: false },
    {
      id: 'phone',
      label: 'Phone',
      type: 'tel',
      autocomplete: 'tel',
      required: false,
      optional: true,
    },
  ],
  submitLabel: 'Request my Fit Call',
  /** Shown after a successful submit (the form is replaced by this). The
   *  heading reads "Request received." — the words are wiped on left-to-right
   *  behind a single terracotta edge (the logo's mark as an impression pressed
   *  across the line). Kept split for the copy; rendered as one wiped unit. */
  success: {
    headingWord: 'Request',
    headingRest: ' received.',
    body: 'Thanks — we’ll be in touch within one business day to set a time.',
  },
  /** The "Prefer email?" line under the form; the address comes from site.ts. */
  altLabel: 'Prefer email?',
} as const;

/**
 * /contact page copy.
 *
 * Page CONTENT, kept separate from src/config/site.ts (site-WIDE values): the
 * contact email and legal entity name come from there. Curly apostrophes
 * throughout (§11.12).
 *
 * NEGATION BUDGET (§11.15, one construction per page): spent on "No preparation
 * needed" in `body`. Anything added that reaches for a second one has to
 * displace it.
 */
export const CONTACT = {
  heading: 'Book your Fit Call.',
  metaDescription:
    'Book a free 30-minute Fit Call with the founders of Knotless. Tell us who you are and we’ll come back within one business day to set a time.',
  body: 'Tell us who you are and we’ll come back within one business day to set a time. Thirty minutes, free, with the founders. No preparation needed.',
  /**
   * Three fields, all required.
   *
   * It was four — name, company, email, phone — and a phone number is a thing
   * to chase, not a thing to book a call with. What is left is the least that
   * lets a founder walk into a Fit Call already knowing something: who is
   * asking, where to reply, and what the business does.
   *
   * `website` is a url input with a lenient `inputmode` and no scheme demanded
   * of the reader: "knotless.com.au" is what a person types, and the page adds
   * the https:// before the browser validates it. A form that rejects the way
   * everyone writes a domain is a form that loses the enquiry.
   */
  fields: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      autocomplete: 'name',
      inputmode: 'text',
      placeholder: '',
      half: true,
    },
    {
      id: 'email',
      label: 'Work email',
      type: 'email',
      autocomplete: 'email',
      inputmode: 'email',
      placeholder: '',
      half: true,
    },
    {
      id: 'website',
      label: 'Company website',
      type: 'url',
      autocomplete: 'url',
      inputmode: 'url',
      placeholder: 'knotless.com.au',
      half: false,
    },
  ],
  submitLabel: 'Request my Fit Call',
  /** Shown in place of the form after a successful submit. */
  success: {
    heading: 'Request received.',
    body: 'Thanks — we’ll be in touch within one business day to set a time.',
  },
  /** The line under the form; the address itself comes from site.ts. */
  altLabel: 'Prefer email?',
} as const;

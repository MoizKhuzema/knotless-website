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
  /* The call's terms have moved out of here and into `promise`, where they are
     three lit facts rather than a clause inside a sentence about scheduling. */
  body: 'Tell us who you are and we’ll come back within one business day to set a time. No preparation needed.',
  /** The lit line under the lead. Three facts, not a sentence. */
  promise: ['30 minutes', 'Free', 'With the founders'],
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
   *
   * The placeholders are examples, not instructions — the label already says
   * what the field is, so the placeholder's only job is to show the shape of
   * the answer.
   */
  fields: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      autocomplete: 'name',
      inputmode: 'text',
      placeholder: 'Your name',
      half: true,
    },
    {
      id: 'email',
      label: 'Work email',
      type: 'email',
      autocomplete: 'email',
      inputmode: 'email',
      placeholder: 'you@company.com.au',
      half: true,
    },
    {
      id: 'website',
      label: 'Company website',
      type: 'url',
      autocomplete: 'url',
      inputmode: 'url',
      placeholder: 'company.com.au',
      half: false,
    },
  ],
  submitLabel: 'Request my Fit Call',
  /** Under the button. Says what the three fields are for, and nothing else. */
  fine: 'We only use this to arrange the call.',
  /**
   * Inline field messages. Written as the missing thing, not as the rule that
   * was broken: "Please add your name" is an instruction a reader can follow,
   * "Name is required" is a validator talking to itself.
   */
  errors: {
    name: { empty: 'Please add your name', invalid: 'Please add your name' },
    email: {
      empty: 'Please add your work email',
      invalid: 'That email doesn’t look right',
    },
    website: {
      empty: 'Add your company’s website',
      invalid: 'Add your company’s website',
    },
  },
  /** Shown in place of the form after a successful submit. The script
      personalises the heading to "Thanks, {first name}." when a name was
      given, and leaves it as written when it was not. */
  success: {
    heading: 'Thanks.',
    body: 'We’ll email you within one business day with a few times for the call. Nothing to prepare.',
  },
} as const;

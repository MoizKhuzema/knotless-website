# Homepage rewrite, v4. Implementation brief

**For Claude Code, working in `Knotless/Website`.**
Content authority: this file. Visual authority: `DESIGN.md`. Where they conflict, stop and ask.

> **Status note, 22 Sep 2026.** The identity is now landed in the code: IBM Plex
> (Serif / Sans / Mono, self-hosted), the oxide-ember accent with its usage rule and
> the `--color-accent-type` token, and the drawn wordmark. `DESIGN.md` §02, §03 and
> §04 were rewritten to match and are current. Build and `astro check` both pass.

---

## 1. Blocking decision before any code

**The negation budget is exceeded, by a lot.**

`src/data/homepage.ts` records a rule from `DESIGN.md` §11.15: the homepage gets **one** negation construction, currently spent on *"No AI knowledge needed, no homework."*

The v4 copy contains eight:

| # | Where | Construction |
|---|---|---|
| 1 | Hero | "If the maths doesn't support it" |
| 2 | §2 quote 1 | "We don't know what" |
| 3 | §2 quote 2 | "None of them will put a dollar on it" |
| 4 | §2 quote 3 | "I couldn't tell you what it's done" |
| 5 | §2 closer | "nobody doing the maths gets paid if the answer is no" |
| 6 | §3 bullet | "We tell you if an opportunity won't pay back" |
| 7 | §3 bullet | "We tell you if a pain point isn't a technology problem" |
| 8 | §7 step 1 | "No AI knowledge needed, no homework" |

This is not an accident in the copy. The v4 positioning is built on refusals: the thing being sold is that Knotless will say no. Refusals are negations. A one-negation cap and a refusal-led page cannot both stand.

**Two ways out, and it is the owner's call, not Claude Code's:**

- **Amend `DESIGN.md` §11.15** to exempt refusal constructions, or raise the cap. §11.15 was written for a page that asserted; this page refuses.
- **Rewrite the copy** to carry refusals as positives. This weakens them and is not recommended.

**Do not start work until this is decided.** If the rule is amended, record it in `DESIGN.md` §10 (deviations) with a one-line reason, as a separate `docs:` commit before any content commit.

---

## 2. What is changing

The page goes from four sections to seven.

| # | Section | Status | Component |
|---|---|---|---|
| 1 | Hero | Rewritten | `home/HeroSection.astro` exists |
| 2 | Different industries. Same knots. | **New** | new component |
| 3 | What you get | Rewritten | `home/WhatYouGetSection.astro` exists |
| 4 | Industries we specialise in | **New section, existing content** | new component; content currently lives inside `WhatYouGetSection` as `verticalsLead` + `verticals` |
| 5 | What it costs | **New, contains a table** | new component |
| 6 | Meet the founders | Reduced to cards only | `home/FoundersSection.astro` exists |
| 7 | How to get started | Rewritten | `home/GetStartedSection.astro` exists |
| — | Footer | Email change | `Footer.astro`, `config/site.ts` |

`src/pages/index.astro` carries a long comment documenting the section rhythm as three breaks across four sections. That comment is now wrong and must be rewritten for six breaks across seven sections. It also reserves a slot for a pricing calculator between *What you get* and *Who you'll be talking to*; **§5 What it costs takes that slot**, as a table, not a calculator.

---

## 3. Hard rules

1. **Copy goes in `src/data/homepage.ts`.** Never inline in a component. Founder names, titles, emails and phones come from `src/config/site.ts`, never duplicated.
2. **No em dashes anywhere in the copy.** Use commas, colons or full stops. This is a client instruction: em dashes read as AI-written.
3. **Curly apostrophes** (§11.12). The copy below already uses them. Preserve them exactly.
4. **Australian spelling.** "specialise", not "specialize".
5. **Do not invent copy.** If something is missing, stop and ask. No placeholder sentences, no filler, no "lorem".
6. **Do not add sections, elements, colours or type sizes** beyond what is specified. `DESIGN.md` §11 is a flat list of twenty forbidden things; anything on it appearing in a diff is a defect.
7. **Branch, never `main`.** Conventional commits, one logical change each.
8. **`npm run check` must return 0 errors** before any commit.
9. **Screenshot at 1440px and 390px** and look at both before calling a visual change done. Playwright **is** a dependency; `npm run shot` drives `scripts/screenshot.mjs`.

---

## 4. The copy

Everything below is final and locked. Set it verbatim.

### Section 1. Hero

**h1**

> The truth about what AI is worth in your business

**Standfirst**

> Knotless helps you make safe AI investments. We find AI opportunities in your business, and calculate if they actually pay back. If the maths doesn’t support it, we say so. If the case is there, we build it.

**CTA**

> Label: `Book a free Fit Call`
> Sub-label: `30 mins. One of your workflows costed live.`

**Note:** the h1 is no longer `SITE.tagline`. "AI Untangled." moves to the footer, where it already sits. `HERO.headline` and `SITE.tagline` now diverge; update the comment in `homepage.ts` that says they are the same.

**Meta description** needs rewriting. The current one promises "pay back in the first year", which no longer appears anywhere on the page and is a stronger claim than the v4 copy makes. Propose a replacement under 155 characters and flag it for approval rather than choosing silently.

---

### Section 2. Different industries. Same knots.

**Heading**

> Different industries. Same knots.

**Three quote blocks.** Each is a quote plus an attribution line. Order matters: they map to where the buyer is, not to industries.

> **“We know we should be doing something. We don’t know what.”**
> An accounting practice. AI on every partner meeting agenda. Nobody owns the next step.

> **“Every vendor promises we’ll save hours. None of them will put a dollar on it.”**
> A property management principal who stopped taking demos until someone shows working, not slides.

> **“We bought something last year. I honestly couldn’t tell you what it’s done for us.”**
> A recruitment agency paying for a tool nobody’s quite sure how to evaluate.

**Closing line**, its own element, visually distinct from the attributions:

> Three different stages. Same missing piece: **nobody doing the maths gets paid if the answer is no.**

The bolded clause carries the emphasis. Do not bold the whole line.

---

### Section 3. What you get

**Heading**

> What you get

**Two groups.** Note the group names have changed from "The Assessment" and "The Build".

**Assessment**

- Every opportunity where AI saves money in your workflows
- Two opportunities per workflow, on average
- We tell you if an opportunity won’t pay back
- We tell you if a pain point isn’t a technology problem
- Readiness assessed and blockers surfaced before you spend
- Estimated recoverable cost on each opportunity
- We prove our maths and show the working

**Implementation**

- Step-by-step roadmap from design to development to delivery
- Predicted ROI on each build
- Built to meet applicable laws and professional obligations
- Built to scale responsibly
- Built to fit how your team already works
- Built so your team actually uses it
- A governance framework covering security, oversight and upkeep
- Every data flow handled under the Australian Privacy Act

**Removed from this section:** the `verticalsLead` and `verticals` data move out to §4. The `readMore` link to `/what-we-do` is not in the v4 copy. Ask before deleting it, since `/what-we-do` still exists as a page and would lose its inbound link from the homepage.

---

### Section 4. Industries we specialise in

**Heading**

> Industries we specialise in

**Body**

> **Professional services:** accounting, consulting, medical clinics, recruitment, marketing, engineering, architecture.
>
> **Property:** property management and strata.
>
> Two industries, on purpose. The workflows repeat inside them. We already know what a BAS quarter does to a practice and what compliance scheduling costs a rent roll. A generalist works that out on your time.

Colons after the group names, not dashes. Members stay as running text, not a tile grid: `DESIGN.md` §09 is explicit that a flat grid reads as *we’ll take anyone*.

---

### Section 5. What it costs

**Heading**

> What it costs

**Sub-heading**

> Assessment

**Table.** Three columns, four rows.

| Workflows | Your team’s time | Price |
|---|---|---|
| 1 | 3 hours | $3,000 to $4,500 |
| 2 | 4 hours | $4,500 to $6,500 |
| 3 | 6 hours | $6,000 to $9,000 |
| 4 | 8 hours | $7,500 to $12,000 |

Ranges read "to", not an en dash. Dashes next to dollar figures are ambiguous.

**Below the table**

> Exact price and duration are set on the free Fit Call, before you sign anything.

**Then**

> **Build:** quoted separately.

**Check `DESIGN.md` before building the table.** If it has no table pattern, this is a new component type and the approach needs approval before it is written, not after.

---

### Section 6. Meet the founders

**Heading**

> Meet the founders

**Body:** the two founder cards, nothing else. Name, title, email, phone. All four values from `SITE.founders`.

Names take a comma, not a dash: "Insiya Karbalai, Co-Founder & CEO".

**Removed:** the `lead` line ("Every Fit Call is taken by us. Every Assessment is run by us.") and the `readMore` link to `/about`.

**Flag when you reach this:** `index.astro`'s rhythm comment argues that the founders section is "the warranty on §2" because of that `lead` line. With the lead removed, that reasoning no longer holds and the spacing decision it justified should be re-examined rather than carried forward unchanged.

---

### Section 7. How to get started

**Heading**

> How to get started

**Two numbered steps**

> 1. You book a free 30-minute Fit Call. No AI knowledge needed, no homework.
> 2. You leave knowing what one of your workflows costs you, what an assessment would cost and how long it takes.

**CTA**

> Label: `Book a free Fit Call`

No sub-label under this one. The hero's CTA carries the sub-label; this one does not.

**Note:** the existing comment in `homepage.ts` argues these should not be numbered, because "numbering two things implies a process that does not exist". The client has supplied them numbered. Follow the client. Update or delete the comment so the file does not contradict the code.

---

### Section 8. Footer

> **AI Untangled.**
>
> support@knotless.com.au
> +61 416 588 531
>
> Privacy · Terms · LinkedIn
>
> © 2026 Knotless AI Pty Ltd · ABN 75 702 285 050

**The email change is not a one-line edit.** `SITE.contactEmail` is currently `hello@knotless.com.au` and is read by more than the footer. Before changing it:

1. Grep for every consumer of `contactEmail`.
2. Check `src/legal/privacy-policy.md` and `src/legal/terms-of-use.md`. Both cite a contact address. If they hardcode `hello@`, changing `site.ts` alone leaves the legal pages disagreeing with the footer.
3. Report what you find and ask before changing. Whether `hello@` stays live as an alias is a business decision, not a code one.

---

## 5. CTA routing

Every `Book a free Fit Call` currently routes to `/contact`, which is a form promising a reply within one business day.

**Recommendation on record:** point these at a live calendar instead. A day of latency sits in front of a call the visitor has already decided to take.

**No calendar URL has been supplied.** Keep `/contact` until one is. Do not invent a booking URL.

---

## 6. Suggested commit sequence

One logical change per commit. Content and layout are separate commits.

1. `docs:` amend `DESIGN.md` §11.15 and record the deviation in §10. *(Only if that is the decision from §1 above.)*
2. `feat:` rewrite `src/data/homepage.ts` with all v4 copy, including new exports for §2, §4 and §5.
3. `feat:` new component for §2.
4. `refactor:` move verticals out of `WhatYouGetSection` into a new §4 component.
5. `feat:` new component for §5, including the table.
6. `refactor:` reduce `FoundersSection` to cards only.
7. `feat:` update `HeroSection`, `WhatYouGetSection`, `GetStartedSection` to the new copy.
8. `feat:` wire all seven sections into `index.astro`, rewrite the rhythm comment.
9. `fix:` the contact email change, once §8 above has been answered.

---

## 7. Acceptance checklist

- [ ] The negation-budget decision in §1 is made and recorded before any content commit
- [ ] All seven sections render in order at 1440px and at 390px, both screenshotted and looked at
- [ ] No em dash anywhere in `src/data/homepage.ts`
- [ ] Curly apostrophes throughout
- [ ] "specialise", not "specialize"
- [ ] Every founder value reads from `SITE.founders`, none hardcoded
- [ ] No copy inline in any component
- [ ] `npm run check` returns 0 errors
- [ ] Nothing from `DESIGN.md` §11 appears in the diff
- [ ] Meta description replaced and approved, not silently carried over
- [ ] Contact email question answered before `site.ts` is touched
- [ ] `index.astro` rhythm comment describes the page that now exists
- [ ] Comments in `homepage.ts` that contradict the new copy are updated or deleted
- [ ] Not committed to `main`

---

## 8. Open questions to raise, not to decide

1. The negation budget. Blocking, see §1.
2. Whether the `/what-we-do` link survives its removal from §3.
3. Whether `hello@` stays live as an alias once the footer moves to `support@`.
4. Whether a booking calendar replaces `/contact`, and at what URL.
5. The meta description replacement.
6. Section 2 opens "Different industries. Same knots." and section 4 is titled "Industries we specialise in." The word carries twice in one scroll. Cosmetic, worth a look once laid out.

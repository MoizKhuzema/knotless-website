# Knotless AI — Final-stage critical audit

**Date:** 26 June 2026
**Scope:** Full site (homepage + /what-we-do), desktop / iPad / mobile (iOS + Android), judged on aesthetics, professionalism, customer fit, brand-fit, and competitive standing.
**Stance:** Deliberately critical and non-optimistic. This is the pre-launch review; the job is to find what's wrong, not to reassure.

> **Headline verdict:** The site *looks* like a finished, premium product and *behaves* like an unfinished draft. The craft is genuinely good — but the single most important thing a marketing site must do (get the visitor to book the call) is **completely broken**, and the trust the brand is built on is **actively undermined by placeholder data shipping in production**. As it stands this is **not launchable**. The good news: almost every blocker is a content/wiring fix, not a redesign.

---

## 0. Method & evidence

- Built and previewed the production build locally; captured full-page screenshots at desktop (1440), iPad portrait (768) + landscape (1024), and mobile (390/412) under both iOS Safari and Android Chrome user agents.
- Probed routing, console errors, internal links, and colour contrast programmatically.
- Competitor landscape researched via web search across **35+ firms** (direct AI competitors + the AU web-design/boutique-consulting "design bar") plus design/trust best-practice sources. **Caveat:** competitor *websites could not be directly opened* (egress policy returned 403 on every external URL), so competitor **visual/motion/mobile** comments are inference from brand tier and quoted copy, not first-hand inspection. Positioning, pricing, proof, and awards claims are reasonably reliable (often quoted verbatim in results). Cited statistics come largely from secondary marketing/research summaries — directional, attributed, not independently verified. The Knotless site itself *was* inspected directly.

---

## 1. Who the customer is (extracted from the brand & copy)

From `src/data/homepage.ts`, `src/data/whatWeDo.ts`, `src/config/site.ts`:

- **Buyer:** owners / partners / principals of **growing Australian professional-services firms, 10–200 staff** — accounting & bookkeeping, consulting, recruitment, marketing & digital agencies, engineering, architecture & design, property management, strata.
- **Mindset (from the vignettes):** AI-curious but **burned, skeptical, and risk-averse**. "Every vendor promises we'll save hours. None will put a dollar on it." "If the AI gets it wrong, it's still our name on the drawings." They distrust hype and demos; they care about ROI, professional liability, compliance, and dealing with accountable humans.
- **Brand pillars (as expressed):**
  1. **Honesty / no-hype** — "If the answer is 'not yet,' we say so." Quantify value in *dollars*, build *only what pays back*.
  2. **Clarity / simplicity** — "AI Untangled." "AI is complicated. Knotless isn't." One product, one entry point.
  3. **Founder-led accountability** — "Every Fit Call is taken by us… No handovers. No account managers."
  4. **Rigour & trust / compliance** — Australian Privacy Act; "we're the firm that checks AI for a living; we hold our own work to the standard we audit against."
- **The site's single goal:** get the visitor to **book a free Fit Call**. Every primary CTA points there.

This persona is the most skeptical buyer in the market. **The margin for "looks unfinished" is zero** — for this audience, a visible placeholder isn't a typo, it's disqualifying.

---

## 2. Competitor landscape (Australian mid-market AI consulting)

### The bar this market sets
| Dimension | The bar competitors have set |
|---|---|
| **Positioning** | One concrete sentence: who it's for + the outcome + a proof-of-honesty (neutral / fixed-price / no lock-in). |
| **Proof** | ≥3 **named, quantified** case studies — hours and dollars saved, named tools. |
| **Pricing** | A **specific number visible before the call.** |
| **Process** | A named 3-step ladder with a **weeks timeline** and an ownership/handover promise. |
| **Trust** | Named founder/team (faces) + AU-owned + Privacy/sovereignty + (neutrality *or* partner badges). |
| **Conversion** | Free front door (call **or** readiness quiz) → paid assessment → credited build, fed by editorial content. |

### Tier 1 — direct competitors (the buyer's actual shortlist)
- **Aivy (aivy.com.au) — the closest look-alike and biggest threat.** Melbourne AI agency for *established mid-market* firms; verticals incl. accounting/advisory, real estate, professional services; **Privacy Act + TPB framing**, fixed-scope quoted after a free call with "a clear payback line," 4–6 week delivery, **and an "honest guide" editorial engine** ("we'd rather tell you honestly whether you need an agency at all"). This is essentially Knotless's playbook already executing. *Weaker on: named logo'd case studies; "agency" reads less premium than "advisory"; service sprawl (adds SEO/GEO).*
- **Square AI (squareai.com.au) — the conversion bar.** **AI Business Assessment = $2,500** (written roadmap ranking top-3 opportunities by ROI in 5–7 days), **100% credited toward the build within 90 days.** "No hourly billing, no scope-creep invoices, no per-call surcharges." This maps *exactly* onto "the Knotless Assessment → the implementation that follows," but with a number on the page.
- **Works (workshq.com.au) — the pricing-transparency bar.** Audit→Optimise→Embed→Build with **published tiers** (audit from $4K; build $50–100K), "first ROI in 30–60 days," strong "you own all of it" handover story. (Tension: proprietary "Works Brain" cuts against vendor-neutrality.)
- **Osher Digital (osher.com.au) — the proof bar.** **Multiple named, quantified case studies** (recruitment: thousands of hours of manual entry into Bullhorn eliminated; medical practice referral automation; −80% manual effort). Recruitment + professional-services overlap with Knotless's ICP. (Weaker: tool-led "n8n consultants" identity.)
- **VibeZero, Edison AI, Ascend AI, Infraworx, Team 400, Square AI, AirStack** — round out the field. Common pattern among the weaker ones: **service/city/vertical sprawl** (VibeZero "32 services"; Infraworx/Team 400 programmatic page farms), **tool-led identity**, and **proof-by-adjective** ("leading," "trusted") with no named cases.

### Tier 2 — credibility-setters the buyer also gets pitched
- **Eliiza/Mantel, Red Marble, Arinco, SimplyAI** — the enterprise tier. Sets the **proof format**: named blue-chip clients, partner badges (UiPath Gold, Claude/OpenAI partner), data-sovereignty pages, and **time-boxed quantified case studies** (Arinco: 8,656 Copilot actions / 488 assisted hours in a 4-week window — *this is the case-study template to copy*).

### The white space (and the catch)
The genuinely defensible position almost nobody fully occupies: **vendor-neutral + premium editorial brand + a published assessment price credited to the build + named quantified proof + an explicit, evidenced "not yet" verdict.** Knotless's brand and voice already nail the first and last of these. **But Aivy already crowds most of this corner.** Differentiation has to be *sharper proof (named dollar-math cases), a cleaner published price-and-credit mechanic, and a harder "we'll tell you not to buy AI" stance* — not just "we're also honest."

### Negative example to weaponise, not imitate
"AI Consulting Group" leads with **"Avg 497% Project ROI"** — an unsubstantiated, too-precise hero stat. A no-hype brand wins by *implicitly contrasting* with this. Never publish a number that doesn't trace to a named case.

### The design bar (AU studios & boutique consultancies)
Separately benchmarked the *web-craft* bar (note: these sites couldn't be opened directly either — copy/awards/clients are reliable from search; visual specifics are inference). Two credibility models dominate the best AU sites, and Knotless currently has **neither**:
- **Craft/awards-led** — Humaan ("Australia's most awarded web design agency," full-bleed showreel, bespoke motion), Universal Favourite, For The People ("People deserve better brands," D&AD/AGDA pencils). Prove via portfolio + design awards.
- **Outcome/proof-led** — Chromatix ("websites that make your phone ring," 151+ Google reviews stacked), Luminary (UNICEF **+98% donations**), Inlight (TAC **+90% return visits**, Ingenia **+24% bookings**), Hardhat (Kogan case). Prove via hard numbers.
- **The domestic award circuits** that confer credibility here are the **Australian Web Awards (AWIA), Good Design Awards, AGDA** — a realistic path to third-party validation (most AU firms don't chase global Awwwards).
- **Boutique-consulting templates worth copying:** **Sentinel House** (sentinelhouse.com.au) — a Sydney strategy boutique using **serif display headings (Gelasio) + Inter body**, two above-the-fold **pill CTAs** ("Book a Strategic Review" / "Check Your R&D Eligibility"), scannable benefit cards — a near-perfect reference for a premium-but-warm advisory look (and a direct precedent for the type recommendation in H5/§6). **BC Strategy** wins on *proof-by-pedigree* (ex-McKinsey/BCG/Bain, ASX100/PE clients).
- **Recurring premium-consulting patterns** (consistent across AU professional-services design sources): serif/display headings + clean sans body; outcome-led heroes; **real team photos, never stock**; Google-rating badges + client logos; Problem→Solution→Result case studies; above-the-fold pill CTAs.

---

## 3. Site stress-test — what's broken, by severity

### 🔴 CRITICAL — launch blockers

**C1. The conversion path is dead. Every "Book a free Fit Call" CTA 404s.**
All primary CTAs route to `/contact` (`homepage.ts:27`, `whatWeDo.ts` intro + final CTA). **`/contact` does not exist** — only `index.astro` and `what-we-do.astro` build. Probed: `/contact/` → **404**. The site's *entire reason to exist* — booking the call — is unreachable from every button on every page and every viewport. This alone makes the site non-functional as a marketing instrument.

**C2. Half the navigation and both "read more" links are dead.**
Nav links to `/about` and `/contact` (`Nav.astro:17–19`) — both **404**. "Read more about us" (`FoundersSection`) → `/about` **404**. So 2 of 3 nav items and a key in-page link lead nowhere. Only `/what-we-do` resolves.

**C3. Footer legal links are dead.**
`/privacy`, `/terms`, `/contact` (`Footer.astro:20–22`) all **404**. For a brand whose pitch is Privacy-Act rigour, a dead **Privacy** link is especially damaging. (Australian buyers are documented to be unusually scam/breach-aware and to actively check a business is genuine — a dead Privacy/Terms link reads as a red flag, not an oversight.)

**C4. Placeholder business identity is shipping in production.**
The footer renders, verbatim and visible on **every page, every viewport**:
`Knotless AI Pty Ltd · ABN XX XXX XXX XXX` and `PLACEHOLDER address line, Adelaide SA 5000, Australia` (`site.ts:63–64`).
For a trust-and-compliance brand telling buyers "we hold our own work to the standard we audit against," literally printing the word **PLACEHOLDER** and a dummy ABN is a credibility self-inflicted wound. This is the first thing a skeptical buyer will screenshot. Note the **ABN is a specifically Australian trust marker** — a real, verifiable ABN + a genuine street address (not a PO box) are exactly what an AU buyer scans for; a dummy one is worse than none.

**C5. Placeholder / unconfirmed identity links.**
Company LinkedIn (`site.ts:67`) and both founder LinkedIn URLs (`/in/placeholder-insiya`, `/in/placeholder-huzefa`, `site.ts:74,79`) are placeholders. The footer LinkedIn icon currently links to an unverified company page.

**C6. No custom 404.** There's no `src/pages/404.astro`, so every dead link above dumps the visitor onto the host's generic 404 — off-brand and disorienting.

### 🟠 HIGH — credibility & competitive gaps

**H1. Founder headshots are empty circles.** `FoundersSection.astro:30` renders an empty bordered circle "placeholder for the headshot." On a site whose #3 pillar is "deal with the two real people whose names are on the door," showing **faceless outlines** directly contradicts the message. Visible on all viewports.

**H2. Zero proof. No case studies, testimonials, client names, numbers, or badges.** This is the **biggest competitive gap.** Osher, Arinco, Infraworx, SimplyAI all lead with named, quantified outcomes; the market's proof bar is ≥3 named cases. Knotless shows **none** — ironic for a firm whose entire pitch is "we quantify value in dollars." The skeptical persona ("none of them will put a dollar on it") is left with exactly zero dollars on the page. The research is unambiguous about how much this costs: case studies are the **single strongest B2B proof element** (~79% of buyers consider them essential; ~70% of the buying journey is independent research *before* contact) and **anonymous proof is actively distrusted** — for this AI-wary buyer, evidence must be specific, named, and numeric or it's discounted.

**H3. No price anywhere.** Square AI ($2,500 credited to build) and Works (published tiers) put a number on the page. Knotless says "one free call to scope it" but shows nothing. For a productised-assessment model this is a missed conversion lever and leaves Knotless looking *less* transparent than the competitors it out-classes on brand.

**H4. The site is two pages pretending to be a full site.** Nav and footer imply About / Contact / Privacy / Terms / What-we-do. Only What-we-do exists. Versus competitors' industry pages, insights libraries, and case-study sections, the actual surface area is thin — and the gaps are *advertised* by the dead links.

**H5. The all-Inter type system risks reading as "framework default" — the one look an AI-wary premium brand can least afford.** Design research is consistent: Inter is genuinely excellent for body/UI legibility, but as a *display/headline* face it "soon looks very generic or dull" and is the de-facto default of the Next.js/Vercel/SaaS world — to design-literate viewers (and increasingly to anyone), an all-Inter site reads as *templated / AI-generated*. For a buyer who is **specifically skeptical of AI**, that association quietly undercuts the "real humans, hand-crafted rigour" pillar. The brand's "Inter only" rule (`global.css`) trades distinctiveness for consistency; that's a legitimate brand call, but it should be a *conscious* one. **This does not require breaking the rule:** mitigate by pushing Inter's display expression so the headlines don't read as body-Inter scaled up — use **Inter Display / optical sizing (`opsz`)**, heavier display weights, tighter display tracking, and a wider size-contrast between H1 and body; or treat a distinctive headline face as a brand decision to revisit. (Your terracotta accent is already a real distinctiveness asset — the *isolation/Von-Restorff effect* — so the type is the remaining "sea of sameness" risk.)

### 🟡 MEDIUM — design / UX / craft

**M1. Desktop hero right half reads empty (minimalism failure mode).** On desktop the right ~40% of the hero holds a single thin hairline vertical line ending in a small downward arrow (`HeroVisual.astro`). The clever knot→arrow *animation* plays **once on load**; anyone who arrives mid-scroll, returns, or has reduced motion sees only a lone hairline arrow stranded in whitespace. It reads as "unfinished," not "intentional restraint." It's the weakest moment on an otherwise confident page.

**M2. The signature brand visual is desktop-only.** The knot is `hidden lg:flex` — so iPad portrait (768) **and every phone** never see the "AI Untangled" knot-untangle, the brand's one literal expression of its name. The mobile/iPad hero is all text with no visual anchor.

**M3. Key value is hidden behind clicks.** On `/what-we-do`, "What you get at each stage" and the FAQs are `<details>` accordions **collapsed by default**. The dollar-quantified deliverables — the most persuasive content for this buyer — are invisible to a skim-reader, who sees only three one-liners. Consider opening the first stage by default (or a teaser of the bullets).

**M4. Industries list wraps raggedly on desktop.** The hero verticals flow as inline wrapped text; "PROPERTY MANAGEMENT  STRATA" lands alone on a second line. Reads untidy under an otherwise precise hero. (Mobile single-column and iPad inline are fine.)

**M5. Mobile hero is heavy.** The 22px subhead (`text-lg`) runs to ~4 lines; with no visual and the long single-column industries list, the first screen is dense text. Acceptable, not crisp.

**M6. Open mobile menu crowds the hero.** The dropdown sits directly above the headline with no gap (the fixed nav grows but `BaseLayout` only offsets `pt-24`); it occludes correctly (cream bg) but feels tight.

### 🔵 LOW — hygiene

- **L1.** No `sitemap.xml` / `robots.txt` (no Astro sitemap integration). Minor SEO.
- **L2.** `warm-grey (#8A8580)` on cream = **3.02:1** contrast — fine for its decorative-only uses (hairlines, ghost numerals, icons) but right at the large-text/UI floor; never let it carry real body text. Ink (13.66) and terracotta (4.95) are solid.
- **L3.** Nav toggle tap target is ~40px (24px icon + `p-2`); bump to ≥44px for iOS guidelines.
- **L4.** Fixed nav has no `env(safe-area-inset-top)` padding — verify on notch/Dynamic-Island devices in landscape.
- **L5.** `site.ts` still carries unused `deliveryLocations` and several `TODO confirm` values.

*(Confirmed clean: no console/page errors; build succeeds; iPad portrait/landscape layouts are tidy; the recent mobile fixes to the /what-we-do vignettes and process strip render correctly.)*

---

## 4. Customer-perspective & brand-fit verdict

**Through the skeptical buyer's eyes, first 10 seconds:** The hero is genuinely strong — "AI that's worth building," restrained, premium, no stock-art hype. It signals "serious, grown-up firm." First impression: **above the category.**

**Then it falls apart on contact with detail:**
- They click "Book a free Fit Call" — the *one* thing the page asks them to do — and hit a **404**. Trust gone.
- They scroll to "the two real people whose names are on the door" and see **two empty circles**.
- They look for proof that AI "pays back in dollars" and find **no numbers, no clients, no cases** — the exact thing the copy mocks competitors for not providing.
- They glance at the footer and read the word **"PLACEHOLDER"** and a dummy **ABN**.

**Brand-pillar scorecard:**
| Pillar | Design/voice delivers? | Execution delivers? |
|---|---|---|
| Honesty / no-hype | ✅ Strong — voice is excellent | ⚠️ Undercut by *no dollars on the page* |
| Clarity / "Untangled" | ✅ Strong on desktop | ⚠️ Signature visual hidden on mobile/iPad |
| Founder-led accountability | ✅ Copy is great | ❌ Faceless circles; dead /about; placeholder LinkedIns |
| Rigour / trust / compliance | ✅ Claimed well | ❌ **PLACEHOLDER ABN/address; dead Privacy link** |
| **Goal: book the call** | — | ❌ **Impossible — /contact 404** |

**Verdict:** The brand *aesthetic* is a genuine asset — easily top-tier for this market and a real differentiator against the hype/sprawl crowd. But the site **fails its own brand test**: a firm selling rigour and trust is shipping placeholder data and broken links, and a firm whose only goal is the call has no working way to book it. The form is finished; the substance is not.

---

## 5. Standing vs competitors

| Dimension | Knotless today | vs market | Verdict |
|---|---|---|---|
| **Brand / aesthetics** | Premium editorial, restrained, no-hype | Ahead of the SEO-sprawl tier; at/above Aivy | ✅ **Genuine edge** (if finished) |
| **Voice / positioning** | "Quantify in dollars," "not yet," vendor-neutral | Best-articulated honesty in the set | ✅ **Strong** — but Aivy crowds it |
| **Proof / credibility** | None | Osher/Arinco/Infraworx have named, quantified cases | ❌ **Far behind — #1 gap** |
| **Pricing transparency** | Nothing shown | Square AI ($2,500 credited), Works (tiers) publish | ❌ **Behind** |
| **Conversion mechanics** | One CTA, **broken**; no quiz/lead magnet | Free quiz → paid assessment → credited build is standard | ❌ **Behind + broken** |
| **Trust signals** | Founder copy good; **faces/links/ABN missing** | Named team + AU-owned + Privacy is table stakes | ❌ **Behind on execution** |
| **Site depth** | 2 pages; 4 dead routes | Industry pages, insights, case libraries | ❌ **Thin** |
| **Compliance framing** | Privacy Act in copy | Recognised premium lever (Aivy, Red Marble) | ⚠️ **Good but not surfaced as a trust block** |

**Bottom line:** Knotless **wins on brand and voice and loses on everything that converts a skeptic** — proof, price, working funnel, finished trust details. Against Aivy specifically (same lane, further along), brand parity is not enough; Knotless needs **named dollar-math case studies, a published price-and-credit mechanic, and a harder "not yet" stance** to pull ahead. Right now a buyer comparing the two would find Aivy *complete* and Knotless *prettier but broken*.

---

## 6. Solutions — prioritised

### 🔴 Must fix before launch (all viewports)
1. **Unblock the funnel.** Build a real `/contact` with a working booking mechanism (embedded Calendly/Cal.com, or a form, or at minimum a `mailto:`), and point every "Book a free Fit Call" CTA at something that works. *Nothing else matters until this is done.*
2. **Resolve every dead route or remove the link.** Ship `/about`, `/privacy`, `/terms` (even minimal versions), or remove those nav/footer links until they exist. Don't advertise pages that 404.
3. **Purge all placeholder data from `site.ts`.** Real ABN, registered address, contact/privacy emails, company + founder LinkedIn URLs — or remove the lines that render them. No "PLACEHOLDER" string may reach production.
4. **Add real founder headshots** (the brand's "real people" promise). If photography isn't ready, use a *deliberately designed* non-photo treatment (e.g. monogram/initials in the brand style) so it reads finished, not empty.
5. **Add an on-brand `404.astro`** so mistyped/legacy links stay in the brand.

### 🟠 High (close the competitive gaps)
> Ranked by the evidence on what a skeptical B2B buyer needs before booking: **(1) named quantified case studies → (2) real named/faced team → (3) attributed testimonials → (4) visible pricing → (5) transparent methodology → (6) niche fit.** Knotless is missing 1–4 outright and has 5–6 only in prose.
6. **Add 3–5 named, quantified case studies** in the Arinco/Osher format: client (or tightly-described firm — "a 40-person recruitment agency"), vertical, the workflow, **hours and dollars**, tools used, and the honest "what we recommended *against*." Use Problem → Solution → quantified Result. This is the single fastest credibility win and directly answers the persona's "no one puts a dollar on it."
7. **Publish the Assessment price + credit-to-build mechanic** (match or beat Square AI's "$X, fully credited toward the build"). ~72% of B2B buyers expect to see pricing during evaluation; "contact us to find out" reads as friction. An anchor ("a typical 200-person firm pays ~$X") converts "it depends" into something usable and signals confidence.
8. **Add an explicit trust block + real proof furniture:** Privacy-Act / AU-data-residency statement, a one-line vendor-neutrality pledge, founder **photos** + LinkedIn, attributed testimonials (name/title/firm — never anonymous), and a restrained monochrome client-logo strip if any exist. Real team photos (never stock) recur as a top trust signal across the AU benchmark set.
9. **(Optional, high-ROI) Add a free "AI readiness" front door** (2-minute quiz or self-check) that funnels to the Fit Call — the market-standard top-of-funnel; consider two above-the-fold pill CTAs (primary "Book a Fit Call" + secondary "Check your AI readiness"), the pattern Sentinel House uses.

### 🖥 Desktop-specific
10. **Fix the empty hero right half (M1).** Either give the knot a strong, *persistent* resting state (larger, visibly knot-like, looping/scroll-triggered subtle motion so it survives mid-scroll arrival and reduced-motion) **or** rebalance the grid so the copy uses more width and the visual is clearly intentional. Today it reads unfinished.
11. **Tidy the industries wrap (M4)** — balance into an even multi-column grid or fixed columns so no orphan line.
12. **Surface accordion value (M3)** — open the first stage by default or show a one-line teaser of the deliverables.
12a. **Address the all-Inter "default" look (H5)** — within the "Inter only" rule: adopt **Inter Display + optical sizing** for headings, widen H1↔body size/weight contrast, tighten display tracking. If the rule is open to revisiting, a high-contrast serif display + Inter body is the proven premium-editorial pattern — **Sentinel House (Gelasio headings + Inter body) is a direct AU boutique-consulting precedent.** Run the **5-second test** on the hero (a stranger should answer *what/who/why* in 5s) and the **"does this look AI-generated?"** test — the terracotta accent already helps; the type is the remaining risk.

### 📱 iPad-specific
13. **Bring the signature visual to tablet (M2).** Lower the knot's breakpoint (or add a tablet-tuned static mark) so the "AI Untangled" moment isn't desktop-only. Verify portrait **and** landscape.
14. Re-check the 768 inline nav doesn't crowd the wordmark; confirm equal-height grids hold at 1024.

### 📲 Mobile-specific (iOS + Android)
15. **Give the mobile hero a visual anchor** (a static knot/brand mark) since the animation is hidden, and **tighten the subhead** (M5) to fewer lines.
16. **Add breathing room** between the open nav menu and the hero (M6).
17. **Bump the nav toggle tap target to ≥44px** (L3) and **add `env(safe-area-inset-top)`** padding to the fixed nav (L4); verify no 100vh jump on iOS.
18. *(Done this session: /what-we-do vignette compaction + process-strip breadcrumb — verified.)*

### 🔧 Cross-cutting hygiene
19. Add `@astrojs/sitemap` + `robots.txt`.
20. Keep `warm-grey` decorative-only (L2); remove unused `deliveryLocations` / resolve `TODO confirm`s (L5).

---

## 7. The one-paragraph summary for the founders

Your brand is the best thing here — the restraint, the voice, the no-hype editorial register genuinely beat most of the Australian field and stand level with your closest rival, Aivy. But this is a **final** review and the site is **not ready to ship**: the only action you ask for (book a Fit Call) leads to a 404, half your navigation is dead, and your footer literally prints "PLACEHOLDER" and a fake ABN under a brand that sells rigour and trust. Fix the broken funnel and the placeholder data first — that's a day or two of work and it's non-negotiable. Then win the comparison you'll actually lose today: **put dollars on the page** (named case studies + a published, credited Assessment price). Do those two things and you go from "prettier but broken" to the strongest, most credible offer in your category.

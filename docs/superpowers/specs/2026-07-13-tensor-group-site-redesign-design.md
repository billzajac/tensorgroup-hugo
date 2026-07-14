# Tensor Group — Site Redesign Design

**Date:** 2026-07-13
**Owner:** Billy Zajac (Tensor Group)
**Status:** Approved design — pending user review of this spec before implementation planning

## 1. Goal

Replace the dated 2017-era Hugo consulting site at https://tensor.group with a short, premium, single-page brochure that positions Tensor Group as a **software & systems architect who helps businesses and enterprises integrate AI into how they actually work — with governance and scale instincts most AI consultants lack.**

Success criteria:
- Reads as premium/senior (supports $500–$1000/hr advisory engagements) without stating rates.
- Very few words; skimmable in under 60 seconds.
- Accurately reflects real projects and pedigree (no invented specifics).
- Auto-deploys on `git push` exactly as today (Netlify watching GitHub), with no framework or build step.
- Mobile-first, accessible (WCAG-AA contrast), fast.

## 2. Positioning

Core narrative: **25 years making the right way the easy way — at NYSE and Disney scale — now applied to AI.**

Value prop (not "I know AI", but): *"I make AI safe for an enterprise to actually adopt, at scale."* Proof points: Disney self-service API-governance portal (trillions of requests/year) and OpenEscapement (his own open-source product: deterministic governance for AI usage).

Rates: **not shown.** Premium signaled through language, pedigree, and "selective engagements" framing.

Name on site: **brand-only "Tensor Group."** No personal name or photo. Copy is first-person ("I") so it reads as a real, senior operator.

## 3. Tech & Architecture

- **Hand-built static single page.** No framework, no build step, no dependencies.
  - `index.html` — semantic markup, all sections.
  - `styles.css` — design tokens (CSS custom properties) + layout + responsive.
  - `main.js` — hero tensor/vector-field animation (canvas or SVG) + scroll-reveal (IntersectionObserver). Progressive enhancement: site is fully readable with JS disabled.
  - `assets/` — logo (`tg-white-orange-logo-only.png`), self-hosted fonts (or Google Fonts link), favicon/OG image.
- **Fonts:** Space Grotesk (display) + Inter (body). Prefer self-hosted `woff2`; Google Fonts acceptable fallback.
- **Accessibility:** semantic landmarks, focus states, `prefers-reduced-motion` disables hero animation, contrast checked against AA.
- **Performance:** no render-blocking JS; images sized; single small CSS/JS payload.

### Repo & deploy
- Reuse existing repo **`billzajac/tensorgroup-hugo`** (already wired to Netlify site `sad-volhard-6934d2`).
- Update **`netlify.toml`** to `publish = "."` (or a `dist/` dir) with **no Hugo build command** — so push-to-GitHub auto-deploy keeps working with zero Netlify-UI changes (netlify.toml overrides UI settings).
- **Archive** old Hugo files (`content/`, `layouts/`, `themes/`, `hugo.toml`, `public/`, etc.) into `_hugo-archive/` — do not delete.
- **No pushing/deploying by the agent.** Build locally; user pushes when satisfied. (Per user's global rule: never commit/push without explicit ask.)

## 4. Page Structure (single scroll)

Dark theme (`#0A0B0D` bg), orange accent (`#F5931E`), white/gray text.

1. **Nav** — TG logo (left) · links: Work · Approach · Contact · "Get in touch" button (right). Sticky, condenses on scroll.
2. **Hero** — tensor/vector-field motif background (subtle, animated, reduced-motion-safe). Headline + one-line subhead + email CTA.
   - Draft headline: *"AI your enterprise can actually adopt."*
   - Draft subhead: *"Systems architecture and AI integration for teams that need it done right — and governed at scale."*
   - CTA: `mailto:info@tensor.group`.
3. **Trust bar** — *Trusted at scale:* **NYSE · Disney · Warner Bros** (tasteful text wordmarks, no third-party logos) + stats: *25+ years · trillions of API requests governed.*
4. **What I do** — 3 cards:
   - **AI Integration & Strategy** — integrate AI into real workflows, teams, and products.
   - **Systems & Software Architecture** — design and build systems that scale.
   - **AI Governance at Scale** — make the safe path the easy path for AI adoption.
5. **Selected work** — 4 cards (1–2 lines each):
   - **Warner Bros — Superman Experience** — Systems integration & show control for the immersive experience on the Warner Bros lot: unifying the games, hardware, and show systems, with operational dashboards and a nightly, terabyte-scale video render pipeline.
   - **Disney & Warner Bros — Enterprise Systems** — Many projects across operations, scaling, and emerging technology — including a self-service API-governance portal used by hundreds of engineers, governing trillions of API requests.
   - **OpenEscapement** *(own product, Apache-2.0)* — Deterministic governance for AI usage: ships an org's AI policy as versioned, signed rule packs into the files coding agents read — so teams, organizations, and enterprises can manage how AI is used for development. Forward-thinking infrastructure for the problem every company is about to hit.
   - **Komyun** *(own product)* — Ad-free community app; AI (Gemini) powers content moderation and in-app chat.
6. **About** (first person, brief) — 25 years making rules easier to follow than to break, at NYSE and Disney scale. Across Disney and Warner Bros, delivered many projects spanning operations, scaling, and emerging technology. Building with AI hands-on for 2+ years — started with Memory for Chimps, built RAG + vector search before agents were mainstream, now ships AI in production (Komyun) and builds infrastructure for AI governance itself (OpenEscapement — how teams and enterprises manage AI use for development).
7. **Contact** — large CTA; *email info@tensor.group*; "selective engagements" framing.
8. **Footer** — logo, © Tensor Group, minimal links.

Content is intentionally terse — every section earns its words.

## 5. Design Motif

The logo is a "TG" monogram inside a 3D cube with force vectors radiating out — the literal *tensor* (all forces on an entity). Carry this into:
- Hero animated vector field / wireframe cube.
- Orange vector/arrow accents on section dividers and card hovers.
- "Aligning the forces of AI adoption" as a subtle conceptual thread.

## 6. Deliverables

1. `index.html`, `styles.css`, `main.js`, `assets/` — the new site.
2. Updated `netlify.toml` for static publish.
3. `_hugo-archive/` containing the old site (moved, not deleted).
4. `CLAUDE.md` documenting: stack, file structure, local preview command, deploy pipeline, brand tokens (colors/fonts), and how to edit content.
5. A **design-team** skill review/polish pass on the built result (per user request to "use the design skill team").

## 7. Out of Scope (YAGNI)

- CMS, blog, multi-page, i18n.
- Contact form / booking widget (email CTA only).
- Analytics beyond what's trivially added later.
- Personal résumé/CV page.

## 8. Open Items

- None blocking. Headline/subhead copy is a draft and may be refined during build and the design-team pass.

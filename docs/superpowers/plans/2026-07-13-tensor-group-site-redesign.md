# Tensor Group Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended for this plan — the site is one cohesive design artifact best built by a single hand) or superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dated Hugo site with a short, premium, hand-built single-page brochure positioning Tensor Group for senior AI-integration/architecture advisory.

**Architecture:** Static `index.html` + `styles.css` + `main.js`, no framework, no build step. Reuses the existing `billzajac/tensorgroup-hugo` repo; `netlify.toml` switches to static publish so push-to-GitHub auto-deploy keeps working. Old Hugo files are archived (moved, not deleted).

**Tech Stack:** HTML5, modern CSS (custom properties, grid/flex, clamp), vanilla JS (canvas hero animation + IntersectionObserver scroll reveal). Fonts: Space Grotesk (display) + Inter (body). Netlify static deploy.

## Global Constraints

- Dark theme: background `#0A0B0D`; accent orange `#F5931E`; white/gray text. WCAG-AA contrast for all text.
- Brochure-terse copy; brand-only ("Tensor Group"), first-person "I"; **no rates shown**; no personal name/photo.
- No build step, no framework, no runtime dependencies. Site must be fully readable with JS disabled.
- `prefers-reduced-motion: reduce` disables hero animation.
- Primary CTA is `mailto:info@tensor.group`.
- Agent builds locally only — **never push, commit-on-request only, never deploy.**
- Reuse repo `/Users/billyz/code/tensorgroup/tensorgroup-hugo`. Old Hugo files moved to `_hugo-archive/`, never deleted.
- Copy must match the approved spec verbatim for project cards (see `docs/superpowers/specs/2026-07-13-tensor-group-site-redesign-design.md`).

---

### Task 1: Restructure repo — archive Hugo, switch Netlify to static

**Files:**
- Create dir: `_hugo-archive/`
- Move into archive: `content/`, `layouts/`, `themes/`, `hugo.toml`, `images.md`, `public/`, `.hugo_build.lock`
- Keep in place: `static/images/tg-white-orange-logo-only.png` (copy into new `assets/`), `.git`, `.gitignore`, `README.md`, `docs/`
- Modify: `netlify.toml`
- Create: `assets/` (with logo copied in)

- [ ] **Step 1: Archive Hugo source**
```bash
cd /Users/billyz/code/tensorgroup/tensorgroup-hugo
mkdir -p _hugo-archive assets
mv content layouts themes hugo.toml images.md public .hugo_build.lock _hugo-archive/ 2>/dev/null || true
cp static/images/tg-white-orange-logo-only.png assets/tg-logo.png
mv static _hugo-archive/static
```

- [ ] **Step 2: Rewrite `netlify.toml` for static publish**
```toml
[build]
publish = "."
command = "echo 'static site — no build step'"

[build.processing]
skip_processing = false

[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
```

- [ ] **Step 3: Add a `.gitignore` guard for archive noise (append)**
```bash
printf '\n# archived hugo build artifacts\n_hugo-archive/public/\n_hugo-archive/.hugo_build.lock\n' >> .gitignore
```

- [ ] **Step 4: Verify structure**
Run: `ls -la /Users/billyz/code/tensorgroup/tensorgroup-hugo`
Expected: `assets/`, `_hugo-archive/`, `netlify.toml`, `docs/`, no top-level `content/`/`hugo.toml`.

- [ ] **Step 5: Commit (only if user has asked to commit; otherwise skip)**
```bash
git add -A && git commit -m "chore: archive hugo site, switch netlify to static publish"
```

---

### Task 2: CSS foundation — reset, design tokens, typography, fonts

**Files:**
- Create: `styles.css`
- Create: `assets/fonts/` (self-hosted woff2 for Space Grotesk + Inter) OR use Google Fonts `<link>` in Task 3 (decide: Google Fonts link is acceptable per spec; prefer it for simplicity unless offline builds are required).

**Interfaces:**
- Produces: CSS custom properties consumed by all later styling — `--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--accent`, `--accent-dim`, `--border`, `--font-display`, `--font-body`, `--maxw`, spacing scale `--s-1..--s-8`.

- [ ] **Step 1: Write reset + tokens + base type in `styles.css`**
```css
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0B0D; --bg-elev:#111318; --fg:#F5F6F7; --fg-muted:#9AA0A8;
  --accent:#F5931E; --accent-dim:#B96E12; --border:#20242B;
  --font-display:"Space Grotesk",system-ui,sans-serif;
  --font-body:"Inter",system-ui,sans-serif;
  --maxw:1120px;
  --s-1:.5rem; --s-2:1rem; --s-3:1.5rem; --s-4:2rem; --s-5:3rem;
  --s-6:4rem; --s-7:6rem; --s-8:8rem;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font-body);
  line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
h1,h2,h3{font-family:var(--font-display);line-height:1.05;letter-spacing:-.02em;font-weight:600}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:var(--maxw);margin-inline:auto;padding-inline:var(--s-3)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
```

- [ ] **Step 2: Verify CSS parses**
Run: `python3 -c "print(open('/Users/billyz/code/tensorgroup/tensorgroup-hugo/styles.css').read().count('{')==open('/Users/billyz/code/tensorgroup/tensorgroup-hugo/styles.css').read().count('}'))"`
Expected: `True` (balanced braces — sanity only; full styling added in Task 4).

---

### Task 3: HTML skeleton + all content copy

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `styles.css` tokens/classes; `assets/tg-logo.png`; `main.js` (deferred).
- Produces: section IDs `#work`, `#approach`, `#contact` for nav anchors; `.reveal` class hooks for scroll animation; `#hero-canvas` for the animation.

- [ ] **Step 1: Write full `index.html`** with `<head>` (meta, OG tags, title "Tensor Group — AI Integration & Systems Architecture", Google Fonts links for Space Grotesk + Inter, favicon, `styles.css`, `main.js` deferred) and semantic `<body>` containing all sections below. Use the approved copy verbatim:
  - **Nav:** logo (`assets/tg-logo.png`, alt "Tensor Group") + links Work / Approach / Contact + "Get in touch" button (`mailto:info@tensor.group`).
  - **Hero:** `<canvas id="hero-canvas" aria-hidden="true">`; H1 "AI your enterprise can actually adopt."; subhead "Systems architecture and AI integration for teams that need it done right — and governed at scale."; CTA button email.
  - **Trust bar:** "Trusted at scale" · NYSE · Disney · Warner Bros (text wordmarks) · stats "25+ years" / "trillions of API requests governed".
  - **What I do** (3 cards): AI Integration & Strategy; Systems & Software Architecture; AI Governance at Scale — each with the one-line description from the spec.
  - **Selected work** (4 cards, spec copy verbatim): Warner Bros — Superman Experience; Disney & Warner Bros — Enterprise Systems; OpenEscapement; Komyun.
  - **About** (first person): spec paragraph verbatim.
  - **Contact:** heading + "selective engagements" line + large email CTA.
  - **Footer:** logo, "© Tensor Group".
  Add `class="reveal"` to each section's inner content wrapper.

- [ ] **Step 2: Validate HTML structure**
Run: `python3 -c "import html.parser,sys; 
class P(html.parser.HTMLParser):
 pass
P().feed(open('/Users/billyz/code/tensorgroup/tensorgroup-hugo/index.html').read()); print('parsed-ok')"`
Expected: `parsed-ok` (no parse exception).

- [ ] **Step 3: Verify required anchors/ids present**
Run: `grep -oE 'id=\"(work|approach|contact|hero-canvas)\"' /Users/billyz/code/tensorgroup/tensorgroup-hugo/index.html | sort -u`
Expected: all four ids listed.

---

### Task 4: Full section styling (nav, hero, trust, cards, about, contact, footer)

**Files:**
- Modify: `styles.css` (append component styles)

- [ ] **Step 1: Style nav** — sticky, translucent dark, blur backdrop; logo 32px; links `--fg-muted` → `--fg` on hover; "Get in touch" as orange-outline button that fills orange on hover; condense/shadow on scroll (JS toggles `.nav--scrolled` in Task 5).

- [ ] **Step 2: Style hero** — full-viewport min-height; canvas absolutely positioned behind content, `z-index:-1`, radial dark vignette overlay for text legibility; H1 `clamp(2.5rem,7vw,5.5rem)`; subhead `--fg-muted` max-width 46ch; CTA primary orange button.

- [ ] **Step 3: Style trust bar** — horizontal, wrap on mobile; wordmarks in `--fg-muted` uppercase letter-spaced; stats with orange numerals; thin `--border` top/bottom.

- [ ] **Step 4: Style card grids** — "What I do" 3-col and "Selected work" 2-col via `grid` with `minmax`, collapsing to 1-col under 720px; cards `--bg-elev`, `1px --border`, radius 14px, padding `--s-3`; on hover: border → `--accent`, subtle lift `translateY(-4px)`, an orange vector/arrow accent appears. Card title `--font-display`; product cards get a small orange "OWN PRODUCT" / license tag.

- [ ] **Step 5: Style about + contact + footer** — about single column max 62ch, generous top/bottom `--s-7`; contact centered, large H2, big email CTA; footer minimal, `--fg-muted`, small logo, top border.

- [ ] **Step 6: Section rhythm + `.reveal`** — vertical padding `--s-7` per section; `.reveal{opacity:0;transform:translateY(16px)}` and `.reveal.is-visible{opacity:1;transform:none;transition:opacity .6s,transform .6s}`; under reduced-motion, `.reveal{opacity:1;transform:none}`.

- [ ] **Step 7: Preview in browser**
```bash
cd /Users/billyz/code/tensorgroup/tensorgroup-hugo && python3 -m http.server 8765 &
```
Open `http://localhost:8765/` — confirm all sections render, dark theme, orange accents, cards laid out. Note issues; fix inline. Stop server when done (`kill %1`).

---

### Task 5: Hero animation + scroll reveal (`main.js`)

**Files:**
- Create: `main.js`

**Interfaces:**
- Consumes: `#hero-canvas`, `.reveal` elements, nav element.
- Produces: no exports; runs on `DOMContentLoaded`.

- [ ] **Step 1: Write `main.js`** with three IIFE-guarded features, all no-ops under `matchMedia('(prefers-reduced-motion: reduce)').matches`:
  1. **Tensor vector field on `#hero-canvas`** — a lightweight particle/vector animation on a resizing canvas: points drifting with orange (`#F5931E`) vectors/lines suggesting a wireframe cube's force field; capped particle count; `requestAnimationFrame`; pauses when tab hidden (`visibilitychange`) and when hero scrolled out of view (IntersectionObserver). Devicepixelratio-aware. Fails silently if no canvas/2d context.
  2. **Scroll reveal** — IntersectionObserver adds `.is-visible` to `.reveal` elements at 12% threshold, unobserve after.
  3. **Nav condense** — toggle `.nav--scrolled` on the nav when `window.scrollY > 24`.

- [ ] **Step 2: Verify JS syntax**
Run: `node --check /Users/billyz/code/tensorgroup/tensorgroup-hugo/main.js`
Expected: no output (valid). If `node` unavailable, load the page and check console for errors.

- [ ] **Step 3: Preview + interaction check**
Serve (as Task 4 Step 7). Confirm: hero animates smoothly, sections fade in on scroll, nav condenses. Then in devtools emulate `prefers-reduced-motion: reduce` and reload — confirm animation is off and all content is fully visible.

---

### Task 6: Responsive, accessibility, and asset polish

**Files:**
- Modify: `index.html` (favicon, OG image, meta), `styles.css` (media queries), add `assets/favicon.png`, `assets/og-image.png`

- [ ] **Step 1: Create favicon + OG image** from the logo:
```bash
cd /Users/billyz/code/tensorgroup/tensorgroup-hugo
sips -z 64 64 assets/tg-logo.png --out assets/favicon.png
sips -p 630 1200 assets/tg-logo.png --out assets/og-image.png 2>/dev/null || cp assets/tg-logo.png assets/og-image.png
```

- [ ] **Step 2: Mobile pass** — verify at 375px width (devtools): nav collapses gracefully (links wrap or a simple menu), hero type scales, all grids single-column, no horizontal scroll, tap targets ≥44px. Fix media queries inline.

- [ ] **Step 3: Accessibility pass** — confirm: one `<h1>`; landmarks (`<header><nav><main><footer>`); all images have `alt`; canvas `aria-hidden`; visible focus rings; color contrast of `--fg`/`--fg-muted` and orange-on-dark meets AA for their sizes (adjust `--fg-muted` toward lighter if any body text fails). Verify links are keyboard-navigable.

- [ ] **Step 4: Meta/OG check**
Run: `grep -E 'og:title|og:description|og:image|twitter:card|<title>' /Users/billyz/code/tensorgroup/tensorgroup-hugo/index.html`
Expected: all present and populated.

---

### Task 7: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write `CLAUDE.md`** documenting for future sessions:
  - What this is: Tensor Group marketing site, hand-built static single page.
  - Stack: HTML/CSS/vanilla JS, no build step, no dependencies.
  - File map: `index.html`, `styles.css`, `main.js`, `assets/`, `_hugo-archive/` (old site — do not resurrect), `docs/superpowers/` (spec + plan).
  - Local preview: `python3 -m http.server 8765` then open `http://localhost:8765/`.
  - Deploy: push to `billzajac/tensorgroup-hugo` → Netlify auto-builds (static publish, no build command) → https://tensor.group. Deploy config in `netlify.toml`.
  - Brand tokens: colors (`#0A0B0D`, `#F5931E`, etc.) and fonts (Space Grotesk / Inter) — reference the `:root` block in `styles.css` as source of truth.
  - How to edit content: sections are plain HTML in `index.html`; copy rules (brochure-terse, brand-only, no rates).
  - Constraints: keep it dependency-free; respect `prefers-reduced-motion`; never commit/push without the owner's ask.

- [ ] **Step 2: Verify**
Run: `test -f /Users/billyz/code/tensorgroup/tensorgroup-hugo/CLAUDE.md && echo present`
Expected: `present`.

---

### Task 8: Design-team polish pass + final verification

**Files:** any of `index.html`, `styles.css`, `main.js` as needed.

- [ ] **Step 1: Run the design-team skill** on the built site (screenshots + code) for a design review across UI/visual, hierarchy, typography, conversion, and accessibility. Capture concrete recommendations.

- [ ] **Step 2: Apply high-value recommendations inline** — prioritize hierarchy, spacing, type scale, contrast, and CTA prominence. Skip anything that adds a build step or dependency.

- [ ] **Step 3: Final full-site verification** — serve locally, walk every section at desktop (1280px) and mobile (375px), with motion on and reduced-motion on. Confirm: no console errors, no horizontal scroll, all links work (nav anchors + mailto), AA contrast holds. Produce a short verification note (what was checked + result).

- [ ] **Step 4: Hand off** — summarize what changed, how to preview, and the exact steps for the owner to deploy (commit + push), leaving the commit/push to the owner.

---

## Self-Review

**Spec coverage:** Positioning ✓ (hero/trust/about copy). Tech/no-build/static ✓ (Task 1–2). Repo reuse + netlify static + archive ✓ (Task 1). All 8 sections ✓ (Task 3–4). Tensor motif animation ✓ (Task 5). Fonts/tokens/dark+orange ✓ (Task 2,4). Accessibility/reduced-motion/responsive ✓ (Task 6). CLAUDE.md ✓ (Task 7). Design-team pass ✓ (Task 8). No-rates / brand-only / email CTA — enforced in Global Constraints and Task 3 copy. Project-card copy verbatim from spec ✓ (Task 3).

**Placeholder scan:** No TBD/TODO; each task carries concrete commands and copy source. Copy text itself lives in the spec (referenced verbatim) to avoid divergence.

**Type/name consistency:** CSS token names in Task 2 match usage in Task 4; ids `#hero-canvas/#work/#approach/#contact` and classes `.reveal/.is-visible/.nav--scrolled` are consistent across Tasks 3–6.

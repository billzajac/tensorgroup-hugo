# CLAUDE.md — Tensor Group site

Marketing site for **Tensor Group** (https://tensor.group), Billy Zajac's consulting
company. Positioning: a software & systems architect who helps businesses and enterprises
integrate AI into how they actually work — with governance and scale instincts. Premium,
brochure-style, single page.

## Stack

Hand-built **static single page**. No framework, no build step, no dependencies.

- `index.html` — all markup and copy (one page, semantic sections).
- `styles.css` — design tokens (`:root`) + all styling. Single stylesheet.
- `main.js` — progressive enhancement only: hero canvas animation, scroll-reveal, nav
  condense. The site is fully readable with JS disabled.
- `assets/` — logo, favicon, apple-touch icon, OG image.
- `_hugo-archive/` — the previous Hugo site. **Archived, do not resurrect or edit.**
- `docs/superpowers/` — the design spec and implementation plan for this rebuild.

Fonts are Google Fonts (Space Grotesk for display, Inter for body), loaded via `<link>`.

## Local preview

No build. Serve the folder and open it:

```bash
python3 -m http.server 8765
# then open http://localhost:8765/
```

(Opening `index.html` directly also works, but a server matches the deployed root-path
links like `/styles.css`.)

## Deploy

Push to GitHub → Netlify auto-deploys. **Nothing else to run.**

- Repo: `billzajac/tensorgroup-hugo` → Netlify site `sad-volhard-6934d2` → https://tensor.group
- `netlify.toml` publishes the repo root as-is (`publish = "."`, no build command) and sets
  security + cache headers. It overrides the Netlify UI build settings.
- The old build ran Hugo; that is gone. If a deploy ever tries to run Hugo, the stale setting
  is in the Netlify UI — `netlify.toml` should take precedence, so prefer fixing it there.

## Brand tokens

Source of truth is the `:root` block in `styles.css`. Key values:

- Background `#0A0B0D`, elevated surfaces `#111318` / `#161a21`
- Text `#F5F6F7`, muted `#A6ADB6`, dim `#6D747E`
- Accent orange `#F5931E` (from the logo), soft `#FFB454`
- Display font Space Grotesk, body font Inter
- Logo: `assets/tg-logo.png` (white + orange "TG" cube, built for dark backgrounds)

## Editing content

All copy lives in `index.html` as plain HTML — edit the relevant `<section>`. Sections in
order: nav, hero, trust bar, "What I do" (3 cards), "Selected work" (4 cards), about,
contact, footer.

Copy rules (keep the tone consistent):

- Brochure-terse. Every section earns its words. When in doubt, cut.
- Brand-only: it's "Tensor Group", written in first person ("I"). No personal name or photo.
- **No rates** on the site. Premium is signaled through language and pedigree.
- Primary CTA is always `mailto:info@tensor.group`.
- Project cards should stay factually accurate — don't invent specifics.

To add a work card, copy an existing `<article class="workcard">` block; add
`<span class="tag">…</span>` for a product/label chip.

## Constraints / conventions

- Keep it dependency-free and build-free. Don't add a framework or bundler.
- Respect `prefers-reduced-motion` — the hero animation and reveals must degrade to static.
- Keep content readable with JS disabled (the `.js`-gated `.reveal` pattern handles this;
  don't hide content behind JS-only styles).
- Maintain WCAG-AA contrast for text on the dark background.
- **Never commit or push without the owner's explicit ask.** Build and preview locally; the
  owner pushes when satisfied.

## Verifying visual changes

There's no Playwright MCP here, but headless Chrome screenshots work:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1280,900 \
  --screenshot=out.png "http://localhost:8765/"
```

Note: headless-new enforces a ~500px minimum viewport width, so shoot small-screen layouts
at width ≥ 500 to avoid false "overflow" cropping. Reveal sections are JS-gated, so a static
full-page screenshot needs JS running (scroll to trigger) or a temporary override.

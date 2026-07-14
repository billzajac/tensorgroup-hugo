# tensor.group

Marketing site for **Tensor Group** — https://tensor.group

Hand-built static single page. No framework, no build step, no dependencies.
See [`CLAUDE.md`](./CLAUDE.md) for stack, local preview, brand tokens, and deploy details.

## Tech

- Static HTML / CSS / vanilla JS (`index.html`, `styles.css`, `main.js`)
- Hosted on **Cloudflare Pages** (no build command; publishes the repo root)
- `_hugo-archive/` — the previous Hugo site, archived (do not resurrect)

## Local preview

```bash
python3 -m http.server 8765   # open http://localhost:8765/
```

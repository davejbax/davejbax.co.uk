# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for davejbax.co.uk. Astro static site with a retro terminal/code editor aesthetic, deployed to Cloudflare Pages.

## Build & Development Commands

```bash
npm install             # Install dependencies
npm run dev             # Local dev server (http://localhost:4321)
npm run build           # Production build (output: dist/)
npm run preview         # Preview production build locally
```

Node.js is managed via mise (see `mise.toml`). Run `eval "$(mise activate bash)"` to activate.

No test or lint commands are configured.

## Architecture

- **Framework**: Astro 6 with `@astrojs/cloudflare` adapter. Config in `astro.config.mjs`.
- **Layout**: Single layout in `src/layouts/Default.astro` — the retro terminal window chrome (header buttons, title bar, line numbers, sidebar nav).
- **Components**: `src/components/Nav.astro` — sidebar navigation with active-page highlighting and light/dark mode toggle.
- **Pages**: `src/pages/` — Astro components for each page (index, portfolio, about, contact).
- **Styling**: SCSS in `src/styles/`. Entry point `global.scss` imports `breakpoints.scss`, `window.scss`, and `nav.scss`. Imported as a global stylesheet by the layout.
- **Color toggle**: Inline `<script is:inline>` blocks in the layout handle flash-free dark/light mode via `localStorage` and a `color-alt` CSS class on `<html>`.
- **Static assets**: `public/img/` and `public/pdf/` — served at `/img/` and `/pdf/`.
- **Responsive breakpoints**: Defined in `src/styles/breakpoints.scss` (tablet: 768px, mobile: 480px).

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yaml`) builds and deploys to Cloudflare Pages on push to `master`. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. Wrangler config in `wrangler.jsonc`.

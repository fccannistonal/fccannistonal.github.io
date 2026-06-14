# First Christian Church Anniston Website

Source for the First Christian Church Anniston website at [fccanniston.com](https://fccanniston.com/).

This repo is a React 19 + TypeScript + Vite + Mantine site with GitHub Pages deployment and a Formspree-backed contact form. It is no longer a generic Mantine starter, although some starter-template files and component stories are still present in the repository.

## What this repo currently contains

- A multi-page church website with `Home`, `Staff`, `Outreach`, and `Contact` pages
- Shared site layout, header, and footer
- GitHub Pages SPA routing support with a generated `404.html`
- A contact form that posts to Formspree when `VITE_FORMSPREE_ENDPOINT` is configured
- Tests for the active site pages and church-specific components

## Current content status

The site structure is ready, but several pieces of content are still placeholders and should be replaced before launch or final handoff:

- Staff names, bios, and portraits
- Street address, phone number, and email
- Worship schedule details
- Podcast, Zoom, and online giving links
- Hero, gallery, and outreach photography

## Where to edit

Most of the real app lives under `src/`. If you are trying to update the deployed church site, start here:

- `src/content/churchContent.ts`: main content model for navigation, hero copy, welcome text, contact details, staff entries, outreach cards, and home-page action links
- `src/pages/*.tsx`: page composition for the live routes
- `src/components/church/*`: church-specific UI like the hero, page headers, content image blocks, and contact form
- `src/components/HeaderSimple/*` and `src/components/FooterSimple/*`: shared site chrome
- `src/lib/formConfig.ts`: reads `VITE_FORMSPREE_ENDPOINT`
- `src/lib/githubPages.ts`: restores SPA routes after GitHub Pages redirects
- `public/`: static assets

The repository still includes many Mantine demo components, stories, and tests from the original starter. Those are useful for reference, but they are not the main source of truth for the live church site.

## Routes

- `/`
- `/staff`
- `/outreach`
- `/contact`

## Local development

Use the Node version from `.nvmrc` and use `npm` for installs and CI-aligned workflow.

```bash
nvm use
npm ci
npm run dev
```

If you want the contact form to submit successfully, add a local env file first:

```bash
cp .env.example .env.local
```

To work on Storybook:

```bash
npm run storybook
```

## Quality checks

Fast checks while iterating:

```bash
npm run typecheck
npm run lint
npm run vitest
```

Full pre-merge gate:

```bash
npm run test
```

## Build and deployment

Production build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

That build currently does two things:

- writes the main production bundle to `dist/`
- writes an additional `/docs/`-based build to `docs/`

The repo also generates a GitHub Pages `404.html` fallback so client-side routes continue to work after direct navigation or refreshes.

GitHub Actions:

- `.github/workflows/npm_test.yml`: runs on pull requests and executes `npm ci`, `npm run build`, and `npm run test`
- `.github/workflows/deploy.yml`: runs on pushes to `main` or `master`, builds the site, uploads `dist`, and deploys to GitHub Pages

Because this repo includes a `CNAME` file, the production site is configured for the custom domain `fccanniston.com`.

## Environment

Example local environment file:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

## Stack

- React 19
- TypeScript
- Vite
- Mantine
- React Router
- Vitest
- Storybook
- ESLint + Stylelint + Prettier

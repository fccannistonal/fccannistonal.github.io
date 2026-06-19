# First Christian Church Anniston Website

Source for the First Christian Church Anniston website at [fccanniston.com](https://fccanniston.com/).

This repo is a React 19 + TypeScript + Vite + Mantine site with GitHub Pages deployment, a FormSubmit-backed contact form, Git-backed Markdown posts, and an optional Firebase-backed member portal.

## What this repo currently contains

- Fully localized English and Spanish routes with equivalent-page language switching
- Visitor, beliefs, staff, church-life, updates, contact, and privacy content
- Route-specific static HTML, metadata, social images, `hreflang`, sitemap, RSS/JSON feeds, Church structured data, article structured data, and Visit FAQ structured data
- Markdown church posts published at `/updates/:slug` and `/es/novedades/:slug`
- A Decap CMS entry point at `/admin` for Git-backed post editing
- Noindex member portal routes prepared for Firebase Auth and Firestore
- GitHub Pages deep-link support with a generated `404.html` and generated static pages for legacy redirects
- A contact form that sends submissions to the church inbox through FormSubmit
- Consent-gated analytics and click-to-load third-party embeds
- Responsive AVIF/WebP/JPEG photography generated from `source-images/`

## Current content status

Church leadership must complete the launch review in `CONTENT_REVIEW.md`. Spanish copy is a draft until a Spanish-speaking ministry leader approves it.

## Where to edit

Most of the real app lives under `src/`. If you are trying to update the deployed church site, start here:

- `src/content/churchContent.ts`: shared verified facts, links, and image assets
- `src/content/localizedContent.ts`: all website-owned English and Spanish copy
- `src/content/posts/*.md`: first-party Markdown posts with frontmatter
- `src/content/routeManifest.json`: localized routes and route metadata
- `src/pages/*.tsx`: page composition for the live routes
- `src/components/church/*`: church-specific UI like the hero, page headers, content image blocks, and contact form
- `src/components/HeaderSimple/*` and `src/components/FooterSimple/*`: shared site chrome
- `src/lib/formConfig.ts`: stores the church contact email and form submission endpoint
- `src/lib/githubPages.ts`: restores SPA routes after GitHub Pages redirects
- `src/lib/memberPortalFirebase.ts`: Firebase Auth and Firestore access for the member portal
- `firestore.rules`: member portal security rules
- `public/admin/config.yml`: Decap CMS configuration
- `cloudflare/decap-oauth-worker/`: GitHub OAuth proxy for Decap CMS
- `source-images/`: original photography used by the responsive-image build
- `public/images/brand/`: source icons and logo

## Routes

- `/`
- English: `/visit`, `/about`, `/about/membership-and-baptism`, `/about/recommended-reading`, `/staff`, `/community`, `/community/sunday-worship`, `/community/childrens-ministry`, `/community/hispanic-ministry`, `/community/service-and-outreach`, `/community/diversity-theater`, `/updates`, `/updates/:slug`, `/members`, `/members/directory`, `/members/giving-statements`, `/contact`, `/privacy`
- Spanish: `/es/visita`, `/es/acerca`, `/es/acerca/membresia-y-bautismo`, `/es/acerca/lecturas-recomendadas`, `/es/personal`, `/es/comunidad`, `/es/comunidad/adoracion-dominical`, `/es/comunidad/ministerio-infantil`, `/es/comunidad/ministerio-hispano`, `/es/comunidad/servicio-comunitario`, `/es/comunidad/teatro-diversidad`, `/es/novedades`, `/es/novedades/:slug`, `/es/miembros`, `/es/miembros/directorio`, `/es/miembros/comprobantes-de-donaciones`, `/es/contacto`, `/es/privacidad`

Legacy `/outreach`, `/diversity-theater`, `/es/outreach`, and `/es/teatro-diversidad`
URLs are generated as static redirect pages so old links do not return a GitHub Pages 404.

## Local development

Use the Node version from `.nvmrc` and use `npm` for installs and CI-aligned workflow.

```bash
nvm use
npm ci
npm run dev
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

This includes unit/accessibility tests, production build validation, Playwright browser tests, and a production dependency audit.

Post-deploy production smoke check:

```bash
npm run smoke:production
```

This fetches every public route and legacy redirect URL from `https://fccanniston.com` and verifies status, language, title, canonical metadata, social image metadata, and redirect-page integrity. Use `SMOKE_BASE_URL=https://example.com npm run smoke:production` to check another deployed base URL.

## Build and deployment

Production build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

The build writes only to `dist/`. It generates responsive images, localized static route documents, legacy redirect pages, sitemap and robots files, social imagery, and the GitHub Pages `404.html` fallback. Build validation fails if duplicate conflict-copy artifacts such as `index 2.html` are present in `dist`.

GitHub Actions:

- `.github/workflows/npm_test.yml`: runs the complete `npm run test` gate on pull requests
- `.github/workflows/deploy.yml`: runs on pushes to `main` or `master`, builds the site, uploads `dist`, and deploys to GitHub Pages

Because this repo includes a `CNAME` file, the production site is configured for the custom domain `fccanniston.com`.

## Contact form

The contact form posts to FormSubmit's AJAX endpoint and delivers submissions to
`fccannistonal@gmail.com`. FormSubmit requires a one-time email confirmation the first time the
form is used with this recipient address.

## Posts and CMS

Posts are plain Markdown, not MDX, so editors cannot ship arbitrary React or JavaScript through content. Each post in `src/content/posts/` needs frontmatter for `slug`, `locale`, `alternateSlug`, `title`, `description`, `publishedAt`, `author`, `tags`, and `draft`.

The build parses published posts, generates localized article routes, adds article structured data, writes sitemap entries, and emits:

- `/feed.xml`
- `/feed.json`
- `/es/feed.xml`
- `/es/feed.json`

The `/admin` route serves Decap CMS. Before production editorial use, replace the placeholder `base_url` in `public/admin/config.yml` with the deployed Cloudflare Worker URL and configure a GitHub OAuth app whose callback URL is the worker `/callback` endpoint. The worker source lives in `cloudflare/decap-oauth-worker/`.

## Member portal

The member portal keeps the public shell on GitHub Pages and puts private state in Firebase Auth and Firestore. It is disabled until these public Vite env vars are present:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`VITE_FIREBASE_MEASUREMENT_ID` may also be present for the project, but the member portal does not initialize Firebase Analytics.

The first version uses passwordless email-link sign-in, approved access records in `memberAccess/{uid}`, opt-in directory profiles in `directoryProfiles/{uid}`, and audit entries in `directoryAudit/{id}`. Firestore rules deny unauthenticated reads, allow pending users to manage their own request/profile draft, allow approved members to view only approved opt-in profiles, allow admins to approve/moderate access, and explicitly deny `taxDocuments/{document=**}`.

Giving statements remain a Tithely/church-office handoff. Do not upload, generate, or store tax PDFs in Firebase, GitHub, Cloudflare, or the generated `dist`.

## Stack

- React 19
- TypeScript
- Vite
- Mantine
- React Router
- Firebase Auth + Firestore
- Vitest
- Storybook
- ESLint + Stylelint + Prettier

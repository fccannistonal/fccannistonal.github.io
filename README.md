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
- English public site: `/visit`, `/about`, `/about/membership-and-baptism`, `/about/recommended-reading`, `/staff`, `/community`, `/community/sunday-worship`, `/community/childrens-ministry`, `/community/hispanic-ministry`, `/community/service-and-outreach`, `/community/diversity-theater`, `/updates`, `/updates/:slug`, `/contact`, `/privacy`
- English member portal: `/members`, `/members/profile`, `/members/directory`, `/members/groups`, `/members/groups/:groupId`, `/members/calendar`, `/members/updates`, `/members/admin`, `/members/giving-statements`
- Spanish member portal: `/es/miembros`, `/es/miembros/perfil`, `/es/miembros/directorio`, `/es/miembros/grupos`, `/es/miembros/grupos/:groupId`, `/es/miembros/calendario`, `/es/miembros/novedades`, `/es/miembros/administracion`, `/es/miembros/comprobantes-de-donaciones`
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
VITE_photoBucket_WORKER_URL=https://fccphotos.fccannistonal.workers.dev
```

`VITE_FIREBASE_MEASUREMENT_ID` may also be present for the project, but the member portal does not initialize Firebase Analytics.

The member area uses passwordless email-link account creation and sign-in. A first-time user receives an `onboarding` account that can edit only its own private profile. From that profile the user may request member-area access, which changes the account to `pending`; only staff approval changes it to `approved` and unlocks the directory, groups, calendar, updates, photos, and member resources. This trusted-community access is separate from formal church membership.

Firestore stores account lifecycle records, private profiles, redacted opt-in directory entries, groups and role-separated memberships, events, announcements, deletion requests, avatar metadata, and immutable audit records. Firestore Rules—not the React UI—enforce every status transition, global and group roles, directory redaction, and protected moderation fields. New requests are also sent best-effort to the existing church inbox through FormSubmit; the administrator queue remains the source of truth and approval decisions are shown in the app rather than emailed.

The first administrator must be assigned manually in Firebase Console by setting an approved `memberAccess/{uid}` document's `role` to `admin`. Portal administrators may manage other administrators but cannot change their own global role.

Before releasing the onboarding UI, update the Firebase Authentication email-link template in Firebase Console to describe the action as “Create or sign in to your member area account.” This is a no-cost configuration change and prevents first-time users from being told that they already need a registered account.

Legacy `revoked` access records are treated as `deactivated`. Existing opt-in directory profiles are projected into the safer redacted directory collection the next time an approved member loads or saves their profile.

### Portal caching and request control

The portal enables Firestore's persistent browser cache and keeps mapped query results in a Firebase-UID-scoped local cache. Concurrent identical loads are deduplicated, expired data may be used for up to 24 hours when the network is unavailable, and writes invalidate the affected cache namespaces.

- Access status: 30 seconds.
- Admin member/photo queues: 1 minute.
- Profiles and group lists: 10 minutes.
- Directory pages: 15 minutes.
- Group members and updates: 5 minutes.
- Events: 10 minutes.
- Approved avatar blobs: 6 hours; pending avatars: 2 minutes.

Signing out or deleting an Auth account clears local portal records, Firestore persistence when available, object URLs, and the authenticated avatar Cache Storage. Cache keys are never shared between Firebase UIDs.

### Private profile photo Worker

The deployable Worker is in `cloudflare/fccphotos-worker/`. It uses the existing Worker name `fccphotos`, private R2 bucket `fccannistonmembers`, and binding `photoBucket`. The production Worker remains on `workers.dev`; it does not host the website and requires no DNS changes.

```bash
npm run worker:dev
npm run worker:deploy
```

The Worker verifies Firebase ID-token signatures and status/role data before every photo operation, then uses the caller's ID token for Firestore REST writes so Firestore Rules remain authoritative. It contains no Firebase service account, Cloudflare API token, R2 credentials, or frontend secret. Production CORS permits only the church domains and GitHub Pages fallback; local origins belong only in `.dev.vars` copied from `.dev.vars.example`.

Deployment order is: deploy Firestore indexes and rules, deploy the Worker, verify `/health` and unauthorized rejection, then deploy the GitHub Pages build. The R2 bucket must remain private.

```bash
npm run firebase:deploy
npm run worker:deploy
curl https://fccphotos.fccannistonal.workers.dev/health
```

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

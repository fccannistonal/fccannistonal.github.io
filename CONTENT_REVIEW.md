# Church Launch Review

The implementation is ready for technical review. Publication approval still requires church leadership to verify the ministry-specific content below.

## Required approvals

- [ ] A Spanish-speaking ministry leader has reviewed every Spanish page, navigation label, form message, accessibility label, and metadata field. Machine translation is not final copy.
- [ ] Service times and all cancellation or exception messaging are current.
- [ ] Parking, entrance, accessibility, dress, service-length, communion, and children’s-programming guidance accurately reflects the in-person experience.
- [ ] Disciples of Christ identity, open-and-affirming language, beliefs, communion language, and church history have pastoral approval.
- [ ] Staff names, roles, summaries, biographies, and photographs are current and approved.
- [ ] Address, phone, email, giving URL, social profiles, FormSubmit recipient, Spotify content, and map destination are correct.
- [ ] The privacy notice accurately reflects the church’s use of Google Analytics, FormSubmit, Google Maps, Spotify, Facebook, and Tithely.
- [ ] The Facebook Page Plugin renders the intended church page and fallback links work for visitors who block embeds or do not use Facebook.

## Release check

- [ ] Run `npm ci`.
- [ ] Run `npx playwright install chromium`.
- [ ] Run `npm run test`.
- [ ] Deploy through `.github/workflows/deploy.yml`.
- [ ] Verify deep links, redirects, caching, metadata, social previews, and third-party embeds on `https://fccanniston.com`.

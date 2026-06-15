import { describe, expect, it } from 'vitest';
import { findLegacyRedirect, legacyRedirects } from './legacy-redirects.mjs';

describe('legacy redirects', () => {
  it('defines the production legacy URLs that must not 404', () => {
    expect(legacyRedirects.map((redirect) => redirect.sourcePath)).toEqual([
      '/outreach',
      '/diversity-theater',
      '/es/outreach',
      '/es/teatro-diversidad',
    ]);
  });

  it('normalizes trailing slashes when matching legacy paths', () => {
    expect(findLegacyRedirect('/outreach/')?.destinationPath).toBe(
      '/community/service-and-outreach'
    );
    expect(findLegacyRedirect('/es/teatro-diversidad/')?.destinationPath).toBe(
      '/es/comunidad/teatro-diversidad'
    );
  });
});

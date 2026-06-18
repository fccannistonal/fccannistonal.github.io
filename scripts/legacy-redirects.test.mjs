import { describe, expect, it } from 'vitest';
import { findLegacyRedirect, legacyRedirects } from './legacy-redirects.mjs';

describe('legacy redirects', () => {
  it('defines the production legacy URLs that must not 404', () => {
    expect(legacyRedirects.map((redirect) => redirect.sourcePath)).toEqual([
      '/outreach',
      '/diversity-theater',
      '/community/worship-and-music',
      '/community/wonder-and-worship',
      '/es/outreach',
      '/es/teatro-diversidad',
      '/es/comunidad/adoracion-y-musica',
      '/es/comunidad/wonder-and-worship',
    ]);
  });

  it('normalizes trailing slashes when matching legacy paths', () => {
    expect(findLegacyRedirect('/outreach/')?.destinationPath).toBe(
      '/community/service-and-outreach'
    );
    expect(findLegacyRedirect('/es/teatro-diversidad/')?.destinationPath).toBe(
      '/es/comunidad/teatro-diversidad'
    );
    expect(findLegacyRedirect('/community/worship-and-music/')?.destinationPath).toBe(
      '/community/sunday-worship'
    );
    expect(findLegacyRedirect('/es/comunidad/wonder-and-worship/')?.destinationPath).toBe(
      '/es/comunidad/ministerio-infantil'
    );
  });
});

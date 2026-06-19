import { updatePageMetadata } from './pageMetadata';

describe('page metadata', () => {
  it('writes localized metadata, canonical URLs, and language alternates', () => {
    updatePageMetadata('/es/visita');

    expect(document.title).toBe('Planifique su visita | Primera Iglesia Cristiana de Anniston');
    expect(document.documentElement.lang).toBe('es');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      expect.stringMatching(/qué esperar el domingo/i)
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://fccanniston.com/es/visita'
    );
    expect(document.querySelector('link[hreflang="en"]')).toHaveAttribute(
      'href',
      'https://fccanniston.com/visit'
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://fccanniston.com/images/social/visit.jpg'
    );
    expect(document.querySelector('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'First Christian Church Anniston'
    );
    expect(document.querySelector('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      '1200'
    );
    expect(document.querySelector('meta[property="og:image:height"]')).toHaveAttribute(
      'content',
      '630'
    );
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      'Exterior de piedra de la Primera Iglesia Cristiana de Anniston al atardecer'
    );
    expect(document.querySelector('meta[property="og:locale:alternate"]')).toHaveAttribute(
      'content',
      'en_US'
    );
    expect(document.querySelector('meta[name="twitter:image:alt"]')).toHaveAttribute(
      'content',
      'Exterior de piedra de la Primera Iglesia Cristiana de Anniston al atardecer'
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow, max-image-preview:large'
    );
  });

  it('marks privacy and unknown pages as noindex', () => {
    updatePageMetadata('/privacy');

    expect(document.title).toBe('Privacy | First Christian Church Anniston');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow'
    );

    updatePageMetadata('/missing-page');

    expect(document.title).toBe('Page Not Found | First Christian Church Anniston');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow'
    );
  });
});

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
  });
});

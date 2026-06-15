import {
  getAlternateLocalePath,
  getCanonicalUrl,
  getLocaleFromPath,
  getLocalizedPath,
  getRouteInfo,
} from './routing';

describe('localized routing', () => {
  it('maps stable route identifiers to localized paths', () => {
    expect(getLocalizedPath('visit', 'en')).toBe('/visit');
    expect(getLocalizedPath('visit', 'es')).toBe('/es/visita');
    expect(getLocalizedPath('worshipAndMusic', 'en')).toBe('/community/worship-and-music');
    expect(getLocalizedPath('serviceAndOutreach', 'es')).toBe('/es/comunidad/servicio-comunitario');
    expect(getLocalizedPath('diversityTheater', 'es')).toBe('/es/comunidad/teatro-diversidad');
  });

  it('preserves equivalent pages across languages', () => {
    expect(getAlternateLocalePath('/contact')).toBe('/es/contacto');
    expect(getAlternateLocalePath('/es/contacto')).toBe('/contact');
    expect(getAlternateLocalePath('/community/hispanic-ministry')).toBe(
      '/es/comunidad/ministerio-hispano'
    );
  });

  it('normalizes trailing slashes and provides canonical URLs', () => {
    expect(getRouteInfo('/about/')?.id).toBe('about');
    expect(getLocaleFromPath('/es/acerca/')).toBe('es');
    expect(getCanonicalUrl('/updates')).toBe('https://fccanniston.com/updates');
  });
});

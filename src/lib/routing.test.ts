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
    expect(getLocalizedPath('membership', 'en')).toBe('/about/membership-and-baptism');
    expect(getLocalizedPath('recommendedReading', 'es')).toBe('/es/acerca/lecturas-recomendadas');
    expect(getLocalizedPath('worshipAndMusic', 'en')).toBe('/community/sunday-worship');
    expect(getLocalizedPath('wonderAndWorship', 'es')).toBe('/es/comunidad/ministerio-infantil');
    expect(getLocalizedPath('serviceAndOutreach', 'es')).toBe('/es/comunidad/servicio-comunitario');
    expect(getLocalizedPath('diversityTheater', 'es')).toBe('/es/comunidad/teatro-diversidad');
    expect(getLocalizedPath('members', 'en')).toBe('/members');
    expect(getLocalizedPath('memberDirectory', 'es')).toBe('/es/miembros/directorio');
  });

  it('preserves equivalent pages across languages', () => {
    expect(getAlternateLocalePath('/contact')).toBe('/es/contacto');
    expect(getAlternateLocalePath('/es/contacto')).toBe('/contact');
    expect(getAlternateLocalePath('/community/hispanic-ministry')).toBe(
      '/es/comunidad/ministerio-hispano'
    );
    expect(getAlternateLocalePath('/updates/welcome-to-first-christian-news')).toBe(
      '/es/novedades/bienvenidos-a-las-noticias-de-la-iglesia'
    );
  });

  it('normalizes trailing slashes and provides canonical URLs', () => {
    expect(getRouteInfo('/about/')?.id).toBe('about');
    expect(getRouteInfo('/updates/welcome-to-first-christian-news/')?.id).toBe('post');
    expect(getLocaleFromPath('/es/acerca/')).toBe('es');
    expect(getCanonicalUrl('/updates')).toBe('https://fccanniston.com/updates');
  });
});

import { act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@/test-utils';
import { getRedirectPathKey, restoreRedirectPath } from './lib/githubPages';
import { Router, routes } from './Router';

describe('Router', () => {
  it.each([
    ['/', /followers of Christ/i],
    ['/visit', /know what to expect/i],
    ['/about', /church shaped by Christ’s welcome/i],
    ['/staff', /meet the staff/i],
    ['/community', /faith takes shape in community/i],
    ['/community/sunday-worship', /sunday worship/i],
    ['/community/childrens-ministry', /children’s ministry/i],
    ['/community/hispanic-ministry', /hispanic ministry/i],
    ['/community/service-and-outreach', /service and outreach/i],
    ['/community/diversity-theater', /diversity theater company/i],
    ['/updates', /church news and announcements/i],
    ['/contact', /we would love to hear from you/i],
    ['/privacy', /clear choices about outside services/i],
    ['/es', /seguidores de Cristo/i],
    ['/es/visita', /sepa qué esperar/i],
    ['/es/acerca', /iglesia formada por la bienvenida/i],
    ['/es/personal', /conozca al personal/i],
    ['/es/comunidad', /la fe toma forma en comunidad/i],
    ['/es/comunidad/adoracion-dominical', /adoración dominical/i],
    ['/es/comunidad/ministerio-infantil', /ministerio infantil/i],
    ['/es/comunidad/ministerio-hispano', /ministerio hispano/i],
    ['/es/comunidad/servicio-comunitario', /servicio comunitario/i],
    ['/es/comunidad/teatro-diversidad', /compañía de teatro diversidad/i],
    ['/es/novedades', /noticias y anuncios/i],
    ['/es/contacto', /nos encantaría saber de usted/i],
    ['/es/privacidad', /opciones claras sobre servicios externos/i],
    ['/missing', /page not found/i],
  ])('renders %s', async (pathname, heading) => {
    const router = createMemoryRouter(routes, { initialEntries: [pathname] });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it.each([
    ['/outreach', '/community/service-and-outreach'],
    ['/diversity-theater', '/community/diversity-theater'],
    ['/community/worship-and-music', '/community/sunday-worship'],
    ['/community/wonder-and-worship', '/community/childrens-ministry'],
    ['/es/outreach', '/es/comunidad/servicio-comunitario'],
    ['/es/teatro-diversidad', '/es/comunidad/teatro-diversidad'],
    ['/es/comunidad/adoracion-y-musica', '/es/comunidad/adoracion-dominical'],
    ['/es/comunidad/wonder-and-worship', '/es/comunidad/ministerio-infantil'],
  ])('redirects %s to %s', async (source, destination) => {
    const router = createMemoryRouter(routes, { initialEntries: [source] });

    render(<RouterProvider router={router} />);

    await waitFor(() => expect(router.state.location.pathname).toBe(destination));
  });

  it('restores scroll and focuses the new heading after navigation', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(<RouterProvider router={router} />);
    await screen.findByRole('heading', { name: /followers of Christ/i });

    await act(async () => {
      await router.navigate('/staff');
    });

    const heading = await screen.findByRole('heading', { name: /meet the staff/i });
    await waitFor(() =>
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
    );
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it('renders a path restored by the GitHub Pages fallback on first load', async () => {
    window.history.replaceState(null, '', '/');
    window.sessionStorage.setItem(getRedirectPathKey(), '/staff');

    restoreRedirectPath();
    render(<Router />);

    expect(window.location.pathname).toBe('/staff');
    expect(await screen.findByRole('heading', { name: /meet the staff/i })).toBeInTheDocument();
  });

  it('updates localized metadata after navigation', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(document.title).toBe('First Christian Church Anniston');
      expect(document.documentElement.lang).toBe('en');
    });

    await act(async () => {
      await router.navigate('/es/contacto?source=staff');
    });

    await waitFor(() => {
      expect(document.title).toBe('Contacto | Primera Iglesia Cristiana de Anniston');
      expect(document.documentElement.lang).toBe('es');
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://fccanniston.com/es/contacto'
      );
    });
  });
});

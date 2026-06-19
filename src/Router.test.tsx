import { act } from '@testing-library/react';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@/test-utils';
import { RouteErrorFallback } from './components/church/RouteErrorFallback';
import { getRedirectPathKey, restoreRedirectPath } from './lib/githubPages';
import { Router, routes } from './Router';

describe('Router', () => {
  it.each([
    ['/', /followers of Christ/i],
    ['/visit', /know what to expect/i],
    ['/about', /welcome to first christian church/i],
    ['/about/membership-and-baptism', /membership and baptism/i],
    ['/about/recommended-reading', /recommended reading/i],
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
    ['/es/acerca', /bienvenido a first christian church/i],
    ['/es/acerca/membresia-y-bautismo', /membresía y bautismo/i],
    ['/es/acerca/lecturas-recomendadas', /lecturas recomendadas/i],
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

  it('renders a recovery path when a lazy route chunk is unavailable', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    function BrokenRoute(): never {
      throw new TypeError(
        'error loading dynamically imported module: https://fccanniston.com/assets/Staff.page-CL5ehnca.js'
      );
    }

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Outlet />,
          errorElement: <RouteErrorFallback />,
          children: [{ path: 'staff', element: <BrokenRoute /> }],
        },
      ],
      { initialEntries: ['/staff'] }
    );

    try {
      render(<RouterProvider router={router} />);

      expect(
        await screen.findByRole('heading', { name: /this page needs a quick refresh/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/site was updated while your browser/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /email the church/i })).toHaveAttribute(
        'href',
        'mailto:fccannistonal@gmail.com'
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('localizes the route error fallback from the current path', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    function BrokenRoute(): never {
      throw new Error('Unexpected render failure');
    }

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Outlet />,
          errorElement: <RouteErrorFallback />,
          children: [{ path: 'es/personal', element: <BrokenRoute /> }],
        },
      ],
      { initialEntries: ['/es/personal'] }
    );

    try {
      render(<RouterProvider router={router} />);

      expect(
        await screen.findByRole('heading', { name: /no pudimos cargar esta página/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /actualizar página/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ir al inicio/i })).toHaveAttribute('href', '/es');
    } finally {
      consoleError.mockRestore();
    }
  });
});

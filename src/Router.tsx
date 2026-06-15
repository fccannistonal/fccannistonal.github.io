import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  type RouteObject,
} from 'react-router-dom';
import { Center, Loader, VisuallyHidden } from '@mantine/core';
import { getShellContent } from './content/localizedShellContent';
import { SiteLayout } from './layout/SiteLayout';
import { useLocale } from './lib/i18n';
import { updatePageMetadata } from './lib/pageMetadata';
import { getLocalizedPath } from './lib/routing';

const HomePage = lazy(() =>
  import('./pages/Home.page').then((module) => ({ default: module.HomePage }))
);
const VisitPage = lazy(() =>
  import('./pages/Visit.page').then((module) => ({ default: module.VisitPage }))
);
const AboutPage = lazy(() =>
  import('./pages/About.page').then((module) => ({ default: module.AboutPage }))
);
const StaffPage = lazy(() =>
  import('./pages/Staff.page').then((module) => ({ default: module.StaffPage }))
);
const CommunityPage = lazy(() =>
  import('./pages/Community.page').then((module) => ({ default: module.CommunityPage }))
);
const WorshipAndMusicPage = lazy(() =>
  import('./pages/MinistryDetail.page').then((module) => ({
    default: module.WorshipAndMusicPage,
  }))
);
const WonderAndWorshipPage = lazy(() =>
  import('./pages/MinistryDetail.page').then((module) => ({
    default: module.WonderAndWorshipPage,
  }))
);
const HispanicMinistryPage = lazy(() =>
  import('./pages/MinistryDetail.page').then((module) => ({
    default: module.HispanicMinistryPage,
  }))
);
const ServiceAndOutreachPage = lazy(() =>
  import('./pages/MinistryDetail.page').then((module) => ({
    default: module.ServiceAndOutreachPage,
  }))
);
const DiversityTheaterPage = lazy(() =>
  import('./pages/DiversityTheater.page').then((module) => ({
    default: module.DiversityTheaterPage,
  }))
);
const UpdatesPage = lazy(() =>
  import('./pages/Updates.page').then((module) => ({ default: module.UpdatesPage }))
);
const ContactPage = lazy(() =>
  import('./pages/Contact.page').then((module) => ({ default: module.ContactPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/Privacy.page').then((module) => ({ default: module.PrivacyPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFound.page').then((module) => ({ default: module.NotFoundPage }))
);

function RouteEffects() {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);
  const currentHeading = useRef<HTMLElement | null>(null);

  useEffect(() => {
    updatePageMetadata(location.pathname);
    const isRouteNavigation =
      previousPath.current !== null && previousPath.current !== location.pathname;
    const previousHeading = currentHeading.current;
    previousPath.current = location.pathname;

    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        target?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });

    let focusFrame = 0;
    let observer: MutationObserver | null = null;
    let timeout = 0;

    const handleHeading = () => {
      const heading = document.querySelector<HTMLElement>('main h1');

      if (!heading) {
        return false;
      }

      if (!isRouteNavigation) {
        currentHeading.current = heading;
        return true;
      }

      if (heading === previousHeading || document.querySelector('[role="dialog"]')) {
        return false;
      }

      focusFrame = window.requestAnimationFrame(() => {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        currentHeading.current = heading;
      });
      return true;
    };

    if (!handleHeading()) {
      observer = new MutationObserver(() => {
        if (handleHeading()) {
          observer?.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      timeout = window.setTimeout(() => observer?.disconnect(), 3000);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [location.hash, location.pathname]);

  return null;
}

function RouteLoading() {
  const locale = useLocale();
  const content = getShellContent(locale);

  return (
    <Center mih="calc(100vh - var(--site-header-height))" role="status" aria-live="polite">
      <Loader color="brand" />
      <VisuallyHidden>{content.common.loadingPage}</VisuallyHidden>
    </Center>
  );
}

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<RouteLoading />}>{element}</Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <SiteLayout>
        <RouteEffects />
        <Outlet />
      </SiteLayout>
    ),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'visit', element: withSuspense(<VisitPage />) },
      { path: 'about', element: withSuspense(<AboutPage />) },
      { path: 'staff', element: withSuspense(<StaffPage />) },
      { path: 'community', element: withSuspense(<CommunityPage />) },
      {
        path: 'community/worship-and-music',
        element: withSuspense(<WorshipAndMusicPage />),
      },
      {
        path: 'community/wonder-and-worship',
        element: withSuspense(<WonderAndWorshipPage />),
      },
      {
        path: 'community/hispanic-ministry',
        element: withSuspense(<HispanicMinistryPage />),
      },
      {
        path: 'community/service-and-outreach',
        element: withSuspense(<ServiceAndOutreachPage />),
      },
      {
        path: 'community/diversity-theater',
        element: withSuspense(<DiversityTheaterPage />),
      },
      { path: 'updates', element: withSuspense(<UpdatesPage />) },
      { path: 'contact', element: withSuspense(<ContactPage />) },
      { path: 'privacy', element: withSuspense(<PrivacyPage />) },
      {
        path: 'outreach',
        element: <Navigate to={getLocalizedPath('serviceAndOutreach', 'en')} replace />,
      },
      {
        path: 'diversity-theater',
        element: <Navigate to={getLocalizedPath('diversityTheater', 'en')} replace />,
      },
      { path: 'es', element: withSuspense(<HomePage />) },
      { path: 'es/visita', element: withSuspense(<VisitPage />) },
      { path: 'es/acerca', element: withSuspense(<AboutPage />) },
      { path: 'es/personal', element: withSuspense(<StaffPage />) },
      { path: 'es/comunidad', element: withSuspense(<CommunityPage />) },
      {
        path: 'es/comunidad/adoracion-y-musica',
        element: withSuspense(<WorshipAndMusicPage />),
      },
      {
        path: 'es/comunidad/wonder-and-worship',
        element: withSuspense(<WonderAndWorshipPage />),
      },
      {
        path: 'es/comunidad/ministerio-hispano',
        element: withSuspense(<HispanicMinistryPage />),
      },
      {
        path: 'es/comunidad/servicio-comunitario',
        element: withSuspense(<ServiceAndOutreachPage />),
      },
      {
        path: 'es/comunidad/teatro-diversidad',
        element: withSuspense(<DiversityTheaterPage />),
      },
      { path: 'es/novedades', element: withSuspense(<UpdatesPage />) },
      { path: 'es/contacto', element: withSuspense(<ContactPage />) },
      { path: 'es/privacidad', element: withSuspense(<PrivacyPage />) },
      {
        path: 'es/outreach',
        element: <Navigate to={getLocalizedPath('serviceAndOutreach', 'es')} replace />,
      },
      {
        path: 'es/teatro-diversidad',
        element: <Navigate to={getLocalizedPath('diversityTheater', 'es')} replace />,
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
];

const routerBasename =
  import.meta.env.BASE_URL !== '/' && import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;

export function createAppRouter() {
  return createBrowserRouter(routes, {
    basename: routerBasename,
  });
}

export function Router() {
  const [router] = useState(createAppRouter);

  return <RouterProvider router={router} />;
}

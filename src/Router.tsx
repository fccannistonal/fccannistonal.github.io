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
import { RouteErrorFallback } from './components/church/RouteErrorFallback';
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
const MembershipPage = lazy(() =>
  import('./pages/Membership.page').then((module) => ({ default: module.MembershipPage }))
);
const RecommendedReadingPage = lazy(() =>
  import('./pages/RecommendedReading.page').then((module) => ({
    default: module.RecommendedReadingPage,
  }))
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
const PostPage = lazy(() =>
  import('./pages/Post.page').then((module) => ({ default: module.PostPage }))
);
const MembersPage = lazy(() =>
  import('./pages/Members.page').then((module) => ({ default: module.MembersPage }))
);
const MemberDirectoryPage = lazy(() =>
  import('./pages/Members.page').then((module) => ({ default: module.MemberDirectoryPage }))
);
const MemberGivingStatementsPage = lazy(() =>
  import('./pages/Members.page').then((module) => ({
    default: module.MemberGivingStatementsPage,
  }))
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

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <SiteLayout>
      <RouteEffects />
      {children}
    </SiteLayout>
  );
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <RootShell>
        <Outlet />
      </RootShell>
    ),
    errorElement: (
      <RootShell>
        <RouteErrorFallback />
      </RootShell>
    ),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'visit', element: withSuspense(<VisitPage />) },
      { path: 'about', element: withSuspense(<AboutPage />) },
      { path: 'about/membership-and-baptism', element: withSuspense(<MembershipPage />) },
      {
        path: 'about/recommended-reading',
        element: withSuspense(<RecommendedReadingPage />),
      },
      { path: 'staff', element: withSuspense(<StaffPage />) },
      { path: 'community', element: withSuspense(<CommunityPage />) },
      {
        path: 'community/sunday-worship',
        element: withSuspense(<WorshipAndMusicPage />),
      },
      {
        path: 'community/childrens-ministry',
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
      { path: 'updates/:slug', element: withSuspense(<PostPage />) },
      { path: 'members', element: withSuspense(<MembersPage />) },
      { path: 'members/directory', element: withSuspense(<MemberDirectoryPage />) },
      {
        path: 'members/giving-statements',
        element: withSuspense(<MemberGivingStatementsPage />),
      },
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
      {
        path: 'community/worship-and-music',
        element: <Navigate to={getLocalizedPath('worshipAndMusic', 'en')} replace />,
      },
      {
        path: 'community/wonder-and-worship',
        element: <Navigate to={getLocalizedPath('wonderAndWorship', 'en')} replace />,
      },
      { path: 'es', element: withSuspense(<HomePage />) },
      { path: 'es/visita', element: withSuspense(<VisitPage />) },
      { path: 'es/acerca', element: withSuspense(<AboutPage />) },
      { path: 'es/acerca/membresia-y-bautismo', element: withSuspense(<MembershipPage />) },
      {
        path: 'es/acerca/lecturas-recomendadas',
        element: withSuspense(<RecommendedReadingPage />),
      },
      { path: 'es/personal', element: withSuspense(<StaffPage />) },
      { path: 'es/comunidad', element: withSuspense(<CommunityPage />) },
      {
        path: 'es/comunidad/adoracion-dominical',
        element: withSuspense(<WorshipAndMusicPage />),
      },
      {
        path: 'es/comunidad/ministerio-infantil',
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
      { path: 'es/novedades/:slug', element: withSuspense(<PostPage />) },
      { path: 'es/miembros', element: withSuspense(<MembersPage />) },
      { path: 'es/miembros/directorio', element: withSuspense(<MemberDirectoryPage />) },
      {
        path: 'es/miembros/comprobantes-de-donaciones',
        element: withSuspense(<MemberGivingStatementsPage />),
      },
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
      {
        path: 'es/comunidad/adoracion-y-musica',
        element: <Navigate to={getLocalizedPath('worshipAndMusic', 'es')} replace />,
      },
      {
        path: 'es/comunidad/wonder-and-worship',
        element: <Navigate to={getLocalizedPath('wonderAndWorship', 'es')} replace />,
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

import { useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import { SiteLayout } from './layout/SiteLayout';
import { CommunityPage } from './pages/Community.page';
import { ContactPage } from './pages/Contact.page';
import { HomePage } from './pages/Home.page';
import { NotFoundPage } from './pages/NotFound.page';
import { StaffPage } from './pages/Staff.page';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'outreach', element: <Navigate to="/community" replace /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
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

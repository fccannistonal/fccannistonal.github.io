import { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from 'react-router-dom';
import { SiteLayout } from './layout/SiteLayout';
import { ContactPage } from './pages/Contact.page';
import { HomePage } from './pages/Home.page';
import { NotFoundPage } from './pages/NotFound.page';
import { OutreachPage } from './pages/Outreach.page';
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
      { path: 'outreach', element: <OutreachPage /> },
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

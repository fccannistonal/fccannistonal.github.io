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

const router = createBrowserRouter(routes);

export function Router() {
  return <RouterProvider router={router} />;
}

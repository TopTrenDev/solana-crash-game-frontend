import { Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Home from '@/pages/main/home';
import CrashGame from '@/pages/games/crash';
import Leaderboard from '@/pages/main/leader-board';
import NotFound from '@/pages/not-found';
import Settings from '@/pages/setting';
import HelpSupport from '@/pages/help-support';

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/leader-board',
          element: <Leaderboard />
        },
        {
          path: '/play',
          element: <CrashGame />
        },
        {
          path: '/settings',
          element: <Settings />
        },
        {
          path: '/help-support',
          element: <HelpSupport />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];
  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}

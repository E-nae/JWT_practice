import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthFind = Loadable(lazy(() => import('pages/authentication/FindPwd')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const PendingUser = Loadable(lazy(() => import('pages/authentication/Pending')));
const NoPermission = Loadable(lazy(() => import('components/NoPermission')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin />
    },
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/find/password/auth',
      element: <AuthFind />
    },
    {
      path: '/find/password/auth/req/:phone/:id/:key',
      element: <AuthFind />
    },
    {
      path: '*',
      element: <NoPermission />
    },
    {
      path: '/membership/join',
      element: <AuthRegister />
    },
    {
      path: '/pending',
      element: <PendingUser />
    }
  ]
};

export default LoginRoutes;

